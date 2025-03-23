// http://localhost:5126


import axios from 'axios';

export default {
  state: {
    access: localStorage.getItem('_accT'),
    vueAppWebApi: '',
  },
  getters: {
    ACCESS_TOKEN: (state) => state.access,
    VUE_APP_WEBAPI: (state) =>
      // window.console.log("VUE_APP_WEBAPI payload.vueAppWebApi", state.vueAppWebApi)
      state.vueAppWebApi
    ,
  },
  mutations: {
    SET_TOKEN: (state, payload) => {
      state.access = payload.access;

      localStorage.setItem('_accT', state.access);
    },
    SET_VUE_APP_WEBAPI: (state, payload) => {
      axios.defaults.baseURL = "https://localhost:7028/api";
    },
    CLEAR_TOKEN: (state) => {
      state.access = '';

      localStorage.removeItem('_accT');
    },
  },
  actions: {
  },
};
