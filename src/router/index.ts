import { createRouter, createWebHistory } from 'vue-router'
import MyProductsView from '../views/MyProductsView.vue'
import ProductsView from '../views/ProductsView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { name: 'products' },
        },
        {
            path: '/products',
            name: 'products',
            component: ProductsView,
        },
        {
            path: '/my-products',
            name: 'my-products',
            component: MyProductsView,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'products' },
        },
    ],
})

export default router
