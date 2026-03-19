
import React, { useState, useEffect } from 'react'
import api from '../api'
import { UserPlus, Mail, Lock, Building2, User } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Login.module.scss'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    role: 'admin',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
    setError(null)
    setLoading(true)

    try {
      await api.post('/auth/register', form)
      alert('Account created successfully! Please login.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <UserPlus size={28} />
          </div>
          <h1>Create Admin Account</h1>
          <p>Sign up for 3D Estimator Admin access</p>
        </div>

        <form onSubmit={submit} className={styles.form}>
          {error && (
            <div className={styles.errorAlert}>
              <UserPlus size={18} />
              {error}
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.inputLabel}>
                <User size={14} /> First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                placeholder="John"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.inputLabel}>
                <User size={14} /> Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="admin@company.com"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>
              <Building2 size={14} /> Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
              placeholder="ABC Construction"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.inputLabel}>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <div className={styles.divider} />
        <div className={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}