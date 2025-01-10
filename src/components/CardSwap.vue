<template>
  <v-container>
    <h1 class="text-center mb-4">
      Memory game
      <v-divider/>
    </h1>

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
        >
          <div class="memory-card-inner">
            <!-- Front Face -->
            <div class="memory-card-front">
              ?
            </div>
            <!-- Back Face -->
            <div class="memory-card-back" :class="{'memory-card-back--matched': card.match}">
              {{ card.value }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-chip color="primary">
          Score: {{ matchedPairs}}
        </v-chip>
        <v-chip color="secondary">
          Time: {{formattedTime}}
        </v-chip>
      </v-col>

    </v-row>

      <v-row justify="center">
      <v-btn color="primary" @click="resetGame">
        <span>Reset game</span>
      </v-btn>
    </v-row>

    <div v-if="this.fakeData" class="text-center">
      Mock data provided
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data() {
    return {
      userData: {},
      platformInfo: {},
      message: '',
      tg: {},
      isValidated: false,
      fakeData: false,
      cardsCount: 6,
      cards: this.generateCards(),
      flippedCards: [],
      lockBoard: false,
      matchedPairs: 0,
      timer: null,
      timeElapsed: 0,
    }
  },
  // created() {
  //   console.log(import.meta.env.VITE_NODE_ENV);
  //
  //   this.tg = window.Telegram.WebApp;
  //
  //   try {
  //     let initData;
  //
  //     if (import.meta.env.VITE_NODE_ENV === 'dev' && !window.Telegram.WebApp.initData) {
  //       initData = 'user=%7B%22id%22%3A12345,%22first_name%22%3A%22Test%22,%22username%22%3A%22testuser%22%7D';
  //
  //       this.fakeData = true;
  //     } else {
  //       initData = this.tg.initData;
  //
  //       if (!initData) {
  //         throw new Error('No init data available')
  //       }
  //     }
  //
  //     this.isValidated = true
  //
  //     const searchParams = new URLSearchParams(initData)
  //     const user = searchParams.get('user')
  //     if (user) {
  //       this.userData = JSON.parse(user)
  //     }
  //   } catch (error) {
  //     console.error('Data validation failed:', error)
  //     this.isValidated = false
  //   }
  //
  //   this.platformInfo = {
  //     platform: this.tg.platform,
  //     colorScheme: this.tg.colorScheme,
  //     version: this.tg.version
  //   }
  // },

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
        this.tg.showAlert("Congratulations! You won!");
      }
    },

    initializeGame() {
      this.cards = this.generateCards();
      this.flippedCards = [];
      this.lockBoard = false;
      this.matchedPairs = 0;
      this.resetTimer();
      this.startTimer();
    },

    resetGame() {
      this.lockBoard = true;
      this.resetTimer();
      this.cards.forEach(card => (card.flipped = false));

      setTimeout(() => {
        this.initializeGame();
      }, 600); // Matches the transition time in CSS (0.6s)
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