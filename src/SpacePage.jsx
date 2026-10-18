import React, { useMemo, useState } from 'react';

const spaceCategories = [
  { id: 'all', label: 'Все пространства', icon: '🌐' },
  { id: 'overworld', label: 'Основной мир', icon: '🌲' },
  { id: 'nether', label: 'Нижний мир', icon: '🔥' },
  { id: 'end', label: 'Энд', icon: '🐉' },
  { id: 'realms', label: 'Приватные миры', icon: '🏝️' },
  { id: 'space', label: 'Космос', icon: '🚀' },
];

const realms = [
  {
    id: 'spawn-hub', title: 'Спавн & Торговый Хаб', subtitle: 'Безопасная нейтральная зона сервера', category: 'overworld', categoryLabel: 'Основной мир', icon: '🏰', tone: 'blue', pvp: 'Safezone', pvpTone: 'safe', online: 420, border: '1 000 × 1 000', difficulty: 'Мирный', reset: 'Без вайпов', command: '/space warp spawn',
    description: 'Главная хаб-локация сети. Здесь расположены глобальный рынок аукционов, NPC квестов, телепорты в миры, безопасные зоны обмена между игроками и клановые хот-споты.',
    rules: ['Запрещены PvP и урон игрокам', 'Доступ к рынку /ah и обменникам /trade', 'Кастомные паркур-испытания с наградами'],
    mapUrl: 'https://placehold.co/1200x800/10121a/6366f1?text=Spawn+Hub+Dynmap',
  },
  {
    id: 'survival-world', title: 'Дикий Мир (Survival)', subtitle: 'Основной мир выживания и построек', category: 'overworld', categoryLabel: 'Основной мир', icon: '🌳', tone: 'green', pvp: 'PvP ночью', pvpTone: 'warning', online: 890, border: '30 000 × 30 000', difficulty: 'Сложная', reset: 'Раз в год', command: '/space warp survival',
    description: 'Огромный непрерывный мир с кастомной генерацией ландшафта, новыми биомами, высокими горами и реалистичными реками. Каждая построенная база может быть защищена приватом.',
    rules: ['Разрешён приват территорий золотой лопатой', 'PvP включается только в ночное время', 'Защита от грифа и воровства из сундуков'],
    mapUrl: 'https://placehold.co/1200x800/10121a/10b981?text=Overworld+Survival+Dynmap',
  },
  {
    id: 'resource-world', title: 'Ресурсный Мир (Mining)', subtitle: 'Мир для регулярной добычи руды', category: 'overworld', categoryLabel: 'Основной мир', icon: '⛏️', tone: 'gold', pvp: 'PvP включено', pvpTone: 'danger', online: 310, border: '8 000 × 8 000', difficulty: 'Хардкор', reset: 'Раз в 7 дней', resetTimer: 'Осталось 2 дня', command: '/space warp mining',
    description: 'Вайпаемый раз в неделю мир для сбора древесины, руды и редких материалов. Содержит увеличенные жилы алмазов и незерита.',
    rules: ['Приваты отключены — мир регулярно сбрасывается', 'Увеличенный спавн алмазных и изумрудных жил', 'Сброс карты каждую пятницу в 18:00'],
    mapUrl: 'https://placehold.co/1200x800/10121a/f59e0b?text=Resource+World+Dynmap',
  },
  {
    id: 'nether-realm', title: 'Адская Долина (Nether)', subtitle: 'Кастомные биомы Ада и замки', category: 'nether', categoryLabel: 'Нижний мир', icon: '🔥', tone: 'red', pvp: 'PvP включено', pvpTone: 'danger', online: 240, border: '15 000 × 15 000', difficulty: 'Хардкор', reset: 'Без вайпов', command: '/space warp nether',
    description: 'Опасный Нижний мир с кастомными адскими биомами, базальтовыми крепостями, редкими древними обломками и боссами пиглинов.',
    rules: ['Опасные лавовые штормы и усиленные мобы', 'PvP включено без ограничений', 'Босс «Пепельный Демон» появляется каждые 4 часа'],
    mapUrl: 'https://placehold.co/1200x800/10121a/ef4444?text=Nether+Realm+Dynmap',
  },
  {
    id: 'end-realm', title: 'Край & Цитадель (The End)', subtitle: 'Парящие острова и возрождённые драконы', category: 'end', categoryLabel: 'Энд', icon: '🐉', tone: 'purple', pvp: 'PvP включено', pvpTone: 'danger', online: 185, border: '20 000 × 20 000', difficulty: 'Хардкор', reset: 'Вайп внешних островов', command: '/space warp end',
    description: 'Царство пустоты и парящих островов. Место для поиска элитр, добычи панцирей шалкеров и битв с Драконом Края.',
    rules: ['Авто-возрождение Дракона Края каждые 6 часов', 'PvP-арена вокруг главного острова', 'Добыча панцирей шалкеров без лимита'],
    mapUrl: 'https://placehold.co/1200x800/10121a/a855f7?text=The+End+Dynmap',
  },
  {
    id: 'skyblock-realms', title: 'Приватные Острова (Skyblock)', subtitle: 'Персональное изолированное пространство', category: 'realms', categoryLabel: 'Приватные миры', icon: '🏝️', tone: 'gold', pvp: 'Настраивается', pvpTone: 'info', online: 290, border: '500 × 500 (остров)', difficulty: 'Нормальная', reset: 'Без вайпов', command: '/space warp island',
    description: 'Личное пространство игрока или команды. Стройте автоматизированные фермы, выдавайте права друзьям и развивайте свой парящий в небе остров.',
    rules: ['Контроль допуска через /is lock и /is invite', 'Кастомные авто-генераторы руды', 'Система уровней и рейтинга островов'],
    mapUrl: 'https://placehold.co/1200x800/10121a/eab308?text=Skyblock+Realms+Dynmap',
  },
  {
    id: 'space-orbit', title: 'Лунный Модуль / Космос', subtitle: 'Низкая гравитация и космические базы', category: 'space', categoryLabel: 'Космические миры', icon: '🚀', tone: 'cyan', pvp: 'PvP включено', pvpTone: 'danger', online: 110, border: '10 000 × 10 000', difficulty: 'Кастомная', reset: 'Без вайпов', command: '/space warp orbit',
    description: 'Футуристическое космическое измерение. Для выживания нужен скафандр с кислородом. Здесь есть невесомость, метеоритные дожди и инопланетные блоки.',
    rules: ['Нужен кислородный скафандр', 'Невесомость и прыжки на 10 блоков вверх', 'Добыча уникальной лунной руды и метеоритов'],
    mapUrl: 'https://placehold.co/1200x800/10121a/06b6d4?text=Space+Orbit+Dynmap',
  },
  {
    id: 'creative-canvas', title: 'Creative Canvas (Творчество)', subtitle: 'Плоский мир с plot-системой', category: 'realms', categoryLabel: 'Приватные миры', icon: '🧱', tone: 'pink', pvp: 'Safezone', pvpTone: 'safe', online: 50, border: 'Plot 100 × 100', difficulty: 'Творческая', reset: 'Без вайпов', command: '/space warp creative',
    description: 'Творческая лаборатория для тестирования сложных редстоун-схем, проектирования построек перед переносом в Survival и демонстрации архитектуры.',
    rules: ['Бесконечные блоки и /gamemode creative', 'WorldEdit для участников с VIP-ролями', 'Защита плотов от изменения другими игроками'],
    mapUrl: 'https://placehold.co/1200x800/10121a/ec4899?text=Creative+Plots+Dynmap',
  },
];

const toneLabels = { blue: 'голубой', green: 'зелёный', gold: 'золотой', red: 'красный', purple: 'фиолетовый', cyan: 'голубой', pink: 'розовый' };

function writeClipboard(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const ok = document.execCommand('copy');
  input.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error('Clipboard unavailable'));
}

export default function SpacePage({ search, onSearchChange, onCopyIP, serverIP }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRealm, setSelectedRealm] = useState(null);
  const [mapRealm, setMapRealm] = useState(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const filteredRealms = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru');
    return realms.filter((realm) => {
      const matchesCategory = activeCategory === 'all' || realm.category === activeCategory;
      const haystack = [realm.title, realm.subtitle, realm.description, realm.categoryLabel, realm.pvp, realm.difficulty, realm.reset, realm.command, ...realm.rules].join(' ').toLocaleLowerCase('ru');
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [activeCategory, search]);

  const copyCommand = async (command) => {
    try {
      await writeClipboard(command);
      setCopiedCommand(true);
      window.setTimeout(() => setCopiedCommand(false), 1600);
    } catch {
      setCopiedCommand(false);
    }
  };

  return (
    <main className="space-page">
      <section className="space-hero">
        <div className="space-hero-art" aria-hidden="true"><span>🌌</span><i>✦</i><b>✦</b></div>
        <div className="space-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> МИРЫ MONSYTE</span>
          <h1>Исследуй <span>пространство</span></h1>
          <p>От безопасного спавна до опасных измерений и космических баз. Выбирай мир, изучай правила и смотри сведения о локации.</p>
          <div className="space-hero-stats">
            <span><strong>{realms.length}</strong> пространств</span><span className="stats-separator" />
            <span>IP: <strong>{serverIP}</strong></span>
          </div>
        </div>
        <div className="space-hero-side"><span className="space-orbit-icon">◎</span><strong>Твоя следующая точка</strong><small>Выбери измерение и скопируй команду телепортации.</small></div>
      </section>

      <div className="space-toolbar">
        <div className="space-filter-row" role="group" aria-label="Фильтр пространств">
          {spaceCategories.map((category) => (
            <button key={category.id} type="button" className={`space-filter-btn ${activeCategory === category.id ? 'active' : ''}`} onClick={() => setActiveCategory(category.id)}>
              <span aria-hidden="true">{category.icon}</span>{category.label}
            </button>
          ))}
        </div>
        <div className="space-results"><strong>{filteredRealms.length}</strong> из {realms.length} миров</div>
      </div>

      <section className="space-grid" aria-label="Игровые пространства">
        {filteredRealms.map((realm) => (
          <article className={`space-card space-tone-${realm.tone}`} key={realm.id}>
            <div className="space-card-glow" aria-hidden="true" />
            <div className="space-card-head">
              <div className="space-icon-box" aria-hidden="true">{realm.icon}</div>
              <span className={`space-pvp space-pvp-${realm.pvpTone}`}>{realm.pvp}</span>
            </div>
            <div className="space-category-label">{realm.categoryLabel}</div>
            <h2>{realm.title}</h2>
            <p className="space-subtitle">{realm.subtitle}</p>
            <p className="space-description">{realm.description}</p>
            <div className="space-stats-grid">
              <div><span>ОНЛАЙН</span><strong><i />{realm.online} <small>игроков</small></strong></div>
              <div><span>ГРАНИЦА МИРА</span><strong>{realm.border}</strong></div>
            </div>
            {realm.resetTimer && <div className="space-reset-timer">◷ Сброс карты: <strong>{realm.resetTimer}</strong></div>}
            <div className="space-card-actions">
              <button type="button" className="space-details-btn" onClick={() => { setSelectedRealm(realm); setCopiedCommand(false); }}>Обзор <span>↗</span></button>
              <button type="button" className="space-map-btn" onClick={() => setMapRealm(realm)} title="Открыть предпросмотр карты">⌖ Карта</button>
            </div>
          </article>
        ))}
        {filteredRealms.length === 0 && (
          <div className="space-empty">
            <span>⌕</span><h2>Пространства не найдены</h2><p>Попробуй изменить поисковый запрос или категорию.</p>
            <button type="button" className="space-details-btn" onClick={() => { setActiveCategory('all'); onSearchChange(''); }}>Показать все миры</button>
          </div>
        )}
      </section>

      <section className="space-bottom-note">
        <div><strong>Готов отправиться в путь?</strong><p>Скопируй адрес сервера, а затем введи команду нужного мира в игре.</p></div>
        <button type="button" className="space-copy-ip" onClick={onCopyIP}>Скопировать IP <span>→</span></button>
      </section>
      <p className="space-demo-note">Онлайн, размеры миров и предпросмотры карт являются демонстрационными значениями. Настоящая Dynmap появится после подключения ссылки на карту сервера.</p>

      {selectedRealm && (
        <div className="space-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRealm(null); }}>
          <section className={`space-modal space-tone-${selectedRealm.tone}`} role="dialog" aria-modal="true" aria-labelledby="space-modal-title">
            <button type="button" className="space-modal-close" aria-label="Закрыть окно" onClick={() => setSelectedRealm(null)}>×</button>
            <div className="space-modal-header">
              <div className="space-modal-icon" aria-hidden="true">{selectedRealm.icon}</div>
              <div className="space-modal-title-wrap"><span className="space-category-label">{selectedRealm.categoryLabel}</span><h2 id="space-modal-title">{selectedRealm.title}</h2><p>{selectedRealm.subtitle}</p></div>
              <span className={`space-pvp space-pvp-${selectedRealm.pvpTone}`}>{selectedRealm.pvp}</span>
            </div>
            <div className="space-modal-body">
              <div className="space-detail-stats">
                <div><span>Онлайн</span><strong>{selectedRealm.online} игроков</strong></div>
                <div><span>Граница мира</span><strong>{selectedRealm.border}</strong></div>
                <div><span>Сложность</span><strong>{selectedRealm.difficulty}</strong></div>
                <div><span>Сброс карты</span><strong>{selectedRealm.reset}</strong></div>
              </div>
              <section className="space-modal-section"><h3>Об этом пространстве</h3><p>{selectedRealm.description}</p></section>
              <section className="space-modal-section"><h3>Правила и особенности</h3><ul>{selectedRealm.rules.map((rule) => <li key={rule}><span>✓</span>{rule}</li>)}</ul></section>
              <div className="space-command-box"><div><span>КОМАНДА ТЕЛЕПОРТАЦИИ</span><code>{selectedRealm.command}</code></div><button type="button" onClick={() => copyCommand(selectedRealm.command)}>{copiedCommand ? '✓ Скопировано' : 'Копировать команду'}</button></div>
              <div className="space-modal-actions"><button type="button" className="space-details-btn" onClick={onCopyIP}>Скопировать IP сервера <span>→</span></button><button type="button" className="space-map-btn" onClick={() => { setMapRealm(selectedRealm); setSelectedRealm(null); }}>Открыть карту</button></div>
              <p className="space-modal-footnote">Команда и сведения показаны как пример интерфейса. Они должны соответствовать плагинам и настройкам вашего сервера.</p>
            </div>
          </section>
        </div>
      )}

      {mapRealm && (
        <div className="space-modal-backdrop space-map-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMapRealm(null); }}>
          <section className="space-map-modal" role="dialog" aria-modal="true" aria-labelledby="space-map-title">
            <div className="space-map-modal-head"><div><span>ПРЕДПРОСМОТР КАРТЫ</span><h2 id="space-map-title">{mapRealm.title}</h2></div><button type="button" className="space-modal-close-inline" onClick={() => setMapRealm(null)} aria-label="Закрыть карту">×</button></div>
            <div className="space-map-image-wrap"><img src={mapRealm.mapUrl} alt={`Демонстрационный предпросмотр карты: ${mapRealm.title}`} /><div className="space-map-overlay"><strong>Карта-превью</strong><span>Здесь можно подключить настоящую Dynmap</span></div></div>
            <div className="space-map-modal-foot"><span>Пока отображается заглушка, а не живая карта сервера.</span><button type="button" className="space-details-btn" onClick={() => setMapRealm(null)}>Закрыть</button></div>
          </section>
        </div>
      )}
    </main>
  );
}
