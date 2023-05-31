/* File src/CircleGroup.vue */

<template>
  <v-group>
    <Circle :config="bigCircleConfig" />
    <Circle :config="smallCircleConfig" />
    <v-text :config="textConfig" />
    <v-text :config="gapTextConfig" />
  </v-group>
</template>

<script>
import Circle from "./Circle.vue";

export default {
  components: {
    Circle
  },
  props: {
    groupConfig: Object,
    gap: Number
  },
  computed: {
    bigCircleConfig() {
      return this.createCircleConfig('big');
    },
    smallCircleConfig() {
      return this.createCircleConfig('small');
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
      };
    },
    gapTextConfig() {
      return {
        x: this.groupConfig.x - 10,
        y: this.groupConfig.y + 80,
        text: this.gap.toString(),
        fontSize: 20,
        fill: this.groupConfig.color,
        align: 'center',
        globalCompositeOperation: "lighter"
      };
    },
  },
  methods: {
    createCircleConfig(type) {
      return {
        x: this.groupConfig.x + (type === 'small' ? this.groupConfig.translate * this.groupConfig.depth : 0),
        y: this.groupConfig.y,
        radius: type === 'big' ? 60 : 40,
        stroke: this.groupConfig.color,
        strokeWidth: this.groupConfig.strokeWidth || 4,
        globalCompositeOperation: "lighter",
      };
    },
  }
}
</script>
