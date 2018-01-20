<template>
    <div class="panel-block">
      <img class="mini avatar" :src="player.avatar" alt="" />
      <span>
        <b>{{player.name}}</b> đã đặt <b>{{bet}} đồng {{choice}}</b>
      </span>
    </div>
</template>
  
<script>
export default {
  name: "notification",
  props: {
    player: Object,
    bet: Number,
    choice: String
  }
};
</script>

<style scoped>
.avatar.mini {
  max-width: 20px;
  margin-right: 5px;
}
</style>