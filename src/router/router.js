import NotFoundPage from "../views/NotFoundPage.vue";
import Orders from "../views/Orders.vue";

const routes = [
    {
        path: "/",
        component: Orders,
        name: "orders"
    },
    {
        path: '/:catchAll(.*)*',
        component: NotFoundPage
    }
];

export default routes;