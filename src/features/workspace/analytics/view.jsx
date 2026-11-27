import React, { useState } from 'react';
import { Button, Field, Table } from '../../../common/ui.jsx';
import { SessionTable } from '../shared/reports/view.jsx';
import { duration, exportSessions } from '../shared/reports/controller.js';
import './view.css';

function Chart({ sessions }) {
  const grouped = new Map();
  sessions.forEach(item => {
    const key = item.at.slice(0, 10);
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });
  const points = [...grouped].sort(([a], [b]) => a.localeCompare(b)).slice(-14);
  if (!points.length) return <p className="work-empty">За выбранный период прохождений нет.</p>;
  const max = Math.max(...points.map(([, count]) => count));
  return <div className="work-chart" aria-label="Прохождения по дням">
    {points.map(([day, count]) => <div className="work-bar" key={day}>
      <span>{count}</span><div className="work-bar-fill" style={{ height: `${count / max * 125}px` }} />
      <span>{day.slice(8)}.{day.slice(5, 7)}</span>
    </div>)}
  </div>;
}

export default function Analytics({ id, instructions, sessions }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [completedOnly, setCompletedOnly] = useState(false);
  const item = instructions.find(entry => entry.id === id);
  const filtered = sessions.filter(entry => (!id || entry.instructionId === id) &&
    (!from || entry.at.slice(0, 10) >= from) && (!to || entry.at.slice(0, 10) <= to));
  const complete = filtered.filter(entry => entry.status === 'Завершено');
  const average = complete.length ? Math.round(complete.reduce((sum, entry) => sum + entry.seconds, 0) / complete.length) : 0;
  return (
    <div className="work-stack">
      {id && <a href="#/demo/analytics">К общей аналитике</a>}
      <div className="work-heading"><h1>{item?.title || 'Аналитика'}</h1><Button onClick={() => exportSessions(filtered, instructions)}>Скачать отчёт CSV</Button></div>
      <div className="work-filters">
        <Field label="С даты"><input type="date" value={from} max={to || undefined} onChange={event => setFrom(event.target.value)} /></Field>
        <Field label="По дату"><input type="date" value={to} min={from || undefined} onChange={event => setTo(event.target.value)} /></Field>
      </div>
      <div className="work-panel work-stack">
        <h2>Динамика прохождений</h2>
        <div className="work-tabs">
          <Button tone={completedOnly ? 'plain' : 'navy'} onClick={() => setCompletedOnly(false)}>Все прохождения</Button>
          <Button tone={completedOnly ? 'navy' : 'plain'} onClick={() => setCompletedOnly(true)}>Завершённые</Button>
        </div>
        <Chart sessions={completedOnly ? complete : filtered} />
      </div>
      <div className="work-metrics">
        <div><span>Начато прохождений</span><strong>{filtered.length}</strong></div>
        <div><span>Завершено</span><strong>{complete.length}</strong></div>
        <div><span>Доля завершений</span><strong>{filtered.length ? Math.round(complete.length / filtered.length * 100) : 0}%</strong></div>
        <div><span>Среднее время</span><strong>{duration(average)}</strong></div>
      </div>
      {id ? <><h2>Прохождения</h2><SessionTable sessions={filtered} instructions={instructions} /></> : <>
        <h2>Инструкции лидеры</h2>
        <Table panel columns={['Название', 'Начато', 'Завершено']} rows={instructions.map(entry => {
          const list = filtered.filter(session => session.instructionId === entry.id);
          return { id: entry.id, total: list.length, cells: [
            <a href={`#/demo/analytics/${entry.id}`}>{entry.title || 'Без названия'}</a>, list.length, list.filter(session => session.status === 'Завершено').length,
          ] };
        }).sort((a, b) => b.total - a.total)} />
      </>}
    </div>
  );
}
