<template>
  <q-page class="q-pa-md">
    <q-card flat class="bg-white">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
        :loading="loading"
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
              style="min-width: 100px; justify-content: center; border-radius: 12px;"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const rows = ref([])
const loading = ref(false)

const fetchVorlesungen = async () => {
  loading.value = true
  try {
    // URL zur 'Vorlesungen' DB im Backend
    const response = await axios.get('http://localhost:3000/api/v1.0/app/lectures')

    // Wir mappen die Backend-Struktur (lectures: rows) auf unser Tabellen-Format
    rows.value = response.data.lectures.map(v => {
      // Hilfsfunktion für Initialen (Vorname + Name)
      const getInitials = (p) => {
        return `${p.vorname?.charAt(0) || ''}${p.name?.charAt(0) || ''}`.toUpperCase()
      }

      // TODO: Richtigen Kürzel einfügen, solbald dieser übergeben wird
      return {
        id: v.id,
        kuerzel: v.name.substring(0, 4), // Da noch kein Kürzel im Backend existiert, nehmen wir die ersten 4 Buchstaben
        bezeichnung: v.name,
        offen: v.lectureStatus?.name || 'Unbekannt',
        art: v.completionType?.name || 'N/A',
        semester: v.semester,
        // Generiert Initialen 
        dozenten: v.professors ? v.professors.map(p => getInitials(p)) : []
      }
    })
  } catch (error) {
    console.error('Fehler beim Laden der Vorlesungen:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVorlesungen()
})

const onRowClick = (evt, row) => {
  router.push(`/vorlesungen/details/${row.id}`)
}

// TODO: Use the getAvatarColor() function to generate deterministic colors based on the initials
const getAvatarColor = (initials) => {
  const map = {
    'EH': 'bg-blue', 'FV': 'bg-brown', 'HP': 'bg-green',
    'VS': 'bg-blue-grey', 'JD': 'bg-teal'
  }
  return map[initials] || 'bg-grey-7'
}

const columns = [
  { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
  { name: 'bezeichnung', align: 'left', label: 'Bezeichnung', field: 'bezeichnung', sortable: true, style: 'font-weight: 500' },
  { name: 'offen', align: 'center', label: 'Offen', field: 'offen', sortable: true },
  { name: 'art', align: 'left', label: 'Art', field: 'art' },
  { name: 'semester', align: 'center', label: 'Semester', field: 'semester', sortable: true },
  { name: 'dozenten', align: 'left', label: 'Dozenten', field: 'dozenten' }
]
</script>