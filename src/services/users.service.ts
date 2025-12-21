import { mockUserStats, mockUsers, type User } from "@/data/mock/users";

export interface UserStats {
  total: number;
  readers: number;
  authors: number;
  admins: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  subscription?: string;
  status?: string;
}

class UsersService {
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUserStats(): Promise<UserStats> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/users/stats');
    // return response.json();
    return mockUserStats;
  }

  async getUsers(filters?: UserFilters): Promise<User[]> {
    await this.delay();
    // TODO: Replace with real API call
    // const params = new URLSearchParams(filters);
    // const response = await fetch(`/api/admin/users?${params}`);
    // return response.json();

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    if (filters?.role && filters.role !== "All") {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters?.subscription && filters.subscription !== "All") {
      filteredUsers = filteredUsers.filter(user => user.subscription === filters.subscription);
    }

    if (filters?.status && filters.status !== "All") {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    return filteredUsers;
  }

  async getUserById(id: number): Promise<User | null> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch(`/api/admin/users/${id}`);
    // return response.json();
    return mockUsers.find(user => user.id === id) || null;
  }

  async updateUserStatus(id: number, status: "Active" | "Disabled"): Promise<void> {
    await this.delay();
    // TODO: Replace with real API call
    // await fetch(`/api/admin/users/${id}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status })
    // });
    console.log(`User ${id} status updated to ${status}`);
  }

  async updateUserRole(id: number, role: User["role"]): Promise<void> {
    await this.delay();
    // TODO: Replace with real API call
    // await fetch(`/api/admin/users/${id}/role`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ role })
    // });
    console.log(`User ${id} role updated to ${role}`);
  }
}

export const usersService = new UsersService();
