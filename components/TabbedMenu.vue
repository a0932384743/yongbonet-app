<template>
  <tabs scrollable :value="selectCategory" @tab-change="onSelectCategory" ref="targetRef" style="width: 100%;height: 100%">
    <tab-list>
      <tab v-for="category in Object.keys(productByCategory)" :key="category" :value="category">
        {{ category }} ({{
          productByCategory[category as keyof typeof productByCategory].length ?? 0
        }})
      </tab>
    </tab-list>
    <tab-panels>
      <tab-panel
        v-for="category in Object.keys(productByCategory)"
        :key="category + '_products'"
        :value="category"
      >
        <DataTable
          :value="productByCategory[category as keyof typeof productByCategory]"
          scrollable
          :scrollHeight="scrollHeight + 'px'"
        >
          <Column
            field="img"
            header="圖片"
            style="min-width: 100px"
            headerClass="text-center"
            bodyClass="text-center"
          >
            <template #body="{ data }">
              <Avatar :image="data.img" class="product-img" :alt="data.name" />
            </template>
          </Column>
          <Column field="name" header="品名" style="min-width: 200px">
            <template #body="{ data }">
              {{ data.name }}
              <span
                v-if="data.isFavorite"
                class="pi pi-star-fill"
                style="color: #10b981; font-size: 15px"
              />
            </template>
          </Column>
          <Column field="description" header="商品說明" min-width="200px">
            <template #body="{ data }">
              {{ data.description }}
            </template>
          </Column>
          <Column field="price" header="價格/單位" style="min-width: 200px">
            <template #body="{ data }">
              {{ data.price.toLocaleString() }}/{{ data.unit || '-' }}
            </template>
          </Column>
          <Column field="count" header="購買數量" style="min-width: 200px">
            <template #body="{ data }">
              <InputNumber
                showButtons
                :modelValue="order[data.id]?.quantity || 0"
                buttonLayout="horizontal"
                :inputStyle="{ width: '80px', textAlign: 'center' }"
                @update:model-value="
                  (value) => {
                    updateOrder(data, value)
                  }
                "
                :min="0"
                :max="99"
              >
                <template #incrementbuttonicon>
                  <span class="pi pi-plus" />
                </template>
                <template #decrementbuttonicon>
                  <span class="pi pi-minus" />
                </template>
              </InputNumber>
            </template>
          </Column>
        </DataTable>
      </tab-panel>
    </tab-panels>
  </tabs>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, onMounted, onUnmounted } from 'vue'
import { Tab, TabList, Tabs, TabPanels, TabPanel, DataTable, InputNumber } from 'primevue'
import { type VendorData } from '@composables/useVendors'
import { type ProductData, useProducts } from '@composables/useProducts'
import { type OrderItem } from '@composables/useOrders'

export default defineComponent({
  name: 'TabbedMenu',
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
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    DataTable,
    InputNumber
  },
  setup(props, { emit }) {
    const { products, getProductByIds } = useProducts()
    const selectCategory = ref<string>('')
    const targetRef = ref(null)

    const onSelectCategory = (value: string) => {
      selectCategory.value = value
    }

    const scrollHeight = ref<number>(400)

    function updateHeight() {
      if (targetRef.value) {
        scrollHeight.value = targetRef.value.$el.clientHeight || 400
      }
    }

    onMounted(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateHeight)
    })

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
    watch(
      products,
      (products) => {
        if (products.length > 0) {
          selectCategory.value = products[0].category
        }
      },
      { deep: true }
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
      targetRef,
      selectCategory,
      productByCategory,
      updateOrder,
      onSelectCategory,
      scrollHeight
    }
  }
})
</script>

<style scoped lang="scss">
.text-center {
  text-align: center;
}

.product-img {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 20px;
}
</style>
