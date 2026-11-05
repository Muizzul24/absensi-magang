<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InternController extends Controller
{
    // Daftar peserta + pencarian
    public function index(Request $request)
    {
        $interns = User::where('role', 'intern')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->withCount('attendances')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Interns/Index', [
            'interns' => $interns,
            'filters' => $request->only('search'),
        ]);
    }

    // Halaman form tambah
    public function create()
    {
        return Inertia::render('Admin/Interns/Form');
    }

    // Simpan peserta baru
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:8'],
            'institution' => ['nullable', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:30'],
        ]);

        User::create([
            'name'        => $data['name'],
            'email'       => $data['email'],
            'password'    => Hash::make($data['password']),
            'institution' => $data['institution'] ?? null,
            'phone'       => $data['phone'] ?? null,
            'role'        => 'intern',
        ]);

        return redirect()->route('admin.interns.index')
            ->with('success', 'Peserta berhasil ditambahkan.');
    }

    // Halaman form edit
    public function edit(User $intern)
    {
        abort_unless($intern->role === 'intern', 404);

        return Inertia::render('Admin/Interns/Form', [
            'intern' => $intern,
        ]);
    }

    // Simpan perubahan
    public function update(Request $request, User $intern)
    {
        abort_unless($intern->role === 'intern', 404);

        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', Rule::unique('users', 'email')->ignore($intern->id)],
            'password'    => ['nullable', 'string', 'min:8'],
            'institution' => ['nullable', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:30'],
        ]);

        $intern->name        = $data['name'];
        $intern->email       = $data['email'];
        $intern->institution = $data['institution'] ?? null;
        $intern->phone       = $data['phone'] ?? null;

        // Password hanya diganti kalau diisi
        if (!empty($data['password'])) {
            $intern->password = Hash::make($data['password']);
        }

        $intern->save();

        return redirect()->route('admin.interns.index')
            ->with('success', 'Data peserta berhasil diperbarui.');
    }

    // Hapus peserta
    public function destroy(User $intern)
    {
        abort_unless($intern->role === 'intern', 404);

        $intern->delete();

        return redirect()->route('admin.interns.index')
            ->with('success', 'Peserta berhasil dihapus.');
    }
}