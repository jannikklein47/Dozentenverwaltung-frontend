<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-table
      :rows="lectures"
      :columns="columns"
      row-key="id"
      flat
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
      @row-click="onRowClick"
      :pagination="pagination"
      hide-pagination
      bordered
    >
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

      <template v-slot:body-cell-dozenten="props">
        <q-td :props="props">
          <q-avatar
            v-for="(dozent, index) in props.value"
            v-show="index < 2"
            :key="dozent.id"
            size="36px"
            :style="{
              'background-color': getAvatarColor(dozent.vorname.at(0) + dozent.name.at(0)),
              'margin-right': '-10px',
            }"
            class="text-white text-caption text-weight-bold shadow-3"
            @click.stop="$router.push(`/professors/details/${dozent.id}`)"
          >
            {{ dozent.vorname.at(0) + dozent.name.at(0) }}
            <q-tooltip class="q-pa-none" style="max-width: none">
              <q-card flat bordered style="min-width: 200px">
                <q-bar
                  :style="{
                    'background-color': getAvatarColor(dozent.vorname.at(0) + dozent.name.at(0)),
                  }"
                  >{{ dozent.vorname }} {{ dozent.name }}</q-bar
                >
                <q-card-section class="text-black">
                  <div class="text-body2 text-weight-bold">
                    <span class="text-weight-medium"> Vorlaufzeit:</span>
                    {{
                      dozent.Vorlesung_Dozent.vorlaufzeit === 'S'
                        ? 'Sofort'
                        : dozent.Vorlesung_Dozent.vorlaufzeit === 'M'
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
            v-if="props.value.length > 2"
            color="grey-3"
            text-color="black"
            class="text-weight-bold shadow-3"
          >
            +{{ props.value.length - 2 }}
            <q-tooltip class="q-pa-none" style="max-width: none">
              <q-card flat bordered>
                <q-bar class="bg-grey-9">{{ props.value.length - 2 }} weitere Dozenten</q-bar>
                <q-card-section class="text-black">
                  <div class="text-subtitle2 q-mt-md text-grey-5">Klicken für Details</div>
                </q-card-section>
              </q-card>
            </q-tooltip>
          </q-avatar>
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

    <q-dialog v-model="showDialog" no-backdrop-dismiss>
      <q-card style="min-width: 480px; border-radius: 20px" class="bg-grey-2">
        <q-card-section class="q-pt-lg q-pb-md">
          <div
            class="text-center text-weight-medium"
            style="font-size: 16px; font-family: Inter, sans-serif"
          >
            Neue Vorlesung Erstellen
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-px-lg">
          <q-form @submit="createLectureAction" class="q-gutter-sm">
            <!-- Kürzel -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Kürzel:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecture.kuerzel"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Bezeichnung -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Bezeichnung:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model="newLecture.name"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Semester -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Semester:
              </div>
              <div class="col-7">
                <q-input
                  outlined
                  rounded
                  v-model.number="newLecture.semester"
                  type="number"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  :rules="[(val) => !!val || 'Erforderlich']"
                />
              </div>
            </div>

            <!-- Abschluss -->
            <div class="row items-center q-mb-sm">
              <div class="col-5 text-grey-8 text-left" style="font-family: Inter, sans-serif">
                Abschluss:
              </div>
              <div class="col-7">
                <q-select
                  outlined
                  rounded
                  v-model="newLecture.abschluss_typId"
                  :options="completionTypeOptions"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || 'Erforderlich']"
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
                  v-model="newLecture.vorlesung_statusId"
                  :options="statusOptions"
                  dense
                  bg-color="white"
                  color="light-blue-9"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || 'Erforderlich']"
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
                label="Vorlesung erstellen"
                icon="menu_book"
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

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="menu_book" color="light-blue-9" @click="addNewLecture" />
  </q-page-sticky>
</template>

<script setup>
import { useLectureStore } from 'src/stores/lecture-store'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAvatarColor } from 'src/utils/lecturerHelper'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const pagination = ref({ rowsPerPage: 0 }) // Show all loaded rows

const router = useRouter()
const lectureStore = useLectureStore()

const lectures = computed(() => lectureStore.lectures)
const totalLectures = computed(() => lectureStore.totalLectures)
const lectureFilters = lectureStore.filters

const showDialog = ref(false)

onMounted(async () => {
  await lectureStore.loadMappings()
  lectureStore.clearLectures()
  await lectureStore.loadLectures()
})

async function loadMore() {
  lectureFilters.offset += lectureFilters.limit
  await lectureStore.loadLectures()
}

async function onLoad(index, done) {
  await loadMore()
  done()
}

const onRowClick = (evt, row) => {
  router.push(`/lectures/details/${row.id}`)
}

const newLecture = ref({
  kuerzel: '',
  name: '',
  semester: null,
  abschluss_typId: null,
  vorlesung_statusId: null,
})

const cancelForm = () => {
  showDialog.value = false

  newLecture.value = {
    kuerzel: '',
    name: '',
    semester: null,
    abschluss_typId: null,
    vorlesung_statusId: null,
  }
}

const statusOptions = computed(() => lectureStore.mappings.lectureStatus || [])
const completionTypeOptions = computed(() => lectureStore.mappings.completionType || [])

const addNewLecture = () => {
  showDialog.value = true
}

const createLectureAction = async () => {
  try {
    await lectureStore.createLecture(newLecture.value)

    lectureStore.clearLectures()
    await lectureStore.loadLectures()
    cancelForm()

    // Erfolgs-Benachrichtigung
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Vorlesung erfolgreich erstellt!',
      icon: 'check_circle',
    })
  } catch (error) {
    console.error('Create failed:', error)

    // Fehler-Benachrichtigung
    $q.notify({
      color: 'negative',
      position: 'top',
      message:
        'Fehler beim Erstellen der Vorlesung: ' +
        (error.response?.data?.title + ' | ' + error.response?.data?.message ||
          'Unbekannter Fehler'),
      icon: 'report_problem',
    })
  }
}

const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  {
    name: 'bezeichnung',
    align: 'left',
    label: 'Bezeichnung',
    field: 'name',
    sortable: true,
    style: 'font-weight: 500',
  },
  { name: 'offen', align: 'center', label: 'Offen', field: 'lectureStatus', sortable: true },
  { name: 'abschluss', align: 'left', label: 'Abschluss', field: 'completionType' },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  { name: 'dozenten', align: 'left', label: 'Dozenten', field: 'professors' },
]
</script>

<style scoped>
:deep(.q-table thead th) {
  color: black !important;
  opacity: 1 !important;
  font-weight: 600 !important;
}
</style>
