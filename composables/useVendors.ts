import { useFirebase } from './useFirebase'
import { ref } from 'vue'

export interface VendorData {
  id: string // Firebase 會自動生成 ID，可選屬性
  name: string // 廠商名稱
  contact: string // 廠商聯絡方式
  img: string // 廠商圖片網址
  isFavorite: boolean // 是否為最愛
  products:Array<string>
  googleSheetId: string // Google Sheet ID (對應訂單同步)
}

export const useVendors = () => {
  const firebase = useFirebase()
  const vendors = ref<Array<VendorData>>([]) // 用於存儲商品列表

  const isLoading = ref<boolean>(false)
  const error = ref<unknown>(null)

  // 取得所有廠商
  const getVendors = async () => {
    isLoading.value = true
    error.value = null
    try {
      const vendorsRef = firebase.ref(firebase.database, 'vendors')
      const snapshot = await firebase.get(vendorsRef)
      vendors.value = snapshot.val()
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  // 新增/更新廠商
  const saveVendor = async (vendorId: string, vendorData: VendorData) => {
    isLoading.value = true
    error.value = null
    try {
      const vendorRef = firebase.ref(firebase.database, `vendors/${vendorId}`)
      await firebase.set(vendorRef, vendorData)
      await getVendors()
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }
  return { vendors, isLoading, error, saveVendor, getVendors }
}
