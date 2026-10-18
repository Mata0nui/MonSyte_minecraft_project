import React, { useEffect, useMemo, useRef, useState } from 'react';

const featureItems = [
  {
    id: 'chunk-loader', title: 'Личный чанклоадер', subtitle: 'Авто-фарм даже в оффлайне', price: 85, category: 'utilities', tag: 'Утилита', icon: '📦', tone: 'cyan',
    desc: 'Держит прогруженными 3×3 чанка вокруг вашей базы или фермы, даже когда вас нет в сети.',
    features: ['Прогрузка 9 чанков', 'Работает в оффлайне', 'Защита от сбоев сервера'],
  },
  {
    id: 'auto-seller', title: 'Авто-продавец сундуков', subtitle: 'Автоматическая продажа лута', price: 120, category: 'utilities', tag: 'Экономика', icon: '💰', tone: 'green',
    desc: 'Подключается к сундуку на вашей ферме и автоматически продаёт накопленные ресурсы на рынке.',
    features: ['Автоматический выкуп', 'Упрощение торговли', 'Фильтры предметов'],
  },
  {
    id: 'pet-dragon', title: 'Мэгги и дракончик', subtitle: 'Питомцы с боевыми баффами', price: 95, category: 'gadgets', tag: 'Питомцы', icon: '🐉', tone: 'purple',
    desc: 'Два уникальных спутника для приключений. Описание эффектов и характеристик нужно подтвердить настройками сервера.',
    features: ['Парящий 3D-питомец', 'Визуальное сопровождение', 'Помощь в сборе лута'],
  },
  {
    id: 'booster-exp', title: 'Бустер опыта ×2 (24 ч)', subtitle: 'Множитель опыта для всех', price: 40, category: 'boosters', tag: 'Бустер', icon: '⚡', tone: 'gold',
    desc: 'Демонстрационная карточка бустера опыта. Реальный множитель должен быть подключён на стороне Minecraft-сервера.',
    features: ['Множитель EXP ×2', 'Длительность 24 часа', 'Оповещение в чате сервера'],
  },
  {
    id: 'grappling-hook', title: 'Зачарованный крюк-кошка', subtitle: 'Быстрое перемещение', price: 65, category: 'gadgets', tag: 'Гаджет', icon: '🪝', tone: 'pink',
    desc: 'Гаджет для быстрого перемещения к зданиям, скалам и деревьям — при условии поддержки такой механики сервером.',
    features: ['Удобное перемещение', 'Прочность по настройкам сервера', 'Анимация полёта'],
  },
  {
    id: 'animated-tags', title: 'Набор анимированных титулов', subtitle: 'Градиенты и сияние в чате', price: 75, category: 'chat', tag: 'Чат', icon: '✨', tone: 'red',
    desc: 'Набор декоративных титулов для чата и имени персонажа. Доступность зависит от плагинов сервера.',
    features: ['15 вариантов титулов', 'Градиентный текст', 'Стилизация ника'],
  },
  {
    id: 'dragon-wings', title: 'Крылья драконьего огня', subtitle: 'Партиклы и эффекты следа', price: 110, category: 'chat', tag: 'Эффект', icon: '🪽', tone: 'purple',
    desc: 'Декоративный эффект крыльев и частиц вокруг персонажа для индивидуального стиля.',
    features: ['Свечение и частицы', 'След при движении', 'Настраиваемая интенсивность'],
  },
  {
    id: 'mythic-case', title: 'Кейс с достижениями', subtitle: 'Сундук с ценным лутом', price: 50, category: 'crates', tag: 'Кейсы', icon: '🗝️', tone: 'green',
    desc: 'Демонстрация кейса с возможными предметами. Реальный состав, шансы выпадения и дубликаты следует настроить прозрачно на сервере.',
    features: ['Эффект открытия', 'Список возможных призов', 'Настраиваемые шансы'],
  },
];

const filters = [
  { id: 'all', label: 'Все фишки', icon: '▦' },
  { id: 'boosters', label: 'Бустеры и экономика', icon: '⚡' },
  { id: 'gadgets', label: 'Гаджеты и питомцы', icon: '🐉' },
  { id: 'utilities', label: 'Утилиты и приваты', icon: '📦' },
  { id: 'chat', label: 'Чат и эффекты', icon: '✨' },
  { id: 'crates', label: 'Кейсы', icon: '🗝️' },
];

function TrailCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    window.addEventListener('resize', resize);

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      for (let i = 0; i < 3; i += 1) {
        particlesRef.current.push({
          x: pointerRef.current.x, y: pointerRef.current.y,
          vx: (Math.random() - 0.5) * 2.8, vy: (Math.random() - 0.5) * 2.8,
          size: Math.random() * 3.3 + 1.4,
          color: ['#14213d', '#fca311', '#9b75ce', '#06b6d4'][Math.floor(Math.random() * 4)], alpha: 1,
        });
      }
      if (particlesRef.current.length > 260) particlesRef.current.splice(0, particlesRef.current.length - 260);
    };
    const onPointerLeave = () => { pointerRef.current = { x: -999, y: -999 }; };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.04);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.alpha -= 0.013;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="feature-trail-canvas" aria-label="Интерактивный след частиц: двигайте курсором по полю" />;
}

export default function FeaturesPage({ search, onSearchChange, onCopyIP, serverIP }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [demo, setDemo] = useState('particles');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelBusy, setWheelBusy] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nickname, setNickname] = useState('');
  const [payment, setPayment] = useState('card');
  const [message, setMessage] = useState('');
  const [boosterSeconds, setBoosterSeconds] = useState(4 * 3600 + 22 * 60 + 18);

  useEffect(() => {
    const timer = window.setInterval(() => setBoosterSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedBoosterTime = useMemo(() => {
    const h = Math.floor(boosterSeconds / 3600);
    const m = Math.floor((boosterSeconds % 3600) / 60);
    const s = boosterSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(' : ');
  }, [boosterSeconds]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru');
    return featureItems.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const searchable = [item.title, item.subtitle, item.tag, item.desc, ...item.features].join(' ').toLocaleLowerCase('ru');
      return matchesFilter && (!query || searchable.includes(query));
    });
  }, [activeFilter, search]);

  const openItem = (item) => {
    setSelectedItem(item);
    setNickname('');
    setPayment('card');
    setMessage('');
  };

  const spinWheel = () => {
    if (wheelBusy) return;
    setWheelBusy(true);
    setWheelRotation((current) => current + 1800 + Math.floor(Math.random() * 360));
    window.setTimeout(() => setWheelBusy(false), 4200);
  };

  const submitPurchase = (event) => {
    event.preventDefault();
    if (!nickname.trim()) {
      setMessage('Введите свой игровой ник.');
      return;
    }
    setMessage(`Выбрано: «${selectedItem.title}» для игрока ${nickname.trim()}, оплата: ${payment === 'card' ? 'карта UAH' : 'криптовалюта'}. Реальная оплата и выдача пока не подключены; покупка не совершена.`);
  };

  const openBooster = () => openItem(featureItems.find((item) => item.id === 'booster-exp'));

  return (
    <main className="features-page">
      <div className="feature-booster-bar">
        <div className="feature-booster-left">
          <span className="feature-booster-badge"><span>⚡</span> БУСТЕР АКТИВЕН · ДЕМО</span>
          <span>Множитель <strong>×2 опыта и монет</strong> — пример активного события игрока <b>Alex_Gamer</b>.</span>
        </div>
        <div className="feature-booster-right"><span>Осталось <strong>{formattedBoosterTime}</strong></span><button type="button" onClick={openBooster}>Запустить свой бустер →</button></div>
      </div>

      <section className="features-hero">
        <div className="features-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> ДОПОЛНИТЕЛЬНЫЕ ВОЗМОЖНОСТИ</span>
          <h1>Прокачай свою игру <span>до максимума</span></h1>
          <p>Авто-продавцы, чанклоадеры, питомцы, эффекты частиц и титулы в чате. Изучи возможности, просмотри демонстрации и выбери то, что подходит твоему стилю игры.</p>
          <div className="features-hero-tags">
            <span>✓ Утилиты для ферм</span><span>✦ Питомцы и эффекты</span><span>⚡ Бустеры и экономика</span>
          </div>
          <div className="features-hero-actions">
            <button type="button" className="feature-primary-btn" onClick={() => document.getElementById('feature-catalog')?.scrollIntoView({ behavior: 'smooth' })}>Посмотреть каталог <span>↓</span></button>
            <span className="features-ip-label">IP сервера <strong>{serverIP}</strong></span>
          </div>
        </div>

        <section className="feature-lab" aria-label="Интерактивная демонстрация">
          <div className="feature-lab-head"><div><span className="feature-lab-dot" /> ПРЕДПРОСМОТР</div><span className="feature-lab-tag">{demo === 'particles' ? 'ЧАСТИЦЫ' : demo === 'title' ? 'ТИТУЛЫ' : 'КОЛЕСО'}</span></div>
          <div className="feature-lab-tabs" role="group" aria-label="Выбрать демонстрацию">
            <button type="button" className={demo === 'particles' ? 'active' : ''} onClick={() => setDemo('particles')}>✦ Эффекты</button>
            <button type="button" className={demo === 'title' ? 'active' : ''} onClick={() => setDemo('title')}>Aa Титулы</button>
            <button type="button" className={demo === 'wheel' ? 'active' : ''} onClick={() => setDemo('wheel')}>◉ Колесо</button>
          </div>
          <div className="feature-lab-stage">
            {demo === 'particles' && <><TrailCanvas /><p>Двигай курсором по полю — частицы следуют за движением.</p></>}
            {demo === 'title' && (
              <div className="feature-chat-demo">
                <div><time>12:44:02</time><strong className="chat-rank-mythic">👑 МИФИЧЕСКИЙ</strong><b>Steve_Pro</b><span>Продам авто-продавец сундуков на спавне! 🔥</span></div>
                <div><time>12:44:15</time><strong className="chat-rank-dragon">🐉 ПОВЕЛИТЕЛЬ</strong><b>Alex_Gamer</b><span>Мой дракончик готов к приключениям! ⛏️</span></div>
                <small>Пример оформления титулов в чате.</small>
              </div>
            )}
            {demo === 'wheel' && (
              <div className="feature-wheel-demo">
                <div className="feature-wheel-pointer">▼</div>
                <div className="feature-wheel" style={{ transform: `rotate(${wheelRotation}deg)` }}><span>🎁</span><b>КЕЙС МИФОВ</b><i>✦</i></div>
                <button type="button" className="feature-spin-btn" disabled={wheelBusy} onClick={spinWheel}>{wheelBusy ? 'Колесо вращается…' : '↻ Испытать удачу'}</button>
                <small>Демонстрация вращения без выдачи реальных призов.</small>
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="feature-catalog" id="feature-catalog">
        <div className="feature-catalog-heading"><div><span className="eyebrow">МАГАЗИН СЕРВЕРА</span><h2>Фишки и утилиты</h2><p>Выбери дополнительную возможность для своего игрового опыта.</p></div><span className="feature-result-count">{visibleItems.length} из {featureItems.length} предложений</span></div>
        <div className="feature-filters" role="group" aria-label="Фильтр предложений">
          {filters.map((filter) => <button key={filter.id} type="button" className={activeFilter === filter.id ? 'active' : ''} onClick={() => setActiveFilter(filter.id)}><span>{filter.icon}</span>{filter.label}</button>)}
        </div>
        <section className="feature-card-grid" aria-label="Каталог дополнительных возможностей">
          {visibleItems.map((item) => (
            <article key={item.id} className={`feature-product-card feature-tone-${item.tone}`}>
              <div className="feature-product-head"><div className="feature-product-icon">{item.icon}</div><span className="feature-product-tag">{item.tag}</span></div>
              <h3>{item.title}</h3><p className="feature-product-subtitle">{item.subtitle}</p><p className="feature-product-desc">{item.desc}</p>
              <ul>{item.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
              <div className="feature-product-footer"><div><small>ЦЕНА</small><strong>{item.price} грн</strong></div><button type="button" onClick={() => openItem(item)}>Подробнее / Купить <span>→</span></button></div>
            </article>
          ))}
          {visibleItems.length === 0 && <div className="feature-no-results"><span>⌕</span><h3>Ничего не найдено</h3><p>Попробуй другой запрос или категорию.</p><button type="button" onClick={() => { setActiveFilter('all'); onSearchChange(''); }}>Сбросить фильтры</button></div>}
        </section>
      </section>

      {selectedItem && (
        <div className="feature-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedItem(null); }}>
          <section className="feature-buy-modal" role="dialog" aria-modal="true" aria-labelledby="feature-modal-title">
            <button type="button" className="feature-modal-close" onClick={() => setSelectedItem(null)} aria-label="Закрыть">×</button>
            <div className={`feature-modal-product-icon feature-tone-${selectedItem.tone}`}>{selectedItem.icon}</div>
            <span className="feature-modal-kicker">ОФОРМЛЕНИЕ ДОПОЛНИТЕЛЬНОЙ ФИШКИ</span>
            <h2 id="feature-modal-title">{selectedItem.title}</h2><p className="feature-modal-price">{selectedItem.price} грн</p><p className="feature-modal-description">{selectedItem.desc}</p>
            <ul className="feature-modal-list">{selectedItem.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
            <form onSubmit={submitPurchase} className="feature-modal-form">
              <label htmlFor="feature-nickname">Игровой ник</label><input id="feature-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Например, Steve_Pro" required autoComplete="off" />
              <span className="feature-payment-label">Способ оплаты</span>
              <div className="feature-payment-options"><button type="button" className={payment === 'card' ? 'active' : ''} onClick={() => setPayment('card')}>▣ Карта (UAH)</button><button type="button" className={payment === 'crypto' ? 'active' : ''} onClick={() => setPayment('crypto')}>₿ Криптовалюта</button></div>
              <button type="submit" className="feature-modal-submit">Подготовить заявку · {selectedItem.price} грн</button>
              {message && <p className="feature-modal-message" role="status">{message}</p>}
              <p className="feature-modal-disclaimer">Это только интерфейс заявки. Онлайн-оплата и автоматическая выдача пока не подключены.</p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
