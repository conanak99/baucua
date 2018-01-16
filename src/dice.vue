<template>
  <div class="dice">
      <img :src="url" />
  </div>
</template>

<script>
var allUrls = ["1-cop", "2-bau", "3-ga", "4-tom", "5-ca", "6-cua"];
var requiredUrl = allUrls.map(url => require(`./assets/${url}.jpg`));

export default {
  name: "dice",
  props: ["number"],
  computed: {
    url() { 
      return requiredUrl[this.number]; }
  }
};
</script>

<style>
.dice {
  display: inline-block;
}

.dice img {
  max-width: 80px;
  border: 2px solid gray;
  border-radius: 10px;
  box-shadow: 1px 2px 1px 0px rgba(0, 0, 0, 0.55);
  margin: 5px;
}
</style>