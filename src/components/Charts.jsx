// import React, { useEffect, useState } from 'react'
// import { Pie } from 'react-chartjs-2'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
// import api from '../api'

// ChartJS.register(ArcElement, Tooltip, Legend)

// import styles from './Charts.module.scss'

// ChartJS.register(ArcElement, Tooltip, Legend)

// export default function Charts() {
//   const [data, setData] = useState({
//     labels: ['New', 'Contacted', 'Quoted', 'Closed'],
//     datasets: [{
//       data: [0, 0, 0, 0],
//       backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#10b981'],
//       borderColor: 'transparent',
//       hoverOffset: 15
//     }]
//   })

//   useEffect(() => {
//     // Only fetch for roles that have building data
//     api.get('/users/buildings').then(r => {
//       const counts = { new: 0, contacted: 0, quoted: 0, closed: 0 }
//       r.data.forEach(b => {
//         const status = b.status?.toLowerCase() || 'new'
//         counts[status] = (counts[status] || 0) + 1
//       })
      
//       setData({
//         labels: ['New', 'Contacted', 'Quoted', 'Closed'],
//         datasets: [{
//           data: [counts.new, counts.contacted, counts.quoted, counts.closed],
//           backgroundColor: [
//             '#6366f1', // primary
//             '#3b82f6', // info
//             '#f59e0b', // warning
//             '#10b981'  // success
//           ],
//           borderColor: 'transparent',
//           hoverOffset: 20
//         }]
//       })
//     }).catch(() => { })
//   }, [])

//   const options = {
//     maintainAspectRatio: false,
//     cutout: '65%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: 'rgba(156, 163, 175, 0.9)',
//           usePointStyle: true,
//           pointStyle: 'circle',
//           padding: 25,
//           font: {
//             size: 13,
//             family: "'Plus Jakarta Sans', sans-serif",
//             weight: 600
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(15, 23, 42, 0.9)',
//         titleFont: { size: 14, weight: 700 },
//         bodyFont: { size: 13 },
//         padding: 12,
//         cornerRadius: 12,
//         displayColors: true
//       }
//     }
//   }

//   return (
//     <div className={styles.chartCard}>
//       <h3 className={styles.title}>Lead Status Distribution</h3>
//       <div className={styles.chartWrapper}>
//         <Pie data={data} options={options} />
//       </div>
//     </div>
//   )
// }

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../api';
import styles from './Charts.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts() {
  const [data, setData] = useState({
    labels: ['New', 'Contacted', 'Quoted', 'Closed'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#10b981'],
        borderColor: 'transparent',
        hoverOffset: 15
      }
    ]
  });

  useEffect(() => {
    api
      .get('/users/buildings')
      .then((r) => {
        const counts = { new: 0, contacted: 0, quoted: 0, closed: 0 };
        r.data.forEach((b) => {
          const status = b.status?.toLowerCase() || 'new';
          counts[status] = (counts[status] || 0) + 1;
        });

        setData({
          labels: ['New', 'Contacted', 'Quoted', 'Closed'],
          datasets: [
            {
              data: [counts.new, counts.contacted, counts.quoted, counts.closed],
              backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#10b981'],
              borderColor: 'transparent',
              hoverOffset: 20
            }
          ]
        });
      })
      .catch(() => {});
  }, []);

  const options = {
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(156, 163, 175, 0.9)',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 25,
          font: {
            size: 13,
            family: "'Plus Jakarta Sans', sans-serif",
            weight: 600
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14, weight: 700 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 12,
        displayColors: true
      }
    }
  };

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.title}>Lead Status Distribution</h3>
      <div className={styles.chartWrapper}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}