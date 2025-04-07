<template>
  <div class="square"><a href="#"></a></div>
</template>

<script></script>

<style scoped>
img {
  width: 10vw;
  height: 10vh;
}

.square {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.4rem;
  padding: 20px;
  animation:
    pulse 2s ease-in-out infinite;

  border-radius: 0%;
  box-shadow:
    10px 10px 20px rgba(229, 231, 226, 0.73),
    -10px -10px 20px rgba(218, 215, 191, 0.802);
  transform: rotate(180deg) skewX(-20deg) skewY(15deg);
}

.square:nth-child(even) {
  animation: spinReverse 20s linear infinite;
}


@keyframes spin {
  0% {
    /* transform: rotate(0deg); */
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinReverse {
  0% {
    /* transform: rotate(0deg); */
  }
  100% {
    transform: rotate(-360deg);
  }
}


</style>
