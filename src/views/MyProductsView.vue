<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router';
import type { MyProduct } from '../types/MyProduct';

const products = ref<MyProduct[]>([]);
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const form = ref({ name: '', unitPrice: '', photo: '', description: '' })

const getData = async () => {
  const response = await fetch('/api/Products')
  if (!response.ok) throw new Error(`無法取得產品資料（${response.status}）`)
  products.value = await response.json()
}

const addProduct = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const name = form.value.name.trim()
  const unitPrice = Number(form.value.unitPrice)
  if (!name || !Number.isFinite(unitPrice) || unitPrice < 0) {
    errorMessage.value = '請輸入產品名稱，以及不小於 0 的有效單價。'
    return
  }

  isSubmitting.value = true
  try {
    const response = await fetch('/api/Products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        unitPrice,
        photo: form.value.photo.trim() || null,
        description: form.value.description.trim() || null,
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || `新增產品失敗（${response.status}）`)
    }

    form.value = { name: '', unitPrice: '', photo: '', description: '' }
    await getData()
    successMessage.value = '產品新增成功。'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '新增產品失敗。'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  getData().catch((error) => {
    errorMessage.value = error instanceof Error ? error.message : '無法取得產品資料'
  })
})
</script>

<template>
  <section class="my-products-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">MY PRODUCTS</p>
        <h1>我的產品</h1>
      </div>
    </div>

    <form class="add-product-form" @submit.prevent="addProduct">
      <h2>新增產品</h2>
      <div class="form-grid">
        <label>產品名稱<input v-model="form.name" required maxlength="100" /></label>
        <label>單價<input v-model="form.unitPrice" required type="number" min="0" step="0.01" /></label>
        <label>圖片網址<input v-model="form.photo" type="url" placeholder="選填" /></label>
        <label class="wide">產品描述<textarea v-model="form.description" rows="3" maxlength="500" placeholder="選填"></textarea></label>
      </div>
      <button type="submit" :disabled="isSubmitting">{{ isSubmitting ? '新增中...' : '新增產品' }}</button>
      <p v-if="successMessage" class="success" role="status">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    </form>

  <table>
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
  </section>
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

.my-products-page { width: min(1120px, 100%); margin: 0 auto; padding: 52px 48px 72px; box-sizing: border-box; }
.page-heading h1 { margin: 10px 0 28px; color: #18252d; font-size: 2.8rem; }
.eyebrow { margin: 0; color: #c95837; font-size: .72rem; font-weight: 800; letter-spacing: .16em; }
.add-product-form { margin-bottom: 34px; padding: 24px; border: 1px solid #dfe7e4; border-radius: 16px; background: #fff; box-shadow: 0 12px 28px rgba(36,53,54,.06); text-align: left; }
.add-product-form h2 { margin: 0 0 18px; color: #18252d; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
label { display: grid; gap: 6px; color: #53656a; font-size: .85rem; font-weight: 700; }
input, textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #c8d2d0; border-radius: 8px; font: inherit; color: #18252d; background: #fff; }
.wide { grid-column: 1 / -1; }
button { margin-top: 18px; padding: 11px 18px; border: 0; border-radius: 9px; color: white; background: #1f6d68; cursor: pointer; font: inherit; font-weight: 700; }
button:disabled { cursor: wait; opacity: .6; }
.success { margin-top: 12px; color: #1f6d68; }
.error { margin-top: 12px; color: #b3432b; white-space: pre-wrap; }
table { width: 100%; border-collapse: collapse; background: #fff; }
td { padding: 12px; border: 1px solid #dfe7e4; text-align: left; }
@media (max-width: 620px) { .my-products-page { padding: 36px 20px; } .form-grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
</style>
