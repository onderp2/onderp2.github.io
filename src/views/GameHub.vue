<template>
  <v-container class="bg-color container">
    <v-row>
      <v-col cols="12">
        <v-card :style="{backgroundColor: 'var(--button-color)', color: 'var(--bg-color)'}">
          <template v-slot:title :style="{color: 'var(--bg-color)'}">
            <div>
              Game hub
            </div>
          </template>
          <template v-slot:append>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-theme-light-dark" @click="this.toggleTheme" size="20">
              </v-icon>
              <v-icon icon="mdi-account">
              </v-icon>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(game, index) in games"
      cols="6"
      :key="index"
      >
        <v-card
            @click="navigateTo(game.link)"
            :style="{backgroundColor: 'var(--button-color)', color: 'var(--bg-color)'}"
            class="text-center"
        >
          <v-card-title >
            <v-icon size="50">
              {{game.icon}}
            </v-icon>
          </v-card-title>
          <v-card-text>
            {{game.name}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router';

export default {
  name: 'GameHub',

  data() {
    return {
      games: [
        {
          name: "Memory game",
          link: '/games/memory-game',
          icon: 'mdi-brain'
        },
        {
          name: "Math game",
          link: '/games/math',
          icon: 'mdi-calculator'
        }
      ]
    }
  },

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}

.bg-color {
  background-color: var(--bg-color) !important;
}

.text-color {
  color: var(--text-color) !important;
}

.button-color {
  background-color: var(--button-color) !important;
}

</style>