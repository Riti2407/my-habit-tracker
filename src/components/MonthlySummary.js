
// npm i chart.js react-chartjs-2
import "./MonthlySummary.css";
import React, { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const PALETTE = [
  '#6C5CE7', // purple
  '#00B894', // green
  '#0984E3', // blue
  '#FF7675', // rose
  '#FF9F43', // orange
  '#F39C12', // amber
  '#2ECC71', // mint
  '#E84393', // pink
  '#00CED1', // teal
];

export default function MonthlySummary({ habitList = [], completedData = {} }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabitKey, setSelectedHabitKey] = useState(null);

  const barRef = useRef(null);
  const pieRef = useRef(null);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to format YYYY-MM-DD
  const fmt = (y, mIdx, d) => `${y}-${String(mIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Mapped habit data for this month (memoized)
  const mappedHabits = useMemo(() => {
    return (habitList || []).map((habit, idx) => {
      const completions = completedData[habit.key] || {};
      let completedCount = 0;
      let longestStreak = 0;
      let curStreak = 0;
      const monthlySeries = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = fmt(year, monthIndex, d);
        const done = !!completions[dateStr];
        monthlySeries.push(done ? 1 : 0);
        if (done) {
          completedCount++;
          curStreak++;
        } else {
          if (curStreak > longestStreak) longestStreak = curStreak;
          curStreak = 0;
        }
      }
      if (curStreak > longestStreak) longestStreak = curStreak;
      const completionPercent = daysInMonth > 0 ? Math.round((completedCount / daysInMonth) * 100) : 0;

      return {
        key: habit.key,
        label: habit.label || habit.key,
        index: idx,
        color: PALETTE[idx % PALETTE.length],
        completions, // raw map
        monthlySeries, // array of 0/1 for this month
        completedCount,
        longestStreak,
        completionPercent,
        missedDays: daysInMonth - completedCount,
      };
    });
  }, [habitList, completedData, daysInMonth, year, monthIndex]);

  // Daily counts for the current month (how many habits were completed each day)
  const dailyCounts = useMemo(() => {
    return daysArray.map((d) => {
      return mappedHabits.reduce((acc, h) => acc + (h.monthlySeries[d - 1] ? 1 : 0), 0);
    });
  }, [mappedHabits, daysArray]);

  const totalHabitsCompletedInMonth = mappedHabits.reduce((acc, h) => acc + h.completedCount, 0);

  // Chart data
  const pieData = useMemo(() => {
    return {
      labels: mappedHabits.map((h) => h.label),
      datasets: [
        {
          data: mappedHabits.map((h) => h.completedCount),
          backgroundColor: mappedHabits.map((h) => h.color),
          hoverOffset: 8,
        },
      ],
    };
  }, [mappedHabits]);

  const selectedHabit = mappedHabits.find((h) => h.key === selectedHabitKey) || null;

  const barData = useMemo(() => {
    const datasets = [
      {
        label: 'Habits completed per day',
        data: dailyCounts,
        backgroundColor: daysArray.map(() => 'rgba(15,23,42,0.06)'),
        borderRadius: 8,
        barThickness: 'flex',
      },
    ];

    if (selectedHabit) {
      datasets.push({
        label: selectedHabit.label + ' — selected',
        data: selectedHabit.monthlySeries.map((v) => (v ? 1 : 0)),
        backgroundColor: selectedHabit.monthlySeries.map((v) => (v ? selectedHabit.color : 'rgba(200,200,200,0.08)')),
        borderRadius: 8,
        barThickness: 14,
      });
    }

    return {
      labels: daysArray.map((d) => String(d)),
      datasets,
    };
  }, [dailyCounts, daysArray, selectedHabit]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, title: { display: true, text: 'Day of month' } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} day(s)` } },
    },
  };

  // Export helpers
  const calculateAllTimeLongestStreak = (habitCompletions) => {
    const dates = Object.keys(habitCompletions).filter((d) => habitCompletions[d]).sort();
    if (dates.length === 0) return 0;
    let longest = 1;
    let cur = 1;
    for (let i = 1; i < dates.length; i++) {
      const a = new Date(dates[i]);
      const b = new Date(dates[i - 1]);
      const diff = Math.round((a - b) / (1000 * 60 * 60 * 24));
      if (diff === 1) cur++; else { if (cur > longest) longest = cur; cur = 1; }
    }
    return Math.max(longest, cur);
  };

  const prepareExportData = () => {
    return mappedHabits.map((h) => {
      const completedDates = Object.keys(h.completions).filter((d) => h.completions[d]).sort();
      return {
        habitName: h.label,
        completedDates,
        allTimeLongestStreak: calculateAllTimeLongestStreak(h.completions),
      };
    });
  };

  const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportJSON = () => {
    const exportData = prepareExportData();
    downloadFile(JSON.stringify(exportData, null, 2), `habit-data-${year}-${String(monthIndex + 1).padStart(2, '0')}.json`, 'application/json');
  };

  const handleExportCSV = () => {
    const exportData = prepareExportData();
    let csv = 'Habit,TotalCompletions,AllTimeLongestStreak,CompletedDates\n';
    exportData.forEach((h) => {
      const dates = `"${h.completedDates.join(', ')}"`;
      csv += `${h.habitName},${h.completedDates.length},${h.allTimeLongestStreak},${dates}\n`;
    });
    downloadFile(csv, `habit-data-${year}-${String(monthIndex + 1).padStart(2, '0')}.csv`, 'text/csv');
  };

  // Download chart images
  const downloadChartImage = (ref, filename) => {
    if (!ref?.current) return;
    try {
      const url = ref.current.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } catch (e) {
      console.warn('Could not export chart image', e);
    }
  };

  // Month navigation
  const goPrev = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // sparkline tiny bars for each habit
  const SparkBars = ({ data = [], color = '#6C5CE7' }) => {
    const w = Math.max(32, data.length * 6);
    const h = 40;
    const barW = Math.max(2, Math.floor(w / data.length) - 2);
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark">
        {data.map((v, i) => (
          <rect key={i} x={i * (barW + 2)} y={v ? 6 : h - 6} width={barW} height={v ? h - 12 : 4} rx={2} fill={v ? color : 'rgba(0,0,0,0.06)'} />
        ))}
      </svg>
    );
  };

  return (
    <div className="ms-root">
      {/* Embedded styles so this file is drop-in. If you already use a global stylesheet remove this. */}
      <style>{`
        :root{ --bg:#f6f8fb; --card:#ffffff; --muted:#6b7280; --accent:#6C5CE7; --glass: rgba(255,255,255,0.6); }
        .ms-root{ max-width:1200px; margin:18px auto; padding:20px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0b1220; }
         .monthly-summary{
  padding-left: 20px;  /* adjust as needed */
  padding-right: 20px; /* optional for balance */
}

        .ms-header{
  display: flex;
  flex-direction: column;   /* stack title + nav */
  align-items: center;      /* center horizontally */
  gap: 8px;
  margin-bottom: 18px;
  text-align: center;
}

.ms-title{
  font-size: 2.1rem;
  margin-bottom: 10px;
  font-weight: 700;
  color: #e84393; /* pink */
}


        .ms-nav{ display:flex; gap:10px; align-items:center; }
        .ms-nav button{ background:linear-gradient(90deg,var(--accent),#5e5ad6); color:#fff; border:0; padding:8px 12px; border-radius:10px; cursor:pointer; box-shadow:0 6px 18px rgba(106,90,205,0.12); }
        .ms-grid{ display:grid; grid-template-columns: 360px 1fr; gap:20px; padding-left: 28px;}
        @media (max-width:900px){ .ms-grid{ grid-template-columns: 1fr; } }

        /* Left column - habits */
        .ms-left{ display:flex; flex-direction:column; gap:14px; }
        .habit-card{ background:var(--card); padding:12px; border-radius:12px; box-shadow:0 6px 18px rgba(16,24,40,0.04); border:1px solid rgba(11,18,32,0.04); display:flex; gap:12px; align-items:center; cursor:pointer; transition:transform .18s ease, box-shadow .18s ease; }
        .habit-card:hover{ transform:translateY(-6px); box-shadow:0 18px 40px rgba(16,24,40,0.06); }
        .habit-meta{ flex:1; }
        .habit-name{ font-weight:650; font-size:1rem; }
        .habit-stats{ display:flex; gap:8px; color:var(--muted); font-size:0.86rem; margin-top:6px; }
        .chip{ padding:6px 8px; border-radius:999px; font-weight:600; font-size:0.85rem; background:rgba(11,18,32,0.04); }

        /* Right column - charts */
        .ms-right{ display:flex; flex-direction:column; gap:16px; padding-left:50px; }
        .charts-row{
  display: flex;
  flex-direction: column;
  padding-top:100px;
  gap: 40px;              
}

        @media (max-width:900px){ .charts-row{ grid-template-columns: 1fr; } }
        .chart-card{ background:var(--card);  padding-top:120px; border-radius:12px; min-height:220px; box-shadow:0 6px 18px rgba(16,24,40,0.04); border:1px solid rgba(11,18,32,0.04); }
        .summary-banner{ padding:14px; border-radius:12px; background:linear-gradient(90deg, rgba(108,92,231,0.12), rgba(0,188,212,0.04)); display:flex; justify-content:space-between; align-items:center; }
        .export-row{ display:flex; gap:10px; align-items:center; justify-content:flex-end; }
        .btn{ background:#0b1220; color:#fff; padding:8px 12px; border-radius:10px; border:0; cursor:pointer; font-weight:600; }
        .btn.secondary{ background:transparent; border:1px solid rgba(11,18,32,0.06); color:var(--muted); }

        /* Footer export */
        .export-section{ margin-top:8px; padding:12px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; background:linear-gradient(180deg, rgba(245,247,250,0.6), #fff); }
      `}</style>

      <div className="ms-header">
        <div>
          <div className="ms-title">Monthly Summary</div>
          <div style={{ color: '#6b7280', fontSize: 18, margin: 10 }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        </div>

        <div className="ms-nav">
          <button onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} aria-label="Previous month">← Prev</button>
          <button onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} aria-label="Next month">Next →</button>
        </div>
      </div>

      <div className="ms-grid">
        <div className="ms-left">
          <div className="summary-banner">
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{totalHabitsCompletedInMonth}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Total habit completions this month</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{mappedHabits.length}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Tracked habits</div>
            </div>
          </div>

          {mappedHabits.length === 0 && (
            <div style={{ padding: 12, borderRadius: 12, background: '#fff', color: '#6b7280' }}>No habits to show. Add some habits to see insights.</div>
          )}

          {mappedHabits.map((h) => (
            <div
              key={h.key}
              className="habit-card"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedHabitKey((k) => (k === h.key ? null : h.key))}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedHabitKey((k) => (k === h.key ? null : h.key)); }}
              style={{ border: selectedHabitKey === h.key ? `2px solid ${h.color}` : undefined }}
            >
              <div style={{ width: 8, height: 48, borderRadius: 8, background: h.color }}></div>
              <div className="habit-meta">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="habit-name">{h.label}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="chip">{h.completionPercent}%</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Done: <strong style={{ color: '#0b1220' }}>{h.completedCount}</strong></div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Missed: <strong style={{ color: '#0b1220' }}>{h.missedDays}</strong></div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Streak: <strong style={{ color: '#0b1220' }}>{h.longestStreak}d</strong></div>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <SparkBars data={h.monthlySeries} color={h.color} />
                </div>
              </div>
            </div>
          ))}

          <div className="export-section">
            <div style={{ fontSize: 13, color: '#6b7280' }}>Export your data</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={handleExportJSON}>Export JSON</button>
              <button className="btn secondary" onClick={handleExportCSV}>Export CSV</button>
            </div>
          </div>
        </div>

        <div className="ms-right">
          <div className="charts-row">
            <div className="chart-card" style={{ minHeight: 300 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Daily activity</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn secondary" onClick={() => downloadChartImage(barRef, `daily-activity-${year}-${String(monthIndex+1).padStart(2,'0')}.png`)}>Download PNG</button>
                </div>
              </div>
              <div style={{ height: 220 }}>
                <Bar ref={barRef} data={barData} options={barOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Distribution</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn secondary" onClick={() => downloadChartImage(pieRef, `distribution-${year}-${String(monthIndex+1).padStart(2,'0')}.png`)}>Download PNG</button>
                </div>
              </div>
              <div style={{ height: 220 }}>
                <Pie ref={pieRef} data={pieData} options={pieOptions} onClick={(evt, elements) => {
                  if (elements?.length) {
                    const idx = elements[0].index;
                    const habit = mappedHabits[idx];
                    if (habit) setSelectedHabitKey((k) => (k === habit.key ? null : habit.key));
                  }
                }} />
              </div>

              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {mappedHabits.map((h) => (
                  <div key={h.key} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }} onClick={() => setSelectedHabitKey((k) => (k === h.key ? null : h.key))}>
                    <div style={{ width: 12, height: 12, background: h.color, borderRadius: 3 }}></div>
                    <div style={{ fontSize: 13, color: selectedHabitKey === h.key ? '#0b1220' : '#6b7280', fontWeight: selectedHabitKey === h.key ? 700 : 600 }}>{h.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card" style={{ minHeight: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>Quick Stats</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{daysInMonth} days · {mappedHabits.length} habits</div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ padding: 12, borderRadius: 10, background: '#fff', minWidth: 180 }}>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Total Completions</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{totalHabitsCompletedInMonth}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: '#fff', minWidth: 180 }}>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Average per day</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{(totalHabitsCompletedInMonth / daysInMonth).toFixed(2)}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: '#fff', minWidth: 180 }}>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Top streak</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{mappedHabits.reduce((m, h) => Math.max(m, h.longestStreak), 0)}d</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={handleExportJSON}>Export JSON</button>
              <button className="btn secondary" onClick={handleExportCSV}>Export CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Usage:
  <MonthlySummary habitList={[{key:'water',label:'Drink water'},{key:'exercise',label:'Exercise'}]} completedData={{ water: {'2025-08-01': true}, exercise: {'2025-08-02': true} }} />

Notes:
- Make sure to install dependencies: npm i chart.js react-chartjs-2
- This file is intentionally self-contained (embedded styles) for easy drop-in. If you prefer a separate CSS file remove the <style> block and put CSS into your stylesheet.
- The pie chart slices and habit cards are clickable — clicking a habit highlights its days in the bar chart.
- You can download the charts as PNG and also export CSV/JSON of habit completion history.
*/
