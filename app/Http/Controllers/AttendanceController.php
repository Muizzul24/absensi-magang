<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    // Menampilkan halaman absensi
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $today = Attendance::where('user_id', $userId)
            ->whereDate('date', today())
            ->first();

        $history = Attendance::where('user_id', $userId)
            ->orderByDesc('date')
            ->limit(30)
            ->get();

        return Inertia::render('Attendance/Index', [
            'today' => $today,
            'history' => $history,
        ]);
    }

    // Proses check-in
    public function checkIn(Request $request)
    {
        $now = now();

        $sudahAbsen = Attendance::where('user_id', $request->user()->id)
            ->whereDate('date', $now->toDateString())
            ->exists();

        if ($sudahAbsen) {
            return back()->withErrors(['message' => 'Kamu sudah check-in hari ini.']);
        }

        Attendance::create([
            'user_id'  => $request->user()->id,
            'date'     => $now->toDateString(),
            'check_in' => $now->format('H:i:s'),
            // lewat jam 08:00 dianggap terlambat
            'status'   => $now->format('H:i') > '08:00' ? 'late' : 'on_time',
        ]);

        return back()->with('success', 'Check-in berhasil!');
    }

    // Proses check-out
    public function checkOut(Request $request)
    {
        $attendance = Attendance::where('user_id', $request->user()->id)
            ->whereDate('date', today())
            ->first();

        if (!$attendance) {
            return back()->withErrors(['message' => 'Kamu belum check-in hari ini.']);
        }

        if ($attendance->check_out) {
            return back()->withErrors(['message' => 'Kamu sudah check-out hari ini.']);
        }

        $attendance->update(['check_out' => now()->format('H:i:s')]);

        return back()->with('success', 'Check-out berhasil!');
    }
}