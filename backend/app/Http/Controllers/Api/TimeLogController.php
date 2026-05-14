<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveModel;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\TimeLogService;
use Auth;
use App\Constants\HttpStatus;
class TimeLogController extends Controller
{
    protected $timeLogService;
    // ─── Dependency Injection ───────────────────

    public function __construct(TimeLogService $timeLogService) {

        $this->timeLogService = $timeLogService;
    }
    public function index(Request $request)
    {
        // Load all the Work log history for the logged user
        return response()->json(
            TimeLog::with('project')
                ->whereDate('work_date', $request->date)
                ->where('user_id', Auth::id())
                ->get(),
            HttpStatus::OK
        );
    }

    public function store(Request $request)
    {
        // Do the form validation 
        $request->validate([
            'work_date' => 'required|date|before_or_equal:today',
            'tasks' => 'required|array|min:1',
            'tasks.*.project_id' => 'required|exists:projects,id',
            'tasks.*.task_description' => 'required|max:500',
            'tasks.*.time_input' => 'required'
        ]);

         //Apply the business logic to store the login data
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
            ],  HttpStatus::VALIDATION_ERROR);
        }

        // ─── Success ──────────────────────────

        return response()->json([
            'message' =>
                $response['message']
        ], HttpStatus::OK);
    }

    
    public function destroy($id)
    {
        // Delete the Timelog which is not used here
        TimeLog::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }

    
}
