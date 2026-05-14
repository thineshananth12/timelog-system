<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveModel;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Carbon\CarbonPeriod;
use App\Services\LeaveService;
class LeaveController extends Controller
{
    protected $leaveService;

    public function __construct(LeaveService $leaveService) 
    {

        $this->leaveService = $leaveService;
    }
    public function index()
    {
        return LeaveModel::latest()->get();
    }
    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|max:500'
        ]);
        $leaveExists = LeaveModel::where(function ($query) use ($request) {
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
        ], 422);
    }
        $period = CarbonPeriod::create(
            $request->start_date,
            $request->end_date
        );

        foreach ($period as $date) {
            $workExists = TimeLog::whereDate('work_date', $date)
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
        ]);
    }
    public function leavhistory(Request $request)
    {
        $query = LeaveModel::query();

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

        $leaves = $query
            ->latest()
            ->get();

        return response()->json([
            'leaves' => $leaves
        ]);
    }
    public function destroy($id)
    {
        LeaveModel::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Leave deleted successfully'
        ]);
    }
}
