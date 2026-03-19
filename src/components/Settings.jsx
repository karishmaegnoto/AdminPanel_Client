// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../api';
// import toast from 'react-hot-toast';
// import {
//   Bell,
//   Palette,
//   Mail,
//   Database,
//   Save,
//   Loader2,
//   Check,
//   RefreshCw,
//   Eye,
//   EyeOff
// } from 'lucide-react';
// import styles from './Settings.module.scss';

// export default function Settings() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('notifications');
//   const [loading, setLoading] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);

//   const [settings, setSettings] = useState({
//     notifications: {
//       emailNotifications: true,
//       pushNotifications: false,
//       weeklyReports: true,
//       newLeadAlerts: true
//     },
//     appearance: {
//       theme: 'dark',
//       compactMode: false,
//       sidebarCollapsed: false
//     },
//     system: {
//       autoBackup: true,
//       backupFrequency: 'daily',
//       retentionPeriod: '90'
//     },
//     integration: {
//       emailProvider: 'smtp',
//       smtpHost: '',
//       smtpPort: '587',
//       smtpUser: '',
//       smtpPassword: ''
//     }
//   });

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const response = await api.get('/settings');
//       if (response.data) {
//         setSettings((prev) => ({ ...prev, ...response.data }));
//       }
//     } catch (error) {
//       console.error('Failed to load settings:', error);
//     }
//   };

//   const saveSettings = async () => {
//     try {
//       setLoading(true);
//       await api.put('/settings', settings);
//       toast.success('Settings saved successfully!');
//       setSaved(true);
//       setHasChanges(false);
//       setTimeout(() => setSaved(false), 2000);
//     } catch (error) {
//       toast.error('Failed to save settings');
//     } finally {
//       setLoading(false);
//     }
//   };

// const updateSetting = (category, key, value) => {
//   setHasChanges(true);
//   setSettings((prev) => ({
//     ...prev,
//     [category]: {
//       ...prev[category],
//       [key]: value
//     }
//   }));

//   // Apply theme change immediately
//   if (category === 'appearance' && key === 'theme') {
//     let themeToApply = value;

//     if (value === 'system') {
//       themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches
//         ? 'dark'
//         : 'light';
//     }

//     document.documentElement.setAttribute('data-theme', themeToApply);
//     localStorage.setItem('theme', themeToApply);
//   }
// };
//   const resetToDefaults = () => {
//     setSettings({
//       notifications: {
//         emailNotifications: true,
//         pushNotifications: false,
//         weeklyReports: true,
//         newLeadAlerts: true
//       },
//       appearance: {
//         theme: 'dark',
//         compactMode: false,
//         sidebarCollapsed: false
//       },
//       system: {
//         autoBackup: true,
//         backupFrequency: 'daily',
//         retentionPeriod: '90'
//       },
//       integration: {
//         emailProvider: 'smtp',
//         smtpHost: '',
//         smtpPort: '587',
//         smtpUser: '',
//         smtpPassword: ''
//       }
//     });
//     setHasChanges(true);
//     toast.success('Settings reset to defaults');
//   };

//   const tabs = [
//     { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
//     { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
//     { id: 'integrations', label: 'Integrations', icon: <Mail size={18} /> },
//     { id: 'system', label: 'System', icon: <Database size={18} /> }
//   ];

//   return (
//     <div className={styles.page}>
//       <div className={styles.header}>
//         <div className={styles.headerContent}>
//           <h1>Settings</h1>
//           <p>Manage your application preferences and configurations</p>
//         </div>

//         <div className={styles.headerActions}>
//           <button
//             className={styles.resetBtn}
//             onClick={resetToDefaults}
//             title="Reset to defaults"
//           >
//             <RefreshCw size={18} />
//             Reset
//           </button>

//           <button
//             className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
//             onClick={saveSettings}
//             disabled={loading || !hasChanges}
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={18} className={styles.spinner} />
//                 Saving…
//               </>
//             ) : saved ? (
//               <>
//                 <Check size={18} />
//                 Saved!
//               </>
//             ) : (
//               <>
//                 <Save size={18} />
//                 Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {hasChanges && (
//         <div className={styles.unsavedBanner}>
//           You have unsaved changes. Click "Save Changes" to apply them.
//         </div>
//       )}

//       <div className={styles.layout}>
//         <nav className={styles.nav}>
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.icon}
//               <span>{tab.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className={styles.content}>
//           {activeTab === 'notifications' && (
//             <div className={styles.section}>
//               <h3>Notification Preferences</h3>
//               <p>Choose how you want to be notified about important events</p>

//               <div className={styles.group}>
//                 {[
//                   { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
//                   { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
//                   { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get a weekly summary report' },
//                   { key: 'newLeadAlerts', label: 'New Lead Alerts', desc: 'Alert when new leads are assigned' }
//                 ].map((item) => (
//                   <label key={item.key} className={styles.toggleGroup}>
//                     <div className={styles.toggleInfo}>
//                       <span className={styles.toggleLabel}>{item.label}</span>
//                       <span className={styles.toggleDesc}>{item.desc}</span>
//                     </div>
//                     <div
//                       className={`${styles.toggle} ${settings.notifications[item.key] ? styles.on : ''}`}
//                       onClick={() =>
//                         updateSetting('notifications', item.key, !settings.notifications[item.key])
//                       }
//                     >
//                       <div className={styles.toggleKnob} />
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'appearance' && (
//             <div className={styles.section}>
//               <h3>Appearance Settings</h3>
//               <p>Customize the look and feel of your application</p>

//               <div className={styles.group}>
//                 <div className={styles.themeSelector}>
//                   <span className={styles.fieldLabel}>Theme</span>
//                   <div className={styles.themeOptions}>
//                     {['dark', 'light', 'system'].map((theme) => (
//                       <button
//                         key={theme}
//                         className={`${styles.themeOption} ${settings.appearance.theme === theme ? styles.selected : ''}`}
//                         onClick={() => updateSetting('appearance', 'theme', theme)}
//                       >
//                         <div className={`${styles.themePreview} ${styles[theme]}`} />
//                         <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {[
//                   { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding' },
//                   { key: 'sidebarCollapsed', label: 'Collapsed Sidebar', desc: 'Sidebar collapsed by default' }
//                 ].map((item) => (
//                   <label key={item.key} className={styles.toggleGroup}>
//                     <div className={styles.toggleInfo}>
//                       <span className={styles.toggleLabel}>{item.label}</span>
//                       <span className={styles.toggleDesc}>{item.desc}</span>
//                     </div>
//                     <div
//                       className={`${styles.toggle} ${settings.appearance[item.key] ? styles.on : ''}`}
//                       onClick={() =>
//                         updateSetting('appearance', item.key, !settings.appearance[item.key])
//                       }
//                     >
//                       <div className={styles.toggleKnob} />
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'integrations' && (
//             <div className={styles.section}>
//               <h3>Email Integration</h3>
//               <p>Configure email settings for notifications and reports</p>

//               <div className={styles.group}>
//                 <div className={styles.fieldGroup}>
//                   <label className={styles.fieldLabel}>Email Provider</label>
//                   <select
//                     className={styles.fieldSelect}
//                     value={settings.integration.emailProvider}
//                     onChange={(e) => updateSetting('integration', 'emailProvider', e.target.value)}
//                   >
//                     <option value="smtp">SMTP (Recommended)</option>
//                     <option value="sendgrid">SendGrid API</option>
//                     <option value="mailgun">Mailgun API</option>
//                   </select>
//                 </div>

//                 <div className={styles.formGrid}>
//                   <div className={styles.fieldGroup}>
//                     <label className={styles.fieldLabel}>SMTP Host</label>
//                     <input
//                       className={styles.fieldInput}
//                       type="text"
//                       value={settings.integration.smtpHost}
//                       onChange={(e) => updateSetting('integration', 'smtpHost', e.target.value)}
//                       placeholder="smtp.gmail.com"
//                     />
//                   </div>

//                   <div className={styles.fieldGroup}>
//                     <label className={styles.fieldLabel}>SMTP Port</label>
//                     <input
//                       className={styles.fieldInput}
//                       type="text"
//                       value={settings.integration.smtpPort}
//                       onChange={(e) => updateSetting('integration', 'smtpPort', e.target.value)}
//                       placeholder="587"
//                     />
//                   </div>

//                   <div className={styles.fieldGroup}>
//                     <label className={styles.fieldLabel}>Username</label>
//                     <input
//                       className={styles.fieldInput}
//                       type="text"
//                       value={settings.integration.smtpUser}
//                       onChange={(e) => updateSetting('integration', 'smtpUser', e.target.value)}
//                       placeholder="username@example.com"
//                     />
//                   </div>

//                   <div className={styles.fieldGroup}>
//                     <label className={styles.fieldLabel}>Password</label>
//                     <div className={styles.passwordField}>
//                       <input
//                         className={styles.fieldInput}
//                         type={showPassword ? 'text' : 'password'}
//                         value={settings.integration.smtpPassword}
//                         onChange={(e) => updateSetting('integration', 'smtpPassword', e.target.value)}
//                         placeholder="••••••••"
//                       />
//                       <button
//                         className={styles.passwordToggle}
//                         onClick={() => setShowPassword(!showPassword)}
//                         type="button"
//                       >
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'system' && (
//             <div className={styles.section}>
//               <h3>System Configuration</h3>
//               <p>Manage system-wide settings and maintenance</p>

//               <div className={styles.group}>
//                 <label className={styles.toggleGroup}>
//                   <div className={styles.toggleInfo}>
//                     <span className={styles.toggleLabel}>Automatic Backups</span>
//                     <span className={styles.toggleDesc}>Automatically back up your data</span>
//                   </div>
//                   <div
//                     className={`${styles.toggle} ${settings.system.autoBackup ? styles.on : ''}`}
//                     onClick={() =>
//                       updateSetting('system', 'autoBackup', !settings.system.autoBackup)
//                     }
//                   >
//                     <div className={styles.toggleKnob} />
//                   </div>
//                 </label>

//                 <div className={styles.fieldGroup}>
//                   <label className={styles.fieldLabel}>Backup Frequency</label>
//                   <select
//                     className={styles.fieldSelect}
//                     value={settings.system.backupFrequency}
//                     onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
//                     disabled={!settings.system.autoBackup}
//                   >
//                     <option value="daily">Daily</option>
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                   </select>
//                 </div>

//                 <div className={styles.fieldGroup}>
//                   <label className={styles.fieldLabel}>Data Retention (Days)</label>
//                   <input
//                     className={styles.fieldInput}
//                     type="number"
//                     value={settings.system.retentionPeriod}
//                     onChange={(e) => updateSetting('system', 'retentionPeriod', e.target.value)}
//                     placeholder="90"
//                     min="1"
//                     max="365"
//                   />
//                   <span className={styles.fieldHint}>
//                     Data older than {settings.system.retentionPeriod} days will be archived
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }   
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import {
  Bell,
  Palette,
  Mail,
  Database,
  Save,
  Loader2,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import styles from './Settings.module.scss';

// Helper: resolve effective theme from a preference string
function resolveTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return preference; // 'dark' or 'light'
}

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Determine the initial theme preference from what's already been applied
  const getInitialThemePreference = () => {
    return localStorage.getItem('themePreference') ||
      localStorage.getItem('theme') ||
      'dark';
  };

  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      newLeadAlerts: true,
    },
    appearance: {
      theme: getInitialThemePreference(),
      compactMode: false,
      sidebarCollapsed: false,
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: '90',
    },
    integration: {
      emailProvider: 'smtp',
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  // If user picks "system", listen for OS changes
  useEffect(() => {
    if (settings.appearance.theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const resolved = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem('theme', resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.appearance.theme]);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        setSettings((prev) => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await api.put('/settings', settings);
      toast.success('Settings saved successfully!');
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setHasChanges(true);
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));

    // Apply theme change immediately and keep everything in sync
    if (category === 'appearance' && key === 'theme') {
      const resolved = resolveTheme(value);
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem('theme', resolved);
      // Store the raw preference so we remember "system" across reloads
      localStorage.setItem('themePreference', value);
    }
  };

  const resetToDefaults = () => {
    const defaults = {
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        newLeadAlerts: true,
      },
      appearance: {
        theme: 'dark',
        compactMode: false,
        sidebarCollapsed: false,
      },
      system: {
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: '90',
      },
      integration: {
        emailProvider: 'smtp',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
      },
    };
    setSettings(defaults);
    setHasChanges(true);

    // Also apply the default theme immediately
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('themePreference', 'dark');

    toast.success('Settings reset to defaults');
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Mail size={18} /> },
    { id: 'system', label: 'System', icon: <Database size={18} /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Settings</h1>
          <p>Manage your application preferences and configurations</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.resetBtn}
            onClick={resetToDefaults}
            title="Reset to defaults"
          >
            <RefreshCw size={18} />
            Reset
          </button>

          <button
            className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
            onClick={saveSettings}
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Saving…
              </>
            ) : saved ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className={styles.unsavedBanner}>
          You have unsaved changes. Click "Save Changes" to apply them.
        </div>
      )}

      <div className={styles.layout}>
        <nav className={styles.nav}>
          {tabs.map((tab) => (
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
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get a weekly summary report' },
                  { key: 'newLeadAlerts', label: 'New Lead Alerts', desc: 'Alert when new leads are assigned' },
                ].map((item) => (
                  <label key={item.key} className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>{item.label}</span>
                      <span className={styles.toggleDesc}>{item.desc}</span>
                    </div>
                    <div
                      className={`${styles.toggle} ${settings.notifications[item.key] ? styles.on : ''}`}
                      onClick={() =>
                        updateSetting('notifications', item.key, !settings.notifications[item.key])
                      }
                    >
                      <div className={styles.toggleKnob} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className={styles.section}>
              <h3>Appearance Settings</h3>
              <p>Customize the look and feel of your application</p>

              <div className={styles.group}>
                <div className={styles.themeSelector}>
                  <span className={styles.fieldLabel}>Theme</span>
                  <div className={styles.themeOptions}>
                    {['dark', 'light', 'system'].map((theme) => (
                      <button
                        key={theme}
                        className={`${styles.themeOption} ${settings.appearance.theme === theme ? styles.selected : ''}`}
                        onClick={() => updateSetting('appearance', 'theme', theme)}
                      >
                        <div className={`${styles.themePreview} ${styles[theme]}`} />
                        <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding' },
                  { key: 'sidebarCollapsed', label: 'Collapsed Sidebar', desc: 'Sidebar collapsed by default' },
                ].map((item) => (
                  <label key={item.key} className={styles.toggleGroup}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>{item.label}</span>
                      <span className={styles.toggleDesc}>{item.desc}</span>
                    </div>
                    <div
                      className={`${styles.toggle} ${settings.appearance[item.key] ? styles.on : ''}`}
                      onClick={() =>
                        updateSetting('appearance', item.key, !settings.appearance[item.key])
                      }
                    >
                      <div className={styles.toggleKnob} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className={styles.section}>
              <h3>Email Integration</h3>
              <p>Configure email settings for notifications and reports</p>

              <div className={styles.group}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email Provider</label>
                  <select
                    className={styles.fieldSelect}
                    value={settings.integration.emailProvider}
                    onChange={(e) => updateSetting('integration', 'emailProvider', e.target.value)}
                  >
                    <option value="smtp">SMTP (Recommended)</option>
                    <option value="sendgrid">SendGrid API</option>
                    <option value="mailgun">Mailgun API</option>
                  </select>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>SMTP Host</label>
                    <input
                      className={styles.fieldInput}
                      type="text"
                      value={settings.integration.smtpHost}
                      onChange={(e) => updateSetting('integration', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>SMTP Port</label>
                    <input
                      className={styles.fieldInput}
                      type="text"
                      value={settings.integration.smtpPort}
                      onChange={(e) => updateSetting('integration', 'smtpPort', e.target.value)}
                      placeholder="587"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Username</label>
                    <input
                      className={styles.fieldInput}
                      type="text"
                      value={settings.integration.smtpUser}
                      onChange={(e) => updateSetting('integration', 'smtpUser', e.target.value)}
                      placeholder="username@example.com"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Password</label>
                    <div className={styles.passwordField}>
                      <input
                        className={styles.fieldInput}
                        type={showPassword ? 'text' : 'password'}
                        value={settings.integration.smtpPassword}
                        onChange={(e) => updateSetting('integration', 'smtpPassword', e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                <label className={styles.toggleGroup}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>Automatic Backups</span>
                    <span className={styles.toggleDesc}>Automatically back up your data</span>
                  </div>
                  <div
                    className={`${styles.toggle} ${settings.system.autoBackup ? styles.on : ''}`}
                    onClick={() =>
                      updateSetting('system', 'autoBackup', !settings.system.autoBackup)
                    }
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </label>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Backup Frequency</label>
                  <select
                    className={styles.fieldSelect}
                    value={settings.system.backupFrequency}
                    onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                    disabled={!settings.system.autoBackup}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Data Retention (Days)</label>
                  <input
                    className={styles.fieldInput}
                    type="number"
                    value={settings.system.retentionPeriod}
                    onChange={(e) => updateSetting('system', 'retentionPeriod', e.target.value)}
                    placeholder="90"
                    min="1"
                    max="365"
                  />
                  <span className={styles.fieldHint}>
                    Data older than {settings.system.retentionPeriod} days will be archived
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}