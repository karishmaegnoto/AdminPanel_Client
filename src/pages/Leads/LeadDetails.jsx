import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AssignUsersModal from '../../Modals/AssignUserModal';
import styles from './LeadDetails.module.scss';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const isPrivileged = ['admin', 'superadmin'].includes(user?.role);

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);

  const getPermissions = () => {
    if (isPrivileged) return ['read', 'edit', 'delete'];

    const assigned = lead?.assignedUsers?.find(
      (u) => u.user === user?._id || u.user?._id === user?._id
    );

    return assigned?.permissions || ['read']; 
  };

  // const permissions = getPermissions();
  const permissions = lead?.currentUserPermissions || [];

  const loadLead = async () => {
    try {
      const res = await api.get(`/buildings/${id}`);
      if (res.data?.success) {
        setLead(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLead(); }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('userInfo.')) {
      const key = name.split('.')[1];
      setLead(prev => ({
        ...prev,
        userInfo: { ...prev.userInfo, [key]: value }
      }));
    } else {
      setLead(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/buildings/${id}`, {
        buildingType: lead.buildingType,
        status: lead.status,
        userInfo: lead.userInfo
      });
      alert('Lead updated successfully');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!lead) return <div style={{ padding: 40, textAlign: 'center' }}>No lead found</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{lead.buildingType}</h2>

          {/* DELETE BUTTON */}
          {permissions.includes('delete') && (
            <button
              className={styles.deleteBtn}
              onClick={async () => {
                if (!window.confirm('Delete this lead?')) return;

                try {
                  await api.delete(`/buildings/${id}`);
                  alert('Deleted successfully');
                  navigate('/leads');
                } catch (err) {
                  console.error(err);
                  alert(err?.response?.data?.message || 'Delete failed');
                }
              }}
            >
              Delete
            </button>
          )}
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.card}>
            <h3>Lead Information</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Building Type</label>
                <input
                  name="buildingType"
                  value={lead.buildingType || ''}
                  onChange={handleChange}
                  disabled={!permissions.includes('edit')}
                />
              </div>

              <div className={styles.field}>
                <label>Status</label>
                <select
                  name="status"
                  value={lead.status || ''}
                  onChange={handleChange}
                  disabled={!permissions.includes('edit')}
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="qualified">qualified</option>
                  <option value="proposal">proposal</option>
                  <option value="negotiation">negotiation</option>
                  <option value="closed-won">closed-won</option>
                  <option value="closed-lost">closed-lost</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Customer Info</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  name="userInfo.firstName"
                  value={lead.userInfo?.firstName || ''}
                  onChange={handleChange}
                  disabled={!permissions.includes('edit')}
                />
              </div>

              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  name="userInfo.lastName"
                  value={lead.userInfo?.lastName || ''}
                  onChange={handleChange}
                  disabled={!permissions.includes('edit')}
                />
              </div>

              <div className={styles.field}>
                <label>Email</label>
                <input
                  name="userInfo.email"
                  value={lead.userInfo?.email || ''}
                  onChange={handleChange}
                  disabled={!permissions.includes('edit')}
                />
              </div>
            </div>
          </div>
          {permissions.includes('edit') && (
            <button
              className={styles.saveBtn}
              onClick={handleUpdate}
              disabled={saving}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {isPrivileged && (
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h3>Assigned Users</h3>

              {lead.assignedUsers?.length > 0 ? (
                lead.assignedUsers.map((u, i) => (
                  <div key={i} className={styles.userRow}>
                    <strong>{u.user?.firstName} {u.user?.lastName}</strong>
                    <span className={styles.permission}>
                      {u.permissions?.join(', ')}
                    </span>
                  </div>
                ))
              ) : (
                <p>No users assigned</p>
              )}

              <button
                className={styles.assignBtn}
                onClick={() => setOpenAssign(true)}
              >
                <UserPlus size={16} /> Assign Users
              </button>
            </div>
          </div>
        )}
      </div>
      {isPrivileged && (
        <AssignUsersModal
          isOpen={openAssign}
          onClose={() => setOpenAssign(false)}
          leadId={id}
          onSuccess={loadLead}
        />
      )}
    </div>
  );
}