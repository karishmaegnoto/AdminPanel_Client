import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import toast from 'react-hot-toast'
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Globe,
    Palette,
    Database,
    Mail,
    Save
} from 'lucide-react'

import styles from './Settings.module.scss'

export default function Settings() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('notifications')
    const [loading, setLoading] = useState(false)

    const [settings, setSettings] = useState({
        notifications: {
            emailNotifications: true,
            pushNotifications: false,
            weeklyReports: true,
            newLeadAlerts: true
        },
        appearance: {
            theme: 'dark',
            compactMode: false,
            sidebarCollapsed: false
        },
        system: {
            autoBackup: true,
            backupFrequency: 'daily',
            retentionPeriod: '90'
        },
        integration: {
            emailProvider: 'smtp',
            smtpHost: '',
            smtpPort: '587',
            smtpUser: '',
            smtpPassword: ''
        }
    })

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const response = await api.get('/settings')
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }))
            }
        } catch (error) {
            console.error('Failed to load settings:', error)
        }
    }

    const saveSettings = async () => {
        try {
            setLoading(true)
            await api.put('/settings', settings)
            toast.success('Settings saved successfully!')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setLoading(false)
        }
    }

    const updateSetting = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    const tabs = [
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'integrations', label: 'Integrations', icon: <Mail size={18} /> },
        { id: 'system', label: 'System', icon: <Database size={18} /> }
    ]

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Settings</h1>
                    <p>Manage your application preferences and configurations</p>
                </div>

                <button
                    className="btn btn--primary"
                    onClick={saveSettings}
                    disabled={loading}
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className={styles.layout}>
                <nav className={styles.nav}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.content}>
                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <h3>Notification Preferences</h3>
                            <p>Choose how you want to be notified about important events</p>

                            <div className={styles.group}>
                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.emailNotifications}
                                        onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                                    />
                                    <span>Email Notifications</span>
                                </label>

                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.pushNotifications}
                                        onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                                    />
                                    <span>Push Notifications</span>
                                </label>

                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.weeklyReports}
                                        onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                                    />
                                    <span>Weekly Reports</span>
                                </label>

                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.newLeadAlerts}
                                        onChange={(e) => updateSetting('notifications', 'newLeadAlerts', e.target.checked)}
                                    />
                                    <span>New Lead Alerts</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className={styles.section}>
                            <h3>Appearance Settings</h3>
                            <p>Customize the look and feel of your application</p>

                            <div className={styles.group}>
                                <div className="form-group">
                                    <label>Theme</label>
                                    <select
                                        value={settings.appearance.theme}
                                        onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                                    >
                                        <option value="dark">Dark Theme</option>
                                        <option value="light">Light Theme</option>
                                        <option value="system">System Default</option>
                                    </select>
                                </div>

                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.appearance.compactMode}
                                        onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                                    />
                                    <span>Compact Mode</span>
                                </label>

                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.appearance.sidebarCollapsed}
                                        onChange={(e) => updateSetting('appearance', 'sidebarCollapsed', e.target.checked)}
                                    />
                                    <span>Collapsed Sidebar by Default</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className={styles.section}>
                            <h3>Email Integration</h3>
                            <p>Configure email settings for notifications and reports</p>

                            <div className={styles.group}>
                                <div className="form-group">
                                    <label>Email Provider</label>
                                    <select
                                        value={settings.integration.emailProvider}
                                        onChange={(e) => updateSetting('integration', 'emailProvider', e.target.value)}
                                    >
                                        <option value="smtp">SMTP (Recommended)</option>
                                        <option value="sendgrid">SendGrid API</option>
                                        <option value="mailgun">Mailgun API</option>
                                    </select>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className="form-group">
                                        <label>SMTP Host</label>
                                        <input
                                            type="text"
                                            value={settings.integration.smtpHost}
                                            onChange={(e) => updateSetting('integration', 'smtpHost', e.target.value)}
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>SMTP Port</label>
                                        <input
                                            type="text"
                                            value={settings.integration.smtpPort}
                                            onChange={(e) => updateSetting('integration', 'smtpPort', e.target.value)}
                                            placeholder="587"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={settings.integration.smtpUser}
                                            onChange={(e) => updateSetting('integration', 'smtpUser', e.target.value)}
                                            placeholder="username@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            value={settings.integration.smtpPassword}
                                            onChange={(e) => updateSetting('integration', 'smtpPassword', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className={styles.section}>
                            <h3>System Configuration</h3>
                            <p>Manage system-wide settings and maintenance</p>

                            <div className={styles.group}>
                                <label className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        checked={settings.system.autoBackup}
                                        onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                                    />
                                    <span>Automatic Backups</span>
                                </label>

                                <div className="form-group">
                                    <label>Backup Frequency</label>
                                    <select
                                        value={settings.system.backupFrequency}
                                        onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Data Retention (Days)</label>
                                    <input
                                        type="number"
                                        value={settings.system.retentionPeriod}
                                        onChange={(e) => updateSetting('system', 'retentionPeriod', e.target.value)}
                                        placeholder="90"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}