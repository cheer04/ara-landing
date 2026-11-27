import React, { useState } from 'react';
import { date } from '../../../common/format.js';
import { messageStatuses } from '../../../common/statuses.js';
import { Button, Chip, Field } from '../../../common/ui.jsx';
import './view.css';

function MessageForm({ item, instruction, onSave }) {
  const [status, setStatus] = useState(item.status);
  const [reply, setReply] = useState(item.reply);
  const [saved, setSaved] = useState(false);
  return (
    <form className="work-panel work-stack" onSubmit={async event => {
      event.preventDefault();
      setSaved(await onSave({ ...item, status, reply }));
    }}>
      <div className="work-heading"><h2>{item.title}</h2><Chip value={item.status} /></div>
      <p className="work-muted">{date(item.at)}</p>
      {instruction && <a href={`#/demo/instructions/${instruction.id}`}>{instruction.title}</a>}
      <p>{item.text}</p>
      <Field label="Статус"><select value={status} onChange={event => { setSaved(false); setStatus(event.target.value); }}>{messageStatuses.map(entry => <option key={entry}>{entry}</option>)}</select></Field>
      <Field label="Ответ"><textarea value={reply} onChange={event => { setSaved(false); setReply(event.target.value); }} /></Field>
      <button className="work-button work-button--gold" type="submit">Сохранить обращение</button>
      {saved && <p role="status">Обращение сохранено</p>}
    </form>
  );
}

export default function Messages({ id, messages, instructions, onSave }) {
  const [filter, setFilter] = useState('');
  const item = messages.find(entry => entry.id === id);
  const list = messages.filter(entry => !filter || entry.status === filter);
  return (
    <>
      <div className="work-heading"><h1>Сообщения покупателей</h1></div>
      <div className="work-tabs" role="group" aria-label="Статус сообщения">
        <Button tone={filter === '' ? 'navy' : 'plain'} aria-pressed={filter === ''} onClick={() => setFilter('')}>Все {messages.length}</Button>
        {messageStatuses.map(status => (
          <Button key={status} tone={filter === status ? 'navy' : 'plain'} aria-pressed={filter === status} onClick={() => setFilter(status)}>
            {status} {messages.filter(entry => entry.status === status).length}
          </Button>
        ))}
      </div>
      <div className={item ? 'work-form-grid' : 'work-inbox'}>
        <div className="work-panel work-stack">
          <h2>Все сообщения</h2>
          {list.map(entry => <a className="work-message" aria-current={entry.id === id ? 'page' : undefined} href={`#/demo/messages/${entry.id}`} key={entry.id}>
            <strong>{entry.title}</strong><Chip value={entry.status} /><span>{date(entry.at)} · {entry.text}</span>
          </a>)}
          {!list.length && <p>Сообщения не найдены.</p>}
        </div>
        {item && <MessageForm key={item.id} item={item} instruction={instructions.find(entry => entry.id === item.instructionId)} onSave={onSave} />}
      </div>
    </>
  );
}
