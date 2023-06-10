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
      currentCommandIndex: 0,  
    }
  },
  methods: {
    navigateCommandHistory(step) {
      this.currentCommandIndex = Math.max(0, Math.min(this.commandHistory.length - 1, this.currentCommandIndex + step));
      this.commandInput = this.commandHistory[this.currentCommandIndex] || '';
    },
    previousCommand(e) {
      this.navigateCommandHistory(1);
    },
    nextCommand(e) {
      this.navigateCommandHistory(-1);
    },
    executeAndCloseCommand() {
      this.executeCommand();
      this.closeCommandPrompt();
    },
    closeCommandPrompt() {
      this.commandInput = '';
      this.commandPromptVisible = false;
      this.currentCommandIndex = 0;  // Reset command history index
    },
    executeCommand() {
      const commands = this.commandInput.split(';');
      commands.forEach((commandString) => {
        const parts = commandString.trim().split(' ');
        const command = parts[0];
        const params = parts.slice(1);

        // If the last command is not the same as the current command, push it into the commandHistory
        if (this.commandHistory[0] !== this.commandInput) {
          this.commandHistory.unshift(this.commandInput);
          localStorage.setItem('commandHistory', JSON.stringify(this.commandHistory));
        }

        // Emit execute-command for each command
        this.$emit('execute-command', { command, params });
      });

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
