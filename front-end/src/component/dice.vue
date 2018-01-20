<template>
  <div class="dice" :class="classObject">
      <img :src="url" />
  </div>
</template>

<script>
var allUrls = ["1-cop", "2-bau", "3-ga", "4-tom", "5-ca", "6-cua"];
var requiredUrl = allUrls.map(url => require(`./../../assets/${url}.jpg`));

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max - min + 1));
}

export default {
  name: "dice",
  props: ["number", "isRolling"],
  data() {
    return {
      displayNum: this.number,
      interval: null
    };
  },
  computed: {
    url() { 
      return requiredUrl[this.displayNum - 1]; 
    },
    classObject() {
      return {
        'animated wobble infinite': this.isRolling
      };
    }
  },
  watch: {
    isRolling(value) {
      var component = this;
      if (value) {
        this.interval = setInterval(() => {
          component.displayNum = getRandomInt(1,6);
        }, 150); 
      } else {
        if (this.interval) {
           clearInterval(this.interval);
           this.interval = null;
        }
        this.displayNum = this.number;
      }
    }
  }
};
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