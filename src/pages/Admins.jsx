// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import Modal from '../components/Modal';
// import { Plus, Search, RefreshCw, Edit2, Trash2, UserCog } from 'lucide-react';
// import styles from './Admins.module.scss';

// export default function Admins() {
//   const [list, setList] = useState([])
//   const [filtered, setFiltered] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     companyName: ''
//   })
//   const [busy, setBusy] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [search, setSearch] = useState('')

//   const resetForm = () => {
//     setForm({
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       companyName: ''
//     })
//   }

//   const load = async () => {
//     setLoading(true)
//     try {
//       const r = await api.get('/superadmin/admins')
//       setList(r.data)
//       setFiltered(r.data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   useEffect(() => {
//     const q = search.toLowerCase()
//     setFiltered(
//       list.filter(item =>
//         (item.email + item.firstName + item.lastName)
//           .toLowerCase()
//           .includes(q)
//       )
//     )
//   }, [search, list])

//   const submit = async (e) => {
//     e.preventDefault()
//     setBusy(true)
//     try {
//       if (editing) {
//         const payload = { ...form }
//         if (!payload.password) {
//           delete payload.password
//         }
//         await api.put('/superadmin/admins/' + editing._id, payload)
//       } else {
//         await api.post('/superadmin/admins', form)
//       }

//       resetForm()
//       setEditing(null)
//       setShowModal(false)
//       load()
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setBusy(false)
//     }
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.header}>
//         <div>
//           <h1>Admin Management</h1>
//           <p>Manage your customer admin accounts and their access.</p>
//         </div>
//         <div className={styles.headerActions}>
//           <button
//             className="btn btn--primary"
//             style={{ color:"white" }}
//             onClick={() => {
//               resetForm()
//               setEditing(null)
//               setShowModal(true)
//             }}
//           >
//             <Plus size={18} /> Create Admin
//           </button>
//           <button
//             className="btn btn--secondary"
//             onClick={load}
//           >
//             <RefreshCw size={18} />
//           </button>
//         </div>
//       </div>

//       <div className={styles.searchCard}>
//         <Search size={20} />
//         <input
//           placeholder="Search admins by email or name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <Modal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title={editing ? 'Edit Admin Account' : 'New Admin Account'}
//       >
//         <form onSubmit={submit} className={styles.modalForm}>
//           <div className="form-group">
//             <label>First Name</label>
//             <input
//               value={form.firstName}
//               onChange={(e) =>
//                 setForm({ ...form, firstName: e.target.value })
//               }
//               required
//               placeholder="Enter first name"
//             />
//           </div>

//           <div className="form-group">
//             <label>Last Name</label>
//             <input
//               value={form.lastName}
//               onChange={(e) =>
//                 setForm({ ...form, lastName: e.target.value })
//               }
//               placeholder="Enter last name"
//             />
//           </div>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) =>
//                 setForm({ ...form, email: e.target.value })
//               }
//               required
//               placeholder="admin@example.com"
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               {editing ? 'New Password (Optional)' : 'Password'}
//             </label>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//               required={!editing}
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="form-group">
//             <label>Company Name</label>
//             <input
//               value={form.companyName}
//               onChange={(e) =>
//                 setForm({ ...form, companyName: e.target.value })
//               }
//               required
//               placeholder="Enter company name"
//             />
//           </div>

//           <div className={styles.modalActions}>
//             <button
//               className="btn btn--primary"
//               type="submit"
//               disabled={busy}
//               style={{ flex: 1 ,color:"white"}}
//             >
//               {busy
//                 ? 'Saving...'
//                 : editing
//                 ? 'Save Changes'
//                 : 'Create Account'}
//             </button>

//             <button
//               className="btn btn--secondary"
//               type="button"
//               onClick={() => setShowModal(false)}
//               style={{ color:"white"}}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>


//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Admin Details</th>
//               <th>Status</th>
//               <th style={{ textAlign: 'right' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>

//             {loading ? (
//               <tr>
//                 <td colSpan="3" style={{ textAlign: 'center', padding: 40 }}>
//                   Loading admin accounts...
//                 </td>
//               </tr>
//             ) : filtered.length === 0 ? (
//               <tr>
//                 <td colSpan="3" style={{ textAlign: 'center', padding: 40 }}>
//                   No admins found matching your search.
//                 </td>
//               </tr>
//             ) : (

//               filtered.map(a => (
//                 <tr key={a._id}>
//                   <td>
//                     <div className={styles.adminInfo}>
//                       <div className={styles.avatar}>
//                         <UserCog size={20} />
//                       </div>
//                       <div className={styles.details}>
//                         <div className={styles.name}>
//                           {a.firstName} {a.lastName}
//                         </div>
//                         <div className={styles.email}>
//                           {a.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   <td>
//                     <span className={styles.statusActive}>
//                       Active
//                     </span>
//                   </td>

//                   <td>
//                     <div className={styles.actions}>
//                       <button
//                         className={styles.iconBtn}
//                         onClick={() => {
//                           setEditing(a)
//                           setForm({
//                             firstName: a.firstName || '',
//                             lastName: a.lastName || '',
//                             email: a.email || '',
//                             password: '',
//                             companyName: a.companyName || ''
//                           })
//                           setShowModal(true)
//                         }}
//                       >
//                         <Edit2 size={16} />
//                       </button>

//                       <button
//                         className={`${styles.iconBtn} ${styles.danger}`}
//                         onClick={async () => {
//                           if (!window.confirm('Are you sure you want to delete this admin account?'))
//                             return
//                           await api.delete('/superadmin/admins/' + a._id)
//                           load()
//                         }}
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Plus, Search, RefreshCw, Edit2, Trash2, UserCog } from 'lucide-react';
import styles from './Admins.module.scss';

export default function Admins() {
  const [list, setList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: ''
  })
  const [busy, setBusy] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', password: '', companyName: '' })
  }

  const load = async () => {
    setLoading(true)
    try {
      const r = await api.get('/superadmin/admins')
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
    setFiltered(list.filter(item =>
      (item.email + item.firstName + item.lastName).toLowerCase().includes(q)
    ))
  }, [search, list])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (editing) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await api.put('/superadmin/admins/' + editing._id, payload)
      } else {
        await api.post('/superadmin/admins', form)
      }
      resetForm()
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
          <h1>Admin Management</h1>
          <p>Manage your customer admin accounts and their access.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn--primary" onClick={() => { resetForm(); setEditing(null); setShowModal(true) }}>
            <Plus size={18} /> Create Admin
          </button>
          <button className="btn btn--secondary" onClick={load}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className={styles.searchCard}>
        <Search size={20} />
        <input
          placeholder="Search admins by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Admin Account' : 'New Admin Account'}
      >
        <form onSubmit={submit} className={styles.modalForm}>
          <div className="form-group">
            <label>First Name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Enter last name" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="admin@example.com" />
          </div>
          <div className="form-group">
            <label>{editing ? 'New Password (Optional)' : 'Password'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required placeholder="Enter company name" />
          </div>
          <div className={styles.modalActions}>
            <button className="btn btn--primary" type="submit" disabled={busy} style={{ flex: 1 }}>
              {busy ? 'Saving...' : editing ? 'Save Changes' : 'Create Account'}
            </button>
            <button className="btn btn--secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin Details</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className={styles.emptyCell}>Loading admin accounts...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="3" className={styles.emptyCell}>No admins found matching your search.</td></tr>
            ) : (
              filtered.map(a => (
                <tr key={a._id}>
                  <td>
                    <div className={styles.adminInfo}>
                      <div className={styles.avatar}><UserCog size={18} /></div>
                      <div className={styles.details}>
                        <div className={styles.name}>{a.firstName} {a.lastName}</div>
                        <div className={styles.email}>{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.statusActive}>Active</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => { setEditing(a); setForm({ firstName: a.firstName || '', lastName: a.lastName || '', email: a.email || '', password: '', companyName: a.companyName || '' }); setShowModal(true) }}>
                        <Edit2 size={15} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={async () => { if (!window.confirm('Are you sure you want to delete this admin account?')) return; await api.delete('/superadmin/admins/' + a._id); load() }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}