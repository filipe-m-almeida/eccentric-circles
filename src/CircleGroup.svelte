<script>
  import { Group, Text, Circle } from 'svelte-konva';
  import { Utils } from './Utils.js';

  export let groupConfig;
  export let gap;

  // TODO: Get a better name for this
  $: upperGroupConfig = {
    globalCompositeOperation: "lighter"
  };

  $: bigCircleConfig = {
    x: groupConfig.x,
    y: groupConfig.y,
    radius: 60,
    stroke: groupConfig.color,
    strokeWidth: groupConfig.strokeWidth || 4
  };

  $: smallCircleConfig = {
    x: groupConfig.x + groupConfig.translate * groupConfig.depth,
    y: groupConfig.y,
    radius: 40,
    stroke: groupConfig.color,
    strokeWidth: groupConfig.strokeWidth || 4
  };

  $: textConfig = {
    x: groupConfig.x - 15,
    y: groupConfig.y - 5,
    text: 'Clear',
    fontSize: 14,
    fill: groupConfig.color,
    align: 'center',
    listening: false
  };

  $: gapTextConfig = {
    x: groupConfig.x - 10,
    y: groupConfig.y + 80,
    text: Utils.pixelsToPrism(gap).toFixed(2) + ' Δ',
    fontSize: 20,
    fill: groupConfig.color,
    align: 'center',
    listening: false
  };
</script>


<Group config={upperGroupConfig}>
  <Circle config={bigCircleConfig}/>
  <Circle config={smallCircleConfig} />
  <Text config={textConfig} />
  <Text config={gapTextConfig} />
</Group>