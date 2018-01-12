

<template>
<div class="container is-fullhd">
  <div class="columns">
    <div class="column is-8">
      <div class="columns">
        <div class="column is-6">
          <dice v-for="number in numbers" :number="number"></dice>
        </div>
        <div class="column is-6">
          Timer: 1
          <progress class="progress is-success" value="60" max="100">60%</progress>
          <button class="button is-primary">Play</button>
        </div>
        
      </div>

      <div>
        <div class="bc-table">
          <img src="./assets/baucua.jpg" alt="" class="image bc-image"/>
          <div class="bc-overlay">
            <div class="tokens" v-for="tokens in allTokens">
              <token v-for="token in tokens" :key="token.id" v-bind="token"></token>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
    <div class="column is-4">
      <h1 class="title">Bầu cua cùng Code Dạo</h1>

      <div class="content">
        <h3 class="is-medium">Bảng xếp hạng</h3>
        <table class="table is-striped is-narrow">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Avatar</th>
              <th>Tên</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="player.id" v-for="player in leaderboards">
              <td>{{player.id}}</td>
              <td><img class="avatar" :src="player.imgUrl" /></td>
              <td>{{player.name}}</td>
              <td>10</td>
            </tr>  
          </tbody> 
        </table>
      </div>
      
      <div class="content">
        <h3 class="is-medium">Thông báo</h3>

        <div class="panel">
          <notification :key="notification.name" 
          v-for="notification in notifications" v-bind="notification" />
        </div>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
import Dice from "./dice.vue";
import Token from "./token.vue";
import Notification from "./notification.vue";

export default {
  name: "app",
  data() {
    return {
      numbers: [1, 2, 5],
      msg: "Welcome to Your Vue.js App",
      allTokens: [
        [
          {
            id: 1,
            name: "Harry",
            point: 3,
            imgUrl:
              "https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png"
          },
          {
            id: 2,
            name: "Harry Won",
            point: 10,
            imgUrl:
              "https://pickaface.net/gallery/avatar/62174948_180112_1525_2keep5a.png"
          },
          {
            id: 3,
            name: "Tran Thanh",
            point: 20,
            imgUrl:
              "https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png"
          },
          {
            id: 4,
            name: "Lol",
            point: 4,
            imgUrl:
              "https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png"
          },
          {
            id: 5,
            name: "Hai",
            point: 1,
            imgUrl:
              "https://pickaface.net/gallery/avatar/unr_dudu_180112_1930_x93vb.png"
          }
        ],
        [],
        [],
        [],
        [],
        []
      ],
      leaderboards: [
        {
          id: 1,
          name: "Harry",
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png"
        },
        {
          id: 2,
          name: "Harry Won",
          imgUrl:
            "https://pickaface.net/gallery/avatar/62174948_180112_1525_2keep5a.png"
        },
        {
          id: 3,
          name: "Tran Thanh",
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png"
        },
        {
          id: 4,
          name: "Lol",
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png"
        },
        {
          id: 5,
          name: "Hai",
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_dudu_180112_1930_x93vb.png"
        }
      ],
      notifications: [
        {
          selection: "CUA",
          name: "Harry",
          point: 3,
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png"
        },
        {
          selection: "TOM",
          name: "Harry Won",
          point: 10,
          imgUrl:
            "https://pickaface.net/gallery/avatar/62174948_180112_1525_2keep5a.png"
        },
        {
          selection: "NAI",
          name: "Tran Thanh",
          point: 20,
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png"
        },
        {
          selection: "COP",
          name: "Lol",
          point: 4,
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png"
        },
        {
          selection: "TOM",
          name: "Hai",
          point: 1,
          imgUrl:
            "https://pickaface.net/gallery/avatar/unr_dudu_180112_1930_x93vb.png"
        }
      ]
    };
  },
  components: {
    dice: Dice,
    token: Token,
    notification: Notification
  }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

.container {
  padding: 0 20px;
  margin-top: 12px;
}

.bc-image {
  opacity: 0.6;
}

.bc-table {
  position: relative;
}

.notification {
  padding: 0.5em;
}

.avatar {
  max-width: 35px;
}

.bc-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.tokens {
  position: relative;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
