// import React, { useState, useEffect } from 'react'
// import { useAuth } from '../context/AuthContext'
// import api from '../api'
// import Charts from '../components/Charts'
// import {
//     TrendingUp,
//     Users,
//     Building2,
//     DollarSign,
//     Calendar,
//     Download,
//     Filter,
//     BarChart3,
//     PieChart,
//     LineChart
// } from 'lucide-react'

// import styles from './Reports.module.scss'

// export default function Reports() {
//     const { user } = useAuth()
//     const [loading, setLoading] = useState(true)
//     const [dateRange, setDateRange] = useState('last_30_days')
//     const [reportType, setReportType] = useState('overview')
//     const [stats, setStats] = useState({
//         totalLeads: 0,
//         convertedLeads: 0,
//         revenue: 0,
//         activeUsers: 0
//     })

//     useEffect(() => {
//         loadReports()
//     }, [dateRange, reportType])

//     const loadReports = async () => {
//         try {
//             setLoading(true)
//             const response = await api.get(`/reports?range=${dateRange}&type=${reportType}`)
//             if (response.data.stats) {
//                 setStats(response.data.stats)
//             }
//         } catch (error) {
//             console.error('Failed to load reports:', error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const exportReport = async (format) => {
//         try {
//             const response = await api.get(`/reports/export?format=${format}&range=${dateRange}`, {
//                 responseType: 'blob'
//             })

//             const url = window.URL.createObjectURL(new Blob([response.data]))
//             const link = document.createElement('a')
//             link.href = url
//             link.download = `report_${dateRange}.${format}`
//             link.click()
//             toast.success(`Report exported as ${format.toUpperCase()}`)
//         } catch (error) {
//             console.error('Export failed:', error)
//             toast.error('Failed to export report')
//         }
//     }

//     return (
//         <div className={styles.page}>
//             <div className={styles.header}>
//                 <div className={styles.headerContent}>
//                     <h1>Reports & Analytics</h1>
//                     <p>Comprehensive insights into your 3D estimation business</p>
//                 </div>

//                 <div className={styles.actions}>
//                     <select
//                         value={dateRange}
//                         onChange={(e) => setDateRange(e.target.value)}
//                         style={{ width: 'auto' }}
//                     >
//                         <option value="last_7_days">Last 7 Days</option>
//                         <option value="last_30_days">Last 30 Days</option>
//                         <option value="last_3_months">Last 3 Months</option>
//                         <option value="last_year">Last Year</option>
//                     </select>

//                     <button
//                         className="btn btn--secondary"
//                         onClick={() => exportReport('pdf')}
//                     >
//                         <Download size={18} />
//                         Export PDF
//                     </button>
//                 </div>
//             </div>

//             <div className={styles.statsGrid}>
//                 <div className={styles.statCard}>
//                     <div className={`${styles.icon} ${styles.primary}`}>
//                         <Building2 size={24} />
//                     </div>
//                     <div className={styles.statContent}>
//                         <p>Total Leads</p>
//                         <h3>{stats.totalLeads}</h3>
//                         <span className={`${styles.change} ${styles.positive}`}>+12% vs last period</span>
//                     </div>
//                 </div>

//                 <div className={styles.statCard}>
//                     <div className={`${styles.icon} ${styles.success}`}>
//                         <TrendingUp size={24} />
//                     </div>
//                     <div className={styles.statContent}>
//                         <p>Converted Leads</p>
//                         <h3>{stats.convertedLeads}</h3>
//                         <span className={`${styles.change} ${styles.positive}`}>+8% vs last period</span>
//                     </div>
//                 </div>

//                 <div className={styles.statCard}>
//                     <div className={`${styles.icon} ${styles.warning}`}>
//                         <DollarSign size={24} />
//                     </div>
//                     <div className={styles.statContent}>
//                         <p>Revenue</p>
//                         <h3>${stats.revenue?.toLocaleString()}</h3>
//                         <span className={`${styles.change} ${styles.positive}`}>+15% vs last period</span>
//                     </div>
//                 </div>

//                 <div className={styles.statCard}>
//                     <div className={`${styles.icon} ${styles.info}`}>
//                         <Users size={24} />
//                     </div>
//                     <div className={styles.statContent}>
//                         <p>Active Users</p>
//                         <h3>{stats.activeUsers}</h3>
//                         <span className={`${styles.change} ${styles.neutral}`}>No change</span>
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.reportsGrid}>
//                 <div className={styles.reportSection}>
//                     <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Growth Overview</h3>
//                          <div style={{ display: 'flex', gap: 10 }}>
//                             <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
//                          </div>
//                     </div>
//                     <Charts />
//                 </div>

//                 <div className={`${styles.reportSection} ${styles.metricsCard}`}>
//                     <div className={styles.cardHeader}>
//                         <h3>Performance Metrics</h3>
//                         <select
//                             value={reportType}
//                             onChange={(e) => setReportType(e.target.value)}
//                             style={{ width: 'auto', padding: '6px 12px' }}
//                         >
//                             <option value="overview">Overview</option>
//                             <option value="leads">Leads</option>
//                             <option value="users">Users</option>
//                             <option value="revenue">Revenue</option>
//                         </select>
//                     </div>

//                     <div className={styles.metricList}>
//                         <div className={styles.metricItem}>
//                             <span className={styles.label}>Conversion Rate</span>
//                             <div style={{ textAlign: 'right' }}>
//                                 <div className={styles.value}>68%</div>
//                                 <span className={`${styles.change} ${styles.positive}`}>+5%</span>
//                             </div>
//                         </div>

//                         <div className={styles.metricItem}>
//                             <span className={styles.label}>Avg. Deal Size</span>
//                             <div style={{ textAlign: 'right' }}>
//                                 <div className={styles.value}>$2,450</div>
//                                 <span className={`${styles.change} ${styles.positive}`}>+12%</span>
//                             </div>
//                         </div>

//                         <div className={styles.metricItem}>
//                             <span className={styles.label}>Response Time</span>
//                             <div style={{ textAlign: 'right' }}>
//                                 <div className={styles.value}>2.4h</div>
//                                 <span className={`${styles.change} ${styles.negative}`}>+0.3h</span>
//                             </div>
//                         </div>

//                         <div className={styles.metricItem}>
//                             <span className={styles.label}>Client Satisfaction</span>
//                             <div style={{ textAlign: 'right' }}>
//                                 <div className={styles.value}>4.8/5</div>
//                                 <span className={`${styles.change} ${styles.positive}`}>+0.2</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Charts from '../components/Charts';
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Download,
  BarChart3,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import styles from './Reports.module.scss';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('overview');
  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    revenue: 0,
    activeUsers: 0
  });
  const [metrics, setMetrics] = useState({
    conversionRate: { value: '68%', change: '+5%', trend: 'positive' },
    avgDealSize: { value: '$2,450', change: '+12%', trend: 'positive' },
    responseTime: { value: '2.4h', change: '+0.3h', trend: 'negative' },
    satisfaction: { value: '4.8/5', change: '+0.2', trend: 'positive' }
  });

  useEffect(() => {
    loadReports();
  }, [dateRange, reportType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports?range=${dateRange}&type=${reportType}`);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
      if (response.data.metrics) {
        setMetrics(response.data.metrics);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const exportReport = async (format) => {
    try {
      const response = await api.get(
        `/reports/export?format=${format}&range=${dateRange}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${dateRange}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'positive') return <ArrowUpRight size={14} />;
    if (trend === 'negative') return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      change: '+12%',
      trend: 'positive',
      icon: <Building2 size={24} />,
      variant: 'primary'
    },
    {
      label: 'Converted Leads',
      value: stats.convertedLeads,
      change: '+8%',
      trend: 'positive',
      icon: <TrendingUp size={24} />,
      variant: 'success'
    },
    {
      label: 'Revenue',
      value: `$${(stats.revenue || 0).toLocaleString()}`,
      change: '+15%',
      trend: 'positive',
      icon: <DollarSign size={24} />,
      variant: 'warning'
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      change: 'No change',
      trend: 'neutral',
      icon: <Users size={24} />,
      variant: 'info'
    }
  ];

  const metricItems = [
    { label: 'Conversion Rate', ...metrics.conversionRate },
    { label: 'Avg. Deal Size', ...metrics.avgDealSize },
    { label: 'Response Time', ...metrics.responseTime },
    { label: 'Client Satisfaction', ...metrics.satisfaction }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights into your 3D estimation business</p>
        </div>

        <div className={styles.actions}>
          <select
            className={styles.select}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="last_year">Last Year</option>
          </select>

          <button
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw size={18} className={refreshing ? styles.spinning : ''} />
          </button>

          <button
            className={styles.exportBtn}
            onClick={() => exportReport('pdf')}
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <div className={`${styles.icon} ${styles[card.variant]}`}>
              {card.icon}
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{card.label}</p>
              <h3 className={styles.statValue}>{card.value}</h3>
              <span className={`${styles.change} ${styles[card.trend]}`}>
                {getTrendIcon(card.trend)}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.reportsGrid}>
        <div className={styles.reportSection}>
          <div className={styles.sectionHeader}>
            <h3>Growth Overview</h3>
            <BarChart3 size={20} className={styles.sectionIcon} />
          </div>
          <Charts />
        </div>

        <div className={`${styles.reportSection} ${styles.metricsCard}`}>
          <div className={styles.cardHeader}>
            <h3>Performance Metrics</h3>
            <select
              className={styles.miniSelect}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="leads">Leads</option>
              <option value="users">Users</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>

          <div className={styles.metricList}>
            {metricItems.map((metric, i) => (
              <div key={i} className={styles.metricItem}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <div className={styles.metricRight}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <span className={`${styles.change} ${styles[metric.trend]}`}>
                    {getTrendIcon(metric.trend)}
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}