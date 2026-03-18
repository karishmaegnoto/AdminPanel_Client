import React, { useEffect, useState } from 'react';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { RefreshCw, Trash2 } from 'lucide-react';
import styles from './Leads.module.scss';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'closed-won',
  'closed-lost'
]

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  // ================= LOAD LEADS =================
  const loadLeads = async () => {
    setLoading(true)
    try {
      const res = await api.get('/buildings')
      if (res.data?.success) {
        setLeads(res.data.data || [])
        setFiltered(res.data.data || [])
      } else {
        setLeads([])
        setFiltered([])
      }
    } catch (err) {
      console.error('Load leads error:', err)
      setLeads([])
      setFiltered([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // ================= FILTER BY STATUS =================
  useEffect(() => {
    if (!statusFilter) {
      setFiltered(leads)
    } else {
      setFiltered(leads.filter(l => l.status === statusFilter))
    }
  }, [statusFilter, leads])

  // ================= DELETE LEAD =================
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return

    try {
      await api.delete(`/buildings/${id}`)
      await loadLeads()
    } catch (err) {
      console.error('Delete lead error:', err)
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/buildings/${id}/status`, { status })
      await loadLeads()
    } catch (err) {
      console.error('Update status error:', err)
      alert(err?.response?.data?.message || 'Status update failed')
    }
  }

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <h1>Leads Management</h1>
        <p>Manage your leads and track their progress</p>

        <div className={styles.headerActions}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button className="btn btn--secondary" onClick={loadLeads}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* ================= LEADS TABLE ================= */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Estimated Value</th>
                <th>Actual Value</th>
                <th>Assigned Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8" className={styles.empty}>
                No leads found
              </td>
            </tr>
          ) : (
            filtered.map(lead => (
              <tr
                key={lead._id}
                onClick={() => navigate(`/leads/${lead._id}`)} // Navigate to LeadDetail
                className={styles.clickableRow} // optional CSS for hover effect
              >
                <td>{lead.userInfo.firstName} {lead.userInfo.lastName}</td>
                <td>{lead.userInfo.email}</td>
                <td>
                  <select
                    value={lead.status}
                    onClick={e => e.stopPropagation()} // prevent row click when changing status
                    onChange={e => updateStatus(lead._id, e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{lead.priority || '—'}</td>
                <td>{lead.estimatedValue || '—'}</td>
                <td>{lead.actualValue || '—'}</td>
                <td>{lead.assignedUsers?.length || 0}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.danger}
                    onClick={e => { e.stopPropagation(); handleDelete(lead._id) }} // prevent row click
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
          </table>
        </div>
      )}
    </div>
  )
}