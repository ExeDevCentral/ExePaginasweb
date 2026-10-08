export class InMemoryAuthRepository {
  constructor() {
    InMemoryAuthRepository.prototype.__init.call(this)
    InMemoryAuthRepository.prototype.__init2.call(this)
    InMemoryAuthRepository.prototype.__init3.call(this)
  }
  __init() {
    this.profileUpdate = null
  }
  __init2() {
    this.lastPassword = null
  }
  __init3() {
    this.fail = false
  }

  failNext() {
    this.fail = true
  }

  async updateProfile(params) {
    if (this.fail) {
      this.fail = false
      throw new Error('update failed')
    }
    this.profileUpdate = params
  }

  async updatePassword(newPassword) {
    if (this.fail) {
      this.fail = false
      throw new Error('update failed')
    }
    this.lastPassword = newPassword
  }
}
