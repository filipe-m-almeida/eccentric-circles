<template>
  <v-stage :config="stageConfig" ref="stage" @mousedown="toggleDrag" @mousemove="doDrag" @mouseleave="endDrag">
    <v-layer>
      <transition name="circle-slide" v-for="(group, index) in [leftGroupConfig, rightGroupConfig]" :key="group.x">
        <CircleGroup :groupConfig="group" :gap="gap" />
      </transition>
    </v-layer>
    <!-- Debug Overlay -->
  </v-stage>
  <div v-if="debugVisible" class="debug-overlay">
    <pre>{{ debugData }}</pre>
  </div>
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
      debugVisible: false,
      stageConfig: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      leftGroupConfig: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        translate: -10,
        color: 'rgb(0, 0, 255)',
        depth: 0.4,
        strokeWidth: 4
      },
      rightGroupConfig: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        translate: 10,
        color: 'rgb(255, 0, 0)',
        depth: 0.4,
        strokeWidth: 4
      }
    }
  },
  computed: {
    debugData() {
      return JSON.stringify(this.$data, null, 2)
      .replace(/[{},"]/g, '')
      .replace(/^\s*[\r\n]/gm, '');

    }
  },
  methods: {
    adjustGap(increment) {
        this.gap += (increment * 10);
        this.leftGroupConfig.x -= increment * 10;
        this.rightGroupConfig.x += increment * 10;
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
    },
    switchPositions() {
      // Add animation by updating the positions gradually over time
      const animationDuration = 750; // Adjust as needed
      const startTime = Date.now();
      const startX1 = this.leftGroupConfig.x;
      const startX2 = this.rightGroupConfig.x;
      const endX1 = startX2;
      const endX2 = startX1;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const newX1 = startX1 + (endX1 - startX1) * progress;
        const newX2 = startX2 + (endX2 - startX2) * progress;
        this.leftGroupConfig.x = newX1;
        this.rightGroupConfig.x = newX2;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
    createKeydownHandler() {
        return (e) => {
          const map = {
            'd': () => this.adjustGap(1),
            'a': () => this.adjustGap(-1),
            'w': () => this.adjustStrokeWidth(1),
            's': () => this.adjustStrokeWidth(-1),
            'ArrowLeft': () => this.moveGroups(-10, 0),
            'ArrowRight': () => this.moveGroups(10, 0),
            'ArrowUp': () => this.moveGroups(0, -10),
            'ArrowDown': () => this.moveGroups(0, 10),
            '2': () => this.adjustSaturation(10),
            '1': () => this.adjustSaturation(-10),
            'Escape': () => this.endDrag(),
            '/': () => this.debugVisible = !this.debugVisible,
            ' ': () => this.switchPositions(), // Spacebar
          };

        const action = map[e.key];
        if (action) {
          action();
        }
      }
    }
  },
  created() {
    this.keydownHandler = this.createKeydownHandler();
    window.addEventListener('keydown', this.keydownHandler);
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

.debug-overlay {
  position: fixed; /* Use 'fixed' instead of 'absolute' for consistent positioning */
  bottom: 10px; /* Position the overlay at the bottom */
  right: 10px; /* Position the overlay at the right */
  z-index: 9999;
  background-color: rgba(0, 30, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  color: #00ff00;
  pointer-events: none;
}
</style>
