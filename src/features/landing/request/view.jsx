import React, { useState } from 'react';
import { newId, timestamp } from '../../../common/records.js';
import { Field } from '../../../common/ui.jsx';

export default function RequestForm({ onSend }) {
  const [status, setStatus] = useState('idle');
  return (
    <form className="request-form" aria-labelledby="request-title" aria-describedby="request-note" onSubmit={async event => {
      event.preventDefault();
      if (status === 'sending') return;
      const form = event.currentTarget;
      const values = new FormData(form);
      const name = values.get('name').trim();
      const email = values.get('email').trim();
      const company = values.get('company').trim();
      if (!name || !email || !company) {
        setStatus('invalid');
        return;
      }
      setStatus('sending');
      const ok = await onSend({
        id: newId(), instructionId: null, title: `Заявка · ${company}`,
        text: [name, email, values.get('comment').trim()].filter(Boolean).join(' · '),
        status: 'Новое', reply: '', at: timestamp(),
      });
      if (ok) form.reset();
      setStatus(ok ? 'sent' : 'error');
    }}>
      <p className="request-note" id="request-note">В демоверсии заявка сохраняется в кабинете в этой вкладке.</p>
      <div className="request-fields">
        <Field label={<>ФИО <span className="required-mark" aria-hidden="true">*</span></>}><input name="name" autoComplete="name" maxLength="100" required /></Field>
        <Field label={<>Компания <span className="required-mark" aria-hidden="true">*</span></>}><input name="company" autoComplete="organization" maxLength="150" required /></Field>
        <Field label={<>Электронная почта <span className="required-mark" aria-hidden="true">*</span></>}><input name="email" type="email" autoComplete="email" maxLength="254" required /></Field>
      </div>
      <Field label="Комментарий"><textarea name="comment" rows="3" maxLength="2000" /></Field>
      <div className="actions d-flex flex-wrap align-items-center gap-3">
        <button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}</button>
        {status === 'sent' && <p role="status">Заявка сохранена в демо-кабинете этой вкладки.</p>}
        {status === 'invalid' && <p role="alert">Заполните имя, компанию и электронную почту.</p>}
        {status === 'error' && <p role="alert">Не удалось отправить заявку. Попробуйте ещё раз.</p>}
      </div>
    </form>
  );
}
