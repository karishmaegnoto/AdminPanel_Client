import React, { useState } from 'react'
import api from '../api'
import { UserPlus, Mail, Lock, Building2, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.scss';

export default function Register() {
    const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    role: 'admin' 
    })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
            <UserPlus size={32} />
          </div>
          <h1>Create Admin Account</h1>
          <p>Sign up for 3D Estimator Admin access</p>
        </div>

        <form onSubmit={submit} className={styles.form}>
          {error && (
            <div className={`${styles.errorAlert} form-group`}>
              <UserPlus size={18} style={{ color: '#ef4444' }} />
              {error}
            </div>
          )}

         <div className={styles.row}>
            <div className="form-group">
                <label className={styles.inputLabel}>
                <User size={14} /> First Name
                </label>
                <input 
                type="text"
                value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
                required
                placeholder="John"
                />
            </div>

            <div className="form-group">
                <label className={styles.inputLabel}>
                <User size={14} /> Last Name
                </label>
                <input 
                type="text"
                value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
                required
                placeholder="Doe"
                />
            </div>
            </div>

          <div className="form-group">
            <label className={styles.inputLabel}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required 
              placeholder="admin@company.com"
            />
          </div>

          <div className="form-group">
            <label className={styles.inputLabel}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required 
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className={styles.inputLabel}>
              <Building2 size={14} /> Company Name
            </label>
            <input 
              type="text" 
              value={form.companyName}
              onChange={e => setForm({...form, companyName: e.target.value})}
              required 
              placeholder="ABC Construction"
            />
          </div>

        <div className="form-group">
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
         </select>
        </div>
        
          <button 
            className="btn btn--primary" 
            type="submit" 
            disabled={loading}
            style={{ height: 50, fontSize: 17, marginTop: 12,color:"white" }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footerText}>
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  )
}
