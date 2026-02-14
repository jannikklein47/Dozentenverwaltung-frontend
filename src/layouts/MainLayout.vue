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
          label="Nach einem Dozenten suchen..."
          rounded
          v-model="test"
          standout="bg-grey-4"
          dense
          style="min-width: 300px"
          input-class="text-black"
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
            to="/vorlesungseinsicht"
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
            to="/dozenteneinsicht"
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
          <q-item class="text-grey-5">
            <q-item-section>
              <q-item-label class="text-overline" style="position: relative; top: 9px">
                Filter & Aktionen
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator dark />
          <q-item>
            <q-item-section avatar>
              <q-icon name="filter_list" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="test"
                :options="['Option 1', 'Option 2', 'Option 3']"
                dark
                label="Niveau"
                filled
                color="white"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="timer" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="test"
                :options="['Option 1', 'Option 2', 'Option 3']"
                dark
                label="Vorlaufzeit"
                filled
                color="white"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="history" color="grey-5" />
            </q-item-section>
            <q-item-section>
              <q-select
                dense
                v-model="test"
                :options="['Option 1', 'Option 2', 'Option 3']"
                dark
                label="Erfahrung"
                filled
                color="white"
              >
              </q-select>
            </q-item-section>
          </q-item>

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
import { ref } from 'vue'
import LogoComponent from 'src/components/LogoComponent.vue'

const test = ref('')

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
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
