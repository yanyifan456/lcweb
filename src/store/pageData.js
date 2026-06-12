// stores/pageData.js
import { defineStore } from "pinia";

export const usePageDataStore = defineStore("pageData", {
  state: () => ({
    transferData: null,
  }),
  actions: {
    setData(data) {
      this.transferData = data;
    },
  },
});
