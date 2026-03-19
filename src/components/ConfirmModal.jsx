// import React from 'react'
// import { AlertTriangle, X } from 'lucide-react'
// import styles from './ConfirmModal.module.scss'

// export default function ConfirmModal({
//     isOpen,
//     onClose,
//     onConfirm,
//     title = 'Confirm Action',
//     message = 'Are you sure you want to proceed?',
//     confirmText = 'Confirm',
//     cancelText = 'Cancel',
//     confirmVariant = 'primary',
//     loading = false
// }) {
//     if (!isOpen) return null

//     return (
//         <div className={styles.overlay} onClick={onClose}>
//             <div className={styles.modal} onClick={e => e.stopPropagation()}>
//                 <div className={styles.header}>
//                     <div className={styles.icon}>
//                         <AlertTriangle size={24} />
//                     </div>
//                     <h3>{title}</h3>
//                     <button className={styles.closeBtn} onClick={onClose}>
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <div className={styles.content}>
//                     <p>{message}</p>
//                 </div>

//                 <div className={styles.footer}>
//                     <button
//                         className="btn btn--ghost"
//                         onClick={onClose}
//                         disabled={loading}
//                     >
//                         {cancelText}
//                     </button>
//                     <button
//                         className={`btn btn--${confirmVariant}`}
//                         onClick={onConfirm}
//                         disabled={loading}
//                     >
//                         {loading ? 'Processing...' : confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }
import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import styles from './ConfirmModal.module.scss';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <AlertTriangle size={24} />
          </div>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p>{message}</p>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.confirmBtn} ${styles[confirmVariant]}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={16} />
                Processing…
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}