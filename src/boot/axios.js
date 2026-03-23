import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useUserStore } from 'src/stores/user-store'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = process.env.DEV
  ? 'http://localhost:3000/api/v1.0/' // Dev-Mode
  : 'http://164.30.75.20/api/v1.0/' // Production-Mode
const api = axios.create({
  baseURL,
})

export default defineBoot(({ app, store, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const userStore = useUserStore(store)

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  api.interceptors.request.use((config) => {
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  })

  // Handle 401 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const resp = await axios.post(baseURL + 'refreshToken', {
            refreshToken: userStore.refresh,
          })

          userStore.setTokens(resp.data)

          originalRequest.headers.Authorization = resp.data.accessToken
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh token is invalid / expired
          userStore.logout()
          router.push('/login')
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
