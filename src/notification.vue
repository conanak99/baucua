<template>
    <div class="panel-block">
            <img class="mini avatar" :src="imgUrl" alt="" />
            <span>
              <b>{{name}}</b> đã đặt <b>{{point}} đồng {{selection}}</b>
            </span>
    </div>
</template>
  
<script>
export default {
  name: "notification",
  props: {
    name: String,
    imgUrl: String,
    point: Number,
    selection: String
  }
};
</script>

<style scoped>
.avatar.mini {
  max-width: 20px;
  margin-right: 5px;
}
</style>