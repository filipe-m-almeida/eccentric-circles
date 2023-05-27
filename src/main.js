import VueKonva from 'vue-konva';
import { createApp } from 'vue';
import EccentricCircles from './EccentricCircles.vue';

const app = createApp(EccentricCircles);
app.use(VueKonva);
app.mount('#app');
