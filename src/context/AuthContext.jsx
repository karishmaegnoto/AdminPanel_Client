
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const normalizeRole = (roleFromBackend) => {
    // Treat manager and employee as "user" for frontend purposes
    if (['manager', 'employee'].includes(roleFromBackend)) return 'user'
    return roleFromBackend
  }

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (token && role) {
      try {
        const normalizedRole = normalizeRole(role)
        let endpoint = ''
        switch (normalizedRole) {
          case 'superadmin':
            endpoint = '/superadmin/profile'
            break
          case 'admin':
            endpoint = '/admin/profile'
            break
          case 'user':
            endpoint = '/users/me'
            break
          default:
            throw new Error('Invalid role')
        }

        const response = await api.get(endpoint)
        setUser({ token, role: normalizedRole, ...response.data.data })
        setProfile(response.data.data)
      } catch (error) {
        console.error('Auth check failed:', error)
        logout()
      }
    }
    setLoading(false)
  }

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role })
      const { token } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('role', normalizeRole(role))

      // Fetch user profile after successful login
      await checkAuthStatus()

      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const updateProfile = async (updates) => {
    try {
      let endpoint = ''
      const normalizedRole = normalizeRole(user.role)
      switch (normalizedRole) {
        case 'superadmin':
          endpoint = '/superadmin/profile'
          break
        case 'admin':
          endpoint = '/admin/profile'
          break
        case 'user':
          endpoint = '/users/me'
          break
      }

      const response = await api.put(endpoint, updates)
      setProfile(response.data.data)
      setUser({ ...user, ...response.data.data })
      toast.success('Profile updated successfully!')
      return { success: true, data: response.data.data }
    } catch (error) {
      toast.error('Failed to update profile')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setUser(null)
    setProfile(null)
    toast.success('Logged out successfully!')
    window.location.href = '/login'
  }

  const value = {
    user,
    profile,
    login,
    logout,
    updateProfile,
    loading,
    checkAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}