<template>
  <div v-once class="token" :style="style">
    <span class="point">{{ bet }}</span>
    <img :src="avatar" class="avatar" />
  </div>
</template>

<script setup lang="ts">
import { getRandomInt } from "../helper/random";

defineProps<{
  id: string;
  name: string;
  avatar: string;
  bet: number;
}>();

const style = {
  left: getRandomInt(10, 80) + "%",
  top: getRandomInt(10, 80) + "%",
  transform: `rotate(${getRandomInt(-60, 60)}deg)`,
};
</script>

<style scoped>
.token {
  animation-duration: 1.2s;
  position: absolute;
}

.avatar {
  max-width: 50px;
  border-radius: 50px;
  border: 4px white double;
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.6);
}

.point {
  position: absolute;
  top: 35%;
  left: 35%;
  font-size: 13px;
  font-weight: bold;
  background: white;
  padding: 2px 2px;
  line-height: 7px;
}
</style>
