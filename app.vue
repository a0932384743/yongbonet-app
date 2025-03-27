<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from './composables/useProducts'

const { getProductById } = useProducts()

onMounted(async () => {
  const ref = await getProductById('product_001')
  console.log(ref)
})
</script>
