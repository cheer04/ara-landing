import React, { useState } from 'react';
import { Button, Filter } from '../../../common/ui.jsx';
import { SessionTable } from '../shared/reports/view.jsx';
import { titleOf, exportSessions } from '../shared/reports/controller.js';

export default function Sessions({ sessions, instructions }) {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const filtered = sessions.filter(item => (!status || item.status === status) && titleOf(instructions, item.instructionId).toLowerCase().includes(search.trim().toLowerCase()));
  return <>
    <div className="work-heading"><h1>Журнал прохождений</h1><Button onClick={() => exportSessions(filtered, instructions)}>Скачать CSV</Button></div>
    <div className="work-filters">
      <input aria-label="Поиск по инструкции" type="search" placeholder="Поиск по инструкции" value={search} onChange={event => setSearch(event.target.value)} />
      <Filter label="Все статусы" value={status} onChange={setStatus} values={['Завершено', 'Прервано']} />
    </div>
    <SessionTable sessions={filtered} instructions={instructions} />
  </>;
}
