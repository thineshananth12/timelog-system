<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveModel;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\TimeLogService;
use Auth;
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
            ->where('user_id',Auth::user()->id)
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

    // public function timelog(Request $request){
    //     $request->validate([
    //         'date' => 'required|date'
    //     ]);
    //     Log::error(Auth::user()->id);
    //     $logs = TimeLog::with('project')
    //     ->whereDate(
    //         'work_date',
    //         $request->date
    //     )
    //     //->where('user_id',Auth::user()->id)
    //     ->latest()
    //     ->get();

    //     return response()->json([
    //         'logs' => $logs
    //     ]);
    // }
    public function destroy($id)
    {
        TimeLog::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }

    
}
