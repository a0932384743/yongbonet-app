<template>
  <tabs scrollable :value="selectedVendorId">
    <tab-list>
      <tab v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">
        {{ vendor.name }}
      </tab>
    </tab-list>
    <tab-panels>
      <tab-panel v-for="vendor in vendors" :key="vendor.id + '_products'" :value="vendor.id">
        <data-view :value="vendor.menu">
          <template #list="slotProps">
            <div class="products-container">
              <div
                v-for="item in slotProps.items"
                :key="JSON.stringify(item)"
                class="product-container"
              >
                <div class="row">
                  <img class="product-img" :src="item.img" :alt="item.name" />
                  <div class="column">
                    <h2 class="name">{{ item.name }}</h2>
                    <div>
                      <tag style="border: 2px solid lightgray; background: transparent;">
                        <span style="color:var(--p-text-color)">{{ item.rating || '-' }}</span>
                        <i class="pi pi-star-fill" style="fill:#ffc400"></i>
                      </tag>
                    </div>
                  </div>
                </div>
                <div class="column" style="justify-content: space-between">
                  <div class="price">NT {{ item.price.toLocaleString() }}元</div>
                  <div class="row">
                    <Button icon="pi pi-heart" outlined severity="danger"/>
                    <Button
                      icon="pi pi-shopping-cart"
                      label="加入購物車"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </data-view>
      </tab-panel>
    </tab-panels>
  </tabs>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import {
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Tag,
  DataView,
  Button
} from 'primevue'

export default defineComponent({
  name: 'TabbedMenu',
  props: {
    vendors: Array,
    currentUser: Object
  },
  components: [Tabs, TabList, Tab, TabPanels, TabPanel, Tag, DataView, Button],

  setup(props) {
    const selectedVendorId = ref<string | null>(null)
    const selectedProducts = ref<string[]>([])

    watch(
      () => props.vendors,
      (newVendors) => {
        if (newVendors.length > 0) {
          selectedVendorId.value = newVendors[0].id
        }
      },
      { immediate: true }
    )

    return {
      selectedVendorId,
      selectedProducts
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
  margin:0 20px
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
  gap: 5px
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.price{
  font-size: 1rem;
  font-weight: bold;
  text-align: end;
}
</style>
