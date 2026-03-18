export type UserGender = "Male" | "Female" | "Other";

export type User = {
  id: number;
  code?: string | null | undefined;
  username?: string | null | undefined;
  firstName: string;
  lastName: string;
  fullName?: string | null | undefined;
  patronymic?: string | null | undefined;
  gender: "Male" | "Female" | "Other" | null;
  dateOfBirth?: Date | null | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
  isActive: boolean;
  departments: {
    isActive: boolean;
    id: number;
    label: string;
  }[] | null;
  role?: {
    id: number;
    label?: string | null | undefined;
    is_active?: boolean | null | undefined;
    can_override_workflow?: boolean | null | undefined;
  } | null | undefined;
}

export type InsertUser = {
    firstName: string;
    lastName: string;
    gender: UserGender,
    departmentIds: number[] | null;
    code?: string | null | undefined;
    isActive?: boolean | undefined;
    email?: string | null | undefined;
    username?: string | null | undefined;
    patronymic?: string | null | undefined;
    phone?: string | null | undefined;
    dateOfBirth?: Date | null | undefined;
    roleId?: number | null | undefined;
}

// export type InsertUser = Omit<User, "id" | "fullName">;
