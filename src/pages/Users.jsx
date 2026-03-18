// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import Modal from '../components/Modal';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { Plus, Search, RefreshCw, Edit2, Trash2, User as UserIcon, Mail } from 'lucide-react';
// import AssignLeadsModal from '../components/AssignLeadsModal';
// import styles from './Users.module.scss';

// export default function Users() {
//   const [list, setList] = useState([])
//   const [filtered, setFiltered] = useState([])
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     department: '',
//     phone: '',
//     canCreateSubUsers: false
//   })
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [assignModal, setAssignModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const openAssignModal = (user) => {
//     setSelectedUser(user)
//     setAssignModal(true)
//   }

//   // ================= LOAD USERS =================
//   const load = async () => {
//     setLoading(true)
//     try {
//       const r = await api.get('/admin/users')

//       const users = r?.data?.data || []   
//       setList(users)
//       setFiltered(users)

//     } catch (err) {
//       console.error('Load users error:', err)
//       setList([])
//       setFiltered([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   // ================= SEARCH =================
//   useEffect(() => {
//     const q = search.toLowerCase()

//     const filteredData = list.filter(i =>
//       `${i.firstName || ''} ${i.lastName || ''} ${i.email || ''}`
//         .toLowerCase()
//         .includes(q)
//     )

//     setFiltered(filteredData)
//   }, [search, list])

//   // ================= SUBMIT =================
//   const submit = async (e) => {
//     e.preventDefault()
//     setBusy(true)

//     try {
//       if (editing) {
//         await api.put('/admin/users/' + editing._id, form)
//       } else {
//         await api.post('/admin/users', form)
//       }

//       setForm({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         department: '',
//         phone: '',
//         canCreateSubUsers: false
//       })
//       setEditing(null)
//       setShowModal(false)

//       await load()
//     } catch (err) {
//       console.error('Save user error:', err)
//       alert(err?.response?.data?.message || 'Something went wrong')
//     } finally {
//       setBusy(false)
//     }
//   }

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return

//     try {
//       await api.delete('/admin/users/' + id)
//       await load()
//     } catch (err) {
//       console.error('Delete error:', err)
//       alert(err?.response?.data?.message || 'Delete failed')
//     }
//   }

//   return (
//     <div className={styles.page}>
//       {/* ================= HEADER ================= */}
//       <div className={styles.header}>
//         <div>
//           <h1>User Management</h1>
//           <p>Manage your team members and estimators.</p>
//         </div>

//         <div className={styles.headerActions}>
//           <button
//             className="btn btn--primary"
//             onClick={() => {
//               setShowModal(true)
//               setEditing(null)
//               setForm({
//                 firstName: '',
//                 lastName: '',
//                 email: '',
//                 password: '',
//                 department: '',
//                 phone: '',
//                 canCreateSubUsers: false
//               })
//             }}
//           >
//             <Plus size={18} /> Add User
//           </button>

//           <button className="btn btn--secondary" onClick={load}>
//             <RefreshCw size={18} />
//           </button>
//         </div>
//       </div>

//       {/* ================= SEARCH ================= */}
//       <div className={styles.searchCard}>
//         <Search size={20} />
//         <input
//           placeholder="Search users by name or email..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />
//       </div>

//       {/* ================= MODAL ================= */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title={editing ? 'Edit User' : 'New User Account'}
//       >
//         <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//           <input
//             placeholder="First Name"
//             value={form.firstName}
//             onChange={e => setForm({ ...form, firstName: e.target.value })}
//             required
//           />

//           <input
//             placeholder="Last Name"
//             value={form.lastName}
//             onChange={e => setForm({ ...form, lastName: e.target.value })}
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={e => setForm({ ...form, email: e.target.value })}
//             required
//           />

//           <input
//             type="password"
//             placeholder={editing ? 'New Password (Optional)' : 'Password'}
//             value={form.password}
//             onChange={e => setForm({ ...form, password: e.target.value })}
//             required={!editing}
//           />

//           <input
//             placeholder="Department"
//             value={form.department}
//             onChange={e => setForm({ ...form, department: e.target.value })}
//           />

//           <input
//             placeholder="Phone"
//             value={form.phone}
//             onChange={e => setForm({ ...form, phone: e.target.value })}
//           />

//           <label>
//             <input
//               type="checkbox"
//               checked={form.canCreateSubUsers}
//               onChange={e => setForm({ ...form, canCreateSubUsers: e.target.checked })}
//             />
//             Can create sub-users
//           </label>

//           <div style={{ display: 'flex', gap: 12 }}>
//             <button className="btn btn--primary" type="submit" disabled={busy}>
//               {busy ? 'Saving...' : editing ? 'Save Changes' : 'Create User'}
//             </button>

//             <button
//               className="btn btn--secondary"
//               type="button"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {/* ================= LIST ================= */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <div className={styles.grid}>
//           {filtered.length === 0 ? (
//             <div className={styles.emptyState}>No users found.</div>
//           ) : (
//             filtered.map(u => (
//               <div className={styles.userCard} key={u._id}>
//                 <div className={styles.userInfo}>
//                   <div className={styles.avatar}>
//                     <UserIcon size={24} />
//                   </div>

//                   <div className={styles.details}>
//                     <div className={styles.name}>
//                       {u.firstName} {u.lastName}
//                     </div>

//                     <div className={styles.email}>
//                       <Mail size={14} /> {u.email}
//                     </div>

//                     {/*USER STATS */}
//                     {u.statistics && (
//                       <div className={styles.stats}>
//                         Leads: {u.statistics.leadCount || 0} | Won: {u.statistics.wonLeads || 0}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className={styles.actions}>
//                   <button
//                     className={styles.actionBtn}
//                     onClick={() => {
//                       setEditing(u)
//                       setForm({
//                         firstName: u.firstName || '',
//                         lastName: u.lastName || '',
//                         email: u.email || '',
//                         password: '',
//                         department: u.department || '',
//                         phone: u.phone || '',
//                         canCreateSubUsers: u.canCreateSubUsers || false
//                       })
//                       setShowModal(true)
//                     }}
//                   >
//                     <Edit2 size={16} /> Edit
//                   </button>

//                   <button
//                     className={`${styles.actionBtn} ${styles.danger}`}
//                     onClick={() => handleDelete(u._id)}
//                   >
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react'
import api from '../api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  User as UserIcon,
  Mail
} from 'lucide-react'
import AssignLeadsModal from '../components/AssignLeadsModal'
import styles from './Users.module.scss'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  department: '',
  phone: '',
  canCreateSubUsers: false
}

export default function Users() {
  const [list, setList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [form, setForm] = useState(initialForm)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const [search, setSearch] = useState('')

  const [assignModal, setAssignModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // ================= LOAD USERS =================
  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users')

      if (res.data?.success) {
        const users = res.data.data || []
        setList(users)
        setFiltered(users)
      } else {
        setList([])
        setFiltered([])
      }
    } catch (err) {
      console.error('Load users error:', err)
      setList([])
      setFiltered([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // ================= SEARCH =================
  useEffect(() => {
    const q = search.toLowerCase()

    const data = list.filter(u =>
      `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`
        .toLowerCase()
        .includes(q)
    )

    setFiltered(data)
  }, [search, list])

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)

    try {
      let payload = { ...form }

      // ❗ IMPORTANT: backend does NOT allow password update
      if (editing && !payload.password) {
        delete payload.password
      }

      if (editing) {
        await api.put(`/admin/users/${editing._id}`, payload)
      } else {
        await api.post('/admin/users', payload)
      }

      // Reset
      setForm(initialForm)
      setEditing(null)
      setShowModal(false)

      await load()
    } catch (err) {
      console.error('Save error:', err)
      alert(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return

    try {
      await api.delete(`/admin/users/${id}`)
      await load()
    } catch (err) {
      console.error('Delete error:', err)
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  // ================= OPEN EDIT =================
  const openEdit = (u) => {
    setEditing(u);
    setForm({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email || '',
      password: '',
      department: u.department || '',
      phone: u.phone || '',
      canCreateSubUsers: u.canCreateSubUsers || false
    })

    setShowModal(true)
  }

  // ================= OPEN ASSIGN =================
  const openAssignModal = (user) => {
    setSelectedUser(user)
    setAssignModal(true)
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage your team members</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className="btn btn--primary"
            onClick={() => {
              setForm(initialForm)
              setEditing(null)
              setShowModal(true)
            }}
          >
            <Plus size={18} /> Add User
          </button>

          <button className="btn btn--secondary" onClick={load}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchCard}>
        <Search size={20} />
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={submit} className={styles.form}>
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            required
          />

          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder={editing ? 'Password (optional)' : 'Password'}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required={!editing}
          />

          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <label>
            <input
              type="checkbox"
              checked={form.canCreateSubUsers}
              onChange={(e) =>
                setForm({
                  ...form,
                  canCreateSubUsers: e.target.checked
                })
              }
            />
            Can create sub-users
          </label>

          <div className={styles.modalActions}>
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* LIST */}
     {loading ? (
  <LoadingSpinner />
) : (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Leads</th>
          <th>Won</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan="6" className={styles.empty}>
              No users found
            </td>
          </tr>
        ) : (
          filtered.map((u) => (
            <tr key={u._id}>
              <td>
                {u.firstName} {u.lastName}
              </td>

              <td>{u.email}</td>

              <td>{u.department || '—'}</td>

              <td>{u.statistics?.leadCount || 0}</td>

              <td>{u.statistics?.wonLeads || 0}</td>

              <td className={styles.actions}>
                <button onClick={() => openEdit(u)}>
                  <Edit2 size={16} />
                </button>

                <button
                  className={styles.danger}
                  onClick={() => handleDelete(u._id)}
                >
                  <Trash2 size={16} />
                </button>

                <button onClick={() => openAssignModal(u)}>
                  Assign
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}

      {/* ASSIGN MODAL */}
      {assignModal && selectedUser && (
        <AssignLeadsModal
          user={selectedUser}
          onClose={() => setAssignModal(false)}
        />
      )}
    </div>
  )
}