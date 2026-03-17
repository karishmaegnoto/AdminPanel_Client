import React, { useState } from 'react'
import api from '../api'
import { Lock, Mail, ShieldAlert, LogIn, Building2 } from 'lucide-react'

import styles from './Login.module.scss'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('superadmin')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const payload = { email: email.trim().toLowerCase(), password: password.trim(), role }
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
            <Building2 size={32} />
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

          <div className="form-group">
            <label className={styles.inputLabel}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label className={styles.inputLabel}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className={styles.inputLabel}>Select Workspace Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="superadmin">Super Admin (System Oversight)</option>
              <option value="admin">Customer Admin (User Management)</option>
              <option value="user">Project User (Lead Management)</option>
            </select>
          </div>

          <button className="btn btn--primary" type="submit" disabled={loading} style={{ height: 50, fontSize: 17, marginTop: 12, color:"white" }}>
            {loading ? 'Authenticating...' : (
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
