<template>
  <div>
    <header>
      <h1>歡迎, {{ currentUser.name }}</h1>
      <button @click="toggleView">
        切換顯示風格
      </button>
    </header>
    <TabbedMenu v-if="isTabbedView" :vendors="vendors" :currentUser="currentUser" />
    <FullPageMenu v-else :vendors="vendors" :currentUser="currentUser" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TabbedMenu from '@components/TabbedMenu.vue';
import FullPageMenu from '@components/FullPageMenu.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    TabbedMenu,
    FullPageMenu
  },
  setup() {
    const currentUser = ref({
      id: 'user1',
      name: 'Alice',
      favorites: ['vendor1', 'vendor2']
    });

    const vendors = ref([
      {
        id: 'vendor1',
        name: 'Vendor A',
        menu: [
          { id: 'product1', name: 'Product 1', price: 10.00 },
          { id: 'product2', name: 'Product 2', price: 15.50 }
        ]
      },
      {
        id: 'vendor2',
        name: 'Vendor B',
        menu: [
          { id: 'product3', name: 'Product 3', price: 10.00 },
          { id: 'product4', name: 'Product 4', price: 20.00 }
        ]
      }
    ]);

    const isTabbedView = ref(true);

    const toggleView = () => {
      isTabbedView.value = !isTabbedView.value;
    };

    return {
      currentUser,
      vendors,
      isTabbedView,
      toggleView
    };
  }
});
</script>

<style scoped>
header {
  font-size: 24px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  padding: 8px 16px;
  font-size: 16px;
}
</style>
