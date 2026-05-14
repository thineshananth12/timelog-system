<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveModel extends Model
{
    protected $table = 'leaves';

    protected $fillable = [
        'start_date',
        'end_date',
        'reason',
        'status',
        'user_id'
    ];
     protected $appends = [
        'formatted_start_date',
        'formatted_end_date'
    ];
    public function getFormattedStartDateAttribute()
    {
        return \Carbon\Carbon::parse(
            $this->start_date
        )->format('d-m-Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return \Carbon\Carbon::parse(
            $this->end_date
        )->format('d-m-Y');
    }
}
