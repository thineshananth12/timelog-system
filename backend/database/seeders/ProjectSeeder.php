<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [

            [
                'name' => 'CRM Development',
                'code' => 'CRM'
            ],

            [
                'name' => 'ERP System',
                'code' => 'ERP'
            ],

            [
                'name' => 'HRMS Portal',
                'code' => 'HRMS'
            ]

        ];

        foreach ($projects as $project) {

            Project::updateOrCreate(

                [
                    'code' => $project['code']
                ],

                [
                    'name' => $project['name']
                ]

            );
        }
    }
}