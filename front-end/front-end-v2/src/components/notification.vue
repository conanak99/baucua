<template>
  <div class="panel-block">
    <img class="mini avatar" :src="player.avatar" alt="" />
    <span>
      <b>{{ player.name }}</b> đã đặt <b>{{ bet }} đồng {{ choice }}</b>
    </span>
  </div>
</template>

<script setup lang="ts">
import Player from "../model/Player";

defineProps<{
  player: Player;
  bet: number;
  choice: string;
}>();
</script>

<style scoped>
.avatar.mini {
  max-width: 20px;
  margin-right: 5px;
}
</style>
