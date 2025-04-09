import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, set, get, child ,push, update, remove } from 'firebase/database'

export const useFirebase = () => {
  const config = useRuntimeConfig() // 取得公開的 runtimeConfig
  const app = initializeApp(config.public)
  const auth = getAuth(app)
  const database = getDatabase(app)
  return { app, auth, database, ref, set, get, push, child, update, remove }
}
