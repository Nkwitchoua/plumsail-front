import axios from "axios";

export default {
  actions: {
    GET_ORDERS: (commit, payload) =>
      new Promise((resolve, reject) => {
        axios
          .get("/Orders/GetOrders")
          .then(({ data, status }) => {
            if (status === 200) {
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }),
      SAVE_ORDER: (commit, payload) =>
        new Promise((resolve, reject) => {
          axios
            .post("/Orders/SaveOrder", payload)
            .then(({ data, status }) => {
              if (status === 200) {
                resolve(data);
              }
            })
            .catch((error) => {
              reject(error);
            });
      }),
      UPDATE_ORDER: (commit, payload) =>
        new Promise((resolve, reject) => {
          axios
            .post("/Orders/UpdateOrder", payload)
            .then(({ data, status }) => {
              if (status === 200) {
                resolve(data);
              }
            })
            .catch((error) => {
              reject(error);
            });
      }),
      DELETE_ORDER: (commit, payload) =>
        new Promise((resolve, reject) => {
          axios
            .post(`/Orders/DeleteOrder?id=${payload}`)
            .then(({ data, status }) => {
              if (status === 200) {
                resolve(data);
              }
            })
            .catch((error) => {
              reject(error);
            });
      }),
  },
};
