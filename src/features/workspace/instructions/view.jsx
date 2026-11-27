import React, { useState } from 'react';
import { date } from '../../../common/format.js';
import { statuses } from '../../../common/statuses.js';
import { types } from '../../../common/session/instruction-types.js';
import { Button, Chip, Filter, Table } from '../../../common/ui.jsx';

export default function InstructionList({ instructions, models, onCreate }) {
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const rows = instructions.filter(item =>
    item.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (!model || models.find(entry => entry.id === item.modelId)?.code === model) &&
    (!type || item.type === type) && (!status || item.status === status)
  );
  return (
    <>
      <div className="work-heading"><h1>Инструкции</h1><Button onClick={onCreate}>＋ Создать инструкцию</Button></div>
      <div className="work-filters">
        <input type="search" aria-label="Поиск по названию" placeholder="Поиск по названию" value={search} onChange={event => setSearch(event.target.value)} />
        <Filter label="Все модели" value={model} onChange={setModel} values={models.map(item => item.code)} />
        <Filter label="Все типы" value={type} onChange={setType} values={types} />
        <Filter label="Все статусы" value={status} onChange={setStatus} values={statuses} />
      </div>
      <Table columns={['Название', 'Модель', 'Тип', 'Статус', 'Автор', 'Изменено']} rows={rows.map(item => ({
        id: item.id,
        cells: [
          <a className="work-instruction-title" href={`#/demo/instructions/${item.id}`}>{item.title || 'Без названия'}</a>,
          models.find(entry => entry.id === item.modelId)?.code ?? '—', item.type, <Chip value={item.status} />, 'Гость', date(item.updated),
        ],
      }))} empty="Инструкции не найдены" />
    </>
  );
}
