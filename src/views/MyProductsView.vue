<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { MyProduct } from '../types/MyProduct';

const products = ref<MyProduct[]>([]);

const getData = async () => {
  const response = await fetch('/api/Products')
  products.value = await response.json()
}

  onMounted(() => {
  getData()
})
</script>

<template>
  <table border="1">
    <thead>
      <tr>
        <td>ID</td>
        <td>Name</td>
        <td>Price</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in products" :key="p.productID">
        <td>{{ p.productID }}</td>
        <td>
          <RouterLink
            class="product-name-link"
            :to="{ name: 'product-detail', params: { productID: p.productID } }"
          >
            {{ p.name }}
          </RouterLink>
        </td>
        <td>{{ p.unitPrice }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.product-name-link {
  color: #1f6d68;
  font-weight: 700;
  text-underline-offset: 3px;
}

.product-name-link:hover {
  color: #c95837;
}
</style>