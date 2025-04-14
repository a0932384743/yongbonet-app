<template>
  <div class="waterfall">
    <div v-for="category in Object.keys(productByCategory)" :key="category" class="vendor-section">
      <h3 class="vendor-name">
        {{ category }} ({{
          productByCategory[category as keyof typeof productByCategory].length ?? 0
        }})
      </h3>
      <div class="products-container">
        <div
          v-for="product in productByCategory[category as keyof typeof productByCategory]"
          :key="JSON.stringify(product)"
          class="product-container"
        >
          <div class="row" style="width: 100%">
            <h2 class="name">
              {{ product.name }}
              <span
                v-if="product.isFavorite"
                class="pi pi-star-fill"
                style="color: #10b981; font-size: 10px"
              />
            </h2>
            <div class="row price" style="justify-content: flex-end">
              NT {{ product.price.toLocaleString() }} /
              <InputNumber
                :modelValue="order[String(product.id)]?.quantity || 0"
                :inputStyle="{ width: '80px', textAlign: 'center' }"
                @update:model-value="
                  (value) => {
                    updateOrder(product, value)
                  }
                "
                :min="0"
                :max="99"
              >
              </InputNumber>
              {{ product.unit || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { type VendorData } from '@composables/useVendors'
import { type ProductData, useProducts } from '@composables/useProducts'
import type { OrderItem } from '@composables/useOrders'

export default defineComponent({
  name: 'FullPageMenu',
  props: {
    vendor: {
      type: Object as () => VendorData,
      required: true
    },
    order: {
      type: Object as () => {
        [productId: string]: OrderItem
      },
      required: true
    }
  },
  setup(props, { emit }) {
    const { products, getProductByIds } = useProducts()

    const updateOrder = (product: ProductData, quantity: number) => {
      emit('updateOrder', product, quantity)
    }

    watch(
      () => props.vendor,
      (vendor, old) => {
        if ((vendor && vendor.id !== old?.id) || products.value.length === 0) {
          getProductByIds(vendor.products)
        }
      },
      { immediate: true, deep: true }
    )

    const productByCategory = computed<{
      [key: string]: Array<ProductData>
    }>(() => {
      return products.value.reduce((obj, val) => {
        return {
          ...obj,
          [val.category]: [...(obj[val.category as keyof typeof obj] || []), val]
        }
      }, {})
    })

    return {
      productByCategory,
      updateOrder
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
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  flex: 1 1 auto;
}

.price {
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
}
</style>
