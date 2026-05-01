/**
 * SEO Tools Pro - Advanced Tools Modules v4.0
 */
if (typeof window.SEOTools === 'undefined') {
    window.SEOTools = {};
}
(function() {
    'use strict';
    var GDI = window.GDI || {};
    
    // ──────────────────────────────────────────────
    // 🔧 FIX: Ensure $GDI exists for page DOM queries
    // ──────────────────────────────────────────────
    if (!window.$GDI) {
      window.$GDI = {
        $(selector, scope = document) {
          try { return scope.querySelector(selector); } catch (e) { return null; }
        },
        $$(selector, scope = document) {
          try { return Array.from(scope.querySelectorAll(selector)); } catch (e) { return []; }
        },
        id(id) { return document.getElementById(id); },
        matches(el, selector) {
          try { return el && el.matches && el.matches(selector); } catch (e) { return false; }
        },
        closest(el, selector) {
          try { return el && el.closest ? el.closest(selector) : null; } catch (e) { return null; }
        }
      };
    }
    // ──────────────────────────────────────────────
    
    const DT = window.DESIGN_TOKENS || {};

// ==================== ADVANCED SEO TEXT COMPARE TOOL ====================

function advancedSEOCompare(contextInfo = {}) {
  const DEBOUNCE_MS = 400;
  let debounceTimer;

  // Unified, comprehensive stop words list
  const STOP_WORDS = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','day','get','has','him','his','how','its','may','new','now','old','see','two','who','boy','did','she','use','way','many','oil','sit','set','run','eat','far','sea','eye','ago','off','too','any','say','man','try','ask','end','why','let','put','own','tell','very','when','much','would','there','their','what','said','each','which','will','about','could','other','after','first','never','these','think','where','being','every','great','might','shall','still','those','while','this','that','with','have','from','they','know','want','been','good','some','time','come','here','just','like','long','make','over','such','take','than','them','well','were','into','also']);

  const content = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', height: '80vh', gap: '0' }
  });

  // ─── HEADER TOOLBAR ───
  const headerToolbar = GDI.createElement('div', {
    styles: { display: 'flex', gap: '8px', marginBottom: '12px', flexShrink: '0', flexWrap: 'wrap' }
  });

  const swapBtn = GDI.createButton('⇄ Swap Panels', swapPanels, { variant: 'secondary', size: 'sm', fullWidth: false });
  const syncScrollBtn = GDI.createToggle({ label: 'Sync Scroll', checked: true, onChange: (val) => syncScroll = val });
  syncScrollBtn.wrapper.style.marginRight = 'auto'; // Pushes exports to the right
  
  const exportJsonBtn = GDI.createButton('⬇ Export JSON', () => exportResults('json'), { variant: 'secondary', size: 'sm', fullWidth: false });
  const exportCsvBtn = GDI.createButton('⬇ Export CSV', () => exportResults('csv'), { variant: 'secondary', size: 'sm', fullWidth: false });

  headerToolbar.appendChild(swapBtn);
  headerToolbar.appendChild(syncScrollBtn.wrapper);
  headerToolbar.appendChild(exportJsonBtn);
  headerToolbar.appendChild(exportCsvBtn);

  // ─── MAIN CONTENT ───
  const mainArea = GDI.createElement('div', {
    styles: {
      flex: '1', display: 'flex', overflow: 'hidden',
      border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      borderRadius: GDI.DESIGN_TOKENS.radii.lg,
      marginBottom: '16px'
    }
  });

  const leftPanel = buildComparePanel('left', 'Original Text');
  const rightPanel = buildComparePanel('right', 'Comparison Text');

  mainArea.appendChild(leftPanel);
  mainArea.appendChild(rightPanel);

  // ─── RESULTS PANEL ───
  const resultsArea = GDI.createElement('div', {
    styles: {
      border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      borderRadius: GDI.DESIGN_TOKENS.radii.lg,
      background: GDI.ThemeEngine.token('colors.surfaceSecondary'),
      maxHeight: '45%', overflowY: 'auto', padding: '0', flexShrink: '0',
      display: 'flex', flexDirection: 'column'
    }
  });

  const resultsHeader = GDI.createElement('div', {
    styles: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 20px', borderBottom: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      position: 'sticky', top: '0', background: GDI.ThemeEngine.token('colors.surfaceSecondary'), zIndex: '2'
    }
  });

  const scoreBadge = GDI.createBadge('0% Similar', 'info');
  const refreshBtn = GDI.createButton('Refresh Analysis', performComparison, { variant: 'secondary', size: 'sm', fullWidth: false });

  resultsHeader.appendChild(GDI.createElement('strong', {
    styles: { color: GDI.ThemeEngine.token('colors.textPrimary'), fontSize: '14px' },
    text: '📊 SEO Comparison Results'
  }));

  const headerRight = GDI.createElement('div', { styles: { display: 'flex', gap: '12px', alignItems: 'center' } });
  headerRight.appendChild(scoreBadge);
  headerRight.appendChild(refreshBtn);
  resultsHeader.appendChild(headerRight);

  // Tab Navigation
  const tabBar = GDI.createElement('div', {
    styles: {
      display: 'flex', gap: '4px', padding: '8px 20px 0',
      borderBottom: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      background: GDI.ThemeEngine.token('colors.surfaceSecondary')
    }
  });

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'diff', label: '📝 Diff View' },
    { id: 'structure', label: '🏗️ Structure' },
    { id: 'keywords', label: '🔑 Keywords' }
  ];

  let activeTab = 'overview';
  const tabButtons = {};

  tabs.forEach(tab => {
    const btn = GDI.createElement('button', {
      text: tab.label,
      styles: {
        padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
        fontSize: '12px', fontWeight: '600', color: GDI.ThemeEngine.token('colors.textSecondary'),
        borderBottom: '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s'
      }
    });
    btn.addEventListener('click', () => switchTab(tab.id));
    tabButtons[tab.id] = btn;
    tabBar.appendChild(btn);
  });

  const resultsContent = GDI.createElement('div', {
    attrs: { id: 'gdi-compare-results' },
    styles: { padding: '16px 20px', flex: '1', overflowY: 'auto' }
  });

  resultsArea.appendChild(resultsHeader);
  resultsArea.appendChild(tabBar);
  resultsArea.appendChild(resultsContent);

  content.appendChild(headerToolbar);
  content.appendChild(mainArea);
  content.appendChild(resultsArea);

  GDI.createModal('Advanced SEO Compare', content, {
    width: '95vw', maxWidth: '1400px', icon: '🔍',
    subtitle: 'Compare content, meta tags, readability, and structure'
  });

  let syncScroll = true;
  let lastResults = null;

  // ─── PANEL BUILDER ───
  function buildComparePanel(side, titleText) {
    const panel = GDI.createElement('div', {
      styles: {
        flex: '1', display: 'flex', flexDirection: 'column',
        borderRight: side === 'left' ? `1px solid ${GDI.ThemeEngine.token('colors.border')}` : 'none',
        overflow: 'hidden', minWidth: '0'
      }
    });

    const toolbar = GDI.createElement('div', {
      styles: {
        padding: '10px 14px', background: GDI.ThemeEngine.token('colors.surface'),
        borderBottom: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
        flexWrap: 'wrap', flexShrink: '0'
      }
    });

    const select = GDI.createElement('select', {
      styles: {
        padding: '6px 10px', border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
        borderRadius: GDI.DESIGN_TOKENS.radii.md, fontSize: '12px', cursor: 'pointer',
        background: GDI.ThemeEngine.token('colors.surface'), color: GDI.ThemeEngine.token('colors.textPrimary'),
        maxWidth: '160px'
      },
      children: [
        GDI.createElement('option', { attrs: { value: 'paste' }, text: '📝 Paste Text' }),
        GDI.createElement('option', { attrs: { value: 'selection' }, text: '📋 Current Selection' }),
        GDI.createElement('option', { attrs: { value: 'page' }, text: '🌐 Entire Page' }),
        GDI.createElement('option', { attrs: { value: 'meta-title' }, text: '🏷️ Meta Title' }),
        GDI.createElement('option', { attrs: { value: 'meta-description' }, text: '📄 Meta Description' }),
        GDI.createElement('option', { attrs: { value: 'h1' }, text: '📊 H1 Heading' }),
        GDI.createElement('option', { attrs: { value: 'first-paragraph' }, text: '📖 First Paragraph' }),
        GDI.createElement('option', { attrs: { value: 'headings' }, text: '📑 All Headings' }),
        GDI.createElement('option', { attrs: { value: 'links' }, text: '🔗 All Links' })
      ]
    });

    const loadBtn = GDI.createButton('Load', null, { variant: 'primary', size: 'sm', fullWidth: false });
    const clearBtn = GDI.createButton('Clear', null, { variant: 'danger', size: 'sm', fullWidth: false });
    const copyBtn = GDI.createButton('Copy', null, { variant: 'secondary', size: 'sm', fullWidth: false });

    const actionGroup = GDI.createElement('div', { styles: { display: 'flex', gap: '6px' } });
    actionGroup.appendChild(clearBtn);
    actionGroup.appendChild(copyBtn);

    toolbar.appendChild(GDI.createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px' },
      children: [
        GDI.createElement('strong', { text: titleText, styles: { fontSize: '13px', color: GDI.ThemeEngine.token('colors.textPrimary') } }),
        select, loadBtn
      ]
    }));
    toolbar.appendChild(actionGroup);

    const textarea = GDI.createElement('textarea', {
      attrs: { id: `${side}-textarea`, placeholder: `Enter or load ${side === 'left' ? 'original' : 'comparison'} text here...` },
      styles: {
        flex: '1', padding: '14px', border: 'none', resize: 'none',
        fontFamily: GDI.DESIGN_TOKENS.typography.fontMono, fontSize: '13px',
        lineHeight: '1.6', outline: 'none', color: GDI.ThemeEngine.token('colors.textPrimary'),
        background: GDI.ThemeEngine.token('colors.surface')
      }
    });

    const statsBar = GDI.createElement('div', {
      attrs: { id: `${side}-stats` },
      styles: {
        padding: '8px 14px', background: GDI.ThemeEngine.token('colors.surfaceSecondary'),
        borderTop: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
        fontSize: '11px', color: GDI.ThemeEngine.token('colors.textSecondary'),
        display: 'flex', gap: '14px', flexWrap: 'wrap', flexShrink: '0'
      }
    });

    // ─── EVENTS ───
    loadBtn.addEventListener('click', () => {
      let textContent = '';
      switch (select.value) {
        case 'selection': textContent = window.getSelection().toString().trim() || 'No text selected.'; break;
        case 'page': textContent = document.body.innerText; break;
        case 'meta-title': textContent = document.title; break;
        case 'meta-description': textContent = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''; break;
        case 'h1': textContent = document.querySelector('h1')?.textContent || ''; break;
        case 'first-paragraph': textContent = document.querySelector('p')?.textContent || ''; break;
        case 'headings':
          textContent = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
            .map(h => `[${h.tagName}] ${h.textContent.trim()}`).join('\n'); break;
        case 'links':
          textContent = Array.from(document.querySelectorAll('a[href]'))
            .map(a => `${a.textContent.trim()} → ${a.href}`).join('\n'); break;
        case 'paste': default: return;
      }
      textarea.value = textContent;
      scheduleComparison();
    });

    clearBtn.addEventListener('click', () => { textarea.value = ''; scheduleComparison(); });
    copyBtn.addEventListener('click', () => { GDI.copyToClipboard(textarea.value).then(() => GDI.showNotification('Copied!', 'success')); });

    textarea.addEventListener('input', scheduleComparison);
    textarea.addEventListener('scroll', () => {
      if (!syncScroll) return;
      const otherSide = side === 'left' ? 'right' : 'left';
      const other = content.querySelector(`#${otherSide}-textarea`);
      if (other) other.scrollTop = textarea.scrollTop;
    });

    panel.appendChild(toolbar);
    panel.appendChild(textarea);
    panel.appendChild(statsBar);

    return panel;
  }

  // ─── UTILITIES ───
  function scheduleComparison() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performComparison, DEBOUNCE_MS);
  }

  function swapPanels() {
    const left = content.querySelector('#left-textarea');
    const right = content.querySelector('#right-textarea');
    if (!left || !right) return;
    const temp = left.value;
    left.value = right.value;
    right.value = temp;
    performComparison();
  }

  function switchTab(tabId) {
    activeTab = tabId;
    Object.keys(tabButtons).forEach(id => {
      const btn = tabButtons[id];
      const isActive = id === tabId;
      btn.style.color = isActive ? GDI.ThemeEngine.token('colors.primary') : GDI.ThemeEngine.token('colors.textSecondary');
      btn.style.borderBottom = isActive ? `2px solid ${GDI.ThemeEngine.token('colors.primary')}` : '2px solid transparent';
    });
    renderResults();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── ANALYSIS ENGINE ───
  function getWords(text) {
    return (text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []);
  }

  function getTermFreq(text) {
    const words = getWords(text);
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return freq;
  }

  function calculateCosineSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    const tf1 = getTermFreq(text1);
    const tf2 = getTermFreq(text2);
    const allWords = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
    let dot = 0, mag1 = 0, mag2 = 0;
    allWords.forEach(w => {
      const v1 = tf1[w] || 0, v2 = tf2[w] || 0;
      dot += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    });
    if (mag1 === 0 || mag2 === 0) return 0;
    return (dot / (Math.sqrt(mag1) * Math.sqrt(mag2)));
  }

  function calculateJaccardSimilarity(text1, text2) {
    const set1 = new Set(getWords(text1));
    const set2 = new Set(getWords(text2));
    if (set1.size === 0 || set2.size === 0) return 0;
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  // PERFORMANCE FIX: Cap LCS calculation at 2000 chars to prevent browser lockup
  function calculateLCSSimilarity(text1, text2) {
    const limit = 2000;
    const s1 = text1.replace(/\s+/g, ' ').trim().substring(0, limit);
    const s2 = text2.replace(/\s+/g, ' ').trim().substring(0, limit);
    if (!s1 || !s2) return 0;
    
    const m = s1.length, n = s2.length;
    const dp = Array(2).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i % 2][j] = s1[i - 1] === s2[j - 1]
          ? dp[(i - 1) % 2][j - 1] + 1
          : Math.max(dp[(i - 1) % 2][j], dp[i % 2][j - 1]);
      }
    }
    const lcs = dp[m % 2][n];
    return (2 * lcs) / (m + n);
  }

  function calculateSimilarity(text1, text2) {
    const cosine = calculateCosineSimilarity(text1, text2);
    const jaccard = calculateJaccardSimilarity(text1, text2);
    const lcs = calculateLCSSimilarity(text1, text2);
    // Weighted ensemble: cosine good for topic, jaccard for vocabulary overlap, lcs for exact duplication
    const score = (cosine * 0.5) + (jaccard * 0.3) + (lcs * 0.2);
    return Math.min(100, Math.round(score * 100));
  }

  // ACCURACY FIX: Better regex for English syllable counting
  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    // Handle silent 'e' and 'es' / 'ed', but keep 'le' (like table, apple)
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  function calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.match(/\b[a-zA-Z]{2,}\b/g) || [];
    if (sentences.length === 0 || words.length === 0) return { flesch: 0, kincaid: 0, smog: 0 };

    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = totalSyllables / words.length;

    const flesch = Math.max(0, Math.min(100, Math.round(206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord))));
    const kincaid = Math.max(0, Math.round((0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59));
    const smog = Math.max(0, Math.round(1.043 * Math.sqrt(words.filter(w => countSyllables(w) > 2).length * (30 / sentences.length)) + 3.1291));

    return { flesch, kincaid, smog };
  }

  function getReadabilityLevel(score) {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  }

  function getSEOMetrics(text) {
    const words = getWords(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const headings = (text.match(/^#{1,6}\s+/gm) || []).length + (text.match(/\[H[1-6]\]/g) || []).length;

    return {
      charCount: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      headingCount: headings,
      avgWordLength: words.length ? (words.reduce((a, b) => a + b.length, 0) / words.length).toFixed(1) : 0,
      avgSentenceLength: sentences.length ? (words.length / sentences.length).toFixed(1) : 0,
      uniqueWords: new Set(words).size,
      readingTime: Math.max(1, Math.ceil(words.length / 200))
    };
  }

  function calculateKeywordDensity(text, topN = 10) {
    const words = getWords(text);
    if (!words.length) return [];
    const freq = {};
    words.forEach(w => { if (!STOP_WORDS.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, count]) => ({ word, count, density: ((count / words.length) * 100).toFixed(2) }));
  }

  function findKeywordGaps(text1, text2, topN = 12) {
    const density1 = calculateKeywordDensity(text1, 50);
    const density2 = calculateKeywordDensity(text2, 50);
    const map1 = Object.fromEntries(density1.map(d => [d.word, d.count]));
    const map2 = Object.fromEntries(density2.map(d => [d.word, d.count]));

    const missingIn2 = density1.filter(d => !map2[d.word]).slice(0, topN).map(d => ({ word: d.word, count: d.count }));
    const missingIn1 = density2.filter(d => !map1[d.word]).slice(0, topN).map(d => ({ word: d.word, count: d.count }));

    const competitive = density1
      .filter(d => map2[d.word])
      .map(d => {
        const other = map2[d.word];
        const diff = d.count - other;
        return { word: d.word, left: d.count, right: other, diff };
      })
      .filter(d => Math.abs(d.diff) >= 2)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
      .slice(0, topN);

    return { missingInText1: missingIn1, missingInText2: missingIn2, competitive };
  }

  // PERFORMANCE FIX: Chunked Diff algorithm to prevent browser freezing on large texts
  function generateDiff(text1, text2) {
    // Preserve line breaks by replacing them with a special token during split
    const t1 = text1.replace(/\n/g, ' ↵ ');
    const t2 = text2.replace(/\n/g, ' ↵ ');
    
    // Limit diffing array to 1000 words to prevent memory heap crash (O(N^2))
    const limit = 1000; 
    const words1 = t1.split(/(\s+|[.,;!?])/g).filter(w => w.length > 0).slice(0, limit);
    const words2 = t2.split(/(\s+|[.,;!?])/g).filter(w => w.length > 0).slice(0, limit);

    const m = words1.length, n = words2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = words1[i - 1] === words2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    let html1 = '', html2 = '';
    let p1 = 0, p2 = 0;
    
    const renderToken = (word, isError, isSuccess) => {
      if (word === '↵') return '<br>';
      if (isError) return `<mark style="background:${GDI.ThemeEngine.token('colors.errorLight')};color:${GDI.ThemeEngine.token('colors.error')};padding:1px 2px;border-radius:2px;">${GDI.escapeHtml(word)}</mark>`;
      if (isSuccess) return `<mark style="background:${GDI.ThemeEngine.token('colors.successLight')};color:${GDI.ThemeEngine.token('colors.success')};padding:1px 2px;border-radius:2px;">${GDI.escapeHtml(word)}</mark>`;
      return GDI.escapeHtml(word);
    };

    while (p1 < m || p2 < n) {
      if (p1 < m && p2 < n && words1[p1] === words2[p2]) {
        html1 += renderToken(words1[p1], false, false);
        html2 += renderToken(words2[p2], false, false);
        p1++; p2++;
      } else if (p1 < m && (p2 >= n || dp[p1 + 1]?.[p2] >= dp[p1]?.[p2 + 1])) {
        html1 += renderToken(words1[p1], true, false);
        p1++;
      } else if (p2 < n) {
        html2 += renderToken(words2[p2], false, true);
        p2++;
      }
    }
    
    const warning = (text1.split(/\s+/).length > limit || text2.split(/\s+/).length > limit) 
      ? `<div style="background:${GDI.ThemeEngine.token('colors.warningLight')}; color:#92400E; padding:8px; text-align:center; font-size:11px; margin-bottom:8px; border-radius:4px;">⚠️ Diff view truncated to first 1000 words for performance.</div>` 
      : '';

    return { left: warning + html1, right: warning + html2 };
  }

  function analyzeStructure(text) {
    const lines = text.split('\n');
    const headings = [];
    const paragraphs = [];
    let currentPara = [];

    lines.forEach((line, idx) => {
      const hMatch = line.match(/^(#{1,6})\s+(.+)/) || line.match(/^\[(H[1-6])\]\s*(.+)/);
      if (hMatch) {
        if (currentPara.length) { paragraphs.push(currentPara.join('\n')); currentPara = []; }
        headings.push({ level: hMatch[1].replace('#', '').length || parseInt(hMatch[1][1]), text: hMatch[2].trim(), line: idx + 1 });
      } else if (line.trim()) {
        currentPara.push(line);
      } else if (currentPara.length) {
        paragraphs.push(currentPara.join('\n')); currentPara = [];
      }
    });
    if (currentPara.length) paragraphs.push(currentPara.join('\n'));

    const links = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(m => ({ text: m[1], url: m[2] }));
    const plainLinks = [...text.matchAll(/(https?:\/\/[^\s]+)/g)].map(m => m[1]);
    const lists = text.split('\n').filter(l => /^\s*[-*+]\s+/.test(l)).length;
    const boldCount = (text.match(/\*\*[^*]+\*\*/g) || []).length + (text.match(/__[^_]+__/g) || []).length;

    return { headings, paragraphs, links, plainLinks, lists, boldCount };
  }

  function renderGauge(label, value, max = 100, color = 'primary') {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return `
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
          <span style="color:${GDI.ThemeEngine.token('colors.textSecondary')}">${label}</span>
          <span style="font-weight:700;color:${GDI.ThemeEngine.token(`colors.${color}`)}">${value}</span>
        </div>
        <div style="height:6px;background:${GDI.ThemeEngine.token('colors.border')};border-radius:3px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${GDI.ThemeEngine.token(`colors.${color}`)};transition:width 0.3s ease;"></div>
        </div>
      </div>
    `;
  }

  function updateStats(panelId, text) {
    const metrics = getSEOMetrics(text);
    const statsDiv = content.querySelector(`#${panelId}-stats`);
    if (!statsDiv) return;
    statsDiv.innerHTML = `
      <span title="Characters">📊 ${metrics.charCount.toLocaleString()}</span>
      <span title="Words">📝 ${metrics.wordCount.toLocaleString()}</span>
      <span title="Sentences">📏 ${metrics.sentenceCount.toLocaleString()}</span>
      <span title="Paragraphs">¶ ${metrics.paragraphCount}</span>
      <span title="Unique Words">🔤 ${metrics.uniqueWords.toLocaleString()}</span>
      <span title="Reading Time">📖 ${metrics.readingTime} min</span>
    `;
  }

  // ─── RENDERERS ───
  function renderOverview(data) {
    const simColor = data.similarity > 70 ? 'success' : data.similarity > 40 ? 'warning' : 'error';
    const r1 = data.readability1, r2 = data.readability2;

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;">
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:16px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};border-left:4px solid ${GDI.ThemeEngine.token(`colors.${simColor}`)};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:8px;">📊 Similarity Score</div>
          <div style="font-size:32px;font-weight:800;color:${GDI.ThemeEngine.token(`colors.${simColor}`)}">${data.similarity}%</div>
          <div style="font-size:11px;color:${GDI.ThemeEngine.token('colors.textSecondary')};margin-top:4px;">
            Cosine: ${Math.round(data.details.cosine * 100)}% · Jaccard: ${Math.round(data.details.jaccard * 100)}% · LCS: ${Math.round(data.details.lcs * 100)}%
          </div>
          ${renderGauge('Duplicate Risk', data.similarity, 100, simColor)}
        </div>

        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:16px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};border-left:4px solid ${GDI.ThemeEngine.token('colors.info')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:8px;">📖 Readability</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <div style="font-size:10px;color:${GDI.ThemeEngine.token('colors.textMuted')};">LEFT</div>
              ${renderGauge('Flesch', r1.flesch, 100, 'info')}
              <div style="font-size:10px;color:${GDI.ThemeEngine.token('colors.textSecondary')}">Grade ${r1.kincaid} · ${getReadabilityLevel(r1.flesch)}</div>
            </div>
            <div>
              <div style="font-size:10px;color:${GDI.ThemeEngine.token('colors.textMuted')};">RIGHT</div>
              ${renderGauge('Flesch', r2.flesch, 100, 'info')}
              <div style="font-size:10px;color:${GDI.ThemeEngine.token('colors.textSecondary')}">Grade ${r2.kincaid} · ${getReadabilityLevel(r2.flesch)}</div>
            </div>
          </div>
        </div>

        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:16px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};border-left:4px solid ${GDI.ThemeEngine.token('colors.primary')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:8px;">📐 Content Metrics</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
            <div><span style="color:${GDI.ThemeEngine.token('colors.textMuted')}">Words:</span> <strong>${data.metrics1.wordCount.toLocaleString()}</strong> vs <strong>${data.metrics2.wordCount.toLocaleString()}</strong></div>
            <div><span style="color:${GDI.ThemeEngine.token('colors.textMuted')}">Sentences:</span> <strong>${data.metrics1.sentenceCount}</strong> vs <strong>${data.metrics2.sentenceCount}</strong></div>
            <div><span style="color:${GDI.ThemeEngine.token('colors.textMuted')}">Paragraphs:</span> <strong>${data.metrics1.paragraphCount}</strong> vs <strong>${data.metrics2.paragraphCount}</strong></div>
            <div><span style="color:${GDI.ThemeEngine.token('colors.textMuted')}">Avg Words/Sent:</span> <strong>${data.metrics1.avgSentenceLength}</strong> vs <strong>${data.metrics2.avgSentenceLength}</strong></div>
          </div>
        </div>
      </div>

      <div style="margin-top:16px;background:${GDI.ThemeEngine.token('colors.surface')};padding:16px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
        <div style="font-weight:700;font-size:11px;text-transform:uppercase;color:${GDI.ThemeEngine.token('colors.textMuted')};margin-bottom:12px;">🔑 Keyword Gaps</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <div style="flex:1;min-width:240px;">
            <div style="font-weight:600;color:${GDI.ThemeEngine.token('colors.error')};font-size:12px;margin-bottom:6px;">Missing in Right (${data.gaps.missingInText2.length})</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${data.gaps.missingInText2.map(k => `<span style="background:${GDI.ThemeEngine.token('colors.errorLight')};color:${GDI.ThemeEngine.token('colors.error')};padding:4px 8px;border-radius:4px;font-size:11px;font-family:${GDI.DESIGN_TOKENS.typography.fontMono}" title="Frequency: ${k.count}">${GDI.escapeHtml(k.word)} <small>×${k.count}</small></span>`).join('') || '<span style="color:#999;font-size:12px;">None</span>'}
            </div>
          </div>
          <div style="flex:1;min-width:240px;">
            <div style="font-weight:600;color:${GDI.ThemeEngine.token('colors.success')};font-size:12px;margin-bottom:6px;">Missing in Left (${data.gaps.missingInText1.length})</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${data.gaps.missingInText1.map(k => `<span style="background:${GDI.ThemeEngine.token('colors.successLight')};color:${GDI.ThemeEngine.token('colors.success')};padding:4px 8px;border-radius:4px;font-size:11px;font-family:${GDI.DESIGN_TOKENS.typography.fontMono}" title="Frequency: ${k.count}">${GDI.escapeHtml(k.word)} <small>×${k.count}</small></span>`).join('') || '<span style="color:#999;font-size:12px;">None</span>'}
            </div>
          </div>
        </div>
        ${data.gaps.competitive.length ? `
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${GDI.ThemeEngine.token('colors.border')};">
          <div style="font-weight:600;color:${GDI.ThemeEngine.token('colors.warning')};font-size:12px;margin-bottom:6px;">⚡ Competitive Gaps (frequency diff ≥ 2)</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${data.gaps.competitive.map(k => {
              const color = k.diff > 0 ? GDI.ThemeEngine.token('colors.primary') : GDI.ThemeEngine.token('colors.textSecondary');
              return `<span style="background:${GDI.ThemeEngine.token('colors.surfaceSecondary')};color:${color};padding:4px 8px;border-radius:4px;font-size:11px;font-family:${GDI.DESIGN_TOKENS.typography.fontMono};border:1px solid ${GDI.ThemeEngine.token('colors.border')}">${GDI.escapeHtml(k.word)} L${k.left}:R${k.right}</span>`;
            }).join('')}
          </div>
        </div>` : ''}
      </div>

      <div style="margin-top:16px;background:${GDI.ThemeEngine.token('colors.surface')};padding:16px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
        <div style="font-weight:700;font-size:11px;text-transform:uppercase;color:${GDI.ThemeEngine.token('colors.textMuted')};margin-bottom:12px;">⭐ Common Keywords</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${data.commonKeywords.map(k => `<span style="background:${GDI.ThemeEngine.token('colors.infoLight')};color:${GDI.ThemeEngine.token('colors.info')};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:${GDI.DESIGN_TOKENS.typography.fontMono}">${GDI.escapeHtml(k)}</span>`).join('') || '<span style="color:#999;font-size:12px;">None</span>'}
        </div>
      </div>
    `;
  }

  function renderDiff(data) {
    if (!data.text1 && !data.text2) return '<div style="text-align:center;padding:40px;color:#999;">Enter text in both panels to see diff</div>';
    const diff = generateDiff(data.text1, data.text2);
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};border:1px solid ${GDI.ThemeEngine.token('colors.border')};border-radius:${GDI.DESIGN_TOKENS.radii.lg};padding:14px;overflow:auto;max-height:400px;font-family:${GDI.DESIGN_TOKENS.typography.fontMono};font-size:12px;line-height:1.7;" class="gdi-scrollbar">
          <div style="font-size:10px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:8px;">Original (red = removed)</div>
          <div style="word-break:break-word;">${diff.left || '<em style="color:#999;">Empty</em>'}</div>
        </div>
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};border:1px solid ${GDI.ThemeEngine.token('colors.border')};border-radius:${GDI.DESIGN_TOKENS.radii.lg};padding:14px;overflow:auto;max-height:400px;font-family:${GDI.DESIGN_TOKENS.typography.fontMono};font-size:12px;line-height:1.7;" class="gdi-scrollbar">
          <div style="font-size:10px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:8px;">Comparison (green = added)</div>
          <div style="word-break:break-word;">${diff.right || '<em style="color:#999;">Empty</em>'}</div>
        </div>
      </div>
    `;
  }

  function renderStructure(data) {
    const s1 = data.structure1, s2 = data.structure2;
    const renderHeadings = (h) => h.length ? h.map(x => `<div style="padding:2px 0;padding-left:${(x.level-1)*12}px;font-size:12px;color:${GDI.ThemeEngine.token('colors.textPrimary')}"><span style="color:${GDI.ThemeEngine.token('colors.textMuted')};font-size:10px;">H${x.level}</span> ${GDI.escapeHtml(x.text.substring(0, 60))}${x.text.length>60?'...':''}</div>`).join('') : '<em style="color:#999;font-size:12px;">No headings found</em>';
    const renderList = (items, empty) => items.length ? `<ul style="margin:4px 0;padding-left:16px;font-size:12px;">${items.map(i => `<li>${GDI.escapeHtml(i)}</li>`).join('')}</ul>` : `<em style="color:#999;font-size:12px;">${empty}</em>`;

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:14px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:10px;">🏗️ Left Structure</div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Headings (${s1.headings.length})</strong><div style="margin-top:4px;">${renderHeadings(s1.headings)}</div></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Paragraphs:</strong> <span style="font-size:12px;">${s1.paragraphs.length}</span></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">List Items:</strong> <span style="font-size:12px;">${s1.lists}</span></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Bold Emphasis:</strong> <span style="font-size:12px;">${s1.boldCount}</span></div>
          <div><strong style="font-size:12px;">Links:</strong> ${renderList(s1.links.map(l => `${l.text} → ${l.url}`), 'No markdown links')}</div>
        </div>
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:14px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:10px;">🏗️ Right Structure</div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Headings (${s2.headings.length})</strong><div style="margin-top:4px;">${renderHeadings(s2.headings)}</div></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Paragraphs:</strong> <span style="font-size:12px;">${s2.paragraphs.length}</span></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">List Items:</strong> <span style="font-size:12px;">${s2.lists}</span></div>
          <div style="margin-bottom:10px;"><strong style="font-size:12px;">Bold Emphasis:</strong> <span style="font-size:12px;">${s2.boldCount}</span></div>
          <div><strong style="font-size:12px;">Links:</strong> ${renderList(s2.links.map(l => `${l.text} → ${l.url}`), 'No markdown links')}</div>
        </div>
      </div>
    `;
  }

  function renderKeywords(data) {
    const renderDensity = (list) => list.length ? `
      <table style="width:100%;font-size:12px;border-collapse:collapse;">
        <tr style="color:${GDI.ThemeEngine.token('colors.textMuted')};font-size:10px;text-align:left;">
          <th style="padding:4px 0;">Keyword</th><th style="padding:4px 0;">Count</th><th style="padding:4px 0;">Density</th>
        </tr>
        ${list.map(k => `<tr style="border-top:1px solid ${GDI.ThemeEngine.token('colors.border')}">
          <td style="padding:6px 0;font-family:${GDI.DESIGN_TOKENS.typography.fontMono};">${GDI.escapeHtml(k.word)}</td>
          <td style="padding:6px 0;">${k.count}</td>
          <td style="padding:6px 0;">${k.density}%</td>
        </tr>`).join('')}
      </table>
    ` : '<em style="color:#999;font-size:12px;">No significant keywords found</em>';

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:14px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:10px;">🔑 Left Keyword Density</div>
          ${renderDensity(data.density1)}
        </div>
        <div style="background:${GDI.ThemeEngine.token('colors.surface')};padding:14px;border-radius:${GDI.DESIGN_TOKENS.radii.lg};border:1px solid ${GDI.ThemeEngine.token('colors.border')};">
          <div style="font-size:11px;font-weight:700;color:${GDI.ThemeEngine.token('colors.textMuted')};text-transform:uppercase;margin-bottom:10px;">🔑 Right Keyword Density</div>
          ${renderDensity(data.density2)}
        </div>
      </div>
    `;
  }

  function renderResults() {
    if (!lastResults) return;
    switch (activeTab) {
      case 'diff': resultsContent.innerHTML = renderDiff(lastResults); break;
      case 'structure': resultsContent.innerHTML = renderStructure(lastResults); break;
      case 'keywords': resultsContent.innerHTML = renderKeywords(lastResults); break;
      case 'overview': default: resultsContent.innerHTML = renderOverview(lastResults); break;
    }
  }

  // ─── EXPORT ───
  function exportResults(format) {
    if (!lastResults) { GDI.showNotification('No analysis to export', 'warning'); return; }
    const timestamp = new Date().toISOString();
    const payload = { ...lastResults, exportedAt: timestamp };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = url; a.download = `seo-compare-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
      GDI.showNotification('Exported JSON', 'success');
    } else {
      const rows = [
        ['Metric', 'Left', 'Right'],
        ['Words', lastResults.metrics1.wordCount, lastResults.metrics2.wordCount],
        ['Sentences', lastResults.metrics1.sentenceCount, lastResults.metrics2.sentenceCount],
        ['Paragraphs', lastResults.metrics1.paragraphCount, lastResults.metrics2.paragraphCount],
        ['Flesch Score', lastResults.readability1.flesch, lastResults.readability2.flesch],
        ['Kincaid Grade', lastResults.readability1.kincaid, lastResults.readability2.kincaid],
        ['Similarity %', lastResults.similarity, '']
      ];
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = url; a.download = `seo-compare-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
      GDI.showNotification('Exported CSV', 'success');
    }
  }

  // Auto-fill selection from Context Menu
  if (contextInfo.selectionText) {
    setTimeout(() => {
      const leftTextarea = content.querySelector('#left-textarea');
      if (leftTextarea) {
        leftTextarea.value = contextInfo.selectionText;
        scheduleComparison();
      }
    }, 100);
  }

  // ─── MAIN COMPARISON ───
  function performComparison() {
    const text1 = content.querySelector('#left-textarea')?.value || '';
    const text2 = content.querySelector('#right-textarea')?.value || '';

    updateStats('left', text1);
    updateStats('right', text2);

    if (!text1 && !text2) {
      resultsContent.innerHTML = `<div style="text-align:center;padding:40px;color:${GDI.ThemeEngine.token('colors.textMuted')};">Enter text in both panels to see comparison results</div>`;
      scoreBadge.textContent = '0% Similar';
      scoreBadge.style.background = GDI.ThemeEngine.token('colors.infoLight');
      scoreBadge.style.color = GDI.ThemeEngine.token('colors.info');
      lastResults = null;
      return;
    }

    const cosine = calculateCosineSimilarity(text1, text2);
    const jaccard = calculateJaccardSimilarity(text1, text2);
    const lcs = calculateLCSSimilarity(text1, text2);
    const similarity = Math.min(100, Math.round((cosine * 0.5 + jaccard * 0.3 + lcs * 0.2) * 100));

    const readability1 = calculateReadability(text1);
    const readability2 = calculateReadability(text2);
    const metrics1 = getSEOMetrics(text1);
    const metrics2 = getSEOMetrics(text2);
    const gaps = findKeywordGaps(text1, text2);
    const density1 = calculateKeywordDensity(text1);
    const density2 = calculateKeywordDensity(text2);
    const structure1 = analyzeStructure(text1);
    const structure2 = analyzeStructure(text2);

    const words1 = getWords(text1);
    const words2 = getWords(text2);
    const freq1 = getTermFreq(text1);
    const freq2 = getTermFreq(text2);
    const commonKeywords = Object.keys(freq1).filter(k => freq2[k]).sort((a, b) => (freq2[b] + freq1[b]) - (freq2[a] + freq1[a])).slice(0, 15);

    lastResults = {
      text1, text2, similarity, details: { cosine, jaccard, lcs },
      readability1, readability2, metrics1, metrics2, gaps,
      density1, density2, structure1, structure2, commonKeywords
    };

    const simColor = similarity > 70 ? 'success' : similarity > 40 ? 'warning' : 'error';
    scoreBadge.style.background = GDI.ThemeEngine.token(`colors.${simColor}Light`);
    scoreBadge.style.color = GDI.ThemeEngine.token(`colors.${simColor}`);
    scoreBadge.textContent = `${similarity}% Similar`;

    renderResults();
  }
}
// ==================== ADVANCED SEO IMAGE TOOLKIT ====================

function advancedImageToolkit() {
  const contentContainer = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', height: '80vh', overflow: 'hidden' }
  });

  // ─── TABS NAVIGATION ───
  const tabsContainer = GDI.createElement('div', {
    styles: {
      display: 'flex', background: GDI.ThemeEngine.token('colors.surfaceSecondary'),
      borderBottom: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      padding: '0 24px', gap: '8px', flexShrink: '0', overflowX: 'auto'
    },
    attrs: { className: 'gdi-scrollbar' }
  });
  
  const tabs = [
    { id: 'resizer', name: '📐 Image Resizer' },
    { id: 'converter', name: '🔄 Image Converter' },
    { id: 'sources', name: '📷 Free Image Sources' },
    { id: 'optimizer', name: '⚡ Image Optimizer' },
    { id: 'analyzer', name: '🔍 SEO Analyzer' }
  ];
  
  const tabButtons = [];
  const tabPanels = {};
  
  // Main area for tab content
  const panelsContainer = GDI.createElement('div', {
    styles: { flex: '1', overflowY: 'auto', padding: '24px', background: GDI.ThemeEngine.token('colors.surface') },
    attrs: { className: 'gdi-scrollbar' }
  });

  tabs.forEach((tab, index) => {
    const btn = GDI.createElement('button', {
      styles: {
        padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '13px', fontWeight: '600',
        color: index === 0 ? GDI.ThemeEngine.token('colors.primary') : GDI.ThemeEngine.token('colors.textSecondary'),
        borderBottom: `3px solid ${index === 0 ? GDI.ThemeEngine.token('colors.primary') : 'transparent'}`,
        transition: `all ${GDI.DESIGN_TOKENS.transitions.fast}`, whiteSpace: 'nowrap'
      },
      text: tab.name
    });
    
    const panel = GDI.createElement('div', {
      styles: { display: index === 0 ? 'block' : 'none' }
    });
    
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.style.color = GDI.ThemeEngine.token('colors.textSecondary');
        b.style.borderBottomColor = 'transparent';
      });
      btn.style.color = GDI.ThemeEngine.token('colors.primary');
      btn.style.borderBottomColor = GDI.ThemeEngine.token('colors.primary');
      
      Object.values(tabPanels).forEach(p => p.style.display = 'none');
      panel.style.display = 'block';
    });
    
    tabsContainer.appendChild(btn);
    panelsContainer.appendChild(panel);
    tabButtons.push(btn);
    tabPanels[tab.id] = panel;
  });

  contentContainer.appendChild(tabsContainer);
  contentContainer.appendChild(panelsContainer);

  // ==================== IMAGE RESIZER TAB ====================
  const resizerPanel = tabPanels['resizer'];
  resizerPanel.style.display = 'grid';
  resizerPanel.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  resizerPanel.style.gap = '24px';

  // Upload Area
  const resizerUploadArea = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  resizerUploadArea.innerHTML = `<h3 style="margin: 0 0 16px; font-size: 15px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">📤 Upload Image</h3>`;
  
  const resizeDropZone = GDI.createElement('div', {
    styles: { border: `2px dashed ${GDI.ThemeEngine.token('colors.border')}`, borderRadius: GDI.DESIGN_TOKENS.radii.md, padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' },
    html: `<div style="font-size: 32px; margin-bottom: 12px;">📸</div><div style="color:${GDI.ThemeEngine.token('colors.textPrimary')}">Drag & drop image or click to upload</div><div style="font-size: 11px; color: ${GDI.ThemeEngine.token('colors.textMuted')}; margin-top: 8px;">Supports: JPG, PNG, WebP</div>`
  });
  
  const resizeFileInput = GDI.createElement('input', { attrs: { type: 'file', accept: 'image/*' }, styles: { display: 'none' } });
  const resizePreviewWrap = GDI.createElement('div', { styles: { marginTop: '20px', display: 'none', textAlign: 'center' } });
  const resizePreviewImg = GDI.createElement('img', { styles: { maxWidth: '100%', maxHeight: '300px', borderRadius: GDI.DESIGN_TOKENS.radii.md, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` } });
  resizePreviewWrap.appendChild(resizePreviewImg);
  
  resizerUploadArea.appendChild(resizeDropZone);
  resizerUploadArea.appendChild(resizeFileInput);
  resizerUploadArea.appendChild(resizePreviewWrap);

  // Controls Area
  const resizerControls = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  resizerControls.innerHTML = `<h3 style="margin: 0 0 16px; font-size: 15px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">📏 Resize Options</h3>`;
  
  const presetSelect = GDI.createSelect({
    label: 'Preset Sizes',
    options: [
      { value: 'custom', label: 'Custom Size' },
      { value: '150x150', label: 'Thumbnail (150x150)' },
      { value: '600x400', label: 'Medium (600x400)' },
      { value: '1200x800', label: 'Large (1200x800)' },
      { value: '1200x630', label: 'Social / Open Graph (1200x630)' },
      { value: '800x418', label: 'Twitter Card (800x418)' }
    ],
    defaultValue: 'custom'
  });

  const dimsRow = GDI.createElement('div', { styles: { display: 'flex', gap: '12px' } });
  const widthInput = GDI.createInputField({ label: 'Width (px)', type: 'number', placeholder: 'Auto' });
  const heightInput = GDI.createInputField({ label: 'Height (px)', type: 'number', placeholder: 'Auto' });
  widthInput.wrapper.style.flex = '1'; heightInput.wrapper.style.flex = '1';
  dimsRow.appendChild(widthInput.wrapper); dimsRow.appendChild(heightInput.wrapper);

  const aspectToggle = GDI.createToggle({ label: 'Maintain aspect ratio', checked: true });
  aspectToggle.wrapper.style.marginBottom = '16px';

  const qWrap = GDI.createElement('div', { styles: { marginBottom: '20px' } });
  qWrap.innerHTML = `<label style="display:block; font-size:12px; font-weight:600; color:${GDI.ThemeEngine.token('colors.textPrimary')}; margin-bottom:8px;">Quality: <span id="gdi-rz-qval">90%</span></label>`;
  const qSlider = GDI.createElement('input', { attrs: { type: 'range', min: '1', max: '100', value: '90' }, styles: { width: '100%', cursor: 'pointer' } });
  qSlider.addEventListener('input', () => qWrap.querySelector('#gdi-rz-qval').textContent = `${qSlider.value}%`);
  qWrap.appendChild(qSlider);

  const resizeBtn = GDI.createButton('Resize Image', null, { variant: 'primary', disabled: true });
  const dlResizedBtn = GDI.createButton('Download Resized Image', null, { variant: 'success' });
  dlResizedBtn.style.display = 'none';
  dlResizedBtn.style.marginTop = '10px';

  resizerControls.appendChild(presetSelect.wrapper);
  resizerControls.appendChild(dimsRow);
  resizerControls.appendChild(aspectToggle.wrapper);
  resizerControls.appendChild(qWrap);
  resizerControls.appendChild(resizeBtn);
  resizerControls.appendChild(dlResizedBtn);

  resizerPanel.appendChild(resizerUploadArea);
  resizerPanel.appendChild(resizerControls);

  // Resizer Logic
  let currentFile = null; let resizedBlob = null; let origW = 0; let origH = 0;
  
  resizeDropZone.addEventListener('click', () => resizeFileInput.click());
  resizeFileInput.addEventListener('change', (e) => { if(e.target.files[0]) loadResizeImg(e.target.files[0]); });
  
  function loadResizeImg(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        origW = img.width; origH = img.height;
        resizePreviewImg.src = e.target.result;
        resizePreviewWrap.style.display = 'block';
        widthInput.input.value = origW; heightInput.input.value = origH;
        resizeBtn.disabled = false;
        resizeBtn.style.opacity = '1';
        dlResizedBtn.style.display = 'none';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  presetSelect.select.addEventListener('change', (e) => {
    const val = e.target.value;
    if(val !== 'custom') {
      const [w, h] = val.split('x');
      widthInput.input.value = w; heightInput.input.value = h;
    }
  });

  resizeBtn.addEventListener('click', () => {
    if(!currentFile) return;
    let tw = parseInt(widthInput.input.value) || origW;
    let th = parseInt(heightInput.input.value) || origH;

    if (aspectToggle.getValue()) {
      const ratio = origW / origH;
      if ((tw / th) > ratio) tw = Math.round(th * ratio);
      else th = Math.round(tw / ratio);
      widthInput.input.value = tw; heightInput.input.value = th;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = GDI.createElement('canvas');
      canvas.width = tw; canvas.height = th;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, tw, th);
      canvas.toBlob((blob) => {
        resizedBlob = blob;
        dlResizedBtn.style.display = 'flex';
        GDI.showNotification(`Image resized to ${tw}x${th}`, 'success');
      }, currentFile.type, qSlider.value / 100);
    };
    img.src = resizePreviewImg.src;
  });

  dlResizedBtn.addEventListener('click', () => {
    if (resizedBlob) {
      const url = URL.createObjectURL(resizedBlob);
      const a = GDI.createElement('a');
      a.href = url; a.download = `resized_${currentFile.name}`;
      a.click(); URL.revokeObjectURL(url);
    }
  });

  // ==================== IMAGE CONVERTER TAB ====================
  const converterPanel = tabPanels['converter'];
  converterPanel.style.display = 'none';
  converterPanel.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  converterPanel.style.gap = '24px';

  const convUploadArea = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  convUploadArea.innerHTML = `<h3 style="margin: 0 0 16px; font-size: 15px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">📤 Upload Image</h3>`;
  
  const convDropZone = GDI.createElement('div', {
    styles: { border: `2px dashed ${GDI.ThemeEngine.token('colors.border')}`, borderRadius: GDI.DESIGN_TOKENS.radii.md, padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' },
    html: `<div style="font-size: 32px; margin-bottom: 12px;">🔄</div><div style="color:${GDI.ThemeEngine.token('colors.textPrimary')}">Click to upload image for conversion</div>`
  });
  const convFileInput = GDI.createElement('input', { attrs: { type: 'file', accept: 'image/*' }, styles: { display: 'none' } });
  const convPreviewWrap = GDI.createElement('div', { styles: { marginTop: '20px', display: 'none', textAlign: 'center' } });
  const convPreviewImg = GDI.createElement('img', { styles: { maxWidth: '100%', maxHeight: '300px', borderRadius: GDI.DESIGN_TOKENS.radii.md, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` } });
  convPreviewWrap.appendChild(convPreviewImg);
  convUploadArea.appendChild(convDropZone); convUploadArea.appendChild(convFileInput); convUploadArea.appendChild(convPreviewWrap);

  const convControls = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  convControls.innerHTML = `<h3 style="margin: 0 0 16px; font-size: 15px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">🔄 Convert To</h3>`;

  const formatsGrid = GDI.createElement('div', { styles: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' } });
  const formats = ['JPEG', 'PNG', 'WEBP', 'BMP'];
  let selectedFormat = 'image/jpeg';
  const formatBtns = [];

  formats.forEach((fmt, i) => {
    const btn = GDI.createButton(fmt, () => {
      formatBtns.forEach(b => { b.style.background = GDI.ThemeEngine.token('colors.surfaceTertiary'); b.style.color = GDI.ThemeEngine.token('colors.textPrimary'); });
      btn.style.background = GDI.ThemeEngine.token('colors.primary'); btn.style.color = '#fff';
      selectedFormat = `image/${fmt.toLowerCase()}`;
    }, { variant: 'secondary' });
    if(i === 0) { btn.style.background = GDI.ThemeEngine.token('colors.primary'); btn.style.color = '#fff'; }
    formatBtns.push(btn);
    formatsGrid.appendChild(btn);
  });

  const cqWrap = GDI.createElement('div', { styles: { marginBottom: '20px' } });
  cqWrap.innerHTML = `<label style="display:block; font-size:12px; font-weight:600; color:${GDI.ThemeEngine.token('colors.textPrimary')}; margin-bottom:8px;">Quality: <span id="gdi-cv-qval">85%</span></label>`;
  const cqSlider = GDI.createElement('input', { attrs: { type: 'range', min: '1', max: '100', value: '85' }, styles: { width: '100%', cursor: 'pointer' } });
  cqSlider.addEventListener('input', () => cqWrap.querySelector('#gdi-cv-qval').textContent = `${cqSlider.value}%`);
  cqWrap.appendChild(cqSlider);

  const convertBtn = GDI.createButton('Convert Image', null, { variant: 'primary', disabled: true });
  const dlConvertedBtn = GDI.createButton('Download Converted Image', null, { variant: 'success' });
  dlConvertedBtn.style.display = 'none'; dlConvertedBtn.style.marginTop = '10px';

  convControls.appendChild(formatsGrid); convControls.appendChild(cqWrap);
  convControls.appendChild(convertBtn); convControls.appendChild(dlConvertedBtn);

  converterPanel.appendChild(convUploadArea); converterPanel.appendChild(convControls);

  // Converter Logic
  let convFile = null; let convertedBlob = null;
  convDropZone.addEventListener('click', () => convFileInput.click());
  convFileInput.addEventListener('change', (e) => {
    if(e.target.files[0]) {
      convFile = e.target.files[0];
      const r = new FileReader();
      r.onload = ev => {
        convPreviewImg.src = ev.target.result;
        convPreviewWrap.style.display = 'block';
        convertBtn.disabled = false; convertBtn.style.opacity = '1';
        dlConvertedBtn.style.display = 'none';
      };
      r.readAsDataURL(convFile);
    }
  });

  convertBtn.addEventListener('click', () => {
    if(!convFile) return;
    const img = new Image();
    img.onload = () => {
      const cvs = GDI.createElement('canvas');
      cvs.width = img.width; cvs.height = img.height;
      cvs.getContext('2d').drawImage(img, 0, 0);
      cvs.toBlob(blob => {
        convertedBlob = blob;
        dlConvertedBtn.style.display = 'flex';
        GDI.showNotification(`Converted to ${selectedFormat.split('/')[1].toUpperCase()}`, 'success');
      }, selectedFormat, cqSlider.value / 100);
    };
    img.src = convPreviewImg.src;
  });

  dlConvertedBtn.addEventListener('click', () => {
    if(convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      const a = GDI.createElement('a');
      a.href = url; a.download = `converted.${selectedFormat.split('/')[1]}`;
      a.click(); URL.revokeObjectURL(url);
    }
  });

  // ==================== IMAGE OPTIMIZER TAB ====================
  const optPanel = tabPanels['optimizer'];
  optPanel.style.display = 'none';
  optPanel.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  optPanel.style.gap = '24px';

  const optUploadArea = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  optUploadArea.innerHTML = `<h3 style="margin: 0 0 16px; font-size: 15px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">📤 Upload Image</h3>`;
  const optDropZone = GDI.createElement('div', {
    styles: { border: `2px dashed ${GDI.ThemeEngine.token('colors.border')}`, borderRadius: GDI.DESIGN_TOKENS.radii.md, padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' },
    html: `<div style="font-size: 32px; margin-bottom: 12px;">⚡</div><div style="color:${GDI.ThemeEngine.token('colors.textPrimary')}">Upload image for optimization</div>`
  });
  const optFileInput = GDI.createElement('input', { attrs: { type: 'file', accept: 'image/*' }, styles: { display: 'none' } });
  const optPreviewWrap = GDI.createElement('div', { styles: { marginTop: '20px', display: 'none', textAlign: 'center' } });
  const optPreviewImg = GDI.createElement('img', { styles: { maxWidth: '100%', maxHeight: '250px', borderRadius: GDI.DESIGN_TOKENS.radii.md, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` } });
  optPreviewWrap.appendChild(optPreviewImg);
  optUploadArea.appendChild(optDropZone); optUploadArea.appendChild(optFileInput); optUploadArea.appendChild(optPreviewWrap);

  const optControls = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}` }
  });
  
  const resultsBox = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surface'), padding: '16px', borderRadius: GDI.DESIGN_TOKENS.radii.md, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`, marginBottom: '16px', fontSize: '13px', color: GDI.ThemeEngine.token('colors.textPrimary') },
    html: `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Original Size:</span><strong id="gdi-opt-orig">-</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Optimized Size:</span><strong id="gdi-opt-new" style="color:${GDI.ThemeEngine.token('colors.success')}">-</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Savings:</span><strong id="gdi-opt-save">-</strong></div>
    `
  });

  const oqWrap = GDI.createElement('div', { styles: { marginBottom: '16px' } });
  oqWrap.innerHTML = `<label style="display:block; font-size:12px; font-weight:600; color:${GDI.ThemeEngine.token('colors.textPrimary')}; margin-bottom:8px;">Compression Level: <span id="gdi-opt-qval">80%</span></label>`;
  const oqSlider = GDI.createElement('input', { attrs: { type: 'range', min: '1', max: '100', value: '80' }, styles: { width: '100%', cursor: 'pointer' } });
  oqSlider.addEventListener('input', () => oqWrap.querySelector('#gdi-opt-qval').textContent = `${oqSlider.value}%`);
  oqWrap.appendChild(oqSlider);

  const webpToggle = GDI.createToggle({ label: 'Convert to WebP (Best savings)', checked: true });
  webpToggle.wrapper.style.marginBottom = '20px';

  const optimizeBtn = GDI.createButton('Optimize Image', null, { variant: 'primary', disabled: true });
  const dlOptBtn = GDI.createButton('Download Optimized Image', null, { variant: 'success' });
  dlOptBtn.style.display = 'none'; dlOptBtn.style.marginTop = '10px';

  optControls.appendChild(resultsBox);
  optControls.appendChild(oqWrap);
  optControls.appendChild(webpToggle.wrapper);
  optControls.appendChild(optimizeBtn);
  optControls.appendChild(dlOptBtn);

  optPanel.appendChild(optUploadArea);
  optPanel.appendChild(optControls);

  // Optimizer Logic
  let optFile = null; let optimizedBlob = null;
  optDropZone.addEventListener('click', () => optFileInput.click());
  optFileInput.addEventListener('change', (e) => {
    if(e.target.files[0]) {
      optFile = e.target.files[0];
      resultsBox.querySelector('#gdi-opt-orig').textContent = GDI.formatFileSize(optFile.size);
      const r = new FileReader();
      r.onload = ev => {
        optPreviewImg.src = ev.target.result;
        optPreviewWrap.style.display = 'block';
        optimizeBtn.disabled = false; optimizeBtn.style.opacity = '1';
        dlOptBtn.style.display = 'none';
        resultsBox.querySelector('#gdi-opt-new').textContent = '-';
        resultsBox.querySelector('#gdi-opt-save').textContent = '-';
      };
      r.readAsDataURL(optFile);
    }
  });

  optimizeBtn.addEventListener('click', () => {
    if(!optFile) return;
    const img = new Image();
    img.onload = () => {
      const cvs = GDI.createElement('canvas');
      cvs.width = img.width; cvs.height = img.height;
      cvs.getContext('2d').drawImage(img, 0, 0);
      const mime = webpToggle.getValue() ? 'image/webp' : optFile.type;
      
      cvs.toBlob(blob => {
        optimizedBlob = blob;
        const saved = optFile.size - blob.size;
        const pct = ((saved / optFile.size) * 100).toFixed(1);
        resultsBox.querySelector('#gdi-opt-new').textContent = GDI.formatFileSize(blob.size);
        resultsBox.querySelector('#gdi-opt-save').textContent = `${pct}% (${GDI.formatFileSize(saved)})`;
        dlOptBtn.style.display = 'flex';
        optPreviewImg.src = URL.createObjectURL(blob); // show optimized result
        GDI.showNotification(`Saved ${pct}%!`, 'success');
      }, mime, oqSlider.value / 100);
    };
    img.src = optPreviewImg.src;
  });

  dlOptBtn.addEventListener('click', () => {
    if(optimizedBlob) {
      const url = URL.createObjectURL(optimizedBlob);
      const a = GDI.createElement('a');
      a.href = url; 
      const ext = webpToggle.getValue() ? 'webp' : optFile.name.split('.').pop();
      a.download = `optimized_${Date.now()}.${ext}`;
      a.click(); URL.revokeObjectURL(url);
    }
  });

  // ==================== FREE IMAGE SOURCES TAB ====================
  const sourcesPanel = tabPanels['sources'];
  sourcesPanel.style.display = 'none';
  
  const imageSources = [
    { name: 'Unsplash', url: 'https://unsplash.com', desc: 'High-quality free stock photos', cat: 'Stock Photos' },
    { name: 'Pexels', url: 'https://pexels.com', desc: 'Free stock photos & videos', cat: 'Stock Photos' },
    { name: 'Pixabay', url: 'https://pixabay.com', desc: 'Free images, illustrations, vectors', cat: 'All Types' },
    { name: 'Burst', url: 'https://burst.shopify.com', desc: 'Free stock photos for websites', cat: 'E-commerce' },
    { name: 'Freepik', url: 'https://freepik.com', desc: 'Free vectors & illustrations', cat: 'Vectors' },
    { name: 'Flaticon', url: 'https://flaticon.com', desc: 'Free icons for websites', cat: 'Icons' }
  ];

  const searchWrap = GDI.createInputField({ placeholder: '🔍 Search sources...', id: 'src-search' });
  sourcesPanel.appendChild(searchWrap.wrapper);

  const sourcesGrid = GDI.createElement('div', {
    styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }
  });

  function renderSources(filter = '') {
    sourcesGrid.innerHTML = '';
    imageSources.forEach(src => {
      if(filter && !src.name.toLowerCase().includes(filter.toLowerCase()) && !src.desc.toLowerCase().includes(filter.toLowerCase())) return;
      
      const card = GDI.createElement('div', {
        styles: {
          background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '16px',
          borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
          cursor: 'pointer', transition: `all ${GDI.DESIGN_TOKENS.transitions.fast}`
        },
        html: `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <h4 style="margin:0; font-size:15px; color:${GDI.ThemeEngine.token('colors.primary')}">${src.name}</h4>
          </div>
          <p style="margin:0 0 12px; font-size:12px; color:${GDI.ThemeEngine.token('colors.textSecondary')}">${src.desc}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="background:${GDI.ThemeEngine.token('colors.surfaceTertiary')}; padding:4px 8px; border-radius:4px; font-size:11px; color:${GDI.ThemeEngine.token('colors.textPrimary')}">${src.cat}</span>
            <span style="color:${GDI.ThemeEngine.token('colors.primary')}; font-size:12px; font-weight:bold;">Open ↗</span>
          </div>
        `
      });
      card.addEventListener('mouseenter', () => card.style.borderColor = GDI.ThemeEngine.token('colors.primary'));
      card.addEventListener('mouseleave', () => card.style.borderColor = GDI.ThemeEngine.token('colors.border'));
      card.addEventListener('click', () => window.open(src.url, '_blank'));
      sourcesGrid.appendChild(card);
    });
  }
  
  renderSources();
  searchWrap.input.addEventListener('input', (e) => renderSources(e.target.value));
  sourcesPanel.appendChild(sourcesGrid);

  // ==================== SEO ANALYZER TAB ====================
  const analyzerPanel = tabPanels['analyzer'];
  analyzerPanel.style.display = 'none';

  const analyzerContent = GDI.createElement('div', {
    styles: { background: GDI.ThemeEngine.token('colors.surfaceSecondary'), padding: '40px 20px', borderRadius: GDI.DESIGN_TOKENS.radii.lg, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`, textAlign: 'center' }
  });

  const runAnalysisBtn = GDI.createButton('Analyze Page Images', () => {
    const images = document.querySelectorAll('img');
    let noAlt = 0, emptyAlt = 0, lazy = 0, noDims = 0;
    const missingList = [];

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (alt === null) { noAlt++; missingList.push(img.src || 'Unknown'); }
      else if (alt === '') emptyAlt++;
      if (img.loading === 'lazy') lazy++;
      if (!img.width || !img.height) noDims++;
    });

    analyzerContent.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; text-align: left;">
        <div style="background:${GDI.ThemeEngine.token('colors.infoLight')}; padding:16px; border-radius:8px; border-left:4px solid ${GDI.ThemeEngine.token('colors.info')}">
          <div style="font-size:24px; font-weight:bold; color:${GDI.ThemeEngine.token('colors.info')}">${images.length}</div>
          <div style="font-size:12px; color:${GDI.ThemeEngine.token('colors.textSecondary')}">Total Images</div>
        </div>
        <div style="background:${GDI.ThemeEngine.token('colors.errorLight')}; padding:16px; border-radius:8px; border-left:4px solid ${GDI.ThemeEngine.token('colors.error')}">
          <div style="font-size:24px; font-weight:bold; color:${GDI.ThemeEngine.token('colors.error')}">${noAlt + emptyAlt}</div>
          <div style="font-size:12px; color:${GDI.ThemeEngine.token('colors.textSecondary')}">Missing/Empty Alt</div>
        </div>
        <div style="background:${GDI.ThemeEngine.token('colors.warningLight')}; padding:16px; border-radius:8px; border-left:4px solid ${GDI.ThemeEngine.token('colors.warning')}">
          <div style="font-size:24px; font-weight:bold; color:${GDI.ThemeEngine.token('colors.warning')}">${noDims}</div>
          <div style="font-size:12px; color:${GDI.ThemeEngine.token('colors.textSecondary')}">Missing Dimensions</div>
        </div>
      </div>
      <div style="text-align: left; background:${GDI.ThemeEngine.token('colors.surface')}; border:1px solid ${GDI.ThemeEngine.token('colors.border')}; padding:16px; border-radius:8px;">
        <strong style="color:${GDI.ThemeEngine.token('colors.textPrimary')}">📋 Recommendations:</strong>
        <ul style="margin: 12px 0 0; padding-left: 20px; font-size:13px; color:${GDI.ThemeEngine.token('colors.textSecondary')}; line-height:1.6;">
          ${(noAlt + emptyAlt) > 0 ? `<li style="color:${GDI.ThemeEngine.token('colors.error')}">⚠️ Add descriptive alt text to ${noAlt + emptyAlt} images.</li>` : '<li>✅ All images have alt text.</li>'}
          ${noDims > 0 ? `<li style="color:${GDI.ThemeEngine.token('colors.warning')}">⚠️ ${noDims} images missing width/height (causes layout shifts).</li>` : '<li>✅ All images have dimensions set.</li>'}
          ${lazy < images.length ? `<li>💡 Consider adding <code>loading="lazy"</code> to offscreen images.</li>` : '<li>✅ Good use of lazy loading!</li>'}
        </ul>
      </div>
    `;
  }, { variant: 'primary', fullWidth: false });
  
  runAnalysisBtn.style.margin = '0 auto';
  
  analyzerContent.innerHTML = `<div style="font-size:48px; margin-bottom:16px;">🔍</div><p style="color:${GDI.ThemeEngine.token('colors.textSecondary')}; margin-bottom:20px; font-size:14px;">Click below to check SEO metrics for all images currently loaded on this page.</p>`;
  analyzerContent.appendChild(runAnalysisBtn);
  analyzerPanel.appendChild(analyzerContent);

  // Use the native GDI Modal
  GDI.createModal('Advanced Image Toolkit', contentContainer, { 
    width: '95vw', 
    maxWidth: '1200px',
    icon: '🖼️',
    subtitle: 'Resize, Convert, Optimize & Analyze SEO Images'
  });
}

// ==================== ENHANCED SITE STRUCTURE ====================

function visualizeSiteStructure() {
  var {  $, $$, cleanText: clean, escapeHtml, copyToClipboard: copy, showNotification: toast  } = GDI;

  // ============ DATA COLLECTION ENGINE ============
  const collectData = () => {
    const domain = window.location.hostname.replace(/^www\./, '');
    const currentPath = window.location.pathname;
    const fullUrl = window.location.href;
    const origin = window.location.origin;

    // Links analysis
    const links = $GDI.$$('a[href]');
    const internalLinks = [];
    const externalLinks = [];
    const linkMap = new Map();
    const brokenLinks = [];
    const nofollowLinks = [];
    const sponsoredLinks = [];
    const ugcLinks = [];
    const anchorTextMap = new Map();

    links.forEach(link => {
      try {
        const href = link.getAttribute('href') || '';
        if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return;

        const url = new URL(href, origin);
        const isInternal = url.hostname === window.location.hostname;
        const text = clean(link.textContent).substring(0, 120) || '[No Text]';
        const rel = (link.getAttribute('rel') || '').toLowerCase();
        const isNofollow = rel.includes('nofollow');
        const isSponsored = rel.includes('sponsored');
        const isUgc = rel.includes('ugc');
        const target = link.getAttribute('target') || '';
        const title = link.getAttribute('title') || '';

        const linkData = { url: href, text, isInternal, isNofollow, isSponsored, isUgc, target, title };

        if (isInternal) {
          const path = url.pathname + url.search;
          if (!linkMap.has(path)) {
            linkMap.set(path, { path, texts: [text], count: 1, fullUrls: [href] });
          } else {
            const existing = linkMap.get(path);
            existing.count++;
            existing.texts.push(text);
            existing.fullUrls.push(href);
          }
          internalLinks.push(linkData);

          if (!anchorTextMap.has(path)) anchorTextMap.set(path, new Set());
          anchorTextMap.get(path).add(text);
        } else {
          externalLinks.push(linkData);
        }

        if (isNofollow) nofollowLinks.push(linkData);
        if (isSponsored) sponsoredLinks.push(linkData);
        if (isUgc) ugcLinks.push(linkData);
      } catch (e) {
        brokenLinks.push({ url: link.href, error: e.message });
      }
    });

    // Headings with hierarchy validation
    const headings = [];
    const headingHierarchy = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    const hierarchyIssues = [];
    let lastLevel = 0;

    for (let i = 1; i <= 6; i++) {
      $GDI.$$(`h${i}`).forEach(h => {
        const text = clean(h.textContent).substring(0, 100);
        const id = h.id || '';
        headings.push({ level: i, text, id, element: h });
        headingHierarchy[`h${i}`]++;

        if (lastLevel > 0 && i > lastLevel + 1) {
          hierarchyIssues.push(`Skipped from H${lastLevel} to H${i}`);
        }
        lastLevel = i;
      });
    }

    // Breadcrumbs detection
    const breadcrumbs = [];
    const breadcrumbSelectors = [
      '[class*="breadcrumb"] a', '[aria-label*="breadcrumb"] a', '.breadcrumbs a',
      '[itemtype*="BreadcrumbList"] a', 'nav[aria-label*="breadcrumb"] a', '.breadcrumb-trail a',
      '[class*="breadcrumbs"] li', '[class*="breadcrumb"] li'
    ];
    breadcrumbSelectors.forEach(sel => {
      $GDI.$$(sel).forEach(b => {
        const text = clean(b.textContent);
        if (text && !breadcrumbs.includes(text)) breadcrumbs.push(text);
      });
    });

    // Navigation
    const navItems = [];
    const navSelectors = [
      'nav a', '.menu a', '.navigation a', '[role="navigation"] a',
      'header a', '.navbar a', '.main-menu a', '#menu a', '.nav a'
    ];
    navSelectors.forEach(sel => {
      $GDI.$$(sel).forEach(n => {
        const text = clean(n.textContent).substring(0, 50);
        const href = n.href;
        if (text && !navItems.find(item => item.text === text)) {
          navItems.push({ text, href });
        }
      });
    });

    // Schema
    const schemaData = [];
    $GDI.$$('script[type="application/ld+json"]').forEach(script => {
      try { schemaData.push(JSON.parse(script.textContent)); } catch (e) {}
    });

    // Meta tags
    const metaTags = {};
    $GDI.$$('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
      const content = meta.getAttribute('content');
      if (name && content) metaTags[name] = content;
    });

    // Images
    const images = [];
    const imagesWithoutAlt = [];
    const imagesWithoutDimensions = [];
    $GDI.$$('img').forEach(img => {
      const src = img.currentSrc || img.src || img.getAttribute('data-src') || '';
      const alt = img.alt || '';
      const width = img.naturalWidth || img.width || parseInt(img.getAttribute('width')) || '';
      const height = img.naturalHeight || img.height || parseInt(img.getAttribute('height')) || '';
      const lazy = img.getAttribute('loading') === 'lazy';
      const isDecorative = img.getAttribute('role') === 'presentation' || img.getAttribute('aria-hidden') === 'true';

      images.push({ src, alt, width, height, lazy, isDecorative });
      if (!alt && !isDecorative) imagesWithoutAlt.push(src);
      if ((!width || !height) && !isDecorative) imagesWithoutDimensions.push(src);
    });

    // Forms
    const forms = $GDI.$$('form').map(f => ({
      action: f.getAttribute('action') || '',
      method: f.getAttribute('method') || 'get',
      id: f.id || '',
      inputs: $GDI.$('input, textarea, select, button', f).length
    }));

    // Canonical & lang
    const canonical = GDI.$('link[rel="canonical"]')?.href || fullUrl;
    const htmlLang = document.documentElement.lang || 'Not specified';

    // Scripts & styles
    const scripts = $GDI.$$('script[src]').map(s => s.src);
    const stylesheets = $GDI.$$('link[rel="stylesheet"]').map(l => l.href);
    const inlineStyles = $GDI.$$('[style]').length;

    // DOM stats
    const domStats = {
      totalElements: $GDI.$$('*').length,
      maxDepth: 0,
      deepestPath: ''
    };

    const getDepth = (el, depth = 0) => {
      if (depth > domStats.maxDepth) {
        domStats.maxDepth = depth;
        const cls = typeof el.className === 'string' ? el.className : '';
        domStats.deepestPath = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls.split(' ').slice(0, 2).join('.') : '');
      }
      Array.from(el.children).forEach(c => getDepth(c, depth + 1));
    };
    getDepth(document.documentElement);

    // Page size
    const pageSizeKB = (document.documentElement.outerHTML.length / 1024).toFixed(2);
    const viewport = GDI.$('meta[name="viewport"]')?.getAttribute('content') || '';

    return {
      domain, currentPath, fullUrl, origin,
      internalLinks, externalLinks, linkMap, brokenLinks, nofollowLinks, sponsoredLinks, ugcLinks, anchorTextMap,
      headings, headingHierarchy, hierarchyIssues,
      breadcrumbs, navItems,
      schemaData, metaTags,
      images, imagesWithoutAlt, imagesWithoutDimensions,
      forms,
      canonical, htmlLang,
      scripts, stylesheets, inlineStyles,
      domStats, pageSizeKB,
      viewport, hasViewport: !!viewport, urlDepth: currentPath.split('/').filter(Boolean).length
    };
  };

  const data = collectData();

  // ============ SEO SCORING ============
  const calculateSEOScore = () => {
    let score = 100;
    const issues = [];
    const warnings = [];

    if (data.headingHierarchy.h1 === 0) { score -= 15; issues.push('Missing H1 tag'); }
    else if (data.headingHierarchy.h1 > 1) { score -= 10; warnings.push(`Multiple H1 tags (${data.headingHierarchy.h1})`); }

    const desc = data.metaTags.description || '';
    if (!desc) { score -= 10; issues.push('Missing meta description'); }
    else if (desc.length < 50) { score -= 5; warnings.push('Meta description too short (<50 chars)'); }
    else if (desc.length > 160) { score -= 3; warnings.push('Meta description too long (>160 chars)'); }

    if (!data.metaTags['og:title'] && !data.metaTags['twitter:title']) { score -= 5; warnings.push('Missing social title tags'); }

    if (data.imagesWithoutAlt.length > 0) {
      score -= Math.min(12, data.imagesWithoutAlt.length * 2);
      issues.push(`${data.imagesWithoutAlt.length} images missing alt text`);
    }

    if (data.canonical !== data.fullUrl) { score -= 5; warnings.push(`Canonical mismatch: ${data.canonical}`); }
    if (data.urlDepth > 4) { score -= 5; warnings.push(`URL depth too deep (${data.urlDepth} levels)`); }
    if (data.htmlLang === 'Not specified') { score -= 5; issues.push('Missing language declaration'); }
    if (!data.hasViewport) { score -= 5; issues.push('Missing viewport meta tag'); }
    if (data.internalLinks.length < 5) { score -= 5; warnings.push('Low internal link count'); }

    if (data.hierarchyIssues.length > 0) {
      score -= Math.min(8, data.hierarchyIssues.length * 2);
      warnings.push(...data.hierarchyIssues.slice(0, 3));
    }

    if (parseFloat(data.pageSizeKB) > 500) { score -= 5; warnings.push(`Large page size (${data.pageSizeKB} KB)`); }

    return { score: Math.max(0, score), issues, warnings };
  };

  const seo = calculateSEOScore();

  // ============ UI STATE ============
  let activeTab = 'overview';
  let expandedNodes = new Set();
  let viewMode = 'cards';

  const tColor = (path) => GDI.ThemeEngine.token(path);

  // ============ DOM TREE BUILDER ============
  const buildDomTree = (element, depth = 0, maxDepth = 3) => {
    if (depth > maxDepth) return null;
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className && typeof element.className === 'string' ? '.' + element.className.split(' ').slice(0, 2).join('.') : '';
    const children = Array.from(element.children).map(c => buildDomTree(c, depth + 1, maxDepth)).filter(Boolean);

    return { tag, id, classes, name: `${tag}${id}${classes}`, childCount: element.children.length, textLength: element.textContent?.length || 0, children: children.length > 0 ? children : null, depth };
  };

  const domTree = buildDomTree(document.body, 0, 2);

  // ============ RENDER ============
  const content = GDI.createElement('div');
  content.style.cssText = 'display:flex;flex-direction:column;height:80vh;overflow:hidden;';
  
  const render = () => {
    const uniqueInternal = [...data.linkMap.values()].sort((a, b) => b.count - a.count);
    const externalDomains = [...new Set(data.externalLinks.map(l => {
      try { return new URL(l.url).hostname; } catch { return ''; }
    }))].filter(Boolean);

    content.innerHTML = `
      <style>
        .ss-tab { padding:12px 20px; font-size:13px; font-weight:700; color:var(--gdi-text-secondary); background:transparent; border:none; border-bottom:2px solid transparent; cursor:pointer; transition:all .2s; }
        .ss-tab.active { color:var(--gdi-primary); border-bottom-color:var(--gdi-primary); }
        .ss-tab:hover:not(.active) { color:var(--gdi-text-primary); background:var(--gdi-surface-secondary); }
        .ss-card { background:var(--gdi-surface); border:1px solid var(--gdi-border); border-radius:16px; padding:20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .ss-h3 { margin:0 0 16px; font-size:15px; font-weight:800; color:var(--gdi-text-primary); display:flex; align-items:center; gap:8px; }
        .ss-item { padding:10px 12px; border-radius:8px; background:var(--gdi-surface-secondary); border:1px solid var(--gdi-border); }
        
        /* THE FIX: Replaced fake css variables with the real ones! */
        .ss-text-main { color: var(--gdi-text-primary); }
        .ss-text-sec { color: var(--gdi-text-secondary); }
        .ss-text-muted { color: var(--gdi-text-muted); }
      </style>

      <div style="padding:0 24px; border-bottom:1px solid var(--gdi-border); background:var(--gdi-surface); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; flex-shrink:0;">
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button data-tab="overview" class="ss-tab ${activeTab === 'overview' ? 'active' : ''}">📊 Overview</button>
          <button data-tab="structure" class="ss-tab ${activeTab === 'structure' ? 'active' : ''}">🏗️ Structure</button>
          <button data-tab="links" class="ss-tab ${activeTab === 'links' ? 'active' : ''}">🔗 Links</button>
          <button data-tab="seo" class="ss-tab ${activeTab === 'seo' ? 'active' : ''}">🎯 SEO</button>
          <button data-tab="technical" class="ss-tab ${activeTab === 'technical' ? 'active' : ''}">⚙️ Technical</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center; padding: 8px 0;">
          ${activeTab === 'structure' ? `
            <div style="display:flex;gap:4px;background:var(--gdi-surface-secondary);padding:4px;border-radius:8px;">
              <button data-view="cards" class="ss-view-btn ${viewMode === 'cards' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'cards' ? 'var(--gdi-surface)' : 'transparent'};color:${viewMode === 'cards' ? 'var(--gdi-primary)' : 'var(--gdi-text-secondary)'};font-size:12px;font-weight:700;cursor:pointer;">Cards</button>
              <button data-view="tree" class="ss-view-btn ${viewMode === 'tree' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'tree' ? 'var(--gdi-surface)' : 'transparent'};color:${viewMode === 'tree' ? 'var(--gdi-primary)' : 'var(--gdi-text-secondary)'};font-size:12px;font-weight:700;cursor:pointer;">Tree</button>
              <button data-view="graph" class="ss-view-btn ${viewMode === 'graph' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'graph' ? 'var(--gdi-surface)' : 'transparent'};color:${viewMode === 'graph' ? 'var(--gdi-primary)' : 'var(--gdi-text-secondary)'};font-size:12px;font-weight:700;cursor:pointer;">Graph</button>
            </div>
          ` : ''}
          <button id="ss-export" style="padding:8px 14px; font-size:12px; font-weight:bold; border-radius:8px; border:none; background:var(--gdi-primary); color:#fff; cursor:pointer;">📤 Export</button>
        </div>
      </div>

      <div class="gdi-scrollbar" style="flex:1;overflow-y:auto;padding:24px;background:var(--gdi-surface-secondary);">
        ${activeTab === 'overview' ? renderOverview(uniqueInternal, externalDomains) : ''}
        ${activeTab === 'structure' ? renderStructure() : ''}
        ${activeTab === 'links' ? renderLinks(uniqueInternal, externalDomains) : ''}
        ${activeTab === 'seo' ? renderSEO() : ''}
        ${activeTab === 'technical' ? renderTechnical() : ''}
      </div>
    `;

    bindEvents();
  };

  const renderOverview = (uniqueInternal, externalDomains) => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-bottom:24px;">
        <div class="ss-card">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <div style="font-size:11px;font-weight:800;color:var(--gdi-text-secondary);text-transform:uppercase;letter-spacing:.5px;">SEO Score</div>
            <div style="padding:4px 10px;border-radius:20px;background:${seo.score >= 80 ? tColor('colors.successLight') : seo.score >= 60 ? tColor('colors.warningLight') : tColor('colors.errorLight')};color:${seo.score >= 80 ? tColor('colors.success') : seo.score >= 60 ? tColor('colors.warning') : tColor('colors.error')};font-size:11px;font-weight:700;">${seo.score >= 80 ? 'Good' : seo.score >= 60 ? 'Fair' : 'Poor'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:36px;font-weight:800;color:${seo.score >= 80 ? tColor('colors.success') : seo.score >= 60 ? tColor('colors.warning') : tColor('colors.error')};">${seo.score}</div>
            <div style="flex:1;">
              <div style="font-size:13px;color:var(--gdi-text-sec);line-height:1.5;">
                ${seo.issues.length ? `<div style="color:${tColor('colors.error')};margin-bottom:4px;">${seo.issues.length} critical issues</div>` : ''}
                ${seo.warnings.length ? `<div style="color:${tColor('colors.warning')};">${seo.warnings.length} warnings</div>` : ''}
                ${!seo.issues.length && !seo.warnings.length ? `<div style="color:${tColor('colors.success')};">✅ All checks passed</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="ss-card">
          <div style="font-size:11px;font-weight:800;color:var(--gdi-text-sec);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Link Profile</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <div style="font-size:28px;font-weight:800;color:var(--gdi-primary);">${data.internalLinks.length}</div>
              <div style="font-size:12px;color:var(--gdi-text-muted);">Internal</div>
            </div>
            <div>
              <div style="font-size:28px;font-weight:800;color:var(--gdi-primary);">${data.externalLinks.length}</div>
              <div style="font-size:12px;color:var(--gdi-text-muted);">External</div>
            </div>
          </div>
        </div>

        <div class="ss-card">
          <div style="font-size:11px;font-weight:800;color:var(--gdi-text-sec);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Content Structure</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:var(--gdi-text-sec);">Total Headings</span>
              <span style="font-size:13px;font-weight:700;color:var(--gdi-text-main);">${data.headings.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:var(--gdi-text-sec);">Images</span>
              <span style="font-size:13px;font-weight:700;color:var(--gdi-text-main);">${data.images.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:var(--gdi-text-sec);">Forms</span>
              <span style="font-size:13px;font-weight:700;color:var(--gdi-text-main);">${data.forms.length}</span>
            </div>
          </div>
        </div>
      </div>

      ${seo.issues.length > 0 ? `
        <div class="ss-card" style="margin-bottom:24px;">
          <h3 class="ss-h3">🚨 Critical Issues</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${seo.issues.map(issue => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:${tColor('colors.errorLight')};border:1px solid ${tColor('colors.error')};">
                <div style="font-weight:700;color:${tColor('colors.error')};font-size:13px;">${GDI.escapeHtml(issue)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="ss-card">
        <h3 class="ss-h3">🔗 Most Linked Internal Pages</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${uniqueInternal.slice(0, 8).map((item, i) => `
            <div class="ss-item" style="display:flex;align-items:center;gap:12px;">
              <span style="width:28px;height:28px;border-radius:50%;background:var(--gdi-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${i + 1}</span>
              <div style="flex:1;min-width:0;">
                <div style="font-family:monospace;font-size:12px;color:var(--gdi-text-main);word-break:break-all;">${GDI.escapeHtml(item.path)}</div>
                <div style="font-size:11px;color:var(--gdi-text-muted);margin-top:2px;">${[...new Set(item.texts)].slice(0, 2).join(' • ')}</div>
              </div>
              <span style="padding:4px 12px;border-radius:20px;background:${tColor('colors.infoLight')};color:${tColor('colors.info')};font-size:12px;font-weight:700;flex-shrink:0;">${item.count} links</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  const renderStructure = () => {
    if (viewMode === 'tree') return renderTreeView();
    if (viewMode === 'graph') return renderGraphView();
    return renderCardsView();
  };

  const renderCardsView = () => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;">
        <div class="ss-card">
          <h3 class="ss-h3">📑 Heading Hierarchy</h3>
          <div class="gdi-scrollbar" style="display:flex;flex-direction:column;gap:6px;max-height:400px;overflow-y:auto;">
            ${data.headings.map(h => `
              <div class="ss-item" style="margin-left:${(h.level - 1) * 16}px; border-left:3px solid var(--gdi-primary);">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:11px;font-weight:800;color:var(--gdi-primary);text-transform:uppercase;">H${h.level}</span>
                  <span style="font-size:13px;color:var(--gdi-text-main);font-weight:600;">${GDI.escapeHtml(h.text)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ss-card">
          <h3 class="ss-h3">🧭 Navigation Items</h3>
          <div class="gdi-scrollbar" style="display:flex;flex-wrap:wrap;gap:6px;max-height:300px;overflow-y:auto;">
            ${data.navItems.slice(0, 40).map(item => `
              <span style="padding:6px 12px;border-radius:8px;background:var(--gdi-surface-secondary);border:1px solid var(--gdi-border);font-size:12px;color:var(--gdi-text-sec);font-weight:500;">${GDI.escapeHtml(item.text)}</span>
            `).join('')}
          </div>
        </div>

        <div class="ss-card">
          <h3 class="ss-h3">🌳 DOM Snapshot</h3>
          <div class="gdi-scrollbar" style="font-family:monospace;font-size:12px;color:var(--gdi-text-sec);line-height:1.6;background:var(--gdi-surface-secondary);padding:16px;border-radius:10px;overflow-x:auto;">
            ${renderDomNode(domTree, 0)}
          </div>
        </div>
      </div>
    `;
  };

  const renderDomNode = (node, depth) => {
    if (!node) return '';
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.name) || depth < 1;

    return `
      <div style="margin-left:${depth * 12}px;">
        <div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px 0;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';">
          ${hasChildren ? `<span>${isExpanded ? '▼' : '▶'}</span>` : '<span style="width:14px;"></span>'}
          <span style="color:var(--gdi-primary);font-weight:700;">${node.tag}</span>
          ${node.id ? `<span style="color:${tColor('colors.success')};">${node.id}</span>` : ''}
          ${node.classes ? `<span style="color:${tColor('colors.warning')};">${node.classes}</span>` : ''}
        </div>
        ${hasChildren ? `
          <div style="${isExpanded ? '' : 'display:none;'}">
            ${node.children.map(c => renderDomNode(c, depth + 1)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  };

  const renderTreeView = () => {
    const buildTree = (node, prefix = '', isLast = true) => {
      if (!node) return '';
      const connector = prefix + (isLast ? '└── ' : '├── ');
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      let result = `<div style="font-family:monospace;font-size:12px;color:var(--gdi-text-sec);padding:2px 0;white-space:nowrap;">${connector}<span style="color:var(--gdi-primary);font-weight:700;">${node.tag}</span>${node.id || ''}${node.classes || ''}</div>`;
      if (node.children) node.children.forEach((child, i) => { result += buildTree(child, childPrefix, i === node.children.length - 1); });
      return result;
    };

    return `
      <div class="ss-card gdi-scrollbar" style="overflow-x:auto;">
        <h3 class="ss-h3">🌳 DOM Tree View</h3>
        <div style="background:var(--gdi-surface-secondary);padding:20px;border-radius:12px;">
          ${buildTree(domTree)}
        </div>
      </div>
    `;
  };

  const renderGraphView = () => {
    const nodes = [{ id: 'root', label: data.currentPath || '/', type: 'root', x: 400, y: 50 }];
    const edges = [];
    const uniqueInternal = [...data.linkMap.values()].slice(0, 15);
    
    uniqueInternal.forEach((item, i) => {
      const angle = (i / uniqueInternal.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({ id: `node-${i}`, label: item.path.length > 25 ? item.path.substring(0, 22) + '...' : item.path, count: item.count, x: 400 + Math.cos(angle) * 200, y: 250 + Math.sin(angle) * 120 });
      edges.push({ from: 'root', to: `node-${i}`, weight: item.count });
    });

    const maxCount = Math.max(...edges.map(e => e.weight), 1);

    return `
      <div class="ss-card">
        <h3 class="ss-h3">🕸️ Link Graph Visualization</h3>
        <div style="position:relative;width:100%;height:500px;background:var(--gdi-surface-secondary);border-radius:12px;overflow:hidden;">
          <svg width="100%" height="100%" viewBox="0 0 800 400" style="position:absolute;top:0;left:0;">
            ${edges.map(e => {
              const fNode = nodes.find(n => n.id === e.from);
              const tNode = nodes.find(n => n.id === e.to);
              return `<line x1="${fNode.x}" y1="${fNode.y}" x2="${tNode.x}" y2="${tNode.y}" stroke="var(--gdi-border)" stroke-width="${1 + (e.weight / maxCount) * 3}" opacity="0.6"/>`;
            }).join('')}
            ${nodes.map(n => `
              <g transform="translate(${n.x},${n.y})">
                <circle r="${n.type === 'root' ? 30 : 20 + (n.count || 0) * 2}" fill="var(--gdi-primary)" opacity="0.9"/>
                <text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${n.type === 'root' ? '🏠' : n.count || ''}</text>
              </g>
            `).join('')}
          </svg>
          ${nodes.map(n => `
            <div style="position:absolute;left:${(n.x / 800) * 100}%;top:${(n.y / 400) * 100}%;transform:translate(-50%,${n.type === 'root' ? '-120%' : '120%'});text-align:center;pointer-events:none;">
              <div style="font-size:11px;font-weight:700;color:var(--gdi-text-primary);background:var(--gdi-surface);padding:4px 8px;border-radius:6px;border:1px solid var(--gdi-border);">
                ${GDI.escapeHtml(n.label)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  const renderLinks = (uniqueInternal, externalDomains) => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:14px;">
        <div class="ss-card">
          <h3 class="ss-h3">🔗 Internal Links (${data.internalLinks.length})</h3>
          <div class="gdi-scrollbar" style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${uniqueInternal.slice(0, 20).map(item => `
              <div class="ss-item">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                  <span style="font-family:monospace;font-size:12px;color:var(--gdi-text-main);word-break:break-all;">${GDI.escapeHtml(item.path)}</span>
                  <span style="background:${tColor('colors.infoLight')};color:${tColor('colors.info')};font-size:11px;padding:2px 8px;border-radius:12px;font-weight:bold;">${item.count}×</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ss-card">
          <h3 class="ss-h3">🌐 External Domains (${externalDomains.length})</h3>
          <div class="gdi-scrollbar" style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${externalDomains.slice(0, 25).map(domain => `
              <div class="ss-item" style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;color:var(--gdi-text-main);font-weight:600;">${GDI.escapeHtml(domain)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const renderSEO = () => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:14px;">
        <div class="ss-card">
          <h3 class="ss-h3">📝 Meta Tags</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${Object.entries(data.metaTags).slice(0, 10).map(([name, content]) => `
              <div class="ss-item">
                <div style="font-size:11px;font-weight:800;color:var(--gdi-primary);text-transform:uppercase;margin-bottom:2px;">${GDI.escapeHtml(name)}</div>
                <div style="font-size:12px;color:var(--gdi-text-main);word-break:break-all;">${GDI.escapeHtml(content)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ss-card">
          <h3 class="ss-h3">🖼️ Image SEO</h3>
          <div style="display:flex;gap:10px;">
            <div class="ss-item" style="flex:1;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:var(--gdi-text-main);">${data.images.length}</div>
              <div style="font-size:11px;color:var(--gdi-text-muted);">Total Images</div>
            </div>
            <div class="ss-item" style="flex:1;text-align:center;background:${data.imagesWithoutAlt.length ? tColor('colors.errorLight') : tColor('colors.successLight')}">
              <div style="font-size:24px;font-weight:800;color:${data.imagesWithoutAlt.length ? tColor('colors.error') : tColor('colors.success')};">${data.imagesWithoutAlt.length}</div>
              <div style="font-size:11px;color:var(--gdi-text-muted);">Missing Alt</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderTechnical = () => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
        <div class="ss-card">
          <h3 class="ss-h3">📄 Page Information</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--gdi-border);padding-bottom:8px;">
              <span class="ss-text-sec" style="font-size:13px;">Canonical URL</span>
              <span class="ss-text-main" style="font-size:12px;font-weight:600;">${GDI.escapeHtml(data.canonical)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--gdi-border);padding-bottom:8px;">
              <span class="ss-text-sec" style="font-size:13px;">Page Size</span>
              <span class="ss-text-main" style="font-size:13px;font-weight:600;">${data.pageSizeKB} KB</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--gdi-border);padding-bottom:8px;">
              <span class="ss-text-sec" style="font-size:13px;">DOM Elements</span>
              <span class="ss-text-main" style="font-size:13px;font-weight:600;">${data.domStats.totalElements.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const bindEvents = () => {
    $GDI.$$('.ss-tab', content).forEach(t => {
      t.addEventListener('click', () => { activeTab = t.dataset.tab; render(); });
    });
    $GDI.$$('.ss-view-btn', content).forEach(b => {
      b.addEventListener('click', () => { viewMode = b.dataset.view; render(); });
    });

    GDI.$('#ss-export', content)?.addEventListener('click', () => {
      const summary = `Site Structure Report — ${data.domain}\nSEO Score: ${seo.score}/100\nInternal Links: ${data.internalLinks.length}\nExternal Links: ${data.externalLinks.length}\nImages: ${data.images.length} (${data.imagesWithoutAlt.length} missing alt)\nPage Size: ${data.pageSizeKB} KB`;
      copy(summary).then(() => toast('Report copied to clipboard!', 'success'));
    });
  };

  // ============ INIT ============
  render();
  GDI.createModal('Site Structure Visualizer', content, { 
    width: '95vw', maxWidth: '1200px', icon: '🏗️', subtitle: 'Interactive site architecture analysis' 
  });
}

// ==================== GOOGLE MAPS SCRAPER (WORKING VERSION) ====================
function scrapeGoogleMaps() {
  // ============ UTILITIES ============
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = GDI.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); document.body.removeChild(ta);
      return ok;
    }
  };

  const toast = (msg, type = 'success') => {
    const palette = {
      success: { bg: '#10b981', icon: '✓' },
      error: { bg: '#ef4444', icon: '✕' },
      info: { bg: '#3b82f6', icon: 'ℹ' },
      warning: { bg: '#f59e0b', icon: '!' }
    };
    const t = palette[type] || palette.info;
    const el = GDI.createElement('div');
    el.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:2147483647;
      background:${t.bg};color:#fff;padding:14px 20px;border-radius:14px;
      font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,.25),0 0 0 1px rgba(255,255,255,.1) inset;
      display:flex;align-items:center;gap:10px;max-width:380px;pointer-events:none;
      animation:gmsToastIn .4s cubic-bezier(.16,1,.3,1) forwards;
    `;
    el.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(255,255,255,.2);border-radius:50%;font-size:13px;">${t.icon}</span><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'gmsToastOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  };

  // ============ MODAL SYSTEM ============
  let overlay, modal, isMinimized = false;

  const buildModal = () => {
    overlay = GDI.createElement('div');
    overlay.id = 'gms-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:2147483646;
      background:rgba(15,23,42,.65);backdrop-filter:blur(12px);
      display:flex;align-items:center;justify-content:center;
      padding:16px;box-sizing:border-box;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      animation:gmsFadeIn .25s ease;
    `;

    modal = GDI.createElement('div');
    modal.id = 'gms-modal';
    modal.style.cssText = `
      background:var(--gdi-surface);border-radius:20px;width:100%;max-width:1000px;
      max-height:92vh;display:flex;flex-direction:column;
      box-shadow:0 25px 80px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.1) inset;
      animation:gmsModalUp .35s cubic-bezier(.16,1,.3,1);
      overflow:hidden;position:relative;
    `;

    overlay.appendChild(modal);
    overlay.classList.add('gdi-pointer-auto');
    GDI.ShadowRoot.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay && !isMinimized) destroy(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') isMinimized ? restore() : destroy();
      if (e.ctrlKey && e.key === 'e') { e.preventDefault(); GDI.$('#gms-btn-auto')?.click(); }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); GDI.$('#gms-btn-stop')?.click(); }
      if (e.ctrlKey && e.key === 'm') { e.preventDefault(); toggleMinimize(); }
    });
  };

  const destroy = () => { stopAll(); overlay?.remove(); };
  const toggleMinimize = () => isMinimized ? restore() : minimize();

  const minimize = () => {
    isMinimized = true;
    modal.style.display = 'none';
    overlay.style.background = 'transparent';
    overlay.style.backdropFilter = 'none';
    overlay.style.pointerEvents = 'none';

    const pill = GDI.createElement('div');
    pill.id = 'gms-pill';
    pill.style.cssText = `
      position:fixed;bottom:20px;right:20px;z-index:2147483647;
      background:#1e293b;color:#fff;padding:10px 18px;border-radius:50px;
      font:700 13px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3);
      display:flex;align-items:center;gap:10px;cursor:pointer;pointer-events:auto;
      animation:gmsPillIn .3s ease;border:1px solid rgba(255,255,255,.1);
    `;
    pill.innerHTML = `
      <span style="font-size:16px;">🗺️</span>
      <span id="gms-pill-count">${scraped.length}</span>
      <span style="width:1px;height:16px;background:rgba(255,255,255,.2);"></span>
      <span style="font-size:11px;opacity:.8;">Ctrl+M</span>
    `;
    pill.onclick = restore;
    pill.classList.add('gdi-pointer-auto');
    GDI.ShadowRoot.appendChild(pill);
    toast('Minimized — Ctrl+M to restore', 'info');
  };

  const restore = () => {
    isMinimized = false;
    GDI.ShadowRoot.querySelector('#gms-pill')?.remove();
    modal.style.display = 'flex';
    overlay.style.background = 'rgba(15,23,42,.65)';
    overlay.style.backdropFilter = 'blur(12px)';
    overlay.style.pointerEvents = 'auto';
    render();
  };

  // ============ STATE ============
  const isGM = window.location.hostname.includes('google.') &&
    (window.location.pathname.includes('/maps') || window.location.search.includes('maps'));
  let scraped = [];
  let isManual = false;
  let manualHandler = null;
  let scrollInterval = null;
  let mutObs = null;
  let isScrolling = false;
  let activeTab = 'extract'; // 'extract' | 'results'

  // ============ EXTRACTION ENGINE (unchanged logic) ============
  const findScrollContainer = () => {
    const sels = [
      'div[role="feed"]',
      'div[role="main"] div[style*="overflow-y: auto"]',
      'div[role="main"] div[style*="overflow: auto"]',
      'div[role="main"] div[class*="m6QErb"]',
      'div[role="main"]',
    ];
    for (const s of sels) {
      const el = GDI.$(s);
      if (el) {
        const st = window.getComputedStyle(el);
        if (st.overflowY === 'auto' || st.overflowY === 'scroll' || el.scrollHeight > el.clientHeight + 10) return el;
      }
    }
    const cands = $GDI.$$('div').filter(d => {
      const st = window.getComputedStyle(d);
      return (st.overflowY === 'auto' || st.overflowY === 'scroll') && d.scrollHeight > d.clientHeight + 50;
    });
    return cands.sort((a, b) => b.scrollHeight - a.scrollHeight)[0] || null;
  };

  const findFeed = () => GDI.$('div[role="feed"]') || GDI.$('div[role="main"]');

  const extractCoords = (url) => {
    if (!url) return null;
    const m1 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m1) return { lat: m1[1], lng: m1[2] };
    const m2 = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (m2) return { lat: m2[1], lng: m2[2] };
    return null;
  };

  const extractBiz = (container) => {
    try {
      if (!container || container.nodeType !== 1) return null;
      const fullText = container.textContent || '';
      const link = container.querySelector('a[href*="/maps/place/"]') || container.closest('a[href*="/maps/place/"]');

      let name = '';
      const nameEls = [
        container.querySelector('div.fontHeadlineSmall'),
        container.querySelector('div.qBF1Pd'),
        container.querySelector('div.NrDZNb'),
        container.querySelector('span[class*="headline"]'),
        container.querySelector('div[role="heading"]'),
        container.querySelector('h3'), container.querySelector('h2'), container.querySelector('h1'),
      ];
      for (const el of nameEls) { if (el) { name = clean(el.textContent); if (name.length > 1) break; } }
      if (!name && link) name = clean(link.getAttribute('aria-label') || link.textContent);
      name = name.replace(/\s*\d+(\.\d+)?\s*stars?\s*$/i, '').replace(/\s*[·•]\s*$/g, '').trim();
      if (!name || name.length < 2 || /^\d+\.?\d*$/.test(name)) return null;

      let rating = '', reviews = '';
      const rImg = container.querySelector('[role="img"][aria-label*="star"], span[aria-label*="star"]');
      if (rImg) {
        const l = rImg.getAttribute('aria-label') || '';
        const m = l.match(/([\d.]+)\s*stars?/i); if (m) rating = m[1];
        const rm = l.match(/\(([\d,]+)\)/); if (rm) reviews = rm[1];
      }
      if (!rating) { const m = fullText.match(/(\d+\.\d+)\s*⭐/); if (m) rating = m[1]; }
      if (!reviews) { const m = fullText.match(/\(([\d,]+)\s*review/i) || fullText.match(/([\d,]+)\s*review/i); if (m) reviews = m[1]; }

      let category = '';
      const parts = fullText.split(/[·•]/).map(clean).filter(Boolean);
      if (parts.length >= 2) { const c = parts[1]; if (c.length < 60 && !c.match(/^\d/) && !c.includes('$') && c !== name) category = c; }

      let address = '';
      const am = fullText.match(/(\d+[^,]{5,}(street|st|avenue|ave|road|rd|blvd|drive|dr|lane|ln|way|plaza|center|pl|court|ct)\b[^·•]{0,80})/i);
      if (am) address = clean(am[0]);
      if (!address) {
        for (const sp of $GDI.$$('span', container)) {
          const t = clean(sp.textContent);
          if (t.length > 8 && t.match(/\d/) && !t.match(/stars?|review|open|closed/i) && t !== name && t !== category) { address = t; break; }
        }
      }

      let phone = '';
      const pm = fullText.match(/(\+?[\d\s\-\(\)]{10,})/);
      if (pm) { const p = pm[1].replace(/\s+/g, ' ').trim(); if (p.length >= 10 && p.match(/\d{3}/)) phone = p; }

      let website = '';
      const wl = container.querySelector('a[href^="http"]:not([href*="google.com/maps"])');
      if (wl) website = wl.href;

      let priceLevel = '';
      const prm = fullText.match(/([€£$¥₹]{1,4})/);
      if (prm) priceLevel = prm[1];

      let status = '';
      const sm = fullText.match(/(Open\s*24\s*hours|Open\s*now|Closed|Closes?\s+(?:soon|at|in)|Opens?\s+(?:soon|at|in|tomorrow|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday))/i);
      if (sm) status = sm[0];

      let mapsUrl = '', coords = null;
      if (link) { const raw = link.getAttribute('href') || link.href; mapsUrl = raw.startsWith('http') ? raw : 'https://www.google.com' + raw; coords = extractCoords(mapsUrl); }

      let image = '';
      const img = container.querySelector('img[src*="googleusercontent"], img[src*="gstatic"], img[src*="maps.gstatic"]');
      if (img) image = img.src;

      let placeId = '';
      if (mapsUrl) { const pm = mapsUrl.match(/place\/([^/@]+)/); if (pm) placeId = decodeURIComponent(pm[1]); }

      return {
        name, rating, reviews, category, address, phone, website,
        priceLevel, status, mapsUrl, image, placeId,
        lat: coords?.lat || '', lng: coords?.lng || '',
        _key: `${name.toLowerCase().trim()}|${(address || '').toLowerCase().trim()}`
      };
    } catch (e) { return null; }
  };

  const extractAll = () => {
    const results = []; const seen = new Set();
    const add = (b) => { if (!b?.name) return; if (seen.has(b._key)) return; seen.add(b._key); results.push(b); };
    $GDI.$$('div[role="article"]').forEach(el => add(extractBiz(el)));
    const feed = GDI.$('div[role="feed"]');
    if (feed) Array.from(feed.children).forEach(c => add(extractBiz(c)));
    $GDI.$$('[data-result-index], [data-result-id]').forEach(el => add(extractBiz(el)));
    $GDI.$$('a[href*="/maps/place/"]').forEach(link => {
      let p = link.parentElement;
      for (let i = 0; i < 7 && p; i++) { if (p.getAttribute('role') === 'article' || p.getAttribute('data-result-index')) { add(extractBiz(p)); return; } p = p.parentElement; }
      add(extractBiz(link.closest('div') || link));
    });
    $GDI.$$('.fontHeadlineSmall, .qBF1Pd, .NrDZNb').forEach(el => {
      const p = el.closest('div[role="article"], [data-result-index], div[jsaction*="mouseover"]') || el.parentElement?.parentElement?.parentElement;
      if (p) add(extractBiz(p));
    });
    return results;
  };

  // ============ SCROLL LOGIC ============
  const stopAll = () => {
    if (scrollInterval) { clearInterval(scrollInterval); scrollInterval = null; }
    if (mutObs) { mutObs.disconnect(); mutObs = null; }
    isScrolling = false;
  };

  const startAutoScroll = () => {
    if (isScrolling) return;
    isScrolling = true;
    activeTab = 'extract'; render();

    const sc = findScrollContainer();
    if (!sc) { toast('Scroll container not found. Scroll the sidebar manually first.', 'error'); isScrolling = false; render(); return; }

    const feed = findFeed();
    let lastCount = scraped.length;

    const onMut = () => {
      clearTimeout(window._gmsDebounce);
      window._gmsDebounce = setTimeout(() => {
        const added = merge(extractAll());
        if (added) render();
      }, 250);
    };

    mutObs = new MutationObserver(onMut);
    mutObs.observe(feed || sc, { childList: true, subtree: true });
    onMut();

    let scrolls = 0, stagnant = 0, lastH = sc.scrollHeight;

    scrollInterval = setInterval(() => {
      const old = sc.scrollTop;
      sc.scrollTop += Math.min(700, sc.clientHeight * 0.6);
      scrolls++;
      const didMove = sc.scrollTop > old;
      const h = sc.scrollHeight;

      if (scraped.length === lastCount && h === lastH && !didMove) stagnant++; else { stagnant = 0; lastCount = scraped.length; lastH = h; }

      render();

      if (scrolls >= 60 || stagnant >= 6) {
        stopAll();
        toast(`Done! ${scraped.length} businesses extracted.`, 'success');
        render();
      }
    }, 800);
  };

  const merge = (items) => {
    const before = scraped.length;
    const map = new Map(scraped.map(b => [b._key, b]));
    items.forEach(b => { if (b?._key && !map.has(b._key)) { map.set(b._key, b); scraped.push(b); } });
    return scraped.length - before;
  };

  // ============ UI RENDERERS ============
  const stats = () => {
    if (!scraped.length) return null;
    const avg = scraped.filter(b => b.rating).reduce((a, b) => a + (+b.rating || 0), 0) / scraped.filter(b => b.rating).length || 0;
    const cats = {};
    scraped.forEach(b => { if (b.category) cats[b.category] = (cats[b.category] || 0) + 1; });
    const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    return { count: scraped.length, avg: avg.toFixed(1), topCat, withPhone: scraped.filter(b => b.phone).length };
  };

  const render = () => {
    if (!modal) return;
    const st = stats();

    // Header
    const headerHTML = `
      <div style="padding:16px 24px;border-bottom:1px solid var(--gdi-border);display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--gdi-primary-gradient);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px var(--gdi-primary);">🗺️</div>
          <div>
            <h1 style="margin:0;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-.3px;">Maps Scraper</h1>
            <div style="font-size:12px;color:var(--gdi-text-secondary);font-weight:500;margin-top:1px;">${isGM ? 'Ready to extract' : 'Navigate to Google Maps'}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${st ? `<div style="background:var(--gdi-surface);padding:6px 14px;border-radius:20px;border:1px solid var(--gdi-border);font-size:13px;font-weight:700;color:#334155;box-shadow:0 1px 2px rgba(0,0,0,.04);"><span style="color:var(--gdi-primary);">${st.count}</span> extracted</div>` : ''}
          <button id="gms-minimize" style="background:var(--gdi-surface);border:1px solid var(--gdi-border);width:32px;height:32px;border-radius:8px;cursor:pointer;color:var(--gdi-text-secondary);font-size:16px;display:flex;align-items:center;justify-content:center;" title="Minimize (Ctrl+M)">−</button>
          <button id="gms-close" style="background:#fee2e2;border:1px solid #fecaca;width:32px;height:32px;border-radius:8px;cursor:pointer;color:#dc2626;font-size:18px;display:flex;align-items:center;justify-content:center;" title="Close (Esc)">×</button>
        </div>
      </div>
    `;

    // Tabs
    const tabsHTML = `
      <div style="display:flex;gap:0;border-bottom:1px solid var(--gdi-border);background:var(--gdi-surface);padding:0 24px;">
        <button data-tab="extract" class="gms-tab ${activeTab === 'extract' ? 'active' : ''}" style="padding:14px 20px;font-size:13px;font-weight:700;color:var(--gdi-text-secondary);background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;">Extract</button>
        <button data-tab="results" class="gms-tab ${activeTab === 'results' ? 'active' : ''}" style="padding:14px 20px;font-size:13px;font-weight:700;color:var(--gdi-text-secondary);background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;">
          Results
          ${scraped.length ? `<span style="display:inline-flex;margin-left:6px;padding:2px 8px;background:#6366f1;color:#fff;border-radius:10px;font-size:11px;min-width:18px;text-align:center;">${scraped.length}</span>` : ''}
        </button>
      </div>
    `;

    // Extract Tab
    const extractHTML = !isGM ? `
      <div style="text-align:center;padding:64px 24px;">
        <div style="font-size:64px;margin-bottom:20px;filter:grayscale(.2);">🗺️</div>
        <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">You're not on Google Maps</h2>
        <p style="margin:0 0 28px;color:var(--gdi-text-secondary);max-width:360px;margin-left:auto;margin-right:auto;line-height:1.6;">Open Google Maps, search for businesses, then run this scraper again.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button id="gms-open-maps" class="gms-btn gms-primary">Open Google Maps</button>
          <div style="display:flex;gap:8px;">
            <input id="gms-search-q" placeholder="Search query..." style="padding:10px 14px;border:1px solid #cbd5e1;border-radius:10px;font-size:14px;min-width:220px;outline:none;focus:border-color:var(--gdi-primary);">
            <button id="gms-search-btn" class="gms-btn gms-primary">Search</button>
          </div>
        </div>
      </div>
    ` : `
      <div style="padding:24px;">
        <!-- Stats Cards -->
        ${st ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px;">
            <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);padding:16px;border-radius:14px;border:1px solid #bfdbfe;">
              <div style="font-size:11px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:.5px;">Extracted</div>
              <div style="font-size:28px;font-weight:800;color:#1e40af;margin-top:4px;">${st.count}</div>
            </div>
            <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);padding:16px;border-radius:14px;border:1px solid #fcd34d;">
              <div style="font-size:11px;font-weight:700;color:#d97706;text-transform:uppercase;letter-spacing:.5px;">Avg Rating</div>
              <div style="font-size:28px;font-weight:800;color:#92400e;margin-top:4px;">${st.avg}★</div>
            </div>
            <div style="background:linear-gradient(135deg,#ecfdf5,#a7f3d0);padding:16px;border-radius:14px;border:1px solid #6ee7b7;">
              <div style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.5px;">With Phone</div>
              <div style="font-size:28px;font-weight:800;color:#065f46;margin-top:4px;">${st.withPhone}</div>
            </div>
            <div style="background:linear-gradient(135deg,#f5f3ff,#ddd6fe);padding:16px;border-radius:14px;border:1px solid #c4b5fd;">
              <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.5px;">Top Category</div>
              <div style="font-size:14px;font-weight:700;color:#5b21b6;margin-top:8px;line-height:1.3;">${GDI.escapeHtml(st.topCat)}</div>
            </div>
          </div>
        ` : ''}

        <!-- Controls -->
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
          <button id="gms-btn-auto" class="gms-btn gms-primary" ${isScrolling ? 'disabled' : ''}>
            <span>${isScrolling ? '⏳ Extracting...' : '🔄 Auto-Scroll'}</span>
          </button>
          <button id="gms-btn-stop" class="gms-btn gms-danger" style="${isScrolling ? '' : 'display:none;'}">⏹ Stop</button>
          <button id="gms-btn-visible" class="gms-btn gms-secondary" ${isScrolling ? 'disabled' : ''}>📋 Extract Visible</button>
          <button id="gms-btn-manual" class="gms-btn gms-warning" ${isScrolling ? 'disabled' : ''}>${isManual ? '⏹ Stop Manual' : '🎯 Manual Select'}</button>
        </div>

        <!-- Progress -->
        ${isScrolling ? `
          <div style="background:var(--gdi-surface-secondary);border:1px solid var(--gdi-border);border-radius:14px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:10px;height:10px;background:#10b981;border-radius:50%;animation:gmsPulse 1.5s infinite;box-shadow:0 0 0 4px rgba(16,185,129,.2);"></div>
                <span style="font-size:14px;font-weight:700;color:#0f172a;">Auto-scrolling in progress</span>
              </div>
              <span style="font-size:13px;font-weight:800;color:var(--gdi-primary);background:#e0e7ff;padding:4px 12px;border-radius:20px;">${scraped.length} found</span>
            </div>
            <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
              <div style="height:100%;background:var(--gdi-primary-gradient);width:${Math.min((scraped.length / 50) * 100, 100)}%;border-radius:999px;transition:width .5s ease;"></div>
            </div>
            <div style="font-size:12px;color:var(--gdi-text-secondary);margin-top:10px;">Scrolling the results sidebar and capturing new listings as they load...</div>
          </div>
        ` : ''}

        <!-- Manual Banner -->
        ${isManual ? `
          <div style="background:#fef3c7;border:2px dashed #f59e0b;border-radius:14px;padding:16px 20px;text-align:center;margin-bottom:20px;animation:gmsFadeIn .3s ease;">
            <div style="font-size:20px;margin-bottom:6px;">👆</div>
            <div style="font-size:14px;font-weight:800;color:#92400e;">Manual Mode Active</div>
            <div style="font-size:12px;color:#b45309;margin-top:4px;">Click any business card in the sidebar to add it. Purple outline = selected. Click again to remove.</div>
          </div>
        ` : ''}

        <!-- Empty state -->
        ${!st && !isScrolling ? `
          <div style="text-align:center;padding:48px 24px;background:var(--gdi-surface-secondary);border-radius:16px;border:2px dashed #e2e8f0;">
            <div style="font-size:48px;margin-bottom:16px;">📭</div>
            <div style="font-size:16px;font-weight:800;color:#334155;margin-bottom:6px;">No businesses yet</div>
            <div style="font-size:13px;color:var(--gdi-text-secondary);max-width:320px;margin:0 auto;line-height:1.6;">Auto-Scroll will scroll through all results automatically. Manual Select lets you pick individual listings.</div>
          </div>
        ` : ''}
      </div>
    `;

    // Results Tab
    const resultsHTML = !scraped.length ? `
      <div style="text-align:center;padding:64px 24px;">
        <div style="font-size:56px;margin-bottom:16px;">📋</div>
        <div style="font-size:16px;font-weight:800;color:#334155;margin-bottom:6px;">No results to show</div>
        <div style="font-size:13px;color:var(--gdi-text-secondary);">Switch to the Extract tab and scrape some businesses first.</div>
      </div>
    ` : (() => {
      const filterVal = (modal.querySelector('#gms-filter-input')?.value || '').toLowerCase();
      const filtered = filterVal ? scraped.filter(b =>
        b.name.toLowerCase().includes(filterVal) ||
        (b.category || '').toLowerCase().includes(filterVal) ||
        (b.address || '').toLowerCase().includes(filterVal)
      ) : scraped;

      return `
        <div style="padding:24px;">
          <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
            <div style="position:relative;flex:1;min-width:200px;">
              <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;">🔍</span>
              <input id="gms-filter-input" value="${GDI.escapeHtml(filterVal)}" placeholder="Filter by name, category, address..." style="width:100%;padding:10px 12px 10px 36px;border:1px solid var(--gdi-border);border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;">
            </div>
            <button id="gms-export-trigger" class="gms-btn gms-secondary">📤 Export</button>
            <button id="gms-clear" class="gms-btn gms-danger">🗑 Clear</button>
          </div>

          <div style="font-size:12px;color:var(--gdi-text-secondary);margin-bottom:12px;font-weight:600;">
            Showing ${filtered.length} of ${scraped.length} result${scraped.length !== 1 ? 's' : ''}
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
            ${filtered.map((b, i) => `
              <div style="background:var(--gdi-surface);border:1px solid var(--gdi-border);border-radius:16px;padding:16px;transition:all .2s;position:relative;box-shadow:0 1px 3px rgba(0,0,0,.04);" onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='translateY(0)'">
                <div style="display:flex;gap:12px;">
                  ${b.image ? `<img src="${GDI.escapeHtml(b.image)}" style="width:56px;height:56px;object-fit:cover;border-radius:12px;border:1px solid var(--gdi-border);flex-shrink:0;">` : `<div style="width:56px;height:56px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🏢</div>`}
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;color:#0f172a;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${GDI.escapeHtml(b.name)}</div>
                    ${b.category ? `<div style="font-size:11px;color:var(--gdi-primary);font-weight:700;margin-top:3px;">${GDI.escapeHtml(b.category)}</div>` : ''}
                    <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                      ${b.rating ? `<span style="font-size:13px;font-weight:800;color:#f59e0b;">★ ${GDI.escapeHtml(b.rating)}</span>` : ''}
                      ${b.reviews ? `<span style="font-size:11px;color:var(--gdi-text-secondary);">(${GDI.escapeHtml(b.reviews)})</span>` : ''}
                      ${b.priceLevel ? `<span style="font-size:11px;color:#059669;font-weight:700;background:#d1fae5;padding:2px 6px;border-radius:4px;">${GDI.escapeHtml(b.priceLevel)}</span>` : ''}
                    </div>
                  </div>
                  <button class="gms-del" data-idx="${scraped.indexOf(b)}" style="background:#fee2e2;border:none;width:28px;height:28px;border-radius:8px;cursor:pointer;color:#dc2626;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">×</button>
                </div>
                ${b.address ? `<div style="margin-top:10px;font-size:12px;color:#475569;line-height:1.5;display:flex;align-items:flex-start;gap:6px;"><span>📍</span><span>${GDI.escapeHtml(b.address)}</span></div>` : ''}
                ${b.phone ? `<div style="margin-top:4px;font-size:12px;color:#475569;display:flex;align-items:center;gap:6px;"><span>📞</span><span>${GDI.escapeHtml(b.phone)}</span></div>` : ''}
                ${b.status ? `<div style="margin-top:6px;font-size:11px;color:#059669;font-weight:700;background:#ecfdf5;display:inline-block;padding:3px 10px;border-radius:20px;">🕒 ${GDI.escapeHtml(b.status)}</div>` : ''}
                <div style="display:flex;gap:8px;margin-top:12px;">
                  ${b.mapsUrl ? `<a href="${GDI.escapeHtml(b.mapsUrl)}" target="_blank" style="flex:1;text-align:center;padding:8px;background:#f1f5f9;border-radius:8px;font-size:12px;font-weight:700;color:#475569;text-decoration:none;border:1px solid var(--gdi-border);transition:all .15s;" onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'">🗺️ Maps</a>` : ''}
                  ${b.website ? `<a href="${GDI.escapeHtml(b.website)}" target="_blank" style="flex:1;text-align:center;padding:8px;background:#eff6ff;border-radius:8px;font-size:12px;font-weight:700;color:#2563eb;text-decoration:none;border:1px solid #dbeafe;transition:all .15s;" onmouseenter="this.style.background='#dbeafe'" onmouseleave="this.style.background='#eff6ff'">🌐 Website</a>` : ''}
                </div>
                ${b.lat ? `<div style="margin-top:8px;font-size:11px;color:#94a3b8;font-family:monospace;">${GDI.escapeHtml(b.lat)}, ${GDI.escapeHtml(b.lng)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    })();

    // Assemble
    modal.innerHTML = `
      <style>
        @keyframes gmsFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes gmsModalUp{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes gmsToastIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
        @keyframes gmsToastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}
        @keyframes gmsPulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes gmsPillIn{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        .gms-btn{padding:10px 16px;border:none;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap;}
        .gms-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.12);}
        .gms-btn:active:not(:disabled){transform:translateY(0);}
        .gms-btn:disabled{opacity:.5;cursor:not-allowed;}
        .gms-primary{background:var(--gdi-primary-gradient);color:#fff;}
        .gms-secondary{background:#f1f5f9;color:#334155;border:1px solid var(--gdi-border);}
        .gms-danger{background:#fee2e2;color:#dc2626;border:1px solid #fecaca;}
        .gms-warning{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}
        .gms-tab.active{color:var(--gdi-primary);border-bottom-color:var(--gdi-primary);}
        .gms-tab:hover:not(.active){color:#334155;background:var(--gdi-surface-secondary);}
      </style>
      ${headerHTML}
      ${tabsHTML}
      <div style="flex:1;overflow-y:auto;background:var(--gdi-surface);">
        ${activeTab === 'extract' ? extractHTML : resultsHTML}
      </div>
      ${isGM ? `
        <div style="padding:10px 24px;border-top:1px solid #e2e8f0;background:var(--gdi-surface-secondary);font-size:11px;color:#94a3b8;display:flex;justify-content:space-between;align-items:center;">
          <span>Shortcuts: <b>Ctrl+E</b> Auto-scroll • <b>Ctrl+S</b> Stop • <b>Ctrl+M</b> Minimize • <b>Esc</b> Close</span>
          <span>${isScrolling ? '⏳ Extracting...' : '✓ Ready'}</span>
        </div>
      ` : ''}
    `;

    bindEvents();
  };

  const bindEvents = () => {
    const $ui = (s) => modal.querySelector(s);
    const $$ui = (s) => Array.from(modal.querySelectorAll(s));

    $ui('#gms-close')?.addEventListener('click', destroy);
    $ui('#gms-minimize')?.addEventListener('click', toggleMinimize);

    $$ui('.gms-tab').forEach(t => {
      t.addEventListener('click', () => { activeTab = t.dataset.tab; render(); });
    });

    $ui('#gms-open-maps')?.addEventListener('click', () => window.open('https://www.google.com/maps', '_blank'));
    $ui('#gms-search-btn')?.addEventListener('click', () => {
      const q = $ui('#gms-search-q')?.value.trim();
      if (q) window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, '_blank');
    });
    $ui('#gms-search-q')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') $ui('#gms-search-btn')?.click(); });

    $ui('#gms-btn-auto')?.addEventListener('click', () => { startAutoScroll(); render(); });
    $ui('#gms-btn-stop')?.addEventListener('click', () => { stopAll(); toast('Stopped', 'info'); render(); });
    $ui('#gms-btn-visible')?.addEventListener('click', () => {
      const added = merge(extractAll());
      render();
      toast(added ? `Added ${added} businesses` : 'No new businesses found', added ? 'success' : 'warning');
    });

    $ui('#gms-btn-manual')?.addEventListener('click', toggleManual);

    $ui('#gms-filter-input')?.addEventListener('input', () => render());
    $ui('#gms-clear')?.addEventListener('click', () => {
      if (!confirm(`Clear all ${scraped.length} extracted businesses?`)) return;
      scraped = []; stopAll(); render(); toast('Cleared', 'info');
    });

    $ui('#gms-export-trigger')?.addEventListener('click', showExportMenu);

    $$ui('.gms-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        scraped.splice(idx, 1);
        render();
        toast('Removed', 'info');
      });
    });
  };

  // ============ MANUAL MODE ============
  const toggleManual = () => {
    const btn = modal.querySelector('#gms-btn-manual');
    if (isManual) {
      isManual = false;
      if (manualHandler) { document.removeEventListener('click', manualHandler, true); manualHandler = null; }
      $GDI.$$('.gms-selected-item').forEach(el => { el.style.outline = ''; el.style.cursor = ''; el.classList.remove('gms-selected-item'); });
      render();
      toast('Manual mode off', 'info');
      return;
    }
    isManual = true; render();
    toast('Manual mode on — click listings to add', 'info');

    manualHandler = (e) => {
      const target = e.target.closest('div[role="article"], a[href*="/maps/place/"], [data-result-index]');
      if (!target) return;
      const container = target.closest('div[role="article"]') || target.closest('[data-result-index]') || target;

      if (container.classList.contains('gms-selected-item')) {
        container.classList.remove('gms-selected-item');
        container.style.outline = ''; container.style.cursor = '';
        const idx = scraped.findIndex(b => b._key === (container._gmsKey || ''));
        if (idx > -1) { scraped.splice(idx, 1); render(); }
        return;
      }

      e.preventDefault(); e.stopPropagation();
      const business = extractBiz(container);
      if (business?.name) {
        container._gmsKey = business._key;
        container.classList.add('gms-selected-item');
        container.style.cssText += ';outline:3px solid var(--gdi-primary) !important;border-radius:12px !important;cursor:pointer !important;';
        if (!scraped.find(b => b._key === business._key)) {
          scraped.push(business); render();
          toast(`Added: ${business.name}`, 'success');
        }
      }
    };
    document.addEventListener('click', manualHandler, true);
  };

  // ============ EXPORT MENU ============
  const showExportMenu = () => {
    const existing = modal.querySelector('#gms-export-menu');
    if (existing) { existing.remove(); return; }

    const menu = GDI.createElement('div');
    menu.id = 'gms-export-menu';
    menu.style.cssText = `
      position:absolute;right:24px;bottom:80px;z-index:10;
      background:var(--gdi-surface);border:1px solid var(--gdi-border);border-radius:14px;
      box-shadow:0 20px 50px rgba(0,0,0,.15);padding:8px;min-width:200px;
      animation:gmsFadeIn .2s ease;
    `;
    menu.innerHTML = `
      <div style="padding:8px 12px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Export Format</div>
      <button id="gms-exp-csv" class="gms-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📊</span> CSV Spreadsheet</button>
      <button id="gms-exp-json" class="gms-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📦</span> JSON Data</button>
      <button id="gms-exp-md" class="gms-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📝</span> Markdown Table</button>
      <div style="height:1px;background:#e2e8f0;margin:6px 0;"></div>
      <button id="gms-exp-copy" class="gms-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📋</span> Copy to Clipboard</button>
    `;
    modal.appendChild(menu);

    const closeMenu = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', closeMenu); } };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);

    menu.querySelectorAll('.gms-menu-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.style.background = '#f8fafc');
      item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    });

    GDI.$('#gms-exp-csv', menu).addEventListener('click', () => { doExport('csv'); menu.remove(); });
    GDI.$('#gms-exp-json', menu).addEventListener('click', () => { doExport('json'); menu.remove(); });
    GDI.$('#gms-exp-md', menu).addEventListener('click', () => { doExport('md'); menu.remove(); });
    GDI.$('#gms-exp-copy', menu).addEventListener('click', async () => {
      const lines = scraped.map(b => `${b.name} | ${b.rating || 'N/A'}★ | ${b.category || ''} | ${b.address || ''}`);
      const ok = await copy(lines.join('\n'));
      toast(ok ? 'Copied!' : 'Failed', ok ? 'success' : 'error');
      menu.remove();
    });
  };

  const doExport = (type) => {
    if (!scraped.length) return;
    let blob, filename, mime;

    if (type === 'csv') {
      const h = ['Name', 'Rating', 'Reviews', 'Category', 'Address', 'Phone', 'Website', 'Price Level', 'Status', 'Lat', 'Lng', 'Place ID', 'Maps URL', 'Image URL'];
      const rows = scraped.map(b => [b.name, b.rating, b.reviews, b.category, b.address, b.phone, b.website, b.priceLevel, b.status, b.lat, b.lng, b.placeId, b.mapsUrl, b.image]);
      const csv = [h, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      blob = new Blob(['\ufeff' + csv], { type: 'text/csv' }); filename = `maps-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'json') {
      blob = new Blob([JSON.stringify({ source: location.href, extractedAt: new Date().toISOString(), count: scraped.length, businesses: scraped }, null, 2)], { type: 'application/json' });
      filename = `maps-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      let md = `# Google Maps Extraction — ${new Date().toLocaleString()}\n\n| # | Business | Rating | Category | Address | Phone | Maps |\n|---|----------|--------|----------|---------|-------|------|\n`;
      scraped.forEach((b, i) => {
        md += `| ${i + 1} | ${b.name.replace(/\|/g, '\\|')} | ${b.rating ? `★ ${b.rating}` : ''} | ${(b.category || '').replace(/\|/g, '\\|')} | ${(b.address || '').replace(/\|/g, '\\|')} | ${b.phone || ''} | ${b.mapsUrl ? `[Link](${b.mapsUrl})` : ''} |\n`;
      });
      blob = new Blob([md], { type: 'text/markdown' }); filename = `maps-${new Date().toISOString().split('T')[0]}.md`;
    }

    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast(`${type.toUpperCase()} downloaded`, 'success');
  };

  // ============ INIT ============
  buildModal();
  render();
}
// ==================== TOOL: KEYWORD RANK TRACKER ====================

function keywordRankTracker() {
  const CONFIG = {
    MAX_RESULTS: 100,
    MAX_PAGES: 10,
    REQUEST_DELAY: { min: 600, max: 1000 },
    USER_AGENT: navigator.userAgent
  };

  if (!window.location.hostname.includes('google.')) {
    GDI.showNotification('This keyword ranking tool only works on Google search result pages', 'error');
    return;
  }

  const EXCLUDE_PATTERNS = [
    /google\.(com|co\.|ca|de|fr|it|es|co\.uk|com\.au|co\.jp)/i,
    /youtube\.com\/(watch|channel|user|c\/|playlist)/i,
    /youtu\.be\//i,
    /vimeo\.com\//i,
    /dailymotion\.com\//i,
    /maps\.google/i,
    /webcache\.googleusercontent/i,
    /translate\.google/i,
    /books\.google/i,
    /scholar\.google/i,
    /patents\.google/i,
    /support\.google/i,
    /news\.google/i,
    /shopping\.google/i,
    /flights\.google/i,
    /^javascript:/i,
    /^mailto:/i,
    /^tel:/i,
    /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff)(\?|$)/i,
    /\.(mp4|avi|mov|wmv|flv|webm|mkv)(\?|$)/i,
    /\.(mp3|wav|flac|aac|ogg)(\?|$)/i,
    /\/images\//i,
    /\/video\//i
  ];

  const INVALID_TITLE_PATTERNS = [
    /^Images for /i,
    /^Videos for /i,
    /^News for /i,
    /^Shopping results for /i,
    /^More results/i,
    /^Related searches/i,
    /^People also ask/i,
    /^Sponsored/i,
    /^Ad\s/i,
    /duration:/i,
    /\d+:\d+/i
  ];

  let allResults = [];
  let extractionCancelled = false;
  let targetDomain = '';

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const getRandomDelay = () => Math.floor(Math.random() * (CONFIG.REQUEST_DELAY.max - CONFIG.REQUEST_DELAY.min + 1)) + CONFIG.REQUEST_DELAY.min;

  function isValidResult(url, title) {
    if (!url || !url.startsWith('http')) return false;
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url))) return false;
    if (!title || title.trim() === '') return false;
    if (INVALID_TITLE_PATTERNS.some(pattern => pattern.test(title))) return false;
    return true;
  }

  function cleanGoogleUrl(url) {
    if (url.includes('/url?q=')) {
      const match = url.match(/url\?q=(.+?)&/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).split('#')[0];
      }
      return null;
    }
    return url.split('&')[0].split('#')[0];
  }

  function extractRankings(doc = document, pageNumber = 1) {
    const containers = doc.querySelectorAll('.MjjYud, .g, .tF2Cxc');
    const seenUrls = new Set(allResults.map(r => r.url));
    const extracted = [];

    containers.forEach((container) => {
      if (allResults.length >= CONFIG.MAX_RESULTS) return;
      
      if (container.closest('#pfa, #botstuff, .ads, #tads, [data-text-ad]')) return;
      
      const containerText = container.textContent.toLowerCase();
      if (containerText.includes('people also ask') ||
          containerText.includes('sponsored') ||
          containerText.includes('ad ·')) return;

      const linkElement = container.querySelector('a[jsname="UWfWsc"], a[data-ved], .yuRUbf a');
      const titleElement = container.querySelector('h3');

      if (!linkElement?.href || !titleElement) return;

      const url = cleanGoogleUrl(linkElement.href);
      if (!url) return;

      const title = titleElement.textContent.trim();

      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

        if (isValidResult(url, title) && !seenUrls.has(url)) {
          const result = {
            rank: allResults.length + 1,
            url,
            domain,
            title,
            page: pageNumber,
            isTarget: targetDomain && domain.includes(targetDomain.toLowerCase())
          };
          
          allResults.push(result);
          extracted.push(result);
          seenUrls.add(url);
        }
      } catch (e) {
        console.warn('Error processing URL:', url);
      }
    });

    return extracted;
  }

  function createStatusDiv() {
    const statusDiv = GDI.createElement('div', {
        attrs: { id: 'ranking-status' },
        styles: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: GDI.ThemeEngine.token('colors.surface'),
            color: GDI.ThemeEngine.token('colors.textPrimary'),
            padding: '16px 20px',
            borderRadius: GDI.DESIGN_TOKENS.radii.lg,
            zIndex: '100000',
            fontFamily: GDI.DESIGN_TOKENS.typography.fontFamily,
            fontSize: GDI.DESIGN_TOKENS.typography.sizes.md,
            minWidth: '320px',
            boxShadow: GDI.ThemeEngine.isDark() ? GDI.DESIGN_TOKENS.shadows.dark.xl : GDI.DESIGN_TOKENS.shadows.xl,
            borderLeft: `4px solid ${GDI.ThemeEngine.token('colors.success')}`,
            border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`
        }
    });
    
    statusDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong style="font-size: 16px;">📊 Keyword Rank Tracker</strong>
      </div>
      <div id="status-message" style="color: ${GDI.ThemeEngine.token('colors.textSecondary')}">Starting ranking analysis...</div>
      <div style="margin-top: 12px; height: 6px; background: ${GDI.ThemeEngine.token('colors.surfaceTertiary')}; border-radius: 4px; overflow: hidden;">
        <div id="status-progress-bar" style="height: 100%; background: ${GDI.ThemeEngine.token('colors.success')}; width: 0%; transition: width 0.3s;"></div>
      </div>
    `;

    const cancelBtn = GDI.createButton('Cancel', () => {
        extractionCancelled = true;
        statusDiv.remove();
    }, { variant: 'danger', size: 'sm', fullWidth: true });
    
    cancelBtn.style.marginTop = '12px';
    statusDiv.appendChild(cancelBtn);
    
    statusDiv.classList.add('gdi-pointer-auto'); // Ensures it remains clickable
  GDI.ShadowRoot.appendChild(statusDiv);
    return statusDiv;
  }

  function updateStatus(statusDiv, message, progress = null) {
    if (!statusDiv?.parentNode) return;
    
    const msgEl = statusDiv.querySelector('#status-message');
    const progressBar = statusDiv.querySelector('#status-progress-bar');
    
    if (msgEl) msgEl.textContent = message;
    if (progressBar && progress !== null) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  function promptForTargetDomain() {
    return new Promise((resolve) => {
        const content = GDI.createElement('div', {
            styles: { padding: '20px', textAlign: 'center' }
        });

        const { wrapper, input } = GDI.createInputField({
            label: 'Enter domain to highlight its ranking position (optional)',
            id: 'targetDomainInput',
            placeholder: 'e.g., example.com or amazon.com'
        });

        content.appendChild(wrapper);

        const btnRow = GDI.createElement('div', {
            styles: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }
        });

        btnRow.appendChild(GDI.createButton('Skip', () => {
            closeModal();
            resolve();
        }, { variant: 'secondary', fullWidth: false }));

        btnRow.appendChild(GDI.createButton('Track Rankings', () => {
            targetDomain = input.value.trim();
            closeModal();
            resolve();
        }, { variant: 'success', fullWidth: false }));

        content.appendChild(btnRow);

        const { close: closeModal } = GDI.createModal('🎯 Track Keyword Rankings', content, { width: '400px' });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                targetDomain = input.value.trim();
                closeModal();
                resolve();
            }
        });
        
        setTimeout(() => input.focus(), 100);
    });
  }

  async function extractRankingsFromPages() {
    await promptForTargetDomain();
    if(extractionCancelled) return;
    
    const statusDiv = createStatusDiv();
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (!query) {
      updateStatus(statusDiv, '❌ No search query found in URL');
      setTimeout(() => statusDiv.remove(), 2000);
      return;
    }
    
    updateStatus(statusDiv, `🔍 Analyzing rankings for: "${query}"`, 5);
    extractRankings(document, 1);
    
    let targetRank = allResults.find(r => r.isTarget)?.rank;
    if (targetRank) {
      updateStatus(statusDiv, `📍 Target domain found at position #${targetRank} on page 1`, 15);
    } else {
      updateStatus(statusDiv, `📄 Page 1 complete: ${allResults.length} results`, 15);
    }
    
    for (let page = 2; page <= CONFIG.MAX_PAGES; page++) {
      if (extractionCancelled || allResults.length >= CONFIG.MAX_RESULTS) break;
      
      const start = (page - 1) * 10;
      const nextPageUrl = `${window.location.origin}/search?q=${encodeURIComponent(query)}&start=${start}`;
      const progress = 15 + ((page - 1) * 8);
      
      try {
        const response = await fetch(nextPageUrl, {
          headers: {
            'User-Agent': CONFIG.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        
        if (!response.ok) continue;
        
        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const extracted = extractRankings(doc, page);
        
        const newTargetRank = allResults.find(r => r.isTarget && r.page === page)?.rank;
        if (newTargetRank) {
          updateStatus(statusDiv, `🎯 Target domain found at position #${newTargetRank} on page ${page}!`, progress + 8);
        } else {
          updateStatus(statusDiv, `📄 Page ${page} complete: +${extracted.length} results (Total: ${allResults.length})`, progress + 8);
        }
        
        await delay(getRandomDelay());
      } catch (error) {
        console.error(`Error on page ${page}:`, error);
        await delay(2000);
      }
    }
    
    const targetResults = allResults.filter(r => r.isTarget);
    if (targetResults.length > 0) {
      const ranks = targetResults.map(r => `#${r.rank}`).join(', ');
      updateStatus(statusDiv, `✅ Complete! Target domain found at: ${ranks}`, 100);
    } else if (targetDomain) {
      updateStatus(statusDiv, `❌ Target domain "${targetDomain}" not found in top ${allResults.length} results`, 100);
    } else {
      updateStatus(statusDiv, `✅ Complete! Found ${allResults.length} rankings`, 100);
    }
    
    setTimeout(() => {
      statusDiv.remove();
      if(!extractionCancelled) showRankingReport();
    }, 2000);
  }

  function showRankingReport() {
      const content = GDI.createElement('div', {
          styles: { display: 'flex', flexDirection: 'column', height: '80vh' }
      });
      
      const targetResults = allResults.filter(r => r.isTarget);
      const uniqueDomains = new Set(allResults.map(r => r.domain)).size;
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');

      // Header Section
      const headerSection = GDI.createElement('div', {
          styles: { marginBottom: '20px' }
      });

      const titleRow = GDI.createElement('div', {
          styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
          children: [
              GDI.createElement('div', {
                  children: [
                      GDI.createElement('div', { styles: { fontSize: '14px', color: GDI.ThemeEngine.token('colors.textSecondary'), marginBottom: '4px' }, text: 'Search Query:' }),
                      GDI.createElement('div', { styles: { fontSize: '18px', fontWeight: 'bold', color: GDI.ThemeEngine.token('colors.primary') }, text: query || 'No search query' })
                  ]
              }),
              GDI.createElement('div', {
                  styles: { display: 'flex', gap: '8px' },
                  children: [
                      GDI.createBadge(`${allResults.length} Results`, 'primary'),
                      GDI.createBadge(`${uniqueDomains} Domains`, 'info')
                  ]
              })
          ]
      });
      headerSection.appendChild(titleRow);

      if (targetDomain) {
          const targetStatus = GDI.createElement('div', {
              styles: {
                  padding: '16px',
                  borderRadius: GDI.DESIGN_TOKENS.radii.md,
                  background: targetResults.length > 0 ? GDI.ThemeEngine.token('colors.successLight') : GDI.ThemeEngine.token('colors.errorLight'),
                  border: `1px solid ${targetResults.length > 0 ? GDI.ThemeEngine.token('colors.success') : GDI.ThemeEngine.token('colors.error')}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }
          });

          if (targetResults.length > 0) {
              const ranksHTML = targetResults.map(r => `<span style="background: ${GDI.ThemeEngine.token('colors.success')}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; margin-left: 8px;">#${r.rank}</span>`).join('');
              targetStatus.innerHTML = `
                  <div>
                      <strong style="color: ${GDI.ThemeEngine.token('colors.success')}; font-size: 16px;">🎯 ${targetDomain}</strong>
                      <span style="color: ${GDI.ThemeEngine.token('colors.textSecondary')}; margin-left: 10px;">found at position${targetResults.length > 1 ? 's' : ''}:</span>
                  </div>
                  <div>${ranksHTML}</div>
              `;
          } else {
              targetStatus.innerHTML = `
                  <div style="color: ${GDI.ThemeEngine.token('colors.error')}; font-weight: bold;">
                      ❌ ${targetDomain} not found in top ${allResults.length} results
                  </div>
              `;
          }
          headerSection.appendChild(targetStatus);
      }
      content.appendChild(headerSection);

      // Search & Actions
      const actionRow = GDI.createElement('div', {
          styles: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }
      });
      
      const { wrapper: searchWrap, input: searchInput } = GDI.createInputField({
          id: 'rankings-search',
          placeholder: '🔍 Filter domains or titles...',
      });
      searchWrap.style.flex = '1';
      searchWrap.style.marginBottom = '0';
      actionRow.appendChild(searchWrap);

      const btnGroup = GDI.createElement('div', { styles: { display: 'flex', gap: '8px', alignItems: 'center' }});
      
      btnGroup.appendChild(GDI.createButton('📥 CSV', () => {
          const csv = 'Rank,Domain,URL,Title,Page,Target\n' + allResults.map(r => 
              `${r.rank},"${r.domain}","${r.url}","${r.title.replace(/"/g, '""')}",${r.page},${r.isTarget ? 'Yes' : 'No'}`
          ).join('\n');
          downloadFile(csv, 'keyword-rankings.csv', 'text/csv');
          GDI.showNotification('CSV exported!', 'success');
      }, { variant: 'success', size: 'sm', fullWidth: false }));

      btnGroup.appendChild(GDI.createButton('📄 TXT', () => {
          const txt = allResults.map(r => `${r.isTarget ? '🎯 ' : ''}#${r.rank} ${r.domain}`).join('\n');
          downloadFile(txt, 'ranked-domains.txt', 'text/plain');
          GDI.showNotification('Rank list exported!', 'success');
      }, { variant: 'secondary', size: 'sm', fullWidth: false }));

      btnGroup.appendChild(GDI.createButton('📋 Copy Domains', () => {
          const domains = [...new Set(allResults.map(r => r.domain))].join('\n');
          GDI.copyToClipboard(domains).then(() => GDI.showNotification(`Copied ${domains.split('\n').length} domains!`, 'success'));
      }, { variant: 'primary', size: 'sm', fullWidth: false }));

      actionRow.appendChild(btnGroup);
      content.appendChild(actionRow);

      // Results Table
      const tableContainer = GDI.createElement('div', {
          styles: { flex: '1', overflowY: 'auto', border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`, borderRadius: GDI.DESIGN_TOKENS.radii.md }
      });

      function renderResults(filterText = '') {
          tableContainer.innerHTML = '';
          const filter = filterText.toLowerCase();
          
          allResults.forEach(result => {
              if (filter && !result.domain.includes(filter) && !result.title.toLowerCase().includes(filter)) return;
              
              const row = GDI.createElement('div', {
                  styles: {
                      padding: '12px 16px',
                      borderBottom: `1px solid ${GDI.ThemeEngine.token('colors.borderLight')}`,
                      display: 'flex', gap: '16px',
                      background: result.isTarget ? GDI.ThemeEngine.token('colors.successLight') : GDI.ThemeEngine.token('colors.surface')
                  }
              });

              const rankBadge = GDI.createElement('div', {
                  styles: {
                      background: result.isTarget ? GDI.ThemeEngine.token('colors.success') : GDI.ThemeEngine.token('colors.primary'),
                      color: 'white', padding: '4px 12px', borderRadius: '20px',
                      fontSize: '14px', fontWeight: 'bold', minWidth: '45px', textAlign: 'center', height: 'fit-content'
                  },
                  text: `#${result.rank}`
              });

              const infoCol = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' }});
              
              infoCol.appendChild(GDI.createElement('div', {
                  styles: { fontWeight: 'bold', color: result.isTarget ? GDI.ThemeEngine.token('colors.success') : GDI.ThemeEngine.token('colors.primary'), fontSize: '16px', marginBottom: '4px' },
                  text: result.domain
              }));

              infoCol.appendChild(GDI.createElement('div', {
                  styles: { fontSize: '12px', color: GDI.ThemeEngine.token('colors.textSecondary'), marginBottom: '4px' },
                  text: `Page ${result.page}`
              }));

              infoCol.appendChild(GDI.createElement('div', {
                  styles: { color: GDI.ThemeEngine.token('colors.textPrimary'), fontSize: '13px', marginBottom: '4px' },
                  text: result.title
              }));

              infoCol.appendChild(GDI.createElement('div', {
                  styles: { color: GDI.ThemeEngine.token('colors.textMuted'), fontSize: '11px', wordBreak: 'break-all' },
                  text: result.url
              }));

              row.appendChild(rankBadge);
              row.appendChild(infoCol);
              tableContainer.appendChild(row);
          });
      }

      renderResults();
      searchInput.addEventListener('input', (e) => renderResults(e.target.value));

      content.appendChild(tableContainer);

      GDI.createModal('📈 Keyword Ranking Report', content, { width: '1000px', maxWidth: '95vw' });
  }
  
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  extractionCancelled = false;
  extractRankingsFromPages();
}




// ==================== TOOL: IMAGE OCR EXTRACTOR (PRO) ====================

function toolImageOCR(contextInfo = {}) {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '👁️ Image OCR Extractor Pro',
    'Extract text from images with AI, featuring auto-enhancement and drag & drop.',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));

  // --- 1. Settings Bar ---
  const settingsRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap' }
  });

  const langSelect = GDI.createSelect({
    label: 'Language',
    options: [
      { value: 'eng', label: 'English' },
      { value: 'spa', label: 'Spanish' },
      { value: 'fre', label: 'French' },
      { value: 'ger', label: 'German' },
      { value: 'ita', label: 'Italian' }
    ],
    defaultValue: 'eng'
  });
  langSelect.wrapper.style.flex = '1';
  langSelect.wrapper.style.marginBottom = '0';

  const enhanceToggle = GDI.createToggle({
    label: 'Enhance Image (B&W Contrast)',
    checked: true
  });
  enhanceToggle.wrapper.style.marginBottom = '8px';

  settingsRow.appendChild(langSelect.wrapper);
  settingsRow.appendChild(enhanceToggle.wrapper);
  content.appendChild(GDI.createSection('⚙️ OCR Settings', [settingsRow]));

  // --- 2. Upload & Paste Area ---
  const uploadArea = GDI.createElement('div', {
    styles: { 
      background: GDI.ThemeEngine.token('colors.surfaceSecondary'), 
      padding: '24px', 
      borderRadius: GDI.DESIGN_TOKENS.radii.lg, 
      border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      marginBottom: '20px',
      position: 'relative'
    }
  });
  
  const dropZone = GDI.createElement('div', {
    attrs: { tabindex: '0' },
    styles: { 
      border: `2px dashed ${GDI.ThemeEngine.token('colors.primary')}`, 
      borderRadius: GDI.DESIGN_TOKENS.radii.md, 
      padding: '40px 20px', 
      textAlign: 'center', 
      cursor: 'pointer', 
      transition: 'all 0.3s',
      background: `${GDI.ThemeEngine.token('colors.primary')}08`,
      outline: 'none'
    },
    html: `
      <div style="font-size: 36px; margin-bottom: 12px; pointer-events: none;">📸</div>
      <div style="color:${GDI.ThemeEngine.token('colors.textPrimary')}; font-weight: 700; font-size: 15px; pointer-events: none;">Drag & Drop, Paste (Ctrl+V), or Click to upload</div>
      <div style="font-size: 12px; color: ${GDI.ThemeEngine.token('colors.textMuted')}; margin-top: 8px; pointer-events: none;">Supports JPG, PNG, WebP</div>
    `
  });
  
  const fileInput = GDI.createElement('input', { attrs: { type: 'file', accept: 'image/*' }, styles: { display: 'none' } });
  
  const previewWrap = GDI.createElement('div', { styles: { marginTop: '20px', display: 'none', textAlign: 'center', position: 'relative' } });
  const previewImg = GDI.createElement('img', { styles: { maxWidth: '100%', maxHeight: '250px', borderRadius: GDI.DESIGN_TOKENS.radii.md, border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`, boxShadow: GDI.DESIGN_TOKENS.shadows.md } });
  
  const clearImgBtn = GDI.createButton('✕', () => resetUI(), { variant: 'danger', size: 'sm', fullWidth: false });
  clearImgBtn.style.position = 'absolute';
  clearImgBtn.style.top = '-10px';
  clearImgBtn.style.right = '-10px';
  clearImgBtn.style.borderRadius = '50%';
  clearImgBtn.style.width = '30px';
  clearImgBtn.style.height = '30px';
  clearImgBtn.style.padding = '0';
  clearImgBtn.title = "Clear Image";

  previewWrap.appendChild(previewImg);
  previewWrap.appendChild(clearImgBtn);
  
  uploadArea.appendChild(dropZone);
  uploadArea.appendChild(fileInput);
  uploadArea.appendChild(previewWrap);
  content.appendChild(uploadArea);
// >>> ADD THIS NEW CAPTURE BUTTON <<<
  const captureBtn = GDI.createButton('📸 Auto-Capture Current Page', () => {
    if (isProcessing) return;
    
    resultsArea.style.display = 'block';
    statusDisplay.textContent = '📸 Capturing visible screen...';
    statusDisplay.style.background = GDI.ThemeEngine.token('colors.infoLight');
    statusDisplay.style.color = GDI.ThemeEngine.token('colors.info');
    
    // Call your existing background.js capture function
    chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
      if (chrome.runtime.lastError || !response || !response.dataUrl) {
        GDI.showNotification('Failed to capture screen.', 'error');
        statusDisplay.textContent = '❌ Capture failed.';
        return;
      }
      
      // Feed the automatic screenshot directly into the OCR processor
      processImage(response.dataUrl);
    });
  }, { variant: 'primary', size: 'lg' });
  
  captureBtn.style.marginBottom = '20px';
  content.appendChild(captureBtn);
  // --- 3. Results Area ---
  const resultsArea = GDI.createElement('div', { styles: { display: 'none' } });
  
  const statusDisplay = GDI.createElement('div', {
    styles: {
      padding: '12px', background: GDI.ThemeEngine.token('colors.infoLight'),
      color: GDI.ThemeEngine.token('colors.info'), borderRadius: GDI.DESIGN_TOKENS.radii.md,
      marginBottom: '16px', fontWeight: 'bold', textAlign: 'center', fontSize: '13px'
    }
  });

  const { wrapper: textWrapper, textarea: resultTextarea } = GDI.createTextarea({
    label: 'Extracted Text',
    id: 'ocr-result',
    rows: 8
  });
  
  // Toolbar for extracted text
  const actionToolbar = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' } });
  
  actionToolbar.appendChild(GDI.createButton('📋 Copy', () => {
    GDI.copyToClipboard(resultTextarea.value).then(() => GDI.showNotification('Text copied!', 'success'));
  }, { variant: 'primary', fullWidth: false }));

  actionToolbar.appendChild(GDI.createButton('🧹 Clean Line Breaks', () => {
    // Replaces multiple newlines with a single space, fixing broken OCR paragraphs
    const cleaned = resultTextarea.value.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    resultTextarea.value = cleaned;
    GDI.showNotification('Text formatted!', 'info');
  }, { variant: 'secondary', fullWidth: false }));

  resultsArea.appendChild(statusDisplay);
  resultsArea.appendChild(textWrapper);
  resultsArea.appendChild(actionToolbar);
  content.appendChild(resultsArea);

  // --- 4. Logic: Image Processing & API ---
  let isProcessing = false;

  const resetUI = () => {
    previewWrap.style.display = 'none';
    resultsArea.style.display = 'none';
    dropZone.style.display = 'block';
    resultTextarea.value = '';
    fileInput.value = '';
  };

  const processImage = async (imageSrc) => {
    if (isProcessing) return;
    isProcessing = true;
    
    dropZone.style.display = 'none';
    previewImg.src = imageSrc;
    previewWrap.style.display = 'block';
    resultsArea.style.display = 'block';
    
    statusDisplay.textContent = '☁️ Optimizing & Enhancing image...';
    statusDisplay.style.background = GDI.ThemeEngine.token('colors.warningLight');
    statusDisplay.style.color = GDI.ThemeEngine.token('colors.warning');
    resultTextarea.value = '';

    try {
      const compressedImage = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = GDI.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1500; 
          
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; } 
            else { width = Math.round((width * maxDim) / height); height = maxDim; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Enhancement Engine: Convert to High-Contrast Grayscale if toggled
          if (enhanceToggle.getValue()) {
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
              // Threshold binarization to make text pop against background
              const threshold = brightness > 128 ? 255 : 0; 
              data[i] = data[i + 1] = data[i + 2] = threshold;
            }
            ctx.putImageData(imgData, 0, 0);
          }

          resolve(canvas.toDataURL('image/jpeg', 0.9)); 
        };
        img.src = imageSrc;
      });

      // Update preview to show the enhanced version to the user
      previewImg.src = compressedImage;

      statusDisplay.textContent = '☁️ Extracting text via Secure Background Worker...';

      chrome.runtime.sendMessage(
        { 
          action: 'performOCR', 
          base64Image: compressedImage, 
          language: langSelect.select.value 
        }, 
        (response) => {
          if (chrome.runtime.lastError) throw new Error(chrome.runtime.lastError.message);
          if (!response || !response.success) throw new Error(response?.error || 'Unknown extension error');
          
          const data = response.data;
          if (data.IsErroredOnProcessing) throw new Error(data.ErrorMessage?.[0] || 'API Processing Error');

          const text = data.ParsedResults?.[0]?.ParsedText || '';
          resultTextarea.value = text.trim();
          
          if (text.trim()) {
            statusDisplay.textContent = '✅ Extraction Complete!';
            statusDisplay.style.background = GDI.ThemeEngine.token('colors.successLight');
            statusDisplay.style.color = GDI.ThemeEngine.token('colors.success');
          } else {
            statusDisplay.textContent = '⚠️ No readable text found in this image.';
          }
          isProcessing = false;
        }
      );

    } catch (error) {
      console.error('OCR Error:', error);
      statusDisplay.textContent = '❌ Error processing image. Please try again.';
      statusDisplay.style.background = GDI.ThemeEngine.token('colors.errorLight');
      statusDisplay.style.color = GDI.ThemeEngine.token('colors.error');
      isProcessing = false;
    }
  };

  // --- 5. Event Listeners ---
  
  // Click to upload
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => processImage(e.target.result);
      reader.readAsDataURL(file);
    }
  });

  // Paste (Ctrl+V)
  uploadArea.addEventListener('paste', (e) => {
    e.preventDefault();
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => processImage(event.target.result);
        reader.readAsDataURL(blob);
        return;
      }
    }
    GDI.showNotification('No image found in clipboard!', 'warning');
  });

  // Real Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = GDI.ThemeEngine.token('colors.primaryDark');
    dropZone.style.background = `${GDI.ThemeEngine.token('colors.primary')}20`;
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = GDI.ThemeEngine.token('colors.primary');
    dropZone.style.background = `${GDI.ThemeEngine.token('colors.primary')}08`;
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = GDI.ThemeEngine.token('colors.primary');
    dropZone.style.background = `${GDI.ThemeEngine.token('colors.primary')}08`;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => processImage(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        GDI.showNotification('Please drop an image file.', 'error');
      }
    }
  });

  setTimeout(() => dropZone.focus(), 100);

  GDI.createModal('Image OCR Extractor Pro', content, { width: '650px' });
  
  if (contextInfo.srcUrl) {
    setTimeout(() => {
        processImage(contextInfo.srcUrl);
    }, 200);
  }
}

    Object.assign(window.SEOTools, {
      advancedSEOCompare, 
      advancedImageToolkit, 
      visualizeSiteStructure, 
      scrapeGoogleMaps, 
      keywordRankTracker, 
      toolImageOCR
    });
})();
