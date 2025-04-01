<template>
  <div>
    <nav>
      <ul>
        <li v-for="vendor in vendors" :key="vendor.id">
          <button @click="selectVendor(vendor.id)">
            {{ vendor.name }}
          </button>
        </li>
      </ul>
    </nav>
    <main v-if="selectedVendor">
      <h2>{{ selectedVendor.name }} 的菜單</h2>
      <ul>
        <li v-for="product in selectedVendor.menu" :key="product.id">
          <label>
            <input type="checkbox" v-model="selectedProducts" :value="product.id" />
            {{ product.name }} - ${{ product.price }}
          </label>
        </li>
      </ul>
      <button @click="submitOrder">送出訂單</button>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed , watch} from 'vue';

export default defineComponent({
  name: 'TabbedMenu',
  props: {
    vendors: Array,
    currentUser: Object
  },
  setup(props) {
    const selectedVendorId = ref<string | null>(null);
    const selectedProducts = ref<string[]>([]);

    const selectedVendor = computed(() => {
      return props.vendors.find(vendor => vendor.id === selectedVendorId.value) || null;
    });

    const selectVendor = (vendorId: string) => {
      selectedVendorId.value = vendorId;
      selectedProducts.value = [];
    };

    const submitOrder = () => {
      if (!selectedVendor.value) return;
      const order = {
        userId: props.currentUser.id,
        vendorId: selectedVendor.value.id,
        products: selectedProducts.value,
        totalPrice: selectedProducts.value.reduce((total, productId) => {
          const product = selectedVendor.value!.menu.find(p => p.id === productId);
          return total + (product ? product.price : 0);
        }, 0),
        status: 'pending'
      };
      console.log('Order submitted:', order);
      // 這裡可以加入將訂單送到 Firebase 的邏輯
    };

    watch(() => props.vendors, (newVendors) => {
      if (newVendors.length > 0) {
        selectVendor(newVendors[0].id);
      }
    }, { immediate: true });

    return {
      selectedVendor,
      selectedProducts,
      selectVendor,
      submitOrder
    };
  }
});
</script>

<style scoped>
nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 8px;
}
nav button {
  padding: 8px 16px;
  font-size: 16px;
}
main {
  margin-top: 16px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 8px;
}
button {
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 16px;
}
</style>
