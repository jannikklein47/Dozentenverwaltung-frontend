<template>
  <q-page class="flex flex-center bg-grey-3">
    <form class="q-pa-xl bg-white shadow-5" style="border-radius: 30px" @submit.prevent="login">
      <img alt="Quasar logo" src="~assets/provadis-logo.png" />
      <div class="text-h4 text-weight-bold full-width text-center q-mb-xl q-mt-md text-primary">
        Dozentenverwaltung
      </div>
      <q-input
        label="Email"
        outlined
        rounded
        class="q-mb-md"
        autofocus
        v-model="email"
        autocomplete="email"
        :disable="loading"
      />
    <q-input
  label="Passwort"
  outlined
  rounded
  class="q-mb-md"
  :type="showPassword ? 'text' : 'password'"
  v-model="password"
  autocomplete="password"
  :disable="loading"
>
  <template v-slot:append>
    <q-icon
      :name="showPassword ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      @click="showPassword = !showPassword"
    />
  </template>
</q-input>
      <div
        class="full-width flex q-mb-md text-grey-7"
        style="text-decoration: underline"
        @click="showResetPasswordDialog = true"
      >
        <q-space /><q-btn label="Passwort vergessen?" flat dense no-caps />
      </div>

      <q-btn
        label="Login"
        class="q-mb-md full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="login"
        type="submit"
        :disable="!email || !password || loading"
        :loading="loading"
      />
      <q-btn
        label="Account erstellen"
        class="full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="person_add"
        @click="$router.push({ name: 'register' })"
        :disable="loading"
      />
    </form>

    <q-dialog v-model="showResetPasswordDialog">
      <q-card>
        <q-bar>
          <div class="text-h6">Passwort zurücksetzen</div>
        </q-bar>
        <q-card-section>
          Bitte kontaktiere einen Administrator, um dein Passwort zurückzusetzen.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Schliessen" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const quasar = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const showResetPasswordDialog = ref(false)
const showPassword = ref(false)

async function login() {
  loading.value = true
  try {
    const result = await userStore.login(email.value, password.value)
    loading.value = false
    if (result === true) {
      quasar.notify({
        message: 'Login erfolgreich',
        color: 'positive',
      })
      router.push('/lectures')
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
