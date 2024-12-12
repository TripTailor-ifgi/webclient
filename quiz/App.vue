<script>
export default{
data() {
      return {
        currentQuestionIndex: 0,
        questions: [
          { text: "What kind of activity do you prefer? (Drag items to rank)", options: ["Nature", "Art", "History", "Food", "Religion", "Sport", "Shopping"] },
          { text: "Do you prefer indoor or outdoor activities?", options: ["Indoor", "Outdoor", "50/50"] },
          { text: "What is your time of travel?", type: "datetime" },
          { text: "Any disabilities?", options: ["Blind", "With wheelchair", "Deaf", "No"] },
          { text: "Total numbers of travelers?", options: ["1-2", "3-5", "5+"], type: "dropdown" }, // Changed to 'dropdown'
          { text: "What is your budget per person?", options: ["Below 50€", "50-100€", "Above 100€"] },
          { text: "How do you like to travel?", options: ["Self-driving", "Public transport", "Cycling"] },
          { text: "Is this your first time here?", options: ["Yes", "No"] }
        ],
        answers: Array(8).fill(null),
        selectedDate: "", // Holds the selected date
        selectedTimeRange: [], // Holds the selected time range
        draggedOptionIndex: null
      };
    },
    computed: {
      currentQuestion() {
        return this.questions[this.currentQuestionIndex];
      },
      isFirstQuestion() {
        return this.currentQuestionIndex === 0;
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
        }
      },
      nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
        }
      },
      startDrag(index) {
        this.draggedOptionIndex = index;
      },
      dropOption(index) {
        const options = this.currentQuestion.options;
        const temp = options[this.draggedOptionIndex];
        options[this.draggedOptionIndex] = options[index];
        options[index] = temp;
      },
      saveDate(date) {
        this.selectedDate = date;
        console.log("Selected date:", date);
      },
      saveTimeRange(timeRange) {
        this.selectedTimeRange = timeRange;
        console.log("Selected time range:", timeRange);
        this.answers[this.currentQuestionIndex] = {
          date: this.selectedDate,
          timeRange: this.selectedTimeRange
        };
      }
    }
  }
</script>


<template>
  <div id="app" class="container mt-5">
    <div class="quiz-container">
      <h1 class="mb-4">{{ currentQuestion.text }}</h1>

      <!-- Options -->
      <div v-if="currentQuestion.type !== 'dropdown'">
        <ul class="list-group">
          <li
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="list-group-item"
            :draggable="isFirstQuestion"
            @dragstart="isFirstQuestion ? startDrag(index) : null"
            @dragover.prevent="isFirstQuestion ? $event.preventDefault() : null"
            @drop="isFirstQuestion ? dropOption(index) : null"
          >
            {{ option }}
          </li>
        </ul>
      </div>

      <!-- Dropdown for the total number of travelers -->
      <div v-if="currentQuestion.type === 'dropdown'">
        <select v-model="answers[currentQuestionIndex]" class="form-select mt-3">
          <option v-for="option in currentQuestion.options" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Date and Time Picker -->
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
      <div class="mt-4">
        <button class="btn btn-secondary me-2" @click="prevQuestion" :disabled="currentQuestionIndex === 0">
          Previous
        </button>
        <button class="btn btn-primary" @click="nextQuestion" :disabled="currentQuestionIndex === questions.length - 1">
          Next
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress mt-4">
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
