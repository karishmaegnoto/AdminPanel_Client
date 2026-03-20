
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import styles from '../Modals/AssignUserModal.module.scss';
import { Trash2 } from 'lucide-react';

const PERMISSIONS = ['read', 'edit','delete'];

export default function AssignLeadsToUserModal({ user, onClose, refresh }) {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await api.get('/buildings');
        const data = res.data?.data || [];
        setLeads(data);
        const preSelected = [];
        data.forEach((lead) => {
          const assigned = lead.assignedUsers?.find((u) => u.user === user._id || u.user?._id === user._id);
          if (assigned) { preSelected.push({ leadId: lead._id, name: `${lead.userInfo.firstName} ${lead.userInfo.lastName}`, permissions: assigned.permissions || ['read'] }); }
        });
        setSelected(preSelected);
      } catch (err) { console.error(err); }
    };
    loadLeads();
  }, [user]);

  const toggleLead = (lead) => {
    const exists = selected.find(l => l.leadId === lead._id);
    if (exists) { setSelected(selected.filter(l => l.leadId !== lead._id)); }
    else { setSelected([...selected, { leadId: lead._id, name: `${lead.userInfo.firstName} ${lead.userInfo.lastName}`, permissions: ['read'] }]); }
  };

  const togglePermission = (leadId, perm) => {
    if (perm === 'read') return; 

    setSelected(selected.map(l => {
      if (l.leadId !== leadId) return l;

      const has = l.permissions.includes(perm);

      let updated = has
        ? l.permissions.filter(p => p !== perm)
        : [...l.permissions, perm];

      if (!updated.includes('read')) {
        updated.push('read');
      }

      return { ...l, permissions: updated };
    }));
  };

  const removeLead = (leadId) => {
    setSelected(prev => prev.filter(l => l.leadId !== leadId));
  };

  const handleSubmit = async () => {
    if (!selected.length) return alert('Select at least one lead');
    try {
      const payload = { leads: selected.map(l => ({ leadId: l.leadId, permissions: l.permissions })) };
      await api.post(`/users/${user._id}/assign-leads`, payload);
      alert('Leads assigned successfully'); refresh(); onClose();
    } catch (err) { console.error(err); alert(err?.response?.data?.message || 'Assignment failed'); }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Assign Leads to ${user.firstName}`}>
      <div className={styles.container}>
        {leads.map((lead) => {
          const assigned = selected.find(l => l.leadId === lead._id);
          return (
            <div key={lead._id} className={styles.userCard}>
              <div className={styles.userHeader}>
                <input type="checkbox" checked={!!assigned} onChange={() => toggleLead(lead)} />
                <span>{lead.userInfo.firstName} {lead.userInfo.lastName}</span>
              </div>
              {assigned && (
                <div className={styles.permissions}>
                  {PERMISSIONS.map(p => (
                    <label key={p} className={p === 'read' ? styles.disabled : ''}>
                      <input
                        type="checkbox"
                        checked={assigned.permissions.includes(p)}
                        disabled={p === 'read'} 
                        onChange={() => togglePermission(lead._id, p)}
                      />
                      {p}
                    </label>
                  ))}

                 {/* <button
                  className={styles.deleteBtn}
                  onClick={() => removeLead(lead._id)}
                  title="Remove lead"
                >
                  <Trash2 size={16} />
                </button> */}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.btnRow}>
        <button className={styles.submitBtn} onClick={handleSubmit}>Save</button>
        <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}