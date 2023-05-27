<template>
  <v-circle v-bind="config" globalCompositeOperation="source-over" />
</template>

<script>
export default {
  props: {
    config: Object
  }
}
</script>
