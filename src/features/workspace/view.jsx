import './view.css';
import React, { useState } from 'react';
import { asset } from '../../common/assets.js';
import { newInstruction } from './instructions/controller.js';
import { upsert } from '../../common/session/controller.js';
import { timestamp } from '../../common/records.js';
import { Button } from '../../common/ui.jsx';
import InstructionList from './instructions/view.jsx';
import Models from './models/view.jsx';
import Analytics from './analytics/view.jsx';
import Messages from './messages/view.jsx';
import Sessions from './sessions/view.jsx';
import InstructionEditor from './instructions/editor/view.jsx';

const sections = [
  ['instructions', 'Инструкции', 'M12 22H3V2h11l5 5v4M14 2v5h5M7 11h7M7 14h5M7 17h3M19 13v1m0 6v1m-4-4h1m6 0h1m-7-3 1 1m4 4 1 1m0-6-1 1m-4 4-1 1M21.5 17a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z'],
  ['messages', 'Сообщения', 'M3 3h18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-8l-6 4v-4H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM7 8h10M7 12h6'],
  ['models', 'Модели', 'M12 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 6a2 2 0 0 0-1 2v8a2 2 0 0 0 1 2M3 8a2 2 0 0 0-1 2v4a2 2 0 0 0 1 2'],
  ['analytics', 'Аналитика', 'm2 14 7-9 5 6 8-9M2 22h20'],
  ['sessions', 'Журнал прохождений', 'M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13'],
];

const go = path => { window.location.hash = path; };

export default function Workspace({ route, data, update, error }) {
  const [role, setRole] = useState('Администратор');
  const [, page = 'instructions', id, mode] = route;
  const instruction = data.instructions.find(item => item.id === id);

  function saveInstruction(item) {
    return update(current => ({ ...current, instructions: upsert(current.instructions, item) }));
  }

  function createInstruction(modelId = data.models[0]?.id ?? '') {
    const item = newInstruction(modelId);
    if (saveInstruction(item)) go(`/demo/instructions/${item.id}`);
  }

  function saveModel(item, open = true) {
    const saved = update(current => ({ ...current, models: upsert(current.models, { ...item, updated: timestamp() }) }));
    if (saved && open) go(`/demo/models/${item.id}`);
    return saved;
  }

  function deleteModel(modelId) {
    const saved = update(current => {
      if (current.instructions.some(item => item.modelId === modelId)) throw new Error('Сначала перенесите или удалите связанные инструкции.');
      return { ...current, models: current.models.filter(item => item.id !== modelId) };
    });
    if (saved) go('/demo/models');
    return saved;
  }

  function deleteInstruction() {
    if (update(current => ({ ...current, instructions: current.instructions.filter(item => item.id !== id) }))) go('/demo/instructions');
  }

  let screen;
  switch (page) {
    case 'instructions':
      screen = instruction
        ? <InstructionEditor key={id} instruction={instruction} models={data.models} canApprove={role !== 'Редактор'} onSave={saveInstruction} onDelete={deleteInstruction} onBack={() => go('/demo/instructions')} />
        : id ? <p>Инструкция не найдена. <a href="#/demo/instructions">К списку инструкций</a></p>
          : <InstructionList instructions={data.instructions} models={data.models} onCreate={() => createInstruction()} />;
      break;
    case 'messages':
      screen = <Messages id={id} messages={data.messages} instructions={data.instructions}
        onSave={item => update(current => ({ ...current, messages: upsert(current.messages, item) }))} />;
      break;
    case 'models':
      screen = <Models key={`${id ?? ''}/${mode ?? ''}`} id={id} mode={mode} models={data.models} instructions={data.instructions}
        onCreateInstruction={createInstruction} onSave={saveModel} onDelete={deleteModel} navigate={go} />;
      break;
    case 'analytics':
      screen = <Analytics key={id ?? 'all'} id={id} instructions={data.instructions} sessions={data.sessions} />;
      break;
    case 'sessions':
      screen = <Sessions sessions={data.sessions} instructions={data.instructions} />;
      break;
    default:
      screen = <p>Раздел не найден. <a href="#/demo/instructions">К списку инструкций</a></p>;
  }

  return (
    <div className="workspace">
      <header className="work-header d-flex align-items-center justify-content-between gap-3">
        <a href="#/demo/instructions"><img src={asset('images/logo.svg')} alt="Ара — кабинет" /></a>
        <div className="work-actions"><label className="work-role">Роль <select value={role} onChange={event => setRole(event.target.value)}>
          <option>Администратор</option><option>Редактор</option><option>Проверяющий</option>
        </select></label><span className="d-inline-flex align-items-center gap-2"><span className="work-avatar rounded-circle" aria-hidden="true">Г</span>Гость</span><Button tone="outline" onClick={() => go('top')}>На лендинг</Button></div>
      </header>
      <div className="work-layout">
        <aside className="work-sidebar">
          <nav aria-label="Разделы кабинета">
            {sections.map(([key, title, iconPath]) => <a key={key} aria-current={page === key ? 'page' : undefined} href={`#/demo/${key}`}><svg className="work-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={iconPath} />
            </svg>{title}</a>)}
          </nav>
        </aside>
        <main className="work-main" data-section={page}>
          {error && <p className="work-error" role="alert">{error}</p>}
          {screen}
        </main>
      </div>
    </div>
  );
}
