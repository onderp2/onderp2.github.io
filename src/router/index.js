import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/HelloWorld.vue'
import APP from '@/App.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: APP,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router