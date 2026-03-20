
import React, { useEffect, useState } from 'react';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { RefreshCw, Trash2 } from 'lucide-react';
import styles from './Leads.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const statusOptions = ['new','contacted','qualified','proposal','negotiation','closed-won','closed-lost']

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const isPrivileged = ['admin', 'superadmin'].includes(user?.role);;

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
      const res = await api.get('/buildings');

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

  useEffect(() => { loadLeads() }, [])

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
          <button className="btn btn--secondary" onClick={loadLeads}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

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