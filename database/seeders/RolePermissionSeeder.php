<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage_dashboard',
            'manage_categories',
            'manage_nominees',
            'manage_judges',
            'manage_votes',
            'manage_scores',
            'manage_nominations',
            'manage_applications',
            'manage_payments',
            'manage_tickets',
            'manage_sms',
            'manage_content',
            'manage_users',
            'manage_settings',
            'manage_reports',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $superAdmin = Role::findOrCreate('super_admin', 'web');
        $admin = Role::findOrCreate('admin', 'web');
        Role::findOrCreate('judge', 'web');
        Role::findOrCreate('nominee', 'web');
        Role::findOrCreate('public_user', 'web');
        Role::findOrCreate('sponsor', 'web');

        $superAdmin->syncPermissions($permissions);
        $admin->syncPermissions([
            'manage_dashboard',
            'manage_categories',
            'manage_nominees',
            'manage_judges',
            'manage_votes',
            'manage_scores',
            'manage_nominations',
            'manage_applications',
            'manage_payments',
            'manage_tickets',
            'manage_sms',
            'manage_content',
            'manage_reports',
        ]);
    }
}
