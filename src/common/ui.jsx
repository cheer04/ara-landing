import './ui.css';
import React, { useEffect, useRef, useState } from 'react';
import { asset } from './assets.js';
import { statuses } from './statuses.js';

export function Button({ children, tone = 'gold', ...props }) {
  return <button type="button" className={`work-button work-button--${tone}`} {...props}>{children}</button>;
}

export function Chip({ value }) {
  const color = value === statuses[3] || value === 'Закрыто' || value === 'Завершено'
    ? 'green' : value === statuses[2] || value === 'Новое' ? 'blue' : value === statuses[1] || value === 'В работе' ? 'amber' : 'gray';
  return <span className={`work-chip work-chip--${color}`}>{value}</span>;
}

export function Field({ label, children }) {
  return <label className="work-field"><span>{label}</span>{children}</label>;
}

export function Filter({ label, value, onChange, values }) {
  return (
    <select aria-label={label} value={value} onChange={event => onChange(event.target.value)}>
      <option value="">{label}</option>
      {values.map(value => <option key={value} value={value}>{value}</option>)}
    </select>
  );
}

export function Table({ columns, rows, empty = 'Записей пока нет', panel = false }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);
  return (
    <>
      <div className="work-table-wrap">
        <table className={panel ? "work-table work-table--panel" : "work-table"}>
          <thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{rows.slice((current - 1) * pageSize, current * pageSize).map(({ id, cells }) => (
            <tr key={id}>{cells.map((cell, index) => <td key={columns[index]}>{cell}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
      {!rows.length && <p className="work-empty">{empty}</p>}
      {rows.length > 0 && (
        <nav className="work-pagination" aria-label="Страницы таблицы">
          <Button tone="plain" aria-label="Предыдущая страница" disabled={current === 1} onClick={() => setPage(current - 1)}>‹</Button>
          <span>{current} / {pages}</span>
          <Button tone="plain" aria-label="Следующая страница" disabled={current === pages} onClick={() => setPage(current + 1)}>›</Button>
        </nav>
      )}
    </>
  );
}

export function Modal({ title, subtitle, onClose, children, wide = false }) {
  const ref = useRef(null);
  const heading = React.useId();
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog ref={ref} aria-labelledby={heading} className={`work-modal ${wide ? 'work-modal--wide' : ''}`} onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="work-modal-heading">
        <div><h2 id={heading}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <Button tone="plain" aria-label="Закрыть" onClick={onClose}>×</Button>
      </div>
      {children}
    </dialog>
  );
}

export function ModalActions({ onClose, children }) {
  return <div className="work-modal-actions"><Button tone="muted" onClick={onClose}>Отмена</Button>{children}</div>;
}

export function PhotoUpload({ onChange, children = 'Заменить фотографию' }) {
  const [error, setError] = useState('');
  return (
    <>
      <label className="work-upload">
        {children}
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => {
          const file = event.target.files[0];
          if (!file) return;
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
            setError('Выберите PNG, JPEG или WebP размером до 1 МБ.');
            return;
          }
          setError('');
          const reader = new FileReader();
          reader.onload = () => onChange(reader.result);
          reader.onerror = () => setError('Не удалось прочитать фотографию.');
          reader.readAsDataURL(file);
        }} />
      </label>
      {error && <p className="work-error" role="alert">{error}</p>}
    </>
  );
}

export function PointPhoto({ src, points = [], onChange, limit = 2, label = 'Фотография техники', zoom = 1 }) {
  const marker = React.useId();
  function add(event) {
    if (!onChange || points.length >= limit) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onChange([...points, { x: (event.clientX - rect.left) / rect.width * 100, y: (event.clientY - rect.top) / rect.height * 100 }]);
  }
  if (!src) return <p className="work-empty">Добавьте фотографию</p>;
  return (
    <div className="point-scroll">
      <div className={`point-photo ${onChange ? 'point-photo--editable' : ''}`} style={{ '--photo-zoom': zoom }}>
        <img src={asset(src)} alt={label} draggable="false" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><marker id={marker} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5" fill="none" stroke="currentColor" /></marker></defs>
          {limit === 4 && <polygon points={points.map(({ x, y }) => `${x},${y}`).join(' ')} fill="#d4ad3360" stroke="currentColor" strokeWidth=".55" />}
          {limit === 2 && points.length === 2 && <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="currentColor" strokeWidth=".6" markerEnd={`url(#${marker})`} />}
          {points.map(({ x, y }, index) => <circle key={index} cx={x} cy={y} r="1" fill="currentColor" stroke="white" strokeWidth=".3" />)}
        </svg>
        {onChange && <div className="point-hit" onClick={add} aria-hidden="true" />}
      </div>
    </div>
  );
}

export function PointEditor({ src, points, onChange, limit }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="point-editor">
      <PointPhoto src={src} points={points} onChange={onChange} limit={limit} zoom={zoom} />
      <p>Отмечено {points.length} из {limit}</p>
      <div className="work-actions">
        <Button tone="plain" aria-label="Уменьшить фото" disabled={zoom <= 1} onClick={() => setZoom(zoom - .25)}>−</Button>
        <span>{Math.round(zoom * 100)}%</span>
        <Button tone="plain" aria-label="Увеличить фото" disabled={zoom >= 2} onClick={() => setZoom(zoom + .25)}>+</Button>
        <Button tone="plain" onClick={() => onChange([])} disabled={!points.length}>Сбросить точки</Button>
      </div>
      {src && points.length < limit && (
        <Button tone="plain" onClick={() => {
          const defaults = limit === 4
            ? [{ x: 20, y: 25 }, { x: 80, y: 25 }, { x: 80, y: 75 }, { x: 20, y: 75 }]
            : [{ x: 28, y: 35 }, { x: 68, y: 65 }];
          onChange([...points, defaults[points.length]]);
        }}>Добавить точку</Button>
      )}
    </div>
  );
}
