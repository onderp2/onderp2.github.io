<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">
          Memory game
          <v-divider/>
        </h1>
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

    <v-row justify="center" >
      <v-col cols="auto" class="d-flex flex-colum ga-5">
        <v-chip color="primary">
          Score: {{ matchedPairs}}
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
              Your score: {{this.matchedPairs}}
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
      const value = Array.from({length: 6}, (_, i) => i + 1);
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
      this.resetTimer();
    },

    startGame() {
      this.initializeGame();
      this.startTimer();
      this.isActiveSession = true;
    },

    resetGame() {
      this.lockBoard = true;
      this.showResults = false;
      this.isActiveSession = false;
      this.matchedPairs = 0;
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
      flipSound?.play();
    },

    playMatchSound() {
      const matchSound = new Audio('/audio/match.mp3');
      matchSound?.play();
    },

    playWinSound() {
      const winSound = new Audio('/audio/win.mp3');
      winSound?.play();
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