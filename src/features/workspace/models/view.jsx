import React, { useRef, useState } from 'react';
import { date } from '../../../common/format.js';
import { statuses } from '../../../common/statuses.js';
import { QRCodeSVG } from 'qrcode.react';
import { asset } from '../../../common/assets.js';
import { Button, Chip, Field, Filter, Modal, ModalActions, PhotoUpload, Table } from '../../../common/ui.jsx';
import { newModel, publicLink } from './controller.js';
import './view.css';

function ModelForm({ model, models, onSave, onCancel }) {
  const [value, setValue] = useState(model ?? newModel);
  const [error, setError] = useState('');
  const change = (key, next) => setValue(current => ({ ...current, [key]: next }));
  return (
    <>
      <div className="work-heading"><h1>{model ? 'Редактирование модели' : 'Новая модель'}</h1></div>
      <form className="work-stack" onSubmit={event => {
        event.preventDefault();
        const item = { ...value, code: value.code.trim(), title: value.title.trim(), type: value.type.trim() };
        if (!item.code || !item.title || !item.type) return setError('Заполните код, название и тип модели.');
        if (models.some(entry => entry.id !== item.id && entry.code.toLowerCase() === item.code.toLowerCase())) return setError('Модель с таким кодом уже существует.');
        onSave(item);
      }}>
        <div className="work-form-grid">
          <div className="work-panel work-stack">
            <Field label="Код модели"><input required value={value.code} onChange={event => change('code', event.target.value)} /></Field>
            <Field label="Название"><input required value={value.title} onChange={event => change('title', event.target.value)} /></Field>
            <Field label="Тип модели"><input required value={value.type} onChange={event => change('type', event.target.value)} /></Field>
            <Field label="Описание"><textarea value={value.description} onChange={event => change('description', event.target.value)} /></Field>
          </div>
          <div className="work-panel work-stack">
            <h2>Фотография</h2>
            {value.photo && <img className="work-model-photo" src={asset(value.photo)} alt="Фотография модели" />}
            <PhotoUpload onChange={photo => change('photo', photo)}>{value.photo ? 'Заменить фотографию' : 'Загрузить фотографию'}</PhotoUpload>
          </div>
        </div>
        {error && <p className="work-error" role="alert">{error}</p>}
        <div className="work-actions"><Button tone="muted" onClick={onCancel}>Отмена</Button><button className="work-button work-button--gold" type="submit">Сохранить</button></div>
      </form>
    </>
  );
}

export default function Models({ id, mode, models, instructions, onCreateInstruction, onSave, onDelete, navigate }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState('');
  const [archived, setArchived] = useState(false);
  const qrRef = useRef(null);
  const model = models.find(item => item.id === id);

  if (id === 'new' || (model && mode === 'edit')) return <ModelForm key={id} model={model} models={models} onSave={onSave} onCancel={() => navigate(model ? `/demo/models/${id}` : '/demo/models')} />;

  if (id && !model) return <p>Модель не найдена. <a href="#/demo/models">К списку моделей</a></p>;

  if (model) {
    const related = instructions.filter(item => item.modelId === model.id);
    const url = publicLink(model.id);
    function download() {
      const svg = qrRef.current;
      const blobUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${model.code}-qr.svg`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }
    return (
      <div className="work-stack">
        <div className="work-breadcrumb"><a href="#/demo/models">К списку моделей</a></div>
        <div className="work-heading"><h1>{model.code} · {model.title}</h1><a className="work-button work-button--gold" href={`#/demo/models/${model.id}/edit`}>Редактировать</a></div>
        <div className="work-form-grid">
          <div className="work-panel work-stack">
            <h2>Модель</h2>
            {model.photo && <img className="work-model-photo" src={asset(model.photo)} alt="" />}
            <p>{model.type}</p><p>{model.description}</p>
          </div>
          <div className="work-panel work-stack work-qr">
            <h2>Доступ по QR</h2>
            <QRCodeSVG ref={qrRef} value={url} size={176} marginSize={4} title="QR-код страницы модели" />
            <p className="work-muted">Изменения демо доступны в этой вкладке.</p>
            <div className="work-actions">
              <Button tone="plain" onClick={download}>Скачать QR</Button>
              <Button tone="plain" onClick={async () => {
                try { await navigator.clipboard.writeText(url); setCopied('Ссылка скопирована'); }
                catch { setCopied('Скопируйте ссылку из поля ниже'); }
              }}>Скопировать ссылку</Button>
              <a className="work-button work-button--navy" href={`#/guide/${model.id}`}>Открыть страницу</a>
            </div>
            <input aria-label="Ссылка на страницу модели" readOnly value={url} onFocus={event => event.target.select()} />
            {copied && <p role="status">{copied}</p>}
          </div>
        </div>
        <div className="work-heading"><h2>Инструкции модели</h2><Button onClick={() => onCreateInstruction(model.id)}>Создать инструкцию</Button></div>
        <Table columns={['Инструкция', 'Тип', 'Статус']} rows={related.map(item => ({ id: item.id, cells: [
          <a href={`#/demo/instructions/${item.id}`}>{item.title || 'Без названия'}</a>, item.type, <Chip value={item.status} />,
        ] }))} />
        <Button tone="danger" disabled={Boolean(related.length)} onClick={() => setConfirm(true)}>Удалить модель</Button>
        {related.length > 0 && <p className="work-muted">Перед удалением модели перенесите или удалите связанные инструкции.</p>}
        {confirm && <Modal title="Удалить модель?" subtitle={model.title} onClose={() => setConfirm(false)}><ModalActions onClose={() => setConfirm(false)}><Button tone="danger" onClick={async () => { if (await onDelete(model.id)) setConfirm(false); }}>Удалить</Button></ModalActions></Modal>}
      </div>
    );
  }

  const modelTypes = [...new Set(models.map(item => item.type))];
  const archivedCount = models.filter(item => item.archived).length;
  const list = models.filter(item => Boolean(item.archived) === archived && (!type || item.type === type) && `${item.code} ${item.title}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <>
    <div className="work-heading"><h1>Модели</h1><a className="work-button work-button--gold" href="#/demo/models/new">＋ Добавить модель</a></div>
    <div className="work-filters">
      <input aria-label="Поиск моделей" type="search" placeholder="Поиск моделей" value={search} onChange={event => setSearch(event.target.value)} />
      <Filter label="Все типы" value={type} onChange={setType} values={modelTypes} />
    </div>
    <div className="work-tabs" role="group" aria-label="Активность моделей">
      <Button tone={archived ? 'plain' : 'navy'} aria-pressed={!archived} onClick={() => setArchived(false)}>Активные {models.length - archivedCount}</Button>
      <Button tone={archived ? 'navy' : 'plain'} aria-pressed={archived} onClick={() => setArchived(true)}>Архив {archivedCount}</Button>
    </div>
    <Table panel columns={['Модель', 'Инструкции', 'Опубликовано', 'Обновлено', 'Действия']} rows={list.map(item => {
      const related = instructions.filter(entry => entry.modelId === item.id);
      return {
        id: item.id, cells: [
          <a className="work-model-link" href={`#/demo/models/${item.id}`}>
            {item.photo && <img src={asset(item.photo)} alt="" />}
            <span><strong className="d-block">{item.code}</strong>{item.title}</span>
          </a>,
          related.length,
          related.filter(entry => entry.status === statuses[3]).length,
          item.updated ? date(item.updated) : '—',
          <div className="work-actions">
            <a href={`#/demo/models/${item.id}/edit`}>Редактировать</a>
            <Button tone="plain" onClick={() => onSave({ ...item, archived: !archived }, false)}>
              {archived ? 'Восстановить' : 'В архив'}
            </Button>
          </div>,
        ],
      };
    })} empty="Модели не найдены" />
  </>;
}
