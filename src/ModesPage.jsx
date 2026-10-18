import React, { useMemo, useState } from 'react';
import { gameModes, modeCategories } from './modesData';

const categoryNames = {
  pvp: 'PvP и анархия',
  survival: 'Выживание и мир',
  minigames: 'Мини-игры',
  rpg: 'RPG и кастом',
};

export default function ModesPage({ search, onSearchChange, onCopyIP, serverIP }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState(null);

  const filteredModes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru');
    return gameModes.filter((mode) => {
      const matchesCategory = activeCategory === 'all' || mode.category === activeCategory;
      const haystack = [mode.title, mode.english, mode.subtitle, mode.shortDesc, mode.fullDesc, ...mode.features, ...mode.kits.map((kit) => kit.name)].join(' ').toLocaleLowerCase('ru');
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [activeCategory, search]);

  return (
    <main className="modes-page">
      <section className="modes-hero">
        <div className="modes-hero-mark"><img src="/icons/modes.png" alt="" /></div>
        <div className="modes-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> ИГРОВЫЕ МИРЫ MONSYTE</span>
          <h1>Выбери свой режим</h1>
          <p>От сражений на Анархии до спокойного выживания, островов и мини-игр — найди свой способ играть.</p>
          <div className="modes-hero-stats">
            <span><strong>{gameModes.length}</strong> игровых режимов</span>
            <span className="stats-separator" />
            <span>IP: <strong>{serverIP}</strong></span>
          </div>
        </div>
        <div className="modes-hero-total"><span className="online-pulse" /> Режимы сервера <strong>онлайн-статистика — демо</strong></div>
      </section>

      <div className="modes-filter-row" role="group" aria-label="Фильтр режимов">
        {modeCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`mode-filter-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span aria-hidden="true">{category.icon}</span>{category.label}
          </button>
        ))}
      </div>

      <div className="modes-results-bar">
        <div><h2>Игровые режимы</h2><span>{filteredModes.length} из {gameModes.length}</span></div>
        {(activeCategory !== 'all' || search) && <button type="button" onClick={() => { setActiveCategory('all'); onSearchChange(''); }} className="mode-reset-btn">Сбросить фильтр</button>}
      </div>

      <section className="mode-grid" aria-label="Список игровых режимов">
        {filteredModes.map((mode) => (
          <article className={`mode-card mode-tone-${mode.tone}`} key={mode.id}>
            <div className="mode-card-accent" />
            <div className="mode-card-head">
              <div className="mode-icon-box" aria-hidden="true">{mode.icon}</div>
              <div className="mode-card-badges">
                <span className="mode-badge">{mode.badge}</span>
                <span className="mode-online"><span className="online-pulse" />{mode.online} / {mode.maxOnline}</span>
              </div>
            </div>
            <div className="mode-category-label">{categoryNames[mode.category]}</div>
            <h3>{mode.title} <span>{mode.english}</span></h3>
            <p className="mode-subtitle">{mode.subtitle}</p>
            <p className="mode-short-desc">{mode.shortDesc}</p>
            <div className="mode-feature-pills">
              {mode.features.slice(0, 2).map((feature) => <span key={feature}><b>✓</b>{feature}</span>)}
            </div>
            <div className="mode-card-actions">
              <button type="button" className="mode-details-btn" onClick={() => setSelectedMode(mode)}>Подробнее <span>↗</span></button>
              <button type="button" className="mode-play-btn" onClick={onCopyIP}>Играть <span>▶</span></button>
            </div>
          </article>
        ))}
        {filteredModes.length === 0 && (
          <div className="mode-empty-state">
            <span>⌕</span><h3>Режимы не найдены</h3><p>Измени поисковый запрос или выбери другую категорию.</p>
            <button type="button" className="mode-play-btn" onClick={() => setActiveCategory('all')}>Показать все режимы</button>
          </div>
        )}
      </section>

      <div className="modes-bottom-note">
        <div><strong>Уже знаешь, куда отправиться?</strong><p>Скопируй IP сервера и выбери режим в игре.</p></div>
        <button type="button" className="modes-copy-ip" onClick={onCopyIP}>Скопировать IP <span>→</span></button>
      </div>

      {selectedMode && (
        <div className="mode-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMode(null); }}>
          <section className="mode-modal" role="dialog" aria-modal="true" aria-labelledby="mode-modal-title">
            <button type="button" className="mode-modal-close" aria-label="Закрыть окно" onClick={() => setSelectedMode(null)}>×</button>
            <div className={`mode-modal-header mode-tone-${selectedMode.tone}`}>
              <div className="mode-modal-icon" aria-hidden="true">{selectedMode.icon}</div>
              <div className="mode-modal-title-wrap">
                <span className="mode-badge">{selectedMode.badge}</span>
                <h2 id="mode-modal-title">{selectedMode.title}</h2>
                <p>{selectedMode.subtitle}</p>
              </div>
              <div className="mode-modal-online"><span className="online-pulse" />{selectedMode.online} / {selectedMode.maxOnline}<small>демо-статистика</small></div>
            </div>
            <div className="mode-modal-body">
              <div className="mode-modal-section">
                <h3>Об этом режиме</h3>
                <p className="mode-modal-description">{selectedMode.fullDesc}</p>
              </div>
              <div className="mode-modal-section">
                <h3>Особенности</h3>
                <div className="mode-modal-features">
                  {selectedMode.features.map((feature) => <div key={feature}><span>✓</span>{feature}</div>)}
                </div>
              </div>
              <div className="mode-modal-section">
                <h3>Донат-наборы и дополнительные возможности</h3>
                <div className="mode-kits-grid">
                  {selectedMode.kits.map((kit) => <div className="mode-kit" key={kit.name}><span>{kit.icon}</span><strong>{kit.name}</strong><small>{kit.price}</small></div>)}
                </div>
              </div>
              <div className="mode-command-box"><span>Команда режима</span><code>{selectedMode.cmd}</code></div>
              <div className="mode-modal-actions">
                <button type="button" className="mode-play-btn" onClick={onCopyIP}>Скопировать IP <span>▶</span></button>
                <button type="button" className="mode-details-btn" onClick={() => setSelectedMode(null)}>Закрыть</button>
              </div>
              <p className="mode-demo-note">Режимы, онлайн и донат-предложения представлены как демонстрационный контент и могут быть изменены под настройки реального сервера.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
