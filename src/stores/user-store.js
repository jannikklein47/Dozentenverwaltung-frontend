import { jwtDecode } from 'jwt-decode'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    refresh: null,
    expiresAt: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSessionValid: (state) => state.expiresAt > Date.now(),
  },

  actions: {
    async login(username, password) {
      try {
        const result = await api.post('/auth/login', { username: username, password: password })

        if (result.status === 200) {
          //const { accessToken, refreshToken, refreshTokenExp } = result.data

          this.setTokens(result.data)

          return true
        } else {
          return result.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },
    async register(username, password) {
      try {
        const result = await api.post('/auth/register', {
          username: username,
          password: password,
        })

        if (result.status === 201) {
          return true
        } else {
          return result.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },

    async refreshAccessToken() {
      try {
        const response = await api.post('/auth/refreshToken', {
          refreshToken: this.refresh,
        })

        this.setTokens(response.data)
      } catch {
        //
      }
    },

    async changeInitialPassword(password) {
      try {
        const result = await api.post('/auth/changeinitialpassword', {
          newPassword: password,
          refreshToken: this.refresh,
        })

        if (result.status === 200) {
          //const { accessToken, refreshToken, refreshTokenExp } = result.data

          this.setTokens(result.data)

          return true
        } else {
          return result.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },

    setTokens(payload) {
      this.token = payload.accessToken
      this.refresh = payload.refreshToken
      this.expiresAt = payload.refreshTokenExp
      this.user = jwtDecode(payload.accessToken) || null

      localStorage.setItem('auth_data', JSON.stringify(payload))
    },

    async logout() {
      await api.post('/auth/logout', {
        refreshToken: this.refresh,
      })
      this.$reset()
      localStorage.removeItem('auth_data')
    },

    async logoutAll() {
      await api.post('/auth/logout?all=true', {
        refreshToken: this.refresh,
      })
      this.$reset()
      localStorage.removeItem('auth_data')
    },

    async getUserProfile() {
      try {
        const response = await api.get('/app/user')
        return response.data
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },

    async changeUsername(username) {
      try {
        const response = await api.patch('/app/user/change-username', { username })
        if (response.status === 200) {
          this.user.username = response.data.username
          return true
        } else {
          return response.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },

    async changePassword(oldpassword, password) {
      try {
        const response = await api.patch('/app/user/change-password', {
          oldpassword,
          password,
        })
        if (response.status === 200) {
          return true
        } else {
          return response.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else return error.message
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
