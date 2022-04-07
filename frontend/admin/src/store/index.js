import { createStore } from 'vuex'
import NestedArrays from '../helpers/nestedArrays'

export default createStore({
  state: {
    loading: false,
    menu: {
      body: []
    }
  },
  mutations: {
    loadTrue(state){
      state.loading = true;
    },
    loadFalse(state){
      state.loading = false;
    },
    setList(state, value){
      state.menu = value;
    },
    updateList(state, value){
      state.menu.body.push(value);
    },
    deleteFromList(state, value){
      NestedArrays.spliceFromNested(state.menu.body, value);
    }
  },
  actions: {
  },
  modules: {
  }
})


