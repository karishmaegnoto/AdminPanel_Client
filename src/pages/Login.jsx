
import React, { useState, useEffect } from 'react'
import api from '../api'
import { Lock, Mail, ShieldAlert, LogIn, Building2 } from 'lucide-react'
import styles from './Login.module.scss'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('superadmin')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  // Ensure theme is applied even on auth pages
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
      }
      const r = await api.post('/auth/login', payload)
      localStorage.setItem('token', r.data.token)
      localStorage.setItem('role', r.data.role)
      window.location.href = '/'
    } catch (e) {
      console.error('Login error', e.response || e)
      const body = e.response?.data
      setErr(body?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <Building2 size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Login to manage your 3D Estimator projects</p>
        </div>

        <form onSubmit={submit} className={styles.form}>
          {err && (
            <div className={styles.errorAlert}>
              <ShieldAlert size={18} />
              {err}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>Select Workspace Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="superadmin">Super Admin </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className={styles.footerText}>
          Enterprise Grade 3D Estimator Tool
        </div>
      </div>
    </div>
  )
}