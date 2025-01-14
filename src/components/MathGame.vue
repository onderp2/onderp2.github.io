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
      <v-col cols="12">
        <v-card>
          <template v-slot:prepend>
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
          </template>
          <template v-slot:append>
            <v-btn
                variant="flat"
                color="primary"
                @click="generateExpression"
            >
              Start
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="expression.isReady">
      <v-col cols="12">
        <v-card elevation="6" >
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
                  :key="index"
                  variant="flat"
                  color="primary"
                  height="60"
                  width="60"
                  @click="setAnswer(option, index)"
                  class="button-choice"
                  :class="{ selected: option.selected, wrong: option?.wrong }"

              >
                <span class="text-h5">
                {{option.variant}}
                </span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
    }
  },

  methods: {
    generateExpression() {
      const number1 = Math.floor((Math.random() * 10) + 1);
      const number2 = Math.floor((Math.random() * 10) + 1);
      const operations = ['+', '-', '*'];

      const operation = operations[Math.floor(Math.random() * operations.length)];

      const expressionString = `${number1} ${operation} ${number2}`;

      const answer = eval(expressionString);
      let options = [{variant: answer, selected:false}];

      while (options.length < 4) {
        const randomOption = Math.floor(Math.random() * 20) - 10;
        if (!options.includes({variant: randomOption, selected: false})) {
          options.push({variant: randomOption, selected: false});
        }
      }
      options.sort(() => Math.random() - 0.5);

      this.expression.options = options;
      this.expression.answer = answer;
      this.expression.isReady = true;
      this.expression.expressionString = expressionString + ' = ?';
    },

    setDuration(duration) {
      this.duration = duration;
      this.selectingDuration = !this.selectingDuration;
    },

    setAnswer(option, index) {
      this.expression.options.forEach(opt => {
        opt.selected = false;
        opt.wrong = false;
      });

      if (option.variant === this.expression.answer) {
        this.expression.options[index].selected = true;
      } else {
        this.expression.options[index].wrong = true;
      }
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