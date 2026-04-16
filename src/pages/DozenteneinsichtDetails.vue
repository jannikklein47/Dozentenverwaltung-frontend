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
              class="text-weight-bold shadow-3"
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

    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card style="min-width: 500px; max-width: 1650px; border-radius: 20px" class="bg-grey-2">
        <q-card-section class="q-pt-lg q-pb-sm">
          <div
            class="text-center text-weight-medium q-mb-md"
            style="font-size: 16px; font-family: Inter, sans-serif"
          >
            Vorlesung(en) zuweisen
          </div>

          <q-table
            flat
            bordered
            :rows="allLectures"
            :columns="assignColumns"
            row-key="id"
            hide-bottom
            :pagination="{ rowsPerPage: 0 }"
            class="text-grey-8"
            style="
              max-height: 55vh;
              overflow-y: auto;
              font-family: Inter, sans-serif;
              table-layout: fixed;
            "
          >
            <!-- Checkbox column — pre-checked if already assigned -->
            <template #body-cell-selected="props">
              <q-td :props="props" auto-width @click.stop>
                <q-checkbox
                  dense
                  :model-value="isSelected(props.row.id)"
                  @update:model-value="toggleRow(props.row)"
                />
              </q-td>
            </template>

            <!-- Vorliebe dropdown -->
            <template #body-cell-vorliebe="props">
              <q-td :props="props" @click.stop>
                <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                  <template v-if="assignedIds.has(props.row.id)">
                    <!-- Already assigned: show locked badge -->
                    <q-badge
                      :color="getEffectiveColor(props.row.id, 'grey-6')"
                      text-color="white"
                      rounded
                      class="q-px-md q-py-xs text-weight-bold justify-center"
                      :label="
                        rowAssignData[props.row.id]?.vorliebeId
                          ? lectureStore.mappings.preference?.find(
                              (p) => p.value === rowAssignData[props.row.id].vorliebeId,
                            )?.label
                          : professor.preference?.name || '—'
                      "
                    />
                  </template>
                  <template v-else>
                    <!-- Show dropdown only when professor preference is 'Alles' -->
                    <q-select
                      v-if="lockedPreferenceId === null"
                      :model-value="ensureRowData(props.row.id).vorliebeId"
                      @update:model-value="(val) => setRowField(props.row.id, 'vorliebeId', val)"
                      :options="lectureStore.mappings.preference"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      dense
                      outlined
                      style="min-width: 140px"
                    />
                    <!-- Otherwise show a locked badge with the forced value -->
                    <q-badge
                      v-else
                      color="grey-6"
                      text-color="white"
                      rounded
                      class="q-px-md q-py-xs text-weight-bold"
                      :label="professor.preference?.name"
                    />
                  </template>
                </div>
              </q-td>
            </template>

            <!-- Vorlauf dropdown -->
            <template #body-cell-vorlauf="props">
              <q-td :props="props" @click.stop>
                <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                  <q-select
                    v-if="!assignedIds.has(props.row.id)"
                    v-model="getRowData(props.row.id).vorlaufzeit"
                    :options="vorlaufOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    dense
                    outlined
                    style="min-width: 140px"
                  />
                  <q-badge
                    v-else
                    rounded
                    :color="
                      getEffectiveColor(
                        props.row.id,
                        getVorlaufColor(rowAssignData[props.row.id]?.vorlaufzeit),
                      )
                    "
                    text-color="white"
                    class="q-px-sm q-py-xs"
                    :label="
                      vorlaufOptions.find(
                        (o) => o.value === rowAssignData[props.row.id]?.vorlaufzeit,
                      )?.label || '—'
                    "
                  />
                </div>
              </q-td>
            </template>

            <!-- Gehalten dropdown -->
            <template #body-cell-gehalten="props">
              <q-td :props="props" @click.stop>
                <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                  <q-select
                    v-if="isSelected(props.row.id) && !assignedIds.has(props.row.id)"
                    :model-value="ensureRowData(props.row.id).gehalten_anId"
                    @update:model-value="(val) => setRowField(props.row.id, 'gehalten_anId', val)"
                    :options="lectureStore.mappings.gehalten_an"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    dense
                    outlined
                    style="min-width: 140px"
                  />
                  <q-badge
                    v-else
                    rounded
                    :color="
                      getEffectiveColor(
                        props.row.id,
                        getGehaltenColor(
                          lectureStore.mappings.gehalten_an?.find(
                            (g) => g.value === rowAssignData[props.row.id]?.gehalten_anId,
                          )?.label || '',
                        ),
                      )
                    "
                    class="q-px-md q-py-xs text-weight-bold justify-center"
                    style="min-width: 120px; text-align: center"
                    :label="
                      lectureStore.mappings.gehalten_an?.find(
                        (g) => g.value === rowAssignData[props.row.id]?.gehalten_anId,
                      )?.label || '—'
                    "
                  />
                </div>
              </q-td>
            </template>
          </q-table>

          <div class="text-caption text-grey-6 q-mt-sm q-ml-sm">
            {{ selectedLectures.length }} Vorlesung(en) ausgewählt
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-lg q-gutter-md">
          <q-btn
            outline
            color="grey-7"
            label="Abbrechen"
            rounded
            padding="10px 30px"
            style="font-family: Inter, sans-serif"
            @click="cancelForm"
          />
          <q-btn
            color="light-blue-9"
            label="Zuweisen"
            icon="check"
            rounded
            unelevated
            padding="10px 30px"
            :disable="!hasChanges"
            style="font-family: Inter, sans-serif"
            @click="submitAssignment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

  <!-- Floating Action Button -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="menu_book" color="light-blue-9" @click="assignToLecture" />
  </q-page-sticky>
</template>

<script setup>
import { useLectureStore } from 'src/stores/lecture-store'
import { useProfessorStore } from 'src/stores/professor-store'
import { getDozStatusColor, getAvatarColor, getDozentenInitials } from 'src/utils/lecturerHelper'
import { reactive, ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const professorStore = useProfessorStore()
const lectureStore = useLectureStore()
const professor = ref({})

const lectures = computed(() => lectureStore.dozentLectures)
const assignedIds = computed(() => new Set(lectures.value.map((l) => l.id))) // to quickly check which lectures are already assigned to the professor
const totalLectures = computed(() => lectureStore.totalDozentLectures)
const lectureFilters = lectureStore.dozentFilters
const selectedLectures = ref([])
const isSelected = (id) => selectedLectures.value.some((l) => l.id === id)
const isVisibleRow = (id) => isSelected(id) || assignedIds.value.has(id)

const showDialog = ref(false)
// TODO only consider allgeme Vorliebe, to only load ones that can fulfill the preference
const allLectures = computed(() => lectureStore.lectures)
const rowAssignData = reactive({})

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

const hasChanges = computed(() => {
  const selectedIds = new Set(selectedLectures.value.map((l) => l.id))
  const originalIds = assignedIds.value

  // Something was added
  for (const id of selectedIds) {
    if (!originalIds.has(id)) return true
  }

  // Something was removed
  for (const id of originalIds) {
    if (!selectedIds.has(id)) return true
  }

  return false
})

const getRowData = (id) => {
  if (!rowAssignData[id]) {
    rowAssignData[id] = {
      gehalten_anId: null,
      vorliebeId: null,
      vorlaufzeit: null,
    }
  }
  return rowAssignData[id]
}

const getEffectiveColor = (id, normalColor) => {
  if (assignedIds.value.has(id) && !isSelected(id)) return 'grey-5'
  return normalColor
}

const toggleRow = (row) => {
  const idx = selectedLectures.value.findIndex((l) => l.id === row.id)
  if (idx >= 0) {
    selectedLectures.value.splice(idx, 1)
  } else {
    selectedLectures.value.push(row)
    if (lockedPreferenceId.value !== null) {
      ensureRowData(row.id).vorliebeId = lockedPreferenceId.value
    }
  }
}

function ensureRowData(id) {
  if (!rowAssignData[id]) {
    rowAssignData[id] = {
      gehalten_anId: null,
      vorliebeId: null,
      vorlaufzeit: null,
    }
  }
  return rowAssignData[id]
}

function setRowField(id, field, value) {
  ensureRowData(id)[field] = value
}

const vorlaufOptions = [
  { label: 'Sofort Bereit', value: 'S' },
  { label: 'Bis 4 Wochen', value: '4' },
  { label: '4 Wochen +', value: 'M' },
]

const lockedPreferenceId = computed(() => {
  if (professor.value.preference?.name === 'Alles') return null // free choice
  return (
    lectureStore.mappings.preference?.find((p) => p.label === professor.value.preference?.name)
      ?.value ?? null
  )
})

// Widths are assigned so when new lectures are assigned, the dropdowns don't change the column width.
const assignColumns = [
  {
    name: 'selected',
    align: 'center',
    label: '',
    field: 'id',
    style: 'width: 48px; min-width: 48px',
  },
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  { name: 'bezeichnung', align: 'left', label: 'Bezeichnung', field: 'name', sortable: true },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  {
    name: 'vorliebe',
    align: 'center',
    label: 'Vorliebe',
    field: 'vorliebeName',
    style: 'width: 180px; min-width: 180px',
  },
  {
    name: 'vorlauf',
    align: 'center',
    label: 'Vorlauf',
    field: 'vorlaufzeit',
    style: 'width: 180px; min-width: 180px',
  },
  {
    name: 'gehalten',
    align: 'center',
    label: 'Bereits gehalten',
    field: 'gehalten_anName',
    style: 'width: 180px; min-width: 180px',
  },
]

const assignToLecture = async () => {
  lectureStore.clearLectures()
  lectureStore.filters.abschluss_typId = lockedPreferenceId.value

  await Promise.all([lectureStore.loadLectures(), lectureStore.loadMappings()])

  lectures.value.forEach((lecture) => {
    rowAssignData[lecture.id] = {
      gehalten_anId: lecture.gehalten_anId ?? null, // use the real value
      vorliebeId: lecture.vorliebeId ?? lockedPreferenceId.value,
      vorlaufzeit: lecture.vorlaufzeit ?? null,
    }
  })

  // Then fill in defaults for unassigned ones (won't overwrite assigned)
  lectureStore.lectures.forEach((lecture) => {
    if (!rowAssignData[lecture.id]) {
      rowAssignData[lecture.id] = {
        gehalten_anId: null,
        vorliebeId: lockedPreferenceId.value,
        vorlaufzeit: null,
      }
    }
  })

  const assignedIdSet = new Set(lectures.value.map((l) => l.id))
  selectedLectures.value = lectureStore.lectures.filter((l) => assignedIdSet.has(l.id))

  showDialog.value = true
}

const cancelForm = () => {
  showDialog.value = false
  selectedLectures.value = []
  lectureStore.filters.vorliebeId = null
}

const submitAssignment = async () => {
  const payload = selectedLectures.value.map((l) => ({
    professorId: Number(professorId),
    lectureId: l.id,
    gehalten_anId: rowAssignData[l.id]?.gehalten_anId ?? null,
    vorliebeId: rowAssignData[l.id]?.vorliebeId ?? null,
    vorlaufzeit: rowAssignData[l.id]?.vorlaufzeit ?? null,
  }))
  console.log('Payload:', payload)
  showDialog.value = false
  selectedLectures.value = []
  lectureStore.filters.vorliebeId = null
}
</script>
