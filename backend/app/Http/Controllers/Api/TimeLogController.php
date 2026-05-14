<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveModel;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\TimeLogService;
class TimeLogController extends Controller
{
    protected $timeLogService;
    // ─── Dependency Injection ───────────────────

    public function __construct(TimeLogService $timeLogService) {

        $this->timeLogService = $timeLogService;
    }
    public function index(Request $request)
    {
        return TimeLog::with('project')
            ->whereDate('work_date', $request->date)
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'work_date' => 'required|date|before_or_equal:today',
            'tasks' => 'required|array|min:1',
            'tasks.*.project_id' => 'required|exists:projects,id',
            'tasks.*.task_description' => 'required|max:500',
            'tasks.*.time_input' => 'required'
        ]);

        // $leaveExists = LeaveModel::whereDate('start_date', '<=', $request->work_date)
        //     ->whereDate('end_date', '>=', $request->work_date)
        //     ->exists();

        // if ($leaveExists) {
        //     return response()->json([
        //         'message' => 'Leave already applied for this date'
        //     ], 422);
        // }

        // $existingMinutes = TimeLog::whereDate('work_date', $request->work_date)
        //     ->sum('total_minutes');

        // $newTotal = 0;
        
        // foreach ($request->tasks as $task) {
            
        //     [$hours, $minutes] = explode(':', $task['time_input']);

        //     $minutesTotal = ($hours * 60) + $minutes;

        //     if ($minutesTotal > 600) {
        //         return response()->json([
        //             'message' => 'Single task cannot exceed 10 hours'
        //         ], 422);
        //     }

        //     $newTotal += $minutesTotal;
        // }
        // if (($existingMinutes + $newTotal) > 600) {
        //     return response()->json([
        //         'message' => 'Daily limit exceeded'
        //     ], 422);
        // }
        // foreach ($request->tasks as $task) {
        //     [$hours, $minutes] = explode(':', $task['time_input']);
        //     TimeLog::create([
        //         'project_id' => $task['project_id'],
        //         'work_date' => $request->work_date,
        //         'task_description' => $task['task_description'],
        //         'hours' => $hours,
        //         'minutes' => $minutes,
        //         'total_minutes' => ($hours * 60) + $minutes
        //     ]);
        // }
         $response =
            $this->timeLogService
                ->storeTimeLogs(
                    $request->tasks,
                    $request->work_date
                );
        // ─── Validation Failed ────────────────

        if (!$response['success']) {

            return response()->json([
                'message' =>
                    $response['message']
            ], 422);
        }

        // ─── Success ──────────────────────────

        return response()->json([
            'message' =>
                $response['message']
        ]);
    }

    public function timelog(Request $request){
        $request->validate([
            'date' => 'required|date'
        ]);

        $logs = TimeLog::with('project')
        ->whereDate(
            'work_date',
            $request->date
        )
        ->latest()
        ->get();

        return response()->json([
            'logs' => $logs
        ]);
    }
    public function destroy($id)
    {
        TimeLog::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }

    
}
