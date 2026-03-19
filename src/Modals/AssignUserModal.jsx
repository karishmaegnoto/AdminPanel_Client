// import React, { useEffect, useState } from 'react';
// import Modal from '../components/Modal';
// import api from '../api';
// import styles from '../Modals/AssignUserModal.module.scss';

// export default function AssignUsersModal({ isOpen, onClose, leadId, onSuccess }) {
//   const [allUsers, setAllUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const permissionOptions = ['read', 'edit'];

//   useEffect(() => {
//     if (isOpen) {
//       loadUsers();
//       loadLeadAssignments();
//     }
//   }, [isOpen]);

//   const loadUsers = async () => {
//     try {
//       const res = await api.get('/admin/users');
//       setAllUsers(res.data?.data || []);
//     } catch (err) {
//       console.error('Error loading users:', err);
//     }
//   };

//   const loadLeadAssignments = async () => {
//     try {
//       const res = await api.get(`/buildings/${leadId}`);
//       const assigned = res.data?.data?.assignedUsers || [];

//       const formatted = assigned.map(a => ({
//         userId: a.user._id,
//         firstName: a.user.firstName,
//         lastName: a.user.lastName,
//         permissions: a.permissions || [],
//         isExisting: true
//       }));

//       console.log('MODAL ASSIGNED USERS:', formatted);
//       setAssignedUsers(formatted);
//     } catch (err) {
//       console.error('Error loading lead assignments:', err);
//     }
//   };

//   const availableUsers = allUsers
//     .filter(u => !assignedUsers.some(a => a.userId === u._id))
//     .map(u => ({
//       userId: u._id,
//       firstName: u.firstName,
//       lastName: u.lastName,
//       permissions: [],
//       isExisting: false
//     }));

//   const handleUserToggle = (userId) => {
//     const exists = assignedUsers.find(u => u.userId === userId);
//     if (exists) {
//       setAssignedUsers(assignedUsers.filter(u => u.userId !== userId));
//     } else {
//       const newUser = availableUsers.find(u => u.userId === userId);
//       setAssignedUsers([...assignedUsers, newUser]);
//     }
//   };

//   const handlePermissionToggle = (userId, permission) => {
//     setAssignedUsers(assignedUsers.map(u => {
//       if (u.userId !== userId) return u;
//       const perms = u.permissions.includes(permission)
//         ? u.permissions.filter(p => p !== permission)
//         : [...u.permissions, permission];
//       return { ...u, permissions: perms };
//     }));
//   };

//   const handleAssign = async () => {
//     if (assignedUsers.length === 0) return alert('Select at least one user');
//     for (let u of assignedUsers) {
//       if (!u.permissions.length) return alert(`Select at least one permission for ${u.firstName}`);
//     }

//     try {
//       const payload = {
//         users: assignedUsers.map(u => ({
//           userId: u.userId,
//           permissions: u.permissions
//         }))
//       };

//       console.log('SENDING PAYLOAD:', payload);
//       await api.post(`/buildings/${leadId}/assign`, payload);

//       alert('Users assigned successfully');
//       onClose();
//       onSuccess();
//     } catch (err) {
//       console.error('Assign error:', err.response?.data || err);
//       alert(err.response?.data?.message || 'Assign failed');
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Assign Users">
//       <div className={styles.container}>
//         {[...assignedUsers, ...availableUsers].map(u => (
//           <div key={u.userId} className={styles.userCard}>
//             <div className={styles.userHeader}>
//               <input
//                 type="checkbox"
//                 checked={assignedUsers.some(a => a.userId === u.userId)}
//                 onChange={() => handleUserToggle(u.userId)}
//               />
//               {u.firstName} {u.lastName} {u.isExisting && '(already assigned)'}
//             </div>
//             {assignedUsers.some(a => a.userId === u.userId) && (
//               <div className={styles.permissions}>
//                 {permissionOptions.map(p => (
//                   <label key={p}>
//                     <input
//                       type="checkbox"
//                       checked={u.permissions.includes(p)}
//                       onChange={() => handlePermissionToggle(u.userId, p)}
//                     />{' '}
//                     {p.charAt(0).toUpperCase() + p.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <button className={styles.submitBtn} onClick={handleAssign}>
//         Assign / Update Users
//       </button>
//     </Modal>
//   );
// }
import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import api from '../api';
import styles from '../Modals/AssignUserModal.module.scss';

export default function AssignUsersModal({ isOpen, onClose, leadId, onSuccess }) {
  const [allUsers, setAllUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const permissionOptions = ['read', 'edit'];

  useEffect(() => { if (isOpen) { loadUsers(); loadLeadAssignments(); } }, [isOpen]);

  const loadUsers = async () => {
    try { const res = await api.get('/admin/users'); setAllUsers(res.data?.data || []); }
    catch (err) { console.error('Error loading users:', err); }
  };

  const loadLeadAssignments = async () => {
    try {
      const res = await api.get(`/buildings/${leadId}`);
      const assigned = res.data?.data?.assignedUsers || [];
      const formatted = assigned.map(a => ({ userId: a.user._id, firstName: a.user.firstName, lastName: a.user.lastName, permissions: a.permissions || [], isExisting: true }));
      setAssignedUsers(formatted);
    } catch (err) { console.error('Error loading lead assignments:', err); }
  };

  const availableUsers = allUsers.filter(u => !assignedUsers.some(a => a.userId === u._id)).map(u => ({ userId: u._id, firstName: u.firstName, lastName: u.lastName, permissions: [], isExisting: false }));

  const handleUserToggle = (userId) => {
    const exists = assignedUsers.find(u => u.userId === userId);
    if (exists) { setAssignedUsers(assignedUsers.filter(u => u.userId !== userId)); }
    else { const newUser = availableUsers.find(u => u.userId === userId); setAssignedUsers([...assignedUsers, newUser]); }
  };

  const handlePermissionToggle = (userId, permission) => {
    setAssignedUsers(assignedUsers.map(u => {
      if (u.userId !== userId) return u;
      const perms = u.permissions.includes(permission) ? u.permissions.filter(p => p !== permission) : [...u.permissions, permission];
      return { ...u, permissions: perms };
    }));
  };

  const handleAssign = async () => {
    if (assignedUsers.length === 0) return alert('Select at least one user');
    for (let u of assignedUsers) { if (!u.permissions.length) return alert(`Select at least one permission for ${u.firstName}`); }
    try {
      const payload = { users: assignedUsers.map(u => ({ userId: u.userId, permissions: u.permissions })) };
      await api.post(`/buildings/${leadId}/assign`, payload);
      alert('Users assigned successfully'); onClose(); onSuccess();
    } catch (err) { console.error('Assign error:', err.response?.data || err); alert(err.response?.data?.message || 'Assign failed'); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Users">
      <div className={styles.container}>
        {[...assignedUsers, ...availableUsers].map(u => (
          <div key={u.userId} className={styles.userCard}>
            <div className={styles.userHeader}>
              <input type="checkbox" checked={assignedUsers.some(a => a.userId === u.userId)} onChange={() => handleUserToggle(u.userId)} />
              <span>{u.firstName} {u.lastName} {u.isExisting && <small>(assigned)</small>}</span>
            </div>
            {assignedUsers.some(a => a.userId === u.userId) && (
              <div className={styles.permissions}>
                {permissionOptions.map(p => (
                  <label key={p}>
                    <input type="checkbox" checked={u.permissions.includes(p)} onChange={() => handlePermissionToggle(u.userId, p)} />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className={styles.submitBtn} onClick={handleAssign}>Assign / Update Users</button>
    </Modal>
  );
}