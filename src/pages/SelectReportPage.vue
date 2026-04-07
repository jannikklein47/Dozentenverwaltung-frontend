<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h4 text-weight-bold q-mb-lg">Report auswählen</div>
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-grey-8 text-weight-bold q-mr-md">Reports</div>
      <q-separator class="col" color="grey-4" />
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
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
          <q-card-actions align="right">
            <q-btn
              flat
              label="Auswählen"
              no-caps
              class="bg-primary text-white"
              padding="xs md"
              @click="$router.push('/reporting/report/1')"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="q-pa-none">
              <q-icon name="book" class="q-ma-md" size="md" />
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bold q-py-sm">
                  Vorlesungen ohne Provadis-Erfahrung
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section class="text-grey-7 text-weight-medium">
            Alle Vorlesungen , die dozierende halten können, dies jedoch noch nicht an der Provadis
            Hochschule getan haben.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Auswählen"
              no-caps
              class="bg-primary text-white"
              padding="xs md"
              @click="$router.push('/reporting/report/2')"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
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
          <q-card-actions align="right">
            <q-btn
              flat
              label="Auswählen"
              no-caps
              class="bg-primary text-white"
              padding="xs md"
              @click="$router.push('/reporting/report/3')"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="q-pa-none">
              <q-icon name="book" class="q-ma-md" size="md" />
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bold q-py-sm">
                  Externe Erfahrung ohne Provadis
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section class="text-grey-7 text-weight-medium">
            Vorlesungen mit Dozierenden, die nur extern, jedoch nicht nicht an der Provdis gehalten
            sind.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Auswählen"
              no-caps
              class="bg-primary text-white"
              padding="xs md"
              @click="$router.push('/reporting/report/4')"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
