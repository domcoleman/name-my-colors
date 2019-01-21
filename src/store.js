import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { mutations } from '@/store/mutations';

export const store = new Vuex.Store({
  state: {
    swatches: [],
    activeSwatch: 0
  },
  mutations,
  actions: {},
  getters: {}
});
