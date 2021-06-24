import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false
  },
  mutations: {
    loadTrue(state){
      state.loading = true;
    },
    loadFalse(state){
      state.loading = false;
    }

  },
  actions: {
  },
  modules: {
  }
})
