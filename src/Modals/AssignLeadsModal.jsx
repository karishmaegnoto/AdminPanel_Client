// // import React, { useState, useEffect } from 'react';
// // import api from '../api';
// // import Modal from './Modal';

// // export default function AssignLeadsModal({ lead, onClose, refresh }) {
// //   const [users, setUsers] = useState([]);
// //   const [assigned, setAssigned] = useState([]);

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const res = await api.getUsers();
// //         setUsers(res.data.data || []);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };
// //     fetchUsers();

// //     setAssigned(lead.assignedUsers.map(u => ({
// //       userId: u.user._id,
// //       permission: u.permission
// //     })));
// //   }, [lead]);

// //   const toggleAssign = (userId) => {
// //     if (assigned.find(a => a.userId === userId)) {
// //       setAssigned(assigned.filter(a => a.userId !== userId));
// //     } else {
// //       setAssigned([...assigned, { userId, permission: 'read' }]);
// //     }
// //   };

// //   const changePermission = (userId, permission) => {
// //     setAssigned(
// //       assigned.map(a => a.userId === userId ? { ...a, permission } : a)
// //     );
// //   };

// //   const submit = async () => {
// //     try {
// //       await api.assignUsers(lead._id, assigned);
// //       refresh();
// //       onClose();
// //     } catch (err) {
// //       console.error(err);
// //       alert(err?.response?.data?.message || 'Assign failed');
// //     }
// //   };

// //   return (
// //     <Modal isOpen={true} onClose={onClose} title={`Assign Users for ${lead.userInfo.firstName}`}>
// //       <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
// //         {users.map(u => {
// //           const a = assigned.find(as => as.userId === u._id);
// //           return (
// //             <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //               <input
// //                 type="checkbox"
// //                 checked={!!a}
// //                 onChange={() => toggleAssign(u._id)}
// //               />
// //               <span>{u.firstName} {u.lastName}</span>
// //               {a && (
// //                 <select
// //                   value={a.permission}
// //                   onChange={(e) => changePermission(u._id, e.target.value)}
// //                 >
// //                   <option value="read">Read</option>
// //                   <option value="edit">Edit</option>
// //                 </select>
// //               )}
// //             </div>
// //           )
// //         })}

// //         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
// //           <button onClick={submit}>Save</button>
// //           <button onClick={onClose}>Cancel</button>
// //         </div>
// //       </div>
// //     </Modal>
// //   )
// // }
// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import Modal from './Modal';

// const PERMISSIONS = ['read', 'edit'];

// export default function AssignLeadsModal({ lead, onClose, refresh }) {
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ================= LOAD USERS + EXISTING ASSIGNMENTS =================
//   useEffect(() => {
//     if (!lead?._id) return;

//     const init = async () => {
//       try {
//         setLoading(true);

//         // Fetch all users
//         const usersRes = await api.get('/admin/users');
//         const allUsers = usersRes.data?.data || [];
//         setUsers(allUsers);

//         // Fetch latest lead data (important)
//         const leadRes = await api.get(`/buildings/${lead._id}`);
//         const assigned = leadRes.data?.data?.assignedUsers || [];

//         // Normalize assigned users
//         const formatted = assigned.map((u) => ({
//           userId: u.user._id,
//           name: `${u.user.firstName} ${u.user.lastName}`,
//           permissions: Array.isArray(u.permissions) ? u.permissions : ['read']
//         }));

//         setAssignedUsers(formatted);
//       } catch (err) {
//         console.error('Init assign modal error:', err);
//         alert('Failed to load assignment data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [lead]);

//   // ================= TOGGLE USER =================
//   const toggleUser = (user) => {
//     const exists = assignedUsers.find((u) => u.userId === user._id);

//     if (exists) {
//       // Remove user
//       setAssignedUsers((prev) =>
//         prev.filter((u) => u.userId !== user._id)
//       );
//     } else {
//       // Add user with default permission
//       setAssignedUsers((prev) => [
//         ...prev,
//         {
//           userId: user._id,
//           name: `${user.firstName} ${user.lastName}`,
//           permissions: ['read']
//         }
//       ]);
//     }
//   };

//   // ================= TOGGLE PERMISSION =================
//   const togglePermission = (userId, permission) => {
//     setAssignedUsers((prev) =>
//       prev.map((u) => {
//         if (u.userId !== userId) return u;

//         const hasPermission = u.permissions.includes(permission);

//         const updatedPermissions = hasPermission
//           ? u.permissions.filter((p) => p !== permission)
//           : [...u.permissions, permission];

//         return {
//           ...u,
//           permissions: updatedPermissions.length ? updatedPermissions : ['read']
//         };
//       })
//     );
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async () => {
//     if (!assignedUsers.length) {
//       return alert('Please assign at least one user');
//     }

//     for (let u of assignedUsers) {
//       if (!u.permissions.length) {
//         return alert(`Select permission for ${u.name}`);
//       }
//     }

//     try {
//       const payload = {
//         users: assignedUsers.map((u) => ({
//           userId: u.userId,
//           permissions: u.permissions
//         }))
//       };

//       console.log('FINAL PAYLOAD:', payload);

//       await api.post(`/buildings/${lead._id}/assign`, payload);

//       alert('Users assigned successfully');
//       refresh && refresh();
//       onClose();
//     } catch (err) {
//       console.error('Assign error:', err.response?.data || err);
//       alert(err.response?.data?.message || 'Assignment failed');
//     }
//   };

//   // ================= UI =================
//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title={`Assign Users to Lead (${lead?.userInfo?.firstName || ''})`}
//     >
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {users.map((user) => {
//             const assigned = assignedUsers.find(
//               (u) => u.userId === user._id
//             );

//             return (
//               <div
//                 key={user._id}
//                 style={{
//                   border: '1px solid #ddd',
//                   padding: 10,
//                   borderRadius: 6
//                 }}
//               >
//                 {/* USER ROW */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <input
//                     type="checkbox"
//                     checked={!!assigned}
//                     onChange={() => toggleUser(user)}
//                   />

//                   <span>
//                     {user.firstName} {user.lastName}
//                   </span>
//                 </div>

//                 {/* PERMISSIONS */}
//                 {assigned && (
//                   <div style={{ marginTop: 8, paddingLeft: 20 }}>
//                     {PERMISSIONS.map((perm) => (
//                       <label key={perm} style={{ marginRight: 12 }}>
//                         <input
//                           type="checkbox"
//                           checked={assigned.permissions.includes(perm)}
//                           onChange={() =>
//                             togglePermission(user._id, perm)
//                           }
//                         />{' '}
//                         {perm}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* ACTIONS */}
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'flex-end',
//               gap: 10,
//               marginTop: 15
//             }}
//           >
//             <button onClick={handleSubmit}>Save</button>
//             <button onClick={onClose}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </Modal>
//   );
// }
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { UserCheck, Shield, Eye, Edit3, Loader2 } from 'lucide-react';
import styles from './AssignLeadsModal.module.scss';

const PERMISSIONS = [
  { key: 'read', label: 'Read', icon: <Eye size={14} /> },
  { key: 'edit', label: 'Edit', icon: <Edit3 size={14} /> }
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
    setAssignedUsers((prev) =>
      prev.map((u) => {
        if (u.userId !== userId) return u;

        const hasPermission = u.permissions.includes(permission);
        const updatedPermissions = hasPermission
          ? u.permissions.filter((p) => p !== permission)
          : [...u.permissions, permission];

        return {
          ...u,
          permissions: updatedPermissions.length ? updatedPermissions : ['read']
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
                          <label key={perm.key} className={styles.permLabel}>
                            <input
                              type="checkbox"
                              checked={assigned.permissions.includes(perm.key)}
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