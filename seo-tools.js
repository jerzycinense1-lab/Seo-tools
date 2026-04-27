/**
 * SEO Tools Pro - Core Tool Functions v4.0
 * 
 * All SEO analysis, generation, and extraction tools.
 * Uses unified GDI design system for consistent UI/UX.
 * 
 * 📦 Dependencies: utils.js (must be loaded first)
 */

// ==================== NAMESPACE & HELPERS ====================

/**
 * SEO Tools Pro - Core Tool Functions v4.0
 */

if (typeof window.SEOTools === 'undefined') {
  (function() {
    'use strict';
    
    const GDI = window.GDI || {};
    const { 
      DESIGN_TOKENS: DT, 
      createElement, $, $$, escapeHtml, cleanText, debounce, formatFileSize,
      hashString, //
      copyToClipboard, showNotification, createModal,
      createInputField, createTextarea, createButton, createBadge,
      createProgressBar, createScoreRing, createStatCard, createDataTable
    } = GDI;

    window.SEOTools = {};

// ==================== COMMON PATTERNS ====================

/**
 * Creates a standard tool header with gradient background.
 * @param {string} title - Tool title
 * @param {string} subtitle - Tool subtitle
 * @param {string} [gradient] - Custom gradient
 * @returns {HTMLElement}
 */
function createToolHeader(title, subtitle, gradient = DT.colors.primaryGradient) {
  return createElement('div', {
    styles: {
      background: gradient,
      color: '#FFFFFF',
      padding: '24px',
      borderRadius: DT.radii.xl,
      marginBottom: '24px',
      boxShadow: `0 8px 24px ${DT.colors.primary}30`,
    },
    children: [
      createElement('h3', {
        styles: { margin: '0 0 8px', fontSize: DT.typography.sizes.xl, fontWeight: DT.typography.weights.bold },
        text: title,
      }),
      createElement('p', {
        styles: { margin: '0', opacity: '0.9', fontSize: DT.typography.sizes.base },
        text: subtitle,
      }),
    ],
  });
}

/**
 * Creates a section card for grouping content.
 * @param {string} title - Section title
 * @param {HTMLElement|HTMLElement[]} content - Content elements
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
function createSection(title, content, options = {}) {
  const { padding = '20px', marginBottom = '16px' } = options;
  
  const section = createElement('div', {
    styles: {
      background: DT.colors.surface,
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.xl,
      padding: padding,
      marginBottom: marginBottom,
      boxShadow: DT.shadows.xs,
    },
  });
  
  if (title) {
    const heading = createElement('h4', {
      styles: {
        margin: '0 0 14px',
        fontSize: DT.typography.sizes.md,
        fontWeight: DT.typography.weights.bold,
        color: DT.colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      },
      text: title,
    });
    section.appendChild(heading);
  }
  
  const contentArray = Array.isArray(content) ? content : [content];
  contentArray.forEach(child => section.appendChild(child));
  
  return section;
}

/**
 * Creates a stat grid.
 * @param {Array} stats - [{ label, value, color?, icon? }]
 * @returns {HTMLElement}
 */
function createStatGrid(stats = []) {
  return createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    },
    children: stats.map(stat => createStatCard({
      label: stat.label,
      value: stat.value,
      icon: stat.icon || '📊',
      color: stat.color || DT.colors.primary,
    })),
  });
}

// ==================== TOOL: COPY URL / DOMAIN ====================

/**
 * Copies the current page URL to clipboard.
 */
function toolCopyUrl() {
  const url = window.location.href;
  copyToClipboard(url).then(success => {
    showNotification(success ? '✅ URL copied to clipboard!' : '❌ Failed to copy URL', 
      success ? 'success' : 'error');
  });
}

/**
 * Copies the current domain to clipboard.
 */
function toolCopyDomain() {
  const domain = window.location.hostname.replace(/^www\./, '');
  copyToClipboard(domain).then(success => {
    showNotification(success ? `✅ Domain copied: ${domain}` : '❌ Failed to copy domain',
      success ? 'success' : 'error');
  });
}

// ==================== TOOL: SCROLL TO BOTTOM ====================

function toolScrollToBottom() {
  // Get the maximum scroll height between the body and the HTML document
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );

  window.scrollTo({ 
    top: scrollHeight, 
    left: 0, 
    behavior: 'smooth' 
  });
  
  showNotification('⬇️ Scrolled to bottom', 'success');
}

// ==================== TOOL: URL SLUG GENERATOR ====================

function toolUrlSlugGenerator() {
  const content = createElement('div', { styles: { padding: '0' } });
  
  // Header
  content.appendChild(createToolHeader(
    '🔗 URL Slug Generator',
    'Convert text into a clean, SEO-friendly URL slug with live preview'
  ));
  
  // Input field
  const { wrapper: inputWrapper, input: slugInput } = createInputField({
    label: '📝 Enter Text',
    id: 'slug-input',
    placeholder: 'Enter your blog post title or text here... ✍️',
    required: false,
    type: 'text',
    defaultValue: document.title || '',
  });
  
  // Character count
  const charCount = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: DT.colors.textMuted,
      textAlign: 'right',
      marginTop: '4px',
    },
    text: '0 / 200 characters',
  });
  inputWrapper.appendChild(charCount);
  
  // Options
  const optionsGrid = createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    },
  });
  
  const options = [
    { id: 'remove-stopwords', label: 'Remove stop words', checked: true },
    { id: 'allow-numbers', label: 'Allow numbers', checked: false },
    { id: 'limit-length', label: 'Limit to 60 chars', checked: true },
  ];
  
  const optionStates = {};
  
  options.forEach(opt => {
    const label = createElement('label', {
      styles: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: DT.typography.sizes.base,
        fontWeight: DT.typography.weights.medium,
        color: DT.colors.textSecondary,
        cursor: 'pointer',
      },
    });
    
    const checkbox = createElement('input', {
      attrs: { type: 'checkbox', id: opt.id },
    });
    checkbox.checked = opt.checked;
    optionStates[opt.id] = opt.checked;
    
    checkbox.addEventListener('change', () => {
      optionStates[opt.id] = checkbox.checked;
      updateSlug();
    });
    
    const text = createElement('span', { text: opt.label });
    
    label.appendChild(checkbox);
    label.appendChild(text);
    optionsGrid.appendChild(label);
  });
  
  // Output field
  const { wrapper: outputWrapper, input: slugOutput } = createInputField({
    label: '🎯 Generated Slug',
    id: 'slug-output',
    placeholder: 'your-slug-will-appear-here',
    type: 'text',
  });
  
  // Preview URL
  const previewBox = createElement('div', {
    styles: {
      background: DT.colors.surfaceSecondary,
      border: `1px dashed ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
      padding: '14px',
      marginBottom: '16px',
      fontFamily: DT.typography.fontMono,
      fontSize: DT.typography.sizes.base,
    },
  });
  
  const previewPrefix = createElement('span', {
    styles: { color: DT.colors.textMuted },
    text: 'https://example.com/blog/',
  });
  
  const previewSlug = createElement('span', {
    styles: { color: DT.colors.primary, fontWeight: DT.typography.weights.bold },
    text: '',
  });
  
  previewBox.appendChild(previewPrefix);
  previewBox.appendChild(previewSlug);
  
  // Buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  const copyBtn = createButton('📋 Copy Slug', () => {
    const slug = slugOutput.value;
    if (!slug) {
      showNotification('Nothing to copy! Generate a slug first.', 'warning');
      return;
    }
    copyToClipboard(slug).then(() => showNotification('✅ Slug copied!', 'success'));
  }, { variant: 'success', fullWidth: true });
  
  buttonRow.appendChild(copyBtn);
  
  // Stop words list
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'is', 'am', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could'
  ]);
  
  // Slug generation logic
  function generateSlug(text) {
    let slug = text.trim().toLowerCase();
    
    // Remove special characters
    slug = slug.replace(/[^a-z0-9\s-]/g, '');
    
    // Split into words
    let words = slug.split(/\s+/);
    
    // Remove stop words if enabled
    if (optionStates['remove-stopwords']) {
      words = words.filter(word => !stopWords.has(word) && word.length > 0);
    }
    
    // Remove numbers if not allowed
    if (!optionStates['allow-numbers']) {
      words = words.filter(word => !/\d/.test(word));
    }
    
    // Join with hyphens
    slug = words.join('-');
    
    // Clean up hyphens
    slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    // Limit length
    if (optionStates['limit-length']) {
      slug = slug.substring(0, 60).replace(/-$/, '');
    }
    
    return slug;
  }
  
  function updateSlug() {
    const text = slugInput.value;
    const slug = generateSlug(text);
    
    slugOutput.value = slug;
    previewSlug.textContent = slug || 'your-slug-here';
    charCount.textContent = `${text.length} / 200 characters`;
    
    // Color coding
    if (text.length > 180) charCount.style.color = DT.colors.warning;
    if (text.length >= 200) charCount.style.color = DT.colors.error;
    if (text.length <= 180) charCount.style.color = DT.colors.textMuted;
  }
  
  slugInput.addEventListener('input', updateSlug);
  
  // Assemble
  const section = createSection('', [
    inputWrapper,
    optionsGrid,
    outputWrapper,
    previewBox,
    buttonRow,
  ]);
  
  content.appendChild(section);
  
  // Initial update
  updateSlug();
  
  // Show modal
  const { close } = createModal('URL Slug Generator', content, { width: '580px' });
  
  // Focus input
  setTimeout(() => slugInput.focus(), 150);
}

// ==================== TOOL: WHATSAPP LINK GENERATOR ====================

function toolWhatsappLinkGenerator() {
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '💬 WhatsApp Link Generator',
    'Create a direct chat link for any phone number',
    'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
  ));
  
  // Get selected text if any
  const selection = window.getSelection()?.toString().trim() || '';
  const cleanNumber = selection.replace(/\D/g, '');
  
  // Phone input
  const { wrapper: phoneWrapper, input: phoneInput } = createInputField({
    label: '📱 Phone Number (with country code)',
    id: 'wa-phone',
    placeholder: 'e.g., 14155552671',
    type: 'tel',
    defaultValue: cleanNumber,
  });
  
  // Preview box
  const previewBox = createElement('div', {
    styles: {
      background: '#F0FDF4',
      border: '1px solid #BBF7D0',
      borderRadius: DT.radii.lg,
      padding: '16px',
      marginBottom: '16px',
      display: 'none',
    },
  });
  
  const previewLabel = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      fontWeight: DT.typography.weights.bold,
      color: '#166534',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
    },
    text: 'Your WhatsApp Link:',
  });
  
  const previewLink = createElement('a', {
    attrs: { target: '_blank', rel: 'noopener noreferrer' },
    styles: {
      fontSize: DT.typography.sizes.base,
      color: '#128C7E',
      wordBreak: 'break-all',
      textDecoration: 'none',
      fontWeight: DT.typography.weights.semibold,
    },
  });
  
  previewBox.appendChild(previewLabel);
  previewBox.appendChild(previewLink);
  
  // Buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  const openBtn = createButton('🚀 Open Chat', () => {
    const num = phoneInput.value.replace(/\D/g, '');
    if (validatePhone(num)) {
      const url = `https://api.whatsapp.com/send?phone=${num}`;
      window.open(url, '_blank');
    }
  }, { variant: 'success', fullWidth: true });
  
  const copyBtn = createButton('📋 Copy Link', () => {
    const num = phoneInput.value.replace(/\D/g, '');
    if (validatePhone(num)) {
      const url = `https://api.whatsapp.com/send?phone=${num}`;
      copyToClipboard(url).then(() => showNotification('✅ Link copied!', 'success'));
    }
  }, { variant: 'primary', fullWidth: true });
  
  buttonRow.appendChild(openBtn);
  buttonRow.appendChild(copyBtn);
  
  // Validation
  function validatePhone(num) {
    if (num.length < 5 || num.length > 15) {
      showNotification('Enter a valid phone number (5–15 digits).', 'warning');
      return false;
    }
    return true;
  }
  
  function updatePreview() {
    const num = phoneInput.value.replace(/\D/g, '');
    if (num.length >= 5) {
      const url = `https://api.whatsapp.com/send?phone=${num}`;
      previewLink.href = url;
      previewLink.textContent = url;
      previewBox.style.display = 'block';
    } else {
      previewBox.style.display = 'none';
    }
  }
  
  phoneInput.addEventListener('input', updatePreview);
  updatePreview();
  
  // Assemble
  const section = createSection('', [phoneWrapper, previewBox, buttonRow]);
  content.appendChild(section);
  
  const { close } = createModal('WhatsApp Link Generator', content, { width: '520px' });
  setTimeout(() => phoneInput.focus(), 150);
}

// ==================== TOOL: EMAIL EXTRACTOR ====================

function toolEmailExtractor() {
  const content = createElement('div');
  
  // Extract emails
  const emailRegex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}/g;
  
  const pageText = document.body.innerText || '';
  const emails = new Set();
  
  // Method 1: Regex on visible text
  (pageText.match(emailRegex) || []).forEach(e => emails.add(e.toLowerCase()));
  
  // Method 2: Scan mailto: links
  $$('a[href^="mailto:"]').forEach(a => {
    const email = decodeURIComponent(a.getAttribute('href'))
      .replace(/^mailto:/i, '')
      .split('?')[0]
      .trim()
      .toLowerCase();
    if (emailRegex.test(email)) emails.add(email);
  });
  
  // Method 3: Input fields
  $$('input[type="email"], input[name*="email"]').forEach(input => {
    const value = input.value || input.placeholder || '';
    (value.match(emailRegex) || []).forEach(e => emails.add(e.toLowerCase()));
  });
  
  // Filter invalid
  const invalidDomains = new Set(['example.com', 'test.com', 'domain.com']);
  const filteredEmails = [...emails]
    .filter(email => {
      const domain = email.split('@')[1];
      return !invalidDomains.has(domain) && email.length < 254;
    })
    .sort();
  
  // Header
  content.appendChild(createToolHeader(
    '📧 Email Extractor',
    `Found ${filteredEmails.length} unique email address${filteredEmails.length !== 1 ? 'es' : ''}`,
    DT.colors.infoGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Found', value: filteredEmails.length, icon: '📊', color: DT.colors.info },
    { label: 'From Text', value: (pageText.match(emailRegex) || []).length, icon: '📝' },
    { label: 'From mailto:', value: $$('a[href^="mailto:"]').length, icon: '🔗' },
  ]));
  
  if (filteredEmails.length === 0) {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: {
          textAlign: 'center',
          padding: '40px',
          color: DT.colors.textMuted,
          fontSize: DT.typography.sizes.md,
        },
        text: 'No emails found on this page.',
      }),
    ]));
  } else {
    // Email list
    const emailList = createElement('div', {
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '350px',
        overflowY: 'auto',
      },
    });
    
    filteredEmails.forEach((email, index) => {
      const row = createElement('div', {
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: index % 2 === 0 ? DT.colors.surface : DT.colors.surfaceSecondary,
          border: `1px solid ${DT.colors.border}`,
          borderRadius: DT.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.borderColor = DT.colors.primary;
        row.style.transform = 'translateX(4px)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.borderColor = DT.colors.border;
        row.style.transform = 'translateX(0)';
      });
      
      const emailInfo = createElement('div', {
        styles: { display: 'flex', alignItems: 'center', gap: '12px', flex: '1' },
      });
      
      const indexBadge = createElement('span', {
        styles: {
          width: '28px',
          height: '28px',
          borderRadius: DT.radii.full,
          background: DT.colors.primary,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: DT.typography.sizes.sm,
          fontWeight: DT.typography.weights.bold,
          flexShrink: '0',
        },
        text: String(index + 1),
      });
      
      const emailText = createElement('span', {
        styles: {
          fontFamily: DT.typography.fontMono,
          fontSize: DT.typography.sizes.base,
          fontWeight: DT.typography.weights.medium,
          wordBreak: 'break-all',
        },
        text: email,
      });
      
      emailInfo.appendChild(indexBadge);
      emailInfo.appendChild(emailText);
      
      const copyBtn = createButton('Copy', () => {
        copyToClipboard(email).then(() => showNotification('✅ Email copied!', 'success'));
      }, { variant: 'secondary', fullWidth: false, size: 'sm' });
      
      row.appendChild(emailInfo);
      row.appendChild(copyBtn);
      
      // Click row to copy
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        copyToClipboard(email).then(() => showNotification('✅ Email copied!', 'success'));
      });
      
      emailList.appendChild(row);
    });
    
    content.appendChild(createSection('📋 Extracted Emails', [emailList]));
    
    // Action buttons
    const buttonRow = createElement('div', {
      styles: { display: 'flex', gap: '10px', marginTop: '16px' },
    });
    
    buttonRow.appendChild(createButton('📋 Copy All Emails', () => {
      copyToClipboard(filteredEmails.join('\n')).then(() => 
        showNotification(`✅ ${filteredEmails.length} emails copied!`, 'success')
      );
    }, { variant: 'primary' }));
    
    buttonRow.appendChild(createButton('📊 Export CSV', () => {
      const csv = 'Email\n' + filteredEmails.map(e => `"${e}"`).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emails-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('✅ CSV exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(buttonRow);
  }
  
  const { close } = createModal('Email Extractor', content, { width: '650px' });
}

// ==================== TOOL: DO-FOLLOW HIGHLIGHTER ====================

function toolHighlightDoFollow() {
  // Check if already highlighted
  const existing = $$('.gdi-dofollow-highlight, .gdi-nofollow-highlight');
  if (existing.length > 0) {
    toolRemoveHighlights();
    return;
  }
  
  // Inject styles
  if (!$('#gdi-highlight-styles')) {
    const style = createElement('style', { attrs: { id: 'gdi-highlight-styles' } });
    style.textContent = `
      .gdi-dofollow-highlight {
        background: #DCFCE7 !important;
        border: 2px solid #22C55E !important;
        border-radius: 6px !important;
        padding: 2px 6px !important;
        transition: all 0.2s !important;
      }
      .gdi-dofollow-highlight:hover {
        background: #BBF7D0 !important;
        transform: scale(1.02) !important;
      }
      .gdi-nofollow-highlight {
        background: #FEE2E2 !important;
        border: 2px solid #EF4444 !important;
        border-radius: 6px !important;
        padding: 2px 6px !important;
        transition: all 0.2s !important;
      }
      .gdi-nofollow-highlight:hover {
        background: #FECACA !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  const links = $$('a[href]');
  let doFollowCount = 0;
  let noFollowCount = 0;
  
  links.forEach(link => {
    const rel = (link.getAttribute('rel') || '').toLowerCase();
    const isNofollow = rel.includes('nofollow');
    
    if (isNofollow) {
      link.classList.add('gdi-nofollow-highlight');
      noFollowCount++;
    } else {
      link.classList.add('gdi-dofollow-highlight');
      doFollowCount++;
    }
    
    // Store original styles for removal
    if (!link.dataset.gdiOriginalStyles) {
      link.dataset.gdiOriginalStyles = JSON.stringify({
        background: link.style.background,
        border: link.style.border,
        borderRadius: link.style.borderRadius,
        padding: link.style.padding,
      });
    }
  });
  
  showNotification(
    `✅ Highlighted ${doFollowCount} do-follow & ${noFollowCount} no-follow links`,
    'success'
  );
}

function toolRemoveHighlights() {
  const highlighted = $$('.gdi-dofollow-highlight, .gdi-nofollow-highlight');
  
  highlighted.forEach(link => {
    link.classList.remove('gdi-dofollow-highlight', 'gdi-nofollow-highlight');
    
    // Restore original styles
    if (link.dataset.gdiOriginalStyles) {
      try {
        const original = JSON.parse(link.dataset.gdiOriginalStyles);
        Object.entries(original).forEach(([key, value]) => {
          link.style[key] = value;
        });
        delete link.dataset.gdiOriginalStyles;
      } catch (e) {}
    }
  });
  
  // Remove style element
  const styleEl = $('#gdi-highlight-styles');
  if (styleEl) styleEl.remove();
  
  showNotification('✅ All highlights removed', 'success');
}

// ==================== TOOL: HEADING STRUCTURE ANALYZER ====================

function toolAnalyzeHeadings() {
  const content = createElement('div');
  
  // Collect headings
  const headingData = {};
  for (let i = 1; i <= 6; i++) {
    headingData[`h${i}`] = Array.from(document.querySelectorAll(`h${i}`)).map(h => ({
      text: cleanText(h.textContent).substring(0, 100),
      element: h,
    }));
  }
  
  const totalHeadings = Object.values(headingData).flat().length;
  
  // Find issues
  const issues = [];
  
  // H1 check
  const h1Count = headingData.h1.length;
  if (h1Count === 0) issues.push({ severity: 'error', message: 'No H1 tag found. Every page should have exactly one H1.' });
  else if (h1Count > 1) issues.push({ severity: 'warning', message: `Multiple H1 tags found (${h1Count}). Only one H1 is recommended.` });
  
  // Skip level check
  let lastLevel = 0;
  for (let i = 1; i <= 6; i++) {
    if (headingData[`h${i}`].length > 0) {
      if (lastLevel > 0 && i > lastLevel + 1) {
        issues.push({ severity: 'warning', message: `Skipped heading level: H${lastLevel} → H${i}` });
      }
      lastLevel = i;
    }
  }
  
  // Calculate score
  const h1Score = h1Count === 1 ? 100 : (h1Count === 0 ? 0 : 50);
  const structureScore = issues.filter(i => i.severity === 'warning').length === 0 ? 100 : 
    Math.max(0, 100 - issues.filter(i => i.severity === 'warning').length * 25);
  const overallScore = Math.round((h1Score + structureScore) / 2);
  
  // Header
  content.appendChild(createToolHeader(
    '📑 Heading Structure Analysis',
    `${totalHeadings} headings found across 6 levels`
  ));
  
  // Score ring
  const scoreRow = createElement('div', {
    styles: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
  });
  scoreRow.appendChild(createScoreRing(overallScore, 100));
  content.appendChild(scoreRow);
  
  // Stats grid
  const stats = [];
  for (let i = 1; i <= 6; i++) {
    if (headingData[`h${i}`].length > 0) {
      stats.push({
        label: `H${i} Tags`,
        value: headingData[`h${i}`].length,
        icon: i === 1 ? '📌' : '📎',
        color: i === 1 ? DT.colors.primary : DT.colors.textSecondary,
      });
    }
  }
  content.appendChild(createStatGrid(stats));
  
  // Issues
  if (issues.length > 0) {
    const issuesSection = createSection('⚠️ Issues Found', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue => {
          const isError = issue.severity === 'error';
          return createElement('div', {
            styles: {
              padding: '10px 14px',
              background: isError ? DT.colors.errorLight : DT.colors.warningLight,
              borderLeft: `4px solid ${isError ? DT.colors.error : DT.colors.warning}`,
              borderRadius: DT.radii.md,
              fontSize: DT.typography.sizes.base,
              color: isError ? '#991B1B' : '#92400E',
              fontWeight: DT.typography.weights.medium,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
            text: `${isError ? '❌' : '⚠️'} ${issue.message}`,
          });
        }),
      }),
    ]);
    content.appendChild(issuesSection);
  }
  
  // Heading list
  const headingList = createElement('div', {
    styles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
  });
  
  Object.entries(headingData).forEach(([level, headings]) => {
    headings.forEach((h, idx) => {
      const lvl = parseInt(level[1]);
      headingList.appendChild(createElement('div', {
        styles: {
          padding: '8px 12px',
          background: lvl === 1 ? DT.colors.infoLight : DT.colors.surfaceSecondary,
          borderLeft: `3px solid ${lvl === 1 ? DT.colors.info : DT.colors.border}`,
          borderRadius: DT.radii.sm,
          fontSize: DT.typography.sizes.base,
          marginLeft: `${(lvl - 1) * 16}px`,
        },
        children: [
          createElement('span', {
            styles: {
              fontWeight: DT.typography.weights.bold,
              color: lvl === 1 ? DT.colors.info : DT.colors.textMuted,
              marginRight: '8px',
            },
            text: level.toUpperCase(),
          }),
          createElement('span', {
            styles: { color: DT.colors.textPrimary },
            text: h.text || '(empty)',
          }),
        ],
      }));
    });
  });
  
  content.appendChild(createSection('📋 Heading Hierarchy', [headingList]));
  
  const { close } = createModal('Heading Structure Analysis', content, { width: '650px' });
}

// ==================== TOOL: META TAGS ANALYZER ====================

function toolAnalyzeMeta() {
  const content = createElement('div');
  
  // Collect meta data
  const metaData = {
    title: document.title || '',
    titleLength: document.title?.length || 0,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    descLength: document.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || 'Not set',
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
    charset: document.characterSet || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
  };
  
  // Scoring
  const scores = {};
  
  if (metaData.title) {
    scores.title = metaData.titleLength >= 30 && metaData.titleLength <= 65 ? 100 : 50;
  } else {
    scores.title = 0;
  }
  
  if (metaData.description) {
    scores.description = metaData.descLength >= 120 && metaData.descLength <= 160 ? 100 : 50;
  } else {
    scores.description = 0;
  }
  
  scores.og = (metaData.ogTitle && metaData.ogImage) ? 100 : 
    (metaData.ogTitle || metaData.ogImage) ? 50 : 0;
    
  scores.twitter = metaData.twitterCard ? 100 : 0;
  scores.viewport = metaData.viewport ? 100 : 0;
  scores.canonical = metaData.canonical ? 100 : 0;
  
  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  );
  
  // Header
  content.appendChild(createToolHeader(
    '🏷️ Meta Tags Analysis',
    `${Object.values(scores).filter(s => s === 100).length} of ${Object.keys(scores).length} checks passed`,
    DT.colors.primaryGradient
  ));
  
  // Score
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(overallScore, 90));
  content.appendChild(scoreRow);
  
  // Score bars
  const scoreBars = createElement('div', { styles: { marginBottom: '20px' } });
  
  [
    { label: 'Title Tag', score: scores.title, detail: `${metaData.titleLength} chars${!scores.title ? ' (Missing)' : ''}` },
    { label: 'Meta Description', score: scores.description, detail: `${metaData.descLength} chars${!scores.description ? ' (Missing)' : ''}` },
    { label: 'Open Graph', score: scores.og },
    { label: 'Twitter Card', score: scores.twitter },
    { label: 'Viewport', score: scores.viewport },
    { label: 'Canonical', score: scores.canonical },
  ].forEach(item => {
    const color = item.score === 100 ? DT.colors.success : 
                  item.score === 50 ? DT.colors.warning : DT.colors.error;
    
    const bar = createElement('div', { styles: { marginBottom: '10px' } });
    
    const barHeader = createElement('div', {
      styles: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: DT.typography.sizes.base,
      },
    });
    
    barHeader.appendChild(createElement('span', {
      styles: { fontWeight: DT.typography.weights.medium, color: DT.colors.textPrimary },
      text: item.label,
    }));
    
    const scoreBadge = createElement('span', {
      styles: { fontWeight: DT.typography.weights.bold, color },
      text: `${item.score}%`,
    });
    
    if (item.detail) {
      scoreBadge.appendChild(createElement('span', {
        styles: { color: DT.colors.textMuted, marginLeft: '6px', fontWeight: DT.typography.weights.normal },
        text: `(${item.detail})`,
      }));
    }
    
    barHeader.appendChild(scoreBadge);
    bar.appendChild(barHeader);
    
    const { container: progressBar } = createProgressBar(item.score, color, 6);
    bar.appendChild(progressBar);
    
    scoreBars.appendChild(bar);
  });
  
  content.appendChild(createSection('📊 Score Breakdown', [scoreBars]));
  
  // Meta details
  const detailsGrid = createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '12px',
    },
  });
  
  [
    { label: 'Title', value: metaData.title || 'Missing', status: metaData.title ? 'good' : 'error' },
    { label: 'Meta Description', value: metaData.description || 'Missing', status: metaData.description ? 'good' : 'error' },
    { label: 'Viewport', value: metaData.viewport || 'Missing', status: metaData.viewport ? 'good' : 'error' },
    { label: 'Robots', value: metaData.robots, status: 'neutral' },
    { label: 'Charset', value: metaData.charset, status: 'good' },
    { label: 'OG Title', value: metaData.ogTitle || 'Not set', status: metaData.ogTitle ? 'good' : 'warn' },
    { label: 'OG Image', value: metaData.ogImage || 'Not set', status: metaData.ogImage ? 'good' : 'warn' },
    { label: 'Twitter Card', value: metaData.twitterCard || 'Not set', status: metaData.twitterCard ? 'good' : 'warn' },
  ].forEach(item => {
    const colorMap = { good: DT.colors.success, warn: DT.colors.warning, error: DT.colors.error, neutral: DT.colors.textSecondary };
    
    detailsGrid.appendChild(createElement('div', {
      styles: {
        padding: '12px 14px',
        background: DT.colors.surface,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
      },
      children: [
        createElement('div', {
          styles: { fontSize: DT.typography.sizes.xs, color: DT.colors.textMuted, marginBottom: '4px', fontWeight: DT.typography.weights.semibold, textTransform: 'uppercase' },
          text: item.label,
        }),
        createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: item.value === 'Missing' || item.value === 'Not set' ? DT.colors.error : colorMap[item.status],
            fontWeight: DT.typography.weights.medium,
            wordBreak: 'break-word',
          },
          text: typeof item.value === 'string' && item.value.length > 80 ? item.value.substring(0, 77) + '...' : item.value,
        }),
      ],
    }));
  });
  
  content.appendChild(createSection('📋 Meta Tag Details', [detailsGrid]));
  
  const { close } = createModal('Meta Tags Analysis', content, { width: '700px' });
}

// ==================== TOOL: LINK EXTRACTOR & ANALYZER ====================

function toolExtractLinks() {
  const content = createElement('div');
  
  // Collect link data
  const currentDomain = window.location.hostname;
  const links = $$('a[href]');
  const linkData = [];
  
  let internalCount = 0, externalCount = 0, nofollowCount = 0, dofollowCount = 0;
  
  links.forEach((anchor, index) => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('javascript:') || href === '#' || 
        href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    const text = cleanText(anchor.textContent).substring(0, 150) || '[No Anchor Text]';
    const rel = (anchor.getAttribute('rel') || '').toLowerCase();
    const isNofollow = rel.includes('nofollow');
    const isSponsored = rel.includes('sponsored');
    const opensInNewTab = anchor.getAttribute('target') === '_blank';
    
    let fullUrl, isExternal = false;
    try {
      fullUrl = new URL(href, window.location.origin).href;
      isExternal = new URL(fullUrl).hostname !== currentDomain;
    } catch (e) {
      fullUrl = href;
    }
    
    if (isExternal) externalCount++;
    else internalCount++;
    
    if (isNofollow) nofollowCount++;
    else dofollowCount++;
    
    linkData.push({
      index: index + 1,
      url: fullUrl,
      text: text,
      isExternal,
      isNofollow,
      isSponsored,
      opensInNewTab,
      domain: isExternal ? new URL(fullUrl).hostname.replace(/^www\./, '') : currentDomain,
    });
  });
  
  // External domain analysis
  const domainCounts = {};
  linkData.filter(l => l.isExternal).forEach(link => {
    domainCounts[link.domain] = (domainCounts[link.domain] || 0) + 1;
  });
  
  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Header
  content.appendChild(createToolHeader(
    '🔗 Link Extractor & Analyzer',
    `${linkData.length} links found • ${internalCount} internal • ${externalCount} external`
  ));
  
  // Stats grid
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: linkData.length, icon: '🔗', color: DT.colors.primary },
    { label: 'Internal', value: internalCount, icon: '🏠', color: DT.colors.success },
    { label: 'External', value: externalCount, icon: '🌐', color: DT.colors.info },
    { label: 'DoFollow', value: dofollowCount, icon: '✅', color: DT.colors.success },
    { label: 'NoFollow', value: nofollowCount, icon: '🚫', color: DT.colors.warning },
    { label: 'Sponsored', value: linkData.filter(l => l.isSponsored).length, icon: '💰', color: DT.colors.error },
  ]));
  
  // Filter bar
  const filterBar = createElement('div', {
    styles: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
  });
  
  const filterBtns = [
    { label: 'All Links', filter: 'all', active: true },
    { label: 'Internal', filter: 'internal' },
    { label: 'External', filter: 'external' },
    { label: 'DoFollow', filter: 'dofollow' },
    { label: 'NoFollow', filter: 'nofollow' },
  ];
  
  let activeFilter = 'all';
  
  filterBtns.forEach(btn => {
    const filterBtn = createElement('button', {
      styles: {
        padding: '6px 14px',
        border: `1px solid ${btn.active ? DT.colors.primary : DT.colors.border}`,
        borderRadius: DT.radii.full,
        background: btn.active ? DT.colors.primary : DT.colors.surface,
        color: btn.active ? '#FFFFFF' : DT.colors.textSecondary,
        fontSize: DT.typography.sizes.sm,
        fontWeight: DT.typography.weights.semibold,
        cursor: 'pointer',
        transition: `all ${DT.transitions.fast}`,
      },
      text: btn.label,
    });
    
    filterBtn.addEventListener('click', () => {
      activeFilter = btn.filter;
      filterBar.querySelectorAll('button').forEach(b => {
        b.style.background = DT.colors.surface;
        b.style.color = DT.colors.textSecondary;
        b.style.borderColor = DT.colors.border;
      });
      filterBtn.style.background = DT.colors.primary;
      filterBtn.style.color = '#FFFFFF';
      filterBtn.style.borderColor = DT.colors.primary;
      
      filterLinks();
    });
    
    filterBar.appendChild(filterBtn);
  });
  
  content.appendChild(filterBar);
  
  // Link list container
  const linkList = createElement('div', {
    styles: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
    },
  });
  
  function renderLinks(filteredLinks) {
    linkList.innerHTML = '';
    
    filteredLinks.forEach((link, idx) => {
      const row = createElement('div', {
        styles: {
          padding: '12px 16px',
          borderBottom: `1px solid ${DT.colors.borderLight}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          transition: `background ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.background = DT.colors.surfaceSecondary;
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      
      // Type badge
      const typeBadge = createBadge(
        link.isExternal ? 'External' : 'Internal',
        link.isExternal ? 'info' : 'success'
      );
      
      // Follow badge
      const followBadge = createBadge(
        link.isNofollow ? 'NoFollow' : 'DoFollow',
        link.isNofollow ? 'warning' : 'success'
      );
      
      const badges = createElement('div', {
        styles: {
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '80px',
          flexShrink: '0',
        },
      });
      badges.appendChild(typeBadge);
      badges.appendChild(followBadge);
      
      if (link.isSponsored) {
        badges.appendChild(createBadge('Sponsored', 'warning'));
      }
      
      // Link info
      const info = createElement('div', {
        styles: { flex: '1', minWidth: '0' },
      });
      
      const anchorText = createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.base,
          fontWeight: DT.typography.weights.semibold,
          color: DT.colors.textPrimary,
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        text: link.text,
      });
      
      const urlText = createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.sm,
          color: DT.colors.primary,
          fontFamily: DT.typography.fontMono,
          wordBreak: 'break-all',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        text: link.url.length > 70 ? link.url.substring(0, 67) + '...' : link.url,
      });
      
      info.appendChild(anchorText);
      info.appendChild(urlText);
      
      // Copy button
      const copyBtn = createButton('Copy', () => {
        copyToClipboard(link.url).then(() => showNotification('✅ URL copied!', 'success'));
      }, { variant: 'secondary', fullWidth: false, size: 'sm' });
      
      row.appendChild(badges);
      row.appendChild(info);
      row.appendChild(copyBtn);
      
      // Click row to visit
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        window.open(link.url, '_blank');
      });
      
      row.style.cursor = 'pointer';
      
      linkList.appendChild(row);
    });
  }
  
  function filterLinks() {
    let filtered = linkData;
    
    switch (activeFilter) {
      case 'internal':
        filtered = linkData.filter(l => !l.isExternal);
        break;
      case 'external':
        filtered = linkData.filter(l => l.isExternal);
        break;
      case 'dofollow':
        filtered = linkData.filter(l => !l.isNofollow);
        break;
      case 'nofollow':
        filtered = linkData.filter(l => l.isNofollow);
        break;
    }
    
    renderLinks(filtered);
  }
  
  filterLinks();
  
  content.appendChild(linkList);
  
  // Top domains section
  if (topDomains.length > 0) {
    const domainSection = createSection('🌐 Top External Domains', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: topDomains.map(([domain, count], i) => {
          const maxCount = topDomains[0][1];
          const barWidth = (count / maxCount) * 100;
          
          return createElement('div', {
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: DT.colors.surfaceSecondary,
              borderRadius: DT.radii.md,
            },
            children: [
              createElement('span', {
                styles: {
                  width: '24px',
                  height: '24px',
                  borderRadius: DT.radii.full,
                  background: DT.colors.primary,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: DT.typography.sizes.xs,
                  fontWeight: DT.typography.weights.bold,
                  flexShrink: '0',
                },
                text: String(i + 1),
              }),
              createElement('span', {
                styles: {
                  flex: '1',
                  fontSize: DT.typography.sizes.base,
                  fontWeight: DT.typography.weights.medium,
                  color: DT.colors.textPrimary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                text: domain,
              }),
              createElement('div', {
                styles: { flex: '1', maxWidth: '150px' },
                children: [
                  createElement('div', {
                    styles: {
                      height: '6px',
                      background: DT.colors.surfaceTertiary,
                      borderRadius: DT.radii.full,
                      overflow: 'hidden',
                    },
                    children: [
                      createElement('div', {
                        styles: {
                          width: `${barWidth}%`,
                          height: '100%',
                          background: DT.colors.primaryGradient,
                          borderRadius: DT.radii.full,
                          transition: 'width 0.5s ease',
                        },
                      }),
                    ],
                  }),
                ],
              }),
              createElement('span', {
                styles: {
                  fontSize: DT.typography.sizes.sm,
                  fontWeight: DT.typography.weights.bold,
                  color: DT.colors.primary,
                  minWidth: '40px',
                  textAlign: 'right',
                },
                text: `${count}x`,
              }),
            ],
          });
        }),
      }),
    ]);
    
    content.appendChild(domainSection);
  }
  
  // Export button
  const exportBtn = createButton('📊 Export as CSV', () => {
    let csv = 'Index,Type,Follow,Anchor Text,URL\n';
    linkData.forEach(l => {
      csv += `"${l.index}","${l.isExternal ? 'External' : 'Internal'}","${l.isNofollow ? 'NoFollow' : 'DoFollow'}","${l.text.replace(/"/g, '""')}","${l.url}"\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `links-${currentDomain.replace(/\./g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' });
  
  content.appendChild(createElement('div', {
    styles: { marginTop: '16px' },
    children: [exportBtn],
  }));
  
  const { close } = createModal('Link Extractor & Analyzer', content, { width: '800px' });
}

// ==================== TOOL: DOMAIN EXTRACTOR ====================

function toolExtractDomains() {
  const content = createElement('div');
  
  const currentDomain = window.location.hostname.replace(/^www\./, '');
  
  // Exclusion lists
  const excludedDomains = new Set([
    'google.com', 'facebook.com', 'twitter.com', 'instagram.com', 
    'linkedin.com', 'youtube.com', 'pinterest.com', 'reddit.com',
    'amazon.com', 'wikipedia.org', 'github.com'
  ]);
  
  const excludedPatterns = ['cdn', 'static', 'analytics', 'tracking', 'pixel'];
  
  // Collect domains
  const domainMap = new Map();
  
  $$('a[href]').forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      const domain = url.hostname.replace(/^www\./, '').toLowerCase();
      
      if (domain === currentDomain) return;
      if (excludedDomains.has(domain)) return;
      if (excludedPatterns.some(p => domain.includes(p))) return;
      
      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          domain,
          count: 0,
          firstUrl: anchor.href,
          texts: new Set(),
        });
      }
      
      const entry = domainMap.get(domain);
      entry.count++;
      entry.texts.add(cleanText(anchor.textContent).substring(0, 80));
    } catch (e) {}
  });
  
  const sortedDomains = [...domainMap.values()]
    .sort((a, b) => b.count - a.count);
  
  // Header
  content.appendChild(createToolHeader(
    '🌐 External Domain Extractor',
    `${sortedDomains.length} unique domains found • ${sortedDomains.reduce((s, d) => s + d.count, 0)} total references`,
    'linear-gradient(135deg, #E65100 0%, #FF6F00 100%)'
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Unique Domains', value: sortedDomains.length, icon: '🌐', color: '#E65100' },
    { label: 'Total Refs', value: sortedDomains.reduce((s, d) => s + d.count, 0), icon: '🔗' },
    { label: 'Avg Refs/Domain', value: (sortedDomains.reduce((s, d) => s + d.count, 0) / sortedDomains.length || 1).toFixed(1), icon: '📊' },
    { label: 'Top Domain', value: sortedDomains[0]?.count || 0, icon: '🏆' },
  ]));
  
  if (sortedDomains.length === 0) {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: DT.colors.textMuted },
        text: 'No external domains found on this page.',
      }),
    ]));
  } else {
    // Search/filter
    const { wrapper: searchWrapper, input: searchInput } = createInputField({
      label: '🔍 Filter Domains',
      id: 'domain-filter',
      placeholder: 'Filter by domain name...',
      type: 'text',
    });
    searchWrapper.style.marginBottom = '16px';
    
    const domainList = createElement('div', {
      styles: {
        maxHeight: '400px',
        overflowY: 'auto',
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.lg,
      },
    });
    
    function renderDomains(filter) {
      const filtered = filter 
        ? sortedDomains.filter(d => d.domain.includes(filter.toLowerCase()))
        : sortedDomains;
      
      domainList.innerHTML = '';
      
      filtered.forEach((item, i) => {
        const row = createElement('div', {
          styles: {
            padding: '12px 16px',
            borderBottom: `1px solid ${DT.colors.borderLight}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        row.addEventListener('mouseenter', () => {
          row.style.background = DT.colors.surfaceSecondary;
        });
        
        row.addEventListener('mouseleave', () => {
          row.style.background = '';
        });
        
        // Rank
        row.appendChild(createElement('span', {
          styles: {
            width: '28px',
            height: '28px',
            borderRadius: DT.radii.full,
            background: i < 3 ? '#E65100' : DT.colors.surfaceTertiary,
            color: i < 3 ? '#FFFFFF' : DT.colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: DT.typography.sizes.sm,
            fontWeight: DT.typography.weights.bold,
            flexShrink: '0',
          },
          text: String(i + 1),
        }));
        
        // Domain info
        const info = createElement('div', { styles: { flex: '1', minWidth: '0' } });
        
        info.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            fontFamily: DT.typography.fontMono,
            color: DT.colors.textPrimary,
            marginBottom: '4px',
          },
          text: item.domain,
        }));
        
        if (item.texts.size > 0) {
          info.appendChild(createElement('div', {
            styles: {
              fontSize: DT.typography.sizes.xs,
              color: DT.colors.textMuted,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            text: `From: ${[...item.texts].slice(0, 2).join(' • ')}`,
          }));
        }
        
        // Count badge
        const countBadge = createElement('span', {
          styles: {
            padding: '4px 12px',
            borderRadius: DT.radii.full,
            background: '#FFF3E0',
            color: '#E65100',
            fontSize: DT.typography.sizes.sm,
            fontWeight: DT.typography.weights.bold,
            flexShrink: '0',
          },
          text: `${item.count}x`,
        });
        
        // Copy button
        const copyBtn = createButton('Copy', () => {
          copyToClipboard(item.domain).then(() => showNotification('✅ Domain copied!', 'success'));
        }, { variant: 'secondary', fullWidth: false, size: 'sm' });
        
        row.appendChild(info);
        row.appendChild(countBadge);
        row.appendChild(copyBtn);
        
        domainList.appendChild(row);
      });
    }
    
    renderDomains();
    
    searchInput.addEventListener('input', debounce(() => {
      renderDomains(searchInput.value);
    }, 200));
    
    content.appendChild(searchWrapper);
    content.appendChild(domainList);
    
    // Export buttons
    const buttonRow = createElement('div', {
      styles: { display: 'flex', gap: '10px', marginTop: '16px' },
    });
    
    buttonRow.appendChild(createButton('📋 Copy All Domains', () => {
      copyToClipboard(sortedDomains.map(d => d.domain).join('\n')).then(() =>
        showNotification(`✅ ${sortedDomains.length} domains copied!`, 'success')
      );
    }, { variant: 'primary' }));
    
    buttonRow.appendChild(createButton('📊 Export CSV', () => {
      let csv = 'Rank,Domain,References,First URL\n';
      sortedDomains.forEach((d, i) => {
        csv += `"${i + 1}","${d.domain}","${d.count}","${d.firstUrl}"\n`;
      });
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domains-${currentDomain}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('✅ CSV exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(buttonRow);
  }
  
  const { close } = createModal('Domain Extractor', content, { width: '750px' });
}

// ==================== TOOL: SOCIAL MEDIA EXTRACTOR ====================

function toolExtractSocial() {
  const content = createElement('div');
  
  // Social platform database
  const socialPlatforms = {
    'facebook.com': { name: 'Facebook', icon: '📘', color: '#1877F2', category: 'Social' },
    'twitter.com': { name: 'Twitter / X', icon: '🐦', color: '#000000', category: 'Social' },
    'x.com': { name: 'Twitter / X', icon: '🐦', color: '#000000', category: 'Social' },
    'instagram.com': { name: 'Instagram', icon: '📸', color: '#E4405F', category: 'Social' },
    'linkedin.com': { name: 'LinkedIn', icon: '💼', color: '#0A66C2', category: 'Professional' },
    'youtube.com': { name: 'YouTube', icon: '▶️', color: '#FF0000', category: 'Video' },
    'tiktok.com': { name: 'TikTok', icon: '🎵', color: '#000000', category: 'Video' },
    'github.com': { name: 'GitHub', icon: '🐙', color: '#333333', category: 'Dev' },
    'discord.com': { name: 'Discord', icon: '💬', color: '#5865F2', category: 'Chat' },
    'discord.gg': { name: 'Discord', icon: '💬', color: '#5865F2', category: 'Chat' },
    'whatsapp.com': { name: 'WhatsApp', icon: '💚', color: '#25D366', category: 'Chat' },
    't.me': { name: 'Telegram', icon: '✈️', color: '#26A5E4', category: 'Chat' },
    'twitch.tv': { name: 'Twitch', icon: '🎮', color: '#9146FF', category: 'Streaming' },
    'pinterest.com': { name: 'Pinterest', icon: '📌', color: '#BD081C', category: 'Social' },
    'reddit.com': { name: 'Reddit', icon: '🤖', color: '#FF4500', category: 'Community' },
    'medium.com': { name: 'Medium', icon: '✍️', color: '#000000', category: 'Blog' },
  };
  
  // Collect social links
  const socialLinks = new Map();
  
  $$('a[href]').forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      const domain = url.hostname.replace(/^www\./, '').toLowerCase();
      
      // Check direct matches
      for (const [platformDomain, platform] of Object.entries(socialPlatforms)) {
        if (domain === platformDomain || domain.endsWith('.' + platformDomain)) {
          if (!socialLinks.has(anchor.href)) {
            socialLinks.set(anchor.href, {
              ...platform,
              url: anchor.href,
              text: cleanText(anchor.textContent) || platform.name,
            });
          }
        }
      }
    } catch (e) {}
  });
  
  // Also check for social media icons in class names
  const socialIconPatterns = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'];
  
  $$('a[href]').forEach(anchor => {
    const classes = (anchor.className || '').toLowerCase();
    const parentClasses = (anchor.parentElement?.className || '').toLowerCase();
    const allClasses = classes + ' ' + parentClasses;
    
    socialIconPatterns.forEach(pattern => {
      if (allClasses.includes(pattern) && !socialLinks.has(anchor.href)) {
        try {
          const url = new URL(anchor.href);
          if (url.protocol.startsWith('http')) {
            const matchingPlatform = Object.entries(socialPlatforms).find(([domain]) =>
              url.hostname.includes(domain)
            );
            
            if (matchingPlatform) {
              socialLinks.set(anchor.href, {
                ...matchingPlatform[1],
                url: anchor.href,
                text: cleanText(anchor.textContent) || matchingPlatform[1].name,
              });
            }
          }
        } catch (e) {}
      }
    });
  });
  
  const uniqueLinks = [...socialLinks.values()];
  
  // Group by category
  const byCategory = {};
  uniqueLinks.forEach(link => {
    if (!byCategory[link.category]) byCategory[link.category] = [];
    byCategory[link.category].push(link);
  });
  
  // Header
  content.appendChild(createToolHeader(
    '📱 Social Media Extractor',
    `${uniqueLinks.length} social profiles found across ${Object.keys(byCategory).length} categories`,
    'linear-gradient(135deg, #7B1FA2 0%, #E91E63 100%)'
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: uniqueLinks.length, icon: '🔗', color: '#7B1FA2' },
    { label: 'Categories', value: Object.keys(byCategory).length, icon: '📂' },
    { label: 'Platforms', value: new Set(uniqueLinks.map(l => l.name)).size, icon: '🏢' },
  ]));
  
  if (uniqueLinks.length === 0) {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: DT.colors.textMuted },
        text: 'No social media links found on this page.',
      }),
    ]));
  } else {
    // Render by category
    Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).forEach(([category, links]) => {
      const categorySection = createSection(`📁 ${category} (${links.length})`, [
        createElement('div', {
          styles: { display: 'grid', gap: '10px' },
          children: links.map(link => {
            const card = createElement('div', {
              styles: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: DT.colors.surface,
                border: `1px solid ${DT.colors.border}`,
                borderRadius: DT.radii.lg,
                cursor: 'pointer',
                transition: `all ${DT.transitions.fast}`,
              },
              children: [
                // Platform icon
                createElement('div', {
                  styles: {
                    width: '44px',
                    height: '44px',
                    borderRadius: DT.radii.lg,
                    background: link.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: '0',
                  },
                  text: link.icon,
                }),
                // Info
                createElement('div', {
                  styles: { flex: '1', minWidth: '0' },
                  children: [
                    createElement('div', {
                      styles: {
                        fontSize: DT.typography.sizes.md,
                        fontWeight: DT.typography.weights.bold,
                        color: DT.colors.textPrimary,
                        marginBottom: '2px',
                      },
                      text: link.name,
                    }),
                    createElement('div', {
                      styles: {
                        fontSize: DT.typography.sizes.sm,
                        color: DT.colors.primary,
                        fontFamily: DT.typography.fontMono,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                      text: link.url.length > 50 ? link.url.substring(0, 47) + '...' : link.url,
                    }),
                  ],
                }),
                // Copy button
                createButton('Copy', (e) => {
                  e.stopPropagation();
                  copyToClipboard(link.url).then(() => showNotification('✅ Link copied!', 'success'));
                }, { variant: 'secondary', fullWidth: false, size: 'sm' }),
              ],
            });
            
            card.addEventListener('click', () => {
              window.open(link.url, '_blank');
            });
            
            return card;
          }),
        }),
      ]);
      
      content.appendChild(categorySection);
    });
    
    // Copy all button
    content.appendChild(createButton('📋 Copy All Social Links', () => {
      const text = uniqueLinks.map(l => `${l.name}: ${l.url}`).join('\n');
      copyToClipboard(text).then(() => showNotification('✅ All links copied!', 'success'));
    }, { variant: 'primary' }));
  }
  
  const { close } = createModal('Social Media Extractor', content, { width: '700px' });
}

// ==================== TOOL: BLOG PAGE FINDER ====================

function toolFindBlog() {
  const content = createElement('div');
  const baseUrl = window.location.origin;
  
  // Blog path candidates
  const blogPaths = [
    { path: '/blog', weight: 10 },
    { path: '/blogs', weight: 9 },
    { path: '/news', weight: 8 },
    { path: '/articles', weight: 7 },
    { path: '/posts', weight: 6 },
    { path: '/stories', weight: 5 },
    { path: '/journal', weight: 5 },
    { path: '/insights', weight: 4 },
    { path: '/updates', weight: 3 },
  ];
  
  // Blog-related keywords
  const blogKeywords = ['blog', 'article', 'post', 'news', 'story'];
  
  // Search loading state
  content.appendChild(createToolHeader(
    '📰 Blog Page Finder',
    'Searching for blog pages on this site...'
  ));
  
  // Loading indicator
  const loadingSection = createSection('🔍 Searching...', [
    createElement('div', {
      styles: {
        textAlign: 'center',
        padding: '40px',
      },
      children: [
        createElement('div', {
          styles: {
            fontSize: '40px',
            marginBottom: '16px',
            animation: 'gdi-pulse 1.5s infinite',
          },
          text: '🔍',
        }),
        createElement('div', {
          styles: { color: DT.colors.textMuted, fontSize: DT.typography.sizes.md },
          text: 'Scanning common blog paths...',
        }),
      ],
    }),
  ]);
  
  content.appendChild(loadingSection);
  
  // Results container (hidden initially)
  const resultsContainer = createElement('div', { styles: { display: 'none' } });
  const resultsList = createElement('div', {
    styles: { display: 'grid', gap: '12px' },
  });
  
  resultsContainer.appendChild(createSection('📋 Results', [resultsList]));
  content.appendChild(resultsContainer);
  
  const { close } = createModal('Blog Page Finder', content, { width: '600px' });
  
  // Scan for blog links on page
  function scanPageForBlogLinks() {
    const foundLinks = [];
    
    $$('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const text = cleanText(anchor.textContent).toLowerCase();
      
      blogKeywords.forEach(keyword => {
        if (text.includes(keyword) || href.toLowerCase().includes(keyword)) {
          let url = href;
          if (url.startsWith('/')) url = baseUrl + url;
          if (!url.startsWith('http')) url = baseUrl + '/' + url;
          
          if (!foundLinks.find(l => l.url === url)) {
            foundLinks.push({
              url,
              text: cleanText(anchor.textContent) || href,
              keyword,
              source: 'Page Link',
            });
          }
        }
      });
    });
    
    return foundLinks;
  }
  
  // Check URL with timeout
  async function checkUrl(url, timeout = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': navigator.userAgent },
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  }
  
  // Perform search
  async function searchBlogPage() {
    const results = [];
    
    // Check common paths
    const pathResults = await Promise.all(
      blogPaths.map(async ({ path, weight }) => {
        const url = baseUrl + path;
        const ok = await checkUrl(url);
        return ok ? { url, weight, source: 'Common Path' } : null;
      })
    );
    
    results.push(...pathResults.filter(Boolean));
    
    // Scan page links
    const pageLinks = scanPageForBlogLinks();
    const verifiedLinks = await Promise.all(
      pageLinks.slice(0, 5).map(async (link) => {
        const ok = await checkUrl(link.url);
        return ok ? { ...link } : null;
      })
    );
    
    results.push(...verifiedLinks.filter(Boolean));
    
    // Deduplicate and sort
    const uniqueResults = [];
    const seen = new Set();
    
    results.forEach(r => {
      if (!seen.has(r.url)) {
        seen.add(r.url);
        uniqueResults.push({
          ...r,
          score: (r.weight || 0) + (r.source === 'Page Link' ? 5 : 0),
        });
      }
    });
    
    uniqueResults.sort((a, b) => b.score - a.score);
    
    return uniqueResults;
  }
  
  // Update UI with results
  searchBlogPage().then(results => {
    loadingSection.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    if (results.length === 0) {
      resultsList.appendChild(createElement('div', {
        styles: {
          textAlign: 'center',
          padding: '40px',
          color: DT.colors.textMuted,
          fontSize: DT.typography.sizes.md,
        },
        text: 'No blog pages found. Try checking the navigation menu or footer for blog links.',
      }));
    } else {
      results.forEach((result, i) => {
        const card = createElement('div', {
          styles: {
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px',
            background: i === 0 ? DT.colors.successLight : DT.colors.surface,
            border: `2px solid ${i === 0 ? DT.colors.success : DT.colors.border}`,
            borderRadius: DT.radii.lg,
            cursor: 'pointer',
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('click', () => {
          window.location.href = result.url;
        });
        
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-2px)';
          card.style.boxShadow = DT.shadows.md;
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
        });
        
        // Rank badge
        card.appendChild(createElement('span', {
          styles: {
            width: '36px',
            height: '36px',
            borderRadius: DT.radii.full,
            background: i === 0 ? DT.colors.success : DT.colors.primary,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            flexShrink: '0',
          },
          text: i === 0 ? '🏆' : String(i + 1),
        }));
        
        // Info
        const info = createElement('div', { styles: { flex: '1', minWidth: '0' } });
        
        info.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            color: DT.colors.textPrimary,
            marginBottom: '4px',
            fontFamily: DT.typography.fontMono,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          text: result.url,
        }));
        
        info.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.sm,
            color: DT.colors.textMuted,
            display: 'flex',
            gap: '10px',
          },
          children: [
            createElement('span', { text: `Source: ${result.source}` }),
            createElement('span', { text: `Score: ${result.score}` }),
          ],
        }));
        
        // Visit button
        card.appendChild(createButton('Visit →', () => {
          window.location.href = result.url;
        }, { variant: 'primary', fullWidth: false }));
        
        card.appendChild(info);
        
        resultsList.appendChild(card);
      });
      
      // Auto-redirect message
      const bestResult = results[0];
      if (bestResult.score >= 8) {
        const redirectMsg = createElement('div', {
          styles: {
            marginTop: '16px',
            padding: '14px',
            background: DT.colors.infoLight,
            borderRadius: DT.radii.md,
            fontSize: DT.typography.sizes.base,
            color: '#1E40AF',
            textAlign: 'center',
          },
          text: `✅ Best match found! Click to visit: ${bestResult.url}`,
        });
        resultsContainer.appendChild(redirectMsg);
      }
    }
  });
}

// ==================== TOOL: GUEST POST FINDER ====================

function toolFindGuestPost() {
  const content = createElement('div');
  const baseUrl = window.location.origin;
  
  // Guest post path candidates
  const gpPaths = [
    { path: '/write-for-us', weight: 10, category: 'Direct' },
    { path: '/guest-post', weight: 10, category: 'Direct' },
    { path: '/guest-posting', weight: 9, category: 'Direct' },
    { path: '/submit-article', weight: 9, category: 'Submission' },
    { path: '/submit-guest-post', weight: 10, category: 'Submission' },
    { path: '/contribute', weight: 9, category: 'Contribution' },
    { path: '/contributors', weight: 8, category: 'Contribution' },
    { path: '/become-a-contributor', weight: 9, category: 'Contribution' },
    { path: '/become-an-author', weight: 8, category: 'Author' },
    { path: '/author-guidelines', weight: 9, category: 'Guidelines' },
    { path: '/writing-guidelines', weight: 8, category: 'Guidelines' },
    { path: '/submission-guidelines', weight: 9, category: 'Guidelines' },
    { path: '/blog/write-for-us', weight: 8, category: 'Blog' },
    { path: '/blog/guest-post', weight: 8, category: 'Blog' },
  ];
  
  // Guest post keywords
  const gpKeywords = [
    'write for us', 'guest post', 'submit article', 'contribute',
    'guest author', 'become a contributor', 'guest blogging'
  ];
  
  // Negative keywords
  const negativeKeywords = ['no guest posts', 'not accepting', 'submissions closed'];
  
  content.appendChild(createToolHeader(
    '✍️ Guest Post Finder',
    'Searching for guest posting opportunities...',
    'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  ));
  
  // Loading
  const loadingSection = createSection('🔍 Searching...', [
    createElement('div', {
      styles: { textAlign: 'center', padding: '40px' },
      children: [
        createElement('div', {
          styles: { fontSize: '40px', marginBottom: '16px', animation: 'gdi-pulse 1.5s infinite' },
          text: '🔍',
        }),
        createElement('div', {
          styles: { color: DT.colors.textMuted },
          text: 'Scanning for guest post pages on this site...',
        }),
      ],
    }),
  ]);
  
  content.appendChild(loadingSection);
  
  // Results container
  const resultsContainer = createElement('div', { styles: { display: 'none' } });
  const resultsList = createElement('div', {
    styles: { display: 'grid', gap: '12px' },
  });
  
  resultsContainer.appendChild(createSection('📋 Opportunities Found', [resultsList]));
  content.appendChild(resultsContainer);
  
  const { close } = createModal('Guest Post Finder', content, { width: '750px' });
  
  async function checkUrl(url, timeout = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': navigator.userAgent },
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const text = await response.text();
        const bodyText = text.replace(/<[^>]*>/g, ' ').toLowerCase().substring(0, 5000);
        
        // Check negative keywords
        if (negativeKeywords.some(k => bodyText.includes(k))) {
          return { url, confidence: 0, status: 'Closed' };
        }
        
        // Score the page
        let keywordScore = 0;
        const matchedKeywords = [];
        
        gpKeywords.forEach(kw => {
          const count = (bodyText.match(new RegExp(kw, 'gi')) || []).length;
          if (count > 0) {
            keywordScore += count * 2;
            matchedKeywords.push(kw);
          }
        });
        
        const hasForm = text.includes('<form');
        const hasEmail = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        
        let confidence = Math.min(keywordScore * 5, 100);
        if (hasForm) confidence += 15;
        if (hasEmail) confidence += 10;
        
        const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        
        return {
          url,
          confidence: Math.min(confidence, 100),
          matchedKeywords: [...new Set(matchedKeywords)].slice(0, 5),
          hasForm,
          emails: [...new Set(emails)].slice(0, 3),
          status: confidence >= 50 ? 'Likely' : confidence >= 25 ? 'Possible' : 'Unlikely',
        };
      }
      return null;
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }
  
  async function searchGuestPostPages() {
    const results = [];
    
    // Check known paths
    const pathResults = await Promise.all(
      gpPaths.map(async ({ path, weight, category }) => {
        const result = await checkUrl(baseUrl + path);
        return result ? { ...result, weight, category, source: 'Known Path' } : null;
      })
    );
    
    results.push(...pathResults.filter(Boolean));
    
    // Deduplicate
    const uniqueResults = [];
    const seen = new Set();
    
    results.forEach(r => {
      if (!seen.has(r.url)) {
        seen.add(r.url);
        uniqueResults.push(r);
      }
    });
    
    uniqueResults.sort((a, b) => b.confidence - a.confidence);
    
    return uniqueResults;
  }
  
  searchGuestPostPages().then(results => {
    loadingSection.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    if (results.length === 0) {
      resultsList.appendChild(createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: DT.colors.textMuted, fontSize: DT.typography.sizes.md },
        text: 'No guest post opportunities found on this site.',
      }));
    } else {
      results.forEach((result, i) => {
        const confidenceLevel = result.confidence >= 70 ? 'high' : 
                                result.confidence >= 40 ? 'medium' : 'low';
        
        const confidenceColors = {
          high: { border: DT.colors.success, bg: DT.colors.successLight, badge: { bg: DT.colors.success, text: 'HIGH' } },
          medium: { border: DT.colors.warning, bg: DT.colors.warningLight, badge: { bg: DT.colors.warning, text: 'MED' } },
          low: { border: DT.colors.textMuted, bg: DT.colors.surfaceSecondary, badge: { bg: DT.colors.textMuted, text: 'LOW' } },
        };
        
        const style = confidenceColors[confidenceLevel];
        
        const card = createElement('div', {
          styles: {
            padding: '18px',
            background: style.bg,
            border: `2px solid ${style.border}`,
            borderRadius: DT.radii.lg,
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-2px)';
          card.style.boxShadow = DT.shadows.md;
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
        });
        
        // Header row
        const headerRow = createElement('div', {
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px',
          },
        });
        
        headerRow.appendChild(createElement('div', {
          styles: { display: 'flex', alignItems: 'center', gap: '8px' },
          children: [
            createBadge(`#${i + 1}`, 'primary'),
            createBadge(result.confidence >= 70 ? 'HIGH' : result.confidence >= 40 ? 'MED' : 'LOW',
              result.confidence >= 70 ? 'success' : result.confidence >= 40 ? 'warning' : 'info'),
            createBadge(result.status, result.status === 'Likely' ? 'success' : 'warning'),
          ],
        }));
        
        const visitBtn = createButton('Visit Page →', () => {
          window.open(result.url, '_blank');
        }, { variant: 'primary', fullWidth: false });
        
        headerRow.appendChild(visitBtn);
        
        card.appendChild(headerRow);
        
        // URL
        card.appendChild(createElement('div', {
          styles: {
            fontFamily: DT.typography.fontMono,
            fontSize: DT.typography.sizes.base,
            color: DT.colors.primary,
            wordBreak: 'break-all',
            marginBottom: '8px',
          },
          text: result.url,
        }));
        
        // Details
        if (result.matchedKeywords?.length > 0) {
          const kwRow = createElement('div', {
            styles: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' },
          });
          
          result.matchedKeywords.forEach(kw => {
            kwRow.appendChild(createElement('span', {
              styles: {
                padding: '3px 8px',
                background: DT.colors.surfaceTertiary,
                borderRadius: DT.radii.full,
                fontSize: DT.typography.sizes.xs,
                color: DT.colors.textSecondary,
              },
              text: kw,
            }));
          });
          
          card.appendChild(kwRow);
        }
        
        // Meta info
        const metaRow = createElement('div', {
          styles: {
            display: 'flex',
            gap: '12px',
            fontSize: DT.typography.sizes.sm,
            color: DT.colors.textMuted,
            flexWrap: 'wrap',
          },
          children: [
            createElement('span', { text: `🎯 Confidence: ${result.confidence}%` }),
            result.hasForm ? createElement('span', { text: '📝 Has Form' }) : null,
            result.emails?.length > 0 ? createElement('span', { text: '📧 Has Email' }) : null,
            createElement('span', { text: `📂 ${result.category}` }),
          ].filter(Boolean),
        });
        
        card.appendChild(metaRow);
        
        // Email chips
        if (result.emails?.length > 0) {
          const emailRow = createElement('div', {
            styles: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
          });
          
          result.emails.forEach(email => {
            const chip = createElement('span', {
              styles: {
                padding: '4px 10px',
                background: '#DBEAFE',
                color: '#1E40AF',
                borderRadius: DT.radii.full,
                fontSize: DT.typography.sizes.xs,
                fontFamily: DT.typography.fontMono,
                cursor: 'pointer',
              },
              text: email,
            });
            
            chip.addEventListener('click', (e) => {
              e.stopPropagation();
              copyToClipboard(email).then(() => showNotification('✅ Email copied!', 'success'));
            });
            
            emailRow.appendChild(chip);
          });
          
          card.appendChild(emailRow);
        }
        
        resultsList.appendChild(card);
      });
      
      // Export button
      resultsContainer.appendChild(createButton('📊 Export Results as CSV', () => {
        let csv = 'Rank,URL,Confidence,Status,Category,Has Form,Emails\n';
        results.forEach((r, i) => {
          csv += `"${i + 1}","${r.url}","${r.confidence}%","${r.status}","${r.category}","${r.hasForm}","${(r.emails || []).join('; ')}"\n`;
        });
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guest-posts-${window.location.hostname}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('✅ CSV exported!', 'success');
      }, { variant: 'secondary' }));
    }
  });
}

// ==================== TOOL: CONTACT FORM FILLER ====================

function toolFillContactForm(settings = {}) {
  const content = createElement('div');
  
  // Extract site information
  let siteName = '';
  
  // Method 1: Title parsing
  const title = document.title;
  const separators = ['|', '-', '–', '—', '•', '·', ':', '»'];
  for (const sep of separators) {
    const parts = title.split(sep);
    if (parts.length > 1 && parts[0].trim().length > 2) {
      siteName = parts[0].trim();
      break;
    }
  }
  
  // Method 2: Meta tags
  if (!siteName) {
    siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
  }
  
  // Method 3: Domain fallback
  if (!siteName) {
    const domain = window.location.hostname.replace(/^www\./, '').split('.')[0];
    siteName = domain.charAt(0).toUpperCase() + domain.slice(1);
  }
  
  // Analyze site content for personalization
  function analyzeSiteContent() {
    const analysis = {
      contentType: 'general',
      audienceType: 'general',
      recentTopics: [],
    };
    
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => cleanText(h.textContent))
      .filter(h => h.length > 10 && h.length < 200)
      .slice(0, 5);
    
    if (headings.length > 0) {
      analysis.recentTopics = headings;
      
      const allText = headings.join(' ').toLowerCase();
      
      if (allText.match(/tech|software|development|programming|code|digital|ai/)) {
        analysis.contentType = 'technology';
      } else if (allText.match(/business|marketing|startup|entrepreneur|finance/)) {
        analysis.contentType = 'business';
      } else if (allText.match(/health|wellness|fitness|medical|nutrition/)) {
        analysis.contentType = 'health';
      } else if (allText.match(/travel|adventure|destination|tour/)) {
        analysis.contentType = 'travel';
      }
    }
    
    return analysis;
  }
  
  const siteAnalysis = analyzeSiteContent();
  
  // Generate personalized subject
  const subjectTemplates = {
    technology: [
      `Tech Content Contribution for ${siteName}`,
      `Guest Article Proposal: Tech Insights for ${siteName}`,
    ],
    business: [
      `Business Article Contribution to ${siteName}`,
      `Strategic Content Partnership with ${siteName}`,
    ],
    health: [
      `Health & Wellness Article for ${siteName}`,
      `Guest Health Content Proposal for ${siteName}`,
    ],
    travel: [
      `Travel Guest Post for ${siteName}`,
      `Destination Article Proposal for ${siteName}`,
    ],
    general: [
      `Content Contribution Inquiry for ${siteName}`,
      `Guest Post Opportunity at ${siteName}`,
    ],
  };
  
  const templates = subjectTemplates[siteAnalysis.contentType] || subjectTemplates.general;
  const subject = templates[Math.floor(Math.random() * templates.length)];
  
  // Generate personalized message
  const messageTemplates = {
    technology: `I've been following your tech coverage and I'm very interested in contributing a high-quality technical article that would resonate with your audience. I specialize in software development and AI/ML and would love to share unique insights.`,
    business: `I've been impressed by your business content and I'm eager to contribute a guest article with actionable insights. With my experience in digital marketing and business strategy, I can offer valuable perspectives.`,
    health: `Your health content is truly informative, and I'd love to contribute an evidence-based article on a trending wellness topic that your readers would appreciate.`,
    travel: `I've enjoyed your travel content and would love to share destination insights and travel tips that your audience would find valuable and engaging.`,
    general: `I've been exploring your content and I'm interested in contributing a high-quality guest article that provides genuine value to your readers.`,
  };
  
  const message = messageTemplates[siteAnalysis.contentType] || messageTemplates.general;
  
  const fullMessage = `Hi ${siteName} team,

${message}

Do you currently accept editorial contributions or guest posts? I'd love to share some topic ideas that your audience would enjoy.

I'm committed to providing thoroughly researched, original content that maintains your site's editorial standards.

Looking forward to hearing from you,
${settings.userName || 'Your Name'}`;
  
  // Form data
  const formData = {
    name: settings.userName || '',
    email: settings.userEmail || '',
    phone: settings.userPhone || '',
    subject: subject,
    message: fullMessage,
  };
  
  // Smart field detection patterns
  const FIELD_PATTERNS = {
    name: { keywords: ['name', 'full name', 'author', 'your name'], priority: 1, value: formData.name },
    email: { keywords: ['email', 'mail', 'e-mail'], priority: 1, value: formData.email },
    phone: { keywords: ['phone', 'mobile', 'contact', 'cell', 'tel'], priority: 2, value: formData.phone },
    subject: { keywords: ['subject', 'topic', 'regarding', 'title', 'about'], priority: 2, value: formData.subject },
    message: { keywords: ['message', 'comment', 'body', 'query', 'inquiry', 'description'], priority: 1, isTextarea: true, value: formData.message },
  };
  
  function calculateMatchScore(element, fieldConfig) {
    let score = 0;
    const text = (
      (element.name || '') + ' ' +
      (element.id || '') + ' ' +
      (element.placeholder || '') + ' ' +
      (element.getAttribute('aria-label') || '') + ' ' +
      (element.closest('label')?.textContent || '')
    ).toLowerCase();
    
    const elementType = (element.type || element.tagName).toLowerCase();
    
    fieldConfig.keywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10;
    });
    
    if (fieldConfig.isTextarea && element.tagName === 'TEXTAREA') score += 20;
    if (elementType === 'email' && fieldConfig.keywords.includes('email')) score += 25;
    if (elementType === 'tel' && fieldConfig.keywords.includes('phone')) score += 25;
    
    return score;
  }
  
  function setFieldValue(el, val) {
    if (!el) return false;
    
    const currentValue = (el.value || '').trim();
    if (currentValue && currentValue !== el.placeholder) return false;
    
    // Native setter for React/Vue compatibility
    const nativeSetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(el), 'value'
    )?.set;
    
    if (nativeSetter) {
      nativeSetter.call(el, val);
    } else {
      el.value = val;
    }
    
    // Dispatch events for framework compatibility
    ['input', 'change', 'blur'].forEach(eventType => {
      el.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
    
    return true;
  }
  
  // Find and fill form fields
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea');
  const fieldAssignments = new Map();
  let filledCount = 0;
  
  // Score all fields
  inputs.forEach(el => {
    const scores = {};
    Object.entries(FIELD_PATTERNS).forEach(([fieldName, config]) => {
      const score = calculateMatchScore(el, config);
      if (score > 0) scores[fieldName] = score;
    });
    if (Object.keys(scores).length > 0) {
      fieldAssignments.set(el, scores);
    }
  });
  
  // Fill fields by priority and score
  const filledFields = new Set();
  const assignedData = new Set();
  
  fieldAssignments.forEach((scores, el) => {
    if (filledFields.has(el)) return;
    
    const bestMatch = Object.entries(scores)
      .filter(([fieldName]) => !assignedData.has(fieldName))
      .sort((a, b) => b[1] - a[1])[0];
    
    if (bestMatch && bestMatch[1] > 15) {
      const [fieldName] = bestMatch;
      const value = FIELD_PATTERNS[fieldName]?.value;
      
      if (value && setFieldValue(el, value)) {
        filledFields.add(el);
        assignedData.add(fieldName);
        filledCount++;
        
        // Visual feedback
        el.style.transition = 'all 0.3s ease';
        el.style.backgroundColor = '#DCFCE7';
        el.style.borderColor = '#22C55E';
        setTimeout(() => {
          el.style.backgroundColor = '';
          el.style.borderColor = '';
        }, 2000);
      }
    }
  });
  
  const totalFields = inputs.length;
  const fillPercentage = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;
  
  // Build UI
  content.appendChild(createToolHeader(
    '📝 Contact Form Filler',
    `Filled ${filledCount} of ${totalFields} fields (${fillPercentage}%)`,
    DT.colors.successGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Site', value: siteName, icon: '🌐', color: DT.colors.primary },
    { label: 'Fields Filled', value: `${filledCount}/${totalFields}`, icon: '📝', color: DT.colors.success },
    { label: 'Success Rate', value: `${fillPercentage}%`, icon: '📊', color: fillPercentage > 50 ? DT.colors.success : DT.colors.warning },
    { label: 'Content Type', value: siteAnalysis.contentType, icon: '📂', color: DT.colors.info },
  ]));
  
  // Preview section
  const previewSection = createSection('📋 Filled Data Preview', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
      children: Object.entries(formData).map(([key, value]) => {
        const fieldCard = createElement('div', {
          styles: {
            padding: '14px',
            background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.md,
          },
        });
        
        const keyLabel = createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            fontWeight: DT.typography.weights.bold,
            color: DT.colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          },
          text: key === 'subject' ? '📧 Subject' : key === 'message' ? '💬 Message' : `👤 ${key.charAt(0).toUpperCase() + key.slice(1)}`,
        });
        
        const valueText = createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: DT.colors.textPrimary,
            lineHeight: '1.5',
            wordBreak: 'break-word',
            maxHeight: key === 'message' ? '120px' : 'none',
            overflowY: key === 'message' ? 'auto' : 'visible',
            fontFamily: key === 'message' ? 'inherit' : DT.typography.fontMono,
            whiteSpace: key === 'message' ? 'pre-wrap' : 'nowrap',
          },
          text: value || '(not set)',
        });
        
        fieldCard.appendChild(keyLabel);
        fieldCard.appendChild(valueText);
        
        return fieldCard;
      }),
    }),
  ]);
  
  content.appendChild(previewSection);
  
  // Message section
  if (filledCount === 0) {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: {
          padding: '20px',
          background: DT.colors.warningLight,
          borderRadius: DT.radii.md,
          textAlign: 'center',
          color: '#92400E',
          fontSize: DT.typography.sizes.base,
        },
        text: '⚠️ No fillable form fields detected on this page. Make sure you\'re on a page with a contact form.',
      }),
    ]));
  } else {
    content.appendChild(createButton('📤 Find Submit Button', () => {
      const submitBtn = document.querySelector(
        'button[type="submit"], input[type="submit"], button:contains("Submit"), button:contains("Send"), button:contains("Contact")'
      );
      
      if (submitBtn) {
        submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.style.boxShadow = '0 0 0 4px #22C55E';
        submitBtn.style.transition = 'box-shadow 0.3s ease';
        setTimeout(() => {
          submitBtn.style.boxShadow = '';
        }, 3000);
        showNotification('✅ Submit button highlighted in green!', 'success');
      } else {
        showNotification('No submit button found. Please review the form manually.', 'warning');
      }
    }, { variant: 'primary' }));
  }
  
  // Tips
  content.appendChild(createSection('💡 Tips', [
    createElement('div', {
      styles: { fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.6' },
      html: `
        <ul style="margin: 0; padding-left: 20px;">
          <li>Review all filled fields before submitting</li>
          <li>Personalize the message for better results</li>
          <li>Verify your contact details are correct</li>
          <li>Make sure required fields are filled</li>
        </ul>
      `,
    }),
  ]));
  
  const { close } = createModal('Contact Form Filler', content, { width: '600px' });
}

// ==================== TOOL: SEARCH OPERATORS ====================

function toolSearchOperators() {
  const content = createElement('div');
  
  const currentSite = window.location.hostname;
  
  // Search templates
  const searchTemplates = {
    'Guest Posts': [
      { name: 'Write for Us Pages', query: `${currentSite} "write for us" OR "guest post"` },
      { name: 'Guest Post Guidelines', query: `${currentSite} "guest post guidelines"` },
      { name: 'Become a Contributor', query: `${currentSite} "become a contributor"` },
    ],
    'SEO Analysis': [
      { name: 'Indexed Pages', query: `site:${currentSite}` },
      { name: 'PDF Documents', query: `site:${currentSite} filetype:pdf` },
      { name: 'Recent Content', query: `site:${currentSite} after:2024-01-01` },
    ],
    'Content Research': [
      { name: 'Popular Articles', query: `site:${currentSite} "most popular" OR "top 10"` },
      { name: 'How-to Guides', query: `site:${currentSite} "how to" OR guide OR tutorial` },
      { name: 'Case Studies', query: `site:${currentSite} "case study" OR "success story"` },
    ],
    'Link Building': [
      { name: 'Resource Pages', query: `site:${currentSite} "useful links" OR "helpful resources"` },
      { name: 'Roundup Posts', query: `site:${currentSite} "weekly roundup" OR "monthly roundup"` },
      { name: 'Interview Opportunities', query: `site:${currentSite} "interview with" OR "expert roundup"` },
    ],
  };
  
  // Operator reference
  const operatorReference = [
    { operator: 'site:', description: 'Search within a specific site', example: `site:${currentSite} keyword` },
    { operator: 'intitle:', description: 'Search in page titles', example: 'intitle:"keyword phrase"' },
    { operator: 'inurl:', description: 'Search in URLs', example: 'inurl:keyword' },
    { operator: 'filetype:', description: 'Search specific file types', example: 'filetype:pdf keyword' },
    { operator: '"exact phrase"', description: 'Exact match search', example: '"guest post guidelines"' },
    { operator: 'OR', description: 'Either term', example: 'guest OR contributor OR author' },
    { operator: '-exclude', description: 'Exclude terms', example: 'guest post -forum' },
    { operator: '..', description: 'Number range', example: '2020..2024' },
    { operator: 'after:', description: 'After date', example: 'after:2024-01-01' },
    { operator: 'before:', description: 'Before date', example: 'before:2024-12-31' },
  ];
  
  // Header
  content.appendChild(createToolHeader(
    '🔍 Advanced Search Operators',
    `Build powerful search queries for ${currentSite}`,
    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
  ));
  
  // Search builder
  const searchBuilder = createSection('🔨 Search Builder', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
  ]);
  
  // Operator select
  const { wrapper: operatorWrapper, input: operatorSelect } = createInputField({
    label: 'Search Operator',
    id: 'operator-select',
    type: 'text',
    placeholder: 'Select an operator...',
  });
  
  // Replace input with select
  const select = createElement('select', {
    attrs: { id: 'operator-select' },
    styles: {
      width: '100%',
      padding: '12px 16px',
      border: `1.5px solid ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
      fontSize: DT.typography.sizes.md,
      fontFamily: DT.typography.fontFamily,
      outline: 'none',
      background: DT.colors.surface,
      color: DT.colors.textPrimary,
      cursor: 'pointer',
    },
  });
  
  operatorReference.forEach(op => {
    const option = createElement('option', {
      attrs: { value: op.operator },
      text: `${op.operator} - ${op.description}`,
    });
    select.appendChild(option);
  });
  
  operatorWrapper.querySelector('input').replaceWith(select);
  
  // Query input
  const { wrapper: queryWrapper, input: queryInput } = createInputField({
    label: 'Search Query',
    id: 'search-query',
    placeholder: 'e.g., "write for us", guest post guidelines...',
  });
  
  // Preview
  const previewBox = createElement('div', {
    styles: {
      padding: '14px',
      background: DT.colors.surfaceSecondary,
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.md,
      fontFamily: DT.typography.fontMono,
      fontSize: DT.typography.sizes.base,
      color: DT.colors.primary,
      minHeight: '40px',
      wordBreak: 'break-all',
      marginBottom: '16px',
    },
    text: 'Build your query to see preview...',
  });
  
  function updatePreview() {
    const operator = select.value;
    const query = queryInput.value.trim();
    
    if (!query && !operator.startsWith('site:')) {
      previewBox.textContent = 'Enter a search query to see preview...';
      previewBox.style.color = DT.colors.textMuted;
      return;
    }
    
    let fullQuery = '';
    if (operator === 'site:') {
      fullQuery = `${operator}${currentSite} ${query}`;
    } else if (operator.startsWith('site:')) {
      fullQuery = `${operator}${currentSite} ${query}`;
    } else {
      fullQuery = `site:${currentSite} ${operator}${query}`;
    }
    
    previewBox.textContent = fullQuery.trim();
    previewBox.style.color = DT.colors.primary;
  }
  
  select.addEventListener('change', updatePreview);
  queryInput.addEventListener('input', updatePreview);
  
  searchBuilder.querySelector('div').appendChild(operatorWrapper);
  searchBuilder.querySelector('div').appendChild(queryWrapper);
  searchBuilder.querySelector('div').appendChild(previewBox);
  
  // Action buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '10px' },
  });
  
  buttonRow.appendChild(createButton('🔍 Search Google', () => {
    const operator = select.value;
    let query = queryInput.value.trim();
    let fullQuery = '';
    
    if (operator === 'site:') {
      fullQuery = `${operator}${currentSite} ${query}`;
    } else {
      fullQuery = `site:${currentSite} ${operator}${query}`;
    }
    
    window.open(`https://www.google.com/search?q=${encodeURIComponent(fullQuery.trim())}`, '_blank');
  }, { variant: 'primary' }));
  
  buttonRow.appendChild(createButton('🦆 DuckDuckGo', () => {
    const operator = select.value;
    let query = queryInput.value.trim();
    let fullQuery = '';
    
    if (operator === 'site:') {
      fullQuery = `${operator}${currentSite} ${query}`;
    } else {
      fullQuery = `site:${currentSite} ${operator}${query}`;
    }
    
    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(fullQuery.trim())}`, '_blank');
  }, { variant: 'secondary' }));
  
  searchBuilder.querySelector('div').appendChild(buttonRow);
  
  content.appendChild(searchBuilder);
  
  // Quick templates
  const templatesSection = createSection('📋 Quick Templates', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
  ]);
  
  Object.entries(searchTemplates).forEach(([category, templates]) => {
    const catDiv = createElement('div');
    
    catDiv.appendChild(createElement('div', {
      styles: {
        fontSize: DT.typography.sizes.sm,
        fontWeight: DT.typography.weights.bold,
        color: DT.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
      },
      text: category,
    }));
    
    templates.forEach(tmpl => {
      const chip = createElement('div', {
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`,
          borderRadius: DT.radii.md,
          marginBottom: '6px',
          cursor: 'pointer',
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      chip.addEventListener('click', () => {
        // Parse the template query
        queryInput.value = tmpl.query.replace(`site:${currentSite} `, '').replace(`site:${currentSite}`, '');
        select.value = 'site:';
        updatePreview();
      });
      
      chip.addEventListener('mouseenter', () => {
        chip.style.borderColor = DT.colors.primary;
        chip.style.background = DT.colors.infoLight;
      });
      
      chip.addEventListener('mouseleave', () => {
        chip.style.borderColor = DT.colors.border;
        chip.style.background = DT.colors.surface;
      });
      
      chip.appendChild(createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.base,
          fontWeight: DT.typography.weights.medium,
          color: DT.colors.textPrimary,
        },
        text: tmpl.name,
      }));
      
      chip.appendChild(createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.xs,
          color: DT.colors.textMuted,
          fontFamily: DT.typography.fontMono,
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        text: tmpl.query,
      }));
      
      catDiv.appendChild(chip);
    });
    
    templatesSection.querySelector('div').appendChild(catDiv);
  });
  
  content.appendChild(templatesSection);
  
  // Operator reference
  const referenceSection = createSection('📖 Operator Reference', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
      children: operatorReference.map(op => {
        const row = createElement('div', {
          styles: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.md,
            gap: '12px',
            cursor: 'pointer',
          },
        });
        
        row.addEventListener('click', () => {
          select.value = op.operator;
          updatePreview();
          queryInput.focus();
        });
        
        row.appendChild(createElement('span', {
          styles: {
            fontFamily: DT.typography.fontMono,
            fontSize: DT.typography.sizes.base,
            fontWeight: DT.typography.weights.bold,
            color: DT.colors.primary,
            minWidth: '100px',
          },
          text: op.operator,
        }));
        
        row.appendChild(createElement('span', {
          styles: {
            flex: '1',
            fontSize: DT.typography.sizes.base,
            color: DT.colors.textSecondary,
          },
          text: op.description,
        }));
        
        row.appendChild(createElement('span', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: DT.colors.textMuted,
            fontFamily: DT.typography.fontMono,
            fontStyle: 'italic',
          },
          text: op.example,
        }));
        
        return row;
      }),
    }),
  ]);
  
  content.appendChild(referenceSection);
  
  const { close } = createModal('Advanced Search Operators', content, { width: '750px' });
}

// ==================== TOOL: PAYMENT FORM GENERATOR ====================

function toolPaymentForm(type, settings = {}) {
  const content = createElement('div');
  
  const defaults = {
    currency: settings.defaultCurrency || 'USD',
    amount: settings.defaultAmount || '50',
    yourName: settings.userName || 'Your Name',
  };
  
  const titles = {
    'advance': 'Advance Payment Request (PayPal)',
    'paypal': 'Payment Request (PayPal)',
    'gcash': 'Payment Request (GCash)',
  };
  
  const gradients = {
    'advance': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    'paypal': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    'gcash': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  };
  
  content.appendChild(createToolHeader(
    `💰 ${titles[type] || 'Payment Request'}`,
    'Fill in the details to generate your email template',
    gradients[type] || DT.colors.primaryGradient
  ));
  
  // Form fields based on type
  const fields = [];
  
  if (type === 'advance') {
    fields.push(
      { label: 'Client Account', id: 'account', placeholder: 'e.g., ABC Media', required: true },
      { label: 'PayPal Account Name', id: 'paypalName', placeholder: 'name@example.com', required: true },
      { label: 'PayPal Details / Invoice', id: 'paypalDetails', placeholder: 'INV-123', required: true },
      { label: 'Amount', id: 'amount', placeholder: '50', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'Article title...' },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
    );
  } else if (type === 'paypal') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: 'Client Account Name', required: true },
      { label: 'PayPal Account Name', id: 'paypalAccountName', placeholder: 'N/A' },
      { label: 'PayPal Invoice', id: 'paypalInvoice', placeholder: 'N/A' },
      { label: 'Amount', id: 'amount', placeholder: '50', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'Article title...' },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A' },
    );
  } else if (type === 'gcash') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: 'Client Account Name', required: true },
      { label: 'GCash Account Name', id: 'gcashName', placeholder: 'N/A', required: true },
      { label: 'GCash Account Number', id: 'gcashNumber', placeholder: 'N/A', required: true },
      { label: 'Amount', id: 'amount', placeholder: '50', required: true, defaultValue: defaults.amount },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'Article title...' },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A' },
    );
  }
  
  const inputs = {};
  
  // Render form fields
  const formSection = createSection('📝 Payment Details', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
    }),
  ]);
  
  fields.forEach(field => {
    const { wrapper, input } = createInputField({
      label: field.label,
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      defaultValue: field.defaultValue || '',
    });
    
    formSection.querySelector('div').appendChild(wrapper);
    inputs[field.id] = input;
  });
  
  content.appendChild(formSection);
  
  // Preview section
  const previewSection = createSection('👁️ Email Preview', [
    createElement('div', {
      id: 'email-preview',
      styles: {
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        fontFamily: DT.typography.fontFamily,
        fontSize: DT.typography.sizes.base,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        color: DT.colors.textPrimary,
        minHeight: '100px',
      },
      text: 'Fill in the fields above to generate your email...',
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function generateEmail() {
    const getVal = (id) => inputs[id]?.value?.trim() || 'N/A';
    
    let email = '';
    
    if (type === 'advance') {
      email = `Hi Ms. Rose,

This is an Advance PayPal payment request for ${getVal('account')} account. Here are the details:

PayPal Account Name: ${getVal('paypalName')}
PayPal Details/Invoice: ${getVal('paypalDetails')}
Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}

Please let me know if you have any questions or concerns. Thank you.

Regards,
${getVal('yourName')}`;
    } else if (type === 'paypal') {
      email = `Hi Ms. Rose,

This is a PayPal payment request for the ${getVal('clientAccount')} account. Here are the details:

PayPal Account Name: ${getVal('paypalAccountName')}
PayPal Invoice: ${getVal('paypalInvoice')}
Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}
Published Link: ${getVal('publishedLink')}

Please let me know if you have any questions or concerns. Thank you.

Regards,
${getVal('yourName')}`;
    } else if (type === 'gcash') {
      email = `Hi Ms. Rose,

This is a GCash payment request for the ${getVal('clientAccount')}. Here are the details:

GCash Account Name: ${getVal('gcashName')}
GCash Account Number: ${getVal('gcashNumber')}
Amount: ${getVal('amount')}
Currency: Php
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}
Published Link: ${getVal('publishedLink')}

Please let me know if you have any questions or concerns. Thank you.

Regards,
${getVal('yourName')}`;
    }
    
    return email;
  }
  
  function updatePreview() {
    const preview = $('#email-preview');
    if (preview) {
      const email = generateEmail();
      preview.textContent = email;
    }
  }
  
  // Attach input listeners
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  // Initial preview update
  setTimeout(updatePreview, 100);
  
  // Action buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(createButton('📋 Copy Email', () => {
    const email = generateEmail();
    copyToClipboard(email).then(() => showNotification('✅ Email copied to clipboard!', 'success'));
  }, { variant: 'primary' }));
  
  buttonRow.appendChild(createButton('🔄 Reset Fields', () => {
    Object.values(inputs).forEach(input => {
      input.value = input.defaultValue || '';
    });
    updatePreview();
    showNotification('Fields reset!', 'info');
  }, { variant: 'secondary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = createModal(titles[type] || 'Payment Request', content, { width: '600px' });
}

// ==================== TOOL: ARTICLE FORM GENERATOR ====================

function toolArticleForm(type, settings = {}) {
  const content = createElement('div');
  
  const defaults = {
    yourName: settings.userName || 'Your Name',
  };
  
  const title = type === 'full' ? 'Sending Article (Detailed)' : 'Quick Article';
  
  content.appendChild(createToolHeader(
    `📤 ${title}`,
    'Generate professional article submission emails',
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  ));
  
  const inputs = {};
  const fields = [];
  
  if (type === 'full') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
      { label: "Webmaster's Name", id: 'webmaster', placeholder: 'Enter Webmaster Name', required: true },
      { label: 'Website URL', id: 'website', placeholder: 'https://example.com', required: true },
      { label: 'Payment Amount', id: 'amount', placeholder: '$500', required: true },
      { label: 'Article Title (for URL slug)', id: 'articleTitle', placeholder: 'How to Create Bookmarklets', required: true },
    );
  } else {
    fields.push(
      { label: 'Webmaster Name', id: 'webmasterName', placeholder: 'John Doe', required: true },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
    );
  }
  
  // Form fields
  const formSection = createSection('📝 Article Details', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
    }),
  ]);
  
  fields.forEach(field => {
    const { wrapper, input } = createInputField({
      label: field.label,
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      defaultValue: field.defaultValue || '',
    });
    
    formSection.querySelector('div').appendChild(wrapper);
    inputs[field.id] = input;
  });
  
  content.appendChild(formSection);
  
  // Preview
  const previewSection = createSection('👁️ Email Preview', [
    createElement('div', {
      id: 'article-preview',
      styles: {
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: DT.colors.textPrimary,
        minHeight: '100px',
      },
      text: 'Fill in the fields above to generate your email...',
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function generateEmail() {
    const getVal = (id) => inputs[id]?.value?.trim() || '';
    
    if (type === 'full') {
      const slug = getVal('articleTitle').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      
      return `Hi ${getVal('webmaster')},

I hope this email finds you well. I'm writing to confirm that the article is now ready for publication. Attached, you'll find the finalized article for inclusion on your website ${getVal('website')}. As agreed, the payment of ${getVal('amount')} will be processed upon publication.

To ensure a smooth process, kindly adhere to the following guidelines:

• The link included in the article should be a do-follow link.
• Please avoid tagging the post as sponsored or adding any form of compensated disclaimer.
• Please do not include other external links to the article/if you do make sure they are credible websites and marked as no-follow.
• Incorporate the full article topic into the URL slug (${slug}).
• The article and link must remain active for a minimum of 12 months.
• Please publish the article as-is without edits.
• Publication TAT/DATE: 24-48hrs.

For payment, PayPal is the preferred method. Once the article is live, please send a PayPal invoice to my email address and include the live URL for reference.

If you have any questions or need further clarification, feel free to reach out.

Best regards,
${getVal('yourName')}`;
    } else {
      return `Hi ${getVal('webmasterName')},

I hope this email finds you well.

Attached is another article for publication on ${getVal('website')}, under the same terms and agreement as before.

Please let me know if you have any questions or need further adjustments.

Looking forward to your feedback.

Best regards,
${getVal('yourName')}`;
    }
  }
  
  function updatePreview() {
    const preview = $('#article-preview');
    if (preview) {
      preview.textContent = generateEmail();
    }
  }
  
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  setTimeout(updatePreview, 100);
  
  // Buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(createButton('📋 Copy Email', () => {
    copyToClipboard(generateEmail()).then(() => showNotification('✅ Email copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = createModal(title, content, { width: '600px' });
}

// ==================== TOOL: FOLLOW-UP GENERATOR ====================

function toolFollowupForm(type, settings = {}) {
  const content = createElement('div');
  
  const titles = {
    1: 'Article Follow-up (1st)',
    2: '2nd Follow-up',
    'final': 'Final Notice',
  };
  
  const templates = {
    1: `Hi,

Just checking in to see if you've had a chance to review the article I sent for {{website}}. Please let me know if everything looks good or if any adjustments are needed.

Looking forward to your feedback.`,
    2: `Hi,

I wanted to follow up on my previous email regarding the article for {{website}}. I understand you're busy, but I wanted to check if you've had a chance to review it.

Please let me know if you need any additional information.

Thank you for your time and consideration.`,
    'final': `Hi,

This is my final follow-up regarding the article for {{website}}. I understand you may be busy, but I wanted to give you a 12-hour window to respond before I consider this opportunity closed.

If I don't hear back from you within the next 12 hours, I'll assume you're no longer interested.

Please let me know your decision ASAP.`,
  };
  
  content.appendChild(createToolHeader(
    `📞 ${titles[type] || 'Follow-up'}`,
    'Generate follow-up email for article submission',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  ));
  
  // Website input
  const { wrapper, input } = createInputField({
    label: 'Website',
    id: 'followup-website',
    placeholder: 'example.com',
    required: true,
  });
  
  content.appendChild(createSection('📝 Details', [wrapper]));
  
  // Preview
  const previewSection = createSection('👁️ Message Preview', [
    createElement('div', {
      id: 'followup-preview',
      styles: {
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: DT.colors.textPrimary,
        minHeight: '80px',
      },
      text: templates[type].replace('{{website}}', '[Website]'),
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function updatePreview() {
    const website = input.value.trim() || '[Website]';
    $('#followup-preview').textContent = templates[type].replace('{{website}}', website);
  }
  
  input.addEventListener('input', updatePreview);
  
  // Copy button
  content.appendChild(createButton('📋 Copy Message', () => {
    const website = input.value.trim() || '[Website]';
    const message = templates[type].replace('{{website}}', website);
    copyToClipboard(message).then(() => showNotification('✅ Message copied!', 'success'));
  }, { variant: 'primary' }));
  
  const { close } = createModal(titles[type] || 'Follow-up', content, { width: '550px' });
}

// ==================== TOOL: OUTREACH TEMPLATES ====================

function toolOutreachTemplates() {
  const content = createElement('div');
  
  const templates = [
    {
      name: 'Standard Outreach',
      icon: '📧',
      color: DT.colors.primary,
      template: `Hi {{webmaster}} team,

I hope you're doing well! I'm reaching out to see if you're accepting guest post contributions on your website.

If so, I'd be happy to share some topic ideas that would be a great fit for your audience.

Looking forward to your response!`,
    },
    {
      name: 'Professional Outreach',
      icon: '💼',
      color: DT.colors.info,
      template: `Hi {{webmaster}} team,

I'm reaching out to ask if you currently accept guest contributions on your website. I'd be happy to provide original, well-researched content that aligns with your audience's interests.

If guest submissions are welcome, I'd appreciate it if you could share your guidelines or any requirements for consideration.

Looking forward to hearing from you. Thanks!`,
    },
    {
      name: 'Casual Outreach',
      icon: '👋',
      color: DT.colors.success,
      template: `Hey {{webmaster}} team,

Love what you're doing with the site! I was wondering if you accept guest posts? I've got some great ideas I think your readers would really enjoy.

Let me know if you're open to it!`,
    },
  ];
  
  const negoTemplates = [
    {
      name: 'Standard Negotiation',
      icon: '💬',
      color: DT.colors.warning,
      template: `Hi,

Thank you for your response.

Unfortunately, I cannot afford your guest posting fee. I only have $50 available per article. I understand this might be below your standard rate, but I'm hoping you could consider it.

Looking forward to your kind response. Thank you!`,
    },
    {
      name: 'Polite Negotiation',
      icon: '🤝',
      color: DT.colors.primary,
      template: `Hi,

Thank you for getting back to me.

Due to budget constraints, I'm currently able to offer $50 for this contribution. I completely understand if this doesn't work for you, but I wanted to ask before moving on.

I appreciate your consideration either way!`,
    },
  ];
  
  content.appendChild(createToolHeader(
    '📧 Outreach & Negotiation Templates',
    'Pre-written templates for guest post outreach and price negotiation'
  ));
  
  // Prompts for webmaster name
  const { wrapper: promptWrapper, input: webmasterInput } = createInputField({
    label: "Webmaster's Name",
    id: 'webmaster-name',
    placeholder: 'Enter webmaster name (e.g., John)',
    required: false,
    defaultValue: 'Webmaster',
  });
  
  content.appendChild(promptWrapper);
  
  // Outreach templates
  content.appendChild(createSection('📧 Outreach Templates', [
    createElement('div', {
      styles: { display: 'grid', gap: '12px' },
      children: templates.map(tmpl => {
        const card = createElement('div', {
          styles: {
            background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.lg,
            overflow: 'hidden',
          },
        });
        
        // Header
        const header = createElement('div', {
          styles: {
            padding: '12px 16px',
            background: tmpl.color + '15',
            borderBottom: `1px solid ${DT.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.md,
                fontWeight: DT.typography.weights.bold,
                color: DT.colors.textPrimary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              html: `${tmpl.icon} ${escapeHtml(tmpl.name)}`,
            }),
            createButton('Copy', (e) => {
              const name = webmasterInput.value.trim() || 'Webmaster';
              const text = tmpl.template.replace(/\{\{webmaster\}\}/g, name);
              copyToClipboard(text).then(() => showNotification('✅ Template copied!', 'success'));
            }, { variant: 'secondary', fullWidth: false, size: 'sm' }),
          ],
        });
        
        // Content
        const body = createElement('div', {
          styles: {
            padding: '14px 16px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: DT.typography.sizes.base,
            color: DT.colors.textSecondary,
            background: DT.colors.surfaceSecondary,
          },
          text: tmpl.template,
        });
        
        card.appendChild(header);
        card.appendChild(body);
        
        return card;
      }),
    }),
  ]));
  
  // Negotiation templates
  content.appendChild(createSection('💬 Negotiation Templates', [
    createElement('div', {
      styles: { display: 'grid', gap: '12px' },
      children: negoTemplates.map(tmpl => {
        const card = createElement('div', {
          styles: {
            background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.lg,
            overflow: 'hidden',
          },
        });
        
        const header = createElement('div', {
          styles: {
            padding: '12px 16px',
            background: tmpl.color + '15',
            borderBottom: `1px solid ${DT.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.md,
                fontWeight: DT.typography.weights.bold,
                color: DT.colors.textPrimary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              html: `${tmpl.icon} ${escapeHtml(tmpl.name)}`,
            }),
            createButton('Copy', () => {
              copyToClipboard(tmpl.template).then(() => showNotification('✅ Template copied!', 'success'));
            }, { variant: 'secondary', fullWidth: false, size: 'sm' }),
          ],
        });
        
        const body = createElement('div', {
          styles: {
            padding: '14px 16px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: DT.typography.sizes.base,
            color: DT.colors.textSecondary,
            background: DT.colors.surfaceSecondary,
          },
          text: tmpl.template,
        });
        
        card.appendChild(header);
        card.appendChild(body);
        
        return card;
      }),
    }),
  ]));
  
  const { close } = createModal('Outreach & Negotiation Templates', content, { width: '700px' });
}

// ==================== TOOL: CANCEL FORM ====================

function toolCancelForm(settings = {}) {
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '❌ Cancellation Notice',
    'Generate a professional cancellation email',
    DT.colors.errorGradient
  ));
  
  const { wrapper: w1, input: websiteInput } = createInputField({
    label: 'Website',
    id: 'cancel-website',
    placeholder: 'example.com',
    required: true,
  });
  
  const { wrapper: w2, input: reasonInput } = createInputField({
    label: 'Reason (Optional)',
    id: 'cancel-reason',
    placeholder: 'due to lack of response',
    defaultValue: 'due to lack of response',
  });
  
  content.appendChild(createSection('📝 Cancellation Details', [w1, w2]));
  
  // Preview
  const previewSection = createSection('👁️ Email Preview', [
    createElement('div', {
      id: 'cancel-preview',
      styles: {
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: DT.colors.textPrimary,
      },
      text: 'Fill in the fields above...',
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function generateEmail() {
    const website = websiteInput.value.trim() || '[Website]';
    const reason = reasonInput.value.trim() || 'due to lack of response';
    
    return `Hi,

I hope this email finds you well.

I am writing to inform you that I am canceling my submission for ${website} ${reason}.

Despite my previous attempts to follow up, I have not received any feedback regarding the article I sent. After careful consideration, I have decided to withdraw my submission and redirect my efforts elsewhere.

Thank you for your time, and I wish you all the best.

Best regards,`;
  }
  
  function updatePreview() {
    $('#cancel-preview').textContent = generateEmail();
  }
  
  websiteInput.addEventListener('input', updatePreview);
  reasonInput.addEventListener('input', updatePreview);
  setTimeout(updatePreview, 100);
  
  content.appendChild(createButton('📋 Copy Cancellation Email', () => {
    copyToClipboard(generateEmail()).then(() => showNotification('✅ Email copied!', 'success'));
  }, { variant: 'danger' }));
  
  const { close } = createModal('Cancellation Notice', content, { width: '550px' });
}

// ==================== TOOL: GO TO NEXT PAGE ====================

function toolNextPage() {
  const nextSelectors = [
    'a[aria-label="Next page"]',
    'a[aria-label="Next"]',
    'a#pnnext',
    'a.next',
    'a[rel="next"]',
    'a:contains("Next")',
    'button:contains("Next")',
  ];
  
  let nextButton = null;
  for (const selector of nextSelectors) {
    try {
      nextButton = $(selector);
      if (nextButton) break;
    } catch (e) {}
  }
  
  if (nextButton) {
    nextButton.click();
    showNotification('➡️ Navigating to next page...', 'success');
  } else {
    showNotification('❌ No next page button found', 'error');
  }
}

// ==================== TOOL: DECLINED RESPONSE ====================

function toolDeclinedResponse() {
  const template = `Hi,

Thank you for getting back to me. I really appreciate you taking the time to respond.

I completely understand that you're not currently accepting guest posts or link collaborations. I'm reaching out to a few platforms to share valuable content with new audiences, and I was wondering do you happen to know of any other websites or editors who are open to guest contributions?

Any leads or suggestions would be incredibly helpful and greatly appreciated.

Thanks again for your time.`;
  
  copyToClipboard(template).then(() => showNotification('✅ Declined response template copied!', 'success'));
}

// ==================== TOOL: INVOICE FORM ====================

function toolInvoiceForm(settings = {}) {
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '📄 Send Invoice',
    'Generate invoice confirmation email',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  ));
  
  const { wrapper: w1, input: webmasterInput } = createInputField({
    label: "Webmaster's Name",
    id: 'invoice-webmaster',
    placeholder: 'Webmaster Name',
    required: true,
  });
  
  const { wrapper: w2, input: yourNameInput } = createInputField({
    label: 'Your Name',
    id: 'invoice-yourname',
    placeholder: 'Your Name',
    required: true,
    defaultValue: settings.userName || 'Your Name',
  });
  
  content.appendChild(createSection('📝 Details', [w1, w2]));
  
  // Preview
  const previewSection = createSection('👁️ Email Preview', [
    createElement('div', {
      id: 'invoice-preview',
      styles: {
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: DT.colors.textPrimary,
      },
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function generateEmail() {
    const webmaster = webmasterInput.value.trim() || '';
    const yourName = yourNameInput.value.trim() || '';
    
    return `Hi ${webmaster},

I'm pleased to confirm that the payment has now been successfully processed. Please see the attached invoice for your reference.

If there's anything else you need from my end, do let me know.

Looking forward to more collaborations in the future!

Best regards,
${yourName}`;
  }
  
  function updatePreview() {
    $('#invoice-preview').textContent = generateEmail();
  }
  
  webmasterInput.addEventListener('input', updatePreview);
  yourNameInput.addEventListener('input', updatePreview);
  setTimeout(updatePreview, 100);
  
  content.appendChild(createButton('📋 Copy Email', () => {
    copyToClipboard(generateEmail()).then(() => showNotification('✅ Email copied!', 'success'));
  }, { variant: 'success' }));
  
  const { close } = createModal('Send Invoice', content, { width: '550px' });
}

// ==================== TOOL: BULK URL OPENER ====================

function toolBulkUrlOpener() {
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '📂 Bulk URL Opener',
    'Paste a list of URLs to open them all at once',
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
  ));
  
  // URL input
  const { wrapper: textareaWrapper, textarea: urlTextarea } = createTextarea({
    label: 'Enter URLs (one per line)',
    id: 'bulk-urls',
    placeholder: 'example.com\nhttps://google.com\nsearchworks.ph',
    rows: 8,
  });
  
  content.appendChild(createSection('📝 URL List', [textareaWrapper]));
  
  // URL count
  const urlCount = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.sm,
      color: DT.colors.textMuted,
      marginBottom: '16px',
      textAlign: 'center',
    },
    text: '0 URLs entered',
  });
  
  content.appendChild(urlCount);
  
  // Validate URLs
  function isValidUrl(urlString) {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
  
  function processUrls(text) {
    return text.split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0)
      .map(u => {
        // Add protocol if missing
        if (!/^https?:\/\//i.test(u)) {
          u = 'https://' + u;
        }
        return u;
      })
      .filter(isValidUrl);
  }
  
  urlTextarea.addEventListener('input', () => {
    const urls = processUrls(urlTextarea.value);
    urlCount.textContent = `${urls.length} valid URL${urls.length !== 1 ? 's' : ''} entered`;
    urlCount.style.color = urls.length > 15 ? DT.colors.warning : urls.length > 0 ? DT.colors.success : DT.colors.textMuted;
  });
  
  // Warning for many URLs
  const warningBox = createElement('div', {
    styles: {
      padding: '12px',
      background: DT.colors.warningLight,
      borderRadius: DT.radii.md,
      fontSize: DT.typography.sizes.base,
      color: '#92400E',
      display: 'none',
      marginBottom: '16px',
      textAlign: 'center',
    },
    text: '⚠️ Opening more than 10-15 tabs at once may slow down your browser!',
  });
  
  content.appendChild(warningBox);
  
  urlTextarea.addEventListener('input', () => {
    const count = processUrls(urlTextarea.value).length;
    warningBox.style.display = count > 15 ? 'block' : 'none';
  });
  
  // Open button
  content.appendChild(createButton('🚀 Open All URLs', () => {
    const urls = processUrls(urlTextarea.value);
    
    if (urls.length === 0) {
      showNotification('❌ Please enter at least one valid URL', 'error');
      return;
    }
    
    if (urls.length > 15) {
      if (!confirm(`You're about to open ${urls.length} tabs. Continue?`)) return;
    }
    
    urls.forEach((url, i) => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, i * 200);
    });
    
    showNotification(`✅ Opening ${urls.length} URL${urls.length !== 1 ? 's' : ''}...`, 'success');
  }, { variant: 'primary' }));
  
  const { close } = createModal('Bulk URL Opener', content, { width: '600px' });
}

// ==================== TOOL: FULL PAGE CAPTURE ====================

async function toolFullPageCapture() {
  const notification = showNotification('📸 Capturing full page... Please do not scroll!', 'warning', 10000);
  
  // Save original states
  const originalOverflow = document.body.style.overflow;
  const originalScrollY = window.scrollY;
  const fixedElements = [];
  
  // 1. Hide scrollbars temporarily
  const hideScrollbarStyle = document.createElement('style');
  hideScrollbarStyle.textContent = `
    ::-webkit-scrollbar { display: none !important; }
    * { scrollbar-width: none !important; }
    html, body { scroll-behavior: auto !important; }
  `;
  document.head.appendChild(hideScrollbarStyle);

  try {
    document.body.style.overflow = 'hidden';
    
    // 2. Temporarily convert fixed/sticky elements to absolute
    // This prevents headers and chat widgets from repeating in every frame
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        fixedElements.push({ el, origPosition: el.style.position });
        el.style.position = 'absolute';
      }
    });

    const totalHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const scrollSteps = [];
    let y = 0;
    while (y < totalHeight) {
      scrollSteps.push(y);
      y += viewportHeight;
    }
    
    // Adjust the last step to not overshoot the bottom
    if (scrollSteps.length > 1) {
      scrollSteps[scrollSteps.length - 1] = totalHeight - viewportHeight;
    }
    
    const captures = [];
    
    // 3. Capture loop
    for (let i = 0; i < scrollSteps.length; i++) {
      window.scrollTo(0, scrollSteps[i]);
      
      // Wait for lazy-loaded images and smooth scrolling to settle
      await new Promise(r => setTimeout(r, 600)); 
      
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (res) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(res);
        });
      });
      
      if (response && response.dataUrl) {
        captures.push({ dataUrl: response.dataUrl, y: scrollSteps[i] });
      }
    }
    
    // 4. Load all captured images via Promises
    const images = await Promise.all(captures.map(cap => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ img, y: cap.y });
        img.onerror = reject;
        img.src = cap.dataUrl;
      });
    }));

    // 5. Stitch images on Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    
    canvas.width = viewportWidth * ratio;
    canvas.height = totalHeight * ratio;
    
    images.forEach(({ img, y }) => {
      ctx.drawImage(img, 0, y * ratio, viewportWidth * ratio, viewportHeight * ratio);
    });

    // 6. Download
    canvas.toBlob(blob => {
      if (!blob) throw new Error("Canvas is too large to export.");
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (document.title || 'screenshot').replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
      a.download = `full_page_${cleanTitle}.png`;
      a.click();
      URL.revokeObjectURL(url);
      
      if (notification) notification.dismiss();
      showNotification('✅ Full page capture saved!', 'success');
    }, 'image/png');

  } catch (error) {
    console.error("Full Page Capture Error:", error);
    if (notification) notification.dismiss();
    showNotification('❌ Capture failed. The page might be too long.', 'error');
  } finally {
    // 7. Guaranteed Cleanup (Runs even if the code crashes)
    document.body.style.overflow = originalOverflow;
    fixedElements.forEach(({ el, origPosition }) => {
      el.style.position = origPosition;
    });
    hideScrollbarStyle.remove();
    window.scrollTo({ top: originalScrollY, behavior: 'instant' });
  }
}

// ==================== TOOL: PAGE SPEED CHECKER ====================

function toolCheckPageSpeed() {
  const url = encodeURIComponent(window.location.href);
  const pageSpeedUrl = `https://developers.google.com/speed/pagespeed/insights/?url=${url}`;
  window.open(pageSpeedUrl, '_blank');
  showNotification('🚀 Opening PageSpeed Insights...', 'success');
}

// ==================== TOOL: ROBOTS.TXT CHECKER ====================

function toolCheckRobotsTxt() {
  const robotsUrl = `${window.location.origin}/robots.txt`;
  window.open(robotsUrl, '_blank');
  showNotification('🤖 Opening robots.txt...', 'success');
}

// ==================== TOOL: SITEMAP FINDER ====================

function toolCheckSitemap() {
  const domain = window.location.origin;
  const sitemapUrls = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap.php',
    '/sitemap.html',
    '/wp-sitemap.xml',
  ];
  
  showNotification('🗺️ Searching for sitemap...', 'info', 3000);
  
  // Try robots.txt first
  fetch(`${domain}/robots.txt`)
    .then(response => response.text())
    .then(text => {
      const match = text.match(/Sitemap:\s*(.+)/i);
      if (match) {
        window.open(match[1], '_blank');
        showNotification('✅ Sitemap found in robots.txt!', 'success');
        return;
      }
      
      // Try common locations
      Promise.all(
        sitemapUrls.map(url =>
          fetch(domain + url, { method: 'HEAD' })
            .then(r => r.ok ? domain + url : null)
            .catch(() => null)
        )
      ).then(results => {
        const found = results.find(Boolean);
        if (found) {
          window.open(found, '_blank');
          showNotification('✅ Sitemap found!', 'success');
        } else {
          showNotification('❌ No sitemap found', 'error');
        }
      });
    })
    .catch(() => {
      showNotification('❌ Could not check robots.txt', 'error');
    });
}

// ==================== TOOL: KEYWORD DENSITY ANALYZER ====================

function toolAnalyzeKeywordDensity() {
  const content = createElement('div');
  
  // Extract content from main areas
  function extractContent() {
    const contentSelectors = [
      'main', 'article', '[role="main"]', '.content', '.post-content',
      '.article-content', '.entry-content', '#content', '.main-content',
    ];
    
    let textContent = '';
    
    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el) {
        textContent += ' ' + (el.innerText || el.textContent || '');
      }
    }
    
    if (!textContent.trim()) {
      textContent = document.body.innerText || '';
    }
    
    return textContent.toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Stop words
  const stopWords = new Set([
    'the', 'and', 'are', 'for', 'that', 'this', 'with', 'you', 'was',
    'have', 'from', 'but', 'they', 'will', 'your', 'about', 'can',
    'has', 'not', 'what', 'all', 'when', 'been', 'more', 'their',
    'would', 'which', 'there', 'than', 'other', 'some', 'these',
    'into', 'just', 'over', 'also', 'after', 'before', 'between',
    'such', 'only', 'like', 'then', 'most', 'should', 'could',
    'each', 'where', 'much', 'those', 'while', 'during', 'being',
    'through', 'very', 'still', 'here', 'does', 'both', 'same',
    'another', 'well', 'because', 'how', 'our', 'its', 'had', 'were',
  ]);
  
  const text = extractContent();
  const allWords = text.split(/\s+/).filter(w => w.length > 1);
  
  // Filter meaningful words
  const meaningfulWords = allWords.filter(word => {
    if (stopWords.has(word)) return false;
    if (/^\d+$/.test(word)) return false;
    if (word.length < 3) return false;
    return true;
  });
  
  // Single word counts
  const wordCounts = {};
  meaningfulWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
  
  // Two-word phrases
  const bigrams = {};
  for (let i = 0; i < meaningfulWords.length - 1; i++) {
    const bigram = meaningfulWords[i] + ' ' + meaningfulWords[i + 1];
    bigrams[bigram] = (bigrams[bigram] || 0) + 1;
  }
  
  const sortedBigrams = Object.entries(bigrams)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  // Three-word phrases
  const trigrams = {};
  for (let i = 0; i < meaningfulWords.length - 2; i++) {
    const trigram = meaningfulWords[i] + ' ' + meaningfulWords[i + 1] + ' ' + meaningfulWords[i + 2];
    trigrams[trigram] = (trigrams[trigram] || 0) + 1;
  }
  
  const sortedTrigrams = Object.entries(trigrams)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const totalMeaningful = meaningfulWords.length;
  const totalAll = allWords.length;
  
  // Check for keyword stuffing
  const stuffingThreshold = 5; // 5%
  const stuffedKeywords = sortedWords.filter(([_, count]) =>
    (count / totalMeaningful * 100) > stuffingThreshold
  );
  
  // Header
  content.appendChild(createToolHeader(
    '🔤 Keyword Density Analyzer',
    `${totalAll.toLocaleString()} total words • ${totalMeaningful.toLocaleString()} meaningful words`,
    'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Words', value: totalAll.toLocaleString(), icon: '📝', color: DT.colors.primary },
    { label: 'Meaningful', value: totalMeaningful.toLocaleString(), icon: '🎯', color: DT.colors.info },
    { label: 'Unique Words', value: new Set(meaningfulWords).size.toLocaleString(), icon: '🔤' },
    { label: 'Key Phrases', value: sortedBigrams.length, icon: '📊', color: DT.colors.success },
  ]));
  
  // Stuffing warning
  if (stuffedKeywords.length > 0) {
    content.appendChild(createSection('⚠️ Keyword Stuffing Warning', [
      createElement('div', {
        styles: {
          padding: '14px',
          background: DT.colors.warningLight,
          border: `1px solid ${DT.colors.warning}30`,
          borderRadius: DT.radii.md,
          fontSize: DT.typography.sizes.base,
          color: '#92400E',
        },
        html: `Potential keyword stuffing detected for: <strong>${stuffedKeywords.map(w => w[0]).join(', ')}</strong>. Consider reducing frequency.`,
      }),
    ]));
  }
  
  // Tabs
  const tabBar = createElement('div', {
    styles: {
      display: 'flex',
      gap: '4px',
      marginBottom: '16px',
      background: DT.colors.surfaceTertiary,
      padding: '4px',
      borderRadius: DT.radii.md,
    },
  });
  
  const tabs = [
    { id: 'single', label: 'Single Words' },
    { id: 'bigrams', label: '2-Word Phrases' },
    { id: 'trigrams', label: '3-Word Phrases' },
  ];
  
  let activeTab = 'single';
  
  tabs.forEach(tab => {
    const btn = createElement('button', {
      styles: {
        flex: '1',
        padding: '10px 16px',
        border: 'none',
        borderRadius: DT.radii.sm,
        background: tab.id === activeTab ? DT.colors.surface : 'transparent',
        color: tab.id === activeTab ? DT.colors.primary : DT.colors.textSecondary,
        fontSize: DT.typography.sizes.base,
        fontWeight: DT.typography.weights.semibold,
        cursor: 'pointer',
        transition: `all ${DT.transitions.fast}`,
      },
      text: tab.label,
    });
    
    btn.addEventListener('click', () => {
      activeTab = tab.id;
      tabBar.querySelectorAll('button').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = DT.colors.textSecondary;
      });
      btn.style.background = DT.colors.surface;
      btn.style.color = DT.colors.primary;
      showTabContent(tab.id);
    });
    
    tabBar.appendChild(btn);
  });
  
  content.appendChild(tabBar);
  
  // Tab contents
  const tabContents = createElement('div', {
    styles: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
    },
  });
  
  content.appendChild(tabContents);
  
  function showTabContent(tabId) {
    tabContents.innerHTML = '';
    
    let data;
    switch (tabId) {
      case 'single':
        data = sortedWords;
        break;
      case 'bigrams':
        data = sortedBigrams;
        break;
      case 'trigrams':
        data = sortedTrigrams;
        break;
    }
    
    const table = createElement('table', {
      styles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: DT.typography.sizes.base,
      },
    });
    
    // Header
    const thead = createElement('thead');
    const headerRow = createElement('tr', {
      styles: {
        background: DT.colors.surfaceSecondary,
        position: 'sticky',
        top: '0',
        zIndex: '1',
      },
    });
    
    ['#', 'Keyword/Phrase', 'Count', 'Density', 'Distribution'].forEach(label => {
      const th = createElement('th', {
        styles: {
          padding: '10px 12px',
          textAlign: 'left',
          fontWeight: DT.typography.weights.semibold,
          color: DT.colors.textPrimary,
          borderBottom: `2px solid ${DT.colors.border}`,
          fontSize: DT.typography.sizes.xs,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
        text: label,
      });
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body
    const tbody = createElement('tbody');
    
    data.forEach(([word, count], index) => {
      const density = (count / totalMeaningful * 100);
      const densityColor = density > 5 ? DT.colors.error :
                          density > 2 ? DT.colors.warning :
                          DT.colors.success;
      const barWidth = Math.min(density * 15, 100);
      
      const row = createElement('tr', {
        styles: {
          borderBottom: `1px solid ${DT.colors.borderLight}`,
          transition: `background ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.background = DT.colors.surfaceSecondary;
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      
      // Rank
      const rankCell = createElement('td', {
        styles: { padding: '10px 12px', color: DT.colors.textMuted, fontSize: DT.typography.sizes.sm },
        text: String(index + 1),
      });
      
      // Keyword
      const keywordCell = createElement('td', {
        styles: { padding: '10px 12px', fontWeight: DT.typography.weights.semibold, color: DT.colors.textPrimary },
        text: word,
      });
      
      // Count
      const countCell = createElement('td', {
        styles: { padding: '10px 12px', textAlign: 'center', fontWeight: DT.typography.weights.bold },
        text: String(count),
      });
      
      // Density
      const densityCell = createElement('td', {
        styles: { padding: '10px 12px', color: densityColor, fontWeight: DT.typography.weights.semibold },
        text: `${density.toFixed(2)}%`,
      });
      
      // Distribution bar
      const distCell = createElement('td', {
        styles: { padding: '10px 12px' },
        children: [
          createElement('div', {
            styles: {
              height: '6px',
              background: DT.colors.surfaceTertiary,
              borderRadius: DT.radii.full,
              overflow: 'hidden',
            },
            children: [
              createElement('div', {
                styles: {
                  width: `${barWidth}%`,
                  height: '100%',
                  background: densityColor,
                  borderRadius: DT.radii.full,
                  transition: 'width 0.5s ease',
                },
              }),
            ],
          }),
        ],
      });
      
      row.appendChild(rankCell);
      row.appendChild(keywordCell);
      row.appendChild(countCell);
      row.appendChild(densityCell);
      row.appendChild(distCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tabContents.appendChild(table);
  }
  
  showTabContent('single');
  
  // Export buttons
  const buttonRow = createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(createButton('📊 Export CSV', () => {
    let csv = 'Rank,Keyword,Count,Density\n';
    sortedWords.forEach(([word, count], i) => {
      csv += `${i + 1},"${word}",${count},${((count / totalMeaningful) * 100).toFixed(2)}%\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword-density-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  buttonRow.appendChild(createButton('📋 Copy Report', () => {
    let report = `KEYWORD DENSITY REPORT\n${'='.repeat(40)}\n\n`;
    report += `TOP KEYWORDS:\n`;
    sortedWords.slice(0, 15).forEach(([word, count], i) => {
      report += `  ${i + 1}. ${word}: ${count} (${((count / totalMeaningful) * 100).toFixed(2)}%)\n`;
    });
    
    if (sortedBigrams.length > 0) {
      report += `\nTOP PHRASES:\n`;
      sortedBigrams.slice(0, 5).forEach(([phrase, count], i) => {
        report += `  ${i + 1}. ${phrase}: ${count}\n`;
      });
    }
    
    copyToClipboard(report).then(() => showNotification('✅ Report copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = createModal('Keyword Density Analyzer', content, { width: '750px' });
}

// ==================== TOOL: SERP PREVIEW ====================

function toolShowSerpPreview() {
  const content = createElement('div');
  
  const currentTitle = document.title || '';
  const metaDescTag = document.querySelector('meta[name="description"]');
  const currentDesc = metaDescTag?.getAttribute('content') || '';
  const currentUrl = window.location.href;
  
  content.appendChild(createToolHeader(
    '👁️ SERP Preview',
    'See how your page appears in Google search results'
  ));
  
  // Title input
  const { wrapper: titleWrapper, input: titleInput } = createInputField({
    label: '📝 Page Title (50-60 chars optimal)',
    id: 'serp-title',
    placeholder: 'Enter page title...',
    defaultValue: currentTitle,
  });
  
  const titleCount = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: DT.colors.textMuted,
      textAlign: 'right',
      marginTop: '4px',
    },
    text: `${currentTitle.length} characters`,
  });
  titleWrapper.appendChild(titleCount);
  
  // Description input
  const { wrapper: descWrapper, textarea: descTextarea } = createTextarea({
    label: '📄 Meta Description (150-160 chars optimal)',
    id: 'serp-desc',
    placeholder: 'Enter meta description...',
    rows: 3,
  });
  descTextarea.value = currentDesc;
  
  const descCount = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: DT.colors.textMuted,
      textAlign: 'right',
      marginTop: '4px',
    },
    text: `${currentDesc.length} characters`,
  });
  descWrapper.appendChild(descCount);
  
  // Preview section
  const previewLabel = createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.sm,
      fontWeight: DT.typography.weights.bold,
      color: DT.colors.textSecondary,
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    text: '🔍 Google Search Preview',
  });
  
  const previewCard = createElement('div', {
    styles: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: DT.radii.lg,
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
    },
  });
  
  // URL display
  previewCard.appendChild(createElement('div', {
    styles: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
    },
    children: [
      createElement('div', {
        styles: {
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#F1F3F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
        },
        text: '🌐',
      }),
      createElement('div', {
        styles: { fontSize: '12px', color: '#4D5156' },
        html: `${escapeHtml(window.location.hostname)}<span style="color:#70757A;"> › </span>`,
      }),
    ],
  }));
  
  // Title preview
  const previewTitle = createElement('div', {
    id: 'preview-title',
    styles: {
      color: '#1A0DAB',
      fontSize: '20px',
      lineHeight: '1.3',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    text: currentTitle || 'Your Page Title',
  });
  previewCard.appendChild(previewTitle);
  
  // Description preview
  const previewDesc = createElement('div', {
    id: 'preview-desc',
    styles: {
      color: '#4D5156',
      fontSize: '14px',
      lineHeight: '1.58',
      overflow: 'hidden',
    },
    text: currentDesc || 'Your meta description will appear here. Make it compelling to improve click-through rate.',
  });
  previewCard.appendChild(previewDesc);
  
  // Assemble preview section
  const previewSection = createSection('', [previewLabel, previewCard]);
  
  content.appendChild(createSection('🎨 Edit Meta Tags', [titleWrapper, descWrapper]));
  content.appendChild(previewSection);
  
  // Live update
  function updatePreview() {
    const title = titleInput.value;
    const desc = descTextarea.value;
    
    // Update counts
    titleCount.textContent = `${title.length} characters`;
    titleCount.style.color = title.length >= 50 && title.length <= 60 ? DT.colors.success :
                              title.length < 30 || title.length > 65 ? DT.colors.error :
                              DT.colors.warning;
    
    descCount.textContent = `${desc.length} characters`;
    descCount.style.color = desc.length >= 150 && desc.length <= 160 ? DT.colors.success :
                             desc.length < 120 || desc.length > 170 ? DT.colors.error :
                             DT.colors.warning;
    
    // Truncate for realistic preview
    previewTitle.textContent = title.length > 65 ? title.substring(0, 62) + '...' : (title || 'Your Page Title');
    previewDesc.textContent = desc.length > 160 ? desc.substring(0, 157) + '...' : (desc || 'Your meta description will appear here.');
  }
  
  titleInput.addEventListener('input', updatePreview);
  descTextarea.addEventListener('input', updatePreview);
  
  // Copy optimized
  content.appendChild(createButton('📋 Copy Optimized Tags', () => {
    const title = titleInput.value;
    const desc = descTextarea.value;
    const text = `Title: ${title}\nDescription: ${desc}`;
    copyToClipboard(text).then(() => showNotification('✅ Meta tags copied!', 'success'));
  }, { variant: 'primary' }));
  
  const { close } = createModal('SERP Preview', content, { width: '600px' });
}

// ==================== TOOL: IMAGE ALT TEXT ANALYZER ====================

function toolAnalyzeImages() {
  const content = createElement('div');
  
  const images = Array.from(document.querySelectorAll('img'));
  const results = {
    total: images.length,
    withAlt: 0,
    withoutAlt: 0,
    emptyAlt: 0,
    withLazy: 0,
    missingDimensions: 0,
    details: [],
  };
  
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const src = img.currentSrc || img.src || img.getAttribute('data-src') || '';
    const width = img.naturalWidth || img.getAttribute('width');
    const height = img.naturalHeight || img.getAttribute('height');
    const isLazy = img.getAttribute('loading') === 'lazy';
    
    if (alt === null) {
      results.withoutAlt++;
    } else if (alt === '') {
      results.emptyAlt++;
    } else {
      results.withAlt++;
    }
    
    if (isLazy) results.withLazy++;
    if (!width || !height) results.missingDimensions++;
    
    results.details.push({
      index: index + 1,
      alt: alt || '',
      src: src.substring(0, 80),
      hasAlt: alt !== null && alt !== '',
      isLazy,
      hasDimensions: !!(width && height),
      width: width || '?',
      height: height || '?',
    });
  });
  
  const accessibilityScore = results.total > 0
    ? Math.round((results.withAlt / results.total) * 100)
    : 0;
  
  // Header
  content.appendChild(createToolHeader(
    '🖼️ Image Alt Text Analysis',
    `${results.total} images found • ${results.withoutAlt + results.emptyAlt} need attention`,
    'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  ));
  
  // Score
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(accessibilityScore, 90));
  
  const scoreLabel = createElement('div', {
    styles: {
      textAlign: 'center',
      fontSize: DT.typography.sizes.sm,
      color: DT.colors.textMuted,
      marginTop: '-10px',
      marginBottom: '16px',
    },
    text: 'Accessibility Score',
  });
  
  content.appendChild(scoreRow);
  content.appendChild(scoreLabel);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Images', value: results.total, icon: '🖼️', color: DT.colors.primary },
    { label: 'With Alt Text', value: results.withAlt, icon: '✅', color: DT.colors.success },
    { label: 'Missing Alt', value: results.withoutAlt, icon: '❌', color: DT.colors.error },
    { label: 'Empty Alt', value: results.emptyAlt, icon: '⚠️', color: DT.colors.warning },
    { label: 'Lazy Loaded', value: results.withLazy, icon: '⚡', color: DT.colors.info },
    { label: 'No Dimensions', value: results.missingDimensions, icon: '📏', color: DT.colors.warning },
  ]));
  
  // Issues list
  if (results.withoutAlt + results.emptyAlt > 0) {
    const issuesSection = createSection('⚠️ Images Needing Attention', [
      createElement('div', {
        styles: {
          maxHeight: '300px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        },
        children: results.details
          .filter(d => !d.hasAlt)
          .map(d => createElement('div', {
            styles: {
              padding: '10px 14px',
              background: results.withoutAlt > 0 && d.alt === null ? DT.colors.errorLight : DT.colors.warningLight,
              borderLeft: `3px solid ${d.alt === null ? DT.colors.error : DT.colors.warning}`,
              borderRadius: DT.radii.md,
              fontSize: DT.typography.sizes.sm,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            children: [
              createElement('span', {
                styles: {
                  fontWeight: DT.typography.weights.bold,
                  color: DT.colors.textSecondary,
                  minWidth: '30px',
                },
                text: `#${d.index}`,
              }),
              createElement('span', {
                styles: {
                  flex: '1',
                  fontFamily: DT.typography.fontMono,
                  fontSize: DT.typography.sizes.xs,
                  color: DT.colors.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                text: d.src || 'Unknown source',
              }),
              createBadge(
                d.alt === null ? 'Missing' : 'Empty',
                d.alt === null ? 'error' : 'warning'
              ),
            ],
          })),
      }),
    ]);
    
    content.appendChild(issuesSection);
  } else if (results.total > 0) {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: {
          padding: '20px',
          background: DT.colors.successLight,
          borderRadius: DT.radii.md,
          textAlign: 'center',
          color: '#166534',
          fontWeight: DT.typography.weights.semibold,
        },
        text: '✅ All images have proper alt text! Great job!',
      }),
    ]));
  }
  
  // Recommendations
  content.appendChild(createSection('💡 Recommendations', [
    createElement('ul', {
      styles: {
        margin: '0',
        paddingLeft: '20px',
        fontSize: DT.typography.sizes.base,
        color: DT.colors.textSecondary,
        lineHeight: '1.8',
      },
      html: `
        <li>${results.withoutAlt > 0 ? `Add alt text to ${results.withoutAlt} images` : '✅ All images have alt text'}</li>
        <li>${results.emptyAlt > 0 ? `Fill in ${results.emptyAlt} empty alt attributes` : '✅ No empty alt attributes'}</li>
        <li>${results.missingDimensions > 0 ? `Add width/height to ${results.missingDimensions} images to prevent layout shift` : '✅ All images have dimensions'}</li>
        <li>${results.withLazy < results.total ? `Consider adding lazy loading to ${results.total - results.withLazy} images` : '✅ Good use of lazy loading'}</li>
      `,
    }),
  ]));
  
  const { close } = createModal('Image Alt Text Analysis', content, { width: '650px' });
}

// ==================== TOOL: BROKEN LINK CHECKER ====================

async function toolCheckBrokenLinks() {
  const links = Array.from(document.querySelectorAll('a[href]')).filter(link => {
    return !link.href.startsWith('javascript:') &&
           !link.href.startsWith('mailto:') &&
           !link.href.startsWith('tel:') &&
           link.href !== '#';
  });
  
  if (links.length === 0) {
    showNotification('No valid links found to check.', 'warning');
    return;
  }
  
  // Create status overlay
  const statusDiv = createElement('div', {
    styles: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100000',
      background: DT.colors.surface,
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
      padding: '20px',
      minWidth: '300px',
      boxShadow: DT.shadows['2xl'],
      fontFamily: DT.typography.fontFamily,
    },
  });
  
  statusDiv.innerHTML = `
    <div style="font-size: ${DT.typography.sizes.md}; font-weight: ${DT.typography.weights.bold}; margin-bottom: 12px; color: ${DT.colors.textPrimary};">
      🚨 Broken Link Checker
    </div>
    <div id="bl-status" style="font-size: ${DT.typography.sizes.base}; color: ${DT.colors.textSecondary}; margin-bottom: 12px;">
      Scanning ${links.length} links...
    </div>
    <div style="background: ${DT.colors.surfaceTertiary}; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
      <div id="bl-progress" style="height: 100%; width: 0%; background: ${DT.colors.primaryGradient}; border-radius: 4px; transition: width 0.3s;"></div>
    </div>
    <div id="bl-count" style="font-size: ${DT.typography.sizes.sm}; color: ${DT.colors.textMuted};"></div>
    <button id="bl-close" style="margin-top: 12px; padding: 6px 12px; background: ${DT.colors.surfaceTertiary}; border: 1px solid ${DT.colors.border}; border-radius: 6px; cursor: pointer; font-size: 12px; color: ${DT.colors.textSecondary};">Close</button>
  `;
  
  document.body.appendChild(statusDiv);
  
  const updateStatus = (checked, total, broken) => {
    const progress = Math.round((checked / total) * 100);
    $('#bl-status').textContent = `Scanning: ${checked}/${total} links...`;
    $('#bl-progress').style.width = `${progress}%`;
    $('#bl-count').innerHTML = `Issues found: <strong style="color: ${broken > 0 ? DT.colors.error : DT.colors.success}">${broken}</strong>`;
  };
  
  $('#bl-close').addEventListener('click', () => {
    statusDiv.style.opacity = '0';
    statusDiv.style.transition = 'opacity 0.3s';
    setTimeout(() => statusDiv.remove(), 300);
  });
  
  let checked = 0;
  const brokenLinks = [];
  const BATCH_SIZE = 5;
  
  async function checkLink(link) {
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      
      if (response.ok) {
        link.style.border = '2px solid #22C55E';
        link.style.backgroundColor = '#DCFCE7';
      } else {
        link.style.border = '2px solid #EF4444';
        link.style.backgroundColor = '#FEE2E2';
        brokenLinks.push({
          url: link.href,
          text: cleanText(link.textContent).substring(0, 100) || '[No Anchor Text]',
          status: `HTTP ${response.status}`,
        });
      }
    } catch (e) {
      link.style.border = '2px solid #F59E0B';
      link.style.backgroundColor = '#FEF3C7';
      brokenLinks.push({
        url: link.href,
        text: cleanText(link.textContent).substring(0, 100) || '[No Anchor Text]',
        status: 'Network Error',
      });
    } finally {
      checked++;
      updateStatus(checked, links.length, brokenLinks.length);
    }
  }
  
  // Process in batches
  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const batch = links.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(checkLink));
  }
  
  // Final update
  updateStatus(links.length, links.length, brokenLinks.length);
  
  if (brokenLinks.length > 0) {
    const exportBtn = createElement('button', {
      styles: {
        width: '100%',
        marginTop: '12px',
        padding: '10px',
        background: DT.colors.primary,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: DT.typography.weights.bold,
        fontSize: DT.typography.sizes.sm,
      },
      text: '📥 Export Broken Links CSV',
    });
    
    exportBtn.addEventListener('click', () => {
      let csv = 'URL,Anchor Text,Status\n';
      brokenLinks.forEach(l => {
        csv += `"${l.url}","${l.text.replace(/"/g, '""')}","${l.status}"\n`;
      });
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `broken-links-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('✅ CSV exported!', 'success');
    });
    
    statusDiv.appendChild(exportBtn);
  }
  
  showNotification(
    `✅ Check complete! Found ${brokenLinks.length} broken link${brokenLinks.length !== 1 ? 's' : ''}.`,
    brokenLinks.length > 0 ? 'warning' : 'success'
  );
  
  // Auto-close if no issues
  if (brokenLinks.length === 0) {
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.style.opacity = '0';
        statusDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => statusDiv.remove(), 500);
      }
    }, 4000);
  }
}

// ==================== TOOL: DEEP GOOGLE DOMAIN EXTRACTOR ====================

function toolExtractBulkGoogleDomains() {
  const urlParams = new URLSearchParams(window.location.search);
  const originalQuery = urlParams.get('q');
  
  if (!originalQuery || !window.location.hostname.includes('google.')) {
    showNotification('Please run this on a Google search results page', 'error');
    return;
  }
  
  const allDomains = new Set();
  const excludedExtensions = ['.edu', '.gov', '.edu.ph', '.gov.ph', '.wordpress.com', '.blogspot.com'];
  const excludedKeywords = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'pinterest.com', 'reddit.com', 'quora.com', 'medium.com',
    'wikipedia.org', 'amazon.com', 'ebay.com', 'apple.com', 'microsoft.com',
    'github.com', 'stackoverflow.com',
  ];
  
  const maxPages = 50;
  const baseUrl = window.location.href.split('&start=')[0].split('#')[0];
  let extractionCancelled = false;
  
  // Status overlay
  const statusDiv = createElement('div', {
    styles: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100000',
      background: DT.colors.surface,
      border: `1px solid ${DT.colors.border}`,
      borderRadius: DT.radii.lg,
      padding: '20px',
      minWidth: '320px',
      boxShadow: DT.shadows['2xl'],
      fontFamily: DT.typography.fontFamily,
      borderLeft: `4px solid ${DT.colors.primary}`,
    },
  });
  
  statusDiv.innerHTML = `
    <div style="font-weight: ${DT.typography.weights.bold}; margin-bottom: 8px; font-size: ${DT.typography.sizes.md}; color: ${DT.colors.textPrimary};">
      🌐 Deep Domain Extractor
    </div>
    <div id="dde-status" style="font-size: ${DT.typography.sizes.base}; color: ${DT.colors.textSecondary}; margin-bottom: 12px;">
      Starting extraction...
    </div>
    <div style="background: ${DT.colors.surfaceTertiary}; border-radius: 4px; height: 6px; overflow: hidden; margin-bottom: 8px;">
      <div id="dde-progress" style="height: 100%; width: 0%; background: ${DT.colors.primaryGradient}; border-radius: 4px; transition: width 0.3s;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: ${DT.typography.sizes.sm}; color: ${DT.colors.textMuted}; margin-bottom: 12px;">
      <span>Domains: <strong id="dde-count">0</strong></span>
      <span>Pages: <strong id="dde-pages">0</strong></span>
    </div>
    <button id="dde-cancel" style="width: 100%; padding: 8px; background: ${DT.colors.error}; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: ${DT.typography.weights.bold}; font-size: ${DT.typography.sizes.sm};">Cancel Extraction</button>
  `;
  
  document.body.appendChild(statusDiv);
  
  function updateStatus(message, progress, domains, pages) {
    const status = $('#dde-status');
    const progressBar = $('#dde-progress');
    const count = $('#dde-count');
    const pageCount = $('#dde-pages');
    
    if (status) status.textContent = message;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
    if (count) count.textContent = String(domains);
    if (pageCount) pageCount.textContent = String(pages);
  }
  
  $('#dde-cancel').addEventListener('click', () => {
    extractionCancelled = true;
    statusDiv.remove();
    showNotification('Extraction cancelled.', 'warning');
    if (allDomains.size > 0) showResults();
  });
  
  function extractDomainsFromHtml(html, pageNum) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const anchors = tempDiv.querySelectorAll('a[href]');
    let newDomains = 0;
    
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href) {
        try {
          let finalUrl = null;
          if (href.startsWith('/url?')) {
            const params = new URLSearchParams(href.substring(5));
            finalUrl = params.get('q') || params.get('url');
          } else if (href.startsWith('http') && !href.includes('google.com/search')) {
            finalUrl = href;
          }
          
          if (finalUrl) {
            const url = new URL(finalUrl);
            const domain = url.hostname.replace(/^www\./, '').toLowerCase();
            
            let isExcluded = false;
            if (excludedExtensions.some(ext => domain.endsWith(ext))) isExcluded = true;
            if (excludedKeywords.some(kw => domain.includes(kw))) isExcluded = true;
            
            if (!isExcluded && domain && domain.includes('.')) {
              if (!allDomains.has(domain)) {
                allDomains.add(domain);
                newDomains++;
              }
            }
          }
        } catch (e) {}
      }
    });
    
    return newDomains;
  }
  
  async function fetchPage(pageNum) {
    if (extractionCancelled) return;
    
    const startNum = pageNum * 10;
    const url = baseUrl + '&start=' + startNum;
    
    updateStatus(`Fetching page ${pageNum + 1}/${maxPages}...`, 
      Math.round((pageNum / maxPages) * 100), allDomains.size, pageNum + 1);
    
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': navigator.userAgent },
      });
      
      if (!response.ok) throw new Error('HTTP ' + response.status);
      
      const html = await response.text();
      const newDomains = extractDomainsFromHtml(html, pageNum);
      
      const hasNext = html.includes('Next</span>') || 
                       html.includes('id="pnnext"');
      const hasResults = !html.includes('did not match any documents');
      
      if (hasNext && hasResults && pageNum < maxPages - 1) {
        setTimeout(() => fetchPage(pageNum + 1), Math.random() * 800 + 400);
      } else {
        updateStatus('Complete!', 100, allDomains.size, pageNum + 1);
        setTimeout(() => {
          statusDiv.remove();
          showResults();
        }, 500);
      }
    } catch (error) {
      if (pageNum < maxPages - 1) {
        setTimeout(() => fetchPage(pageNum + 1), 2000);
      } else {
        setTimeout(() => {
          statusDiv.remove();
          showResults();
        }, 500);
      }
    }
  }
  
  function showResults() {
    if (allDomains.size === 0) {
      showNotification('No unique domains found.', 'error');
      return;
    }
    
    const sortedDomains = Array.from(allDomains).sort();
    
    const outputWindow = window.open('', '_blank', 'width=900,height=700');
    if (!outputWindow) {
      showNotification('Pop-up blocked! Please allow pop-ups.', 'error');
      return;
    }
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Deep Extraction - ${sortedDomains.length} Domains</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
      background: #F9FAFB;
      color: #111827;
      margin: 0;
    }
    .header {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
    }
    .header h1 { margin: 0 0 8px; font-size: 24px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .stat { background: white; padding: 16px; border-radius: 12px; border: 1px solid #E5E7EB; text-align: center; }
    .stat-value { font-size: 24px; font-weight: 800; color: #6366F1; }
    .stat-label { font-size: 12px; color: #6B7280; text-transform: uppercase; margin-top: 4px; }
    button {
      padding: 12px 24px;
      background: #6366F1;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 20px;
      transition: all 0.2s;
    }
    button:hover { background: #4F46E5; transform: translateY(-2px); }
    button.copied { background: #10B981; }
    .domain-list {
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      padding: 20px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 60vh;
      overflow-y: auto;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌐 Deep Google Domain Extraction</h1>
    <p style="margin: 0; opacity: 0.9;">Successfully extracted ${sortedDomains.length} unique domains</p>
  </div>
  <div class="stats">
    <div class="stat">
      <div class="stat-value">${sortedDomains.length}</div>
      <div class="stat-label">Unique Domains</div>
    </div>
  </div>
  <button id="copyAllBtn">📋 Copy All Domains</button>
  <button id="exportCsvBtn" style="background:#10B981; margin-left: 8px;">📊 Export CSV</button>
  <div class="domain-list">${sortedDomains.join('\n')}</div>
  <script>
    const domains = ${JSON.stringify(sortedDomains.join('\n'))};
    
    document.getElementById('copyAllBtn').addEventListener('click', function() {
      navigator.clipboard.writeText(domains).then(() => {
        this.textContent = '✅ Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.textContent = '📋 Copy All Domains';
          this.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = domains;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.textContent = '✅ Copied!';
        setTimeout(() => this.textContent = '📋 Copy All Domains', 2000);
      });
    });
    
    document.getElementById('exportCsvBtn').addEventListener('click', function() {
      const csv = 'Domain\\n' + domains.split('\\n').map(d => '"' + d + '"').join('\\n');
      const blob = new Blob(['\\ufeff' + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deep-domains-${new Date().toISOString().slice(0, 10)}.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  <\/script>
</body>
</html>`;
    
    outputWindow.document.write(htmlContent);
    outputWindow.document.close();
    
    showNotification(`✅ ${sortedDomains.length} domains extracted!`, 'success');
  }
  
  // Start extraction
  extractDomainsFromHtml(document.documentElement.innerHTML, -1);
  fetchPage(0);
}

// ==================== TOOL: METRICS OPENER ====================

function toolShowMetrics() {
  const domain = window.location.hostname.replace(/^www\./, '');
  const encodedDomain = encodeURIComponent(domain);
  
  const metricsUrls = [
    { name: 'Authority Score', url: `https://www.semrush.com/free-tools/website-authority-checker/?url=${encodedDomain}` },
    { name: 'Spam Score', url: `https://websiteseochecker.com/spam-score-checker/?url=${encodedDomain}` },
    { name: 'Domain Rating', url: `https://ahrefs.com/website-authority-checker/?input=${encodedDomain}` },
    { name: 'Organic Traffic', url: `https://ahrefs.com/traffic-checker/?input=${encodedDomain}&mode=subdomains` },
  ];
  
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '📈 SEO Metrics',
    `Open third-party tools for domain: ${domain}`
  ));
  
  content.appendChild(createSection('🔗 Available Tools', [
    createElement('div', {
      styles: { display: 'grid', gap: '10px' },
      children: metricsUrls.map(metric => {
        const card = createElement('div', {
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.md,
            cursor: 'pointer',
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('click', () => window.open(metric.url, '_blank'));
        
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = DT.colors.primary;
          card.style.transform = 'translateX(4px)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = DT.colors.border;
          card.style.transform = 'translateX(0)';
        });
        
        card.appendChild(createElement('span', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.semibold,
            color: DT.colors.textPrimary,
          },
          text: metric.name,
        }));
        
        card.appendChild(createElement('span', {
          styles: { color: DT.colors.primary },
          text: 'Open →',
        }));
        
        return card;
      }),
    }),
  ]));
  
  content.appendChild(createButton('🚀 Open All Tools', () => {
    metricsUrls.forEach((metric, i) => {
      setTimeout(() => window.open(metric.url, '_blank'), i * 150);
    });
    showNotification('Opening all metrics tools...', 'success');
  }, { variant: 'primary' }));
  
  const { close } = createModal('SEO Metrics', content, { width: '500px' });
}

// ==================== TOOL: INTERNAL VS EXTERNAL LINKS ====================

function toolAnalyzeLinks() {
  const content = createElement('div');
  
  const currentDomain = window.location.hostname;
  const links = $$('a[href]');
  
  let internalCount = 0, externalCount = 0;
  const internalLinks = [], externalLinks = [];
  
  links.forEach(link => {
    try {
      const url = new URL(link.href, window.location.origin);
      const text = cleanText(link.textContent).substring(0, 50);
      
      if (url.hostname === currentDomain) {
        internalCount++;
        internalLinks.push({ url: link.href, text: text || '[No Text]' });
      } else {
        externalCount++;
        externalLinks.push({ url: link.href, text: text || '[No Text]' });
      }
    } catch (e) {}
  });
  
  const totalLinks = internalCount + externalCount;
  
  content.appendChild(createToolHeader(
    '🔗 Link Analysis',
    `${totalLinks} total links • ${internalCount} internal • ${externalCount} external`
  ));
  
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: totalLinks, icon: '🔗' },
    { label: 'Internal', value: internalCount, icon: '🏠', color: DT.colors.success },
    { label: 'External', value: externalCount, icon: '🌐', color: DT.colors.info },
    { label: 'Ratio', value: `${internalCount}:${externalCount}`, icon: '📊' },
  ]));
  
  // Internal links section
  if (internalLinks.length > 0) {
    const internalSection = createSection('🏠 Internal Links', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' },
        children: internalLinks.slice(0, 15).map((link, i) => 
          createElement('div', {
            styles: {
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: DT.colors.surfaceSecondary,
              borderRadius: DT.radii.md, fontSize: DT.typography.sizes.sm,
            },
            children: [
              createElement('span', { styles: { color: DT.colors.textMuted, minWidth: '24px' }, text: String(i + 1) }),
              createElement('span', { 
                styles: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: DT.colors.primary, fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
                text: link.url.length > 60 ? link.url.substring(0, 57) + '...' : link.url 
              }),
            ],
          })
        ),
      }),
    ]);
    content.appendChild(internalSection);
  }
  
  // External links section
  if (externalLinks.length > 0) {
    const externalSection = createSection('🌐 External Links', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' },
        children: externalLinks.slice(0, 15).map((link, i) =>
          createElement('div', {
            styles: {
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: DT.colors.surfaceSecondary,
              borderRadius: DT.radii.md, fontSize: DT.typography.sizes.sm,
            },
            children: [
              createElement('span', { styles: { color: DT.colors.textMuted, minWidth: '24px' }, text: String(i + 1) }),
              createElement('span', {
                styles: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: DT.colors.info, fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
                text: link.url.length > 60 ? link.url.substring(0, 57) + '...' : link.url
              }),
            ],
          })
        ),
      }),
    ]);
    content.appendChild(externalSection);
  }
  
  const { close } = createModal('Link Analysis', content, { width: '650px' });
}

// ==================== TOOL: CURRENCY SYMBOL COPIER ====================

function toolCurrencyCopier() {
  const content = createElement('div');
  
  const currencies = [
    { symbol: '$', code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { symbol: '€', code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { symbol: '£', code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { symbol: '¥', code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { symbol: '¥', code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { symbol: '₹', code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { symbol: '₩', code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { symbol: '₱', code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { symbol: '฿', code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { symbol: 'R$', code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { symbol: '₿', code: 'BTC', name: 'Bitcoin', flag: '🟠' },
    { symbol: '¢', code: 'CENT', name: 'Cent', flag: '💰' },
  ];
  
  content.appendChild(createToolHeader(
    '💰 Currency Symbol Copier',
    'Click any currency to copy its symbol to clipboard'
  ));
  
  const grid = createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: '10px',
    },
    children: currencies.map(curr => {
      const card = createElement('div', {
        styles: {
          padding: '16px',
          background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`,
          borderRadius: DT.radii.lg,
          textAlign: 'center',
          cursor: 'pointer',
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      card.addEventListener('click', () => {
        copyToClipboard(curr.symbol).then(() => 
          showNotification(`✅ Copied ${curr.symbol} (${curr.code})!`, 'success')
        );
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
        card.style.boxShadow = DT.shadows.md;
        card.style.borderColor = DT.colors.primary;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
        card.style.borderColor = DT.colors.border;
      });
      
      card.appendChild(createElement('div', {
        styles: { fontSize: '28px', marginBottom: '8px' },
        text: curr.flag,
      }));
      
      card.appendChild(createElement('div', {
        styles: {
          fontSize: '24px',
          fontWeight: DT.typography.weights.extrabold,
          color: DT.colors.textPrimary,
          marginBottom: '4px',
        },
        text: curr.symbol,
      }));
      
      card.appendChild(createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.sm,
          fontWeight: DT.typography.weights.bold,
          color: DT.colors.primary,
        },
        text: curr.code,
      }));
      
      card.appendChild(createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.xs,
          color: DT.colors.textMuted,
          marginTop: '2px',
        },
        text: curr.name,
      }));
      
      return card;
    }),
  });
  
  content.appendChild(createSection('💱 Available Currencies', [grid]));
  
  const { close } = createModal('Currency Symbol Copier', content, { width: '600px' });
}

// ==================== TOOL: URL OPTIMIZER ====================

function toolOptimizeUrl() {
  const content = createElement('div');
  
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const path = urlObj.pathname;
  
  const issues = [];
  
  if (currentUrl.length > 75) {
    issues.push({ severity: 'warning', message: `URL is ${currentUrl.length} characters (recommend: under 75)` });
  }
  if (path !== path.toLowerCase()) {
    issues.push({ severity: 'warning', message: 'URL contains uppercase letters (use lowercase)' });
  }
  if (path.includes('_')) {
    issues.push({ severity: 'warning', message: 'URL uses underscores (use hyphens instead)' });
  }
  if (urlObj.searchParams.toString().length > 0) {
    issues.push({ severity: 'info', message: `URL has ${urlObj.searchParams.size} parameter(s)` });
  }
  
  const stopWords = ['a', 'an', 'and', 'the', 'of', 'in', 'on', 'at', 'to', 'for'];
  stopWords.forEach(word => {
    if (path.toLowerCase().includes(`/${word}/`) || path.toLowerCase().includes(`-${word}-`)) {
      issues.push({ severity: 'info', message: `Contains stop word: "${word}"` });
    }
  });
  
  let optimizedPath = path
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9/-]/g, '')
    .replace(/-+/g, '-')
    .replace(/\/-|\/$/g, '');
  
  stopWords.forEach(word => {
    optimizedPath = optimizedPath
      .replace(new RegExp(`-${word}-`, 'g'), '-')
      .replace(new RegExp(`/${word}/`, 'g'), '/');
  });
  
  const optimizedUrl = urlObj.origin + optimizedPath;
  
  content.appendChild(createToolHeader(
    '🔗 URL Optimizer',
    'Analyze and optimize your URL structure for SEO'
  ));
  
  // Current vs Optimized
  const comparisonSection = createSection('📊 URL Comparison', [
    createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '12px' } }),
  ]);
  
  const currentCard = createElement('div', {
    styles: {
      padding: '16px', background: DT.colors.surfaceSecondary,
      border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
    },
    children: [
      createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, fontWeight: DT.typography.weights.bold, color: DT.colors.textMuted, textTransform: 'uppercase', marginBottom: '6px' },
        text: 'Current URL',
      }),
      createElement('div', {
        styles: { fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.sm, color: DT.colors.textSecondary, wordBreak: 'break-all' },
        text: currentUrl,
      }),
      createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, color: currentUrl.length > 75 ? DT.colors.error : DT.colors.success, marginTop: '4px' },
        text: `${currentUrl.length} characters ${currentUrl.length > 75 ? '⚠️ Too long' : '✅ Good'}`,
      }),
    ],
  });
  
  const optimizedCard = createElement('div', {
    styles: {
      padding: '16px', background: DT.colors.successLight,
      border: `2px solid ${DT.colors.success}`, borderRadius: DT.radii.md,
    },
    children: [
      createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, fontWeight: DT.typography.weights.bold, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' },
        text: '✨ Optimized URL',
      }),
      createElement('div', {
        styles: { fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.sm, color: '#166534', wordBreak: 'break-all' },
        text: optimizedUrl,
      }),
      createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, color: '#166534', marginTop: '4px', fontWeight: DT.typography.weights.bold },
        text: '✅ SEO-friendly',
      }),
    ],
  });
  
  comparisonSection.querySelector('div').appendChild(currentCard);
  comparisonSection.querySelector('div').appendChild(optimizedCard);
  content.appendChild(comparisonSection);
  
  // Issues
  if (issues.length > 0) {
    content.appendChild(createSection('⚠️ Issues Found', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue =>
          createElement('div', {
            styles: {
              padding: '10px 14px',
              background: issue.severity === 'warning' ? DT.colors.warningLight : DT.colors.infoLight,
              borderLeft: `3px solid ${issue.severity === 'warning' ? DT.colors.warning : DT.colors.info}`,
              borderRadius: DT.radii.md,
              fontSize: DT.typography.sizes.base,
              color: issue.severity === 'warning' ? '#92400E' : '#1E40AF',
              display: 'flex', alignItems: 'center', gap: '8px',
            },
            text: `${issue.severity === 'warning' ? '⚠️' : 'ℹ️'} ${issue.message}`,
          })
        ),
      }),
    ]));
  }
  
  // Copy button
  content.appendChild(createButton('📋 Copy Optimized URL', () => {
    copyToClipboard(optimizedUrl).then(() => showNotification('✅ Optimized URL copied!', 'success'));
  }, { variant: 'success' }));
  
  // Best practices
  content.appendChild(createSection('💡 URL Best Practices', [
    createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
      html: `
        <li>Keep URLs under 75 characters</li>
        <li>Use lowercase letters only</li>
        <li>Use hyphens (-) not underscores (_)</li>
        <li>Include target keyword</li>
        <li>Avoid unnecessary parameters</li>
        <li>Keep structure shallow (2-3 levels)</li>
      `,
    }),
  ]));
  
  const { close } = createModal('URL Optimizer', content, { width: '600px' });
}

// ==================== TOOL: SEO TITLE GENERATOR ====================

function toolGenerateTitles() {
  const content = createElement('div');
  
  const h1 = document.querySelector('h1')?.textContent || document.title;
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 5);
  const domain = window.location.hostname.replace('www.', '').split('.')[0];
  
  const titleVariations = [
    `${h1} | ${domain}`,
    `${h1}: ${keywords.slice(0, 3).join(' ')} Guide`,
    `${h1} - Complete Guide ${new Date().getFullYear()}`,
    `How to ${h1}: ${keywords.slice(0, 2).join(' and ')} Tips`,
    `The Ultimate ${h1} Guide for ${new Date().getFullYear()}`,
    `${h1} Explained: Everything You Need to Know`,
    `Master ${h1} with These ${keywords[0] || 'Expert'} Tips`,
    `${h1} | Strategies & Examples`,
    `Learn ${h1}: Step-by-Step Tutorial`,
    `${keywords.slice(0, 2).join(' ')} ${keywords[2] || ''}: ${h1}`,
  ];
  
  content.appendChild(createToolHeader(
    '📝 SEO Title Generator',
    `${titleVariations.length} optimized titles generated`
  ));
  
  const titlesList = createSection('✨ Generated Titles', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '10px' },
      children: titleVariations.map((title, i) => {
        const card = createElement('div', {
          styles: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px',
            background: i === 0 ? DT.colors.successLight : DT.colors.surface,
            border: `1px solid ${i === 0 ? DT.colors.success : DT.colors.border}`,
            borderRadius: DT.radii.md,
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = DT.colors.primary;
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = i === 0 ? DT.colors.success : DT.colors.border;
        });
        
        const titleInfo = createElement('div', { styles: { flex: '1', marginRight: '12px' } });
        
        titleInfo.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.sm,
            fontWeight: DT.typography.weights.bold,
            color: DT.colors.primary,
            marginBottom: '4px',
          },
          text: `Option ${i + 1}${i === 0 ? ' 🏆' : ''}`,
        }));
        
        titleInfo.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: DT.colors.textPrimary,
            lineHeight: '1.4',
          },
          text: title,
        }));
        
        titleInfo.appendChild(createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: title.length > 60 ? DT.colors.error : DT.colors.success,
            marginTop: '4px',
          },
          text: `${title.length} characters ${title.length > 60 ? '⚠️' : '✅'}`,
        }));
        
        const copyBtn = createButton('Copy', () => {
          copyToClipboard(title).then(() => showNotification('✅ Title copied!', 'success'));
        }, { variant: 'secondary', fullWidth: false, size: 'sm' });
        
        card.appendChild(titleInfo);
        card.appendChild(copyBtn);
        
        return card;
      }),
    }),
  ]);
  
  content.appendChild(titlesList);
  
  content.appendChild(createButton('📋 Copy All Titles', () => {
    copyToClipboard(titleVariations.join('\n')).then(() => 
      showNotification(`✅ ${titleVariations.length} titles copied!`, 'success')
    );
  }, { variant: 'primary' }));
  
  const { close } = createModal('SEO Title Generator', content, { width: '650px' });
}

// ==================== TOOL: PUBLICATION DATE CHECKER ====================

function toolCheckPublicationDate() {
  const content = createElement('div');
  
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  
  // Check various date sources
  const dateSources = {
    articlePublished: document.querySelector('meta[property="article:published_time"]')?.getAttribute('content'),
    articleModified: document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content'),
    ogUpdated: document.querySelector('meta[property="og:updated_time"]')?.getAttribute('content'),
    datePublished: document.querySelector('meta[name="datePublished"]')?.getAttribute('content'),
    dateModified: document.querySelector('meta[name="dateModified"]')?.getAttribute('content'),
    pubdate: document.querySelector('meta[name="pubdate"]')?.getAttribute('content'),
    schemaDatePublished: null,
    schemaDateModified: null,
    visibleDate: null,
    urlDate: null,
  };
  
  // Check schema.org dates
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  schemas.forEach(schema => {
    try {
      const data = JSON.parse(schema.textContent);
      if (data.datePublished) dateSources.schemaDatePublished = data.datePublished;
      if (data.dateModified) dateSources.schemaDateModified = data.dateModified;
    } catch (e) {}
  });
  
  // Check for visible dates
  const dateSelectors = [
    'time[datetime]', '[class*="date"]', '[class*="published"]',
    '[class*="posted"]', '[class*="updated"]', '.post-date',
    '.entry-date', '.article-date', '.byline time', '.meta time',
  ];
  
  dateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const datetime = el.getAttribute('datetime');
      const text = el.textContent.trim();
      if (datetime) dateSources.visibleDate = datetime;
      else if (text && text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/)) {
        dateSources.visibleDate = text;
      }
    });
  });
  
  // Check URL for date patterns
  const urlDatePatterns = [
    /\/(\d{4})\/(\d{2})\/(\d{2})\//,
    /\/(\d{4})\/(\d{2})\//,
    /(\d{4})[\/\-](\d{2})[\/\-](\d{2})/,
  ];
  
  urlDatePatterns.forEach(pattern => {
    const match = url.match(pattern);
    if (match) {
      if (match.length >= 4) {
        dateSources.urlDate = `${match[1]}-${match[2]}-${match[3]}`;
      } else if (match.length >= 3) {
        dateSources.urlDate = `${match[1]}-${match[2]}-01`;
      }
    }
  });
  
  // Analyze freshness
  const today = new Date();
  let latestDate = null;
  let ageInDays = null;
  let freshness = 'Unknown';
  
  const allDates = [
    dateSources.articleModified,
    dateSources.articlePublished,
    dateSources.schemaDateModified,
    dateSources.schemaDatePublished,
    dateSources.dateModified,
    dateSources.datePublished,
    dateSources.ogUpdated,
    dateSources.visibleDate,
    dateSources.urlDate,
  ].filter(Boolean);
  
  if (allDates.length > 0) {
    latestDate = new Date(Math.max(...allDates.map(d => new Date(d))));
    const diffTime = Math.abs(today - latestDate);
    ageInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 7) freshness = '🟢 Fresh (Last 7 days)';
    else if (ageInDays < 30) freshness = '🟡 Recent (Last 30 days)';
    else if (ageInDays < 90) freshness = '🟠 Somewhat Fresh';
    else if (ageInDays < 365) freshness = '🔴 Stale (Over 90 days)';
    else freshness = '⚫ Very Stale (Over 1 year)';
  }
  
  content.appendChild(createToolHeader(
    '📅 Publication Date Checker',
    'Analyze content freshness and date signals'
  ));
  
  // Freshness indicator
  const freshnessColor = ageInDays ? 
    (ageInDays < 30 ? DT.colors.success : ageInDays < 90 ? DT.colors.warning : DT.colors.error) 
    : DT.colors.textMuted;
  
  const freshnessCard = createElement('div', {
    styles: {
      textAlign: 'center',
      padding: '24px',
      background: ageInDays ? 
        (ageInDays < 30 ? DT.colors.successLight : ageInDays < 90 ? DT.colors.warningLight : DT.colors.errorLight)
        : DT.colors.surfaceSecondary,
      borderRadius: DT.radii.lg,
      marginBottom: '20px',
      border: `2px solid ${freshnessColor}30`,
    },
    children: [
      createElement('div', {
        styles: { fontSize: DT.typography.sizes['3xl'], fontWeight: DT.typography.weights.extrabold, color: freshnessColor, marginBottom: '8px' },
        text: freshness,
      }),
      latestDate ? createElement('div', {
        styles: { fontSize: DT.typography.sizes.md, color: DT.colors.textSecondary },
        text: `Latest Date: ${latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      }) : null,
      ageInDays ? createElement('div', {
        styles: { fontSize: DT.typography.sizes.base, color: DT.colors.textMuted, marginTop: '4px' },
        text: `${ageInDays} days ago`,
      }) : null,
    ].filter(Boolean),
  });
  
  content.appendChild(freshnessCard);
  
  // Date sources table
  const sourcesSection = createSection('📋 Date Sources Found', [
    createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
      children: Object.entries(dateSources).map(([key, value]) => {
        const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        return createElement('div', {
          styles: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', background: DT.colors.surface,
            border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
          },
          children: [
            createElement('span', {
              styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.medium, color: DT.colors.textPrimary },
              text: cleanKey,
            }),
            createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.sm,
                color: value ? DT.colors.success : DT.colors.textMuted,
                fontWeight: DT.typography.weights.semibold,
              },
              text: value || 'Not found',
            }),
          ],
        });
      }),
    }),
  ]);
  
  content.appendChild(sourcesSection);
  
  // Google cache button
  content.appendChild(createButton('🔍 Check Google Cache', () => {
    window.open(`https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`, '_blank');
  }, { variant: 'secondary' }));
  
  const { close } = createModal('Publication Date Checker', content, { width: '600px' });
}

// ==================== TOOL: MOBILE USABILITY TEST ====================

function toolTestMobileUsability() {
  const content = createElement('div');
  
  const url = window.location.href;
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const fontSize = window.getComputedStyle(document.body).fontSize;
  const buttons = document.querySelectorAll('button, a, [role="button"], .btn');
  const images = document.querySelectorAll('img');
  
  let smallTapTargets = 0;
  let closeTapTargets = 0;
  
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) smallTapTargets++;
  });
  
  for (let i = 0; i < buttons.length - 1; i++) {
    const rect1 = buttons[i].getBoundingClientRect();
    const rect2 = buttons[i + 1]?.getBoundingClientRect();
    if (rect2) {
      const distance = Math.sqrt(Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2));
      if (distance < 32) closeTapTargets++;
    }
  }
  
  let imagesWithoutDimensions = 0;
  images.forEach(img => {
    if (!img.width || !img.height) imagesWithoutDimensions++;
  });
  
  const bodyFontSize = parseFloat(fontSize);
  const isFontReadable = bodyFontSize >= 16;
  const hasViewport = viewport.length > 0;
  const isViewportCorrect = viewport.includes('width=device-width') && viewport.includes('initial-scale=1');
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
  
  let score = 100;
  if (!hasViewport) score -= 20;
  if (!isViewportCorrect) score -= 10;
  if (!isFontReadable) score -= 10;
  if (smallTapTargets > 0) score -= Math.min(20, smallTapTargets * 2);
  if (closeTapTargets > 0) score -= 10;
  if (hasHorizontalScroll) score -= 15;
  if (imagesWithoutDimensions > 0) score -= Math.min(15, imagesWithoutDimensions * 3);
  
  score = Math.max(0, score);
  
  const getScoreGrade = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Poor';
  };
  
  content.appendChild(createToolHeader(
    '📱 Mobile Usability Test',
    `Score: ${score}/100 - ${getScoreGrade(score)}`
  ));
  
  // Score ring
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Viewport', value: hasViewport ? '✅' : '❌', icon: '📱', color: hasViewport ? DT.colors.success : DT.colors.error },
    { label: 'Font Size', value: `${bodyFontSize}px`, icon: '🔤', color: isFontReadable ? DT.colors.success : DT.colors.warning },
    { label: 'Small Taps', value: smallTapTargets, icon: '👆', color: smallTapTargets === 0 ? DT.colors.success : DT.colors.error },
    { label: 'H-Scroll', value: hasHorizontalScroll ? '❌' : '✅', icon: '↔️', color: !hasHorizontalScroll ? DT.colors.success : DT.colors.error },
  ]));
  
  // Priority fixes
  const fixes = [];
  if (!hasViewport) fixes.push('Add viewport meta tag');
  if (!isViewportCorrect) fixes.push('Fix viewport configuration');
  if (!isFontReadable) fixes.push('Increase body font size to at least 16px');
  if (smallTapTargets > 0) fixes.push(`Increase size of ${smallTapTargets} tap targets to 44×44px`);
  if (closeTapTargets > 0) fixes.push('Add more spacing between tap targets');
  if (hasHorizontalScroll) fixes.push('Fix horizontal scrolling issue');
  if (imagesWithoutDimensions > 0) fixes.push('Add width/height to images to prevent layout shift');
  
  if (fixes.length > 0) {
    content.appendChild(createSection('⚠️ Priority Fixes', [
      createElement('ul', {
        styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
        html: fixes.map(f => `<li>${f}</li>`).join(''),
      }),
    ]));
  } else {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: { padding: '20px', background: DT.colors.successLight, borderRadius: DT.radii.md, textAlign: 'center', color: '#166534', fontWeight: DT.typography.weights.semibold },
        text: '✅ No mobile usability issues detected! Great job!',
      }),
    ]));
  }
  
  content.appendChild(createButton('🔍 Google Mobile-Friendly Test', () => {
    window.open(`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`, '_blank');
  }, { variant: 'primary' }));
  
  const { close } = createModal('Mobile Usability Test', content, { width: '600px' });
}

// ==================== TOOL: AI META TAG GENERATOR ====================

function toolGenerateAIMeta() {
  const content = GDI.createElement('div');

  // ─── DATA EXTRACTION ───
  const pageTitle = document.title || '';
  const h1 = document.querySelector('h1')?.textContent?.trim() || pageTitle;
  const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
  const ogDesc = document.querySelector('meta[property="og:description"]')?.content || '';
  const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
  const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content || '';
  
  const firstParagraph = document.querySelector('article p, main p, .content p, p')?.textContent?.trim().substring(0, 300) || '';
  const bodyText = document.body?.innerText?.substring(0, 5000) || '';
  const url = window.location.href;
  const domain = window.location.hostname.replace(/^www\./, '');
  const pathname = window.location.pathname;

  // ─── KEYWORD EXTRACTION (TF-IDF style) ───
  const stopWords = new Set(['the','and','for','with','that','this','from','have','are','was','were','been','have','has','had','will','would','could','should','may','might','must','shall','can','need','dare','ought','used','to','of','in','on','at','by','as','is','it','be','or','an','a','if','up','out','do','does','did','done','get','got','go','went','gone','see','saw','seen','know','knew','known','take','took','taken','come','came','make','made','say','said','tell','told','think','thought','look','looked','use','used','find','found','give','gave','given','work','worked','call','called','try','tried','ask','asked','need','needed','feel','felt','become','became','leave','left','put','mean','meant','keep','kept','let','begin','began','seem','seemed','help','helped','show','showed','hear','heard','play','played','run','ran','move','moved','live','lived','believe','believed','bring','brought','happen','happened','write','wrote','written','provide','provided','sit','sat','stand','stood','lose','lost','pay','paid','meet','met','include','included','continue','continued','set','learn','learned','learnt','change','changed','lead','led','understand','understood','watch','watched','follow','followed','stop','stopped','create','created','speak','spoke','spoken','read','allow','allowed','add','added','spend','spent','grow','grew','grown','open','opened','walk','walked','win','won','offer','offered','remember','remembered','love','loved','consider','considered','appear','appeared','buy','bought','wait','waited','serve','served','die','died','send','sent','expect','expected','build','built','stay','stayed','fall','fell','fallen','cut','reach','reached','kill','killed','remain','remained','suggest','suggested','raise','raised','pass','passed','sell','sold','require','required','report','reported','decide','decided','pull','pulled']);
  
  // Extract phrases (bigrams + unigrams)
  const words = bodyText.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i+1]}`);
  }
  
  const freq = {};
  words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w]||0)+1; });
  bigrams.forEach(b => { if (!b.split(' ').some(w => stopWords.has(w))) freq[b] = (freq[b]||0)+2; });
  
  const topKeywords = Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 15)
    .map(([word]) => word);

  // ─── TITLE GENERATION ENGINE ───
  const year = new Date().getFullYear();
  const capitalizedKeywords = topKeywords.slice(0,3).map(k => 
    k.split(' ').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ')
  );
  
  const titleTemplates = [
    { text: `${h1} | ${domain}`, score: 92, reason: 'Brand + H1' },
    { text: `${h1}: Complete Guide (${year})`, score: 90, reason: 'Guide format' },
    { text: `${h1} — Everything You Need to Know [${year}]`, score: 88, reason: 'Comprehensive' },
    { text: `How to ${h1} Like a Pro: ${capitalizedKeywords[0] || 'Expert'} Tips`, score: 86, reason: 'How-to + expert' },
    { text: `${capitalizedKeywords.slice(0,2).join(' & ')}: The Ultimate ${h1} Resource`, score: 84, reason: 'Keyword-rich' },
    { text: `${h1} for Beginners: Step-by-Step Tutorial`, score: 82, reason: 'Beginner-targeted' },
    { text: `${year} ${h1} Guide: ${capitalizedKeywords[0] || 'Best'} Strategies`, score: 80, reason: 'Year + strategies' },
    { text: `Why ${h1} Matters More Than Ever in ${year}`, score: 78, reason: 'Trend/urgency' },
    { text: `${h1} vs Alternatives: Which is Right for You?`, score: 76, reason: 'Comparison' },
    { text: `${capitalizedKeywords[0] || h1} Secrets: What Experts Won't Tell You`, score: 74, reason: 'Curiosity gap' },
  ];

  // Score titles by length optimization
  titleTemplates.forEach(t => {
    const len = t.text.length;
    if (len < 30) t.score -= 5;
    if (len > 60) t.score -= Math.min(15, (len - 60));
    if (len >= 50 && len <= 60) t.score += 3;
  });
  titleTemplates.sort((a,b) => b.score - a.score);

  // ─── DESCRIPTION GENERATION ───
  const descTemplates = [
    { text: `Discover ${h1} with our comprehensive ${year} guide. Learn ${topKeywords.slice(0,3).join(', ')} strategies, expert tips, and actionable insights to achieve your goals.`, score: 94 },
    { text: `${firstParagraph.substring(0,100)}${firstParagraph.length>100?'...':''} Explore ${h1} best practices, ${topKeywords.slice(0,2).join(' & ')} techniques, and proven methods for success.`, score: 90 },
    { text: `Looking for ${h1} advice? Our detailed guide covers ${topKeywords.slice(0,4).join(', ')} and more. Start optimizing your approach today with expert-backed strategies.`, score: 88 },
    { text: `Master ${h1} with this complete resource. Includes ${topKeywords.slice(0,3).join(', ')} frameworks, real examples, and step-by-step instructions for immediate results.`, score: 86 },
    { text: `The ultimate ${h1} guide for ${year}. Understand ${topKeywords[0] || 'key concepts'}, avoid common mistakes, and implement winning strategies from industry leaders.`, score: 84 },
  ];
  
  descTemplates.forEach(d => {
    const len = d.text.length;
    if (len < 120) d.score -= 3;
    if (len > 160) d.score -= Math.min(10, (len - 160));
    if (len >= 150 && len <= 160) d.score += 2;
  });
  descTemplates.sort((a,b) => b.score - a.score);

  // ─── HEADER ───
  content.appendChild(createToolHeader(
    '🤖 AI Meta Tag Generator',
    'AI-optimized SEO suggestions based on live content analysis',
    'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'
  ));

  // ─── SEO AUDIT PANEL ───
  const auditPanel = GDI.createElement('div', {
    styles: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px', marginBottom: '20px'
    }
  });

  const auditItems = [
    { label: 'Title Length', value: pageTitle.length, optimal: [50,60], unit: 'chars' },
    { label: 'Description Length', value: metaDesc.length, optimal: [150,160], unit: 'chars' },
    { label: 'H1 Present', value: document.querySelector('h1') ? '✅ Yes' : '❌ No', isText: true, good: !!document.querySelector('h1') },
    { label: 'Canonical URL', value: canonical ? '✅ Set' : '❌ Missing', isText: true, good: !!canonical },
    { label: 'OG Tags', value: ogTitle && ogDesc ? '✅ Complete' : '⚠️ Partial', isText: true, good: !!(ogTitle && ogDesc) },
    { label: 'Twitter Card', value: twitterCard || '❌ Missing', isText: true, good: !!twitterCard },
  ];

  auditItems.forEach(item => {
    const isGood = item.isText ? item.good : 
      (item.value >= item.optimal[0] && item.value <= item.optimal[1]);
    const color = isGood ? DT.colors.success : item.isText ? DT.colors.error : DT.colors.warning;
    
    auditPanel.appendChild(GDI.createElement('div', {
      styles: {
        padding: '12px 14px', background: DT.colors.surface,
        borderRadius: DT.radii.md, border: `1px solid ${color}30`,
        display: 'flex', flexDirection: 'column', gap: '4px'
      },
      children: [
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: DT.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' },
          text: item.label 
        }),
        GDI.createElement('span', { 
          styles: { fontSize: '18px', fontWeight: '700', color },
          text: item.isText ? item.value : `${item.value} ${item.unit}` 
        })
      ]
    }));
  });
  content.appendChild(auditPanel);

  // ─── CURRENT META SECTION ───
  const currentSection = createSection('📊 Current Meta Tags', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '12px' } }),
  ]);

  const metaItems = [
    { label: 'Title Tag', value: pageTitle, optimal: [50,60] },
    { label: 'Meta Description', value: metaDesc, optimal: [150,160] },
    { label: 'OG Title', value: ogTitle, optimal: [50,60] },
    { label: 'OG Description', value: ogDesc, optimal: [150,160] },
  ];

  metaItems.forEach(item => {
    const len = item.value.length;
    const statusColor = !item.value ? DT.colors.error :
      len >= item.optimal[0] && len <= item.optimal[1] ? DT.colors.success : DT.colors.warning;
    
    currentSection.querySelector('div').appendChild(
      GDI.createElement('div', {
        styles: {
          padding: '14px', background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
        },
        children: [
          GDI.createElement('div', {
            styles: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' },
            children: [
              GDI.createElement('span', { 
                styles: { fontWeight: '600', fontSize: '13px', color: DT.colors.textPrimary },
                text: item.label 
              }),
              GDI.createElement('span', { 
                styles: { fontSize: '11px', color: statusColor, fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: `${statusColor}15` },
                text: `${len} chars${!item.value ? ' — Missing' : len < item.optimal[0] ? ' — Too short' : len > item.optimal[1] ? ' — Too long' : ' — Optimal'}`
              }),
            ],
          }),
          GDI.createElement('div', {
            styles: { fontSize: '13px', color: item.value ? DT.colors.textSecondary : DT.colors.error, lineHeight: '1.5', wordBreak: 'break-word', fontStyle: item.value ? 'normal' : 'italic' },
            text: item.value || 'Not set — search engines may auto-generate this from page content',
          }),
        ],
      })
    );
  });
  content.appendChild(currentSection);

  // ─── TITLE SUGGESTIONS ───
  const titleSection = createSection('📝 AI Title Suggestions', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '10px' } }),
  ]);

  titleTemplates.forEach((title, i) => {
    const card = GDI.createElement('div', {
      styles: {
        padding: '14px 16px',
        background: i === 0 ? `${DT.colors.success}08` : DT.colors.surface,
        border: `2px solid ${i === 0 ? DT.colors.success : DT.colors.border}`,
        borderRadius: DT.radii.md,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '12px', transition: 'all 0.2s', cursor: 'pointer'
      }
    });

    card.addEventListener('mouseenter', () => {
      if (i !== 0) card.style.borderColor = DT.colors.primary;
    });
    card.addEventListener('mouseleave', () => {
      if (i !== 0) card.style.borderColor = DT.colors.border;
    });

    const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
    
    info.appendChild(GDI.createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
      children: [
        i === 0 ? createBadge('🏆 Best Match', 'success') : null,
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: DT.colors.textMuted, fontWeight: '500' },
          text: `Score ${title.score}% • ${title.reason}` 
        }),
        GDI.createElement('span', {
          styles: {
            fontSize: '11px', fontWeight: '700',
            color: title.text.length > 60 ? DT.colors.error : title.text.length < 50 ? DT.colors.warning : DT.colors.success,
            padding: '2px 6px', borderRadius: '4px', background: `${title.text.length > 60 ? DT.colors.error : title.text.length < 50 ? DT.colors.warning : DT.colors.success}15`
          },
          text: `${title.text.length} chars`
        }),
      ].filter(Boolean),
    }));

    info.appendChild(GDI.createElement('div', {
      styles: { fontSize: '14px', color: DT.colors.textPrimary, lineHeight: '1.5', wordBreak: 'break-word' },
      text: title.text,
    }));

    const copyBtn = createButton('Copy', () => {
      copyToClipboard(title.text).then(() => showNotification('✅ Title copied to clipboard!', 'success'));
    }, { variant: i === 0 ? 'primary' : 'secondary', fullWidth: false, size: 'sm' });

    card.appendChild(info);
    card.appendChild(copyBtn);
    titleSection.querySelector('div').appendChild(card);
  });
  content.appendChild(titleSection);

  // ─── DESCRIPTION SUGGESTIONS ───
  const descSection = createSection('📄 AI Meta Descriptions', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '10px' } }),
  ]);

  descTemplates.forEach((desc, i) => {
    const card = GDI.createElement('div', {
      styles: {
        padding: '14px 16px',
        background: i === 0 ? `${DT.colors.info}08` : DT.colors.surface,
        border: `2px solid ${i === 0 ? DT.colors.info : DT.colors.border}`,
        borderRadius: DT.radii.md,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '12px', transition: 'all 0.2s', cursor: 'pointer'
      }
    });

    card.addEventListener('mouseenter', () => {
      if (i !== 0) card.style.borderColor = DT.colors.primary;
    });
    card.addEventListener('mouseleave', () => {
      if (i !== 0) card.style.borderColor = DT.colors.border;
    });

    const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
    
    info.appendChild(GDI.createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
      children: [
        i === 0 ? createBadge('🏆 Best Match', 'info') : null,
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: DT.colors.textMuted, fontWeight: '500' },
          text: `Score ${desc.score}%` 
        }),
        GDI.createElement('span', {
          styles: {
            fontSize: '11px', fontWeight: '700',
            color: desc.text.length > 160 ? DT.colors.error : desc.text.length < 120 ? DT.colors.warning : DT.colors.success,
            padding: '2px 6px', borderRadius: '4px', background: `${desc.text.length > 160 ? DT.colors.error : desc.text.length < 120 ? DT.colors.warning : DT.colors.success}15`
          },
          text: `${desc.text.length} chars`
        }),
      ].filter(Boolean),
    }));

    info.appendChild(GDI.createElement('div', {
      styles: { fontSize: '13px', color: DT.colors.textSecondary, lineHeight: '1.6' },
      text: desc.text,
    }));

    const copyBtn = createButton('Copy', () => {
      copyToClipboard(desc.text).then(() => showNotification('✅ Description copied to clipboard!', 'success'));
    }, { variant: i === 0 ? 'primary' : 'secondary', fullWidth: false, size: 'sm' });

    card.appendChild(info);
    card.appendChild(copyBtn);
    descSection.querySelector('div').appendChild(card);
  });
  content.appendChild(descSection);

  // ─── KEYWORDS TAG CLOUD ───
  content.appendChild(createSection('🎯 Top Keywords Detected', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
      children: topKeywords.map((kw, i) => {
        const size = i < 3 ? '14px' : i < 8 ? '13px' : '12px';
        const weight = i < 5 ? '700' : '500';
        const opacity = 1 - (i * 0.04);
        return GDI.createElement('span', {
          styles: {
            padding: '6px 14px',
            background: i < 3 ? DT.colors.primary : `${DT.colors.primary}15`,
            color: i < 3 ? '#FFFFFF' : DT.colors.primary,
            borderRadius: DT.radii.full,
            fontSize: size,
            fontWeight: weight,
            opacity,
            cursor: 'pointer',
            transition: 'transform 0.2s',
          },
          text: kw,
        });
      }),
    }),
  ]));

  // ─── FULL META BUNDLE COPY ───
  const bundleSection = GDI.createElement('div', {
    styles: {
      marginTop: '20px', padding: '16px',
      background: `${DT.colors.success}08`, border: `2px dashed ${DT.colors.success}`,
      borderRadius: DT.radii.md, textAlign: 'center'
    }
  });

  bundleSection.appendChild(GDI.createElement('div', {
    styles: { fontSize: '14px', fontWeight: '600', color: DT.colors.textPrimary, marginBottom: '12px' },
    text: '📋 Copy Complete Meta Tag Bundle'
  }));

  const copyBundleBtn = createButton('Copy Title + Description + Keywords', () => {
    const bundle = `<title>${titleTemplates[0].text}</title>
<meta name="description" content="${descTemplates[0].text}">
<meta name="keywords" content="${topKeywords.slice(0,10).join(', ')}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${titleTemplates[0].text}">
<meta property="og:description" content="${descTemplates[0].text}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${titleTemplates[0].text}">
<meta name="twitter:description" content="${descTemplates[0].text}">`;
    copyToClipboard(bundle).then(() => showNotification('✅ Full meta bundle copied!', 'success'));
  }, { variant: 'success', size: 'md' });
  copyBundleBtn.style.width = '100%';

  bundleSection.appendChild(copyBundleBtn);
  content.appendChild(bundleSection);

  const { close } = createModal('AI Meta Tag Generator', content, { width: '800px' });
}

// ==================== TOOL: AI ALT TEXT GENERATOR ====================

function toolGenerateAltText() {
  const content = GDI.createElement('div');

  // ─── IMAGE EXTRACTION ───
  const allImages = Array.from(document.querySelectorAll('img, [role="img"], svg'));
  const imageData = [];

  allImages.forEach((el, index) => {
    let src = '', width = 0, height = 0, tagName = el.tagName.toLowerCase();
    let existingAlt = '', isDecorative = false, isSVG = false;
    
    if (tagName === 'img') {
      src = el.currentSrc || el.src || el.getAttribute('data-src') || el.getAttribute('data-lazy-src') || '';
      width = el.naturalWidth || el.width || 0;
      height = el.naturalHeight || el.height || 0;
      existingAlt = el.getAttribute('alt') || '';
      isDecorative = el.getAttribute('role') === 'presentation' || el.getAttribute('aria-hidden') === 'true';
    } else if (tagName === 'svg') {
      src = 'SVG inline';
      isSVG = true;
      const viewBox = el.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(' ').map(Number);
        width = parts[2] || 0; height = parts[3] || 0;
      }
      existingAlt = el.querySelector('title')?.textContent || el.getAttribute('aria-label') || '';
    }

    const filename = src ? src.split('/').pop()?.split('?')[0]?.split('#')[0] || `image-${index+1}` : `element-${index+1}`;
    const nameClean = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\d{4,}/g, '').trim();
    
    // Context analysis
    const parent = el.closest('figure, article, section, div, a, picture');
    const figcaption = el.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || '';
    const nearbyHeadings = [];
    let sibling = el;
    for (let i = 0; i < 3 && sibling; i++) {
      sibling = sibling.previousElementSibling;
      if (sibling?.matches('h1,h2,h3,h4,h5,h6')) nearbyHeadings.push(sibling.textContent.trim());
    }
    
    const contextText = (parent?.textContent?.trim() || '').substring(0, 300);
    const ariaLabel = el.getAttribute('aria-label') || '';

    // Generate suggestion
    let suggestion = '', confidence = 0, source = '';

    if (existingAlt && existingAlt.length > 5 && !existingAlt.match(/^(image|picture|photo|img|pic)\s*\d*$/i)) {
      suggestion = existingAlt;
      confidence = 95;
      source = 'Existing alt';
    } else if (ariaLabel) {
      suggestion = ariaLabel;
      confidence = 90;
      source = 'ARIA label';
    } else if (figcaption) {
      suggestion = figcaption.substring(0, 125);
      confidence = 85;
      source = 'Caption';
    } else if (nearbyHeadings.length > 0) {
      suggestion = `Illustration: ${nearbyHeadings[0].substring(0, 100)}`;
      confidence = 70;
      source = 'Heading context';
    } else if (contextText.length > 20) {
      const words = contextText.split(/\s+/).filter(w => w.length > 3).slice(0, 8);
      suggestion = `Image showing ${words.join(' ')}`.substring(0, 125);
      confidence = 55;
      source = 'Page context';
    } else if (nameClean.length > 2) {
      suggestion = nameClean.replace(/([A-Z])/g, ' $1').replace(/\s+/g, ' ').trim().substring(0, 125);
      confidence = 40;
      source = 'Filename';
    } else {
      suggestion = `Content image ${index + 1}`;
      confidence = 25;
      source = 'Generic';
    }

    // Clean up suggestion
    suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    if (suggestion.length > 125) suggestion = suggestion.substring(0, 122) + '...';
    if (isDecorative) {
      suggestion = '[Decorative image — no alt needed]';
      confidence = 100;
      source = 'Decorative';
    }

    imageData.push({
      index: index + 1,
      element: el,
      src,
      filename,
      width,
      height,
      existingAlt,
      suggestion,
      confidence,
      source,
      needsAlt: !isDecorative && (!existingAlt || existingAlt.length < 5 || existingAlt.match(/^(image|picture|photo|img|pic)\s*\d*$/i)),
      isDecorative,
      isSVG,
      figcaption,
      nearbyHeadings
    });
  });

  const needsAlt = imageData.filter(i => i.needsAlt);
  const hasAlt = imageData.filter(i => !i.needsAlt && !i.isDecorative);
  const decorative = imageData.filter(i => i.isDecorative);

  // ─── HEADER ───
  content.appendChild(createToolHeader(
    '🖼️ AI Alt Text Generator',
    `${imageData.length} images analyzed • ${needsAlt.length} need attention`,
    'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  ));

  // ─── STATS ───
  content.appendChild(createStatGrid([
    { label: 'Total Images', value: imageData.length.toString(), icon: '🖼️', color: DT.colors.primary },
    { label: 'Need Alt Text', value: needsAlt.length.toString(), icon: '⚠️', color: DT.colors.warning },
    { label: 'Have Alt Text', value: hasAlt.length.toString(), icon: '✅', color: DT.colors.success },
    { label: 'Decorative', value: decorative.length.toString(), icon: '✨', color: DT.colors.info },
  ]));

  // ─── FILTER TABS ───
  let activeFilter = 'all';
  const tabsContainer = GDI.createElement('div', {
    styles: { display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }
  });

  const filters = [
    { key: 'all', label: `All (${imageData.length})` },
    { key: 'needs', label: `Needs Alt (${needsAlt.length})` },
    { key: 'has', label: `Has Alt (${hasAlt.length})` },
    { key: 'decorative', label: `Decorative (${decorative.length})` },
  ];

  const tabButtons = [];
  filters.forEach(f => {
    const btn = GDI.createElement('button', {
      styles: {
        padding: '8px 16px', borderRadius: DT.radii.md, border: 'none',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        background: activeFilter === f.key ? DT.colors.primary : DT.colors.surface,
        color: activeFilter === f.key ? '#fff' : DT.colors.textSecondary,
        transition: 'all 0.2s'
      },
      text: f.label
    });
    btn.addEventListener('click', () => {
      activeFilter = f.key;
      tabButtons.forEach(b => {
        b.style.background = b === btn ? DT.colors.primary : DT.colors.surface;
        b.style.color = b === btn ? '#fff' : DT.colors.textSecondary;
      });
      renderImageList();
    });
    tabButtons.push(btn);
    tabsContainer.appendChild(btn);
  });
  content.appendChild(tabsContainer);

  // ─── IMAGE LIST CONTAINER ───
  const listContainer = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }
  });
  content.appendChild(listContainer);

  // ─── RENDER FUNCTION ───
  const renderImageList = () => {
    listContainer.innerHTML = '';

    let filtered = imageData;
    if (activeFilter === 'needs') filtered = needsAlt;
    else if (activeFilter === 'has') filtered = hasAlt;
    else if (activeFilter === 'decorative') filtered = decorative;

    if (filtered.length === 0) {
      listContainer.appendChild(GDI.createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: DT.colors.textMuted, fontSize: '14px' },
        text: 'No images match this filter.'
      }));
      return;
    }

    filtered.forEach(item => {
      const card = GDI.createElement('div', {
        styles: {
          padding: '14px', background: DT.colors.surface,
          border: `1px solid ${item.needsAlt ? DT.colors.warning : item.isDecorative ? DT.colors.info : DT.colors.success}30`,
          borderRadius: DT.radii.md,
          borderLeft: `4px solid ${item.needsAlt ? DT.colors.warning : item.isDecorative ? DT.colors.info : DT.colors.success}`,
        }
      });

      // Header row
      const header = GDI.createElement('div', {
        styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }
      });

      // Thumbnail
      const thumbWrap = GDI.createElement('div', {
        styles: {
          width: '60px', height: '60px', borderRadius: DT.radii.sm,
          background: '#F1F5F9', overflow: 'hidden', flexShrink: '0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${DT.colors.border}`
        }
      });

      if (item.isSVG) {
        thumbWrap.innerHTML = '<span style="font-size:20px">🔷</span>';
      } else if (item.src && item.src.startsWith('http')) {
        const thumb = GDI.createElement('img', {
          attrs: { src: item.src, loading: 'lazy' },
          styles: { width: '100%', height: '100%', objectFit: 'cover' }
        });
        thumb.onerror = () => { thumbWrap.innerHTML = '<span style="font-size:20px;opacity:0.4">🖼️</span>'; };
        thumbWrap.appendChild(thumb);
      } else {
        thumbWrap.innerHTML = '<span style="font-size:20px;opacity:0.4">🖼️</span>';
      }
      header.appendChild(thumbWrap);

      // Meta info
      const meta = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
      
      meta.appendChild(GDI.createElement('div', {
        styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
        children: [
          GDI.createElement('span', { 
            styles: { fontSize: '12px', fontWeight: '700', color: DT.colors.textPrimary },
            text: `Image #${item.index}` 
          }),
          GDI.createBadge(`${item.confidence}%`, 
            item.confidence > 80 ? 'success' : item.confidence > 50 ? 'warning' : 'error'
          ),
          GDI.createBadge(item.source, 'info'),
          item.width ? GDI.createElement('span', {
            styles: { fontSize: '11px', color: DT.colors.textMuted },
            text: `${item.width}×${item.height}`
          }) : null,
        ].filter(Boolean),
      }));

      meta.appendChild(GDI.createElement('div', {
        styles: { fontSize: '11px', color: DT.colors.textMuted, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        text: item.filename
      }));

      header.appendChild(meta);
      card.appendChild(header);

      // Existing alt display
      if (item.existingAlt && !item.isDecorative) {
        card.appendChild(GDI.createElement('div', {
          styles: { 
            fontSize: '12px', color: DT.colors.textSecondary, marginBottom: '8px',
            padding: '6px 10px', background: DT.colors.background, borderRadius: DT.radii.sm,
            fontStyle: 'italic'
          },
          text: `Current: "${item.existingAlt}"`
        }));
      }

      // Editable suggestion
      if (!item.isDecorative) {
        const inputWrap = GDI.createElement('div', { styles: { marginBottom: '10px' } });
        const input = GDI.createElement('input', {
          attrs: { type: 'text', value: item.suggestion, placeholder: 'Enter alt text...' },
          styles: {
            width: '100%', padding: '10px 12px',
            border: `1.5px solid ${item.needsAlt ? DT.colors.warning : DT.colors.border}`,
            borderRadius: DT.radii.md, fontSize: '13px',
            color: DT.colors.textPrimary, background: DT.colors.background,
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }
        });
        input.addEventListener('focus', () => input.style.borderColor = DT.colors.primary);
        input.addEventListener('blur', () => input.style.borderColor = item.needsAlt ? DT.colors.warning : DT.colors.border);
        inputWrap.appendChild(input);
        card.appendChild(inputWrap);

        // Action buttons
        const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '8px' } });

        btnRow.appendChild(GDI.createButton('✅ Apply', () => {
          const val = input.value.trim();
          if (val) {
            item.element.setAttribute('alt', val);
            item.existingAlt = val;
            item.needsAlt = false;
            GDI.showNotification(`✅ Alt text applied to image #${item.index}`, 'success');
            renderImageList(); // Re-render to update status
          }
        }, { variant: 'primary', fullWidth: true, size: 'sm' }));

        btnRow.appendChild(GDI.createButton('📋 Copy', () => {
          GDI.copyToClipboard(input.value).then(() => GDI.showNotification('✅ Copied to clipboard', 'success'));
        }, { variant: 'secondary', fullWidth: true, size: 'sm' }));

        btnRow.appendChild(GDI.createButton('🎨 Mark Decorative', () => {
          item.element.setAttribute('role', 'presentation');
          item.element.setAttribute('alt', '');
          item.isDecorative = true;
          item.needsAlt = false;
          GDI.showNotification(`✅ Image #${item.index} marked as decorative`, 'info');
          renderImageList();
        }, { variant: 'secondary', fullWidth: true, size: 'sm' }));

        card.appendChild(btnRow);
      } else {
        card.appendChild(GDI.createElement('div', {
          styles: { 
            fontSize: '12px', color: DT.colors.info, fontStyle: 'italic',
            padding: '8px', background: `${DT.colors.info}08`, borderRadius: DT.radii.sm
          },
          text: '✨ This image is marked as decorative (role="presentation"). No alt text needed.'
        }));
      }

      listContainer.appendChild(card);
    });
  };

  renderImageList();

  // ─── BULK ACTIONS ───
  if (needsAlt.length > 0) {
    const bulkRow = GDI.createElement('div', {
      styles: { display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${DT.colors.border}` }
    });

    bulkRow.appendChild(GDI.createButton('✨ Apply All Suggestions', () => {
      let applied = 0;
      needsAlt.forEach(item => {
        if (item.element && !item.isDecorative) {
          item.element.setAttribute('alt', item.suggestion);
          item.existingAlt = item.suggestion;
          item.needsAlt = false;
          applied++;
        }
      });
      GDI.showNotification(`✅ Applied alt text to ${applied} images`, 'success');
      renderImageList();
    }, { variant: 'success' }));

    bulkRow.appendChild(GDI.createButton('📋 Copy All Suggestions', () => {
      const text = needsAlt.map(i => `Image #${i.index}: ${i.suggestion}`).join('\n');
      GDI.copyToClipboard(text).then(() => GDI.showNotification('✅ All suggestions copied', 'success'));
    }, { variant: 'secondary' }));

    content.appendChild(bulkRow);
  }

  const { close } = GDI.createModal('AI Alt Text Generator', content, { width: '720px' });
}

// ==================== TOOL: AI TOPIC GENERATOR ====================

function toolGenerateAITopics() {
  const content = GDI.createElement('div');

  // ─── CONTENT ANALYSIS ───
  const pageTitle = document.title || '';
  const h1 = document.querySelector('h1')?.textContent?.trim() || pageTitle;
  const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()).slice(0, 10);
  const bodyText = document.body?.innerText?.substring(0, 8000) || '';
  const url = window.location.href;
  const domain = window.location.hostname.replace(/^www\./, '');
  const year = new Date().getFullYear();

  // Advanced keyword extraction
  const stopWords = new Set(['the','and','for','with','that','this','from','have','are','was','were','been','have','has','had','will','would','could','should','may','might','must','shall','can','need','dare','ought','used','to','of','in','on','at','by','as','is','it','be','or','an','a','if','up','out','do','does','did','done','get','got','go','went','gone','see','saw','seen','know','knew','known','take','took','taken','come','came','make','made','say','said','tell','told','think','thought','look','looked','use','used','find','found','give','gave','given','work','worked','call','called','try','tried','ask','asked','need','needed','feel','felt','become','became','leave','left','put','mean','meant','keep','kept','let','begin','began','seem','seemed','help','helped','show','showed','hear','heard','play','played','run','ran','move','moved','live','lived','believe','believed','bring','brought','happen','happened','write','wrote','written','provide','provided','sit','sat','stand','stood','lose','lost','pay','paid','meet','met','include','included','continue','continued','set','learn','learned','learnt','change','changed','lead','led','understand','understood','watch','watched','follow','followed','stop','stopped','create','created','speak','spoke','spoken','read','allow','allowed','add','added','spend','spent','grow','grew','grown','open','opened','walk','walked','win','won','offer','offered','remember','remembered','love','loved','consider','considered','appear','appeared','buy','bought','wait','waited','serve','served','die','died','send','sent','expect','expected','build','built','stay','stayed','fall','fell','fallen','cut','reach','reached','kill','killed','remain','remained','suggest','suggested','raise','raised','pass','passed','sell','sold','require','required','report','reported','decide','decided','pull','pulled']);
  
  const words = bodyText.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const bigrams = [];
  const trigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i+1]}`);
    if (i < words.length - 2) trigrams.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
  }

  const freq = {};
  words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w]||0)+1; });
  bigrams.forEach(b => { 
    const parts = b.split(' ');
    if (!parts.some(p => stopWords.has(p))) freq[b] = (freq[b]||0)+3; 
  });
  trigrams.forEach(t => {
    const parts = t.split(' ');
    if (!parts.some(p => stopWords.has(p))) freq[t] = (freq[t]||0)+5;
  });

  const topKeywords = Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 12)
    .map(([word]) => word);

  const kw1 = topKeywords[0] || h1.split(' ')[0] || 'Guide';
  const kw2 = topKeywords[1] || 'Tips';
  const kw3 = topKeywords[2] || 'Strategies';
  const kw4 = topKeywords[3] || 'Tools';
  const kw5 = topKeywords[4] || 'Best Practices';

  // Capitalize helper
  const cap = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // ─── TOPIC DATABASE ───
  const categories = [
    {
      name: '📖 How-To Guides',
      color: DT.colors.success,
      icon: '📖',
      topics: [
        { text: `How to ${h1} Like a Pro: Complete ${cap(kw1)} Guide`, type: 'tutorial', difficulty: 'beginner' },
        { text: `How to Master ${cap(kw1)} in ${year}: Step-by-Step Tutorial`, type: 'tutorial', difficulty: 'intermediate' },
        { text: `${cap(kw1)} for Beginners: Everything You Need to Get Started`, type: 'tutorial', difficulty: 'beginner' },
        { text: `How to ${h1} Faster: ${cap(kw2)} Techniques That Actually Work`, type: 'tutorial', difficulty: 'advanced' },
        { text: `The Ultimate ${cap(kw1)} Checklist for ${year}`, type: 'checklist', difficulty: 'beginner' },
      ]
    },
    {
      name: '📊 Listicles & Roundups',
      color: DT.colors.warning,
      icon: '📊',
      topics: [
        { text: `Top 20 ${cap(kw1)} Tools You Need in ${year}`, type: 'listicle', difficulty: 'beginner' },
        { text: `15 ${cap(kw1)} Mistakes You're Making (And How to Fix Them)`, type: 'listicle', difficulty: 'intermediate' },
        { text: `25 Best ${cap(kw2)} Resources for ${cap(kw1)} Professionals`, type: 'roundup', difficulty: 'beginner' },
        { text: `10 Advanced ${cap(kw1)} Strategies Experts Swear By`, type: 'listicle', difficulty: 'advanced' },
        { text: `7 ${cap(kw1)} Trends Shaping ${year}: What You Need to Know`, type: 'trends', difficulty: 'intermediate' },
      ]
    },
    {
      name: '⚔️ Comparisons & Reviews',
      color: DT.colors.error,
      icon: '⚔️',
      topics: [
        { text: `${cap(kw1)} vs ${cap(kw2)}: Which One Should You Choose?`, type: 'comparison', difficulty: 'intermediate' },
        { text: `${cap(kw1)} Review ${year}: Is It Worth It?`, type: 'review', difficulty: 'beginner' },
        { text: `Free vs Paid ${cap(kw1)}: The Honest Comparison`, type: 'comparison', difficulty: 'beginner' },
        { text: `The Best ${cap(kw1)} Alternatives for ${year} (Tested)`, type: 'review', difficulty: 'intermediate' },
        { text: `${cap(kw1)} for Small Business vs Enterprise: Key Differences`, type: 'comparison', difficulty: 'advanced' },
      ]
    },
    {
      name: '❓ Questions & Answers',
      color: DT.colors.info,
      icon: '❓',
      topics: [
        { text: `What is ${cap(kw1)}? A Comprehensive Introduction`, type: 'explainer', difficulty: 'beginner' },
        { text: `Why ${h1} Matters More Than Ever in ${year}`, type: 'opinion', difficulty: 'intermediate' },
        { text: `Is ${cap(kw1)} Right for You? Here's How to Decide`, type: 'decision', difficulty: 'beginner' },
        { text: `How Much Does ${cap(kw1)} Really Cost? (Full Breakdown)`, type: 'explainer', difficulty: 'intermediate' },
        { text: `What Do ${cap(kw1)} Experts Know That You Don't?`, type: 'insider', difficulty: 'advanced' },
      ]
    },
    {
      name: '📈 Case Studies & Data',
      color: DT.colors.primary,
      icon: '📈',
      topics: [
        { text: `How We Used ${cap(kw1)} to Achieve 300% Growth`, type: 'case-study', difficulty: 'intermediate' },
        { text: `${cap(kw1)} ROI: Real Numbers from Real Businesses`, type: 'data', difficulty: 'advanced' },
        { text: `From Zero to Hero: Our ${cap(kw1)} Success Story`, type: 'case-study', difficulty: 'beginner' },
        { text: `${cap(kw1)} Analytics: What the Data Actually Tells Us`, type: 'data', difficulty: 'advanced' },
        { text: `5 Companies Crushing It With ${cap(kw1)} (Case Studies)`, type: 'case-study', difficulty: 'intermediate' },
      ]
    },
    {
      name: '🔮 Future & Trends',
      color: '#8B5CF6',
      icon: '🔮',
      topics: [
        { text: `The Future of ${cap(kw1)}: Predictions for ${year+1} and Beyond`, type: 'trends', difficulty: 'intermediate' },
        { text: `${cap(kw1)} in ${year}: What's Changed and What's Next`, type: 'trends', difficulty: 'beginner' },
        { text: `AI and ${cap(kw1)}: How Technology is Transforming the Industry`, type: 'trends', difficulty: 'advanced' },
        { text: `Emerging ${cap(kw2)} Trends Every ${cap(kw1)} Professional Should Watch`, type: 'trends', difficulty: 'intermediate' },
        { text: `Will ${cap(kw1)} Still Matter in 5 Years? Experts Weigh In`, type: 'opinion', difficulty: 'intermediate' },
      ]
    }
  ];

  const allTopics = categories.flatMap(c => c.topics);
  const totalTopics = allTopics.length;

  // ─── HEADER ───
  content.appendChild(createToolHeader(
    '💡 AI Topic Generator',
    `${totalTopics} blog topic ideas across ${categories.length} categories`,
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  ));

  // ─── KEYWORD BAR ───
  content.appendChild(createSection('🎯 Extracted Keywords', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
      children: [
        ...topKeywords.slice(0, 10).map((kw, i) => 
          GDI.createElement('span', {
            styles: {
              padding: '6px 14px', background: i < 3 ? DT.colors.primary : `${DT.colors.primary}12`,
              color: i < 3 ? '#fff' : DT.colors.primary, borderRadius: DT.radii.full,
              fontSize: i < 3 ? '14px' : '12px', fontWeight: i < 5 ? '600' : '500',
              cursor: 'pointer', transition: 'transform 0.2s'
            },
            text: kw,
          })
        ),
        GDI.createElement('span', {
          styles: { fontSize: '11px', color: DT.colors.textMuted, marginLeft: '4px' },
          text: `+${topKeywords.length - 10} more`
        })
      ],
    }),
  ]));

  // ─── CATEGORY ACCORDIONS ───
  categories.forEach((cat, catIndex) => {
    const section = createSection(`${cat.icon} ${cat.name}`, [
      GDI.createElement('div', { 
        styles: { display: 'flex', flexDirection: 'column', gap: '10px' } 
      }),
    ]);

    cat.topics.forEach((topic, i) => {
      const card = GDI.createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px', background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
          borderLeft: `4px solid ${cat.color}`,
          transition: 'all 0.2s', cursor: 'pointer', gap: '12px'
        }
      });

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(4px)';
        card.style.borderColor = cat.color;
        card.style.boxShadow = `0 2px 8px ${cat.color}15`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateX(0)';
        card.style.borderColor = DT.colors.border;
        card.style.boxShadow = 'none';
      });

      const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
      
      info.appendChild(GDI.createElement('div', {
        styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
        children: [
          createBadge(topic.type, 'info'),
          createBadge(topic.difficulty, 
            topic.difficulty === 'beginner' ? 'success' : 
            topic.difficulty === 'intermediate' ? 'warning' : 'error'
          ),
          GDI.createElement('span', {
            styles: { fontSize: '11px', color: DT.colors.textMuted },
            text: `${topic.text.length} chars`
          }),
        ],
      }));

      info.appendChild(GDI.createElement('div', {
        styles: { fontSize: '14px', color: DT.colors.textPrimary, lineHeight: '1.5', wordBreak: 'break-word' },
        text: topic.text,
      }));

      const copyBtn = createButton('Copy', () => {
        copyToClipboard(topic.text).then(() => showNotification('✅ Topic copied!', 'success'));
      }, { variant: 'secondary', fullWidth: false, size: 'sm' });

      card.appendChild(info);
      card.appendChild(copyBtn);
      section.querySelector('div').appendChild(card);
    });

    content.appendChild(section);
  });

  // ─── BULK ACTIONS ───
  const actionBar = GDI.createElement('div', {
    styles: {
      display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '20px',
      borderTop: `2px solid ${DT.colors.border}`, flexWrap: 'wrap'
    }
  });

  actionBar.appendChild(createButton('📋 Copy All Topics', () => {
    const text = categories.map(cat => 
      `=== ${cat.name} ===\n${cat.topics.map(t => `• ${t.text}`).join('\n')}`
    ).join('\n\n');
    copyToClipboard(text).then(() => showNotification(`✅ ${totalTopics} topics copied!`, 'success'));
  }, { variant: 'primary' }));

  actionBar.appendChild(createButton('📄 Export as Markdown', () => {
    const md = `# Blog Topic Ideas: ${h1}\n\n*Generated from ${domain} on ${new Date().toLocaleDateString()}*\n\n## Keywords\n${topKeywords.slice(0,8).map(k => `- ${k}`).join('\n')}\n\n${categories.map(cat => `## ${cat.name}\n\n${cat.topics.map((t, i) => `${i+1}. **${t.text}**\n   - Type: ${t.type} | Difficulty: ${t.difficulty}`).join('\n\n')}`).join('\n\n')}`;
    copyToClipboard(md).then(() => showNotification('✅ Markdown exported to clipboard!', 'success'));
  }, { variant: 'secondary' }));

  actionBar.appendChild(createButton('🔄 Regenerate', () => {
    const overlay = document.querySelector('.gdi-modal-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        toolGenerateAITopics();
      }, 200);
    }
  }, { variant: 'secondary' }));

  content.appendChild(actionBar);

  const { close } = createModal('AI Topic Generator', content, { width: '800px' });
}

// ==================== TOOL: LINK PROSPECT FINDER ====================

function toolFindLinkProspects() {
  const content = createElement('div');
  
  const domain = window.location.hostname.replace('www.', '');
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  const mainKeyword = keywords[0] || domain;
  
  const searchQueries = [
    { name: 'Guest Post Opportunities', query: `${mainKeyword} "write for us"` },
    { name: 'Guest Post Guidelines', query: `${mainKeyword} "guest post guidelines"` },
    { name: 'Become a Contributor', query: `${mainKeyword} "become a contributor"` },
    { name: 'Submit Guest Post', query: `${mainKeyword} "submit guest post"` },
    { name: 'Guest Author', query: `${mainKeyword} "guest author"` },
    { name: 'Link Insertion', query: `${mainKeyword} "link insertion"` },
    { name: 'Useful Links', query: `${mainKeyword} "useful links"` },
    { name: 'Helpful Resources', query: `${mainKeyword} "helpful resources"` },
    { name: 'Weekly Roundup', query: `${mainKeyword} "weekly roundup"` },
    { name: 'Expert Roundup', query: `${mainKeyword} "expert roundup"` },
    { name: 'Industry Experts', query: `${mainKeyword} "industry experts"` },
    { name: 'Top Reviews', query: `${mainKeyword} "top" "best" "review"` },
  ];
  
  content.appendChild(createToolHeader(
    '🎯 Link Prospect Finder',
    `Find guest post and link building opportunities for "${mainKeyword}"`
  ));
  
  // Custom keyword input
  const { wrapper: keywordWrapper, input: keywordInput } = createInputField({
    label: '🎯 Target Keyword',
    id: 'prospect-keyword',
    placeholder: 'Enter keyword...',
    defaultValue: mainKeyword,
  });
  
  content.appendChild(createSection('🔧 Settings', [keywordWrapper]));
  
  // Search queries
  const queriesSection = createSection(`📋 Search Queries (${searchQueries.length})`, [
    createElement('div', {
      id: 'prospect-queries',
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
  ]);
  
  function renderQueries(queries) {
    const container = document.getElementById('prospect-queries');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => {
      const row = createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.borderColor = DT.colors.primary;
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.borderColor = DT.colors.border;
      });
      
      row.appendChild(createElement('div', {
        styles: { flex: '1', marginRight: '12px' },
        children: [
          createElement('div', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: DT.colors.textPrimary, marginBottom: '2px' },
            text: sq.name,
          }),
          createElement('div', {
            styles: { fontSize: DT.typography.sizes.sm, color: DT.colors.primary, fontFamily: DT.typography.fontMono },
            text: sq.query,
          }),
        ],
      }));
      
      row.appendChild(createButton('Search', () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(sq.query)}`, '_blank');
      }, { variant: 'secondary', fullWidth: false, size: 'sm' }));
      
      return row;
    }).join('');
    
    // Re-attach event listeners
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.parentElement.querySelector('div:last-child')?.textContent || '';
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      });
    });
  }
  
  content.appendChild(queriesSection);
  renderQueries(searchQueries);
  
  keywordInput.addEventListener('input', debounce(() => {
    const newKeyword = keywordInput.value.trim() || mainKeyword;
    const updatedQueries = searchQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword),
    }));
    renderQueries(updatedQueries);
  }, 300));
  
  // Action buttons
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(createButton('🚀 Open All Queries', () => {
    const queries = document.querySelectorAll('#prospect-queries button');
    const allQueries = Array.from(queries).map(btn => 
      btn.parentElement?.querySelector('div:last-child')?.textContent || ''
    ).filter(Boolean);
    
    allQueries.forEach((query, i) => {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }, i * 300);
    });
    showNotification(`✅ Opening ${allQueries.length} searches...`, 'success');
  }, { variant: 'primary' }));
  
  btnRow.appendChild(createButton('📋 Copy Search URLs', () => {
    const queries = document.querySelectorAll('#prospect-queries button');
    const urls = Array.from(queries).map(btn => {
      const query = btn.parentElement?.querySelector('div:last-child')?.textContent || '';
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    });
    copyToClipboard(urls.join('\n')).then(() => showNotification('✅ URLs copied!', 'success'));
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  // Tips
  content.appendChild(createSection('💡 Prospecting Tips', [
    createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
      html: `
        <li>Look for sites with good DA/DR metrics</li>
        <li>Check if they've published guest posts recently</li>
        <li>Verify the site gets organic traffic</li>
        <li>Review their guest post guidelines carefully</li>
        <li>Personalize your outreach email</li>
      `,
    }),
  ]));
  
  const { close } = createModal('Link Prospect Finder', content, { width: '700px' });
}

// ==================== TOOL: RESOURCE PAGE FINDER ====================

function toolFindResourcePages() {
  const content = createElement('div');
  
  const domain = window.location.hostname.replace('www.', '');
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  const mainKeyword = keywords[0] || domain;
  
  const resourceQueries = [
    { name: 'Resources Page', query: `${mainKeyword} intitle:resources` },
    { name: 'Useful Links', query: `${mainKeyword} "useful links"` },
    { name: 'Helpful Resources', query: `${mainKeyword} "helpful resources"` },
    { name: 'Recommended Links', query: `${mainKeyword} "recommended links"` },
    { name: 'Favorite Sites', query: `${mainKeyword} "favorite sites"` },
    { name: 'Blogroll', query: `${mainKeyword} blogroll` },
    { name: 'Links Page', query: `${mainKeyword} intitle:links` },
    { name: 'Further Reading', query: `${mainKeyword} "further reading"` },
    { name: 'Additional Resources', query: `${mainKeyword} "additional resources"` },
    { name: 'Related Sites', query: `${mainKeyword} "related sites"` },
    { name: 'Sites We Like', query: `${mainKeyword} "sites we like"` },
    { name: 'Our Friends', query: `${mainKeyword} "our friends"` },
  ];
  
  content.appendChild(createToolHeader(
    '📚 Resource Page Finder',
    `Find resource pages for link building with "${mainKeyword}"`
  ));
  
  const { wrapper: kwWrapper, input: kwInput } = createInputField({
    label: '🎯 Target Keyword',
    id: 'resource-keyword',
    placeholder: 'Enter keyword...',
    defaultValue: mainKeyword,
  });
  
  content.appendChild(createSection('🔧 Settings', [kwWrapper]));
  
  const queriesSection = createSection(`📋 Search Queries (${resourceQueries.length})`, [
    createElement('div', {
      id: 'resource-queries',
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
  ]);
  
  function renderQueries(queries) {
    const container = document.getElementById('resource-queries');
    if (!container) return;
    
    container.innerHTML = queries.map(sq => {
      const row = createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: DT.colors.surface,
          border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => row.style.borderColor = DT.colors.primary);
      row.addEventListener('mouseleave', () => row.style.borderColor = DT.colors.border);
      
      row.appendChild(createElement('div', {
        styles: { flex: '1', marginRight: '12px' },
        children: [
          createElement('div', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: DT.colors.textPrimary, marginBottom: '2px' },
            text: sq.name,
          }),
          createElement('div', {
            styles: { fontSize: DT.typography.sizes.sm, color: DT.colors.info, fontFamily: DT.typography.fontMono },
            text: sq.query,
          }),
        ],
      }));
      
      row.appendChild(createButton('Search', () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(sq.query)}`, '_blank');
      }, { variant: 'secondary', fullWidth: false, size: 'sm' }));
      
      return row;
    }).join('');
  }
  
  content.appendChild(queriesSection);
  renderQueries(resourceQueries);
  
  kwInput.addEventListener('input', debounce(() => {
    const newKw = kwInput.value.trim() || mainKeyword;
    const updated = resourceQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKw),
    }));
    renderQueries(updated);
  }, 300));
  
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(createButton('🚀 Open All Queries', () => {
    resourceQueries.forEach((sq, i) => {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(sq.query)}`, '_blank');
      }, i * 300);
    });
    showNotification(`✅ Opening ${resourceQueries.length} searches...`, 'success');
  }, { variant: 'primary' }));
  
  content.appendChild(btnRow);
  
  const { close } = createModal('Resource Page Finder', content, { width: '700px' });
}

// ==================== TOOL: LOCAL KEYWORD FINDER ====================

function toolFindLocalKeywords() {
  const content = createElement('div');
  
  const domain = window.location.hostname.replace(/^www\./, '');
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
  const stopWords = new Set(['about', 'contact', 'services', 'home', 'learn', 'more', 'click', 'here']);
  const keywords = [...new Set(words.filter(w => !stopWords.has(w)))];
  const mainKeyword = keywords[0] || domain.split('.')[0] || 'service';
  
  content.appendChild(createToolHeader(
    '📍 Local Keyword Finder',
    'Generate location-based keyword permutations'
  ));
  
  const { wrapper: kwWrapper, input: kwInput } = createInputField({
    label: 'Main Service / Keyword',
    id: 'local-keyword',
    placeholder: 'e.g., plumber, roof repair, dentist',
    defaultValue: mainKeyword,
  });
  
  const { wrapper: locWrapper, input: locInput } = createInputField({
    label: 'Locations (comma separated)',
    id: 'local-locations',
    placeholder: 'e.g., New York, Brooklyn, Queens',
    defaultValue: 'New York, Los Angeles, Chicago',
  });
  
  content.appendChild(createSection('🔧 Settings', [kwWrapper, locWrapper]));
  
  const resultsContainer = createSection('📍 Generated Keywords', [
    createElement('div', {
      id: 'local-results',
      styles: { display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' },
    }),
  ]);
  
  content.appendChild(resultsContainer);
  
  function generateKeywords(keyword, locationsStr) {
    const locations = locationsStr.split(',').map(l => l.trim()).filter(Boolean);
    if (locations.length === 0) locations.push('New York');
    
    const categories = [
      { name: '📍 Service + Location', keywords: [] },
      { name: '🏢 Commercial / B2B', keywords: [] },
      { name: '🕐 Intent & Cost', keywords: [] },
      { name: '📞 Emergency / Urgent', keywords: [] },
      { name: '🔍 "Near Me" Variations', keywords: [] },
    ];
    
    locations.forEach(city => {
      categories[0].keywords.push(`${keyword} in ${city}`, `best ${keyword} ${city}`, `top ${keyword} ${city}`, `affordable ${keyword} ${city}`, `local ${keyword} ${city}`);
      categories[1].keywords.push(`commercial ${keyword} ${city}`, `${keyword} for business in ${city}`, `corporate ${keyword} ${city}`);
      categories[2].keywords.push(`hire ${keyword} ${city}`, `${keyword} estimate ${city}`, `cost of ${keyword} in ${city}`, `${keyword} free consultation ${city}`);
      categories[3].keywords.push(`emergency ${keyword} ${city}`, `24 hour ${keyword} ${city}`, `same day ${keyword} ${city}`);
      categories[4].keywords.push(`${keyword} near me in ${city}`, `${keyword} near me`, `best ${keyword} near me`);
    });
    
    return categories;
  }
  
  function renderResults(categories) {
    const container = document.getElementById('local-results');
    if (!container) return;
    
    const allKeywords = categories.flatMap(c => c.keywords);
    
    container.innerHTML = categories.map(category => `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid ${DT.colors.border};">
          <span style="font-weight: ${DT.typography.weights.bold}; font-size: ${DT.typography.sizes.base}; color: ${DT.colors.textPrimary};">${category.name}</span>
          <span style="font-size: ${DT.typography.sizes.xs}; color: ${DT.colors.textMuted}; background: ${DT.colors.surfaceTertiary}; padding: 2px 8px; border-radius: ${DT.radii.full}; font-weight: ${DT.typography.weights.bold};">${category.keywords.length} items</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
          ${category.keywords.map(kw => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: ${DT.colors.surface}; border: 1px solid ${DT.colors.border}; border-radius: ${DT.radii.sm}; font-size: ${DT.typography.sizes.sm};">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${DT.colors.textSecondary};">${escapeHtml(kw)}</span>
              <button class="local-copy-btn" data-kw="${escapeHtml(kw)}" style="padding: 4px 8px; background: ${DT.colors.surfaceTertiary}; border: 1px solid ${DT.colors.border}; border-radius: ${DT.radii.sm}; cursor: pointer; font-size: ${DT.typography.sizes.xs}; color: ${DT.colors.textSecondary}; flex-shrink: 0; margin-left: 8px;">Copy</button>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // Store all keywords for bulk copy
    container.dataset.allKeywords = allKeywords.join('\n');
    
    // Attach copy handlers
    container.querySelectorAll('.local-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.kw).then(() => {
          btn.textContent = '✓';
          btn.style.background = DT.colors.success;
          btn.style.color = '#FFFFFF';
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.style.background = DT.colors.surfaceTertiary;
            btn.style.color = DT.colors.textSecondary;
          }, 1500);
        });
      });
    });
  }
  
  const initialCategories = generateKeywords(mainKeyword, 'New York, Los Angeles, Chicago');
  renderResults(initialCategories);
  
  content.appendChild(createButton('🔄 Generate Keywords', () => {
    const kw = kwInput.value.trim() || mainKeyword;
    const locs = locInput.value.trim() || 'New York';
    const categories = generateKeywords(kw, locs);
    renderResults(categories);
    showNotification('✅ Keywords generated!', 'success');
  }, { variant: 'primary' }));
  
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '8px' } });
  
  btnRow.appendChild(createButton('📋 Copy All Keywords', () => {
    const allKw = document.getElementById('local-results')?.dataset.allKeywords || '';
    if (allKw) {
      copyToClipboard(allKw).then(() => showNotification('✅ All keywords copied!', 'success'));
    }
  }, { variant: 'secondary' }));
  
  btnRow.appendChild(createButton('📊 Export CSV', () => {
    const categories = generateKeywords(kwInput.value.trim() || mainKeyword, locInput.value.trim() || 'New York');
    const allKw = categories.flatMap(c => c.keywords);
    const csv = 'Keyword\n' + allKw.map(k => `"${k}"`).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-keywords-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  const { close } = createModal('Local Keyword Finder', content, { width: '750px' });
}

// ==================== TOOL: HREFLANG GENERATOR ====================

function toolGenerateHreflang() {
  const content = createElement('div');
  
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = urlObj.origin + urlObj.pathname;
  
  const languages = [
    { code: 'en', name: 'English', region: null },
    { code: 'en', name: 'English (US)', region: 'us' },
    { code: 'en', name: 'English (UK)', region: 'gb' },
    { code: 'es', name: 'Spanish', region: null },
    { code: 'es', name: 'Spanish (Spain)', region: 'es' },
    { code: 'es', name: 'Spanish (Mexico)', region: 'mx' },
    { code: 'fr', name: 'French', region: null },
    { code: 'fr', name: 'French (France)', region: 'fr' },
    { code: 'de', name: 'German', region: null },
    { code: 'it', name: 'Italian', region: null },
    { code: 'pt', name: 'Portuguese', region: null },
    { code: 'pt', name: 'Portuguese (Brazil)', region: 'br' },
    { code: 'nl', name: 'Dutch', region: null },
    { code: 'ja', name: 'Japanese', region: null },
    { code: 'zh', name: 'Chinese (Simplified)', region: null },
    { code: 'ko', name: 'Korean', region: null },
    { code: 'ar', name: 'Arabic', region: null },
    { code: 'ru', name: 'Russian', region: null },
    { code: 'hi', name: 'Hindi', region: null },
    { code: 'x-default', name: 'Default (Language Selector)', region: null },
  ];
  
  content.appendChild(createToolHeader(
    '🌐 Hreflang Generator',
    'Generate hreflang tags for multilingual SEO'
  ));
  
  // URL pattern
  const { wrapper: urlWrapper, input: urlInput } = createInputField({
    label: 'Base URL Pattern',
    id: 'hreflang-url',
    placeholder: baseUrl,
    defaultValue: baseUrl,
  });
  
  const { wrapper: patternWrapper } = createInputField({
    label: 'URL Pattern',
    id: 'hreflang-pattern',
    type: 'text',
  });
  
  const patternSelect = createElement('select', {
    attrs: { id: 'hreflang-pattern' },
    styles: {
      width: '100%', padding: '10px 14px',
      border: `1.5px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
      fontSize: DT.typography.sizes.base, fontFamily: DT.typography.fontFamily,
      background: DT.colors.surface, color: DT.colors.textPrimary, cursor: 'pointer',
    },
  });
  
  ['Subdirectory: /{lang}/page', 'Subdomain: {lang}.example.com/page', 'Parameter: /page?lang={lang}'].forEach(opt => {
    const option = createElement('option', { attrs: { value: opt.split(':')[0].toLowerCase() }, text: opt });
    patternSelect.appendChild(option);
  });
  
  const patternInput = patternWrapper.querySelector('input');
  if (patternInput) patternInput.replaceWith(patternSelect);
  
  content.appendChild(createSection('🔧 Configuration', [urlWrapper, patternWrapper]));
  
  // Language selection
  const langSection = createSection('🌍 Select Languages', [
    createElement('div', {
      styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '250px', overflowY: 'auto' },
      children: languages.map(lang => {
        const label = createElement('label', {
          styles: {
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
            background: DT.colors.surface, border: `1px solid ${DT.colors.border}`,
            borderRadius: DT.radii.sm, cursor: 'pointer', fontSize: DT.typography.sizes.base,
          },
        });
        
        const checkbox = createElement('input', {
          attrs: { type: 'checkbox', checked: 'true', 'data-code': lang.code, 'data-region': lang.region || '' },
        });
        
        label.appendChild(checkbox);
        label.appendChild(createElement('span', {
          styles: { color: DT.colors.textPrimary },
          text: lang.name,
        }));
        label.appendChild(createElement('span', {
          styles: { color: DT.colors.textMuted, fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
          text: lang.code + (lang.region ? '-' + lang.region : ''),
        }));
        
        return label;
      }),
    }),
  ]);
  
  content.appendChild(langSection);
  
  // Select all / deselect all
  const selectRow = createElement('div', { styles: { display: 'flex', gap: '8px', marginBottom: '16px' } });
  
  selectRow.appendChild(createButton('Select All', () => {
    document.querySelectorAll('#hreflang-url').forEach(cb => cb.checked = true);
  }, { variant: 'secondary', fullWidth: true, size: 'sm' }));
  
  selectRow.appendChild(createButton('Deselect All', () => {
    document.querySelectorAll('#hreflang-url').forEach(cb => cb.checked = false);
  }, { variant: 'secondary', fullWidth: true, size: 'sm' }));
  
  content.appendChild(selectRow);
  
  // Output
  const outputSection = createSection('📋 Generated Hreflang Tags', [
    createElement('div', {
      id: 'hreflang-output',
      styles: {
        padding: '16px', background: '#1E293B', borderRadius: DT.radii.md,
        fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.sm,
        color: '#E2E8F0', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        minHeight: '100px', maxHeight: '300px', overflowY: 'auto',
      },
      text: 'Select languages and click "Generate Tags"',
    }),
  ]);
  
  content.appendChild(outputSection);
  
  function generateTags() {
    const basePattern = urlInput.value.trim();
    const patternSelect = document.getElementById('hreflang-pattern');
    const pattern = patternSelect?.value || 'subdirectory';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    const tags = [];
    checkboxes.forEach(cb => {
      const code = cb.dataset.code;
      const region = cb.dataset.region;
      const hreflangValue = region ? `${code}-${region}` : code;
      
      let url = basePattern;
      if (pattern === 'subdirectory') {
        url = basePattern.replace(/\/$/, '') + `/${hreflangValue}/`;
      } else if (pattern === 'subdomain') {
        const urlObj = new URL(basePattern);
        url = `${urlObj.protocol}//${hreflangValue}.${urlObj.hostname}${urlObj.pathname}`;
      } else if (pattern === 'parameter') {
        url = basePattern + (basePattern.includes('?') ? '&' : '?') + `lang=${hreflangValue}`;
      }
      
      tags.push(`<link rel="alternate" hreflang="${hreflangValue}" href="${url}" />`);
    });
    
    return tags.join('\n');
  }
  
  content.appendChild(createButton('🔄 Generate Tags', () => {
    document.getElementById('hreflang-output').textContent = generateTags();
  }, { variant: 'primary' }));
  
  content.appendChild(createButton('📋 Copy Tags', () => {
    const tags = document.getElementById('hreflang-output').textContent;
    if (tags && tags !== 'Select languages and click "Generate Tags"') {
      copyToClipboard(tags).then(() => showNotification('✅ Hreflang tags copied!', 'success'));
    } else {
      const newTags = generateTags();
      document.getElementById('hreflang-output').textContent = newTags;
      copyToClipboard(newTags).then(() => showNotification('✅ Hreflang tags copied!', 'success'));
    }
  }, { variant: 'success' }));
  
  // Implementation notes
  content.appendChild(createSection('📋 Implementation Notes', [
    createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
      html: `
        <li>Add tags to the &lt;head&gt; section of each page</li>
        <li>Include self-referencing hreflang tag</li>
        <li>Always include x-default for language selector pages</li>
        <li>Use absolute URLs (including https://)</li>
        <li>Ensure bidirectional linking between all versions</li>
      `,
    }),
  ]));
  
  const { close } = createModal('Hreflang Generator', content, { width: '700px' });
}

// ==================== TOOL: DUPLICATE CONTENT FINDER ====================

function toolFindDuplicateContent() {
  const content = createElement('div');
  
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1 = document.querySelector('h1')?.textContent?.trim() || '';
  const bodyText = document.body.innerText || '';
  const wordCount = (bodyText.match(/\b\w+\b/g) || []).length;
  
  // Check headings
  const headings = {
    h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
    h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
  };
  
  const duplicateHeadings = [];
  Object.entries(headings).forEach(([level, texts]) => {
    const seen = new Set();
    texts.forEach(text => {
      const normalized = text.toLowerCase().trim();
      if (seen.has(normalized)) {
        duplicateHeadings.push({ level, text });
      } else {
        seen.add(normalized);
      }
    });
  });
  
  // Calculate uniqueness score
  let score = 100;
  if (wordCount < 100) score -= 30;
  else if (wordCount < 300) score -= 15;
  score -= duplicateHeadings.length * 10;
  if (!metaDesc) score -= 10;
  if (headings.h1.length === 0) score -= 15;
  if (headings.h1.length > 1) score -= 10;
  score = Math.max(0, Math.min(100, score));
  
  // Content fingerprint
  const fingerprint = hashString(bodyText.replace(/\s+/g, ' ').substring(0, 1000));
  
  content.appendChild(createToolHeader(
    '🔄 Duplicate Content Analyzer',
    `Uniqueness Score: ${score}/100`
  ));
  
  // Score ring
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Word Count', value: wordCount.toLocaleString(), icon: '📝', color: wordCount >= 300 ? DT.colors.success : DT.colors.warning },
    { label: 'H1 Tags', value: headings.h1.length, icon: '📌', color: headings.h1.length === 1 ? DT.colors.success : DT.colors.error },
    { label: 'Meta Desc', value: metaDesc ? '✅' : '❌', icon: '📄', color: metaDesc ? DT.colors.success : DT.colors.error },
    { label: 'Fingerprint', value: fingerprint, icon: '🔑', color: DT.colors.info },
  ]));
  
  // Issues
  const issues = [];
  if (wordCount < 300) issues.push('Content is thin - aim for 300+ words');
  if (headings.h1.length === 0) issues.push('Missing H1 tag');
  if (headings.h1.length > 1) issues.push(`Multiple H1 tags (${headings.h1.length})`);
  if (!metaDesc) issues.push('Missing meta description');
  if (duplicateHeadings.length > 0) issues.push(`${duplicateHeadings.length} duplicate heading(s) found`);
  
  if (issues.length > 0) {
    content.appendChild(createSection('⚠️ Issues Found', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue =>
          createElement('div', {
            styles: {
              padding: '10px 14px',
              background: DT.colors.warningLight,
              borderLeft: `3px solid ${DT.colors.warning}`,
              borderRadius: DT.radii.md,
              fontSize: DT.typography.sizes.base,
              color: '#92400E',
            },
            text: `⚠️ ${issue}`,
          })
        ),
      }),
    ]));
  } else {
    content.appendChild(createSection('', [
      createElement('div', {
        styles: { padding: '20px', background: DT.colors.successLight, borderRadius: DT.radii.md, textAlign: 'center', color: '#166534', fontWeight: DT.typography.weights.semibold },
        text: '✅ No major duplicate content issues detected!',
      }),
    ]));
  }
  
  // Recommendations
  content.appendChild(createSection('💡 Recommendations', [
    createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
      html: `
        ${wordCount < 300 ? '<li>Add more unique content (aim for 300+ words)</li>' : '<li>✅ Content length is good</li>'}
        ${headings.h1.length !== 1 ? '<li>Use exactly one H1 tag per page</li>' : '<li>✅ H1 usage is correct</li>'}
        ${!metaDesc ? '<li>Add a unique meta description</li>' : '<li>✅ Meta description is present</li>'}
        ${duplicateHeadings.length > 0 ? '<li>Make headings more distinct and descriptive</li>' : '<li>✅ Headings are unique</li>'}
        <li>Use canonical tags to prevent duplicate content across URLs</li>
        <li>Ensure each page has a unique focus and value proposition</li>
      `,
    }),
  ]));
  
  const { close } = createModal('Duplicate Content Analyzer', content, { width: '650px' });
}

// ==================== TOOL: CONTENT & READABILITY ANALYZER ====================

function toolContentAnalyzer() {
  const content = createElement('div');
  
  const bodyText = document.body.innerText || '';
  const cleanText = bodyText.replace(/\s+/g, ' ').trim();
  const words = cleanText.match(/\b[a-zA-Z]{2,}\b/g) || [];
  const wordCount = words.length;
  const characters = cleanText.length;
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [];
  const sentenceCount = sentences.length || 1;
  const paragraphs = document.querySelectorAll('p').length || 1;
  
  // Syllable counting
  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };
  
  const totalSyllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  
  // Flesch Reading Ease
  let readingEase = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount));
  readingEase = Math.max(0, Math.min(100, Math.round(readingEase)));
  
  let readabilityLabel = '';
  let readabilityColor = '';
  if (readingEase >= 90) { readabilityLabel = 'Very Easy (5th Grade)'; readabilityColor = DT.colors.success; }
  else if (readingEase >= 80) { readabilityLabel = 'Easy (6th Grade)'; readabilityColor = DT.colors.success; }
  else if (readingEase >= 70) { readabilityLabel = 'Fairly Easy (7th Grade)'; readabilityColor = '#8BC34A'; }
  else if (readingEase >= 60) { readabilityLabel = 'Standard (8th-9th Grade)'; readabilityColor = DT.colors.warning; }
  else if (readingEase >= 50) { readabilityLabel = 'Fairly Difficult (10th-12th)'; readabilityColor = DT.colors.warning; }
  else if (readingEase >= 30) { readabilityLabel = 'Difficult (College)'; readabilityColor = DT.colors.error; }
  else { readabilityLabel = 'Very Difficult (College Grad)'; readabilityColor = DT.colors.error; }
  
  const readingTime = Math.max(1, Math.ceil(wordCount / 238));
  const speakingTime = Math.max(1, Math.ceil(wordCount / 130));
  
  content.appendChild(createToolHeader(
    '📝 Content & Readability Analyzer',
    `${wordCount.toLocaleString()} words analyzed`
  ));
  
  // Score
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(readingEase, 100));
  content.appendChild(scoreRow);
  
  content.appendChild(createElement('div', {
    styles: { textAlign: 'center', fontSize: DT.typography.sizes.md, color: readabilityColor, fontWeight: DT.typography.weights.bold, marginTop: '-8px', marginBottom: '16px' },
    text: readabilityLabel,
  }));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Words', value: wordCount.toLocaleString(), icon: '📝' },
    { label: 'Characters', value: characters.toLocaleString(), icon: '🔤' },
    { label: 'Sentences', value: sentenceCount.toLocaleString(), icon: '📏' },
    { label: 'Paragraphs', value: paragraphs, icon: '📄' },
    { label: 'Read Time', value: `${readingTime} min`, icon: '📖' },
    { label: 'Speak Time', value: `${speakingTime} min`, icon: '🗣️' },
  ]));
  
  // Top keywords
  const wordFreq = {};
  const stopWordsSet = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it']);
  words.forEach(w => {
    const word = w.toLowerCase();
    if (!stopWordsSet.has(word) && word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const topKeywords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  
  if (topKeywords.length > 0) {
    content.appendChild(createSection('🔑 Top Keywords', [
      createElement('div', {
        styles: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
        children: topKeywords.map(([kw, count]) =>
          createElement('span', {
            styles: {
              padding: '6px 14px', background: DT.colors.infoLight,
              borderRadius: DT.radii.full, fontSize: DT.typography.sizes.sm,
              color: DT.colors.info, fontWeight: DT.typography.weights.semibold,
            },
            text: `${kw} (${count})`,
          })
        ),
      }),
    ]));
  }
  
  const { close } = createModal('Content & Readability Analyzer', content, { width: '650px' });
}

// ==================== TOOL: SEO AUDIT CHECKLIST ====================

function toolSEOAuditChecklist() {
  const content = createElement('div');
  
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1Count = document.querySelectorAll('h1').length;
  const h1Text = document.querySelector('h1')?.textContent?.trim() || '';
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const schemaCount = document.querySelectorAll('script[type="application/ld+json"]').length;
  
  // OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
  const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
  
  // Analytics detection
  let hasAnalytics = false;
  document.querySelectorAll('script').forEach(script => {
    const src = script.src || '';
    const text = script.textContent || '';
    if (src.includes('google-analytics') || src.includes('googletagmanager') || text.includes('gtag(')) {
      hasAnalytics = true;
    }
  });
  
  // Favicon
  const hasFavicon = !!document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  
  // Checklist items
  const checklistItems = [
    {
      category: 'Title & Meta Tags',
      items: [
        { name: 'Title tag present', check: title.length > 0, note: title || 'Missing' },
        { name: 'Title length (50-60 chars)', check: title.length >= 30 && title.length <= 65, note: `${title.length} chars` },
        { name: 'Meta description present', check: metaDesc.length > 0, note: metaDesc ? `${metaDesc.length} chars` : 'Missing' },
        { name: 'Meta description length (120-160)', check: metaDesc.length >= 120 && metaDesc.length <= 160, note: `${metaDesc.length} chars` },
      ],
    },
    {
      category: 'Headings & Content',
      items: [
        { name: 'H1 tag present', check: h1Count > 0, note: h1Text || 'Missing' },
        { name: 'Only one H1 tag', check: h1Count === 1, note: `${h1Count} found` },
        { name: 'Images have alt text', check: imagesWithoutAlt === 0, note: `${imagesWithoutAlt} missing` },
      ],
    },
    {
      category: 'Technical SEO',
      items: [
        { name: 'Canonical tag present', check: canonical.length > 0, note: canonical || 'Missing' },
        { name: 'SSL/HTTPS enabled', check: url.startsWith('https'), note: url.startsWith('https') ? '✅ Enabled' : '❌ Not secure' },
        { name: 'Schema markup present', check: schemaCount > 0, note: `${schemaCount} found` },
        { name: 'Robots meta tag', check: !robots.includes('noindex'), note: robots || 'Defaults to index' },
        { name: 'Mobile viewport', check: viewport.length > 0, note: viewport ? '✅ Present' : 'Missing' },
        { name: 'Favicon configured', check: hasFavicon, note: hasFavicon ? '✅ Present' : 'Missing' },
      ],
    },
    {
      category: 'Social & Analytics',
      items: [
        { name: 'Google Analytics / GTM', check: hasAnalytics, note: hasAnalytics ? '✅ Detected' : '❌ Not found' },
        { name: 'Open Graph Title', check: ogTitle.length > 0, note: ogTitle ? '✅ Present' : 'Missing' },
        { name: 'Open Graph Image', check: ogImage.length > 0, note: ogImage ? '✅ Present' : 'Missing' },
        { name: 'Twitter Card', check: twitterCard.length > 0, note: twitterCard ? '✅ Present' : 'Missing' },
      ],
    },
  ];
  
  const totalItems = checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
  const passedItems = checklistItems.reduce((sum, cat) => sum + cat.items.filter(i => i.check).length, 0);
  const score = Math.round((passedItems / totalItems) * 100);
  
  content.appendChild(createToolHeader(
    '✅ Automated SEO Audit',
    `Score: ${score}% • ${passedItems}/${totalItems} checks passed`
  ));
  
  // Score ring
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Score bar
  const scoreBarSection = createElement('div', { styles: { marginBottom: '20px' } });
  const { container: progressBar } = createProgressBar(score, 
    score >= 80 ? DT.colors.success : score >= 50 ? DT.colors.warning : DT.colors.error, 10);
  scoreBarSection.appendChild(progressBar);
  content.appendChild(scoreBarSection);
  
  // Categories
  checklistItems.forEach(category => {
    const catPassed = category.items.filter(i => i.check).length;
    const catTotal = category.items.length;
    
    const catSection = createSection(
      `${category.category} (${catPassed}/${catTotal})`,
      [
        createElement('div', {
          styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
          children: category.items.map(item => {
            const statusColor = item.check ? DT.colors.success : DT.colors.error;
            const statusBg = item.check ? DT.colors.successLight : DT.colors.errorLight;
            
            return createElement('div', {
              styles: {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: statusBg,
                border: `1px solid ${statusColor}30`, borderRadius: DT.radii.md,
              },
              children: [
                createElement('div', {
                  styles: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1' },
                  children: [
                    createElement('span', { text: item.check ? '✅' : '❌' }),
                    createElement('span', {
                      styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.medium, color: DT.colors.textPrimary },
                      text: item.name,
                    }),
                  ],
                }),
                createElement('span', {
                  styles: { fontSize: DT.typography.sizes.xs, color: statusColor, fontWeight: DT.typography.weights.semibold, textAlign: 'right', maxWidth: '40%' },
                  text: item.note,
                }),
              ],
            });
          }),
        }),
      ]
    );
    
    content.appendChild(catSection);
  });
  
  // Export buttons
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(createButton('📥 Export Audit JSON', () => {
    const reportData = { domain, url, date: new Date().toISOString(), score, passed: passedItems, total: totalItems, checklist: checklistItems };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `seo-audit-${domain}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showNotification('✅ Audit exported!', 'success');
  }, { variant: 'secondary' }));
  
  btnRow.appendChild(createButton('📋 Copy Summary', () => {
    const summary = `SEO Audit Summary - ${domain}\nDate: ${new Date().toLocaleDateString()}\nScore: ${score}%\n\n❌ Issues:\n${checklistItems.flatMap(c => c.items.filter(i => !i.check).map(i => `- ${i.name}: ${i.note}`)).join('\n')}`;
    copyToClipboard(summary).then(() => showNotification('✅ Summary copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(btnRow);
  
  const { close } = createModal('Automated SEO Audit', content, { width: '700px' });
}

// ==================== TOOL: SEO AUDIT CHECKLIST (INTERACTIVE) ====================

function toolAuditChecklist() {
  const content = createElement('div');
  
  const checklist = [
    { category: 'Technical SEO', items: [
      'XML Sitemap exists and is submitted',
      'Robots.txt is properly configured',
      'SSL certificate is valid',
      'Mobile-friendly design',
      'Page load speed under 3 seconds',
      'No broken links (404 errors)',
      'Canonical tags are set correctly',
      'URL structure is SEO-friendly',
    ]},
    { category: 'On-Page SEO', items: [
      'Unique and optimized title tags',
      'Compelling meta descriptions',
      'H1 tag used once per page',
      'Proper heading hierarchy (H1-H6)',
      'Image alt text optimized',
      'Internal linking structure',
      'Content length adequate (300+ words)',
      'Keyword density 1-3%',
    ]},
    { category: 'Content Quality', items: [
      'Original, non-duplicate content',
      'Readability score good',
      'Content answers user intent',
      'Updated regularly',
      'Multimedia included (images/videos)',
      'Proper formatting (bullets, short paragraphs)',
      'Call-to-action present',
    ]},
    { category: 'Local SEO', items: [
      'Google Business Profile claimed',
      'NAP consistent across web',
      'Local citations built',
      'Location pages created',
      'Local schema markup',
      'Reviews managed',
      'Local keywords targeted',
    ]},
  ];
  
  content.appendChild(createToolHeader(
    '✅ SEO Audit Checklist',
    'Track your SEO progress interactively'
  ));
  
  // Progress bar
  const progressSection = createElement('div', { styles: { marginBottom: '20px' } });
  
  const progressLabel = createElement('div', {
    styles: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: DT.typography.sizes.base },
    children: [
      createElement('span', { styles: { fontWeight: DT.typography.weights.semibold, color: DT.colors.textPrimary }, text: 'Overall Progress' }),
      createElement('span', { id: 'audit-progress-text', styles: { fontWeight: DT.typography.weights.bold, color: DT.colors.primary }, text: '0% Complete' }),
    ],
  });
  
  const { container: progressBar, fill: progressFill } = createProgressBar(0, DT.colors.primary, 10);
  
  progressSection.appendChild(progressLabel);
  progressSection.appendChild(progressBar);
  content.appendChild(progressSection);
  
  // Load saved state
  chrome.storage.local.get(['seoAuditChecklist'], (result) => {
    const savedState = result.seoAuditChecklist || {};
    
    const checklistContainer = createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    });
    
    checklist.forEach((cat, catIndex) => {
      const catSection = createSection(cat.category, [
        createElement('div', {
          styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
          children: cat.items.map((item, itemIndex) => {
            const key = `${catIndex}-${itemIndex}`;
            const checked = savedState[key] || false;
            
            const label = createElement('label', {
              styles: {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                background: checked ? DT.colors.successLight : DT.colors.surface,
                border: `1px solid ${checked ? DT.colors.success : DT.colors.border}`,
                borderRadius: DT.radii.md,
                cursor: 'pointer',
                transition: `all ${DT.transitions.fast}`,
              },
            });
            
            const checkbox = createElement('input', {
              attrs: { type: 'checkbox', 'data-key': key },
            });
            checkbox.checked = checked;
            
            const textSpan = createElement('span', {
              styles: {
                flex: '1',
                fontSize: DT.typography.sizes.base,
                color: checked ? DT.colors.textMuted : DT.colors.textPrimary,
                textDecoration: checked ? 'line-through' : 'none',
              },
              text: item,
            });
            
            label.appendChild(checkbox);
            label.appendChild(textSpan);
            
            label.addEventListener('change', () => {
              // Update saved state
              const allCheckboxes = document.querySelectorAll('.audit-checkbox');
              const state = {};
              let totalChecked = 0;
              
              allCheckboxes.forEach(cb => {
                state[cb.dataset.key] = cb.checked;
                if (cb.checked) totalChecked++;
              });
              
              chrome.storage.local.set({ seoAuditChecklist: state });
              
              // Update progress
              const total = allCheckboxes.length;
              const percent = Math.round((totalChecked / total) * 100);
              progressFill.style.width = `${percent}%`;
              document.getElementById('audit-progress-text').textContent = `${totalChecked}/${total} items (${percent}%)`;
              
              // Update label styles
              if (checkbox.checked) {
                label.style.background = DT.colors.successLight;
                label.style.borderColor = DT.colors.success;
                textSpan.style.textDecoration = 'line-through';
                textSpan.style.color = DT.colors.textMuted;
              } else {
                label.style.background = DT.colors.surface;
                label.style.borderColor = DT.colors.border;
                textSpan.style.textDecoration = 'none';
                textSpan.style.color = DT.colors.textPrimary;
              }
            });
            
            return label;
          }),
        }),
      ]);
      
      checklistContainer.appendChild(catSection);
    });
    
    content.appendChild(checklistContainer);
    
    // Initial progress
    const allCheckboxes = document.querySelectorAll('.audit-checkbox, input[type="checkbox"]');
    let totalChecked = 0;
    allCheckboxes.forEach(cb => {
      if (cb.checked) totalChecked++;
    });
    const percent = allCheckboxes.length > 0 ? Math.round((totalChecked / allCheckboxes.length) * 100) : 0;
    progressFill.style.width = `${percent}%`;
    document.getElementById('audit-progress-text').textContent = `${totalChecked}/${allCheckboxes.length} items (${percent}%)`;
    
    // Action buttons
    const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
    
    btnRow.appendChild(createButton('💾 Save Progress', () => {
      const state = {};
      let checked = 0;
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        state[cb.dataset.key] = cb.checked;
        if (cb.checked) checked++;
      });
      chrome.storage.local.set({ seoAuditChecklist: state }, () => {
        showNotification(`✅ Progress saved! (${checked} items complete)`, 'success');
      });
    }, { variant: 'primary' }));
    
    btnRow.appendChild(createButton('🔄 Reset All', () => {
      if (confirm('Reset all checklist items?')) {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
          cb.dispatchEvent(new Event('change'));
        });
        chrome.storage.local.remove('seoAuditChecklist');
        showNotification('✅ Checklist reset!', 'success');
      }
    }, { variant: 'danger' }));
    
    btnRow.appendChild(createButton('📤 Export Checklist', () => {
      const state = {};
      let checkedNum = 0;
      let totalNum = 0;
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        state[cb.dataset.key] = cb.checked;
        totalNum++;
        if (cb.checked) checkedNum++;
      });
      
      const report = `SEO Audit Checklist Report\n${'='.repeat(30)}\nDate: ${new Date().toLocaleDateString()}\nDomain: ${domain}\nProgress: ${checkedNum}/${totalNum} (${Math.round(checkedNum/totalNum*100)}%)\n\n` +
        checklist.map(cat =>
          `${cat.category}\n${'-'.repeat(20)}\n${cat.items.map(item => `[ ] ${item}`).join('\n')}`
        ).join('\n\n');
      
      const blob = new Blob([report], { type: 'text/plain' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `seo-checklist-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      showNotification('✅ Checklist exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(btnRow);
  });
  
  const { close } = createModal('SEO Audit Checklist', content, { width: '700px' });
}

// ==================== TOOL: SEO DASHBOARD ====================

function toolSEODashboard() {
  const content = createElement('div');
  
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const lang = document.documentElement.getAttribute('lang') || '';
  const charset = document.characterSet || '';
  
  const h1s = document.querySelectorAll('h1');
  const h1Count = h1s.length;
  const h1Text = h1s[0]?.textContent?.trim() || '';
  const h2s = document.querySelectorAll('h2');
  
  const bodyText = document.body.innerText || '';
  const wordCount = (bodyText.match(/\b\w+\b/g) || []).length;
  
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(img => img.getAttribute('alt')?.trim()).length;
  const imagesLazy = Array.from(images).filter(img => img.getAttribute('loading') === 'lazy').length;
  
  const allLinks = document.querySelectorAll('a[href]');
  const internalLinks = Array.from(allLinks).filter(l => {
    try { return new URL(l.href, url).hostname === window.location.hostname; } catch { return false; }
  });
  const externalLinks = Array.from(allLinks).filter(l => {
    try { return new URL(l.href, url).hostname !== window.location.hostname; } catch { return false; }
  });
  const nofollowLinks = Array.from(allLinks).filter(l => l.getAttribute('rel')?.includes('nofollow'));
  
  const schemaCount = document.querySelectorAll('script[type="application/ld+json"]').length;
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
  const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
  const domNodes = document.querySelectorAll('*').length;
  const isSecure = url.startsWith('https');
  
// Tech stack detection (Deep Scan Upgrade)
  const pageHtml = document.documentElement.innerHTML;
  const rawTechStack = [];

  const signatures = [
    { name: 'WordPress', type: 'CMS', regex: /wp-content|wp-includes/i, icon: '📝' },
    { name: 'Shopify', type: 'Ecommerce', regex: /cdn\.shopify\.com|Shopify\.theme/i, icon: '🛒' },
    { name: 'Wix', type: 'Ecommerce', regex: /wix\.com/i, icon: '🛍️' },
    { name: 'React', type: 'Framework', regex: /data-reactroot|react-dom/i, icon: '⚛️' },
    { name: 'Next.js', type: 'Framework', regex: /_next\/static|__NEXT_DATA__/i, icon: '▲' },
    { name: 'Vue.js', type: 'Framework', regex: /data-v-|vue\.js|__VUE__/i, icon: '💚' },
    { name: 'Angular', type: 'Framework', regex: /ng-version|ng-app/i, icon: '🅰️' },
    { name: 'jQuery', type: 'Library', regex: /jquery[\.0-9a-z-]*\.js/i, icon: '$' },
    { name: 'Tailwind CSS', type: 'UI', regex: /tailwind/i, icon: '🌬️' },
    { name: 'Bootstrap', type: 'UI', regex: /bootstrap[\.0-9a-z-]*\.(css|js)/i, icon: '🅱️' },
    { name: 'Google Analytics', type: 'Analytics', regex: /google-analytics\.com\/analytics\.js|gtag\(/i, icon: '📈' },
    { name: 'Tag Manager', type: 'Analytics', regex: /googletagmanager\.com\/gtm\.js/i, icon: '🏷️' },
    { name: 'Facebook Pixel', type: 'Tracker', regex: /fbevents\.js/i, icon: '📘' },
    { name: 'Hotjar', type: 'Tracker', regex: /static\.hotjar\.com/i, icon: '🔥' },
    { name: 'Cloudflare', type: 'Security', regex: /cloudflare-static|cf-beacon/i, icon: '☁️' },
    { name: 'Yoast SEO', type: 'SEO Plugin', regex: /yoast-seo-meta|Yoast SEO/i, icon: '🚦' },
    { name: 'RankMath', type: 'SEO Plugin', regex: /Rank Math SEO/i, icon: '📈' }
  ];

  signatures.forEach(sig => {
    if (sig.regex.test(pageHtml)) rawTechStack.push(sig);
    else if (sig.name === 'React' && window.React) rawTechStack.push(sig);
    else if (sig.name === 'Vue.js' && window.Vue) rawTechStack.push(sig);
    else if (sig.name === 'jQuery' && window.jQuery) rawTechStack.push(sig);
  });

  const techStack = [...new Map(rawTechStack.map(item => [item.name, item])).values()];
  // Scoring
  const scores = {
    title: title.length >= 50 && title.length <= 60 ? 100 : (title.length >= 30 ? 70 : (title.length > 0 ? 40 : 0)),
    metaDesc: metaDesc.length >= 140 && metaDesc.length <= 160 ? 100 : (metaDesc.length >= 120 ? 70 : (metaDesc.length > 0 ? 40 : 0)),
    h1: h1Count === 1 ? 100 : (h1Count > 1 ? 60 : 0),
    content: wordCount >= 800 ? 100 : (wordCount >= 500 ? 90 : (wordCount >= 300 ? 75 : (wordCount >= 150 ? 50 : (wordCount > 0 ? 30 : 0)))),
    images: images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100,
    links: internalLinks.length >= 5 ? 100 : (internalLinks.length > 0 ? Math.round((internalLinks.length / 5) * 100) : 0),
    schema: schemaCount > 0 ? 100 : 0,
    canonical: canonical === url ? 100 : (canonical.length > 0 ? 80 : 0),
    security: isSecure ? 100 : 0,
    mobile: viewport.includes('width=device-width') ? 100 : (viewport.length > 0 ? 50 : 0),
    social: ogTitle && ogImage ? 100 : (ogTitle || ogImage ? 60 : 0),
    url: url.length <= 75 ? 100 : (url.length <= 120 ? 80 : 60),
    performance: domNodes < 1500 ? 100 : (domNodes < 2500 ? 80 : (domNodes < 4000 ? 60 : 40)),
    lang: lang ? 100 : 0,
  };
  
  const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  
  const getGrade = (s) => {
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    if (s >= 60) return 'D';
    return 'F';
  };
  
  content.appendChild(createToolHeader(
    '📊 SEO Dashboard',
    `Overall Score: ${overallScore}/100 (Grade ${getGrade(overallScore)})`
  ));
  
  // Score ring
  const scoreRow = createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(createScoreRing(overallScore, 100));
  content.appendChild(scoreRow);
  
  // Quick stats
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: allLinks.length, icon: '🔗' },
    { label: 'Internal', value: internalLinks.length, icon: '🏠', color: DT.colors.success },
    { label: 'External', value: externalLinks.length, icon: '🌐', color: DT.colors.info },
    { label: 'Images', value: images.length, icon: '🖼️' },
    { label: 'Word Count', value: wordCount.toLocaleString(), icon: '📝' },
    { label: 'Schema', value: schemaCount, icon: '📋', color: schemaCount > 0 ? DT.colors.success : DT.colors.warning },
  ]));
  
  // Score bars
  const scoreBars = createSection('📊 Score Breakdown', [
    createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '8px' } }),
  ]);
  
  [
    { label: 'Title Tag', score: scores.title },
    { label: 'Meta Description', score: scores.metaDesc },
    { label: 'H1 Tags', score: scores.h1 },
    { label: 'Content Length', score: scores.content },
    { label: 'Image Optimization', score: scores.images },
    { label: 'Internal Links', score: scores.links },
    { label: 'Schema Markup', score: scores.schema },
    { label: 'HTTPS Security', score: scores.security },
    { label: 'Mobile Viewport', score: scores.mobile },
    { label: 'Social Meta', score: scores.social },
    { label: 'URL Structure', score: scores.url },
    { label: 'Performance', score: scores.performance },
    { label: 'Language', score: scores.lang },
  ].forEach(item => {
    const color = item.score >= 80 ? DT.colors.success : item.score >= 50 ? DT.colors.warning : DT.colors.error;
    
    const row = createElement('div', { styles: { marginBottom: '4px' } });
    
    const header = createElement('div', {
      styles: { display: 'flex', justifyContent: 'space-between', fontSize: DT.typography.sizes.sm, marginBottom: '2px' },
      children: [
        createElement('span', { styles: { color: DT.colors.textPrimary }, text: item.label }),
        createElement('span', { styles: { fontWeight: DT.typography.weights.bold, color }, text: `${item.score}%` }),
      ],
    });
    
    row.appendChild(header);
    const { container: bar } = createProgressBar(item.score, color, 6);
    row.appendChild(bar);
    
    scoreBars.querySelector('div').appendChild(row);
  });
  
  content.appendChild(scoreBars);
  
  // Tech stack
  if (techStack.length > 0) {
    content.appendChild(createSection('🛠️ Technologies Detected', [
      createElement('div', {
        styles: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
        children: techStack.map(tech =>
          createElement('span', {
            styles: {
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', background: DT.colors.surfaceTertiary,
              borderRadius: DT.radii.full, fontSize: DT.typography.sizes.sm,
              color: DT.colors.textPrimary, fontWeight: DT.typography.weights.semibold,
              border: `1px solid ${DT.colors.border}`,
            },
            html: `${tech.icon} ${escapeHtml(tech.name)}`,
          })
        ),
      }),
    ]));
  }
  
  // Priority actions
  const priorityItems = [];
  if (scores.title < 80) priorityItems.push('Optimize title tag (50-60 characters)');
  if (scores.metaDesc < 80) priorityItems.push('Improve meta description (150-160 characters)');
  if (scores.h1 < 80) priorityItems.push('Fix H1 tag issues');
  if (scores.content < 80) priorityItems.push('Add more content (500+ words recommended)');
  if (scores.images < 80) priorityItems.push('Optimize images (alt text, dimensions)');
  if (scores.links < 80) priorityItems.push('Add more internal links (5+ recommended)');
  if (scores.schema < 80) priorityItems.push('Add schema markup');
  if (scores.security < 80) priorityItems.push('Enable HTTPS');
  if (scores.mobile < 80) priorityItems.push('Add proper viewport meta tag');
  
  if (priorityItems.length > 0) {
    content.appendChild(createSection('🎯 Priority Actions', [
      createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
        children: priorityItems.map(item =>
          createElement('div', {
            styles: {
              padding: '10px 14px', background: DT.colors.warningLight,
              borderLeft: `3px solid ${DT.colors.warning}`, borderRadius: DT.radii.md,
              fontSize: DT.typography.sizes.base, color: '#92400E',
            },
            text: `⚠️ ${item}`,
          })
        ),
      }),
    ]));
  }
  
  // Export buttons
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(createButton('📋 Copy Report', () => {
    const report = `SEO Dashboard Report\n${'='.repeat(30)}\nURL: ${url}\nDomain: ${domain}\nOverall Score: ${overallScore}/100 (Grade ${getGrade(overallScore)})\n\nScore Breakdown:\n${Object.entries(scores).map(([k, v]) => `- ${k}: ${v}%`).join('\n')}\n\nQuick Stats:\n- Links: ${allLinks.length} (${internalLinks.length} internal)\n- Images: ${images.length} (${imagesWithAlt} with alt)\n- Word Count: ${wordCount}\n- Schema: ${schemaCount}`;
    copyToClipboard(report).then(() => showNotification('✅ Report copied!', 'success'));
  }, { variant: 'primary' }));
  
  btnRow.appendChild(createButton('📊 Export JSON', () => {
    const data = { url, domain, title, metaDesc, h1Text, h1Count, wordCount, images: images.length, imagesWithAlt, internalLinks: internalLinks.length, externalLinks: externalLinks.length, schemaCount, scores, overallScore, grade: getGrade(overallScore), techStack, analyzedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `seo-report-${domain}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showNotification('✅ JSON exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  const { close } = createModal('SEO Dashboard', content, { width: '750px' });
}

// ==================== TOOL: LOCAL CITATION FINDER ====================

function toolFindLocalCitations() {
  const content = createElement('div');
  
  const domain = window.location.hostname.replace('www.', '');
  const pageTitle = document.title;
  const bodyText = document.body.innerText || '';
  
  let businessName = '';
  let businessPhone = '';
  let businessAddress = '';
  
  const h1 = document.querySelector('h1')?.textContent || '';
  const titleParts = pageTitle.split('|')[0].split('-')[0].trim();
  businessName = h1 || titleParts || domain;
  
  const phoneMatch = bodyText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) businessPhone = phoneMatch[0];
  
  const addressMatch = bodyText.match(/\d{1,5}\s\w+\s\w+[,.]?\s?\w*[,.]?\s?[A-Z]{2}\s?\d{5}/);
  if (addressMatch) businessAddress = addressMatch[0];
  
  const citationSources = [
    { name: 'Google Business Profile', url: 'https://business.google.com/', priority: 'critical' },
    { name: 'Bing Places', url: 'https://www.bingplaces.com/', priority: 'critical' },
    { name: 'Apple Maps Connect', url: 'https://mapsconnect.apple.com/', priority: 'high' },
    { name: 'Yelp for Business', url: 'https://biz.yelp.com/', priority: 'critical' },
    { name: 'Facebook Business', url: 'https://www.facebook.com/business', priority: 'high' },
    { name: 'LinkedIn Company Page', url: 'https://www.linkedin.com/company/setup/', priority: 'high' },
    { name: 'BBB (Better Business Bureau)', url: 'https://www.bbb.org/get-listed', priority: 'high' },
    { name: 'Yellow Pages', url: 'https://www.yellowpages.com/listing', priority: 'medium' },
    { name: 'Superpages', url: 'https://www.superpages.com/', priority: 'medium' },
    { name: 'Manta', url: 'https://www.manta.com/add', priority: 'medium' },
    { name: 'Foursquare', url: 'https://foursquare.com/business/', priority: 'medium' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/Owners', priority: 'medium' },
    { name: 'Angi', url: 'https://www.angi.com/business/', priority: 'medium' },
    { name: 'Nextdoor', url: 'https://business.nextdoor.com/', priority: 'low' },
    { name: 'Chamber of Commerce', url: 'https://www.chamberofcommerce.com/add-business', priority: 'low' },
    { name: 'Hotfrog', url: 'https://www.hotfrog.com/', priority: 'low' },
    { name: 'MerchantCircle', url: 'https://www.merchantcircle.com/', priority: 'low' },
  ];
  
  content.appendChild(createToolHeader(
    '📋 Local Citation Finder',
    `Find citation opportunities for ${businessName || domain}`
  ));
  
  // Business info
  if (businessName || businessPhone || businessAddress) {
    const infoSection = createSection('🏢 Detected Business Info', [
      createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '8px' } }),
    ]);
    
    [
      { label: 'Business Name', value: businessName, id: 'citation-name' },
      { label: 'Phone', value: businessPhone, id: 'citation-phone' },
      { label: 'Address', value: businessAddress, id: 'citation-address' },
    ].forEach(field => {
      const { wrapper: fw, input: fi } = createInputField({
        label: field.label,
        id: field.id,
        defaultValue: field.value || '',
        placeholder: field.label,
      });
      infoSection.querySelector('div').appendChild(fw);
    });
    
    content.appendChild(infoSection);
  }
  
  // Citation sources by priority
  ['critical', 'high', 'medium', 'low'].forEach(priority => {
    const sources = citationSources.filter(s => s.priority === priority);
    if (sources.length === 0) return;
    
    const priorityColors = {
      critical: DT.colors.error,
      high: DT.colors.warning,
      medium: DT.colors.info,
      low: DT.colors.textMuted,
    };
    
    const priorityLabels = {
      critical: '🔴 Critical',
      high: '🟡 High Priority',
      medium: '🔵 Medium Priority',
      low: '⚪ Low Priority',
    };
    
    const section = createSection(priorityLabels[priority], [
      createElement('div', {
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' },
        children: sources.map(source => {
          const card = createElement('div', {
            styles: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', background: DT.colors.surface,
              border: `1px solid ${DT.colors.border}`, borderRadius: DT.radii.md,
              cursor: 'pointer', transition: `all ${DT.transitions.fast}`,
              borderLeft: `3px solid ${priorityColors[priority]}`,
            },
          });
          
          card.addEventListener('click', () => window.open(source.url, '_blank'));
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateX(4px)';
            card.style.borderColor = priorityColors[priority];
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateX(0)';
            card.style.borderColor = DT.colors.border;
          });
          
          card.appendChild(createElement('span', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: DT.colors.textPrimary },
            text: source.name,
          }));
          
          card.appendChild(createElement('span', {
            styles: { color: priorityColors[priority] },
            text: 'Open →',
          }));
          
          return card;
        }),
      }),
    ]);
    
    content.appendChild(section);
  });
  
  // Export
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(createButton('📋 Copy Citation List', () => {
    const list = citationSources.map(s => `${s.name}: ${s.url} (${s.priority})`).join('\n');
    copyToClipboard(list).then(() => showNotification(`✅ ${citationSources.length} citations copied!`, 'success'));
  }, { variant: 'primary' }));
  
  btnRow.appendChild(createButton('📊 Export CSV', () => {
    let csv = 'Name,URL,Priority\n';
    citationSources.forEach(s => csv += `"${s.name}","${s.url}","${s.priority}"\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-citations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  // Tips
  content.appendChild(createSection('💡 Citation Building Tips', [
    createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: DT.colors.textSecondary, lineHeight: '1.8' },
      html: `
        <li>Ensure NAP (Name, Address, Phone) consistency across all citations</li>
        <li>Start with major aggregators (Data Axle, Localeze)</li>
        <li>Prioritize industry-specific directories</li>
        <li>Complete profiles fully with photos and descriptions</li>
        <li>Monitor and respond to reviews on all platforms</li>
      `,
    }),
  ]));
  
  const { close } = createModal('Local Citation Finder', content, { width: '700px' });
}

function keywordRankTracker() {
  const CONFIG = {
    MAX_RESULTS: 100,
    MAX_PAGES: 10,
    REQUEST_DELAY: { min: 600, max: 1000 },
    USER_AGENT: navigator.userAgent
  };

  if (!window.location.hostname.includes('google.')) {
    showNotification('This keyword ranking tool only works on Google search result pages', 'error');
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
    const statusDiv = document.createElement('div');
    statusDiv.id = 'ranking-status';
    statusDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: #fff;
      padding: 16px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      min-width: 320px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      border-left: 4px solid #4CAF50;
    `;
    
    statusDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong style="font-size: 16px;">📊 Keyword Rank Tracker</strong>
        <span style="color: #888;">v2.0</span>
      </div>
      <div id="status-message">Starting ranking analysis...</div>
      <div style="margin-top: 12px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
        <div id="status-progress-bar" style="height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s;"></div>
      </div>
      <button onclick="document.getElementById('ranking-status')?.remove()" 
           style="margin-top: 12px; padding: 6px 12px; background: #424242; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        Cancel
      </button>
    `;
    
    document.body.appendChild(statusDiv);
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
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 400px;
        text-align: center;
        box-shadow: 0 16px 48px rgba(0,0,0,0.3);
      `;
      
      modal.innerHTML = `
        <h3 style="margin: 0 0 15px; color: #333;">🎯 Track Keyword Rankings</h3>
        <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
          Enter domain to highlight its ranking position (optional)
        </p>
        <input type="text" id="targetDomainInput" 
             placeholder="e.g., example.com or amazon.com"
             style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; margin-bottom: 20px; font-size: 14px; box-sizing: border-box;">
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="skipBtn" style="background: #9e9e9e; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">Skip</button>
          <button id="trackBtn" style="background: #4CAF50; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">Track Rankings</button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      document.getElementById('trackBtn').onclick = () => {
        targetDomain = document.getElementById('targetDomainInput').value.trim();
        document.body.removeChild(overlay);
        resolve();
      };
      
      document.getElementById('skipBtn').onclick = () => {
        document.body.removeChild(overlay);
        resolve();
      };
      
      document.getElementById('targetDomainInput').onkeydown = (e) => {
        if (e.key === 'Enter') {
          targetDomain = e.target.value.trim();
          document.body.removeChild(overlay);
          resolve();
        }
      };
    });
  }

  async function extractRankingsFromPages() {
    await promptForTargetDomain();
    
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
      showRankingReport();
    }, 2000);
  }

  function showRankingReport() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 95%;
      width: 1000px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    `;
    
    const targetResults = allResults.filter(r => r.isTarget);
    const uniqueDomains = new Set(allResults.map(r => r.domain)).size;
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="margin:0; font-size: 24px; color: #1a1a1a;">📈 Keyword Ranking Report</h2>
          <p style="margin: 5px 0 0; color: #666; font-size: 14px;">
            ${query || 'No search query'}
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <span style="background: #e3f2fd; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${allResults.length} Results
          </span>
          <span style="background: #f3e5f5; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${uniqueDomains} Domains
          </span>
        </div>
      </div>
      ${targetDomain && targetResults.length > 0 ? `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #2e7d32; font-size: 16px;">🎯 ${targetDomain}</strong>
            <span style="color: #666; margin-left: 10px;">found at position${targetResults.length > 1 ? 's' : ''}:</span>
          </div>
          <div style="display: flex; gap: 8px;">
            ${targetResults.map(r => `
              <span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                #${r.rank}
              </span>
            `).join('')}
          </div>
        </div>
      ` : targetDomain ? `
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #c62828;">
          ❌ ${targetDomain} not found in top ${allResults.length} results
        </div>
      ` : ''}
    `;
    
    const actions = document.createElement('div');
    actions.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    `;
    
    const buttons = [
      { id: 'exportCSV', text: '📥 Export Rankings CSV', color: '#4CAF50' },
      { id: 'exportTXT', text: '📄 Export Rank List', color: '#795548' },
      { id: 'copyDomains', text: '📋 Copy All Domains', color: '#2196F3' },
      { id: 'copyRankings', text: '🔢 Copy Ranked List', color: '#FF9800' },
      { id: 'closeReport', text: '✕ Close', color: '#f44336' }
    ];
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.textContent = btn.text;
      button.style.cssText = `
        background: ${btn.color};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
      `;
      actions.appendChild(button);
    });
    
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '🔍 Filter domains or titles...';
    searchBox.style.cssText = `
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      box-sizing: border-box;
    `;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    `;
    
    function renderResults(filterText = '') {
      resultsContainer.innerHTML = '';
      const filter = filterText.toLowerCase();
      
      allResults.forEach(result => {
        if (filter && !result.domain.includes(filter) && !result.title.toLowerCase().includes(filter)) {
          return;
        }
        
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          gap: 16px;
          ${result.isTarget ? 'background: #f1f8e9;' : ''}
        `;
        
        const rankSpan = document.createElement('span');
        rankSpan.style.cssText = `
          background: ${result.isTarget ? '#4CAF50' : '#2196F3'};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          min-width: 45px;
          text-align: center;
          height: fit-content;
        `;
        rankSpan.textContent = `#${result.rank}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'flex: 1;';
        
        const domainDiv = document.createElement('div');
        domainDiv.style.cssText = `
          font-weight: bold;
          color: ${result.isTarget ? '#2e7d32' : '#1976D2'};
          font-size: 16px;
          margin-bottom: 4px;
        `;
        domainDiv.textContent = result.domain;
        
        const metaDiv = document.createElement('div');
        metaDiv.style.cssText = 'font-size: 12px; color: #757575; margin-bottom: 4px;';
        metaDiv.textContent = `Page ${result.page}`;
        
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'color: #333; font-size: 13px; margin-bottom: 4px;';
        titleDiv.textContent = result.title;
        
        const urlDiv = document.createElement('div');
        urlDiv.style.cssText = 'color: #757575; font-size: 11px; word-break: break-all;';
        urlDiv.textContent = result.url;
        
        contentDiv.appendChild(domainDiv);
        contentDiv.appendChild(metaDiv);
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(urlDiv);
        resultDiv.appendChild(rankSpan);
        resultDiv.appendChild(contentDiv);
        resultsContainer.appendChild(resultDiv);
      });
    }
    
    renderResults();
    
    searchBox.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
    
    modal.appendChild(header);
    modal.appendChild(actions);
    modal.appendChild(searchBox);
    modal.appendChild(resultsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('exportCSV').onclick = () => {
      const csv = 'Rank,Domain,URL,Title,Page,Target\n' + allResults.map(r => 
        `${r.rank},"${r.domain}","${r.url}","${r.title.replace(/"/g, '""')}",${r.page},${r.isTarget ? 'Yes' : 'No'}`
      ).join('\n');
      downloadFile(csv, 'keyword-rankings.csv', 'text/csv');
      showNotification('CSV exported!', 'success');
    };
    
    document.getElementById('exportTXT').onclick = () => {
      const txt = allResults.map(r => 
        `${r.isTarget ? '🎯 ' : ''}#${r.rank} ${r.domain}`
      ).join('\n');
      downloadFile(txt, 'ranked-domains.txt', 'text/plain');
      showNotification('Rank list exported!', 'success');
    };
    
    document.getElementById('copyDomains').onclick = () => {
      const domains = [...new Set(allResults.map(r => r.domain))].join('\n');
      copyToClipboard(domains).then(() => {
        showNotification(`Copied ${domains.split('\n').length} domains to clipboard!`, 'success');
      });
    };
    
    document.getElementById('copyRankings').onclick = () => {
      const rankings = allResults.map(r => `#${r.rank} ${r.domain}`).join('\n');
      copyToClipboard(rankings).then(() => {
        showNotification(`Copied ${allResults.length} rankings to clipboard!`, 'success');
      });
    };
    
    document.getElementById('closeReport').onclick = () => overlay.remove();
    overlay.onclick = (e) => e.target === overlay && overlay.remove();
  }
  
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  extractionCancelled = false;
  extractRankingsFromPages();
}

// ==================== ADVANCED SEO TEXT COMPARE TOOL ====================

function advancedSEOCompare() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 16px;
    width: 95%;
    max-width: 1400px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🔍 Advanced SEO Text Compare</h2>
      <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">Compare content, meta tags, titles, and more with advanced SEO metrics</p>
    </div>
    <button id="closeCompareBtn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Main content area
  const mainContent = document.createElement('div');
  mainContent.style.cssText = `
    flex: 1;
    display: flex;
    overflow: hidden;
  `;

  // Left Panel
  const leftPanel = document.createElement('div');
  leftPanel.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
    overflow: hidden;
  `;

  // Right Panel
  const rightPanel = document.createElement('div');
  rightPanel.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  // Toolbar for both panels
  function createPanelToolbar(panelId, title) {
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    `;
    
    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <strong style="font-size: 14px; color: #333;">${title}</strong>
        <select id="${panelId}-source" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; background: white;">
          <option value="paste">📝 Paste Text</option>
          <option value="selection">📋 Current Selection</option>
          <option value="page">🌐 Entire Page</option>
          <option value="meta-title">🏷️ Meta Title</option>
          <option value="meta-description">📄 Meta Description</option>
          <option value="h1">📊 H1 Heading</option>
          <option value="first-paragraph">📖 First Paragraph</option>
        </select>
        <button id="${panelId}-load" style="padding: 4px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Load</button>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="${panelId}-clear" style="padding: 4px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear</button>
        <button id="${panelId}-copy" style="padding: 4px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Copy</button>
      </div>
    `;
    
    return toolbar;
  }

  // Text area for content
  function createTextArea(panelId) {
    const container = document.createElement('div');
    container.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;
    
    const textarea = document.createElement('textarea');
    textarea.id = `${panelId}-textarea`;
    textarea.style.cssText = `
      flex: 1;
      padding: 16px;
      border: none;
      resize: none;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      outline: none;
      background: #fff;
    `;
    textarea.placeholder = `Enter or load ${panelId === 'left' ? 'original' : 'comparison'} text here...`;
    
    container.appendChild(textarea);
    return container;
  }

  // Stats display
  function createStatsPanel(panelId) {
    const stats = document.createElement('div');
    stats.id = `${panelId}-stats`;
    stats.style.cssText = `
      padding: 8px 16px;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      font-size: 11px;
      color: #666;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    `;
    stats.innerHTML = `
      <span>📊 Characters: 0</span>
      <span>📝 Words: 0</span>
      <span>📏 Sentences: 0</span>
      <span>🔤 Unique Words: 0</span>
      <span>📖 Reading Time: 0 min</span>
    `;
    return stats;
  }

  // Create panels
  const leftToolbar = createPanelToolbar('left', 'Original Text');
  const leftTextArea = createTextArea('left');
  const leftStats = createStatsPanel('left');
  
  const rightToolbar = createPanelToolbar('right', 'Comparison Text');
  const rightTextArea = createTextArea('right');
  const rightStats = createStatsPanel('right');

  leftPanel.appendChild(leftToolbar);
  leftPanel.appendChild(leftTextArea);
  leftPanel.appendChild(leftStats);
  
  rightPanel.appendChild(rightToolbar);
  rightPanel.appendChild(rightTextArea);
  rightPanel.appendChild(rightStats);

  // Comparison Results Panel
  const resultsPanel = document.createElement('div');
  resultsPanel.style.cssText = `
    border-top: 1px solid #e0e0e0;
    background: #f8f9fa;
    max-height: 40%;
    overflow-y: auto;
  `;

  const resultsHeader = document.createElement('div');
  resultsHeader.style.cssText = `
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  `;
  resultsHeader.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span id="resultsToggle" style="font-size: 18px;">▼</span>
      <strong>📊 SEO Comparison Results</strong>
      <span id="similarityScore" style="background: #667eea; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">0% Similar</span>
    </div>
    <button id="refreshComparison" style="padding: 4px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Refresh Analysis</button>
  `;

  const resultsContent = document.createElement('div');
  resultsContent.id = 'resultsContent';
  resultsContent.style.cssText = `
    padding: 16px;
    display: block;
  `;

  resultsPanel.appendChild(resultsHeader);
  resultsPanel.appendChild(resultsContent);
  
  // Toggle results panel
  let resultsVisible = true;
  resultsHeader.addEventListener('click', (e) => {
    if (e.target.id !== 'refreshComparison') {
      resultsVisible = !resultsVisible;
      resultsContent.style.display = resultsVisible ? 'block' : 'none';
      document.getElementById('resultsToggle').textContent = resultsVisible ? '▼' : '▶';
    }
  });

  mainContent.appendChild(leftPanel);
  mainContent.appendChild(rightPanel);
  
  modal.appendChild(header);
  modal.appendChild(mainContent);
  modal.appendChild(resultsPanel);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Helper functions
  function updateStats(panelId, text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    const statsDiv = document.getElementById(`${panelId}-stats`);
    if (statsDiv) {
      statsDiv.innerHTML = `
        <span>📊 Characters: ${chars.toLocaleString()}</span>
        <span>📝 Words: ${words.toLocaleString()}</span>
        <span>📏 Sentences: ${sentences.toLocaleString()}</span>
        <span>🔤 Unique Words: ${uniqueWords.toLocaleString()}</span>
        <span>📖 Reading Time: ${readingTime} min</span>
      `;
    }
  }

  function loadContent(panelId, source) {
    const textarea = document.getElementById(`${panelId}-textarea`);
    if (!textarea) return;
    
    let content = '';
    
    switch(source) {
      case 'selection':
        const selection = window.getSelection().toString().trim();
        content = selection || 'No text selected. Please select text on the page.';
        break;
      case 'page':
        content = document.body.innerText || document.body.textContent;
        break;
      case 'meta-title':
        content = document.title || 'No meta title found';
        break;
      case 'meta-description':
        const metaDesc = document.querySelector('meta[name="description"]');
        content = metaDesc ? metaDesc.getAttribute('content') : 'No meta description found';
        break;
      case 'h1':
        const h1 = document.querySelector('h1');
        content = h1 ? h1.textContent : 'No H1 tag found';
        break;
      case 'first-paragraph':
        const firstP = document.querySelector('p');
        content = firstP ? firstP.textContent : 'No paragraph found';
        break;
      case 'paste':
      default:
        return;
    }
    
    textarea.value = content;
    updateStats(panelId, content);
    performComparison();
  }

  // Advanced comparison algorithms
  function calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return (intersection.size / union.size) * 100;
  }
  
  function calculateKeywordDensity(text, keywords) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const densities = {};
    
    keywords.forEach(keyword => {
      const count = words.filter(w => w === keyword.toLowerCase()).length;
      densities[keyword] = totalWords > 0 ? (count / totalWords) * 100 : 0;
    });
    
    return densities;
  }
  
  function calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.match(/\b\w+\b/g) || [];
    const syllables = words.reduce((count, word) => {
      return count + (word.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
    }, 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }
  
  function getReadabilityLevel(score) {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (College Graduate)';
  }
  
  function findKeywordGaps(text1, text2, topN = 10) {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const missingInText2 = [...words1].filter(w => !words2.has(w));
    const missingInText1 = [...words2].filter(w => !words1.has(w));
    
    // Get most important keywords (longer words are typically more meaningful)
    const importantMissing1 = missingInText1.sort((a,b) => b.length - a.length).slice(0, topN);
    const importantMissing2 = missingInText2.sort((a,b) => b.length - a.length).slice(0, topN);
    
    return { missingInText1: importantMissing1, missingInText2: importantMissing2 };
  }

  function performComparison() {
    const text1 = document.getElementById('left-textarea')?.value || '';
    const text2 = document.getElementById('right-textarea')?.value || '';
    
    if (!text1 && !text2) {
      resultsContent.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Enter text in both panels to see comparison results</div>';
      return;
    }
    
    const similarity = calculateSimilarity(text1, text2);
    const readability1 = calculateReadabilityScore(text1);
    const readability2 = calculateReadabilityScore(text2);
    const keywordGaps = findKeywordGaps(text1, text2);
    
    // Extract common keywords
    const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
    const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];
    const freq1 = {};
    const freq2 = {};
    
    words1.forEach(w => freq1[w] = (freq1[w] || 0) + 1);
    words2.forEach(w => freq2[w] = (freq2[w] || 0) + 1);
    
    const commonKeywords = Object.keys(freq1)
      .filter(k => freq2[k])
      .sort((a,b) => (freq2[b] + freq1[b]) - (freq2[a] + freq1[a]))
      .slice(0, 15);
    
    // Update similarity score in header
    const similaritySpan = document.getElementById('similarityScore');
    if (similaritySpan) {
      similaritySpan.textContent = `${Math.round(similarity)}% Similar`;
      similaritySpan.style.backgroundColor = similarity > 70 ? '#4CAF50' : similarity > 40 ? '#FF9800' : '#f44336';
    }
    
    // Build results HTML
    resultsContent.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <!-- Similarity Card -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📊 CONTENT SIMILARITY</div>
          <div style="font-size: 32px; font-weight: bold; color: ${similarity > 70 ? '#4CAF50' : similarity > 40 ? '#FF9800' : '#f44336'};">${Math.round(similarity)}%</div>
          <div style="font-size: 12px; color: #999; margin-top: 8px;">
            ${similarity > 80 ? 'Very similar content' : similarity > 50 ? 'Moderately similar' : 'Significant differences'}
          </div>
        </div>
        
        <!-- Readability Card -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📖 READABILITY SCORE</div>
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <span style="font-size: 24px; font-weight: bold;">${Math.round(readability1)}</span>
              <span style="font-size: 12px; color: #999;"> / ${Math.round(readability2)}</span>
            </div>
            <div style="font-size: 12px; color: #666;">Left | Right</div>
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 8px;">
            Left: ${getReadabilityLevel(readability1)}<br>
            Right: ${getReadabilityLevel(readability2)}
          </div>
        </div>
        
        <!-- Length Comparison -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #FF9800;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📏 CONTENT LENGTH</div>
          <div style="display: flex; gap: 16px; justify-content: space-between;">
            <div>
              <div style="font-size: 20px; font-weight: bold;">${text1.split(/\s+/).filter(w => w).length}</div>
              <div style="font-size: 10px; color: #999;">Left Words</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${text2.split(/\s+/).filter(w => w).length}</div>
              <div style="font-size: 10px; color: #999;">Right Words</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${Math.abs(text1.length - text2.length)}</div>
              <div style="font-size: 10px; color: #999;">Difference</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Keyword Gaps -->
      <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">🔑 KEYWORD GAPS ANALYSIS</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #667eea;">Missing in Right Text:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${keywordGaps.missingInText2.map(k => `<span style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${k}</span>`).join('') || '<span style="color: #999;">No significant gaps</span>'}
            </div>
          </div>
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #4CAF50;">Missing in Left Text:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${keywordGaps.missingInText1.map(k => `<span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${k}</span>`).join('') || '<span style="color: #999;">No significant gaps</span>'}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Common Keywords -->
      <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">⭐ TOP COMMON KEYWORDS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${commonKeywords.map(k => `<span style="background: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${k}</span>`).join('') || '<span style="color: #999;">No common keywords found</span>'}
        </div>
      </div>
      
      <!-- SEO Recommendations -->
      <div style="background: #fff3e0; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #FF9800;">
        <div style="font-weight: 600; margin-bottom: 12px; color: #e65100;">💡 SEO RECOMMENDATIONS</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
          ${similarity > 80 ? '<li>⚠️ Content is very similar - consider adding more unique value to avoid duplicate content issues</li>' : ''}
          ${similarity < 40 ? '<li>✅ Good content differentiation - maintain unique value proposition</li>' : ''}
          ${text1.split(/\s+/).length < 300 ? '<li>📝 Consider expanding content length for better SEO performance (target 300+ words)</li>' : ''}
          ${readability1 < 50 ? '<li>📚 Left text readability is low - simplify sentences for better user engagement</li>' : ''}
          ${readability2 < 50 ? '<li>📚 Right text readability is low - simplify sentences for better user engagement</li>' : ''}
          ${keywordGaps.missingInText2.length > 0 ? '<li>🔑 Right text missing important keywords from left - consider incorporating them</li>' : ''}
          ${keywordGaps.missingInText1.length > 0 ? '<li>🔑 Left text missing important keywords from right - consider incorporating them</li>' : ''}
        </ul>
      </div>
    `;
  }

  // Event listeners for panels
  function setupPanelListeners(panelId) {
    const loadBtn = document.getElementById(`${panelId}-load`);
    const clearBtn = document.getElementById(`${panelId}-clear`);
    const copyBtn = document.getElementById(`${panelId}-copy`);
    const sourceSelect = document.getElementById(`${panelId}-source`);
    const textarea = document.getElementById(`${panelId}-textarea`);
    
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        loadContent(panelId, sourceSelect.value);
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (textarea) {
          textarea.value = '';
          updateStats(panelId, '');
          performComparison();
        }
      });
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (textarea && textarea.value) {
          copyToClipboard(textarea.value).then(() => {
            showNotification('Text copied to clipboard!', 'success');
          });
        }
      });
    }
    
    if (textarea) {
      textarea.addEventListener('input', () => {
        updateStats(panelId, textarea.value);
        performComparison();
      });
    }
  }
  
  setupPanelListeners('left');
  setupPanelListeners('right');
  
  const refreshBtn = document.getElementById('refreshComparison');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', performComparison);
  }
  
  const closeBtn = document.getElementById('closeCompareBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
  }
  
  // Initial update
  performComparison();
  
  // Handle overlay click to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ==================== ADVANCED SEO IMAGE TOOLKIT ====================

function advancedImageToolkit() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 16px;
    width: 95%;
    max-width: 1400px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🖼️ Advanced SEO Image Toolkit</h2>
      <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">Resize, Convert, Optimize & Find Free Images for SEO</p>
    </div>
    <button id="closeImageToolkit" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.style.cssText = `
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 24px;
    gap: 8px;
  `;
  
  const tabs = [
    { id: 'resizer', name: '📐 Image Resizer', icon: '📐' },
    { id: 'converter', name: '🔄 Image Converter', icon: '🔄' },
    { id: 'sources', name: '📷 Free Image Sources', icon: '📷' },
    { id: 'optimizer', name: '⚡ Image Optimizer', icon: '⚡' },
    { id: 'analyzer', name: '🔍 SEO Analyzer', icon: '🔍' }
  ];
  
  const tabButtons = [];
  const tabContents = {};
  
  tabs.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.style.cssText = `
      padding: 12px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    `;
    if (index === 0) {
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
    }
    btn.onclick = () => {
      tabButtons.forEach(b => {
        b.style.color = '#666';
        b.style.borderBottomColor = 'transparent';
      });
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
      Object.values(tabContents).forEach(content => {
        content.style.display = 'none';
      });
      tabContents[tab.id].style.display = 'block';
    };
    tabsContainer.appendChild(btn);
    tabButtons.push(btn);
  });
  
  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  `;
  
  // ==================== IMAGE RESIZER TAB ====================
  const resizerTab = document.createElement('div');
  resizerTab.id = 'resizer-tab';
  resizerTab.style.cssText = `display: block;`;
  resizerTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- Upload Section -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="dropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
          <div style="font-size: 48px; margin-bottom: 12px;">📸</div>
          <div>Drag & drop image here or click to upload</div>
          <div style="font-size: 12px; color: #999; margin-top: 8px;">Supports: JPG, PNG, WebP, GIF, SVG</div>
        </div>
        <input type="file" id="imageUpload" accept="image/*" style="display: none;">
        <div id="imagePreview" style="margin-top: 20px; display: none;">
          <img id="previewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <!-- Resize Controls -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📏 Resize Options</h3>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Preset Sizes:</label>
          <select id="presetSizes" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="">Custom Size</option>
            <option value="150x150">Thumbnail (150x150)</option>
            <option value="300x200">Small (300x200)</option>
            <option value="600x400">Medium (600x400)</option>
            <option value="800x600">Large (800x600)</option>
            <option value="1200x800">Extra Large (1200x800)</option>
            <option value="1920x1080">Full HD (1920x1080)</option>
            <option value="social">Social Media (1200x630)</option>
            <option value="og-image">Open Graph (1200x630)</option>
            <option value="twitter-card">Twitter Card (800x418)</option>
          </select>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Width (px):</label>
            <input type="number" id="resizeWidth" placeholder="Auto" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Height (px):</label>
            <input type="number" id="resizeHeight" placeholder="Auto" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="maintainAspect" checked>
            <span>Maintain aspect ratio</span>
          </label>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quality:</label>
          <input type="range" id="resizeQuality" min="1" max="100" value="90" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
            <span>Low</span>
            <span id="qualityValue">90%</span>
            <span>High</span>
          </div>
        </div>
        
        <button id="resizeImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Resize Image</button>
        <button id="downloadResized" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Resized Image</button>
      </div>
    </div>
  `;
  
  // ==================== IMAGE CONVERTER TAB ====================
  const converterTab = document.createElement('div');
  converterTab.id = 'converter-tab';
  converterTab.style.cssText = `display: none;`;
  converterTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="converterDropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer;">
          <div style="font-size: 48px;">🔄</div>
          <div>Click to upload image for conversion</div>
        </div>
        <input type="file" id="converterUpload" accept="image/*" style="display: none;">
        <div id="converterPreview" style="margin-top: 20px; display: none;">
          <img id="converterPreviewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">🔄 Convert To</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <button class="format-btn" data-format="image/jpeg">JPEG</button>
          <button class="format-btn" data-format="image/png">PNG</button>
          <button class="format-btn" data-format="image/webp">WebP</button>
          <button class="format-btn" data-format="image/gif">GIF</button>
          <button class="format-btn" data-format="image/bmp">BMP</button>
          <button class="format-btn" data-format="image/tiff">TIFF</button>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quality:</label>
          <input type="range" id="convertQuality" min="1" max="100" value="85" style="width: 100%;">
          <div id="convertQualityValue" style="text-align: center; font-size: 12px; margin-top: 5px;">85%</div>
        </div>
        
        <button id="convertImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" disabled>Convert Image</button>
        <button id="downloadConverted" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Converted Image</button>
      </div>
    </div>
  `;
  
  // ==================== FREE IMAGE SOURCES TAB ====================
  const sourcesTab = document.createElement('div');
  sourcesTab.id = 'sources-tab';
  sourcesTab.style.cssText = `display: none;`;
  
  const imageSources = [
    { name: 'Unsplash', url: 'https://unsplash.com', description: 'High-quality free stock photos', category: 'Stock Photos', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Pexels', url: 'https://pexels.com', description: 'Free stock photos & videos', category: 'Stock Photos', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Pixabay', url: 'https://pixabay.com', description: 'Free images, illustrations, vectors', category: 'All Types', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Burst (by Shopify)', url: 'https://burst.shopify.com', description: 'Free stock photos for websites', category: 'E-commerce', rating: '⭐⭐⭐⭐' },
    { name: 'Kaboompics', url: 'https://kaboompics.com', description: 'Free stock photos with color search', category: 'Stock Photos', rating: '⭐⭐⭐⭐' },
    { name: 'Stocksnap.io', url: 'https://stocksnap.io', description: 'High-resolution free images', category: 'Stock Photos', rating: '⭐⭐⭐⭐' },
    { name: 'Reshot', url: 'https://reshot.com', description: 'Free icons & illustrations', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Freepik', url: 'https://freepik.com', description: 'Free vectors & illustrations', category: 'Vectors', rating: '⭐⭐⭐⭐' },
    { name: 'Flaticon', url: 'https://flaticon.com', description: 'Free icons for websites', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Iconscout', url: 'https://iconscout.com', description: 'Free illustrations & icons', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Canva', url: 'https://canva.com', description: 'Design tool with free images', category: 'Design Tool', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Remove.bg', url: 'https://remove.bg', description: 'Remove background from images', category: 'Tool', rating: '⭐⭐⭐⭐' }
  ];
  
  sourcesTab.innerHTML = `
    <div style="margin-bottom: 20px;">
      <input type="text" id="sourceSearch" placeholder="🔍 Search image sources..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;" id="sourcesGrid">
      ${imageSources.map(source => `
        <div class="source-card" style="background: #f8f9fa; padding: 16px; border-radius: 12px; cursor: pointer; transition: all 0.3s;" data-url="${source.url}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="margin: 0; font-size: 16px; color: #667eea;">${source.name}</h4>
            <span style="font-size: 12px; color: #999;">${source.rating}</span>
          </div>
          <p style="margin: 8px 0; font-size: 13px; color: #666;">${source.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <span style="background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${source.category}</span>
            <span style="color: #667eea; font-size: 12px;">Open →</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // ==================== IMAGE OPTIMIZER TAB ====================
  const optimizerTab = document.createElement('div');
  optimizerTab.id = 'optimizer-tab';
  optimizerTab.style.cssText = `display: none;`;
  optimizerTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="optimizerDropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer;">
          <div style="font-size: 48px;">⚡</div>
          <div>Upload image for optimization</div>
        </div>
        <input type="file" id="optimizerUpload" accept="image/*" style="display: none;">
        <div id="optimizerPreview" style="margin-top: 20px; display: none;">
          <img id="optimizerPreviewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📊 Optimization Results</h3>
        <div id="optimizationResults" style="margin-bottom: 20px;">
          <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Original Size:</span>
              <span id="originalSize">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Optimized Size:</span>
              <span id="optimizedSize">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Savings:</span>
              <span id="savings">-</span>
            </div>
            <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 12px;">
              <div id="savingsBar" style="height: 100%; background: #4CAF50; width: 0%;"></div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Optimization Level:</label>
          <input type="range" id="optimizationLevel" min="1" max="100" value="80" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Less Compression</span>
            <span id="levelValue">80%</span>
            <span>More Compression</span>
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="convertToWebP" checked>
            <span>Convert to WebP for better compression</span>
          </label>
        </div>
        
        <button id="optimizeImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" disabled>Optimize Image</button>
        <button id="downloadOptimized" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Optimized Image</button>
      </div>
    </div>
  `;
  
  // ==================== SEO ANALYZER TAB ====================
  const analyzerTab = document.createElement('div');
  analyzerTab.id = 'analyzer-tab';
  analyzerTab.style.cssText = `display: none;`;
  analyzerTab.innerHTML = `
    <div>
      <h3 style="margin: 0 0 16px; font-size: 18px;">🔍 Page Image SEO Analysis</h3>
      <div id="seoAnalysisResults" style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 48px;">🔍</div>
          <p>Click "Analyze Page Images" to check SEO metrics for images on this page</p>
          <button id="runSeoAnalysis" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Analyze Page Images</button>
        </div>
      </div>
    </div>
  `;
  
  contentContainer.appendChild(resizerTab);
  contentContainer.appendChild(converterTab);
  contentContainer.appendChild(sourcesTab);
  contentContainer.appendChild(optimizerTab);
  contentContainer.appendChild(analyzerTab);
  
  modal.appendChild(header);
  modal.appendChild(tabsContainer);
  modal.appendChild(contentContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  tabContents.resizer = resizerTab;
  tabContents.converter = converterTab;
  tabContents.sources = sourcesTab;
  tabContents.optimizer = optimizerTab;
  tabContents.analyzer = analyzerTab;
  
  // ==================== IMAGE RESIZER FUNCTIONALITY ====================
  let currentImageFile = null;
  let resizedBlob = null;
  
  const dropZone = document.getElementById('dropZone');
  const imageUpload = document.getElementById('imageUpload');
  const previewImg = document.getElementById('previewImg');
  const imagePreview = document.getElementById('imagePreview');
  const resizeWidth = document.getElementById('resizeWidth');
  const resizeHeight = document.getElementById('resizeHeight');
  const maintainAspect = document.getElementById('maintainAspect');
  const resizeQuality = document.getElementById('resizeQuality');
  const qualityValue = document.getElementById('qualityValue');
  const presetSizes = document.getElementById('presetSizes');
  const resizeBtn = document.getElementById('resizeImageBtn');
  const downloadResized = document.getElementById('downloadResized');
  
  let originalWidth = 0, originalHeight = 0;
  
  resizeQuality.addEventListener('input', () => {
    qualityValue.textContent = resizeQuality.value + '%';
  });
  
  dropZone.addEventListener('click', () => imageUpload.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#667eea';
    dropZone.style.background = '#f0f0f0';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = 'transparent';
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  });
  
  imageUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadImage(e.target.files[0]);
  });
  
  function loadImage(file) {
    currentImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalWidth = img.width;
        originalHeight = img.height;
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        resizeWidth.value = originalWidth;
        resizeHeight.value = originalHeight;
        resizeBtn.disabled = false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  presetSizes.addEventListener('change', () => {
    const value = presetSizes.value;
    if (value === 'social' || value === 'og-image') {
      resizeWidth.value = 1200;
      resizeHeight.value = 630;
    } else if (value === 'twitter-card') {
      resizeWidth.value = 800;
      resizeHeight.value = 418;
    } else if (value) {
      const [w, h] = value.split('x');
      resizeWidth.value = w;
      resizeHeight.value = h;
    }
  });
  
  resizeBtn.addEventListener('click', () => {
    if (!currentImageFile) return;
    
    let targetWidth = parseInt(resizeWidth.value);
    let targetHeight = parseInt(resizeHeight.value);
    
    if (isNaN(targetWidth)) targetWidth = originalWidth;
    if (isNaN(targetHeight)) targetHeight = originalHeight;
    
    if (maintainAspect.checked && targetWidth && targetHeight) {
      const ratio = originalWidth / originalHeight;
      const targetRatio = targetWidth / targetHeight;
      if (targetRatio > ratio) {
        targetWidth = Math.round(targetHeight * ratio);
      } else {
        targetHeight = Math.round(targetWidth / ratio);
      }
    }
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        resizedBlob = blob;
        downloadResized.style.display = 'block';
        showNotification(`Image resized to ${targetWidth}x${targetHeight}`, 'success');
      }, currentImageFile.type, resizeQuality.value / 100);
    };
    img.src = previewImg.src;
  });
  
  downloadResized.addEventListener('click', () => {
    if (resizedBlob) {
      const url = URL.createObjectURL(resizedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized_${currentImageFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== IMAGE CONVERTER FUNCTIONALITY ====================
  let converterImageFile = null;
  let convertedBlob = null;
  let selectedFormat = 'image/jpeg';
  
  const converterDropZone = document.getElementById('converterDropZone');
  const converterUpload = document.getElementById('converterUpload');
  const converterPreviewImg = document.getElementById('converterPreviewImg');
  const converterPreview = document.getElementById('converterPreview');
  const convertQuality = document.getElementById('convertQuality');
  const convertQualityValue = document.getElementById('convertQualityValue');
  const convertBtn = document.getElementById('convertImageBtn');
  const downloadConverted = document.getElementById('downloadConverted');
  
  convertQuality.addEventListener('input', () => {
    convertQualityValue.textContent = convertQuality.value + '%';
  });
  
  converterDropZone.addEventListener('click', () => converterUpload.click());
  converterUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadConverterImage(e.target.files[0]);
  });
  
  function loadConverterImage(file) {
    converterImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      converterPreviewImg.src = e.target.result;
      converterPreview.style.display = 'block';
      convertBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
  
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.format-btn').forEach(b => {
        b.style.background = '#e0e0e0';
        b.style.color = '#666';
      });
      btn.style.background = '#667eea';
      btn.style.color = 'white';
      selectedFormat = btn.dataset.format;
    });
  });
  
  convertBtn.addEventListener('click', () => {
    if (!converterImageFile) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      let mimeType = selectedFormat;
      canvas.toBlob((blob) => {
        convertedBlob = blob;
        downloadConverted.style.display = 'block';
        const formatName = selectedFormat.split('/')[1].toUpperCase();
        showNotification(`Image converted to ${formatName}`, 'success');
      }, mimeType, convertQuality.value / 100);
    };
    img.src = converterPreviewImg.src;
  });
  
  downloadConverted.addEventListener('click', () => {
    if (convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      const a = document.createElement('a');
      a.href = url;
      const ext = selectedFormat.split('/')[1];
      a.download = `converted.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== FREE IMAGE SOURCES ====================
  const sourceSearch = document.getElementById('sourceSearch');
  if (sourceSearch) {
    sourceSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.source-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  document.querySelectorAll('.source-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) window.open(url, '_blank');
    });
  });
  
  // ==================== IMAGE OPTIMIZER FUNCTIONALITY ====================
  let optimizerImageFile = null;
  let optimizedBlob = null;
  
  const optimizerDropZone = document.getElementById('optimizerDropZone');
  const optimizerUpload = document.getElementById('optimizerUpload');
  const optimizerPreviewImg = document.getElementById('optimizerPreviewImg');
  const optimizerPreview = document.getElementById('optimizerPreview');
  const optimizationLevel = document.getElementById('optimizationLevel');
  const levelValue = document.getElementById('levelValue');
  const convertToWebP = document.getElementById('convertToWebP');
  const optimizeBtn = document.getElementById('optimizeImageBtn');
  const downloadOptimized = document.getElementById('downloadOptimized');
  const originalSizeSpan = document.getElementById('originalSize');
  const optimizedSizeSpan = document.getElementById('optimizedSize');
  const savingsSpan = document.getElementById('savings');
  const savingsBar = document.getElementById('savingsBar');
  
  optimizationLevel.addEventListener('input', () => {
    levelValue.textContent = optimizationLevel.value + '%';
  });
  
  optimizerDropZone.addEventListener('click', () => optimizerUpload.click());
  optimizerUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadOptimizerImage(e.target.files[0]);
  });
  
  function loadOptimizerImage(file) {
    optimizerImageFile = file;
    originalSizeSpan.textContent = formatFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      optimizerPreviewImg.src = e.target.result;
      optimizerPreview.style.display = 'block';
      optimizeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
  
  optimizeBtn.addEventListener('click', () => {
    if (!optimizerImageFile) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const quality = optimizationLevel.value / 100;
      const mimeType = convertToWebP.checked ? 'image/webp' : optimizerImageFile.type;
      
      canvas.toBlob((blob) => {
        optimizedBlob = blob;
        const optimizedSize = blob.size;
        const savingsPercent = ((optimizerImageFile.size - optimizedSize) / optimizerImageFile.size * 100).toFixed(1);
        
        optimizedSizeSpan.textContent = formatFileSize(optimizedSize);
        savingsSpan.textContent = `${savingsPercent}% (${formatFileSize(optimizerImageFile.size - optimizedSize)} saved)`;
        savingsBar.style.width = `${savingsPercent}%`;
        
        downloadOptimized.style.display = 'block';
        showNotification(`Image optimized! Saved ${savingsPercent}%`, 'success');
        
        // Show preview of optimized image
        const optimizedUrl = URL.createObjectURL(blob);
        optimizerPreviewImg.src = optimizedUrl;
      }, mimeType, quality);
    };
    img.src = optimizerPreviewImg.src;
  });
  
  downloadOptimized.addEventListener('click', () => {
    if (optimizedBlob) {
      const url = URL.createObjectURL(optimizedBlob);
      const a = document.createElement('a');
      a.href = url;
      const ext = convertToWebP.checked ? 'webp' : optimizerImageFile.name.split('.').pop();
      a.download = `optimized_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== SEO ANALYZER FUNCTIONALITY ====================
  const runSeoAnalysis = document.getElementById('runSeoAnalysis');
  const seoAnalysisResults = document.getElementById('seoAnalysisResults');
  
  runSeoAnalysis.addEventListener('click', () => {
    const images = document.querySelectorAll('img');
    const results = {
      total: images.length,
      withAlt: 0,
      withoutAlt: 0,
      emptyAlt: 0,
      missingAlt: [],
      withLazyLoading: 0,
      missingDimensions: 0
    };
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (alt === null) {
        results.withoutAlt++;
        results.missingAlt.push(img.src || img.getAttribute('data-src') || 'Unknown');
      } else if (alt === '') {
        results.emptyAlt++;
      } else {
        results.withAlt++;
      }
      
      if (img.loading === 'lazy') results.withLazyLoading++;
      if (!img.width || !img.height) results.missingDimensions++;
    });
    
    seoAnalysisResults.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">📊 Page Image SEO Report</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.total}</div>
            <div style="font-size: 12px;">Total Images</div>
          </div>
          <div style="background: #c8e6c9; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withAlt}</div>
            <div style="font-size: 12px;">With Alt Text</div>
          </div>
          <div style="background: #ffcdd2; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withoutAlt + results.emptyAlt}</div>
            <div style="font-size: 12px;">Missing/Empty Alt</div>
          </div>
          <div style="background: #fff9c4; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withLazyLoading}</div>
            <div style="font-size: 12px;">Lazy Loading Enabled</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <strong>📋 Recommendations:</strong>
          <ul style="margin-top: 12px; padding-left: 20px;">
            ${results.withoutAlt + results.emptyAlt > 0 ? '<li>⚠️ Add descriptive alt text to all images for better accessibility and SEO</li>' : '<li>✅ All images have alt text - good job!</li>'}
            ${results.withLazyLoading < results.total ? '<li>💡 Consider adding lazy loading to improve page speed (loading="lazy")</li>' : '<li>✅ Good use of lazy loading!</li>'}
            ${results.missingDimensions > 0 ? '<li>📏 Set width and height attributes to prevent layout shift (CLS)</li>' : '<li>✅ Images have dimension attributes</li>'}
          </ul>
        </div>
        
        ${results.missingAlt.length > 0 ? `
          <details>
            <summary style="cursor: pointer; font-weight: 600; margin-bottom: 12px;">🔍 View Images Missing Alt Text (${results.missingAlt.length})</summary>
            <div style="max-height: 300px; overflow-y: auto;">
              ${results.missingAlt.map((src, i) => `<div style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 12px; word-break: break-all;">${i+1}. ${src.substring(0, 100)}</div>`).join('')}
            </div>
          </details>
        ` : ''}
        
        <button id="closeSeoAnalysis" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
      </div>
    `;
    
    document.getElementById('closeSeoAnalysis').addEventListener('click', () => {
      location.reload();
    });
  });
  
  // Helper functions
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 8px;
      z-index: 100001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Close button
  document.getElementById('closeImageToolkit').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ==================== ENHANCED SITE STRUCTURE ====================
function visualizeSiteStructure() {
  // ============ SELF-CONTAINED HELPERS ============
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();

  const escapeHtml = (str) => {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); document.body.removeChild(ta);
      return ok;
    }
  };

  const toast = (msg, type = 'success') => {
    const colors = {
      success: { bg: '#10b981', icon: '✓' },
      error: { bg: '#ef4444', icon: '✕' },
      info: { bg: '#3b82f6', icon: 'ℹ' },
      warning: { bg: '#f59e0b', icon: '!' }
    };
    const t = colors[type] || colors.info;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:2147483647;
      background:${t.bg};color:#fff;padding:14px 20px;border-radius:14px;
      font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,.25),0 0 0 1px rgba(255,255,255,.1) inset;
      display:flex;align-items:center;gap:10px;max-width:380px;pointer-events:none;
      animation:ssToastIn .4s cubic-bezier(.16,1,.3,1) forwards;
    `;
    el.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(255,255,255,.2);border-radius:50%;font-size:13px;">${t.icon}</span><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'ssToastOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  };

  const createModal = (title, contentNode) => {
    const overlay = document.createElement('div');
    overlay.id = 'ss-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:2147483646;
      background:rgba(15,23,42,.7);backdrop-filter:blur(16px);
      display:flex;align-items:center;justify-content:center;
      padding:16px;box-sizing:border-box;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      animation:ssFadeIn .25s ease;
    `;

    const modal = document.createElement('div');
    modal.id = 'ss-modal';
    modal.style.cssText = `
      background:#fff;border-radius:24px;width:100%;max-width:1200px;
      max-height:94vh;display:flex;flex-direction:column;
      box-shadow:0 30px 100px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.08) inset;
      animation:ssModalUp .4s cubic-bezier(.16,1,.3,1);
      overflow:hidden;position:relative;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding:18px 28px;border-bottom:1px solid #e2e8f0;
      display:flex;justify-content:space-between;align-items:center;
      background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);
    `;
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 16px rgba(99,102,241,.35);">🏗️</div>
        <div>
          <h1 style="margin:0;font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-.3px;">${title}</h1>
          <div style="font-size:12px;color:#64748b;font-weight:500;margin-top:2px;">Interactive site architecture analysis</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="ss-minimize" style="background:#fff;border:1px solid #e2e8f0;width:34px;height:34px;border-radius:10px;cursor:pointer;color:#64748b;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .15s;" title="Minimize">−</button>
        <button id="ss-close" style="background:#fee2e2;border:1px solid #fecaca;width:34px;height:34px;border-radius:10px;cursor:pointer;color:#dc2626;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .15s;" title="Close (Esc)">×</button>
      </div>
    `;

    const body = document.createElement('div');
    body.style.cssText = 'flex:1;overflow:hidden;display:flex;flex-direction:column;';
    body.appendChild(contentNode);

   modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- NEW MINIMIZE & CLOSE LOGIC ---
  const minimizeBtn = header.querySelector('#ss-minimize');
  const closeBtn = header.querySelector('#ss-close');
  let isMinimized = false;

  minimizeBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      body.style.display = 'none';
      modal.style.width = '350px';
      overlay.style.alignItems = 'flex-end';
      overlay.style.justifyContent = 'flex-end';
      minimizeBtn.innerHTML = '□';
      minimizeBtn.title = 'Expand';
    } else {
      body.style.display = 'flex';
      modal.style.width = '100%';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      minimizeBtn.innerHTML = '−';
      minimizeBtn.title = 'Minimize';
    }
  });

  closeBtn.addEventListener('click', destroy);
  // ----------------------------------

  overlay.addEventListener('click', (e) => { if (e.target === overlay) destroy(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') destroy(); }, { once: true });

  return overlay;
  };

  const destroy = () => { $('#ss-overlay')?.remove(); };

  // ============ DATA COLLECTION ENGINE ============
  const collectData = () => {
    const domain = window.location.hostname.replace(/^www\./, '');
    const currentPath = window.location.pathname;
    const fullUrl = window.location.href;
    const origin = window.location.origin;

    // Links analysis
    const links = $$('a[href]');
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
      $$(`h${i}`).forEach(h => {
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
      $$(sel).forEach(b => {
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
      $$(sel).forEach(n => {
        const text = clean(n.textContent).substring(0, 50);
        const href = n.href;
        if (text && !navItems.find(item => item.text === text)) {
          navItems.push({ text, href });
        }
      });
    });

    // Schema
    const schemaData = [];
    $$('script[type="application/ld+json"]').forEach(script => {
      try { schemaData.push(JSON.parse(script.textContent)); } catch (e) {}
    });

    // Meta tags
    const metaTags = {};
    $$('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
      const content = meta.getAttribute('content');
      if (name && content) metaTags[name] = content;
    });

    // Images
    const images = [];
    const imagesWithoutAlt = [];
    const imagesWithoutDimensions = [];
    $$('img').forEach(img => {
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
    const forms = $$('form').map(f => ({
      action: f.getAttribute('action') || '',
      method: f.getAttribute('method') || 'get',
      id: f.id || '',
      inputs: $$('input, textarea, select, button', f).length
    }));
    const inputs = $$('input, textarea, select').length;

    // Canonical & lang
    const canonical = $('link[rel="canonical"]')?.href || fullUrl;
    const htmlLang = document.documentElement.lang || 'Not specified';

    // Scripts & styles
    const scripts = $$('script[src]').map(s => s.src);
    const stylesheets = $$('link[rel="stylesheet"]').map(l => l.href);
    const inlineStyles = $$('[style]').length;

    // DOM stats
    const domStats = {
      totalElements: $$('*').length,
      maxDepth: 0,
      deepestPath: ''
    };

    const getDepth = (el, depth = 0) => {
      if (depth > domStats.maxDepth) {
        domStats.maxDepth = depth;
        domStats.deepestPath = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ').slice(0, 2).join('.') : '');
      }
      Array.from(el.children).forEach(c => getDepth(c, depth + 1));
    };
    getDepth(document.documentElement);

    // Page size
    const pageSizeKB = (document.documentElement.outerHTML.length / 1024).toFixed(2);

    // Responsive
    const viewport = $('meta[name="viewport"]')?.getAttribute('content') || '';
    const hasViewport = !!viewport;

    // URL analysis
    const pathSegments = currentPath.split('/').filter(Boolean);
    const urlDepth = pathSegments.length;

    return {
      domain, currentPath, fullUrl, origin,
      internalLinks, externalLinks, linkMap, brokenLinks, nofollowLinks, sponsoredLinks, ugcLinks, anchorTextMap,
      headings, headingHierarchy, hierarchyIssues,
      breadcrumbs, navItems,
      schemaData, metaTags,
      images, imagesWithoutAlt, imagesWithoutDimensions,
      forms, inputs,
      canonical, htmlLang,
      scripts, stylesheets, inlineStyles,
      domStats, pageSizeKB,
      viewport, hasViewport, urlDepth, pathSegments
    };
  };

  const data = collectData();

  // ============ SEO SCORING ============
  const calculateSEOScore = () => {
    let score = 100;
    const issues = [];
    const warnings = [];

    // H1 analysis
    const h1Count = data.headingHierarchy.h1;
    if (h1Count === 0) { score -= 15; issues.push('Missing H1 tag'); }
    else if (h1Count > 1) { score -= 10; warnings.push(`Multiple H1 tags (${h1Count})`); }

    // Meta description
    const desc = data.metaTags.description || '';
    if (!desc) { score -= 10; issues.push('Missing meta description'); }
    else if (desc.length < 50) { score -= 5; warnings.push('Meta description too short (<50 chars)'); }
    else if (desc.length > 160) { score -= 3; warnings.push('Meta description too long (>160 chars)'); }

    // Title
    const title = data.metaTags['og:title'] || data.metaTags['twitter:title'] || '';
    if (!title) { score -= 5; warnings.push('Missing social title tags'); }

    // Images
    if (data.imagesWithoutAlt.length > 0) {
      const penalty = Math.min(12, data.imagesWithoutAlt.length * 2);
      score -= penalty;
      issues.push(`${data.imagesWithoutAlt.length} images missing alt text`);
    }

    // Canonical
    if (data.canonical !== data.fullUrl) {
      score -= 5;
      warnings.push(`Canonical mismatch: ${data.canonical}`);
    }

    // URL depth
    if (data.urlDepth > 4) { score -= 5; warnings.push(`URL depth too deep (${data.urlDepth} levels)`); }

    // Language
    if (data.htmlLang === 'Not specified') { score -= 5; issues.push('Missing language declaration'); }

    // Viewport
    if (!data.hasViewport) { score -= 5; issues.push('Missing viewport meta tag'); }

    // Internal links
    if (data.internalLinks.length < 5) { score -= 5; warnings.push('Low internal link count'); }

    // Headings hierarchy
    if (data.hierarchyIssues.length > 0) {
      score -= Math.min(8, data.hierarchyIssues.length * 2);
      warnings.push(...data.hierarchyIssues.slice(0, 3));
    }

    // Page size
    if (parseFloat(data.pageSizeKB) > 500) { score -= 5; warnings.push(`Large page size (${data.pageSizeKB} KB)`); }

    return { score: Math.max(0, score), issues, warnings };
  };

  const seo = calculateSEOScore();

  // ============ UI STATE ============
  let activeTab = 'overview'; // 'overview' | 'structure' | 'links' | 'seo' | 'technical'
  let expandedNodes = new Set();
  let selectedNode = null;
  let viewMode = 'cards'; // 'cards' | 'tree' | 'graph'

  // ============ DOM TREE BUILDER ============
  const buildDomTree = (element, depth = 0, maxDepth = 3) => {
    if (depth > maxDepth) return null;
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className && typeof element.className === 'string' ?
      '.' + element.className.split(' ').slice(0, 2).join('.') : '';
    const children = Array.from(element.children).map(c => buildDomTree(c, depth + 1, maxDepth)).filter(Boolean);

    return {
      tag, id, classes,
      name: `${tag}${id}${classes}`,
      childCount: element.children.length,
      textLength: element.textContent?.length || 0,
      hasImage: !!element.querySelector('img'),
      hasLink: !!element.querySelector('a'),
      children: children.length > 0 ? children : null,
      depth
    };
  };

  const domTree = buildDomTree(document.body, 0, 2);

  // ============ RENDER ============
  const content = document.createElement('div');
content.style.cssText = 'display:flex;flex-direction:column;height:100%;overflow:hidden;';
  const render = () => {
    const uniqueInternal = [...data.linkMap.values()].sort((a, b) => b.count - a.count);
    const externalDomains = [...new Set(data.externalLinks.map(l => {
      try { return new URL(l.url).hostname; } catch { return ''; }
    }))].filter(Boolean);

    content.innerHTML = `
      <style>
        @keyframes ssFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes ssModalUp{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes ssToastIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ssToastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}
        @keyframes ssPulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes ssNodeIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        .ss-btn{padding:10px 16px;border:none;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap;}
        .ss-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.12);}
        .ss-btn:disabled{opacity:.5;cursor:not-allowed;}
        .ss-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;}
        .ss-secondary{background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;}
        .ss-success{background:#10b981;color:#fff;}
        .ss-danger{background:#fee2e2;color:#dc2626;border:1px solid #fecaca;}
        .ss-warning{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}
        .ss-tab{padding:12px 20px;font-size:13px;font-weight:700;color:#64748b;background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px;}
        .ss-tab.active{color:#6366f1;border-bottom-color:#6366f1;}
        .ss-tab:hover:not(.active){color:#334155;background:#f8fafc;}
        .ss-score-ring{position:relative;width:80px;height:80px;}
        .ss-score-ring svg{transform:rotate(-90deg);}
        .ss-score-ring .ss-score-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
        .ss-node{padding:8px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-family:monospace;cursor:pointer;transition:all .15s;display:inline-block;}
        .ss-node:hover{background:#f8fafc;border-color:#6366f1;}
        .ss-node.selected{background:#eff6ff;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.2);}
        .ss-tree-line{width:1px;background:#e2e8f0;margin-left:16px;}
        .ss-expand-btn{width:18px;height:18px;border-radius:4px;border:1px solid #cbd5e1;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;color:#64748b;flex-shrink:0;}
      </style>

      <!-- Toolbar -->
      <div style="padding:12px 24px;border-bottom:1px solid #e2e8f0;background:#fff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button data-tab="overview" class="ss-tab ${activeTab === 'overview' ? 'active' : ''}">📊 Overview</button>
          <button data-tab="structure" class="ss-tab ${activeTab === 'structure' ? 'active' : ''}">🏗️ Structure</button>
          <button data-tab="links" class="ss-tab ${activeTab === 'links' ? 'active' : ''}">🔗 Links</button>
          <button data-tab="seo" class="ss-tab ${activeTab === 'seo' ? 'active' : ''}">🎯 SEO</button>
          <button data-tab="technical" class="ss-tab ${activeTab === 'technical' ? 'active' : ''}">⚙️ Technical</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${activeTab === 'structure' ? `
            <div style="display:flex;gap:4px;background:#f1f5f9;padding:4px;border-radius:8px;">
              <button data-view="cards" class="ss-view-btn ${viewMode === 'cards' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'cards' ? '#fff' : 'transparent'};color:${viewMode === 'cards' ? '#6366f1' : '#64748b'};font-size:12px;font-weight:700;cursor:pointer;box-shadow:${viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,.1)' : 'none'};">Cards</button>
              <button data-view="tree" class="ss-view-btn ${viewMode === 'tree' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'tree' ? '#fff' : 'transparent'};color:${viewMode === 'tree' ? '#6366f1' : '#64748b'};font-size:12px;font-weight:700;cursor:pointer;box-shadow:${viewMode === 'tree' ? '0 1px 3px rgba(0,0,0,.1)' : 'none'};">Tree</button>
              <button data-view="graph" class="ss-view-btn ${viewMode === 'graph' ? 'active' : ''}" style="padding:6px 12px;border:none;border-radius:6px;background:${viewMode === 'graph' ? '#fff' : 'transparent'};color:${viewMode === 'graph' ? '#6366f1' : '#64748b'};font-size:12px;font-weight:700;cursor:pointer;box-shadow:${viewMode === 'graph' ? '0 1px 3px rgba(0,0,0,.1)' : 'none'};">Graph</button>
            </div>
          ` : ''}
          <button id="ss-export" class="ss-btn ss-secondary" style="padding:8px 14px;font-size:12px;">📤 Export</button>
        </div>
      </div>

      <!-- Content Area -->
      <div style="flex:1;overflow-y:auto;padding:24px;background:#f8fafc;">
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
    const h1Count = data.headingHierarchy.h1;
    const h1Status = h1Count === 1 ? { color: '#10b981', bg: '#dcfce7', text: 'Perfect' } :
      h1Count === 0 ? { color: '#ef4444', bg: '#fee2e2', text: 'Missing' } :
      { color: '#f59e0b', bg: '#fef3c7', text: `${h1Count} found` };

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:24px;">
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.5px;">SEO Score</div>
            <div style="padding:4px 10px;border-radius:20px;background:${seo.score >= 80 ? '#dcfce7' : seo.score >= 60 ? '#fef3c7' : '#fee2e2'};color:${seo.score >= 80 ? '#059669' : seo.score >= 60 ? '#b45309' : '#dc2626'};font-size:11px;font-weight:700;">${seo.score >= 80 ? 'Good' : seo.score >= 60 ? 'Fair' : 'Poor'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <div class="ss-score-ring">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" stroke-width="7"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="${seo.score >= 80 ? '#10b981' : seo.score >= 60 ? '#f59e0b' : '#ef4444'}" stroke-width="7"
                  stroke-dasharray="${2 * Math.PI * 34}" stroke-dashoffset="${2 * Math.PI * 34 * (1 - seo.score / 100)}"
                  stroke-linecap="round" style="transition:stroke-dashoffset 1s ease;"/>
              </svg>
              <div class="ss-score-text">
                <div style="font-size:24px;font-weight:800;color:${seo.score >= 80 ? '#059669' : seo.score >= 60 ? '#b45309' : '#dc2626'};">${seo.score}</div>
              </div>
            </div>
            <div style="flex:1;">
              <div style="font-size:13px;color:#475569;line-height:1.5;">
                ${seo.issues.length ? `<div style="color:#dc2626;margin-bottom:4px;">${seo.issues.length} critical issues</div>` : ''}
                ${seo.warnings.length ? `<div style="color:#b45309;">${seo.warnings.length} warnings</div>` : ''}
                ${!seo.issues.length && !seo.warnings.length ? '<div style="color:#059669;">✅ All checks passed</div>' : ''}
              </div>
            </div>
          </div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Link Profile</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <div style="font-size:28px;font-weight:800;color:#6366f1;">${data.internalLinks.length}</div>
              <div style="font-size:12px;color:#64748b;">Internal</div>
            </div>
            <div>
              <div style="font-size:28px;font-weight:800;color:#8b5cf6;">${data.externalLinks.length}</div>
              <div style="font-size:12px;color:#64748b;">External</div>
            </div>
            <div>
              <div style="font-size:28px;font-weight:800;color:#0f172a;">${uniqueInternal.length}</div>
              <div style="font-size:12px;color:#64748b;">Unique Pages</div>
            </div>
            <div>
              <div style="font-size:28px;font-weight:800;color:#f59e0b;">${externalDomains.length}</div>
              <div style="font-size:12px;color:#64748b;">Ext. Domains</div>
            </div>
          </div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Content Structure</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">H1 Tags</span>
              <span style="padding:3px 10px;border-radius:20px;background:${h1Status.bg};color:${h1Status.color};font-size:12px;font-weight:700;">${h1Status.text}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">Total Headings</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.headings.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">Images</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.images.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">Forms</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.forms.length}</span>
            </div>
          </div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <div style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Page Health</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">Page Size</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.pageSizeKB} KB</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">DOM Depth</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.domStats.maxDepth}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">Elements</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.domStats.totalElements.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:#475569;">URL Depth</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a;">${data.urlDepth} levels</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Issues -->
      ${seo.issues.length > 0 ? `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🚨 Critical Issues</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${seo.issues.map(issue => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;">
                <div style="width:28px;height:28px;border-radius:50%;background:#ef4444;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">!</div>
                <div style="font-weight:700;color:#991b1b;font-size:13px;">${escapeHtml(issue)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Top Pages -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
        <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🔗 Most Linked Internal Pages</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${uniqueInternal.slice(0, 8).map((item, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;transition:all .15s;" onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='#f8fafc'">
              <span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${i + 1}</span>
              <div style="flex:1;min-width:0;">
                <div style="font-family:monospace;font-size:12px;color:#334155;word-break:break-all;">${escapeHtml(item.path)}</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px;">${[...new Set(item.texts)].slice(0, 2).join(' • ')}</div>
              </div>
              <span style="padding:4px 12px;border-radius:20px;background:#e0e7ff;color:#3730a3;font-size:12px;font-weight:700;flex-shrink:0;">${item.count} links</span>
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
        <!-- Headings Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:8px;">
            <span style="width:32px;height:32px;border-radius:8px;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:16px;">📑</span>
            Heading Hierarchy
          </h3>
          <div style="display:flex;flex-direction:column;gap:6px;max-height:400px;overflow-y:auto;">
            ${data.headings.map(h => `
              <div style="padding:10px 12px;border-radius:8px;background:${h.level === 1 ? '#eff6ff' : h.level === 2 ? '#f8fafc' : '#fff'};border-left:3px solid ${h.level === 1 ? '#3b82f6' : h.level === 2 ? '#6366f1' : '#cbd5e1'};margin-left:${(h.level - 1) * 16}px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:11px;font-weight:800;color:${h.level === 1 ? '#3b82f6' : '#64748b'};text-transform:uppercase;">H${h.level}</span>
                  <span style="font-size:13px;color:#0f172a;font-weight:600;">${escapeHtml(h.text)}</span>
                </div>
                ${h.id ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">#${escapeHtml(h.id)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ${data.hierarchyIssues.length ? `
            <div style="margin-top:12px;padding:10px;border-radius:8px;background:#fef3c7;border:1px solid #fcd34d;">
              <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:4px;">⚠️ Hierarchy Issues</div>
              ${data.hierarchyIssues.map(i => `<div style="font-size:11px;color:#b45309;">• ${escapeHtml(i)}</div>`).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Breadcrumbs Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:8px;">
            <span style="width:32px;height:32px;border-radius:8px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:16px;">🧭</span>
            Breadcrumbs
          </h3>
          ${data.breadcrumbs.length ? `
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              ${data.breadcrumbs.map((b, i) => `
                <span style="padding:6px 14px;border-radius:20px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:12px;font-weight:700;">${escapeHtml(b)}</span>
                ${i < data.breadcrumbs.length - 1 ? '<span style="color:#cbd5e1;">→</span>' : ''}
              `).join('')}
            </div>
          ` : '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">No breadcrumbs detected</div>'}
        </div>

        <!-- Navigation Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:8px;">
            <span style="width:32px;height:32px;border-radius:8px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:16px;">🧭</span>
            Navigation Items
          </h3>
          <div style="display:flex;flex-wrap:wrap;gap:6px;max-height:300px;overflow-y:auto;">
            ${data.navItems.slice(0, 40).map(item => `
              <span style="padding:6px 12px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:12px;color:#334155;font-weight:500;transition:all .15s;" title="${escapeHtml(item.href)}" onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'">${escapeHtml(item.text)}</span>
            `).join('')}
            ${data.navItems.length > 40 ? `<span style="padding:6px 12px;color:#94a3b8;font-size:12px;">+${data.navItems.length - 40} more</span>` : ''}
          </div>
        </div>

        <!-- DOM Tree Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:8px;">
            <span style="width:32px;height:32px;border-radius:8px;background:#f5f3ff;display:flex;align-items:center;justify-content:center;font-size:16px;">🌳</span>
            DOM Snapshot
          </h3>
          <div style="font-family:monospace;font-size:12px;color:#475569;line-height:1.6;background:#f8fafc;padding:16px;border-radius:10px;overflow-x:auto;">
            ${renderDomNode(domTree, 0)}
          </div>
        </div>
      </div>
    `;
  };

  const renderDomNode = (node, depth) => {
    if (!node) return '';
    const indent = '  '.repeat(depth);
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.name) || depth < 1;

    return `
      <div style="margin-left:${depth * 12}px;">
        <div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px 0;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.ss-chevron').style.transform=this.nextElementSibling.style.display==='none'?'rotate(-90deg)':'rotate(0deg)'">
          ${hasChildren ? `<span class="ss-chevron" style="transition:transform .2s;${isExpanded ? '' : 'transform:rotate(-90deg);'}">▼</span>` : '<span style="width:14px;"></span>'}
          <span style="color:#6366f1;font-weight:700;">${node.tag}</span>
          ${node.id ? `<span style="color:#059669;">${node.id}</span>` : ''}
          ${node.classes ? `<span style="color:#d97706;">${node.classes}</span>` : ''}
          <span style="color:#94a3b8;font-size:11px;">(${node.childCount} children${node.textLength ? `, ${node.textLength} chars` : ''})</span>
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
    // Simplified tree visualization
    const buildTree = (node, prefix = '', isLast = true) => {
      if (!node) return '';
      const connector = prefix + (isLast ? '└── ' : '├── ');
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      let result = `<div style="font-family:monospace;font-size:12px;color:#475569;padding:2px 0;white-space:nowrap;">${connector}<span style="color:#6366f1;font-weight:700;">${node.tag}</span>${node.id || ''}${node.classes || ''}</div>`;
      if (node.children) {
        node.children.forEach((child, i) => {
          result += buildTree(child, childPrefix, i === node.children.length - 1);
        });
      }
      return result;
    };

    return `
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
        <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🌳 DOM Tree View</h3>
        <div style="background:#f8fafc;padding:20px;border-radius:12px;overflow-x:auto;">
          ${buildTree(domTree)}
        </div>
      </div>
    `;
  };

  const renderGraphView = () => {
    // Create a visual node graph of page connections
    const nodes = [{ id: 'root', label: data.currentPath || '/', type: 'root', x: 400, y: 50 }];
    const edges = [];

    const uniqueInternal = [...data.linkMap.values()].slice(0, 15);
    uniqueInternal.forEach((item, i) => {
      const angle = (i / uniqueInternal.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 200;
      nodes.push({
        id: `node-${i}`,
        label: item.path.length > 25 ? item.path.substring(0, 22) + '...' : item.path,
        fullPath: item.path,
        count: item.count,
        x: 400 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius * 0.6
      });
      edges.push({ from: 'root', to: `node-${i}`, weight: item.count });
    });

    const maxCount = Math.max(...edges.map(e => e.weight), 1);

    return `
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
        <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🕸️ Link Graph Visualization</h3>
        <div style="position:relative;width:100%;height:500px;background:#f8fafc;border-radius:12px;overflow:hidden;">
          <svg width="100%" height="100%" viewBox="0 0 800 400" style="position:absolute;top:0;left:0;">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1"/>
              </marker>
            </defs>
            ${edges.map(e => {
              const fromNode = nodes.find(n => n.id === e.from);
              const toNode = nodes.find(n => n.id === e.to);
              const strokeWidth = 1 + (e.weight / maxCount) * 3;
              return `<line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" stroke="#cbd5e1" stroke-width="${strokeWidth}" opacity="0.6" marker-end="url(#arrowhead)"/>`;
            }).join('')}
            ${nodes.map(n => `
              <g transform="translate(${n.x},${n.y})" style="cursor:pointer;">
                <circle r="${n.type === 'root' ? 30 : 20 + (n.count || 0) * 2}" fill="${n.type === 'root' ? '#6366f1' : '#8b5cf6'}" opacity="0.9"/>
                <text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" style="pointer-events:none;">${n.type === 'root' ? '🏠' : n.count || ''}</text>
              </g>
            `).join('')}
          </svg>
          ${nodes.map(n => `
            <div style="position:absolute;left:${(n.x / 800) * 100}%;top:${(n.y / 400) * 100}%;transform:translate(-50%,${n.type === 'root' ? '-120%' : '120%'});text-align:center;pointer-events:none;">
              <div style="font-size:11px;font-weight:700;color:#334155;background:rgba(255,255,255,.9);padding:4px 8px;border-radius:6px;white-space:nowrap;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,.08);">
                ${escapeHtml(n.label)}
                ${n.count ? `<span style="color:#6366f1;margin-left:4px;">(${n.count})</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:#64748b;">
          <div style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:50%;background:#6366f1;"></span> Current Page</div>
          <div style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:50%;background:#8b5cf6;"></span> Linked Pages</div>
          <div style="display:flex;align-items:center;gap:6px;"><span style="width:30px;height:2px;background:#cbd5e1;"></span> Link thickness = frequency</div>
        </div>
      </div>
    `;
  };

  const renderLinks = (uniqueInternal, externalDomains) => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:14px;">
        <!-- Internal Links Detail -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🔗 Internal Links (${data.internalLinks.length})</h3>
          <div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${uniqueInternal.slice(0, 20).map(item => `
              <div style="padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-family:monospace;font-size:12px;color:#334155;word-break:break-all;">${escapeHtml(item.path)}</span>
                  <span style="padding:2px 8px;border-radius:12px;background:#e0e7ff;color:#3730a3;font-size:11px;font-weight:700;flex-shrink:0;">${item.count}×</span>
                </div>
                <div style="font-size:11px;color:#64748b;">
                  Anchors: ${[...new Set(item.texts)].slice(0, 3).map(t => `"${escapeHtml(t)}"`).join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- External Links -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🌐 External Domains (${externalDomains.length})</h3>
          <div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${externalDomains.slice(0, 25).map(domain => {
              const count = data.externalLinks.filter(l => l.url.includes(domain)).length;
              const nofollowCount = data.externalLinks.filter(l => l.url.includes(domain) && l.isNofollow).length;
              return `
                <div style="padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:13px;color:#334155;font-weight:600;">${escapeHtml(domain)}</span>
                  <div style="display:flex;gap:6px;">
                    <span style="padding:2px 8px;border-radius:12px;background:#dbeafe;color:#1e40af;font-size:11px;font-weight:700;">${count} links</span>
                    ${nofollowCount ? `<span style="padding:2px 8px;border-radius:12px;background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;">${nofollowCount} nofollow</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Link Attributes -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🏷️ Link Attributes</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="padding:14px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#dc2626;">${data.nofollowLinks.length}</div>
              <div style="font-size:12px;color:#991b1b;font-weight:600;">Nofollow</div>
            </div>
            <div style="padding:14px;border-radius:10px;background:#fef3c7;border:1px solid #fcd34d;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#b45309;">${data.sponsoredLinks.length}</div>
              <div style="font-size:12px;color:#92400e;font-weight:600;">Sponsored</div>
            </div>
            <div style="padding:14px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#1e40af;">${data.ugcLinks.length}</div>
              <div style="font-size:12px;color:#1e40af;font-weight:600;">UGC</div>
            </div>
            <div style="padding:14px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#059669;">${data.brokenLinks.length}</div>
              <div style="font-size:12px;color:#059669;font-weight:600;">Broken</div>
            </div>
          </div>
          ${data.brokenLinks.length ? `
            <div style="margin-top:12px;padding:10px;border-radius:8px;background:#fee2e2;border:1px solid #fecaca;">
              <div style="font-size:12px;font-weight:700;color:#991b1b;margin-bottom:6px;">Broken Links</div>
              ${data.brokenLinks.slice(0, 5).map(l => `
                <div style="font-size:11px;color:#dc2626;word-break:break-all;margin-bottom:3px;">${escapeHtml(l.url)} — ${escapeHtml(l.error)}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Anchor Text Analysis -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📝 Anchor Text Variations</h3>
          <div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
            ${[...data.anchorTextMap.entries()].slice(0, 15).map(([path, texts]) => `
              <div style="padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;">
                <div style="font-family:monospace;font-size:11px;color:#64748b;word-break:break-all;margin-bottom:4px;">${escapeHtml(path)}</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">
                  ${[...texts].slice(0, 4).map(t => `
                    <span style="padding:3px 8px;border-radius:6px;background:#e0e7ff;color:#3730a3;font-size:11px;font-weight:600;">"${escapeHtml(t)}"</span>
                  `).join('')}
                  ${texts.size > 4 ? `<span style="padding:3px 8px;color:#94a3b8;font-size:11px;">+${texts.size - 4} more</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const renderSEO = () => {
    const desc = data.metaTags.description || '';
    const title = data.metaTags['og:title'] || data.metaTags['twitter:title'] || '';

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:14px;">
        <!-- SEO Score Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.04);grid-column:1 / -1;">
          <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;">
            <div class="ss-score-ring" style="width:100px;height:100px;">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke="${seo.score >= 80 ? '#10b981' : seo.score >= 60 ? '#f59e0b' : '#ef4444'}" stroke-width="8"
                  stroke-dasharray="${2 * Math.PI * 42}" stroke-dashoffset="${2 * Math.PI * 42 * (1 - seo.score / 100)}"
                  stroke-linecap="round" style="transition:stroke-dashoffset 1s ease;"/>
              </svg>
              <div class="ss-score-text">
                <div style="font-size:32px;font-weight:800;color:${seo.score >= 80 ? '#059669' : seo.score >= 60 ? '#b45309' : '#dc2626'};">${seo.score}</div>
                <div style="font-size:11px;color:#64748b;font-weight:600;">/100</div>
              </div>
            </div>
            <div style="flex:1;min-width:250px;">
              <div style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:8px;">SEO Health Check</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${seo.issues.map(i => `<span style="padding:4px 12px;border-radius:20px;background:#fee2e2;color:#991b1b;font-size:12px;font-weight:700;">🚨 ${escapeHtml(i)}</span>`).join('')}
                ${seo.warnings.map(w => `<span style="padding:4px 12px;border-radius:20px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;">⚠️ ${escapeHtml(w)}</span>`).join('')}
                ${!seo.issues.length && !seo.warnings.length ? '<span style="padding:4px 12px;border-radius:20px;background:#dcfce7;color:#059669;font-size:12px;font-weight:700;">✅ All checks passed</span>' : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Meta Tags -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📝 Meta Tags</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${Object.entries(data.metaTags).slice(0, 20).map(([name, content]) => {
              const isLong = content.length > 100;
              const isOptimal = name === 'description' && content.length >= 50 && content.length <= 160;
              return `
                <div style="padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;${isOptimal ? 'border-left:3px solid #10b981;' : ''}">
                  <div style="font-size:11px;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px;">${escapeHtml(name)}</div>
                  <div style="font-size:12px;color:#334155;word-break:break-all;${isLong ? 'line-height:1.5;' : ''}">${escapeHtml(content)}</div>
                  ${name === 'description' ? `<div style="font-size:11px;color:${content.length >= 50 && content.length <= 160 ? '#059669' : '#dc2626'};margin-top:2px;font-weight:600;">${content.length} characters ${content.length >= 50 && content.length <= 160 ? '✓' : '✗'}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Schema Data -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📋 Schema.org JSON-LD</h3>
          ${data.schemaData.length ? `
            <div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;">
              ${data.schemaData.map((schema, i) => `
                <div style="padding:12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <span style="padding:3px 8px;border-radius:6px;background:#e0e7ff;color:#3730a3;font-size:11px;font-weight:700;">${schema['@type'] || 'Unknown'}</span>
                    <span style="font-size:11px;color:#94a3b8;">Schema #${i + 1}</span>
                  </div>
                  <pre style="margin:0;font-size:11px;color:#475569;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${escapeHtml(JSON.stringify(schema, null, 2))}</pre>
                </div>
              `).join('')}
            </div>
          ` : '<div style="text-align:center;padding:40px;color:#94a3b8;">No schema markup found</div>'}
        </div>

        <!-- Heading Analysis -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📑 Heading Analysis</h3>
          <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
            ${Object.entries(data.headingHierarchy).map(([level, count]) => count > 0 ? `
              <div style="padding:8px 16px;border-radius:10px;background:${level === 'h1' ? '#eff6ff' : '#f8fafc'};border:1px solid ${level === 'h1' ? '#bfdbfe' : '#e2e8f0'};text-align:center;min-width:60px;">
                <div style="font-size:20px;font-weight:800;color:${level === 'h1' ? '#3b82f6' : '#64748b'};">${count}</div>
                <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;">${level}</div>
              </div>
            ` : '').join('')}
          </div>
          ${data.hierarchyIssues.length ? `
            <div style="padding:10px;border-radius:8px;background:#fef3c7;border:1px solid #fcd34d;margin-bottom:12px;">
              <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:4px;">⚠️ Hierarchy Issues</div>
              ${data.hierarchyIssues.map(i => `<div style="font-size:11px;color:#b45309;">• ${escapeHtml(i)}</div>`).join('')}
            </div>
          ` : ''}
          <div style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
            ${data.headings.map(h => `
              <div style="padding:8px 10px;border-radius:6px;background:${h.level === 1 ? '#eff6ff' : h.level === 2 ? '#f8fafc' : '#fff'};border-left:2px solid ${h.level === 1 ? '#3b82f6' : h.level === 2 ? '#6366f1' : '#cbd5e1'};margin-left:${(h.level - 1) * 12}px;">
                <span style="font-size:10px;font-weight:800;color:${h.level === 1 ? '#3b82f6' : '#94a3b8'};margin-right:6px;">H${h.level}</span>
                <span style="font-size:12px;color:#334155;">${escapeHtml(h.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Image SEO -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">🖼️ Image SEO</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
            <div style="text-align:center;padding:12px;border-radius:10px;background:#f8fafc;">
              <div style="font-size:24px;font-weight:800;color:#0f172a;">${data.images.length}</div>
              <div style="font-size:11px;color:#64748b;">Total</div>
            </div>
            <div style="text-align:center;padding:12px;border-radius:10px;background:${data.imagesWithoutAlt.length ? '#fef2f2' : '#f0fdf4'};">
              <div style="font-size:24px;font-weight:800;color:${data.imagesWithoutAlt.length ? '#dc2626' : '#059669'};">${data.imagesWithoutAlt.length}</div>
              <div style="font-size:11px;color:#64748b;">Missing Alt</div>
            </div>
            <div style="text-align:center;padding:12px;border-radius:10px;background:${data.imagesWithoutDimensions.length ? '#fef3c7' : '#f0fdf4'};">
              <div style="font-size:24px;font-weight:800;color:${data.imagesWithoutDimensions.length ? '#b45309' : '#059669'};">${data.imagesWithoutDimensions.length}</div>
              <div style="font-size:11px;color:#64748b;">No Dimensions</div>
            </div>
          </div>
          ${data.imagesWithoutAlt.length ? `
            <div style="max-height:200px;overflow-y:auto;">
              <div style="font-size:12px;font-weight:700;color:#991b1b;margin-bottom:6px;">Images Missing Alt Text</div>
              ${data.imagesWithoutAlt.slice(0, 8).map(src => `
                <div style="font-size:11px;color:#dc2626;word-break:break-all;padding:4px 0;border-bottom:1px solid #fee2e2;">${escapeHtml(src.substring(0, 80))}${src.length > 80 ? '...' : ''}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  };

  const renderTechnical = () => {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
        <!-- Page Info -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📄 Page Information</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Canonical URL</span>
              <span style="font-size:12px;color:#334155;font-weight:600;word-break:break-all;max-width:200px;text-align:right;">${escapeHtml(data.canonical)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Language</span>
              <span style="font-size:13px;color:${data.htmlLang === 'Not specified' ? '#dc2626' : '#334155'};font-weight:600;">${escapeHtml(data.htmlLang)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Page Size</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.pageSizeKB} KB</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">DOM Elements</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.domStats.totalElements.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Max DOM Depth</span>
              <span style="font-size:13px;color:${data.domStats.maxDepth > 32 ? '#dc2626' : '#334155'};font-weight:600;">${data.domStats.maxDepth}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
              <span style="font-size:13px;color:#64748b;">Deepest Element</span>
              <span style="font-size:11px;color:#334155;font-weight:600;font-family:monospace;word-break:break-all;max-width:200px;text-align:right;">${escapeHtml(data.domStats.deepestPath)}</span>
            </div>
          </div>
        </div>

        <!-- Responsive -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📱 Responsive</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Viewport Meta</span>
              <span style="font-size:13px;color:${data.hasViewport ? '#059669' : '#dc2626'};font-weight:600;">${data.hasViewport ? '✅ Present' : '❌ Missing'}</span>
            </div>
            ${data.hasViewport ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:13px;color:#64748b;">Viewport Content</span>
                <span style="font-size:11px;color:#334155;font-weight:600;word-break:break-all;max-width:200px;text-align:right;">${escapeHtml(data.viewport)}</span>
              </div>
            ` : ''}
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Window Width</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${window.innerWidth}px</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Window Height</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${window.innerHeight}px</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
              <span style="font-size:13px;color:#64748b;">Pixel Ratio</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${window.devicePixelRatio || 1}×</span>
            </div>
          </div>
        </div>

        <!-- Assets -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">⚡ Assets</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">External Scripts</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.scripts.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Stylesheets</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.stylesheets.length}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <span style="font-size:13px;color:#64748b;">Inline Styles</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.inlineStyles}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
              <span style="font-size:13px;color:#64748b;">Forms</span>
              <span style="font-size:13px;color:#334155;font-weight:600;">${data.forms.length}</span>
            </div>
          </div>
          ${data.scripts.length > 0 ? `
            <div style="margin-top:12px;max-height:150px;overflow-y:auto;">
              <div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px;">Scripts</div>
              ${data.scripts.slice(0, 5).map(s => `
                <div style="font-size:10px;color:#94a3b8;word-break:break-all;padding:2px 0;">${escapeHtml(s)}</div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Forms Detail -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:800;color:#0f172a;">📝 Forms (${data.forms.length})</h3>
          ${data.forms.length ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${data.forms.map((f, i) => `
                <div style="padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:13px;font-weight:700;color:#334155;">Form #${i + 1}</span>
                    <span style="padding:2px 8px;border-radius:12px;background:#e0e7ff;color:#3730a3;font-size:11px;font-weight:700;">${f.inputs} fields</span>
                  </div>
                  <div style="font-size:11px;color:#64748b;margin-top:4px;font-family:monospace;">
                    ${f.action ? `action="${escapeHtml(f.action)}"` : 'No action'} method="${f.method}"
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<div style="text-align:center;padding:20px;color:#94a3b8;">No forms found</div>'}
        </div>
      </div>
    `;
  };

  const bindEvents = () => {
    // Tabs
    $$('.ss-tab', content).forEach(t => {
      t.addEventListener('click', () => { activeTab = t.dataset.tab; render(); });
    });

    // View mode toggle
    $$('.ss-view-btn', content).forEach(b => {
      b.addEventListener('click', () => { viewMode = b.dataset.view; render(); });
    });

    // Export
    $('#ss-export', content)?.addEventListener('click', showExportMenu);

  
  };

  const showExportMenu = () => {
    const existing = $('#ss-export-menu');
    if (existing) { existing.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'ss-export-menu';
    menu.style.cssText = `
      position:absolute;right:28px;top:70px;z-index:100;
      background:#fff;border:1px solid #e2e8f0;border-radius:14px;
      box-shadow:0 20px 50px rgba(0,0,0,.15);padding:8px;min-width:220px;
      animation:ssFadeIn .2s ease;
    `;
    menu.innerHTML = `
      <div style="padding:8px 12px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Export Report</div>
      <button id="ss-exp-full" class="ss-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📋</span> Full Report (Text)</button>
      <button id="ss-exp-csv" class="ss-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📊</span> Links CSV</button>
      <button id="ss-exp-seo" class="ss-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>🎯</span> SEO Audit CSV</button>
      <div style="height:1px;background:#e2e8f0;margin:6px 0;"></div>
      <button id="ss-exp-copy" class="ss-menu-item" style="width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#334155;display:flex;align-items:center;gap:8px;"><span>📋</span> Copy Summary</button>
    `;
    modal.appendChild(menu);

    const closeMenu = (e) => { if (!menu.contains(e.target) && e.target.id !== 'ss-export') { menu.remove(); document.removeEventListener('click', closeMenu); } };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);

    menu.querySelectorAll('.ss-menu-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.style.background = '#f8fafc');
      item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    });

    $('#ss-exp-full', menu).addEventListener('click', () => { exportFullReport(); menu.remove(); });
    $('#ss-exp-csv', menu).addEventListener('click', () => { exportLinksCSV(); menu.remove(); });
    $('#ss-exp-seo', menu).addEventListener('click', () => { exportSEOCSV(); menu.remove(); });
    $('#ss-exp-copy', menu).addEventListener('click', async () => {
      const summary = `Site Structure Report — ${data.domain}
SEO Score: ${seo.score}/100
Internal Links: ${data.internalLinks.length}
External Links: ${data.externalLinks.length}
Unique Pages: ${data.linkMap.size}
Images: ${data.images.length} (${data.imagesWithoutAlt.length} missing alt)
DOM Depth: ${data.domStats.maxDepth}
Page Size: ${data.pageSizeKB} KB`;
      const ok = await copy(summary);
      toast(ok ? 'Copied!' : 'Failed', ok ? 'success' : 'error');
      menu.remove();
    });
  };

  const exportFullReport = () => {
    const report = `SITE STRUCTURE REPORT
Generated: ${new Date().toLocaleString()}
URL: ${data.fullUrl}
Domain: ${data.domain}

=== SEO SCORE: ${seo.score}/100 ===
Issues: ${seo.issues.join(', ') || 'None'}
Warnings: ${seo.warnings.join(', ') || 'None'}

=== LINKS ===
Internal: ${data.internalLinks.length}
External: ${data.externalLinks.length}
Unique Pages: ${data.linkMap.size}
Nofollow: ${data.nofollowLinks.length}
Sponsored: ${data.sponsoredLinks.length}
Broken: ${data.brokenLinks.length}

=== HEADINGS ===
${Object.entries(data.headingHierarchy).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n')}

=== META TAGS ===
${Object.entries(data.metaTags).map(([k, v]) => `${k}: ${v.substring(0, 100)}`).join('\n')}

=== TECHNICAL ===
Page Size: ${data.pageSizeKB} KB
DOM Elements: ${data.domStats.totalElements}
DOM Depth: ${data.domStats.maxDepth}
Canonical: ${data.canonical}
Language: ${data.htmlLang}
Viewport: ${data.hasViewport ? 'Present' : 'Missing'}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-report-${data.domain}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Report downloaded', 'success');
  };

  const exportLinksCSV = () => {
    let csv = 'Type,Path/URL,Count,Anchor Texts,Status\n';
    [...data.linkMap.values()].forEach(item => {
      csv += `"Internal","${item.path.replace(/"/g, '""')}",${item.count},"${[...new Set(item.texts)].join(' | ').replace(/"/g, '""').substring(0, 200)}","OK"\n`;
    });
    data.brokenLinks.forEach(item => {
      csv += `"Broken","${item.url.replace(/"/g, '""')}",0,"","${item.error.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `links-${data.domain}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Links CSV exported', 'success');
  };

  const exportSEOCSV = () => {
    let csv = 'Category,Item,Status,Value,Recommendation\n';
    csv += `"Structure","H1 Tags","${data.headingHierarchy.h1 === 1 ? 'Good' : 'Issue'}","${data.headingHierarchy.h1} found","Should have exactly 1 H1"\n`;
    csv += `"Meta","Description","${data.metaTags.description ? 'Present' : 'Missing'}","${(data.metaTags.description || '').length} chars","50-160 characters optimal"\n`;
    csv += `"Meta","Viewport","${data.hasViewport ? 'Present' : 'Missing'}","${data.viewport || 'N/A'}","Required for mobile"\n`;
    csv += `"Links","Internal Links","${data.internalLinks.length >= 5 ? 'Good' : 'Low'}","${data.internalLinks.length}","At least 5 recommended"\n`;
    csv += `"Images","Alt Text","${data.imagesWithoutAlt.length === 0 ? 'Good' : 'Issue'}","${data.imagesWithoutAlt.length} missing","All images need alt text"\n`;
    csv += `"Technical","Canonical","${data.canonical === data.fullUrl ? 'Match' : 'Mismatch'}","${data.canonical}","Should match current URL"\n`;
    csv += `"Technical","Language","${data.htmlLang !== 'Not specified' ? 'Present' : 'Missing'}","${data.htmlLang}","Declare page language"\n`;
    csv += `"Technical","Page Size","${parseFloat(data.pageSizeKB) < 500 ? 'Good' : 'Large'}","${data.pageSizeKB} KB","Keep under 500KB"\n`;
    csv += `"SEO Score","Overall","${seo.score >= 80 ? 'Good' : seo.score >= 60 ? 'Fair' : 'Poor'}","${seo.score}/100","Aim for 80+"\n`;

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${data.domain}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('SEO audit exported', 'success');
  };

  // ============ INIT ============
  const modal = createModal('Site Structure Visualizer', content);
  render();
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
      const ta = document.createElement('textarea');
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
    const el = document.createElement('div');
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
    overlay = document.createElement('div');
    overlay.id = 'gms-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:2147483646;
      background:rgba(15,23,42,.65);backdrop-filter:blur(12px);
      display:flex;align-items:center;justify-content:center;
      padding:16px;box-sizing:border-box;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      animation:gmsFadeIn .25s ease;
    `;

    modal = document.createElement('div');
    modal.id = 'gms-modal';
    modal.style.cssText = `
      background:#fff;border-radius:20px;width:100%;max-width:1000px;
      max-height:92vh;display:flex;flex-direction:column;
      box-shadow:0 25px 80px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.1) inset;
      animation:gmsModalUp .35s cubic-bezier(.16,1,.3,1);
      overflow:hidden;position:relative;
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay && !isMinimized) destroy(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') isMinimized ? restore() : destroy();
      if (e.ctrlKey && e.key === 'e') { e.preventDefault(); $('#gms-btn-auto')?.click(); }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); $('#gms-btn-stop')?.click(); }
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

    const pill = document.createElement('div');
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
    document.body.appendChild(pill);
    toast('Minimized — Ctrl+M to restore', 'info');
  };

  const restore = () => {
    isMinimized = false;
    $('#gms-pill')?.remove();
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
      const el = $(s);
      if (el) {
        const st = window.getComputedStyle(el);
        if (st.overflowY === 'auto' || st.overflowY === 'scroll' || el.scrollHeight > el.clientHeight + 10) return el;
      }
    }
    const cands = $$('div').filter(d => {
      const st = window.getComputedStyle(d);
      return (st.overflowY === 'auto' || st.overflowY === 'scroll') && d.scrollHeight > d.clientHeight + 50;
    });
    return cands.sort((a, b) => b.scrollHeight - a.scrollHeight)[0] || null;
  };

  const findFeed = () => $('div[role="feed"]') || $('div[role="main"]');

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
        for (const sp of $$('span', container)) {
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
    $$('div[role="article"]').forEach(el => add(extractBiz(el)));
    const feed = $('div[role="feed"]');
    if (feed) Array.from(feed.children).forEach(c => add(extractBiz(c)));
    $$('[data-result-index], [data-result-id]').forEach(el => add(extractBiz(el)));
    $$('a[href*="/maps/place/"]').forEach(link => {
      let p = link.parentElement;
      for (let i = 0; i < 7 && p; i++) { if (p.getAttribute('role') === 'article' || p.getAttribute('data-result-index')) { add(extractBiz(p)); return; } p = p.parentElement; }
      add(extractBiz(link.closest('div') || link));
    });
    $$('.fontHeadlineSmall, .qBF1Pd, .NrDZNb').forEach(el => {
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
      <div style="padding:16px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(99,102,241,.3);">🗺️</div>
          <div>
            <h1 style="margin:0;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-.3px;">Maps Scraper</h1>
            <div style="font-size:12px;color:#64748b;font-weight:500;margin-top:1px;">${isGM ? 'Ready to extract' : 'Navigate to Google Maps'}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${st ? `<div style="background:#fff;padding:6px 14px;border-radius:20px;border:1px solid #e2e8f0;font-size:13px;font-weight:700;color:#334155;box-shadow:0 1px 2px rgba(0,0,0,.04);"><span style="color:#6366f1;">${st.count}</span> extracted</div>` : ''}
          <button id="gms-minimize" style="background:#fff;border:1px solid #e2e8f0;width:32px;height:32px;border-radius:8px;cursor:pointer;color:#64748b;font-size:16px;display:flex;align-items:center;justify-content:center;" title="Minimize (Ctrl+M)">−</button>
          <button id="gms-close" style="background:#fee2e2;border:1px solid #fecaca;width:32px;height:32px;border-radius:8px;cursor:pointer;color:#dc2626;font-size:18px;display:flex;align-items:center;justify-content:center;" title="Close (Esc)">×</button>
        </div>
      </div>
    `;

    // Tabs
    const tabsHTML = `
      <div style="display:flex;gap:0;border-bottom:1px solid #e2e8f0;background:#fff;padding:0 24px;">
        <button data-tab="extract" class="gms-tab ${activeTab === 'extract' ? 'active' : ''}" style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b;background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;">Extract</button>
        <button data-tab="results" class="gms-tab ${activeTab === 'results' ? 'active' : ''}" style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b;background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;position:relative;">
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
        <p style="margin:0 0 28px;color:#64748b;max-width:360px;margin-left:auto;margin-right:auto;line-height:1.6;">Open Google Maps, search for businesses, then run this scraper again.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button id="gms-open-maps" class="gms-btn gms-primary">Open Google Maps</button>
          <div style="display:flex;gap:8px;">
            <input id="gms-search-q" placeholder="Search query..." style="padding:10px 14px;border:1px solid #cbd5e1;border-radius:10px;font-size:14px;min-width:220px;outline:none;focus:border-color:#6366f1;">
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
              <div style="font-size:14px;font-weight:700;color:#5b21b6;margin-top:8px;line-height:1.3;">${escapeHtml(st.topCat)}</div>
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
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:10px;height:10px;background:#10b981;border-radius:50%;animation:gmsPulse 1.5s infinite;box-shadow:0 0 0 4px rgba(16,185,129,.2);"></div>
                <span style="font-size:14px;font-weight:700;color:#0f172a;">Auto-scrolling in progress</span>
              </div>
              <span style="font-size:13px;font-weight:800;color:#6366f1;background:#e0e7ff;padding:4px 12px;border-radius:20px;">${scraped.length} found</span>
            </div>
            <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
              <div style="height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);width:${Math.min((scraped.length / 50) * 100, 100)}%;border-radius:999px;transition:width .5s ease;"></div>
            </div>
            <div style="font-size:12px;color:#64748b;margin-top:10px;">Scrolling the results sidebar and capturing new listings as they load...</div>
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
          <div style="text-align:center;padding:48px 24px;background:#f8fafc;border-radius:16px;border:2px dashed #e2e8f0;">
            <div style="font-size:48px;margin-bottom:16px;">📭</div>
            <div style="font-size:16px;font-weight:800;color:#334155;margin-bottom:6px;">No businesses yet</div>
            <div style="font-size:13px;color:#64748b;max-width:320px;margin:0 auto;line-height:1.6;">Auto-Scroll will scroll through all results automatically. Manual Select lets you pick individual listings.</div>
          </div>
        ` : ''}
      </div>
    `;

    // Results Tab
    const resultsHTML = !scraped.length ? `
      <div style="text-align:center;padding:64px 24px;">
        <div style="font-size:56px;margin-bottom:16px;">📋</div>
        <div style="font-size:16px;font-weight:800;color:#334155;margin-bottom:6px;">No results to show</div>
        <div style="font-size:13px;color:#64748b;">Switch to the Extract tab and scrape some businesses first.</div>
      </div>
    ` : (() => {
      const filterVal = ($('#gms-filter-input')?.value || '').toLowerCase();
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
              <input id="gms-filter-input" value="${escapeHtml(filterVal)}" placeholder="Filter by name, category, address..." style="width:100%;padding:10px 12px 10px 36px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;">
            </div>
            <button id="gms-export-trigger" class="gms-btn gms-secondary">📤 Export</button>
            <button id="gms-clear" class="gms-btn gms-danger">🗑 Clear</button>
          </div>

          <div style="font-size:12px;color:#64748b;margin-bottom:12px;font-weight:600;">
            Showing ${filtered.length} of ${scraped.length} result${scraped.length !== 1 ? 's' : ''}
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
            ${filtered.map((b, i) => `
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;transition:all .2s;position:relative;box-shadow:0 1px 3px rgba(0,0,0,.04);" onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='translateY(0)'">
                <div style="display:flex;gap:12px;">
                  ${b.image ? `<img src="${escapeHtml(b.image)}" style="width:56px;height:56px;object-fit:cover;border-radius:12px;border:1px solid #e2e8f0;flex-shrink:0;">` : `<div style="width:56px;height:56px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🏢</div>`}
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;color:#0f172a;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(b.name)}</div>
                    ${b.category ? `<div style="font-size:11px;color:#6366f1;font-weight:700;margin-top:3px;">${escapeHtml(b.category)}</div>` : ''}
                    <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                      ${b.rating ? `<span style="font-size:13px;font-weight:800;color:#f59e0b;">★ ${escapeHtml(b.rating)}</span>` : ''}
                      ${b.reviews ? `<span style="font-size:11px;color:#64748b;">(${escapeHtml(b.reviews)})</span>` : ''}
                      ${b.priceLevel ? `<span style="font-size:11px;color:#059669;font-weight:700;background:#d1fae5;padding:2px 6px;border-radius:4px;">${escapeHtml(b.priceLevel)}</span>` : ''}
                    </div>
                  </div>
                  <button class="gms-del" data-idx="${scraped.indexOf(b)}" style="background:#fee2e2;border:none;width:28px;height:28px;border-radius:8px;cursor:pointer;color:#dc2626;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">×</button>
                </div>
                ${b.address ? `<div style="margin-top:10px;font-size:12px;color:#475569;line-height:1.5;display:flex;align-items:flex-start;gap:6px;"><span>📍</span><span>${escapeHtml(b.address)}</span></div>` : ''}
                ${b.phone ? `<div style="margin-top:4px;font-size:12px;color:#475569;display:flex;align-items:center;gap:6px;"><span>📞</span><span>${escapeHtml(b.phone)}</span></div>` : ''}
                ${b.status ? `<div style="margin-top:6px;font-size:11px;color:#059669;font-weight:700;background:#ecfdf5;display:inline-block;padding:3px 10px;border-radius:20px;">🕒 ${escapeHtml(b.status)}</div>` : ''}
                <div style="display:flex;gap:8px;margin-top:12px;">
                  ${b.mapsUrl ? `<a href="${escapeHtml(b.mapsUrl)}" target="_blank" style="flex:1;text-align:center;padding:8px;background:#f1f5f9;border-radius:8px;font-size:12px;font-weight:700;color:#475569;text-decoration:none;border:1px solid #e2e8f0;transition:all .15s;" onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'">🗺️ Maps</a>` : ''}
                  ${b.website ? `<a href="${escapeHtml(b.website)}" target="_blank" style="flex:1;text-align:center;padding:8px;background:#eff6ff;border-radius:8px;font-size:12px;font-weight:700;color:#2563eb;text-decoration:none;border:1px solid #dbeafe;transition:all .15s;" onmouseenter="this.style.background='#dbeafe'" onmouseleave="this.style.background='#eff6ff'">🌐 Website</a>` : ''}
                </div>
                ${b.lat ? `<div style="margin-top:8px;font-size:11px;color:#94a3b8;font-family:monospace;">${escapeHtml(b.lat)}, ${escapeHtml(b.lng)}</div>` : ''}
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
        .gms-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;}
        .gms-secondary{background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;}
        .gms-danger{background:#fee2e2;color:#dc2626;border:1px solid #fecaca;}
        .gms-warning{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}
        .gms-tab.active{color:#6366f1;border-bottom-color:#6366f1;}
        .gms-tab:hover:not(.active){color:#334155;background:#f8fafc;}
      </style>
      ${headerHTML}
      ${tabsHTML}
      <div style="flex:1;overflow-y:auto;background:#fff;">
        ${activeTab === 'extract' ? extractHTML : resultsHTML}
      </div>
      ${isGM ? `
        <div style="padding:10px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between;align-items:center;">
          <span>Shortcuts: <b>Ctrl+E</b> Auto-scroll • <b>Ctrl+S</b> Stop • <b>Ctrl+M</b> Minimize • <b>Esc</b> Close</span>
          <span>${isScrolling ? '⏳ Extracting...' : '✓ Ready'}</span>
        </div>
      ` : ''}
    `;

    bindEvents();
  };

  const bindEvents = () => {
    $('#gms-close')?.addEventListener('click', destroy);
    $('#gms-minimize')?.addEventListener('click', toggleMinimize);

    $$('.gms-tab').forEach(t => {
      t.addEventListener('click', () => { activeTab = t.dataset.tab; render(); });
    });

    $('#gms-open-maps')?.addEventListener('click', () => window.open('https://maps.google.com', '_blank'));
    $('#gms-search-btn')?.addEventListener('click', () => {
      const q = $('#gms-search-q')?.value.trim();
      if (q) window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, '_blank');
    });
    $('#gms-search-q')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#gms-search-btn')?.click(); });

    $('#gms-btn-auto')?.addEventListener('click', () => { startAutoScroll(); render(); });
    $('#gms-btn-stop')?.addEventListener('click', () => { stopAll(); toast('Stopped', 'info'); render(); });
    $('#gms-btn-visible')?.addEventListener('click', () => {
      const added = merge(extractAll());
      render();
      toast(added ? `Added ${added} businesses` : 'No new businesses found', added ? 'success' : 'warning');
    });

    $('#gms-btn-manual')?.addEventListener('click', toggleManual);

    $('#gms-filter-input')?.addEventListener('input', () => render());
    $('#gms-clear')?.addEventListener('click', () => {
      if (!confirm(`Clear all ${scraped.length} extracted businesses?`)) return;
      scraped = []; stopAll(); render(); toast('Cleared', 'info');
    });

    $('#gms-export-trigger')?.addEventListener('click', showExportMenu);

    $$('.gms-del').forEach(btn => {
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
    const btn = $('#gms-btn-manual');
    if (isManual) {
      isManual = false;
      if (manualHandler) { document.removeEventListener('click', manualHandler, true); manualHandler = null; }
      $$('.gms-selected-item').forEach(el => { el.style.outline = ''; el.style.cursor = ''; el.classList.remove('gms-selected-item'); });
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
        container.style.cssText += ';outline:3px solid #8b5cf6 !important;border-radius:12px !important;cursor:pointer !important;';
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
    const existing = $('#gms-export-menu');
    if (existing) { existing.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'gms-export-menu';
    menu.style.cssText = `
      position:absolute;right:24px;bottom:80px;z-index:10;
      background:#fff;border:1px solid #e2e8f0;border-radius:14px;
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

    $('#gms-exp-csv', menu).addEventListener('click', () => { doExport('csv'); menu.remove(); });
    $('#gms-exp-json', menu).addEventListener('click', () => { doExport('json'); menu.remove(); });
    $('#gms-exp-md', menu).addEventListener('click', () => { doExport('md'); menu.remove(); });
    $('#gms-exp-copy', menu).addEventListener('click', async () => {
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
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast(`${type.toUpperCase()} downloaded`, 'success');
  };

  // ============ INIT ============
  buildModal();
  render();
}
// ==================== TOOL: COLOR THEME EXTRACTOR ====================

function toolExtractColorTheme() {
  const content = createElement('div');
  
  content.appendChild(createToolHeader(
    '🎨 Color Theme Extractor',
    'Scanning page styles and calculating visual dominance...',
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)'
  ));

  // Helper to convert rgb/rgba to HEX
  function rgbToHex(rgbStr) {
    if (!rgbStr || rgbStr === 'rgba(0, 0, 0, 0)' || rgbStr === 'transparent' || rgbStr === 'none') return null;
    
    const match = rgbStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (!match) return null;
    
    // Ignore highly transparent colors
    if (match[4] && parseFloat(match[4]) < 0.1) return null;
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  // Calculate contrast to determine if text on this color should be black or white
  function getContrastYIQ(hexcolor) {
    if (!hexcolor) return '#000000';
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  }

  const colorScores = new Map(); // Tracks visual dominance (Area)
  const colorCounts = new Map(); // Tracks number of times used
  const elements = document.querySelectorAll('body *');

  // Scan the DOM
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Base area, minimum 1 to ensure tiny text/icons still get counted
    const area = Math.max((rect.width * rect.height), 1); 

    // Check normal element, ::before, and ::after
    ['', '::before', '::after'].forEach(pseudo => {
      const style = window.getComputedStyle(el, pseudo || null);
      if (!style) return;

      const colorsToExtract = [
        rgbToHex(style.backgroundColor),
        rgbToHex(style.color),
        style.borderWidth !== '0px' ? rgbToHex(style.borderColor) : null,
        rgbToHex(style.fill), // For SVGs
        rgbToHex(style.stroke) // For SVGs
      ];
      
      colorsToExtract.forEach(color => {
        if (color) {
          colorScores.set(color, (colorScores.get(color) || 0) + area);
          colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        }
      });
    });
  });

  // Remove generic greys/whites if they completely overpower the actual brand colors
  // (Optional: You can comment this block out if you want pure white/black included)
  const isBoringColor = (hex) => {
    return ['#FFFFFF', '#000000', '#111111', '#222222', '#EEEEEE', '#F8F9FA', '#F1F5F9'].includes(hex);
  };

  // Sort colors by visual dominance (Area score)
  const sortedColors = [...colorScores.entries()]
    .sort((a, b) => b[1] - a[1])
    // Move boring background colors to the bottom so brand colors pop up first
    .sort((a, b) => (isBoringColor(a[0]) ? 1 : 0) - (isBoringColor(b[0]) ? 1 : 0))
    .slice(0, 24); // Get top 24

  content.appendChild(createStatGrid([
    { label: 'Elements Scanned', value: elements.length.toLocaleString(), icon: '🔍' },
    { label: 'Unique Colors', value: colorScores.size.toLocaleString(), icon: '🎨', color: DT.colors.success },
  ]));

  // Swatch Grid
  const grid = createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '12px',
      marginTop: '20px'
    }
  });

  sortedColors.forEach(([hex, score], index) => {
    const textColor = getContrastYIQ(hex);
    const count = colorCounts.get(hex);
    
    const card = createElement('div', {
      styles: {
        background: DT.colors.surface,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.md,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: `all ${DT.transitions.fast}`,
        boxShadow: DT.shadows.xs
      }
    });

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = DT.shadows.md;
      card.style.borderColor = DT.colors.primary;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = DT.shadows.xs;
      card.style.borderColor = DT.colors.border;
    });

    card.addEventListener('click', () => {
      copyToClipboard(hex).then(() => {
        showNotification(`✅ Copied ${hex}`, 'success');
      });
    });

    // Color Box
    const colorBox = createElement('div', {
      styles: {
        height: '60px',
        width: '100%',
        backgroundColor: hex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    });

    // Badge inside color box for Top 3 most dominant
    if (index < 3 && !isBoringColor(hex)) {
      colorBox.appendChild(createElement('span', {
        styles: {
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold',
          backdropFilter: 'blur(4px)'
        },
        text: `Dominant`
      }));
    }

    // Info area
    const infoBox = createElement('div', {
      styles: { padding: '10px', textAlign: 'center' },
      children: [
        createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            fontFamily: DT.typography.fontMono,
            color: DT.colors.textPrimary,
            marginBottom: '2px'
          },
          text: hex
        }),
        createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: DT.colors.textMuted
          },
          text: `Used ${count} times`
        })
      ]
    });

    card.appendChild(colorBox);
    card.appendChild(infoBox);
    grid.appendChild(card);
  });

  content.appendChild(createSection('🎨 Visual Dominance Palette', [grid]));

  // Action Buttons
  const btnRow = createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });

  btnRow.appendChild(createButton('📋 Copy All Hex Codes', () => {
    const hexList = sortedColors.map(c => c[0]).join('\n');
    copyToClipboard(hexList).then(() => showNotification(`✅ ${sortedColors.length} colors copied!`, 'success'));
  }, { variant: 'primary' }));

  btnRow.appendChild(createButton('📊 Export Palette (.txt)', () => {
    let txt = `Website Color Palette - ${window.location.hostname}\n${'='.repeat(40)}\n`;
    txt += `Sorted by visual dominance (Area Size & Usage Frequency)\n\n`;
    
    sortedColors.forEach(([hex, score], i) => {
      const timesUsed = colorCounts.get(hex);
      txt += `${i + 1}. ${hex} (Applied to ${timesUsed} elements)\n`;
    });
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${window.location.hostname}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, { variant: 'secondary' }));

  content.appendChild(btnRow);

  const { close } = createModal('Website Color Theme', content, { width: '650px' });
}

// ==================== TOOL: TYPOGRAPHY INSPECTOR ====================

function toolExtractTypography() {
  const content = GDI.createElement('div');
  
  content.appendChild(createToolHeader(
    '🔤 Typography Inspector',
    'Extracting and analyzing all fonts used on this page...',
    'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
  ));

  const fonts = new Map();
  const elements = document.querySelectorAll('body *');

  elements.forEach(el => {
    // Only process elements that actually contain text
    if (!el.textContent.trim() || el.children.length === el.childNodes.length) return;

    const style = window.getComputedStyle(el);
    const rawFamily = style.fontFamily;
    
    // Get the primary font (first in the fallback list)
    const primaryFont = rawFamily.split(',')[0].replace(/['"]/g, '').trim();

    if (!fonts.has(primaryFont)) {
      fonts.set(primaryFont, {
        raw: rawFamily,
        weights: new Set(),
        sizes: new Set(),
        count: 0
      });
    }

    const fontData = fonts.get(primaryFont);
    fontData.count++;
    fontData.weights.add(style.fontWeight);
    fontData.sizes.add(style.fontSize);
  });

  const sortedFonts = [...fonts.entries()].sort((a, b) => b[1].count - a[1].count);

  content.appendChild(createStatGrid([
    { label: 'Text Elements', value: elements.length.toLocaleString(), icon: '📝' },
    { label: 'Unique Fonts', value: fonts.size, icon: '🔤', color: DT.colors.primary }
  ]));

  const fontList = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }
  });

  sortedFonts.forEach(([name, data]) => {
    const card = GDI.createElement('div', {
      styles: {
        background: DT.colors.surface,
        border: `1px solid ${DT.colors.border}`,
        borderRadius: DT.radii.lg,
        padding: '16px',
        boxShadow: DT.shadows.xs
      }
    });

    const header = GDI.createElement('div', {
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
      children: [
        GDI.createElement('div', {
          styles: { fontSize: '18px', fontWeight: 'bold', color: DT.colors.textPrimary },
          text: name
        }),
        GDI.createBadge(`Used ${data.count} times`, 'info')
      ]
    });

    // Font Preview
    const preview = GDI.createElement('div', {
      styles: {
        fontFamily: data.raw,
        fontSize: '24px',
        padding: '16px',
        background: DT.colors.surfaceSecondary,
        borderRadius: DT.radii.md,
        border: `1px solid ${DT.colors.borderLight}`,
        color: DT.colors.textPrimary,
        marginBottom: '12px',
        wordBreak: 'break-word'
      },
      text: 'The quick brown fox jumps over the lazy dog'
    });

    const details = GDI.createElement('div', {
      styles: { display: 'flex', gap: '16px', fontSize: '12px', color: DT.colors.textSecondary },
      children: [
        GDI.createElement('span', { text: `📏 Sizes: ${[...data.sizes].sort().join(', ')}` }),
        GDI.createElement('span', { text: `⚖️ Weights: ${[...data.weights].sort().join(', ')}` })
      ]
    });

    card.appendChild(header);
    card.appendChild(preview);
    card.appendChild(details);
    fontList.appendChild(card);
  });

  content.appendChild(createSection('📐 Font Families', [fontList]));

  const { close } = GDI.createModal('Typography Inspector', content, { width: '700px' });
}

// ==================== TOOL: SOCIAL MEDIA CARD PREVIEW ====================

function toolSocialCardPreview() {
  const content = GDI.createElement('div');
  
  content.appendChild(createToolHeader(
    '📱 Social Card Preview',
    'How this page looks when shared on social media',
    'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
  ));

  // Extract OG Data
  const getMeta = (property) => document.querySelector(`meta[property="${property}"], meta[name="${property}"]`)?.getAttribute('content') || '';
  
  const ogTitle = getMeta('og:title') || getMeta('twitter:title') || document.title;
  const ogDesc = getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || 'No description provided for this page.';
  const ogImage = getMeta('og:image') || getMeta('twitter:image') || '';
  const domain = window.location.hostname.replace('www.', '').toUpperCase();

  const previewContainer = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', gap: '24px' }
  });

  // Facebook / LinkedIn Style Card
  const fbCard = GDI.createElement('div', {
    styles: {
      border: `1px solid ${DT.colors.border}`,
      borderRadius: '8px', overflow: 'hidden',
      background: DT.colors.surface,
      maxWidth: '500px', margin: '0 auto',
      boxShadow: DT.shadows.sm
    }
  });

  const fbImage = GDI.createElement('div', {
    styles: {
      width: '100%', height: '260px',
      background: ogImage ? `url(${ogImage}) center/cover no-repeat` : '#E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#94A3B8', fontSize: '14px'
    },
    text: ogImage ? '' : 'No og:image specified'
  });

  const fbText = GDI.createElement('div', {
    styles: { padding: '12px 16px', background: '#F1F5F9' },
    children: [
      GDI.createElement('div', { styles: { fontSize: '12px', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }, text: domain }),
      GDI.createElement('div', { styles: { fontSize: '16px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, text: ogTitle }),
      GDI.createElement('div', { styles: { fontSize: '14px', color: '#475569', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }, text: ogDesc })
    ]
  });

  fbCard.appendChild(fbImage);
  fbCard.appendChild(fbText);
  previewContainer.appendChild(createSection('📘 Facebook / LinkedIn Preview', [fbCard]));

  // Twitter Style Card
  const twCard = GDI.createElement('div', {
    styles: {
      border: `1px solid ${DT.colors.border}`,
      borderRadius: '16px', overflow: 'hidden',
      background: DT.colors.surface,
      maxWidth: '500px', margin: '0 auto',
      boxShadow: DT.shadows.sm
    }
  });

  const twImage = GDI.createElement('div', {
    styles: {
      width: '100%', height: '260px',
      background: ogImage ? `url(${ogImage}) center/cover no-repeat` : '#E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#94A3B8', fontSize: '14px',
      borderBottom: `1px solid ${DT.colors.border}`
    },
    text: ogImage ? '' : 'No twitter:image specified'
  });

  const twText = GDI.createElement('div', {
    styles: { padding: '12px 16px' },
    children: [
      GDI.createElement('div', { styles: { fontSize: '15px', color: '#0F172A', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, text: ogTitle }),
      GDI.createElement('div', { styles: { fontSize: '15px', color: '#475569', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, text: ogDesc }),
      GDI.createElement('div', { styles: { fontSize: '15px', color: '#64748B' }, text: domain.toLowerCase() })
    ]
  });

  twCard.appendChild(twImage);
  twCard.appendChild(twText);
  previewContainer.appendChild(createSection('🐦 Twitter / X Preview', [twCard]));

  content.appendChild(previewContainer);
  
  if (!ogImage || !getMeta('og:title')) {
    content.appendChild(GDI.createElement('div', {
      styles: { padding: '16px', background: DT.colors.warningLight, color: '#92400E', borderRadius: DT.radii.md, marginTop: '16px' },
      text: '⚠️ Warning: Missing crucial Open Graph tags. Your link may not render correctly when shared.'
    }));
  }

  const { close } = GDI.createModal('Social Card Preview', content, { width: '600px' });
}

// ==================== TOOL: BULK IMAGE DOWNLOADER (PRO) ====================

function toolImageDownloader() {
  const content = GDI.createElement('div');
  
  content.appendChild(createToolHeader(
    '🖼️ Bulk Image Downloader',
    'Extract images, backgrounds, and media from this page',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  ));

  // ─── EXTRACTION ENGINE ───
  const imageMap = new Map();
  
  // Helper: resolve relative URLs
  const resolveUrl = (url) => {
    try { return new URL(url, location.href).href; } 
    catch { return null; }
  };

  // Helper: extract filename
  const getFilename = (url) => {
    try {
      const pathname = new URL(url).pathname;
      const name = pathname.split('/').pop() || '';
      return name.split('?')[0].split('#')[0] || `image-${Math.random().toString(36).substring(7)}.jpg`;
    } catch { return 'image.jpg'; }
  };

  // Helper: dedupe key
  const keyOf = (src) => resolveUrl(src) || src;

  // 1. Standard <img> tags
  document.querySelectorAll('img').forEach(img => {
    const src = img.currentSrc || img.src || img.getAttribute('data-src') || 
                img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
    if (src) {
      const url = resolveUrl(src);
      if (url && !url.includes('google-analytics') && !url.startsWith('data:')) {
        imageMap.set(keyOf(url), {
          src: url,
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0,
          alt: img.alt || '',
          type: 'img',
          element: img
        });
      }
    }
  });

  // 2. <picture> / srcset
  document.querySelectorAll('source[srcset], img[srcset]').forEach(el => {
    const srcset = el.getAttribute('srcset');
    if (srcset) {
      const candidates = srcset.split(',').map(s => {
        const [url, w = '1x'] = s.trim().split(' ');
        const descriptor = parseFloat(w.replace(/[wx]/, '')) || 1;
        return { url: resolveUrl(url), descriptor };
      }).filter(c => c.url);
      
      if (candidates.length) {
        const best = candidates.reduce((a, b) => a.descriptor > b.descriptor ? a : b);
        if (!imageMap.has(keyOf(best.url))) {
          imageMap.set(keyOf(best.url), {
            src: best.url,
            width: 0, height: 0,
            alt: el.alt || '',
            type: 'srcset'
          });
        }
      }
    }
  });

  // 3. CSS Background images (Supports multiple backgrounds)
  const checkedNodes = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (checkedNodes.has(el)) continue;
    checkedNodes.add(el);
    
    const style = window.getComputedStyle(el);
    const bg = style.backgroundImage;
    if (bg && bg !== 'none') {
      // Use matchAll to catch multiple comma-separated background images
      const matches = [...bg.matchAll(/url\(["']?(.*?)["']?\)/g)];
      matches.forEach(match => {
        const url = resolveUrl(match[1]);
        if (url && !url.startsWith('data:') && !imageMap.has(keyOf(url))) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 50 && rect.height > 50) {
            imageMap.set(keyOf(url), {
              src: url,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              alt: '',
              type: 'background',
              element: el
            });
          }
        }
      });
    }
  }

  // 4. Video posters
  document.querySelectorAll('video[poster]').forEach(v => {
    const url = resolveUrl(v.poster);
    if (url && !imageMap.has(keyOf(url))) {
      imageMap.set(keyOf(url), {
        src: url, width: v.videoWidth || 0, height: v.videoHeight || 0,
        alt: 'Video poster', type: 'poster'
      });
    }
  });

  let validImages = Array.from(imageMap.values());

  // ─── STATS BAR ───
  const statsContainer = GDI.createElement('div');
  const updateStats = () => {
    const selected = validImages.filter(i => i._selected).length;
    statsContainer.innerHTML = '';
    statsContainer.appendChild(createStatGrid([
      { label: 'Images Found', value: validImages.length.toString(), icon: '📸', color: DT.colors.warning },
      { label: 'Selected', value: selected.toString(), icon: '☑️', color: DT.colors.primary }
    ]));
  };
  updateStats();
  content.appendChild(statsContainer);

  // ─── TOOLBAR: FILTER + ACTIONS ───
  const toolbar = GDI.createElement('div', {
    styles: {
      display: 'flex', gap: '12px', marginTop: '16px', marginBottom: '12px',
      flexWrap: 'wrap', alignItems: 'center',
      padding: '12px', background: DT.colors.surface, borderRadius: DT.radii.md,
      border: `1px solid ${DT.colors.border}`, position: 'sticky', top: '0', zIndex: '10'
    }
  });

  const searchInput = GDI.createElement('input', {
    attrs: { type: 'text', placeholder: '🔍 Search filenames/alt text...' },
    styles: {
      flex: '1', minWidth: '180px', padding: '8px 12px', borderRadius: DT.radii.sm,
      border: `1px solid ${DT.colors.border}`, background: DT.colors.surfaceSecondary,
      color: DT.colors.textPrimary, fontSize: '13px', outline: 'none'
    }
  });

  const minSizeSelect = GDI.createElement('select', {
    styles: {
      padding: '8px', borderRadius: DT.radii.sm, border: `1px solid ${DT.colors.border}`,
      background: DT.colors.surfaceSecondary, color: DT.colors.textPrimary, fontSize: '13px', cursor: 'pointer'
    },
    children: [
      GDI.createElement('option', { attrs: { value: '0' }, text: 'All sizes' }),
      GDI.createElement('option', { attrs: { value: '100' }, text: '≥100px' }),
      GDI.createElement('option', { attrs: { value: '300' }, text: '≥300px' }),
      GDI.createElement('option', { attrs: { value: '500' }, text: '≥500px' }),
      GDI.createElement('option', { attrs: { value: '1000' }, text: '≥1000px' })
    ]
  });

  const sortSelect = GDI.createElement('select', {
    styles: {
      padding: '8px', borderRadius: DT.radii.sm, border: `1px solid ${DT.colors.border}`,
      background: DT.colors.surfaceSecondary, color: DT.colors.textPrimary, fontSize: '13px', cursor: 'pointer'
    },
    children: [
      GDI.createElement('option', { attrs: { value: 'default' }, text: 'Default order' }),
      GDI.createElement('option', { attrs: { value: 'largest' }, text: 'Largest first' }),
      GDI.createElement('option', { attrs: { value: 'smallest' }, text: 'Smallest first' }),
      GDI.createElement('option', { attrs: { value: 'name' }, text: 'Name (A-Z)' })
    ]
  });

  const btnStyle = { variant: 'secondary', size: 'sm' };
  const selectAllBtn = GDI.createButton('Select All', null, btnStyle);
  const deselectAllBtn = GDI.createButton('Deselect', null, btnStyle);
  const downloadSelectedBtn = GDI.createButton('⬇️ Download Selected', null, { variant: 'primary', size: 'sm' });
  downloadSelectedBtn.style.fontWeight = 'bold';

  toolbar.appendChild(searchInput);
  toolbar.appendChild(minSizeSelect);
  toolbar.appendChild(sortSelect);
  toolbar.appendChild(selectAllBtn);
  toolbar.appendChild(deselectAllBtn);
  toolbar.appendChild(downloadSelectedBtn);
  content.appendChild(toolbar);

  // ─── GRID CONTAINER ───
  const grid = GDI.createElement('div', {
    styles: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '16px', maxHeight: '55vh', overflowY: 'auto', padding: '4px', minHeight: '100px'
    }
  });
  content.appendChild(grid);

  // ─── RENDER FUNCTION ───
  const renderGrid = () => {
    grid.innerHTML = '';
    const query = searchInput.value.toLowerCase();
    const minSize = parseInt(minSizeSelect.value) || 0;
    const sortMode = sortSelect.value;

    let filtered = validImages.filter(img => {
      const name = getFilename(img.src).toLowerCase();
      const alt = (img.alt || '').toLowerCase();
      const matchesSearch = !query || name.includes(query) || alt.includes(query);
      const matchesSize = Math.max(img.width, img.height) >= minSize;
      return matchesSearch && matchesSize;
    });

    if (sortMode === 'largest') {
      filtered.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    } else if (sortMode === 'smallest') {
      filtered.sort((a, b) => (a.width * a.height) - (b.width * b.height));
    } else if (sortMode === 'name') {
      filtered.sort((a, b) => getFilename(a.src).localeCompare(getFilename(b.src)));
    }

    if (filtered.length === 0) {
      grid.appendChild(GDI.createElement('div', {
        styles: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: DT.colors.textSecondary, fontSize: '14px' },
        text: 'No images match your filters.'
      }));
      return;
    }

    filtered.forEach((imgData, index) => {
      const card = GDI.createElement('div', {
        styles: {
          background: DT.colors.surface,
          border: `1px solid ${imgData._selected ? DT.colors.primary : DT.colors.border}`,
          borderRadius: DT.radii.md, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          boxShadow: imgData._selected ? `0 0 0 2px ${DT.colors.primary}20` : 'none',
          position: 'relative'
        }
      });

      const checkbox = GDI.createElement('input', {
        attrs: { type: 'checkbox', checked: !!imgData._selected },
        styles: { position: 'absolute', top: '8px', left: '8px', zIndex: '2', width: '18px', height: '18px', cursor: 'pointer', accentColor: DT.colors.primary }
      });
      checkbox.addEventListener('change', (e) => {
        imgData._selected = e.target.checked;
        renderGrid(); 
        updateStats();
      });
      card.appendChild(checkbox);

      const preview = GDI.createElement('div', {
        styles: {
          height: '130px', width: '100%', background: '#F1F5F9', borderBottom: `1px solid ${DT.colors.border}`,
          cursor: 'zoom-in', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }
      });

      const thumb = GDI.createElement('img', {
        attrs: { src: imgData.src, loading: 'lazy' },
        styles: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }
      });
      thumb.onerror = () => {
        thumb.style.display = 'none';
        preview.innerHTML = '<span style="font-size:24px;opacity:0.3">🖼️</span>';
        preview.style.background = '#E2E8F0';
      };
      preview.appendChild(thumb);
      preview.addEventListener('click', () => openLightbox(imgData));
      card.appendChild(preview);

      const info = GDI.createElement('div', {
        styles: { padding: '10px', fontSize: '11px', color: DT.colors.textSecondary, flex: '1', minHeight: '0' }
      });

      const filename = getFilename(imgData.src);
      info.appendChild(GDI.createElement('div', { 
        attrs: { title: filename },
        styles: { fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: DT.colors.textPrimary }, 
        text: filename 
      }));

      const metaEl = GDI.createElement('div', { styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' } });
      metaEl.appendChild(GDI.createElement('span', { text: (imgData.width && imgData.height) ? `${imgData.width}×${imgData.height}` : 'Size unknown' }));
      
      if (imgData.type !== 'img') {
        metaEl.appendChild(GDI.createElement('span', {
          text: imgData.type,
          styles: { fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '2px 6px', borderRadius: '4px', background: DT.colors.border, color: DT.colors.textSecondary }
        }));
      }

      info.appendChild(metaEl);
      card.appendChild(info);

      const dlBtn = GDI.createButton('⬇️ Save', () => downloadImage(imgData, index), { variant: 'secondary', size: 'sm' });
      dlBtn.style.borderRadius = '0';
      dlBtn.style.borderLeft = 'none';
      dlBtn.style.borderRight = 'none';
      dlBtn.style.borderBottom = 'none';
      dlBtn.style.width = '100%';

      card.appendChild(dlBtn);
      grid.appendChild(card);
    });
  };

  // ─── DOWNLOAD LOGIC ───
  const downloadImage = async (imgData, index) => {
    const filename = getFilename(imgData.src) || `image-${index + 1}.jpg`;
    
    try {
      const resp = await fetch(imgData.src, { mode: 'cors', credentials: 'omit' });
      if (!resp.ok) throw new Error('HTTP error');
      const blob = await resp.blob();
      triggerDownload(blob, filename);
    } catch (e) {
      // If CORS blocks the fetch, we cannot use fetch or canvas safely.
      // The only bulletproof fallback is to open it in a new tab or use chrome.downloads API.
      window.open(imgData.src, '_blank');
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const downloadSelected = async () => {
    const selected = validImages.filter(i => i._selected);
    if (!selected.length) {
      GDI.showNotification('⚠️ No images selected.', 'warning');
      return;
    }

    downloadSelectedBtn.textContent = '⏳ Downloading...';
    downloadSelectedBtn.disabled = true;

    for (let i = 0; i < selected.length; i++) {
      const img = selected[i];
      downloadSelectedBtn.textContent = `⏳ ${i + 1}/${selected.length}...`;
      await downloadImage(img, validImages.indexOf(img));
      // Extended delay to prevent browser triggering the "Multiple files" warning block
      await new Promise(r => setTimeout(r, 600));
    }

    downloadSelectedBtn.textContent = '⬇️ Download Selected';
    downloadSelectedBtn.disabled = false;
  };

  // ─── LIGHTBOX ───
  const openLightbox = (imgData) => {
    const overlay = GDI.createElement('div', {
      styles: {
        position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.9)',
        zIndex: '99999', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', padding: '20px', cursor: 'zoom-out'
      }
    });

    const fullImg = GDI.createElement('img', {
      attrs: { src: imgData.src },
      styles: { 
        maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain',
        borderRadius: DT.radii.md, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }
    });

    const caption = GDI.createElement('div', {
      styles: { color: '#fff', marginTop: '16px', fontSize: '14px', textAlign: 'center', maxWidth: '80vw', overflow: 'hidden', textOverflow: 'ellipsis' },
      text: `${getFilename(imgData.src)} ${imgData.width ? `• ${imgData.width}×${imgData.height}` : ''}`
    });

    overlay.appendChild(fullImg);
    overlay.appendChild(caption);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  };

  // ─── EVENT BINDINGS ───
  searchInput.addEventListener('input', renderGrid);
  minSizeSelect.addEventListener('change', renderGrid);
  sortSelect.addEventListener('change', renderGrid);
  
  selectAllBtn.addEventListener('click', () => {
    validImages.forEach(i => i._selected = true);
    renderGrid();
    updateStats();
  });
  
  deselectAllBtn.addEventListener('click', () => {
    validImages.forEach(i => i._selected = false);
    renderGrid();
    updateStats();
  });
  
  downloadSelectedBtn.addEventListener('click', downloadSelected);

  renderGrid();

  const { close, modal } = GDI.createModal('Image Downloader', content, { width: '850px' });
  
  document.addEventListener('keydown', function escModal(e) {
    if (e.key === 'Escape') {
      if (!document.querySelector('div[style*="z-index: 99999"]')) {
        close();
        document.removeEventListener('keydown', escModal);
      }
    }
  });
}

// ==================== TOOL: CLEAR SITE DATA ====================
function toolClearSiteData() {
  // ─── STATE ───
  const selected = {
    cookies: true,
    localStorage: true,
    sessionStorage: true,
    indexedDB: true,
    cache: true,
    serviceWorkers: true,
    reload: true
  };

  // ─── BUILD UI ───
  const content = GDI.createElement('div');

  content.appendChild(createToolHeader(
    '🧹 Clear Site Data',
    'Selectively remove stored data for this website',
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  ));

  // Info banner
  const banner = GDI.createElement('div', {
    styles: {
      background: 'rgba(239,68,68,0.1)', border: `1px solid ${DT.colors.error}`,
      borderRadius: DT.radii.md, padding: '12px 16px', marginBottom: '20px',
      fontSize: '13px', color: DT.colors.text, lineHeight: '1.5'
    },
    text: '⚠️ This action cannot be undone. You will be logged out of this site and any unsaved work may be lost.'
  });
  content.appendChild(banner);

  // ─── CHECKBOX GRID ───
  const grid = GDI.createElement('div', {
    styles: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'
    }
  });

  const createToggle = (key, label, description, icon) => {
    const row = GDI.createElement('label', {
      styles: {
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '14px', borderRadius: DT.radii.md,
        border: `1px solid ${selected[key] ? DT.colors.primary : DT.colors.border}`,
        background: selected[key] ? `${DT.colors.primary}08` : DT.colors.surface,
        cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none'
      }
    });

    const checkbox = GDI.createElement('input', {
      attrs: { type: 'checkbox', checked: selected[key] },
      styles: { width: '18px', height: '18px', marginTop: '2px', accentColor: DT.colors.primary, cursor: 'pointer' }
    });

    const textWrap = GDI.createElement('div', { styles: { flex: '1' } });
    const title = GDI.createElement('div', { 
      styles: { fontWeight: '600', fontSize: '14px', color: DT.colors.text, marginBottom: '2px' },
      text: `${icon} ${label}` 
    });
    const desc = GDI.createElement('div', { 
      styles: { fontSize: '12px', color: DT.colors.textSecondary, lineHeight: '1.4' },
      text: description 
    });

    textWrap.appendChild(title);
    textWrap.appendChild(desc);
    row.appendChild(checkbox);
    row.appendChild(textWrap);

    row.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      selected[key] = checkbox.checked;
      row.style.borderColor = selected[key] ? DT.colors.primary : DT.colors.border;
      row.style.background = selected[key] ? `${DT.colors.primary}08` : DT.colors.surface;
    });

    return row;
  };

  grid.appendChild(createToggle('cookies', 'Cookies', 'Login sessions, preferences, tracking data', '🍪'));
  grid.appendChild(createToggle('localStorage', 'Local Storage', 'Persistent key-value data stored by this site', '💾'));
  grid.appendChild(createToggle('sessionStorage', 'Session Storage', 'Temporary tab-specific data', '📋'));
  grid.appendChild(createToggle('indexedDB', 'IndexedDB', 'Databases, offline app data, large structured storage', '🗄️'));
  grid.appendChild(createToggle('cache', 'Cache Storage', 'Cached assets, offline pages, service worker caches', '⚡'));
  grid.appendChild(createToggle('serviceWorkers', 'Service Workers', 'Background scripts, push notifications, offline functionality', '🔧'));

  content.appendChild(grid);

  // Reload toggle
  const reloadWrap = GDI.createElement('label', {
    styles: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px', borderRadius: DT.radii.sm,
      background: DT.colors.surface, border: `1px solid ${DT.colors.border}`,
      cursor: 'pointer', marginBottom: '20px', userSelect: 'none'
    }
  });
  const reloadCheckbox = GDI.createElement('input', {
    attrs: { type: 'checkbox', checked: selected.reload },
    styles: { width: '16px', height: '16px', accentColor: DT.colors.primary, cursor: 'pointer' }
  });
  reloadWrap.appendChild(reloadCheckbox);
  reloadWrap.appendChild(GDI.createElement('span', {
    styles: { fontSize: '13px', color: DT.colors.text },
    text: '🔄 Reload page after clearing (recommended for full effect)'
  }));
  reloadWrap.addEventListener('click', (e) => {
    if (e.target !== reloadCheckbox) reloadCheckbox.checked = !reloadCheckbox.checked;
    selected.reload = reloadCheckbox.checked;
  });
  content.appendChild(reloadWrap);

  // ─── PROGRESS LOG ───
  const logContainer = GDI.createElement('div', {
    styles: {
      background: '#0F172A', borderRadius: DT.radii.md, padding: '14px',
      fontFamily: 'monospace', fontSize: '12px', color: '#94A3B8',
      maxHeight: '180px', overflowY: 'auto', marginBottom: '20px',
      lineHeight: '1.6', display: 'none'
    }
  });
  content.appendChild(logContainer);

  const log = (msg, type = 'info') => {
    const line = GDI.createElement('div', {
      styles: {
        color: type === 'success' ? '#4ADE80' : type === 'error' ? '#F87171' : type === 'warn' ? '#FBBF24' : '#94A3B8',
        marginBottom: '2px'
      },
      text: `> ${msg}`
    });
    logContainer.appendChild(line);
    logContainer.scrollTop = logContainer.scrollHeight;
  };

  // ─── ACTION BUTTONS ───
  const btnRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '12px', justifyContent: 'flex-end' }
  });

  const clearBtn = GDI.createButton('🧹 Clear Selected Data', null, { variant: 'danger', size: 'md' });
  clearBtn.style.fontWeight = 'bold';
  const cancelBtn = GDI.createButton('Cancel', null, { variant: 'secondary', size: 'md' });

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(clearBtn);
  content.appendChild(btnRow);

  // ─── MODAL ───
  const { close } = GDI.createModal('Clear Site Data', content, { width: '520px' });

  cancelBtn.addEventListener('click', close);

  // ─── CLEAR LOGIC ───
  clearBtn.addEventListener('click', async () => {
    const anySelected = Object.entries(selected).some(([k, v]) => v && k !== 'reload');
    if (!anySelected) {
      GDI.showNotification('⚠️ Select at least one data type to clear.', 'warning');
      return;
    }

    // Confirm for destructive actions
    if (selected.cookies || selected.indexedDB) {
      if (!confirm('⚠️ This will permanently delete the selected data. Continue?')) return;
    }

    clearBtn.disabled = true;
    clearBtn.textContent = '⏳ Clearing...';
    logContainer.style.display = 'block';
    logContainer.innerHTML = '';
    log('Starting cleanup...', 'info');

    let errors = [];
    let clearedCount = 0;

    // 1. Local Storage
    if (selected.localStorage) {
      try {
        const count = Object.keys(localStorage).length;
        localStorage.clear();
        log(`LocalStorage cleared (${count} items removed)`, 'success');
        clearedCount++;
      } catch (e) {
        log(`LocalStorage failed: ${e.message}`, 'error');
        errors.push('LocalStorage');
      }
    }

    // 2. Session Storage
    if (selected.sessionStorage) {
      try {
        const count = Object.keys(sessionStorage).length;
        sessionStorage.clear();
        log(`SessionStorage cleared (${count} items removed)`, 'success');
        clearedCount++;
      } catch (e) {
        log(`SessionStorage failed: ${e.message}`, 'error');
        errors.push('SessionStorage');
      }
    }

    // 3. Cookies (comprehensive domain/path clearing)
    if (selected.cookies) {
      try {
        const cookies = document.cookie.split("; ").filter(c => c);
        let clearedCookies = 0;
        
        for (const cookie of cookies) {
          const name = cookie.split("=")[0];
          const domainParts = window.location.hostname.split(".");
          const pathParts = location.pathname.split('/').filter(Boolean);
          
          // Try clearing on all domain levels and paths
          while (domainParts.length > 0) {
            const domain = domainParts.join('.');
            const base = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; path=`;
            
            // Root path
            document.cookie = base + '/';
            
            // All sub-paths
            let currentPath = '';
            for (const part of pathParts) {
              currentPath += '/' + part;
              document.cookie = base + currentPath;
            }
            
            domainParts.shift();
          }
          
          // Also try without domain attribute
          document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          
          clearedCookies++;
        }
        
        log(`Cookies cleared (${clearedCookies} cookies expired)`, 'success');
        clearedCount++;
      } catch (e) {
        log(`Cookies failed: ${e.message}`, 'error');
        errors.push('Cookies');
      }
    }

    // 4. IndexedDB
    if (selected.indexedDB) {
      try {
        const databases = await window.indexedDB.databases?.() || [];
        let dbCount = 0;
        
        for (const dbInfo of databases) {
          if (dbInfo.name) {
            await new Promise((resolve, reject) => {
              const req = indexedDB.deleteDatabase(dbInfo.name);
              req.onsuccess = () => resolve();
              req.onerror = () => reject(new Error(req.error?.message || 'Unknown error'));
              req.onblocked = () => log(`  DB "${dbInfo.name}" blocked (close other tabs)`, 'warn');
            });
            log(`  Deleted IndexedDB: ${dbInfo.name}`, 'success');
            dbCount++;
          }
        }
        
        log(`IndexedDB cleared (${dbCount} databases)`, dbCount > 0 ? 'success' : 'warn');
        clearedCount++;
      } catch (e) {
        log(`IndexedDB failed: ${e.message}`, 'error');
        errors.push('IndexedDB');
      }
    }

    // 5. Cache Storage
    if (selected.cache && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let cacheCount = 0;
        
        for (const name of cacheNames) {
          await caches.delete(name);
          log(`  Deleted Cache: ${name}`, 'success');
          cacheCount++;
        }
        
        log(`Cache Storage cleared (${cacheCount} caches)`, cacheCount > 0 ? 'success' : 'warn');
        clearedCount++;
      } catch (e) {
        log(`Cache Storage failed: ${e.message}`, 'error');
        errors.push('Cache Storage');
      }
    }

    // 6. Service Workers
    if (selected.serviceWorkers && 'serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        let swCount = 0;
        
        for (const reg of registrations) {
          await reg.unregister();
          log(`  Unregistered SW: ${reg.scope}`, 'success');
          swCount++;
        }
        
        log(`Service Workers cleared (${swCount} unregistered)`, swCount > 0 ? 'success' : 'warn');
        clearedCount++;
      } catch (e) {
        log(`Service Workers failed: ${e.message}`, 'error');
        errors.push('Service Workers');
      }
    }

    // ─── FINALIZE ───
    const success = errors.length === 0;
    
    if (success) {
      log('✅ All selected data cleared successfully!', 'success');
      GDI.showNotification('🧹 Site data cleared successfully!', 'success');
    } else {
      log(`⚠️ Completed with errors: ${errors.join(', ')}`, 'warn');
      GDI.showNotification(`⚠️ Cleared with errors: ${errors.join(', ')}`, 'warning');
    }

    clearBtn.textContent = success ? '✅ Done' : '⚠️ Done';
    
    if (selected.reload) {
      log('Reloading page in 2 seconds...', 'info');
      setTimeout(() => window.location.reload(true), 2000);
    } else {
      setTimeout(() => {
        clearBtn.disabled = false;
        clearBtn.textContent = '🧹 Clear Selected Data';
      }, 2000);
    }
  });
}

// ==================== TOOL: MULTI-DEVICE EMULATOR ====================

function toolMultiDeviceTester() {
  const content = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', height: '80vh', gap: '16px' }
  });

  content.appendChild(createToolHeader(
    '📱 Multi-Device Emulator',
    'Test responsive design across different breakpoints simultaneously.',
    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
  ));

  const url = window.location.href;

  // Device specifications
  const devices = [
    { id: 'mobile', name: 'Mobile (iPhone 14)', w: 390, h: 844, scale: 0.65, type: 'phone' },
    { id: 'tablet', name: 'Tablet (iPad Pro)', w: 834, h: 1112, scale: 0.45, type: 'tablet' },
    { id: 'desktop', name: 'Desktop (1080p)', w: 1920, h: 1080, scale: 0.28, type: 'monitor' }
  ];

  const dashboard = GDI.createElement('div', {
    styles: {
      display: 'flex', gap: '32px', flex: '1', overflowX: 'auto', overflowY: 'hidden',
      padding: '24px', background: DT.colors.surfaceSecondary, borderRadius: DT.radii.lg,
      border: `1px solid ${DT.colors.border}`
    },
    attrs: { className: 'gdi-scrollbar' }
  });

  devices.forEach(dev => {
    const col = GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'fit-content' }
    });

    // Device Header (Title & Actions)
    const header = GDI.createElement('div', {
      styles: { display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px', alignItems: 'center' }
    });

    const title = GDI.createElement('div', {
      styles: { fontWeight: DT.typography.weights.bold, color: DT.colors.textPrimary, fontSize: '14px' },
      text: dev.name
    });

    const actions = GDI.createElement('div', { styles: { display: 'flex', gap: '8px' } });

    // Rotate Button
    const rotateBtn = GDI.createButton('🔄', () => {
      // Swap dimensions
      const temp = dev.w;
      dev.w = dev.h;
      dev.h = temp;

      // Update UI elements
      frameContainer.style.width = `${dev.w * dev.scale}px`;
      frameContainer.style.height = `${dev.h * dev.scale}px`;
      iframe.style.width = `${dev.w}px`;
      iframe.style.height = `${dev.h}px`;
      dims.textContent = `${dev.w} × ${dev.h} px`;
    }, { variant: 'ghost', size: 'sm', fullWidth: false });
    rotateBtn.style.padding = '4px 8px';
    rotateBtn.title = 'Rotate Device';

    // Pop Out Button
    const popOutBtn = GDI.createButton('↗️ Pop Out', () => {
      window.open(url, `gdi_emu_${dev.id}`, `width=${dev.w},height=${dev.h},resizable=yes,scrollbars=yes`);
    }, { variant: 'secondary', size: 'sm', fullWidth: false });
    popOutBtn.style.padding = '4px 10px';

    actions.appendChild(rotateBtn);
    actions.appendChild(popOutBtn);
    header.appendChild(title);
    header.appendChild(actions);

    // Physical Device Frame (Bezels)
    const frameContainer = GDI.createElement('div', {
      styles: {
        width: `${dev.w * dev.scale}px`,
        height: `${dev.h * dev.scale}px`,
        border: dev.type === 'monitor' ? '12px solid #1E293B' : '14px solid #0F172A',
        borderBottomWidth: dev.type === 'monitor' ? '24px' : '14px',
        borderRadius: dev.type === 'monitor' ? '8px' : '32px',
        position: 'relative',
        boxShadow: DT.shadows.xl,
        backgroundColor: '#FFFFFF',
        transition: 'width 0.3s ease, height 0.3s ease',
        overflow: 'hidden' // Cuts off the scaled iframe bleed
      }
    });

    // Actual Iframe
    const iframe = GDI.createElement('iframe', {
      attrs: { src: url },
      styles: {
        width: `${dev.w}px`,
        height: `${dev.h}px`,
        border: 'none',
        transform: `scale(${dev.scale})`,
        transformOrigin: 'top left',
        position: 'absolute',
        top: '0',
        left: '0',
        transition: 'width 0.3s ease, height 0.3s ease'
      }
    });

    frameContainer.appendChild(iframe);

    // Dimensions Label
    const dims = GDI.createElement('div', {
      styles: { marginTop: '16px', fontSize: '12px', color: DT.colors.textMuted, fontFamily: DT.typography.fontMono, fontWeight: 'bold' },
      text: `${dev.w} × ${dev.h} px`
    });

    col.appendChild(header);
    col.appendChild(frameContainer);
    col.appendChild(dims);
    dashboard.appendChild(col);
  });

  content.appendChild(dashboard);

  // Fallback Warning
  const footer = GDI.createElement('div', {
    styles: { marginTop: '8px', fontSize: '12px', color: DT.colors.textMuted, textAlign: 'center', background: DT.colors.warningLight, color: '#92400E', padding: '10px', borderRadius: DT.radii.md }
  });
  footer.innerHTML = '<strong>Note:</strong> If the frames refuse to load, the website has strict <code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 4px;">X-Frame-Options</code> security enabled. Use the <strong>Pop Out</strong> buttons instead.';
  content.appendChild(footer);

  const { close } = GDI.createModal('Multi-Device Emulator', content, { width: '95vw', maxWidth: '1400px' });
}
// ==================== EXPORT ====================

    Object.assign(window.SEOTools, {
      toolCopyUrl, toolCopyDomain, toolScrollToBottom, toolUrlSlugGenerator,
      toolWhatsappLinkGenerator, toolEmailExtractor, toolHighlightDoFollow,
      toolRemoveHighlights, toolAnalyzeHeadings, toolAnalyzeMeta,
      toolExtractLinks, toolExtractDomains, toolExtractSocial, toolFindBlog,
      toolFindGuestPost, toolFillContactForm, toolSearchOperators,
      toolPaymentForm, toolArticleForm, toolFollowupForm, toolOutreachTemplates,
      toolCancelForm, toolNextPage, toolDeclinedResponse, toolInvoiceForm,
      toolBulkUrlOpener, toolFullPageCapture, toolCheckPageSpeed, toolCheckRobotsTxt,
      toolCheckSitemap, toolAnalyzeKeywordDensity, toolShowSerpPreview,
      toolAnalyzeImages, toolCheckBrokenLinks, toolExtractBulkGoogleDomains,
      toolShowMetrics, toolAnalyzeLinks, toolCurrencyCopier, toolOptimizeUrl, 
      toolGenerateTitles, toolCheckPublicationDate, toolTestMobileUsability, 
      toolGenerateAIMeta, toolGenerateAltText, toolGenerateAITopics, 
      toolFindLinkProspects, toolFindResourcePages, toolFindLocalKeywords, 
      toolGenerateHreflang, toolFindDuplicateContent, toolContentAnalyzer,
      toolSEOAuditChecklist, toolAuditChecklist, toolSEODashboard, toolFindLocalCitations,
      
      // ADD THE MISSING ADVANCED TOOLS HERE:
      advancedSEOCompare, advancedImageToolkit, visualizeSiteStructure, 
      scrapeGoogleMaps, keywordRankTracker, toolExtractColorTheme, 
      toolExtractTypography, toolSocialCardPreview, toolImageDownloader,
      toolClearSiteData, toolMultiDeviceTester,
    });
    
  })();
}
