<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Akun admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Peserta magang contoh
        $peserta = [
            ['Peserta Satu', 'peserta1@example.com', 'UPN Veteran Jawa Timur'],
            ['Peserta Dua', 'peserta2@example.com', 'Universitas Airlangga'],
            ['Peserta Tiga', 'peserta3@example.com', 'ITS Surabaya'],
        ];

        foreach ($peserta as [$nama, $email, $instansi]) {
            $user = User::create([
                'name' => $nama,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'intern',
                'institution' => $instansi,
            ]);

            // Data absensi 14 hari terakhir (hari kerja saja)
            for ($i = 1; $i <= 14; $i++) {
                $tanggal = Carbon::today()->subDays($i);

                if ($tanggal->isWeekend()) {
                    continue;
                }

                $terlambat = rand(1, 100) <= 25; // sekitar 25% terlambat
                $masuk = $terlambat
                    ? sprintf('08:%02d:00', rand(1, 45))
                    : sprintf('07:%02d:00', rand(30, 59));
                $pulang = sprintf('17:%02d:00', rand(0, 30));

                Attendance::create([
                    'user_id'   => $user->id,
                    'date'      => $tanggal->toDateString(),
                    'check_in'  => $masuk,
                    'check_out' => $pulang,
                    'status'    => $terlambat ? 'late' : 'on_time',
                ]);
            }
        }
    }
}