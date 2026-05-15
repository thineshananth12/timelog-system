<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'work_date',
        'task_description',
        'hours',
        'minutes',
        'total_minutes'
    ];

    protected $appends = [
        'formatted_work_date',
        'formatted_time'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function getFormattedWorkDateAttribute()
    {
        return \Carbon\Carbon::parse(
            $this->work_date
        )->format('d-m-Y');
    }

    public function getFormattedTimeAttribute()
    {
        return
            str_pad($this->hours, 2, '0', STR_PAD_LEFT)
            . ':' .
            str_pad($this->minutes, 2, '0', STR_PAD_LEFT);
    }
}
