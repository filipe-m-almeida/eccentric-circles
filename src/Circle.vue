<template>
  <v-circle v-bind="config" globalCompositeOperation="lighter" />
</template>

<script lang="ts">
export default {
  props: {
    config: Object
  }
}
</script>
