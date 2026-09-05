<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '../types/Product'

const products = ref<Product[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const apiUrl = '/api/Products'
const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0,
})

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string'

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const product = value as Record<string, unknown>
  return (
    typeof product.productID === 'number' &&
    typeof product.name === 'string' &&
    typeof product.unitPrice === 'number' &&
    isNullableString(product.photo) &&
    isNullableString(product.description) &&
    (product.orders === null || Array.isArray(product.orders))
  )
}

const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`API 回應錯誤（${response.status}）`)
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data) || !data.every(isProduct)) {
      throw new Error('API 回傳的產品資料格式不符合預期')
    }

    products.value = data
  } catch (error) {
    products.value = []
    errorMessage.value = error instanceof Error ? error.message : '無法取得產品資料'
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price: number) => currencyFormatter.format(price)

const getProductImage = (product: Product) =>
  typeof product.photo === 'string' && product.photo.trim() ? product.photo : ''

const formatOrderCount = (orders: unknown[] | null) =>
  orders?.length ? `${orders.length} 筆訂單` : '尚無訂單'

onMounted(fetchProducts)
</script>

<template>
  <section class="products-page">
    <div class="page-heading">
      <div class="eyebrow">
        <span class="eyebrow-dot" aria-hidden="true"></span>
        PRODUCT CATALOG
      </div>
      <div class="heading-row">
        <div>
          <h1>產品目錄</h1>
          <p>從 Products API 讀取目前可用的商品資料。</p>
        </div>
        <button class="refresh-button" type="button" :disabled="isLoading" @click="fetchProducts">
          <span aria-hidden="true">↻</span>
          {{ isLoading ? '載入中' : '重新整理' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="state-panel" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>正在取得產品資料...</p>
    </div>

    <div v-else-if="errorMessage" class="state-panel state-panel--error" role="alert">
      <div class="state-icon" aria-hidden="true">!</div>
      <div>
        <h2>無法載入產品</h2>
        <p>{{ errorMessage }}</p>
        <button class="retry-button" type="button" @click="fetchProducts">再試一次</button>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="state-panel" role="status">
      <div class="state-icon" aria-hidden="true">ø</div>
      <div>
        <h2>目前沒有產品</h2>
        <p>Products API 尚未回傳任何產品資料。</p>
      </div>
    </div>

    <div v-else class="product-grid">
      <article v-for="product in products" :key="product.productID" class="product-card">
        <div class="product-visual">
          <img
            v-if="getProductImage(product)"
            :src="getProductImage(product)"
            :alt="product.name"
          />
          <div v-else class="product-placeholder" aria-hidden="true">
            {{ product.name.charAt(0).toUpperCase() }}
          </div>
          <span class="product-id">#{{ product.productID }}</span>
        </div>

        <div class="product-content">
          <div class="product-meta">
            <span class="product-status">可販售</span>
            <span>{{ formatOrderCount(product.orders) }}</span>
          </div>
          <h2>
            <RouterLink
              class="product-name-link"
              :to="{ name: 'product-detail', params: { productID: product.productID } }"
            >
              {{ product.name }}
            </RouterLink>
          </h2>
          <p class="product-description">
            {{ product.description || '尚未提供商品描述。' }}
          </p>
          <div class="product-footer">
            <span>單價</span>
            <strong>{{ formatPrice(product.unitPrice) }}</strong>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!isLoading && !errorMessage && products.length" class="results-footer">
      <span class="results-line" aria-hidden="true"></span>
      <span>共 {{ products.length }} 項產品</span>
      <span class="results-api">GET {{ apiUrl }}</span>
    </div>
  </section>
</template>

<style scoped>
.products-page {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 64px 48px 72px;
  box-sizing: border-box;
}

.page-heading {
  margin-bottom: 42px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #c95837;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.eyebrow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e7a62a;
  box-shadow: 0 0 0 5px #fff0cf;
}

.heading-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  margin-top: 22px;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #18252d;
  font-family: 'Avenir Next', 'Noto Sans TC', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 0.98;
}

.heading-row p {
  max-width: 480px;
  margin-top: 18px;
  color: #68767a;
  font-size: 1rem;
}

.refresh-button,
.retry-button {
  border: 0;
  cursor: pointer;
  font: inherit;
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex: 0 0 auto;
  padding: 13px 18px;
  border-radius: 10px;
  color: #fffaf3;
  background: #1f6d68;
  font-size: 0.88rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(31, 109, 104, 0.2);
}

.refresh-button span {
  font-size: 1.25rem;
  line-height: 0.8;
}

.refresh-button:hover:not(:disabled),
.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(31, 109, 104, 0.26);
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.state-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 220px;
  padding: 36px;
  border: 1px dashed #c8d2d0;
  border-radius: 16px;
  color: #68767a;
  background: rgba(255, 255, 255, 0.65);
  text-align: center;
}

.state-panel h2 {
  margin-bottom: 8px;
  color: #18252d;
  font-size: 1.2rem;
}

.state-panel--error {
  justify-content: flex-start;
  border-color: #e6b1a3;
  background: #fff8f5;
  text-align: left;
}

.state-icon {
  display: grid;
  flex: 0 0 42px;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  background: #c95837;
  font-size: 1.2rem;
  font-weight: 800;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #d5e3e1;
  border-top-color: #1f6d68;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.retry-button {
  margin-top: 18px;
  padding: 9px 14px;
  border-radius: 8px;
  color: #fff;
  background: #1f6d68;
  font-size: 0.84rem;
  font-weight: 700;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  overflow: hidden;
  border: 1px solid #dfe7e4;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(36, 53, 54, 0.06);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px rgba(36, 53, 54, 0.12);
}

.product-visual {
  position: relative;
  display: grid;
  aspect-ratio: 1.55;
  place-items: center;
  overflow: hidden;
  background: #eef4f1;
}

.product-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  display: grid;
  place-items: center;
  width: 74px;
  height: 74px;
  border: 1px solid rgba(31, 109, 104, 0.18);
  border-radius: 50%;
  color: #1f6d68;
  background: #dcece8;
  font-size: 2rem;
  font-weight: 750;
}

.product-id {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 5px 8px;
  border-radius: 6px;
  color: #53656a;
  background: rgba(255, 255, 255, 0.82);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  font-weight: 700;
}

.product-content {
  padding: 22px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #899699;
  font-size: 0.74rem;
}

.product-status {
  padding: 5px 8px;
  border-radius: 5px;
  color: #23716b;
  background: #e5f2ee;
  font-weight: 750;
}

.product-content h2 {
  margin-top: 18px;
  color: #18252d;
  font-size: 1.35rem;
  font-weight: 750;
}

.product-name-link {
  color: inherit;
  text-decoration: none;
  transition: color 160ms ease;
}

.product-name-link:hover {
  color: #1f6d68;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.product-description {
  min-height: 48px;
  margin-top: 9px;
  color: #718084;
  font-size: 0.88rem;
  line-height: 1.65;
}

.product-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #edf1ef;
  color: #93a0a2;
  font-size: 0.75rem;
}

.product-footer strong {
  color: #c95837;
  font-size: 1.3rem;
  font-weight: 800;
}

.results-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  color: #78878a;
  font-size: 0.78rem;
}

.results-line {
  width: 34px;
  height: 1px;
  background: #e7a62a;
}

.results-api {
  margin-left: auto;
  color: #a0abad;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {
  .products-page {
    padding: 42px 24px 56px;
  }

  .heading-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .products-page {
    padding-inline: 18px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .results-footer {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .results-api {
    width: 100%;
    margin-left: 46px;
    overflow-wrap: anywhere;
  }
}
</style>
