import { boot } from 'quasar/wrappers'
import { useUserStore } from 'src/stores/user-store'

export default boot(async ({ store }) => {
  // Use the store instance to access Pinia
  const userStore = useUserStore(store)

  // 1. Check if there is auth data in LocalStorage
  const savedAuth = localStorage.getItem('auth_data')

  if (savedAuth) {
    try {
      const authData = JSON.parse(savedAuth)

      // 2. Check if the Refresh Token is actually still valid

      if (new Date(authData.refreshTokenExp) > new Date()) {
        // Token is still valid, hydrate the store
        userStore.setTokens(authData)

        await userStore.refreshAccessToken()
        // await userStore.refreshAccessToken();
      } else {
        // Refresh token expired, clean up
        userStore.logout()
      }
    } catch (e) {
      console.error('Failed to parse auth data from storage', e)
      userStore.logout()
    }
  }
})
