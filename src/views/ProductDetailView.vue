<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Product } from '../types/Product'

const route = useRoute()
const product = ref<Product | null>(null)
const errorMessage = ref('')
const productId = computed(() => String(route.params.productID ?? ''))
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

  const productData = value as Record<string, unknown>
  return (
    typeof productData.productID === 'number' &&
    typeof productData.name === 'string' &&
    typeof productData.unitPrice === 'number' &&
    isNullableString(productData.photo) &&
    isNullableString(productData.description) &&
    (productData.orders === null || Array.isArray(productData.orders))
  )
}

const loadProductFromHistoryState = () => {
  const stateProduct: unknown = window.history.state?.product
  const routeProductId = Number(productId.value)

  if (isProduct(stateProduct) && stateProduct.productID === routeProductId) {
    product.value = stateProduct
    errorMessage.value = ''
    return
  }

  product.value = null
  errorMessage.value = '請從產品目錄點選產品名稱，以載入產品明細。'
}

const formatPrice = (price: number) => currencyFormatter.format(price)

const getProductImage = (productData: Product) => {
  const photo = productData.photo?.trim()
  return photo || ''
}

const formatOrderCount = (orders: unknown[] | null) =>
  orders?.length ? `${orders.length} 筆訂單` : '尚無訂單'

watch(productId, loadProductFromHistoryState, { immediate: true })
</script>

<template>
  <section class="product-detail-page">
    <RouterLink class="back-link" :to="{ name: 'products' }">
      <span aria-hidden="true">←</span>
      返回產品目錄
    </RouterLink>

    <div v-if="errorMessage" class="state-panel state-panel--error" role="alert">
      <div class="state-icon" aria-hidden="true">!</div>
      <div>
        <h1>無法載入產品明細</h1>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <article v-else-if="product" class="detail-card">
      <div class="detail-visual">
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

      <div class="detail-content">
        <div class="eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          PRODUCT DETAIL
        </div>
        <p class="product-status">可販售</p>
        <h1>{{ product.name }}</h1>
        <p class="detail-description">
          {{ product.description || '尚未提供商品描述。' }}
        </p>

        <div class="price-row">
          <span>單價</span>
          <strong>{{ formatPrice(product.unitPrice) }}</strong>
        </div>

        <dl class="detail-facts">
          <div>
            <dt>產品編號</dt>
            <dd>#{{ product.productID }}</dd>
          </div>
          <div>
            <dt>訂單數量</dt>
            <dd>{{ formatOrderCount(product.orders) }}</dd>
          </div>
        </dl>
      </div>
    </article>
  </section>
</template>

<style scoped>
.product-detail-page {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 52px 48px 72px;
  box-sizing: border-box;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #68767a;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 160ms ease, transform 160ms ease;
}

.back-link:hover {
  color: #1f6d68;
  transform: translateX(-3px);
}

.state-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 220px;
  margin-top: 30px;
  padding: 36px;
  border: 1px dashed #c8d2d0;
  border-radius: 16px;
  color: #68767a;
  background: rgba(255, 255, 255, 0.65);
  text-align: center;
}

.state-panel h1 {
  margin: 0 0 8px;
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

.detail-card {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  margin-top: 30px;
  padding: 24px;
  border: 1px solid #dfe7e4;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(36, 53, 54, 0.08);
}

.detail-visual {
  position: relative;
  display: grid;
  min-height: 390px;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
  background: #eef4f1;
}

.detail-visual img {
  width: 100%;
  height: 100%;
  min-height: 390px;
  object-fit: cover;
}

.product-placeholder {
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(31, 109, 104, 0.18);
  border-radius: 50%;
  color: #1f6d68;
  background: #dcece8;
  font-size: 3.2rem;
  font-weight: 750;
}

.product-id {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 9px;
  border-radius: 6px;
  color: #53656a;
  background: rgba(255, 255, 255, 0.84);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.74rem;
  font-weight: 700;
}

.detail-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 22px 20px 22px 0;
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

.product-status {
  align-self: flex-start;
  margin: 28px 0 0;
  padding: 5px 8px;
  border-radius: 5px;
  color: #23716b;
  background: #e5f2ee;
  font-size: 0.74rem;
  font-weight: 750;
}

.detail-content h1 {
  margin: 18px 0 0;
  color: #18252d;
  font-family: 'Avenir Next', 'Noto Sans TC', sans-serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1;
}

.detail-description {
  max-width: 560px;
  margin-top: 18px;
  color: #718084;
  line-height: 1.75;
}

.price-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 34px;
  padding: 18px 0;
  border-top: 1px solid #edf1ef;
  border-bottom: 1px solid #edf1ef;
  color: #93a0a2;
  font-size: 0.78rem;
}

.price-row strong {
  color: #c95837;
  font-size: 1.7rem;
  font-weight: 800;
}

.detail-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 24px 0 0;
}

.detail-facts div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-facts dt {
  color: #93a0a2;
  font-size: 0.74rem;
}

.detail-facts dd {
  margin: 0;
  color: #18252d;
  font-size: 0.92rem;
  font-weight: 700;
}

@media (max-width: 800px) {
  .product-detail-page {
    padding: 42px 24px 56px;
  }

  .detail-card {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .detail-visual,
  .detail-visual img {
    min-height: 300px;
  }

  .detail-content {
    padding: 0 8px 12px;
  }
}

@media (max-width: 540px) {
  .product-detail-page {
    padding-inline: 18px;
  }

  .detail-card {
    padding: 14px;
  }

  .detail-facts {
    grid-template-columns: 1fr;
  }
}
</style>
