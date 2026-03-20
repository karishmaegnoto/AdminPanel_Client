
import React, { useEffect, useState } from 'react';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { RefreshCw, Trash2, Plus } from 'lucide-react';
import styles from './Leads.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    buildingType: '',
    status: 'new',
    userInfo: { firstName: '', lastName: '', email: '', phoneNumber: '' }
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const isPrivileged = ['admin', 'superadmin'].includes(user?.role?.toLowerCase());

  const getPermissions = (lead) => {
    if (isPrivileged) return ['read', 'edit', 'delete'];
    if (!user?._id) return [];
    const assigned = lead.assignedUsers?.find((u) => {
      const userId =
        typeof u.user === 'object'
          ? u.user?._id
          : u.user;
      return userId === user._id;
    });
    return assigned?.permissions || [];
  };

  const loadLeads = async () => {
    setLoading(true)
    try {
      const endpoint = isPrivileged ? '/buildings' : '/users/buildings';
      const res = await api.get(endpoint);

      if (res.data?.success) {
        let data = res.data.data || [];
        setLeads(data);
        setFiltered(data);
      } else {
        setLeads([]);
        setFiltered([]);
      }
    }
    catch (err) {
      console.error('Load leads error:', err);
      setLeads([]);
      setFiltered([]);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadLeads();
  }, [user])

  useEffect(() => {
    if (!statusFilter) setFiltered(leads)
    else setFiltered(leads.filter(l => l.status === statusFilter))
  }, [statusFilter, leads])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/buildings/${id}`);
      await loadLeads();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        alert('You do not have delete permission');
      } else {
        alert(err?.response?.data?.message || 'Delete failed');
      }
    }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/buildings/${id}/status`, { status }); await loadLeads() }
    catch (err) { console.error(err); alert(err?.response?.data?.message || 'Status update failed') }
  }

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/users/buildings', form);
      setShowModal(false);
      setForm({
        buildingType: '',
        status: 'new',
        userInfo: { firstName: '', lastName: '', email: '', phoneNumber: '' }
      });
      loadLeads();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Lead creation failed');
    } finally {
      setBusy(false);
    }
  };

  const canCreate = isPrivileged || user?.canCreateLead;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Leads Management</h1>
          <p>Manage your leads and track their progress</p>
        </div>
        <div className={styles.headerActions}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={styles.filterSelect}>
            <option value="">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {canCreate && (
            <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
              <Plus size={18} /> New Lead
            </button>
          )}
          <button className={styles.btnSecondary} onClick={loadLeads}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Lead">
        <form onSubmit={handleCreateLead} className={styles.modalForm}>
          <div className="form-group">
            <label>Building Type</label>
            <input
              value={form.buildingType}
              onChange={e => setForm({ ...form, buildingType: e.target.value })}
              required
              placeholder="e.g. Garage, Carport, Warehouse"
            />
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Client First Name</label>
              <input
                value={form.userInfo.firstName}
                onChange={e => setForm({ ...form, userInfo: { ...form.userInfo, firstName: e.target.value } })}
                required
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Client Last Name</label>
              <input
                value={form.userInfo.lastName}
                onChange={e => setForm({ ...form, userInfo: { ...form.userInfo, lastName: e.target.value } })}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Client Email</label>
            <input
              value={form.userInfo.email}
              onChange={e => setForm({ ...form, userInfo: { ...form.userInfo, email: e.target.value } })}
              type="email"
              required
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label>Client Phone</label>
            <input
              value={form.userInfo.phoneNumber}
              onChange={e => setForm({ ...form, userInfo: { ...form.userInfo, phoneNumber: e.target.value } })}
              required
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.btnPrimary} type="submit" disabled={busy} style={{ flex: 1 }}>
              {busy ? 'Processing...' : 'Create Lead'}
            </button>
            <button className={styles.btnSecondary} type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Status</th>
                <th>Priority</th><th>Est. Value</th><th>Actual Value</th>
                <th>Assigned</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className={styles.empty}>No leads found</td></tr>
              ) : filtered.map(lead => {
                const perms = getPermissions(lead);

                return (
                  <tr
                    key={lead._id}
                    onClick={() => {
                      if (perms.includes('read')) {
                        navigate(`/leads/${lead._id}`);
                      }
                    }}
                    className={styles.clickableRow}
                  >
                    <td className={styles.nameCell}>
                      {lead.userInfo.firstName} {lead.userInfo.lastName}
                    </td>
                    <td>{lead.userInfo.email}</td>

                    <td>
                      <select
                        value={lead.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(lead._id, e.target.value)}
                        className={styles.statusSelect}
                        disabled={!perms.includes('edit')}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    <td>{lead.priority || '—'}</td>
                    <td>{lead.estimatedValue || '—'}</td>
                    <td>{lead.actualValue || '—'}</td>
                    <td>{lead.assignedUsers?.length || 0}</td>
                    <td>
                      {perms.includes('delete') && (
                        <button
                          className={styles.deleteBtn}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!perms.includes('delete')) {
                              alert('No delete permission');
                              return;
                            }
                            await handleDelete(lead._id);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}