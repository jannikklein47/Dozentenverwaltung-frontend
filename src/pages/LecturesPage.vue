<template>
  <q-page class="q-pa-md">
    <q-card flat class="bg-white">
      <q-table
        :rows="staticRows"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
        class="dozenten-table"
        @row-click="onRowClick"
      >
        <template v-slot:body-cell-offen="props">
          <q-td :props="props">
            <q-chip
              :color="props.value === 'Geschlossen' ? 'brown-9' : 'green-6'"
              text-color="white"
              dense
              class="text-weight-bold q-px-sm"
              square
              style="min-width: 100px; justify-content: center; border-radius: 12px"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-dozenten="props">
          <q-td :props="props">
            <div class="row q-gutter-x-xs no-wrap">
              <q-avatar
                v-for="(initials, index) in props.value"
                :key="index"
                size="28px"
                :class="getAvatarColor(initials)"
                class="text-white text-caption text-weight-bold"
              >
                {{ initials }}
              </q-avatar>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Statische Beispieldaten
const staticRows = [
  {
    id: 1,
    kuerzel: 'PROG',
    bezeichnung: 'Programmierung I',
    offen: 'Offen',
    art: 'Klausur',
    semester: 1,
    dozenten: ['EH', 'FV'],
  },
  {
    id: 2,
    kuerzel: 'DATA',
    bezeichnung: 'Datenbanken',
    offen: 'Geschlossen',
    art: 'Projekt',
    semester: 2,
    dozenten: ['HP'],
  },
  {
    id: 3,
    kuerzel: 'NETZ',
    bezeichnung: 'Netzwerktechnik',
    offen: 'Offen',
    art: 'Klausur',
    semester: 3,
    dozenten: ['VS', 'JD'],
  },
]

const onRowClick = (evt, row) => {
  router.push(`/vorlesungseinsicht/details/${row.id}`)
}

const getAvatarColor = (initials) => {
  const map = {
    EH: 'bg-blue',
    FV: 'bg-brown',
    HP: 'bg-green',
    VS: 'bg-blue-grey',
    JD: 'bg-teal',
  }
  return map[initials] || 'bg-grey-7'
}

const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  {
    name: 'bezeichnung',
    align: 'left',
    label: 'Bezeichnung',
    field: 'bezeichnung',
    sortable: true,
    style: 'font-weight: 500',
  },
  { name: 'offen', align: 'center', label: 'Offen', field: 'offen', sortable: true },
  { name: 'art', align: 'left', label: 'Art', field: 'art' },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  { name: 'dozenten', align: 'left', label: 'Dozenten', field: 'dozenten' },
]
</script>
