import './view.css';
import React, { useRef, useState } from 'react';
import { asset } from '../../../../common/assets.js';
import { newId, timestamp } from '../../../../common/records.js';
import { Button, PointPhoto } from '../../../../common/ui.jsx';

export default function GuidePlayer({ instruction, model, onExit, onSession, onMessage }) {
  const [index, setIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const started = useRef(0);
  const saved = useRef(false);
  const saving = useRef(false);
  const step = instruction.steps[index];
  const view = instruction.views.find(item => item.id === step?.viewId);
  const needsCleaning = instruction.id === 'cleaning' && Object.values(answers).some(item => item.yes);

  async function record(status, choices) {
    if (!onSession || !started.current || saved.current) return true;
    if (saving.current) return false;
    saving.current = true;
    saved.current = await onSession({
      id: newId(), instructionId: instruction.id, at: timestamp(), status,
      answer: Object.values(choices).map(choice => choice.label).join(' · '),
      seconds: Math.floor((Date.now() - started.current) / 1000), step: index + 1,
    });
    saving.current = false;
    return saved.current;
  }

  async function next(choice) {
    const choices = choice ? { ...answers, [step.id]: choice } : answers;
    setAnswers(choices);
    if (index + 1 < instruction.steps.length) {
      setIndex(index + 1);
      return;
    }
    if (!(await record('Завершено', choices))) return;
    setResult(true);
  }

  function start() {
    if (!started.current) started.current = Date.now();
    setIndex(0);
  }

  async function leave() {
    if (await record('Прервано', answers)) onExit();
  }

  return (
    <div className="guide-phone">
      <div className="guide-header"><img src={asset('images/logo.png')} alt="Ара" /><Button onClick={leave}>На главную</Button></div>
      <div className="guide-body">
        {result ? (
          <>
            <h2>{needsCleaning ? 'Нужна дальнейшая очистка' : 'Инструкция завершена'}</h2>
            <p>{needsCleaning ? 'Для дальнейших действий следуйте руководству производителя вашей модели.' : 'Вы прошли все шаги инструкции.'}</p>
            <Button onClick={leave}>К списку инструкций</Button>
          </>
        ) : index === -1 ? (
          <>
            <p className="guide-label">{model?.code} {model?.title}</p>
            <h2>{instruction.title}</h2>
            <h3>Перед началом</h3>
            {instruction.supplies && <div className="guide-note"><strong>Что понадобится</strong><p>{instruction.supplies}</p></div>}
            {instruction.preparation && <div className="guide-note"><strong>Подготовка</strong><p>{instruction.preparation}</p></div>}
            {instruction.warning && <div className="guide-note guide-warning"><strong>Обратите внимание!</strong><p>{instruction.warning}</p></div>}
            <Button disabled={!instruction.steps.length} onClick={start}>Начать инструкцию</Button>
          </>
        ) : (
          <>
            <p className="guide-label">Шаг {index + 1}/{instruction.steps.length}</p>
            {view?.photo && <PointPhoto src={view.photo} points={step.points} />}
            <h2>{step.title}</h2>
            <p>{step.text}</p>
            {step.warning && <div className="guide-note guide-warning"><strong>{step.level}</strong><p>{step.warning}</p></div>}
            <div className="work-actions">
              <Button tone="plain" onClick={() => {
                setAnswers(current => Object.fromEntries(Object.entries(current).filter(([id]) =>
                  instruction.steps.slice(0, index - 1).some(item => item.id === id)
                )));
                setIndex(index - 1);
              }}>Назад</Button>
              {step.type !== 'Проверка' && <Button onClick={() => next()}>{index + 1 === instruction.steps.length ? 'Завершить' : 'Далее'}</Button>}
            </div>
            {step.type === 'Проверка' && (
              <div className="guide-note">
                <strong>{step.question || 'Условие выполнено?'}</strong>
                <div className="work-actions">
                  <Button tone="navy" onClick={() => next({ yes: true, label: step.yes || 'Да' })}>{step.yes || 'Да'}</Button>
                  <Button onClick={() => next({ yes: false, label: step.no || 'Нет' })}>{step.no || 'Нет'}</Button>
                </div>
              </div>
            )}
          </>
        )}
        {messageSent && <p role="status">Сообщение добавлено в кабинет.</p>}
        {onMessage && feedback === null && <Button tone="plain" onClick={() => { setMessageSent(false); setFeedback(''); }}>Оставить сообщение</Button>}
        {feedback !== null && (
          <form className="work-stack" onSubmit={async event => {
            event.preventDefault();
            if (!feedback.trim()) return;
            const ok = await onMessage({
              id: newId(), instructionId: instruction.id, title: 'Сообщение по инструкции', text: feedback.trim(),
              status: 'Новое', at: timestamp(), reply: '',
            });
            if (ok) {
              setFeedback(null);
              setMessageSent(true);
            }
          }}>
            <label className="work-field"><span>Сообщение</span><textarea value={feedback} onChange={event => setFeedback(event.target.value)} required /></label>
            <div className="work-actions"><Button tone="plain" onClick={() => setFeedback(null)}>Отмена</Button><button className="work-button work-button--gold" type="submit">Отправить</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
