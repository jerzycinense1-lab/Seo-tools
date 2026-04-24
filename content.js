// GDI SEO Tools Pro - Content Script (Enhanced)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const action = request.action;
  const settings = request.settings || {};
  const templates = request.templates || {};
  
  try {
    switch(action) {
      case 'urlslug':
        generateUrlSlug();
        sendResponse({ success: true, message: 'URL Slug generated!' });
        break;
      
      case 'whatsapp-link':
        generateWhatsappLink();
        sendResponse({ success: true, message: 'WhatsApp link generated!' });
        break;
      
      case 'scroll':
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        sendResponse({ success: true, message: 'Scrolled to bottom!' });
        break;
      
      case 'copy-url':
        copyToClipboard(window.location.href);
        sendResponse({ success: true, message: 'URL copied!' });
        break;
      
      case 'copy-domain':
        const domain = window.location.hostname.replace(/^www\./, '');
        copyToClipboard(domain);
        sendResponse({ success: true, message: 'Domain copied!' });
        break;
      
      case 'email-extract':
        extractEmails();
        sendResponse({ success: true, message: 'Emails extracted!' });
        break;
      
      case 'social-extract':
        extractSocialLinks();
        sendResponse({ success: true, message: 'Social links extracted!' });
        break;
      
      case 'linkextract':
        extractLinks();
        sendResponse({ success: true, message: 'Links extracted!' });
        break;
      
      case 'domainextract':
        extractDomains();
        sendResponse({ success: true, message: 'Domains extracted!' });
        break;
      
      case 'googledomain':
        extractGoogleDomains();
        sendResponse({ success: true, message: 'Google domains extracted!' });
        break;
      
      case 'blogs':
        findBlogPage();
        sendResponse({ success: true, message: 'Searching for blog page...' });
        break;
      
      case 'guestpost':
        findGuestPostPages();
        sendResponse({ success: true, message: 'Searching for guest post pages...' });
        break;
      
      case 'contact-form':
        fillContactForm(settings);
        sendResponse({ success: true, message: 'Contact form filled!' });
        break;
      
      case 'searchoperators':
        showSearchOperators();
        sendResponse({ success: true, message: 'Search operators opened!' });
        break;
      
      case 'nextpage':
        goToNextPage();
        sendResponse({ success: true, message: 'Navigating to next page...' });
        break;
      
      case 'advance-payment':
        showPaymentForm('advance', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'payment-paypal':
        showPaymentForm('paypal', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'payment-gcash':
        showPaymentForm('gcash', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'send-article':
        showArticleForm('full', settings, templates);
        sendResponse({ success: true, message: 'Article form opened!' });
        break;
      
      case 'send-quick-article':
        showArticleForm('quick', settings, templates);
        sendResponse({ success: true, message: 'Quick article form opened!' });
        break;
      
      case 'article-followup':
        showFollowupForm(1, settings, templates);
        sendResponse({ success: true, message: 'Follow-up form opened!' });
        break;
      
      case 'second-followup':
        showFollowupForm(2, settings, templates);
        sendResponse({ success: true, message: '2nd follow-up opened!' });
        break;
      
      case 'final-notice':
        showFollowupForm('final', settings, templates);
        sendResponse({ success: true, message: 'Final notice opened!' });
        break;
      
      case 'cancel':
        showCancelForm(settings, templates);
        sendResponse({ success: true, message: 'Cancellation form opened!' });
        break;
      
      case 'declined':
        copyDeclinedTemplate(settings, templates);
        sendResponse({ success: true, message: 'Declined template copied!' });
        break;
      
      case 'send-invoice':
        showInvoiceForm(settings, templates);
        sendResponse({ success: true, message: 'Invoice form opened!' });
        break;
      
      case 'email-outreach':
        showOutreachTemplates(settings, templates);
        sendResponse({ success: true, message: 'Outreach templates loaded!' });
        break;
      
      case 'nego':
        showNegoTemplates(settings, templates);
        sendResponse({ success: true, message: 'Negotiation templates loaded!' });
        break;
      
      case 'highlight-dofollow':
  highlightDoFollowLinks();
  sendResponse({ success: true, message: 'Do-follow links highlighted in green!' });
  break;

case 'remove-highlights':
  removeHighlights();
  sendResponse({ success: true, message: 'Highlights removed!' });
  break;

case 'analyze-headings':
  analyzeHeadings();
  sendResponse({ success: true, message: 'Heading analysis opened!' });
  break;

case 'analyze-meta':
  analyzeMetaTags();
  sendResponse({ success: true, message: 'Meta tags analysis opened!' });
  break;

case 'analyze-images':
  analyzeImages();
  sendResponse({ success: true, message: 'Images analysis opened!' });
  break;

case 'analyze-links':
  analyzeLinks();
  sendResponse({ success: true, message: 'Links analysis opened!' });
  break;

case 'pagespeed':
  checkPageSpeed();
  sendResponse({ success: true, message: 'Opening PageSpeed Insights...' });
  break;

case 'mobile-friendly':
  checkMobileFriendly();
  sendResponse({ success: true, message: 'Opening Mobile-Friendly Test...' });
  break;

case 'structured-data':
  checkStructuredData();
  sendResponse({ success: true, message: 'Structured data analysis opened!' });
  break;

case 'robots-txt':
  checkRobotsTxt();
  sendResponse({ success: true, message: 'Opening robots.txt...' });
  break;

case 'sitemap':
  checkSitemap();
  sendResponse({ success: true, message: 'Checking sitemap...' });
  break;

case 'analyze-content':
  analyzeContent();
  sendResponse({ success: true, message: 'Content analysis opened!' });
  break;

case 'export-seo-data':
  exportSEOData();
  sendResponse({ success: true, message: 'SEO data exported!' });
  break;
case 'keyword-rank-tracker':
  keywordRankTracker();
  sendResponse({ success: true, message: 'Keyword rank tracker started!' });
  break;
  case 'advanced-text-compare':
  advancedSEOCompare();
  sendResponse({ success: true, message: 'Advanced SEO text compare opened!' });
  break;
  case 'image-toolkit':
  advancedImageToolkit();
  sendResponse({ success: true, message: 'Advanced Image Toolkit opened!' });
  break;

case 'alt-generator':
  generateAltText();
  sendResponse({ success: true, message: 'Alt text suggestions ready!' });
  break;
  case 'ai-meta-generator':
  generateAIMetaTags();
  sendResponse({ success: true, message: 'AI Meta tags generated!' });
  break;

case 'url-optimizer':
  optimizeUrl();
  sendResponse({ success: true, message: 'URL optimization complete!' });
  break;

case 'title-generator':
  generateSEOTitles();
  sendResponse({ success: true, message: 'SEO titles generated!' });
  break;
case 'alt-generator':
  generateAltText();
  sendResponse({ success: true, message: 'Alt text suggestions ready!' });
  break;
  case 'link-prospects':
  findLinkProspects();
  sendResponse({ success: true, message: 'Link prospect search ready!' });
  break;

case 'resource-pages':
  findResourcePages();
  sendResponse({ success: true, message: 'Resource page search ready!' });
  break;

case 'seo-audit-checklist':
  showSEOAuditChecklist();
  sendResponse({ success: true, message: 'SEO Audit Checklist opened!' });
  break;
case 'audit-checklist':
  showAuditChecklist();
  sendResponse({ success: true, message: 'SEO audit checklist opened!' });
  break;
case 'ai-topic-generator':
  generateAITopics();
  sendResponse({ success: true, message: 'AI topics generated!' });
  break;

case 'local-keyword-finder':
  findLocalKeywords();
  sendResponse({ success: true, message: 'Local keywords found!' });
  break;

case 'hreflang-generator':
  generateHreflang();
  sendResponse({ success: true, message: 'Hreflang tags generated!' });
  break;
  case 'pubdate-checker':
  checkPublicationDate();
  sendResponse({ success: true, message: 'Publication date analysis complete!' });
  break;

case 'mobile-usability':
  testMobileUsability();
  sendResponse({ success: true, message: 'Mobile usability test complete!' });
  break;

case 'duplicate-content':
  findDuplicateContent();
  sendResponse({ success: true, message: 'Duplicate content analysis complete!' });
  break;

case 'site-structure':
  visualizeSiteStructure();
  sendResponse({ success: true, message: 'Site structure generated!' });
  break;

case 'maps-scraper':
  scrapeGoogleMaps();
  sendResponse({ success: true, message: 'Google Maps scraper ready!' });
  break;

case 'citation-finder':
  findLocalCitations();
  sendResponse({ success: true, message: 'Citation opportunities found!' });
  break;

case 'seo-dashboard':
  showSEODashboard();
  sendResponse({ success: true, message: 'SEO Dashboard opened!' });
  break;
      // --- NEW FEATURES ADDED HERE ---
      case 'keyword-density':
        analyzeKeywordDensity();
        sendResponse({ success: true, message: 'Keyword density analysis opened!' });
        break;
      
      case 'serp-preview':
        showSerpPreview();
        sendResponse({ success: true, message: 'SERP Preview opened!' });
        break;
      
      case 'broken-links':
        checkBrokenLinks();
        sendResponse({ success: true, message: 'Checking broken links... This may take a moment.' });
        break;
        // Add this inside your switch(action) block
      case 'full-page-capture':
        captureFullPage();
        sendResponse({ success: true, message: 'Starting full page capture...' });
        break;
      case 'bulk-google-domains':
        extractBulkGoogleDomains();
        sendResponse({ success: true, message: 'Starting Deep Google Domain Extraction...' });
        break;
      // -------------------------------
      case 'metrics':
        showMetricsModal();
        sendResponse({ success: true, message: 'Metrics tools opened!' });
        break;
      
      // Productivity Tools
      case 'screenshot':
        captureScreenshot();
        sendResponse({ success: true, message: 'Screenshot captured!' });
        break;
      
      case 'color-picker':
        activateColorPicker();
        sendResponse({ success: true, message: 'Color picker activated! Click any element to pick color.' });
        break;
      
      case 'notes':
        openQuickNotes();
        sendResponse({ success: true, message: 'Quick notes opened!' });
        break;
      
      case 'qr-generator':
        generateQRCode();
        sendResponse({ success: true, message: 'QR Code generated!' });
        break;
      
      case 'text-case':
        openTextCaseConverter();
        sendResponse({ success: true, message: 'Text case converter opened!' });
        break;
      
      case 'word-counter':
        countWords();
        sendResponse({ success: true, message: 'Word count completed!' });
        break;
      
      case 'timer':
        openFocusTimer();
        sendResponse({ success: true, message: 'Focus timer opened!' });
        break;
      
      case 'lorem-ipsum':
        generateLoremIpsum();
        sendResponse({ success: true, message: 'Lorem Ipsum text generated!' });
        break;
      
      default:
        sendResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ success: false, message: error.message });
  }
  
  return true;
});


// ================================
// Productivity Tools Functions
// ================================

// Screenshot Tool
function captureScreenshot() {
  chrome.runtime.sendMessage({ action: 'captureScreenshot' }, (response) => {
    if (response && response.success) {
      showToolNotification('Screenshot captured and downloaded!', 'success');
    } else {
      showToolNotification('Screenshot failed. Please try again.', 'error');
    }
  });
}

// Color Picker
function activateColorPicker() {
  const overlay = document.createElement('div');
  overlay.id = 'color-picker-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999999;
    cursor: crosshair;
  `;
  
  const info = document.createElement('div');
  info.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 1000000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  info.textContent = 'Click anywhere to pick a color (ESC to cancel)';
  overlay.appendChild(info);
  document.body.appendChild(overlay);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element !== overlay && element !== info) {
      const color = window.getComputedStyle(element).backgroundColor;
      const rgb = color.match(/\d+/g);
      let hex = '#';
      if (rgb) {
        hex = '#' + rgb.slice(0, 3).map(x => {
          const h = parseInt(x).toString(16);
          return h.length === 1 ? '0' + h : h;
        }).join('');
      }
      
      copyToClipboard(hex);
      showToolNotification(`Color ${hex} copied to clipboard!`, 'success');
      removeColorPicker();
    }
  };
  
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      removeColorPicker();
    }
  };
  
  overlay.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  
  function removeColorPicker() {
    overlay.remove();
    document.removeEventListener('keydown', handleKeydown);
  }
}

// Quick Notes
function openQuickNotes() {
  const existingNotes = document.getElementById('quick-notes-modal');
  if (existingNotes) {
    existingNotes.remove();
    return;
  }
  
  const savedNote = localStorage.getItem('quickNotes') || '';
  
  const modal = document.createElement('div');
  modal.id = 'quick-notes-modal';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    min-width: 400px;
    max-width: 600px;
  `;
  
  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #333;">📝 Quick Notes</h3>
      <button id="close-notes" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
    </div>
    <textarea id="notes-textarea" style="width: 100%; min-height: 300px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: monospace; font-size: 14px; resize: vertical;" placeholder="Type your notes here...">${savedNote}</textarea>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="save-notes" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">💾 Save</button>
      <button id="clear-notes" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">🗑️ Clear</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('close-notes').addEventListener('click', () => modal.remove());
  document.getElementById('save-notes').addEventListener('click', () => {
    const noteText = document.getElementById('notes-textarea').value;
    localStorage.setItem('quickNotes', noteText);
    showToolNotification('Notes saved!', 'success');
  });
  document.getElementById('clear-notes').addEventListener('click', () => {
    document.getElementById('notes-textarea').value = '';
    localStorage.removeItem('quickNotes');
    showToolNotification('Notes cleared!', 'success');
  });
  
  // Close on ESC
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// QR Code Generator
function generateQRCode() {
  const url = window.location.href;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    text-align: center;
  `;
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #333;">📱 QR Code for Current Page</h3>
    <img src="${qrApiUrl}" alt="QR Code" style="max-width: 300px; border: 1px solid #ddd; padding: 10px; border-radius: 8px;">
    <p style="color: #666; font-size: 14px; margin: 15px 0 5px 0;">${url}</p>
    <button id="close-qr" style="margin-top: 15px; background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">Close</button>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('close-qr').addEventListener('click', () => modal.remove());
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Text Case Converter
function openTextCaseConverter() {
  const selectedText = window.getSelection().toString();
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    min-width: 500px;
  `;
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #333;">🔤 Text Case Converter</h3>
    <textarea id="case-input" style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Enter or paste text here...">${selectedText}</textarea>
    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
      <button data-case="upper" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">UPPERCASE</button>
      <button data-case="lower" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">lowercase</button>
      <button data-case="title" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Title Case</button>
      <button data-case="sentence" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Sentence case</button>
      <button data-case="alternating" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">aLtErNaTiNg</button>
      <button data-case="reverse" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">ɘʇɒvɿɘᴎ moC</button>
    </div>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="copy-case" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">📋 Copy</button>
      <button id="close-case" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const textarea = document.getElementById('case-input');
  
  modal.querySelectorAll('[data-case]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = textarea.value;
      const caseType = btn.dataset.case;
      let converted = text;
      
      switch(caseType) {
        case 'upper':
          converted = text.toUpperCase();
          break;
        case 'lower':
          converted = text.toLowerCase();
          break;
        case 'title':
          converted = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
          break;
        case 'sentence':
          converted = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
          break;
        case 'alternating':
          converted = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
          break;
        case 'reverse':
          converted = text.split('').reverse().join('');
          break;
      }
      
      textarea.value = converted;
    });
  });
  
  document.getElementById('copy-case').addEventListener('click', () => {
    copyToClipboard(textarea.value);
    showToolNotification('Text copied!', 'success');
  });
  
  document.getElementById('close-case').addEventListener('click', () => modal.remove());
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Word Counter
function countWords() {
  const selectedText = window.getSelection().toString();
  const bodyText = document.body.innerText;
  
  const textToCount = selectedText || bodyText;
  const words = textToCount.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = textToCount.length;
  const charactersNoSpaces = textToCount.replace(/\s/g, '').length;
  const sentences = textToCount.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = textToCount.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    min-width: 350px;
  `;
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 20px 0; color: #333;">📊 Word Count</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #2196F3;">${words.length}</div>
        <div style="color: #666; font-size: 14px;">Words</div>
      </div>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #4CAF50;">${characters}</div>
        <div style="color: #666; font-size: 14px;">Characters</div>
      </div>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #FF9800;">${charactersNoSpaces}</div>
        <div style="color: #666; font-size: 14px;">Chars (no spaces)</div>
      </div>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #9C27B0;">${sentences}</div>
        <div style="color: #666; font-size: 14px;">Sentences</div>
      </div>
    </div>
    <div style="margin-top: 15px; text-align: center; color: #666; font-size: 14px;">
      Paragraphs: <strong>${paragraphs}</strong> | 
      Avg. word length: <strong>${words.length > 0 ? (textToCount.replace(/\s/g, '').length / words.length).toFixed(1) : 0}</strong> chars
    </div>
    <button id="close-wordcount" style="margin-top: 20px; background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">Close</button>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('close-wordcount').addEventListener('click', () => modal.remove());
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Focus Timer
function openFocusTimer() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    text-align: center;
    min-width: 300px;
  `;
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 20px 0; color: #333;">⏱️ Focus Timer</h3>
    <div style="font-size: 64px; font-weight: bold; color: #2196F3; font-family: monospace;" id="timer-display">25:00</div>
    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
      <button id="start-timer" style="background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">▶️ Start</button>
      <button id="pause-timer" style="background: #FF9800; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;" disabled>⏸️ Pause</button>
      <button id="reset-timer" style="background: #f44336; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">🔄 Reset</button>
    </div>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
      <button data-minutes="15" class="preset-btn" style="background: #e0e0e0; color: #333; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">15 min</button>
      <button data-minutes="25" class="preset-btn" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">25 min</button>
      <button data-minutes="45" class="preset-btn" style="background: #e0e0e0; color: #333; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">45 min</button>
      <button data-minutes="60" class="preset-btn" style="background: #e0e0e0; color: #333; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">60 min</button>
    </div>
    <button id="close-timer" style="margin-top: 20px; background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Close</button>
  `;
  
  document.body.appendChild(modal);
  
  let timeLeft = 25 * 60;
  let timerId = null;
  let isRunning = false;
  
  const display = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    timerId = setInterval(() => {
      timeLeft--;
      updateDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timerId);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Play notification sound or show alert
        const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==');
        audio.play().catch(() => {});
        
        showToolNotification('⏰ Timer finished! Take a break!', 'success');
        document.title = '⏰ Timer Done!';
        setTimeout(() => {
          document.title = document.title.replace('⏰ Timer Done! ', '');
        }, 5000);
      }
    }, 1000);
  }
  
  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerId);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
  
  function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    updateDisplay();
  }
  
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  modal.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.dataset.minutes);
      timeLeft = minutes * 60;
      updateDisplay();
      pauseTimer();
      
      modal.querySelectorAll('.preset-btn').forEach(b => b.style.background = '#e0e0e0');
      modal.querySelectorAll('.preset-btn').forEach(b => b.style.color = '#333');
      btn.style.background = '#2196F3';
      btn.style.color = 'white';
    });
  });
  
  document.getElementById('close-timer').addEventListener('click', () => {
    pauseTimer();
    modal.remove();
  });
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      pauseTimer();
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Lorem Ipsum Generator
function generateLoremIpsum() {
  const paragraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
  ];
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    min-width: 500px;
  `;
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #333;">📄 Lorem Ipsum Generator</h3>
    <div style="margin-bottom: 15px;">
      <label style="display: inline-block; margin-right: 10px;">Paragraphs:</label>
      <input type="number" id="lorem-count" min="1" max="20" value="3" style="width: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      <button id="generate-lorem" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-left: 10px;">Generate</button>
    </div>
    <textarea id="lorem-output" readonly style="width: 100%; min-height: 200px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="copy-lorem" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">📋 Copy</button>
      <button id="close-lorem" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const output = document.getElementById('lorem-output');
  const countInput = document.getElementById('lorem-count');
  
  function generate() {
    const count = Math.min(20, Math.max(1, parseInt(countInput.value) || 3));
    let result = [];
    for (let i = 0; i < count; i++) {
      const randomStart = Math.floor(Math.random() * paragraphs.length);
      result.push(paragraphs[randomStart]);
    }
    output.value = result.join('\n\n');
  }
  
  document.getElementById('generate-lorem').addEventListener('click', generate);
  document.getElementById('copy-lorem').addEventListener('click', () => {
    copyToClipboard(output.value);
    showToolNotification('Lorem Ipsum copied!', 'success');
  });
  document.getElementById('close-lorem').addEventListener('click', () => modal.remove());
  
  // Generate initial text
  generate();
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Helper function for tool notifications
function showToolNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


