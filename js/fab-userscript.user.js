// ==UserScript==
// @name         Floating FAB overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject a floating button on every page and persist state across sites (Tampermonkey storage).
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const STORAGE_KEY = 'fab-panel-open-global';

  // inject styles
  const css = `
  #gm-fab{position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:50%;background:#007bff;color:#fff;display:grid;place-items:center;z-index:2147483647;box-shadow:0 8px 28px rgba(0,0,0,0.25);cursor:pointer}
  #gm-fab-panel{position:fixed;right:88px;bottom:16px;width:300px;background:#fff;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.2);transform-origin:bottom right;transform:translateY(12px) scale(0.95);opacity:0;pointer-events:none;transition:all .18s linear;z-index:2147483646;overflow:hidden}
  #gm-fab-panel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}
  #gm-fab-panel header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eee}
  #gm-fab-panel .body{padding:12px;font-size:14px}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // create button and panel
  const fab = document.createElement('button');
  fab.id = 'gm-fab';
  fab.title = 'Toggle panel';
  fab.textContent = '☰';
  fab.setAttribute('aria-expanded','false');

  const panel = document.createElement('aside');
  panel.id = 'gm-fab-panel';
  panel.innerHTML = `<header><strong>Global Panel</strong><button id="gm-fab-close" aria-label="Close">✕</button></header><div class="body"><p>This is a userscript overlay.</p><p><small>Alt+F toggles</small></p></div>`;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const closeBtn = document.getElementById('gm-fab-close');

  async function setOpen(open){
    if(open){
      panel.classList.add('open');
      fab.setAttribute('aria-expanded','true');
    }else{
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded','false');
    }
    // persist globally via GM_setValue
    if (typeof GM_setValue === 'function') {
      await GM_setValue(STORAGE_KEY, open ? true : false);
    } else {
      try { localStorage.setItem(STORAGE_KEY, open ? '1' : '0'); } catch(e){}
    }
  }

  fab.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('click', (e)=> {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== fab) setOpen(false);
  });
  document.addEventListener('keydown', async (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.altKey && (e.key==='f' || e.key==='F')) {
      e.preventDefault();
      setOpen(!panel.classList.contains('open'));
    }
  });

  // initialize from storage
  (async ()=> {
    let saved;
    if (typeof GM_getValue === 'function') {
      saved = await GM_getValue(STORAGE_KEY, false);
    } else {
      try { saved = localStorage.getItem(STORAGE_KEY) === '1'; } catch(e){ saved = false; }
    }
    setOpen(Boolean(saved));
  })();
})();