"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/services/users.service";
import type { UserStats } from "@/services/users.service";
import type { User } from "@/data/mock/users";

import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserSearchFilter } from "@/components/admin/users/UserSearchFilter";
import { UserTable } from "@/components/admin/users/UserTable";
import { UsersSkeleton } from "@/components/admin/users/UsersSkeleton";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminUsers() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsData, usersData] = await Promise.all([
          usersService.getUserStats(),
          usersService.getUsers({
            search: debouncedSearch,
            role: roleFilter,
            subscription: subscriptionFilter,
            status: statusFilter,
          }),
        ]);

        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, roleFilter, subscriptionFilter, statusFilter]);

  if (loading) {
    return <UsersSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load users data</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <UserStatsCards stats={stats} />

      {/* Search & Filter */}
      <UserSearchFilter
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        subscriptionFilter={subscriptionFilter}
        onSubscriptionFilterChange={setSubscriptionFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* User Table */}
      <UserTable users={users} />
    </>
  );
}
