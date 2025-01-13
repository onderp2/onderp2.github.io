<template>
  <v-app>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/CardSwap.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  mounted() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      console.log('Telegram Web App SDK is ready!');
    } else {
      console.log('Telegram is not ready!');
    }
  },

  watch: {
    '$route'(to, from) {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        console.log('Telegram Web App SDK is ready after route change!');
      }
    }
  }
}
</script>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --button-color: #0088cc;
  --matched-color: #44cd5b;
  --button-text-color: #ffffff;
  --card-bg-color: #6d6191;
  --card-base-bg-color: #e5d7d7;
}

[data-theme="dark"] {
  --bg-color: #1e1e1e;
  --text-color: #fff;
  --button-color: #0088cc;
  --matched-color: #44cd5b;
  --card-bg-color: #fff;
  --card-base-bg-color: #e5d7d7;
}
</style>
