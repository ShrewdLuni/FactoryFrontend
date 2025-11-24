
export type UserRole = "Worker" | "Master" | "Manager" | "Observer" | "Superuser"
export type UserGender = "Male" | "Female" | "Other"

export type User = {
  id: string,
  role: UserRole,
  name: string,
  email: string,
  phone: string,
  gender: UserGender,
  dateOfBirth: string,

}
