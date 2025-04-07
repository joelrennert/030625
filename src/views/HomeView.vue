<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SquareNoAnimation from '../components/SquareNoAnimation.vue'

const count = window.innerWidth < 768 ? 400 : 600
const angles = ref(new Array(count).fill(0))
const mousePosition = ref({ x: 0, y: 0 })

const smoothFactor = 0.1
const paused = ref(false)

let animationFrameId
const motionPosition = ref({ x: 0, y: 0 })

const animate = () => {
  if (paused.value) return
  for (let i = 0; i < count; i++) {
    angles.value[i] += 0.005 + i * 0.00005
  }
  animationFrameId = requestAnimationFrame(animate)
}

const handleDeviceMotion = (event) => {
  const { beta, gamma } = event.rotationRate // tilt data from phone

  // Adjust motionPosition based on the tilt/rotation
  motionPosition.value.x += gamma * 0.1
  motionPosition.value.y += beta * 0.1
}

const requestMotionPermission = () => {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          // Permission granted, add event listener
          window.addEventListener('deviceorientation', handleDeviceMotion)
        } else {
          console.log("Permission denied for device motion.")
        }
      })
      .catch((error) => {
        console.error("Error requesting permission:", error)
      })
  } else {
    // For non-iOS devices, directly add the event listener
    window.addEventListener('deviceorientation', handleDeviceMotion)
  }
}

const togglePauseOnTouch = () => {
  paused.value = !paused.value
  if (!paused.value) {
    animate()
  }
}

const togglePause = () => {
  if (paused.value) {
    paused.value = false
    animate()
  } else {
    paused.value = true
    cancelAnimationFrame(animationFrameId)
  }
}

onMounted(() => {
  // Ensure permission is granted before adding the event listener for motion
  if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
    document.body.addEventListener('touchstart', requestMotionPermission)
  } else {
    // For devices that don't need permission, directly add event listener
    window.addEventListener('deviceorientation', handleDeviceMotion)
  }

  document.body.addEventListener('touchstart', togglePauseOnTouch)

  document.addEventListener('mousemove', (event) => {
    mousePosition.value.x += (event.clientX - mousePosition.value.x) * smoothFactor
    mousePosition.value.y += (event.clientY - mousePosition.value.y) * smoothFactor
  })

  document.addEventListener('click', togglePause)

  animate()
})

onUnmounted(() => {
  document.removeEventListener('click', togglePause)
  document.removeEventListener('touchstart', togglePauseOnTouch)
  window.removeEventListener('deviceorientation', handleDeviceMotion)
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
              ${Math.cos(angle + n * 0.04) * n * 1.2 + mousePosition.x * 0.05 + Math.cos(angle + n * 0.04 + mousePosition.x * 0.006) * n * 0.5}px, 
              ${Math.sin(angle + n * 0.04) * n * 1.2 + mousePosition.y * 0.05 + Math.sin(angle + n * 0.04 + mousePosition.y * 0.006) * n * 0.5}px
            )
            scale(${1.5 + Math.sin(angle * 2 + n * 0.05) * 0.4})    
            rotate(${n + 45454}deg)
          `,
          opacity: n < 300 ? 1 : 1 - (n - 300) / 300
        }"
      />
      <div class="pauseinfo">{{ paused ? 'Click to ▶️' : 'Click to ⏸️' }}</div>
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
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: #00000087;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 10vw;
}
</style>