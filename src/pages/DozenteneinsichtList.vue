<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Table with data -->
    <q-table
      flat
      bordered
      :rows="professors"
      :columns="columns"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
      row-key="dozID"
      @row-click="onRowClick"
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
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
            :color="getDozStatusColor(props.value.name)"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold"
            :label="props.value.name"
          />
        </q-td>
      </template>

      <!-- Slot for Lectures -->
      <template #body-cell-vorlesungen="props">
        <q-td :props="props">
          <q-avatar
            size="36px"
            :style="{
              fontFamily: 'Inter, sans-serif',
              'background-color': getAvatarColor(lecture.kuerzel),
            }"
            v-for="(lecture, index) in props.value"
            v-show="index < 3"
            :key="index"
            text-color="white"
            class="text-weight-bold shadow-3"
            style="margin-right: -10px"
            @click.stop="$router.push(`/lectures/details/${lecture.id}`)"
          >
            <svg viewBox="0 0 100 100" width="90%" height="90%">
              <text
                x="50%"
                y="50%"
                text-anchor="middle"
                dominant-baseline="central"
                fill="currentColor"
                style="font-size: 25px; font-weight: bold"
              >
                {{ lecture.kuerzel }}
              </text>
            </svg>
            <q-tooltip class="q-pa-none" style="max-width: none">
              <q-card flat bordered style="min-width: 200px">
                <q-bar
                  :style="{ 'background-color': getAvatarColor(lecture.kuerzel) }"
                  style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                  >{{ lecture.name }}</q-bar
                >
                <q-card-section class="text-black">
                  <div class="text-body2 text-weight-bold">
                    <span class="text-weight-medium"> Ich benötige Vorlaufzeit:</span>
                    {{
                      lecture.Vorlesung_Dozent.vorlaufzeit === 'S'
                        ? 'Sofort'
                        : lecture.Vorlesung_Dozent.vorlaufzeit === 'M'
                          ? 'Mehr als 4 Wochen'
                          : '4 Wochen'
                    }}
                  </div>
                  <div class="text-subtitle2 q-mt-md text-grey-5">Klicken für Details</div>
                </q-card-section>
              </q-card>
            </q-tooltip>
          </q-avatar>
          <q-avatar
            size="36px"
            font-size="10px"
            :style="{
              fontFamily: 'Inter, sans-serif',
            }"
            v-if="props.value.length > 3"
            color="grey-3"
            text-color="black"
            class="text-weight-bold shadow-3"
          >
            +{{ props.value.length - 3 }}
            <q-tooltip class="q-pa-none" style="max-width: none">
              <q-card flat bordered>
                <q-bar
                  style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                  class="bg-grey-9"
                >
                  {{ props.value.length - 3 }} Weitere Vorlesungen</q-bar
                >
                <q-card-section class="text-black">
                  <div class="text-subtitle2 q-mt-md text-grey-5">Klicken für Details</div>
                </q-card-section>
              </q-card>
            </q-tooltip>
          </q-avatar>
        </q-td>
      </template>

      <!-- Slot for Preference -->
      <template #body-cell-vorlieben="props">
        <q-td :props="props">
          <q-badge
            color="grey-6"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold q-mr-xs"
            :label="props.value.name"
          />
        </q-td>
      </template>
    </q-table>

    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      :scroll-target="'.scroll-container'"
      v-if="totalProfessors !== professors.length"
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <div v-else class="full-width text-center text-body2 text-grey-6 q-my-lg">
      Du hast das Ende der Tabelle erreicht. {{ totalProfessors }} / {{ totalProfessors }} Einträge
      werden angezeigt.
    </div>

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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getDozStatusColor, createProfessor, getAvatarColor } from 'src/utils/lecturerHelper'
import { useProfessorStore } from 'src/stores/professor-store'

const router = useRouter()
const showDialog = ref(false)

const professorStore = useProfessorStore()

const professors = computed(() => professorStore.professors)
const totalProfessors = computed(() => professorStore.totalProfessors)
const professorFilters = professorStore.filters

onMounted(async () => {
  professorStore.clearProfessors()
  await professorStore.loadProfessors()
  console.log(professors.value)
})

async function loadMore() {
  professorFilters.offset += professorFilters.limit
  await professorStore.loadProfessors()
}

async function onLoad(index, done) {
  await loadMore()
  done()
}

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
    professorStore.clearProfessors()
    await professorStore.loadProfessors()
    cancelForm()
  } catch (error) {
    console.error('Create failed:', error)
  }
}

//Definition of columns for the table
const columns = [
  { name: 'title', align: 'left', label: 'Titel', field: 'titel', sortable: true },
  {
    name: 'profName',
    align: 'left',
    label: 'Name',
    field: (row) => `${row.vorname} ${row.name}`,
    sortable: true,
  },
  { name: 'status', align: 'center', label: 'Status', field: 'professorStatus', sortable: true },
  { name: 'email', align: 'left', label: 'E-Mail-Adresse', field: 'email', sortable: true },
  {
    name: 'telefon',
    align: 'left',
    label: 'Telefonnummer',
    field: 'telefonnummer',
    sortable: true,
  },
  { name: 'vorlesungen', align: 'left', label: 'Vorlesungen', field: 'lectures' },
  {
    name: 'vorlieben',
    align: 'left',
    label: 'Vorliebe',
    field: 'preference',
  },
]

const onRowClick = (evt, row) => {
  router.push(`/professors/details/${row.id}`)
}
</script>

<style scoped>
:deep(.q-table thead th) {
  color: black !important;
  opacity: 1 !important;
  font-weight: 800 !important;
}
</style>
