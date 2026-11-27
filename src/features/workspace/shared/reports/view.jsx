import React from 'react';
import { date } from '../../../../common/format.js';
import { Chip, Table } from '../../../../common/ui.jsx';
import { duration, titleOf } from './controller.js';

export function SessionTable({ sessions, instructions }) {
  return <Table columns={['Дата', 'Инструкция', 'Статус', 'Шаг', 'Ответ', 'Длительность']} rows={sessions.map(item => ({
    id: item.id, cells: [date(item.at), titleOf(instructions, item.instructionId), <Chip value={item.status} />, item.step, item.answer || '—', duration(item.seconds)],
  }))} />;
}
