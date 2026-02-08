<template>
  <q-page class="q-pa-md">
    <q-card flat class="bg-white">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
        class="dozenten-table"
      >
        <template v-slot:body-cell-offen="props">
          <q-td :props="props">
            <q-chip
              :color="props.value === 'Geschlossen' ? 'brown-9' : 'green-6'"
              text-color="white"
              dense
              class="text-weight-bold q-px-sm"
              square
              style="min-width: 100px; justify-content: center; border-radius: 12px;"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:header-cell-semester="props">
          <q-th :props="props">
            <q-icon name="arrow_downward" size="xs" class="q-mr-xs" />
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body-cell-dozenten="props">
          <q-td :props="props">
            <div class="row q-gutter-x-xs no-wrap">
              <q-avatar
                v-for="(dozent, index) in props.value"
                :key="index"
                size="28px"
                :class="getAvatarColor(dozent)"
                class="text-white text-caption text-weight-bold"
              >
                {{ dozent }}
              </q-avatar>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
// Hier kommen die Daten und die spezifische Logik der Seite rein
const getAvatarColor = (initials) => {
  const map = {
    'EH': 'bg-blue',
    'FV': 'bg-brown',
    'HP': 'bg-green',
    'VS': 'bg-blue-grey',
    'JD': 'bg-teal'
  }
  return map[initials] || 'bg-grey'
}

const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  { name: 'bezeichnung', align: 'left', label: 'Bezeichnung', field: 'bezeichnung', sortable: true, style: 'font-weight: 500' },
  { name: 'offen', align: 'center', label: 'Offen', field: 'offen', sortable: true },
  { name: 'art', align: 'left', label: 'Art', field: 'art' },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  { name: 'dozenten', align: 'left', label: 'Dozenten', field: 'dozenten' }
]

const rows = [

{ id: 1, kuerzel: 'Prog', bezeichnung: 'Programmierung', offen: 'Geschlossen', art: 'Bachelor', semester: 1, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 2, kuerzel: 'GDI', bezeichnung: 'Grundlagen der Informatik', offen: 'Offen', art: 'Bachelor', semester: 1, dozenten: ['EH', 'HP'] },

{ id: 3, kuerzel: 'MA1', bezeichnung: 'Mathematik 1', offen: 'Offen', art: 'Bachelor', semester: 1, dozenten: ['EH', 'FV', 'HP', 'VS', 'JD'] },

{ id: 4, kuerzel: 'ADS', bezeichnung: 'Algorithmen und Datenstrukturen', offen: 'Offen', art: 'Bachelor', semester: 2, dozenten: ['FV', 'VS'] },

{ id: 5, kuerzel: 'FProg', bezeichnung: 'Fortgeschrittene Programmierung', offen: 'Geschlossen', art: 'Bachelor', semester: 2, dozenten: ['HP', 'VS'] },

{ id: 6, kuerzel: 'MA2', bezeichnung: 'Mathematik 2', offen: 'Offen', art: 'Bachelor', semester: 2, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 7, kuerzel: 'BS', bezeichnung: 'Betriebssysteme', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 8, kuerzel: 'NuVS', bezeichnung: 'Netze und Verteilte Systeme', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 9, kuerzel: 'InfSich', bezeichnung: 'Informationssicherheit', offen: 'Geschlossen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 10, kuerzel: 'PrM', bezeichnung: 'Projektmanagement', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 11, kuerzel: 'PrM', bezeichnung: 'Projektmanagement', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 12, kuerzel: 'GDI', bezeichnung: 'Grundlagen der Informatik', offen: 'Offen', art: 'Bachelor', semester: 1, dozenten: ['EH', 'HP'] },

{ id: 13, kuerzel: 'MA1', bezeichnung: 'Mathematik 1', offen: 'Offen', art: 'Bachelor', semester: 1, dozenten: ['EH', 'FV', 'HP', 'VS', 'JD'] },

{ id: 14, kuerzel: 'ADS', bezeichnung: 'Algorithmen und Datenstrukturen', offen: 'Offen', art: 'Bachelor', semester: 2, dozenten: ['FV', 'VS'] },

{ id: 15, kuerzel: 'FProg', bezeichnung: 'Fortgeschrittene Programmierung', offen: 'Geschlossen', art: 'Bachelor', semester: 2, dozenten: ['HP', 'VS'] },

{ id: 16, kuerzel: 'MA2', bezeichnung: 'Mathematik 2', offen: 'Offen', art: 'Bachelor', semester: 2, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 17, kuerzel: 'BS', bezeichnung: 'Betriebssysteme', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 18, kuerzel: 'NuVS', bezeichnung: 'Netze und Verteilte Systeme', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 19, kuerzel: 'InfSich', bezeichnung: 'Informationssicherheit', offen: 'Geschlossen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },

{ id: 20, kuerzel: 'PrM', bezeichnung: 'Projektmanagement', offen: 'Offen', art: 'Bachelor', semester: 3, dozenten: ['EH', 'FV', 'HP', 'VS'] },
]

</script>

<style scoped>
.dozenten-table :deep(thead tr th) {
  font-weight: bold;
  color: #757575;
}
</style>