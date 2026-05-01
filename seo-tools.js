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
    
    window.GDI = window.GDI || {};
    
    // ──────────────────────────────────────────────
    // 🔧 FIX: Create $GDI for querying the PAGE DOM
    // (Not the Shadow DOM - used for scraping page content)
    // ──────────────────────────────────────────────
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
    // ──────────────────────────────────────────────

    window.SEOTools = {};
    const DT = window.DESIGN_TOKENS || {};

// ==================== COMMON PATTERNS ====================

/**
 * Creates a standard tool header with gradient background.
 * @param {string} title - Tool title
 * @param {string} subtitle - Tool subtitle
 * @param {string} [gradient] - Custom gradient
 * @returns {HTMLElement}
 */
GDI.createToolHeader = function(title, subtitle, gradient = window.DESIGN_TOKENS.colors.primaryGradient) {
  return GDI.createElement('div', {
    styles: {
      background: gradient,
      color: '#FFFFFF',
      padding: '24px',
      borderRadius: window.DESIGN_TOKENS.radii.xl,
      marginBottom: '24px',
      boxShadow: `0 8px 24px ${window.DESIGN_TOKENS.colors.primary}30`,
    },
    children: [
      GDI.createElement('h3', {
        styles: { margin: '0 0 8px', fontSize: DT.typography.sizes.xl, fontWeight: DT.typography.weights.bold },
        text: title,
      }),
      GDI.createElement('p', {
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
GDI.createSection = function(title, content, options = {}) {
  const { padding = '20px', marginBottom = '16px' } = options;
  
  const section = GDI.createElement('div', {
    styles: {
      background: 'var(--gdi-surface)',
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.xl,
      padding: padding,
      marginBottom: marginBottom,
      boxShadow: DT.shadows.xs,
    },
  });
  
  if (title) {
    const heading = GDI.createElement('h4', {
      styles: {
        margin: '0 0 14px',
        fontSize: DT.typography.sizes.md,
        fontWeight: DT.typography.weights.bold,
        color: 'var(--gdi-text-primary)',
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
  return GDI.createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    },
    children: stats.map(stat => GDI.createStatCard({
      label: stat.label,
      value: stat.value,
      icon: stat.icon || '📊',
      color: stat.color || window.DESIGN_TOKENS.colors.primary,
    })),
  });
}

// ==================== TOOL: COPY URL / DOMAIN ====================

/**
 * Copies the current page URL to clipboard.
 */
function toolCopyUrl() {
  const url = window.location.href;
  GDI.copyToClipboard(url).then(success => {
    GDI.showNotification(success ? '✅ URL copied to clipboard!' : '❌ Failed to copy URL', 
      success ? 'success' : 'error');
  });
}

/**
 * Copies the current domain to clipboard.
 */
function toolCopyDomain() {
  const domain = window.location.hostname.replace(/^www\./, '');
  GDI.copyToClipboard(domain).then(success => {
    GDI.showNotification(success ? `✅ Domain copied: ${domain}` : '❌ Failed to copy domain',
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
  
  GDI.showNotification('⬇️ Scrolled to bottom', 'success');
}

// ==================== TOOL: URL SLUG GENERATOR ====================

function toolUrlSlugGenerator() {
  const content = GDI.createElement('div', { styles: { padding: '0' } });
  
  // Header
  content.appendChild(GDI.createToolHeader(
    '🔗 URL Slug Generator',
    'Convert text into a clean, SEO-friendly URL slug with live preview'
  ));
  
  // Input field
  const { wrapper: inputWrapper, input: slugInput } = GDI.createInputField({
    label: '📝 Enter Text',
    id: 'slug-input',
    placeholder: 'Enter your blog post title or text here... ✍️',
    required: false,
    type: 'text',
    defaultValue: document.title || '',
  });
  
  // Character count
  const charCount = GDI.createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: 'var(--gdi-text-muted)',
      textAlign: 'right',
      marginTop: '4px',
    },
    text: '0 / 200 characters',
  });
  inputWrapper.appendChild(charCount);
  
  // Options
  const optionsGrid = GDI.createElement('div', {
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
    const label = GDI.createElement('label', {
      styles: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: DT.typography.sizes.base,
        fontWeight: DT.typography.weights.medium,
        color: 'var(--gdi-text-secondary)',
        cursor: 'pointer',
      },
    });
    
    const checkbox = GDI.createElement('input', {
      attrs: { type: 'checkbox', id: opt.id },
    });
    checkbox.checked = opt.checked;
    optionStates[opt.id] = opt.checked;
    
    checkbox.addEventListener('change', () => {
      optionStates[opt.id] = checkbox.checked;
      updateSlug();
    });
    
    const text = GDI.createElement('span', { text: opt.label });
    
    label.appendChild(checkbox);
    label.appendChild(text);
    optionsGrid.appendChild(label);
  });
  
  // Output field
  const { wrapper: outputWrapper, input: slugOutput } = GDI.createInputField({
    label: '🎯 Generated Slug',
    id: 'slug-output',
    placeholder: 'your-slug-will-appear-here',
    type: 'text',
  });
  
  // Preview URL
  const previewBox = GDI.createElement('div', {
    styles: {
      background: 'var(--gdi-surface-secondary)',
      border: `1px dashed ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      padding: '14px',
      marginBottom: '16px',
      fontFamily: DT.typography.fontMono,
      fontSize: DT.typography.sizes.base,
    },
  });
  
  const previewPrefix = GDI.createElement('span', {
    styles: { color: 'var(--gdi-text-muted)' },
    text: 'https://example.com/blog/',
  });
  
  const previewSlug = GDI.createElement('span', {
    styles: { color: window.DESIGN_TOKENS.colors.primary, fontWeight: DT.typography.weights.bold },
    text: '',
  });
  
  previewBox.appendChild(previewPrefix);
  previewBox.appendChild(previewSlug);
  
  // Buttons
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  const copyBtn = GDI.createButton('📋 Copy Slug', () => {
    const slug = slugOutput.value;
    if (!slug) {
      GDI.showNotification('Nothing to copy! Generate a slug first.', 'warning');
      return;
    }
    GDI.copyToClipboard(slug).then(() => GDI.showNotification('✅ Slug copied!', 'success'));
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
    if (text.length > 180) charCount.style.color = window.DESIGN_TOKENS.colors.warning;
    if (text.length >= 200) charCount.style.color = window.DESIGN_TOKENS.colors.error;
    if (text.length <= 180) charCount.style.color = 'var(--gdi-text-muted)';
  }
  
  slugInput.addEventListener('input', updateSlug);
  
  // Assemble
  const section = GDI.createSection('', [
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
  const { close } = GDI.createModal('URL Slug Generator', content, { width: '580px' });
  
  // Focus input
  setTimeout(() => slugInput.focus(), 150);
}

// ==================== TOOL: WHATSAPP LINK GENERATOR ====================

function toolWhatsappLinkGenerator() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '💬 WhatsApp Link Generator',
    'Create a direct chat link for any phone number',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Get selected text if any
  const selection = window.getSelection()?.toString().trim() || '';
  const cleanNumber = selection.replace(/\D/g, '');
  
  // Phone input
  const { wrapper: phoneWrapper, input: phoneInput } = GDI.createInputField({
    label: '📱 Phone Number (with country code)',
    id: 'wa-phone',
    placeholder: 'e.g., 14155552671',
    type: 'tel',
    defaultValue: cleanNumber,
  });
  
  // Preview box
  const previewBox = GDI.createElement('div', {
    styles: {
      background: '#F0FDF4',
      border: '1px solid #BBF7D0',
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      padding: '16px',
      marginBottom: '16px',
      display: 'none',
    },
  });
  
  const previewLabel = GDI.createElement('div', {
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
  
  const previewLink = GDI.createElement('a', {
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
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  const openBtn = GDI.createButton('🚀 Open Chat', () => {
    const num = phoneInput.value.replace(/\D/g, '');
    if (validatePhone(num)) {
      const url = `https://api.whatsapp.com/send?phone=${num}`;
      window.open(url, '_blank');
    }
  }, { variant: 'success', fullWidth: true });
  
  const copyBtn = GDI.createButton('📋 Copy Link', () => {
    const num = phoneInput.value.replace(/\D/g, '');
    if (validatePhone(num)) {
      const url = `https://api.whatsapp.com/send?phone=${num}`;
      GDI.copyToClipboard(url).then(() => GDI.showNotification('✅ Link copied!', 'success'));
    }
  }, { variant: 'primary', fullWidth: true });
  
  buttonRow.appendChild(openBtn);
  buttonRow.appendChild(copyBtn);
  
  // Validation
  function validatePhone(num) {
    if (num.length < 5 || num.length > 15) {
      GDI.showNotification('Enter a valid phone number (5–15 digits).', 'warning');
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
  const section = GDI.createSection('', [phoneWrapper, previewBox, buttonRow]);
  content.appendChild(section);
  
  const { close } = GDI.createModal('WhatsApp Link Generator', content, { width: '520px' });
  setTimeout(() => phoneInput.focus(), 150);
}

// ==================== TOOL: EMAIL EXTRACTOR ====================

function toolEmailExtractor() {
  const content = GDI.createElement('div');
  
  // Extract emails
  const emailRegex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}/g;
  
  const pageText = document.body.innerText || '';
  const emails = new Set();
  
  // Method 1: Regex on visible text
  (pageText.match(emailRegex) || []).forEach(e => emails.add(e.toLowerCase()));
  
  // Method 2: Scan mailto: links
  $GDI.$$('a[href^="mailto:"]').forEach(a => {
    const email = decodeURIComponent(a.getAttribute('href'))
      .replace(/^mailto:/i, '')
      .split('?')[0]
      .trim()
      .toLowerCase();
    if (emailRegex.test(email)) emails.add(email);
  });
  
  // Method 3: Input fields
  $GDI.$$('input[type="email"], input[name*="email"]').forEach(input => {
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
  content.appendChild(GDI.createToolHeader(
    '📧 Email Extractor',
    `Found ${filteredEmails.length} unique email address${filteredEmails.length !== 1 ? 'es' : ''}`,
    window.DESIGN_TOKENS.colors.infoGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Found', value: filteredEmails.length, icon: '📊', color: window.DESIGN_TOKENS.colors.info },
    { label: 'From Text', value: (pageText.match(emailRegex) || []).length, icon: '📝' },
    { label: 'From mailto:', value: $GDI.$$('a[href^="mailto:"]').length, icon: '🔗' },
  ]));
  
  if (filteredEmails.length === 0) {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: {
          textAlign: 'center',
          padding: '40px',
          color: 'var(--gdi-text-muted)',
          fontSize: DT.typography.sizes.md,
        },
        text: 'No emails found on this page.',
      }),
    ]));
  } else {
    // Email list
    const emailList = GDI.createElement('div', {
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '350px',
        overflowY: 'auto',
      },
    });
    
    filteredEmails.forEach((email, index) => {
      const row = GDI.createElement('div', {
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: index % 2 === 0 ? 'var(--gdi-surface)' : 'var(--gdi-surface-secondary)',
          border: `1px solid ${'var(--gdi-border)'}`,
          borderRadius: window.DESIGN_TOKENS.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.borderColor = window.DESIGN_TOKENS.colors.primary;
        row.style.transform = 'translateX(4px)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.borderColor = 'var(--gdi-border)';
        row.style.transform = 'translateX(0)';
      });
      
      const emailInfo = GDI.createElement('div', {
        styles: { display: 'flex', alignItems: 'center', gap: '12px', flex: '1' },
      });
      
      const indexBadge = GDI.createElement('span', {
        styles: {
          width: '28px',
          height: '28px',
          borderRadius: window.DESIGN_TOKENS.radii.full,
          background: window.DESIGN_TOKENS.colors.primary,
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
      
      const emailText = GDI.createElement('span', {
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
      
      const copyBtn = GDI.createButton('Copy', () => {
        GDI.copyToClipboard(email).then(() => GDI.showNotification('✅ Email copied!', 'success'));
      }, { variant: 'secondary', fullWidth: false, size: 'sm' });
      
      row.appendChild(emailInfo);
      row.appendChild(copyBtn);
      
      // Click row to copy
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        GDI.copyToClipboard(email).then(() => GDI.showNotification('✅ Email copied!', 'success'));
      });
      
      emailList.appendChild(row);
    });
    
    content.appendChild(GDI.createSection('📋 Extracted Emails', [emailList]));
    
    // Action buttons
    const buttonRow = GDI.createElement('div', {
      styles: { display: 'flex', gap: '10px', marginTop: '16px' },
    });
    
    buttonRow.appendChild(GDI.createButton('📋 Copy All Emails', () => {
      GDI.copyToClipboard(filteredEmails.join('\n')).then(() => 
        GDI.showNotification(`✅ ${filteredEmails.length} emails copied!`, 'success')
      );
    }, { variant: 'primary' }));
    
    buttonRow.appendChild(GDI.createButton('📊 Export CSV', () => {
      const csv = 'Email\n' + filteredEmails.map(e => `"${e}"`).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = url;
      a.download = `emails-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      GDI.showNotification('✅ CSV exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(buttonRow);
  }
  
  const { close } = GDI.createModal('Email Extractor', content, { width: '650px' });
}

// ==================== TOOL: DO-FOLLOW HIGHLIGHTER ====================

function toolHighlightDoFollow() {
  // Check if already highlighted
  const existing = $GDI.$$('.gdi-dofollow-highlight, .gdi-nofollow-highlight');
  if (existing.length > 0) {
    toolRemoveHighlights();
    return;
  }
  
  // Inject styles
  if (!GDI.$('#gdi-highlight-styles')) {
    const style = GDI.createElement('style', { attrs: { id: 'gdi-highlight-styles' } });
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
  
  const links = $GDI.$$('a[href]');
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
  
  GDI.showNotification(
    `✅ Highlighted ${doFollowCount} do-follow & ${noFollowCount} no-follow links`,
    'success'
  );
}

function toolRemoveHighlights() {
  const highlighted = $GDI.$$('.gdi-dofollow-highlight, .gdi-nofollow-highlight');
  
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
  const styleEl = GDI.$('#gdi-highlight-styles');
  if (styleEl) styleEl.remove();
  
  GDI.showNotification('✅ All highlights removed', 'success');
}

// ==================== TOOL: HEADING STRUCTURE ANALYZER ====================

function toolAnalyzeHeadings() {
  const content = GDI.createElement('div');
  
  // Collect headings
  const headingData = {};
  for (let i = 1; i <= 6; i++) {
    headingData[`h${i}`] = Array.from(document.querySelectorAll(`h${i}`)).map(h => ({
      text: GDI.cleanText(h.textContent).substring(0, 100),
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
  content.appendChild(GDI.createToolHeader(
    '📑 Heading Structure Analysis',
    `${totalHeadings} headings found across 6 levels`
  ));
  
  // Score ring
  const scoreRow = GDI.createElement('div', {
    styles: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
  });
  scoreRow.appendChild(GDI.createScoreRing(overallScore, 100));
  content.appendChild(scoreRow);
  
  // Stats grid
  const stats = [];
  for (let i = 1; i <= 6; i++) {
    if (headingData[`h${i}`].length > 0) {
      stats.push({
        label: `H${i} Tags`,
        value: headingData[`h${i}`].length,
        icon: i === 1 ? '📌' : '📎',
        color: i === 1 ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-text-secondary)',
      });
    }
  }
  content.appendChild(createStatGrid(stats));
  
  // Issues
  if (issues.length > 0) {
    const issuesSection = GDI.createSection('⚠️ Issues Found', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue => {
          const isError = issue.severity === 'error';
          return GDI.createElement('div', {
            styles: {
              padding: '10px 14px',
              background: isError ? window.DESIGN_TOKENS.colors.errorLight : window.DESIGN_TOKENS.colors.warningLight,
              borderLeft: `4px solid ${isError ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.warning}`,
              borderRadius: window.DESIGN_TOKENS.radii.md,
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
  const headingList = GDI.createElement('div', {
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
      headingList.appendChild(GDI.createElement('div', {
        styles: {
          padding: '8px 12px',
          background: lvl === 1 ? window.DESIGN_TOKENS.colors.infoLight : 'var(--gdi-surface-secondary)',
          borderLeft: `3px solid ${lvl === 1 ? window.DESIGN_TOKENS.colors.info : 'var(--gdi-border)'}`,
          borderRadius: window.DESIGN_TOKENS.radii.sm,
          fontSize: DT.typography.sizes.base,
          marginLeft: `${(lvl - 1) * 16}px`,
        },
        children: [
          GDI.createElement('span', {
            styles: {
              fontWeight: DT.typography.weights.bold,
              color: lvl === 1 ? window.DESIGN_TOKENS.colors.info : 'var(--gdi-text-muted)',
              marginRight: '8px',
            },
            text: level.toUpperCase(),
          }),
          GDI.createElement('span', {
            styles: { color: 'var(--gdi-text-primary)' },
            text: h.text || '(empty)',
          }),
        ],
      }));
    });
  });
  
  content.appendChild(GDI.createSection('📋 Heading Hierarchy', [headingList]));
  
  const { close } = GDI.createModal('Heading Structure Analysis', content, { width: '650px' });
}

// ==================== TOOL: META TAGS ANALYZER ====================

function toolAnalyzeMeta() {
  const content = GDI.createElement('div');
  
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
  content.appendChild(GDI.createToolHeader(
    '🏷️ Meta Tags Analysis',
    `${Object.values(scores).filter(s => s === 100).length} of ${Object.keys(scores).length} checks passed`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Score
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(overallScore, 90));
  content.appendChild(scoreRow);
  
  // Score bars
  const scoreBars = GDI.createElement('div', { styles: { marginBottom: '20px' } });
  
  [
    { label: 'Title Tag', score: scores.title, detail: `${metaData.titleLength} chars${!scores.title ? ' (Missing)' : ''}` },
    { label: 'Meta Description', score: scores.description, detail: `${metaData.descLength} chars${!scores.description ? ' (Missing)' : ''}` },
    { label: 'Open Graph', score: scores.og },
    { label: 'Twitter Card', score: scores.twitter },
    { label: 'Viewport', score: scores.viewport },
    { label: 'Canonical', score: scores.canonical },
  ].forEach(item => {
    const color = item.score === 100 ? window.DESIGN_TOKENS.colors.success : 
                  item.score === 50 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.error;
    
    const bar = GDI.createElement('div', { styles: { marginBottom: '10px' } });
    
    const barHeader = GDI.createElement('div', {
      styles: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: DT.typography.sizes.base,
      },
    });
    
    barHeader.appendChild(GDI.createElement('span', {
      styles: { fontWeight: DT.typography.weights.medium, color: 'var(--gdi-text-primary)' },
      text: item.label,
    }));
    
    const scoreBadge = GDI.createElement('span', {
      styles: { fontWeight: DT.typography.weights.bold, color },
      text: `${item.score}%`,
    });
    
    if (item.detail) {
      scoreBadge.appendChild(GDI.createElement('span', {
        styles: { color: 'var(--gdi-text-muted)', marginLeft: '6px', fontWeight: DT.typography.weights.normal },
        text: `(${item.detail})`,
      }));
    }
    
    barHeader.appendChild(scoreBadge);
    bar.appendChild(barHeader);
    
    const { container: progressBar } = GDI.createProgressBar(item.score, color, 6);
    bar.appendChild(progressBar);
    
    scoreBars.appendChild(bar);
  });
  
  content.appendChild(GDI.createSection('📊 Score Breakdown', [scoreBars]));
  
  // Meta details
  const detailsGrid = GDI.createElement('div', {
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
    const colorMap = { good: window.DESIGN_TOKENS.colors.success, warn: window.DESIGN_TOKENS.colors.warning, error: window.DESIGN_TOKENS.colors.error, neutral: 'var(--gdi-text-secondary)' };
    
    detailsGrid.appendChild(GDI.createElement('div', {
      styles: {
        padding: '12px 14px',
        background: 'var(--gdi-surface)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
      },
      children: [
        GDI.createElement('div', {
          styles: { fontSize: DT.typography.sizes.xs, color: 'var(--gdi-text-muted)', marginBottom: '4px', fontWeight: DT.typography.weights.semibold, textTransform: 'uppercase' },
          text: item.label,
        }),
        GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: item.value === 'Missing' || item.value === 'Not set' ? window.DESIGN_TOKENS.colors.error : colorMap[item.status],
            fontWeight: DT.typography.weights.medium,
            wordBreak: 'break-word',
          },
          text: typeof item.value === 'string' && item.value.length > 80 ? item.value.substring(0, 77) + '...' : item.value,
        }),
      ],
    }));
  });
  
  content.appendChild(GDI.createSection('📋 Meta Tag Details', [detailsGrid]));
  
  const { close } = GDI.createModal('Meta Tags Analysis', content, { width: '700px' });
}

// ==================== TOOL: LINK EXTRACTOR & ANALYZER ====================

function toolExtractLinks() {
  const content = GDI.createElement('div');
  
  // Collect link data
  const currentDomain = window.location.hostname;
  const links = $GDI.$$('a[href]');
  const linkData = [];
  
  let internalCount = 0, externalCount = 0, nofollowCount = 0, dofollowCount = 0;
  
  links.forEach((anchor, index) => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('javascript:') || href === '#' || 
        href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    const text = GDI.cleanText(anchor.textContent).substring(0, 150) || '[No Anchor Text]';
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
  content.appendChild(GDI.createToolHeader(
    '🔗 Link Extractor & Analyzer',
    `${linkData.length} links found • ${internalCount} internal • ${externalCount} external`
  ));
  
  // Stats grid
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: linkData.length, icon: '🔗', color: window.DESIGN_TOKENS.colors.primary },
    { label: 'Internal', value: internalCount, icon: '🏠', color: window.DESIGN_TOKENS.colors.success },
    { label: 'External', value: externalCount, icon: '🌐', color: window.DESIGN_TOKENS.colors.info },
    { label: 'DoFollow', value: dofollowCount, icon: '✅', color: window.DESIGN_TOKENS.colors.success },
    { label: 'NoFollow', value: nofollowCount, icon: '🚫', color: window.DESIGN_TOKENS.colors.warning },
    { label: 'Sponsored', value: linkData.filter(l => l.isSponsored).length, icon: '💰', color: window.DESIGN_TOKENS.colors.error },
  ]));
  
  // Filter bar
  const filterBar = GDI.createElement('div', {
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
    const filterBtn = GDI.createElement('button', {
      styles: {
        padding: '6px 14px',
        border: `1px solid ${btn.active ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.full,
        background: btn.active ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-surface)',
        color: btn.active ? '#FFFFFF' : 'var(--gdi-text-secondary)',
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
        b.style.background = 'var(--gdi-surface)';
        b.style.color = 'var(--gdi-text-secondary)';
        b.style.borderColor = 'var(--gdi-border)';
      });
      filterBtn.style.background = window.DESIGN_TOKENS.colors.primary;
      filterBtn.style.color = '#FFFFFF';
      filterBtn.style.borderColor = window.DESIGN_TOKENS.colors.primary;
      
      filterLinks();
    });
    
    filterBar.appendChild(filterBtn);
  });
  
  content.appendChild(filterBar);
  
  // Link list container
  const linkList = GDI.createElement('div', {
    styles: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.lg,
    },
  });
  
  function renderLinks(filteredLinks) {
    linkList.innerHTML = '';
    
    filteredLinks.forEach((link, idx) => {
      const row = GDI.createElement('div', {
        styles: {
          padding: '12px 16px',
          borderBottom: `1px solid ${'var(--gdi-border-light)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          transition: `background ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--gdi-surface-secondary)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      
      // Type badge
      const typeBadge = GDI.createBadge(
        link.isExternal ? 'External' : 'Internal',
        link.isExternal ? 'info' : 'success'
      );
      
      // Follow badge
      const followBadge = GDI.createBadge(
        link.isNofollow ? 'NoFollow' : 'DoFollow',
        link.isNofollow ? 'warning' : 'success'
      );
      
      const badges = GDI.createElement('div', {
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
        badges.appendChild(GDI.createBadge('Sponsored', 'warning'));
      }
      
      // Link info
      const info = GDI.createElement('div', {
        styles: { flex: '1', minWidth: '0' },
      });
      
      const anchorText = GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.base,
          fontWeight: DT.typography.weights.semibold,
          color: 'var(--gdi-text-primary)',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        text: link.text,
      });
      
      const urlText = GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.sm,
          color: window.DESIGN_TOKENS.colors.primary,
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
      const copyBtn = GDI.createButton('Copy', () => {
        GDI.copyToClipboard(link.url).then(() => GDI.showNotification('✅ URL copied!', 'success'));
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
    const domainSection = GDI.createSection('🌐 Top External Domains', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: topDomains.map(([domain, count], i) => {
          const maxCount = topDomains[0][1];
          const barWidth = (count / maxCount) * 100;
          
          return GDI.createElement('div', {
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'var(--gdi-surface-secondary)',
              borderRadius: window.DESIGN_TOKENS.radii.md,
            },
            children: [
              GDI.createElement('span', {
                styles: {
                  width: '24px',
                  height: '24px',
                  borderRadius: window.DESIGN_TOKENS.radii.full,
                  background: window.DESIGN_TOKENS.colors.primary,
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
              GDI.createElement('span', {
                styles: {
                  flex: '1',
                  fontSize: DT.typography.sizes.base,
                  fontWeight: DT.typography.weights.medium,
                  color: 'var(--gdi-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                text: domain,
              }),
              GDI.createElement('div', {
                styles: { flex: '1', maxWidth: '150px' },
                children: [
                  GDI.createElement('div', {
                    styles: {
                      height: '6px',
                      background: 'var(--gdi-surface-tertiary)',
                      borderRadius: window.DESIGN_TOKENS.radii.full,
                      overflow: 'hidden',
                    },
                    children: [
                      GDI.createElement('div', {
                        styles: {
                          width: `${barWidth}%`,
                          height: '100%',
                          background: window.DESIGN_TOKENS.colors.primaryGradient,
                          borderRadius: window.DESIGN_TOKENS.radii.full,
                          transition: 'width 0.5s ease',
                        },
                      }),
                    ],
                  }),
                ],
              }),
              GDI.createElement('span', {
                styles: {
                  fontSize: DT.typography.sizes.sm,
                  fontWeight: DT.typography.weights.bold,
                  color: window.DESIGN_TOKENS.colors.primary,
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
  const exportBtn = GDI.createButton('📊 Export as CSV', () => {
    let csv = 'Index,Type,Follow,Anchor Text,URL\n';
    linkData.forEach(l => {
      csv += `"${l.index}","${l.isExternal ? 'External' : 'Internal'}","${l.isNofollow ? 'NoFollow' : 'DoFollow'}","${l.text.replace(/"/g, '""')}","${l.url}"\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = `links-${currentDomain.replace(/\./g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    GDI.showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' });
  
  content.appendChild(GDI.createElement('div', {
    styles: { marginTop: '16px' },
    children: [exportBtn],
  }));
  
  const { close } = GDI.createModal('Link Extractor & Analyzer', content, { width: '800px' });
}

// ==================== TOOL: DOMAIN EXTRACTOR ====================

function toolExtractDomains() {
  const content = GDI.createElement('div');
  
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
  
  $GDI.$$('a[href]').forEach(anchor => {
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
      entry.texts.add(GDI.cleanText(anchor.textContent).substring(0, 80));
    } catch (e) {}
  });
  
  const sortedDomains = [...domainMap.values()]
    .sort((a, b) => b.count - a.count);
  
  // Header
  content.appendChild(GDI.createToolHeader(
    '🌐 External Domain Extractor',
    `${sortedDomains.length} unique domains found • ${sortedDomains.reduce((s, d) => s + d.count, 0)} total references`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Unique Domains', value: sortedDomains.length, icon: '🌐', color: '#E65100' },
    { label: 'Total Refs', value: sortedDomains.reduce((s, d) => s + d.count, 0), icon: '🔗' },
    { label: 'Avg Refs/Domain', value: (sortedDomains.reduce((s, d) => s + d.count, 0) / sortedDomains.length || 1).toFixed(1), icon: '📊' },
    { label: 'Top Domain', value: sortedDomains[0]?.count || 0, icon: '🏆' },
  ]));
  
  if (sortedDomains.length === 0) {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: 'var(--gdi-text-muted)' },
        text: 'No external domains found on this page.',
      }),
    ]));
  } else {
    // Search/filter
    const { wrapper: searchWrapper, input: searchInput } = GDI.createInputField({
      label: '🔍 Filter Domains',
      id: 'domain-filter',
      placeholder: 'Filter by domain name...',
      type: 'text',
    });
    searchWrapper.style.marginBottom = '16px';
    
    const domainList = GDI.createElement('div', {
      styles: {
        maxHeight: '400px',
        overflowY: 'auto',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.lg,
      },
    });
    
    function renderDomains(filter) {
      const filtered = filter 
        ? sortedDomains.filter(d => d.domain.includes(filter.toLowerCase()))
        : sortedDomains;
      
      domainList.innerHTML = '';
      
      filtered.forEach((item, i) => {
        const row = GDI.createElement('div', {
          styles: {
            padding: '12px 16px',
            borderBottom: `1px solid ${'var(--gdi-border-light)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        row.addEventListener('mouseenter', () => {
          row.style.background = 'var(--gdi-surface-secondary)';
        });
        
        row.addEventListener('mouseleave', () => {
          row.style.background = '';
        });
        
        // Rank
        row.appendChild(GDI.createElement('span', {
          styles: {
            width: '28px',
            height: '28px',
            borderRadius: window.DESIGN_TOKENS.radii.full,
            background: i < 3 ? '#E65100' : 'var(--gdi-surface-tertiary)',
            color: i < 3 ? '#FFFFFF' : 'var(--gdi-text-secondary)',
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
        const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
        
        info.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            fontFamily: DT.typography.fontMono,
            color: 'var(--gdi-text-primary)',
            marginBottom: '4px',
          },
          text: item.domain,
        }));
        
        if (item.texts.size > 0) {
          info.appendChild(GDI.createElement('div', {
            styles: {
              fontSize: DT.typography.sizes.xs,
              color: 'var(--gdi-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            text: `From: ${[...item.texts].slice(0, 2).join(' • ')}`,
          }));
        }
        
        // Count badge
        const countBadge = GDI.createElement('span', {
          styles: {
            padding: '4px 12px',
            borderRadius: window.DESIGN_TOKENS.radii.full,
            background: '#FFF3E0',
            color: '#E65100',
            fontSize: DT.typography.sizes.sm,
            fontWeight: DT.typography.weights.bold,
            flexShrink: '0',
          },
          text: `${item.count}x`,
        });
        
        // Copy button
        const copyBtn = GDI.createButton('Copy', () => {
          GDI.copyToClipboard(item.domain).then(() => GDI.showNotification('✅ Domain copied!', 'success'));
        }, { variant: 'secondary', fullWidth: false, size: 'sm' });
        
        row.appendChild(info);
        row.appendChild(countBadge);
        row.appendChild(copyBtn);
        
        domainList.appendChild(row);
      });
    }
    
    renderDomains();
    
    searchInput.addEventListener('input', GDI.debounce(() => {
      renderDomains(searchInput.value);
    }, 200));
    
    content.appendChild(searchWrapper);
    content.appendChild(domainList);
    
    // Export buttons
    const buttonRow = GDI.createElement('div', {
      styles: { display: 'flex', gap: '10px', marginTop: '16px' },
    });
    
    buttonRow.appendChild(GDI.createButton('📋 Copy All Domains', () => {
      GDI.copyToClipboard(sortedDomains.map(d => d.domain).join('\n')).then(() =>
        GDI.showNotification(`✅ ${sortedDomains.length} domains copied!`, 'success')
      );
    }, { variant: 'primary' }));
    
    buttonRow.appendChild(GDI.createButton('📊 Export CSV', () => {
      let csv = 'Rank,Domain,References,First URL\n';
      sortedDomains.forEach((d, i) => {
        csv += `"${i + 1}","${d.domain}","${d.count}","${d.firstUrl}"\n`;
      });
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = url;
      a.download = `domains-${currentDomain}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      GDI.showNotification('✅ CSV exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(buttonRow);
  }
  
  const { close } = GDI.createModal('Domain Extractor', content, { width: '750px' });
}

// ==================== TOOL: SOCIAL MEDIA EXTRACTOR ====================

function toolExtractSocial() {
  const content = GDI.createElement('div');
  
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
  
  $GDI.$$('a[href]').forEach(anchor => {
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
              text: GDI.cleanText(anchor.textContent) || platform.name,
            });
          }
        }
      }
    } catch (e) {}
  });
  
  // Also check for social media icons in class names
  const socialIconPatterns = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'];
  
  $GDI.$$('a[href]').forEach(anchor => {
    const classes = (typeof anchor.className === 'string' ? anchor.className : '').toLowerCase();
    const parentClasses = (typeof anchor.parentElement?.className === 'string' ? anchor.parentElement.className : '').toLowerCase();
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
                text: GDI.cleanText(anchor.textContent) || matchingPlatform[1].name,
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
  content.appendChild(GDI.createToolHeader(
    '📱 Social Media Extractor',
    `${uniqueLinks.length} social profiles found across ${Object.keys(byCategory).length} categories`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: uniqueLinks.length, icon: '🔗', color: '#7B1FA2' },
    { label: 'Categories', value: Object.keys(byCategory).length, icon: '📂' },
    { label: 'Platforms', value: new Set(uniqueLinks.map(l => l.name)).size, icon: '🏢' },
  ]));
  
  if (uniqueLinks.length === 0) {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: 'var(--gdi-text-muted)' },
        text: 'No social media links found on this page.',
      }),
    ]));
  } else {
    // Render by category
    Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).forEach(([category, links]) => {
      const categorySection = GDI.createSection(`📁 ${category} (${links.length})`, [
        GDI.createElement('div', {
          styles: { display: 'grid', gap: '10px' },
          children: links.map(link => {
            const card = GDI.createElement('div', {
              styles: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: 'var(--gdi-surface)',
                border: `1px solid ${'var(--gdi-border)'}`,
                borderRadius: window.DESIGN_TOKENS.radii.lg,
                cursor: 'pointer',
                transition: `all ${DT.transitions.fast}`,
              },
              children: [
                // Platform icon
                GDI.createElement('div', {
                  styles: {
                    width: '44px',
                    height: '44px',
                    borderRadius: window.DESIGN_TOKENS.radii.lg,
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
                GDI.createElement('div', {
                  styles: { flex: '1', minWidth: '0' },
                  children: [
                    GDI.createElement('div', {
                      styles: {
                        fontSize: DT.typography.sizes.md,
                        fontWeight: DT.typography.weights.bold,
                        color: 'var(--gdi-text-primary)',
                        marginBottom: '2px',
                      },
                      text: link.name,
                    }),
                    GDI.createElement('div', {
                      styles: {
                        fontSize: DT.typography.sizes.sm,
                        color: window.DESIGN_TOKENS.colors.primary,
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
                GDI.createButton('Copy', (e) => {
                  e.stopPropagation();
                  GDI.copyToClipboard(link.url).then(() => GDI.showNotification('✅ Link copied!', 'success'));
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
    content.appendChild(GDI.createButton('📋 Copy All Social Links', () => {
      const text = uniqueLinks.map(l => `${l.name}: ${l.url}`).join('\n');
      GDI.copyToClipboard(text).then(() => GDI.showNotification('✅ All links copied!', 'success'));
    }, { variant: 'primary' }));
  }
  
  const { close } = GDI.createModal('Social Media Extractor', content, { width: '700px' });
}

// ==================== TOOL: BLOG PAGE FINDER ====================

function toolFindBlog() {
  const content = GDI.createElement('div');
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
  content.appendChild(GDI.createToolHeader(
    '📰 Blog Page Finder',
    'Searching for blog pages on this site...'
  ));
  
  // Loading indicator
  const loadingSection = GDI.createSection('🔍 Searching...', [
    GDI.createElement('div', {
      styles: {
        textAlign: 'center',
        padding: '40px',
      },
      children: [
        GDI.createElement('div', {
          styles: {
            fontSize: '40px',
            marginBottom: '16px',
            animation: 'gdi-pulse 1.5s infinite',
          },
          text: '🔍',
        }),
        GDI.createElement('div', {
          styles: { color: 'var(--gdi-text-muted)', fontSize: DT.typography.sizes.md },
          text: 'Scanning common blog paths...',
        }),
      ],
    }),
  ]);
  
  content.appendChild(loadingSection);
  
  // Results container (hidden initially)
  const resultsContainer = GDI.createElement('div', { styles: { display: 'none' } });
  const resultsList = GDI.createElement('div', {
    styles: { display: 'grid', gap: '12px' },
  });
  
  resultsContainer.appendChild(GDI.createSection('📋 Results', [resultsList]));
  content.appendChild(resultsContainer);
  
  const { close } = GDI.createModal('Blog Page Finder', content, { width: '600px' });
  
  // Scan for blog links on page
  function scanPageForBlogLinks() {
    const foundLinks = [];
    
    $GDI.$$('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      const text = GDI.cleanText(anchor.textContent).toLowerCase();
      
      blogKeywords.forEach(keyword => {
        if (text.includes(keyword) || href.toLowerCase().includes(keyword)) {
          let url = href;
          if (url.startsWith('/')) url = baseUrl + url;
          if (!url.startsWith('http')) url = baseUrl + '/' + url;
          
          if (!foundLinks.find(l => l.url === url)) {
            foundLinks.push({
              url,
              text: GDI.cleanText(anchor.textContent) || href,
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
      resultsList.appendChild(GDI.createElement('div', {
        styles: {
          textAlign: 'center',
          padding: '40px',
          color: 'var(--gdi-text-muted)',
          fontSize: DT.typography.sizes.md,
        },
        text: 'No blog pages found. Try checking the navigation menu or footer for blog links.',
      }));
    } else {
      results.forEach((result, i) => {
        const card = GDI.createElement('div', {
          styles: {
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px',
            background: i === 0 ? window.DESIGN_TOKENS.colors.successLight : 'var(--gdi-surface)',
            border: `2px solid ${i === 0 ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.lg,
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
        card.appendChild(GDI.createElement('span', {
          styles: {
            width: '36px',
            height: '36px',
            borderRadius: window.DESIGN_TOKENS.radii.full,
            background: i === 0 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.primary,
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
        const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
        
        info.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            color: 'var(--gdi-text-primary)',
            marginBottom: '4px',
            fontFamily: DT.typography.fontMono,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          text: result.url,
        }));
        
        info.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.sm,
            color: 'var(--gdi-text-muted)',
            display: 'flex',
            gap: '10px',
          },
          children: [
            GDI.createElement('span', { text: `Source: ${result.source}` }),
            GDI.createElement('span', { text: `Score: ${result.score}` }),
          ],
        }));
        
        // Visit button
        card.appendChild(GDI.createButton('Visit →', () => {
          window.location.href = result.url;
        }, { variant: 'primary', fullWidth: false }));
        
        card.appendChild(info);
        
        resultsList.appendChild(card);
      });
      
      // Auto-redirect message
      const bestResult = results[0];
      if (bestResult.score >= 8) {
        const redirectMsg = GDI.createElement('div', {
          styles: {
            marginTop: '16px',
            padding: '14px',
            background: window.DESIGN_TOKENS.colors.infoLight,
            borderRadius: window.DESIGN_TOKENS.radii.md,
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
  const content = GDI.createElement('div');
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
  
  content.appendChild(GDI.createToolHeader(
    '✍️ Guest Post Finder',
    'Searching for guest posting opportunities...',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Loading
  const loadingSection = GDI.createSection('🔍 Searching...', [
    GDI.createElement('div', {
      styles: { textAlign: 'center', padding: '40px' },
      children: [
        GDI.createElement('div', {
          styles: { fontSize: '40px', marginBottom: '16px', animation: 'gdi-pulse 1.5s infinite' },
          text: '🔍',
        }),
        GDI.createElement('div', {
          styles: { color: 'var(--gdi-text-muted)' },
          text: 'Scanning for guest post pages on this site...',
        }),
      ],
    }),
  ]);
  
  content.appendChild(loadingSection);
  
  // Results container
  const resultsContainer = GDI.createElement('div', { styles: { display: 'none' } });
  const resultsList = GDI.createElement('div', {
    styles: { display: 'grid', gap: '12px' },
  });
  
  resultsContainer.appendChild(GDI.createSection('📋 Opportunities Found', [resultsList]));
  content.appendChild(resultsContainer);
  
  const { close } = GDI.createModal('Guest Post Finder', content, { width: '750px' });
  
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
      resultsList.appendChild(GDI.createElement('div', {
        styles: { textAlign: 'center', padding: '40px', color: 'var(--gdi-text-muted)', fontSize: DT.typography.sizes.md },
        text: 'No guest post opportunities found on this site.',
      }));
    } else {
      results.forEach((result, i) => {
        const confidenceLevel = result.confidence >= 70 ? 'high' : 
                                result.confidence >= 40 ? 'medium' : 'low';
        
        const confidenceColors = {
          high: { border: window.DESIGN_TOKENS.colors.success, bg: window.DESIGN_TOKENS.colors.successLight, badge: { bg: window.DESIGN_TOKENS.colors.success, text: 'HIGH' } },
          medium: { border: window.DESIGN_TOKENS.colors.warning, bg: window.DESIGN_TOKENS.colors.warningLight, badge: { bg: window.DESIGN_TOKENS.colors.warning, text: 'MED' } },
          low: { border: 'var(--gdi-text-muted)', bg: 'var(--gdi-surface-secondary)', badge: { bg: 'var(--gdi-text-muted)', text: 'LOW' } },
        };
        
        const style = confidenceColors[confidenceLevel];
        
        const card = GDI.createElement('div', {
          styles: {
            padding: '18px',
            background: style.bg,
            border: `2px solid ${style.border}`,
            borderRadius: window.DESIGN_TOKENS.radii.lg,
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
        const headerRow = GDI.createElement('div', {
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px',
          },
        });
        
        headerRow.appendChild(GDI.createElement('div', {
          styles: { display: 'flex', alignItems: 'center', gap: '8px' },
          children: [
            GDI.createBadge(`#${i + 1}`, 'primary'),
            GDI.createBadge(result.confidence >= 70 ? 'HIGH' : result.confidence >= 40 ? 'MED' : 'LOW',
              result.confidence >= 70 ? 'success' : result.confidence >= 40 ? 'warning' : 'info'),
            GDI.createBadge(result.status, result.status === 'Likely' ? 'success' : 'warning'),
          ],
        }));
        
        const visitBtn = GDI.createButton('Visit Page →', () => {
          window.open(result.url, '_blank');
        }, { variant: 'primary', fullWidth: false });
        
        headerRow.appendChild(visitBtn);
        
        card.appendChild(headerRow);
        
        // URL
        card.appendChild(GDI.createElement('div', {
          styles: {
            fontFamily: DT.typography.fontMono,
            fontSize: DT.typography.sizes.base,
            color: window.DESIGN_TOKENS.colors.primary,
            wordBreak: 'break-all',
            marginBottom: '8px',
          },
          text: result.url,
        }));
        
        // Details
        if (result.matchedKeywords?.length > 0) {
          const kwRow = GDI.createElement('div', {
            styles: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' },
          });
          
          result.matchedKeywords.forEach(kw => {
            kwRow.appendChild(GDI.createElement('span', {
              styles: {
                padding: '3px 8px',
                background: 'var(--gdi-surface-tertiary)',
                borderRadius: window.DESIGN_TOKENS.radii.full,
                fontSize: DT.typography.sizes.xs,
                color: 'var(--gdi-text-secondary)',
              },
              text: kw,
            }));
          });
          
          card.appendChild(kwRow);
        }
        
        // Meta info
        const metaRow = GDI.createElement('div', {
          styles: {
            display: 'flex',
            gap: '12px',
            fontSize: DT.typography.sizes.sm,
            color: 'var(--gdi-text-muted)',
            flexWrap: 'wrap',
          },
          children: [
            GDI.createElement('span', { text: `🎯 Confidence: ${result.confidence}%` }),
            result.hasForm ? GDI.createElement('span', { text: '📝 Has Form' }) : null,
            result.emails?.length > 0 ? GDI.createElement('span', { text: '📧 Has Email' }) : null,
            GDI.createElement('span', { text: `📂 ${result.category}` }),
          ].filter(Boolean),
        });
        
        card.appendChild(metaRow);
        
        // Email chips
        if (result.emails?.length > 0) {
          const emailRow = GDI.createElement('div', {
            styles: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
          });
          
          result.emails.forEach(email => {
            const chip = GDI.createElement('span', {
              styles: {
                padding: '4px 10px',
                background: '#DBEAFE',
                color: '#1E40AF',
                borderRadius: window.DESIGN_TOKENS.radii.full,
                fontSize: DT.typography.sizes.xs,
                fontFamily: DT.typography.fontMono,
                cursor: 'pointer',
              },
              text: email,
            });
            
            chip.addEventListener('click', (e) => {
              e.stopPropagation();
              GDI.copyToClipboard(email).then(() => GDI.showNotification('✅ Email copied!', 'success'));
            });
            
            emailRow.appendChild(chip);
          });
          
          card.appendChild(emailRow);
        }
        
        resultsList.appendChild(card);
      });
      
      // Export button
      resultsContainer.appendChild(GDI.createButton('📊 Export Results as CSV', () => {
        let csv = 'Rank,URL,Confidence,Status,Category,Has Form,Emails\n';
        results.forEach((r, i) => {
          csv += `"${i + 1}","${r.url}","${r.confidence}%","${r.status}","${r.category}","${r.hasForm}","${(r.emails || []).join('; ')}"\n`;
        });
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = GDI.createElement('a');
        a.href = url;
        a.download = `guest-posts-${window.location.hostname}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        GDI.showNotification('✅ CSV exported!', 'success');
      }, { variant: 'secondary' }));
    }
  });
}

// ==================== TOOL: CONTACT FORM FILLER ====================

function toolFillContactForm(settings = {}) {
  const content = GDI.createElement('div');
  
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
      .map(h => GDI.cleanText(h.textContent))
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
  content.appendChild(GDI.createToolHeader(
    '📝 Contact Form Filler',
    `Filled ${filledCount} of ${totalFields} fields (${fillPercentage}%)`,
    window.DESIGN_TOKENS.colors.successGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Site', value: siteName, icon: '🌐', color: window.DESIGN_TOKENS.colors.primary },
    { label: 'Fields Filled', value: `${filledCount}/${totalFields}`, icon: '📝', color: window.DESIGN_TOKENS.colors.success },
    { label: 'Success Rate', value: `${fillPercentage}%`, icon: '📊', color: fillPercentage > 50 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.warning },
    { label: 'Content Type', value: siteAnalysis.contentType, icon: '📂', color: window.DESIGN_TOKENS.colors.info },
  ]));
  
  // Preview section
  const previewSection = GDI.createSection('📋 Filled Data Preview', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
      children: Object.entries(formData).map(([key, value]) => {
        const fieldCard = GDI.createElement('div', {
          styles: {
            padding: '14px',
            background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.md,
          },
        });
        
        const keyLabel = GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            fontWeight: DT.typography.weights.bold,
            color: 'var(--gdi-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          },
          text: key === 'subject' ? '📧 Subject' : key === 'message' ? '💬 Message' : `👤 ${key.charAt(0).toUpperCase() + key.slice(1)}`,
        });
        
        const valueText = GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: 'var(--gdi-text-primary)',
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
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: {
          padding: '20px',
          background: window.DESIGN_TOKENS.colors.warningLight,
          borderRadius: window.DESIGN_TOKENS.radii.md,
          textAlign: 'center',
          color: '#92400E',
          fontSize: DT.typography.sizes.base,
        },
        text: '⚠️ No fillable form fields detected on this page. Make sure you\'re on a page with a contact form.',
      }),
    ]));
  } else {
    content.appendChild(GDI.createButton('📤 Find Submit Button', () => {
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
        GDI.showNotification('✅ Submit button highlighted in green!', 'success');
      } else {
        GDI.showNotification('No submit button found. Please review the form manually.', 'warning');
      }
    }, { variant: 'primary' }));
  }
  
  // Tips
  content.appendChild(GDI.createSection('💡 Tips', [
    GDI.createElement('div', {
      styles: { fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.6' },
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
  
  const { close } = GDI.createModal('Contact Form Filler', content, { width: '600px' });
}

// ==================== TOOL: SEARCH OPERATORS ====================

function toolSearchOperators() {
  const content = GDI.createElement('div');
  
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
  content.appendChild(GDI.createToolHeader(
    '🔍 Advanced Search Operators',
    `Build powerful search queries for ${currentSite}`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Search builder
  const searchBuilder = GDI.createSection('🔨 Search Builder', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
  ]);
  
  // Operator select
  const { wrapper: operatorWrapper, input: operatorSelect } = GDI.createInputField({
    label: 'Search Operator',
    id: 'operator-select',
    type: 'text',
    placeholder: 'Select an operator...',
  });
  
  // Replace input with select
  const select = GDI.createElement('select', {
    attrs: { id: 'operator-select' },
    styles: {
      width: '100%',
      padding: '12px 16px',
      border: `1.5px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      fontSize: DT.typography.sizes.md,
      fontFamily: DT.typography.fontFamily,
      outline: 'none',
      background: 'var(--gdi-surface)',
      color: 'var(--gdi-text-primary)',
      cursor: 'pointer',
    },
  });
  
  operatorReference.forEach(op => {
    const option = GDI.createElement('option', {
      attrs: { value: op.operator },
      text: `${op.operator} - ${op.description}`,
    });
    select.appendChild(option);
  });
  
  operatorWrapper.querySelector('input').replaceWith(select);
  
  // Query input
  const { wrapper: queryWrapper, input: queryInput } = GDI.createInputField({
    label: 'Search Query',
    id: 'search-query',
    placeholder: 'e.g., "write for us", guest post guidelines...',
  });
  
  // Preview
  const previewBox = GDI.createElement('div', {
    styles: {
      padding: '14px',
      background: 'var(--gdi-surface-secondary)',
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.md,
      fontFamily: DT.typography.fontMono,
      fontSize: DT.typography.sizes.base,
      color: window.DESIGN_TOKENS.colors.primary,
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
      previewBox.style.color = 'var(--gdi-text-muted)';
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
    previewBox.style.color = window.DESIGN_TOKENS.colors.primary;
  }
  
  select.addEventListener('change', updatePreview);
  queryInput.addEventListener('input', updatePreview);
  
  searchBuilder.querySelector('div').appendChild(operatorWrapper);
  searchBuilder.querySelector('div').appendChild(queryWrapper);
  searchBuilder.querySelector('div').appendChild(previewBox);
  
  // Action buttons
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '10px' },
  });
  
  buttonRow.appendChild(GDI.createButton('🔍 Search Google', () => {
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
  
  buttonRow.appendChild(GDI.createButton('🦆 DuckDuckGo', () => {
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
  const templatesSection = GDI.createSection('📋 Quick Templates', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
  ]);
  
  Object.entries(searchTemplates).forEach(([category, templates]) => {
    const catDiv = GDI.createElement('div');
    
    catDiv.appendChild(GDI.createElement('div', {
      styles: {
        fontSize: DT.typography.sizes.sm,
        fontWeight: DT.typography.weights.bold,
        color: 'var(--gdi-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
      },
      text: category,
    }));
    
    templates.forEach(tmpl => {
      const chip = GDI.createElement('div', {
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`,
          borderRadius: window.DESIGN_TOKENS.radii.md,
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
        chip.style.borderColor = window.DESIGN_TOKENS.colors.primary;
        chip.style.background = window.DESIGN_TOKENS.colors.infoLight;
      });
      
      chip.addEventListener('mouseleave', () => {
        chip.style.borderColor = 'var(--gdi-border)';
        chip.style.background = 'var(--gdi-surface)';
      });
      
      chip.appendChild(GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.base,
          fontWeight: DT.typography.weights.medium,
          color: 'var(--gdi-text-primary)',
        },
        text: tmpl.name,
      }));
      
      chip.appendChild(GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.xs,
          color: 'var(--gdi-text-muted)',
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
  const referenceSection = GDI.createSection('📖 Operator Reference', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
      children: operatorReference.map(op => {
        const row = GDI.createElement('div', {
          styles: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.md,
            gap: '12px',
            cursor: 'pointer',
          },
        });
        
        row.addEventListener('click', () => {
          select.value = op.operator;
          updatePreview();
          queryInput.focus();
        });
        
        row.appendChild(GDI.createElement('span', {
          styles: {
            fontFamily: DT.typography.fontMono,
            fontSize: DT.typography.sizes.base,
            fontWeight: DT.typography.weights.bold,
            color: window.DESIGN_TOKENS.colors.primary,
            minWidth: '100px',
          },
          text: op.operator,
        }));
        
        row.appendChild(GDI.createElement('span', {
          styles: {
            flex: '1',
            fontSize: DT.typography.sizes.base,
            color: 'var(--gdi-text-secondary)',
          },
          text: op.description,
        }));
        
        row.appendChild(GDI.createElement('span', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: 'var(--gdi-text-muted)',
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
  
  const { close } = GDI.createModal('Advanced Search Operators', content, { width: '750px' });
}

// ==================== TOOL: PAYMENT FORM GENERATOR ====================

function toolPaymentForm(type, settings = {}) {
  const content = GDI.createElement('div');
  
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
    'advance': window.DESIGN_TOKENS.colors.primaryGradient,
    'paypal': window.DESIGN_TOKENS.colors.primaryGradient,
    'gcash': window.DESIGN_TOKENS.colors.primaryGradient,
  };
  
  content.appendChild(GDI.createToolHeader(
    `💰 ${titles[type] || 'Payment Request'}`,
    'Fill in the details to generate your email template',
    gradients[type] || window.DESIGN_TOKENS.colors.primaryGradient
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
  const formSection = GDI.createSection('📝 Payment Details', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
    }),
  ]);
  
  fields.forEach(field => {
    const { wrapper, input } = GDI.createInputField({
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
  const previewSection = GDI.createSection('👁️ Email Preview', [
    GDI.createElement('div', {
      attrs: { id: 'email-preview' },
      styles: {
        padding: '16px',
        background: 'var(--gdi-surface-secondary)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        fontFamily: DT.typography.fontFamily,
        fontSize: DT.typography.sizes.base,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        color: 'var(--gdi-text-primary)',
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
    const preview = content.querySelector('#email-preview');
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
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(GDI.createButton('📋 Copy Email', () => {
    const email = generateEmail();
    GDI.copyToClipboard(email).then(() => GDI.showNotification('✅ Email copied to clipboard!', 'success'));
  }, { variant: 'primary' }));
  
  buttonRow.appendChild(GDI.createButton('🔄 Reset Fields', () => {
    Object.values(inputs).forEach(input => {
      input.value = input.defaultValue || '';
    });
    updatePreview();
    GDI.showNotification('Fields reset!', 'info');
  }, { variant: 'secondary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = GDI.createModal(titles[type] || 'Payment Request', content, { width: '600px' });
}

// ==================== TOOL: ARTICLE FORM GENERATOR ====================

function toolArticleForm(type, settings = {}) {
  const content = GDI.createElement('div');
  
  const defaults = {
    yourName: settings.userName || 'Your Name',
  };
  
  const title = type === 'full' ? 'Sending Article (Detailed)' : 'Quick Article';
  
  content.appendChild(GDI.createToolHeader(
    `📤 ${title}`,
    'Generate professional article submission emails',
    window.DESIGN_TOKENS.colors.primaryGradient
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
  const formSection = GDI.createSection('📝 Article Details', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
    }),
  ]);
  
  fields.forEach(field => {
    const { wrapper, input } = GDI.createInputField({
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
  const previewSection = GDI.createSection('👁️ Email Preview', [
    GDI.createElement('div', {
      attrs: { id: 'article-preview' },
      styles: {
        padding: '16px',
        background: 'var(--gdi-surface-secondary)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: 'var(--gdi-text-primary)',
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
    const preview = content.querySelector('#article-preview');
    if (preview) {
      preview.textContent = generateEmail();
    }
  }
  
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  setTimeout(updatePreview, 100);
  
  // Buttons
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(GDI.createButton('📋 Copy Email', () => {
    GDI.copyToClipboard(generateEmail()).then(() => GDI.showNotification('✅ Email copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = GDI.createModal(title, content, { width: '600px' });
}

// ==================== TOOL: FOLLOW-UP GENERATOR ====================

function toolFollowupForm(type, settings = {}) {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    `📞 ${titles[type] || 'Follow-up'}`,
    'Generate follow-up email for article submission',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Website input
  const { wrapper, input } = GDI.createInputField({
    label: 'Website',
    id: 'followup-website',
    placeholder: 'example.com',
    required: true,
  });
  
  content.appendChild(GDI.createSection('📝 Details', [wrapper]));
  
  // Preview
  const previewSection = GDI.createSection('👁️ Message Preview', [
    GDI.createElement('div', {
      attrs: { id: 'followup-preview' },
      styles: {
        padding: '16px',
        background: 'var(--gdi-surface-secondary)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: 'var(--gdi-text-primary)',
        minHeight: '80px',
      },
      text: templates[type].replace('{{website}}', '[Website]'),
    }),
  ]);
  
  content.appendChild(previewSection);
  
  function updatePreview() {
    const website = input.value.trim() || '[Website]';
    content.querySelector('#followup-preview').textContent = templates[type].replace('{{website}}', website);
  }
  
  input.addEventListener('input', updatePreview);
  
  // Copy button
  content.appendChild(GDI.createButton('📋 Copy Message', () => {
    const website = input.value.trim() || '[Website]';
    const message = templates[type].replace('{{website}}', website);
    GDI.copyToClipboard(message).then(() => GDI.showNotification('✅ Message copied!', 'success'));
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal(titles[type] || 'Follow-up', content, { width: '550px' });
}

// ==================== TOOL: OUTREACH TEMPLATES ====================

function toolOutreachTemplates() {
  const content = GDI.createElement('div');
  
  const templates = [
    {
      name: 'Standard Outreach',
      icon: '📧',
      color: window.DESIGN_TOKENS.colors.primary,
      template: `Hi {{webmaster}} team,

I hope you're doing well! I'm reaching out to see if you're accepting guest post contributions on your website.

If so, I'd be happy to share some topic ideas that would be a great fit for your audience.

Looking forward to your response!`,
    },
    {
      name: 'Professional Outreach',
      icon: '💼',
      color: window.DESIGN_TOKENS.colors.info,
      template: `Hi {{webmaster}} team,

I'm reaching out to ask if you currently accept guest contributions on your website. I'd be happy to provide original, well-researched content that aligns with your audience's interests.

If guest submissions are welcome, I'd appreciate it if you could share your guidelines or any requirements for consideration.

Looking forward to hearing from you. Thanks!`,
    },
    {
      name: 'Casual Outreach',
      icon: '👋',
      color: window.DESIGN_TOKENS.colors.success,
      template: `Hey {{webmaster}} team,

Love what you're doing with the site! I was wondering if you accept guest posts? I've got some great ideas I think your readers would really enjoy.

Let me know if you're open to it!`,
    },
  ];
  
  const negoTemplates = [
    {
      name: 'Standard Negotiation',
      icon: '💬',
      color: window.DESIGN_TOKENS.colors.warning,
      template: `Hi,

Thank you for your response.

Unfortunately, I cannot afford your guest posting fee. I only have $50 available per article. I understand this might be below your standard rate, but I'm hoping you could consider it.

Looking forward to your kind response. Thank you!`,
    },
    {
      name: 'Polite Negotiation',
      icon: '🤝',
      color: window.DESIGN_TOKENS.colors.primary,
      template: `Hi,

Thank you for getting back to me.

Due to budget constraints, I'm currently able to offer $50 for this contribution. I completely understand if this doesn't work for you, but I wanted to ask before moving on.

I appreciate your consideration either way!`,
    },
  ];
  
  content.appendChild(GDI.createToolHeader(
    '📧 Outreach & Negotiation Templates',
    'Pre-written templates for guest post outreach and price negotiation'
  ));
  
  // Prompts for webmaster name
  const { wrapper: promptWrapper, input: webmasterInput } = GDI.createInputField({
    label: "Webmaster's Name",
    id: 'webmaster-name',
    placeholder: 'Enter webmaster name (e.g., John)',
    required: false,
    defaultValue: 'Webmaster',
  });
  
  content.appendChild(promptWrapper);
  
  // Outreach templates
  content.appendChild(GDI.createSection('📧 Outreach Templates', [
    GDI.createElement('div', {
      styles: { display: 'grid', gap: '12px' },
      children: templates.map(tmpl => {
        const card = GDI.createElement('div', {
          styles: {
            background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.lg,
            overflow: 'hidden',
          },
        });
        
        // Header
        const header = GDI.createElement('div', {
          styles: {
            padding: '12px 16px',
            background: tmpl.color + '15',
            borderBottom: `1px solid ${'var(--gdi-border)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            GDI.createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.md,
                fontWeight: DT.typography.weights.bold,
                color: 'var(--gdi-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              html: `${tmpl.icon} ${GDI.escapeHtml(tmpl.name)}`,
            }),
            GDI.createButton('Copy', (e) => {
              const name = webmasterInput.value.trim() || 'Webmaster';
              const text = tmpl.template.replace(/\{\{webmaster\}\}/g, name);
              GDI.copyToClipboard(text).then(() => GDI.showNotification('✅ Template copied!', 'success'));
            }, { variant: 'secondary', fullWidth: false, size: 'sm' }),
          ],
        });
        
        // Content
        const body = GDI.createElement('div', {
          styles: {
            padding: '14px 16px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: DT.typography.sizes.base,
            color: 'var(--gdi-text-secondary)',
            background: 'var(--gdi-surface-secondary)',
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
  content.appendChild(GDI.createSection('💬 Negotiation Templates', [
    GDI.createElement('div', {
      styles: { display: 'grid', gap: '12px' },
      children: negoTemplates.map(tmpl => {
        const card = GDI.createElement('div', {
          styles: {
            background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.lg,
            overflow: 'hidden',
          },
        });
        
        const header = GDI.createElement('div', {
          styles: {
            padding: '12px 16px',
            background: tmpl.color + '15',
            borderBottom: `1px solid ${'var(--gdi-border)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          children: [
            GDI.createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.md,
                fontWeight: DT.typography.weights.bold,
                color: 'var(--gdi-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              html: `${tmpl.icon} ${GDI.escapeHtml(tmpl.name)}`,
            }),
            GDI.createButton('Copy', () => {
              GDI.copyToClipboard(tmpl.template).then(() => GDI.showNotification('✅ Template copied!', 'success'));
            }, { variant: 'secondary', fullWidth: false, size: 'sm' }),
          ],
        });
        
        const body = GDI.createElement('div', {
          styles: {
            padding: '14px 16px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: DT.typography.sizes.base,
            color: 'var(--gdi-text-secondary)',
            background: 'var(--gdi-surface-secondary)',
          },
          text: tmpl.template,
        });
        
        card.appendChild(header);
        card.appendChild(body);
        
        return card;
      }),
    }),
  ]));
  
  const { close } = GDI.createModal('Outreach & Negotiation Templates', content, { width: '700px' });
}

// ==================== TOOL: CANCEL FORM ====================

function toolCancelForm(settings = {}) {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '❌ Cancellation Notice',
    'Generate a professional cancellation email',
    window.DESIGN_TOKENS.colors.errorGradient
  ));
  
  const { wrapper: w1, input: websiteInput } = GDI.createInputField({
    label: 'Website',
    id: 'cancel-website',
    placeholder: 'example.com',
    required: true,
  });
  
  const { wrapper: w2, input: reasonInput } = GDI.createInputField({
    label: 'Reason (Optional)',
    id: 'cancel-reason',
    placeholder: 'due to lack of response',
    defaultValue: 'due to lack of response',
  });
  
  content.appendChild(GDI.createSection('📝 Cancellation Details', [w1, w2]));
  
  // Preview
  const previewSection = GDI.createSection('👁️ Email Preview', [
    GDI.createElement('div', {
      attrs: { id: 'cancel-preview' },
      styles: {
        padding: '16px',
        background: 'var(--gdi-surface-secondary)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: 'var(--gdi-text-primary)',
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
    content.querySelector('#cancel-preview').textContent = generateEmail();
  }
  
  websiteInput.addEventListener('input', updatePreview);
  reasonInput.addEventListener('input', updatePreview);
  setTimeout(updatePreview, 100);
  
  content.appendChild(GDI.createButton('📋 Copy Cancellation Email', () => {
    GDI.copyToClipboard(generateEmail()).then(() => GDI.showNotification('✅ Email copied!', 'success'));
  }, { variant: 'danger' }));
  
  const { close } = GDI.createModal('Cancellation Notice', content, { width: '550px' });
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
      nextButton = GDI.$(selector);
      if (nextButton) break;
    } catch (e) {}
  }
  
  if (nextButton) {
    nextButton.click();
    GDI.showNotification('➡️ Navigating to next page...', 'success');
  } else {
    GDI.showNotification('❌ No next page button found', 'error');
  }
}

// ==================== TOOL: DECLINED RESPONSE ====================

function toolDeclinedResponse() {
  const template = `Hi,

Thank you for getting back to me. I really appreciate you taking the time to respond.

I completely understand that you're not currently accepting guest posts or link collaborations. I'm reaching out to a few platforms to share valuable content with new audiences, and I was wondering do you happen to know of any other websites or editors who are open to guest contributions?

Any leads or suggestions would be incredibly helpful and greatly appreciated.

Thanks again for your time.`;
  
  GDI.copyToClipboard(template).then(() => GDI.showNotification('✅ Declined response template copied!', 'success'));
}

// ==================== TOOL: INVOICE FORM ====================

function toolInvoiceForm(settings = {}) {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '📄 Send Invoice',
    'Generate invoice confirmation email',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  const { wrapper: w1, input: webmasterInput } = GDI.createInputField({
    label: "Webmaster's Name",
    id: 'invoice-webmaster',
    placeholder: 'Webmaster Name',
    required: true,
  });
  
  const { wrapper: w2, input: yourNameInput } = GDI.createInputField({
    label: 'Your Name',
    id: 'invoice-yourname',
    placeholder: 'Your Name',
    required: true,
    defaultValue: settings.userName || 'Your Name',
  });
  
  content.appendChild(GDI.createSection('📝 Details', [w1, w2]));
  
  // Preview
  const previewSection = GDI.createSection('👁️ Email Preview', [
    GDI.createElement('div', {
      attrs: { id: 'invoice-preview' },
      styles: {
        padding: '16px',
        background: 'var(--gdi-surface-secondary)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontSize: DT.typography.sizes.base,
        color: 'var(--gdi-text-primary)',
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
    content.querySelector('#invoice-preview').textContent = generateEmail();
  }
  
  webmasterInput.addEventListener('input', updatePreview);
  yourNameInput.addEventListener('input', updatePreview);
  setTimeout(updatePreview, 100);
  
  content.appendChild(GDI.createButton('📋 Copy Email', () => {
    GDI.copyToClipboard(generateEmail()).then(() => GDI.showNotification('✅ Email copied!', 'success'));
  }, { variant: 'success' }));
  
  const { close } = GDI.createModal('Send Invoice', content, { width: '550px' });
}

// ==================== TOOL: BULK URL OPENER ====================

function toolBulkUrlOpener() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '📂 Bulk URL Opener',
    'Paste a list of URLs to open them all at once',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // URL input
  const { wrapper: textareaWrapper, textarea: urlTextarea } = GDI.createTextarea({
    label: 'Enter URLs (one per line)',
    id: 'bulk-urls',
    placeholder: 'example.com\nhttps://google.com\nsearchworks.ph',
    rows: 8,
  });
  
  content.appendChild(GDI.createSection('📝 URL List', [textareaWrapper]));
  
  // URL count
  const urlCount = GDI.createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.sm,
      color: 'var(--gdi-text-muted)',
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
    urlCount.style.color = urls.length > 15 ? window.DESIGN_TOKENS.colors.warning : urls.length > 0 ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-text-muted)';
  });
  
  // Warning for many URLs
  const warningBox = GDI.createElement('div', {
    styles: {
      padding: '12px',
      background: window.DESIGN_TOKENS.colors.warningLight,
      borderRadius: window.DESIGN_TOKENS.radii.md,
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
  content.appendChild(GDI.createButton('🚀 Open All URLs', () => {
    const urls = processUrls(urlTextarea.value);
    
    if (urls.length === 0) {
      GDI.showNotification('❌ Please enter at least one valid URL', 'error');
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
    
    GDI.showNotification(`✅ Opening ${urls.length} URL${urls.length !== 1 ? 's' : ''}...`, 'success');
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal('Bulk URL Opener', content, { width: '600px' });
}

// ==================== TOOL: FULL PAGE CAPTURE ====================

async function toolFullPageCapture() {
  const notification = GDI.showNotification('📸 Capturing full page... Please do not scroll!', 'warning', 10000);
  
  // Give user a moment to read the notification before hiding it
  await new Promise(r => setTimeout(r, 1500));
  
  // Hide the extension UI (Shadow DOM host) so it isn't captured in the screenshot
  const gdiHost = document.getElementById('gdi-seo-tools-host');
  const origGdiOpacity = gdiHost ? gdiHost.style.opacity : '';
  if (gdiHost) gdiHost.style.opacity = '0';
  
  // Save original states
  const originalOverflow = document.body.style.overflow;
  const originalScrollY = window.scrollY;
  const fixedElements = [];
  
  // 1. Hide scrollbars temporarily
  const hideScrollbarStyle = GDI.createElement('style');
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
    const canvas = GDI.createElement('canvas');
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
      const a = GDI.createElement('a');
      a.href = url;
      const cleanTitle = (document.title || 'screenshot').replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
      a.download = `full_page_${cleanTitle}.png`;
      a.click();
      URL.revokeObjectURL(url);
      
      if (notification) notification.dismiss();
      GDI.showNotification('✅ Full page capture saved!', 'success');
    }, 'image/png');

  } catch (error) {
    console.error("Full Page Capture Error:", error);
    if (notification) notification.dismiss();
    GDI.showNotification('❌ Capture failed. The page might be too long.', 'error');
  } finally {
    // 7. Guaranteed Cleanup (Runs even if the code crashes)
    if (gdiHost) gdiHost.style.opacity = origGdiOpacity;
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
  GDI.showNotification('🚀 Opening PageSpeed Insights...', 'success');
}

// ==================== TOOL: ROBOTS.TXT CHECKER ====================

function toolCheckRobotsTxt() {
  const robotsUrl = `${window.location.origin}/robots.txt`;
  window.open(robotsUrl, '_blank');
  GDI.showNotification('🤖 Opening robots.txt...', 'success');
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
  
  GDI.showNotification('🗺️ Searching for sitemap...', 'info', 3000);
  
  // Try robots.txt first
  fetch(`${domain}/robots.txt`)
    .then(response => response.text())
    .then(text => {
      const match = text.match(/Sitemap:\s*(.+)/i);
      if (match) {
        window.open(match[1], '_blank');
        GDI.showNotification('✅ Sitemap found in robots.txt!', 'success');
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
          GDI.showNotification('✅ Sitemap found!', 'success');
        } else {
          GDI.showNotification('❌ No sitemap found', 'error');
        }
      });
    })
    .catch(() => {
      GDI.showNotification('❌ Could not check robots.txt', 'error');
    });
}

// ==================== TOOL: KEYWORD DENSITY ANALYZER ====================

function toolAnalyzeKeywordDensity() {
  const content = GDI.createElement('div');
  
  // Extract content from main areas
  function extractContent() {
    const contentSelectors = [
      'main', 'article', '[role="main"]', '.content', '.post-content',
      '.article-content', '.entry-content', '#content', '.main-content',
    ];
    
    let textContent = '';
    
    for (const selector of contentSelectors) {
      const el = GDI.$(selector);
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
  content.appendChild(GDI.createToolHeader(
    '🔤 Keyword Density Analyzer',
    `${totalAll.toLocaleString()} total words • ${totalMeaningful.toLocaleString()} meaningful words`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Words', value: totalAll.toLocaleString(), icon: '📝', color: window.DESIGN_TOKENS.colors.primary },
    { label: 'Meaningful', value: totalMeaningful.toLocaleString(), icon: '🎯', color: window.DESIGN_TOKENS.colors.info },
    { label: 'Unique Words', value: new Set(meaningfulWords).size.toLocaleString(), icon: '🔤' },
    { label: 'Key Phrases', value: sortedBigrams.length, icon: '📊', color: window.DESIGN_TOKENS.colors.success },
  ]));
  
  // Stuffing warning
  if (stuffedKeywords.length > 0) {
    content.appendChild(GDI.createSection('⚠️ Keyword Stuffing Warning', [
      GDI.createElement('div', {
        styles: {
          padding: '14px',
          background: window.DESIGN_TOKENS.colors.warningLight,
          border: `1px solid ${window.DESIGN_TOKENS.colors.warning}30`,
          borderRadius: window.DESIGN_TOKENS.radii.md,
          fontSize: DT.typography.sizes.base,
          color: '#92400E',
        },
        html: `Potential keyword stuffing detected for: <strong>${stuffedKeywords.map(w => w[0]).join(', ')}</strong>. Consider reducing frequency.`,
      }),
    ]));
  }
  
  // Tabs
  const tabBar = GDI.createElement('div', {
    styles: {
      display: 'flex',
      gap: '4px',
      marginBottom: '16px',
      background: 'var(--gdi-surface-tertiary)',
      padding: '4px',
      borderRadius: window.DESIGN_TOKENS.radii.md,
    },
  });
  
  const tabs = [
    { id: 'single', label: 'Single Words' },
    { id: 'bigrams', label: '2-Word Phrases' },
    { id: 'trigrams', label: '3-Word Phrases' },
  ];
  
  let activeTab = 'single';
  
  tabs.forEach(tab => {
    const btn = GDI.createElement('button', {
      styles: {
        flex: '1',
        padding: '10px 16px',
        border: 'none',
        borderRadius: window.DESIGN_TOKENS.radii.sm,
        background: tab.id === activeTab ? 'var(--gdi-surface)' : 'transparent',
        color: tab.id === activeTab ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-text-secondary)',
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
        b.style.color = 'var(--gdi-text-secondary)';
      });
      btn.style.background = 'var(--gdi-surface)';
      btn.style.color = window.DESIGN_TOKENS.colors.primary;
      showTabContent(tab.id);
    });
    
    tabBar.appendChild(btn);
  });
  
  content.appendChild(tabBar);
  
  // Tab contents
  const tabContents = GDI.createElement('div', {
    styles: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.lg,
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
    
    const table = GDI.createElement('table', {
      styles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: DT.typography.sizes.base,
      },
    });
    
    // Header
    const thead = GDI.createElement('thead');
    const headerRow = GDI.createElement('tr', {
      styles: {
        background: 'var(--gdi-surface-secondary)',
        position: 'sticky',
        top: '0',
        zIndex: '1',
      },
    });
    
    ['#', 'Keyword/Phrase', 'Count', 'Density', 'Distribution'].forEach(label => {
      const th = GDI.createElement('th', {
        styles: {
          padding: '10px 12px',
          textAlign: 'left',
          fontWeight: DT.typography.weights.semibold,
          color: 'var(--gdi-text-primary)',
          borderBottom: `2px solid ${'var(--gdi-border)'}`,
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
    const tbody = GDI.createElement('tbody');
    
    data.forEach(([word, count], index) => {
      const density = (count / totalMeaningful * 100);
      const densityColor = density > 5 ? window.DESIGN_TOKENS.colors.error :
                          density > 2 ? window.DESIGN_TOKENS.colors.warning :
                          window.DESIGN_TOKENS.colors.success;
      const barWidth = Math.min(density * 15, 100);
      
      const row = GDI.createElement('tr', {
        styles: {
          borderBottom: `1px solid ${'var(--gdi-border-light)'}`,
          transition: `background ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--gdi-surface-secondary)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      
      // Rank
      const rankCell = GDI.createElement('td', {
        styles: { padding: '10px 12px', color: 'var(--gdi-text-muted)', fontSize: DT.typography.sizes.sm },
        text: String(index + 1),
      });
      
      // Keyword
      const keywordCell = GDI.createElement('td', {
        styles: { padding: '10px 12px', fontWeight: DT.typography.weights.semibold, color: 'var(--gdi-text-primary)' },
        text: word,
      });
      
      // Count
      const countCell = GDI.createElement('td', {
        styles: { padding: '10px 12px', textAlign: 'center', fontWeight: DT.typography.weights.bold },
        text: String(count),
      });
      
      // Density
      const densityCell = GDI.createElement('td', {
        styles: { padding: '10px 12px', color: densityColor, fontWeight: DT.typography.weights.semibold },
        text: `${density.toFixed(2)}%`,
      });
      
      // Distribution bar
      const distCell = GDI.createElement('td', {
        styles: { padding: '10px 12px' },
        children: [
          GDI.createElement('div', {
            styles: {
              height: '6px',
              background: 'var(--gdi-surface-tertiary)',
              borderRadius: window.DESIGN_TOKENS.radii.full,
              overflow: 'hidden',
            },
            children: [
              GDI.createElement('div', {
                styles: {
                  width: `${barWidth}%`,
                  height: '100%',
                  background: densityColor,
                  borderRadius: window.DESIGN_TOKENS.radii.full,
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
  const buttonRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '10px', marginTop: '16px' },
  });
  
  buttonRow.appendChild(GDI.createButton('📊 Export CSV', () => {
    let csv = 'Rank,Keyword,Count,Density\n';
    sortedWords.forEach(([word, count], i) => {
      csv += `${i + 1},"${word}",${count},${((count / totalMeaningful) * 100).toFixed(2)}%\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = `keyword-density-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    GDI.showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  buttonRow.appendChild(GDI.createButton('📋 Copy Report', () => {
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
    
    GDI.copyToClipboard(report).then(() => GDI.showNotification('✅ Report copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(buttonRow);
  
  const { close } = GDI.createModal('Keyword Density Analyzer', content, { width: '750px' });
}

// ==================== TOOL: SERP PREVIEW ====================

function toolShowSerpPreview() {
  const content = GDI.createElement('div');
  
  const currentTitle = document.title || '';
  const metaDescTag = document.querySelector('meta[name="description"]');
  const currentDesc = metaDescTag?.getAttribute('content') || '';
  const currentUrl = window.location.href;
  
  content.appendChild(GDI.createToolHeader(
    '👁️ SERP Preview',
    'See how your page appears in Google search results'
  ));
  
  // Title input
  const { wrapper: titleWrapper, input: titleInput } = GDI.createInputField({
    label: '📝 Page Title (50-60 chars optimal)',
    id: 'serp-title',
    placeholder: 'Enter page title...',
    defaultValue: currentTitle,
  });
  
  const titleCount = GDI.createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: 'var(--gdi-text-muted)',
      textAlign: 'right',
      marginTop: '4px',
    },
    text: `${currentTitle.length} characters`,
  });
  titleWrapper.appendChild(titleCount);
  
  // Description input
  const { wrapper: descWrapper, textarea: descTextarea } = GDI.createTextarea({
    label: '📄 Meta Description (150-160 chars optimal)',
    id: 'serp-desc',
    placeholder: 'Enter meta description...',
    rows: 3,
  });
  descTextarea.value = currentDesc;
  
  const descCount = GDI.createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.xs,
      color: 'var(--gdi-text-muted)',
      textAlign: 'right',
      marginTop: '4px',
    },
    text: `${currentDesc.length} characters`,
  });
  descWrapper.appendChild(descCount);
  
  // Preview section
  const previewLabel = GDI.createElement('div', {
    styles: {
      fontSize: DT.typography.sizes.sm,
      fontWeight: DT.typography.weights.bold,
      color: 'var(--gdi-text-secondary)',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    text: '🔍 Google Search Preview',
  });
  
  const previewCard = GDI.createElement('div', {
    styles: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
    },
  });
  
  // URL display
  previewCard.appendChild(GDI.createElement('div', {
    styles: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
    },
    children: [
      GDI.createElement('div', {
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
      GDI.createElement('div', {
        styles: { fontSize: '12px', color: '#4D5156' },
        html: `${GDI.escapeHtml(window.location.hostname)}<span style="color:#70757A;"> › </span>`,
      }),
    ],
  }));
  
  // Title preview
  const previewTitle = GDI.createElement('div', {
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
  const previewDesc = GDI.createElement('div', {
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
  const previewSection = GDI.createSection('', [previewLabel, previewCard]);
  
  content.appendChild(GDI.createSection('🎨 Edit Meta Tags', [titleWrapper, descWrapper]));
  content.appendChild(previewSection);
  
  // Live update
  function updatePreview() {
    const title = titleInput.value;
    const desc = descTextarea.value;
    
    // Update counts
    titleCount.textContent = `${title.length} characters`;
    titleCount.style.color = title.length >= 50 && title.length <= 60 ? window.DESIGN_TOKENS.colors.success :
                              title.length < 30 || title.length > 65 ? window.DESIGN_TOKENS.colors.error :
                              window.DESIGN_TOKENS.colors.warning;
    
    descCount.textContent = `${desc.length} characters`;
    descCount.style.color = desc.length >= 150 && desc.length <= 160 ? window.DESIGN_TOKENS.colors.success :
                             desc.length < 120 || desc.length > 170 ? window.DESIGN_TOKENS.colors.error :
                             window.DESIGN_TOKENS.colors.warning;
    
    // Truncate for realistic preview
    previewTitle.textContent = title.length > 65 ? title.substring(0, 62) + '...' : (title || 'Your Page Title');
    previewDesc.textContent = desc.length > 160 ? desc.substring(0, 157) + '...' : (desc || 'Your meta description will appear here.');
  }
  
  titleInput.addEventListener('input', updatePreview);
  descTextarea.addEventListener('input', updatePreview);
  
  // Copy optimized
  content.appendChild(GDI.createButton('📋 Copy Optimized Tags', () => {
    const title = titleInput.value;
    const desc = descTextarea.value;
    const text = `Title: ${title}\nDescription: ${desc}`;
    GDI.copyToClipboard(text).then(() => GDI.showNotification('✅ Meta tags copied!', 'success'));
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal('SERP Preview', content, { width: '600px' });
}

// ==================== TOOL: IMAGE ALT TEXT ANALYZER ====================

function toolAnalyzeImages() {
  const content = GDI.createElement('div');
  
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
  content.appendChild(GDI.createToolHeader(
    '🖼️ Image Alt Text Analysis',
    `${results.total} images found • ${results.withoutAlt + results.emptyAlt} need attention`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));
  
  // Score
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(accessibilityScore, 90));
  
  const scoreLabel = GDI.createElement('div', {
    styles: {
      textAlign: 'center',
      fontSize: DT.typography.sizes.sm,
      color: 'var(--gdi-text-muted)',
      marginTop: '-10px',
      marginBottom: '16px',
    },
    text: 'Accessibility Score',
  });
  
  content.appendChild(scoreRow);
  content.appendChild(scoreLabel);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Total Images', value: results.total, icon: '🖼️', color: window.DESIGN_TOKENS.colors.primary },
    { label: 'With Alt Text', value: results.withAlt, icon: '✅', color: window.DESIGN_TOKENS.colors.success },
    { label: 'Missing Alt', value: results.withoutAlt, icon: '❌', color: window.DESIGN_TOKENS.colors.error },
    { label: 'Empty Alt', value: results.emptyAlt, icon: '⚠️', color: window.DESIGN_TOKENS.colors.warning },
    { label: 'Lazy Loaded', value: results.withLazy, icon: '⚡', color: window.DESIGN_TOKENS.colors.info },
    { label: 'No Dimensions', value: results.missingDimensions, icon: '📏', color: window.DESIGN_TOKENS.colors.warning },
  ]));
  
  // Issues list
  if (results.withoutAlt + results.emptyAlt > 0) {
    const issuesSection = GDI.createSection('⚠️ Images Needing Attention', [
      GDI.createElement('div', {
        styles: {
          maxHeight: '300px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        },
        children: results.details
          .filter(d => !d.hasAlt)
          .map(d => GDI.createElement('div', {
            styles: {
              padding: '10px 14px',
              background: results.withoutAlt > 0 && d.alt === null ? window.DESIGN_TOKENS.colors.errorLight : window.DESIGN_TOKENS.colors.warningLight,
              borderLeft: `3px solid ${d.alt === null ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.warning}`,
              borderRadius: window.DESIGN_TOKENS.radii.md,
              fontSize: DT.typography.sizes.sm,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            children: [
              GDI.createElement('span', {
                styles: {
                  fontWeight: DT.typography.weights.bold,
                  color: 'var(--gdi-text-secondary)',
                  minWidth: '30px',
                },
                text: `#${d.index}`,
              }),
              GDI.createElement('span', {
                styles: {
                  flex: '1',
                  fontFamily: DT.typography.fontMono,
                  fontSize: DT.typography.sizes.xs,
                  color: 'var(--gdi-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                text: d.src || 'Unknown source',
              }),
              GDI.createBadge(
                d.alt === null ? 'Missing' : 'Empty',
                d.alt === null ? 'error' : 'warning'
              ),
            ],
          })),
      }),
    ]);
    
    content.appendChild(issuesSection);
  } else if (results.total > 0) {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: {
          padding: '20px',
          background: window.DESIGN_TOKENS.colors.successLight,
          borderRadius: window.DESIGN_TOKENS.radii.md,
          textAlign: 'center',
          color: '#166534',
          fontWeight: DT.typography.weights.semibold,
        },
        text: '✅ All images have proper alt text! Great job!',
      }),
    ]));
  }
  
  // Recommendations
  content.appendChild(GDI.createSection('💡 Recommendations', [
    GDI.createElement('ul', {
      styles: {
        margin: '0',
        paddingLeft: '20px',
        fontSize: DT.typography.sizes.base,
        color: 'var(--gdi-text-secondary)',
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
  
  const { close } = GDI.createModal('Image Alt Text Analysis', content, { width: '650px' });
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
    GDI.showNotification('No valid links found to check.', 'warning');
    return;
  }
  
  // Create status overlay
  const statusDiv = GDI.createElement('div', {
    styles: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100000',
      background: 'var(--gdi-surface)',
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      padding: '20px',
      minWidth: '300px',
      boxShadow: DT.shadows['2xl'],
      fontFamily: DT.typography.fontFamily,
    },
  });
  
  statusDiv.innerHTML = `
    <div style="font-size: ${DT.typography.sizes.md}; font-weight: ${DT.typography.weights.bold}; margin-bottom: 12px; color: ${'var(--gdi-text-primary)'};">
      🚨 Broken Link Checker
    </div>
    <div id="bl-status" style="font-size: ${DT.typography.sizes.base}; color: ${'var(--gdi-text-secondary)'}; margin-bottom: 12px;">
      Scanning ${links.length} links...
    </div>
    <div style="background: ${'var(--gdi-surface-tertiary)'}; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
      <div id="bl-progress" style="height: 100%; width: 0%; background: ${window.DESIGN_TOKENS.colors.primaryGradient}; border-radius: 4px; transition: width 0.3s;"></div>
    </div>
    <div id="bl-count" style="font-size: ${DT.typography.sizes.sm}; color: ${'var(--gdi-text-muted)'};"></div>
    <button id="bl-close" style="margin-top: 12px; padding: 6px 12px; background: ${'var(--gdi-surface-tertiary)'}; border: 1px solid ${'var(--gdi-border)'}; border-radius: 6px; cursor: pointer; font-size: 12px; color: ${'var(--gdi-text-secondary)'};">Close</button>
  `;
  
  statusDiv.classList.add('gdi-pointer-auto'); // Ensures it remains clickable
  GDI.ShadowRoot.appendChild(statusDiv);
  
  const updateStatus = (checked, total, broken) => {
    const progress = Math.round((checked / total) * 100);
    GDI.$('#bl-status').textContent = `Scanning: ${checked}/${total} links...`;
    GDI.$('#bl-progress').style.width = `${progress}%`;
    GDI.$('#bl-count').innerHTML = `Issues found: <strong style="color: ${broken > 0 ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.success}">${broken}</strong>`;
  };
  
  GDI.$('#bl-close').addEventListener('click', () => {
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
          text: GDI.cleanText(link.textContent).substring(0, 100) || '[No Anchor Text]',
          status: `HTTP ${response.status}`,
        });
      }
    } catch (e) {
      link.style.border = '2px solid #F59E0B';
      link.style.backgroundColor = '#FEF3C7';
      brokenLinks.push({
        url: link.href,
        text: GDI.cleanText(link.textContent).substring(0, 100) || '[No Anchor Text]',
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
    const exportBtn = GDI.createElement('button', {
      styles: {
        width: '100%',
        marginTop: '12px',
        padding: '10px',
        background: window.DESIGN_TOKENS.colors.primary,
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
      const a = GDI.createElement('a');
      a.href = url;
      a.download = `broken-links-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      GDI.showNotification('✅ CSV exported!', 'success');
    });
    
    statusDiv.appendChild(exportBtn);
  }
  
  GDI.showNotification(
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
    GDI.showNotification('Please run this on a Google search results page', 'error');
    return;
  }
  
  // Track BOTH domains and exact URLs
  const extractedDomains = new Set();
  const extractedUrls = new Set();
  
  const excludedExtensions = ['.edu', '.gov', '.edu.ph', '.gov.ph', '.wordpress.com', '.blogspot.com'];
  const excludedKeywords = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'pinterest.com', 'reddit.com', 'quora.com', 'medium.com',
    'wikipedia.org', 'amazon.com', 'ebay.com', 'yep.com', 'apple.com', 'microsoft.com',
    'github.com', 'stackoverflow.com',
  ];
  
  const maxPages = 50;
  const baseUrl = window.location.href.split('&start=')[0].split('#')[0];
  let extractionCancelled = false;
  
  // Status overlay
  const statusDiv = GDI.createElement('div', {
    styles: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100000',
      background: GDI.ThemeEngine.token('colors.surface'),
      border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
      borderRadius: GDI.DESIGN_TOKENS.radii.lg,
      padding: '20px',
      minWidth: '320px',
      boxShadow: GDI.ThemeEngine.isDark() ? GDI.DESIGN_TOKENS.shadows.dark['2xl'] : GDI.DESIGN_TOKENS.shadows['2xl'],
      fontFamily: GDI.DESIGN_TOKENS.typography.fontFamily,
      borderLeft: `4px solid ${GDI.ThemeEngine.token('colors.primary')}`,
    },
  });
  
  statusDiv.innerHTML = `
    <div style="font-weight: ${GDI.DESIGN_TOKENS.typography.weights.bold}; margin-bottom: 8px; font-size: ${GDI.DESIGN_TOKENS.typography.sizes.md}; color: ${GDI.ThemeEngine.token('colors.textPrimary')};">
      🌐 Deep Domain & URL Extractor
    </div>
    <div id="dde-status" style="font-size: ${GDI.DESIGN_TOKENS.typography.sizes.base}; color: ${GDI.ThemeEngine.token('colors.textSecondary')}; margin-bottom: 12px;">
      Starting extraction...
    </div>
    <div style="background: ${GDI.ThemeEngine.token('colors.surfaceTertiary')}; border-radius: 4px; height: 6px; overflow: hidden; margin-bottom: 8px;">
      <div id="dde-progress" style="height: 100%; width: 0%; background: ${GDI.ThemeEngine.token('colors.primaryGradient')}; border-radius: 4px; transition: width 0.3s;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: ${GDI.DESIGN_TOKENS.typography.sizes.sm}; color: ${GDI.ThemeEngine.token('colors.textMuted')}; margin-bottom: 12px;">
      <span>Domains: <strong id="dde-count">0</strong></span>
      <span>URLs: <strong id="dde-url-count">0</strong></span>
      <span>Pages: <strong id="dde-pages">0</strong></span>
    </div>
    <button id="dde-cancel" style="width: 100%; padding: 8px; background: ${GDI.ThemeEngine.token('colors.error')}; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: ${GDI.DESIGN_TOKENS.typography.weights.bold}; font-size: ${GDI.DESIGN_TOKENS.typography.sizes.sm};">Cancel Extraction</button>
  `;
  
  statusDiv.classList.add('gdi-pointer-auto');
  GDI.ShadowRoot.appendChild(statusDiv);
  
  function updateStatus(message, progress, domains, urls, pages) {
    const status = statusDiv.querySelector('#dde-status');
    const progressBar = statusDiv.querySelector('#dde-progress');
    const count = statusDiv.querySelector('#dde-count');
    const urlCount = statusDiv.querySelector('#dde-url-count');
    const pageCount = statusDiv.querySelector('#dde-pages');
    
    if (status) status.textContent = message;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
    if (count) count.textContent = String(domains);
    if (urlCount) urlCount.textContent = String(urls);
    if (pageCount) pageCount.textContent = String(pages);
  }
  
  statusDiv.querySelector('#dde-cancel').addEventListener('click', () => {
    extractionCancelled = true;
    statusDiv.remove();
    GDI.showNotification('Extraction cancelled.', 'warning');
    if (extractedUrls.size > 0) showResults();
  });
  
  function extractDomainsFromHtml(html, pageNum) {
    const tempDiv = GDI.createElement('div');
    tempDiv.innerHTML = html;
    const anchors = tempDiv.querySelectorAll('a[href]');
    let newItemsFound = 0;
    
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href) {
        try {
          let finalUrl = null;
          if (href.startsWith('/url?')) {
            const params = new URLSearchParams(href.substring(5));
            finalUrl = params.get('q') || params.get('url');
          } else if (href.startsWith('http') && !href.includes('google.com/search') && !href.includes('googleusercontent.com')) {
            finalUrl = href;
          }
          
          if (finalUrl) {
            const url = new URL(finalUrl);
            const domain = url.hostname.replace(/^www\./, '').toLowerCase();
            
            let isExcluded = false;
            if (excludedExtensions.some(ext => domain.endsWith(ext))) isExcluded = true;
            if (excludedKeywords.some(kw => domain.includes(kw))) isExcluded = true;
            
            if (!isExcluded && domain && domain.includes('.')) {
              if (!extractedDomains.has(domain)) {
                extractedDomains.add(domain);
              }
              
              // Clean tracking hashes out of the URL
              const cleanUrl = finalUrl.split('#')[0];
              if (!extractedUrls.has(cleanUrl)) {
                extractedUrls.add(cleanUrl);
                newItemsFound++;
              }
            }
          }
        } catch (e) {}
      }
    });
    
    return newItemsFound;
  }
  
  async function fetchPage(pageNum) {
    if (extractionCancelled) return;
    
    const startNum = pageNum * 10;
    const url = baseUrl + '&start=' + startNum;
    
    updateStatus(`Fetching page ${pageNum + 1}/${maxPages}...`, 
      Math.round((pageNum / maxPages) * 100), extractedDomains.size, extractedUrls.size, pageNum + 1);
    
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': navigator.userAgent },
      });
      
      if (!response.ok) throw new Error('HTTP ' + response.status);
      
      const html = await response.text();
      extractDomainsFromHtml(html, pageNum);
      
      const hasNext = html.includes('Next</span>') || html.includes('id="pnnext"');
      const hasResults = !html.includes('did not match any documents');
      
      if (hasNext && hasResults && pageNum < maxPages - 1) {
        setTimeout(() => fetchPage(pageNum + 1), Math.random() * 800 + 400);
      } else {
        updateStatus('Complete!', 100, extractedDomains.size, extractedUrls.size, pageNum + 1);
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
    if (extractedUrls.size === 0) {
      GDI.showNotification('No unique domains or URLs found.', 'error');
      return;
    }
    
    const sortedDomains = Array.from(extractedDomains).sort();
    const sortedUrls = Array.from(extractedUrls).sort();
    let viewMode = 'urls'; // Default to URLs since it's more useful!
    
    // Create the container for the modal
    const content = GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', height: '75vh' }
    });

    // Add Header
    content.appendChild(GDI.createToolHeader(
      '🌐 Deep Google Extraction',
      `Successfully extracted ${sortedUrls.length} URLs across ${sortedDomains.length} domains`,
      window.DESIGN_TOKENS.colors.primaryGradient
    ));

    // View Toggles
    const viewToggle = GDI.createElement('div', {
      styles: { display: 'flex', gap: '8px', marginBottom: '16px' }
    });
    
    const btnUrls = GDI.createButton(`Full URLs (${sortedUrls.length})`, () => switchView('urls'), { variant: 'primary', fullWidth: false });
    const btnDomains = GDI.createButton(`Domains Only (${sortedDomains.length})`, () => switchView('domains'), { variant: 'secondary', fullWidth: false });
    
    viewToggle.appendChild(btnUrls);
    viewToggle.appendChild(btnDomains);
    content.appendChild(viewToggle);

    // Action Buttons Row
    const actionRow = GDI.createElement('div', { 
      styles: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' } 
    });

    const copyBtn = GDI.createButton('📋 Copy List', () => {
      const listToCopy = viewMode === 'urls' ? sortedUrls : sortedDomains;
      GDI.copyToClipboard(listToCopy.join('\n')).then(() => {
        GDI.showNotification('✅ Copied!', 'success');
      });
    }, { variant: 'secondary', fullWidth: false });

    const exportBtn = GDI.createButton('📊 Export CSV', () => {
      const listToExport = viewMode === 'urls' ? sortedUrls : sortedDomains;
      const headerText = viewMode === 'urls' ? 'URL' : 'Domain';
      
      const csv = headerText + '\n' + listToExport.map(d => `"${d}"`).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = url;
      a.download = `google-${viewMode}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      GDI.showNotification('✅ CSV exported!', 'success');
    }, { variant: 'success', fullWidth: false });

    actionRow.appendChild(copyBtn);
    actionRow.appendChild(exportBtn);
    content.appendChild(actionRow);

    // Textarea to display the data
    const resultList = GDI.createElement('textarea', {
      attrs: { readonly: true, wrap: 'off' }, // wrap: 'off' is great for keeping URLs on one line
      styles: {
        flex: '1', width: '100%', padding: '16px',
        borderRadius: GDI.DESIGN_TOKENS.radii.md,
        border: `1px solid ${GDI.ThemeEngine.token('colors.border')}`,
        fontFamily: GDI.DESIGN_TOKENS.typography.fontMono,
        fontSize: '12px', resize: 'none', outline: 'none',
        background: GDI.ThemeEngine.token('colors.surfaceSecondary'),
        color: GDI.ThemeEngine.token('colors.textPrimary'),
        whiteSpace: 'pre'
      },
      text: sortedUrls.join('\n')
    });
    
    content.appendChild(resultList);

    // Toggle Logic
    function switchView(mode) {
      viewMode = mode;
      
      btnUrls.style.background = mode === 'urls' ? GDI.ThemeEngine.token('colors.primaryGradient') : GDI.ThemeEngine.token('colors.surfaceTertiary');
      btnUrls.style.color = mode === 'urls' ? '#FFFFFF' : GDI.ThemeEngine.token('colors.textPrimary');
      btnUrls.style.border = mode === 'urls' ? 'none' : `1px solid ${GDI.ThemeEngine.token('colors.border')}`;

      btnDomains.style.background = mode === 'domains' ? GDI.ThemeEngine.token('colors.primaryGradient') : GDI.ThemeEngine.token('colors.surfaceTertiary');
      btnDomains.style.color = mode === 'domains' ? '#FFFFFF' : GDI.ThemeEngine.token('colors.textPrimary');
      btnDomains.style.border = mode === 'domains' ? 'none' : `1px solid ${GDI.ThemeEngine.token('colors.border')}`;
      
      resultList.value = (mode === 'urls' ? sortedUrls : sortedDomains).join('\n');
    }

    // Display it using the built-in modal system
    GDI.createModal('Extraction Results', content, { width: '850px', maxWidth: '95vw' });
    GDI.showNotification(`✅ Extraction complete!`, 'success');
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
  
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '📈 SEO Metrics',
    `Open third-party tools for domain: ${domain}`
  ));
  
  content.appendChild(GDI.createSection('🔗 Available Tools', [
    GDI.createElement('div', {
      styles: { display: 'grid', gap: '10px' },
      children: metricsUrls.map(metric => {
        const card = GDI.createElement('div', {
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.md,
            cursor: 'pointer',
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('click', () => window.open(metric.url, '_blank'));
        
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
          card.style.transform = 'translateX(4px)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = 'var(--gdi-border)';
          card.style.transform = 'translateX(0)';
        });
        
        card.appendChild(GDI.createElement('span', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.semibold,
            color: 'var(--gdi-text-primary)',
          },
          text: metric.name,
        }));
        
        card.appendChild(GDI.createElement('span', {
          styles: { color: window.DESIGN_TOKENS.colors.primary },
          text: 'Open →',
        }));
        
        return card;
      }),
    }),
  ]));
  
  content.appendChild(GDI.createButton('🚀 Open All Tools', () => {
    metricsUrls.forEach((metric, i) => {
      setTimeout(() => window.open(metric.url, '_blank'), i * 150);
    });
    GDI.showNotification('Opening all metrics tools...', 'success');
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal('SEO Metrics', content, { width: '500px' });
}

// ==================== TOOL: INTERNAL VS EXTERNAL LINKS ====================

function toolAnalyzeLinks() {
  const content = GDI.createElement('div');
  
  const currentDomain = window.location.hostname;
  const links = $GDI.$$('a[href]');
  
  let internalCount = 0, externalCount = 0;
  const internalLinks = [], externalLinks = [];
  
  links.forEach(link => {
    try {
      const url = new URL(link.href, window.location.origin);
      const text = GDI.cleanText(link.textContent).substring(0, 50);
      
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
  
  content.appendChild(GDI.createToolHeader(
    '🔗 Link Analysis',
    `${totalLinks} total links • ${internalCount} internal • ${externalCount} external`
  ));
  
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: totalLinks, icon: '🔗' },
    { label: 'Internal', value: internalCount, icon: '🏠', color: window.DESIGN_TOKENS.colors.success },
    { label: 'External', value: externalCount, icon: '🌐', color: window.DESIGN_TOKENS.colors.info },
    { label: 'Ratio', value: `${internalCount}:${externalCount}`, icon: '📊' },
  ]));
  
  // Internal links section
  if (internalLinks.length > 0) {
    const internalSection = GDI.createSection('🏠 Internal Links', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' },
        children: internalLinks.slice(0, 15).map((link, i) => 
          GDI.createElement('div', {
            styles: {
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: 'var(--gdi-surface-secondary)',
              borderRadius: window.DESIGN_TOKENS.radii.md, fontSize: DT.typography.sizes.sm,
            },
            children: [
              GDI.createElement('span', { styles: { color: 'var(--gdi-text-muted)', minWidth: '24px' }, text: String(i + 1) }),
              GDI.createElement('span', { 
                styles: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: window.DESIGN_TOKENS.colors.primary, fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
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
    const externalSection = GDI.createSection('🌐 External Links', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' },
        children: externalLinks.slice(0, 15).map((link, i) =>
          GDI.createElement('div', {
            styles: {
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: 'var(--gdi-surface-secondary)',
              borderRadius: window.DESIGN_TOKENS.radii.md, fontSize: DT.typography.sizes.sm,
            },
            children: [
              GDI.createElement('span', { styles: { color: 'var(--gdi-text-muted)', minWidth: '24px' }, text: String(i + 1) }),
              GDI.createElement('span', {
                styles: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: window.DESIGN_TOKENS.colors.info, fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
                text: link.url.length > 60 ? link.url.substring(0, 57) + '...' : link.url
              }),
            ],
          })
        ),
      }),
    ]);
    content.appendChild(externalSection);
  }
  
  const { close } = GDI.createModal('Link Analysis', content, { width: '650px' });
}

// ==================== TOOL: CURRENCY SYMBOL COPIER ====================

function toolCurrencyCopier() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '💰 Currency Symbol Copier',
    'Click any currency to copy its symbol to clipboard'
  ));
  
  const grid = GDI.createElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: '10px',
    },
    children: currencies.map(curr => {
      const card = GDI.createElement('div', {
        styles: {
          padding: '16px',
          background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`,
          borderRadius: window.DESIGN_TOKENS.radii.lg,
          textAlign: 'center',
          cursor: 'pointer',
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      card.addEventListener('click', () => {
        GDI.copyToClipboard(curr.symbol).then(() => 
          GDI.showNotification(`✅ Copied ${curr.symbol} (${curr.code})!`, 'success')
        );
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
        card.style.boxShadow = DT.shadows.md;
        card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
        card.style.borderColor = 'var(--gdi-border)';
      });
      
      card.appendChild(GDI.createElement('div', {
        styles: { fontSize: '28px', marginBottom: '8px' },
        text: curr.flag,
      }));
      
      card.appendChild(GDI.createElement('div', {
        styles: {
          fontSize: '24px',
          fontWeight: DT.typography.weights.extrabold,
          color: 'var(--gdi-text-primary)',
          marginBottom: '4px',
        },
        text: curr.symbol,
      }));
      
      card.appendChild(GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.sm,
          fontWeight: DT.typography.weights.bold,
          color: window.DESIGN_TOKENS.colors.primary,
        },
        text: curr.code,
      }));
      
      card.appendChild(GDI.createElement('div', {
        styles: {
          fontSize: DT.typography.sizes.xs,
          color: 'var(--gdi-text-muted)',
          marginTop: '2px',
        },
        text: curr.name,
      }));
      
      return card;
    }),
  });
  
  content.appendChild(GDI.createSection('💱 Available Currencies', [grid]));
  
  const { close } = GDI.createModal('Currency Symbol Copier', content, { width: '600px' });
}

// ==================== TOOL: URL OPTIMIZER ====================

function toolOptimizeUrl() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '🔗 URL Optimizer',
    'Analyze and optimize your URL structure for SEO'
  ));
  
  // Current vs Optimized
  const comparisonSection = GDI.createSection('📊 URL Comparison', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '12px' } }),
  ]);
  
  const currentCard = GDI.createElement('div', {
    styles: {
      padding: '16px', background: 'var(--gdi-surface-secondary)',
      border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
    },
    children: [
      GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, fontWeight: DT.typography.weights.bold, color: 'var(--gdi-text-muted)', textTransform: 'uppercase', marginBottom: '6px' },
        text: 'Current URL',
      }),
      GDI.createElement('div', {
        styles: { fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.sm, color: 'var(--gdi-text-secondary)', wordBreak: 'break-all' },
        text: currentUrl,
      }),
      GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, color: currentUrl.length > 75 ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.success, marginTop: '4px' },
        text: `${currentUrl.length} characters ${currentUrl.length > 75 ? '⚠️ Too long' : '✅ Good'}`,
      }),
    ],
  });
  
  const optimizedCard = GDI.createElement('div', {
    styles: {
      padding: '16px', background: window.DESIGN_TOKENS.colors.successLight,
      border: `2px solid ${window.DESIGN_TOKENS.colors.success}`, borderRadius: window.DESIGN_TOKENS.radii.md,
    },
    children: [
      GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes.xs, fontWeight: DT.typography.weights.bold, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' },
        text: '✨ Optimized URL',
      }),
      GDI.createElement('div', {
        styles: { fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.sm, color: '#166534', wordBreak: 'break-all' },
        text: optimizedUrl,
      }),
      GDI.createElement('div', {
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
    content.appendChild(GDI.createSection('⚠️ Issues Found', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue =>
          GDI.createElement('div', {
            styles: {
              padding: '10px 14px',
              background: issue.severity === 'warning' ? window.DESIGN_TOKENS.colors.warningLight : window.DESIGN_TOKENS.colors.infoLight,
              borderLeft: `3px solid ${issue.severity === 'warning' ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.info}`,
              borderRadius: window.DESIGN_TOKENS.radii.md,
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
  content.appendChild(GDI.createButton('📋 Copy Optimized URL', () => {
    GDI.copyToClipboard(optimizedUrl).then(() => GDI.showNotification('✅ Optimized URL copied!', 'success'));
  }, { variant: 'success' }));
  
  // Best practices
  content.appendChild(GDI.createSection('💡 URL Best Practices', [
    GDI.createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
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
  
  const { close } = GDI.createModal('URL Optimizer', content, { width: '600px' });
}

// ==================== TOOL: SEO TITLE GENERATOR ====================

function toolGenerateTitles() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📝 SEO Title Generator',
    `${titleVariations.length} optimized titles generated`
  ));
  
  const titlesList = GDI.createSection('✨ Generated Titles', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '10px' },
      children: titleVariations.map((title, i) => {
        const card = GDI.createElement('div', {
          styles: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px',
            background: i === 0 ? window.DESIGN_TOKENS.colors.successLight : 'var(--gdi-surface)',
            border: `1px solid ${i === 0 ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.md,
            transition: `all ${DT.transitions.fast}`,
          },
        });
        
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = i === 0 ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-border)';
        });
        
        const titleInfo = GDI.createElement('div', { styles: { flex: '1', marginRight: '12px' } });
        
        titleInfo.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.sm,
            fontWeight: DT.typography.weights.bold,
            color: window.DESIGN_TOKENS.colors.primary,
            marginBottom: '4px',
          },
          text: `Option ${i + 1}${i === 0 ? ' 🏆' : ''}`,
        }));
        
        titleInfo.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.base,
            color: 'var(--gdi-text-primary)',
            lineHeight: '1.4',
          },
          text: title,
        }));
        
        titleInfo.appendChild(GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: title.length > 60 ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.success,
            marginTop: '4px',
          },
          text: `${title.length} characters ${title.length > 60 ? '⚠️' : '✅'}`,
        }));
        
        const copyBtn = GDI.createButton('Copy', () => {
          GDI.copyToClipboard(title).then(() => GDI.showNotification('✅ Title copied!', 'success'));
        }, { variant: 'secondary', fullWidth: false, size: 'sm' });
        
        card.appendChild(titleInfo);
        card.appendChild(copyBtn);
        
        return card;
      }),
    }),
  ]);
  
  content.appendChild(titlesList);
  
  content.appendChild(GDI.createButton('📋 Copy All Titles', () => {
    GDI.copyToClipboard(titleVariations.join('\n')).then(() => 
      GDI.showNotification(`✅ ${titleVariations.length} titles copied!`, 'success')
    );
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal('SEO Title Generator', content, { width: '650px' });
}

// ==================== TOOL: PUBLICATION DATE CHECKER ====================

function toolCheckPublicationDate() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📅 Publication Date Checker',
    'Analyze content freshness and date signals'
  ));
  
  // Freshness indicator
  const freshnessColor = ageInDays ? 
    (ageInDays < 30 ? window.DESIGN_TOKENS.colors.success : ageInDays < 90 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.error) 
    : 'var(--gdi-text-muted)';
  
  const freshnessCard = GDI.createElement('div', {
    styles: {
      textAlign: 'center',
      padding: '24px',
      background: ageInDays ? 
        (ageInDays < 30 ? window.DESIGN_TOKENS.colors.successLight : ageInDays < 90 ? window.DESIGN_TOKENS.colors.warningLight : window.DESIGN_TOKENS.colors.errorLight)
        : 'var(--gdi-surface-secondary)',
      borderRadius: window.DESIGN_TOKENS.radii.lg,
      marginBottom: '20px',
      border: `2px solid ${freshnessColor}30`,
    },
    children: [
      GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes['3xl'], fontWeight: DT.typography.weights.extrabold, color: freshnessColor, marginBottom: '8px' },
        text: freshness,
      }),
      latestDate ? GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes.md, color: 'var(--gdi-text-secondary)' },
        text: `Latest Date: ${latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      }) : null,
      ageInDays ? GDI.createElement('div', {
        styles: { fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-muted)', marginTop: '4px' },
        text: `${ageInDays} days ago`,
      }) : null,
    ].filter(Boolean),
  });
  
  content.appendChild(freshnessCard);
  
  // Date sources table
  const sourcesSection = GDI.createSection('📋 Date Sources Found', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
      children: Object.entries(dateSources).map(([key, value]) => {
        const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        return GDI.createElement('div', {
          styles: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', background: 'var(--gdi-surface)',
            border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
          },
          children: [
            GDI.createElement('span', {
              styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.medium, color: 'var(--gdi-text-primary)' },
              text: cleanKey,
            }),
            GDI.createElement('span', {
              styles: {
                fontSize: DT.typography.sizes.sm,
                color: value ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-text-muted)',
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
  content.appendChild(GDI.createButton('🔍 Check Google Cache', () => {
    window.open(`https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`, '_blank');
  }, { variant: 'secondary' }));
  
  const { close } = GDI.createModal('Publication Date Checker', content, { width: '600px' });
}

// ==================== TOOL: MOBILE USABILITY TEST ====================

function toolTestMobileUsability() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📱 Mobile Usability Test',
    `Score: ${score}/100 - ${getScoreGrade(score)}`
  ));
  
  // Score ring
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Viewport', value: hasViewport ? '✅' : '❌', icon: '📱', color: hasViewport ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.error },
    { label: 'Font Size', value: `${bodyFontSize}px`, icon: '🔤', color: isFontReadable ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.warning },
    { label: 'Small Taps', value: smallTapTargets, icon: '👆', color: smallTapTargets === 0 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.error },
    { label: 'H-Scroll', value: hasHorizontalScroll ? '❌' : '✅', icon: '↔️', color: !hasHorizontalScroll ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.error },
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
    content.appendChild(GDI.createSection('⚠️ Priority Fixes', [
      GDI.createElement('ul', {
        styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
        html: fixes.map(f => `<li>${f}</li>`).join(''),
      }),
    ]));
  } else {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: { padding: '20px', background: window.DESIGN_TOKENS.colors.successLight, borderRadius: window.DESIGN_TOKENS.radii.md, textAlign: 'center', color: '#166534', fontWeight: DT.typography.weights.semibold },
        text: '✅ No mobile usability issues detected! Great job!',
      }),
    ]));
  }
  
  content.appendChild(GDI.createButton('🔍 Google Mobile-Friendly Test', () => {
    window.open(`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`, '_blank');
  }, { variant: 'primary' }));
  
  const { close } = GDI.createModal('Mobile Usability Test', content, { width: '600px' });
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
  content.appendChild(GDI.createToolHeader(
    '🤖 AI Meta Tag Generator',
    'AI-optimized SEO suggestions based on live content analysis',
    window.DESIGN_TOKENS.colors.primaryGradient
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
    const color = isGood ? window.DESIGN_TOKENS.colors.success : item.isText ? window.DESIGN_TOKENS.colors.error : window.DESIGN_TOKENS.colors.warning;
    
    auditPanel.appendChild(GDI.createElement('div', {
      styles: {
        padding: '12px 14px', background: 'var(--gdi-surface)',
        borderRadius: window.DESIGN_TOKENS.radii.md, border: `1px solid ${color}30`,
        display: 'flex', flexDirection: 'column', gap: '4px'
      },
      children: [
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: 'var(--gdi-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' },
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
  const currentSection = GDI.createSection('📊 Current Meta Tags', [
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
    const statusColor = !item.value ? window.DESIGN_TOKENS.colors.error :
      len >= item.optimal[0] && len <= item.optimal[1] ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.warning;
    
    currentSection.querySelector('div').appendChild(
      GDI.createElement('div', {
        styles: {
          padding: '14px', background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
        },
        children: [
          GDI.createElement('div', {
            styles: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' },
            children: [
              GDI.createElement('span', { 
                styles: { fontWeight: '600', fontSize: '13px', color: 'var(--gdi-text-primary)' },
                text: item.label 
              }),
              GDI.createElement('span', { 
                styles: { fontSize: '11px', color: statusColor, fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: `${statusColor}15` },
                text: `${len} chars${!item.value ? ' — Missing' : len < item.optimal[0] ? ' — Too short' : len > item.optimal[1] ? ' — Too long' : ' — Optimal'}`
              }),
            ],
          }),
          GDI.createElement('div', {
            styles: { fontSize: '13px', color: item.value ? 'var(--gdi-text-secondary)' : window.DESIGN_TOKENS.colors.error, lineHeight: '1.5', wordBreak: 'break-word', fontStyle: item.value ? 'normal' : 'italic' },
            text: item.value || 'Not set — search engines may auto-generate this from page content',
          }),
        ],
      })
    );
  });
  content.appendChild(currentSection);

  // ─── TITLE SUGGESTIONS ───
  const titleSection = GDI.createSection('📝 AI Title Suggestions', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '10px' } }),
  ]);

  titleTemplates.forEach((title, i) => {
    const card = GDI.createElement('div', {
      styles: {
        padding: '14px 16px',
        background: i === 0 ? `${window.DESIGN_TOKENS.colors.success}08` : 'var(--gdi-surface)',
        border: `2px solid ${i === 0 ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '12px', transition: 'all 0.2s', cursor: 'pointer'
      }
    });

    card.addEventListener('mouseenter', () => {
      if (i !== 0) card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
    });
    card.addEventListener('mouseleave', () => {
      if (i !== 0) card.style.borderColor = 'var(--gdi-border)';
    });

    const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
    
    info.appendChild(GDI.createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
      children: [
        i === 0 ? GDI.createBadge('🏆 Best Match', 'success') : null,
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: 'var(--gdi-text-muted)', fontWeight: '500' },
          text: `Score ${title.score}% • ${title.reason}` 
        }),
        GDI.createElement('span', {
          styles: {
            fontSize: '11px', fontWeight: '700',
            color: title.text.length > 60 ? window.DESIGN_TOKENS.colors.error : title.text.length < 50 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.success,
            padding: '2px 6px', borderRadius: '4px', background: `${title.text.length > 60 ? window.DESIGN_TOKENS.colors.error : title.text.length < 50 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.success}15`
          },
          text: `${title.text.length} chars`
        }),
      ].filter(Boolean),
    }));

    info.appendChild(GDI.createElement('div', {
      styles: { fontSize: '14px', color: 'var(--gdi-text-primary)', lineHeight: '1.5', wordBreak: 'break-word' },
      text: title.text,
    }));

    const copyBtn = GDI.createButton('Copy', () => {
      GDI.copyToClipboard(title.text).then(() => GDI.showNotification('✅ Title copied to clipboard!', 'success'));
    }, { variant: i === 0 ? 'primary' : 'secondary', fullWidth: false, size: 'sm' });

    card.appendChild(info);
    card.appendChild(copyBtn);
    titleSection.querySelector('div').appendChild(card);
  });
  content.appendChild(titleSection);

  // ─── DESCRIPTION SUGGESTIONS ───
  const descSection = GDI.createSection('📄 AI Meta Descriptions', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '10px' } }),
  ]);

  descTemplates.forEach((desc, i) => {
    const card = GDI.createElement('div', {
      styles: {
        padding: '14px 16px',
        background: i === 0 ? `${window.DESIGN_TOKENS.colors.info}08` : 'var(--gdi-surface)',
        border: `2px solid ${i === 0 ? window.DESIGN_TOKENS.colors.info : 'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '12px', transition: 'all 0.2s', cursor: 'pointer'
      }
    });

    card.addEventListener('mouseenter', () => {
      if (i !== 0) card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
    });
    card.addEventListener('mouseleave', () => {
      if (i !== 0) card.style.borderColor = 'var(--gdi-border)';
    });

    const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
    
    info.appendChild(GDI.createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
      children: [
        i === 0 ? GDI.createBadge('🏆 Best Match', 'info') : null,
        GDI.createElement('span', { 
          styles: { fontSize: '11px', color: 'var(--gdi-text-muted)', fontWeight: '500' },
          text: `Score ${desc.score}%` 
        }),
        GDI.createElement('span', {
          styles: {
            fontSize: '11px', fontWeight: '700',
            color: desc.text.length > 160 ? window.DESIGN_TOKENS.colors.error : desc.text.length < 120 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.success,
            padding: '2px 6px', borderRadius: '4px', background: `${desc.text.length > 160 ? window.DESIGN_TOKENS.colors.error : desc.text.length < 120 ? window.DESIGN_TOKENS.colors.warning : window.DESIGN_TOKENS.colors.success}15`
          },
          text: `${desc.text.length} chars`
        }),
      ].filter(Boolean),
    }));

    info.appendChild(GDI.createElement('div', {
      styles: { fontSize: '13px', color: 'var(--gdi-text-secondary)', lineHeight: '1.6' },
      text: desc.text,
    }));

    const copyBtn = GDI.createButton('Copy', () => {
      GDI.copyToClipboard(desc.text).then(() => GDI.showNotification('✅ Description copied to clipboard!', 'success'));
    }, { variant: i === 0 ? 'primary' : 'secondary', fullWidth: false, size: 'sm' });

    card.appendChild(info);
    card.appendChild(copyBtn);
    descSection.querySelector('div').appendChild(card);
  });
  content.appendChild(descSection);

  // ─── KEYWORDS TAG CLOUD ───
  content.appendChild(GDI.createSection('🎯 Top Keywords Detected', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
      children: topKeywords.map((kw, i) => {
        const size = i < 3 ? '14px' : i < 8 ? '13px' : '12px';
        const weight = i < 5 ? '700' : '500';
        const opacity = 1 - (i * 0.04);
        return GDI.createElement('span', {
          styles: {
            padding: '6px 14px',
            background: i < 3 ? window.DESIGN_TOKENS.colors.primary : `${window.DESIGN_TOKENS.colors.primary}15`,
            color: i < 3 ? '#FFFFFF' : window.DESIGN_TOKENS.colors.primary,
            borderRadius: window.DESIGN_TOKENS.radii.full,
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
      background: `${window.DESIGN_TOKENS.colors.success}08`, border: `2px dashed ${window.DESIGN_TOKENS.colors.success}`,
      borderRadius: window.DESIGN_TOKENS.radii.md, textAlign: 'center'
    }
  });

  bundleSection.appendChild(GDI.createElement('div', {
    styles: { fontSize: '14px', fontWeight: '600', color: 'var(--gdi-text-primary)', marginBottom: '12px' },
    text: '📋 Copy Complete Meta Tag Bundle'
  }));

  const copyBundleBtn = GDI.createButton('Copy Title + Description + Keywords', () => {
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
    GDI.copyToClipboard(bundle).then(() => GDI.showNotification('✅ Full meta bundle copied!', 'success'));
  }, { variant: 'success', size: 'md' });
  copyBundleBtn.style.width = '100%';

  bundleSection.appendChild(copyBundleBtn);
  content.appendChild(bundleSection);

  const { close } = GDI.createModal('AI Meta Tag Generator', content, { width: '800px' });
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
  content.appendChild(GDI.createToolHeader(
    '🖼️ AI Alt Text Generator',
    `${imageData.length} images analyzed • ${needsAlt.length} need attention`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));

  // ─── STATS ───
  content.appendChild(createStatGrid([
    { label: 'Total Images', value: imageData.length.toString(), icon: '🖼️', color: window.DESIGN_TOKENS.colors.primary },
    { label: 'Need Alt Text', value: needsAlt.length.toString(), icon: '⚠️', color: window.DESIGN_TOKENS.colors.warning },
    { label: 'Have Alt Text', value: hasAlt.length.toString(), icon: '✅', color: window.DESIGN_TOKENS.colors.success },
    { label: 'Decorative', value: decorative.length.toString(), icon: '✨', color: window.DESIGN_TOKENS.colors.info },
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
        padding: '8px 16px', borderRadius: window.DESIGN_TOKENS.radii.md, border: 'none',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        background: activeFilter === f.key ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-surface)',
        color: activeFilter === f.key ? '#fff' : 'var(--gdi-text-secondary)',
        transition: 'all 0.2s'
      },
      text: f.label
    });
    btn.addEventListener('click', () => {
      activeFilter = f.key;
      tabButtons.forEach(b => {
        b.style.background = b === btn ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-surface)';
        b.style.color = b === btn ? '#fff' : 'var(--gdi-text-secondary)';
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
        styles: { textAlign: 'center', padding: '40px', color: 'var(--gdi-text-muted)', fontSize: '14px' },
        text: 'No images match this filter.'
      }));
      return;
    }

    filtered.forEach(item => {
      const card = GDI.createElement('div', {
        styles: {
          padding: '14px', background: 'var(--gdi-surface)',
          border: `1px solid ${item.needsAlt ? window.DESIGN_TOKENS.colors.warning : item.isDecorative ? window.DESIGN_TOKENS.colors.info : window.DESIGN_TOKENS.colors.success}30`,
          borderRadius: window.DESIGN_TOKENS.radii.md,
          borderLeft: `4px solid ${item.needsAlt ? window.DESIGN_TOKENS.colors.warning : item.isDecorative ? window.DESIGN_TOKENS.colors.info : window.DESIGN_TOKENS.colors.success}`,
        }
      });

      // Header row
      const header = GDI.createElement('div', {
        styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }
      });

      // Thumbnail
      const thumbWrap = GDI.createElement('div', {
        styles: {
          width: '60px', height: '60px', borderRadius: window.DESIGN_TOKENS.radii.sm,
          background: '#F1F5F9', overflow: 'hidden', flexShrink: '0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${'var(--gdi-border)'}`
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
            styles: { fontSize: '12px', fontWeight: '700', color: 'var(--gdi-text-primary)' },
            text: `Image #${item.index}` 
          }),
          GDI.createBadge(`${item.confidence}%`, 
            item.confidence > 80 ? 'success' : item.confidence > 50 ? 'warning' : 'error'
          ),
          GDI.createBadge(item.source, 'info'),
          item.width ? GDI.createElement('span', {
            styles: { fontSize: '11px', color: 'var(--gdi-text-muted)' },
            text: `${item.width}×${item.height}`
          }) : null,
        ].filter(Boolean),
      }));

      meta.appendChild(GDI.createElement('div', {
        styles: { fontSize: '11px', color: 'var(--gdi-text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        text: item.filename
      }));

      header.appendChild(meta);
      card.appendChild(header);

      // Existing alt display
      if (item.existingAlt && !item.isDecorative) {
        card.appendChild(GDI.createElement('div', {
          styles: { 
            fontSize: '12px', color: 'var(--gdi-text-secondary)', marginBottom: '8px',
            padding: '6px 10px', background: window.DESIGN_TOKENS.colors.background, borderRadius: window.DESIGN_TOKENS.radii.sm,
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
            border: `1.5px solid ${item.needsAlt ? window.DESIGN_TOKENS.colors.warning : 'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.md, fontSize: '13px',
            color: 'var(--gdi-text-primary)', background: window.DESIGN_TOKENS.colors.background,
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }
        });
        input.addEventListener('focus', () => input.style.borderColor = window.DESIGN_TOKENS.colors.primary);
        input.addEventListener('blur', () => input.style.borderColor = item.needsAlt ? window.DESIGN_TOKENS.colors.warning : 'var(--gdi-border)');
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
            fontSize: '12px', color: window.DESIGN_TOKENS.colors.info, fontStyle: 'italic',
            padding: '8px', background: `${window.DESIGN_TOKENS.colors.info}08`, borderRadius: window.DESIGN_TOKENS.radii.sm
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
      styles: { display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${'var(--gdi-border)'}` }
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
      color: window.DESIGN_TOKENS.colors.success,
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
      color: window.DESIGN_TOKENS.colors.warning,
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
      color: window.DESIGN_TOKENS.colors.error,
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
      color: window.DESIGN_TOKENS.colors.info,
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
      color: window.DESIGN_TOKENS.colors.primary,
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
  content.appendChild(GDI.createToolHeader(
    '💡 AI Topic Generator',
    `${totalTopics} blog topic ideas across ${categories.length} categories`,
    window.DESIGN_TOKENS.colors.primaryGradient
  ));

  // ─── KEYWORD BAR ───
  content.appendChild(GDI.createSection('🎯 Extracted Keywords', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
      children: [
        ...topKeywords.slice(0, 10).map((kw, i) => 
          GDI.createElement('span', {
            styles: {
              padding: '6px 14px', background: i < 3 ? window.DESIGN_TOKENS.colors.primary : `${window.DESIGN_TOKENS.colors.primary}12`,
              color: i < 3 ? '#fff' : window.DESIGN_TOKENS.colors.primary, borderRadius: window.DESIGN_TOKENS.radii.full,
              fontSize: i < 3 ? '14px' : '12px', fontWeight: i < 5 ? '600' : '500',
              cursor: 'pointer', transition: 'transform 0.2s'
            },
            text: kw,
          })
        ),
        GDI.createElement('span', {
          styles: { fontSize: '11px', color: 'var(--gdi-text-muted)', marginLeft: '4px' },
          text: `+${topKeywords.length - 10} more`
        })
      ],
    }),
  ]));

  // ─── CATEGORY ACCORDIONS ───
  categories.forEach((cat, catIndex) => {
    const section = GDI.createSection(`${cat.icon} ${cat.name}`, [
      GDI.createElement('div', { 
        styles: { display: 'flex', flexDirection: 'column', gap: '10px' } 
      }),
    ]);

    cat.topics.forEach((topic, i) => {
      const card = GDI.createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px', background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
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
        card.style.borderColor = 'var(--gdi-border)';
        card.style.boxShadow = 'none';
      });

      const info = GDI.createElement('div', { styles: { flex: '1', minWidth: '0' } });
      
      info.appendChild(GDI.createElement('div', {
        styles: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
        children: [
          GDI.createBadge(topic.type, 'info'),
          GDI.createBadge(topic.difficulty, 
            topic.difficulty === 'beginner' ? 'success' : 
            topic.difficulty === 'intermediate' ? 'warning' : 'error'
          ),
          GDI.createElement('span', {
            styles: { fontSize: '11px', color: 'var(--gdi-text-muted)' },
            text: `${topic.text.length} chars`
          }),
        ],
      }));

      info.appendChild(GDI.createElement('div', {
        styles: { fontSize: '14px', color: 'var(--gdi-text-primary)', lineHeight: '1.5', wordBreak: 'break-word' },
        text: topic.text,
      }));

      const copyBtn = GDI.createButton('Copy', () => {
        GDI.copyToClipboard(topic.text).then(() => GDI.showNotification('✅ Topic copied!', 'success'));
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
      borderTop: `2px solid ${'var(--gdi-border)'}`, flexWrap: 'wrap'
    }
  });

  actionBar.appendChild(GDI.createButton('📋 Copy All Topics', () => {
    const text = categories.map(cat => 
      `=== ${cat.name} ===\n${cat.topics.map(t => `• ${t.text}`).join('\n')}`
    ).join('\n\n');
    GDI.copyToClipboard(text).then(() => GDI.showNotification(`✅ ${totalTopics} topics copied!`, 'success'));
  }, { variant: 'primary' }));

  actionBar.appendChild(GDI.createButton('📄 Export as Markdown', () => {
    const md = `# Blog Topic Ideas: ${h1}\n\n*Generated from ${domain} on ${new Date().toLocaleDateString()}*\n\n## Keywords\n${topKeywords.slice(0,8).map(k => `- ${k}`).join('\n')}\n\n${categories.map(cat => `## ${cat.name}\n\n${cat.topics.map((t, i) => `${i+1}. **${t.text}**\n   - Type: ${t.type} | Difficulty: ${t.difficulty}`).join('\n\n')}`).join('\n\n')}`;
    GDI.copyToClipboard(md).then(() => GDI.showNotification('✅ Markdown exported to clipboard!', 'success'));
  }, { variant: 'secondary' }));

  actionBar.appendChild(GDI.createButton('🔄 Regenerate', () => {
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

  const { close } = GDI.createModal('AI Topic Generator', content, { width: '800px' });
}

// ==================== TOOL: LINK PROSPECT FINDER ====================

function toolFindLinkProspects() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '🎯 Link Prospect Finder',
    `Find guest post and link building opportunities for "${mainKeyword}"`
  ));
  
  // Custom keyword input
  const { wrapper: keywordWrapper, input: keywordInput } = GDI.createInputField({
    label: '🎯 Target Keyword',
    id: 'prospect-keyword',
    placeholder: 'Enter keyword...',
    defaultValue: mainKeyword,
  });
  
  content.appendChild(GDI.createSection('🔧 Settings', [keywordWrapper]));
  
  // Search queries
  const queriesSection = GDI.createSection(`📋 Search Queries (${searchQueries.length})`, [
    GDI.createElement('div', {
      attrs: { id: 'prospect-queries' },
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
  ]);
  
  function renderQueries(queries) {
    const container = document.getElementById('prospect-queries');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => {
      const row = GDI.createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => {
        row.style.borderColor = window.DESIGN_TOKENS.colors.primary;
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.borderColor = 'var(--gdi-border)';
      });
      
      row.appendChild(GDI.createElement('div', {
        styles: { flex: '1', marginRight: '12px' },
        children: [
          GDI.createElement('div', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: 'var(--gdi-text-primary)', marginBottom: '2px' },
            text: sq.name,
          }),
          GDI.createElement('div', {
            styles: { fontSize: DT.typography.sizes.sm, color: window.DESIGN_TOKENS.colors.primary, fontFamily: DT.typography.fontMono },
            text: sq.query,
          }),
        ],
      }));
      
      row.appendChild(GDI.createButton('Search', () => {
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
  
  keywordInput.addEventListener('input', GDI.debounce(() => {
    const newKeyword = keywordInput.value.trim() || mainKeyword;
    const updatedQueries = searchQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword),
    }));
    renderQueries(updatedQueries);
  }, 300));
  
  // Action buttons
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(GDI.createButton('🚀 Open All Queries', () => {
    const queries = document.querySelectorAll('#prospect-queries button');
    const allQueries = Array.from(queries).map(btn => 
      btn.parentElement?.querySelector('div:last-child')?.textContent || ''
    ).filter(Boolean);
    
    allQueries.forEach((query, i) => {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }, i * 300);
    });
    GDI.showNotification(`✅ Opening ${allQueries.length} searches...`, 'success');
  }, { variant: 'primary' }));
  
  btnRow.appendChild(GDI.createButton('📋 Copy Search URLs', () => {
    const queries = document.querySelectorAll('#prospect-queries button');
    const urls = Array.from(queries).map(btn => {
      const query = btn.parentElement?.querySelector('div:last-child')?.textContent || '';
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    });
    GDI.copyToClipboard(urls.join('\n')).then(() => GDI.showNotification('✅ URLs copied!', 'success'));
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  // Tips
  content.appendChild(GDI.createSection('💡 Prospecting Tips', [
    GDI.createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
      html: `
        <li>Look for sites with good DA/DR metrics</li>
        <li>Check if they've published guest posts recently</li>
        <li>Verify the site gets organic traffic</li>
        <li>Review their guest post guidelines carefully</li>
        <li>Personalize your outreach email</li>
      `,
    }),
  ]));
  
  const { close } = GDI.createModal('Link Prospect Finder', content, { width: '700px' });
}

// ==================== TOOL: RESOURCE PAGE FINDER ====================

function toolFindResourcePages() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📚 Resource Page Finder',
    `Find resource pages for link building with "${mainKeyword}"`
  ));
  
  const { wrapper: kwWrapper, input: kwInput } = GDI.createInputField({
    label: '🎯 Target Keyword',
    id: 'resource-keyword',
    placeholder: 'Enter keyword...',
    defaultValue: mainKeyword,
  });
  
  content.appendChild(GDI.createSection('🔧 Settings', [kwWrapper]));
  
  const queriesSection = GDI.createSection(`📋 Search Queries (${resourceQueries.length})`, [
    GDI.createElement('div', {
      attrs: { id: 'resource-queries' },
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
  ]);
  
  function renderQueries(queries) {
    const container = document.getElementById('resource-queries');
    if (!container) return;
    
    container.innerHTML = queries.map(sq => {
      const row = GDI.createElement('div', {
        styles: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: 'var(--gdi-surface)',
          border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
          transition: `all ${DT.transitions.fast}`,
        },
      });
      
      row.addEventListener('mouseenter', () => row.style.borderColor = window.DESIGN_TOKENS.colors.primary);
      row.addEventListener('mouseleave', () => row.style.borderColor = 'var(--gdi-border)');
      
      row.appendChild(GDI.createElement('div', {
        styles: { flex: '1', marginRight: '12px' },
        children: [
          GDI.createElement('div', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: 'var(--gdi-text-primary)', marginBottom: '2px' },
            text: sq.name,
          }),
          GDI.createElement('div', {
            styles: { fontSize: DT.typography.sizes.sm, color: window.DESIGN_TOKENS.colors.info, fontFamily: DT.typography.fontMono },
            text: sq.query,
          }),
        ],
      }));
      
      row.appendChild(GDI.createButton('Search', () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(sq.query)}`, '_blank');
      }, { variant: 'secondary', fullWidth: false, size: 'sm' }));
      
      return row;
    }).join('');
  }
  
  content.appendChild(queriesSection);
  renderQueries(resourceQueries);
  
  kwInput.addEventListener('input', GDI.debounce(() => {
    const newKw = kwInput.value.trim() || mainKeyword;
    const updated = resourceQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKw),
    }));
    renderQueries(updated);
  }, 300));
  
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(GDI.createButton('🚀 Open All Queries', () => {
    resourceQueries.forEach((sq, i) => {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(sq.query)}`, '_blank');
      }, i * 300);
    });
    GDI.showNotification(`✅ Opening ${resourceQueries.length} searches...`, 'success');
  }, { variant: 'primary' }));
  
  content.appendChild(btnRow);
  
  const { close } = GDI.createModal('Resource Page Finder', content, { width: '700px' });
}

// ==================== TOOL: LOCAL KEYWORD FINDER ====================

function toolFindLocalKeywords() {
  const content = GDI.createElement('div');
  
  const domain = window.location.hostname.replace(/^www\./, '');
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
  const stopWords = new Set(['about', 'contact', 'services', 'home', 'learn', 'more', 'click', 'here']);
  const keywords = [...new Set(words.filter(w => !stopWords.has(w)))];
  const mainKeyword = keywords[0] || domain.split('.')[0] || 'service';
  
  content.appendChild(GDI.createToolHeader(
    '📍 Local Keyword Finder',
    'Generate location-based keyword permutations'
  ));
  
  const { wrapper: kwWrapper, input: kwInput } = GDI.createInputField({
    label: 'Main Service / Keyword',
    id: 'local-keyword',
    placeholder: 'e.g., plumber, roof repair, dentist',
    defaultValue: mainKeyword,
  });
  
  const { wrapper: locWrapper, input: locInput } = GDI.createInputField({
    label: 'Locations (comma separated)',
    id: 'local-locations',
    placeholder: 'e.g., New York, Brooklyn, Queens',
    defaultValue: 'New York, Los Angeles, Chicago',
  });
  
  content.appendChild(GDI.createSection('🔧 Settings', [kwWrapper, locWrapper]));
  
  const resultsContainer = GDI.createSection('📍 Generated Keywords', [
    GDI.createElement('div', {
      attrs: { id: 'local-results' },
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid ${'var(--gdi-border)'};">
          <span style="font-weight: ${DT.typography.weights.bold}; font-size: ${DT.typography.sizes.base}; color: ${'var(--gdi-text-primary)'};">${category.name}</span>
          <span style="font-size: ${DT.typography.sizes.xs}; color: ${'var(--gdi-text-muted)'}; background: ${'var(--gdi-surface-tertiary)'}; padding: 2px 8px; border-radius: ${window.DESIGN_TOKENS.radii.full}; font-weight: ${DT.typography.weights.bold};">${category.keywords.length} items</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
          ${category.keywords.map(kw => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: ${'var(--gdi-surface)'}; border: 1px solid ${'var(--gdi-border)'}; border-radius: ${window.DESIGN_TOKENS.radii.sm}; font-size: ${DT.typography.sizes.sm};">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${'var(--gdi-text-secondary)'};">${GDI.escapeHtml(kw)}</span>
              <button class="local-copy-btn" data-kw="${GDI.escapeHtml(kw)}" style="padding: 4px 8px; background: ${'var(--gdi-surface-tertiary)'}; border: 1px solid ${'var(--gdi-border)'}; border-radius: ${window.DESIGN_TOKENS.radii.sm}; cursor: pointer; font-size: ${DT.typography.sizes.xs}; color: ${'var(--gdi-text-secondary)'}; flex-shrink: 0; margin-left: 8px;">Copy</button>
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
        GDI.copyToClipboard(btn.dataset.kw).then(() => {
          btn.textContent = '✓';
          btn.style.background = window.DESIGN_TOKENS.colors.success;
          btn.style.color = '#FFFFFF';
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.style.background = 'var(--gdi-surface-tertiary)';
            btn.style.color = 'var(--gdi-text-secondary)';
          }, 1500);
        });
      });
    });
  }
  
  const initialCategories = generateKeywords(mainKeyword, 'New York, Los Angeles, Chicago');
  renderResults(initialCategories);
  
  content.appendChild(GDI.createButton('🔄 Generate Keywords', () => {
    const kw = kwInput.value.trim() || mainKeyword;
    const locs = locInput.value.trim() || 'New York';
    const categories = generateKeywords(kw, locs);
    renderResults(categories);
    GDI.showNotification('✅ Keywords generated!', 'success');
  }, { variant: 'primary' }));
  
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '8px' } });
  
  btnRow.appendChild(GDI.createButton('📋 Copy All Keywords', () => {
    const allKw = document.getElementById('local-results')?.dataset.allKeywords || '';
    if (allKw) {
      GDI.copyToClipboard(allKw).then(() => GDI.showNotification('✅ All keywords copied!', 'success'));
    }
  }, { variant: 'secondary' }));
  
  btnRow.appendChild(GDI.createButton('📊 Export CSV', () => {
    const categories = generateKeywords(kwInput.value.trim() || mainKeyword, locInput.value.trim() || 'New York');
    const allKw = categories.flatMap(c => c.keywords);
    const csv = 'Keyword\n' + allKw.map(k => `"${k}"`).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = `local-keywords-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    GDI.showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  const { close } = GDI.createModal('Local Keyword Finder', content, { width: '750px' });
}

// ==================== TOOL: HREFLANG GENERATOR ====================

function toolGenerateHreflang() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '🌐 Hreflang Generator',
    'Generate hreflang tags for multilingual SEO'
  ));
  
  // URL pattern
  const { wrapper: urlWrapper, input: urlInput } = GDI.createInputField({
    label: 'Base URL Pattern',
    id: 'hreflang-url',
    placeholder: baseUrl,
    defaultValue: baseUrl,
  });
  
  const { wrapper: patternWrapper } = GDI.createInputField({
    label: 'URL Pattern',
    id: 'hreflang-pattern',
    type: 'text',
  });
  
  const patternSelect = GDI.createElement('select', {
    attrs: { id: 'hreflang-pattern' },
    styles: {
      width: '100%', padding: '10px 14px',
      border: `1.5px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
      fontSize: DT.typography.sizes.base, fontFamily: DT.typography.fontFamily,
      background: 'var(--gdi-surface)', color: 'var(--gdi-text-primary)', cursor: 'pointer',
    },
  });
  
  ['Subdirectory: /{lang}/page', 'Subdomain: {lang}.example.com/page', 'Parameter: /page?lang={lang}'].forEach(opt => {
    const option = GDI.createElement('option', { attrs: { value: opt.split(':')[0].toLowerCase() }, text: opt });
    patternSelect.appendChild(option);
  });
  
  const patternInput = patternWrapper.querySelector('input');
  if (patternInput) patternInput.replaceWith(patternSelect);
  
  content.appendChild(GDI.createSection('🔧 Configuration', [urlWrapper, patternWrapper]));
  
  // Language selection
  const langSection = GDI.createSection('🌍 Select Languages', [
    GDI.createElement('div', {
      styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '250px', overflowY: 'auto' },
      children: languages.map(lang => {
        const label = GDI.createElement('label', {
          styles: {
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
            background: 'var(--gdi-surface)', border: `1px solid ${'var(--gdi-border)'}`,
            borderRadius: window.DESIGN_TOKENS.radii.sm, cursor: 'pointer', fontSize: DT.typography.sizes.base,
          },
        });
        
        const checkbox = GDI.createElement('input', {
          attrs: { type: 'checkbox', checked: 'true', 'data-code': lang.code, 'data-region': lang.region || '' },
        });
        
        label.appendChild(checkbox);
        label.appendChild(GDI.createElement('span', {
          styles: { color: 'var(--gdi-text-primary)' },
          text: lang.name,
        }));
        label.appendChild(GDI.createElement('span', {
          styles: { color: 'var(--gdi-text-muted)', fontFamily: DT.typography.fontMono, fontSize: DT.typography.sizes.xs },
          text: lang.code + (lang.region ? '-' + lang.region : ''),
        }));
        
        return label;
      }),
    }),
  ]);
  
  content.appendChild(langSection);
  
  // Select all / deselect all
  const selectRow = GDI.createElement('div', { styles: { display: 'flex', gap: '8px', marginBottom: '16px' } });
  
  selectRow.appendChild(GDI.createButton('Select All', () => {
    document.querySelectorAll('#hreflang-url').forEach(cb => cb.checked = true);
  }, { variant: 'secondary', fullWidth: true, size: 'sm' }));
  
  selectRow.appendChild(GDI.createButton('Deselect All', () => {
    document.querySelectorAll('#hreflang-url').forEach(cb => cb.checked = false);
  }, { variant: 'secondary', fullWidth: true, size: 'sm' }));
  
  content.appendChild(selectRow);
  
  // Output
  const outputSection = GDI.createSection('📋 Generated Hreflang Tags', [
    GDI.createElement('div', {
      attrs: { id: 'hreflang-output' },
      styles: {
        padding: '16px', background: '#1E293B', borderRadius: window.DESIGN_TOKENS.radii.md,
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
  
  content.appendChild(GDI.createButton('🔄 Generate Tags', () => {
    document.getElementById('hreflang-output').textContent = generateTags();
  }, { variant: 'primary' }));
  
  content.appendChild(GDI.createButton('📋 Copy Tags', () => {
    const tags = document.getElementById('hreflang-output').textContent;
    if (tags && tags !== 'Select languages and click "Generate Tags"') {
      GDI.copyToClipboard(tags).then(() => GDI.showNotification('✅ Hreflang tags copied!', 'success'));
    } else {
      const newTags = generateTags();
      document.getElementById('hreflang-output').textContent = newTags;
      GDI.copyToClipboard(newTags).then(() => GDI.showNotification('✅ Hreflang tags copied!', 'success'));
    }
  }, { variant: 'success' }));
  
  // Implementation notes
  content.appendChild(GDI.createSection('📋 Implementation Notes', [
    GDI.createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
      html: `
        <li>Add tags to the &lt;head&gt; section of each page</li>
        <li>Include self-referencing hreflang tag</li>
        <li>Always include x-default for language selector pages</li>
        <li>Use absolute URLs (including https://)</li>
        <li>Ensure bidirectional linking between all versions</li>
      `,
    }),
  ]));
  
  const { close } = GDI.createModal('Hreflang Generator', content, { width: '700px' });
}

// ==================== TOOL: DUPLICATE CONTENT FINDER ====================

function toolFindDuplicateContent() {
  const content = GDI.createElement('div');
  
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
  const fingerprint = GDI.hashString(bodyText.replace(/\s+/g, ' ').substring(0, 1000));
  
  content.appendChild(GDI.createToolHeader(
    '🔄 Duplicate Content Analyzer',
    `Uniqueness Score: ${score}/100`
  ));
  
  // Score ring
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Stats
  content.appendChild(createStatGrid([
    { label: 'Word Count', value: wordCount.toLocaleString(), icon: '📝', color: wordCount >= 300 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.warning },
    { label: 'H1 Tags', value: headings.h1.length, icon: '📌', color: headings.h1.length === 1 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.error },
    { label: 'Meta Desc', value: metaDesc ? '✅' : '❌', icon: '📄', color: metaDesc ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.error },
    { label: 'Fingerprint', value: fingerprint, icon: '🔑', color: window.DESIGN_TOKENS.colors.info },
  ]));
  
  // Issues
  const issues = [];
  if (wordCount < 300) issues.push('Content is thin - aim for 300+ words');
  if (headings.h1.length === 0) issues.push('Missing H1 tag');
  if (headings.h1.length > 1) issues.push(`Multiple H1 tags (${headings.h1.length})`);
  if (!metaDesc) issues.push('Missing meta description');
  if (duplicateHeadings.length > 0) issues.push(`${duplicateHeadings.length} duplicate heading(s) found`);
  
  if (issues.length > 0) {
    content.appendChild(GDI.createSection('⚠️ Issues Found', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
        children: issues.map(issue =>
          GDI.createElement('div', {
            styles: {
              padding: '10px 14px',
              background: window.DESIGN_TOKENS.colors.warningLight,
              borderLeft: `3px solid ${window.DESIGN_TOKENS.colors.warning}`,
              borderRadius: window.DESIGN_TOKENS.radii.md,
              fontSize: DT.typography.sizes.base,
              color: '#92400E',
            },
            text: `⚠️ ${issue}`,
          })
        ),
      }),
    ]));
  } else {
    content.appendChild(GDI.createSection('', [
      GDI.createElement('div', {
        styles: { padding: '20px', background: window.DESIGN_TOKENS.colors.successLight, borderRadius: window.DESIGN_TOKENS.radii.md, textAlign: 'center', color: '#166534', fontWeight: DT.typography.weights.semibold },
        text: '✅ No major duplicate content issues detected!',
      }),
    ]));
  }
  
  // Recommendations
  content.appendChild(GDI.createSection('💡 Recommendations', [
    GDI.createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
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
  
  const { close } = GDI.createModal('Duplicate Content Analyzer', content, { width: '650px' });
}

// ==================== TOOL: CONTENT & READABILITY ANALYZER ====================

function toolContentAnalyzer() {
  const content = GDI.createElement('div');
  
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
  if (readingEase >= 90) { readabilityLabel = 'Very Easy (5th Grade)'; readabilityColor = window.DESIGN_TOKENS.colors.success; }
  else if (readingEase >= 80) { readabilityLabel = 'Easy (6th Grade)'; readabilityColor = window.DESIGN_TOKENS.colors.success; }
  else if (readingEase >= 70) { readabilityLabel = 'Fairly Easy (7th Grade)'; readabilityColor = '#8BC34A'; }
  else if (readingEase >= 60) { readabilityLabel = 'Standard (8th-9th Grade)'; readabilityColor = window.DESIGN_TOKENS.colors.warning; }
  else if (readingEase >= 50) { readabilityLabel = 'Fairly Difficult (10th-12th)'; readabilityColor = window.DESIGN_TOKENS.colors.warning; }
  else if (readingEase >= 30) { readabilityLabel = 'Difficult (College)'; readabilityColor = window.DESIGN_TOKENS.colors.error; }
  else { readabilityLabel = 'Very Difficult (College Grad)'; readabilityColor = window.DESIGN_TOKENS.colors.error; }
  
  const readingTime = Math.max(1, Math.ceil(wordCount / 238));
  const speakingTime = Math.max(1, Math.ceil(wordCount / 130));
  
  content.appendChild(GDI.createToolHeader(
    '📝 Content & Readability Analyzer',
    `${wordCount.toLocaleString()} words analyzed`
  ));
  
  // Score
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(readingEase, 100));
  content.appendChild(scoreRow);
  
  content.appendChild(GDI.createElement('div', {
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
    content.appendChild(GDI.createSection('🔑 Top Keywords', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
        children: topKeywords.map(([kw, count]) =>
          GDI.createElement('span', {
            styles: {
              padding: '6px 14px', background: window.DESIGN_TOKENS.colors.infoLight,
              borderRadius: window.DESIGN_TOKENS.radii.full, fontSize: DT.typography.sizes.sm,
              color: window.DESIGN_TOKENS.colors.info, fontWeight: DT.typography.weights.semibold,
            },
            text: `${kw} (${count})`,
          })
        ),
      }),
    ]));
  }
  
  const { close } = GDI.createModal('Content & Readability Analyzer', content, { width: '650px' });
}

// ==================== TOOL: SEO AUDIT CHECKLIST ====================

function toolSEOAuditChecklist() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '✅ Automated SEO Audit',
    `Score: ${score}% • ${passedItems}/${totalItems} checks passed`
  ));
  
  // Score ring
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(score, 100));
  content.appendChild(scoreRow);
  
  // Score bar (FIXED FOR DARK MODE)
  const scoreBarSection = GDI.createElement('div', { styles: { marginBottom: '20px' } });
  const { container: progressBar } = GDI.createProgressBar(
    score, 
    score >= 80 ? 'var(--gdi-success)' : score >= 50 ? 'var(--gdi-warning)' : 'var(--gdi-error)', 
    10
  );
  scoreBarSection.appendChild(progressBar);
  content.appendChild(scoreBarSection);
  
  // Categories
  checklistItems.forEach(category => {
    const catPassed = category.items.filter(i => i.check).length;
    const catTotal = category.items.length;
    
    const catSection = GDI.createSection(
      `${category.category} (${catPassed}/${catTotal})`,
      [
        GDI.createElement('div', {
          styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
          children: category.items.map(item => {
            // FIXED: Using CSS variables so it flips instantly on dark mode toggle
            const statusColor = item.check ? 'var(--gdi-success)' : 'var(--gdi-error)';
            const statusBg = item.check ? 'var(--gdi-success-light)' : 'var(--gdi-error-light)';
            
            return GDI.createElement('div', {
              styles: {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: statusBg,
                border: `1px solid var(--gdi-border)`, // Safe dynamic border
                borderRadius: window.DESIGN_TOKENS.radii.md,
              },
              children: [
                GDI.createElement('div', {
                  styles: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1' },
                  children: [
                    GDI.createElement('span', { text: item.check ? '✅' : '❌' }),
                    GDI.createElement('span', {
                      styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.medium, color: 'var(--gdi-text-primary)' },
                      text: item.name,
                    }),
                  ],
                }),
                GDI.createElement('span', {
                  styles: { 
                    fontSize: DT.typography.sizes.xs, 
                    color: statusColor, // Will pop perfectly in dark mode now
                    fontWeight: DT.typography.weights.semibold, 
                    textAlign: 'right', 
                    maxWidth: '40%' 
                  },
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
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(GDI.createButton('📥 Export Audit JSON', () => {
    const reportData = { domain, url, date: new Date().toISOString(), score, passed: passedItems, total: totalItems, checklist: checklistItems };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = blobUrl;
    a.download = `seo-audit-${domain}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    GDI.showNotification('✅ Audit exported!', 'success');
  }, { variant: 'secondary' }));
  
  btnRow.appendChild(GDI.createButton('📋 Copy Summary', () => {
    const summary = `SEO Audit Summary - ${domain}\nDate: ${new Date().toLocaleDateString()}\nScore: ${score}%\n\n❌ Issues:\n${checklistItems.flatMap(c => c.items.filter(i => !i.check).map(i => `- ${i.name}: ${i.note}`)).join('\n')}`;
    GDI.copyToClipboard(summary).then(() => GDI.showNotification('✅ Summary copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(btnRow);
  
  const { close } = GDI.createModal('Automated SEO Audit', content, { width: '700px' });
}

// ==================== TOOL: SEO AUDIT CHECKLIST (INTERACTIVE) ====================

function toolAuditChecklist() {
  const content = GDI.createElement('div');
  
  // Define domain so the export function doesn't crash
  const domain = window.location.hostname.replace(/^www\./, '');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '✅ SEO Audit Checklist',
    'Track your SEO progress interactively'
  ));
  
  // Progress bar
  const progressSection = GDI.createElement('div', { styles: { marginBottom: '20px' } });
  
  const progressLabel = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: DT.typography.sizes.base },
    children: [
      GDI.createElement('span', { styles: { fontWeight: DT.typography.weights.semibold, color: 'var(--gdi-text-primary)' }, text: 'Overall Progress' }),
      GDI.createElement('span', { attrs: { id: 'audit-progress-text' }, styles: { fontWeight: DT.typography.weights.bold, color: window.DESIGN_TOKENS.colors.primary }, text: '0% Complete' }),
    ],
  });
  
  const { container: progressBar, fill: progressFill } = GDI.createProgressBar(0, window.DESIGN_TOKENS.colors.primary, 10);
  
  progressSection.appendChild(progressLabel);
  progressSection.appendChild(progressBar);
  content.appendChild(progressSection);
  
  // Load saved state
  chrome.storage.local.get(['seoAuditChecklist'], (result) => {
    const savedState = result.seoAuditChecklist || {};
    
    const checklistContainer = GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    });
    
    checklist.forEach((cat, catIndex) => {
      const catSection = GDI.createSection(cat.category, [
        GDI.createElement('div', {
          styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
          children: cat.items.map((item, itemIndex) => {
            const key = `${catIndex}-${itemIndex}`;
            const checked = savedState[key] || false;
            
            const label = GDI.createElement('label', {
              styles: {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                background: checked ? window.DESIGN_TOKENS.colors.successLight : 'var(--gdi-surface)',
                border: `1px solid ${checked ? window.DESIGN_TOKENS.colors.success : 'var(--gdi-border)'}`,
                borderRadius: window.DESIGN_TOKENS.radii.md,
                cursor: 'pointer',
                transition: `all ${DT.transitions.fast}`,
              },
            });
            
            const checkbox = GDI.createElement('input', {
              attrs: { type: 'checkbox', 'data-key': key },
            });
            checkbox.checked = checked;
            
            const textSpan = GDI.createElement('span', {
              styles: {
                flex: '1',
                fontSize: DT.typography.sizes.base,
                color: checked ? 'var(--gdi-text-muted)' : 'var(--gdi-text-primary)',
                textDecoration: checked ? 'line-through' : 'none',
              },
              text: item,
            });
            
            label.appendChild(checkbox);
            label.appendChild(textSpan);
            
            label.addEventListener('change', () => {
              const allCheckboxes = content.querySelectorAll('input[type="checkbox"]');
              const state = {};
              let totalChecked = 0;
              
              allCheckboxes.forEach(cb => {
                state[cb.dataset.key] = cb.checked;
                if (cb.checked) totalChecked++;
              });
              
              chrome.storage.local.set({ seoAuditChecklist: state });
              
              // Update progress
              const total = allCheckboxes.length;
              const percent = total > 0 ? Math.round((totalChecked / total) * 100) : 0;
              progressFill.style.width = `${percent}%`;
              const progressText = content.querySelector('#audit-progress-text');
              if (progressText) progressText.textContent = `${totalChecked}/${total} items (${percent}%)`;
              
              // Update label styles
              if (checkbox.checked) {
                label.style.background = window.DESIGN_TOKENS.colors.successLight;
                label.style.borderColor = window.DESIGN_TOKENS.colors.success;
                textSpan.style.textDecoration = 'line-through';
                textSpan.style.color = 'var(--gdi-text-muted)';
              } else {
                label.style.background = 'var(--gdi-surface)';
                label.style.borderColor = 'var(--gdi-border)';
                textSpan.style.textDecoration = 'none';
                textSpan.style.color = 'var(--gdi-text-primary)';
              }
            });
            
            return label;
          }),
        }),
      ]);
      
      checklistContainer.appendChild(catSection);
    });
    
    content.appendChild(checklistContainer);
    
    // Initial progress setup
    const allCheckboxes = content.querySelectorAll('input[type="checkbox"]');
    let totalChecked = 0;
    allCheckboxes.forEach(cb => {
      if (cb.checked) totalChecked++;
    });
    const percent = allCheckboxes.length > 0 ? Math.round((totalChecked / allCheckboxes.length) * 100) : 0;
    progressFill.style.width = `${percent}%`;
    const initProgressText = content.querySelector('#audit-progress-text');
    if (initProgressText) initProgressText.textContent = `${totalChecked}/${allCheckboxes.length} items (${percent}%)`;
    
    // Action buttons
    const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
    
    btnRow.appendChild(GDI.createButton('🔄 Reset All', () => {
      if (confirm('Reset all checklist items?')) {
        content.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
          // Event bubbles up to the label to trigger the UI update correctly
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        });
        chrome.storage.local.remove('seoAuditChecklist');
        GDI.showNotification('✅ Checklist reset!', 'success');
      }
    }, { variant: 'danger' }));
    
    btnRow.appendChild(GDI.createButton('📤 Export Checklist', () => {
      const state = {};
      let checkedNum = 0;
      let totalNum = 0;
      content.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        state[cb.dataset.key] = cb.checked;
        totalNum++;
        if (cb.checked) checkedNum++;
      });
      
      const report = `SEO Audit Checklist Report\n${'='.repeat(30)}\nDate: ${new Date().toLocaleDateString()}\nDomain: ${domain}\nProgress: ${checkedNum}/${totalNum} (${Math.round(checkedNum/totalNum*100)}%)\n\n` +
        checklist.map((cat, catIdx) =>
          `${cat.category}\n${'-'.repeat(20)}\n${cat.items.map((item, itemIdx) => `[${state[`${catIdx}-${itemIdx}`] ? 'x' : ' '}] ${item}`).join('\n')}`
        ).join('\n\n');
      
      const blob = new Blob([report], { type: 'text/plain' });
      const blobUrl = URL.createObjectURL(blob);
      const a = GDI.createElement('a');
      a.href = blobUrl;
      a.download = `seo-checklist-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      GDI.showNotification('✅ Checklist exported!', 'success');
    }, { variant: 'secondary' }));
    
    content.appendChild(btnRow);
  });
  
  const { close } = GDI.createModal('SEO Audit Checklist', content, { width: '700px' });
}

// ==================== TOOL: SEO DASHBOARD ====================

function toolSEODashboard() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📊 SEO Dashboard',
    `Overall Score: ${overallScore}/100 (Grade ${getGrade(overallScore)})`
  ));
  
  // Score ring
  const scoreRow = GDI.createElement('div', {
    styles: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  });
  scoreRow.appendChild(GDI.createScoreRing(overallScore, 100));
  content.appendChild(scoreRow);
  
  // Quick stats
  content.appendChild(createStatGrid([
    { label: 'Total Links', value: allLinks.length, icon: '🔗' },
    { label: 'Internal', value: internalLinks.length, icon: '🏠', color: window.DESIGN_TOKENS.colors.success },
    { label: 'External', value: externalLinks.length, icon: '🌐', color: window.DESIGN_TOKENS.colors.info },
    { label: 'Images', value: images.length, icon: '🖼️' },
    { label: 'Word Count', value: wordCount.toLocaleString(), icon: '📝' },
    { label: 'Schema', value: schemaCount, icon: '📋', color: schemaCount > 0 ? window.DESIGN_TOKENS.colors.success : window.DESIGN_TOKENS.colors.warning },
  ]));
  
  // Score bars
  const scoreBars = GDI.createSection('📊 Score Breakdown', [
    GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '8px' } }),
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
const color = item.score >= 80 ? 'var(--gdi-success)' : item.score >= 50 ? 'var(--gdi-warning)' : 'var(--gdi-error)';    
    const row = GDI.createElement('div', { styles: { marginBottom: '4px' } });
    
    const header = GDI.createElement('div', {
      styles: { display: 'flex', justifyContent: 'space-between', fontSize: DT.typography.sizes.sm, marginBottom: '2px' },
      children: [
        GDI.createElement('span', { styles: { color: 'var(--gdi-text-primary)' }, text: item.label }),
        GDI.createElement('span', { styles: { fontWeight: DT.typography.weights.bold, color }, text: `${item.score}%` }),
      ],
    });
    
    row.appendChild(header);
    const { container: bar } = GDI.createProgressBar(item.score, color, 6);
    row.appendChild(bar);
    
    scoreBars.querySelector('div').appendChild(row);
  });
  
  content.appendChild(scoreBars);
  
  // Tech stack
  if (techStack.length > 0) {
    content.appendChild(GDI.createSection('🛠️ Technologies Detected', [
      GDI.createElement('div', {
        styles: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
        children: techStack.map(tech =>
          GDI.createElement('span', {
            styles: {
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', background: 'var(--gdi-surface-tertiary)',
              borderRadius: window.DESIGN_TOKENS.radii.full, fontSize: DT.typography.sizes.sm,
              color: 'var(--gdi-text-primary)', fontWeight: DT.typography.weights.semibold,
              border: `1px solid ${'var(--gdi-border)'}`,
            },
            html: `${tech.icon} ${GDI.escapeHtml(tech.name)}`,
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
  
// ✅ NEW CODE
if (priorityItems.length > 0) {
  content.appendChild(GDI.createSection('🎯 Priority Actions', [
    GDI.createElement('div', {
      styles: { display: 'flex', flexDirection: 'column', gap: '6px' },
      children: priorityItems.map(item =>
        GDI.createElement('div', {
          styles: {
            padding: '10px 14px', background: 'var(--gdi-warning-light)',
            borderLeft: `3px solid var(--gdi-warning)`, borderRadius: window.DESIGN_TOKENS.radii.md,
            fontSize: DT.typography.sizes.base, color: 'var(--gdi-warning)',
          },
          text: `⚠️ ${item}`,
        })
      ),
    }),
  ]));
}
  
  // Export buttons
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(GDI.createButton('📋 Copy Report', () => {
    const report = `SEO Dashboard Report\n${'='.repeat(30)}\nURL: ${url}\nDomain: ${domain}\nOverall Score: ${overallScore}/100 (Grade ${getGrade(overallScore)})\n\nScore Breakdown:\n${Object.entries(scores).map(([k, v]) => `- ${k}: ${v}%`).join('\n')}\n\nQuick Stats:\n- Links: ${allLinks.length} (${internalLinks.length} internal)\n- Images: ${images.length} (${imagesWithAlt} with alt)\n- Word Count: ${wordCount}\n- Schema: ${schemaCount}`;
    GDI.copyToClipboard(report).then(() => GDI.showNotification('✅ Report copied!', 'success'));
  }, { variant: 'primary' }));
  
  btnRow.appendChild(GDI.createButton('📊 Export JSON', () => {
    const data = { url, domain, title, metaDesc, h1Text, h1Count, wordCount, images: images.length, imagesWithAlt, internalLinks: internalLinks.length, externalLinks: externalLinks.length, schemaCount, scores, overallScore, grade: getGrade(overallScore), techStack, analyzedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = blobUrl;
    a.download = `seo-report-${domain}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    GDI.showNotification('✅ JSON exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  const { close } = GDI.createModal('SEO Dashboard', content, { width: '750px' });
}

// ==================== TOOL: LOCAL CITATION FINDER ====================

function toolFindLocalCitations() {
  const content = GDI.createElement('div');
  
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
  
  content.appendChild(GDI.createToolHeader(
    '📋 Local Citation Finder',
    `Find citation opportunities for ${businessName || domain}`
  ));
  
  // Business info
  if (businessName || businessPhone || businessAddress) {
    const infoSection = GDI.createSection('🏢 Detected Business Info', [
      GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '8px' } }),
    ]);
    
    [
      { label: 'Business Name', value: businessName, id: 'citation-name' },
      { label: 'Phone', value: businessPhone, id: 'citation-phone' },
      { label: 'Address', value: businessAddress, id: 'citation-address' },
    ].forEach(field => {
      const { wrapper: fw, input: fi } = GDI.createInputField({
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
      critical: window.DESIGN_TOKENS.colors.error,
      high: window.DESIGN_TOKENS.colors.warning,
      medium: window.DESIGN_TOKENS.colors.info,
      low: 'var(--gdi-text-muted)',
    };
    
    const priorityLabels = {
      critical: '🔴 Critical',
      high: '🟡 High Priority',
      medium: '🔵 Medium Priority',
      low: '⚪ Low Priority',
    };
    
    const section = GDI.createSection(priorityLabels[priority], [
      GDI.createElement('div', {
        styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' },
        children: sources.map(source => {
          const card = GDI.createElement('div', {
            styles: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', background: 'var(--gdi-surface)',
              border: `1px solid ${'var(--gdi-border)'}`, borderRadius: window.DESIGN_TOKENS.radii.md,
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
            card.style.borderColor = 'var(--gdi-border)';
          });
          
          card.appendChild(GDI.createElement('span', {
            styles: { fontSize: DT.typography.sizes.base, fontWeight: DT.typography.weights.semibold, color: 'var(--gdi-text-primary)' },
            text: source.name,
          }));
          
          card.appendChild(GDI.createElement('span', {
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
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  btnRow.appendChild(GDI.createButton('📋 Copy Citation List', () => {
    const list = citationSources.map(s => `${s.name}: ${s.url} (${s.priority})`).join('\n');
    GDI.copyToClipboard(list).then(() => GDI.showNotification(`✅ ${citationSources.length} citations copied!`, 'success'));
  }, { variant: 'primary' }));
  
  btnRow.appendChild(GDI.createButton('📊 Export CSV', () => {
    let csv = 'Name,URL,Priority\n';
    citationSources.forEach(s => csv += `"${s.name}","${s.url}","${s.priority}"\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = `local-citations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    GDI.showNotification('✅ CSV exported!', 'success');
  }, { variant: 'secondary' }));
  
  content.appendChild(btnRow);
  
  // Tips
  content.appendChild(GDI.createSection('💡 Citation Building Tips', [
    GDI.createElement('ul', {
      styles: { margin: '0', paddingLeft: '20px', fontSize: DT.typography.sizes.base, color: 'var(--gdi-text-secondary)', lineHeight: '1.8' },
      html: `
        <li>Ensure NAP (Name, Address, Phone) consistency across all citations</li>
        <li>Start with major aggregators (Data Axle, Localeze)</li>
        <li>Prioritize industry-specific directories</li>
        <li>Complete profiles fully with photos and descriptions</li>
        <li>Monitor and respond to reviews on all platforms</li>
      `,
    }),
  ]));
  
  const { close } = GDI.createModal('Local Citation Finder', content, { width: '700px' });
}


// ==================== TOOL: COLOR THEME EXTRACTOR ====================

function toolExtractColorTheme() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '🎨 Color Theme Extractor',
    'Scanning page styles and calculating visual dominance...',
    window.DESIGN_TOKENS.colors.primaryGradient
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
    { label: 'Unique Colors', value: colorScores.size.toLocaleString(), icon: '🎨', color: window.DESIGN_TOKENS.colors.success },
  ]));

  // Swatch Grid
  const grid = GDI.createElement('div', {
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
    
    const card = GDI.createElement('div', {
      styles: {
        background: 'var(--gdi-surface)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.md,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: `all ${DT.transitions.fast}`,
        boxShadow: DT.shadows.xs
      }
    });

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = DT.shadows.md;
      card.style.borderColor = window.DESIGN_TOKENS.colors.primary;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = DT.shadows.xs;
      card.style.borderColor = 'var(--gdi-border)';
    });

    card.addEventListener('click', () => {
      GDI.copyToClipboard(hex).then(() => {
        GDI.showNotification(`✅ Copied ${hex}`, 'success');
      });
    });

    // Color Box
    const colorBox = GDI.createElement('div', {
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
      colorBox.appendChild(GDI.createElement('span', {
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
    const infoBox = GDI.createElement('div', {
      styles: { padding: '10px', textAlign: 'center' },
      children: [
        GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.md,
            fontWeight: DT.typography.weights.bold,
            fontFamily: DT.typography.fontMono,
            color: 'var(--gdi-text-primary)',
            marginBottom: '2px'
          },
          text: hex
        }),
        GDI.createElement('div', {
          styles: {
            fontSize: DT.typography.sizes.xs,
            color: 'var(--gdi-text-muted)'
          },
          text: `Used ${count} times`
        })
      ]
    });

    card.appendChild(colorBox);
    card.appendChild(infoBox);
    grid.appendChild(card);
  });

  content.appendChild(GDI.createSection('🎨 Visual Dominance Palette', [grid]));

  // Action Buttons
  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });

  btnRow.appendChild(GDI.createButton('📋 Copy All Hex Codes', () => {
    const hexList = sortedColors.map(c => c[0]).join('\n');
    GDI.copyToClipboard(hexList).then(() => GDI.showNotification(`✅ ${sortedColors.length} colors copied!`, 'success'));
  }, { variant: 'primary' }));

  btnRow.appendChild(GDI.createButton('📊 Export Palette (.txt)', () => {
    let txt = `Website Color Palette - ${window.location.hostname}\n${'='.repeat(40)}\n`;
    txt += `Sorted by visual dominance (Area Size & Usage Frequency)\n\n`;
    
    sortedColors.forEach(([hex, score], i) => {
      const timesUsed = colorCounts.get(hex);
      txt += `${i + 1}. ${hex} (Applied to ${timesUsed} elements)\n`;
    });
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = GDI.createElement('a');
    a.href = url;
    a.download = `palette-${window.location.hostname}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, { variant: 'secondary' }));

  content.appendChild(btnRow);

  const { close } = GDI.createModal('Website Color Theme', content, { width: '650px' });
}

// ==================== TOOL: TYPOGRAPHY INSPECTOR ====================

function toolExtractTypography() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '🔤 Typography Inspector',
    'Extracting and analyzing all fonts used on this page...',
    window.DESIGN_TOKENS.colors.primaryGradient
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
    { label: 'Unique Fonts', value: fonts.size, icon: '🔤', color: window.DESIGN_TOKENS.colors.primary }
  ]));

  const fontList = GDI.createElement('div', {
    styles: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }
  });

  sortedFonts.forEach(([name, data]) => {
    const card = GDI.createElement('div', {
      styles: {
        background: 'var(--gdi-surface)',
        border: `1px solid ${'var(--gdi-border)'}`,
        borderRadius: window.DESIGN_TOKENS.radii.lg,
        padding: '16px',
        boxShadow: DT.shadows.xs
      }
    });

    const header = GDI.createElement('div', {
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
      children: [
        GDI.createElement('div', {
          styles: { fontSize: '18px', fontWeight: 'bold', color: 'var(--gdi-text-primary)' },
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
        background: 'var(--gdi-surface-secondary)',
        borderRadius: window.DESIGN_TOKENS.radii.md,
        border: `1px solid ${'var(--gdi-border-light)'}`,
        color: 'var(--gdi-text-primary)',
        marginBottom: '12px',
        wordBreak: 'break-word'
      },
      text: 'The quick brown fox jumps over the lazy dog'
    });

    const details = GDI.createElement('div', {
      styles: { display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--gdi-text-secondary)' },
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

  content.appendChild(GDI.createSection('📐 Font Families', [fontList]));

  const { close } = GDI.createModal('Typography Inspector', content, { width: '700px' });
}

// ==================== TOOL: SOCIAL MEDIA CARD PREVIEW ====================

function toolSocialCardPreview() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '📱 Social Card Preview',
    'How this page looks when shared on social media',
    window.DESIGN_TOKENS.colors.primaryGradient
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
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: '8px', overflow: 'hidden',
      background: 'var(--gdi-surface)',
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
  previewContainer.appendChild(GDI.createSection('📘 Facebook / LinkedIn Preview', [fbCard]));

  // Twitter Style Card
  const twCard = GDI.createElement('div', {
    styles: {
      border: `1px solid ${'var(--gdi-border)'}`,
      borderRadius: '16px', overflow: 'hidden',
      background: 'var(--gdi-surface)',
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
      borderBottom: `1px solid ${'var(--gdi-border)'}`
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
  previewContainer.appendChild(GDI.createSection('🐦 Twitter / X Preview', [twCard]));

  content.appendChild(previewContainer);
  
  if (!ogImage || !getMeta('og:title')) {
    content.appendChild(GDI.createElement('div', {
      styles: { padding: '16px', background: window.DESIGN_TOKENS.colors.warningLight, color: '#92400E', borderRadius: window.DESIGN_TOKENS.radii.md, marginTop: '16px' },
      text: '⚠️ Warning: Missing crucial Open Graph tags. Your link may not render correctly when shared.'
    }));
  }

  const { close } = GDI.createModal('Social Card Preview', content, { width: '600px' });
}

// ==================== TOOL: BULK IMAGE DOWNLOADER (PRO) ====================

function toolImageDownloader() {
  const content = GDI.createElement('div');
  
  content.appendChild(GDI.createToolHeader(
    '🖼️ Bulk Image Downloader',
    'Extract images, backgrounds, and media from this page',
    window.DESIGN_TOKENS.colors.primaryGradient
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
      { label: 'Images Found', value: validImages.length.toString(), icon: '📸', color: window.DESIGN_TOKENS.colors.warning },
      { label: 'Selected', value: selected.toString(), icon: '☑️', color: window.DESIGN_TOKENS.colors.primary }
    ]));
  };
  updateStats();
  content.appendChild(statsContainer);

  // ─── TOOLBAR: FILTER + ACTIONS ───
  const toolbar = GDI.createElement('div', {
    styles: {
      display: 'flex', gap: '12px', marginTop: '16px', marginBottom: '12px',
      flexWrap: 'wrap', alignItems: 'center',
      padding: '12px', background: 'var(--gdi-surface)', borderRadius: window.DESIGN_TOKENS.radii.md,
      border: `1px solid ${'var(--gdi-border)'}`, position: 'sticky', top: '0', zIndex: '10'
    }
  });

  const searchInput = GDI.createElement('input', {
    attrs: { type: 'text', placeholder: '🔍 Search filenames/alt text...' },
    styles: {
      flex: '1', minWidth: '180px', padding: '8px 12px', borderRadius: window.DESIGN_TOKENS.radii.sm,
      border: `1px solid ${'var(--gdi-border)'}`, background: 'var(--gdi-surface-secondary)',
      color: 'var(--gdi-text-primary)', fontSize: '13px', outline: 'none'
    }
  });

  const minSizeSelect = GDI.createElement('select', {
    styles: {
      padding: '8px', borderRadius: window.DESIGN_TOKENS.radii.sm, border: `1px solid ${'var(--gdi-border)'}`,
      background: 'var(--gdi-surface-secondary)', color: 'var(--gdi-text-primary)', fontSize: '13px', cursor: 'pointer'
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
      padding: '8px', borderRadius: window.DESIGN_TOKENS.radii.sm, border: `1px solid ${'var(--gdi-border)'}`,
      background: 'var(--gdi-surface-secondary)', color: 'var(--gdi-text-primary)', fontSize: '13px', cursor: 'pointer'
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
        styles: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--gdi-text-secondary)', fontSize: '14px' },
        text: 'No images match your filters.'
      }));
      return;
    }

    filtered.forEach((imgData, index) => {
      const card = GDI.createElement('div', {
        styles: {
          background: 'var(--gdi-surface)',
          border: `1px solid ${imgData._selected ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-border)'}`,
          borderRadius: window.DESIGN_TOKENS.radii.md, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          boxShadow: imgData._selected ? `0 0 0 2px ${window.DESIGN_TOKENS.colors.primary}20` : 'none',
          position: 'relative'
        }
      });

      const checkbox = GDI.createElement('input', {
        attrs: { type: 'checkbox', checked: !!imgData._selected },
        styles: { position: 'absolute', top: '8px', left: '8px', zIndex: '2', width: '18px', height: '18px', cursor: 'pointer', accentColor: window.DESIGN_TOKENS.colors.primary }
      });
      checkbox.addEventListener('change', (e) => {
        imgData._selected = e.target.checked;
        renderGrid(); 
        updateStats();
      });
      card.appendChild(checkbox);

      const preview = GDI.createElement('div', {
        styles: {
          height: '130px', width: '100%', background: '#F1F5F9', borderBottom: `1px solid ${'var(--gdi-border)'}`,
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
        styles: { padding: '10px', fontSize: '11px', color: 'var(--gdi-text-secondary)', flex: '1', minHeight: '0' }
      });

      const filename = getFilename(imgData.src);
      info.appendChild(GDI.createElement('div', { 
        attrs: { title: filename },
        styles: { fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gdi-text-primary)' }, 
        text: filename 
      }));

      const metaEl = GDI.createElement('div', { styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' } });
      metaEl.appendChild(GDI.createElement('span', { text: (imgData.width && imgData.height) ? `${imgData.width}×${imgData.height}` : 'Size unknown' }));
      
      if (imgData.type !== 'img') {
        metaEl.appendChild(GDI.createElement('span', {
          text: imgData.type,
          styles: { fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '2px 6px', borderRadius: '4px', background: 'var(--gdi-border)', color: 'var(--gdi-text-secondary)' }
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
    const a = GDI.createElement('a');
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
        borderRadius: window.DESIGN_TOKENS.radii.md, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }
    });

    const caption = GDI.createElement('div', {
      styles: { color: '#fff', marginTop: '16px', fontSize: '14px', textAlign: 'center', maxWidth: '80vw', overflow: 'hidden', textOverflow: 'ellipsis' },
      text: `${getFilename(imgData.src)} ${imgData.width ? `• ${imgData.width}×${imgData.height}` : ''}`
    });

    overlay.appendChild(fullImg);
    overlay.appendChild(caption);
    overlay.classList.add('gdi-pointer-auto');
    GDI.ShadowRoot.appendChild(overlay);

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

  content.appendChild(GDI.createToolHeader(
    '🧹 Clear Site Data',
    'Selectively remove stored data for this website',
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  ));

  // Info banner
  const banner = GDI.createElement('div', {
    styles: {
      background: 'rgba(239,68,68,0.1)', border: `1px solid ${window.DESIGN_TOKENS.colors.error}`,
      borderRadius: window.DESIGN_TOKENS.radii.md, padding: '12px 16px', marginBottom: '20px',
      fontSize: '13px', color: window.DESIGN_TOKENS.colors.text, lineHeight: '1.5'
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
        padding: '14px', borderRadius: window.DESIGN_TOKENS.radii.md,
        border: `1px solid ${selected[key] ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-border)'}`,
        background: selected[key] ? `${window.DESIGN_TOKENS.colors.primary}08` : 'var(--gdi-surface)',
        cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none'
      }
    });

    const checkbox = GDI.createElement('input', {
      attrs: { type: 'checkbox', checked: selected[key] },
      styles: { width: '18px', height: '18px', marginTop: '2px', accentColor: window.DESIGN_TOKENS.colors.primary, cursor: 'pointer' }
    });

    const textWrap = GDI.createElement('div', { styles: { flex: '1' } });
    const title = GDI.createElement('div', { 
      styles: { fontWeight: '600', fontSize: '14px', color: window.DESIGN_TOKENS.colors.text, marginBottom: '2px' },
      text: `${icon} ${label}` 
    });
    const desc = GDI.createElement('div', { 
      styles: { fontSize: '12px', color: 'var(--gdi-text-secondary)', lineHeight: '1.4' },
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
      row.style.borderColor = selected[key] ? window.DESIGN_TOKENS.colors.primary : 'var(--gdi-border)';
      row.style.background = selected[key] ? `${window.DESIGN_TOKENS.colors.primary}08` : 'var(--gdi-surface)';
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
      padding: '12px', borderRadius: window.DESIGN_TOKENS.radii.sm,
      background: 'var(--gdi-surface)', border: `1px solid ${'var(--gdi-border)'}`,
      cursor: 'pointer', marginBottom: '20px', userSelect: 'none'
    }
  });
  const reloadCheckbox = GDI.createElement('input', {
    attrs: { type: 'checkbox', checked: selected.reload },
    styles: { width: '16px', height: '16px', accentColor: window.DESIGN_TOKENS.colors.primary, cursor: 'pointer' }
  });
  reloadWrap.appendChild(reloadCheckbox);
  reloadWrap.appendChild(GDI.createElement('span', {
    styles: { fontSize: '13px', color: window.DESIGN_TOKENS.colors.text },
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
      background: '#0F172A', borderRadius: window.DESIGN_TOKENS.radii.md, padding: '14px',
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

  content.appendChild(GDI.createToolHeader(
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
      padding: '24px', background: 'var(--gdi-surface-secondary)', borderRadius: window.DESIGN_TOKENS.radii.lg,
      border: `1px solid ${'var(--gdi-border)'}`
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
      styles: { fontWeight: DT.typography.weights.bold, color: 'var(--gdi-text-primary)', fontSize: '14px' },
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
      styles: { marginTop: '16px', fontSize: '12px', color: 'var(--gdi-text-muted)', fontFamily: DT.typography.fontMono, fontWeight: 'bold' },
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
    styles: { marginTop: '8px', fontSize: '12px', color: 'var(--gdi-text-muted)', textAlign: 'center', background: window.DESIGN_TOKENS.colors.warningLight, color: '#92400E', padding: '10px', borderRadius: window.DESIGN_TOKENS.radii.md }
  });
  footer.innerHTML = '<strong>Note:</strong> If the frames refuse to load, the website has strict <code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 4px;">X-Frame-Options</code> security enabled. Use the <strong>Pop Out</strong> buttons instead.';
  content.appendChild(footer);

  const { close } = GDI.createModal('Multi-Device Emulator', content, { width: '95vw', maxWidth: '1400px' });
}


// ==================== TOOL: BULK CURRENCY CONVERTER ====================

function toolBulkCurrencyConverter() {
  const content = GDI.createElement('div');

  content.appendChild(GDI.createToolHeader(
    '💱 Bulk Currency Converter',
    'Paste a list of numbers to convert them instantly',
    'linear-gradient(135deg, #10B981 0%, #047857 100%)'
  ));

  const currencies = [
    { value: 'usd', label: 'USD - US Dollar' },
    { value: 'eur', label: 'EUR - Euro' },
    { value: 'gbp', label: 'GBP - British Pound' },
    { value: 'php', label: 'PHP - Philippine Peso' },
    { value: 'aud', label: 'AUD - Australian Dollar' },
    { value: 'cad', label: 'CAD - Canadian Dollar' },
    { value: 'sgd', label: 'SGD - Singapore Dollar' },
    { value: 'jpy', label: 'JPY - Japanese Yen' },
    { value: 'inr', label: 'INR - Indian Rupee' },
    { value: 'cny', label: 'CNY - Chinese Yuan' }
  ];

  // --- Configuration Section ---
  const configRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }
  });

  const fromSelect = GDI.createSelect({ label: 'From Currency', id: 'bcc-from', options: currencies, defaultValue: 'usd' });
  const toSelect = GDI.createSelect({ label: 'To Currency', id: 'bcc-to', options: currencies, defaultValue: 'php' });
  
  fromSelect.wrapper.style.flex = '1';
  toSelect.wrapper.style.flex = '1';

  const rateInput = GDI.createInputField({
    label: 'Exchange Rate',
    id: 'bcc-rate',
    type: 'number',
    placeholder: 'e.g., 55.50'
  });
  rateInput.wrapper.style.flex = '1';

  configRow.appendChild(fromSelect.wrapper);
  configRow.appendChild(toSelect.wrapper);
  configRow.appendChild(rateInput.wrapper);

  // Fetch Live Rates Button
  const fetchRow = GDI.createElement('div', { styles: { display: 'flex', gap: '12px', marginBottom: '20px' }});
  const fetchBtn = GDI.createButton('🔄 Fetch Live Rate', async () => {
    const from = fromSelect.select.value;
    const to = toSelect.select.value;
    fetchBtn.textContent = '⏳ Fetching...';
    
    try {
      // Using a highly reliable, free CDN API for currency rates
      const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const rate = data[from][to];
      
      rateInput.input.value = rate.toFixed(4);
      GDI.showNotification(`Live rate applied: 1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}`, 'success');
      processConversion();
    } catch (err) {
      GDI.showNotification('Failed to fetch live rates. Please enter manually.', 'error');
    } finally {
      fetchBtn.textContent = '🔄 Fetch Live Rate';
    }
  }, { variant: 'secondary', size: 'sm', fullWidth: false });

  fetchRow.appendChild(fetchBtn);
  
  content.appendChild(GDI.createSection('⚙️ Conversion Settings', [configRow, fetchRow]));

  // --- Input & Output Section ---
  const textRow = GDI.createElement('div', {
    styles: { display: 'flex', gap: '16px', flexWrap: 'wrap' }
  });

  const inputArea = GDI.createTextarea({
    label: 'Input Amounts (one per line)',
    id: 'bcc-input',
    placeholder: '100\n250.50\n1,000',
    rows: 10
  });
  inputArea.wrapper.style.flex = '1';
  inputArea.wrapper.style.minWidth = '250px';

  const outputArea = GDI.createTextarea({
    label: 'Converted Amounts',
    id: 'bcc-output',
    placeholder: 'Results will appear here...',
    rows: 10
  });
  outputArea.textarea.setAttribute('readonly', 'true');
  outputArea.textarea.style.background = GDI.ThemeEngine.token('colors.surfaceSecondary');
  outputArea.wrapper.style.flex = '1';
  outputArea.wrapper.style.minWidth = '250px';

  textRow.appendChild(inputArea.wrapper);
  textRow.appendChild(outputArea.wrapper);
  
  content.appendChild(GDI.createSection('📝 Data Entry', [textRow]));

  // --- Logic ---
  function processConversion() {
    const rate = parseFloat(rateInput.input.value);
    if (isNaN(rate) || rate <= 0) {
      outputArea.textarea.value = '';
      return;
    }

    const rawText = inputArea.textarea.value;
    const lines = rawText.split('\n');
    
    const results = lines.map(line => {
      if (!line.trim()) return '';
      // Extract the first valid number from the line (ignores currency symbols, handles commas)
      const match = line.match(/[\d,]+(\.\d+)?/);
      if (!match) return line; // Return original text if no number found
      
      const num = parseFloat(match[0].replace(/,/g, ''));
      if (isNaN(num)) return line;
      
      return (num * rate).toFixed(2);
    });

    outputArea.textarea.value = results.join('\n');
  }

  inputArea.textarea.addEventListener('input', processConversion);
  rateInput.input.addEventListener('input', processConversion);
  fromSelect.select.addEventListener('change', () => rateInput.input.value = '');
  toSelect.select.addEventListener('change', () => rateInput.input.value = '');

  // --- Actions ---
  const actionRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  
  actionRow.appendChild(GDI.createButton('📋 Copy Results', () => {
    if (!outputArea.textarea.value.trim()) return;
    GDI.copyToClipboard(outputArea.textarea.value).then(() => {
      GDI.showNotification('✅ Converted amounts copied!', 'success');
    });
  }, { variant: 'primary' }));

  content.appendChild(actionRow);

  GDI.createModal('Bulk Currency Converter', content, { width: '750px' });
}

// ==================== TOOL: CUSTOM TEMPLATE (DYNAMIC) ====================

function toolCustomTemplate(templateId, settings = {}, templates = {}) {
  const template = templates[templateId];
  if (!template) {
    GDI.showNotification('Template not found!', 'error');
    return;
  }

  const content = GDI.createElement('div');
  content.appendChild(GDI.createToolHeader(
    '📋 ' + template.name,
    template.description || 'Fill in the details to generate your email',
    window.DESIGN_TOKENS.colors.primaryGradient
  ));

  const varRegex = /\{\{([^}]+)\}\}/g;
  let match;
  const variables = new Set();
  while ((match = varRegex.exec(template.content)) !== null) {
    variables.add(match[1]);
  }

  const inputs = {};
  if (variables.size > 0) {
    const formSection = GDI.createSection('📝 Variables', [
      GDI.createElement('div', { styles: { display: 'flex', flexDirection: 'column', gap: '12px' } })
    ]);
    
    variables.forEach(v => {
      let def = '';
      if (v === 'yourName') def = settings.userName || '';
      if (v === 'amount') def = settings.defaultAmount || '';
      if (v === 'currency') def = settings.defaultCurrency || '';
      if (v === 'website') def = window.location.hostname.replace(/^www\./, '');
      
      const { wrapper, input } = GDI.createInputField({
        label: v.charAt(0).toUpperCase() + v.slice(1).replace(/([A-Z])/g, ' $1'),
        id: 'var-' + v,
        defaultValue: def
      });
      formSection.querySelector('div').appendChild(wrapper);
      inputs[v] = input;
    });
    content.appendChild(formSection);
  }

  const previewSection = GDI.createSection('👁️ Preview', [
    GDI.createElement('div', {
      attrs: { id: 'custom-preview' },
      styles: { padding: '16px', background: 'var(--gdi-surface-secondary)', borderRadius: window.DESIGN_TOKENS.radii.md, whiteSpace: 'pre-wrap', fontSize: DT.typography.sizes.base, border: `1px solid ${'var(--gdi-border)'}`, color: 'var(--gdi-text-primary)', minHeight: '100px' }
    })
  ]);
  content.appendChild(previewSection);

  function updatePreview() {
    let text = template.content;
    variables.forEach(v => {
      const val = inputs[v] ? inputs[v].value : '';
      text = text.replace(new RegExp('\\{\\{' + v + '\\}\\}', 'g'), val);
    });
    const previewEl = document.getElementById('custom-preview') || content.querySelector('#custom-preview');
    if(previewEl) previewEl.textContent = text;
  }

  Object.values(inputs).forEach(input => input.addEventListener('input', updatePreview));
  setTimeout(updatePreview, 100);

  const btnRow = GDI.createElement('div', { styles: { display: 'flex', gap: '10px', marginTop: '16px' } });
  btnRow.appendChild(GDI.createButton('📋 Copy Email', () => {
    const previewEl = document.getElementById('custom-preview') || content.querySelector('#custom-preview');
    GDI.copyToClipboard(previewEl.textContent).then(() => GDI.showNotification('✅ Email copied!', 'success'));
  }, { variant: 'primary' }));
  
  content.appendChild(btnRow);
  GDI.createModal(template.name, content, { width: '600px' });
}

// ==================== EXPORT ====================

    Object.assign(window.SEOTools, {
      toolCustomTemplate,
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
      toolExtractColorTheme, 
      toolExtractTypography, toolSocialCardPreview, toolImageDownloader,
      toolClearSiteData, toolMultiDeviceTester, toolBulkCurrencyConverter
    });
    
  })();
}
