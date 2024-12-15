import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useLinesStore = defineStore('lines', {
  state: () => {
    return {lines: reactive([{x1: 200, y1: 200, x2: 400, y2: 400},{x1: 400, y1: 400, x2: 600, y2: 600}])}
  },
  actions: {
    setLines(arr) {
      this.lines = arr
    },
  },
})