<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DesignationDepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Designations
        $designations = [
            'CEO',
            'CTO',
            'CFO',
            'Manager',
            'Senior Developer',
            'Junior Developer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'UI/UX Designer',
            'Graphic Designer',
            'Business Analyst',
            'Data Analyst',
            'QA Engineer',
            'DevOps Engineer',
            'HR Manager',
            'HR Officer',
            'Accountant',
            'Marketing Executive',
            'Sales Executive',
        ];

        foreach ($designations as $designation) {
            DB::table('designations')->updateOrInsert(
                ['designation' => $designation],
                ['designation' => $designation, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // Departments
        $departments = [
            'IT',
            'Executive',
            'Engineering',
            'Design',
            'Product',
            'Quality Assurance',
            'DevOps',
            'Human Resources',
            'Finance',
            'Marketing',
            'Sales',
            'Operations',
            'Legal',
            'Customer Support',
        ];

        foreach ($departments as $department) {
            DB::table('departments')->updateOrInsert(
                ['department' => $department],
                ['department' => $department, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        $this->command->info('Designations and Departments seeded successfully.');
    }
}
