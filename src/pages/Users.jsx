import React, { useEffect, useState } from 'react'
import api from '../api'
import Modal from '../components/Modal'
import { Plus, Search, RefreshCw, Edit2, Trash2, User as UserIcon, Mail } from 'lucide-react'

import styles from './Users.module.scss'

export default function Users() {
  const [list, setList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/users')
      setList(r.data)
      setFiltered(r.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(list.filter(i => 
      (i.email + i.firstName + i.lastName).toLowerCase().includes(q)
    ))
  }, [search, list])

  const submit = async e => {
    e && e.preventDefault()
    setBusy(true)
    try {
      if (editing) {
        await api.put('/admin/users/' + editing._id, form)
      } else {
        await api.post('/admin/users', form)
      }
      setForm({ firstName: '', lastName: '', email: '', password: '' })
      setEditing(null)
      setShowModal(false)
      load()
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage your team members and estimators.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn--primary" onClick={() => { setShowModal(true); setEditing(null); setForm({ firstName: '', lastName: '', email: '', password: '' }) }}>
            <Plus size={18} /> Add User
          </button>
          <button className="btn btn--secondary" onClick={load}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className={styles.searchCard}>
        <Search size={20} />
        <input 
          placeholder="Search users by name or email..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit User' : 'New User Account'}>
        <form onSubmit={submit} className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>First Name</label>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Enter last name" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" required placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>{editing ? 'New Password (Optional)' : 'Password'}</label>
            <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" required={!editing} placeholder="••••••••" />
          </div>
          <div className="form-actions" style={{ display: 'flex', gap: 12, marginTop: 12, borderTop: 'none', paddingTop: 0 }}>
            <button className="btn btn--primary" type="submit" disabled={busy} style={{ flex: 1 }}>
              {busy ? 'Saving...' : editing ? 'Save Changes' : 'Create User'}
            </button>
            <button className="btn btn--secondary" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 40 }}>Loading users...</p>
      ) : (
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              No users found.
            </div>
          ) : filtered.map(u => (
            <div className={styles.userCard} key={u._id}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <UserIcon size={24} />
                </div>
                <div className={styles.details}>
                  <div className={styles.name}>{u.firstName} {u.lastName}</div>
                  <div className={styles.email}>
                    <Mail size={14} /> {u.email}
                  </div>
                </div>
              </div>
              
              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => { setEditing(u); setForm({ firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', password: '' }); setShowModal(true) }}>
                  <Edit2 size={16} /> Edit
                </button>
                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={async () => { if (!window.confirm('Are you sure you want to delete this user?')) return; await api.delete('/admin/users/' + u._id); load() }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
