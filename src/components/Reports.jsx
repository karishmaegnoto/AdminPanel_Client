import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import Charts from '../components/Charts'
import {
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    Calendar,
    Download,
    Filter,
    BarChart3,
    PieChart,
    LineChart
} from 'lucide-react'

import styles from './Reports.module.scss'

export default function Reports() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState('last_30_days')
    const [reportType, setReportType] = useState('overview')
    const [stats, setStats] = useState({
        totalLeads: 0,
        convertedLeads: 0,
        revenue: 0,
        activeUsers: 0
    })

    useEffect(() => {
        loadReports()
    }, [dateRange, reportType])

    const loadReports = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/reports?range=${dateRange}&type=${reportType}`)
            if (response.data.stats) {
                setStats(response.data.stats)
            }
        } catch (error) {
            console.error('Failed to load reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportReport = async (format) => {
        try {
            const response = await api.get(`/reports/export?format=${format}&range=${dateRange}`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.download = `report_${dateRange}.${format}`
            link.click()
            toast.success(`Report exported as ${format.toUpperCase()}`)
        } catch (error) {
            console.error('Export failed:', error)
            toast.error('Failed to export report')
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Reports & Analytics</h1>
                    <p>Comprehensive insights into your 3D estimation business</p>
                </div>

                <div className={styles.actions}>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="last_3_months">Last 3 Months</option>
                        <option value="last_year">Last Year</option>
                    </select>

                    <button
                        className="btn btn--secondary"
                        onClick={() => exportReport('pdf')}
                    >
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.primary}`}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p>Total Leads</p>
                        <h3>{stats.totalLeads}</h3>
                        <span className={`${styles.change} ${styles.positive}`}>+12% vs last period</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.success}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p>Converted Leads</p>
                        <h3>{stats.convertedLeads}</h3>
                        <span className={`${styles.change} ${styles.positive}`}>+8% vs last period</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.warning}`}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p>Revenue</p>
                        <h3>${stats.revenue?.toLocaleString()}</h3>
                        <span className={`${styles.change} ${styles.positive}`}>+15% vs last period</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.info}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p>Active Users</p>
                        <h3>{stats.activeUsers}</h3>
                        <span className={`${styles.change} ${styles.neutral}`}>No change</span>
                    </div>
                </div>
            </div>

            <div className={styles.reportsGrid}>
                <div className={styles.reportSection}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Growth Overview</h3>
                         <div style={{ display: 'flex', gap: 10 }}>
                            <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
                         </div>
                    </div>
                    <Charts />
                </div>

                <div className={`${styles.reportSection} ${styles.metricsCard}`}>
                    <div className={styles.cardHeader}>
                        <h3>Performance Metrics</h3>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            style={{ width: 'auto', padding: '6px 12px' }}
                        >
                            <option value="overview">Overview</option>
                            <option value="leads">Leads</option>
                            <option value="users">Users</option>
                            <option value="revenue">Revenue</option>
                        </select>
                    </div>

                    <div className={styles.metricList}>
                        <div className={styles.metricItem}>
                            <span className={styles.label}>Conversion Rate</span>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.value}>68%</div>
                                <span className={`${styles.change} ${styles.positive}`}>+5%</span>
                            </div>
                        </div>

                        <div className={styles.metricItem}>
                            <span className={styles.label}>Avg. Deal Size</span>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.value}>$2,450</div>
                                <span className={`${styles.change} ${styles.positive}`}>+12%</span>
                            </div>
                        </div>

                        <div className={styles.metricItem}>
                            <span className={styles.label}>Response Time</span>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.value}>2.4h</div>
                                <span className={`${styles.change} ${styles.negative}`}>+0.3h</span>
                            </div>
                        </div>

                        <div className={styles.metricItem}>
                            <span className={styles.label}>Client Satisfaction</span>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.value}>4.8/5</div>
                                <span className={`${styles.change} ${styles.positive}`}>+0.2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}