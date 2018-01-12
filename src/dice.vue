<template>
  <div class="dice">
      <img :src="url" />
  </div>
</template>

<script>
    var allUrls = ['1-cop', '2-bau', '3-ga', '4-tom', '5-ca', '6-cua'];

    export default {
        name : 'dice',
        props: ['number'],
        data() {
            var url = require(`./assets/${allUrls[this.number - 1]}.jpg`); 
            return { url };
        }
    }
</script>

<style>
.dice {
    display: inline-block;
}

.dice img {
    max-width: 80px;
    border: 2px solid gray;
    border-radius: 10px;
    box-shadow: 1px 2px 1px 0px rgba(0,0,0,0.55);
    margin: 5px;
}
</style>