<script>
  import { Stage, Layer, Group } from 'svelte-konva';

  export let x = 0;
  export let y = 0;
  export let width = 0;
  export let height = 0;
  export let gap = 0;
  export let translate = 10;
  export let leftColor = 'rgb(0, 0, 255)';
  export let rightColor = 'rgb(255, 0, 0)';
  export let items = []; // [{ id, component, depth, config }]

  function eyeOffset(direction, depth) {
    return direction * (gap / 2 + translate * depth);
  }

  $: leftItems = items.map((item) => ({
    id: item.id,
    component: item.component,
    config: {
      ...item.config,
      x: x + (item.config.x || 0) + eyeOffset(-1, item.depth || 0),
      y: y + (item.config.y || 0),
      stroke: leftColor,
    },
  }));

  $: rightItems = items.map((item) => ({
    id: item.id,
    component: item.component,
    config: {
      ...item.config,
      x: x + (item.config.x || 0) + eyeOffset(1, item.depth || 0),
      y: y + (item.config.y || 0),
      stroke: rightColor,
    },
  }));
</script>

<Stage {width} {height} background="black">
  <Layer>
    {#each [...leftItems, ...rightItems] as item (item.id + item.config.stroke)}
      <Group config={{ globalCompositeOperation: 'lighter' }}>
        <svelte:component this={item.component} config={item.config} />
      </Group>
    {/each}
  </Layer>
</Stage>
