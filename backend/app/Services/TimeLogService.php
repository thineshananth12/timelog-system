<?php

namespace App\Services;

use App\Models\TimeLog;
use App\Models\LeaveModel;
use Illuminate\Support\Facades\Log;
use Auth;
class TimeLogService
{
    public function storeTimeLogs( array $tasks, string $workDate) {

         // ─── Leave Validation ───────────────────
        
        $leaveExists = LeaveModel::whereDate(
                'start_date',
                '<=',
                $workDate
            )
            ->where('user_id',Auth::user()->id)
            ->whereDate(
                'end_date',
                '>=',
                $workDate
            )
            ->exists();

        if ($leaveExists) {

            return [
                'success' => false,

                'message' =>
                    'Leave already applied for this date'
            ];
        }

        // ─── Existing Minutes ───────────────────

        $existingMinutes =
            TimeLog::whereDate(
                'work_date',
                $workDate
            )->where('user_id',Auth::user()->id)->sum('total_minutes');

        $newTotal = 0;

        // ─── Validate Tasks ─────────────────────

        foreach ($tasks as $task) {

            [$hours, $minutes] =
                explode(
                    ':',
                    $task['time_input']
                );

            $minutesTotal =
                ($hours * 60) + $minutes;

            // Single Task Limit

            if ($minutesTotal > 600) {

                return [
                    'success' => false,

                    'message' =>
                        'Single task cannot exceed 10 hours'
                ];
            }

            $newTotal += $minutesTotal;
        }

        // ─── Daily Limit ────────────────────────

        if (
            ($existingMinutes + $newTotal)
            > 600
        ) {

            return [
                'success' => false,

                'message' =>
                    'Daily limit exceeded'
            ];
        }

        // ─── Store Tasks ────────────────────────

        foreach ($tasks as $task) {

            [$hours, $minutes] =
                explode(
                    ':',
                    $task['time_input']
                );
            
            TimeLog::create([

                'project_id' =>
                    $task['project_id'],
                'user_id' => Auth::user()->id,
                'work_date' =>
                    $workDate,

                'task_description' =>
                    $task['task_description'],

                'hours' =>
                    $hours,

                'minutes' =>
                    $minutes,

                'total_minutes' =>
                    ($hours * 60)
                    + $minutes,
            ]);
        }

        return [
            'success' => true,

            'message' =>
                'Time log added successfully'
        ];
        }

        public function updateTimeLog(TimeLog $timeLog,array $data) {
            Log::info('Update TimeLog', [
    'timeLog' => $timeLog->toArray(),
    'request_data' => $data
]);
            // ─── Leave Validation ───────────────────

            $leaveExists = LeaveModel::whereDate(
                    'start_date',
                    '<=',
                    $data['work_date']
                )
                ->where('user_id', Auth::user()->id)
                ->whereDate(
                    'end_date',
                    '>=',
                    $data['work_date']
                )
                ->exists();

            if ($leaveExists) {

                return [
                    'success' => false,

                    'message' =>
                        'Leave already applied for this date'
                ];
            }

            // ─── Time Conversion ────────────────────

            [$hours, $minutes] =
                explode(
                    ':',
                    $data['time_input']
                );

            $currentMinutes =
                ($hours * 60) + $minutes;

            // ─── Single Task Validation ─────────────

            if ($currentMinutes > 600) {

                return [
                    'success' => false,

                    'message' =>
                        'Single task cannot exceed 10 hours'
                ];
            }

            // ─── Existing Minutes ───────────────────
           
            $existingMinutes =
                TimeLog::whereDate(
                    'work_date',
                    $data['work_date']
                )
                ->where('user_id', Auth::user()->id)
                ->where('id', '!=', $timeLog->id)
                ->sum('total_minutes');
             Log::info($existingMinutes,[$currentMinutes,$timeLog->id]);
            // ─── Daily Limit Validation ─────────────

            if (
                ($existingMinutes + $currentMinutes)
                > 600
            ) {

                return [
                    'success' => false,

                    'message' =>
                        'Daily limit exceeded'
                ];
            }

            // ─── Update Task ────────────────────────

            $timeLog->update([

                'project_id' =>
                    $data['project_id'],

                'work_date' =>
                    $data['work_date'],

                'task_description' =>
                    $data['task_description'],

                'hours' =>
                    $hours,

                'minutes' =>
                    $minutes,

                'total_minutes' =>
                    $currentMinutes,
            ]);

            return [

                'success' => true,

                'message' =>
                    'Time log updated successfully',

                'data' => $timeLog
            ];
        }
}
