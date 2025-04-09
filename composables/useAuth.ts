import { signInWithPopup, OAuthProvider, signOut } from 'firebase/auth'
import { useFirebase } from './useFirebase'
import { ref } from 'vue'

export interface UserData {
  id?: string // Firebase 會自動生成 ID，可選屬性
  name: string // 商品名稱
}

const provider = new OAuthProvider('oidc.line') // 使用 LINE OIDC Provider

export const useAuth = () => {
  const { auth } = useFirebase()

  const user = ref<UserData | null | unknown>(null) // 用於存儲商品列表

  const isLoading = ref<boolean>(false)
  const error = ref<unknown>(null)

  // LINE 登入
  const signInWithLine = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    } catch (e) {
      console.error('LINE 登入失敗', e)
      error.value = e
    }
    isLoading.value = false
  }

  // 登出
  const logout = async () => {
    isLoading.value = true
    error.value = null
    try {
      await signOut(auth)
      user.value = null
    } catch (e) {
      error.value = e
    }
    isLoading.value = false
  }

  return { signInWithLine, logout }
}
