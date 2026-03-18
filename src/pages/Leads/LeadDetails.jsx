import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AssignUsersModal from '../../Modals/AssignUserModal';
import styles from './LeadDetails.module.scss';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);

  const loadLead = async () => {
    try {
      const res = await api.get(`/buildings/${id}`);
      if (res.data?.success) {
        console.log('LEAD ASSIGNED USERS:', res.data.data?.assignedUsers);
        setLead(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, [id]);

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
  if (!lead) return <div>No lead found</div>;

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>{lead.buildingType}</h2>
      </div>

      <div className={styles.layout}>

        {/* LEFT SIDE */}
        <div className={styles.main}>
          {/* BASIC INFO */}
          <div className={styles.card}>
            <h3>Lead Information</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Building Type</label>
                <input
                  name="buildingType"
                  value={lead.buildingType || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Status</label>
                <select
                  name="status"
                  value={lead.status || ''}
                  onChange={handleChange}
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

          {/* CUSTOMER INFO */}
          <div className={styles.card}>
            <h3>Customer Info</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  name="userInfo.firstName"
                  value={lead.userInfo?.firstName || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  name="userInfo.lastName"
                  value={lead.userInfo?.lastName || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  name="userInfo.email"
                  value={lead.userInfo?.email || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            className={styles.saveBtn}
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Assigned Users</h3>
            {lead.assignedUsers?.length > 0 ? (
                lead.assignedUsers.map((u, i) => (
                    <div key={i} className={styles.userRow}>
                    <div>
                        <strong>
                        {u.user?.firstName} {u.user?.lastName}
                        </strong>
                    </div>
                    <span className={styles.permission}>
                        {Array.isArray(u.permissions) ? u.permissions.join(', ') : u.permission}
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
              + Assign Users
            </button>
          </div>
        </div>
      </div>

      <AssignUsersModal
        isOpen={openAssign}
        onClose={() => setOpenAssign(false)}
        leadId={id}
        onSuccess={loadLead} 
      />
    </div>
  );
}