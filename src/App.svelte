<script>
  import { Stage, Layer } from 'svelte-konva';
  import { onMount, onDestroy } from 'svelte';
  import CircleGroup from './CircleGroup.svelte';
  import CommandPrompt from './CommandPrompt.svelte';
  import { Utils } from './Utils.js';

  let x = 0;
  let y = 0;
  let gap = 0;
  let depth = 0.4;
  let saturation = 0;
  let colorSwitch = true;
  let isDragging = false;
  let lastPosX = 0;
  let lastPosY = 0;
  let keyHelpVisible = false;
  let debugVisible = false;
  let commandPromptVisible = false;
  let commandInput = '';
  let isCycling = false;
  let stageConfig = {
    width: 0,
    height: 0,
  };
  let gapVisible = true;

  $: leftGroupConfig = {
    x: x - gap / 2,
    y,
    translate: -10,
    color: 'rgb(0, 0, 255)',
    depth: 0.4,
    strokeWidth: 4,
  };

  $: rightGroupConfig = {
    x: x + gap / 2,
    y,
    translate: 10,
    color: 'rgb(255, 0, 0)',
    depth: 0.4,
    strokeWidth: 4,
  };

  $: debugData = JSON.stringify(
    {
      x,
      y,
      gap,
      depth,
      saturation,
      colorSwitch,
      isDragging,
      lastPosX,
      lastPosY,
      keyHelpVisible,
      debugVisible,
      commandPromptVisible,
      commandInput,
      isCycling,
      stageConfig,
    },
    null,
    2
  )
    .replace(/[{},"]/g, '')
    .replace(/^\s*[\r\n]/gm, '');

  function adjustGap(increment) {
    gap += increment * 2 * 2;
  }

  function adjustStrokeWidth(delta) {
    leftGroupConfig.strokeWidth = Math.max(1, leftGroupConfig.strokeWidth + delta);
    rightGroupConfig.strokeWidth = Math.max(1, rightGroupConfig.strokeWidth + delta);
  }

  function moveGroups(xDelta, yDelta) {
    x += xDelta;
    y += yDelta;
  }

  function toggleDrag(e) {
    isDragging = !isDragging;
    if (isDragging) {
      lastPosX = e.clientX;
      lastPosY = e.clientY;
      document.body.style.cursor = 'none'; // Hide cursor
    } else {
      document.body.style.cursor = 'auto'; // Show cursor
    }
  }

  function doDrag(e) {
    if (!isDragging) return;

    let deltaX = e.clientX - lastPosX;
    let deltaY = e.clientY - lastPosY;
    moveGroups(deltaX, deltaY);

    lastPosX = e.clientX;
    lastPosY = e.clientY;
  }

  function endDrag() {
    isDragging = false;
    document.body.style.cursor = 'auto'; // Show cursor
  }

  function startBouncing() {
    const stageWidth = stageConfig.width;
    const stageHeight = stageConfig.height;
    let speedX = 1;
    let speedY = 1;
    const radius = 70;

    const animate = () => {
      // Update the position of the groups
      x += speedX;
      y += speedY;

      if (x - radius < 0 || x + radius > stageWidth) {
        speedX = -speedX;
      }

      if (y - radius < 0 || y + radius > stageHeight) {
        speedY = -speedY;
      }

      // Continue the animation
      requestAnimationFrame(animate);
    };

    // Start the animation
    animate();
  }

  function createSmoothedSquareWave(treshold = 0.8) {
    return function smoothedSquareWave(angle) {
      const wave = Math.sin(angle);
      if (wave > treshold) {
        return 1;
      } else if (wave < -treshold) {
        return -1;
      } else {
        return wave / treshold;
      }
    }
}

  // const waveFunction = Math.sin;
  const waveFunction = createSmoothedSquareWave(0.9);

  function switchPositions(minGap, maxGap, speed = 1) {
    let angle = 0; // Start angle
    const amplitude = (maxGap - minGap) / 2;
    const midPoint = (maxGap + minGap) / 2;
    const angleIncrement = speed * 0.05;

    const animate = () => {
      // gap = midPoint + amplitude * smoothedSquareWave(angle, 0.95);
      gap = midPoint + amplitude * waveFunction(angle);
      angle += angleIncrement;

      if (isCycling) {
        requestAnimationFrame(animate);
      } else {
        gap = midPoint;
      }
    };

    // Start the animation
    animate();
  }


  function executeCommand(command, params) {
    switch (command) {
      case 'cycle':
        isCycling = true;
        let left = (params[0] && Utils.prismToPixels(parseFloat(params[0]))) || -gap;
        let right = (params[1] && Utils.prismToPixels(parseFloat(params[1]))) || gap;
        let speed = (params[2] && parseFloat(params[2])) || 1;
        console.log(`Cycling from ${left} to ${right}`);
        switchPositions(left, right, speed);
        break;
      case 'stop':
        isCycling = false;
        break;
      case 'bounce':
        startBouncing();
        break;
      default:
        console.log(`Unknown command: ${commandInput}`);
        break;
    }

    commandInput = '';
  }

  function createKeydownHandler() {
    return (e) => {
      const map = {
        d: () => adjustGap(1),
        a: () => adjustGap(-1),
        D: () => adjustGap(10),
        A: () => adjustGap(-10),
        w: () => adjustStrokeWidth(1),
        s: () => adjustStrokeWidth(-1),
        ArrowLeft: () => moveGroups(-10, 0),
        ArrowRight: () => moveGroups(10, 0),
        ArrowUp: () => moveGroups(0, -10),
        ArrowDown: () => moveGroups(0, 10),
        '2': () => adjustSaturation(10),
        '1': () => adjustSaturation(-10),
        Escape: () => endDrag(),
        m: () => (debugVisible = !debugVisible),
        ' ': () => switchPositions(-gap, gap), // Spacebar
        r: () => ((gap = 0), (isCycling = false)),
        '?': () => (keyHelpVisible = !keyHelpVisible),
        'h': () => (gapVisible = !gapVisible),
        '/': () => {
          commandPromptVisible = true;
          e.preventDefault();
        },
      };

      const action = map[e.key];
      if (action) {
        action();
      }
    };
  }

  let keydownHandler;

  onMount(() => {
    x = window.innerWidth / 2;
    y = window.innerHeight / 2;
    stageConfig.width = window.innerWidth;
    stageConfig.height = window.innerHeight;

    keydownHandler = createKeydownHandler();
    window.addEventListener('keydown', keydownHandler);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', keydownHandler);
  });
</script>

<style>
  :global(body) {
    background-color: black;
    overflow: hidden;
  }

  .debug-overlay {
    position: fixed;
    bottom: 10px;
    right: 10px;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: rgba(0, 30, 0, 0.9);
    padding: 20px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 20px;
    color: #00ff00;
    pointer-events: none;
    width: 500px;
    height: auto;
    overflow: auto;
    text-align: left;
  }
</style>

<div
  class="stage"
  on:mousedown={toggleDrag}
  on:mousemove={doDrag}
  on:mouseleave={endDrag}
  style="width: {stageConfig.width}px; height: {stageConfig.height}px;"
>
  <div class="layer">
    <Stage
  config={{
    width: window.innerWidth,
    height: window.innerHeight,
    background: 'black',
  }}>
  <Layer>

    {#each [leftGroupConfig, rightGroupConfig] as group, index (index)}
      <div class="circle-group" transition:slide>
        <CircleGroup groupConfig={group} gap={gap} gapVisible={gapVisible}/>
      </div>
    {/each}
    </Layer>
    </Stage>
  </div>
</div>

{#if debugVisible}
  <div class="debug-overlay">
    <pre>{debugData}</pre>
  </div>
{/if}

{#if keyHelpVisible}
  <div class="key-help-overlay">
    <p><strong>Key Shortcuts:</strong></p>
    <ul>
      <li>d: Increase gap</li>
      <li>a: Decrease gap</li>
      <li>w: Increase stroke width</li>
      <li>s: Decrease stroke width</li>
      <li>Arrow keys: Move groups</li>
      <li>2: Increase saturation</li>
      <li>1: Decrease saturation</li>
      <li>r: Reset gap and stop cycling</li>
      <li>Escape: End dragging</li>
      <li>m: Toggle debug visibility</li>
      <li>/: Open command prompt</li>
      <li>Space: Switch positions</li>
      <li>h: Toggle gap visibility</li>
      <li>?: Toggle key help visibility</li>
    </ul>?    
  </div>
{/if}

{#if commandPromptVisible}
<CommandPrompt
  on:executeCommand={(e) => executeCommand(e.detail.command, e.detail.params)}
  bind:commandPromptVisible
  bind:commandInput
/>
{/if}