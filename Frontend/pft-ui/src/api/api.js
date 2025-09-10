import axios from 'axios'


// baseURL required by you
export const baseURL = 'http://localhost:1000'


const api = axios.create({ baseURL })


// unauthenticated endpoints (I assumed the second route is /auth/register — change if needed)
const UNAUTH_PATHS = ['/auth/*']


api.interceptors.request.use((config) => {
  const url = config.url || ''
  const isUnauth = UNAUTH_PATHS.some((p) => url.includes(p))
  if (!isUnauth) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => Promise.reject(error))


export default api