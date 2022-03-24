<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRolesAndPermissions
{
	/**
	 * @return mixed
	 */
	public function roles()
	{
		return $this->belongsToMany(Role::class, "users_roles");
	}

	/**
	 * @return mixed
	 */
	public function permissions()
	{
		return $this->belongsToMany(Permission::class, "users_permissions");
	}

	/**
	 * @param mixed ...$roles
	 * @return bool
	 */
	public function hasRole(...$roles): bool
	{
		foreach ($roles as $role) {
			if ($this->roles->contains("slug", $role)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param $permission
	 * @return bool
	 */
	public function hasPermission($permission): bool
	{
		return (bool) $this->permissions->where("slug", $permission)->count();
	}

	/**
	 * @param $permission
	 * @return bool
	 */
	public function hasPermissionTo($permission): bool
	{
		return $this->hasPermissionThroughRole($permission) || $this->hasPermission($permission->slug);
	}

	/**
	 * @param $permission
	 * @return bool
	 */
	public function hasPermissionThroughRole($permission): bool
	{
		foreach ($permission->roles as $role) {
			if ($this->roles->contains($role)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param array $permissions
	 * @return mixed
	 */
	public function getAllPermissions(array $permissions)
	{
		return Permission::whereIn("slug", $permissions)->get();
	}

	/**
	 * @param mixed ...$permissions
	 * @return $this
	 */
	public function givePermissionsTo(...$permissions): HasRolesAndPermissions
	{
		$permissions = $this->getAllPermissions($permissions);
		if ($permissions === null) {
			return $this;
		}
		$this->permissions()->saveMany($permissions);
		return $this;
	}

	/**
	 * @param mixed ...$permissions
	 * @return $this
	 */
	public function deletePermissions(...$permissions): HasRolesAndPermissions
	{
		$permissions = $this->getAllPermissions($permissions);
		$this->permissions()->detach($permissions);
		return $this;
	}

	/**
	 * @param mixed ...$permissions
	 * @return HasRolesAndPermissions
	 */
	public function refreshPermissions(...$permissions): HasRolesAndPermissions
	{
		$this->permissions()->detach();
		return $this->givePermissionsTo($permissions);
	}
}
