<template>
  <v-stage :config="stageConfig" ref="stage" @mousedown="toggleDrag" @mousemove="doDrag" @mouseleave="endDrag">
    <v-layer>
      <CircleGroup :groupConfig="leftGroupConfig" />
      <CircleGroup :groupConfig="rightGroupConfig" />
    </v-layer>
  </v-stage>
</template>

<script>
import CircleGroup from "./CircleGroup.vue";

export default {
  components: {
    CircleGroup
  },
  data() {
    return {
      gap: 0,
      depth: 0.4,
      saturation: 0,
      colorSwitch: true,
      isDragging: false,
      lastPosX: 0,
      lastPosY: 0,
      stageConfig: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      leftGroupConfig: {
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2,
        translate: -10,
        color: 'rgb(0, 255, 0)',
        depth: 0.4,
        strokeWidth: 4
      },
      rightGroupConfig: {
        x: window.innerWidth / 2 + 50,
        y: window.innerHeight / 2,
        translate: 10,
        color: 'rgb(255, 0, 0)',
        depth: 0.4,
        strokeWidth: 4
      }
    }
  },
  methods: {
    updateColor() {
      const saturation = this.saturation;
      this.leftGroupConfig.color = this.colorSwitch ? `rgb(${saturation}, ${saturation}, 255)` : `rgb(255, ${saturation}, ${saturation})`;
      this.rightGroupConfig.color = this.colorSwitch ? `rgb(255, ${saturation}, ${saturation})` : `rgb(${saturation}, ${saturation}, 255)`;
    },
    adjustGap(increment) {
        this.gap = Math.max(0, this.gap + (increment * 10));
        this.leftGroupConfig.x -= increment * 10;
        this.rightGroupConfig.x += increment * 10;
    },
    adjustSaturation(delta) {
      this.saturation = Math.max(0, Math.min(255, this.saturation + delta));
      this.updateColor();
    },
    adjustStrokeWidth(delta) {
        this.leftGroupConfig.strokeWidth = Math.max(1, this.leftGroupConfig.strokeWidth + delta);
        this.rightGroupConfig.strokeWidth = Math.max(1, this.rightGroupConfig.strokeWidth + delta);
    },
    moveGroups(xDelta, yDelta) {
      this.leftGroupConfig.x += xDelta;
      this.rightGroupConfig.x += xDelta;
      this.leftGroupConfig.y += yDelta;
      this.rightGroupConfig.y += yDelta;
    },
    toggleDrag(e) {
      this.isDragging = !this.isDragging;
      if (this.isDragging) {
        this.lastPosX = e.evt.clientX;
        this.lastPosY = e.evt.clientY;
        document.body.style.cursor = 'none'; // Hide cursor
      } else {
        document.body.style.cursor = 'auto'; // Show cursor
      }
    },
    doDrag(e) {
      if (!this.isDragging) return;

      let deltaX = e.evt.clientX - this.lastPosX;
      let deltaY = e.evt.clientY - this.lastPosY;
      this.moveGroups(deltaX, deltaY);

      this.lastPosX = e.evt.clientX;
      this.lastPosY = e.evt.clientY;
    },
    endDrag() {
      this.isDragging = false;
      document.body.style.cursor = 'auto'; // Show cursor
    }
  },
  created() {
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'd':
          this.adjustGap(1);
          break;
        case 'a':
          this.adjustGap(-1);
          break;
        case 'w':
          this.adjustStrokeWidth(1);
          break;
        case 's':
          this.adjustStrokeWidth(-1);
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.moveGroups(e.key === 'ArrowRight' ? 10 : -10, 0);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          this.moveGroups(0, e.key === 'ArrowDown' ? 10 : -10);
          break;
        case ' ':
          this.colorSwitch = !this.colorSwitch;
          this.updateColor();
          break;
        case '2':
          this.adjustSaturation(10);
          break;
        case '1':
          this.adjustSaturation(-10);
          break;
        case 'Escape':
          this.endDrag();
          break;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownHandler);
  }
}
</script>

<style>
body {
  background-color: black;
  overflow: hidden;
}
</style>
