export type UserRole = "FARMER" | "BUYER" | "BULK_BUYER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  googleId?: string;
  authProvider?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  passwordHash?: string;
}
