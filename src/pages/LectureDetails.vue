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
                class="text-weight-bold text-white"
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
                <q-badge color="grey-6" :label="d_item.preference?.name" />
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Vorlaufzeit für diese Vorlesung:</span>
                <q-space />
                <q-badge color="grey-6" :label="d_item.lectureVorlaufzeit" />
              </div>
              <q-separator class="q-my-md" />
              <div style="display: flex">
                <span class="text-weight-medium text-grey-7">Erfahrung in dieser Vorlesung:</span>
                <q-space />
                <q-badge color="grey-6" :label="d_item.lectureGehalten_anName" />
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
                  class="text-weight-bold q-mr-xs q-mt-sm"
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAvatarColor } from 'src/utils/lecturerHelper'
import { useLectureStore } from 'src/stores/lecture-store'
import { useProfessorStore } from 'src/stores/professor-store'

const route = useRoute()
const loading = ref(false)

let lectureId = route.params.id

const lectureStore = useLectureStore()
const professorStore = useProfessorStore()

const lectureProfessors = computed(() => professorStore.lectureProfessors)
const totalLectureProfessors = computed(() => professorStore.totalLectureProfessors)
const professorFilters = professorStore.lectureFilters

const lecture = ref({})

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
  await professorStore.loadLectureProfessors()
}

async function onLoad(index, done) {
  await loadMore()
  done()
}
</script>

<style scoped>
.lecture-card {
  border-radius: 8px;
}
</style>
