<template>
  <q-page class="flex flex-center bg-grey-3">
    <form
      class="q-pa-xl bg-white shadow-5"
      style="border-radius: 30px; max-width: 450px; width: 90vw"
      @submit.prevent="register"
    >
      <div class="text-h6 text-weight-bold full-width text-center q-mb-xl text-primary">
        Account Erstellen
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
      <q-input
  label="Passwort wiederholen"
  outlined
  rounded
  class="q-mb-md"
  :type="showPasswordRepeat ? 'text' : 'password'"
  v-model="passwordRepeat"
  autocomplete="password"
  :disable="loading"
>
  <template v-slot:append>
    <q-icon
      :name="showPasswordRepeat ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      @click="showPasswordRepeat = !showPasswordRepeat"
    />
  </template>
</q-input>
      <div class="text-caption text-grey-7 q-mb-md">
  {{ passwordRulesText }}
</div>
      <div class="text-subtitle2 q-mb-lg text-grey-6">
        Hinweis: Eine Registrierung ist kein direkter Zugriff auf das System. Ein Administrator muss
        deine Registrierung bestätigen.
      </div>
      <q-btn
        label="Account erstellen"
        class="q-mb-md full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="person_add"
        type="submit"
        :disable="!email || !password || !passwordRepeat"
        :loading="loading"
      />
      <q-btn
        label="Zurück zum Login"
        class="full-width bg-primary text-white q-py-sm"
        flat
        rounded
        no-caps
        icon="login"
        @click="$router.push({ name: 'login' })"
        :disable="loading"
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
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const loading = ref(false)
  const showPassword = ref(false)
const showPasswordRepeat = ref(false)

const passwordRulesText =
  'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.'

async function register() {
  loading.value = true
  if (password.value != passwordRepeat.value) {
    console.log('Die Passwörter müssen übereinstimmen!')
    quasar.notify({
      message: 'Die Passwörter müssen übereinstimmen!',
      color: 'negative',
    })
    loading.value = false
  } else {
    try {
      const result = await userStore.register(email.value, password.value)
      if (result === true) {
        quasar.notify({
          message: 'Registrierung erfolgreich',
          color: 'positive',
        })
        router.push('/login')
      } else {
        quasar.notify({
          message: `Registrierung fehlgeschlagen: ${result}`,
          color: 'negative',
        })
        loading.value = false
      }
    } catch (error) {
      quasar.notify({
        message: `Registrierung fehlgeschlagen: ${error}`,
        color: 'negative',
      })
      loading.value = false
    }
  }
}
</script>
