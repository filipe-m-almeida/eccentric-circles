<template>
  <v-circle :config="config" :stroke="config.stroke" globalCompositeOperation="source-over" />
</template>


<script>
export default {
  props: {
    config: Object
  }
}
</script>