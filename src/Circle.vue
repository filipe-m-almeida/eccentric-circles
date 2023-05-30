<template>
  <v-circle v-bind="config" globalCompositeOperation="lighter" />
</template>

<script>
export default {
  props: {
    config: Object
  }
}
</script>
