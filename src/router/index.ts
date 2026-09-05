import { createRouter, createWebHistory } from 'vue-router'
import EditProductView from '../views/EditProductView.vue'
import MyProductsView from '../views/MyProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
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
            path: '/products/:productID',
            name: 'product-detail',
            component: ProductDetailView,
        },
        {
            path: '/my-products',
            name: 'my-products',
            component: MyProductsView,
        },
        {
            path: '/products/edit/:id',
            name: 'EditProduct',
            component: EditProductView,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'products' },
        },
    ],
})

export default router
