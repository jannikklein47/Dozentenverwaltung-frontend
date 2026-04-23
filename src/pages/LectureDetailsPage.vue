<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-inner-loading :showing="loading" style="z-index: 10">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <div v-if="lecture && lecture.id">
      <q-card bordered flat class="q-mb-lg">
        <q-card-section class="row no-wrap items-center q-pa-none">
          <div class="col-3 q-pa-md">
            <div class="text-overline text-grey-6">{{ lecture.kuerzel || 'Kein Kürzel' }}</div>
            <div class="text-weight-bold text-h6">{{ lecture.name || 'Kein Name' }}</div>
          </div>
          <q-separator vertical />
          <div class="col-2 text-center">
            <div
              class="text-caption text-grey-6 text-weight-bold q-mb-xs"
              style="letter-spacing: 3px"
            >
              Status
            </div>
            <q-badge
              rounded
              :color="lecture.lectureStatus?.name === 'Geschlossen' ? 'brown-9' : 'green-8'"
              :label="lecture.lectureStatus?.name || 'N/A'"
              class="q-px-sm text-weight-bold"
            />
          </div>
          <q-separator vertical />
          <div class="col-3 text-center">
            <div
              class="text-caption text-grey-6 text-weight-bold q-mb-xs"
              style="letter-spacing: 3px"
            >
              Studienstufe
            </div>
            <q-badge
              color="grey-6"
              rounded
              :label="lecture.completionType?.name || 'N/A'"
              class="q-px-md"
            />
          </div>
          <q-separator vertical />
          <div class="col-4 q-pa-md text-center">
            <div class="text-caption text-grey-6 text-weight-bold" style="letter-spacing: 3px">
              Semester
            </div>
            <div class="text-weight-bold">Regelsemester: {{ lecture.semester || '-' }}</div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row items-center q-mb-md">
        <div class="text-h6 text-grey-8 text-weight-bold q-mr-md">Zugeordnete Dozenten</div>
        <q-separator class="col" color="grey-4" />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="d_item in lectureProfessors" :key="d_item.id" class="col-12 col-md-6">
          <q-card
            flat
            bordered
            class="lecture-card cursor-pointer"
            tabindex="0"
            @click="$router.push(`/professors/details/${d_item.id}`)"
          >
            <q-card-section class="row items-center">
              <q-avatar
                size="48px"
                class="text-weight-bold text-white shadow-3"
                :style="{
                  backgroundColor: getAvatarColor(d_item.vorname?.at(0) + d_item.name?.at(0) || 0),
                }"
              >
                {{ d_item.vorname?.[0] }}{{ d_item.name?.[0] }}
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-caption text-grey-6 text-weight-bold">
                  Dozent{{ d_item.titel ? ',' : '' }} {{ d_item.titel }}
                </div>
                <div class="text-h6 text-weight-bold">
                  {{ d_item.vorname }} {{ d_item.name }}
                  <q-badge color="grey-6" :label="d_item.professorStatus?.name" />
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Vorliebe:</span>
                <q-space />
                <q-badge color="grey-6" :label="formatPreference(d_item.preference?.name)" />
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Vorlaufzeit für diese Vorlesung:</span>
                <q-space />
                <q-badge color="grey-6" :label="formatVorlaufzeit(d_item.lectureVorlaufzeit)" />
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Erfahrung in dieser Vorlesung:</span>
                <q-space />
                <q-badge color="grey-6" :label="d_item.lectureGehalten_anName || '—'" />
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">E-Mail Adresse:</span>
                <q-space />
                {{ d_item.email }}
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Telefonnummer:</span>
                <q-space />
                {{ d_item.telefonnummer }}
              </div>
              <q-separator class="q-my-md" />
              <div>
                <div class="text-weight-medium text-grey-7">Gehaltene Vorlesungen:</div>
                <q-avatar
                  size="36px"
                  :style="{
                    fontFamily: 'Inter, sans-serif',
                    'background-color': getAvatarColor(lecture.kuerzel),
                  }"
                  v-for="(lecture, index) in d_item.lectures"
                  :key="index"
                  text-color="white"
                  class="text-weight-bold q-mr-xs q-mt-sm shadow-3"
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
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="lectureProfessors.length === 0" class="col-12 text-center q-pa-md text-grey-6">
          Keine Dozenten zugeordnet.
        </div>
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          :scroll-target="'.scroll-container'"
          v-if="totalLectureProfessors !== lectureProfessors.length"
        >
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
        <div
          v-else-if="totalLectureProfessors > 0"
          class="full-width text-center text-body2 text-grey-6 q-my-lg"
        >
          Du hast das Ende der Liste erreicht. {{ totalLectureProfessors }} /
          {{ totalLectureProfessors }} Einträge werden angezeigt.
        </div>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-icon name="error_outline" color="red" size="4rem" />
      <div class="text-h6 q-mt-md">Vorlesung mit ID {{ $route.params.id }} nicht gefunden.</div>
    </div>

    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card style="min-width: 500px; max-width: 1650px; border-radius: 20px" class="bg-grey-2">
        <q-card-section class="q-pt-lg q-pb-sm">
          <div
            class="text-center text-weight-medium q-mb-md"
            style="font-size: 16px; font-family: Inter, sans-serif"
          >
            Dozent(en) zuweisen
          </div>

          <div
            ref="dialogScrollRef"
            style="max-height: 66vh; overflow-y: auto; font-family: Inter, sans-serif"
          >
            <q-table
              flat
              bordered
              :rows="allProfessors"
              :columns="assignColumns"
              row-key="id"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
              class="text-grey-8"
              style="table-layout: fixed"
            >
              <template #body-cell-selected="props">
                <q-td :props="props" auto-width @click.stop>
                  <q-checkbox
                    dense
                    :model-value="isSelected(props.row.id)"
                    @update:model-value="toggleRow(props.row)"
                  />
                </q-td>
              </template>

              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    rounded
                    :color="getDozStatusColor(props.value?.name)"
                    :label="props.value?.name || 'N/A'"
                    class="q-px-sm q-py-xs"
                  />
                </q-td>
              </template>

              <template #body-cell-vorliebe="props">
                <q-td :props="props" @click.stop>
                  <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                    <template v-if="assignedIds.has(props.row.id)">
                      <q-badge
                        color="grey-6"
                        :label="formatPreference(props.row.preference?.name)"
                      />
                    </template>
                    <template v-else-if="isSelected(props.row.id)">
                      <q-select
                        :model-value="getRowData(props.row.id).vorliebeId"
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
                    </template>
                  </div>
                </q-td>
              </template>

              <template #body-cell-vorlauf="props">
                <q-td :props="props" @click.stop>
                  <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                    <template v-if="assignedIds.has(props.row.id)">
                      <q-badge
                        :label="
                          vorlaufOptions.find(
                            (o) => o.value === rowAssignData[props.row.id]?.lectureVorlaufzeit,
                          )?.label || '—'
                        "
                      />
                    </template>
                    <template v-else>
                      <q-select
                        v-if="isSelected(props.row.id)"
                        :model-value="getRowData(props.row.id).vorlaufzeit"
                        @update:model-value="(val) => setRowField(props.row.id, 'vorlaufzeit', val)"
                        :options="vorlaufOptions"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        dense
                        outlined
                        style="min-width: 140px"
                      />
                    </template>
                  </div>
                </q-td>
              </template>

              <template #body-cell-gehalten="props">
                <q-td :props="props" @click.stop>
                  <div :style="{ visibility: isVisibleRow(props.row.id) ? 'visible' : 'hidden' }">
                    <template v-if="assignedIds.has(props.row.id)">
                      <q-badge
                        :label="rowAssignData[props.row.id]?.lectureGehalten_anName || '—'"
                      />
                    </template>
                    <template v-else>
                      <q-select
                        v-if="isSelected(props.row.id)"
                        :model-value="getRowData(props.row.id).gehalten_anId"
                        @update:model-value="
                          (val) => setRowField(props.row.id, 'gehalten_anId', val)
                        "
                        :options="lectureStore.mappings.gehalten_an"
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        dense
                        outlined
                        style="min-width: 140px"
                      />
                    </template>
                  </div>
                </q-td>
              </template>
            </q-table>

            <q-infinite-scroll
              v-if="totalAllProfessors !== allProfessors.length"
              :scroll-target="dialogScrollRef"
              :offset="250"
              @load="onLoadDialog"
            >
              <template v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
            <div v-else class="full-width text-center text-body2 text-grey-6 q-my-sm">
              {{ allProfessors.length }} / {{ totalAllProfessors }} Einträge
            </div>
          </div>

          <div class="row items-center q-px-lg q-py-md">
            <div class="col column q-ml-sm">
              <div class="text-caption text-grey-6">
                <span class="text-green-7 text-weight-bold">{{ newlyAdded.length }}</span> Neu
                hinzugefügt
              </div>
              <div class="text-caption text-grey-6">
                <span class="text-red-7 text-weight-bold">{{ newlyRemoved.length }}</span> Entfernt
              </div>
            </div>
            <div class="col-auto row q-gutter-md">
              <q-btn
                outline
                color="grey-7"
                label="Abbrechen"
                rounded
                padding="10px 30px"
                style="font-family: Inter, sans-serif"
                @click="cancelForm"
              />
              <div>
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
              </div>
            </div>
            <div class="col row justify-end">
              <q-btn
                flat
                dense
                size="sm"
                color="grey-7"
                icon="restart_alt"
                label="Reset"
                style="font-family: Inter, sans-serif"
                @click="confirmReset"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="person_add" color="light-blue-9" @click="openDialog" />
  </q-page-sticky>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getAvatarColor, getDozStatusColor } from 'src/utils/lecturerHelper'
import { useLectureStore } from 'src/stores/lecture-store'
import { useProfessorStore } from 'src/stores/professor-store'

const route = useRoute()
const quasar = useQuasar()
const loading = ref(false)

let lectureId = route.params.id

const lectureStore = useLectureStore()
const professorStore = useProfessorStore()

const lectureProfessors = computed(() => professorStore.lectureProfessors)
const totalLectureProfessors = computed(() => professorStore.totalLectureProfessors)
const professorFilters = professorStore.lectureFilters

const lecture = ref({})

// --- Dialog State ---
const showDialog = ref(false)
const dialogScrollRef = ref(null)
const allProfessors = computed(() => professorStore.professors)
const totalAllProfessors = computed(() => professorStore.totalProfessors)
const selectedProfessors = ref([])
const assignedIds = ref(new Set())
const rowAssignData = reactive({})

const isSelected = (id) => selectedProfessors.value.some((p) => p.id === id)
const isVisibleRow = (id) => isSelected(id) || assignedIds.value.has(id)

const formatPreference = (pref) => {
  if (!pref) return 'Alles' // Fallback
  const p = String(pref).toUpperCase()
  if (p === 'A' || p === 'ALLES') return 'Alles'
  if (p === 'B' || p === 'BACHELOR') return 'Bachelor'
  if (p === 'M' || p === 'MASTER') return 'Master'
  return pref
}

const vorlaufOptions = [
  { label: 'Sofort Bereit', value: 'S' },
  { label: 'Bis 4 Wochen', value: '4' },
  { label: '4 Wochen +', value: 'M' },
]

const formatVorlaufzeit = (val) => {
  const opt = vorlaufOptions.find((o) => o.value === val)
  return opt ? opt.label : val || '—'
}

watch(
  () => route.params.id,
  async () => {
    lectureId = route.params.id
    await loadLecture()
    professorStore.clearLectureProfessors()
    await professorStore.loadLectureProfessors(lectureId)
  },
)

onMounted(async () => {
  loading.value = true

  await loadLecture()
  await professorStore.loadLectureProfessors(lectureId)

  loading.value = false
})

async function loadLecture() {
  const result = await lectureStore.getLectureById(lectureId)
  if (result) {
    lecture.value = result
  }
}

async function loadMore() {
  professorFilters.offset += professorFilters.limit
  await professorStore.loadLectureProfessors(lectureId)
}

async function onLoad(index, done) {
  await loadMore()
  done()
}

// --- Dialog Logic ---
const openDialog = async () => {
  professorStore.clearProfessors()
  professorStore.filters.offset = 0

  // load professors and mappings in parallel
  await Promise.all([professorStore.loadProfessors(), lectureStore.loadMappings()])

  // use a map for efficient lookups of assigned professors
  const assignedProfMap = new Map(professorStore.lectureProfessors.map((p) => [p.id, p]))
  assignedIds.value = new Set(assignedProfMap.keys())

  // pre-select already assigned professors
  selectedProfessors.value = [...professorStore.lectureProfessors]

  // Pre-fill row data for already assigned professors from the detailed data
  professorStore.lectureProfessors.forEach((prof) => {
    rowAssignData[prof.id] = makeRowData({
      lectureGehalten_anName: prof.lectureGehalten_anName,
      lectureVorlaufzeit: prof.lectureVorlaufzeit,
    })
  })

  // Ensure a row data object exists for all professors loaded into the dialog table
  allProfessors.value.forEach((prof) => {
    if (!rowAssignData[prof.id]) {
      rowAssignData[prof.id] = makeRowData()
    }
  })

  showDialog.value = true
}

const assignColumns = [
  {
    name: 'selected',
    align: 'center',
    label: '',
    field: 'id',
    style: 'width: 48px; min-width: 48px',
  },
  {
    name: 'name',
    align: 'left',
    label: 'Name',
    field: (row) => `${row.vorname} ${row.name}`,
    sortable: true,
  },
  {
    name: 'status',
    align: 'center',
    label: 'Status',
    field: 'professorStatus',
    sortable: true,
  },
  {
    name: 'vorliebe',
    align: 'center',
    label: 'Vorliebe',
    field: 'preference',
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

function getRowData(id) {
  if (!rowAssignData[id]) {
    rowAssignData[id] = makeRowData()
  }
  return rowAssignData[id]
}

function setRowField(id, field, value) {
  getRowData(id)[field] = value
}

const makeRowData = (overrides = {}) => ({
  gehalten_anId: null,
  vorliebeId: null,
  vorlaufzeit: null,
  lectureGehalten_anName: '',
  lectureVorlaufzeit: '',
  ...overrides,
})

const toggleRow = (row) => {
  const idx = selectedProfessors.value.findIndex((p) => p.id === row.id)
  if (idx >= 0) {
    selectedProfessors.value.splice(idx, 1)
  } else {
    selectedProfessors.value.push(row)
  }
}

async function onLoadDialog(index, done) {
  professorStore.filters.offset += professorStore.filters.limit
  await professorStore.loadProfessors()
  // Ensure new professors have a rowData entry
  allProfessors.value.forEach((prof) => {
    if (!rowAssignData[prof.id]) {
      rowAssignData[prof.id] = makeRowData()
    }
  })
  done()
}

const newlyAdded = computed(() => {
  return selectedProfessors.value.filter((p) => !assignedIds.value.has(p.id))
})

const newlyRemoved = computed(() => {
  return [...assignedIds.value].filter((id) => !selectedProfessors.value.some((p) => p.id === id))
})

const hasChanges = computed(() => {
  return newlyAdded.value.length > 0 || newlyRemoved.value.length > 0
})

function resetAssignmentForm() {
  selectedProfessors.value = [...professorStore.lectureProfessors]
  Object.keys(rowAssignData).forEach((key) => delete rowAssignData[key])

  professorStore.lectureProfessors.forEach((prof) => {
    rowAssignData[prof.id] = makeRowData({
      lectureGehalten_anName: prof.lectureGehalten_anName,
      lectureVorlaufzeit: prof.lectureVorlaufzeit,
    })
  })

  allProfessors.value.forEach((prof) => {
    if (!rowAssignData[prof.id]) {
      rowAssignData[prof.id] = makeRowData()
    }
  })
}

function confirmReset() {
  quasar
    .dialog({
      title: 'Reset bestätigen',
      message: 'Möchtest du alle Änderungen im Dialog zurücksetzen?',
      cancel: { label: 'Abbrechen', flat: true, color: 'grey-7' },
      ok: { label: 'Reset', color: 'negative' },
      persistent: true,
    })
    .onOk(() => {
      resetAssignmentForm()
    })
}

const cancelForm = () => {
  showDialog.value = false
}

const submitAssignment = async () => {
  const toAssign = newlyAdded.value.map((p) => ({
    professorId: p.id,
    lectureId: Number(lectureId),
    gehalten_anId: rowAssignData[p.id]?.gehalten_anId ?? null,
    vorliebeId: rowAssignData[p.id]?.vorliebeId ?? null,
    vorlaufzeit: rowAssignData[p.id]?.vorlaufzeit ?? null,
  }))

  const toRemove = newlyRemoved.value.map((id) => ({
    professorId: id,
    lectureId: Number(lectureId),
  }))

  const errors = []

  for (const assignment of toAssign) {
    try {
      await professorStore.assignLectureToProfessor(assignment)
    } catch {
      errors.push({ type: 'assign', professorId: assignment.professorId })
    }
  }

  for (const removal of toRemove) {
    try {
      await professorStore.removeLectureFromProfessor(removal.professorId, removal.lectureId)
    } catch {
      errors.push({ type: 'remove', professorId: removal.professorId })
    }
  }

  professorStore.clearLectureProfessors()
  await professorStore.loadLectureProfessors(lectureId)

  if (errors.length > 0) {
    quasar.notify({
      type: 'negative',
      message: 'Fehler beim Zuweisen/Entfernen von Dozenten!',
    })
  } else {
    quasar.notify({
      type: 'positive',
      message: 'Dozenten erfolgreich zugewiesen/entfernt!',
    })
  }

  showDialog.value = false
}
</script>

<style scoped>
.lecture-card {
  border-radius: 8px;
}
</style>
