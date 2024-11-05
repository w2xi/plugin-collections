<script setup lang="ts">
import vueLogo from './assets/logo.svg'
import vueLogoComponent from './assets/logo.svg?vue'
import vueLogoRaw from './assets/logo.svg?raw'
import vueLogoUrl from './assets/logo.svg?url'
</script>

<template>
  <div class="default">
    <img :src="vueLogo" />
  </div>
  <div class="component">
    <vueLogoComponent />
  </div>
  <div class="raw">
    <pre>{{ vueLogoRaw }}</pre>
  </div>
  <div class="url">
    {{ vueLogoUrl }}
  </div>
</template>
