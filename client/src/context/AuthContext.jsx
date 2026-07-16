import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { authApi } from '../api/auth.api'

// ── State ─────────────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  loading: true,   // true while bootstrapping session
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        error: null,
      }
    case 'LOGOUT':
      return { ...initialState, loading: false, accessToken: null }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Bootstrap: load current user from token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }
    authApi
      .getMe()
      .then(({ data }) => dispatch({ type: 'SET_USER', payload: data.data }))
      .catch(() => {
        localStorage.removeItem('accessToken')
        dispatch({ type: 'LOGOUT' })
      })
  }, [])

  // Listen for forced logout (e.g. from axios interceptor)
  useEffect(() => {
    const handler = () => {
      localStorage.removeItem('accessToken')
      dispatch({ type: 'LOGOUT' })
    }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('accessToken', data.accessToken)
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload)
    localStorage.setItem('accessToken', data.accessToken)
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch (_) { /* ignore */ }
    localStorage.removeItem('accessToken')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const updateUser = useCallback((updatedUser) => {
    dispatch({ type: 'SET_USER', payload: updatedUser })
  }, [])

  const hasRole = useCallback(
    (role) => state.user?.roles?.includes(role) ?? false,
    [state.user]
  )

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.accessToken,
        loading: state.loading,
        error: state.error,
        isAuthenticated: !!state.user,
        isBuyer: state.user?.roles?.includes('buyer') ?? false,
        isSeller: state.user?.roles?.includes('seller') ?? false,
        isAdmin: state.user?.roles?.includes('admin') ?? false,
        hasRole,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
