<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SquareNoAnimation from '../components/SquareNoAnimation.vue'

const count = 600
const angles = ref(new Array(count).fill(0))
const mousePosition = ref({ x: 0, y: 0 })
const mouseInfluence = ref({ x: 0, y: 0 })

const smoothFactor = 0.1
const followMouse = ref(true)

const paused = ref(false)

const animate = () => {
  if (paused.value) return // If paused, don't continue animating

  for (let i = 0; i < count; i++) {
    angles.value[i] += 0.005 + i * 0.00005
  }
  requestAnimationFrame(animate)
}

// Toggle the paused state on right-click
const togglePause = (event) => {
  event.preventDefault() // Prevent the context menu from appearing
  paused.value = !paused.value
  if (!paused.value) {
    animate() // Restart animation if unpaused
  }
}

// Toggle mouse-follow state on left-click
const toggleMouseFollow = () => {
  followMouse.value = !followMouse.value
  if (!followMouse.value) {
    mouseInfluence.value.x = 0
    mouseInfluence.value.y = 0
  }
}

onMounted(() => {
  document.addEventListener('mousemove', (event) => {
    if (followMouse.value) {
      mousePosition.value.x += (event.clientX - mousePosition.value.x) * smoothFactor
      mousePosition.value.y += (event.clientY - mousePosition.value.y) * smoothFactor

      mouseInfluence.value.x = mousePosition.value.x
      mouseInfluence.value.y = mousePosition.value.y
    }
  })

  // Listen for right-click (pause animation)
  document.addEventListener('contextmenu', togglePause)

  // Listen for left-click (toggle mouse-follow state)
  document.addEventListener('click', toggleMouseFollow)

  animate()
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', togglePause)
  document.removeEventListener('click', toggleMouseFollow)
})
</script>

<template>
  <main>
    <div class="container">
      <SquareNoAnimation
        v-for="(angle, n) in angles"
        :key="n"
        class="square"
        :style="{
          transform: `
            translate(
              ${Math.cos(angle + n * 0.01) * n * 1.2 + mouseInfluence.x * 0.05 + Math.cos(angle + n * 0.04 + mouseInfluence.x * 0.006) * n * 0.5}px, 
              ${Math.sin(angle + n * 0.04) * n * 1.2 + mouseInfluence.y * 0.05 + Math.sin(angle + n * 0.04 + mouseInfluence.y * 0.006) * n * 0.5}px
            )
            scale(${3 + Math.sin(angle * 1 + n * 0.05) * 0.4})    
            rotate(${n + -45454}deg)
          `,
          opacity: n < 300 ? 1 : 1 - (n - 300) / 300,
          zIndex: -11 - n
        }"
      />
      <div class="pauseinfo">right click toggle animatione</div>
      <div class="pauseinfo1">left click toggle mouusefollow</div>
    </div>
  </main>
</template>

<style scoped>
.square {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.178);

  will-change: transform;
  opacity: 1;
  background: linear-gradient(to right, #8bbdab, #dcedc1);
  /* background: linear-gradient(to right, #c8b97c, #ddd096); */
}

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

main {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(208, 203, 162, 0.802);
  overflow: hidden;
  font-family: 'IBM Plex Mono';
  color: #333;
  cursor: pointer;
}

main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.45;
  z-index: -1;
}

.pauseinfo {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  /* top: 10px; */
  bottom: 10px;
  right: 12px;
  /* padding: 10px 20px; */
  font-size: 12px;
  color: #00000087;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 10vw;
  text-align: right;
}
.pauseinfo1 {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  /* top: 10px; */
  padding-bottom: 20px;
  bottom: 20px;
  right: 12px;
  /* padding: 10px 20px; */
  font-size: 12px;
  color: #00000087;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 10vw;
  text-align: right;
}
</style>
