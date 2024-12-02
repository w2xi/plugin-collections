<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'Test',
  setup() {
    return {
      count: ref(0),
    }
  },
}
</script>

<template>
  <div class="test">Test</div>
</template>
