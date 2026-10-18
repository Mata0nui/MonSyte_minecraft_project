import React, { useMemo, useState } from 'react';
import { storeData, storeTabs } from './storeData';

export default function StorePage({ tab, search, onSearchChange, onCopyIP, serverIP }) {
  const pageConfig = storeTabs.find((entry) => entry.id === tab) || storeTabs[0];
  const [selectedItem, setSelectedItem] = useState(null);
  const [nickname, setNickname] = useState('');
  const [notice, setNotice] = useState('');
  const items = storeData[tab] || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('ru');
    if (!q) return items;
    return items.filter((item) => [item.title, item.subtitle, item.desc, item.badge, item.category, ...(item.perks || [])].join(' ').toLocaleLowerCase('ru').includes(q));
  }, [items, search]);

  const closeModal = () => { setSelectedItem(null); setNotice(''); };
  const prepareOrder = (event) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    setNotice(`Заявка на «${selectedItem.title}» подготовлена для игрока ${nickname.trim()}. Реальная оплата не подключена, заказ не оформлен.`);
  };

  return (
    <main className="store-page">
      <section className="store-hero">
        <div className="store-hero-art"><img src={pageConfig.icon} alt="" /></div>
        <div className="store-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> {pageConfig.badge}</span>
          <h1>{pageConfig.title}</h1>
          <p>{pageConfig.subtitle}</p>
          <div className="store-hero-meta"><span><strong>{items.length}</strong> предложений</span><i /><span>IP: <strong>{serverIP}</strong></span></div>
        </div>
      </section>

      <div className="store-section-heading">
        <div><h2>Каталог</h2><span>{filtered.length} из {items.length}</span></div>
        {search && <button type="button" onClick={() => onSearchChange('')}>Сбросить поиск</button>}
      </div>

      <section className="store-grid" aria-label={pageConfig.label}>
        {filtered.map((item) => (
          <article className={`store-card store-tone-${item.tone || 'blue'}`} key={item.id}>
            <div className="store-card-top">
              <div className="store-item-icon" aria-hidden="true">{item.icon}</div>
              <span className="store-item-badge">{item.badge}</span>
            </div>
            <div className="store-item-category">{item.category}</div>
            <h3>{item.title}</h3>
            <p className="store-item-subtitle">{item.subtitle}</p>
            <p className="store-item-desc">{item.desc}</p>
            <ul className="store-perks-list">
              {item.perks.map((perk) => <li key={perk}><span>✓</span>{perk}</li>)}
            </ul>
            <div className="store-card-bottom">
              <div><span className="store-price-label">Цена</span><strong className="store-price">{item.price > 0 ? `${item.price} грн` : 'Скоро'}</strong></div>
              <button type="button" className="store-buy-btn" onClick={() => { setSelectedItem(item); setNickname(''); setNotice(''); }}>
                {item.price > 0 ? 'Подробнее' : 'Подробнее'} <span>→</span>
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <div className="store-empty"><span>⌕</span><h3>Товары не найдены</h3><p>Попробуй изменить поисковый запрос.</p><button type="button" onClick={() => onSearchChange('')}>Показать всё</button></div>}
      </section>

      <aside className="store-bottom-note">
        <div><strong>Подбирай возможности под свой стиль игры</strong><p>Наличие и работа функций зависят от фактических настроек Minecraft-сервера.</p></div>
        <button type="button" onClick={onCopyIP}>Скопировать IP <span>→</span></button>
      </aside>

      {selectedItem && (
        <div className="store-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="store-modal" role="dialog" aria-modal="true" aria-labelledby="store-modal-title">
            <button type="button" className="store-modal-close" aria-label="Закрыть окно" onClick={closeModal}>×</button>
            <div className={`store-modal-header store-tone-${selectedItem.tone || 'blue'}`}>
              <div className="store-modal-icon" aria-hidden="true">{selectedItem.icon}</div>
              <div><span className="store-modal-kicker">{selectedItem.category}</span><h2 id="store-modal-title">{selectedItem.title}</h2><p>{selectedItem.price > 0 ? `Стоимость: ${selectedItem.price} грн` : 'Скоро'}</p></div>
            </div>
            <div className="store-modal-body">
              <p className="store-modal-description">{selectedItem.desc}</p>
              <h3>Что входит</h3>
              <ul className="store-modal-perks">{selectedItem.perks.map((perk) => <li key={perk}><span>✓</span>{perk}</li>)}</ul>
              {selectedItem.price > 0 ? (
                <form className="store-order-form" onSubmit={prepareOrder}>
                  <label htmlFor="store-nickname">Игровой ник</label>
                  <input id="store-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} required maxLength={32} placeholder="Например, Steve_Pro" />
                  <button type="submit" className="store-confirm-btn">Подготовить заявку · {selectedItem.price} грн</button>
                  <p>Платёжная система не подключена. Эта форма не списывает деньги и не оформляет реальный заказ.</p>
                  {notice && <div className="store-order-notice" role="status">{notice}</div>}
                </form>
              ) : <button type="button" className="store-confirm-btn" onClick={closeModal}>Понятно</button>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
