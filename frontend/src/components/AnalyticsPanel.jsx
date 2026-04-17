import React from 'react';

const STATUS_COLORS = {
  Completed:   '#0ecb7a',
  'In Progress': '#38bdf8',
  Pending:     '#f5a623',
};

const PRIORITY_COLORS = {
  High:   '#f04444',
  Medium: '#f5a623',
  Low:    '#0ecb7a',
};

/* ── SVG Donut Chart ──────────────────────────────────── */
const DonutChart = ({ data, size = 148, centerValue, centerLabel }) => {
  const r    = size / 2 - 18;
  const circ = 2 * Math.PI * r;
  const cx   = size / 2;
  const cy   = size / 2;
  const total = data.reduce((s, d) => s + d.value, 0);

  let accumulated = 0;
  const slices = data.map(d => {
    const len       = total > 0 ? (d.value / total) * circ : 0;
    const dashOffset = circ - accumulated;
    accumulated += len;
    return { ...d, len, dashOffset };
  });

  return (
    <div className="donut-center-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={20} />
        ) : slices.filter(s => s.len > 0).map((s, i) => (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={20}
            strokeDasharray={`${s.len} ${circ}`}
            strokeDashoffset={s.dashOffset}
            style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          />
        ))}
      </svg>
      <div className="donut-center-text">
        <span className="donut-pct">{centerValue}</span>
        <span className="donut-sub">{centerLabel}</span>
      </div>
    </div>
  );
};

/* ── Main Panel ───────────────────────────────────────── */
const AnalyticsPanel = ({ tasks }) => {
  const total      = tasks.length;
  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;
  const high       = tasks.filter(t => t.priority === 'High').length;
  const medium     = tasks.filter(t => t.priority === 'Medium' || !t.priority).length;
  const low        = tasks.filter(t => t.priority === 'Low').length;
  const overdue    = tasks.filter(t =>
    t.status !== 'Completed' && t.deadline && new Date(t.deadline) < new Date()
  ).length;
  const totalSubs  = tasks.reduce((s, t) => s + (t.subtasks?.length || 0), 0);
  const doneSubs   = tasks.reduce((s, t) => s + (t.subtasks?.filter(st => st.done).length || 0), 0);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const donutData = [
    { label: 'Completed',   value: completed,  color: STATUS_COLORS.Completed },
    { label: 'In Progress', value: inProgress, color: STATUS_COLORS['In Progress'] },
    { label: 'Pending',     value: pending,    color: STATUS_COLORS.Pending },
  ];

  const maxPriority = Math.max(high, medium, low, 1);

  return (
    <div className="analytics-panel glass-panel">
      <h3 className="analytics-title">📊 Analytics Overview</h3>

      <div className="analytics-grid">
        {/* Left: Donut + legend */}
        <div className="donut-wrap">
          <DonutChart
            data={donutData}
            size={148}
            centerValue={`${completionRate}%`}
            centerLabel="done"
          />
          <div className="donut-legend">
            {donutData.map(d => (
              <div key={d.label} className="legend-item">
                <span className="legend-dot" style={{ background: d.color }} />
                <span className="legend-label">{d.label}</span>
                <span className="legend-count" style={{ color: d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Priority bars + mini stats */}
        <div className="priority-section">
          <p className="priority-section-title">Priority Breakdown</p>
          {[
            { label: 'High',   count: high,   color: PRIORITY_COLORS.High },
            { label: 'Medium', count: medium, color: PRIORITY_COLORS.Medium },
            { label: 'Low',    count: low,    color: PRIORITY_COLORS.Low },
          ].map(p => (
            <div key={p.label} className="priority-bar-item">
              <span className="priority-bar-label" style={{ color: p.color }}>{p.label}</span>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill"
                  style={{ width: `${(p.count / maxPriority) * 100}%`, background: p.color }}
                />
              </div>
              <span className="priority-bar-count" style={{ color: p.color }}>{p.count}</span>
            </div>
          ))}

          <div className="analytics-stats-row">
            <div className="analytics-mini-stat">
              <span className="analytics-mini-value" style={{ color: overdue > 0 ? '#f04444' : 'inherit' }}>
                {overdue}
              </span>
              <span className="analytics-mini-label">Overdue</span>
            </div>
            <div className="analytics-mini-stat">
              <span className="analytics-mini-value">{totalSubs}</span>
              <span className="analytics-mini-label">Subtasks</span>
            </div>
            <div className="analytics-mini-stat">
              <span className="analytics-mini-value" style={{ color: '#0ecb7a' }}>{doneSubs}</span>
              <span className="analytics-mini-label">Sub Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
