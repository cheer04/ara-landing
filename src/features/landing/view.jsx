import './view.css';
import React, { useEffect, useRef } from 'react';
import RequestForm from './request/view.jsx';
import { contactUrl, features, highlights, image, navigation, plans, workflow } from './content.js';

const footerNavigation = [
  navigation[0], ['technology', 'Технология'], navigation[1], navigation[3], navigation[4],
];

function Navigation({ label, links = navigation }) {
  return (
    <nav aria-label={label}>
      {links.map(([id, text]) => <a key={id} href={`#${id}`}>{text}</a>)}
    </nav>
  );
}

const logoUrl = `${import.meta.env.BASE_URL}images/logo.svg`;
const promoUrl = `${import.meta.env.BASE_URL}videos/promo_v1.mp4`;

function Logo() {
  return <a href="#top"><img className="logo" src={logoUrl} alt="Ара — на главную" width="92" height="64" /></a>;
}

function Hero() {
  return (
    <section className="hero dark">
      <div className="landing-container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Поддержка покупателей после продажи</p>
          <h1>Пошаговые инструкции <span>для вашей техники</span></h1>
          <p className="hero-intro">Создавайте инструкции с дополненной реальностью с помощью простого конструктора.</p>
          <div className="actions d-flex flex-wrap align-items-center gap-3">
            <a className="button" href="#request">Оставить заявку</a>
            <a className="button button--light" href="#/demo/instructions">Попробовать демо</a>
          </div>
          <p className="hero-note">Дополненная реальность · Пошаговые инструкции</p>
        </div>
        <img className="hero-image" src={image('hero')} alt="" width="2772" height="2540" fetchPriority="high" />
      </div>
    </section>
  );
}

function ParrotOutline({ className }) {
  return (
    <svg className={className} viewBox="0 0 670 790" fill="none" aria-hidden="true" focusable="false">
      <path d="M225 10C68 35 8 156 16 266c8 109 93 137 196 163C153 267 158 110 240 15 231 125 243 155 272 176c105-28 175 20 223 61C502 105 387 17 263 33c-12 51 4 111 16 145M213 429c220 12 386 97 424 361M165 433c32 166 75 263 116 357M233 435c170 80 272 225 330 355" />
      <circle cx="162" cy="156" r="21" />
    </svg>
  );
}

function Workflow() {
  return (
    <>
      <div className="highlights">
        <div className="landing-container grid-three">
          {highlights.map(([title, text]) => <div key={title}><strong>{title}</strong><p>{text}</p></div>)}
        </div>
      </div>
      <section className="workflow-section" id="how">
        <div className="landing-container section" data-reveal>
          <ParrotOutline className="workflow-mark" />
          <p className="eyebrow">Всего три шага</p>
          <h2>Как «Ара» работает для вашего бренда</h2>
          <p className="section-intro muted">Покупатели получают пошаговые подсказки под вашим брендом, а ваша команда видит, где им нужна помощь.</p>
          <div className="grid-three workflow">
            {workflow.map(({ title, text, image: graphic, width, height }) => (
              <article className="workflow-card" key={title}>
                <div className={graphic === 'qr-phone' ? 'workflow-image workflow-image--qr' : 'workflow-image'}>
                  {graphic === 'qr-phone' && <img className="guide-book" src={image('guide-book')} alt="" width="1199" height="1312" loading="lazy" />}
                  <img className="workflow-device" src={image(graphic)} alt="" width={width} height={height} loading="lazy" />
                </div>
                <div className="workflow-copy"><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const productSummary = 'Создавайте пошаговые инструкции по фото вашей техники. Покупатели открывают их по QR-коду в браузере, а вы видите в кабинете, какие проблемы они пытаются решить и где инструкция не помогает.';

function Features() {
  return (
    <section className="dark feature" id="features">
      <div className="landing-container section feature-layout" data-reveal>
        <div className="feature-copy">
          <h2>Узнайте, на каких шагах покупателям нужна помощь</h2>
          <p>{productSummary}</p>
          <ul className="checklist" id="technology">{features.map(text => <li key={text}>{text}</li>)}</ul>
        </div>
        <div className="feature-art" aria-hidden="true">
          <img className="feature-editor" src={image('editor')} alt="" width="1576" height="998" loading="lazy" />
          <img className="feature-phone" src={image('feature-phone')} alt="" width="1742" height="3609" loading="lazy" />
        </div>
        <figure className="feature-promo">
          <figcaption id="promo-title">Проморолик проекта «Ара»</figcaption>
          <video aria-labelledby="promo-title" controls playsInline preload="metadata" width="1920" height="1080">
            <source src={promoUrl} type="video/mp4" />
            <a href={promoUrl}>Открыть проморолик</a>
          </video>
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="landing-container section" data-reveal>
        <h2>О проекте</h2>
        <div className="about-route">
          <svg className="route-line" viewBox="0 0 1250 720" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
            <path d="M809 35C807 159 767 236 660 235S330 254 330 404s126 163 236 163 243 42 243 128" />
            <circle cx="809" cy="35" r="12" />
            <circle cx="330" cy="404" r="12" />
            <circle cx="809" cy="695" r="12" />
          </svg>
          <div className="about-row">
            <p><strong>Ара</strong> — платформа интерактивных руководств для производителей бытовой техники. Мы превращаем привычные инструкции в удобные пошаговые сценарии, которые помогают покупателям самостоятельно разобраться с устройством и решить возникающие проблемы.</p>
            <span className="tag">Доступ к инструкции</span>
          </div>
          <div className="about-row">
            <p>Вместо поиска информации в объёмных руководствах пользователь получает понятные подсказки прямо на смартфоне. А производитель может отслеживать прохождение инструкций, выявлять сложные этапы и узнавать, с какими трудностями сталкиваются владельцы его техники.</p>
            <span className="tag">Пошаговая помощь</span>
          </div>
          <div className="about-row">
            <p><strong>Наша цель</strong> — сделать взаимодействие с техникой проще, сократить нагрузку на службы поддержки и помочь брендам принимать решения на основе действий пользователей.</p>
            <span className="tag">Аналитика бренда</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="landing-container section pricing" id="pricing" data-reveal>
      <h2>Тарифы</h2>
      <p className="pricing-intro">{productSummary}</p>
      <div className="grid-three pricing-grid">
        {plans.map(({ name, price, limit, style }) => (
          <article key={name} className={`plan plan--${style}`}>
            <h3>{name}</h3>
            <p className="price">₽{price}<small>/месяц</small></p>
            <div className="plan-action">
              <a className="button button--neutral" href="#request" aria-label={`Обсудить тариф «${name}»`}>Начать пользоваться</a>
            </div>
            <p className="plan-limit">{limit}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Offers() {
  return (
    <section className="landing-container section offers" id="offers" aria-labelledby="offers-title">
      <h2 id="offers-title">Спецпредложения</h2>
      <div className="offer-grid">
        <article className="offer offer--dark">
          <h3>Под ключ</h3>
          <p>Доверьте подготовку интерактивного руководства нашей команде. Вы предоставляете материалы, а мы помогаем превратить их в удобную пошаговую инструкцию.</p>
          <div className="offer-actions"><strong className="price">₽15 000 за модель</strong><a className="button" href="#request">Обсудить подключение</a></div>
        </article>
        <article className="offer">
          <h3>Бесплатный пилот</h3>
          <p>Протестируйте решение на одной модели техники в течение 14 дней. Оцените, как покупатели взаимодействуют с инструкцией, и определите возможности для улучшения поддержки.</p>
          <div className="offer-actions"><a className="button" href="#request">Попробовать бесплатно</a></div>
        </article>
      </div>
    </section>
  );
}

function Apply({ onRequest }) {
  return (
    <section className="landing-container section request-panel" id="request" tabIndex={-1} aria-labelledby="request-title">
      <h2 id="request-title">Оставьте заявку</h2>
      <p>Оставьте нам свои контакты для связи и обсуждения сотрудничества</p>
      <div className="request-layout">
        <div className="request-card">
          <ParrotOutline className="request-mark" />
          <RequestForm onSend={onRequest} />
        </div>
        <div className="request-brand">
          <img src={logoUrl} alt="Ара" width="92" height="64" loading="lazy" />
          <p>Конструктор заботы о клиентах!</p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact">
      <div className="landing-container section">
        <h2>Контакты лидера</h2>
        <p>Свяжитесь с лидером проекта для обсуждения сотрудничества</p>
        <div className="contact-layout">
          <figure>
            <img className="portrait" src={image('portrait')} alt="Алексей Бабанов" width="343" height="414" loading="lazy" />
            <figcaption><strong>Бабанов Алексей</strong><span>лидер проекта</span></figcaption>
          </figure>
          <a className="contact-card" href={contactUrl} aria-label="Профиль Алексея Бабанова во ВКонтакте">
            <img src={image('contact-qr')} alt="" width="238" height="238" loading="lazy" />
            <span className="vk-mark" aria-hidden="true">ᴠκ</span>
            <span>{contactUrl}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function App({ onRequest }) {
  const header = useRef(null);
  const main = useRef(null);

  useEffect(() => {
    const headerElement = header.current;
    const mainElement = main.current;
    const landing = headerElement.parentElement;
    const updateOffset = () => {
      landing.style.setProperty('--landing-header-height', `${headerElement.offsetHeight}px`);
    };
    updateOffset();
    mainElement.querySelector(':target')?.scrollIntoView({ behavior: 'instant' });
    if (!window.ResizeObserver) return;

    const observer = new ResizeObserver(updateOffset);
    observer.observe(headerElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('section-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -48px' });

    main.current.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top">
      <header className="landing-header dark" ref={header}>
        <a className="skip-link" href="#landing-main">Перейти к содержанию</a>
        <div className="landing-container site-header">
          <Logo />
          <Navigation label="Основная навигация" />
        </div>
      </header>
      <main className="landing-main" id="landing-main" tabIndex={-1} ref={main}>
        <Hero />
        <Workflow />
        <Features />
        <About />
        <Pricing />
        <Offers />
        <div className="dark landing-end">
          <Apply onRequest={onRequest} />
          <Contact />
        </div>
      </main>
      <footer className="site-footer">
        <div className="landing-container site-header"><Logo /><Navigation label="Навигация в подвале" links={footerNavigation} /></div>
      </footer>
    </div>
  );
}
