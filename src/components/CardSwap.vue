<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card elevation="0">
          <template v-slot:title>
            <div class="text-center text-md-h4 font-weight-bold text-sm-h5">
              Memory game
            </div>
          </template>
          <template v-slot:append>
            <div class="d-flex ga-3">
            <v-icon icon="mdi-cog" @click="this.openSettings = true">
            </v-icon>

            <v-icon @click="toggleSound" :color="isSoundEnabled ? 'black' : 'grey'">
              {{isSoundEnabled ? 'mdi-volume-high': 'mdi-volume-off'}}
            </v-icon>
            </div>

            <v-dialog v-model="this.openSettings">
              <v-card>
                <v-card-title>
                  Settings
                </v-card-title>
                <v-card-text class="px-5 py-0">
                  <v-list>
                    <v-list-item class="mr-0 pa-0">
                      <template v-slot:prepend>
                        Cards number:
                      </template>
                      <template v-slot:append>
                        <v-select
                            :max-width="140"
                            v-model="this.settingsCountCards"
                            :items="[6, 8, 10, 12, 14, 16]"
                        >
                        </v-select>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="this.applySettings" variant="flat" color="primary">
                    <span>Apply</span>
                  </v-btn>
                  <v-btn @click="this.openSettings = false" variant="flat" color="secondary">
                    <span>Close</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <v-divider/>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="(card, index) in this.cards"
             :key="index"
             cols="3"
             class="d-flex justify-center"
      >
        <v-card
            @click="flipCard(index)"
            :elevation="card.flipped ? 12 : 2"
            outlined
            class="memory-card"
            :class="{
                  'flipped': card.flipped
                }"
            :disabled="!isActiveSession"
        >
          <div class="memory-card-inner">
            <div class="memory-card-front">
              ?
            </div>
            <div class="memory-card-back" :class="{'memory-card-back--matched': card.match}">
              {{ card.value }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-divider></v-divider>
      <v-col cols="auto" class="d-flex flex-colum ga-5">
        <v-chip color="primary">
          Score: {{ score }}
        </v-chip>
        <v-chip color="secondary">
          Time: {{formattedTime}}
        </v-chip>
      </v-col>

    </v-row>

      <v-row justify="center">
        <div class="d-flex ga-5">
          <v-btn color="primary" @click="resetGame">
            <span>Reset game</span>
          </v-btn>
          <v-btn color="secondary" @click="startGame" :disabled="isActiveSession">
            <span>Start game</span>
          </v-btn>
        </div>
    </v-row>

    <v-dialog v-model="showResults" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-center">Game results:</v-card-title>
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
          <v-btn color="primary" @click="startGame" variant="flat">
            Play again
          </v-btn>
          <v-btn color="secondary" @click="showResults=false" variant="flat">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

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
    }
  },
  created() {
    this.initializeGame();
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeElapsed / 60);
      const seconds = this.timeElapsed % 60;

      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }
  },

  methods: {
    showAlert() {
      this.tg.showAlert('This is a Telegram Mini App alert!')
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
      if (this.lockBoard || this.cards[index].flipped || this.flippedCards.length === 2) return;

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
        ++this.matchedPairs;

        this.score += this.calculateScore();

        this.playMatchSound();
        this.checkWin();
      } else {
        this.lockBoard = true;

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
      this.resetTimer();
    },

    startGame() {
      this.initializeGame();
      this.startTimer();
      this.isActiveSession = true;
    },

    calculateScore() {
      const baseScore = 100;
      const timePenalty = Math.floor(this.timeElapsed / 5);
      const minimumScore = 10;

      const currentScore = baseScore - timePenalty;

      return Math.max(currentScore, minimumScore);
    },

    resetGame() {
      this.lockBoard = true;
      this.showResults = false;
      this.isActiveSession = false;
      this.matchedPairs = 0;
      this.score = 0;
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
    }
  }
}
</script>
<style scoped>
.memory-card {
  width: 100px;
  height: 100px;
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
  background-color: #59b7ef;
}

.memory-card-back--matched {
  background-color: #44cd5b;
}
</style>