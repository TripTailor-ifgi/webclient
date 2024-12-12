<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [
        {
          text: "What type of activities do you enjoy?",
          options: [
            {
              text: "Sports",
              subQuestions: [
                {
                  text: "What kind of sport would you like to do?",
                  options: ["Swimming", "Football", "Volleyball"],
                  type: "multiselect"
                }
              ]
            },
            {
              text: "Shopping",
              subQuestions: [
                {
                  text: "What do you want to buy?",
                  options: ["Antiques", "Craft", "Jewelry"],
                  type: "multiselect"
                }
              ]
            },
            {
              text: "Trying Food",
              subQuestions: [
                {
                  text: "What kind of food do you prefer?",
                  options: ["Asian Food", "Italian Food", "American Food"],
                  type: "multiselect"
                },
                {
                  text: "Any dietary restrictions or preferences?",
                  options: ["I am vegan", "I am vegetarian", "No"],
                  type: "multiselect"
                }
              ]
            },
            {
              text: "Leisure Activities",
              subQuestions: [
                {
                  text: "What kind of Leisure activity do you want to try?",
                  options: ["Amusement Arcade", "Tanning Salon", "Nails Salon", "Water Park", "Sauna"],
                  type: "multiselect"
                }
              ]
            },
            {
              text: "Visiting Museums",
              subQuestions: [
                {
                  text: "What kind of Museums do you prefer?",
                  options: ["Technology", "Art", "History", "Geography"],
                  type: "multiselect"
                }
              ]
            },
            { text: "Visiting the Churches" },
            { text: "Exploring the Nature" },
            { text: "Experiencing Local Bars" },
            { text: "Visiting Historical Sites" }
          ],
          type: "multiselect"
        },
        {
          text: "What is your time of travel?",
          type: "datetime"
        },
        {
          text: "What kind of Trip are you planning?",
          options: [
            { text: "Single Trip" },
            {
              text: "Friend Trip",
              subQuestions: [
                { text: "How many Friends?", type: "number" },
              ]
            },
            { text: "Couple Trip" },
            {
              text: "Family Trip",
              subQuestions: [
                { text: "How many adults are involved?", type: "number" },
                { text: "How many children are involved?", type: "number" }
              ]
            }
          ],
          type: "single-select"
        },
        {
          text: "Do you require wheelchair-accessibility?",
          options: [
          { text: "Yes" },
          { text: "No" }
          ],
          type: "single-select"
        },
        {
          text: "How do you like to travel?",
          options: [
          { text: "Self-driving" },
          { text: "Public transport" },
          { text: "Cycling" }
          ],
          type: "single-select"
        },
        {
          text: "Do you want to pay for entry ticket?",
          options: [
          { text: "Yes" },
          { text: "No" }
          ],
          type: "single-select"
        },
        
      ],
      answers: Array(9).fill(null),
      selectedDate: "",
      selectedTimeRange: [],
      selectedOptions: Array(9).fill([]), // For multiselect answers
      selectedSubOptions: Array(9).fill([]), // For sub-question answers
      selectedSubQuestions: [],
      subAnswers: [] // To store sub-question answers
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    isMultiSelect() {
      return this.currentQuestion.type === "multiselect";
    },
    isDateTimeQuestion() {
      return this.currentQuestion.type === "datetime";
    },
    progressPercentage() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    },
    progressText() {
      return `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    }
  },
  methods: {
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedSubQuestions = [];
        this.subAnswers = [];
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedSubQuestions = [];
        this.subAnswers = [];
      }
    },
    saveAnswer(option) {
      const selectedOptions = this.selectedOptions[this.currentQuestionIndex];
      const optionIndex = selectedOptions.indexOf(option);

      if (optionIndex === -1) {
        selectedOptions.push(option);
      } else {
        selectedOptions.splice(optionIndex, 1);
      }
    },
    saveSubAnswer(subOption, questionIndex) {
      const subQuestionAnswers = this.selectedSubOptions[questionIndex];
      const optionIndex = subQuestionAnswers.indexOf(subOption);

      if (optionIndex === -1) {
        subQuestionAnswers.push(subOption);
      } else {
        subQuestionAnswers.splice(optionIndex, 1);
      }
    },
    handleSubQuestions(index) {
      const selectedOption = this.questions[this.currentQuestionIndex].options[index];
      if (selectedOption.subQuestions) {
        this.selectedSubQuestions = selectedOption.subQuestions;
        this.subAnswers = Array(selectedOption.subQuestions.length).fill(null);
      } else {
        this.selectedSubQuestions = [];
        this.subAnswers = [];
      }
    },
    saveDate() {
      this.answers[this.currentQuestionIndex] = this.selectedDate;
    },
    saveTimeRange() {
      this.answers[this.currentQuestionIndex] = this.selectedTimeRange;
    }
  }
};
</script>

<template>
  <div id="app" class="container mt-5">
    <div class="quiz-container">
      <h1 class="mb-4">{{ currentQuestion.text }}</h1>

      <!-- Single Select Question -->
      <div v-if="currentQuestion.type === 'single-select'">
        <ul class="list-group">
          <li
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="list-group-item"
          >
            <input
              type="radio"
              :value="option.text"
              :name="currentQuestion.text"
              v-model="answers[currentQuestionIndex]"
              @change="handleSubQuestions(index)"
            />
            {{ option.text }}
          </li>
        </ul>
      </div>

      <!-- Sub-questions for Friend Trip and Family Trip -->
      <div v-if="selectedSubQuestions.length">
        <div v-for="(subQuestion, subIndex) in selectedSubQuestions" :key="subIndex" class="mt-3">
          <label>{{ subQuestion.text }}</label>
          <input
            v-if="subQuestion.type === 'number'"
            type="number"
            class="form-control mt-2"
            v-model="subAnswers[subIndex]"
          />
        </div>
      </div>

      <!-- Multiselect Questions -->
      <div v-if="isMultiSelect">
        <ul class="list-group">
          <li
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="list-group-item"
          >
            <input
              type="checkbox"
              :checked="selectedOptions[currentQuestionIndex].includes(option.text)"
              @change="saveAnswer(option.text)"
            />
            {{ option.text }}
          </li>
        </ul>

        <!-- Render Sub-Questions -->
        <div v-for="(option, index) in currentQuestion.options" :key="'sub-' + index">
          <div v-if="selectedOptions[currentQuestionIndex].includes(option.text) && option.subQuestions">
            <div v-for="(subQuestion, subIndex) in option.subQuestions" :key="'subQ-' + subIndex">
              <h5 class="mt-3">{{ subQuestion.text }}</h5>
              <ul class="list-group">
                <li
                  v-for="(subOption, subOptionIndex) in subQuestion.options"
                  :key="subOptionIndex"
                  class="list-group-item"
                >
                  <input
                    type="checkbox"
                    :checked="selectedSubOptions[currentQuestionIndex].includes(subOption)"
                    @change="saveSubAnswer(subOption, currentQuestionIndex)"
                  />
                  {{ subOption }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Dropdown Questions -->
      <div v-if="currentQuestion.type === 'dropdown'">
        <select v-model="answers[currentQuestionIndex]" class="form-select mt-3">
          <option v-for="option in currentQuestion.options" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Date-Time Picker -->
      <div v-if="isDateTimeQuestion" class="mt-3">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Pick a date"
          value-format="yyyy-MM-dd"
          class="mb-3 w-100"
          @change="saveDate"
        ></el-date-picker>
        <el-time-picker
          v-model="selectedTimeRange"
          is-range
          placeholder="Select time range"
          arrow-control
          format="HH:mm"
          class="w-100"
          @change="saveTimeRange"
        ></el-time-picker>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-4 d-flex justify-content-between">
        <button class="btn btn-primary" @click="prevQuestion" :disabled="currentQuestionIndex === 0">Previous</button>
        <button class="btn btn-primary" @click="nextQuestion" :disabled="currentQuestionIndex === questions.length - 1">Next</button>
      </div>

      <!-- Progress Bar -->
      <div class="progress mt-3">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: progressPercentage + '%' }"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ progressText }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
    }

        body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        color: var(-tt-dark);
    }

    .quiz-container {
              max-width: 600px;
              margin: 0 auto;
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .list-group-item {
        cursor: pointer;
    }

    .list-group-item input[type="checkbox"] {
        margin-right: 10px;
    }

    .progress-bar {
        text-align: center;
        font-weight: bold;
        background-color: #4caf50 !important;
            border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .list-group-item {
        cursor: pointer;
    }

    .list-group-item input[type="checkbox"] {
        margin-right: 10px;
    }

    .progress-bar {
        text-align: center;
        font-weight: bold;
        background-color: var(--tt) !important;
    }
</style>
