<template>
  <v-group>
    <Circle :config="circleConfig('big')" />
    <Circle :config="circleConfig('small')" />
    <v-text :config="textConfig" />
  </v-group>
</template>

<script>
import Circle from "./Circle.vue";

export default {
  components: {
    Circle,
  },
  props: {
    groupConfig: Object
  },
  computed: {
    circleConfig() {
      return type => ({
        x: this.groupConfig.x + (type === 'small' ? this.groupConfig.translate * this.groupConfig.depth : 0),
        y: this.groupConfig.y,
        radius: type === 'big' ? 60 : 40,
        stroke: this.groupConfig.color,
        strokeWidth: this.groupConfig.strokeWidth || 4,
        globalCompositeOperation: "lighter",
      });
    },
    textConfig() {
      return {
        x: this.groupConfig.x - 15,
        y: this.groupConfig.y - 5 ,
        text: 'Clear',
        fontSize: 14,
        fill: this.groupConfig.color,
        align: 'center',
        globalCompositeOperation: "lighter"
      }
    }
  }
}
</script>
