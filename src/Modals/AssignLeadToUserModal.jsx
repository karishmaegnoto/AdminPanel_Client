// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import Modal from '../components/Modal';

// const PERMISSIONS = ['read', 'edit'];

// export default function AssignLeadsToUserModal({ user, onClose, refresh }) {
//   const [leads, setLeads] = useState([]);
//   const [selected, setSelected] = useState([]);

//   // ================= LOAD LEADS =================
//   useEffect(() => {
//     const loadLeads = async () => {
//       try {
//         const res = await api.get('/buildings');
//         const data = res.data?.data || [];
//         setLeads(data);

//         // Pre-fill already assigned
//         const preSelected = [];

//         data.forEach((lead) => {
//           const assigned = lead.assignedUsers?.find(
//             (u) => u.user === user._id || u.user?._id === user._id
//           );

//           if (assigned) {
//             preSelected.push({
//               leadId: lead._id,
//               name: `${lead.userInfo.firstName} ${lead.userInfo.lastName}`,
//               permissions: assigned.permissions || ['read']
//             });
//           }
//         });

//         setSelected(preSelected);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadLeads();
//   }, [user]);

//   // ================= TOGGLE LEAD =================
//   const toggleLead = (lead) => {
//     const exists = selected.find(l => l.leadId === lead._id);

//     if (exists) {
//       setSelected(selected.filter(l => l.leadId !== lead._id));
//     } else {
//       setSelected([
//         ...selected,
//         {
//           leadId: lead._id,
//           name: `${lead.userInfo.firstName} ${lead.userInfo.lastName}`,
//           permissions: ['read']
//         }
//       ]);
//     }
//   };

//   // ================= TOGGLE PERMISSION =================
//   const togglePermission = (leadId, perm) => {
//     setSelected(selected.map(l => {
//       if (l.leadId !== leadId) return l;

//       const has = l.permissions.includes(perm);
//       const updated = has
//         ? l.permissions.filter(p => p !== perm)
//         : [...l.permissions, perm];

//       return {
//         ...l,
//         permissions: updated.length ? updated : ['read']
//       };
//     }));
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     if (!selected.length) return alert('Select at least one lead');

//     try {
//       const payload = {
//         leads: selected.map(l => ({
//           leadId: l.leadId,
//           permissions: l.permissions
//         }))
//       };

//       await api.post(`/users/${user._id}/assign-leads`, payload);

//       alert('Leads assigned successfully');
//       refresh();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || 'Assignment failed');
//     }
//   };

//   return (
//     <Modal isOpen={true} onClose={onClose} title={`Assign Leads to ${user.firstName}`}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//         {leads.map((lead) => {
//           const assigned = selected.find(l => l.leadId === lead._id);

//           return (
//             <div key={lead._id} style={{ border: '1px solid #ddd', padding: 10 }}>
//               <div>
//                 <input
//                   type="checkbox"
//                   checked={!!assigned}
//                   onChange={() => toggleLead(lead)}
//                 />
//                 {lead.userInfo.firstName} {lead.userInfo.lastName}
//               </div>

//               {assigned && (
//                 <div style={{ marginLeft: 20 }}>
//                   {PERMISSIONS.map(p => (
//                     <label key={p} style={{ marginRight: 10 }}>
//                       <input
//                         type="checkbox"
//                         checked={assigned.permissions.includes(p)}
//                         onChange={() => togglePermission(lead._id, p)}
//                       />
//                       {p}
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
//           <button onClick={handleSubmit}>Save</button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </Modal>
//   );
// }
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import styles from '../Modals/AssignUserModal.module.scss';

const PERMISSIONS = ['read', 'edit'];

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
    setSelected(selected.map(l => {
      if (l.leadId !== leadId) return l;
      const has = l.permissions.includes(perm);
      const updated = has ? l.permissions.filter(p => p !== perm) : [...l.permissions, perm];
      return { ...l, permissions: updated.length ? updated : ['read'] };
    }));
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
                    <label key={p}>
                      <input type="checkbox" checked={assigned.permissions.includes(p)} onChange={() => togglePermission(lead._id, p)} />
                      {p}
                    </label>
                  ))}
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