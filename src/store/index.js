import { createStore } from "vuex";
import orders from "./modules/orders";
import token from "./modules/token";

const store = createStore({
    modules: {
      orders,
      token
    },
  });

  store.commit("SET_VUE_APP_WEBAPI");
  
  export default store;