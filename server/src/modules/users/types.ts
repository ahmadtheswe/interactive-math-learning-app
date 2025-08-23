export interface User {
  id: number;
  name: string;
  email: string | null;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string | null;
}

export interface UserCreateInput {
  name: string;
  email?: string;
  totalXp?: number;
  currentStreak?: number;
  bestStreak?: number;
  lastActivityDate?: Date;
  passwordHash?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  totalXp?: number;
  currentStreak?: number;
  bestStreak?: number;
  lastActivityDate?: Date;
  passwordHash?: string;
}

// User response object without sensitive data like passwordHash
export interface UserResponse {
  id: number;
  name: string;
  email: string | null;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
