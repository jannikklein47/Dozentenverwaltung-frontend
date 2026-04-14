<template>
  <q-page class="flex flex-center bg-grey-3">
    <form class="q-pa-xl bg-white shadow-5" style="border-radius: 30px" @submit.prevent="login">
      <div class="text-h4 text-weight-bold full-width text-center q-mb-xl q-mt-md text-primary">
        Noch ein Schritt
      </div>
      <div class="text-subtitle2 q-mb-lg text-grey-8">
        Dein Konto wurde freigeschaltet. Bitte vergib ein neues Passwort.
      </div>
      <q-input
        label="Email"
        outlined
        rounded
        class="q-mb-md"
        readonly
        v-model="userStore.user.username"
        autocomplete="email"
        :disable="loading"
      />
<q-input
  label="Neues Passwort"
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

<q-input
  label="Neues Passwort bestätigen"
  outlined
  rounded
  class="q-mb-md"
  :type="showRepeatPassword ? 'text' : 'password'"
  v-model="repeatPassword"
  autocomplete="repeatpassword"
  :disable="loading"
  :error="repeatPassword !== password"
  error-message="Die Passwörter müssen übereinstimmen."
>
  <template v-slot:append>
    <q-icon
      :name="showRepeatPassword ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      @click="showRepeatPassword = !showRepeatPassword"
    />
  </template>
</q-input>

<div class="text-caption text-grey-7 q-mb-md">
  {{ passwordRulesText }}
</div>
      <q-btn
        label="Bestätigen"
        class="q-mb-md full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="login"
        type="submit"
        :disable="!password || repeatPassword !== password || loading"
        :loading="loading"
      />
    </form>
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
const password = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showRepeatPassword = ref(false)

const passwordRulesText =
  'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.'

  
async function login() {
  loading.value = true
  try {
    const result = await userStore.changeInitialPassword(password.value)
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
