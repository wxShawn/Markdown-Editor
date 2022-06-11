import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () => import('./pages/Home.vue');
const PreviewFullScreen = () => import('./pages/PreviewFullScreen.vue');

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/previewFullScreen', component: PreviewFullScreen },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});