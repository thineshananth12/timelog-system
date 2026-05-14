<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveModel;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Carbon\CarbonPeriod;
use App\Services\LeaveService;
use Illuminate\Support\Facades\Log;
use App\Constants\HttpStatus;
use Auth;
class LeaveController extends Controller
{
    protected $leaveService;

    public function __construct(LeaveService $leaveService) 
    {

        $this->leaveService = $leaveService;
    }
    public function index()
    {
        // Fetch All Leave data for the logged In user
        return LeaveModel::latest()->where('user_id', Auth::user()->id)->get();
    }
    public function store(Request $request)
    {
        //Leave Validation
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|max:500'
        ]);
        // Check whether leave already applied or not
        $leaveExists = LeaveModel::where('user_id', Auth::user()->id)->where(function ($query) use ($request) {
        $query->whereBetween(
            'start_date',
            [
                $request->start_date,
                $request->end_date
            ]
        )

        ->orWhereBetween(
            'end_date',
            [
                $request->start_date,
                $request->end_date
            ]
        )

        ->orWhere(function ($q) use ($request) {

            $q->where(
                'start_date',
                '<=',
                $request->start_date
            )

            ->where(
                'end_date',
                '>=',
                $request->end_date
            );
        });

    })->exists();

    if ($leaveExists) {

        return response()->json([
            'message' =>
                'Leave already applied for selected dates'
        ], HttpStatus::VALIDATION_ERROR);
    }
        $period = CarbonPeriod::create(
            $request->start_date,
            $request->end_date
        );

        foreach ($period as $date) {
            // Check whether worklog exist or not
            $workExists = TimeLog::whereDate('work_date', $date)
                ->where('user_id', Auth::user()->id)
                ->exists();

            if ($workExists) {
                return response()->json([
                    'message' => 'Work log exists for selected dates'
                ], 422);
            }
        }

        $this->leaveService
            ->applyLeave(
                $request->all()
            );

        return response()->json([
            'message' => 'Leave applied successfully'
        ],HttpStatus::OK);
    }
    public function leavhistory(Request $request)
    {
        // Get the Leave history
        Log::error(Auth::user()->id);
        $query = LeaveModel::query()->where('user_id', Auth::user()->id);
        // ─── Filter Start Date ─────────────────────
        if ($request->start_date) {

            $query->whereDate(
                'start_date',
                '>=',
                $request->start_date
            );
        }
        // ─── Filter End Date ───────────────────────
        if ($request->end_date) {
            $query->whereDate(
                'end_date',
                '<=',
                $request->end_date
            );
        }
        $leaves = $query->where('user_id', Auth::user()->id)
            ->latest()
            ->get();
        return response()->json([
            'leaves' => $leaves
        ]);
    }
    public function destroy($id)
    {
        // Hard delete the leave history which is not used any place
        LeaveModel::findOrFail($id)->delete();
        return response()->json([
            'message' => 'Leave deleted successfully'
        ],HttpStatus::OK);
    }
}
