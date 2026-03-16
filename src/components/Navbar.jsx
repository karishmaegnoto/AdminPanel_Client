import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Menu, Moon, Sun, User } from 'lucide-react'

import styles from './Navbar.module.scss'

export default function Navbar({ collapsed, setCollapsed }) {
  const { logout, user } = useAuth()

  const toggleTheme = () => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark'
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <header className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.left}>
        <button className={styles.burger} onClick={() => setCollapsed(c => !c)}>
          <Menu size={20} />
        </button>
        <span className={styles.brandTitle}>
          {user?.role === 'superadmin' ? 'Super Admin Panel' : user?.role === 'admin' ? 'Admin Panel' : 'Lead Management'}
        </span>
      </div>

      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.iconBtn}>
          <Moon size={18} />
        </button>

        <div className={styles.userProfile} title="Click to logout">
          <div className={styles.avatar}>
            {user?.firstName?.charAt(0) || <User size={16} />}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.role}>{user?.role}</span>
            <span className={styles.status}>Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}
