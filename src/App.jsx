import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth, AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admins from './pages/Admins'
import Users from './pages/Users'
import Buildings from './pages/Buildings'
import Register from './pages/Register'
import Profile from './pages/Profiles'
import LeadDetails from './pages/Leads/LeadDetails';
import Lead from "./pages/Leads/Leads";
import Reports from './components/Reports'
import Settings from './components/Settings'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import './styles/main.scss'
import { useLocation } from 'react-router-dom';
import styles from './App.module.scss'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children;
}

export function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (loading) return <LoadingSpinner />

  return (
    <>
      <div className={`${styles.appRoot} ${theme}`}>
      
        {!isAuthPage && user && (
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            theme={theme}
            setTheme={setTheme}
          />
        )}

        <div className={`${styles.main} ${collapsed ? styles.collapsed : ''}`}>
        
          {!isAuthPage && user && (
            <Navbar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              theme={theme}
              setTheme={setTheme}
            />
          )}

          <div className={isAuthPage ? '' : styles.content}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/leads" element={
                <PrivateRoute roles={['admin']}>
                  <Lead />
                </PrivateRoute>
              } />
              <Route path="/leads/:id" element={
                <PrivateRoute roles={['admin']}>
                  <LeadDetails />
                </PrivateRoute>
              } />
              <Route path="/admins" element={
                <PrivateRoute roles={['superadmin']}>
                  <Admins />
                </PrivateRoute>
              } />

              <Route path="/users" element={
                <PrivateRoute roles={['admin']}>
                  <Users />
                </PrivateRoute>
              } />

              <Route path="/buildings" element={
                <PrivateRoute roles={['user']}>
                  <Buildings />
                </PrivateRoute>
              } />

              <Route path="/reports" element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}