const app = Vue.createApp({
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
  });
  
  app.use(ElementPlus);
  app.mount("#app");
  