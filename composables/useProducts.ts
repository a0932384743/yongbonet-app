import { useFirebase } from './useFirebase'
import { ref } from 'vue'

export interface ProductData {
  id?: string // Firebase 會自動生成 ID，可選屬性
  name: string // 商品名稱
  description: string // 商品描述
  price: number // 價格
  vendorId: string // 關聯的廠商 ID
  imageUrl: string // 商品圖片
}

export const useProducts = () => {
  const firebase = useFirebase()

  const products = ref<Array<ProductData>>([]) // 用於存儲商品列表
  const product = ref<ProductData | null>(null) // 用於存儲商品列表

  const isLoading = ref<boolean>(false)
  const error = ref(null)

  const getProductById = async (productId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const productsRef = firebase.ref(firebase.database, `products/${productId}`)
      const snapshot = await firebase.get(productsRef)
      product.value = snapshot.exists() ? snapshot.val() : null
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 取得所有商品
  const getProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const productsRef = firebase.ref(firebase.database, 'products')
      const snapshot = await firebase.get(productsRef)
      products.value = snapshot.exists() ? snapshot.val() : []
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 新增/更新商品
  const saveProduct = async (productId: string, productData: ProductData) => {
    isLoading.value = true
    error.value = null
    try {
      const productRef = firebase.ref(firebase.database, `products/${productId}`)
      await firebase.set(productRef, productData)
      await getProducts()
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 刪除商品
  const deleteProduct = async (productId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const productRef = ref(firebase.database, `products/${productId}`)
      await firebase.set(productRef, null)
      await getProducts()
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  return { getProductById, getProducts, saveProduct, deleteProduct }
}
