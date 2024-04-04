<script>
  export let config;
</script>

<Circle
  x={config.x}
  y={config.y}
  radius={config.radius}
  stroke={config.stroke}
  strokeWidth={config.strokeWidth}
  globalCompositeOperation={config.globalCompositeOperation}
/>