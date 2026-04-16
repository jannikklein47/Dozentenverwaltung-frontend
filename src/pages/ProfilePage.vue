<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="text-h3 text-grey-8 text-weight-bold">Dein Profil</div>
    <q-card flat bordered class="q-mt-lg">
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar
              :style="{
                'background-color': getAvatarColor(user.username),
                color: 'white',
              }"
              class="text-white text-caption text-weight-bold shadow-3"
              size="56px"
            >
              {{ user.username?.charAt(0).toUpperCase() || '?' }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-grey-6">
              E-Mail Adresse / Nutzername</q-item-label
            >
            <q-item-label class="text-h6 text-weight-medium">
              {{ user.username }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-body2 text-grey-8 text-weight-medium q-pl-lg">
        <div>
          Mitglied seit:
          {{
            new Date(user.createdAt).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </div>
        <div class="q-mt-md">Deine Berechtigung: {{ user.role }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pl-lg">
        <q-btn
          label="Nutzername ändern"
          no-caps
          flat
          rounded
          class="bg-grey-3"
          @click="showUsernameDialog = true"
        />
        <q-btn
          label="Passwort ändern"
          no-caps
          flat
          rounded
          class="q-ml-md bg-grey-3"
          @click="showChangePasswordDialog = true"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pl-lg">
        <q-btn
          label="Von allen Geräten abmelden"
          no-caps
          flat
          rounded
          class="bg-red-1 text-black"
          @click="logout"
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showUsernameDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Nutzername ändern</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input label="Neuer Nutzername" v-model="newUsername" autofocus />
        </q-card-section>
        <q-separator />
        <q-card-section class="flex">
          <q-btn
            label="Abbrechen"
            flat
            @click="newUsername = user.username"
            v-close-popup
            no-caps
            rounded
          />
          <q-space />
          <q-btn
            label="Ändern"
            @click="changeUsername()"
            flat
            no-caps
            class="bg-primary text-white"
            rounded
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showChangePasswordDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Passwort ändern</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <form>
            <q-input
              label="Altes Passwort"
              type="password"
              v-model="oldPassword"
              autocomplete="password"
              :disabled="passwordLoading"
              autofocus
            />
            <q-input
              label="Neues Passwort"
              type="password"
              v-model="newPassword"
              class="q-mt-md"
              autocomplete="none"
              :disabled="passwordLoading"
            />
            <q-input
              label="Neues Passwort wiederholen"
              type="password"
              v-model="repeatPassword"
              class="q-mt-md"
              autocomplete="none"
              :disabled="passwordLoading"
            />
          </form>
        </q-card-section>
        <q-separator />
        <q-card-section class="flex">
          <q-btn
            label="Abbrechen"
            flat
            @click="
              () => {
                oldPassword = ''
                newPassword = ''
                repeatPassword = ''
              }
            "
            v-close-popup
            :disabled="passwordLoading"
            no-caps
            rounded
          />
          <q-space />
          <q-btn
            label="Bestätigen"
            @click="changePassword()"
            :disabled="passwordLoading"
            :loading="passwordLoading"
            flat
            no-caps
            rounded
            class="bg-primary text-white"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { getAvatarColor } from 'src/utils/lecturerHelper'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const userStore = useUserStore()

const user = ref({})

const showUsernameDialog = ref(false)
const newUsername = ref('')

const showChangePasswordDialog = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
const passwordLoading = ref(false)

onMounted(async () => {
  const profile = await userStore.getUserProfile()
  if (typeof profile === 'string') {
    $q.notify({
      color: 'negative',
      message: profile,
    })
    return
  }
  user.value = profile
  newUsername.value = user.value.username
})

const logout = async () => {
  await userStore.logout()
  window.location.href = '/'
}

const changeUsername = async () => {
  if (newUsername.value.trim() === '') {
    $q.notify({
      color: 'negative',
      message: 'Der Nutzername darf nicht leer sein.',
    })
    return
  }

  const result = await userStore.changeUsername(newUsername.value)
  if (result === true) {
    user.value.username = newUsername.value
    $q.notify({
      color: 'positive',
      message: 'Nutzername erfolgreich geändert.',
    })
    showUsernameDialog.value = false
  } else {
    $q.notify({
      color: 'negative',
      message: result,
    })
  }
}

const changePassword = async () => {
  if (oldPassword.value.trim() === '') {
    $q.notify({
      color: 'negative',
      message: 'Das alte Passwort darf nicht leer sein.',
    })
    return
  }

  if (newPassword.value.trim() === '') {
    $q.notify({
      color: 'negative',
      message: 'Das neue Passwort darf nicht leer sein.',
    })
    return
  }

  if (repeatPassword.value.trim() === '') {
    $q.notify({
      color: 'negative',
      message: 'Das neue Passwort muss wiederholt werden.',
    })
    return
  }

  if (newPassword.value !== repeatPassword.value) {
    $q.notify({
      color: 'negative',
      message: 'Die Passwörter stimmen nicht überein.',
    })
    return
  }

  passwordLoading.value = true

  const result = await userStore.changePassword(oldPassword.value, newPassword.value)
  if (result === true) {
    $q.notify({
      color: 'positive',
      message: 'Passwort erfolgreich geändert.',
    })
    showChangePasswordDialog.value = false
    oldPassword.value = ''
    newPassword.value = ''
    repeatPassword.value = ''
  } else {
    $q.notify({
      color: 'negative',
      message: result,
    })
  }

  passwordLoading.value = false
}
</script>
