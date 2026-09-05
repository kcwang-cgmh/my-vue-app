<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { Product } from '../types/Product'

const route = useRoute()
const router = useRouter()
const productId = Number(route.params.id)
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const form = ref({ name: '', unitPrice: '', photo: '', description: '' })

const loadProduct = async () => {
  if (!Number.isInteger(productId) || productId < 1) {
    errorMessage.value = '產品編號不正確。'
    isLoading.value = false
    return
  }
  try {
    const response = await fetch(`/api/Products/${productId}`)
    if (!response.ok) throw new Error(`無法取得產品資料（${response.status}）`)
    const product: Product = await response.json()
    form.value = { name: product.name, unitPrice: String(product.unitPrice), photo: product.photo ?? '', description: product.description ?? '' }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '無法取得產品資料'
  } finally { isLoading.value = false }
}

const updateProduct = async () => {
  errorMessage.value = ''
  const name = form.value.name.trim()
  const unitPrice = Number(form.value.unitPrice)
  if (!name || !Number.isFinite(unitPrice) || unitPrice < 0) {
    errorMessage.value = '請輸入產品名稱，以及不小於 0 的有效單價。'
    return
  }
  isSubmitting.value = true
  try {
    const response = await fetch('/api/Products', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productID: productId, name, unitPrice, photo: form.value.photo.trim() || null, description: form.value.description.trim() || null }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || `更新產品失敗（${response.status}）`)
    }
    await router.push({ name: 'products' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '更新產品失敗。'
  } finally { isSubmitting.value = false }
}

onMounted(loadProduct)
</script>

<template>
  <section class="edit-product-page">
    <RouterLink class="back-link" :to="{ name: 'products' }">← 返回產品目錄</RouterLink>
    <div class="page-heading"><p class="eyebrow">EDIT PRODUCT</p><h1>編輯產品</h1><p>更新產品的名稱、價格與詳細資訊。</p></div>
    <div v-if="isLoading" class="state" role="status">正在取得產品資料...</div>
    <div v-else-if="errorMessage && !form.name" class="state error" role="alert">{{ errorMessage }}</div>
    <form v-else class="edit-form" @submit.prevent="updateProduct">
      <label>產品名稱<input v-model="form.name" required maxlength="100" /></label>
      <label>單價<input v-model="form.unitPrice" required type="number" min="0" step="0.01" /></label>
      <label>圖片網址<input v-model="form.photo" type="url" placeholder="選填" /></label>
      <label>產品描述<textarea v-model="form.description" rows="5" maxlength="500" placeholder="選填"></textarea></label>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <div class="actions"><RouterLink class="cancel-button" :to="{ name: 'products' }">取消</RouterLink><button type="submit" :disabled="isSubmitting">{{ isSubmitting ? '儲存中...' : '儲存變更' }}</button></div>
    </form>
  </section>
</template>

<style scoped>
.edit-product-page { width: min(760px, 100%); margin: 0 auto; padding: 52px 48px 72px; box-sizing: border-box; }
.back-link { color: #1f6d68; font-size: .9rem; font-weight: 700; text-decoration: none; }
.page-heading { margin: 34px 0 28px; }.eyebrow { margin: 0 0 10px; color: #c95837; font-size: .72rem; font-weight: 800; letter-spacing: .16em; }
h1 { margin: 0; color: #18252d; font-size: 3rem; }.page-heading > p:last-child { margin-top: 12px; color: #68767a; }
.edit-form { display: grid; gap: 18px; padding: 28px; border: 1px solid #dfe7e4; border-radius: 16px; background: #fff; box-shadow: 0 12px 28px rgba(36,53,54,.06); }
label { display: grid; gap: 7px; color: #53656a; font-size: .85rem; font-weight: 700; } input, textarea { width: 100%; box-sizing: border-box; padding: 11px 12px; border: 1px solid #c8d2d0; border-radius: 8px; color: #18252d; background: #fff; font: inherit; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; } button, .cancel-button { padding: 11px 18px; border-radius: 9px; font: inherit; font-weight: 700; text-decoration: none; }
button { border: 0; color: white; background: #1f6d68; cursor: pointer; } button:disabled { cursor: wait; opacity: .6; }.cancel-button { border: 1px solid #c8d2d0; color: #53656a; background: #fff; }.state { padding: 28px; border: 1px dashed #c8d2d0; border-radius: 16px; color: #68767a; text-align: center; }.error { color: #b3432b; white-space: pre-wrap; }
@media (max-width: 620px) { .edit-product-page { padding: 36px 20px; } h1 { font-size: 2.4rem; } }
</style>
