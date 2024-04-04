<script>
  export let config;
</script>

<div
  class="circle"
  style="
    transform: translate({config.x}px, {config.y}px);
    width: {config.radius * 2}px;
    height: {config.radius * 2}px;
    border: {config.strokeWidth}px solid {config.stroke};
    mix-blend-mode: lighter;
  "
></div>