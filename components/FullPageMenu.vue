<template>
  <div class="waterfall">
    <div v-for="category in Object.keys(productByCategory)" :key="category" class="vendor-section">
      <h3 class="vendor-name">{{ category }}</h3>
      <DataView
        :value="productByCategory[category as keyof typeof productByCategory]"
        :layout="'list'"
      >
        <template #list="slotProps">
          <div class="products-container">
            <div
              v-for="item in slotProps.items"
              :key="JSON.stringify(item)"
              class="product-container"
            >
              <div class="row" style="width: 100%">
                <div class="row" style="flex: 1 1 auto; flex-grow: 1">
                  <h2 class="name">{{ item.name }}</h2>
                  <Button icon="pi pi-heart" outlined severity="danger" />
                </div>
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
import { computed, defineComponent, watch } from 'vue'
import { DataView } from 'primevue'
import { type VendorData } from '@composables/useVendors'
import { useProducts } from '@composables/useProducts'

export default defineComponent({
  name: 'FullPageMenu',
  components: {
    DataView
  },
  props: {
    vendor: {
      type: Object as () => VendorData,
      required: true
    }
  },
  setup(props) {
    const { products, getProductByIds } = useProducts()

    watch(
      () => props.vendor,
      (vendor, old) => {
        if ((vendor && vendor.id !== old?.id) || products.value.length === 0) {
          getProductByIds(vendor.products)
        }
      },
      { deep: true, immediate: true }
    )

    const productByCategory = computed(() => {
      return products.value.reduce((obj, val) => {
        return {
          ...obj,
          [val.category]: [...(obj[val.category as keyof typeof obj] || []), val]
        }
      }, {})
    })

    return {
      productByCategory
    }
  }
})
</script>

<style scoped lang="scss">
.waterfall {
  column-count: 4; /* 可根據螢幕大小動態調整 */
  column-gap: 16px;

  @media (max-width: 1279px) and (min-width: 512px) {
    column-count: 2; /* 中尺寸設定 2 欄 */
  }

  @media (max-width: 511px) {
    column-count: 1; /* 小尺寸設定 1 欄 */
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
  padding: 10px 15px;
}

.row {
  display: inline-flex;
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
