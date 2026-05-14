<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = [
        'project_id',
        'work_date',
        'task_description',
        'hours',
        'minutes',
        'total_minutes'
    ];

    protected $appends = [
        'formatted_work_date'
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
}
