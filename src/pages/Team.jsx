import React, { useState, useEffect } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import { Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone, Calendar, TrendingUp, Award, UserCheck } from 'lucide-react'
import styles from './Team.module.scss'

export default function Team() {
    const [team, setTeam] = useState([])
    const [filteredTeam, setFilteredTeam] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        department: '',
        phone: '',
        canCreateSubUsers: false,
        canTransferLeads: true,
        canShareLeads: true
    })

    useEffect(() => {
        loadTeam()
    }, [])

    useEffect(() => {
        filterTeam()
    }, [team, searchQuery, statusFilter])

    const loadTeam = async () => {
        try {
            setLoading(true)
            const response = await api.get('/users/team')
            setTeam(response.data.data || [])
        } catch (error) {
            toast.error('Failed to load team members')
            setTeam([])
        } finally {
            setLoading(false)
        }
    }

    const filterTeam = () => {
        let filtered = [...team]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(member =>
                member.firstName?.toLowerCase().includes(query) ||
                member.lastName?.toLowerCase().includes(query) ||
                member.email?.toLowerCase().includes(query) ||
                member.department?.toLowerCase().includes(query)
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(member =>
                statusFilter === 'active' ? member.isActive : !member.isActive
            )
        }

        setFilteredTeam(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            if (editing) {
                const updateData = { ...form }
                if (!updateData.password) delete updateData.password

                await api.put(`/users/team/${editing._id}`, updateData)
                toast.success('Team member updated successfully!')
            } else {
                await api.post('/users/team', form)
                toast.success('Team member created successfully!')
            }

            resetForm()
            await loadTeam()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (member) => {
        setEditing(member)
        setForm({
            firstName: member.firstName || '',
            lastName: member.lastName || '',
            email: member.email || '',
            password: '',
            department: member.department || '',
            phone: member.phone || '',
            canCreateSubUsers: member.canCreateSubUsers || false,
            canTransferLeads: member.canTransferLeads || true,
            canShareLeads: member.canShareLeads || true
        })
        setShowModal(true)
    }

    const handleDelete = async () => {
        if (!deleting) return

        try {
            setLoading(true)
            await api.delete(`/users/team/${deleting._id}`)
            toast.success('Team member deleted successfully!')
            setDeleting(null)
            setShowConfirm(false)
            await loadTeam()
        } catch (error) {
            toast.error('Failed to delete team member')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            department: '',
            phone: '',
            canCreateSubUsers: false,
            canTransferLeads: true,
            canShareLeads: true
        })
        setEditing(null)
        setShowModal(false)
    }

    const getPerformanceColor = (rate) => {
        if (rate >= 80) return styles.success
        if (rate >= 60) return styles.warning
        return styles.danger
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Team Management</h1>
                    <p>Manage your team members and their permissions</p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Team Member
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <Filter size={18} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Members</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{team.length}</h3>
                        <p>Total Members</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <UserCheck size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{team.filter(m => m.isActive).length}</h3>
                        <p>Active</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>85%</h3>
                        <p>Performance</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Award size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>12</h3>
                        <p>Completed</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <p>Loading team members...</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredTeam.length === 0 ? (
                        <div className={styles.emptyState}>No team members found.</div>
                    ) : filteredTeam.map(member => (
                        <div key={member._id} className={styles.teamCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatarSection}>
                                    <img
                                        className={styles.avatar}
                                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=6366f1&color=fff`}
                                        alt={`${member.firstName} ${member.lastName}`}
                                    />
                                    <div className={`${styles.statusBadge} ${member.isActive ? styles.active : styles.inactive}`} />
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className="btn btn--icon btn--ghost"
                                        onClick={() => handleEdit(member)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn--icon btn--ghost btn--danger"
                                        onClick={() => {
                                            setDeleting(member)
                                            setShowConfirm(true)
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.memberInfo}>
                                <h3>{member.firstName} {member.lastName}</h3>
                                <div className={styles.department}>{member.department || 'Lead Estimator'}</div>

                                <div className={styles.contactList}>
                                    <div className={styles.contactItem}>
                                        <Mail size={14} />
                                        <span>{member.email}</span>
                                    </div>
                                    {member.phone && (
                                        <div className={styles.contactItem}>
                                            <Phone size={14} />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                    <div className={styles.contactItem}>
                                        <Calendar size={14} />
                                        <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className={styles.memberStats}>
                                    <div className={styles.stat}>
                                        <span className={styles.value}>{member.leadsAssigned || 0}</span>
                                        <span className={styles.label}>Leads</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.value}>{member.leadsConverted || 0}</span>
                                        <span className={styles.label}>Closed</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={`${styles.value} ${getPerformanceColor(75)}`}>75%</span>
                                        <span className={styles.label}>Rate</span>
                                    </div>
                                </div>

                                <div className={styles.permissions}>
                                    {member.canCreateSubUsers && <span className={`${styles.tag} ${styles.success}`}>Sub-Users</span>}
                                    {member.canTransferLeads && <span className={`${styles.tag} ${styles.info}`}>Transfer</span>}
                                    {member.canShareLeads && <span className={`${styles.tag} ${styles.warning}`}>Share</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={resetForm}
                title={editing ? 'Edit Team Member' : 'Add Team Member'}
                maxWidth="600px"
            >
                <form onSubmit={handleSubmit} className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                                required
                                placeholder="John"
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>{editing ? 'New Password (Optional)' : 'Password *'}</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                            required={!editing}
                            placeholder="••••••••"
                            minLength="6"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={form.department}
                                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                                placeholder="Sales"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 12 }}>Permissions</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={form.canCreateSubUsers}
                                    onChange={(e) => setForm(prev => ({ ...prev, canCreateSubUsers: e.target.checked }))}
                                />
                                <span>Can create sub-users</span>
                            </label>

                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={form.canTransferLeads}
                                    onChange={(e) => setForm(prev => ({ ...prev, canTransferLeads: e.target.checked }))}
                                />
                                <span>Can transfer leads</span>
                            </label>

                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={form.canShareLeads}
                                    onChange={(e) => setForm(prev => ({ ...prev, canShareLeads: e.target.checked }))}
                                />
                                <span>Can share leads</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: 12 }}>
                        <button type="button" className="btn btn--secondary" onClick={resetForm}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Saving...' : (editing ? 'Update Member' : 'Add Member')}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Team Member"
                message={`Are you sure you want to delete ${deleting?.firstName} ${deleting?.lastName}? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </div>
    )
}