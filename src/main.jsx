import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import ModesPage from './ModesPage';
import SpacePage from './SpacePage';
import FeaturesPage from './FeaturesPage';
import SkinsPage from './SkinsPage';

const SERVER_IP = 'mc.zalupaserver.net';
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1G3knzJnXE4m4QRn6HfSQwpSCMrmobUDW?usp=drive_link';
const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
const ADSENSE_SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID || '';
const ADSENSE_ENABLED = /^ca-pub-\d+$/.test(ADSENSE_CLIENT_ID) && /^\d+$/.test(ADSENSE_SLOT_ID);

const categories = [
  { id: 'modes', icon: '/icons/modes.png', label: 'режимы' },
  { id: 'world', icon: '/icons/world.png', label: 'пространство' },
  { id: 'privileges', icon: '/icons/privileges.png', label: 'привилегии' },
  { id: 'skins', icon: '/icons/skins.png', label: 'скины' },
  { id: 'features', icon: '/icons/features.png', label: 'другие фишки' },
  { id: 'servers', icon: '/icons/servers.png', label: 'другие сервера' },
];

const ranks = [
  {
    id: 'loh', name: 'Лох', price: 50, icon: '/charcoal.png', color: 'rank-gray', prefix: '[Лох]', fly: false, homes: 2, kit: '/kit basic',
    perks: ['Префикс [Лох] в чате', '2 точки дома (/sethome)', 'Стартовый набор ресурсов (/kit basic)', 'Доступ к базовым удобным командам'],
  },
  {
    id: 'normis', name: 'Нормис', price: 67, icon: '/flint.png', color: 'rank-stone', prefix: '[Нормис]', fly: false, homes: 3, kit: '/kit normis',
    perks: ['Префикс [Нормис] в чате', '3 точки дома (/sethome)', 'Улучшенный набор ресурсов (/kit normis)', 'Дополнительные команды сервера'],
  },
  {
    id: 'standard', name: 'Стандарт', price: 90, icon: '/iron_nugget.png', color: 'rank-iron', prefix: '[Стандарт]', fly: false, homes: 5, kit: '/kit standard',
    perks: ['Префикс [Стандарт] в чате', '5 точек дома (/sethome)', 'Набор ресурсов (/kit standard)', 'Дополнительные возможности чата'],
  },
  {
    id: 'standard-plus', name: 'Чуть выше Стандарта', shortName: 'Стандарт+', price: 110, icon: '/gold_ingot.png', color: 'rank-gold', prefix: '[Стандарт+]', fly: false, homes: 7, kit: '/kit standard_plus',
    perks: ['Префикс [Стандарт+] в чате', '7 точек дома (/sethome)', 'Золотой набор ресурсов', 'Доступ к дополнительным удобным командам'],
  },
  {
    id: 'cool', name: 'Ого, а ты крутой', price: 130, icon: '/golden_apple.png', color: 'rank-apple', prefix: '[Крутой]', fly: true, homes: 10, kit: '/kit cool',
    perks: ['Префикс [Крутой] в чате', 'Доступ к полёту (/fly)', '10 точек дома (/sethome)', 'Набор ресурсов (/kit cool)'],
  },
  {
    id: 'vip', name: 'VIP', price: 150, icon: '/totem_of_undying.png', color: 'rank-vip', prefix: '[VIP]', fly: true, homes: 15, kit: '/kit vip',
    perks: ['Префикс [VIP] в чате', 'Доступ к /fly в разрешённых зонах', '15 точек дома (/sethome)', 'VIP-набор ресурсов (/kit vip)'],
  },
  {
    id: 'pro', name: 'PRO', price: 200, icon: '/golden_apple.png', color: 'rank-pro', prefix: '[PRO]', fly: true, homes: 25, kit: '/kit pro',
    perks: ['Префикс [PRO] в чате', 'Доступ к полёту (/fly)', '25 точек дома (/sethome)', 'Расширенный набор ресурсов (/kit pro)'],
  },
  {
    id: 'hacker', name: 'Hacker', price: 666, icon: '/totem_of_undying.png', color: 'rank-hacker', prefix: '[HACKER]', fly: true, homes: 99, kit: '/kit hacker', featured: true,
    perks: ['Особый префикс [HACKER]', 'Доступ к /fly', 'До 99 точек дома (/sethome)', 'Эксклюзивный набор ресурсов (/kit hacker)', 'Дополнительные команды сервера'],
  },
];

function AdSpace({ slide, setSlide }) {
  useEffect(() => {
    if (!ADSENSE_ENABLED) return undefined;

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.info('AdSense is ready, but no ad has been filled yet.', error);
      }
    };

    let script = document.getElementById('google-adsense-script');
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      script.onload = pushAd;
      document.head.appendChild(script);
    } else if (window.adsbygoogle) {
      pushAd();
    }
    return undefined;
  }, []);

  if (ADSENSE_ENABLED) {
    return (
      <aside className="sidebar sidebar-adsense" aria-label="Реклама Google AdSense">
        <div className="adsense-slot-wrap">
          <ins className="adsbygoogle adsense-slot" style={{ display: 'block' }} data-ad-client={ADSENSE_CLIENT_ID} data-ad-slot={ADSENSE_SLOT_ID} data-ad-format="auto" data-full-width-responsive="true" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar" aria-label="Место для будущей рекламы">
      <div className={`ad-screen ad-screen-${slide + 1}`}>
        <div className="ad-placeholder-copy">
          <span className="ad-placeholder-title">РЕКЛАМА</span>
          <span className="ad-placeholder-subtitle">Здесь появится рекламный блок</span>
        </div>
      </div>
      <div className="pagination-bar" aria-label="Предпросмотр рекламы">
        {[0, 1, 2, 3].map((n) => (
          <button type="button" key={n} className={`pagination-dot ${slide === n ? 'active' : ''}`} onClick={() => setSlide(n)} aria-label={`Цвет рекламного блока ${n + 1}`} />
        ))}
      </div>
    </aside>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [ipText, setIpText] = useState(SERVER_IP);
  const [search, setSearch] = useState('');
  const [selectedRank, setSelectedRank] = useState(ranks[0]);
  const [viewMode, setViewMode] = useState('cards');
  const [modalRank, setModalRank] = useState(null);
  const [nickname, setNickname] = useState('');
  const [period, setPeriod] = useState('30');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [adSlide, setAdSlide] = useState(0);

  useEffect(() => {
    if (ADSENSE_ENABLED) return undefined;
    const timer = setInterval(() => setAdSlide((current) => (current + 1) % 4), 3500);
    return () => clearInterval(timer);
  }, []);

  const filteredRanks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ranks;
    return ranks.filter((rank) => `${rank.name} ${rank.shortName || ''} ${rank.price} ${rank.prefix} ${rank.perks.join(' ')}`.toLowerCase().includes(q));
  }, [search]);

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      setIpText('Скопировано!');
    } catch {
      setIpText('mc.zalupaserver.net');
    }
    window.setTimeout(() => setIpText(SERVER_IP), 1500);
  };

  const openPrivileges = () => {
    setPage('privileges');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModes = () => {
    setPage('modes');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSkins = () => {
    setPage('skins');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openFeatures = () => {
    setPage('features');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSpace = () => {
    setPage('space');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHome = () => {
    setPage('home');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToQuickShop = () => {
    document.getElementById('quick-shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openPurchaseModal = (rank) => {
    setModalRank(rank);
    setNickname('');
    setPeriod('30');
    setCheckoutMessage('');
  };

  const closePurchaseModal = () => {
    setModalRank(null);
    setCheckoutMessage('');
  };

  const submitPurchase = (event) => {
    event.preventDefault();
    if (!nickname.trim() || !modalRank) return;
    setCheckoutMessage(`Заявка подготовлена для игрока ${nickname.trim()}. Реальная оплата пока не подключена — покупка не совершена.`);
  };

  return (
    <div className="site-shell">
      <div className="layout-container">
        <header className="site-header">
          <button className="brand-logo" type="button" onClick={openHome} aria-label="На главную">MonSyte</button>
          <button className="ip-widget" type="button" onClick={copyIP}>{ipText}</button>
          <div className="search-bar">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder={page === 'privileges' ? 'поиск привилегий' : page === 'modes' ? 'поиск режима' : page === 'space' ? 'поиск пространства' : page === 'features' ? 'поиск фишек и утилит' : page === 'skins' ? 'поиск скинов, плащей и аксессуаров' : 'поиск'} aria-label="Поиск по сайту" />
          </div>
        </header>

        <nav className="site-nav" aria-label="Главная навигация">
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={openHome}>Главная</button>
          <button className={page === 'modes' ? 'nav-link active' : 'nav-link'} onClick={openModes}>Режимы</button>
          <button className={page === 'space' ? 'nav-link active' : 'nav-link'} onClick={openSpace}>Пространство</button>
          <button className={page === 'privileges' ? 'nav-link active' : 'nav-link'} onClick={openPrivileges}>Привилегии</button>
          <button className={page === 'skins' ? 'nav-link active' : 'nav-link'} onClick={openSkins}>Скины</button>
          <button className={page === 'features' ? 'nav-link active' : 'nav-link'} onClick={openFeatures}>Другие фишки</button>
          <button className="nav-link" onClick={openHome}>Другие сервера</button>
        </nav>

        {page === 'home' ? (
          <main className="home-page">
            <section className="home-hero">
              <div className="home-hero-copy">
                <span className="eyebrow home-eyebrow"><span className="eyebrow-dot" /> MINECRAFT-СЕРВЕР · MONSYTE</span>
                <h1>Твой мир.<br /><span>Твои правила.</span></h1>
                <p>Исследуй мир, выбирай режим, создавай свой стиль и собирай приключения вместе с друзьями.</p>
                <div className="home-hero-actions">
                  <button className="home-primary-btn" type="button" onClick={copyIP}><span className="home-btn-icon" aria-hidden="true">⌘</span>{ipText === SERVER_IP ? 'Скопировать IP' : ipText}</button>
                  <button className="home-secondary-btn" type="button" onClick={openModes}>Выбрать режим <span aria-hidden="true">↗</span></button>
                </div>
                <div className="home-hero-meta">
                  <span><strong>{categories.length}</strong> разделов</span>
                  <i />
                  <span><strong>{ranks.length}</strong> рангов</span>
                  <i />
                  <span><span className="online-pulse" /> Java Edition</span>
                </div>
              </div>
              <div className="home-hero-visual" aria-label="Информация о сервере">
                <div className="home-visual-grid" aria-hidden="true" />
                <div className="home-visual-orbit orbit-one" />
                <div className="home-visual-orbit orbit-two" />
                <div className="home-world-emblem"><img src="/icons/world.png" alt="" draggable="false" /></div>
                <div className="home-floating-tag home-tag-top"><span className="home-tag-dot" /> ТВОЁ ПРИКЛЮЧЕНИЕ</div>
                <div className="home-server-chip"><span className="home-server-chip-mark">Z</span><span><small>АДРЕС СЕРВЕРА</small><strong>{SERVER_IP}</strong></span><button type="button" onClick={copyIP} aria-label="Скопировать IP сервера">⧉</button></div>
                <div className="home-floating-tag home-tag-bottom"><span aria-hidden="true">✦</span> PLAY · CREATE · EXPLORE</div>
              </div>
            </section>

            <section className="home-categories-section" aria-labelledby="home-categories-title">
              <div className="home-section-heading">
                <div><span className="eyebrow">НАЧНИ ОТСЮДА</span><h2 id="home-categories-title">Открой свой раздел</h2><p>Всё, что нужно для игры, — собрано в одном месте.</p></div>
                <span className="home-section-count">01 <i /> 06</span>
              </div>
              <div className="home-category-grid">
                {categories.map(({ id, icon, label }, index) => {
                  const descriptions = {
                    modes: 'Выбери игровой режим и найди новый способ играть.',
                    world: 'Исследуй пространство, строй и открывай новые места.',
                    privileges: 'Узнай о рангах, командах и дополнительных возможностях.',
                    skins: 'Подбери скин, плащ или аксессуар под свой стиль.',
                    features: 'Полезные инструменты и дополнительные фишки сервера.',
                    servers: 'Знакомься с другими серверами и игровыми мирами.',
                  };
                  const openCategory = id === 'privileges' ? openPrivileges : id === 'modes' ? openModes : id === 'world' ? openSpace : id === 'features' ? openFeatures : id === 'skins' ? openSkins : () => setPage('home');
                  return (
                    <button key={id} type="button" className={`home-category-card home-category-${id}`} onClick={openCategory}>
                      <span className="home-category-top"><span className="home-category-index">0{index + 1} / РАЗДЕЛ</span><span className="home-category-arrow" aria-hidden="true">↗</span></span>
                      <span className="home-category-main"><span className="home-category-icon"><img src={icon} alt="" draggable="false" /></span><span className="home-category-text"><strong>{label}</strong><span>{descriptions[id]}</span></span></span>
                      <span className="home-category-bottom"><span>Открыть раздел</span><span aria-hidden="true">→</span></span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="home-store-section" id="quick-shop">
              <div className="home-section-heading home-store-heading">
                <div><span className="eyebrow">МАГАЗИН СЕРВЕРА</span><h2>Выбери свою привилегию</h2><p>Сравни ранги и посмотри, какие возможности в них входят.</p></div>
                <button className="home-text-link" type="button" onClick={openPrivileges}>Все привилегии <span aria-hidden="true">→</span></button>
              </div>
              <main className="main-content home-main">
                <section className="shop-section" aria-label="Быстрый выбор привилегии">
                  <div className="home-rank-picker-heading"><span>ДОСТУПНЫЕ РАНГИ</span><span>{ranks.length} вариантов</span></div>
                  <div className="quick-rank-list">
                    {ranks.map((rank) => (
                      <button key={rank.id} type="button" className={`quick-rank-item ${selectedRank.id === rank.id ? 'active' : ''}`} onClick={() => setSelectedRank(rank)}>
                        <span className="quick-rank-left"><img src={rank.icon} alt="" className="privilege-icon" /><span>{rank.name}</span></span>
                        <span className="home-rank-price">{rank.price} грн</span>
                        <span className="quick-rank-check">{selectedRank.id === rank.id ? '✓' : ''}</span>
                      </button>
                    ))}
                  </div>
                  <div className="quick-shop-details">
                    <div className="commands-info">
                      <strong>Возможности «{selectedRank.name}»</strong>
                      {selectedRank.perks.map((perk) => <div key={perk}><span className="home-perk-bullet">✓</span>{perk}</div>)}
                    </div>
                    <div className="quick-buy-panel">
                      <label className="form-label" htmlFor="quick-nickname">Игровой ник</label>
                      <input id="quick-nickname" type="text" className="form-input" placeholder="Ник игрока" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                      <label className="form-label" htmlFor="quick-period">Срок действия</label>
                      <select id="quick-period" className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="30">На 30 дней</option>
                        <option value="forever">Навсегда</option>
                      </select>
                      <button type="button" className="submit-btn" onClick={() => { setModalRank(selectedRank); setCheckoutMessage(''); }}>Подробнее о ранге <span aria-hidden="true">→</span></button>
                    </div>
                  </div>
                  <p className="payment-note"><span aria-hidden="true">ⓘ</span> Платёжная система пока не подключена — покупка не совершается.</p>
                </section>
                <AdSpace slide={adSlide} setSlide={setAdSlide} />
              </main>
            </section>
          </main>
        ) : page === 'privileges' ? (
          <main className="privileges-page">
            <section className="privileges-hero">
              <span className="eyebrow"><span className="eyebrow-dot" /> ПРИВИЛЕГИИ MONSYTE</span>
              <h1>Выбери свой уровень</h1>
              <p>Больше возможностей, полезные команды и свой стиль на сервере.</p>
              <div className="hero-stats">
                <span><strong>{ranks.length}</strong> привилегий</span>
                <span className="stats-separator" />
                <span>Цены от <strong>50 грн</strong></span>
                <span className="stats-separator" />
                <span>IP: <strong>{SERVER_IP}</strong></span>
              </div>
            </section>

            <div className="privileges-toolbar">
              <div className="toolbar-title">
                <h2>Доступные ранги</h2>
                <span>{filteredRanks.length} из {ranks.length}</span>
              </div>
              <div className="view-switcher" role="group" aria-label="Режим отображения">
                <button type="button" className={viewMode === 'cards' ? 'view-btn active' : 'view-btn'} onClick={() => setViewMode('cards')}>▦ Карточки</button>
                <button type="button" className={viewMode === 'table' ? 'view-btn active' : 'view-btn'} onClick={() => setViewMode('table')}>☷ Сравнение прав</button>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <section className="rank-grid" aria-label="Список привилегий">
                {filteredRanks.map((rank) => (
                  <article key={rank.id} className={`rank-card ${rank.color} ${rank.featured ? 'featured' : ''}`}>
                    {rank.featured && <div className="rank-ribbon">ТОП</div>}
                    <div className="rank-card-top">
                      <div className="rank-icon-box"><img src={rank.icon} alt="" /></div>
                      <span className="rank-price">{rank.price} грн</span>
                    </div>
                    <h3>{rank.name}</h3>
                    <div className="rank-prefix">Префикс <strong>{rank.prefix}</strong></div>
                    <ul className="rank-perks">
                      {rank.perks.slice(0, 4).map((perk) => <li key={perk}><span className="perk-check">✓</span><span>{perk}</span></li>)}
                    </ul>
                    <div className="rank-card-bottom">
                      <span className="rank-mini-stat">⌂ {rank.homes} {rank.homes === 1 ? 'дом' : 'домов'}</span>
                      <span className="rank-mini-stat">{rank.fly ? '✦ Полёт' : '✦ Базовый ранг'}</span>
                    </div>
                    <button type="button" className="rank-buy-btn" onClick={() => openPurchaseModal(rank)}>Выбрать <span>→</span></button>
                  </article>
                ))}
                {filteredRanks.length === 0 && <div className="no-results">По запросу «{search}» ничего не найдено.</div>}
              </section>
            ) : (
              <div className="comparison-wrap">
                <table className="comparison-table">
                  <thead><tr><th>Привилегия</th><th>Цена</th><th>Префикс</th><th>Полёт</th><th>Дома</th><th>Набор</th><th>Действие</th></tr></thead>
                  <tbody>
                    {filteredRanks.map((rank) => <tr key={rank.id}>
                      <td><span className="table-rank"><img src={rank.icon} alt="" />{rank.name}</span></td>
                      <td><strong className="table-price">{rank.price} грн</strong></td>
                      <td><span className="prefix-chip">{rank.prefix}</span></td>
                      <td><span className={rank.fly ? 'table-yes' : 'table-no'}>{rank.fly ? '✓ Да' : '— Нет'}</span></td>
                      <td>{rank.homes}</td>
                      <td><code>{rank.kit}</code></td>
                      <td><button className="table-buy-btn" type="button" onClick={() => openPurchaseModal(rank)}>Выбрать</button></td>
                    </tr>)}
                  </tbody>
                </table>
                {filteredRanks.length === 0 && <div className="no-results">Ничего не найдено.</div>}
              </div>
            )}

            <section className="privileges-footer-note">
              <div><strong>Не знаешь, что выбрать?</strong><p>Открой сравнение прав или выбери ранг, чтобы увидеть список возможностей.</p></div>
              <button type="button" className="outline-btn" onClick={openHome}>← На главную</button>
            </section>
          </main>
        ) : page === 'modes' ? (
          <ModesPage search={search} onSearchChange={setSearch} onCopyIP={copyIP} serverIP={SERVER_IP} />
        ) : page === 'space' ? (
          <SpacePage search={search} onSearchChange={setSearch} onCopyIP={copyIP} serverIP={SERVER_IP} />
        ) : page === 'skins' ? (
          <SkinsPage search={search} onSearchChange={setSearch} onCopyIP={copyIP} serverIP={SERVER_IP} />
        ) : (
          <FeaturesPage search={search} onSearchChange={setSearch} onCopyIP={copyIP} serverIP={SERVER_IP} />
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><span className="footer-brand-name">MonSyte</span><span>Твой мир — твои правила.</span></div>
          <div className="footer-links">
            <button type="button" onClick={openHome}>Главная</button>
            <button type="button" onClick={openModes}>Режимы</button>
            <button type="button" onClick={openSpace}>Пространство</button>
            <button type="button" onClick={openPrivileges}>Привилегии</button>
            <button type="button" onClick={openSkins}>Скины</button>
            <button type="button" onClick={openFeatures}>Другие фишки</button>
            <a href="#rules">Правила</a>
            <a href="#support">Контакты / Поддержка</a>
            <a href="#agreement">Пользовательское соглашение</a>
          </div>
          <div className="footer-copyright">© 2026 MonSyte. Все права защищены. Mojang AB не связана с данным сайтом.</div>
        </div>
      </footer>

      {modalRank && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePurchaseModal(); }}>
          <section className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button type="button" className="modal-close" onClick={closePurchaseModal} aria-label="Закрыть окно">×</button>
            <div className="modal-rank-header">
              <div className={`modal-rank-icon ${modalRank.color}`}><img src={modalRank.icon} alt="" /></div>
              <div><span className="modal-kicker">ОФОРМЛЕНИЕ ПРИВИЛЕГИИ</span><h2 id="modal-title">{modalRank.name}</h2><p>Стоимость: <strong>{modalRank.price} грн</strong></p></div>
            </div>
            <form className="modal-form" onSubmit={submitPurchase}>
              <label htmlFor="modal-nickname">Твой игровой ник</label>
              <input id="modal-nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например, Steve_Pro" autoComplete="off" />
              <label htmlFor="modal-period">Срок действия</label>
              <select id="modal-period" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="30">На 30 дней</option><option value="forever">Навсегда</option></select>
              <span className="modal-list-heading">Что входит в привилегию</span>
              <ul className="modal-perks-list">{modalRank.perks.map((perk) => <li key={perk}><span>✓</span>{perk}</li>)}</ul>
              <button type="submit" className="modal-submit">Подготовить заявку · {modalRank.price} грн</button>
              <p className="modal-payment-note">Демонстрационный интерфейс: платёжная система ещё не подключена.</p>
              {checkoutMessage && <div className="checkout-message" role="status">{checkoutMessage}</div>}
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
