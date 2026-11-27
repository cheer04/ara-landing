import React, { useState } from 'react';
import { asset } from '../../../common/assets.js';
import { statuses } from '../../../common/statuses.js';
import GuidePlayer from '../shared/guide-player/view.jsx';

export default function Guide({ model, instructions, instructionId, update }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const available = instructions.filter(item => item.modelId === model?.id && item.status === statuses[3]);
  const current = available.find(item => item.id === instructionId);
  const types = [...new Set(available.map(item => item.type))];
  const matches = available.filter(item => (!type || item.type === type) && item.title.toLowerCase().includes(search.trim().toLowerCase()));

  if (current) return (
    <main className="guide-page">
      <GuidePlayer key={current.id} instruction={current} model={model}
        onExit={() => { window.location.hash = '/guide/' + model.id; }}
        onSession={item => update(data => ({ ...data, sessions: [item, ...data.sessions] }))}
        onMessage={item => update(data => ({ ...data, messages: [item, ...data.messages] }))}
      />
    </main>
  );

  return (
    <main className="guide-page">
      <div className="guide-phone">
        <div className="guide-header"><img src={asset('images/logo.png')} alt="Ара" /><a href="#top">На лендинг</a></div>
        <div className="guide-body">
          {model ? <>
            {model.photo && <img className="guide-model-photo" src={asset(model.photo)} alt="" />}
            <p className="guide-label">{model.code}</p>
            <h1>{model.title}</h1>
            <p>{model.description}</p>
            <label className="work-field"><span>Поиск инструкции</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
            {types.length > 1 && <label className="work-field"><span>Тип инструкции</span><select value={type} onChange={event => setType(event.target.value)}>
              <option value="">Все типы</option>
              {types.map(name => <option key={name}>{name}</option>)}
            </select></label>}
            {instructionId && <p>Эта инструкция недоступна.</p>}
            {matches.map(item => (
              <a className="guide-note guide-link" key={item.id} href={`#/guide/${model.id}/${item.id}`}>{item.title}</a>
            ))}
            {!matches.length && <p>{available.length ? 'Инструкции не найдены.' : 'Для этой модели пока нет опубликованных инструкций.'}</p>}
          </> : <p>Модель не найдена.</p>}
        </div>
      </div>
    </main>
  );
}
