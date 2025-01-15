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
        </v-card>
        <v-divider opacity="100"/>
      </v-col>
    </v-row>

    <v-row >
      <v-col cols="12">
        <v-card elevation="6" v-if="this.expression.isReady">
          <v-card-title class="text-center px-4">
            <span class="font-weight-bold opacity-100">Solve</span>
            <v-divider/>
          </v-card-title>

          <v-card-subtitle class="text-center text-h4 font-weight-bold text-black opacity-100 my-4 ">
            {{this.expression.expressionString}}
          </v-card-subtitle>
          <v-card-actions >
            <div class="w-100 d-flex align-center justify-space-between">
              <v-btn
                  v-for="(option, index) in this.expression.options"
                  v-if="this.expression.options"
                  :key="index"
                  variant="flat"
                  color="primary"
                  height="60"
                  width="60"
                  @click="setAnswer(option, index)"
                  class="button-choice"
                  :class="{ selected: option.selected, wrong: option?.wrong }"
                  :disabled="!isGameActive"

              >
                <span class="text-h5">
                {{option.variant}}
                </span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>


        <v-card v-else>
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
                        @click="this.selectingDuration = !this.selectingDuration"
                    >
                      {{duration}} sec

                      <template v-slot:append>
                        <v-icon :icon="this.selectingDuration ? 'mdi-arrow-up-drop-circle-outline': 'mdi-arrow-down-drop-circle-outline'">
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
                        @click="this.selectingDifficulty = !this.selectingDifficulty"
                    >
                      {{difficulty}}
                      <template v-slot:append>
                        <v-icon :icon="this.selectingDifficulty ? 'mdi-arrow-up-drop-circle-outline': 'mdi-arrow-down-drop-circle-outline'">
                        </v-icon>
                      </template>
                    </v-btn>
                  </template>

                  <v-list color="transparent">
                    <v-list-item
                        v-for="(item, index) in difficulties"
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
                @click="startGame"
            >
              Start game
            </v-btn>
            <v-spacer/>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="this.expression.isReady">
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

    <v-row v-if="this.expression.isReady">
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-actions class="d-flex justify-center ga-2">
            <v-btn variant="flat" color="primary" @click="endGame">
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
                Difficulty: {{this.difficulty}}
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
        selectedAnswer: null,
        isReady: false,
        expressionString: ''
      },
      duration: 30,
      durations: [15, 30, 45, 60],
      selectingDuration: false,
      difficulty: 'easy',
      difficulties: ['easy', 'normal', 'hard', 'god'],
      difficultyScores: {
        "easy": 1,
        "normal": 2,
        "hard": 3,
        "god": 4
      },
      selectingDifficulty: false,
      gameMode: {
        timer: null,
        leftSeconds: null,
        score: 0,
      },
      isGameActive: false,
      showResults: false,
    }
  },

  methods: {
    startGame() {
      this.stopGame();
      this.endGame();
      this.generateExpression();
      this.expression.isReady = true;
      this.isGameActive = true;
      this.showResults = false;
      this.setTimer();
    },

    setTimer() {
      this.gameMode.leftSeconds = this.duration;
      this.gameMode.timer = setInterval(() => {

        if (this.gameMode.leftSeconds > 0) {
          this.gameMode.leftSeconds--;
        } else {
          this.stopGame();
        }
      }, 1000);
    },

    stopGame() {
      clearInterval(this.gameMode.timer);
      this.isGameActive = false;
      this.showResults = true;
    },

    endGame() {
      clearInterval(this.gameMode.timer);

      this.expression.isReady = false;
      this.expression.options = [];
      this.expression.answer = null;
      this.expression.expressionString = '';

      this.gameMode.score = 0;
      this.gameMode.leftSeconds = 0;
    },

    generateExpression() {
      let number1, number2, operations, operation;

      switch (this.difficulty) {
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

    setDuration(duration) {
      this.duration = duration;
      this.selectingDuration = !this.selectingDuration;
    },

    setDifficulty(difficulty) {
      this.difficulty = difficulty;
      this.selectingDifficulty = !this.selectingDifficulty;
    },

    setAnswer(option, index) {
      this.expression.options.forEach(opt => {
        opt.selected = false;
        opt.wrong = false;
      });

      if (option.variant === this.expression.answer) {
        this.expression.options[index].selected = true;

        this.gameMode.score += this.difficultyScores[this.difficulty];
      } else {
        this.expression.options[index].wrong = true;

        this.gameMode.score -= this.difficultyScores[this.difficulty];
      }

      setTimeout(() => {
        this.generateExpression();
      }, 500);
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