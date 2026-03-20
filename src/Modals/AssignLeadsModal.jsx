
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { UserCheck, Shield, Eye, Edit3, Loader2 ,Trash2 } from 'lucide-react';
import styles from './AssignLeadsModal.module.scss';

const PERMISSIONS = [
  { key: 'read', label: 'Read', icon: <Eye size={14} /> },
  { key: 'edit', label: 'Edit', icon: <Edit3 size={14} /> },
  { key: 'delete', label: 'Delete', icon: <Trash2 size={14} /> }
];

export default function AssignLeadsModal({ lead, onClose, refresh }) {
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lead?._id) return;
    const init = async () => {
      try {
        setLoading(true);
        const usersRes = await api.get('/admin/users');
        const allUsers = usersRes.data?.data || [];
        setUsers(allUsers);
        const leadRes = await api.get(`/buildings/${lead._id}`);
        const assigned = leadRes.data?.data?.assignedUsers || [];
        const formatted = assigned.map((u) => ({
          userId: u.user._id,
          name: `${u.user.firstName} ${u.user.lastName}`,
          permissions: Array.isArray(u.permissions) ? u.permissions : ['read']
        }));
        setAssignedUsers(formatted);
      } catch (err) {
        console.error('Init assign modal error:', err);
        alert('Failed to load assignment data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [lead]);

  const toggleUser = (user) => {
    const exists = assignedUsers.find((u) => u.userId === user._id);
    if (exists) {
      setAssignedUsers((prev) => prev.filter((u) => u.userId !== user._id));
    } else {
      setAssignedUsers((prev) => [
        ...prev,
        {
          userId: user._id,
          name: `${user.firstName} ${user.lastName}`,
          permissions: ['read']
        }
      ]);
    }
  };

  const togglePermission = (userId, permission) => {
    if (permission === 'read') return; 

    setAssignedUsers((prev) =>
      prev.map((u) => {
        if (u.userId !== userId) return u;

        const hasPermission = u.permissions.includes(permission);

        let updatedPermissions = hasPermission
          ? u.permissions.filter((p) => p !== permission)
          : [...u.permissions, permission];

        if (!updatedPermissions.includes('read')) {
          updatedPermissions.push('read');
        }

        return {
          ...u,
          permissions: updatedPermissions
        };
      })
    );
  };

  const handleSubmit = async () => {
    if (!assignedUsers.length) {
      return alert('Please assign at least one user');
    }

    for (let u of assignedUsers) {
      if (!u.permissions.length) {
        return alert(`Select permission for ${u.name}`);
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        users: assignedUsers.map((u) => ({
          userId: u.userId,
          permissions: u.permissions
        }))
      };

      await api.post(`/buildings/${lead._id}/assign`, payload);
      alert('Users assigned successfully');
      refresh && refresh();
      onClose();
    } catch (err) {
      console.error('Assign error:', err.response?.data || err);
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Assign Users — ${lead?.userInfo?.firstName || 'Lead'}`}
      maxWidth="520px"
    >
      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} size={32} />
          <p>Loading users…</p>
        </div>
      ) : (
        <>
          <div className={styles.assignedCount}>
            <UserCheck size={16} />
            <span>{assignedUsers.length} user{assignedUsers.length !== 1 ? 's' : ''} assigned</span>
          </div>

          <div className={styles.container}>
            {users.length === 0 ? (
              <p className={styles.emptyText}>No users available</p>
            ) : (
              users.map((user) => {
                const assigned = assignedUsers.find((u) => u.userId === user._id);

                return (
                  <div
                    key={user._id}
                    className={`${styles.userCard} ${assigned ? styles.selected : ''}`}
                  >
                    <div className={styles.userHeader}>
                      <input
                        type="checkbox"
                        checked={!!assigned}
                        onChange={() => toggleUser(user)}
                      />
                      <span>
                        {user.firstName} {user.lastName}
                        <small>({user.email})</small>
                      </span>
                    </div>

                    {assigned && (
                      <div className={styles.permissions}>
                        {PERMISSIONS.map((perm) => (
                          <label key={perm.key}className={`${styles.permLabel} ${perm.key === 'read' ? styles.disabled : ''}`}>
                            <input
                              type="checkbox"
                              checked={assigned.permissions.includes(perm.key)}
                               disabled={perm.key === 'read'}
                              onChange={() => togglePermission(user._id, perm.key)}
                            />
                            {perm.icon}
                            {perm.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className={styles.btnRow}>
            <button className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className={styles.spinner} size={16} />
                  Saving…
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Save Assignments
                </>
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}