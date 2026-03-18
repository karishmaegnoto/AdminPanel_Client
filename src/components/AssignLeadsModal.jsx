import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from './Modal';

export default function AssignLeadsModal({ lead, onClose, refresh }) {
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getUsers();
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();

    setAssigned(lead.assignedUsers.map(u => ({
      userId: u.user._id,
      permission: u.permission
    })));
  }, [lead]);

  const toggleAssign = (userId) => {
    if (assigned.find(a => a.userId === userId)) {
      setAssigned(assigned.filter(a => a.userId !== userId));
    } else {
      setAssigned([...assigned, { userId, permission: 'read' }]);
    }
  };

  const changePermission = (userId, permission) => {
    setAssigned(
      assigned.map(a => a.userId === userId ? { ...a, permission } : a)
    );
  };

  const submit = async () => {
    try {
      await api.assignUsers(lead._id, assigned);
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Assign failed');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Assign Users for ${lead.userInfo.firstName}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {users.map(u => {
          const a = assigned.find(as => as.userId === u._id);
          return (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!a}
                onChange={() => toggleAssign(u._id)}
              />
              <span>{u.firstName} {u.lastName}</span>
              {a && (
                <select
                  value={a.permission}
                  onChange={(e) => changePermission(u._id, e.target.value)}
                >
                  <option value="read">Read</option>
                  <option value="edit">Edit</option>
                </select>
              )}
            </div>
          )
        })}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={submit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  )
}