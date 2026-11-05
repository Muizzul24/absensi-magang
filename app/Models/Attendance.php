<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['user_id', 'date', 'check_in', 'check_out', 'status', 'note'];

    // Kolom tambahan yang ikut dikirim ke React
    protected $appends = ['duration'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getDurationAttribute()
    {
        if (!$this->check_in || !$this->check_out) {
            return null;
        }

        $menit = (int) Carbon::parse($this->check_in)
            ->diffInMinutes(Carbon::parse($this->check_out), true);

        return floor($menit / 60) . ' jam ' . ($menit % 60) . ' mnt';
    }
}