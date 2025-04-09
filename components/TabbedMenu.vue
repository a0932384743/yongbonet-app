<template>
  <tabs scrollable :value="selectCategory" @tab-change="onSelectCategory">
    <tab-list>
      <tab v-for="category in Object.keys(productByCategory)" :key="category" :value="category">
        {{ category }}
      </tab>
    </tab-list>
    <tab-panels>
      <tab-panel
        v-for="category in Object.keys(productByCategory)"
        :key="category + '_products'"
        :value="category"
      >
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
                <div class="row">
                  <Avatar :image="item.img" class="mr-2 product-img" :alt="item.name" />
                  <div class="column">
                    <h2 class="name">{{ item.name }}</h2>
                    <div>
                      <tag style="border: 2px solid lightgray; background: transparent">
                        <span style="color: var(--p-text-color)">{{ item.rating || '-' }}</span>
                        <i class="pi pi-star-fill" style="fill: #ffc400"></i>
                      </tag>
                    </div>
                  </div>
                </div>
                <div class="column" style="justify-content: space-between">
                  <div class="price">NT {{ item.price.toLocaleString() }}元</div>
                  <div class="row">
                    <PButton icon="pi pi-heart" outlined severity="danger" />
                    <PButton icon="pi pi-shopping-cart" label="加入購物車" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </tab-panel>
    </tab-panels>
  </tabs>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref } from 'vue'
import { Tab, TabList, Tabs, TabPanels, TabPanel, Tag, DataView, Button as PButton } from 'primevue'
import { type VendorData } from '@composables/useVendors'
import { useProducts } from '@composables/useProducts'

export default defineComponent({
  name: 'TabbedMenu',
  props: {
    vendor: {
      type: Object as () => VendorData,
      required: true
    }
  },
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Tag,
    DataView,
    PButton
  },
  setup(props) {
    const { products, getProductByIds } = useProducts()
    const selectCategory = ref<string>('')
    const onSelectCategory = (value: string) => {
      selectCategory.value = value
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

    const productByCategory = computed(() => {
      return products.value.reduce((obj, val) => {
        return {
          ...obj,
          [val.category]: [...(obj[val.category as keyof typeof obj] || []), val]
        }
      }, {})
    })

    return {
      selectCategory,
      productByCategory,
      onSelectCategory
    }
  }
})
</script>

<style scoped lang="scss">
.products-container {
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  gap: 1rem;
}

.product-container {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  padding: 20px 10px;
  border-bottom: 1px solid lightgray;

  &:last-child {
    border-bottom: 0;
  }
}

.product-img {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 20px;
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.price {
  font-size: 1rem;
  font-weight: bold;
  text-align: end;
}
</style>
