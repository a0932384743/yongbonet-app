<template>
  <div class="container">
    <div class="overlay" v-if="productLoading || vendorLoading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="ProgressSpinner"
      />
    </div>
    <div class="top">
      <div class="row">
        <div class="row" style="gap: 0.5rem; align-items: center; position: relative">
          <span
            v-if="currentVendor.isFavorite"
            class="pi pi-star-fill"
            style="color: #ffb100; font-size: 28px"
          />
          <span v-else class="pi pi-star" style="font-size: 28px" />
          <span class="header">{{ currentVendor?.name || '' }}</span>
          <PButton
            icon="pi pi-angle-down"
            variant="text"
            severity="secondary"
            rounded
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="toggleMenu"
          />
          <PMenu :model="vendors" :popup="true" ref="isMenuPopup" id="overlay_menu">
            <template #item="{ item, props }">
              <div
                class="flex items-center"
                v-bind="props.action"
                @click="onSelectVendor(item as VendorData)"
              >
                <Avatar :image="item.img" class="mr-2" />
                <span>{{ item.name }}</span>
              </div>
            </template>
          </PMenu>
        </div>
        <div class="row" style="gap: 1rem; align-items: center">
          <SelectButton
            v-model="isTabbedView"
            :options="options"
            option-label="label"
            option-value="value"
          />
        </div>
      </div>
    </div>
    <div class="main">
      <TabbedMenu
        v-if="isTabbedView"
        :vendor="currentVendor"
        :order="order"
        @update-order="updateOrder"
      />
      <FullPageMenu v-else :vendor="currentVendor" :order="order" @update-order="updateOrder" />
    </div>
    <div class="bottom">
      <div class="row" style="justify-content: flex-end; align-items: center; gap: 1rem">
        <div class="summary">
          <span
            >共選取<span class="h6">{{ orderTotalQuantity }}</span
            >個商品</span
          >
          <span
            >共NT<span class="h6">{{ orderTotalPrice.toLocaleString() }}</span
            >元</span
          >
        </div>
        <p-button
          @click="submitOrder"
          type="button"
          severity="success"
          label="結帳去"
          icon="pi pi-caret-right"
          iconPos="right"
          class="padding"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, watch, computed } from 'vue'
import { SelectButton, Button as PButton, ProgressSpinner, Menu as PMenu, Avatar } from 'primevue'
import TabbedMenu from '@components/TabbedMenu.vue'
import FullPageMenu from '@components/FullPageMenu.vue'
import { useVendors, type VendorData } from '@composables/useVendors'
import { useProducts } from '@composables/useProducts'
import { useOrders } from '@composables/useOrders'

export default defineComponent({
  name: 'HomePage',
  components: {
    TabbedMenu,
    FullPageMenu,
    PButton,
    SelectButton,
    ProgressSpinner,
    PMenu,
    Avatar
  },
  setup() {
    const { vendors, isLoading: vendorLoading, getVendors } = useVendors()
    const { isLoading: productLoading } = useProducts()
    const { order, updateOrder } = useOrders()

    const currentUser = ref({
      id: 'user1',
      name: 'Alice',
      favorites: ['vendor1', 'vendor2']
    })

    const currentVendor = ref<VendorData>({} as VendorData)
    const isTabbedView = ref<boolean>(true)
    const isMenuPopup = ref()

    const submitOrder = () => {
      console.log('Order submitted:')
    }

    const toggleMenu = (event: MouseEvent) => {
      isMenuPopup.value.toggle(event)
    }

    const onSelectVendor = (vendor: VendorData) => {
      currentVendor.value = vendor
    }

    const options = ref([
      {
        value: true,
        label: '一頁式菜單'
      },
      {
        value: false,
        label: '整頁式菜單'
      }
    ])

    onBeforeMount(() => {
      getVendors()
    })

    watch(vendors, (newVendors) => {
      if (newVendors.length > 0) {
        currentVendor.value = newVendors.find((v) => v.isFavorite) || newVendors[0]
      }
    })

    const orderTotalPrice = computed(() => {
      return Object.values(order.value).reduce((acc, item) => {
        return acc + (item.quantity || 0) * (item.price || 0)
      }, 0)
    })

    const orderTotalQuantity = computed(() => {
      return Object.values(order.value).filter((order) => order.quantity > 0).length
    })


    return {
      order,
      updateOrder,
      orderTotalPrice,
      orderTotalQuantity,
      productLoading,
      vendorLoading,
      options,
      currentUser,
      currentVendor,
      onSelectVendor,
      vendors,
      isTabbedView,
      isMenuPopup,
      toggleMenu,
      submitOrder
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  padding: 5rem 2rem 7rem 2rem;
  overflow: hidden;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.top {
  width: 100vw;
  height: 5rem;
  padding: 0 2rem;
  z-index: 999;
  left: 0;
  top: 0;
  position: absolute;
}

.main {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #10b981;
  overflow: auto;
}

.bottom {
  width: 100vw;
  height: 7rem;
  padding: 0 2rem;
  z-index: 999;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  position: absolute;

  > * {
    align-self: center;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.header {
  font-size: 1.75rem;
  font-weight: bold;
}

.padding {
  padding: 1rem 2rem;
}

.summary {
  font-size: 14px;
  letter-spacing: 0;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .h6 {
    font-weight: 700;
    font-size: 20px;
    margin: 0 5px;
  }
}
</style>
