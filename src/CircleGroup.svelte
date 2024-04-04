<script>
  import { Layer, Stage, Text } from 'svelte-konva';
  import Circle from './Circle.svelte';
  import { Utils } from './Utils.js';

  export let groupConfig;
  export let gap;

  $: bigCircleConfig = createCircleConfig('big');
  $: smallCircleConfig = createCircleConfig('small');
  $: textConfig = {
    x: groupConfig.x - 15,
    y: groupConfig.y - 5,
    text: 'Clear',
    fontSize: 14,
    fill: groupConfig.color,
    align: 'center',
    globalCompositeOperation: 'lighter',
  };
  $: gapTextConfig = {
    x: groupConfig.x - 10,
    y: groupConfig.y + 80,
    text: Utils.pixelsToPrism(gap).toFixed(2) + ' Δ',
    fontSize: 20,
    fill: groupConfig.color,
    align: 'center',
    globalCompositeOperation: 'lighter',
  };

  function createCircleConfig(type) {
    return {
      x: groupConfig.x + (type === 'small' ? groupConfig.translate * groupConfig.depth : 0),
      y: groupConfig.y,
      radius: type === 'big' ? 60 : 40,
      stroke: groupConfig.color,
      strokeWidth: groupConfig.strokeWidth || 4,
      globalCompositeOperation: 'lighter',
    };
  }
</script>

<Stage width={window.innerWidth} height={window.innerHeight}>
  <Layer>
    <Circle config={bigCircleConfig} />
    <Circle config={smallCircleConfig} />
    <Text {...textConfig} />
    <Text {...gapTextConfig} />
  </Layer>
</Stage>