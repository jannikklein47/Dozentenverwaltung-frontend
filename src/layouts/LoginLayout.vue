<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <LogoComponent
          fill="var(--q-primary)"
          class="q-ml-md"
          style="width: 40px; stroke-width: 10px"
        />
        <div class="text-primary text-weight-bolder q-ml-md" style="font-size: 24px">
          Dozentenverwaltung
        </div>

        <q-separator vertical inset class="q-mx-md" />

        <div class="text-primary text-weight-bold" style="font-size: 24px; opacity: 0.6">Login</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LogoComponent from 'src/components/LogoComponent.vue'
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
