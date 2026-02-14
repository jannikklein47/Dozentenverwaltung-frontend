<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-inner-loading :showing="loading" style="z-index: 10">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <div v-if="!loading && lecture && lecture.id">
      <q-card bordered class="q-mb-lg">
        <q-card-section class="row no-wrap items-center q-pa-none">
          <div class="col-3 q-pa-md">
            <div class="row items-center q-gutter-x-md">
              <q-avatar
                size="56px"
                class="text-weight-bold text-white"
                :style="{ backgroundColor: getAvatarColor(lecture.id) }"
              >
                {{ lecture.titel?.charAt(0) || 'V' }}
              </q-avatar>
              <div>
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="letter-spacing: 3px">Vorlesung</div>
                <div class="text-h6 text-weight-bold">{{ lecture.titel }}</div>
              </div>
            </div>
          </div>
          <q-separator vertical />
          <div class="col-2 text-center">
            <div class="text-caption text-grey-6 text-weight-bold q-mb-xs" style="letter-spacing: 3px">Status</div>
            <q-badge rounded color="light-blue" :label="lecture.statusText" class="q-px-sm" />
          </div>
          <q-separator vertical />
          <div class="col-3 text-center">
            <div class="text-caption text-grey-6 text-weight-bold q-mb-xs" style="letter-spacing: 3px">Studienstufe</div>
            <q-badge color="grey-6" rounded :label="lecture.art?.toUpperCase() || 'N/A'" class="q-px-md" />
          </div>
          <q-separator vertical />
          <div class="col-4 q-pa-md text-center">
            <div class="text-caption text-grey-6 text-weight-bold" style="letter-spacing: 3px">Semester & Info</div>
            <div class="text-weight-bold">Regelsemester: {{ lecture.semester || '-' }}</div>
            <div class="text-caption text-grey-7">{{ lecture.kuerzel || 'Kein Kürzel' }}</div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row items-center q-mb-md">
        <div class="text-h6 text-grey-8 text-weight-bold q-mr-md">Zugeordnete Dozenten</div>
        <q-separator class="col" color="grey-4" />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="d_item in assignedLecturers" :key="d_item.id" class="col-12 col-md-6">
          <q-card flat bordered class="lecture-card">
            <q-card-section class="row items-center">
              <q-avatar
                size="48px"
                class="text-weight-bold text-white"
                :style="{ backgroundColor: getAvatarColor(d_item.id || 0) }"
              >
                {{ d_item.vorname?.[0] }}{{ d_item.name?.[0] }}
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-caption text-grey-6 text-weight-bold">Dozent</div>
                <div class="text-h6 text-weight-bold">
                  {{ d_item.vorname }} {{ d_item.name }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="assignedLecturers.length === 0" class="col-12 text-center q-pa-md text-grey-6">
          Keine Dozenten zugeordnet.
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center q-pa-xl">
      <q-icon name="error_outline" color="red" size="4rem" />
      <div class="text-h6 q-mt-md">Vorlesung mit ID {{ $route.params.id }} nicht gefunden.</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const loading = ref(false)
const assignedLecturers = ref([])
const lecture = ref({})

const API_URL = 'http://localhost:3000/api/v1.0/app/lectures'

const fetchData = async (targetId) => {
  if (!targetId) return
  loading.value = true

  // Säubere die ID (entfernt Doppelpunkte etc.)
  const idToFind = parseInt(String(targetId).replace(':', ''))

  try {
    // Da kein Einzel-Endpunkt existiert, laden wir die Liste
    const response = await axios.get(API_URL)
    const allLectures = response.data.lectures || []

    // Suche die spezifische Vorlesung im Array
    const found = allLectures.find(l => l.id === idToFind)

    if (found) {
      lecture.value = {
        id: found.id,
        kuerzel: found.name?.substring(0, 4),
        titel: found.name,
        statusText: found.lectureStatus?.name || 'Offen',
        art: found.completionType?.name || 'N/A',
        semester: found.semester
      }

      // Professoren mappen
      assignedLecturers.value = found.professors || []
    } else {
      lecture.value = {}
    }
  } catch (error) {
    console.error("Fehler beim Laden:", error)
  } finally {
    loading.value = false
  }
}

// Überwachung der Route bei Wechsel (z.B. von /details/2 auf /details/3)
watch(() => route.params.id, (newId) => fetchData(newId))

onMounted(() => {
  fetchData(route.params.id)
})

const getAvatarColor = (id) => {
  const colors = ['#d32f2f', '#f57c00', '#689f38', '#0288d1', '#7b1fa2']
  return colors[id % colors.length]
}
</script>

<style scoped>
.lecture-card { border-radius: 8px; }
</style>