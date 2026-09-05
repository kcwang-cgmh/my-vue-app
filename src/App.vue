<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark" aria-hidden="true">VS</span>
        <span class="brand-copy">
          <strong>VueShelf</strong>
          <small>PRODUCT CATALOG</small>
        </span>
      </RouterLink>

      <nav class="main-nav" aria-label="主要導覽">
        <RouterLink to="/products">產品目錄</RouterLink>
        <RouterLink to="/my-products">我的產品</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>Vue + Vite</span>
      <span class="footer-separator" aria-hidden="true">/</span>
      <span>Products API</span>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 24px 48px;
  box-sizing: border-box;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #18252d;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  color: #fffaf3;
  background: #c95837;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 1rem;
  line-height: 1;
}

.brand-copy small {
  color: #8b9798;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.main-nav a {
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  color: #68767a;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 160ms ease, border-color 160ms ease;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  border-color: #e7a62a;
  color: #18252d;
}

.app-main {
  flex: 1;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 24px 26px;
  color: #9aa5a6;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.footer-separator {
  color: #e7a62a;
}

@media (max-width: 800px) {
  .site-header {
    padding: 20px 24px;
  }
}

@media (max-width: 540px) {
  .site-header {
    padding-inline: 18px;
  }

  .brand-copy small {
    display: none;
  }
}
</style>
