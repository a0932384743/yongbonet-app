<template>
  <div>
    <h2>所有供應商的菜單</h2>
    <div v-for="vendor in vendors" :key="vendor.id" class="vendor-section">
      <h3>{{ vendor.name }}</h3>
      <ul>
        <li v-for="product in vendor.menu" :key="product.id">
          <label>
            <input type="checkbox" v-model="selectedProducts" :value="product.id" />
            {{ product.name }} - ${{ product.price }}
          </label>
        </li>
      </ul>
    </div>
    <button @click="submitOrder">送出訂單</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FullPageMenu',
  props: {
    vendors: Array,
    currentUser: Object
  },
  setup(props) {
    const selectedProducts = ref<string[]>([]);

    const submitOrder = () => {
      const order = {
        userId: props.currentUser.id,
        vendorId: null, // 這裡可以根據需求修改
        products: selectedProducts.value,
        totalPrice: selectedProducts.value.reduce((total, productId) => {
          for (const vendor of props.vendors) {
            const product = vendor.menu.find(p => p.id === productId);
            if (product) {
              return total + product.price;
            }
          }
          return total;
        }, 0),
        status: 'pending'
      };
      console.log('Order submitted:', order);
      // 這裡可以加入將訂單送到 Firebase 的邏輯
    };

    return {
      selectedProducts,
      submitOrder
    };
  }
});
</script>

<style scoped>
.vendor-section {
  margin-bottom: 24px;
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
