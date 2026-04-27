/**
 * SEO Tools Pro - Unified Utility Library v4.0
 * 🎨 Design System: Glassmorphism + Modern Minimal + Dark Mode
 * 🛡️ Security: XSS-safe DOM construction, CSP-friendly
 * ♿ Accessibility: WCAG 2.1 AA, ARIA live regions, focus trapping
 * ⚡ Performance: Virtual scrolling, Intersection Observer, event delegation
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' 
    ? module.exports = factory() 
    : typeof define === 'function' && define.amd 
      ? define(factory) 
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GDI = factory());
})(this, function() {
  'use strict';

  // ==================== DESIGN TOKENS ====================

  const DESIGN_TOKENS = {
    colors: {
      // Light mode
      primary: '#2563EB', primaryLight: '#3B82F6', primaryDark: '#1D4ED8',
      primaryGradient: 'linear-gradient(135deg, #1B2A4A 0%, #2563EB 100%)',
      success: '#10B981', successLight: '#D1FAE5', successGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: '#F59E0B', warningLight: '#FEF3C7', warningGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: '#EF4444', errorLight: '#FEE2E2', errorGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      info: '#3B82F6', infoLight: '#DBEAFE', infoGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      surface: '#FFFFFF', surfaceSecondary: '#F8FAFC', surfaceTertiary: '#F1F5F9',
      textPrimary: '#111827', textSecondary: '#475569', textMuted: '#9CA3AF',
      border: '#E2E8F0', borderLight: '#F1F5F9', overlay: 'rgba(15, 23, 42, 0.65)',
      // Dark mode
      dark: {
        primary: '#3B82F6', primaryLight: '#60A5FA', primaryDark: '#2563EB',
        primaryGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        surface: '#0F172A', surfaceSecondary: '#1E293B', surfaceTertiary: '#334155',
        textPrimary: '#F1F5F9', textSecondary: '#CBD5E1', textMuted: '#64748B',
        border: '#334155', borderLight: '#1E293B', overlay: 'rgba(0, 0, 0, 0.75)',
        successLight: '#064E3B', warningLight: '#78350F', errorLight: '#7F1D1D', infoLight: '#1E3A8A',
      }
    },
    shadows: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
      sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      glow: (color = '#2563EB') => `0 0 20px ${color}20`,
      dark: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }
    },
    radii: { sm: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '20px', full: '9999px' },
    typography: {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontMono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
      sizes: { xs: '11px', sm: '12px', base: '13px', md: '14px', lg: '16px', xl: '18px', '2xl': '20px', '3xl': '24px', hero: '32px' },
      weights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }
  };

  // ==================== THEME ENGINE ====================

  const ThemeEngine = {
    _current: 'light',
    _listeners: new Set(),
    
    init() {
      const saved = localStorage.getItem('gdi-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.set(saved || (prefersDark ? 'dark' : 'light'), false);
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('gdi-theme')) this.set(e.matches ? 'dark' : 'light');
      });
    },
    
    set(mode, persist = true) {
      this._current = mode;
      document.documentElement.setAttribute('data-gdi-theme', mode);
      if (persist) localStorage.setItem('gdi-theme', mode);
      this._listeners.forEach(cb => cb(mode));
    },
    
    toggle() { this.set(this._current === 'light' ? 'dark' : 'light'); },
    get() { return this._current; },
    isDark() { return this._current === 'dark'; },
    onChange(cb) { this._listeners.add(cb); return () => this._listeners.delete(cb); },
    
    token(path) {
      const keys = path.split('.');
      let value = DESIGN_TOKENS;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      if (this.isDark() && path.startsWith('colors.')) {
        const darkValue = keys.reduce((obj, key) => obj?.dark?.[key] ?? obj?.[key], DESIGN_TOKENS);
        if (darkValue && typeof darkValue !== 'object') return darkValue;
      }
      return value;
    }
  };

  // ==================== CSS INJECTION ====================

  (function injectDesignSystem() {
    if (document.getElementById('gdi-design-system')) return;
    
    const style = document.createElement('style');
    style.id = 'gdi-design-system';
    style.textContent = `
      :root {
        --gdi-primary: ${DESIGN_TOKENS.colors.primary};
        --gdi-primary-light: ${DESIGN_TOKENS.colors.primaryLight};
        --gdi-surface: ${DESIGN_TOKENS.colors.surface};
        --gdi-surface-secondary: ${DESIGN_TOKENS.colors.surfaceSecondary};
        --gdi-text-primary: ${DESIGN_TOKENS.colors.textPrimary};
        --gdi-text-secondary: ${DESIGN_TOKENS.colors.textSecondary};
        --gdi-border: ${DESIGN_TOKENS.colors.border};
      }
      
      [data-gdi-theme="dark"] {
        --gdi-primary: ${DESIGN_TOKENS.colors.dark.primary};
        --gdi-primary-light: ${DESIGN_TOKENS.colors.dark.primaryLight};
        --gdi-surface: ${DESIGN_TOKENS.colors.dark.surface};
        --gdi-surface-secondary: ${DESIGN_TOKENS.colors.dark.surfaceSecondary};
        --gdi-text-primary: ${DESIGN_TOKENS.colors.dark.textPrimary};
        --gdi-text-secondary: ${DESIGN_TOKENS.colors.dark.textSecondary};
        --gdi-border: ${DESIGN_TOKENS.colors.dark.border};
      }
      
      /* --- Animations --- */
      @keyframes gdi-fade-in-up { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes gdi-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes gdi-slide-in-right { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes gdi-slide-out-right { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }
      @keyframes gdi-scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      @keyframes gdi-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes gdi-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes gdi-ripple { to { transform: scale(4); opacity: 0; } }
      @keyframes gdi-spin { to { transform: rotate(360deg); } }
      
      /* --- Scrollbar --- */
      .gdi-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
      .gdi-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .gdi-scrollbar::-webkit-scrollbar-thumb { background: var(--gdi-border); border-radius: ${DESIGN_TOKENS.radii.full}; }
      .gdi-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--gdi-primary); }
      
      /* --- Focus Styles --- */
      .gdi-focus-ring:focus-visible { outline: 2px solid var(--gdi-primary); outline-offset: 2px; border-radius: 2px; }
      
      /* --- Selection --- */
      .gdi-selection ::selection { background: ${DESIGN_TOKENS.colors.primaryLight}40; color: var(--gdi-text-primary); }
      
      /* --- Glass Effect --- */
      .gdi-glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
      [data-gdi-theme="dark"] .gdi-glass { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
      
      /* --- Reduced Motion --- */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
      }
      
      /* --- Screen Reader Only --- */
      .gdi-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
    `;
    
    document.head.appendChild(style);
    ThemeEngine.init();
  })();

  // ==================== UTILITY FUNCTIONS ====================

  function createElement(tag, options = {}) {
    const { attrs = {}, styles = {}, children = [], text = '', html = '', dataset = {} } = options;
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') { el.className = value; }
      else if (key.startsWith('data-')) { el.setAttribute(key, value); }
      else if (key === 'ariaLabel') { el.setAttribute('aria-label', value); }
      else if (key in el) { try { el[key] = value; } catch { el.setAttribute(key, value); } }
      else { el.setAttribute(key, value); }
    });
    
    Object.entries(dataset).forEach(([key, value]) => { el.dataset[key] = value; });
    Object.assign(el.style, styles);
    if (html) { el.innerHTML = html; } else if (text) { el.textContent = text; }
    
    if (children.length > 0) {
      const fragment = document.createDocumentFragment();
      children.forEach(child => { if (child instanceof Node) fragment.appendChild(child); });
      if (fragment.childNodes.length) el.appendChild(fragment);
    }
    
    return el;
  }

  function $(selector, scope = document) { return scope.querySelector(selector); }
  function $$(selector, scope = document) { return Array.from(scope.querySelectorAll(selector)); }
  
  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  function cleanText(text) { return (text || '').replace(/\s+/g, ' ').trim(); }
  
  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  
  function throttle(fn, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) { fn.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }
  
  function generateId(prefix = 'gdi') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
  }

  // ==================== INTERSECTION OBSERVER UTILS ====================

  const IORegistry = {
    observers: new Map(),
    
    observe(el, callback, options = {}) {
      if (!el) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target);
            if (options.once) observer.unobserve(entry.target);
          }
        });
      }, { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px' });
      
      observer.observe(el);
      this.observers.set(el, observer);
      return () => this.unobserve(el);
    },
    
    unobserve(el) {
      const observer = this.observers.get(el);
      if (observer) { observer.disconnect(); this.observers.delete(el); }
    }
  };

  // ==================== CLIPBOARD SYSTEM ====================

  async function copyToClipboard(text) {
    if (typeof text !== 'string' || !text) return false;
    
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (err) { /* fallback */ }
    }
    
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;z-index:-1;';
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');
      document.body.appendChild(textarea);
      
      const range = document.createRange();
      range.selectNode(textarea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      const success = document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(textarea);
      return success;
    } catch (err) { return false; }
  }

  // ==================== NOTIFICATION SYSTEM ====================

  const notificationState = { 
    queue: [], 
    maxVisible: 3, 
    idCounter: 0,
    positions: {
      'top-right': { top: '24px', right: '24px', bottom: 'auto', left: 'auto' },
      'top-left': { top: '24px', left: '24px', bottom: 'auto', right: 'auto' },
      'top-center': { top: '24px', left: '50%', transform: 'translateX(-50%)', bottom: 'auto', right: 'auto' },
      'bottom-right': { bottom: '24px', right: '24px', top: 'auto', left: 'auto' },
      'bottom-left': { bottom: '24px', left: '24px', top: 'auto', right: 'auto' },
      'bottom-center': { bottom: '24px', left: '50%', transform: 'translateX(-50%)', top: 'auto', right: 'auto' },
    }
  };

  function showNotification(message, type = 'info', duration = 3500, options = {}) {
    if (!message) return null;
    
    const position = options.position || 'bottom-right';
    const posStyles = notificationState.positions[position] || notificationState.positions['bottom-right'];
    
    let container = $(`[data-gdi-notif-container="${position}"]`);
    if (!container) {
      container = createElement('div', {
        attrs: { 'data-gdi-notif-container': position, 'aria-live': 'polite', 'aria-atomic': 'true' },
        styles: { position: 'fixed', zIndex: '100000', pointerEvents: 'none', ...posStyles }
      });
      document.body.appendChild(container);
    }
    
    if (notificationState.queue.length >= notificationState.maxVisible) {
      dismissNotification(notificationState.queue[0]);
    }
    
    const id = ++notificationState.idCounter;
    const gradientMap = {
      success: ThemeEngine.token('colors.successGradient'),
      error: ThemeEngine.token('colors.errorGradient'),
      warning: ThemeEngine.token('colors.warningGradient'),
      info: ThemeEngine.token('colors.infoGradient')
    };
    const iconMap = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    
    const notif = createElement('div', {
      attrs: { role: 'status', 'data-notif-id': id, tabindex: '-1' },
      styles: {
        marginTop: position.startsWith('bottom') ? '0' : '8px',
        marginBottom: position.startsWith('top') ? '0' : '8px',
        padding: '14px 20px', borderRadius: DESIGN_TOKENS.radii.lg,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        fontSize: DESIGN_TOKENS.typography.sizes.md,
        fontWeight: DESIGN_TOKENS.typography.weights.semibold,
        color: '#FFFFFF', background: gradientMap[type] || gradientMap.info,
        boxShadow: ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark.xl : DESIGN_TOKENS.shadows.xl,
        display: 'flex', alignItems: 'center', gap: '10px',
        minWidth: '200px', maxWidth: '400px', cursor: 'pointer',
        opacity: '0', transform: position.includes('right') ? 'translateX(100px)' : position.includes('left') ? 'translateX(-100px)' : 'translateY(20px)',
        transition: DESIGN_TOKENS.transitions.spring, pointerEvents: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)', position: 'relative', overflow: 'hidden'
      },
    });
    
    const icon = createElement('span', {
      styles: {
        width: '24px', height: '24px', borderRadius: DESIGN_TOKENS.radii.full,
        background: 'rgba(255, 255, 255, 0.2)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: '0'
      },
      text: iconMap[type] || iconMap.info
    });
    
    const msg = createElement('span', { styles: { lineHeight: '1.4', flex: '1' }, text: message });
    const progress = createElement('div', {
      styles: {
        position: 'absolute', bottom: '0', left: '0', height: '3px',
        background: 'rgba(255, 255, 255, 0.3)', width: '100%',
        borderRadius: `0 0 ${DESIGN_TOKENS.radii.lg} ${DESIGN_TOKENS.radii.lg}`,
        transition: `width ${duration}ms linear`
      }
    });
    
    const closeBtn = createElement('button', {
      attrs: { 'aria-label': 'Dismiss notification', type: 'button' },
      styles: {
        background: 'none', border: 'none', color: 'inherit', cursor: 'pointer',
        fontSize: '16px', padding: '0 4px', opacity: '0.7', lineHeight: '1'
      },
      text: '×'
    });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); dismissNotification(notif); });
    
    notif.appendChild(icon); notif.appendChild(msg); notif.appendChild(closeBtn); notif.appendChild(progress);
    container.appendChild(notif);
    notificationState.queue.push(notif);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateX(0) translateY(0)';
        progress.style.width = '0%';
      });
    });
    
    notif.addEventListener('click', () => dismissNotification(notif));
    const timer = setTimeout(() => dismissNotification(notif), duration);
    
    function dismissNotification(el) {
      if (!el?.parentNode) return;
      clearTimeout(timer);
      el.style.opacity = '0';
      el.style.transform = position.includes('right') ? 'translateX(100px)' : position.includes('left') ? 'translateX(-100px)' : 'translateY(-20px)';
      
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
        const idx = notificationState.queue.indexOf(el);
        if (idx > -1) notificationState.queue.splice(idx, 1);
        if (notificationState.queue.length === 0 && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300);
    }
    
    return { element: notif, dismiss: () => dismissNotification(notif) };
  }

  // ==================== MODAL SYSTEM ====================

  const modalState = { instances: new Map(), idCounter: 0 };

  function createModal(title, content, options = {}) {
    const { 
      onClose = null, closeOnOverlay = true, closeOnEscape = true,
      width = '560px', maxWidth = '95vw', maxHeight = '85vh',
      showCloseButton = true, className = ''
    } = options;
    
    const id = ++modalState.idCounter;
    const zIndex = 99990 + id;
    const previousFocus = document.activeElement;
    
    const overlay = createElement('div', {
      attrs: { role: 'dialog', ariaModal: 'true', ariaLabelledBy: `gdi-modal-title-${id}`, className: `gdi-modal-overlay ${className}` },
      styles: {
        position: 'fixed', inset: '0', zIndex: zIndex.toString(),
        background: ThemeEngine.token('colors.overlay'),
        backdropFilter: 'blur(8px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px', opacity: '0',
        transition: `opacity ${DESIGN_TOKENS.transitions.slow}`,
        fontFamily: DESIGN_TOKENS.typography.fontFamily
      },
    });
    
    const modal = createElement('div', {
      styles: {
        background: ThemeEngine.token('colors.surface'),
        borderRadius: DESIGN_TOKENS.radii['2xl'],
        width: width, maxWidth: maxWidth, maxHeight: maxHeight,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark['2xl'] : DESIGN_TOKENS.shadows['2xl'],
        border: `1px solid ${ThemeEngine.token('colors.border')}`,
        transform: 'translateY(20px) scale(0.96)', opacity: '0',
        transition: `all ${DESIGN_TOKENS.transitions.spring}`
      }
    });
    
    const header = createElement('div', {
      styles: {
        padding: '18px 24px',
        borderBottom: `1px solid ${ThemeEngine.token('colors.border')}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: `linear-gradient(135deg, ${ThemeEngine.token('colors.surfaceSecondary')}, ${ThemeEngine.token('colors.surfaceTertiary')})`,
        flexShrink: '0'
      }
    });
    
    const titleContainer = createElement('div', { styles: { display: 'flex', alignItems: 'center', gap: '12px' } });
    const iconBox = createElement('div', {
      styles: {
        width: '40px', height: '40px', borderRadius: DESIGN_TOKENS.radii.lg,
        background: ThemeEngine.token('colors.primaryGradient'),
        color: '#FFFFFF', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '20px',
        boxShadow: `0 4px 12px ${ThemeEngine.token('colors.primary')}40`
      },
      text: options.icon || '🛠️'
    });
    
    const titleText = createElement('div');
    const titleH2 = createElement('h2', {
      attrs: { id: `gdi-modal-title-${id}` },
      styles: {
        margin: '0', fontSize: DESIGN_TOKENS.typography.sizes.xl,
        fontWeight: DESIGN_TOKENS.typography.weights.extrabold,
        color: ThemeEngine.token('colors.textPrimary'),
        letterSpacing: '-0.3px'
      },
      text: title
    });
    const subtitle = createElement('div', {
      styles: {
        fontSize: DESIGN_TOKENS.typography.sizes.sm,
        color: ThemeEngine.token('colors.textSecondary'),
        fontWeight: DESIGN_TOKENS.typography.weights.medium,
        marginTop: '2px'
      },
      text: options.subtitle || 'SEO Tools Pro'
    });
    
    titleText.appendChild(titleH2); titleText.appendChild(subtitle);
    titleContainer.appendChild(iconBox); titleContainer.appendChild(titleText);
    
    let closeBtn;
    if (showCloseButton) {
      closeBtn = createElement('button', {
        attrs: { ariaLabel: 'Close modal', type: 'button' },
        styles: {
          width: '34px', height: '34px', borderRadius: DESIGN_TOKENS.radii.lg,
          border: 'none', background: ThemeEngine.token('colors.errorLight'),
          color: ThemeEngine.token('colors.error'), fontSize: '18px',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: `all ${DESIGN_TOKENS.transitions.fast}`,
          flexShrink: '0'
        },
        text: '×',
      });
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = ThemeEngine.token('colors.error');
        closeBtn.style.color = '#FFFFFF';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = ThemeEngine.token('colors.errorLight');
        closeBtn.style.color = ThemeEngine.token('colors.error');
      });
    }
    
    header.appendChild(titleContainer);
    if (closeBtn) header.appendChild(closeBtn);
    
    const body = createElement('div', {
      styles: {
        flex: '1', overflow: 'hidden', display: 'flex',
        flexDirection: 'column', background: ThemeEngine.token('colors.surface')
      }
    });
    const contentWrapper = createElement('div', {
      styles: { flex: '1', overflowY: 'auto', padding: '24px' },
      children: [content]
    });
    body.appendChild(contentWrapper);
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    function getFocusable() {
      return Array.from(modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.disabled && el.offsetParent !== null);
    }
    
    function handleKeydown(e) {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
    
    function handleOverlayClick(e) {
      if (closeOnOverlay && e.target === overlay) close();
    }
    
    document.addEventListener('keydown', handleKeydown);
    overlay.addEventListener('click', handleOverlayClick);
    if (closeBtn) closeBtn.addEventListener('click', close);
    
    modalState.instances.set(id, { overlay, cleanup: handleKeydown });
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0) scale(1)';
        modal.style.opacity = '1';
      });
    });
    
    setTimeout(() => { if (closeBtn) closeBtn.focus(); }, 100);
    
    function close() {
      const instance = modalState.instances.get(id);
      if (!instance) return;
      document.removeEventListener('keydown', instance.cleanup);
      overlay.removeEventListener('click', handleOverlayClick);
      
      overlay.style.opacity = '0';
      modal.style.transform = 'translateY(20px) scale(0.96)';
      modal.style.opacity = '0';
      
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        modalState.instances.delete(id);
        if (previousFocus?.focus) previousFocus.focus();
        if (typeof onClose === 'function') onClose();
      }, 400);
    }
    
    return { overlay, modal, body: contentWrapper, close, id };
  }

  // ==================== FORM ELEMENTS ====================

  function createInputField(config = {}) {
    const { label, id = generateId('input'), placeholder = '', required = false, type = 'text', defaultValue = '', min, max, pattern, validationMessage, autocomplete = 'off' } = config;
    
    const wrapper = createElement('div', { styles: { marginBottom: '16px' }, attrs: { className: 'gdi-form-field' } });
    const labelEl = createElement('label', {
      attrs: { for: id },
      styles: {
        display: 'block', fontWeight: DESIGN_TOKENS.typography.weights.semibold,
        marginBottom: '6px', color: ThemeEngine.token('colors.textPrimary'),
        fontSize: DESIGN_TOKENS.typography.sizes.base
      },
      text: label + (required ? ' *' : '')
    });
    
    const inputContainer = createElement('div', { styles: { position: 'relative' } });
    const input = createElement('input', {
      attrs: { type, id, name: id, placeholder, value: defaultValue, autocomplete },
      styles: {
        width: '100%', padding: '12px 16px',
        border: `1.5px solid ${ThemeEngine.token('colors.border')}`,
        borderRadius: DESIGN_TOKENS.radii.lg,
        fontSize: DESIGN_TOKENS.typography.sizes.md,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        outline: 'none', transition: `all ${DESIGN_TOKENS.transitions.fast}`,
        boxSizing: 'border-box', color: ThemeEngine.token('colors.textPrimary'),
        background: ThemeEngine.token('colors.surface')
      },
    });
    
    if (required) input.required = true;
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (pattern) input.pattern = pattern;
    
    const errorMsg = createElement('div', {
      styles: {
        color: ThemeEngine.token('colors.error'), fontSize: DESIGN_TOKENS.typography.sizes.sm,
        marginTop: '4px', display: 'none', fontWeight: DESIGN_TOKENS.typography.weights.medium
      }
    });
    
    function validate() {
      if (!input.validity.valid) {
        input.style.borderColor = ThemeEngine.token('colors.error');
        errorMsg.textContent = validationMessage || input.validationMessage || 'Please check this field';
        errorMsg.style.display = 'block';
        return false;
      } else {
        input.style.borderColor = ThemeEngine.token('colors.border');
        errorMsg.style.display = 'none';
        return true;
      }
    }
    
    input.addEventListener('focus', () => {
      input.style.borderColor = ThemeEngine.token('colors.primary');
      input.style.boxShadow = `0 0 0 3px ${ThemeEngine.token('colors.primary')}15`;
      input.style.background = ThemeEngine.token('colors.surfaceSecondary');
    });
    
    input.addEventListener('blur', () => {
      input.style.background = ThemeEngine.token('colors.surface');
      input.style.boxShadow = 'none';
      if (required || pattern) validate();
      else if (!input.value.trim() && required) {
        input.style.borderColor = ThemeEngine.token('colors.error');
      } else {
        input.style.borderColor = ThemeEngine.token('colors.border');
      }
    });
    
    if (required || pattern) {
      input.addEventListener('input', debounce(validate, 300));
    }
    
    inputContainer.appendChild(input);
    wrapper.appendChild(labelEl);
    wrapper.appendChild(inputContainer);
    wrapper.appendChild(errorMsg);
    
    return { wrapper, input, validate, id };
  }

  function createTextarea(config = {}) {
    const { label, id = generateId('textarea'), placeholder = '', required = false, defaultValue = '', rows = 4, maxLength } = config;
    
    const wrapper = createElement('div', { styles: { marginBottom: '16px' }, attrs: { className: 'gdi-form-field' } });
    const labelEl = createElement('label', {
      attrs: { for: id },
      styles: {
        display: 'block', fontWeight: DESIGN_TOKENS.typography.weights.semibold,
        marginBottom: '6px', color: ThemeEngine.token('colors.textPrimary'),
        fontSize: DESIGN_TOKENS.typography.sizes.base
      },
      text: label + (required ? ' *' : '')
    });
    
    const textarea = createElement('textarea', {
      attrs: { id, name: id, placeholder, rows: rows.toString(), maxlength: maxLength },
      styles: {
        width: '100%', padding: '12px 16px',
        border: `1.5px solid ${ThemeEngine.token('colors.border')}`,
        borderRadius: DESIGN_TOKENS.radii.lg,
        fontSize: DESIGN_TOKENS.typography.sizes.md,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        outline: 'none', transition: `all ${DESIGN_TOKENS.transitions.fast}`,
        boxSizing: 'border-box', resize: 'vertical', minHeight: '60px',
        color: ThemeEngine.token('colors.textPrimary'),
        background: ThemeEngine.token('colors.surface')
      },
      text: defaultValue,
    });
    
    if (required) textarea.required = true;
    
    const charCount = createElement('div', {
      styles: {
        textAlign: 'right', fontSize: DESIGN_TOKENS.typography.sizes.xs,
        color: ThemeEngine.token('colors.textMuted'), marginTop: '4px'
      }
    });
    
    function updateCharCount() {
      if (maxLength) {
        charCount.textContent = `${textarea.value.length}/${maxLength}`;
        charCount.style.color = textarea.value.length > maxLength * 0.9 
          ? ThemeEngine.token('colors.warning') 
          : ThemeEngine.token('colors.textMuted');
      }
    }
    
    textarea.addEventListener('focus', () => {
      textarea.style.borderColor = ThemeEngine.token('colors.primary');
      textarea.style.boxShadow = `0 0 0 3px ${ThemeEngine.token('colors.primary')}15`;
    });
    
    textarea.addEventListener('blur', () => {
      textarea.style.boxShadow = 'none';
      if (required && !textarea.value.trim()) {
        textarea.style.borderColor = ThemeEngine.token('colors.error');
      } else {
        textarea.style.borderColor = ThemeEngine.token('colors.border');
      }
    });
    
    if (maxLength) {
      textarea.addEventListener('input', updateCharCount);
      updateCharCount();
    }
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(textarea);
    if (maxLength) wrapper.appendChild(charCount);
    
    return { wrapper, textarea, id };
  }

  function createSelect(config = {}) {
    const { label, id = generateId('select'), options = [], required = false, defaultValue = '' } = config;
    
    const wrapper = createElement('div', { styles: { marginBottom: '16px' } });
    const labelEl = createElement('label', {
      attrs: { for: id },
      styles: {
        display: 'block', fontWeight: DESIGN_TOKENS.typography.weights.semibold,
        marginBottom: '6px', color: ThemeEngine.token('colors.textPrimary'),
        fontSize: DESIGN_TOKENS.typography.sizes.base
      },
      text: label + (required ? ' *' : '')
    });
    
    const select = createElement('select', {
      attrs: { id, name: id, required },
      styles: {
        width: '100%', padding: '12px 16px',
        border: `1.5px solid ${ThemeEngine.token('colors.border')}`,
        borderRadius: DESIGN_TOKENS.radii.lg,
        fontSize: DESIGN_TOKENS.typography.sizes.md,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        outline: 'none', transition: `all ${DESIGN_TOKENS.transitions.fast}`,
        boxSizing: 'border-box', color: ThemeEngine.token('colors.textPrimary'),
        background: ThemeEngine.token('colors.surface'), cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: '40px'
      }
    });
    
    options.forEach(opt => {
      const option = createElement('option', {
        attrs: { value: opt.value, selected: opt.value === defaultValue },
        text: opt.label
      });
      select.appendChild(option);
    });
    
    select.addEventListener('focus', () => {
      select.style.borderColor = ThemeEngine.token('colors.primary');
      select.style.boxShadow = `0 0 0 3px ${ThemeEngine.token('colors.primary')}15`;
    });
    select.addEventListener('blur', () => {
      select.style.borderColor = ThemeEngine.token('colors.border');
      select.style.boxShadow = 'none';
    });
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(select);
    return { wrapper, select, id };
  }

  function createButton(text, onClick, options = {}) {
    const { variant = 'primary', fullWidth = true, size = 'md', disabled = false, loading = false } = options;
    
    const variantStyles = {
      primary: { background: ThemeEngine.token('colors.primaryGradient'), color: '#FFFFFF', boxShadow: `0 4px 12px ${ThemeEngine.token('colors.primary')}40` },
      secondary: { background: ThemeEngine.token('colors.surfaceTertiary'), color: ThemeEngine.token('colors.textPrimary'), border: `1px solid ${ThemeEngine.token('colors.border')}` },
      danger: { background: ThemeEngine.token('colors.errorGradient'), color: '#FFFFFF', boxShadow: `0 4px 12px ${ThemeEngine.token('colors.error')}40` },
      success: { background: ThemeEngine.token('colors.successGradient'), color: '#FFFFFF', boxShadow: `0 4px 12px ${ThemeEngine.token('colors.success')}40` },
      ghost: { background: 'transparent', color: ThemeEngine.token('colors.textSecondary'), border: 'none' }
    };
    
    const sizeStyles = {
      sm: { padding: '8px 14px', fontSize: DESIGN_TOKENS.typography.sizes.sm },
      md: { padding: '12px 20px', fontSize: DESIGN_TOKENS.typography.sizes.base },
      lg: { padding: '14px 24px', fontSize: DESIGN_TOKENS.typography.sizes.md }
    };
    
    const btn = createElement('button', {
      attrs: { type: 'button', disabled: disabled || loading, 'aria-busy': loading },
      styles: {
        ...variantStyles[variant] || variantStyles.primary,
        ...sizeStyles[size] || sizeStyles.md,
        width: fullWidth ? '100%' : 'auto', border: 'none',
        borderRadius: DESIGN_TOKENS.radii.lg, cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        fontWeight: DESIGN_TOKENS.typography.weights.bold,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', transition: `all ${DESIGN_TOKENS.transitions.fast}`,
        position: 'relative', overflow: 'hidden', opacity: (disabled || loading) ? '0.6' : '1'
      },
    });
    
    if (loading) {
      const spinner = createElement('span', {
        styles: {
          width: '16px', height: '16px', border: '2px solid currentColor',
          borderRightColor: 'transparent', borderRadius: '50%',
          display: 'inline-block', animation: 'gdi-spin 0.75s linear infinite'
        }
      });
      btn.appendChild(spinner);
      btn.appendChild(createElement('span', { text }));
    } else {
      btn.textContent = text;
    }
    
    if (!disabled && !loading) {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark.lg : DESIGN_TOKENS.shadows.lg;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = variantStyles[variant]?.boxShadow || 'none';
      });
      btn.addEventListener('mousedown', () => { btn.style.transform = 'translateY(0) scale(0.98)'; });
      btn.addEventListener('mouseup', () => { btn.style.transform = 'translateY(-2px) scale(1)'; });
      
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = createElement('span', {
          styles: {
            position: 'absolute', width: `${size}px`, height: `${size}px`,
            left: `${x}px`, top: `${y}px`,
            background: 'rgba(255,255,255,0.3)', borderRadius: '50%',
            transform: 'scale(0)', animation: 'gdi-ripple 0.6s ease-out',
            pointerEvents: 'none'
          }
        });
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        if (typeof onClick === 'function') onClick(e);
      });
    }
    
    return btn;
  }

  function createBadge(text, variant = 'primary') {
    const variantStyles = {
      primary: { bg: `${ThemeEngine.token('colors.primary')}15`, color: ThemeEngine.token('colors.primary') },
      success: { bg: ThemeEngine.token('colors.successLight'), color: ThemeEngine.token('colors.success') },
      warning: { bg: ThemeEngine.token('colors.warningLight'), color: ThemeEngine.token('colors.warning') },
      error: { bg: ThemeEngine.token('colors.errorLight'), color: ThemeEngine.token('colors.error') },
      info: { bg: ThemeEngine.token('colors.infoLight'), color: ThemeEngine.token('colors.info') }
    };
    
    return createElement('span', {
      styles: {
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
        borderRadius: DESIGN_TOKENS.radii.full,
        background: variantStyles[variant]?.bg,
        color: variantStyles[variant]?.color,
        fontSize: DESIGN_TOKENS.typography.sizes.xs,
        fontWeight: DESIGN_TOKENS.typography.weights.bold,
        letterSpacing: '0.3px'
      },
      text: text
    });
  }

  function createProgressBar(value = 0, color = null, height = 8) {
    const actualColor = color || ThemeEngine.token('colors.primary');
    const container = createElement('div', {
      styles: {
        width: '100%', height: `${height}px`,
        background: ThemeEngine.token('colors.surfaceTertiary'),
        borderRadius: DESIGN_TOKENS.radii.full, overflow: 'hidden'
      }
    });
    const fill = createElement('div', {
      styles: {
        width: `${Math.min(Math.max(value, 0), 100)}%`, height: '100%',
        background: actualColor, borderRadius: DESIGN_TOKENS.radii.full,
        transition: `width 0.5s ease`
      }
    });
    container.appendChild(fill);
    
    // Backwards Compatibility: Attach `setValue` to the container directly
    container.setValue = (v) => { fill.style.width = `${Math.min(Math.max(v, 0), 100)}%`; };
    
    return { container, fill, setValue: container.setValue };
  }

  function createScoreRing(score = 0, size = 100) {
    const color = score >= 80 ? ThemeEngine.token('colors.success') : score >= 60 ? ThemeEngine.token('colors.warning') : ThemeEngine.token('colors.error');
    const radius = (size / 2) - 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;
    
    const container = createElement('div', {
      styles: {
        position: 'relative', width: `${size}px`, height: `${size}px`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }
    });
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.transform = 'rotate(-90deg)';
    
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', size / 2);
    bgCircle.setAttribute('cy', size / 2);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', ThemeEngine.token('colors.surfaceTertiary'));
    bgCircle.setAttribute('stroke-width', '7');
    
    const fgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fgCircle.setAttribute('cx', size / 2);
    fgCircle.setAttribute('cy', size / 2);
    fgCircle.setAttribute('r', radius);
    fgCircle.setAttribute('fill', 'none');
    fgCircle.setAttribute('stroke', color);
    fgCircle.setAttribute('stroke-width', '7');
    fgCircle.setAttribute('stroke-dasharray', circumference);
    fgCircle.setAttribute('stroke-dashoffset', offset);
    fgCircle.setAttribute('stroke-linecap', 'round');
    fgCircle.style.transition = 'stroke-dashoffset 1s ease';
    
    svg.appendChild(bgCircle);
    svg.appendChild(fgCircle);
    container.appendChild(svg);
    
    const text = createElement('div', {
      styles: { position: 'absolute', textAlign: 'center', lineHeight: '1.1' }
    });
    const scoreText = createElement('div', {
      styles: {
        fontSize: `${size * 0.28}px`,
        fontWeight: DESIGN_TOKENS.typography.weights.extrabold,
        color: color
      },
      text: score.toString()
    });
    const label = createElement('div', {
      styles: {
        fontSize: `${size * 0.1}px`,
        color: ThemeEngine.token('colors.textSecondary'),
        fontWeight: DESIGN_TOKENS.typography.weights.semibold
      },
      text: '/100'
    });
    
    text.appendChild(scoreText);
    text.appendChild(label);
    container.appendChild(text);
    
    // 🔥 CRITICAL FIX: Attach setScore directly to the DOM node
    // This allows `seo-tools.js` to blindly do: `appendChild(createScoreRing(...))`
    // without triggering a "parameter 1 is not of type 'Node'" error.
    container.setScore = (s) => {
      const newColor = s >= 80 ? ThemeEngine.token('colors.success') : s >= 60 ? ThemeEngine.token('colors.warning') : ThemeEngine.token('colors.error');
      const newOffset = circumference - (Math.min(Math.max(s, 0), 100) / 100) * circumference;
      fgCircle.setAttribute('stroke-dashoffset', newOffset);
      fgCircle.setAttribute('stroke', newColor);
      scoreText.textContent = s.toString();
      scoreText.style.color = newColor;
    };
    
    return container;
  }

  function createStatCard(config = {}) {
    const { label, value, icon = '📊', color = ThemeEngine.token('colors.primary'), trend = null } = config;
    
    const card = createElement('div', {
      styles: {
        background: ThemeEngine.token('colors.surface'),
        border: `1px solid ${ThemeEngine.token('colors.border')}`,
        borderRadius: DESIGN_TOKENS.radii.xl, padding: '16px',
        boxShadow: ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark.xs : DESIGN_TOKENS.shadows.xs,
        transition: `all ${DESIGN_TOKENS.transitions.fast}`
      }
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark.md : DESIGN_TOKENS.shadows.md;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = ThemeEngine.isDark() ? DESIGN_TOKENS.shadows.dark.xs : DESIGN_TOKENS.shadows.xs;
    });
    
    const header = createElement('div', {
      styles: {
        fontSize: DESIGN_TOKENS.typography.sizes.xs,
        fontWeight: DESIGN_TOKENS.typography.weights.bold,
        color: ThemeEngine.token('colors.textSecondary'),
        textTransform: 'uppercase', letterSpacing: '0.5px',
        marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'
      },
      html: `${icon} ${escapeHtml(label)}`
    });
    
    const valueRow = createElement('div', {
      styles: { display: 'flex', alignItems: 'baseline', gap: '8px' }
    });
    
    const valueEl = createElement('div', {
      styles: {
        fontSize: DESIGN_TOKENS.typography.sizes['2xl'],
        fontWeight: DESIGN_TOKENS.typography.weights.extrabold,
        color: color
      },
      text: String(value)
    });
    
    valueRow.appendChild(valueEl);
    
    if (trend !== null) {
      const trendEl = createElement('span', {
        styles: {
          fontSize: DESIGN_TOKENS.typography.sizes.sm,
          color: trend >= 0 ? ThemeEngine.token('colors.success') : ThemeEngine.token('colors.error'),
          fontWeight: DESIGN_TOKENS.typography.weights.semibold
        },
        text: `${trend >= 0 ? '↑' : '↓'} ${Math.abs(trend)}%`
      });
      valueRow.appendChild(trendEl);
    }
    
    card.appendChild(header);
    card.appendChild(valueRow);
    return card;
  }

  // ==================== VIRTUAL DATA TABLE ====================

  function createDataTable(config = {}) {
    const { columns = [], rows = [], maxHeight = 400, rowHeight = 44, virtual = rows.length > 100 } = config;
    
    const container = createElement('div', {
      styles: {
        maxHeight: `${maxHeight}px`, overflowY: 'auto',
        border: `1px solid ${ThemeEngine.token('colors.border')}`,
        borderRadius: DESIGN_TOKENS.radii.lg,
        position: 'relative'
      },
      attrs: { className: 'gdi-scrollbar' }
    });
    
    const table = createElement('table', {
      styles: {
        width: '100%', borderCollapse: 'collapse',
        fontSize: DESIGN_TOKENS.typography.sizes.base,
        background: ThemeEngine.token('colors.surface')
      }
    });
    
    const thead = createElement('thead');
    const headerRow = createElement('tr', {
      styles: {
        background: ThemeEngine.token('colors.surfaceSecondary'),
        position: 'sticky', top: '0', zIndex: '1'
      }
    });
    
    columns.forEach(col => {
      const th = createElement('th', {
        styles: {
          padding: '12px 14px', textAlign: 'left',
          fontWeight: DESIGN_TOKENS.typography.weights.semibold,
          color: ThemeEngine.token('colors.textPrimary'),
          borderBottom: `2px solid ${ThemeEngine.token('colors.border')}`,
          fontSize: DESIGN_TOKENS.typography.sizes.xs,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          width: col.width || 'auto'
        },
        text: col.label
      });
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    
    // Performance upgrade: Event delegation instead of binding to 1,000s of TRs
    tbody.addEventListener('mouseover', (e) => {
      const row = e.target.closest('tr');
      if (row) row.style.background = ThemeEngine.token('colors.surfaceSecondary');
    });
    tbody.addEventListener('mouseout', (e) => {
      const row = e.target.closest('tr');
      if (row) row.style.background = ThemeEngine.token('colors.surface');
    });

    if (!virtual) {
      const fragment = document.createDocumentFragment();
      rows.forEach((row, index) => {
        const tr = createElement('tr', {
          styles: {
            borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}`,
            transition: `background ${DESIGN_TOKENS.transitions.fast}`
          },
          attrs: { 'data-row-index': index }
        });
        
        columns.forEach(col => {
          const td = createElement('td', {
            styles: {
              padding: '10px 14px',
              color: ThemeEngine.token('colors.textSecondary'),
              fontSize: DESIGN_TOKENS.typography.sizes.base,
              borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}`
            },
            text: String(row[col.key] ?? '')
          });
          tr.appendChild(td);
        });
        fragment.appendChild(tr);
      });
      tbody.appendChild(fragment);
    } else {
      // Virtual scrolling for large datasets
      const totalHeight = rows.length * rowHeight;
      const spacer = createElement('div', { styles: { height: `${totalHeight}px`, position: 'relative' } });
      
      function renderVisibleRows() {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const startIdx = Math.floor(scrollTop / rowHeight);
        const endIdx = Math.min(startIdx + Math.ceil(containerHeight / rowHeight) + 2, rows.length);
        
        tbody.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        for (let i = startIdx; i < endIdx; i++) {
          const row = rows[i];
          const tr = createElement('tr', {
            styles: {
              position: 'absolute', top: `${i * rowHeight}px`,
              height: `${rowHeight}px`, width: '100%',
              display: 'table', tableLayout: 'fixed',
              borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}`,
              background: ThemeEngine.token('colors.surface'),
              transition: `background ${DESIGN_TOKENS.transitions.fast}`
            },
            attrs: { 'data-row-index': i }
          });
          
          columns.forEach(col => {
            const td = createElement('td', {
              styles: {
                padding: '10px 14px',
                color: ThemeEngine.token('colors.textSecondary'),
                fontSize: DESIGN_TOKENS.typography.sizes.base,
                borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}`,
                width: col.width || 'auto'
              },
              text: String(row[col.key] ?? '')
            });
            tr.appendChild(td);
          });
          fragment.appendChild(tr);
        }
        tbody.appendChild(fragment);
      }
      
      container.addEventListener('scroll', throttle(renderVisibleRows, 50));
      renderVisibleRows();
    }
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    // 🔥 CRITICAL FIX: Attach methods directly to the DOM node
    // This maintains backward compatibility so tools can append the return value safely
    container.updateRows = (newRows) => {
      rows.length = 0;
      rows.push(...newRows);
      if (!virtual) {
        tbody.innerHTML = '';
        const fragment = document.createDocumentFragment();
        rows.forEach((row, index) => {
          const tr = createElement('tr', {
            styles: { borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}`, transition: `background ${DESIGN_TOKENS.transitions.fast}` },
            attrs: { 'data-row-index': index }
          });
          columns.forEach(col => {
            const td = createElement('td', {
              styles: { padding: '10px 14px', color: ThemeEngine.token('colors.textSecondary'), fontSize: DESIGN_TOKENS.typography.sizes.base, borderBottom: `1px solid ${ThemeEngine.token('colors.borderLight')}` },
              text: String(row[col.key] ?? '')
            });
            tr.appendChild(td);
          });
          fragment.appendChild(tr);
        });
        tbody.appendChild(fragment);
      }
    };
    
    // Expose internal elements just in case advanced tools need them
    container.tableElement = table;
    container.tbodyElement = tbody;

    return container;
  }

  // ==================== TOGGLE / SWITCH ====================

  function createToggle(config = {}) {
    const { label, id = generateId('toggle'), checked = false, onChange = null } = config;
    
    const wrapper = createElement('label', {
      attrs: { for: id },
      styles: {
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        cursor: 'pointer', userSelect: 'none'
      }
    });
    
    const input = createElement('input', {
      attrs: { type: 'checkbox', id, checked },
      styles: { position: 'absolute', opacity: '0', width: '0', height: '0' }
    });
    
    const track = createElement('span', {
      styles: {
        position: 'relative', width: '44px', height: '24px',
        background: checked ? ThemeEngine.token('colors.primary') : ThemeEngine.token('colors.border'),
        borderRadius: DESIGN_TOKENS.radii.full,
        transition: `background ${DESIGN_TOKENS.transitions.fast}`,
        flexShrink: '0'
      }
    });
    
    const thumb = createElement('span', {
      styles: {
        position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
        width: '20px', height: '20px', background: '#FFFFFF',
        borderRadius: '50%', transition: `transform ${DESIGN_TOKENS.transitions.fast}`,
        boxShadow: DESIGN_TOKENS.shadows.sm
      }
    });
    
    track.appendChild(thumb);
    
    const labelText = createElement('span', {
      styles: {
        fontSize: DESIGN_TOKENS.typography.sizes.md,
        color: ThemeEngine.token('colors.textPrimary'),
        fontWeight: DESIGN_TOKENS.typography.weights.medium
      },
      text: label
    });
    
    input.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      track.style.background = isChecked ? ThemeEngine.token('colors.primary') : ThemeEngine.token('colors.border');
      thumb.style.transform = isChecked ? 'translateX(20px)' : 'translateX(0)';
      if (typeof onChange === 'function') onChange(isChecked);
    });
    
    wrapper.appendChild(input);
    wrapper.appendChild(track);
    wrapper.appendChild(labelText);
    
    return { wrapper, input, id, getValue: () => input.checked, setValue: (v) => { input.checked = v; input.dispatchEvent(new Event('change')); } };
  }

  // ==================== SKELETON LOADER ====================

  function createSkeleton(config = {}) {
    const { width = '100%', height = '16px', circle = false } = config;
    
    return createElement('div', {
      styles: {
        width, height,
        borderRadius: circle ? '50%' : DESIGN_TOKENS.radii.md,
        background: `linear-gradient(90deg, ${ThemeEngine.token('colors.surfaceSecondary')} 25%, ${ThemeEngine.token('colors.surfaceTertiary')} 50%, ${ThemeEngine.token('colors.surfaceSecondary')} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'gdi-shimmer 1.5s infinite',
        display: 'inline-block'
      }
    });
  }

  // ==================== TOOLTIP ====================

  function createTooltip(target, content, options = {}) {
    const { position = 'top', delay = 200 } = options;
    
    let tooltip = null;
    let timer = null;
    
    const positions = {
      top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
      bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
      left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
      right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' }
    };
    
    function show() {
      if (tooltip) return;
      timer = setTimeout(() => {
        tooltip = createElement('div', {
          attrs: { role: 'tooltip' },
          styles: {
            position: 'absolute', zIndex: '99999',
            padding: '6px 10px', borderRadius: DESIGN_TOKENS.radii.md,
            background: ThemeEngine.token('colors.textPrimary'),
            color: ThemeEngine.token('colors.surface'),
            fontSize: DESIGN_TOKENS.typography.sizes.sm,
            fontWeight: DESIGN_TOKENS.typography.weights.medium,
            whiteSpace: 'nowrap', pointerEvents: 'none',
            opacity: '0', transition: `opacity ${DESIGN_TOKENS.transitions.fast}`,
            ...positions[position]
          },
          text: content
        });
        
        target.style.position = 'relative';
        target.appendChild(tooltip);
        requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
      }, delay);
    }
    
    function hide() {
      clearTimeout(timer);
      if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          if (tooltip?.parentNode) tooltip.parentNode.removeChild(tooltip);
          tooltip = null;
        }, 150);
      }
    }
    
    target.addEventListener('mouseenter', show);
    target.addEventListener('mouseleave', hide);
    target.addEventListener('focus', show);
    target.addEventListener('blur', hide);
    
    return {
      destroy: () => {
        target.removeEventListener('mouseenter', show);
        target.removeEventListener('mouseleave', hide);
        target.removeEventListener('focus', show);
        target.removeEventListener('blur', hide);
        hide();
      },
      update: (newContent) => { content = newContent; if (tooltip) tooltip.textContent = newContent; }
    };
  }

  // ==================== EXPORT ====================

  return {
    // Core
    DESIGN_TOKENS,
    ThemeEngine,
    createElement, $, $$, escapeHtml, cleanText,
    debounce, throttle, formatFileSize, hashString, generateId,
    
    // Observers
    IORegistry,
    
    // Systems
    copyToClipboard,
    showNotification,
    createModal,
    createTooltip,
    
    // Form Elements
    createInputField,
    createTextarea,
    createSelect,
    createButton,
    createToggle,
    
    // Display
    createBadge,
    createProgressBar,
    createScoreRing,
    createStatCard,
    createDataTable,
    createSkeleton
  };
});