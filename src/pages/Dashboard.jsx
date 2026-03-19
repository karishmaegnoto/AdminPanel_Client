// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import Charts from '../components/Charts';
// import { useAuth } from '../context/AuthContext';
// import {Users,UserCog,Building2,TrendingUp,Clock,CheckCircle2,AlertCircle} from 'lucide-react';
// import styles from './Dashboard.module.scss';

// export default function Dashboard() {
//   const { user } = useAuth()
//   const role = user?.role
//   const [stats, setStats] = useState({ primary: 0, secondary: 0, tertiary: 0 })
//   const [recent, setRecent] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         if (role === 'superadmin') {
//           const res = await api.get('/superadmin/admins')
//           setStats({ primary: res.data.length, label1: 'Total Admins', icon1: <UserCog size={24} /> })
//         } else if (role === 'admin') {
//           const resUsers = await api.get('/admin/users')
//           setStats({ primary: resUsers.data.length, label1: 'Active Users', icon1: <Users size={24} /> })
//         } else if (role === 'user') {
//           const resBuildings = await api.get('/users/buildings')
//           const resUsers = await api.get('/users')
//           const counts = resBuildings.data.reduce((acc, b) => {
//             acc[b.status] = (acc[b.status] || 0) + 1
//             return acc
//           }, {})
//           setStats({
//             primary: resUsers.data.length,
//             label1: 'Team Members',
//             icon1: <Users size={24} />,
//             secondary: resBuildings.data.length,
//             label2: 'Total Leads',
//             icon2: <Building2 size={24} />,
//             tertiary: counts['closed'] || 0,
//             label3: 'Closed'
//           })
//           setRecent(resBuildings.data.slice(0, 5))
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard data', err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [role])

//   return (
//     <div className={styles.dashboard}>
//       <div className={styles.header}>
//         <h1>Welcome back, {role}!</h1>
//         <p>Here's what's happening with your 3D Estimator projects today.</p>
//       </div>

//       <div className={styles.grid}>
//         <div className={styles.statCard}>
//           <div className={styles.statHeader}>
//             <span className={styles.statLabel}>{stats.label1 || 'Overview'}</span>
//             <div className={styles.statIconWrapper}>{stats.icon1}</div>
//           </div>
//           <div className={styles.statValue}>{stats.primary}</div>
//           <div className={`${styles.statTrend} ${styles.positive}`}>
//             <TrendingUp size={16} /> <span>+12% from last month</span>
//           </div>
//         </div>

//         {role === 'user' && (
//           <>
//             <div className={styles.statCard}>
//               <div className={styles.statHeader}>
//                 <span className={styles.statLabel}>{stats.label2}</span>
//                 <div className={styles.statIconWrapper}><Building2 size={24} /></div>
//               </div>
//               <div className={styles.statValue}>{stats.secondary}</div>
//               <div className={`${styles.statTrend} ${styles.neutral}`}>
//                 <Clock size={16} /> <span>Waiting contact</span>
//               </div>
//             </div>
//             <div className={styles.statCard}>
//               <div className={styles.statHeader}>
//                 <span className={styles.statLabel}>{stats.label3}</span>
//                 <div className={styles.statIconWrapper}><CheckCircle2 size={24} /></div>
//               </div>
//               <div className={styles.statValue}>{stats.tertiary}</div>
//               <div className={`${styles.statTrend} ${styles.positive}`}>
//                 <TrendingUp size={16} /> <span>High conversion rate</span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <div className={styles.contentGrid}>
//         <div className={styles.chartSection}>
//           <Charts />
//         </div>

//         <div className={styles.activitySection}>
//           <div className={styles.activityHeader}>
//             <h3>Recent Activity</h3>
//             <button className={styles.viewAllBtn}>View All</button>
//           </div>

//           {recent.length === 0 ? (
//             <div className={styles.emptyState}>
//               <AlertCircle size={40} className={styles.emptyIcon} />
//               <p>No recent leads assigned to you.</p>
//             </div>
//           ) : (
//             <div className={styles.activityList}>
//               {recent.map(b => (
//                 <div key={b._id} className={styles.activityItem}>
//                   <div className={styles.itemLeft}>
//                     <div className={styles.itemIcon}>
//                       <Building2 size={18} />
//                     </div>
//                     <div className={styles.itemDetails}>
//                       <span className={styles.itemTitle}>{b.buildingType}</span>
//                       <span className={styles.itemSub}>{b.userInfo?.email || 'N/A'}</span>
//                     </div>
//                   </div>
//                   <span className={`${styles.statusBadge} ${styles[b.status?.toLowerCase().replace(' ', '')] || styles.new}`}>
//                     {b.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react'
import api from '../api'
import Charts from '../components/Charts'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  UserCog,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import styles from './Dashboard.module.scss'

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role

  const [stats, setStats] = useState({
    primary: 0,
    secondary: 0,
    tertiary: 0
  })

  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // ================= SUPER ADMIN =================
        if (role === 'superadmin') {
          const res = await api.get('/superadmin/admins')

          const admins = res.data?.data || res.data || []

          setStats({
            primary: admins.length,
            label1: 'Total Admins',
            icon1: <UserCog size={24} />
          })
        }

        // ================= ADMIN =================
        else if (role === 'admin') {
          const resUsers = await api.get('/users') // ✅ FIXED API

          const users = resUsers.data?.data || []

          const activeUsers = users.filter(u => u.isActive).length

          setStats({
            primary: activeUsers,
            label1: 'Active Users',
            icon1: <Users size={24} />
          })
        }

        // ================= USER =================
        else if (role === 'user') {
          const resBuildings = await api.get('/users/buildings')
          const resUsers = await api.get('/users') // ✅ FIXED API

          const buildings = resBuildings.data?.data || resBuildings.data || []
          const users = resUsers.data?.data || []

          const counts = buildings.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1
            return acc
          }, {})

          setStats({
            primary: users.length,
            label1: 'Team Members',
            icon1: <Users size={24} />,

            secondary: buildings.length,
            label2: 'Total Leads',
            icon2: <Building2 size={24} />,

            tertiary: counts['closed-won'] || 0,
            label3: 'Closed',
            icon3: <CheckCircle2 size={24} />
          })

          setRecent(buildings.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err)
      } finally {
        setLoading(false)
      }
    }

    if (role) fetchData()
  }, [role])

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Welcome back, {role}!</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      {/* STATS */}
      <div className={styles.grid}>
        {/* PRIMARY CARD */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>
              {stats.label1 || 'Overview'}
            </span>
            <div className={styles.statIconWrapper}>
              {stats.icon1}
            </div>
          </div>

          <div className={styles.statValue}>
            {loading ? '...' : stats.primary}
          </div>

          <div className={`${styles.statTrend} ${styles.positive}`}>
            <TrendingUp size={16} />
            <span>Live data</span>
          </div>
        </div>

        {/* USER EXTRA CARDS */}
        {role === 'user' && (
          <>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>
                  {stats.label2}
                </span>
                <div className={styles.statIconWrapper}>
                  {stats.icon2}
                </div>
              </div>

              <div className={styles.statValue}>
                {loading ? '...' : stats.secondary}
              </div>

              <div className={`${styles.statTrend} ${styles.neutral}`}>
                <Clock size={16} />
                <span>In progress</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>
                  {stats.label3}
                </span>
                <div className={styles.statIconWrapper}>
                  {stats.icon3}
                </div>
              </div>

              <div className={styles.statValue}>
                {loading ? '...' : stats.tertiary}
              </div>

              <div className={`${styles.statTrend} ${styles.positive}`}>
                <CheckCircle2 size={16} />
                <span>Conversions</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className={styles.contentGrid}>
        {/* CHART */}
        <div className={styles.chartSection}>
          <Charts />
        </div>

        {/* RECENT ACTIVITY */}
        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h3>Recent Activity</h3>
            <button className={styles.viewAllBtn}>
              View All
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : recent.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={40} className={styles.emptyIcon} />
              <p>No recent leads assigned to you.</p>
            </div>
          ) : (
            <div className={styles.activityList}>
              {recent.map(b => (
                <div key={b._id} className={styles.activityItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIcon}>
                      <Building2 size={18} />
                    </div>

                    <div className={styles.itemDetails}>
                      <span className={styles.itemTitle}>
                        {b.buildingType}
                      </span>
                      <span className={styles.itemSub}>
                        {b.userInfo?.email || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${
                      styles[
                        b.status?.toLowerCase().replace(' ', '') || 'new'
                      ]
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}