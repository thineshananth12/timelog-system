<?php

namespace App\Services;

use App\Models\LeaveModel;

class LeaveService
{
    public function applyLeave(array $data)
    {
        return LeaveModel::create([
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'],
            'status' => 'pending',
        ]);
    }
}