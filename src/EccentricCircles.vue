<template>
  <v-stage :config="stageConfig" ref="stage" @mousedown="toggleDrag" @mousemove="doDrag" @mouseleave="endDrag">
    <v-layer>
      <transition name="circle-slide" v-for="(group, index) in [leftGroupConfig, rightGroupConfig]" :key="index">
        <CircleGroup :groupConfig="group" :gap="gap" />
      </transition>
    </v-layer>
    <!-- Debug Overlay -->
  </v-stage>
  <div v-if="debugVisible" class="debug-overlay">
    <pre>{{ debugData }}</pre>
  </div>
  <div v-if="keyHelpVisible" class="key-help-overlay">
    <p><strong>Key Shortcuts:</strong></p>
    <ul>
      <li>d: Increase gap</li>
      <li>a: Decrease gap</li>
      <li>w: Increase stroke width</li>
      <li>s: Decrease stroke width</li>
      <li>Arrow keys: Move groups</li>
      <li>2: Increase saturation</li>
      <li>1: Decrease saturation</li>
      <li>Escape: End dragging</li>
      <li>/: Toggle debug visibility</li>
      <li>Space: Switch positions</li>
    </ul>
  </div>
  <CommandPrompt 
    @execute-command="executeCommand($event.command, $event.params)" 
    ref="commandPrompt" 
  />
</template>

<script lang="ts">
import CircleGroup from "./CircleGroup.vue";
import CommandPrompt from "./CommandPrompt.vue";
import { Utils } from "./Utils.ts";

export default {
  components: {
    CircleGroup,
    CommandPrompt
  },
  data() {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      gap: 0,
      depth: 0.4,
      saturation: 0,
      colorSwitch: true,
      isDragging: false,
      lastPosX: 0,
      lastPosY: 0,
      keyHelpVisible: false,
      debugVisible: false,
      commandPromptVisible: false,
      commandInput: '',
      isCycling: false,
      stageConfig: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },
  computed: {
    // TODO: Move the x calculation to the inner component and move these back to non computed properties.
    leftGroupConfig() {
      return {
        x: this.x - this.gap / 2,
        y: this.y,
        translate: -10,
        color: 'rgb(0, 0, 255)',
        depth: 0.4,
        strokeWidth: 4
      }
    },
    rightGroupConfig() {
      return {
        x: this.x + this.gap / 2,
        y: this.y,
        translate: 10,
        color: 'rgb(255, 0, 0)',
        depth: 0.4,
        strokeWidth: 4
      }
    },
    debugData() {
      return JSON.stringify(this.$data, null, 2)
      .replace(/[{},"]/g, '')
      .replace(/^\s*[\r\n]/gm, '');

    }
  },
  methods: {
    adjustGap(increment : number) {
        this.gap += (increment * 2) * 2;
    },
    adjustStrokeWidth(delta : number) {
        this.leftGroupConfig.strokeWidth = Math.max(1, this.leftGroupConfig.strokeWidth + delta);
        this.rightGroupConfig.strokeWidth = Math.max(1, this.rightGroupConfig.strokeWidth + delta);
    },
    moveGroups(xDelta : number, yDelta : number) {
      this.x += xDelta;
      this.y += yDelta;
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
    startBouncing() {
      const stageWidth = this.stageConfig.width;
      const stageHeight = this.stageConfig.height;
      let speedX = 1;
      let speedY = 1;
      const radius = 70;

      const animate = () => {
        // Update the position of the groups
        this.x += speedX;
        this.y += speedY;

        if (this.x - radius < 0 || this.x + radius > stageWidth) {
          speedX = -speedX;
        }
  
        if (this.y - radius < 0 || this.y + radius > stageHeight) {
          speedY = -speedY;
        }

        // Continue the animation
        requestAnimationFrame(animate);
      };

      // Start the animation
      animate();
    },
    switchPositions(left : number, right : number, speed : number = 1) {
      const SPEED_FACTOR = 0.005
      const delta = (right - left) * speed * SPEED_FACTOR;

      const animate = () => {
        this.gap += delta;
        // Test if the gap is within the target range
        if ((delta < 0 && this.gap <= right) || (delta > 0 && this.gap >= right)) {
          this.gap = right;
          if (this.isCycling) {
            // swap left and right for next cycle
            [left, right] = [right, left];
            this.switchPositions(left, right, speed);
          };
          return;
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
    executeCommand(command : string, params : string[]) {

      switch (command) {
        case 'cycle':
          this.isCycling = true;
          let left = params[0] && Utils.prismToPixels(parseFloat(params[0])) || -this.gap;
          let right = params[1] && Utils.prismToPixels(parseFloat(params[1])) || this.gap;
          let speed = params[2] && parseFloat(params[2]) || 1;
          console.log(`Cycling from ${left} to ${right}`);
          this.switchPositions(left, right, speed);
          break;
        case 'stop':
          this.isCycling = false;
          break;
        case 'bounce':
          this.startBouncing();
          break;
        default:
          console.log(`Unknown command: ${this.commandInput}`);
          break;
      }

      this.commandInput = '';
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
            'm': () => this.debugVisible = !this.debugVisible,
            ' ': () => this.switchPositions(-this.gap, this.gap), // Spacebar
            '?': () => this.keyHelpVisible = !this.keyHelpVisible,
            '/': () => {
              // TODO: Turn this into a property.
              this.$refs.commandPrompt.commandPromptVisible = true;
              this.$nextTick(() => {
                if (this.$refs.commandPrompt.$refs.commandInput) {
                  this.$refs.commandPrompt.$refs.commandInput.focus();
                }
              });
              e.preventDefault();
            },
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

    // this.keyupHandler = this.createKeyupHandler();
    // window.addEventListener('keyup', this.keyupHandler);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
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

.key-help-overlay {
  position: fixed;
  top: 50%;  /* position it vertically in the center */
  left: 50%; /* position it horizontally in the center */
  transform: translate(-50%, -50%); /* This will truly center the overlay */
  z-index: 9999;
  background-color: rgba(0, 30, 0, 0.9); /* Here 0.8 is the opacity, reduce this value if you want the background to be more transparent */
  padding: 20px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 20px;
  color: #00ff00;
  pointer-events: none;
  width: 500px;
  height: auto;
  overflow: auto;
  text-align: left; /* Center the text */
}


</style>
