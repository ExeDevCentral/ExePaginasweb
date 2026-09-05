import { IAuthRepository, UpdateProfileParams } from '@/core/domain/repositories/IAuthRepository'

export class InMemoryAuthRepository implements IAuthRepository {
  profileUpdate: UpdateProfileParams | null = null
  lastPassword: string | null = null
  private fail = false

  failNext() {
    this.fail = true
  }

  async updateProfile(params: UpdateProfileParams): Promise<void> {
    if (this.fail) {
      this.fail = false
      throw new Error('update failed')
    }
    this.profileUpdate = params
  }

  async updatePassword(newPassword: string): Promise<void> {
    if (this.fail) {
      this.fail = false
      throw new Error('update failed')
    }
    this.lastPassword = newPassword
  }
}
