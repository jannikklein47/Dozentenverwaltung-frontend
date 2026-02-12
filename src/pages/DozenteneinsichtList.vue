<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Table with data -->
    <q-table
      flat
      bordered
      :rows="lecturers"
      :columns="columns"
      row-key="titel"
      hide-bottom
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
  </q-page>

  <!-- Floating Action Button -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="person_add" color="light-blue-9" @click="addNewLecturer" />
  </q-page-sticky>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getDozStatus, getDozStatusColor, getPreference } from 'src/utils/lecturerHelper'

const router = useRouter()

//Definition of columns for the table
const columns = [
  { name: 'titel', align: 'left', label: 'Titel', field: 'title', sortable: true },
  {
    name: 'name',
    align: 'left',
    label: 'Name',
    field: 'name',
    sortable: true,
  },
  { name: 'status', align: 'center', label: 'Status', field: 'dozStatusID', sortable: true },
  { name: 'email', align: 'left', label: 'E-Mail-Adresse', field: 'email', sortable: true },
  {
    name: 'telefon',
    align: 'left',
    label: 'Telefonnummer',
    style: 'font-weight: bold',
    field: 'phone',
    sortable: true,
  },
  { name: 'vorlesungen', align: 'left', label: 'Vorlesungen', field: 'lecturesShort' },
  {
    name: 'vorlieben',
    align: 'left',
    label: 'Vorlieben',
    field: 'preferenceID',
    sortable: true,
  },
]

const lecturers = [
  {
    dozID: 1,
    title: 'Dr.',
    lastName: 'Gunther',
    firstName: 'Ralf',
    dozStatusID: 2,
    email: 'ralf.gunther@test-hochschule.de',
    phone: '+49 176 12345678',
    preferenceID: 0,
    prioBachelor: 1,
    prioMaster: 1,
    lecturesShort: ['GDI', 'ADS', 'NuVS'],
  },
]

const onRowClick = (evt, row) => {
  console.log('Row clicked:', row)
  router.push(`/dozenten/details/${row.dozID}`)
}
</script>
