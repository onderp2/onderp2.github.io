<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <template v-slot:prepend>
            <v-icon icon="mdi-home" @click="()=> {this.$router.push('/')}">
            </v-icon>
          </template>
          <template v-slot:title>
            <div class="text-center text-md-h4 font-weight-bold text-sm-h5">
              Math challenge
            </div>
          </template>
          <template v-slot:append>
            <div class="d-flex ga-3">
              <v-icon icon="mdi-cog" @click="this.settings.openSettings = true" size="20"/>
              <v-icon @click="toggleSound" :color="settings.isSoundEnabled ? 'var(--text-color)' : '#aaa'" size="20">
                {{settings.isSoundEnabled ? 'mdi-volume-high': 'mdi-volume-off'}}
              </v-icon>
            </div>
          </template>
        </v-card>
        <v-divider opacity="100"/>
      </v-col>
    </v-row>

    <v-row >
      <v-col cols="12">
        <v-card elevation="6">
          <v-card-title class="text-center px-4">
            <span class="font-weight-bold opacity-100">Solve</span>
            <v-divider/>
          </v-card-title>

          <v-card-subtitle class="text-center text-h4 font-weight-bold text-black opacity-100 my-4 ">
            {{expression.expressionString ? expression.expressionString : '? + ? = ???'}}
          </v-card-subtitle>
          <v-card-actions >
            <div class="w-100 d-flex align-center justify-space-between">
              <v-btn
                  v-if="this.expression.options.length>0"
                  v-for="(option, index) in this.expression.options"
                  :key="index"
                  variant="flat"
                  color="primary"
                  height="60"
                  width="60"
                  @click="setAnswer(option, index)"
                  class="button-choice"
                  :class="{ selected: option.selected, wrong: option?.wrong }"
                  :disabled="!gameMode.isGameActive"

              >
                <span class="text-h5">
                {{option.variant}}
                </span>
              </v-btn>
              <v-btn v-else
                     v-for="(option, index) in ['?', '?', '?', '?']"
                     variant="flat"
                     color="primary"
                     height="60"
                     width="60"
                     class="button-choice"
              >
                <span class="text-h5">
                {{option}}
                </span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <div class="d-flex justify-center ga-1">
          <v-chip color="secondary">
            Score: {{this.gameMode.score}}
          </v-chip>
          <v-chip color="primary">
            Time left: {{this.gameMode.leftSeconds}}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-actions class="d-flex justify-center ga-2">
            <v-btn variant="flat" color="primary" @click="resetGame">
              Reset game
            </v-btn>
            <v-btn variant="flat" color="secondary" @click="startGame">
              New game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Game result -->
    <v-dialog v-model="this.showResults" transition="dialog-top-transition" persistent>
      <v-card>
        <v-card-title class="text-center">
          Game results:
        </v-card-title>
        <v-card-text class="pa-0 px-4">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                Score: {{this.gameMode.score}}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                Difficulty: {{this.gameMode.difficulty}}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="flat" @click="startGame">
            New game
          </v-btn>
          <v-btn color="secondary" variant="flat" @click="showResults=false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="this.settings.openSettings">
      <v-card>
        <v-card-title class="text-center px-4">
          <span class="font-weight-bold opacity-100">Settings</span>
          <v-divider/>
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column ga-4 mt-2">
            <div class="d-flex align-center ga-2">
              <div>
                Duration:
              </div>
              <v-menu
                  persistent
              >
                <template v-slot:activator="{props}">
                  <v-btn
                      v-bind="props"
                      @click="this.settings.selectingDuration = !this.settings.selectingDuration"
                  >
                    {{this.settings.duration}} sec

                    <template v-slot:append>
                      <v-icon :icon="this.settings.selectingDuration ? 'mdi-arrow-up-drop-circle-outline': 'mdi-arrow-down-drop-circle-outline'">
                      </v-icon>
                    </template>
                  </v-btn>
                </template>

                <v-list color="transparent">
                  <v-list-item
                      v-for="(item, index) in durations"
                      :key="index"
                      @click="setDuration(item)"
                  >
                    {{item}} seconds
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <div class="d-flex align-center ga-2">
              <div>Difficulty:</div>
              <v-menu
                  persistent
              >
                <template v-slot:activator="{props}">
                  <v-btn
                      v-bind="props"
                      @click="this.settings.selectingDifficulty = !this.settings.selectingDifficulty"
                  >
                    {{this.settings.difficulty}}
                    <template v-slot:append>
                      <v-icon :icon="this.settings.selectingDifficulty ? 'mdi-arrow-up-drop-circle-outline': 'mdi-arrow-down-drop-circle-outline'">
                      </v-icon>
                    </template>
                  </v-btn>
                </template>

                <v-list color="transparent">
                  <v-list-item
                      v-for="(item, index) in this.difficulties"
                      :key="index"
                      @click="setDifficulty(item)"
                  >
                    {{item}}
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn
              color="primary"
              variant="flat"
              @click="applySettings"
          >
            Apply
          </v-btn>
          <v-btn color="secondary" variant="flat" @click="this.settings.openSettings=false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'MathGame',

  data() {
    return {
      expression: {
        options: [],
        answer: null,
        expressionString: ''
      },
      settings: {
        duration: 30,
        difficulty: 'easy',
        openSettings: false,
        selectingDifficulty: false,
        selectingDuration: false,
        isSoundEnabled: true,
      },
      durations: [15, 30, 45, 60],
      difficulties: ['easy', 'normal', 'hard', 'god'],
      difficultyScores: {
        "easy": 1,
        "normal": 2,
        "hard": 3,
        "god": 4
      },
      gameMode: {
        timer: null,
        leftSeconds: 0,
        score: 0,
        duration: 30,
        difficulty: 'easy',
        isGameActive: false,
      },
      showResults: false,
      countdownPlaying: false,
    }
  },

  methods: {
    resetExpression() {
      this.expression.options = [];
      this.expression.answer = null;
      this.expression.expressionString = '';
    },

    resetGameMode() {
      clearInterval(this.gameMode.timer);
      this.gameMode.leftSeconds = 0;
      this.gameMode.score = 0;
      this.gameMode.duration = this.settings.duration;
      this.gameMode.difficulty = this.settings.difficulty;
      this.gameMode.isGameActive = false;
    },

    startGame() {
      // this.stopGame();
      this.resetGame();
      this.generateExpression();
      this.gameMode.isGameActive = true;
      // this.showResults = false;
      this.setTimer();
    },

    stopGame() {
      clearInterval(this.gameMode.timer);

      this.playFinishGame();
      this.gameMode.isGameActive = false;
      this.showResults = true;
    },

    resetGame() {
      this.resetExpression();
      this.resetGameMode();
      this.countdownPlaying = false;
      this.showResults = false;
    },

    setTimer() {
      this.gameMode.leftSeconds = this.gameMode.duration;
      this.gameMode.timer = setInterval(() => {

        if (this.gameMode.leftSeconds > 0) {
          this.gameMode.leftSeconds--;

          if (this.gameMode.leftSeconds <= 2 && this.gameMode.leftSeconds > 0) {
            this.playCountdown();
          }

        } else {
          this.stopGame();
        }
      }, 1000);
    },

    generateExpression() {
      let number1, number2, operations, operation;

      switch (this.gameMode.difficulty) {
        case 'easy':
          number1 = Math.floor((Math.random() * 10) + 1);
          number2 = Math.floor((Math.random() * 10) + 1);
          operations = ['+', '-'];

          operation = operations[Math.floor(Math.random() * operations.length)];

          break;

        case 'normal':
          number1 = Math.floor((Math.random() * 20) + 1);
          number2 = Math.floor((Math.random() * 20) + 1);
          operations = ['+', '-', '*'];

          operation = operations[Math.floor(Math.random() * operations.length)];

          break;

        case 'hard':
          operations = ['+', '-', '*', '/'];
          operation = operations[Math.floor(Math.random() * operations.length)];

          number2 = Math.floor((Math.random() * 50) + 1);

          if (operation === '/') {
            number1 = number2 * (Math.floor(Math.random() * 10) + 1);
          } else {
            number1 = Math.floor((Math.random() * 50) + 1);
          }

          break;
        case 'god':
          number2 = Math.floor((Math.random() * 70) + 1);
          let number3 = Math.floor(Math.random() * 10) +1;

          let firstOperations = ['+', '-', '*'];
          let firstOperation = firstOperations[Math.floor(Math.random() * firstOperations.length)]

          let subResult;

          switch (firstOperation) {
            case '+':
              subResult = number2 + number3;
              break;
            case '-':
              subResult = number2 - number3;
              break;
            case '*':
              subResult = number2 * number3;
              break;
          }

          operations = ['+', '-', '*', '/'];
          operation = operations[Math.floor(Math.random() * operations.length)];

          if (operation === '/') {
            number1 = subResult * (Math.floor(Math.random() * 10) + 1);
          } else {
            number1 = Math.floor((Math.random() * 50) + 1);
          }

          number2 = `(${number2} ${firstOperation} ${number3})`;

          break;
      }

      const expressionString = `${number1} ${operation} ${number2}`;

      let answer;

      switch (operation) {
        case '+':
          answer = number1 + eval(number2);
          break;
        case '-':
          answer = number1 - eval(number2);
          break;
        case '*':
          answer = number1 * eval(number2);
          break;
        case '/':
          answer = number1 / eval(number2);
          break;
      }

      let options = [{variant: answer, selected:false}];

      let generatedOptions = [answer];

      while (options.length < 4) {
        const randomOption = answer + (Math.floor(Math.random() * 20) - 10);
        if (!generatedOptions.includes(randomOption)) {
          options.push({variant: randomOption, selected: false});
          generatedOptions.push(randomOption);
        }
      }

      options.sort(() => Math.random() - 0.5);

      this.expression.options = options;
      this.expression.answer = answer;
      this.expression.expressionString = expressionString + ' = ?';
    },

    applySettings() {
      this.gameMode.difficulty = this.settings.difficulty;
      this.gameMode.duration = this.settings.duration;

      this.settings.openSettings = false;
    },

    setDuration(duration) {
      this.settings.duration = duration;
      this.selectingDuration = !this.selectingDuration;
    },

    setDifficulty(difficulty) {
      this.settings.difficulty = difficulty;
      this.selectingDifficulty = !this.selectingDifficulty;
    },

    setAnswer(option, index) {
      this.expression.options.forEach(opt => {
        opt.selected = false;
        opt.wrong = false;
      });

      if (option.variant === this.expression.answer) {
        this.playSuccessSound();

        this.expression.options[index].selected = true;
        this.gameMode.score += this.difficultyScores[this.gameMode.difficulty];
      } else {
        this.playMissSound();

        this.expression.options[index].wrong = true;
        this.gameMode.score -= this.difficultyScores[this.gameMode.difficulty];
      }

      setTimeout(() => {
        this.generateExpression();
      }, 500);
    },

    playSuccessSound() {
      const sound = new Audio('/audio/select_number.wav');

      if (this.settings.isSoundEnabled) sound?.play();
    },

    playMissSound() {
      const sound = new Audio('/audio/math_miss.wav');

      if (this.settings.isSoundEnabled) sound?.play();
    },

    playFinishGame() {
      const sound = new Audio('/audio/math_finish.wav');

      if (this.settings.isSoundEnabled) sound?.play();
    },

    playCountdown() {
      const sound = new Audio('/audio/math_countdown.wav');

      if (this.settings.isSoundEnabled && !this.countdownPlaying) {
        this.countdownPlaying = true;
        sound?.play();
      }
    },

    toggleSound() {
      this.settings.isSoundEnabled = !this.settings.isSoundEnabled;
    }
  }
}
</script>

<style>
.button-choice.selected {
  background-color: var(--matched-color) !important;
}

.button-choice.wrong {
  background-color: red !important;
}
</style>