<template>
  <v-container class="game-container" :style="{ backgroundColor: telegramTheme.bgColor, color: telegramTheme.textColor }">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card elevation="0" :style="{ backgroundColor: telegramTheme.bgColor, color: telegramTheme.textColor }">
          <template v-slot:title>
            <div class="text-center text-md-h4 font-weight-bold text-sm-h5">
              Memory game
            </div>
          </template>
          <template v-slot:append>
            <div class="d-flex ga-3">
              <v-icon icon="mdi-cog" @click="this.openSettings = true">
              </v-icon>

              <v-icon @click="toggleSound" :color="isSoundEnabled ? telegramTheme.textColor : '#aaa'">
                {{isSoundEnabled ? 'mdi-volume-high': 'mdi-volume-off'}}
              </v-icon>
            </div>
          </template>
          <v-divider/>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="cards-grid" :style="{gridTemplateColumns: gridFormat}">
      <v-card
          v-for="(card, index) in cards"
          :key="index"
          @click="flipCard(index)"
          class="memory-card"
          :elevation="0"
          :class="{ flipped: card.flipped }"
          :disabled="!isActiveSession"
      >
        <div class="memory-card-inner" :style="{ backgroundColor: telegramTheme.buttonColor, color: telegramTheme.textColor }">
          <div class="memory-card-front">?</div>
          <div class="memory-card-back"
               :class="{ 'memory-card-back--matched': card.match }"
               >
            {{ card.value }}
          </div>
        </div>
      </v-card>
    </v-row>

    <v-row justify="center" class="mt-4 position-relative">
      <v-divider></v-divider>
      <v-col cols="12" class="d-flex flex-colum ga-5 justify-center">
        <v-chip color="primary">
          Score: {{ score }}
        </v-chip>
        <v-chip color="secondary">
          Time: {{formattedTime}}
        </v-chip>
      </v-col>
      <v-col cols="12" v-if="isShowMultiplier" class="multiplier-notification text-center">
        <v-chip color="success" outlined class="multiplier-chip" size="30">
          x{{ this.consecutiveMatches }} Multiplier!
        </v-chip>
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <div class="d-flex ga-5 flex-shrink-1 flex-grow-0 flex-wrap justify-center">
          <v-btn color="secondary" @click="resetGame">
            <span>Reset game</span>
          </v-btn>
          <v-btn :style="{ backgroundColor: telegramTheme.buttonColor, color: '#fff' }" @click="startGame" :disabled="isActiveSession">
            <span>Start game</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showResults" persistent transition="dialog-top-transition">
      <v-card :style="{ backgroundColor: telegramTheme.bgColor, color: telegramTheme.textColor }">
        <v-card-title class="text-center">
          <div class="d-flex flex-column ga-2">
            <div class="font-weight-bold">
              Game results:
            </div>
            <div class="align-self-center text-subtitle-1">
              {{ this.generateCongratulationMessage()}}
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column">
            <div>
              You finished in: {{this.formattedTime}}
            </div>
            <div>
              Your score: {{this.score}}
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn :style="{ backgroundColor: telegramTheme.buttonColor, color: '#fff' }" @click="startGame" variant="flat">
            Play again
          </v-btn>
          <v-btn color="secondary" @click="showResults=false" variant="flat">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="this.openSettings">
      <v-card :style="{ backgroundColor: telegramTheme.bgColor, color: telegramTheme.textColor }">
        <v-card-title>
          Settings
        </v-card-title>
        <v-card-text class="px-5 py-0">
          <v-list :style="{ backgroundColor: telegramTheme.bgColor, color: telegramTheme.textColor }">
            <v-list-item class="mr-0 pa-0">
              <template v-slot:prepend>
                Cards number:
              </template>
              <template v-slot:append>
                <v-select
                    :max-width="140"
                    v-model="this.settingsCountCards"
                    :items="[4, 6, 8, 10, 12, 14, 16]"
                >
                </v-select>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="this.applySettings" variant="flat" :style="{ backgroundColor: telegramTheme.buttonColor, color: '#fff' }">
            <span>Apply</span>
          </v-btn>
          <v-btn @click="this.openSettings = false" variant="flat" color="secondary">
            <span>Close</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'CardSwap',

  data() {
    return {
      cardsCount: 6,
      cards: this.generateCards(),
      flippedCards: [],
      lockBoard: false,
      matchedPairs: 0,
      timer: null,
      timeElapsed: 0,
      showResults: false,
      isActiveSession: false,
      openSettings: false,
      settingsCountCards: 6,
      score: 0,
      isSoundEnabled: true,
      consecutiveMatches: 0,
      isShowMultiplier: false,
      congratulationMessages: [
        "You are awesome! 🎉👏",
        "Fantastic job! 🚀🔥",
        "You're a genius! 🧠💡",
        "Unstoppable! 💪🎯",
        "Legendary performance! 🏆✨"
      ],
      telegramTheme: {
        bgColor: '#ffffff',
        textColor: '#000000',
        buttonColor: '#0088cc',
      }
    }
  },
  created() {
    this.initializeGame();
    this.detectTelegramTheme();
  },

  mounted() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.onEvent('themeChanged', this.detectTelegramTheme)
    }
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeElapsed / 60);
      const seconds = this.timeElapsed % 60;

      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    },

    gridFormat() {
     if (this.cardsCount === 4) {
        return "repeat(2, 1fr)";
      }

      return "repeat(4, 1fr)";
    }
  },

  methods: {
    detectTelegramTheme() {
      if (window.Telegram && window.Telegram.WebApp) {
        const themeParams = window.Telegram.WebApp.themeParams;
        this.telegramTheme.bgColor = themeParams.bg_color || '#ffffff';
        this.telegramTheme.textColor = themeParams.text_color || '#000000';
        this.telegramTheme.buttonColor = themeParams.button_color || '#0088cc';
      } else {
        this.telegramTheme.bgColor = '#ffffff';
        this.telegramTheme.textColor = '#000000';
        this.telegramTheme.buttonColor = '#0088cc';
      }

      document.documentElement.style.setProperty('--bg-color', this.telegramTheme.bgColor);
      document.documentElement.style.setProperty('--text-color', this.telegramTheme.textColor);
      document.documentElement.style.setProperty('--button-color', this.telegramTheme.buttonColor);
      document.documentElement.style.setProperty('--matched-color', '#44cd5b'); // Optional custom color
    },

    generateCards() {
      const value = Array.from({length: this.cardsCount}, (_, i) => i + 1);
      const deck = [...value, ...value].sort(() => Math.random() - 0.5);

      return deck.map((value) => ({
        value: value,
        flipped: false,
        matched: false,
      }));
    },

    flipCard(index) {
      if (this.lockBoard || this.flippedCards.length === 2 || this.cards[index].match) return;

      if (this.flippedCards.includes(index) && this.flippedCards.length === 1) {
        this.cards[index].flipped = false;
        this.flippedCards = [];

        return;
      }

      this.flippedCards.push(index);
      this.cards[index].flipped = true;

      this.playFlipSound();

      if (this.flippedCards.length === 2) {
        this.checkMatchedCards();
      }
    },

    checkMatchedCards() {
      const [firstIndex, secondIndex] = this.flippedCards;

      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        firstCard.match = true;
        secondCard.match = true;

        firstCard.flipped = true;
        secondCard.flipped = true;

        this.flippedCards = [];

        this.consecutiveMatches++;
        this.matchedPairs++

        this.score += this.calculateScore();

        if (this.consecutiveMatches > 1) {
          this.showMultiplier();
        }

        this.playMatchSound();
        this.checkWin();
      } else {
        this.lockBoard = true;
        this.consecutiveMatches = 0;

        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          this.flippedCards = [];
          this.lockBoard = false;
        }, 1000);
      }
    },

    applySettings() {
      this.cardsCount = this.settingsCountCards;
      this.openSettings = false;

      this.initializeGame();
    },

    checkWin() {
      if (this.matchedPairs === this.cardsCount) {
        this.playWinSound();
        this.stopTimer();

        setTimeout(() => {
          this.showResults = true
        }, 500);
        this.tg.showAlert("Congratulations! You won!");
      }
    },

    initializeGame() {
      this.cards = this.generateCards();
      this.flippedCards = [];
      this.lockBoard = false;
      this.matchedPairs = 0;
      this.score = 0;
      this.consecutiveMatches = 0;
      this.resetTimer();
    },

    startGame() {
      this.showResults = false;
      this.initializeGame();
      this.startTimer();
      this.isActiveSession = true;
    },

    calculateScore() {
      const baseScore = 100;
      const timePenalty = Math.floor(this.timeElapsed / 5);
      const minimumScore = 10;

      const multiplier = this.consecutiveMatches > 1 ? this.consecutiveMatches : 1;

      const currentScore = (baseScore - timePenalty) * multiplier;

      return Math.max(currentScore, minimumScore);
    },

    resetGame() {
      this.lockBoard = true;
      this.showResults = false;
      this.isActiveSession = false;
      this.matchedPairs = 0;
      this.score = 0;
      this.consecutiveMatches = 0;
      this.resetTimer();
      this.cards.forEach(card => (card.flipped = false));
    },

    startTimer() {
      if (this.timer !== null) return;
      this.timer = setInterval(() => {
        this.timeElapsed++;
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },

    resetTimer() {
      clearInterval(this.timer);
      this.timer = null ;
      this.timeElapsed = 0;
    },

    playFlipSound() {
      const flipSound = new Audio('/audio/flipcard.mp3')
      if (this.isSoundEnabled) flipSound?.play();
    },

    playMatchSound() {
      const matchSound = new Audio('/audio/match.mp3');
      if (this.isSoundEnabled) matchSound?.play();
    },

    playWinSound() {
      const winSound = new Audio('/audio/win.mp3');

      if (this.isSoundEnabled) winSound?.play();
    },

    toggleSound() {
      this.isSoundEnabled = !this.isSoundEnabled;
    },

    showMultiplier() {
      this.isShowMultiplier = true;

      setTimeout(() => {
        this.isShowMultiplier = false;
      }, 2000);
    },

    generateCongratulationMessage() {
      const randomIndex = Math.floor(Math.random() * this.congratulationMessages.length);

      return this.congratulationMessages[randomIndex];
    }
  }
}
</script>
<style scoped>

.game-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
}

.memory-card {
  aspect-ratio: 1 / 1; /* Ensures cards are always square */
  width: 95%;
  height: 95%;
  border: 2px solid var(--text-color, #ccc);
  background-color: var(--bg-color, #f5f5f5);;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.memory-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.memory-card.flipped .memory-card-inner {
  transform: rotateY(180deg);
}

.memory-card-front,
.memory-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background-color: #f5f5f5;
}

.memory-card-back {
  transform: rotateY(180deg);
  background-color: var(--button-color, #59b7ef);
}

.memory-card-back--matched {
  background-color: var(--matched-color, #44cd5b);
}

.multiplier-notification {
  position: absolute;
  top: -20px;
  z-index: 1000;
  animation: fadeOut 2s ease-out forwards;
}

.multiplier-chip {
  font-size: 18px;
  font-weight: bold;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>