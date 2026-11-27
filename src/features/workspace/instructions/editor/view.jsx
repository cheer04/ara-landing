import './view.css';
import { reviewIssues } from './form.js';
import React, { useState } from 'react';
import { asset } from '../../../../common/assets.js';
import { newId, timestamp } from '../../../../common/records.js';
import { statuses } from '../../../../common/statuses.js';
import { types } from '../../../../common/session/instruction-types.js';
import { date } from '../../../../common/format.js';
import { Button, Chip, Field, Modal, ModalActions, PhotoUpload, PointEditor } from '../../../../common/ui.jsx';
import GuidePlayer from '../../shared/guide-player/view.jsx';

function StepForm({ step, index, total, views, onClose, onSave }) {
  const [value, setValue] = useState(step);
  const [showWarning, setShowWarning] = useState(Boolean(step.warning));
  const change = (key, next) => setValue(current => ({ ...current, [key]: next }));
  const view = views.find(item => item.id === value.viewId);

  return (
    <Modal wide title={`Шаг ${index + 1} · ${value.title || 'Добавление шага'}`} subtitle={`Шаг ${index + 1} из ${total}`} onClose={onClose}>
      <div className="work-form-grid">
        <div className="work-stack">
          <Field label="Название шага"><input value={value.title} onChange={event => change('title', event.target.value)} /></Field>
          <Field label="Тип шага">
            <select value={value.type} onChange={event => change('type', event.target.value)}>
              {['Обычный', 'Безопасность', 'Проверка'].map(type => <option key={type}>{type}</option>)}
            </select>
          </Field>
          <Field label="Текст шага"><textarea value={value.text} onChange={event => change('text', event.target.value)} /></Field>
          <Field label="Ракурс">
            <select value={value.viewId} onChange={event => setValue(current => ({ ...current, viewId: event.target.value, points: [] }))}>
              <option value="">Без ракурса</option>
              {views.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </Field>
          {value.type === 'Проверка' && <div className="work-note work-stack">
            <Field label="Вопрос"><input value={value.question ?? ''} onChange={event => change('question', event.target.value)} /></Field>
            <Field label="Ответ «Да»"><input value={value.yes ?? ''} onChange={event => change('yes', event.target.value)} /></Field>
            <Field label="Ответ «Нет»"><input value={value.no ?? ''} onChange={event => change('no', event.target.value)} /></Field>
          </div>}
          <div className="work-note work-stack">
            <label className="work-check"><input type="checkbox" checked={showWarning} onChange={event => setShowWarning(event.target.checked)} /> Предупреждение</label>
            {showWarning && <>
              <Field label="Уровень"><select value={value.level} onChange={event => change('level', event.target.value)}><option>Внимание</option><option>Опасность</option></select></Field>
              <Field label="Текст предупреждения"><textarea value={value.warning} onChange={event => change('warning', event.target.value)} /></Field>
            </>}
          </div>
        </div>
        <div className="work-stack">
          <h3>Указатель на фото</h3>
          <p>Первая точка — начало стрелки, вторая — деталь, на которую нужно указать.</p>
          <PointEditor src={view?.photo} points={value.points} onChange={points => change('points', points)} limit={2} />
        </div>
      </div>
      <ModalActions onClose={onClose}><Button onClick={() => onSave({ ...value, warning: showWarning ? value.warning : '' })}>Сохранить</Button></ModalActions>
    </Modal>
  );
}

function ViewForm({ view, index, onClose, onSave }) {
  const [value, setValue] = useState(view);
  const [editPlane, setEditPlane] = useState(view.points.length !== 4);
  return (
    <Modal wide title="Настройка ракурса" subtitle={`Ракурс ${index + 1}`} onClose={onClose}>
      <div className="work-form-grid">
        <PointEditor src={value.photo} points={value.points} limit={4} onChange={points => {
          if (editPlane) setValue(current => ({ ...current, points }));
        }} />
        <div className="work-stack">
          <Field label="Название ракурса"><input value={value.name} onChange={event => setValue({ ...value, name: event.target.value })} /></Field>
          <PhotoUpload onChange={photo => { setValue(current => ({ ...current, photo, points: [] })); setEditPlane(true); }} />
          <h3>Плоскость</h3>
          <p>{value.points.length === 4 ? 'Плоскость выделена' : 'Отметьте четыре угла одной плоской поверхности по порядку.'}</p>
          {!editPlane && <Button tone="navy" onClick={() => {
            setValue({ ...value, points: [] });
            setEditPlane(true);
          }}>Изменить плоскость</Button>}
        </div>
      </div>
      <ModalActions onClose={onClose}><Button disabled={!value.name.trim()} onClick={() => onSave(value)}>Сохранить</Button></ModalActions>
    </Modal>
  );
}

export default function InstructionEditor({ instruction, models, canApprove, onSave, onDelete, onBack }) {
  const [value, setValue] = useState(instruction);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('editor');
  const [notice, setNotice] = useState('');
  const model = models.find(item => item.id === value.modelId);
  const close = () => setModal(null);
  const change = (key, next) => {
    setValue(current => ({ ...current, [key]: next }));
    setNotice('');
  };
  const locked = value.status === statuses[2] || value.status === statuses[3];

  async function save(next = value, historyText) {
    const updated = timestamp();
    const saved = { ...next, updated, history: historyText ? [{ at: updated, text: historyText }, ...next.history] : next.history };
    if (!(await onSave(saved))) return false;
    setValue(saved);
    setNotice('Изменения сохранены');
    return true;
  }

  async function review() {
    const issues = reviewIssues(value);
    if (issues.length) {
      setModal({ type: 'error', issues });
      return;
    }
    if (await save({ ...value, status: statuses[2] }, 'Отправлено на согласование')) setModal({ type: 'review' });
  }

  function replace(key, index, item) {
    const list = [...value[key]];
    list[index] = item;
    change(key, list);
    close();
  }

  function deletePart(key, index) {
    const id = value[key][index].id;
    const list = value[key].filter(item => item.id !== id);
    setValue(current => ({
      ...current, [key]: list,
      steps: key === 'views' ? current.steps.map(step => step.viewId === id ? { ...step, viewId: '', points: [] } : step) : list,
    }));
    setNotice('');
    close();
  }

  const stepIndex = modal?.index ?? 0;
  const blankStep = () => ({
    id: newId(), title: '', text: '', type: 'Обычный', viewId: value.views[0]?.id ?? '',
    points: [], warning: '', level: 'Внимание', question: '', yes: '', no: '',
  });
  const blankView = () => ({ id: newId(), name: '', photo: model?.photo ?? '', points: [] });

  return (
    <>
      <div className="work-breadcrumb"><Button tone="plain" onClick={onBack}>К списку инструкций</Button></div>
      <div className="work-heading">
        <div><h1>{value.title || 'Новая инструкция'}</h1><Chip value={value.status} /></div>
        <div className="work-actions">
          <Button tone="plain" onClick={() => setModal({ type: 'preview' })}>Предпросмотр</Button>
          <a href={`#/demo/analytics/${value.id}`} className="work-button work-button--plain">Аналитика</a>
          {!locked && <><Button tone="navy" onClick={() => save()}>Сохранить</Button><Button onClick={review}>Отправить на согласование</Button></>}
          {value.status === statuses[2] && canApprove && <>
            <Button tone="plain" onClick={() => setModal({ type: 'return' })}>Вернуть на доработку</Button>
            <Button onClick={() => save({ ...value, status: statuses[3] }, 'Инструкция опубликована')}>Одобрить и опубликовать</Button>
          </>}
          {value.status === statuses[3] && <Button onClick={() => save({ ...value, status: statuses[0] }, 'Снято с публикации')}>Снять с публикации</Button>}
        </div>
      </div>
      {notice && <p className="work-notice" role="status">{notice}</p>}
      <div className="work-tabs">
        <Button tone={tab === 'editor' ? 'navy' : 'plain'} onClick={() => setTab('editor')}>Редактор</Button>
        <Button tone={tab === 'history' ? 'navy' : 'plain'} onClick={() => setTab('history')}>История</Button>
      </div>
      {tab === 'history' ? (
        <div className="work-panel work-stack">
          {value.history.map(({ at, text }, index) => <p key={index}><strong>{date(at)}</strong> · {text}</p>)}
          {!value.history.length && <p>История пока пуста.</p>}
        </div>
      ) : (
        <div className="work-stack">
          {locked && <p className="work-notice">{value.status === statuses[2] ? 'Редактирование приостановлено до решения.' : 'Снимите инструкцию с публикации, чтобы редактировать её.'}</p>}
          <fieldset disabled={locked} className="work-form-grid work-panel">
            <div className="work-stack">
              <Field label="Название"><input value={value.title} onChange={event => change('title', event.target.value)} /></Field>
              <Field label="Модель"><select value={value.modelId} onChange={event => change('modelId', event.target.value)}><option value="">Выберите модель</option>{models.map(item => <option key={item.id} value={item.id}>{item.code} · {item.title}</option>)}</select></Field>
              <Field label="Тип"><select value={value.type} onChange={event => change('type', event.target.value)}>{types.map(type => <option key={type}>{type}</option>)}</select></Field>
            </div>
            <div className="work-stack">
              <Field label="Что понадобится"><textarea value={value.supplies} onChange={event => change('supplies', event.target.value)} /></Field>
              <Field label="Подготовка"><textarea value={value.preparation} onChange={event => change('preparation', event.target.value)} /></Field>
              <Field label="Предупреждение"><textarea value={value.warning} onChange={event => change('warning', event.target.value)} /></Field>
            </div>
          </fieldset>
          <div className="work-panel work-stack">
            <div className="work-heading"><h2>Ракурсы</h2>{!locked && <Button onClick={() => setModal({ type: 'view', index: value.views.length, item: blankView() })}>Добавить ракурс</Button>}</div>
            <div className="work-views">
              {value.views.map((view, index) => <article className="work-view" key={view.id}>
                {view.photo && <img src={asset(view.photo)} alt="" />}<strong>{view.name}</strong>
                <div className="work-actions">{!locked && <>
                  <Button tone="plain" onClick={() => setModal({ type: 'view', index })}>Настроить</Button>
                  <Button tone="plain" onClick={() => setModal({ type: 'delete-view', index })}>Удалить</Button>
                </>}</div>
              </article>)}
              {!value.views.length && <p>Ракурсы ещё не добавлены.</p>}
            </div>
          </div>
          <div className="work-panel work-stack">
            <div className="work-heading"><h2>Шаги инструкции</h2>{!locked && <Button onClick={() => setModal({ type: 'step', index: value.steps.length, item: blankStep() })}>Добавить шаг</Button>}</div>
            {value.steps.map((step, index) => <div className="work-step" key={step.id}>
              <div><strong>Шаг {index + 1} · {step.title || 'Без названия'}</strong><p>{step.type} · {step.text}</p></div>
              {!locked && <div className="work-actions">
                <Button tone="plain" onClick={() => setModal({ type: 'step', index })}>Настроить</Button>
                <Button tone="plain" onClick={() => setModal({ type: 'delete-step', index })}>Удалить</Button>
              </div>}
            </div>)}
            {!value.steps.length && <p>Шаги ещё не добавлены.</p>}
          </div>
          {!locked && <Button tone="danger" onClick={() => setModal({ type: 'delete-instruction' })}>Удалить инструкцию</Button>}
        </div>
      )}
      {modal?.type === 'step' && <StepForm step={modal.item ?? value.steps[stepIndex]} index={stepIndex} total={Math.max(value.steps.length, stepIndex + 1)} views={value.views} onClose={close} onSave={item => replace('steps', stepIndex, item)} />}
      {modal?.type === 'view' && <ViewForm view={modal.item ?? value.views[stepIndex]} index={stepIndex} onClose={close} onSave={item => replace('views', stepIndex, item)} />}
      {modal?.type === 'preview' && <Modal title="Предпросмотр инструкции" subtitle={value.title} onClose={close}>
        <div className="work-actions work-preview-options">
          <Button tone={modal.original ? 'plain' : 'navy'} onClick={() => setModal({ ...modal, original: false })}>Уменьшенный вариант</Button>
          <Button tone={modal.original ? 'navy' : 'plain'} onClick={() => setModal({ ...modal, original: true })}>Оригинальный размер</Button>
        </div>
        <div className={modal.original ? '' : 'work-preview-small'}><GuidePlayer instruction={value} model={model} onExit={close} /></div>
      </Modal>}
      {modal?.type === 'review' && <Modal title="Инструкция на согласовании" subtitle={value.title} onClose={close}>
        <p className="work-notice">Отправлено проверяющему. Решение отобразится в истории инструкции.</p>
        <div className="work-modal-actions"><Button onClick={onBack}>К списку инструкций</Button></div>
      </Modal>}
      {modal?.type === 'error' && <Modal title="Не удалось отправить на согласование" subtitle="Заполните обязательные параметры и повторите отправку" onClose={close}>
        {modal.issues.map(([title, hint, target], index) => <div className="work-step" key={index}><div><strong>{title}</strong><p>{hint}</p></div>{target && <Button tone="plain" onClick={() => setModal(target)}>Исправить</Button>}</div>)}
        <div className="work-modal-actions"><Button onClick={close}>Вернуться к правкам</Button></div>
      </Modal>}
      {modal?.type === 'return' && <Modal title="Вернуть на доработку" onClose={close}>
        <Field label="Комментарий"><textarea value={modal.comment ?? ''} onChange={event => setModal({ ...modal, comment: event.target.value })} /></Field>
        <ModalActions onClose={close}><Button onClick={async () => {
          if (await save({ ...value, status: statuses[1] }, modal.comment || 'Возвращено на доработку')) close();
        }}>Вернуть</Button></ModalActions>
      </Modal>}
      {modal?.type.startsWith('delete-') && <Modal title={`Удалить ${{ 'delete-step': 'шаг', 'delete-view': 'ракурс', 'delete-instruction': 'инструкцию' }[modal.type]}?`} onClose={close}>
        {modal.type === 'delete-view' && <p>Указатели на этом ракурсе тоже будут удалены.</p>}
        <ModalActions onClose={close}><Button tone="danger" onClick={() => {
          if (modal.type === 'delete-instruction') onDelete();
          else deletePart(modal.type === 'delete-view' ? 'views' : 'steps', stepIndex);
        }}>Удалить</Button></ModalActions>
      </Modal>}
    </>
  );
}
