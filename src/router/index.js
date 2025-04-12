import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import HomeViewSnake from '@/views/HomeViewSnake.vue'
// import HomeViewWebCam from '@/views/HomeViewWebCam.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
      // component: HomeViewSnake
      // component: HomeViewWebCam,

    }
  ]
})

export default router
