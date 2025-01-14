import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/CardSwap.vue'
import MathGame from '@/components/MathGame.vue';
import GameHub from '@/views/GameHub.vue';

const routes = [
  {
    path: '/',
    name: 'GameHub',
    component: GameHub,
  },
  {
    path: '/games/memory-game',
    name: "MemoryGame",
    component: Home
  },
  {
    path: '/games/math',
    name: "MathGame",
    component: MathGame
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router