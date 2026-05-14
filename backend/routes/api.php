<?php

use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TimeLogController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes are protected by Laravel Sanctum auth middleware.
| Frontend must first authenticate via /api/login (Sanctum token-based).
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/projects', [ProjectController::class, 'index']);

    Route::get('/time-logs', [TimeLogController::class, 'index']);
    Route::post('/time-logs', [TimeLogController::class, 'store']);
    Route::delete('/time-logs/{id}', [TimeLogController::class, 'destroy']);

    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::post('/leaves', [LeaveController::class, 'store']);
    Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']);
    Route::get('/time-logs/{date}', [TimeLogController::class, 'timelog']);
    Route::get('/leave-history', [LeaveController::class, 'leavhistory']);
});

// ── Auth (Sanctum) ──────────────────────────────────────────────────────────
Route::post('/login',  [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');
