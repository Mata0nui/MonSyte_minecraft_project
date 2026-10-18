import React, { useEffect, useMemo, useRef, useState } from 'react';

const skinCatalog = [
  { id: 'neon-dragon', title: 'Неоновый Дракон', subtitle: 'HD-скин + крылья и аура', price: 120, category: 'hd', tag: 'HD + плащ', color: '#ec4899', icon: '🐉', desc: 'Эксклюзивный HD-скин в неоново-драконьем стиле со сверкающими крыльями и свечением глаз.', features: ['Разрешение HD (128×128)', 'Анимированный плащ', 'Светящиеся элементы'] },
  { id: 'anime-blade', title: 'Аниме Клинок', subtitle: '3D HD-скин самурая', price: 95, category: 'role', tag: 'Аниме / PvP', color: '#06b6d4', icon: '⚔️', desc: 'Аниме-скин с катаной на спине для любителей PvP-сражений и стримов.', features: ['3D-детали одежды', 'Уникальная причёска', 'Slim-модель персонажа'] },
  { id: 'void-mage', title: 'Маг Бездны', subtitle: 'Анимированный плащ + нимб', price: 150, category: 'animated', tag: 'Анимация', color: '#a855f7', icon: '🧙', desc: 'Мистический скин тёмного чародея с переливающимся плащом и парящим нимбом.', features: ['Динамика плаща', 'Парящий нимб', 'Фиолетовые частицы'] },
  { id: 'cyberpunk-samurai', title: 'Киберпанк Самурай', subtitle: 'Cyberpunk Neon Outfit', price: 110, category: 'hd', tag: 'Cyberpunk', color: '#f59e0b', icon: '🤖', desc: 'Футуристический стиль с кибернетической маской и неоновыми полосами.', features: ['Футуристический шлем', 'Неоновые вставки', 'Плащ в комплекте'] },
  { id: 'creeper-gentleman', title: 'Крипер-Джентльмен', subtitle: 'Мем-скин: смокинг и цилиндр', price: 60, category: 'role', tag: 'Мем-скин', color: '#10b981', icon: '🎩', desc: 'Элегантный Крипер во фраке с бабочкой и цилиндром.', features: ['Мемный стиль', 'Детализированный фрак', 'Классический образ'] },
  { id: 'pixel-king', title: 'Король Пикселей', subtitle: 'Светящийся королевский плащ', price: 80, category: 'capes', tag: 'Плащ', color: '#d99b0b', icon: '👑', desc: 'Величественный золотой плащ с королевской символикой, подходящий к разным скинам.', features: ['Подходит к разным скинам', 'Золотая символика', 'Королевский эффект'] },
  { id: 'nyan-aura', title: 'Нян-Кэт Аура', subtitle: 'Двойные радужные крылья', price: 130, category: 'accessories', tag: 'Аксессуар', color: '#ec4899', icon: '🌈', desc: 'Радужные крылья со звёздным следом при беге и прыжках.', features: ['Анимированные крылья', 'Радужный след', 'Настройка цвета'] },
  { id: 'dark-knight', title: 'Рыцарь Тьмы', subtitle: 'PvP-сет и тёмный шлем', price: 140, category: 'role', tag: 'PvP-сет', color: '#ef4444', icon: '🛡️', desc: 'Бронированный рыцарь в тёмных доспехах со стальным плащом.', features: ['Массивный шлем', 'Защитные наплечники', 'Боевой стиль'] },
];

const skinFilters = [
  { id: 'all', label: 'Все скины', icon: '▦' },
  { id: 'hd', label: 'HD и 3D', icon: '🧊' },
  { id: 'animated', label: 'Анимированные', icon: '✨' },
  { id: 'capes', label: 'Плащи и крылья', icon: '🪽' },
  { id: 'accessories', label: 'Аксессуары', icon: '🎭' },
  { id: 'role', label: 'По ролям', icon: '🎮' },
];

function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(52, Math.max(24, Math.floor(width / 28))) }, () => ({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + .5, speed: Math.random() * .28 + .08, alpha: Math.random() * .55 + .15 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -3) { p.y = height + 3; p.x = Math.random() * width; }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = Math.random() > .5 ? '#a855f7' : '#06b6d4';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="skins-particle-canvas" aria-hidden="true" />;
}

function SkinPreview({ skin, rotating, showCape }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    canvas.width = 220;
    canvas.height = 270;
    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (rotating) angleRef.current += 0.018;
      const angle = angleRef.current;
      const sx = Math.max(.12, Math.abs(Math.cos(angle)));
      const direction = Math.cos(angle) < 0 ? -1 : 1;
      ctx.save();
      ctx.translate(canvas.width / 2, 139);
      ctx.scale(sx * direction, 1);
      // Floor shadow
      ctx.fillStyle = 'rgba(22, 27, 42, .16)';
      ctx.beginPath(); ctx.ellipse(0, 101, 42 * sx + 7, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Cape
      if (showCape) {
        ctx.fillStyle = '#282044'; ctx.fillRect(-24, -49, 48, 81);
        ctx.fillStyle = skin.color; ctx.fillRect(-19, -45, 38, 70);
        ctx.fillStyle = 'rgba(255,255,255,.24)'; ctx.fillRect(-15, -39, 7, 54);
      }
      // Arms and legs
      ctx.fillStyle = '#25314b'; ctx.fillRect(-36, -47, 14, 47); ctx.fillRect(22, -47, 14, 47);
      ctx.fillStyle = '#1d2740'; ctx.fillRect(-17, 5, 15, 51); ctx.fillRect(2, 5, 15, 51);
      ctx.fillStyle = '#10192d'; ctx.fillRect(-18, 46, 16, 12); ctx.fillRect(1, 46, 16, 12);
      // Body layers
      ctx.fillStyle = '#202d49'; ctx.fillRect(-22, -48, 44, 56);
      ctx.fillStyle = skin.color; ctx.fillRect(-16, -43, 32, 44);
      ctx.fillStyle = 'rgba(255,255,255,.27)'; ctx.fillRect(-15, -40, 8, 28);
      // Neck and square head
      ctx.fillStyle = '#d6a18a'; ctx.fillRect(-7, -60, 14, 13);
      ctx.fillStyle = '#e4b9a0'; ctx.fillRect(-19, -96, 38, 37);
      ctx.fillStyle = skin.color; ctx.fillRect(-21, -101, 42, 13); ctx.fillRect(-21, -90, 5, 10);
      ctx.fillStyle = '#25304b'; ctx.fillRect(-12, -79, 6, 4); ctx.fillRect(6, -79, 6, 4);
      ctx.fillStyle = '#fff'; ctx.fillRect(-11, -79, 3, 3); ctx.fillRect(7, -79, 3, 3);
      ctx.fillStyle = 'rgba(20, 27, 45, .15)'; ctx.fillRect(0, -96, 19, 36);
      ctx.restore();
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [skin.color, rotating, showCape]);
  return <canvas ref={canvasRef} className="skin-model-canvas" aria-label={`Демонстрационный предпросмотр скина: ${skin.title}`} />;
}

export default function SkinsPage({ search, onSearchChange, onCopyIP, serverIP }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkin, setSelectedSkin] = useState(skinCatalog[0]);
  const [rotating, setRotating] = useState(true);
  const [showCape, setShowCape] = useState(true);
  const [randomIndex, setRandomIndex] = useState(0);
  const [buySkin, setBuySkin] = useState(null);
  const [nickname, setNickname] = useState('');
  const [payment, setPayment] = useState('card');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [lookupNickname, setLookupNickname] = useState('');
  const [lookupMessage, setLookupMessage] = useState('');
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadApplied, setUploadApplied] = useState(false);
  const [previewTexture, setPreviewTexture] = useState(false);

  useEffect(() => {
    if (!uploadPreview) return undefined;
    return () => URL.revokeObjectURL(uploadPreview);
  }, [uploadPreview]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setBuySkin(null); setUploadOpen(false); setNicknameOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visibleSkins = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru');
    return skinCatalog.filter((skin) => {
      const matchCategory = activeFilter === 'all' || skin.category === activeFilter;
      const haystack = [skin.title, skin.subtitle, skin.tag, skin.desc, ...skin.features].join(' ').toLocaleLowerCase('ru');
      return matchCategory && (!query || haystack.includes(query));
    });
  }, [activeFilter, search]);

  const tryOn = (skin) => {
    setSelectedSkin(skin);
    setUploadApplied(false);
    setPreviewTexture(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseRandom = () => {
    let next = Math.floor(Math.random() * skinCatalog.length);
    if (skinCatalog.length > 1 && next === randomIndex) next = (next + 1) % skinCatalog.length;
    setRandomIndex(next);
    setSelectedSkin(skinCatalog[next]);
    setUploadApplied(false);
    setPreviewTexture(false);
  };

  const openPurchase = (skin) => {
    setBuySkin(skin); setNickname(''); setPayment('card'); setPurchaseMessage('');
  };

  const submitPurchase = (event) => {
    event.preventDefault();
    if (!nickname.trim() || !buySkin) return;
    setPurchaseMessage(`Заявка подготовлена: «${buySkin.title}» для игрока ${nickname.trim()}. Выбрана оплата: ${payment === 'card' ? 'банковская карта (UAH)' : 'криптовалюта'}. Реальная оплата и выдача на сервер пока не подключены — покупка не совершена.`);
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadMessage('');
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      setUploadMessage('Пожалуйста, выбери PNG-файл.');
      event.target.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const squareSkin = image.width === image.height && [64, 128, 256, 512].includes(image.width);
      const legacySkin = image.width === 64 && image.height === 32;
      if (!squareSkin && !legacySkin) {
        URL.revokeObjectURL(url);
        setUploadMessage(`Размер ${image.width}×${image.height} не распознан. Подойдут 64×64, 64×32, 128×128, 256×256 или 512×512.`);
        event.target.value = '';
        return;
      }
      setUploadPreview((previous) => { if (previous) URL.revokeObjectURL(previous); return url; });
      setUploadName(file.name);
      setUploadApplied(false);
      setUploadMessage(`PNG загружен локально (${image.width}×${image.height}). Его можно посмотреть перед установкой.`);
    };
    image.onerror = () => { URL.revokeObjectURL(url); setUploadMessage('Не удалось прочитать изображение. Проверь PNG-файл.'); };
    image.src = url;
  };

  const applyUpload = () => {
    if (!uploadPreview) { setUploadMessage('Сначала выбери PNG-файл.'); return; }
    setUploadApplied(true);
    setPreviewTexture(true);
    setUploadOpen(false);
    setUploadMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitNickname = (event) => {
    event.preventDefault();
    if (!lookupNickname.trim()) return;
    setLookupMessage(`Ник «${lookupNickname.trim()}» введён. Загрузка настоящего скина по никнейму требует подключения внешнего API; сейчас доступен только демонстрационный предпросмотр.`);
  };

  return (
    <main className="skins-page">
      <ParticleBackground />
      <section className="skins-hero-grid">
        <div className="skins-hero-copy">
          <span className="skins-eyebrow"><span /> ПЕРСОНАЛИЗАЦИЯ ИГРОКА</span>
          <h1>Выделись <span>стилем</span> в мире Minecraft</h1>
          <p>HD-скины, плащи, крылья и эффекты ауры. Выбирай готовый образ из каталога или загрузи PNG для локального предпросмотра.</p>
          <div className="skins-hero-tags"><span>✓ HD 64×64 и 128×128</span><span>✦ Плащи и ауры</span><span>⚡ Примерка в каталоге</span></div>
          <div className="skins-hero-actions">
            <button type="button" className="skins-primary-btn" onClick={() => document.getElementById('skins-catalog')?.scrollIntoView({ behavior: 'smooth' })}>Открыть каталог <span>↓</span></button>
            <button type="button" className="skins-secondary-btn" onClick={() => setUploadOpen(true)}>＋ Загрузить PNG</button>
            <button type="button" className="skins-nickname-btn" onClick={() => { setLookupMessage(''); setLookupNickname(''); setNicknameOpen(true); }}>Примерить по нику</button>
          </div>
          <div className="skins-server-label">IP сервера <strong>{serverIP}</strong><button type="button" onClick={onCopyIP}>Копировать IP</button></div>
        </div>

        <section className="skins-viewer" aria-label="Демонстрационная примерка скина">
          <div className="skins-viewer-head"><span><i /> ПРЕДПРОСМОТР ПЕРСОНАЖА</span><span className="skins-viewer-tag">{uploadApplied ? 'ЛОКАЛЬНЫЙ PNG' : 'ДЕМО 2D/3D'}</span></div>
          <div className="skins-model-stage">
            <div className="skins-model-halo" />
            <SkinPreview skin={selectedSkin} rotating={rotating} showCape={showCape} />
            <div className="skins-model-caption"><strong>{uploadApplied ? 'Свой скин' : selectedSkin.title}</strong><span>{uploadApplied ? uploadName : selectedSkin.subtitle}</span></div>
            {previewTexture && uploadPreview && <div className="skins-texture-preview"><img src={uploadPreview} alt="Локальный PNG-текстурный файл скина" /><span>PNG-текстура</span></div>}
          </div>
          <div className="skins-viewer-controls">
            <button type="button" className={rotating ? 'active' : ''} onClick={() => setRotating((value) => !value)}>↻ Вращение: {rotating ? 'Вкл' : 'Выкл'}</button>
            <button type="button" className={showCape ? 'active' : ''} onClick={() => setShowCape((value) => !value)}>▰ Плащ: {showCape ? 'Вкл' : 'Выкл'}</button>
            <button type="button" onClick={chooseRandom}>⤨ Случайный</button>
          </div>
          {uploadApplied && <p className="skins-preview-note">PNG загружен только в этот браузер. Текстура показана рядом с демонстрационной моделью; для полноценной 3D-проекции и установки на сервер потребуется интеграция.</p>}
        </section>
      </section>

      <section className="skins-catalog" id="skins-catalog">
        <div className="skins-catalog-heading"><div><span className="skins-section-kicker">МАГАЗИН СЕРВЕРА</span><h2>Скины, плащи и аксессуары</h2><p>Выбери образ, примерь его в демонстрационной модели и открой карточку покупки.</p></div><span className="skins-count">{visibleSkins.length} из {skinCatalog.length} товаров</span></div>
        <div className="skins-filter-row" role="group" aria-label="Фильтр каталога скинов">
          {skinFilters.map((filter) => <button key={filter.id} type="button" className={activeFilter === filter.id ? 'active' : ''} onClick={() => setActiveFilter(filter.id)}><span>{filter.icon}</span>{filter.label}</button>)}
        </div>
        <section className="skins-product-grid" aria-label="Каталог скинов">
          {visibleSkins.map((skin) => <article className="skins-product-card" key={skin.id} style={{ '--skin-accent': skin.color }}>
            <div className="skins-product-top"><div className="skins-product-icon">{skin.icon}</div><span className="skins-product-tag">{skin.tag}</span></div>
            <h3>{skin.title}</h3><p className="skins-product-subtitle">{skin.subtitle}</p><p className="skins-product-description">{skin.desc}</p>
            <ul>{skin.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
            <div className="skins-product-footer"><div><small>ЦЕНА</small><strong>{skin.price} грн</strong></div><div className="skins-product-actions"><button type="button" className="skins-try-btn" title="Примерить" aria-label={`Примерить ${skin.title}`} onClick={() => tryOn(skin)}>◉</button><button type="button" className="skins-buy-btn" onClick={() => openPurchase(skin)}>Купить <span>→</span></button></div></div>
          </article>)}
          {visibleSkins.length === 0 && <div className="skins-empty"><span>⌕</span><h3>Скины не найдены</h3><p>Попробуй изменить поисковый запрос или категорию.</p><button type="button" onClick={() => { setActiveFilter('all'); onSearchChange(''); }}>Сбросить фильтры</button></div>}
        </section>
      </section>

      <section className="skins-bottom-note"><div><strong>Хочешь свой уникальный образ?</strong><p>Загрузи PNG для локального предпросмотра. Привязка к аккаунту Minecraft требует серверной интеграции.</p></div><button type="button" onClick={() => setUploadOpen(true)}>Загрузить свой скин <span>↑</span></button></section>

      {buySkin && <div className="skins-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBuySkin(null); }}>
        <section className="skins-modal" role="dialog" aria-modal="true" aria-labelledby="skin-buy-title">
          <button type="button" className="skins-modal-close" onClick={() => setBuySkin(null)} aria-label="Закрыть">×</button>
          <div className="skins-modal-product"><div style={{ '--skin-accent': buySkin.color }}>{buySkin.icon}</div><section><span>ОФОРМЛЕНИЕ ТОВАРА</span><h2 id="skin-buy-title">{buySkin.title}</h2><strong>{buySkin.price} грн</strong></section></div>
          <p className="skins-modal-desc">{buySkin.desc}</p><ul className="skins-modal-features">{buySkin.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
          <form className="skins-modal-form" onSubmit={submitPurchase}>
            <label htmlFor="skin-buy-nickname">Никнейм на сервере</label><input id="skin-buy-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Например, Steve_Pro" required autoComplete="off" />
            <span className="skins-payment-label">Способ оплаты</span><div className="skins-payment-options"><button type="button" className={payment === 'card' ? 'active' : ''} onClick={() => setPayment('card')}>▣ Карта (UAH)</button><button type="button" className={payment === 'crypto' ? 'active' : ''} onClick={() => setPayment('crypto')}>₿ Криптовалюта</button></div>
            <button type="submit" className="skins-modal-submit">Подготовить заявку · {buySkin.price} грн</button>
            {purchaseMessage && <p className="skins-modal-message" role="status">{purchaseMessage}</p>}
            <p className="skins-modal-disclaimer">Платёжная система и автоматическая выдача скинов пока не подключены.</p>
          </form>
        </section>
      </div>}

      {uploadOpen && <div className="skins-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setUploadOpen(false); }}>
        <section className="skins-modal" role="dialog" aria-modal="true" aria-labelledby="skin-upload-title">
          <button type="button" className="skins-modal-close" onClick={() => setUploadOpen(false)} aria-label="Закрыть">×</button><span className="skins-modal-kicker">ЛОКАЛЬНЫЙ ПРЕДПРОСМОТР</span><h2 id="skin-upload-title">Загрузить свой скин</h2><p className="skins-modal-desc">Выбери PNG-файл с компьютера. Файл не отправляется на сервер — он остаётся в этом браузере.</p>
          <label className="skins-upload-drop"><span>⇧</span><strong>{uploadName || 'Выбери PNG-файл'}</strong><small>64×64, 64×32, 128×128, 256×256 или 512×512</small><input type="file" accept="image/png,.png" onChange={handleUpload} /></label>
          {uploadPreview && <div className="skins-upload-preview"><img src={uploadPreview} alt="Предпросмотр загруженной текстуры" /><span>{uploadName}</span></div>}
          {uploadMessage && <p className="skins-upload-message" role="status">{uploadMessage}</p>}
          <div className="skins-modal-actions"><button type="button" className="skins-modal-cancel" onClick={() => setUploadOpen(false)}>Отмена</button><button type="button" className="skins-modal-submit" onClick={applyUpload}>Примерить в предпросмотре</button></div>
        </section>
      </div>}

      {nicknameOpen && <div className="skins-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNicknameOpen(false); }}>
        <section className="skins-modal" role="dialog" aria-modal="true" aria-labelledby="skin-nick-title">
          <button type="button" className="skins-modal-close" onClick={() => setNicknameOpen(false)} aria-label="Закрыть">×</button><span className="skins-modal-kicker">ПРИМЕРКА ПО НИКНЕЙМУ</span><h2 id="skin-nick-title">Найти скин игрока</h2><p className="skins-modal-desc">Введи никнейм Minecraft. Загрузка настоящего скина пока не подключена к внешнему API.</p>
          <form className="skins-modal-form" onSubmit={submitNickname}><label htmlFor="skin-lookup-nickname">Никнейм</label><input id="skin-lookup-nickname" value={lookupNickname} onChange={(event) => setLookupNickname(event.target.value)} placeholder="Steve" required autoComplete="off" /><button className="skins-modal-submit" type="submit">Проверить никнейм</button></form>
          {lookupMessage && <p className="skins-modal-message" role="status">{lookupMessage}</p>}
        </section>
      </div>}
    </main>
  );
}
