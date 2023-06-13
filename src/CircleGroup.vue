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
import { Utils } from "./Utils.ts";

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
      const DPI = 97.7; // replace 97.7 with the actual DPI if it's different
      const DISTANCE_MM = 500; // screen distance in mm, 50cm = 500mm
      const MM_PER_PIXEL = 25.4 / DPI; 
      // let prismDiopters = 100 * (this.gap * MM_PER_PIXEL / DISTANCE_MM);
      let prismDiopters = Utils.pixelsToPrism(this.gap);

      // Infinity viewing prismDiopters for 61mm PD would be -12.2 prism diopeters.
      
      return {
        x: this.groupConfig.x - 10,
        y: this.groupConfig.y + 80,
        text: prismDiopters.toFixed(2) + " Δ", // show prism diopters with 2 decimal places
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
