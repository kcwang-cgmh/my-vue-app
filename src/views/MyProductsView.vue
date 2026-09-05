<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { MyProduct } from '../types/MyProduct';

const products = ref<MyProduct[]>([]);

const getData = async () => {
  const response = await fetch('http://localhost:5109/api/Products')
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
        <td>{{ p.name }}</td>
        <td>{{ p.unitPrice }}</td>
      </tr>
    </tbody>
  </table>
</template>