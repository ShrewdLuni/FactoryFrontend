export type UserRole =
  | "Worker"
  | "Master"
  | "Manager"
  | "Observer"
  | "Superuser";
export type UserGender = "Male" | "Female" | "Other";

export type User = {
  id: string;
  code: number;
  username: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  gender: UserGender;
  department: string;
  role: UserRole;
};
