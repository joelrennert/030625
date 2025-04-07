<template>
  <div class="square"><a href="#"></a></div>
</template>

<script></script>

<style scoped>
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  padding: 1%;
  border-radius: 50%;
  box-shadow:
    8px 8px 18px rgba(0, 0, 0, 0.348),
    -8px -8px 18px rgba(218, 215, 191, 0.6);
  transform: rotate(100deg) skewX(10deg) skewY(10deg);
  animation: pulse 20s ease-in-out infinite;
}

/* .square:nth-child(even) {
  transform: rotate(100deeg) skewX(10deg) skewY(-20deg);
} */

@keyframes pulse {
  0% {
    transform: scale(1.3) rotate(100deg) skewX(10deg) skewY(10deg);
  }
  50% {
    transform: scale(1.35) rotate(100deg) skewX(10deg) skewY(10deg);
  }
  100% {
    transform: scale(1.3) rotate(100deg) skewX(10deg) skewY(10deg);
  }
}
</style>
