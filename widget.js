(function() {
  // Prevent duplicate initialization
  if (window._gdiWidgetInitialized) {
    try {
      chrome.storage.sync.get({ enableWidget: false, themePrimary: '#2563EB' }, (res) => {
        if (res.enableWidget && typeof window._gdiInitWidget === 'function') {
          window._gdiInitWidget(res.themePrimary);
        }
      });
    } catch (e) {}
    return;
  }
  window._gdiWidgetInitialized = true;

  let miniWidget = null;
  let widgetInterval = null;

  window._gdiInitWidget = function(primaryColor) {
    if (document.getElementById('gdi-mini-widget-host')) return;
    
    const host = document.createElement('div');
    host.id = 'gdi-mini-widget-host';
    host.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2147483646;';
    document.body.appendChild(host);
    
    const shadow = host.attachShadow({mode: 'open'});
    
    const style = document.createElement('style');
    style.textContent = `
      .widget { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 24px; padding: 8px 16px; display: flex; align-items: center; gap: 12px; font-family: system-ui, sans-serif; cursor: grab; user-select: none; transition: transform 0.2s; }
      .widget:hover { box-shadow: 0 15px 35px rgba(0,0,0,0.15); transform: translateY(-2px); }
      .widget:active { cursor: grabbing; transform: translateY(0) scale(0.98); }
      .stat { display: flex; flex-direction: column; }
      .val { font-size: 13px; font-weight: 800; color: #0F172A; }
      .lbl { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
      .sep { width: 1px; height: 20px; background: rgba(0,0,0,0.1); }
      @media (prefers-color-scheme: dark) {
        .widget { background: rgba(15,23,42,0.85); border-color: rgba(255,255,255,0.1); }
        .val { color: #F1F5F9; }
        .lbl { color: #94A3B8; }
        .sep { background: rgba(255,255,255,0.1); }
      }
    `;
    
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.innerHTML = `
      <div style="color:${primaryColor};font-size:16px;">🛸</div>
      <div class="stat"><span class="val" id="mw-words">0</span><span class="lbl">Words</span></div>
      <div class="sep"></div>
      <div class="stat"><span class="val" id="mw-h1">0</span><span class="lbl">H1 Tags</span></div>
      <div class="sep"></div>
      <div class="stat"><span class="val" id="mw-links">0</span><span class="lbl">Links</span></div>
    `;
    
    shadow.appendChild(style);
    shadow.appendChild(widget);
    
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    widget.addEventListener('mousedown', dragStart);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mousemove', drag);
    
    function dragStart(e) { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; if (e.target === widget || e.target.parentNode === widget) isDragging = true; }
    function dragEnd(e) { initialX = currentX; initialY = currentY; isDragging = false; }
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX; currentY = e.clientY - initialY;
        xOffset = currentX; yOffset = currentY;
        widget.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }
    
    const updateStats = () => {
      let text = '';
      if (document.body && document.body.innerText) {
          text = document.body.innerText.replace(/\s+/g, ' ').trim();
      }
      const words = text ? text.split(' ').length : 0;
      const h1s = document.querySelectorAll('h1').length;
      const links = document.querySelectorAll('a[href]').length;
      
      const elWords = shadow.querySelector('#mw-words');
      const elH1 = shadow.querySelector('#mw-h1');
      const elLinks = shadow.querySelector('#mw-links');

      if (elWords) elWords.textContent = words > 999 ? (words/1000).toFixed(1)+'k' : words;
      if (elH1) {
        elH1.textContent = h1s;
        elH1.style.color = h1s === 1 ? '#10B981' : h1s > 1 ? '#F59E0B' : '#EF4444';
      }
      if (elLinks) elLinks.textContent = links;
    };
    
    updateStats();
    widgetInterval = setInterval(updateStats, 2000);
    miniWidget = host;
  };

  window._gdiRemoveWidget = function() {
    if (miniWidget) { miniWidget.remove(); miniWidget = null; }
    if (widgetInterval) { clearInterval(widgetInterval); widgetInterval = null; }
  };

  try {
    chrome.storage.sync.get({ enableWidget: false, themePrimary: '#2563EB' }, (res) => {
      if (res.enableWidget) window._gdiInitWidget(res.themePrimary);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        if (changes.enableWidget) {
          if (changes.enableWidget.newValue) chrome.storage.sync.get('themePrimary', r => window._gdiInitWidget(r.themePrimary || '#2563EB'));
          else window._gdiRemoveWidget();
        }
      }
    });
  } catch (e) {
    // Graceful fallback if extension context is invalidated
  }
})();
