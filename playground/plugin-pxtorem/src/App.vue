<script lang="ts" setup>
import { computed } from 'vue'
import Test from './components/Test.vue'

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
  <section class="static-style">
    <h2>static style</h2>
    <div
      class="case1"
      style="width: 100px; height: 100px; background-color: red"
    ></div>
  </section>
  <section class="dynamic-style">
    <h2>dynamic style</h2>
    <div
      class="case2"
      :style="{ width: '100px', height: '100px', backgroundColor: 'green' }"
    ></div>
    <div class="case3" :style="{ fontSize: `${fontSize}px` }">case3</div>
    <div class="case4" :style="styles">case4</div>
  </section>

  <section class="component non-script-setup">
    <Test style="color: blue; font-size: 30px" />
  </section>

  <section class="postcss-px2rem">
    <h2>postcss-px2rem</h2>
    <div class="case5 case6">postcss-px2rem</div>
  </section>
</template>

<style scoped>
@import url('./styles/index.css');

.case5 {
  width: 100px;
  height: 100px;
  background-color: gray;
}
</style>
