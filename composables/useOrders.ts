import { useFirebase } from './useFirebase'
import { ref } from 'vue'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface OrderData {
  id?: string // Firebase 會自動生成 ID，可選屬性
  userId: string // 訂單所屬使用者
  items: Record<string, OrderItem> // 商品清單，使用 productId 作為 Key
  totalPrice: number // 訂單總金額
  status: 'pending' | 'completed' | 'canceled' // 訂單狀態
  createdAt: string // 訂單建立時間（ISO 格式）
  vendorId: string // 關聯的廠商 ID
}

export const useOrders = () => {
  const firebase = useFirebase()
  const orders = ref<Array<OrderData>>([]) // 用於存儲商品列表

  const isLoading = ref<boolean>(false)
  const error = ref(null)

  // 取得所有訂單
  const getOrders = async () => {
    isLoading.value = true
    error.value = null
    try {
      const ordersRef = firebase.ref(firebase.database, 'orders')
      const snapshot = await firebase.get(ordersRef)
      orders.value = snapshot.exists() ? snapshot.val() : []
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 新增訂單
  const createOrder = async (orderData: OrderData) => {
    const ordersRef = firebase.ref(firebase.database, 'orders')
    const newOrderRef = firebase.push(ordersRef)
    await firebase.set(newOrderRef, orderData)
    return newOrderRef.key
  }

  // 更新訂單
  const updateOrder = async (orderId: string, orderData: OrderData) => {
    isLoading.value = true
    error.value = null
    try {
      const orderRef = firebase.ref(firebase.database, `orders/${orderId}`)
      await firebase.update(orderRef, orderData)
      await getOrders()
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 刪除訂單
  const deleteOrder = async (orderId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const orderRef = firebase.ref(firebase.database, `orders/${orderId}`)
      await firebase.remove(orderRef)
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  return { getOrders, createOrder, updateOrder, deleteOrder }
}
