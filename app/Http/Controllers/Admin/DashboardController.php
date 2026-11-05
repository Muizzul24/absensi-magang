<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPeserta = User::where('role', 'intern')->count();

        $hariIni = Attendance::with('user:id,name,institution')
            ->whereDate('date', today())
            ->orderBy('check_in')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total'   => $totalPeserta,
                'present' => $hariIni->count(),
                'late'    => $hariIni->where('status', 'late')->count(),
                'absent'  => max($totalPeserta - $hariIni->count(), 0),
            ],
            'today' => $hariIni,
        ]);
    }
}