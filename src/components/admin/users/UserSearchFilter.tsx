"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  subscriptionFilter: string;
  onSubscriptionFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function UserSearchFilter({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  subscriptionFilter,
  onSubscriptionFilterChange,
  statusFilter,
  onStatusFilterChange,
}: UserSearchFilterProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Reader">Reader</SelectItem>
            <SelectItem value="Author">Author</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Subscription Filter */}
        <Select
          value={subscriptionFilter}
          onValueChange={onSubscriptionFilterChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Subscriptions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Subscriptions</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="None">None</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
