<template>
  <div class="dice" :class="classObject">
    <img :src="url" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { getRandomInt } from "../helper/random";

const props = defineProps<{ number: number; isRolling: boolean }>();

const state = reactive({ displayNum: props.number });
const interval = ref(0);

const url = computed(() => {
  return `./assets/${state.displayNum - 1}.png`;
});
const classObject = computed(() => {
  return {
    "animated wobble infinite": props.isRolling,
  };
});

watch(
  () => props.isRolling,
  (value) => {
    if (value) {
      interval.value = setInterval(() => {
        state.displayNum = getRandomInt(1, 6);
      }, 150);
    } else {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value = 0;
      }
      state.displayNum = props.number;
    }
  }
);
</script>

<style>
.dice {
  display: inline-block;
  animation-duration: 0.8s;
}

.dice img {
  max-width: 80px;
  border: 2px solid gray;
  border-radius: 10px;
  box-shadow: 1px 2px 1px 0px rgba(0, 0, 0, 0.55);
  margin: 5px;
}
</style>
