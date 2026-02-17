export type UserRole =
  | "Worker"
  | "Master"
  | "Manager"
  | "Observer"
  | "Superuser";

export type UserGender = "Male" | "Female" | "Other";

export type UserDepartment = "Knitting" | "Sewing" | "Molding" | "Labeling" | "Packaging"

export type User = {
  id: number;
  guid?: string | null | undefined;
  code?: string | null | undefined;
  taxCode?: string | null | undefined;
  username?: string | null | undefined;
  firstName: string;
  lastName: string;
  patronymic?: string | null | undefined;
  fullName: string;
  dateOfBirth?: string | null | undefined;
  email?: string | null | undefined
  phone?: string | null | undefined
  gender?: UserGender
  department?: UserDepartment
  role?: UserRole
}

export type InsertUser = Omit<User, "id">
