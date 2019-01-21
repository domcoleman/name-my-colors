import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { mutations } from '@/store/mutations';
import { actions } from '@/store/actions';
import { getters } from '@/store/getters';

export const store = new Vuex.Store({
  state: {
    swatches: [],
    activeSwatch: 0
  },
  mutations,
  actions,
  getters
});
