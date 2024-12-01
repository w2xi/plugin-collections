<script lang="ts" setup>
import { computed } from 'vue'

const fontSize = 30

const styles = computed(() => {
  return {
    width: '100px',
    height: '100px',
    backgroundColor: 'skyblue',
  }
})
</script>

<template>
  <div
    class="case1"
    style="width: 100px; height: 100px; background-color: red"
  ></div>
  <div
    class="case2"
    :style="{ width: '100px', height: '100px', backgroundColor: 'green' }"
  ></div>
  <div class="case3" :style="{ fontSize: `${fontSize}px` }">case3</div>
  <div class="case4" :style="styles">case4</div>
</template>
