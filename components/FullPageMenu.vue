<template>
  <div class="waterfall">
    <div v-for="vendor in vendors" :key="vendor.id" class="vendor-section">
      <h3 class="vendor-name">{{ vendor.name }}</h3>
      <data-view :value="vendor.menu">
        <template #list="slotProps">
          <div class="products-container">
            <div
              v-for="item in slotProps.items"
              :key="JSON.stringify(item)"
              class="product-container"
            >
              <div class="row">
                <checkbox type="checkbox" :value="item.id" size="large" />
                <h2 class="name">{{ item.name }}</h2>
                <Button icon="pi pi-heart" outlined severity="danger"/>
              </div>
              <div class="row">
                <div class="price">NT {{ item.price.toLocaleString() }}元</div>
              </div>
            </div>
          </div>
        </template>
      </data-view>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  DataView,
  Button,
  Checkbox
} from 'primevue'
export default defineComponent({
  name: 'FullPageMenu',
  props: {
    vendors: Array,
    currentUser: Object
  },
  components: [DataView, Button , Checkbox],
  setup() {
    const selectedProducts = ref<string[]>([]);

    return {
      selectedProducts,
    };
  }
});
</script>

<style scoped>
.waterfall {
  column-count: 3; /* 設定 3 欄 */
  column-gap: 10px;
  column-fill: auto;

  @media (max-width: 768px) {
    column-count: 1; /* 中尺寸設定 2 欄 */
  }

}

.vendor-section {
  break-inside: avoid; /* 避免內容跨欄 */
  margin-bottom: 10px;
  padding: 0 15px;
}

.vendor-name{
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 5px 0;
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
  padding: 10px 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.price{
  font-size: 1.2rem;
  font-weight: bold;
  text-align: end;
}
</style>
