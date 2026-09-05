export interface UpdateProfileParams {
  clienteId: string
  fullName: string
}

export interface IAuthRepository {
  updateProfile(params: UpdateProfileParams): Promise<void>
  updatePassword(newPassword: string): Promise<void>
}
