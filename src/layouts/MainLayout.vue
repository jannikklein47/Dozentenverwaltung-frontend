<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          color="primary"
          @click="toggleLeftDrawer"
        />

        <LogoComponent
          fill="var(--q-primary)"
          class="q-ml-md"
          style="width: 40px; stroke-width: 10px"
        />
        <div class="text-primary text-weight-bolder q-ml-md" style="font-size: 24px">
          Dozentenverwaltung
        </div>

        <q-separator vertical inset class="q-mx-md" />

        <div class="text-primary text-weight-bold" style="font-size: 24px; opacity: 0.6">
          {{ $route.name }}
        </div>

        <q-space />

        <q-input
          v-if="$route.name === 'lectures'"
          :label="'Nach einer Vorlesung suchen...'"
          rounded
          v-model="lectureFilters.term"
          standout="bg-white"
          dense
          style="min-width: 300px"
          input-class="text-black"
          @update:model-value="debounceApplyFilterToLectures"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-input
          v-if="$route.name === 'professorDetails'"
          :label="'Nach einer Vorlesung suchen...'"
          rounded
          v-model="lectureProfessorFilters.term"
          standout="bg-white"
          dense
          style="min-width: 300px"
          input-class="text-black"
          @update:model-value="debounceApplyFilterToProfessorLectures"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-input
          v-if="$route.name === 'professors'"
          :label="'Nach einem Dozenten suchen...'"
          rounded
          v-model="professorFilters.term"
          standout="bg-grey-4"
          dense
          style="min-width: 300px"
          input-class="text-black"
          @update:model-value="debounceApplyFilterToProfessors"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-input
          v-if="$route.name === 'lectureDetails'"
          :label="'Nach einem Dozenten suchen...'"
          rounded
          v-model="professorLectureFilters.term"
          standout="bg-grey-4"
          dense
          style="min-width: 300px"
          input-class="text-black"
          @update:model-value="debounceApplyFilterToLectureProfessors"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <q-drawer
      :model-value="true"
      :mini="!leftDrawerOpen"
      show-if-above
      style="background-color: #1e3242"
      class="text-white"
    >
      <q-list>
        <div style="display: flex; flex-direction: column; height: calc(100vh - 50px)">
          <q-item class="text-grey-5 bg-grey-2 drawer-top-element">
            <q-item-section>
              <q-item-label class="text-overline" style="position: relative; top: 9px">
                Navigation
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator dark />
          <q-item
            clickable
            tag="a"
            to="/lectures"
            :active-class="'gradient-bg force-white'"
            class="text-grey-5"
          >
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Vorlesungen </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            to="/professors"
            class="text-grey-5"
            :active-class="'gradient-bg force-white'"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Dozenten </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            tag="a"
            to="/reporting"
            class="text-grey-5"
            :active-class="'gradient-bg force-white'"
          >
            <q-item-section avatar>
              <q-icon name="ios_share" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Reporting </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            to="/manage"
            class="text-grey-5"
            :active-class="'gradient-bg force-white'"
          >
            <q-item-section avatar>
              <q-icon name="person_search" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Nutzer Verwalten </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-grey-5">
            <q-item-section>
              <q-item-label class="text-overline" style="position: relative; top: 9px">
                Filter & Aktionen
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator dark />

          <!-- Lectures Filter -->
          <q-item v-if="$route.name === 'lectures'">
            <q-item-section avatar>
              <q-icon name="flag" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureFilters.abschluss_typId"
                :options="lectureMappings.completionType"
                dark
                label="Abschluss"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'lectures'">
            <q-item-section avatar>
              <q-icon name="timer" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureFilters.vorlaufzeit"
                :options="[
                  { label: 'Sofort', value: 'S' },
                  { label: '4 Wochen', value: '4' },
                  { label: 'Mehr als 4 Wochen', value: 'M' },
                ]"
                @update:model-value="applyFilterToLectures"
                dark
                label="Vorlaufzeit"
                filled
                color="white"
                map-options
                emit-value
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'lectures'">
            <q-item-section avatar>
              <q-icon name="history" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureFilters.gehalten_anId"
                :options="lectureMappings.gehalten_an"
                dark
                label="Erfahrung"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'lectures'">
            <q-item-section avatar>
              <q-icon name="lock_open" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureFilters.vorlesung_statusId"
                :options="lectureMappings.lectureStatus"
                dark
                label="Status"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'lectures'">
            <q-item-section avatar>
              <q-icon name="stairs" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureFilters.semester"
                :options="[1, 2, 3, 4, 5, 6]"
                dark
                label="Semester"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>

          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="flag" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.abschluss_typId"
                :options="lectureMappings.completionType"
                dark
                label="Abschluss"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="timer" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.vorlaufzeit"
                :options="[
                  { label: 'Sofort', value: 'S' },
                  { label: '4 Wochen', value: '4' },
                  { label: 'Mehr als 4 Wochen', value: 'M' },
                ]"
                dark
                label="Vorlaufzeit"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="history" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.gehalten_anId"
                :options="lectureMappings.gehalten_an"
                dark
                label="Erfahrung"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="lock_open" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.vorlesung_statusId"
                :options="lectureMappings.lectureStatus"
                dark
                label="Status"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="stairs" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.semester"
                :options="[1, 2, 3, 4, 5, 6]"
                dark
                label="Semester"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item v-if="$route.name === 'professorDetails'">
            <q-item-section avatar>
              <q-icon name="center_focus_weak" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="lectureProfessorFilters.vorliebeId"
                :options="professorMappings.preference"
                dark
                label="Vorliebe des Dozenten"
                filled
                color="white"
                map-options
                emit-value
                @update:model-value="applyFilterToProfessorLectures"
                clearable
              >
              </q-select>
            </q-item-section>
          </q-item>

          <!-- Professors Filter -->

          <q-space />

          <q-item class="text-grey-5">
            <q-item-section>
              <q-item-label class="text-overline" style="position: relative; top: 9px">
                Deine Daten
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator dark />
          <q-item
            clickable
            tag="a"
            to="/profil"
            :active-class="'gradient-bg force-white'"
            class="text-grey-5"
          >
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Profil </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            to="/einstellungen"
            :active-class="'gradient-bg force-white'"
            class="text-grey-5"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium"> Einstellungen </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import LogoComponent from 'src/components/LogoComponent.vue'
import { useLectureStore } from 'src/stores/lecture-store'
import { useProfessorStore } from 'src/stores/professor-store'
import { useRoute } from 'vue-router'
import { debounce } from 'quasar'

const lectureStore = useLectureStore()
const professorStore = useProfessorStore()

const lectureFilters = lectureStore.filters
const lectureProfessorFilters = lectureStore.dozentFilters
const lectureMappings = computed(() => lectureStore.mappings)

const professorFilters = professorStore.filters
const professorLectureFilters = professorStore.lectureFilters
const professorMappings = computed(() => professorStore.mappings)

const route = useRoute()

//const professorFilters = professorStore.filters

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function applyFilterToLectures() {
  lectureStore.clearLectures()
  lectureStore.loadLectures()
}

function applyFilterToProfessorLectures() {
  const id = route.params.id
  lectureStore.clearDozentLectures()
  lectureStore.loadDozentLectures(id)
}

function applyFilterToProfessors() {
  professorStore.clearProfessors()
  professorStore.loadProfessors()
}

function applyFilterToLectureProfessors() {
  professorStore.clearDozentLectures()
  professorStore.loadLectureProfessors()
}

onMounted(() => {
  lectureStore.loadMappings()
  professorStore.loadMappings()
})

const debounceApplyFilterToLectures = debounce(applyFilterToLectures, 500)
const debounceApplyFilterToProfessorLectures = debounce(applyFilterToProfessorLectures, 500)
const debounceApplyFilterToProfessors = debounce(applyFilterToProfessors, 500)
const debounceApplyFilterToLectureProfessors = debounce(applyFilterToLectureProfessors, 500)
</script>

<style scoped lang="scss">
.gradient-bg {
  background-image: linear-gradient(to right, #008cff, #0059a3);
}
.drawer-top-element {
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 32px;
    background-color: #1e3242;
    left: 0;
    bottom: 0;
    border-top-right-radius: 6px;
  }
}
.force-white {
  color: white !important;
}
</style>
