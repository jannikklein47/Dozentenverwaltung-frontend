<template>
  <q-page class="q-pa-md bg-grey-2">
    <div v-if="report === '3'" class="q-mb-lg">
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
      v-if="report === '3'"
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
</template>

<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const rows = ref([])
const columns = ref([])
const report = ref(null)

onMounted(async () => {
  report.value = router.currentRoute.value.params.id
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
})
</script>

<style scoped>
:deep(.q-table thead th) {
  color: black !important;
  opacity: 1 !important;
  font-weight: 800 !important;
}
</style>
