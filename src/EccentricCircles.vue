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
  <div v-if="commandPromptVisible" class="command-prompt">
    <input type="text" v-model="commandInput" ref="commandInput" @keyup.enter="executeAndCloseCommand" @keyup.esc="closeCommandPrompt" @keydown.stop="" />
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
    adjustGap(increment) {
        this.gap += (increment * 2) * 2;
    },
    adjustStrokeWidth(delta) {
        this.leftGroupConfig.strokeWidth = Math.max(1, this.leftGroupConfig.strokeWidth + delta);
        this.rightGroupConfig.strokeWidth = Math.max(1, this.rightGroupConfig.strokeWidth + delta);
    },
    moveGroups(xDelta, yDelta) {
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
    switchPositions(speed = 0.5) {
      const targetGap = -this.gap;
      const delta = Math.sign(targetGap) * speed;

      const animate = () => {
        this.gap += delta;
        // TODO: Test if the gap is within the target range
        if ((targetGap < 0 && targetGap >= this.gap) || (targetGap > 0 && targetGap <= this.gap)) {
          this.gap = targetGap;
          if (this.isCycling) {
            this.switchPositions();
          };
          return;
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
    executeAndCloseCommand() {
      this.executeCommand();
      this.closeCommandPrompt();
    },
    closeCommandPrompt() {
      this.commandInput = '';
      this.commandPromptVisible = false;
    },
    executeCommand() {
      const parts = this.commandInput.split(' ');
      const command = parts[0];
      const params = parts.slice(1);

      switch (command) {
        case 'cycle':
          this.isCycling = true;
          const duration = params[0] ? parseFloat(params[0], 10) : 0.5;
          this.switchPositions(duration);
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
    createKeyupHandler() {
      return (e) => {
        const map = {
          '/': () => {
            this.commandPromptVisible = !this.commandPromptVisible;
            if (this.commandPromptVisible) {
              this.$nextTick(() => {
                this.$refs.commandInput.focus();
              });
            }
          },
        };

        const action = map[e.key];
        if (action) {
          action();
          e.preventDefault();
        }
      }
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
            ' ': () => this.switchPositions(), // Spacebar
            '?': () => this.keyHelpVisible = !this.keyHelpVisible,
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

    this.keyupHandler = this.createKeyupHandler();
    window.addEventListener('keyup', this.keyupHandler);
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

.command-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 16px;
  color: #00ff00;
}

.command-prompt input {
  width: 95%;
  font-family: monospace;
  font-size: 16px;
  color: #00ff00;
  background-color: #000;
  border: none;
  outline: none;
}

</style>