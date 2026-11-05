<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    // Query dengan filter (dipakai halaman laporan & export)
    private function filteredQuery(Request $request)
    {
        return Attendance::with('user:id,name,institution')
            ->when($request->user_id, fn ($q, $v) => $q->where('user_id', $v))
            ->when($request->from, fn ($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($request->to, fn ($q, $v) => $q->whereDate('date', '<=', $v))
            ->orderByDesc('date')
            ->orderBy('check_in');
    }

    public function index(Request $request)
    {
        return Inertia::render('Admin/Reports', [
            'attendances' => $this->filteredQuery($request)->paginate(15)->withQueryString(),
            'interns'     => User::where('role', 'intern')->orderBy('name')->get(['id', 'name']),
            'filters'     => $request->only('user_id', 'from', 'to'),
        ]);
    }

    public function export(Request $request)
    {
        $rows = $this->filteredQuery($request)->get();

        return response()->streamDownload(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Tanggal', 'Nama', 'Instansi', 'Check-in', 'Check-out', 'Durasi', 'Status']);

            foreach ($rows as $row) {
                fputcsv($out, [
                    $row->date,
                    $row->user->name,
                    $row->user->institution,
                    $row->check_in,
                    $row->check_out,
                    $row->duration,
                    $row->status === 'late' ? 'Terlambat' : 'Tepat waktu',
                ]);
            }

            fclose($out);
        }, 'laporan-absensi.csv', ['Content-Type' => 'text/csv']);
    }
}