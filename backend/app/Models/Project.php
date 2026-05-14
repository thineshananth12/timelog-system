<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'code'
    ];

    public function timeLogs()
    {
        return $this->hasMany(TimeLog::class);
    }
}