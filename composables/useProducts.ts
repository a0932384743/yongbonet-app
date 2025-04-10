import { useFirebase } from './useFirebase'
import { ref } from 'vue'

export interface ProductData {
  id?: string // Firebase 會自動生成 ID，可選屬性
  name: string // 商品名稱
  description: string // 商品描述
  category:string // 商品類別
  price: number // 價格
  unit: string // 單位
  isFavorite: boolean // 是否為最愛
  rating:number // 評分
  vendorId: string // 關聯的廠商 ID
  img: string // 商品圖片
}

export const useProducts = () => {
  const firebase = useFirebase()

  const products = ref<Array<ProductData>>([]) // 用於存儲商品列表
  const productsByVendor = ref<{
    [vendorId: string]: Array<ProductData>
  }>({}) // 用於存儲商品列表byVendor

  const isLoading = ref<boolean>(false)
  const error = ref<unknown>(null)

  const getProductByIds = async (productIds: Array<string>) => {
    isLoading.value = true
    error.value = null
    try {
      const productData = await Promise.all(
        productIds.map(async (id) => {
          const productRef = await firebase.ref(firebase.database, `products/${id}`)
          const snapshot = await firebase.get(productRef)
          return snapshot.val() || null
        })
      )
      products.value = productData.filter((product) => product !== null) as Array<ProductData>
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  const getProductByVendor = async (vendorIds: Array<string>) => {
    isLoading.value = true
    error.value = null
    try {
      const productRef = await firebase.ref(firebase.database, `products`)
      const snapshot = await firebase.get(productRef)
      const products = snapshot.val() || {}
      productsByVendor.value = vendorIds
        .map((id) => {
          return {
            id,
            products: Object.values(
              products.filter((product: ProductData) => product.vendorId === id)
            )
          }
        })
        .reduce((obj, val) => {
          return { ...obj, [val.id]: val.products }
        }, {})
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  return { products, isLoading, getProductByIds, productsByVendor, getProductByVendor }
}
