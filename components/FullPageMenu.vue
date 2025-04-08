<template>
  <div class="waterfall">
    <div v-for="vendor in vendors" :key="vendor.id" class="vendor-section">
      <h3 class="vendor-name">{{ vendor.name }}</h3>
      <DataView :value="vendor.menu">
        <template #list="slotProps">
          <div class="products-container">
            <div
              v-for="item in slotProps.items"
              :key="JSON.stringify(item)"
              class="product-container"
            >
              <div class="row">
                <div class="price">NT {{ item.price.toLocaleString() }}元</div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DataView, Button, Checkbox } from 'primevue'

export default defineComponent({
  name: 'FullPageMenu',
  props: {
    vendors: Array,
    currentUser: Object
  },
  components: [DataView, Button, Checkbox],
  setup() {
    const selectedProducts = ref<string[]>([])

    return {
      selectedProducts
    }
  }
})
</script>

<style scoped lang="scss">
.waterfall {
  column-count: 4; /* 可根據螢幕大小動態調整 */
  column-gap: 16px;

  @media (max-width: 768px) {
    column-count: 1; /* 中尺寸設定 2 欄 */
  }
}

.vendor-section {
  break-inside: avoid;
  padding: 0;
  margin: 0;
  display: block;
  overflow: hidden;
}

.vendor-name {
  font-family: Inter, serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.products-container {
  width: 100%;
  display: inline-flex;
  flex-direction: column;
}

.product-container {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  padding: 10px 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: end;
}
</style>
