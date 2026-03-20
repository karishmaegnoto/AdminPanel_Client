
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Search, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import styles from './Users.module.scss';
import AssignLeadsToUserModal from '../Modals/AssignLeadToUserModal';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  department: '',
  phone: '',
  canCreateSubUsers: false
};

export default function Users() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.success) {
        const users = res.data.data || [];
        const mapped = users.map(u => ({
          ...u,
          statistics: {
            leadCount: u.statistics?.leadCount || 0,
            wonLeads: u.statistics?.wonLeads || 0
          }
        }));
        setList(mapped);
        setFiltered(mapped);
      } else {
        setList([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error('Load users error:', err);
      setList([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const data = list.filter(u =>
      `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase().includes(q)
    );
    setFiltered(data);
  }, [search, list]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      let payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) {
        await api.put(`/admin/users/${editing._id}`, payload);
      } else {
        await api.post('/admin/users', payload);
      }
      setForm(initialForm);
      setEditing(null);
      setShowModal(false);
      await load();
    } catch (err) {
      console.error('Save error:', err);
      alert(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      await load();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

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
    });
    setShowModal(true);
  };

  const openAssignModal = (user) => {
    setSelectedUser(user);
    setAssignModal(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage your team members</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.btnPrimary}
            onClick={() => { setForm(initialForm); setEditing(null); setShowModal(true); }}
          >
            <Plus size={18} /> Add User
          </button>
          <button className={styles.btnSecondary} onClick={load}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className={styles.searchCard}>
        <Search size={20} />
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={submit} className={styles.modalForm}>
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={editing ? 'Password (optional)' : 'Password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editing}
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={busy}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {busy ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

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
                  <td colSpan="6" className={styles.empty}>No users found</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id}>
                    <td className={styles.nameCell}>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.department || '—'}</td>
                    <td>{u.statistics?.leadCount || 0}</td>
                    <td>{u.statistics?.wonLeads || 0}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => openEdit(u)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.dangerBtn}`}
                          onClick={() => handleDelete(u._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          className={styles.assignBtn}
                          onClick={() => openAssignModal(u)}
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {assignModal && selectedUser && (
        <AssignLeadsToUserModal
          user={selectedUser}
          onClose={() => setAssignModal(false)}
          refresh={load}
        />
      )}
    </div>
  );
}