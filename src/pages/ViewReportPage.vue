<template>
  <q-page class="q-pa-md bg-grey-2" v-if="report === '1'">
    <q-btn label="download" @click="exportToPDF" />
    <div class="q-mb-lg">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          <q-item class="q-pa-none">
            <q-icon name="book" class="q-ma-md" size="md" />
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold q-py-sm">
                Gehaltene Vorlesungen an der Provadis
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="text-grey-7 text-weight-medium">
          Dozierende inkl. Bachelor/Master-Vorlesungen, die bereits an der Provadis-Hochschule
          unterrichtet haben.
        </q-card-section>
      </q-card>
    </div>
    <q-table
      id="reportTable"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
      row-key="dozID"
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
      font-size="16px"
      :style="{
        fontFamily: 'Inter, sans-serif',
      }"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="$router.push(`/professors/details/${props.row.id}`)"
          class="cursor-pointer report-row"
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <q-badge
              v-if="col.name === 'status'"
              :color="getDozStatusColor(col.value.name)"
              text-color="white"
              rounded
              class="q-px-md q-py-xs text-weight-bold"
              :label="col.value.name"
            />
            <q-badge
              v-else-if="col.name === 'vorlieben'"
              color="grey-6"
              text-color="white"
              rounded
              class="q-px-md q-py-xs text-weight-bold q-mr-xs"
              :label="col.value.name"
            />

            <span v-else>{{ col.value }}</span>
          </q-td>
        </q-tr>
        <q-tr :props="props" class="report-row">
          <q-td colspan="100%">
            <div class="q-pa-sm">
              <div class="q-mb-sm text-weight-medium">
                Vorlesungen von {{ props.row.titel }} {{ props.row.vorname }}
                {{ props.row.name }} an der Provadis
              </div>
              <q-table
                dense
                flat
                bordered
                square
                :rows="props.row.lectures"
                :columns="columns2"
                hide-pagination
                :pagination="{ rowsPerPage: 0 }"
                @row-click="(evt, row) => $router.push(`/lectures/details/${row.id}`)"
              >
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-page class="q-pa-md bg-grey-2" v-if="report === '2'">
    <div class="q-mb-lg">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          <q-item class="q-pa-none">
            <q-icon name="book" class="q-ma-md" size="md" />
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold q-py-sm">
                Externe Erfahrung
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="text-grey-7 text-weight-medium">
          Liste aller Dozenten und aller Vorlesungen, die der Dozierende halten kann, aber noch nie
          an der Provadis Hochschule gehalten hat
        </q-card-section>
      </q-card>
    </div>
    <q-table
      id="reportTable"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
      row-key="dozID"
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
      font-size="16px"
      :style="{
        fontFamily: 'Inter, sans-serif',
      }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <q-badge
              v-if="col.name === 'status'"
              :color="getDozStatusColor(col.value.name)"
              text-color="white"
              rounded
              class="q-px-md q-py-xs text-weight-bold"
              :label="col.value.name"
            />
            <q-badge
              v-else-if="col.name === 'vorlieben'"
              color="grey-6"
              text-color="white"
              rounded
              class="q-px-md q-py-xs text-weight-bold q-mr-xs"
              :label="col.value.name"
            />

            <span v-else>{{ col.value }}</span>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td colspan="100%">
            <div class="q-pa-sm">
              <div class="q-mb-sm text-weight-medium">
                Vorlesungen von {{ props.row.titel }} {{ props.row.vorname }}
                {{ props.row.name }} ohne Provadis-Erfahrung
              </div>
              <q-table
                dense
                flat
                bordered
                square
                :rows="props.row.lectures"
                :columns="columns2"
                hide-pagination
                :pagination="{ rowsPerPage: 0 }"
              >
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-page class="q-pa-md bg-grey-2" v-if="report === '3'">
    <div class="q-mb-md">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          <q-item class="q-pa-none">
            <q-icon name="book" class="q-ma-md" size="md" />
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold q-py-sm">
                Vorlesungen ohne Dozierende
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="text-grey-7 text-weight-medium">
          Liste aller Lehrveranstaltungen ohne bekannte Dozierende.
        </q-card-section>
      </q-card>
    </div>

    <q-table
      id="reportTable"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
      :pagination="{ rowsPerPage: 0 }"
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
    </q-table>
  </q-page>

  <q-page class="q-pa-md bg-grey-2" v-if="report === '4'">
    <div class="q-mb-lg">
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          <q-item class="q-pa-none">
            <q-icon name="book" class="q-ma-md" size="md" />
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold q-py-sm">
                Ausschließlich Extern gehaltene Vorlesungen
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="text-grey-7 text-weight-medium">
          Liste aller Vorlesungen, für die es nur Dozenten gibt, welche diese noch nie an der
          Provadis Hochschule, aber an anderen Hochschulen gehalten haben.
        </q-card-section>
      </q-card>
    </div>

    <q-table
      id="reportTable"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      table-header-class="text-black text-weight-bolder"
      table-class="text-grey-8"
      class="text-weight-bold"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
      bordered
      @row-click="(evt, row) => router.push(`/lectures/details/${row.id}`)"
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
    </q-table>
  </q-page>
</template>

<script setup>
import { getDozStatusColor } from 'src/utils/lecturerHelper'
import { api } from 'src/boot/axios'
import { useProfessorStore } from 'src/stores/professor-store'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'

const router = useRouter()

const rows = ref([])
const columns = ref([])
const columns2 = ref([])
const report = ref(null)

const professorStore = useProfessorStore()

import autoTable from 'jspdf-autotable'

const exportToPDF = () => {
  const data = rows.value

  const flattened = []
  data.forEach((row) => {
    flattened.push({ professor: { ...row, lectures: undefined }, lectures: row.lectures })
  })

  const doc = new jsPDF()

  let currentY = 10 // starting position

  flattened.forEach((entry, index) => {
    const { professor, lectures } = entry

    const showHeader = index === 0

    // --- 1. PROFESSOR TABLE ---
    autoTable(doc, {
      startY: currentY,

      head: showHeader ? [['Titel', 'Name', 'Status', 'Email', 'Telefon', 'Vorliebe']] : undefined,

      body: [
        [
          professor.titel,
          professor.vorname + ' ' + professor.name,
          professor.professorStatus.name,
          professor.email,
          professor.telefonnummer,
          professor.preference.name,
        ],
      ],

      styles: {
        fontStyle: 'bold',
      },
    })

    // Update Y position after professor table
    currentY = doc.lastAutoTable.finalY + 3

    // --- 2. LECTURES TABLE ---
    autoTable(doc, {
      startY: currentY,

      head: [['Kürzel', 'Name']],

      body: lectures.map((l) => [l.kuerzel, l.name]),

      styles: {
        cellPadding: 2,
      },

      margin: { left: 30 }, // indentation for hierarchy
    })

    // Update Y position after lectures
    currentY = doc.lastAutoTable.finalY + 10

    // Optional: page break safety
    if (currentY > 270) {
      doc.addPage()
      currentY = 10
    }
  })

  doc.save('professors.pdf')
}

onMounted(async () => {
  report.value = router.currentRoute.value.params.id
  if (report.value === '1') {
    try {
      const result = await api.get('/app/reports/professors/with-provadis-lectures')
      const data = result.data
      rows.value = data.professors
      columns.value = [
        { name: 'title', align: 'left', label: 'Titel', field: 'titel', sortable: true },
        {
          name: 'profName',
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
        { name: 'email', align: 'left', label: 'E-Mail-Adresse', field: 'email', sortable: true },
        {
          name: 'telefon',
          align: 'left',
          label: 'Telefonnummer',
          field: 'telefonnummer',
          sortable: true,
        },
        {
          name: 'vorlieben',
          align: 'left',
          label: 'Vorliebe',
          field: 'preference',
        },
      ]
      columns2.value = [
        { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
        {
          name: 'bezeichnung',
          align: 'right',
          label: 'Bezeichnung',
          field: 'name',
          sortable: true,
          style: 'font-weight: 500',
        },
      ]
    } catch (error) {
      console.error(error)
    }
  }
  if (report.value === '2') {
    try {
      await professorStore.loadProfessors()
      rows.value = professorStore.professors
      columns.value = [
        { name: 'title', align: 'left', label: 'Titel', field: 'titel', sortable: true },
        {
          name: 'profName',
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
        { name: 'email', align: 'left', label: 'E-Mail-Adresse', field: 'email', sortable: true },
        {
          name: 'telefon',
          align: 'left',
          label: 'Telefonnummer',
          field: 'telefonnummer',
          sortable: true,
        },
        {
          name: 'vorlieben',
          align: 'left',
          label: 'Vorliebe',
          field: 'preference',
        },
      ]
      columns2.value = [
        { name: 'kuerzel', align: 'left', label: 'Kürzel', field: 'kuerzel', sortable: true },
        {
          name: 'bezeichnung',
          align: 'right',
          label: 'Bezeichnung',
          field: 'name',
          sortable: true,
          style: 'font-weight: 500',
        },
      ]
    } catch (error) {
      console.error(error)
    }
  }
  if (report.value === '3') {
    try {
      const result = await api.get('/app/reports/lectures/without-professor')
      const data = result.data
      rows.value = data.lectures
      columns.value = [
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
      ]
    } catch (error) {
      console.error(error)
    }
  }
  if (report.value === '4') {
    try {
      const result = await api.get('/app/reports/lectures/without-provadis-experience')
      const data = result.data
      rows.value = data.lectures
      columns.value = [
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
      ]
    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<style scoped>
:deep(.q-table thead th) {
  color: black !important;
  opacity: 1 !important;
  font-weight: 800 !important;
}
</style>
