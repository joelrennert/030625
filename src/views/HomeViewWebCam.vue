<script setup>
import { ref, onMounted } from 'vue'
import SquareNoAnimation from '../components/SquareNoAnimation.vue'

const count = window.innerWidth < 768 ? 400 : 600
const angles = ref(new Array(count).fill(0))
const motionPosition = ref({ x: 0, y: 0 })
const smoothFactor = 0.1
const paused = ref(false)

// let animationFrameId
let video, canvas, ctx, lastImageData

const animate = () => {
  if (paused.value) return

  for (let i = 0; i < count; i++) {
    angles.value[i] += 0.01 + i * 0.0001
  }
  // animationFrameId = requestAnimationFrame(animate)
}

const detectMotion = () => {
  if (!ctx || paused.value) return

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  if (lastImageData) {
    let totalX = 0,
      totalY = 0,
      totalChanged = 0
    for (let i = 0; i < currentImageData.data.length; i += 4) {
      const rDiff = Math.abs(currentImageData.data[i] - lastImageData.data[i])
      const gDiff = Math.abs(currentImageData.data[i + 1] - lastImageData.data[i + 1])
      const bDiff = Math.abs(currentImageData.data[i + 2] - lastImageData.data[i + 2])
      const diff = rDiff + gDiff + bDiff

      if (diff > 60) {
        const pixelIndex = i / 4
        const x = pixelIndex % canvas.width
        const y = Math.floor(pixelIndex / canvas.width)
        totalX += x
        totalY += y
        totalChanged++
      }
    }

    if (totalChanged > 1000) {
      const avgX = totalX / totalChanged
      const avgY = totalY / totalChanged
      motionPosition.value.x += (avgX - motionPosition.value.x) * smoothFactor
      motionPosition.value.y += (avgY - motionPosition.value.y) * smoothFactor
    }
  }

  lastImageData = currentImageData
  requestAnimationFrame(detectMotion)
}

onMounted(() => {
  // Webcam setup
  video = document.createElement('video')
  video.autoplay = true
  video.playsInline = true
  video.style.display = 'none'
  document.body.appendChild(video)

  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      detectMotion()
    })
  })

  animate()
})

const togglePause = () => {
  paused.value = !paused.value
  if (!paused.value) {
    animate()
    detectMotion()
  }
}
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
      ${Math.cos(angle + n * 0.04) * n * 1.2 + motionPosition.x * 0.05 + Math.cos(angle + n * 0.04 + motionPosition.x * 0.03) * n * 0.5}px, 
      ${Math.sin(angle + n * 0.04) * n * 1.2 + motionPosition.y * 0.05 + Math.sin(angle + n * 0.04 + motionPosition.y * 0.03) * n * 0.5}px
    )
    scale(${1 + Math.sin(angle * 2 + n * 0.05) * 0.2})
    rotate(${n + 45454}deg)
  `,
          opacity: n < 300 ? 1 : 1 - (n - 300) / 300
        }"
      />
      <button @click="togglePause">{{ paused ? 'Resume' : 'Pause' }} Animation</button>
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
