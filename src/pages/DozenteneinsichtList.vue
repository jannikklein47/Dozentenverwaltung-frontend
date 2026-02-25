<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Table with data -->
    <q-table
      flat
      bordered
      :rows="lecturers"
      :columns="columns"
      row-key="dozID"
      @row-click="onRowClick"
      class="text-grey-8 text-weight-bold"
      font-size="16px"
      :style="{
        fontFamily: 'Inter, sans-serif',
      }"
    >
      <!-- Slot for Name -->
      <template #body-cell-name="props">
        <q-td :props="props"> {{ props.row.firstName }} {{ props.row.lastName }} </q-td>
      </template>

      <!-- Slot for Status -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="getDozStatusColor(props.value)"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold"
            :label="getDozStatus(props.value)"
          />
        </q-td>
      </template>

      <!-- Slot for Lectures -->
      <template #body-cell-vorlesungen="props">
        <q-td :props="props">
          <q-avatar
            size="36px"
            font-size="10px"
            :style="{
              fontFamily: 'Inter, sans-serif',
            }"
            v-for="(lecture, index) in props.value"
            :key="index"
            color="light-blue-9"
            text-color="white"
            class="text-weight-bold q-mr-xs"
          >
            {{ lecture }}
          </q-avatar>
        </q-td>
      </template>

      <!-- Slot for Preference -->
      <template #body-cell-vorlieben="props">
        <q-td :props="props">
          <q-badge
            v-for="(preference, index) in getPreference(
              props.row.prioBachelor,
              props.row.prioMaster,
            )"
            :key="index"
            color="grey-6"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold q-mr-xs"
            :label="preference"
          />
        </q-td>
      </template>
    </q-table>

    <!-- TODO: Fix text to bubble alignment and make bottom two fields mandatory as well -->
    <!-- Dialog for creating new lecturer -->
    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card style="min-width: 480px; border-radius: 20px" class="bg-grey-2">
        <q-card-section class="q-pt-lg q-pb-md">
          <div
            class="text-center text-weight-medium"
            style="font-size: 16px; font-family: Inter, sans-serif"
          >
            Neuen Dozenten Erstellen
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-px-lg">
          <q-form @submit="createLecturer" class="q-gutter-sm">
            <!-- Titel -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Titel:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecturer.title"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Vorname -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Vorname:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecturer.firstName"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Nachname -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Nachname:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecturer.lastName"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Email-Adresse -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Email-Adresse:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecturer.email"
                  type="email"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[
                    (val) => !!val || 'Erforderlich',
                    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Ungültig',
                  ]"
                />
              </div>
            </div>

            <!-- Telefonnummer -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Telefonnummer:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecturer.phone"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Vorliebe -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Vorliebe:
              </div>
              <div class="col-7">
                <q-select
                  outlined
                  rounded
                  v-model="newLecturer.preferenceID"
                  :options="preferenceOptions"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  emit-value
                  map-options
                />
              </div>
            </div>

            <!-- Status -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Status:
              </div>
              <div class="col-7">
                <q-select
                  outlined
                  rounded
                  v-model="newLecturer.dozStatusID"
                  :options="statusOptions"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  emit-value
                  map-options
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="row justify-center q-gutter-md q-mt-md q-mb-sm">
              <q-btn
                type="button"
                outline
                color="grey-7"
                label="Abbrechen"
                rounded
                padding="10px 30px"
                style="font-family: Inter, sans-serif"
                @click="cancelForm"
              />
              <q-btn
                type="submit"
                color="light-blue-9"
                label="Dozenten erstellen"
                icon="person_add"
                rounded
                unelevated
                padding="10px 30px"
                style="font-family: Inter, sans-serif"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <!-- Floating Action Button -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="person_add" color="light-blue-9" @click="addNewLecturer" />
  </q-page-sticky>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getDozStatus,
  getDozStatusColor,
  getPreference,
  getAllProfessors,
  createProfessor,
} from 'src/utils/lecturerHelper'

const router = useRouter()
const showDialog = ref(false)

const lecturers = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await getAllProfessors()
    console.log('API response:', response)

    // Transform API data to match table expectations
    lecturers.value = (response.professors || []).map((prof) => ({
      dozID: prof.id,
      title: prof.titel,
      firstName: prof.vorname,
      lastName: prof.name,
      email: prof.email,
      phone: prof.telefonnummer,
      dozStatusID: prof.professorStatus?.id || 1, // Map status properly
      lecturesShort: prof.lectures?.slice(0, 5).map((l) => l.kuerzel) || [], // First 5 lecture codes
      prioBachelor: prof.preference?.prioBachelor || 1,
      prioMaster: prof.preference?.prioMaster || 1,
      preferenceID: prof.preference?.id || 1,
    }))
  } catch (error) {
    console.error('Failed to load professors:', error)
  } finally {
    loading.value = false
  }
})

// Form data
const newLecturer = ref({
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferenceID: null,
  dozStatusID: null,
})

// Options for dropdowns
const statusOptions = [
  { label: 'Intern', value: 1 },
  { label: 'Extern', value: 2 },
  // Add more from actual backend response
]

const preferenceOptions = [
  { label: 'Bachelor', value: 1, prioBachelor: 1, prioMaster: 0 },
  { label: 'Master', value: 2, prioBachelor: 0, prioMaster: 1 },
  { label: 'Alle Vorlesungen', value: 3, prioBachelor: 1, prioMaster: 1 },
]

const addNewLecturer = () => {
  showDialog.value = true
}

const cancelForm = () => {
  showDialog.value = false
  // Reset form
  newLecturer.value = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferenceID: null,
    dozStatusID: null,
  }
}

const createLecturer = async () => {
  try {
    await createProfessor(newLecturer.value)
    await onMounted()
    cancelForm()
  } catch (error) {
    console.error('Create failed:', error)
  }
}

//Definition of columns for the table
const columns = [
  { name: 'title', align: 'left', label: 'Titel', field: 'title', sortable: true },
  {
    name: 'name',
    align: 'left',
    label: 'Name',
    field: (row) => `${row.firstName} ${row.lastName}`,
    sortable: true,
  },
  { name: 'status', align: 'center', label: 'Status', field: 'dozStatusID', sortable: true },
  { name: 'email', align: 'left', label: 'E-Mail-Adresse', field: 'email', sortable: true },
  { name: 'telefon', align: 'left', label: 'Telefonnummer', field: 'phone', sortable: true },
  { name: 'vorlesungen', align: 'left', label: 'Vorlesungen', field: 'lecturesShort' },
  {
    name: 'vorlieben',
    align: 'left',
    label: 'Vorlieben',
    field: (row) => ({ prioBachelor: row.prioBachelor, prioMaster: row.prioMaster }),
  },
]

const onRowClick = (evt, row) => {
  console.log('Row clicked:', row)
  router.push(`/dozenten/details/${row.dozID}`)
}
</script>
