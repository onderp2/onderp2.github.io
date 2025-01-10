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
