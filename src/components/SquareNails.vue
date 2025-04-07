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
  border-radius: 20%;
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.773),
    -10px -10px 20px rgba(218, 215, 191, 0.802);
  transform: rotate(10deg) skewX(-108deg) skewY(1deg);
  /* background: linear-gradient(45deg, #B88C81, #D5CCC7); */
}


.square:nth-child(even) {
  transform: rotate(10deg) skewX(70deg) skewY(-20deg);
  background: linear-gradient(45deg, #B88C81, #D5CCC7);
  
}
</style>