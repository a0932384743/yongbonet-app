<template>
  <div class="container">
    <div class="row">
      <h1 class="header">歡迎, {{ currentUser.name }}</h1>
      <div class="row" style="gap: 1rem; align-items: center">
        <toggle-switch v-model="isTabbedView" aria-label="切換顯示風格" />全菜單檢視
      </div>
    </div>
    <TabbedMenu v-if="!isTabbedView" :vendors="vendors" :currentUser="currentUser" />
    <FullPageMenu v-else :vendors="vendors" :currentUser="currentUser" />
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
import { defineComponent, ref } from 'vue'
import TabbedMenu from '@components/TabbedMenu.vue'
import FullPageMenu from '@components/FullPageMenu.vue'
import { ToggleSwitch, Button as PButton } from 'primevue'

export default defineComponent({
  name: 'HomePage',
  components: {
    TabbedMenu,
    PButton,
    FullPageMenu,
    ToggleSwitch
  },
  setup() {
    const currentUser = ref({
      id: 'user1',
      name: 'Alice',
      favorites: ['vendor1', 'vendor2']
    })

    const vendors = ref([
      {
        id: 'vendor1',
        name: 'Vendor A',
        menu: [
          {
            id: 'product1',
            name: 'Product 1',
            price: 10.0,
            rating: 4,
            img: 'https://cdn-icons-png.flaticon.com/512/4129/4129528.png'
          },
          {
            id: 'product2',
            name: 'Product 2',
            price: 15.5,
            rating: 4,
            img: 'https://cdn-icons-png.flaticon.com/512/4129/4129528.png'
          }
        ]
      },
      {
        id: 'vendor2',
        name: 'Vendor B',
        menu: [
          {
            id: 'product3',
            name: 'Product 3',
            price: 10.0,
            rating: 4,
            img: 'https://cdn-icons-png.flaticon.com/512/4129/4129528.png'
          },
          {
            id: 'product4',
            name: 'Product 4',
            price: 20.0,
            rating: 4,
            img: 'https://cdn-icons-png.flaticon.com/512/4129/4129528.png'
          }
        ]
      }
    ])

    const isTabbedView = ref(true)

    const submitOrder = () => {
      console.log('Order submitted:')
    }

    return {
      currentUser,
      vendors,
      isTabbedView,
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
  font-size: 2rem;
  font-weight: bold;
}
</style>
