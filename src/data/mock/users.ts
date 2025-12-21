export const mockUserStats = {
  total: 352,
  readers: 320,
  authors: 28,
  admins: 4
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Reader" | "Author" | "Admin";
  subscription: "Free" | "Pro" | "Premium" | "None";
  status: "Active" | "Disabled";
  joinedAt: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Arya Putra",
    email: "arya@mail.com",
    role: "Reader",
    subscription: "Pro",
    status: "Active",
    joinedAt: "2025-01-12"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nur@mail.com",
    role: "Author",
    subscription: "Premium",
    status: "Active",
    joinedAt: "2025-01-10"
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.s@mail.com",
    role: "Reader",
    subscription: "Free",
    status: "Active",
    joinedAt: "2025-01-08"
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.lestari@mail.com",
    role: "Author",
    subscription: "Pro",
    status: "Active",
    joinedAt: "2025-01-05"
  },
  {
    id: 5,
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@mail.com",
    role: "Reader",
    subscription: "None",
    status: "Active",
    joinedAt: "2025-01-03"
  },
  {
    id: 6,
    name: "Rina Wijaya",
    email: "rina.w@mail.com",
    role: "Admin",
    subscription: "Premium",
    status: "Active",
    joinedAt: "2024-12-20"
  },
  {
    id: 7,
    name: "Joko Widodo",
    email: "joko.w@mail.com",
    role: "Reader",
    subscription: "Pro",
    status: "Disabled",
    joinedAt: "2024-12-15"
  },
  {
    id: 8,
    name: "Lisa Amelia",
    email: "lisa.amelia@mail.com",
    role: "Author",
    subscription: "Premium",
    status: "Active",
    joinedAt: "2024-12-10"
  },
  {
    id: 9,
    name: "Hendra Kurniawan",
    email: "hendra.k@mail.com",
    role: "Reader",
    subscription: "Free",
    status: "Active",
    joinedAt: "2024-12-05"
  },
  {
    id: 10,
    name: "Maya Sari",
    email: "maya.sari@mail.com",
    role: "Author",
    subscription: "Pro",
    status: "Active",
    joinedAt: "2024-11-28"
  }
];
