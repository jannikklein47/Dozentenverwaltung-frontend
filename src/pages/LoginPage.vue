<template>
  <q-page class="flex flex-center bg-grey-3">
    <form class="q-pa-xl bg-white shadow-5" style="border-radius: 30px" @submit="login">
      <img alt="Quasar logo" src="~assets/provadis-logo.png" />
      <q-input
        label="Email"
        outlined
        rounded
        class="q-mb-md"
        type="email"
        autofocus
        v-model="email"
        autocomplete="email"
      />
      <q-input
        label="Passwort"
        outlined
        rounded
        class="q-mb-md"
        type="password"
        v-model="password"
        autocomplete="password"
      />
      <q-btn
        label="Login"
        class="q-mb-md full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="login"
        type="submit"
        :disable="!email || !password"
      />
      <q-btn
        label="Account erstellen"
        class="full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="person_add"
        @click="$router.push({ name: 'register' })"
      />
    </form>
  </q-page>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { ref } from 'vue'
const userStore = useUserStore()
const quasar = useQuasar()

const email = ref('')
const password = ref('')

async function login() {
  try {
    const result = await userStore.login(email.value, password.value)
    if (result === true) {
      quasar.notify({
        message: 'Login erfolgreich',
        color: 'positive',
      })
    } else {
      quasar.notify({
        message: `Login fehlgeschlagen: ${result}`,
        color: 'negative',
      })
    }
  } catch (error) {
    quasar.notify({
      message: `Login fehlgeschlagen: ${error}`,
      color: 'negative',
    })
  }
}
</script>
