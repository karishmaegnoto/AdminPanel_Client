import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {LayoutDashboard,Users,UserCog,Building2,User,Settings,BarChart3,LogOut,ChevronLeft,ChevronRight} from 'lucide-react'

import styles from './Sidebar.module.scss'

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth()
  const role = user?.role

  const navigation = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['superadmin', 'admin', 'user']
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: <User size={20} />,
      roles: ['superadmin', 'admin', 'user']
    },
    {
      to: '/team',
      label: 'Team',
      icon: <Users size={20} />,
      roles: ['admin', 'user'],
      badge: user?.teamSize > 0 ? user.teamSize : null
    },
    {
      to: '/admins',
      label: 'Admin Management',
      icon: <UserCog size={20} />,
      roles: ['superadmin']
    },
    {
      to: '/users',
      label: 'User Management',
      icon: <Users size={20} />,
      roles: ['admin']
    },
    {
      to: '/buildings',
      label: 'Building Leads',
      icon: <Building2 size={20} />,
      roles: ['user'],
      badge: user?.activeLeads > 0 ? user.activeLeads : null
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      roles: ['superadmin', 'admin', 'user']
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      roles: ['superadmin', 'admin', 'user']
    }
  ]

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(role)
  )

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Building2 size={24} />
          </div>
          {!collapsed && (
            <div className={styles.brandText}>
              <h2>3D Estimator</h2>
            </div>
          )}
        </div>

        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {filteredNavigation.map(item => (
            <li key={item.to} className={styles.navItem}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && (
                  <span className={styles.navText}>{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt="Profile"
            />
          </div>
          {!collapsed && (
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.firstName} {user?.lastName}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className={styles.logoutBtn}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}