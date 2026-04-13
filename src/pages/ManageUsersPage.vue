<template>
  <q-page class="q-pa-md bg-grey-2" v-if="userStore.user?.role === 'Admin'">
    <div class="text-h5 text-weight-bold q-mb-md">Aktuelle ToDo's | Gesperrte Nutzer</div>
    <q-table
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
      :rows="userData.filter((user) => !user.active)"
      hide-pagination
      :columns="[
        { name: 'id', align: 'left', label: 'ID', field: 'id' },
        { name: 'name', align: 'left', label: 'Name', field: 'username' },
        { name: 'role', align: 'left', label: 'Rolle', field: 'role' },
        { name: 'date', align: 'left', label: 'Registrierungsdatum', field: 'date' },
        { name: 'action', align: 'right', label: 'Aktion' },
      ]"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-avatar
            size="sm"
            :style="{
              'background-color': getAvatarColor(props.row.username),
            }"
            class="text-white text-caption text-weight-bold q-mr-sm shadow-3"
          >
            {{ props.row.username.at(0).toUpperCase() }}
          </q-avatar>
          {{ props.row.username }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn flat dense icon="check" color="positive" @click="activateUser(props.row.id)">
            <q-tooltip class="text-body2"> Nutzer freischalten </q-tooltip>
          </q-btn>
          <q-btn flat dense icon="close" color="negative" @click="deleteUser(props.row.id)">
            <q-tooltip class="text-body2" style="width: 120px">Antrag löschen</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-date="props">
        <q-td :props="props">
          {{
            new Date(props.row.createdAt).toLocaleString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }}
        </q-td>
      </template>
    </q-table>
    <div class="text-h5 text-weight-bold q-mt-lg q-mb-md">Aktive Nutzer</div>
    <q-table
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
      :rows="userData.filter((user) => user.active)"
      hide-pagination
      :columns="[
        { name: 'id', align: 'left', label: 'ID', field: 'id' },
        { name: 'name', align: 'left', label: 'Name', field: 'username' },
        { name: 'role', align: 'left', label: 'Rolle', field: 'role' },
        { name: 'action', align: 'right', label: 'Aktion' },
      ]"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-avatar
            size="sm"
            :style="{
              'background-color': getAvatarColor(props.row.username),
            }"
            class="text-white text-caption text-weight-bold q-mr-sm shadow-3"
            >{{ props.row.username.at(0).toUpperCase() }}
          </q-avatar>
          {{ props.row.username }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            label="Reset"
            class="q-pr-sm"
            no-caps
            flat
            dense
            rounded
            icon="lock_reset"
            color="primary"
            @click="resetUserPassword(props.row.id, props.row.username)"
            v-if="props.row.username !== userStore.user.username"
          >
            <q-tooltip class="text-body2"> Passwort zurücksetzen </q-tooltip>
          </q-btn>
          <q-btn
            flat
            rounded
            class="q-pr-sm"
            dense
            icon="close"
            color="negative"
            label="Sperren"
            no-caps
            @click="deactivateUser(props.row.id)"
            v-if="props.row.username !== userStore.user.username"
          />
          <q-btn
            flat
            icon="edit"
            color="grey-9"
            round
            size="sm"
            @click="
              () => {
                selectedUser = JSON.parse(JSON.stringify(props.row))
                editUserDialog = true
              }
            "
          >
            <q-tooltip class="text-body2">Bearbeiten</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editUserDialog" backdrop-filter="blur(5px)">
      <q-card flat class="shadow-3" style="width: 400px">
        <q-bar>Nutzer bearbeiten <q-space /> <q-btn dense flat icon="close" v-close-popup /></q-bar>
        <q-card-section>
          <q-input readonly v-model="selectedUser.id" label="ID"></q-input>
          <q-input v-model="selectedUser.username" label="Email"></q-input>
          <q-select
            v-model="selectedUser.role"
            label="Rolle"
            :options="['Admin', 'User']"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Abbrechen" flat v-close-popup />
          <q-btn
            label="Speichern"
            color="primary"
            @click="updateUser(selectedUser.id, selectedUser)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <q-page
    v-else
    class="flex flex-center justify-center text-negative text-body1"
    style="flex-direction: column"
  >
    <q-icon name="close" size="100px" />
    Du hast keine Berechtigung, diese Seite zu nutzen.
    <q-btn class="q-mt-xl bg-negative" color="white" label="Zur Startseite" to="/" flat />
  </q-page>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import { getAvatarColor } from 'src/utils/lecturerHelper'
import { useUserStore } from 'src/stores/user-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const userData = ref([])

const userStore = useUserStore()

const selectedUser = ref(null)
const editUserDialog = ref(false)

onMounted(async () => {
  await loadUsers()
})

const activateUser = async (id) => {
  try {
    const result = await api.post('/app/users/activate/' + id)

    if (result.status === 200) {
      await loadUsers()
    }
  } catch (error) {
    console.error(error)
  }
}

const deactivateUser = async (id) => {
  try {
    const result = await api.post('/app/users/deactivate/' + id)

    if (result.status === 200) {
      await loadUsers()
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteUser = async (id) => {
  try {
    const result = await api.delete('/app/users/' + id)

    if (result.status === 200) {
      await loadUsers()
    }
  } catch (error) {
    console.error(error)
  }
}

const resetUserPassword = async (id, username) => {
  $q.loading.show({
    message: 'Passwort wird zurückgesetzt...',
  })
  try {
    const result = await api.post('/app/users/reset-password/' + id)
    if (result.status === 200) {
      $q.dialog({
        title: 'Passwort zurückgesetzt',
        message:
          '<div>Das Passwort wurde erfolgreich zurückgesetzt.Es lautet wie folgt: ' +
          result.data.password +
          ' - Dieses Passwort ist ein Mal gültig und muss an den Nutzer weitergegeben werden.</div><div><a href="mailto:' +
          username +
          '?subject=Passwort zurückgesetzt&body=Guten Tag, das neue Passwort lautet: ' +
          result.data.password +
          '. Es ist nur ein Mal gültig. Du kannst ein neues Passwort wählen, sobald du dich angemeldet hast."">Nutzer benachrichtigen</a></div>',

        color: 'positive',
        html: true,
      })
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      message:
        'Aktion fehlgeschlagen: ' + error.response.data.title + ' | ' + error.response.data.message,
      color: 'negative',
    })
  } finally {
    $q.loading.hide()
  }
}

const updateUser = async (id, data) => {
  try {
    const result = await api.patch('/app/users/' + id, {
      username: data.username,
      role: data.role,
    })

    if (result.status === 200) {
      editUserDialog.value = false
      $q.notify({
        message: 'Nutzer erfolgreich aktualisiert',
        color: 'positive',
      })
      await loadUsers()
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      message:
        'Nutzer konnte nicht aktualisiert werden: ' +
        error.response.data.title +
        ' | ' +
        error.response.data.message,
      color: 'negative',
    })
  }
}

const loadUsers = async () => {
  const result = await api.get('/app/users')
  userData.value = result.data.users
}
</script>
