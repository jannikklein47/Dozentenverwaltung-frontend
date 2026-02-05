<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header for information about lecturer -->
    <q-card bordered class="q-mb-lg">
      <q-card-section class="row no-wrap items-center q-pa-none">
        <!-- Dozent -->
        <div class="col-3 q-pa-md">
          <div class="row items-center q-gutter-x-md">
            <!-- Have to use style to set text and background color as quasar does not support hex values by default -->
            <q-avatar
              class="text-weight-bold"
              size="56px"
              :style="{
                fontFamily: 'Inter, sans-serif',
                backgroundColor: getDozentenProfilePic(lecturer.dozID),
              }"
            >
              {{ getDozentenInitials(lecturer.firstName, lecturer.lastName) }}
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
                  >{{ lecturer.title }} {{ lecturer.firstName }} {{ lecturer.lastName }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <q-separator vertical />

        <!-- Bereich -->
        <div class="col-1 text-center">
          <div
            class="text-caption text-grey-6 text-center q-mb-xs text-weight-bold"
            style="letter-spacing: 3px"
          >
            Bereich
          </div>
          <div class="flex flex-center">
            <q-badge
              rounded
              color="light-blue"
              :label="getDozStatus(lecturer.dozStatusID)"
              class="q-px-sm q-py-xs"
            />
          </div>
        </div>

        <q-separator vertical class="self-stretch" />

        <!-- Vorliebe -->
        <div class="col-3 q-pa-md text-center">
          <div
            class="text-caption text-grey-6 q-mb-xs text-weight-bold"
            style="letter-spacing: 3px"
          >
            Allgemeine Vorliebe
          </div>
          <q-badge
            color="grey-6"
            rounded
            :label="getPreference(lecturer.preferenceID)"
            class="q-px-md q-py-xs"
          />
        </div>

        <q-separator vertical />

        <!-- Rechter Bereich: Kontakt -->
        <div class="col-3 q-pa-md flex justify-center">
          <div>
            <div
              class="text-caption text-grey-6 q-mb-xs text-weight-bold text-left"
              style="letter-spacing: 3px"
            >
              Kontakt
            </div>
            <div class="text-weight-bold text-body2 text-left">{{ lecturer.email }}</div>
            <div class="text-weight-bold text-body2 text-left">{{ lecturer.phone }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Trenner mit Titel -->
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-grey-8 text-weight-bold q-mr-md" style="letter-spacing: 1px">
        Vorlesungen
      </div>
      <q-separator class="col" color="grey-4" />
    </div>

    <!-- 2. Datentabelle -->
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="kuerzel"
      hide-bottom
      class="text-grey-8 text-weight-bold"
      font-size="16px"
      :style="{
        fontFamily: 'Inter, sans-serif',
      }"
    >
      <!-- Slot for Status -->
      <template #body-cell-offen="props">
        <q-td :props="props">
          <q-badge
            :color="props.value ? 'green-7' : 'red-8'"
            text-color="white"
            rounded
            class="q-px-md q-py-xs text-weight-bold"
            :label="props.value ? 'Offen' : 'Geschlossen'"
          />
        </q-td>
      </template>

      <!-- Slot for lead time -->
      <template #body-cell-vorlauf="props">
        <q-td :props="props">
          <q-badge
            rounded
            :color="getVorlaufColor(props.value)"
            text-color="white"
            class="q-px-md q-py-xs full-width justify-center"
            :label="props.value"
            style="min-width: 100px"
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
  </q-page>
</template>

<script setup>
const lecturer = {
  //TODO feed with data from backend
  dozID: 1,
  title: 'Dr.',
  lastName: 'Volk',
  firstName: 'Florian',
  dozStatusID: 1,
  email: 'florian.volk@provadis-hochschule.de',
  phone: '+49 176 12345678',
  preferenceID: 0,
  prioBachelor: 1,
  prioMaster: 1,
}

const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  {
    name: 'bezeichnung',
    align: 'left',
    label: 'Bezeichnung',
    field: 'bezeichnung',
    sortable: true,
  },
  { name: 'offen', align: 'center', label: 'Offen', field: 'offen', sortable: true },
  { name: 'art', align: 'center', label: 'Art', field: 'art', sortable: true },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  {
    name: 'vorliebe',
    align: 'left',
    label: 'Vorliebe',
    style: 'font-weight: bold',
    field: 'vorliebe',
    sortable: true,
  },
  { name: 'vorlauf', align: 'center', label: 'Vorlauf', field: 'vorlauf' },
  {
    name: 'gehalten',
    align: 'center',
    label: 'Bereits gehalten',
    field: 'gehalten',
    sortable: true,
  },
]

const rows = [
  {
    kuerzel: 'GDI',
    bezeichnung: 'Grundlagen der Informatik',
    offen: true,
    art: 'Bachelor',
    semester: 1,
    vorliebe: 'Egal',
    vorlauf: 'Sofort Bereit',
    gehalten: 'Intern & Extern',
  },
  {
    kuerzel: 'ADS',
    bezeichnung: 'Algorithmen und Datenstrukturen',
    offen: true,
    art: 'Bachelor',
    semester: 2,
    vorliebe: 'Bachelor',
    vorlauf: '4 Wochen',
    gehalten: 'Extern',
  },
  {
    kuerzel: 'NuVS',
    bezeichnung: 'Netze und Verteilte Systeme',
    offen: false,
    art: 'Bachelor',
    semester: 3,
    vorliebe: 'Egal',
    vorlauf: '2 Monate',
    gehalten: 'Gar nicht',
  },
]

const getVorlaufColor = (val) => {
  if (val.includes('Sofort Bereit')) return 'green-7'
  if (val.includes('Wochen')) return 'amber-8'
  return 'red-7'
}

const getGehaltenColor = (val) => {
  if (val.includes('Intern')) return 'blue-7'
  if (val.includes('Extern')) return 'amber-9'
  return 'grey-10'
}

const getPreference = (preferenceID) => {
  //Temporary function until we have the actual preference from the backend, then we can adjust it according to its ID
  //TODO: adjust the return values
  if (preferenceID === 1) return 'Bachelor'
  if (preferenceID === 2) return 'Master'
  return 'Alle Vorlesungen'
}

const getDozStatus = (statusID) => {
  //Temporary function until we have the actual status from the backend, then we can adjust it accordingly
  //TODO: adjust the return values
  if (statusID === 1) return 'Intern'
  if (statusID === 2) return 'Extern'
  return 'Unbekannt'
}

const getAvatarColor = (id) => {
  const strId = id.toString()
  let hash = 0
  for (let i = 0; i < strId.length; i++) {
    const char = strId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash | 0 // Convert to 32-bit integer
  }
  const colors = [
    '#d32f2f', // red
    '#f57c00', // orange
    '#fbc02d', // yellow (darker)
    '#689f38', // green
    '#00897b', // teal
    '#0288d1', // blue
    '#1976d2', // dark blue
    '#5e35b1', // purple
    '#8e24aa', // deep purple
    '#c2185b', // pink
    '#d84315', // deep orange
    '#6d4c41', // brown
  ]
  return colors[Math.abs(hash) % colors.length]
}

const getDozentenProfilePic = (id) => {
  if (!id) return '#9a9a9aff' // default color
  return getAvatarColor(id)
}

const getDozentenInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}
</script>
