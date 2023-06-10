<template>
  <div v-if="commandPromptVisible" class="command-prompt">
    <input 
      type="text" 
      v-model="commandInput" 
      ref="commandInput" 
      @keyup.enter="executeAndCloseCommand" 
      @keyup.esc="closeCommandPrompt" 
      @keyup.up.prevent="previousCommand" 
      @keyup.down.prevent="nextCommand" 
      @keydown.stop=""
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      commandPromptVisible: false,
      commandInput: '',
      commandHistory: JSON.parse(localStorage.getItem('commandHistory')) || [],
      currentCommandIndex: -1,  
    }
  },
  methods: {
    navigateCommandHistory(step) {
      this.currentCommandIndex = Math.max(0, Math.min(this.commandHistory.length - 1, this.currentCommandIndex + step));
      this.commandInput = this.commandHistory[this.currentCommandIndex] || '';
    },
    previousCommand(e) {
      this.navigateCommandHistory(-1);
    },
    nextCommand(e) {
      this.navigateCommandHistory(1);
    },
    executeAndCloseCommand() {
      this.executeCommand();
      this.closeCommandPrompt();
    },
    closeCommandPrompt() {
      this.commandInput = '';
      this.commandPromptVisible = false;
      this.currentCommandIndex = -1;  // Reset command history index
    },
    executeCommand() {
      const parts = this.commandInput.split(' ');
      const command = parts[0];
      const params = parts.slice(1);

      this.commandHistory.push(this.commandInput);
      localStorage.setItem('commandHistory', JSON.stringify(this.commandHistory));
      console.log(this.commandHistory);

      this.$emit('execute-command', { command, params });

      this.commandInput = '';
    },
  },
}
</script>

<style scoped>
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
