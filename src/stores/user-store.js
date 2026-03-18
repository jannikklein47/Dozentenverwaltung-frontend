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
    async login(email, password) {
      try {
        const result = await api.post('/login', { email: email, password: password })

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
    async register(email, password) {
      try {
        const result = await api.post('/login/register', { email: email, password: password })

        if (result.status === 200) {
          return true
        } else {
          return result.status
        }
      } catch (error) {
        return error.response?.data || error.message
      }
    },

    async refreshAccessToken() {
      try {
        const response = await api.post('/refreshToken', {
          refreshToken: this.refresh,
        })

        this.setTokens(response.data)
      } catch {
        //
      }
    },

    setTokens(payload) {
      this.token = payload.accessToken
      this.refresh = payload.refreshToken
      this.expiresAt = payload.refreshTokenExp
      this.user = jwtDecode(payload.accessToken)?.payload || null

      localStorage.setItem('auth_data', JSON.stringify(payload))
    },

    logout() {
      this.$reset()
      localStorage.removeItem('auth_data')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
