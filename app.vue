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
    <div class="row">
      <div class="row" style="gap: 0.3rem; align-items: center; position: relative">
        <span v-if="currentVendor.isFavorite" class="pi pi-star-fill" style="color: #ffb100" />
        <span v-else class="pi pi-star" />
        <span class="header">{{ currentVendor?.name || '' }}</span>
        <Button
          icon="pi pi-angle-down"
          variant="text"
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
    <TabbedMenu v-if="isTabbedView" :vendor="currentVendor"/>
    <FullPageMenu v-else :vendor="currentVendor"/>
    <div class="bottom">
      <p-button
        @click="submitOrder"
        type="button"
        severity="info"
        label="送出訂單"
        icon="pi pi-send"
        iconPos="right"
        size="large"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { SelectButton, Button as PButton, ProgressSpinner, Menu as PMenu, Avatar } from 'primevue'
import TabbedMenu from '@components/TabbedMenu.vue'
import FullPageMenu from '@components/FullPageMenu.vue'
import { useVendors, type VendorData } from '@composables/useVendors'
import { useProducts } from '@composables/useProducts'


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
    const { isLoading:productLoading } = useProducts()

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

    return {
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
  padding: 1rem 2rem 10rem 2rem;
  overflow: auto;
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

.bottom {
  width: 100vw;
  height: 10rem;
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
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
