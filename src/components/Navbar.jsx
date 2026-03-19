
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Menu, Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';
// import styles from './Navbar.module.scss';

// export default function Navbar({ collapsed, setCollapsed }) {
//   const { logout, user } = useAuth();
//   const [isDark, setIsDark] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Initialize theme on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('theme');
//     if (saved) {
//       document.documentElement.setAttribute('data-theme', saved);
//       setIsDark(saved === 'dark');
//     } else {
//       // Default to dark
//       document.documentElement.setAttribute('data-theme', 'dark');
//       localStorage.setItem('theme', 'dark');
//       setIsDark(true);
//     }
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleTheme = () => {
//     const current = document.documentElement.getAttribute('data-theme') || 'dark';
//     const next = current === 'dark' ? 'light' : 'dark';
//     document.documentElement.setAttribute('data-theme', next);
//     localStorage.setItem('theme', next);
//     setIsDark(next === 'dark');
//   };

//   return (
//     <header className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}>
//       <div className={styles.left}>
//         <button className={styles.burger} onClick={() => setCollapsed((c) => !c)}>
//           <Menu size={20} />
//         </button>
//         <span className={styles.brandTitle}>
//           {user?.role === 'superadmin'
//             ? 'Super Admin Panel'
//             : user?.role === 'admin'
//             ? 'Admin Panel'
//             : 'Lead Management'}
//         </span>
//       </div>

//       <div className={styles.right}>
//         <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle theme">
//           {isDark ? <Sun size={18} /> : <Moon size={18} />}
//         </button>

//         <div className={styles.profileWrapper} ref={dropdownRef}>
//           <div
//             className={styles.userProfile}
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             <div className={styles.avatar}>
//               {user?.firstName?.charAt(0) || <User size={16} />}
//             </div>
//             <div className={styles.userInfo}>
//               <span className={styles.role}>{user?.role}</span>
//               <span className={styles.status}>Online</span>
//             </div>
//             <ChevronDown
//               size={14}
//               className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`}
//             />
//           </div>

//           {dropdownOpen && (
//             <div className={styles.dropdown}>
//               <div className={styles.dropdownHeader}>
//                 <div className={styles.dropdownAvatar}>
//                   {user?.firstName?.charAt(0) || '?'}
//                 </div>
//                 <div>
//                   <p className={styles.dropdownName}>
//                     {user?.firstName} {user?.lastName}
//                   </p>
//                   <p className={styles.dropdownEmail}>{user?.email}</p>
//                 </div>
//               </div>
//               <div className={styles.dropdownDivider} />
//               <button className={styles.dropdownItem} onClick={logout}>
//                 <LogOut size={16} />
//                 <span>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.scss';

export default function Navbar({ collapsed, setCollapsed }) {
  const { logout, user } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize theme on mount — single source of truth is data-theme on <html>
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsDark(theme === 'dark');
  }, []);

  // Listen for external theme changes (e.g. from Settings page)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setIsDark(current === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(next === 'dark');
  };

  return (
    <header className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.left}>
        <button className={styles.burger} onClick={() => setCollapsed((c) => !c)}>
          <Menu size={20} />
        </button>
        <span className={styles.brandTitle}>
          {user?.role === 'superadmin'
            ? 'Super Admin Panel'
            : user?.role === 'admin'
            ? 'Admin Panel'
            : 'Lead Management'}
        </span>
      </div>

      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div
            className={styles.userProfile}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatar}>
              {user?.firstName?.charAt(0) || <User size={16} />}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.role}>{user?.role}</span>
              <span className={styles.status}>Online</span>
            </div>
            <ChevronDown
              size={14}
              className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`}
            />
          </div>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {user?.firstName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className={styles.dropdownName}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className={styles.dropdownEmail}>{user?.email}</p>
                </div>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={logout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}