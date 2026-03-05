<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header for information about lecturer -->
    <q-card bordered flat class="q-mb-lg">
      <q-card-section class="row no-wrap items-center q-pa-none">
        <!-- Lecturer -->
        <div class="col-5 q-pa-md">
          <div class="row items-center q-gutter-x-md">
            <!-- Have to use style to set text and background color as quasar does not support hex values by default -->
            <q-avatar
              class="text-weight-bold"
              size="56px"
              :style="{
                fontFamily: 'Inter, sans-serif',
                backgroundColor: getAvatarColor(professor.vorname?.at(0) + professor.name?.at(0)),
                color: 'white',
              }"
            >
              {{ getDozentenInitials(professor.vorname, professor.name) }}
            </q-avatar>
            <div>
              <div
                class="text-caption text-grey-6 text-uppercase text-weight-bold"
                style="letter-spacing: 3px"
              >
                Dozent
              </div>
              <div class="text-h6 text-weight-bold row items-center q-gutter-x-sm">
                <span
                  :style="{
                    fontFamily: 'Inter, sans-serif',
                  }"
                  >{{ professor.titel }} {{ professor.vorname }} {{ professor.name }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <q-space />

        <q-separator vertical />

        <!-- Status -->
        <div class="q-pa-md q-px-xl text-center">
          <div
            class="text-caption text-grey-6 text-center q-mb-xs text-weight-bold"
            style="letter-spacing: 3px"
          >
            Bereich
          </div>
          <div class="flex flex-center">
            <q-badge
              rounded
              :color="getDozStatusColor(professor?.professorStatus?.name || '')"
              :label="professor?.professorStatus?.name || ''"
              class="q-px-sm q-py-xs"
            />
          </div>
        </div>

        <q-separator vertical class="self-stretch" />

        <!-- Preference -->
        <div class="q-pa-md q-px-xl text-center">
          <div
            class="text-caption text-grey-6 q-mb-xs text-weight-bold"
            style="letter-spacing: 3px"
          >
            Allgemeine Vorliebe
          </div>
          <q-badge
            color="grey-6"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold q-mr-xs"
            :label="professor.preference?.name"
          />
        </div>

        <q-separator vertical />

        <!-- Contact -->
        <div class="q-pa-md q-px-xl flex justify-center">
          <div>
            <div
              class="text-caption text-grey-6 q-mb-xs text-weight-bold text-left"
              style="letter-spacing: 3px"
            >
              Kontakt
            </div>
            <div class="text-weight-bold text-body2 text-left">{{ professor.email }}</div>
            <div class="text-weight-bold text-body2 text-left">{{ professor.telefonnummer }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Separator with title -->
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-grey-8 text-weight-bold q-mr-md" style="letter-spacing: 1px">
        Vorlesungen
      </div>
      <q-separator class="col" color="grey-4" />
    </div>

    <!-- Table with data -->
    <q-table
      flat
      bordered
      :rows="lectures"
      :columns="columns"
      row-key="id"
      hide-bottom
      class="text-grey-8 text-weight-bold"
      font-size="16px"
      :style="{
        fontFamily: 'Inter, sans-serif',
      }"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
      @row-click="onRowClick"
    >
      <!-- Slot for Status -->
      <template v-slot:body-cell-offen="props">
        <q-td :props="props">
          <q-badge
            :color="props.value.name === 'Geschlossen' ? 'brown-9' : 'green-8'"
            text-color="white"
            dense
            rounded
            class="q-px-md q-py-xs text-weight-bold"
            :label="props.value.name"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-abschluss="props">
        <q-td :props="props">
          {{ props.value.name }}
        </q-td>
      </template>

      <template v-slot:body-cell-vorliebe="props">
        <q-td :props="props">
          {{ props.value || 'Wie im Profil' }}
        </q-td>
      </template>

      <!-- Slot for lead time-->
      <template #body-cell-vorlauf="props">
        <q-td :props="props">
          <q-badge
            rounded
            :color="getVorlaufColor(props.value)"
            text-color="white"
            class="q-px-sm q-py-xs full-width justify-center"
            :label="
              props.value === 'M'
                ? '4 Wochen +'
                : props.value === 'S'
                  ? 'Sofort Bereit'
                  : 'Bis 4 Wochen'
            "
          />
        </q-td>
      </template>

      <!-- Slot for if weather it has already been held before -->
      <template #body-cell-gehalten="props">
        <q-td :props="props">
          <q-badge
            rounded
            :color="getGehaltenColor(props.value)"
            class="q-px-md q-py-xs full-width justify-center text-weight-bold"
            :label="props.value"
            style="min-width: 120px"
          />
        </q-td>
      </template>
    </q-table>
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      :scroll-target="'.scroll-container'"
      v-if="totalLectures !== lectures.length"
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <div v-else class="full-width text-center text-body2 text-grey-6 q-my-lg">
      Du hast das Ende der Tabelle erreicht. {{ totalLectures }} / {{ totalLectures }} Einträge
      werden angezeigt.
    </div>

    <q-dialog v-model="notFoundModel" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Keine Vorlesungen gefunden</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="$router.push('/')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useLectureStore } from 'src/stores/lecture-store'
import { useProfessorStore } from 'src/stores/professor-store'
import { getDozStatusColor, getAvatarColor, getDozentenInitials } from 'src/utils/lecturerHelper'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const professorStore = useProfessorStore()
const lectureStore = useLectureStore()
const professor = ref({})

const lectures = computed(() => lectureStore.dozentLectures)
const totalLectures = computed(() => lectureStore.totalDozentLectures)
const lectureFilters = lectureStore.dozentFilters

const route = useRoute()
// Get the ID from the URL query string
const professorId = route.params.id

const notFoundModel = ref(false)

watch(
  () => route.params.id,
  async () => {
    loadProfessor()
  },
)

// Load data when component mounts
onMounted(async () => {
  loadProfessor()
  await lectureStore.loadDozentLectures(professorId)
})

async function loadProfessor() {
  const result = await professorStore.getProfessorById(professorId)
  if (result) {
    professor.value = result
  } else {
    notFoundModel.value = true
    console.log('Professor not found')
  }
}

//Definition of columns for the table
const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  {
    name: 'bezeichnung',
    align: 'left',
    label: 'Bezeichnung',
    field: 'name',
    sortable: true,
  },
  { name: 'offen', align: 'center', label: 'Offen', field: 'lectureStatus', sortable: true },
  {
    name: 'abschluss',
    align: 'center',
    label: 'Abschluss',
    field: 'completionType',
    sortable: true,
  },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  {
    name: 'vorliebe',
    align: 'left',
    label: 'Vorliebe',
    style: 'font-weight: bold',
    field: 'vorliebeName',
    sortable: true,
  },
  { name: 'vorlauf', align: 'center', label: 'Vorlauf', field: 'vorlaufzeit' },
  {
    name: 'gehalten',
    align: 'center',
    label: 'Bereits gehalten',
    field: 'gehalten_anName',
    sortable: true,
  },
]

//Function for getting the color for the lead time badge
const getVorlaufColor = (val) => {
  if (val === 'S') return 'green-7'
  if (val === '4') return 'amber-8'
  return 'red-7'
}

//Function for getting the color for the already held badge
const getGehaltenColor = (val) => {
  if (val.includes('Provadis')) return 'blue-7'
  if (val.includes('Extern')) return 'amber-9'
  return 'grey-10'
}

async function loadMore() {
  lectureFilters.offset += lectureFilters.limit
  await lectureStore.loadDozentLectures(professorId)
}

async function onLoad(index, done) {
  await loadMore()
  done()
}

const onRowClick = (evt, row) => {
  router.push(`/lectures/details/${row.id}`)
}
</script>
