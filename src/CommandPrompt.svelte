<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let commandPromptVisible = false;
  export let commandInput = '';

  let commandHistory = JSON.parse(localStorage.getItem('commandHistory')) || [];
  let currentCommandIndex = -1;

  const dispatch = createEventDispatcher();
  let inputElement;

  onMount(() => {
      inputElement.focus();
  });

  function navigateCommandHistory(step) {
    currentCommandIndex = Math.max(0, Math.min(commandHistory.length - 1, currentCommandIndex + step));
    commandInput = commandHistory[currentCommandIndex] || '';
  }

  function previousCommand(e) {
    navigateCommandHistory(1);
  }

  function nextCommand(e) {
    navigateCommandHistory(-1);
  }

  function executeAndCloseCommand() {
    executeCommand();
    closeCommandPrompt();
  }

  function closeCommandPrompt() {
    commandInput = '';
    commandPromptVisible = false;
    currentCommandIndex = -1; // Reset command history index
  }

  function executeCommand() {
    const commands = commandInput.split(';');
    commands.forEach((commandString) => {
      const parts = commandString.trim().split(' ');
      const command = parts[0];
      const params = parts.slice(1);

      // If the last command is not the same as the current command, push it into the commandHistory
      if (commandHistory[0] !== commandInput) {
        commandHistory.unshift(commandInput);
        localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
      }

      // Dispatch execute-command event for each command
      dispatch('executeCommand', { command, params });
    });

    commandInput = '';
  }
</script>

  <div class="command-prompt">
    <input
      type="text"
      bind:value={commandInput}
      bind:this={inputElement}
      on:keyup={(e) => {
        if (e.key === 'Enter') executeAndCloseCommand();
        else if (e.key === 'Escape') closeCommandPrompt();
        else if (e.key === 'ArrowUp') previousCommand(e);
        else if (e.key === 'ArrowDown') nextCommand(e);
      }}
      on:keydown={(e) => e.stopPropagation()}
    />
  </div>

<style>
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