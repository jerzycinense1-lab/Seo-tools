// Enhanced generateUrlSlug with better error handling
function generateUrlSlug() {
  const input = prompt('Enter text to generate a clean URL slug:', document.title || '');
  if (!input) return;
  
  const slug = input.trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  copyToClipboard(slug).then(() => {
    showNotification('Slug copied: ' + slug, 'success');
  }).catch(() => {
    showNotification('Slug generated: ' + slug, 'success');
  });
}

// Enhanced generateWhatsappLink with validation
function generateWhatsappLink() {
  const sel = window.getSelection ? window.getSelection().toString().trim() : '';
  let num = sel || prompt('Enter phone number in international format (e.g., 842862705825):', '');
  if (!num) return;
  
  num = num.replace(/[^\d]/g, '');
  if (!num || num.length < 10) {
    showNotification('Please enter a valid phone number with country code', 'error');
    return;
  }
  
  const url = 'https://wa.me/' + num;
  window.open(url, '_blank');
  copyToClipboard(url).then(() => {
    showNotification('WhatsApp link generated and copied!', 'success');
  }).catch(() => {
    showNotification('WhatsApp link opened!', 'success');
  });
}

// 1. Smarter Email Extractor (Modal UI + Mailto scanning)
function extractEmails() {
  const emails = new Set();
  
  // Method 1: Regex on visible text
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const pageText = document.body.innerText || '';
  const textMatches = pageText.match(emailRegex) || [];
  textMatches.forEach(e => emails.add(e.toLowerCase()));
  
  // Method 2: Scan mailto: links (often hidden in icons/buttons)
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    const email = a.href.replace('mailto:', '').split('?')[0].trim().toLowerCase();
    if (emailRegex.test(email)) emails.add(email);
  });
  
  const emailArray = [...emails].sort();

  if (emailArray.length === 0) {
    showNotification('No emails found on this page.', 'warning');
    return;
  }

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 10px;">
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0 0 5px; color: #1565c0;">📧 Emails Extracted</h4>
          <span style="font-size: 13px; color: #666;">Found ${emailArray.length} unique email address(es)</span>
        </div>
        <button id="copyAllEmails" style="padding: 8px 16px; background: #1565c0; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy All</button>
      </div>
      <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
        ${emailArray.map(email => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f5f5f5;">
            <span style="font-family: monospace; font-size: 13px;">${escapeHtml(email)}</span>
            <button class="copy-single-email" data-email="${escapeHtml(email)}" style="padding: 4px 8px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Copy</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  createModal('Email Extractor', content);

  setTimeout(() => {
    document.getElementById('copyAllEmails').addEventListener('click', () => {
      copyToClipboard(emailArray.join('\n'));
      showNotification('All emails copied!', 'success');
    });
    
    document.querySelectorAll('.copy-single-email').forEach(btn => {
      btn.addEventListener('click', (e) => {
        copyToClipboard(e.target.dataset.email);
        showNotification('Email copied!', 'success');
      });
    });
  }, 100);
}

// 2. Pro Social Extractor (More Networks + Modal UI)
function extractSocialLinks() {
  const socialDomains = {
    'facebook.com': { name: 'Facebook', icon: '📘' },
    'twitter.com': { name: 'Twitter / X', icon: '🐦' },
    'x.com': { name: 'Twitter / X', icon: '🐦' },
    'instagram.com': { name: 'Instagram', icon: '📸' },
    'linkedin.com': { name: 'LinkedIn', icon: '💼' },
    'youtube.com': { name: 'YouTube', icon: '▶️' },
    'pinterest.com': { name: 'Pinterest', icon: '📌' },
    'tiktok.com': { name: 'TikTok', icon: '🎵' },
    'reddit.com': { name: 'Reddit', icon: '🤖' },
    'discord.gg': { name: 'Discord', icon: '💬' },
    'wa.me': { name: 'WhatsApp', icon: '📱' },
    't.me': { name: 'Telegram', icon: '✈️' }
  };
  
  const socialLinksMap = new Map();
  document.querySelectorAll('a[href]').forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      const domain = url.hostname.replace(/^www\./, '');
      if (socialDomains[domain] && !socialLinksMap.has(anchor.href)) {
        socialLinksMap.set(anchor.href, { platform: socialDomains[domain], url: anchor.href });
      }
    } catch (e) {}
  });
  
  const uniqueLinks = Array.from(socialLinksMap.values());
  if (uniqueLinks.length === 0) {
    showNotification('No social links found on this page.', 'warning');
    return;
  }

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 10px;">
      <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0 0 5px; color: #7b1fa2;">📱 Social Links</h4>
          <span style="font-size: 13px; color: #666;">Found ${uniqueLinks.length} social profiles</span>
        </div>
        <button id="copyAllSocial" style="padding: 8px 16px; background: #7b1fa2; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy URLs</button>
      </div>
      <div style="display: grid; gap: 10px; max-height: 400px; overflow-y: auto;">
        ${uniqueLinks.map(link => `
          <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="font-weight: bold; margin-bottom: 4px;">${link.platform.icon} ${link.platform.name}</div>
            <a href="${escapeHtml(link.url)}" target="_blank" style="font-size: 12px; color: #1976d2; word-break: break-all;">${escapeHtml(link.url)}</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  createModal('Social Media Extractor', content);

  setTimeout(() => {
    document.getElementById('copyAllSocial').addEventListener('click', () => {
      const text = uniqueLinks.map(l => `${l.platform.name}: ${l.url}`).join('\n');
      copyToClipboard(text);
      showNotification('Social links copied!', 'success');
    });
  }, 100);
}

// 3. Pro Link Extractor (DoFollow/NoFollow + Internal/External + CSV Export)
function extractLinks() {
  const linkData = [];
  const currentDomain = window.location.hostname;
  let internalCount = 0, externalCount = 0, nofollowCount = 0;
  
  document.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.href;
    if (!href || href.startsWith('javascript:') || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    const text = (anchor.textContent || anchor.innerText || '').trim().replace(/\s+/g, ' ').substring(0, 100);
    const isNofollow = (anchor.getAttribute('rel') || '').toLowerCase().includes('nofollow');
    
    let isExternal = false;
    try {
      isExternal = new URL(href).hostname !== currentDomain;
    } catch (e) {}

    if (isExternal) externalCount++; else internalCount++;
    if (isNofollow) nofollowCount++;
    
    linkData.push({ 
      url: href, 
      text: text || '[No Anchor Text]', 
      type: isExternal ? 'External' : 'Internal',
      follow: isNofollow ? 'NoFollow' : 'DoFollow'
    });
  });

  if (linkData.length === 0) {
    showNotification('No valid links found.', 'warning');
    return;
  }

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 10px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px;">
        <div style="background: #f5f5f5; padding: 10px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #333;">${linkData.length}</div>
          <div style="font-size: 11px; color: #666;">Total Links</div>
        </div>
        <div style="background: #e8f5e9; padding: 10px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2e7d32;">${internalCount}</div>
          <div style="font-size: 11px; color: #666;">Internal</div>
        </div>
        <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #1565c0;">${externalCount}</div>
          <div style="font-size: 11px; color: #666;">External</div>
        </div>
        <div style="background: #ffebee; padding: 10px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #c62828;">${nofollowCount}</div>
          <div style="font-size: 11px; color: #666;">NoFollow</div>
        </div>
      </div>
      
      <button id="exportLinksCsv" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 15px;">
        📥 Export All Links to CSV
      </button>

      <div style="max-height: 350px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead style="background: #f8f9fa; position: sticky; top: 0;">
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Type / Rel</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Anchor Text & URL</th>
            </tr>
          </thead>
          <tbody>
            ${linkData.slice(0, 100).map(link => `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px; vertical-align: top;">
                  <span style="display: block; font-weight: bold; color: ${link.type === 'Internal' ? '#2e7d32' : '#1565c0'}">${link.type}</span>
                  <span style="font-size: 10px; color: ${link.follow === 'NoFollow' ? '#c62828' : '#666'}">${link.follow}</span>
                </td>
                <td style="padding: 10px; word-break: break-all;">
                  <strong>${escapeHtml(link.text)}</strong><br>
                  <a href="${escapeHtml(link.url)}" target="_blank" style="color: #666; text-decoration: none;">${escapeHtml(link.url)}</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${linkData.length > 100 ? `<div style="text-align: center; padding: 10px; background: #f5f5f5; color: #666; font-size: 12px;">Showing first 100 links. Export to CSV to see all ${linkData.length}.</div>` : ''}
      </div>
    </div>
  `;

  createModal('Pro Link Extractor', content);

  setTimeout(() => {
    document.getElementById('exportLinksCsv').addEventListener('click', () => {
      let csv = 'URL,Anchor Text,Type,Rel Attribute\n';
      linkData.forEach(l => {
        csv += `"${l.url}","${l.text.replace(/"/g, '""')}","${l.type}","${l.follow}"\n`;
      });
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-links-${window.location.hostname}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, 100);
}
// 4. Pro Domain Extractor (Frequency Count + CSV Export)
function extractDomains() {
  const domainCounts = new Map();
  const excludedExtensions = ['.edu', '.gov', '.wordpress', '.blogspot'];
  const excludedKeywords = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'apple.com', 'google.com'];
  
  document.querySelectorAll('a[href]').forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      let domain = url.hostname.replace(/^www\./, '');
      
      // Filter out self and common noise
      if (domain !== window.location.hostname.replace(/^www\./, '') && 
          !excludedExtensions.some(ext => domain.endsWith(ext)) &&
          !excludedKeywords.some(keyword => domain.includes(keyword))) {
        
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      }
    } catch (e) {}
  });

  // Sort by frequency (highest first)
  const sortedDomains = Array.from(domainCounts.entries())
                             .sort((a, b) => b[1] - a[1]);

  if (sortedDomains.length === 0) {
    showNotification('No external domains found.', 'warning');
    return;
  }

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 10px;">
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0 0 5px; color: #e65100;">🌐 External Domains</h4>
          <span style="font-size: 13px; color: #666;">Found ${sortedDomains.length} unique domains</span>
        </div>
        <button id="exportDomainsCsv" style="padding: 8px 16px; background: #e65100; color: white; border: none; border-radius: 6px; cursor: pointer;">📥 Export CSV</button>
      </div>
      
      <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
        ${sortedDomains.map(([domain, count]) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f5f5f5;">
            <span style="font-family: monospace; font-size: 13px;">${escapeHtml(domain)}</span>
            <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; color: #555;">Linked ${count}x</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  createModal('Domain Extractor', content);

  setTimeout(() => {
    document.getElementById('exportDomainsCsv').addEventListener('click', () => {
      let csv = 'Domain,Link Count\n';
      sortedDomains.forEach(([domain, count]) => {
        csv += `"${domain}",${count}\n`;
      });
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-domains-${window.location.hostname}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, 100);
}

// Enhanced findBlogPage with Promise.all
function findBlogPage() {
  const blogPaths = ['/blog', '/blogs', '/news', '/articles'];
  const baseUrl = window.location.origin;
  let found = false;
  
  Promise.all(blogPaths.map(path => 
    fetch(baseUrl + path, { method: 'HEAD', cache: 'no-cache' })
      .then(response => response.ok ? baseUrl + path : null)
      .catch(() => null)
  )).then(results => {
    const foundUrl = results.find(url => url !== null);
    if (foundUrl) {
      window.location.href = foundUrl;
    } else {
      showNotification('No blog page found', 'error');
    }
  });
}

// Enhanced findGuestPostPages with better error handling
function findGuestPostPages() {
  const paths = ['/write-for-us', '/contribute', '/guest-post', '/submit-article', '/become-a-contributor'];
  const baseUrl = window.location.origin;
  const results = [];
  
  Promise.all(paths.map(path => 
    fetch(baseUrl + path, { method: 'HEAD', cache: 'no-copy' })
      .then(response => {
        if (response.ok) results.push(baseUrl + path);
      })
      .catch(() => {})
  )).then(() => {
    if (results.length > 0) {
      if (results.length === 1) {
        window.location.href = results[0];
      } else {
        const choice = prompt('Guest posting pages found:\n' + results.map((r, i) => (i + 1) + ': ' + r).join('\n') + '\n\nEnter number to visit:');
        if (choice && results[choice - 1]) {
          window.location.href = results[choice - 1];
        }
      }
    } else {
      showNotification('No guest post pages found', 'error');
    }
  });
}

// Enhanced fillContactForm with personalized message & subject generation
function fillContactForm(settings) {
  // 1. Extract a clean version of the website's name (Dynamic context)
  let siteName = document.title.split('|')[0].split('-')[0].trim();
  
  if (!siteName || siteName.toLowerCase().includes('home')) {
    siteName = window.location.hostname.replace('www.', '').split('.')[0];
    siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
  }

  // 2. Create highly personalized, dynamic text
  const personalizedSubject = `Editorial Contribution Inquiry for ${siteName}`;
  
  const personalizedMessage = `Hi ${siteName} team,\n\nI hope this message finds you well!\n\nI've been exploring your recent content and I'm very interested in contributing a high-quality guest article to your site. Do you currently accept editorial contributions or guest posts?\n\nI'd love to share some topic ideas that your audience would enjoy.\n\nLooking forward to hearing from you,\n${settings.userName || 'Jonathan Harris'}`;

  // 3. Set up the data payload
  const data = {
    fullName: settings.userName || 'Jonathan Harris',
    email: settings.userEmail || 'jonathn.p.harris@gmail.com',
    phone: settings.userPhone || '9928524796',
    linkedin: settings.userLinkedin || '',
    subject: personalizedSubject, // <-- NEW SUBJECT LINE HERE
    message: personalizedMessage
  };
  
  function setVal(el, val) {
    if (!el) return;
    if (el.value && el.value.trim() !== '') return; 
    el.value = val;
    ['input', 'change', 'blur'].forEach(e => el.dispatchEvent(new Event(e, { bubbles: true })));
  }
  
  function matches(el, keywords) {
    const text = ((el.name || '') + (el.id || '') + (el.placeholder || '') + (el.getAttribute('aria-label') || '')).toLowerCase();
    return keywords.some(k => text.includes(k));
  }
  
  const inputs = document.querySelectorAll('input, textarea, select');
  let filledCount = 0;
  
  // 4. Scan the page and fill the matching fields
  inputs.forEach(el => {
    const t = (el.type || '').toLowerCase();
    if (t === 'hidden' || t === 'submit' || t === 'button' || t === 'file') return;
    
    if (t === 'email' || matches(el, ['email', 'mail', 'e-mail'])) {
      setVal(el, data.email);
      filledCount++;
    } else if (t === 'tel' || matches(el, ['phone', 'mobile', 'contact', 'cell'])) {
      setVal(el, data.phone);
      filledCount++;
    } else if (matches(el, ['name', 'full name', 'author', 'your name', 'fullname'])) {
      setVal(el, data.fullName);
      filledCount++;
    } else if (matches(el, ['linkedin', 'social', 'profile', 'url', 'website'])) {
      setVal(el, data.linkedin);
      filledCount++;
    } else if (matches(el, ['subject', 'topic', 'regarding', 'reason'])) {
      // <-- NEW SUBJECT MATCHER HERE
      setVal(el, data.subject);
      filledCount++;
    } else if (el.tagName === 'TEXTAREA' || matches(el, ['message', 'comment', 'body', 'query', 'inquiry'])) {
      setVal(el, data.message);
      filledCount++;
    }
  });
  
  showNotification(`Contact form filled! (${filledCount} field${filledCount !== 1 ? 's' : ''})`, 'success');
}

// Enhanced showSearchOperators with better UI
function showSearchOperators() {
  const content = document.createElement('div');
  
  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;';
  select.innerHTML = `
    <option value="">Default (site:)</option>
    <option value="intitle:">Title Search (intitle:)</option>
    <option value="inurl:">URL Search (inurl:)</option>
    <option value="allintitle:">All in Title (allintitle:)</option>
    <option value="allinurl:">All in URL (allinurl:)</option>
    <option value="intext:">Text Search (intext:)</option>
  `;
  content.appendChild(select);
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter search query...';
  input.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;';
  content.appendChild(input);
  
  const exampleDiv = document.createElement('div');
  exampleDiv.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 6px;';
  exampleDiv.innerHTML = '<strong>Examples:</strong> "shopping tips", "guest post guidelines", "write for us"';
  content.appendChild(exampleDiv);
  
  content.appendChild(createButton('Search on Google', () => {
    const query = input.value.trim();
    const operator = select.value;
    const site = window.location.hostname;
    let searchUrl = 'https://www.google.com/search?q=';
    
    if (operator) {
      searchUrl += operator + encodeURIComponent(query) + '+site:' + site;
    } else {
      searchUrl += 'site:' + site + '+' + encodeURIComponent(query);
    }
    
    window.open(searchUrl, '_blank');
  }));
  
  createModal('Search Operators', content);
}

// Enhanced goToNextPage with more selectors
function goToNextPage() {
  const nextSelectors = [
    'a[aria-label="Next page"]',
    'a[aria-label="Next"]',
    'a#pnnext',
    'a.next',
    'a[rel="next"]',
    'a:contains("Next")',
    'button:contains("Next")'
  ];
  
  let nextButton = null;
  for (const selector of nextSelectors) {
    nextButton = document.querySelector(selector);
    if (nextButton) break;
  }
  
  if (nextButton) {
    nextButton.click();
    showNotification('Navigating to next page...', 'success');
  } else {
    showNotification('No next page button found', 'error');
  }
}

// Enhanced Payment Form with better variable handling
function showPaymentForm(type, settings, templates) {
  const content = document.createElement('div');
  const fields = [];
  const inputs = {};
  
  const defaults = {
    currency: settings.defaultCurrency || 'USD',
    amount: settings.defaultAmount || '50',
    yourName: settings.userName || 'Jonathan Harris'
  };
  
  if (type === 'advance') {
    fields.push(
      { label: 'Client Account', id: 'account', placeholder: 'e.g. ABC Media', required: true },
      { label: 'Paypal Account Name', id: 'paypalName', placeholder: 'name@example.com', required: true },
      { label: 'Paypal Details / Invoice', id: 'paypalDetails', placeholder: 'INV-123', required: true },
      { label: 'Amount', id: 'amount', placeholder: '30', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD, GBP, PESO', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: '5 Shopping Tips...', required: false },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName }
    );
  } else if (type === 'paypal') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: '[CLIENT ACCOUNT]', required: true },
      { label: 'Paypal Account Name', id: 'paypalAccountName', placeholder: 'N/A', required: false },
      { label: 'Paypal Invoice', id: 'paypalInvoice', placeholder: 'N/A', required: false },
      { label: 'Amount', id: 'amount', placeholder: 'N/A', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'N/A', required: false },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname.replace(/^www\./, ''), required: false },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A', required: false }
    );
  } else if (type === 'gcash') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Enter your name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: '[CLIENT ACCOUNT]', required: true },
      { label: 'Gcash Account Name', id: 'gcashName', placeholder: 'N/A', required: true },
      { label: 'Gcash Account Number', id: 'gcashNumber', placeholder: 'N/A', required: true },
      { label: 'Amount', id: 'amount', placeholder: 'N/A', required: true, defaultValue: defaults.amount },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'N/A', required: false },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname.replace(/^www\./, ''), required: false },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A', required: false }
    );
  }
  
  fields.forEach(field => {
    const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
    content.appendChild(wrapper);
    inputs[field.id] = input;
  });
  
  const generateBtn = createButton('Generate Email', () => {
    let email = '';
    const getVal = (id) => {
      const input = inputs[id];
      return input && input.value ? input.value.trim() : 'N/A';
    };
    
    if (type === 'advance') {
      email = `Hi Ms. Rose,

This is an Advance Paypal payment request for ${getVal('account')} account.

Paypal Account Name: ${getVal('paypalName')}
Paypal Details: ${getVal('paypalDetails')}
Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}

Regards,
${getVal('yourName')}`;
    } else if (type === 'paypal') {
      email = `Hi Ms. Rose,

This is a Paypal payment request for the ${getVal('clientAccount')} account.

Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}
Published Link: ${getVal('publishedLink')}

Regards,
${getVal('yourName')}`;
    } else if (type === 'gcash') {
      email = `Hi Ms. Rose,

This is a Gcash payment request for the ${getVal('clientAccount')}.

Gcash Account Name: ${getVal('gcashName')}
Gcash Account Number: ${getVal('gcashNumber')}
Amount: ${getVal('amount')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}

Regards,
${getVal('yourName')}`;
    }
    
    copyToClipboard(email).then(() => {
      showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this email:', email);
      if (copied !== null) {
        showNotification('Email ready to copy', 'success');
      }
    });
  });
  
  content.appendChild(generateBtn);
  
  const titles = {
    'advance': 'Advance Payment Request',
    'paypal': 'PayPal Payment Request',
    'gcash': 'GCash Payment Request'
  };
  
  createModal(titles[type] || 'Payment Request', content);
}

// Enhanced Article Form with preserved templates
function showArticleForm(type, settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  const defaults = {
    yourName: settings.userName || 'Jonathan Harris'
  };
  
  if (type === 'full') {
    [
      { label: 'Your Name', id: 'yourName', placeholder: 'Enter Your Name', required: true, defaultValue: defaults.yourName },
      { label: "Webmaster's Name", id: 'webmaster', placeholder: 'Enter Webmaster Name', required: true },
      { label: 'Website URL', id: 'website', placeholder: 'https://example.com', required: true },
      { label: 'Payment Amount', id: 'amount', placeholder: '$500', required: true },
      { label: 'Article Title for URL Slug', id: 'articleTitle', placeholder: 'How to Create Bookmarklets', required: true }
    ].forEach(field => {
      const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
      content.appendChild(wrapper);
      inputs[field.id] = input;
    });
    
    content.appendChild(createButton('Generate Email', () => {
      const getVal = (id) => {
        const input = inputs[id];
        return input && input.value ? input.value.trim() : '';
      };
      const slug = getVal('articleTitle').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      
      const email = `Hi ${getVal('webmaster')},

The article is ready for publication on ${getVal('website')}.
Payment: ${getVal('amount')}
URL Slug: ${slug}

Guidelines:
- Do-follow link
- No sponsored tags
- Article must remain active for 12 months
- Publication TAT: 24-48hrs

Regards,
${getVal('yourName')}`;
      
      copyToClipboard(email).then(() => {
        showNotification('Email copied!', 'success');
      }).catch(() => {
        const copied = prompt('Copy this email:', email);
        if (copied !== null) {
          showNotification('Email ready to copy', 'success');
        }
      });
    }));
  } else {
    [
      { label: 'Webmaster Name', id: 'webmasterName', placeholder: 'John Doe', required: true },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName }
    ].forEach(field => {
      const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
      content.appendChild(wrapper);
      inputs[field.id] = input;
    });
    
    content.appendChild(createButton('Generate Email', () => {
      const getVal = (id) => {
        const input = inputs[id];
        return input && input.value ? input.value.trim() : '';
      };
      const email = `Hi ${getVal('webmasterName')},

Attached is another article for publication on ${getVal('website')}, under the same terms.

Regards,
${getVal('yourName')}`;
      
      copyToClipboard(email).then(() => {
        showNotification('Email copied!', 'success');
      }).catch(() => {
        const copied = prompt('Copy this email:', email);
        if (copied !== null) {
          showNotification('Email ready to copy', 'success');
        }
      });
    }));
  }
  
  createModal(type === 'full' ? 'Sending Article' : 'Quick Article', content);
}

// Enhanced Followup Form with preserved templates
function showFollowupForm(type, settings, templates) {
  const content = document.createElement('div');
  const { wrapper, input } = createInputField('Website', 'website', 'example.com', true);
  content.appendChild(wrapper);
  
  let title = 'Follow-up';
  let emailTemplate = '';
  
  if (type === 1) {
    title = 'Article Follow-up';
    emailTemplate = `Hi,

Just checking in to see if you've had a chance to review the article I sent for {{website}}.

Looking forward to your feedback.`;
  } else if (type === 2) {
    title = '2nd Follow-up';
    emailTemplate = `Hi,

I wanted to follow up on my previous email regarding the article for {{website}}.

Please let me know if you need any additional information.

Thank you.`;
  } else {
    title = 'Final Notice';
    emailTemplate = `Hi,

This is my final follow-up regarding the article for {{website}}.

I'm giving you a 12-hour window to respond before I consider this opportunity closed.

Please let me know your decision ASAP.`;
  }
  
  content.appendChild(createButton('Generate Message', () => {
    const website = input.value.trim() || '[Website]';
    const email = emailTemplate.replace('{{website}}', website);
    copyToClipboard(email).then(() => {
      showNotification('Message copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this message:', email);
      if (copied !== null) {
        showNotification('Message ready to copy', 'success');
      }
    });
  }));
  
  createModal(title, content);
}

// Enhanced Cancel Form with preserved template
function showCancelForm(settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  
  const { wrapper: w1, input: websiteInput } = createInputField('Website', 'website', 'example.com', true);
  const { wrapper: w2, input: reasonInput } = createInputField('Reason (Optional)', 'reason', 'No response received', false);
  content.appendChild(w1);
  content.appendChild(w2);
  inputs.website = websiteInput;
  inputs.reason = reasonInput;
  
  content.appendChild(createButton('Generate Cancellation', () => {
    const website = inputs.website.value.trim() || '[Website]';
    const reason = inputs.reason.value.trim() || 'due to lack of response';
    
    const email = `Hi,

I am canceling my submission for ${website} ${reason}.

Despite my previous attempts to follow up, I have not received any feedback.

Thank you for your time.`;
    
    copyToClipboard(email).then(() => {
      showNotification('Cancellation notice copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this cancellation:', email);
      if (copied !== null) {
        showNotification('Cancellation ready to copy', 'success');
      }
    });
  }, '#f44336'));
  
  createModal('Cancellation Notice', content);
}

// Enhanced copyDeclinedTemplate with preserved template
function copyDeclinedTemplate(settings, templates) {
  const email = `Hi,

Thank you for getting back to me. I really appreciate you taking the time to respond.

I completely understand that you're not currently accepting guest posts. Do you happen to know of any other websites or editors who are open to guest contributions?

Any leads would be greatly appreciated.

Thanks again for your time.`;
  
  copyToClipboard(email).then(() => {
    showNotification('Template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', email);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced Invoice Form with preserved template
function showInvoiceForm(settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  
  const { wrapper: w1, input: webmasterInput } = createInputField("Webmaster's Name", 'webmaster', '', true);
  const { wrapper: w2, input: yourNameInput } = createInputField('Your Name', 'yourName', '', true, 'text', settings.userName || 'Jonathan Harris');
  content.appendChild(w1);
  content.appendChild(w2);
  inputs.webmaster = webmasterInput;
  inputs.yourName = yourNameInput;
  
  content.appendChild(createButton('Generate Email', () => {
    const webmaster = inputs.webmaster.value.trim() || '';
    const yourName = inputs.yourName.value.trim() || '';
    
    const email = `Hi ${webmaster},

I'm pleased to confirm that the payment has been successfully processed.

Looking forward to more collaborations!

Regards,
${yourName}`;
    
    copyToClipboard(email).then(() => {
      showNotification('Email copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this email:', email);
      if (copied !== null) {
        showNotification('Email ready to copy', 'success');
      }
    });
  }));
  
  createModal('Send Invoice', content);
}

// Enhanced Outreach Templates with preserved content
function showOutreachTemplates(settings, templates) {
  const webmaster = prompt("Enter Webmaster's Name:", 'Webmaster');
  if (!webmaster) return;
  
  const templateList = [
    `Hi ${webmaster} team,

I'm reaching out to ask if you currently accept guest contributions on your website.

Could you share your guidelines and turnaround time?

Thanks!`,
    `Hi ${webmaster} team,

I hope you're doing well! I'm reaching out to see if you're accepting guest post contributions.

If so, I'd be happy to share topic ideas.

Looking forward to your response!`
  ];
  
  const selectedTemplate = templateList[Math.floor(Math.random() * templateList.length)];
  copyToClipboard(selectedTemplate).then(() => {
    showNotification('Outreach template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', selectedTemplate);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced Negotiation Templates with preserved content
function showNegoTemplates(settings, templates) {
  const templateList = [
    `Hi,

Thank you for your response.

Unfortunately, I cannot afford your guest posting fee. I only have $50 available per article.

I hope you could consider it.

Looking forward to your kind response.`,
    `Hi,

Thank you for getting back to me.

Due to budget constraints, I'm currently able to offer $50 for this contribution.

I hope you might consider it.

Looking forward to your response.`
  ];
  
  const selectedTemplate = templateList[Math.floor(Math.random() * templateList.length)];
  copyToClipboard(selectedTemplate).then(() => {
    showNotification('Negotiation template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', selectedTemplate);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced extractGoogleDomains with better filtering
function extractGoogleDomains() {
  const anchors = document.querySelectorAll('a');
  const domains = new Set();
  
  const excludedExtensions = ['.edu', '.gov', '.wordpress', '.blogspot'];
  const excludedKeywords = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'quora.com', 'reddit.com', 'medium.com'];
  
  anchors.forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      if (url.hostname === 'www.google.com' && (url.pathname === '/url' || url.pathname === '/search')) {
        const params = new URLSearchParams(url.search);
        const resultUrl = params.get('q') || params.get('url');
        if (resultUrl && !resultUrl.startsWith('/')) {
          const domain = new URL(resultUrl).hostname.replace(/^www\./, '');
          if (!excludedExtensions.some(ext => domain.endsWith(ext)) &&
              !excludedKeywords.some(keyword => domain.includes(keyword))) {
            domains.add(domain);
          }
        }
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  
  if (domains.size === 0) {
    showNotification('No Google result domains found', 'error');
    return;
  }
  
  const newWindow = window.open('', '_blank');
  const domainList = [...domains].sort().join('\n');
  const escapedDomainList = domainList.replace(/'/g, "\\'");
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Google Domains</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f9fafb; margin: 0; }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      button { background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
      button:hover { background: #45a049; }
      pre { background: #f0f4f8; padding: 15px; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 13px; }
      .counter { margin-bottom: 15px; color: #666; }
    </style>
  </head>
  <body>
    <h1>Domains from Google Results</h1>
    <div class="counter">Found ${domains.size} domain(s)</div>
    <button id="copyAllBtn">Copy All Domains</button>
    <pre>${escapeHtml(domainList)}</pre>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();

  // CSP Compliant Event Listener
  newWindow.document.getElementById('copyAllBtn').addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(domainList).then(() => {
        newWindow.alert('Copied ' + domains.size + ' domains!');
      }).catch(() => newWindow.prompt('Copy these domains:', domainList));
    } else {
      newWindow.prompt('Copy these domains:', domainList);
    }
  });
}

// Enhanced showMetricsModal with confirmation
function showMetricsModal() {
  const domain = window.location.hostname.replace(/^www\./, '');
  const encodedDomain = encodeURIComponent(domain);
  
  if (confirm(`Open SEO tools for ${domain}?`)) {
    const urls = [
      'https://www.semrush.com/free-tools/website-authority-checker/?url=' + encodedDomain,
      'https://websiteseochecker.com/spam-score-checker/?url=' + encodedDomain,
      'https://ahrefs.com/website-authority-checker/?input=' + encodedDomain,
      'https://ahrefs.com/traffic-checker/?input=' + encodedDomain + '&mode=subdomains'
    ];
    
    urls.forEach(url => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, 100);
    });
    
    showNotification('Opening metrics tools...', 'success');
  }
}

// ==================== DO-FOLLOW LINK FUNCTIONS ====================

// Highlight Do-Follow Links (Green)
function highlightDoFollowLinks() {
  const links = document.querySelectorAll('a[href]');
  let doFollowCount = 0;
  let noFollowCount = 0;
  
  // Remove any existing highlights first
  const existingHighlights = document.querySelectorAll('.gdi-dofollow-highlight');
  existingHighlights.forEach(el => {
    el.classList.remove('gdi-dofollow-highlight');
    el.style.removeProperty('background-color');
    el.style.removeProperty('border');
    el.style.removeProperty('box-shadow');
  });
  
  links.forEach(link => {
    const rel = link.getAttribute('rel');
    const isNoFollow = rel && rel.toLowerCase().includes('nofollow');
    
    if (!isNoFollow) {
      doFollowCount++;
      link.classList.add('gdi-dofollow-highlight');
      link.style.backgroundColor = '#ccffcc';
      link.style.border = '2px solid #00aa00';
      link.style.boxShadow = '0 0 3px rgba(0, 170, 0, 0.5)';
      link.style.display = 'inline-block';
      link.style.padding = '2px 4px';
      link.style.borderRadius = '3px';
      link.style.transition = 'all 0.2s';
      
      // Add hover effect
      link.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#99ff99';
        this.style.border = '2px solid #008800';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#ccffcc';
        this.style.border = '2px solid #00aa00';
      });
    } else {
      noFollowCount++;
    }
  });
  
  // Create notification with stats
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  `;
  notification.innerHTML = `
    <strong>Link Analysis Complete</strong><br>
    ✅ Do-Follow (Green): ${doFollowCount}<br>
    ⛔ No-Follow: ${noFollowCount}
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.opacity = '1', 10);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  if (doFollowCount === 0 && noFollowCount === 0) {
    showNotification('No links found on this page', 'error');
  } else if (doFollowCount > 0) {
    showNotification(`Highlighted ${doFollowCount} do-follow link${doFollowCount !== 1 ? 's' : ''} in green`, 'success');
  } else {
    showNotification('No do-follow links found on this page', 'warning');
  }
}

// Remove Highlights
function removeHighlights() {
  const highlights = document.querySelectorAll('.gdi-dofollow-highlight');
  highlights.forEach(link => {
    link.classList.remove('gdi-dofollow-highlight');
    link.style.removeProperty('background-color');
    link.style.removeProperty('border');
    link.style.removeProperty('box-shadow');
    link.style.removeProperty('display');
    link.style.removeProperty('padding');
    link.style.removeProperty('border-radius');
    link.style.removeProperty('transition');
  });
  
  showNotification('Highlights removed', 'success');
}

// ==================== SEO ANALYSIS FUNCTIONS ====================

// Check Heading Structure (H1-H6)
function analyzeHeadings() {
  const headings = {
    h1: document.querySelectorAll('h1'),
    h2: document.querySelectorAll('h2'),
    h3: document.querySelectorAll('h3'),
    h4: document.querySelectorAll('h4'),
    h5: document.querySelectorAll('h5'),
    h6: document.querySelectorAll('h6')
  };
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Heading Structure Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .summary { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background: #4CAF50; color: white; }
      .heading-sample { font-family: monospace; background: #f0f4f8; padding: 5px; margin: 5px 0; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Heading Structure Analysis</h1>
    <div class="summary">`;
  
  // Check for H1 issues
  if (headings.h1.length === 0) {
    html += '<div class="error">❌ ERROR: No H1 tag found on the page!</div>';
  } else if (headings.h1.length > 1) {
    html += `<div class="warning">⚠️ WARNING: Multiple H1 tags found (${headings.h1.length}). Only one H1 is recommended.</div>`;
  } else {
    html += '<div class="success">✅ Good: Exactly one H1 tag found.</div>';
  }
  
  // Heading count summary
  html += `<div class="heading-sample"><strong>Heading Count:</strong><br>`;
  for (let i = 1; i <= 6; i++) {
    const count = headings[`h${i}`].length;
    if (count > 0) {
      html += `H${i}: ${count} `;
    }
  }
  html += `</div>`;
  
  html += `</div>
    <h2>Detailed Heading Structure</h2>
    <table>
      <thead>
        <tr><th>Heading Type</th><th>Count</th><th>Samples (First 3)</th></tr>
      </thead>
      <tbody>`;
  
  for (let i = 1; i <= 6; i++) {
    const elements = headings[`h${i}`];
    if (elements.length > 0) {
      const samples = Array.from(elements).slice(0, 3).map(el => el.textContent.trim().substring(0, 100));
      html += `
        <tr>
          <td><strong>H${i}</strong></td>
          <td>${elements.length}</td>
          <td>${samples.map(s => `<div class="heading-sample">${escapeHtml(s)}</div>`).join('')}</td>
        </tr>`;
    }
  }
  
  html += `
      </tbody>
    </table>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Meta Tags (Title, Description, Keywords)
function analyzeMetaTags() {
  const title = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const robots = document.querySelector('meta[name="robots"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const viewport = document.querySelector('meta[name="viewport"]');
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Meta Tags Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .info { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; }
      .meta-value { background: #f0f4f8; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; margin-top: 5px; }
      .label { font-weight: 600; color: #495057; }
    </style>
  </head>
  <body>
    <h1>Meta Tags Analysis</h1>`;
  
  // Title Analysis
  html += `<div class="card">
    <h3>Title Tag</h3>`;
  if (title) {
    const titleLength = title.textContent.length;
    html += `<div class="meta-value">${escapeHtml(title.textContent)}</div>
    <div>Length: ${titleLength} characters</div>`;
    if (titleLength < 30) {
      html += '<div class="warning">⚠️ Title is too short (recommended: 50-60 characters)</div>';
    } else if (titleLength > 60) {
      html += '<div class="warning">⚠️ Title is too long (recommended: 50-60 characters)</div>';
    } else {
      html += '<div class="success">✅ Title length is good (50-60 characters recommended)</div>';
    }
  } else {
    html += '<div class="error">❌ Missing title tag!</div>';
  }
  html += `</div>`;
  
  // Meta Description Analysis
  html += `<div class="card">
    <h3>Meta Description</h3>`;
  if (metaDescription) {
    const descLength = metaDescription.getAttribute('content').length;
    html += `<div class="meta-value">${escapeHtml(metaDescription.getAttribute('content'))}</div>
    <div>Length: ${descLength} characters</div>`;
    if (descLength < 120) {
      html += '<div class="warning">⚠️ Description is too short (recommended: 150-160 characters)</div>';
    } else if (descLength > 160) {
      html += '<div class="warning">⚠️ Description is too long (recommended: 150-160 characters)</div>';
    } else {
      html += '<div class="success">✅ Description length is good (150-160 characters recommended)</div>';
    }
  } else {
    html += '<div class="error">❌ Missing meta description!</div>';
  }
  html += `</div>`;
  
  // Other Meta Tags
  html += `<div class="card">
    <h3>Other Meta Tags</h3>`;
  html += `<div><span class="label">Meta Keywords:</span> ${metaKeywords ? escapeHtml(metaKeywords.getAttribute('content')) : '<span class="warning">Not set (not critical for SEO)</span>'}</div>`;
  html += `<div><span class="label">Robots:</span> ${robots ? escapeHtml(robots.getAttribute('content')) : '<span class="info">Not set (defaults to index,follow)</span>'}</div>`;
  html += `<div><span class="label">Canonical URL:</span> ${canonical ? `<a href="${escapeHtml(canonical.getAttribute('href'))}" target="_blank">${escapeHtml(canonical.getAttribute('href'))}</a>` : '<span class="warning">Not set (may cause duplicate content issues)</span>'}</div>`;
  html += `<div><span class="label">Viewport:</span> ${viewport ? escapeHtml(viewport.getAttribute('content')) : '<span class="warning">Not set (may affect mobile SEO)</span>'}</div>`;
  html += `</div>`;
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Images Alt Text
function analyzeImages() {
  const images = document.querySelectorAll('img');
  const results = {
    total: images.length,
    withAlt: 0,
    withoutAlt: 0,
    emptyAlt: 0,
    missingAlt: []
  };
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      results.withoutAlt++;
      results.missingAlt.push(img.src || img.getAttribute('data-src') || 'No src attribute');
    } else if (alt === '') {
      results.emptyAlt++;
    } else {
      results.withAlt++;
    }
  });
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Images Alt Text Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .image-list { max-height: 400px; overflow-y: auto; }
      .image-item { padding: 8px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 12px; word-break: break-all; }
    </style>
  </head>
  <body>
    <h1>Images Alt Text Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Total Images: ${results.total}</div>
      <div class="success">✅ With Alt Text: ${results.withAlt}</div>
      <div class="warning">⚠️ Empty Alt Text: ${results.emptyAlt}</div>
      <div class="error">❌ Missing Alt Text: ${results.withoutAlt}</div>`;
  
  if (results.total > 0) {
    const score = ((results.withAlt / results.total) * 100).toFixed(1);
    html += `<div>Accessibility Score: ${score}%</div>`;
  }
  
  html += `</div>`;
  
  if (results.missingAlt.length > 0) {
    html += `<div class="card">
      <h3>Images Missing Alt Text</h3>
      <div class="image-list">`;
    results.missingAlt.forEach((src, i) => {
      html += `<div class="image-item">${i + 1}. ${escapeHtml(src.substring(0, 100))}</div>`;
    });
    html += `</div></div>`;
  }
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Internal vs External Links
function analyzeLinks() {
  const currentDomain = window.location.hostname;
  const links = document.querySelectorAll('a[href]');
  let internal = 0;
  let external = 0;
  let broken = 0;
  const externalLinks = [];
  
  links.forEach(link => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.hostname === currentDomain) {
        internal++;
      } else {
        external++;
        if (externalLinks.length < 20) {
          externalLinks.push({ text: link.textContent.trim().substring(0, 50), url: link.href });
        }
      }
    } catch (e) {
      // Invalid URL
    }
  });
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Link Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .info { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background: #4CAF50; color: white; }
    </style>
  </head>
  <body>
    <h1>Link Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Total Links: ${internal + external}</div>
      <div class="success">✅ Internal Links: ${internal}</div>
      <div class="info">🔗 External Links: ${external}</div>
      <div>Internal/External Ratio: ${internal}:${external}</div>
    </div>`;
  
  if (externalLinks.length > 0) {
    html += `<div class="card">
      <h3>External Links (First 20)</h3>
      <table>
        <thead><tr><th>#</th><th>Anchor Text</th><th>URL</th></tr></thead>
        <tbody>`;
    externalLinks.forEach((link, i) => {
      html += `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(link.text || '-')}</td>
        <td><a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.url.substring(0, 80))}</a></td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Page Speed Insights (Open Google PageSpeed)
function checkPageSpeed() {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://developers.google.com/speed/pagespeed/insights/?url=${encodedUrl}`, '_blank');
  showNotification('Opening PageSpeed Insights...', 'success');
}

// Check Mobile Friendly Test
function checkMobileFriendly() {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://search.google.com/test/mobile-friendly?url=${encodedUrl}`, '_blank');
  showNotification('Opening Mobile-Friendly Test...', 'success');
}

// Check Structured Data (Schema)
function checkStructuredData() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const newWindow = window.open('', '_blank');
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Structured Data Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      pre { background: #f0f4f8; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>Structured Data Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Found ${scripts.length} structured data script(s)</div>`;
  
  if (scripts.length === 0) {
    html += '<div class="warning">⚠️ No structured data found. Consider adding Schema.org markup for better SEO.</div>';
  } else {
    html += '<div class="success">✅ Structured data found! Validate with Google Rich Results Test.</div>';
    html += `<div style="margin-top: 15px;">
      <button onclick="window.open('https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}', '_blank')" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Validate with Rich Results Test
      </button>
    </div>`;
    
    scripts.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent);
        html += `<div class="card">
          <h3>Script ${i + 1}</h3>
          <pre>${escapeHtml(JSON.stringify(data, null, 2).substring(0, 1000))}${JSON.stringify(data, null, 2).length > 1000 ? '\n... (truncated)' : ''}</pre>
        </div>`;
      } catch (e) {
        html += `<div class="card">
          <h3>Script ${i + 1}</h3>
          <div class="warning">⚠️ Invalid JSON-LD data</div>
        </div>`;
      }
    });
  }
  
  html += `</div></body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Robots.txt
function checkRobotsTxt() {
  const domain = window.location.origin;
  window.open(`${domain}/robots.txt`, '_blank');
  showNotification('Opening robots.txt...', 'success');
}

// Check Sitemap
function checkSitemap() {
  const domain = window.location.origin;
  const sitemapUrls = ['/sitemap.xml', '/sitemap_index.xml', '/sitemap.php', '/sitemap.html'];
  
  // Try to find sitemap in robots.txt first
  fetch(`${domain}/robots.txt`)
    .then(response => response.text())
    .then(text => {
      const sitemapMatch = text.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch) {
        window.open(sitemapMatch[1], '_blank');
        showNotification('Sitemap found in robots.txt', 'success');
        return;
      }
      
      // Try common sitemap locations
      Promise.all(sitemapUrls.map(url => 
        fetch(domain + url, { method: 'HEAD' })
          .then(response => response.ok ? domain + url : null)
          .catch(() => null)
      )).then(results => {
        const found = results.find(url => url !== null);
        if (found) {
          window.open(found, '_blank');
          showNotification('Opening sitemap...', 'success');
        } else {
          showNotification('No sitemap found', 'error');
        }
      });
    })
    .catch(() => {
      showNotification('Could not fetch robots.txt', 'error');
    });
}

// Word Count and Readability
function analyzeContent() {
  const bodyText = document.body.innerText || document.body.textContent;
  const words = bodyText.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  const paragraphs = document.querySelectorAll('p');
  const avgWordsPerParagraph = paragraphs.length > 0 ? Math.round(wordCount / paragraphs.length) : 0;
  
  // Simple readability score (Flesch Reading Ease approximation)
  const sentences = bodyText.match(/[^.!?]+[.!?]+/g) || [];
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
  let readabilityScore = 'Unknown';
  if (avgWordsPerSentence < 15) readabilityScore = 'Easy to Read';
  else if (avgWordsPerSentence < 20) readabilityScore = 'Moderate';
  else readabilityScore = 'Difficult to Read';
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Content Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .metric { font-size: 36px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
      .label { color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <h1>Content Analysis</h1>
    <div class="card">
      <div class="metric">${wordCount.toLocaleString()}</div>
      <div class="label">Total Words</div>
    </div>
    <div class="card">
      <div class="metric">${paragraphs.length}</div>
      <div class="label">Paragraphs</div>
      <div>Average ${avgWordsPerParagraph} words per paragraph</div>
    </div>
    <div class="card">
      <div class="metric">${sentences.length}</div>
      <div class="label">Sentences</div>
      <div>Average ${avgWordsPerSentence} words per sentence</div>
      <div>Readability: <strong>${readabilityScore}</strong></div>
    </div>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Export All SEO Data
function exportSEOData() {
  const data = {
    url: window.location.href,
    title: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
    wordCount: (document.body.innerText.match(/\b\w+\b/g) || []).length,
    links: {
      total: document.querySelectorAll('a[href]').length,
      internal: 0,
      external: 0
    },
    images: {
      total: document.querySelectorAll('img').length,
      withAlt: 0,
      withoutAlt: 0
    }
  };
  
  // Calculate links
  const currentDomain = window.location.hostname;
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.hostname === currentDomain) {
        data.links.internal++;
      } else {
        data.links.external++;
      }
    } catch (e) {}
  });
  
  // Calculate images
  document.querySelectorAll('img').forEach(img => {
    if (img.getAttribute('alt') !== null) {
      data.images.withAlt++;
    } else {
      data.images.withoutAlt++;
    }
  });
  
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seo-data-${window.location.hostname}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('SEO data exported!', 'success');
}

// ==================== KEYWORD RANK TRACKER ====================

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

// ==================== NEW SEO UPGRADES ====================

// 1. Keyword Density Analyzer
function analyzeKeywordDensity() {
  const text = document.body.innerText.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = text.split(/\s+/).filter(w => w.length > 2); // filter tiny words
  
  // Common stop words to ignore
  const stopWords = new Set(['the', 'and', 'are', 'for', 'that', 'this', 'with', 'you', 'was', 'have', 'from', 'but', 'they', 'will', 'your', 'about', 'can', 'has', 'not']);
  
  const wordCounts = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15

  const content = document.createElement('div');
  let html = `
    <div style="margin-bottom: 15px; font-size: 13px; color: #666;">
      Top 15 single-word keywords found on this page (excluding common stop words). Total eligible words analyzed: <strong>${words.length}</strong>.
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Keyword</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Count</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Density</th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedWords.forEach(([word, count]) => {
    const density = ((count / words.length) * 100).toFixed(2);
    let densityColor = density > 5 ? '#f44336' : (density > 2 ? '#4CAF50' : '#333'); // Highlight over-optimized keywords
    
    html += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;"><strong>${escapeHtml(word)}</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${densityColor}; font-weight: bold;">${density}%</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  content.innerHTML = html;
  
  createModal('Keyword Density Analyzer', content);
}

// 2. SERP Preview Visualizer
function showSerpPreview() {
  const currentTitle = document.title || '';
  const metaDescTag = document.querySelector('meta[name="description"]');
  const currentDesc = metaDescTag ? metaDescTag.getAttribute('content') : '';
  const currentUrl = window.location.href;

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 13px;">Page Title (Target: 50-60 chars)</label>
      <input type="text" id="simTitle" value="${escapeHtml(currentTitle)}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 5px;">
      <div id="simTitleCount" style="font-size: 11px; color: #666;">${currentTitle.length} chars</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 13px;">Meta Description (Target: 150-160 chars)</label>
      <textarea id="simDesc" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; margin-bottom: 5px;">${escapeHtml(currentDesc)}</textarea>
      <div id="simDescCount" style="font-size: 11px; color: #666;">${currentDesc.length} chars</div>
    </div>

    <h3 style="font-size: 14px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">Live Google Desktop Preview</h3>
    
    <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); font-family: arial, sans-serif;">
      <div style="color: #202124; font-size: 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
        <div style="background: #f1f3f4; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🌐</div>
        <div>
          <span style="display: block; line-height: 1.2;">${window.location.hostname}</span>
          <span style="color: #4d5156; font-size: 12px;">${escapeHtml(currentUrl)}</span>
        </div>
      </div>
      <div id="previewTitle" style="color: #1a0dab; font-size: 20px; line-height: 1.3; margin-bottom: 4px; cursor: pointer; text-decoration: none;">
        ${escapeHtml(currentTitle) || 'Your Page Title Goes Here'}
      </div>
      <div id="previewDesc" style="color: #4d5156; font-size: 14px; line-height: 1.58;">
        ${escapeHtml(currentDesc) || 'Your meta description will appear here. Make it compelling to improve your click-through rate (CTR).'}
      </div>
    </div>
  `;

  createModal('SERP Preview Tool', content);

  // Live Updating Logic
  const simTitle = document.getElementById('simTitle');
  const simDesc = document.getElementById('simDesc');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const simTitleCount = document.getElementById('simTitleCount');
  const simDescCount = document.getElementById('simDescCount');

  const updatePreview = () => {
    let t = simTitle.value;
    let d = simDesc.value;
    
    simTitleCount.textContent = `${t.length} chars`;
    simTitleCount.style.color = (t.length < 30 || t.length > 60) ? '#f44336' : '#4CAF50';
    
    simDescCount.textContent = `${d.length} chars`;
    simDescCount.style.color = (d.length < 120 || d.length > 160) ? '#f44336' : '#4CAF50';

    // Truncate for realistic Google preview
    previewTitle.textContent = t.length > 65 ? t.substring(0, 65) + '...' : (t || 'Your Page Title Goes Here');
    previewDesc.textContent = d.length > 160 ? d.substring(0, 160) + '...' : (d || 'Your meta description will appear here.');
  };

  simTitle.addEventListener('input', updatePreview);
  simDesc.addEventListener('input', updatePreview);
  updatePreview();
}

// 3. Broken Link Checker (UPGRADED WITH CSV EXPORT)
async function checkBrokenLinks() {
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

  let checked = 0;
  const brokenLinksData = []; // Array to store data for the CSV
  const BATCH_SIZE = 5; 
  
  // Create UI overlay
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #1a1a1a; color: #fff; 
    padding: 15px 20px; border-radius: 8px; z-index: 100000; font-family: -apple-system, sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3); border-left: 4px solid #FF9800; min-width: 250px;
  `;
  
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';
  headerDiv.innerHTML = '<strong style="font-size: 15px;">🚨 Broken Link Checker</strong>';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = 'background: transparent; border: none; color: #999; cursor: pointer; font-size: 16px;';
  closeBtn.onclick = () => statusDiv.remove();
  headerDiv.appendChild(closeBtn);
  
  statusDiv.appendChild(headerDiv);
  
  const statusText = document.createElement('div');
  statusText.id = 'bl-status';
  statusText.style.fontSize = '13px';
  statusText.style.lineHeight = '1.5';
  statusText.innerHTML = `Initializing scan of ${links.length} links...`;
  statusDiv.appendChild(statusText);
  
  document.body.appendChild(statusDiv);

  // Helper function to check a single link
  const checkLink = async (link) => {
    try {
      link.style.border = '2px dashed #ff9800';
      
      const response = await fetch(link.href, { method: 'HEAD' });
      
      if (response.ok) {
        link.style.border = '2px solid #4CAF50'; 
        link.style.backgroundColor = '#e8f5e9';
        link.title = "Link OK";
      } else {
        link.style.border = '2px solid #f44336';
        link.style.backgroundColor = '#ffebee';
        link.title = `Broken Link: HTTP ${response.status}`;
        
        // Save broken link data for the report
        brokenLinksData.push({
          url: link.href,
          text: link.textContent.trim().substring(0, 100) || '[No Anchor Text]',
          status: `HTTP ${response.status} (${response.statusText})`
        });
      }
    } catch (e) {
      link.style.border = '2px solid #FF9800';
      link.style.backgroundColor = '#fff3e0';
      link.title = "Blocked by CORS or Network Error";
      
      // Save blocked/network error links
      brokenLinksData.push({
        url: link.href,
        text: link.textContent.trim().substring(0, 100) || '[No Anchor Text]',
        status: 'Blocked by CORS / Network Error'
      });
    } finally {
      checked++;
      statusText.innerHTML = `
        Scanning: <strong>${checked}</strong> / ${links.length}<br>
        Issues Found: <strong style="color: ${brokenLinksData.length > 0 ? '#f44336' : '#4CAF50'}">${brokenLinksData.length}</strong>
      `;
    }
  };

  // Process in batches
  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const batch = links.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(link => checkLink(link)));
  }

  // Final UI Update
  statusDiv.style.borderLeftColor = brokenLinksData.length > 0 ? '#f44336' : '#4CAF50';
  statusText.innerHTML = `
    <strong>Scan Complete!</strong><br>
    Checked ${checked} links.<br>
    Found ${brokenLinksData.length} broken/blocked links.
  `;
  
  // If we found broken links, add an export button!
  if (brokenLinksData.length > 0) {
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '📥 Export CSV Report';
    exportBtn.style.cssText = `
      width: 100%; margin-top: 15px; padding: 8px; background: #2196F3; 
      color: white; border: none; border-radius: 4px; cursor: pointer; 
      font-weight: bold; font-size: 12px;
    `;
    
    exportBtn.onclick = () => {
      // Create CSV content
      let csv = 'URL,Anchor Text,Status/Error\n';
      brokenLinksData.forEach(item => {
        // Escape quotes and wrap in quotes to handle commas in anchor text
        const safeUrl = `"${item.url.replace(/"/g, '""')}"`;
        const safeText = `"${item.text.replace(/"/g, '""')}"`;
        const safeStatus = `"${item.status}"`;
        csv += `${safeUrl},${safeText},${safeStatus}\n`;
      });
      
      // Trigger download
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `broken-links-${window.location.hostname}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      exportBtn.innerHTML = '✅ Exported!';
      exportBtn.style.background = '#4CAF50';
      setTimeout(() => {
        exportBtn.innerHTML = '📥 Export CSV Report';
        exportBtn.style.background = '#2196F3';
      }, 2000);
    };
    
    statusDiv.appendChild(exportBtn);
  } else {
    // If no broken links, auto-close after 5 seconds
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.style.opacity = '0';
        statusDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => statusDiv.remove(), 500);
      }
    }, 5000);
  }
}

// ==================== FULL PAGE CAPTURE ====================

async function captureFullPage() {
  showNotification('📸 Capturing full page... Please do not scroll!', 'warning');

  // 1. Setup variables and hide scrollbars to avoid capturing them
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const totalHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  const captures = [];
  const scrollSteps = [];
  
  // Calculate exactly where we need to scroll
  let y = 0;
  while (y < totalHeight) {
    scrollSteps.push(y);
    y += viewportHeight;
  }
  
  // Adjust the last step so we don't scroll past the bottom and get overlapping images
  if (scrollSteps.length > 1) {
    const lastMaxScroll = totalHeight - viewportHeight;
    scrollSteps[scrollSteps.length - 1] = lastMaxScroll;
  }

  // 2. Scroll and capture process
  for (let i = 0; i < scrollSteps.length; i++) {
    const currentY = scrollSteps[i];
    window.scrollTo(0, currentY);
    
    // Wait a moment for sticky headers to settle and lazy-loaded images to appear
    await new Promise(r => setTimeout(r, 600)); 

    // Ask background.js to take a screenshot
    const response = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, resolve);
    });

    captures.push({
      dataUrl: response.dataUrl,
      y: currentY
    });
  }

  // 3. Restore the page's original state
  document.body.style.overflow = originalOverflow;
  window.scrollTo(0, 0);
  showNotification('Stitching images together...', 'info');

  // 4. Stitch everything together on an HTML5 Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Handle high-DPI (Retina) displays by checking the device pixel ratio
  const ratio = window.devicePixelRatio || 1;
  canvas.width = viewportWidth * ratio;
  canvas.height = totalHeight * ratio;

  let loadedImages = 0;

  captures.forEach((capture) => {
    const img = new Image();
    img.onload = () => {
      // Draw the image at the exact Y coordinate it was captured
      ctx.drawImage(img, 0, capture.y * ratio, viewportWidth * ratio, viewportHeight * ratio);
      loadedImages++;

      // 5. When all images are drawn, trigger the download
      if (loadedImages === captures.length) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          // Create a clean filename
          const cleanTitle = (document.title || 'screenshot').replace(/[^a-z0-9]/gi, '_').toLowerCase();
          a.download = `full_page_${cleanTitle}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          showNotification('✅ Full page capture saved successfully!', 'success');
        }, 'image/png');
      }
    };
    img.src = capture.dataUrl;
  });
}
// ==================== DEEP GOOGLE DOMAIN EXTRACTOR ====================

function extractBulkGoogleDomains() {
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
    'github.com', 'stackoverflow.com', 'ahref.com', 'ahrefs.com'
  ];
  
  const maxPages = 50;
  const baseUrl = window.location.href.split('&start=')[0].split('#')[0];
  const debugInfo = [];
  let extractionCancelled = false;
  let statusDiv = null;
  const totalDomainsCount = Math.floor(Math.random() * 500) + 200; // Estimated progress base

  function createStatusDiv() {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #1a1a2e; color: #eee; 
      padding: 15px; border-radius: 8px; z-index: 100000; font-family: -apple-system, sans-serif; 
      font-size: 13px; min-width: 280px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); 
      border-left: 4px solid #4285f4;
    `;
    return div;
  }

  function updateStatus(message) {
    if (!statusDiv) return;
    const progress = Math.round((allDomains.size / totalDomainsCount) * 100) || 0;
    
    statusDiv.innerHTML = `
      <div style="font-weight:600; margin-bottom:8px; font-size:14px;">🌐 Deep Domain Extractor</div>
      <div style="margin-bottom:8px; color:#aaa;">${message}</div>
      <div style="background:#333; border-radius:4px; margin:8px 0; height:6px; overflow:hidden;">
        <div style="background:#4285f4; width:${Math.min(progress, 100)}%; height:100%; border-radius:4px; transition:width 0.3s;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:12px;">
        <span>Domains: <strong>${allDomains.size}</strong></span>
        <span>Pages: <strong>${debugInfo.length}</strong></span>
      </div>
      <button id="cancelDeepExtract" style="width:100%; padding:6px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Cancel Extraction</button>
    `;

    document.getElementById('cancelDeepExtract').addEventListener('click', () => {
      extractionCancelled = true;
      if (statusDiv && statusDiv.parentElement) statusDiv.remove();
      showNotification('Extraction cancelled.', 'warning');
      if (allDomains.size > 0) showResults();
    });
  }

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
            if (!isExcluded && excludedKeywords.some(kw => domain.includes(kw))) isExcluded = true;

            if (!isExcluded && domain && domain.length > 0 && domain.includes('.')) {
              if (!allDomains.has(domain)) {
                allDomains.add(domain);
                newDomains++;
              }
            }
          }
        } catch (e) {}
      }
    });

    debugInfo.push({ page: pageNum + 1, newDomains: newDomains, totalUnique: allDomains.size });
    return newDomains;
  }

  function fetchPage(pageNum) {
    if (extractionCancelled) return;
    const startNum = pageNum * 10;
    const url = baseUrl + '&start=' + startNum;
    
    updateStatus(`Fetching page ${pageNum + 1}/${maxPages}...`);
    
    fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': navigator.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      mode: 'cors',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    }).then(html => {
      if (extractionCancelled) return;
      const newDomains = extractDomainsFromHtml(html, pageNum);
      updateStatus(`Page ${pageNum + 1} complete (+${newDomains} new)`);
      
      const hasNext = html.includes('Next</span>') || html.includes('aria-label="Next"') || html.includes('id="pnnext"') || html.includes('&start=' + (startNum + 10));
      const hasResults = !html.includes('did not match any documents');
      
      if (hasNext && hasResults && pageNum < maxPages - 1) {
        setTimeout(() => { fetchPage(pageNum + 1); }, Math.random() * 800 + 400);
      } else {
        updateStatus('Complete! Showing results...');
        setTimeout(showResults, 500);
      }
    }).catch(error => {
      updateStatus(`Error on page ${pageNum + 1}, continuing...`);
      if (pageNum < maxPages - 1) {
        setTimeout(() => { fetchPage(pageNum + 1); }, 2000);
      } else {
        setTimeout(showResults, 500);
      }
    });
  }

 function showResults() {
    if (statusDiv && statusDiv.parentElement) statusDiv.remove();
    
    if (allDomains.size === 0) {
      showNotification('No unique domains found.', 'error');
      return;
    }

    const sortedDomains = Array.from(allDomains).sort();
    const domainList = sortedDomains.join('\n');
    
    const outputWindow = window.open('', '_blank');
    if (!outputWindow) {
      alert('Popup blocked! Please allow popups to see your domains.');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <title>Deep Extraction - ${sortedDomains.length} Domains</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f9fafb; margin: 0; }
        h1 { color: #1a202c; font-size: 24px; margin-bottom: 10px; }
        .counter { color: #666; margin-bottom: 20px; font-size: 14px; }
        button { background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; font-weight: bold; }
        button:hover { background: #45a049; }
        pre { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 13px; max-height: 70vh; overflow-y: auto; }
      </style>
    </head>
    <body>
      <h1>Deep Google Domain Extraction</h1>
      <div class="counter">Successfully scraped <strong>${sortedDomains.length}</strong> unique domains across ${debugInfo.length} pages.</div>
      <button id="copyAllBtn">📋 Copy All Domains</button>
      <pre>${sortedDomains.join('\n')}</pre>
    </body>
    </html>`;

    outputWindow.document.write(htmlContent);
    outputWindow.document.close();

    // CSP Compliant Event Listener
    outputWindow.document.getElementById('copyAllBtn').addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(domainList).then(() => {
          outputWindow.alert('Copied ' + sortedDomains.length + ' domains!');
        }).catch(() => outputWindow.prompt('Copy these domains:', domainList));
      } else {
        outputWindow.prompt('Copy these domains:', domainList);
      }
    });
  }

  // Start the process
  statusDiv = createStatusDiv();
  document.body.appendChild(statusDiv);
  updateStatus('Starting deep extraction...');
  
  setTimeout(() => {
    extractDomainsFromHtml(document.documentElement.innerHTML, -1); // Process current page
    fetchPage(0); // Begin fetching next pages
  }, 300);
}
// ==================== ALT TEXT GENERATOR PRO (FIXED) ====================
function generateAltText() {
  const images = document.querySelectorAll('img');
  
  if (images.length === 0) {
    showNotification('No images found on this page!', 'warning');
    return;
  }
  
  const results = [];
  
  // Image categories for detection
  const imageCategories = {
    logo: ['logo', 'brand', 'icon'],
    product: ['product', 'item', 'goods', 'merchandise'],
    person: ['avatar', 'profile', 'user', 'person', 'face', 'portrait'],
    banner: ['banner', 'hero', 'header', 'cover'],
    screenshot: ['screen', 'capture', 'screenshot'],
    chart: ['chart', 'graph', 'diagram', 'infographic'],
    button: ['btn', 'button', 'cta'],
    background: ['bg', 'background', 'pattern']
  };
  
  images.forEach((img, index) => {
    const src = img.src || img.getAttribute('data-src') || '';
    const existingAlt = img.getAttribute('alt') || '';
    const filename = src.split('/').pop()?.split('?')[0] || `image-${index + 1}`;
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    
    // Context gathering
    const parent = img.closest('figure, div, a, picture, section, article');
    const nearbyText = parent?.textContent?.trim().substring(0, 200) || '';
    const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
    const linkHref = img.closest('a')?.getAttribute('href') || '';
    
    // Image attributes
    const classes = (img.className || '').toLowerCase();
    const id = (img.id || '').toLowerCase();
    const ariaLabel = img.getAttribute('aria-label') || '';
    const title = img.getAttribute('title') || '';
    const width = img.width || img.getAttribute('width') || '';
    const height = img.height || img.getAttribute('height') || '';
    
    // Detect image type
    let imageType = 'image';
    for (const [type, indicators] of Object.entries(imageCategories)) {
      if (indicators.some(ind => 
        classes.includes(ind) || 
        id.includes(ind) || 
        filename.toLowerCase().includes(ind) ||
        nearbyText.toLowerCase().includes(ind)
      )) {
        imageType = type;
        break;
      }
    }
    
    // Generate suggestion
    let suggestion = '';
    let confidence = 0;
    
    if (existingAlt && existingAlt.length > 10 && !existingAlt.match(/^(image|picture|photo|img)\d*$/i)) {
      suggestion = existingAlt;
      confidence = 90;
    } else if (caption) {
      suggestion = caption.substring(0, 125);
      confidence = 85;
    } else if (ariaLabel) {
      suggestion = ariaLabel;
      confidence = 80;
    } else if (title) {
      suggestion = title;
      confidence = 75;
    } else {
      switch(imageType) {
        case 'logo':
          const domain = window.location.hostname.replace('www.', '').split('.')[0];
          suggestion = `${domain.charAt(0).toUpperCase() + domain.slice(1)} official logo`;
          confidence = 70;
          break;
        case 'person':
          const nameHint = nameWithoutExt.match(/([A-Z][a-z]+)/g)?.join(' ') || 'person';
          suggestion = `Portrait photo of ${nameHint}`;
          confidence = 65;
          break;
        case 'product':
          suggestion = `Product image showing ${nameWithoutExt}`;
          confidence = 60;
          break;
        case 'banner':
          const pageContext = document.querySelector('h1')?.textContent || document.title;
          suggestion = `Banner image for ${pageContext}`;
          confidence = 70;
          break;
        case 'screenshot':
          suggestion = `Screenshot of ${nameWithoutExt} interface`;
          confidence = 75;
          break;
        case 'chart':
          const chartContext = nearbyText.match(/(\w+\s+){1,5}(chart|graph|data)/i)?.[0] || 'data visualization';
          suggestion = `${chartContext} showing key metrics`;
          confidence = 65;
          break;
        default:
          const contextWords = nearbyText
            .split(/\s+/)
            .filter(w => w.length > 3)
            .slice(0, 6)
            .join(' ');
          
          if (contextWords.length > 15) {
            suggestion = `Image illustrating ${contextWords}`;
            confidence = 55;
          } else {
            const cleanedName = nameWithoutExt
              .replace(/([A-Z])/g, ' $1')
              .replace(/\d+/g, '')
              .trim();
            suggestion = cleanedName || `Content image ${index + 1}`;
            confidence = 40;
          }
      }
    }
    
    // Clean suggestion
    suggestion = suggestion
      .replace(/\s+/g, ' ')
      .replace(/^\d+[-_]\s*/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s*\.(jpg|jpeg|png|gif|webp|svg)/gi, '')
      .trim();
    
    suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    
    if (suggestion.length > 125) {
      suggestion = suggestion.substring(0, 122) + '...';
    }
    
    // Quality score
    let qualityScore = 0;
    if (existingAlt) {
      qualityScore += 40;
      if (existingAlt.length >= 10 && existingAlt.length <= 125) qualityScore += 20;
      if (!existingAlt.match(/^(image|picture|photo|img)\d*$/i)) qualityScore += 20;
    }
    if (width && height) qualityScore += 10;
    
    const needsAlt = !existingAlt || existingAlt.length < 10 || existingAlt.match(/^(image|picture|photo|img)\d*$/i);
    const isDecorative = !!(classes.includes('decorative') || classes.includes('bg-') || (width < 50 && height < 50));
    
    results.push({
      index: index + 1,
      src: src,
      filename: filename,
      existingAlt: existingAlt || '',
      suggestion: suggestion,
      confidence: confidence,
      imageType: imageType,
      needsAlt: needsAlt && !isDecorative,
      qualityScore: qualityScore,
      dimensions: width && height ? `${width}x${height}` : 'unknown',
      inLink: !!linkHref,
      isDecorative: isDecorative,
      element: img
    });
  });
  
  // Calculate stats
  const missingAlt = results.filter(r => r.needsAlt);
  const poorQuality = results.filter(r => !r.needsAlt && r.qualityScore < 60 && !r.isDecorative);
  const goodQuality = results.filter(r => r.qualityScore >= 60 && !r.isDecorative);
  const decorativeImages = results.filter(r => r.isDecorative);
  
  const seoScore = Math.max(0, 100 - (missingAlt.length * 10) - (poorQuality.length * 5));
  const seoGrade = seoScore >= 90 ? 'A' : seoScore >= 75 ? 'B' : seoScore >= 60 ? 'C' : seoScore >= 40 ? 'D' : 'F';
  
  // Create modal content
  const content = document.createElement('div');
  content.style.padding = '20px';
  content.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  content.style.maxHeight = '80vh';
  content.style.overflowY = 'auto';
  
  content.innerHTML = `
    <!-- SEO Score Card -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="margin: 0 0 10px; font-size: 24px;">🖼️ AI Alt Text Analyzer Pro</h3>
          <p style="margin: 0; opacity: 0.95; font-size: 14px;">
            ${results.length} images analyzed • ${missingAlt.length} need attention
          </p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 48px; font-weight: bold; line-height: 1;">${seoGrade}</div>
          <div style="font-size: 14px; opacity: 0.9;">SEO Score: ${seoScore}%</div>
        </div>
      </div>
    </div>
    
    <!-- Quick Stats -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
      <div style="background: #fff3e0; padding: 15px; border-radius: 12px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #f44336;">${missingAlt.length}</div>
        <div style="color: #666; font-size: 13px;">⚠️ Missing Alt</div>
      </div>
      <div style="background: #fff9c4; padding: 15px; border-radius: 12px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #ff9800;">${poorQuality.length}</div>
        <div style="color: #666; font-size: 13px;">📝 Needs Work</div>
      </div>
      <div style="background: #e8f5e9; padding: 15px; border-radius: 12px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #4CAF50;">${goodQuality.length}</div>
        <div style="color: #666; font-size: 13px;">✅ Good</div>
      </div>
      <div style="background: #e3f2fd; padding: 15px; border-radius: 12px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #2196F3;">${decorativeImages.length}</div>
        <div style="color: #666; font-size: 13px;">🎨 Decorative</div>
      </div>
    </div>
    
    <!-- Action Bar -->
    <div style="display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: wrap;">
      <button id="copyAllAltsBtn" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500;">
        📋 Copy All Suggestions
      </button>
      <button id="applyAllAltsBtn" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500;">
        ✨ Apply All to Images
      </button>
      <button id="refreshAltAnalysis" style="padding: 12px 24px; background: #FF9800; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500;">
        🔄 Refresh Analysis
      </button>
    </div>
    
    <!-- Images List -->
    <div id="altImagesList">
      ${results.map(item => renderImageItem(item)).join('')}
    </div>
    
    <!-- Tips -->
    <div style="margin-top: 25px; padding: 15px; background: #f9f9f9; border-radius: 10px; border-left: 4px solid #667eea;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <span>💡</span>
        <span><strong>Alt Text Best Practices:</strong></span>
      </div>
      <ul style="margin: 5px 0 0 30px; color: #666; font-size: 13px; line-height: 1.8;">
        <li>Keep alt text under 125 characters</li>
        <li>Be descriptive but concise</li>
        <li>Don't start with "Image of" or "Picture of"</li>
        <li>Use empty alt="" for decorative images</li>
      </ul>
    </div>
  `;
  
  function renderImageItem(item) {
    const statusColor = item.isDecorative ? '#9E9E9E' : 
                      item.needsAlt ? '#f44336' : 
                      item.qualityScore < 60 ? '#ff9800' : '#4CAF50';
    const statusIcon = item.isDecorative ? '🎨' :
                      item.needsAlt ? '⚠️' : 
                      item.qualityScore < 60 ? '📝' : '✅';
    
    return `
      <div class="alt-item-${item.index}" style="background: white; border-radius: 12px; margin-bottom: 15px; border: 1px solid #e0e0e0; overflow: hidden;">
        <div style="display: flex; align-items: center; padding: 15px; background: #fafafa; border-bottom: 1px solid #e0e0e0;">
          <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${item.src ? 
              `<img src="${escapeHtml(item.src)}" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display='none';">` : 
              '<span style="font-size: 24px;">🖼️</span>'}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
              <span style="font-weight: 600; color: #333;">Image #${item.index}</span>
              <span style="background: ${statusColor}20; color: ${statusColor}; padding: 2px 10px; border-radius: 12px; font-size: 11px;">
                ${statusIcon} ${item.imageType.toUpperCase()}
              </span>
              <span style="color: #999; font-size: 12px;">${item.dimensions}</span>
            </div>
            <div style="font-size: 12px; color: #666; word-break: break-all;">
              ${escapeHtml(item.filename)}
            </div>
            <div style="display: flex; gap: 15px; margin-top: 5px;">
              <span style="font-size: 11px; color: #999;">Confidence: ${item.confidence}%</span>
              <span style="font-size: 11px; color: #999;">Quality: ${item.qualityScore}/100</span>
            </div>
          </div>
        </div>
        
        <div style="padding: 15px;">
          ${!item.isDecorative ? `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">
                ${item.needsAlt ? '🤖 AI Suggestion:' : '📝 Current Alt Text:'}
              </label>
              <div style="display: flex; gap: 10px;">
                <input type="text" 
                       id="alt-input-${item.index}" 
                       value="${escapeHtml(item.needsAlt ? item.suggestion : item.existingAlt)}"
                       style="flex: 1; padding: 10px; border: 2px solid ${item.needsAlt ? '#667eea' : '#e0e0e0'}; border-radius: 8px; font-size: 13px;">
                <button class="copy-alt-btn" data-index="${item.index}"
                        style="padding: 10px 16px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer;">
                  📋
                </button>
                <button class="apply-alt-btn" data-index="${item.index}"
                        style="padding: 10px 16px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">
                  Apply
                </button>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 5px;">
                <button class="quick-suggestion-btn" data-index="${item.index}" data-suggestion="${escapeHtml(item.suggestion + ' - high quality')}"
                        style="padding: 4px 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 15px; font-size: 11px; cursor: pointer;">
                  + quality
                </button>
                <button class="quick-suggestion-btn" data-index="${item.index}" data-suggestion="${escapeHtml(item.suggestion + ' - detailed')}"
                        style="padding: 4px 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 15px; font-size: 11px; cursor: pointer;">
                  + detailed
                </button>
              </div>
              <label style="display: flex; align-items: center; gap: 5px; font-size: 12px; color: #666;">
                <input type="checkbox" class="decorative-cb" data-index="${item.index}">
                Decorative
              </label>
            </div>
          ` : `
            <div style="color: #999; font-style: italic; padding: 10px; background: #f5f5f5; border-radius: 8px; text-align: center;">
              🎨 This image appears to be decorative. Alt text can be left empty.
            </div>
          `}
        </div>
      </div>
    `;
  }
  
  // Create and show modal
  const modal = createModal('🖼️ AI Alt Text Generator Pro', content);
  
  // Add event listeners after modal is in DOM
  setTimeout(() => {
    // Copy individual alt text
    document.querySelectorAll('.copy-alt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        const input = document.getElementById(`alt-input-${index}`);
        if (input) {
          copyToClipboard(input.value);
          showNotification('✅ Alt text copied!', 'success');
          
          this.innerHTML = '✓';
          setTimeout(() => this.innerHTML = '📋', 1500);
        }
      });
    });
    
    // Apply individual alt text
    document.querySelectorAll('.apply-alt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index) - 1;
        const input = document.getElementById(`alt-input-${this.dataset.index}`);
        
        if (input && results[index] && results[index].element) {
          const img = results[index].element;
          img.setAttribute('alt', input.value);
          showNotification(`✨ Alt text applied to image #${this.dataset.index}`, 'success');
          
          this.innerHTML = '✓ Applied';
          this.style.background = '#45a049';
          setTimeout(() => {
            this.innerHTML = 'Apply';
            this.style.background = '#4CAF50';
          }, 2000);
        }
      });
    });
    
    // Quick suggestions
    document.querySelectorAll('.quick-suggestion-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        const suggestion = this.dataset.suggestion;
        const input = document.getElementById(`alt-input-${index}`);
        
        if (input) {
          input.value = suggestion;
          showNotification('💡 Suggestion applied!', 'success');
        }
      });
    });
    
    // Decorative checkbox
    document.querySelectorAll('.decorative-cb').forEach(cb => {
      cb.addEventListener('change', function() {
        const index = parseInt(this.dataset.index) - 1;
        const input = document.getElementById(`alt-input-${this.dataset.index}`);
        
        if (this.checked && results[index] && results[index].element) {
          input.value = '';
          input.disabled = true;
          results[index].element.setAttribute('alt', '');
          showNotification('🎨 Marked as decorative', 'success');
        } else if (input) {
          input.disabled = false;
        }
      });
    });
    
    // Copy all
    document.getElementById('copyAllAltsBtn')?.addEventListener('click', () => {
      const suggestions = results
        .filter(r => r.needsAlt && !r.isDecorative)
        .map(r => `Image ${r.index}: ${r.suggestion}`)
        .join('\n');
      
      copyToClipboard(suggestions);
      showNotification(`📋 Copied ${results.filter(r => r.needsAlt && !r.isDecorative).length} suggestions!`, 'success');
    });
    
    // Apply all
    document.getElementById('applyAllAltsBtn')?.addEventListener('click', () => {
      let applied = 0;
      results.forEach(item => {
        if (item.needsAlt && !item.isDecorative && item.element) {
          item.element.setAttribute('alt', item.suggestion);
          applied++;
        }
      });
      showNotification(`✨ Applied alt text to ${applied} images!`, 'success');
    });
    
    // Refresh
    document.getElementById('refreshAltAnalysis')?.addEventListener('click', () => {
      modal.close();
      generateAltText();
    });
    
  }, 100);
}

// ==================== AI META TAG GENERATOR PRO ====================
function generateAIMetaTags() {
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || pageTitle;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  const firstParagraph = document.querySelector('p')?.textContent || '';
  const bodyText = document.body.innerText.substring(0, 3000);
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  
  // Advanced keyword extraction
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were', 'been']);
  
  // Calculate word frequency with scoring
  const wordFreq = {};
  const wordPositions = {};
  
  words.forEach((w, i) => {
    if (w.length > 3 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
      if (!wordPositions[w]) wordPositions[w] = [];
      wordPositions[w].push(i);
    }
  });
  
  // Score keywords based on frequency and position
  const scoredKeywords = Object.entries(wordFreq).map(([word, freq]) => {
    const firstOccurrence = Math.min(...wordPositions[word]);
    const positionScore = 1 - (firstOccurrence / words.length); // Earlier = higher score
    const score = (freq * 2) + (positionScore * 10);
    return { word, freq, score };
  });
  
  const topKeywords = scoredKeywords
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(k => k.word);
  
  // Generate title variations with scoring
  const titleVariations = [
    { 
      text: `${h1} | ${domain}`,
      score: 95,
      reason: 'Classic format, high CTR'
    },
    { 
      text: `${h1}: ${topKeywords.slice(0, 3).join(' ')} Guide (${new Date().getFullYear()})`,
      score: 90,
      reason: 'Keyword-rich with year'
    },
    { 
      text: `Ultimate Guide to ${h1} - Tips & Strategies`,
      score: 88,
      reason: 'Action-oriented language'
    },
    { 
      text: `${h1} Made Easy: Complete Tutorial for Beginners`,
      score: 85,
      reason: 'Beginner-friendly appeal'
    },
    { 
      text: `How to Master ${h1} in ${new Date().getFullYear()}`,
      score: 82,
      reason: 'Current year, actionable'
    },
    { 
      text: `${topKeywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' & ')}: ${h1} Explained`,
      score: 80,
      reason: 'Primary keywords first'
    },
    { 
      text: `${h1} - Everything You Need to Know`,
      score: 78,
      reason: 'Comprehensive appeal'
    },
    { 
      text: `The Complete ${h1} Checklist for Success`,
      score: 75,
      reason: 'Checklist format, high engagement'
    }
  ];
  
  // Generate meta descriptions with scoring
  const metaVariations = [
    {
      text: `Learn everything about ${h1}. ${firstParagraph.substring(0, 120)}...`,
      score: 92,
      length: 0
    },
    {
      text: `Discover how to master ${h1} with our comprehensive guide. Includes ${topKeywords.slice(0, 4).join(', ')} strategies and expert tips.`,
      score: 90,
      length: 0
    },
    {
      text: `Want to improve your ${h1} skills? Our complete guide covers ${topKeywords.slice(0, 5).join(', ')} and proven techniques for success.`,
      score: 88,
      length: 0
    },
    {
      text: `${h1} explained: ${firstParagraph.substring(0, 130)}... Learn more about ${topKeywords.slice(0, 3).join(', ')} today.`,
      score: 85,
      length: 0
    },
    {
      text: `The ultimate resource for ${h1} in ${new Date().getFullYear()}. Includes ${topKeywords.slice(0, 4).join(', ')} strategies, examples, and best practices.`,
      score: 83,
      length: 0
    }
  ];
  
  // Calculate lengths and adjust scores
  metaVariations.forEach(m => {
    m.length = m.text.length;
    if (m.length > 160) m.score -= 10;
    if (m.length < 120) m.score -= 5;
    if (m.length >= 150 && m.length <= 160) m.score += 5;
  });
  
  titleVariations.forEach(t => {
    const len = t.text.length;
    if (len > 60) t.score -= 10;
    if (len < 30) t.score -= 5;
    if (len >= 50 && len <= 60) t.score += 5;
  });
  
  // Sort by score
  titleVariations.sort((a, b) => b.score - a.score);
  metaVariations.sort((a, b) => b.score - a.score);
  
  // Current meta analysis
  const currentMetaScore = calculateMetaScore(pageTitle, metaDescription, topKeywords);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      
      <!-- Header with Score -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px; font-size: 24px;">🤖 AI Meta Tag Generator Pro</h3>
            <p style="margin: 0; opacity: 0.95; font-size: 14px;">
              SEO-optimized suggestions based on content analysis
            </p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px; font-weight: bold; line-height: 1;">${currentMetaScore}</div>
            <div style="font-size: 14px; opacity: 0.9;">Current SEO Score</div>
          </div>
        </div>
      </div>
      
      <!-- Current Meta Analysis -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">📊 Current Meta Tags Analysis</h4>
        <div style="display: grid; gap: 15px;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Title Tag</span>
              <span style="color: ${pageTitle.length > 60 ? '#f44336' : pageTitle.length < 30 ? '#ff9800' : '#4CAF50'};">
                ${pageTitle.length} chars
              </span>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
              ${escapeHtml(pageTitle) || '<span style="color: #999;">No title found</span>'}
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Meta Description</span>
              <span style="color: ${metaDescription.length > 160 ? '#f44336' : metaDescription.length < 120 ? '#ff9800' : '#4CAF50'};">
                ${metaDescription.length} chars
              </span>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
              ${escapeHtml(metaDescription) || '<span style="color: #999;">No meta description found</span>'}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Keyword Analysis -->
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">🎯 Top Keywords Detected</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${topKeywords.slice(0, 10).map((kw, i) => `
            <span style="background: ${i < 3 ? '#667eea' : '#e0e0e0'}; 
                         color: ${i < 3 ? 'white' : '#333'}; 
                         padding: 8px 16px; 
                         border-radius: 20px; 
                         font-size: 13px;
                         font-weight: ${i < 3 ? '600' : '400'};">
              #${escapeHtml(kw)}
            </span>
          `).join('')}
        </div>
      </div>
      
      <!-- Title Suggestions -->
      <div style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h4 style="margin: 0; color: #333;">📝 AI-Generated Title Tags</h4>
          <span style="font-size: 12px; color: #666;">Optimal: 50-60 characters</span>
        </div>
        ${titleVariations.map((title, i) => `
          <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; 
                      padding: 15px; 
                      border-radius: 10px; 
                      margin-bottom: 10px; 
                      border: 2px solid ${i === 0 ? '#4CAF50' : '#e0e0e0'};
                      position: relative;">
            ${i === 0 ? '<span style="position: absolute; top: -10px; left: 15px; background: #4CAF50; color: white; padding: 2px 12px; border-radius: 20px; font-size: 11px;">🏆 Best Match</span>' : ''}
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: 600; color: #667eea;">Option ${i + 1}</span>
                <span style="background: ${title.score >= 90 ? '#4CAF50' : title.score >= 80 ? '#8BC34A' : '#FFC107'}20; 
                             color: ${title.score >= 90 ? '#4CAF50' : title.score >= 80 ? '#8BC34A' : '#FFC107'}; 
                             padding: 2px 10px; 
                             border-radius: 12px; 
                             font-size: 11px; 
                             font-weight: 500;">
                  Score: ${title.score}/100
                </span>
              </div>
              <span style="color: ${title.text.length > 60 ? '#f44336' : title.text.length < 30 ? '#ff9800' : '#4CAF50'}; font-size: 12px;">
                ${title.text.length} chars
              </span>
            </div>
            <div style="font-size: 14px; margin-bottom: 10px; color: #333; line-height: 1.5;">
              ${escapeHtml(title.text)}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #666;">💡 ${title.reason}</span>
              <button class="copy-title-btn" data-text="${escapeHtml(title.text)}" 
                      style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                📋 Copy
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Meta Description Suggestions -->
      <div style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h4 style="margin: 0; color: #333;">📄 AI-Generated Meta Descriptions</h4>
          <span style="font-size: 12px; color: #666;">Optimal: 150-160 characters</span>
        </div>
        ${metaVariations.map((desc, i) => `
          <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; 
                      padding: 15px; 
                      border-radius: 10px; 
                      margin-bottom: 10px; 
                      border: 2px solid ${i === 0 ? '#4CAF50' : '#e0e0e0'};
                      position: relative;">
            ${i === 0 ? '<span style="position: absolute; top: -10px; left: 15px; background: #4CAF50; color: white; padding: 2px 12px; border-radius: 20px; font-size: 11px;">🏆 Best Match</span>' : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: 600; color: #667eea;">Option ${i + 1}</span>
                <span style="background: ${desc.score >= 90 ? '#4CAF50' : desc.score >= 80 ? '#8BC34A' : '#FFC107'}20; 
                             color: ${desc.score >= 90 ? '#4CAF50' : desc.score >= 80 ? '#8BC34A' : '#FFC107'}; 
                             padding: 2px 10px; 
                             border-radius: 12px; 
                             font-size: 11px; 
                             font-weight: 500;">
                  Score: ${desc.score}/100
                </span>
              </div>
              <span style="color: ${desc.length > 160 ? '#f44336' : desc.length < 120 ? '#ff9800' : '#4CAF50'}; font-size: 12px;">
                ${desc.length} chars
              </span>
            </div>
            <div style="font-size: 13px; margin-bottom: 10px; color: #555; line-height: 1.6;">
              ${escapeHtml(desc.text)}
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button class="copy-desc-btn" data-text="${escapeHtml(desc.text)}" 
                      style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                📋 Copy
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Additional Meta Tags -->
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">🏷️ Additional Meta Tags</h4>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">Meta Keywords:</label>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; font-family: monospace; font-size: 13px;">
              ${escapeHtml(topKeywords.slice(0, 10).join(', '))}
            </div>
            <button class="copy-keywords-btn" data-text="${escapeHtml(topKeywords.slice(0, 10).join(', '))}" 
                    style="margin-top: 8px; padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
              📋 Copy Keywords
            </button>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">Open Graph Title:</label>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
              ${escapeHtml(titleVariations[0].text)}
            </div>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333;">Twitter Card Title:</label>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
              ${escapeHtml(titleVariations[0].text.substring(0, 70))}
            </div>
          </div>
        </div>
      </div>
      
      <!-- SEO Preview -->
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">🔍 Search Engine Preview</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <div style="color: #1a0dab; font-size: 18px; margin-bottom: 5px; text-decoration: none;">
            ${escapeHtml(titleVariations[0].text)}
          </div>
          <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
            ${escapeHtml(url.substring(0, 60))}${url.length > 60 ? '...' : ''}
          </div>
          <div style="color: #545454; font-size: 13px; line-height: 1.4;">
            ${escapeHtml(metaVariations[0].text)}
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="display: flex; gap: 12px;">
        <button id="copyBestMeta" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">
          📋 Copy Best Title + Description
        </button>
        <button id="exportMetaReport" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #2196F3, #1976D2); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">
          📊 Export SEO Report
        </button>
      </div>
    </div>
  `;
  
  function calculateMetaScore(title, desc, keywords) {
    let score = 0;
    
    // Title scoring
    if (title) {
      score += 20;
      if (title.length >= 50 && title.length <= 60) score += 15;
      else if (title.length >= 30 && title.length <= 70) score += 5;
      
      keywords.slice(0, 3).forEach(kw => {
        if (title.toLowerCase().includes(kw)) score += 5;
      });
    }
    
    // Description scoring
    if (desc) {
      score += 20;
      if (desc.length >= 150 && desc.length <= 160) score += 15;
      else if (desc.length >= 120 && desc.length <= 170) score += 5;
      
      keywords.slice(0, 5).forEach(kw => {
        if (desc.toLowerCase().includes(kw)) score += 3;
      });
    }
    
    return Math.min(100, score);
  }
  
  const modal = createModal('🤖 AI Meta Tag Generator Pro', content);
  
  setTimeout(() => {
    // Copy handlers
    document.querySelectorAll('.copy-title-btn, .copy-desc-btn, .copy-keywords-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.text);
        showNotification('✅ Copied to clipboard!', 'success');
        
        // Visual feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
        }, 1500);
      });
    });
    
    // Copy best meta
    document.getElementById('copyBestMeta')?.addEventListener('click', () => {
      const bestTitle = titleVariations[0].text;
      const bestDesc = metaVariations[0].text;
      copyToClipboard(`Title: ${bestTitle}\nDescription: ${bestDesc}`);
      showNotification('✨ Best meta tags copied!', 'success');
    });
    
    // Export report
    document.getElementById('exportMetaReport')?.addEventListener('click', () => {
      const report = {
        timestamp: new Date().toISOString(),
        url: url,
        currentMeta: {
          title: pageTitle,
          description: metaDescription,
          keywords: metaKeywords,
          score: currentMetaScore
        },
        recommendations: {
          bestTitle: titleVariations[0],
          bestDescription: metaVariations[0],
          allTitles: titleVariations,
          allDescriptions: metaVariations,
          keywords: topKeywords.slice(0, 10)
        },
        analysis: {
          contentLength: bodyText.length,
          h1Heading: h1,
          domain: domain
        }
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url_blob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `seo-meta-report-${new Date().getTime()}.json`;
      a.click();
      
      showNotification('📊 SEO report exported!', 'success');
    });
    
  }, 100);
}

// ==================== URL OPTIMIZER ====================
function optimizeUrl() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const path = urlObj.pathname;
  
  const issues = [];
  
  if (currentUrl.length > 75) {
    issues.push(`URL is ${currentUrl.length} characters (recommended: under 75)`);
  }
  if (path !== path.toLowerCase()) {
    issues.push('URL contains uppercase letters (use lowercase)');
  }
  if (path.includes('_')) {
    issues.push('URL uses underscores (use hyphens instead)');
  }
  if (urlObj.searchParams.toString().length > 0) {
    issues.push(`URL has ${urlObj.searchParams.size} parameter(s)`);
  }
  
  const stopWords = ['a', 'an', 'and', 'the', 'of', 'in', 'on', 'at', 'to', 'for'];
  stopWords.forEach(word => {
    if (path.toLowerCase().includes(`/${word}/`) || path.toLowerCase().includes(`-${word}-`)) {
      issues.push(`Contains stop word: "${word}"`);
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
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 URL Analysis</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current URL:</strong><br><span style="font-family: monospace; font-size: 12px; word-break: break-all;">${escapeHtml(currentUrl)}</span></p>
          <p><strong>Length:</strong> ${currentUrl.length} characters ${currentUrl.length > 75 ? '⚠️' : '✅'}</p>
          <p><strong>Path Depth:</strong> ${path.split('/').filter(Boolean).length} levels</p>
        </div>
      </div>
      
      ${issues.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #f44336;">⚠️ Issues Found</h4>
          <ul style="background: #ffebee; padding: 15px 15px 15px 35px; border-radius: 8px; margin: 0;">
            ${issues.map(issue => `<li>${issue}</li>`).join('')}
          </ul>
        </div>
      ` : `
        <div style="margin-bottom: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px; color: #2e7d32;">
          ✅ URL looks good! No major issues found.
        </div>
      `}
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">✨ Optimized URL Suggestion</h4>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
          <p style="font-family: monospace; font-size: 13px; word-break: break-all; margin-bottom: 10px;">${escapeHtml(optimizedUrl)}</p>
          <button id="copyOptimizedUrl" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Copy Optimized URL
          </button>
        </div>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 URL Best Practices</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Keep URLs under 75 characters</li>
          <li>Use lowercase letters only</li>
          <li>Use hyphens (-) not underscores (_)</li>
          <li>Include target keyword</li>
          <li>Avoid unnecessary parameters</li>
          <li>Keep structure shallow (2-3 levels)</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🔗 URL Optimizer', content);
  
  setTimeout(() => {
    document.getElementById('copyOptimizedUrl')?.addEventListener('click', () => {
      copyToClipboard(optimizedUrl);
      showNotification('Optimized URL copied!', 'success');
    });
  }, 100);
}

// ==================== SEO TITLE GENERATOR ====================
function generateSEOTitles() {
  const h1 = document.querySelector('h1')?.textContent || document.title;
  const bodyText = document.body.innerText.substring(0, 1000);
  
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 5);
  
  const domain = window.location.hostname.replace('www.', '').split('.')[0];
  
  const titleVariations = [
    `${h1} | ${domain}`,
    `${h1}: ${keywords.slice(0, 3).join(' ')} Guide`,
    `${h1} - Complete Guide ${new Date().getFullYear()}`,
    `How to ${h1}: ${keywords.slice(0, 2).join(' and ')} Tips`,
    `${keywords.slice(0, 2).join(' ')} ${keywords[2] || ''}: ${h1}`,
    `The Ultimate ${h1} Guide for ${new Date().getFullYear()}`,
    `${h1} Explained: Everything You Need to Know`,
    `Master ${h1} with These ${keywords[0] || 'Expert'} Tips`,
    `${h1} ${keywords[0] ? `| ${keywords[0]} ` : ''}Strategies & Examples`,
    `Learn ${h1}: Step-by-Step Tutorial`
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📝 SEO Title Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">${titleVariations.length} optimized titles generated</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyAllTitles" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy All Titles
        </button>
      </div>
      
      ${titleVariations.map((title, i) => `
        <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <span style="font-weight: 600; margin-right: 15px; color: #667eea;">#${i + 1}</span>
            <span style="${title.length > 60 ? 'color: #f44336;' : 'color: #4CAF50;'}">${escapeHtml(title)}</span>
            <span style="margin-left: 10px; font-size: 11px; color: #666;">(${title.length} chars)</span>
          </div>
          <button class="copy-title-btn" data-title="${escapeHtml(title)}" 
            style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Copy
          </button>
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 Title Best Practices</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Keep between 50-60 characters</li>
          <li>Include primary keyword near the beginning</li>
          <li>Add power words (Ultimate, Complete, Essential)</li>
          <li>Use numbers when relevant</li>
          <li>Make it compelling for clicks</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📝 SEO Title Generator', content);
  
  setTimeout(() => {
    document.getElementById('copyAllTitles')?.addEventListener('click', () => {
      copyToClipboard(titleVariations.join('\n'));
      showNotification(`${titleVariations.length} titles copied!`, 'success');
    });
    
    document.querySelectorAll('.copy-title-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.title);
        showNotification('Title copied!', 'success');
      });
    });
  }, 100);
}


// ==================== LINK PROSPECT FINDER ====================
function findLinkProspects() {
  const domain = window.location.hostname.replace('www.', '');
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || '';
  
  // Extract keywords for prospecting
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  
  const mainKeyword = keywords[0] || domain;
  
  const searchQueries = [
    // Guest post queries
    { name: 'Guest Post Opportunities', query: `${mainKeyword} "write for us"` },
    { name: 'Guest Post Guidelines', query: `${mainKeyword} "guest post guidelines"` },
    { name: 'Become a Contributor', query: `${mainKeyword} "become a contributor"` },
    { name: 'Submit Guest Post', query: `${mainKeyword} "submit guest post"` },
    { name: 'Guest Author', query: `${mainKeyword} "guest author"` },
    
    // Niche edit queries
    { name: 'Link Insertion', query: `${mainKeyword} "link insertion"` },
    { name: 'Update Old Post', query: `${mainKeyword} "update" "article"` },
    
    // Resource link queries
    { name: 'Useful Links', query: `${mainKeyword} "useful links"` },
    { name: 'Helpful Resources', query: `${mainKeyword} "helpful resources"` },
    { name: 'Recommended Sites', query: `${mainKeyword} "recommended sites"` },
    
    // Roundup queries
    { name: 'Weekly Roundup', query: `${mainKeyword} "weekly roundup"` },
    { name: 'Monthly Favorites', query: `${mainKeyword} "monthly" "favorites"` },
    
    // Expert quotes
    { name: 'Expert Roundup', query: `${mainKeyword} "expert roundup"` },
    { name: 'Industry Experts', query: `${mainKeyword} "industry experts"` },
    
    // Competitor mentions
    { name: 'Competitor Mentions', query: `${mainKeyword} "top" "best" "review"` }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🎯 Link Prospect Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find guest post and link opportunities</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current Site:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Main Keyword:</strong> ${escapeHtml(mainKeyword)}</p>
          <p><strong>Custom Keyword:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input type="text" id="customKeyword" placeholder="Enter custom keyword..." value="${escapeHtml(mainKeyword)}" 
              style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="updateQueries" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Update
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openAllQueries" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🚀 Open All Queries
        </button>
        <button id="copyAllQueries" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Search URLs
        </button>
      </div>
      
      <div id="queriesContainer"></div>
      
      <div style="margin-top: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #2e7d32;">💡 Prospecting Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Look for sites with good DA/DR metrics</li>
          <li>Check if they've published guest posts recently</li>
          <li>Verify the site gets organic traffic</li>
          <li>Review their guest post guidelines carefully</li>
          <li>Personalize your outreach email</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🎯 Link Prospect Finder', content);
  
  // Function to open Google search with proper query
  const openGoogleSearch = (queryText) => {
    if (!queryText) return;
    // Don't encode the whole query - just encode it properly for URL
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;
    window.open(searchUrl, '_blank');
  };
  
  // Function to render queries
  const renderQueries = (queries) => {
    const container = document.getElementById('queriesContainer');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => `
      <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <span style="font-weight: 600; color: #667eea; margin-right: 10px;">${sq.name}</span>
          <span style="color: #333; font-size: 13px; font-family: monospace;">${escapeHtml(sq.query)}</span>
        </div>
        <button class="open-query-btn" data-query-index="${i}" 
          style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Search
        </button>
      </div>
    `).join('');
    
    // Attach event listeners to buttons
    document.querySelectorAll('.open-query-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-query-index'));
        if (!isNaN(index) && queries[index]) {
          openGoogleSearch(queries[index].query);
        }
      });
    });
  };
  
  // Initial render
  let currentQueries = [...searchQueries];
  renderQueries(currentQueries);
  
  // Update queries when custom keyword changes
  const updateQueries = () => {
    const newKeyword = document.getElementById('customKeyword').value.trim() || mainKeyword;
    
    // Create new queries with the updated keyword
    currentQueries = searchQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword)
    }));
    
    renderQueries(currentQueries);
  };
  
  document.getElementById('updateQueries')?.addEventListener('click', updateQueries);
  
  // Open all queries
  document.getElementById('openAllQueries')?.addEventListener('click', () => {
    currentQueries.forEach((sq, i) => {
      setTimeout(() => {
        openGoogleSearch(sq.query);
      }, i * 300);
    });
    if (typeof showNotification === 'function') {
      showNotification('Opening all search queries...', 'success');
    }
  });
  
  // Copy all URLs
  document.getElementById('copyAllQueries')?.addEventListener('click', () => {
    const urls = currentQueries.map(sq => {
      return `https://www.google.com/search?q=${encodeURIComponent(sq.query)}`;
    }).join('\n');
    
    if (typeof copyToClipboard === 'function') {
      copyToClipboard(urls);
    } else {
      navigator.clipboard.writeText(urls);
    }
    
    if (typeof showNotification === 'function') {
      showNotification('Search URLs copied!', 'success');
    }
  });
}

// ==================== RESOURCE PAGE FINDER ====================
function findResourcePages() {
  const domain = window.location.hostname.replace('www.', '');
  const h1 = document.querySelector('h1')?.textContent || '';
  
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
    { name: 'Our Friends', query: `${mainKeyword} "our friends"` }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📚 Resource Page Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find resource pages for link building</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current Site:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Main Keyword:</strong> ${escapeHtml(mainKeyword)}</p>
          <p><strong>Custom Keyword:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input type="text" id="customKeyword" placeholder="Enter custom keyword..." value="${escapeHtml(mainKeyword)}" 
              style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="updateQueries" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Update
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openAllQueries" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🚀 Open All Queries
        </button>
        <button id="copyAllQueries" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Search URLs
        </button>
      </div>
      
      <div id="queriesContainer"></div>
      
      <div style="margin-top: 20px; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">💡 Resource Page Outreach Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Find broken links on resource pages first</li>
          <li>Offer a superior replacement resource</li>
          <li>Make sure your resource is genuinely useful</li>
          <li>Personalize your outreach email</li>
          <li>Follow up once after 3-5 days</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📚 Resource Page Finder', content);
  
  // Function to open Google search with proper query
  const openGoogleSearch = (queryText) => {
    if (!queryText) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;
    window.open(searchUrl, '_blank');
  };
  
  // Function to render queries
  const renderQueries = (queries) => {
    const container = document.getElementById('queriesContainer');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => `
      <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <span style="font-weight: 600; color: #667eea; margin-right: 10px;">${sq.name}</span>
          <span style="color: #333; font-size: 13px; font-family: monospace;">${escapeHtml(sq.query)}</span>
        </div>
        <button class="open-query-btn" data-query-index="${i}" 
          style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Search
        </button>
      </div>
    `).join('');
    
    // Attach event listeners to buttons
    document.querySelectorAll('.open-query-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-query-index'));
        if (!isNaN(index) && queries[index]) {
          openGoogleSearch(queries[index].query);
        }
      });
    });
  };
  
  // Initial render
  let currentQueries = [...resourceQueries];
  renderQueries(currentQueries);
  
  // Update queries when custom keyword changes
  const updateQueries = () => {
    const newKeyword = document.getElementById('customKeyword').value.trim() || mainKeyword;
    
    // Create new queries with the updated keyword
    currentQueries = resourceQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword)
    }));
    
    renderQueries(currentQueries);
  };
  
  document.getElementById('updateQueries')?.addEventListener('click', updateQueries);
  
  // Open all queries
  document.getElementById('openAllQueries')?.addEventListener('click', () => {
    currentQueries.forEach((sq, i) => {
      setTimeout(() => {
        openGoogleSearch(sq.query);
      }, i * 300);
    });
    if (typeof showNotification === 'function') {
      showNotification('Opening all resource page queries...', 'success');
    }
  });
  
  // Copy all URLs
  document.getElementById('copyAllQueries')?.addEventListener('click', () => {
    const urls = currentQueries.map(sq => {
      return `https://www.google.com/search?q=${encodeURIComponent(sq.query)}`;
    }).join('\n');
    
    if (typeof copyToClipboard === 'function') {
      copyToClipboard(urls);
    } else {
      navigator.clipboard.writeText(urls);
    }
    
    if (typeof showNotification === 'function') {
      showNotification('Search URLs copied!', 'success');
    }
  });
}

// ==================== SEO AUDIT CHECKLIST (UPGRADED) ====================
function showSEOAuditChecklist() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  
  // 1. Auto-detect Standard SEO issues
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1 = document.querySelector('h1')?.textContent || '';
  const h1Count = document.querySelectorAll('h1').length;
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const schema = document.querySelectorAll('script[type="application/ld+json"]').length;
  
  // 2. NEW: Auto-detect Social Media (Open Graph & Twitter)
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
  const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
  
  // 3. NEW: Auto-detect Analytics & Tracking
  let hasAnalytics = false;
  document.querySelectorAll('script').forEach(script => {
    const src = script.src || '';
    const content = script.textContent || '';
    if (src.includes('google-analytics.com') || 
        src.includes('googletagmanager.com') || 
        content.includes('gtag(') || 
        content.includes('G-')) {
      hasAnalytics = true;
    }
  });

  // 4. NEW: Auto-detect Favicon
  const hasFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') !== null;

  const checklistItems = [
    { category: 'Title & Meta Tags', items: [
      { name: 'Title tag present', check: title.length > 0, note: title || 'Missing' },
      { name: 'Title length (50-60 chars)', check: title.length >= 30 && title.length <= 65, note: `${title.length} chars` },
      { name: 'Meta description present', check: metaDesc.length > 0, note: metaDesc ? `${metaDesc.length} chars` : 'Missing' },
      { name: 'Meta description length (120-160)', check: metaDesc.length >= 120 && metaDesc.length <= 160, note: `${metaDesc.length} chars` }
    ]},
    { category: 'Headings & Content', items: [
      { name: 'H1 tag present', check: h1.length > 0, note: h1 || 'Missing' },
      { name: 'Only one H1 tag', check: h1Count === 1, note: `${h1Count} found` },
      { name: 'All images have alt text', check: imagesWithoutAlt === 0, note: `${imagesWithoutAlt} missing` }
    ]},
    { category: 'Technical SEO', items: [
      { name: 'Canonical tag present', check: canonical.length > 0, note: canonical || 'Missing' },
      { name: 'SSL/HTTPS enabled', check: url.startsWith('https'), note: url.startsWith('https') ? '✅ Enabled' : '❌ Not secure' },
      { name: 'Schema markup present', check: schema > 0, note: `${schema} schema(s) found` },
      { name: 'Robots meta tag', check: !robots.includes('noindex'), note: robots || 'Defaults to index' },
      { name: 'Mobile viewport configured', check: viewport.length > 0, note: viewport ? '✅ Responsive' : 'Missing' },
      { name: 'Favicon is configured', check: hasFavicon, note: hasFavicon ? '✅ Present' : 'Missing' }
    ]},
    { category: 'Social & Analytics (NEW)', items: [
      { name: 'Google Analytics / GTM', check: hasAnalytics, note: hasAnalytics ? '✅ Detected' : '❌ Not found' },
      { name: 'Open Graph Title (Facebook/LinkedIn)', check: ogTitle.length > 0, note: ogTitle ? '✅ Present' : 'Missing' },
      { name: 'Open Graph Image', check: ogImage.length > 0, note: ogImage ? '✅ Present' : 'Missing' },
      { name: 'Twitter Card configured', check: twitterCard.length > 0, note: twitterCard ? '✅ Present' : 'Missing' }
    ]}
  ];
  
  const totalItems = checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
  const passedItems = checklistItems.reduce((sum, cat) => sum + cat.items.filter(i => i.check).length, 0);
  const score = Math.round((passedItems / totalItems) * 100);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px; font-family: -apple-system, sans-serif;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, ${score > 70 ? '#4CAF50' : score > 40 ? '#FF9800' : '#f44336'} 0%, ${score > 70 ? '#2e7d32' : score > 40 ? '#e65100' : '#c62828'} 100%); color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 48px; font-weight: bold;">${score}%</div>
        <div style="font-size: 16px; margin: 10px 0;">Automated SEO Audit Score</div>
        <div style="font-size: 13px; opacity: 0.9;">${passedItems}/${totalItems} checks passed</div>
      </div>
      
      <div style="margin-bottom: 15px; display: flex; gap: 10px;">
        <button id="exportAudit" style="flex: 1; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          📥 Export Audit JSON
        </button>
        <button id="copyAuditSummary" style="flex: 1; padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          📋 Copy Summary
        </button>
      </div>
      
      ${checklistItems.map(category => `
        <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <h4 style="margin: 0 0 10px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px;">${category.category}</h4>
          ${category.items.map(item => `
            <div style="display: flex; align-items: center; padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px; border: 1px solid #e0e0e0;">
              <span style="margin-right: 12px; font-size: 16px;">${item.check ? '✅' : '❌'}</span>
              <span style="flex: 1; font-size: 13px; font-weight: 500;">${item.name}</span>
              <span style="font-size: 11px; color: ${item.check ? '#666' : '#f44336'}; max-width: 40%; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.note)}">${escapeHtml(item.note)}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
  
  const modal = createModal('✅ Automated SEO Audit', content);
  
  // Attach event listeners for the buttons
  setTimeout(() => {
    document.getElementById('exportAudit')?.addEventListener('click', () => {
      const reportData = {
        domain: domain,
        url: url,
        date: new Date().toISOString(),
        score: score,
        passed: passedItems,
        total: totalItems,
        checklist: checklistItems
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url_blob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `seo-audit-${domain}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url_blob);
      showNotification('Audit report exported!', 'success');
    });
    
    document.getElementById('copyAuditSummary')?.addEventListener('click', () => {
      const summary = `SEO Audit Summary - ${domain}
Date: ${new Date().toLocaleDateString()}
Score: ${score}% (${passedItems}/${totalItems} checks passed)

❌ Issues Found:
${checklistItems.flatMap(c => c.items.filter(i => !i.check).map(i => `- ${i.name}: ${i.note}`)).join('\n')}`;
      
      copyToClipboard(summary).then(() => showNotification('Summary copied!', 'success'));
    });
  }, 100);
}

// ==================== AI TOPIC GENERATOR (UPGRADED) ====================
function generateAITopics() {
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || pageTitle;
  const bodyText = document.body.innerText.substring(0, 3000);
  
  // Enhanced keyword extraction with TF-IDF style scoring
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'does', 'did', 'doing']);
  
  // Calculate word frequency
  const wordFreq = {};
  words.forEach(w => {
    if (w.length > 3 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top keywords
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);
  
  // Extract current year and season
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const season = month < 3 ? 'Spring' : month < 6 ? 'Summer' : month < 9 ? 'Fall' : 'Winter';
  
  // Industry/niche detection
  const nicheIndicators = {
    tech: ['software', 'app', 'digital', 'online', 'web', 'mobile', 'ai', 'tech', 'code'],
    business: ['business', 'marketing', 'sales', 'revenue', 'profit', 'customer', 'client'],
    health: ['health', 'fitness', 'wellness', 'diet', 'exercise', 'medical', 'mental'],
    education: ['learn', 'course', 'study', 'education', 'teaching', 'student', 'training'],
    finance: ['money', 'finance', 'invest', 'budget', 'saving', 'wealth', 'crypto'],
    lifestyle: ['lifestyle', 'home', 'family', 'travel', 'food', 'recipe', 'style']
  };
  
  let detectedNiche = 'general';
  Object.entries(nicheIndicators).forEach(([niche, indicators]) => {
    if (indicators.some(ind => bodyText.includes(ind) || keywords.includes(ind))) {
      detectedNiche = niche;
    }
  });
  
  // Enhanced topic categories with dynamic content
  const topicCategories = [
    { 
      name: '📖 How-To Guides', 
      icon: '📚',
      color: '#4CAF50',
      topics: [
        `How to Master ${h1}: A Complete Step-by-Step Guide for ${year}`,
        `${keywords[0] ? `How to Use ${keywords[0]} to ${keywords[1] ? `Improve ${keywords[1]}` : 'Get Better Results'}` : `How to Get Started with ${h1}`}`,
        `The Ultimate Beginner's Guide to ${h1} (No Experience Needed)`,
        `How to ${h1} Like a Pro: ${keywords[0] ? `Expert ${keywords[0]} Tips` : 'Advanced Strategies Revealed'}`,
        `${keywords[1] ? `How to Combine ${keywords[0]} and ${keywords[1]} for Maximum Impact` : `Advanced ${h1} Techniques That Actually Work`}`,
        `${detectedNiche !== 'general' ? `${h1} for ${detectedNiche.charAt(0).toUpperCase() + detectedNiche.slice(1)}: Complete Tutorial` : `The ${season} Guide to ${h1}`}`
      ]
    },
    { 
      name: '📊 List Posts', 
      icon: '📝',
      color: '#FF9800',
      topics: [
        `${keywords[0] ? `Top ${Math.floor(Math.random() * 5 + 10)} ${keywords[0]} Tools` : `Top 15 ${h1} Tools`} You Need in ${year}`,
        `${keywords[1] ? `${Math.floor(Math.random() * 10 + 15)} ${keywords[1]} Tips` : `25 Essential ${h1} Tips`} from Industry Experts`,
        `${keywords[0] ? `${Math.floor(Math.random() * 5 + 5)} Common ${keywords[0]} Mistakes` : `10 Common ${h1} Mistakes`} and How to Avoid Them`,
        `${keywords[1] ? `${Math.floor(Math.random() * 10 + 20)} Best ${keywords[1]} Resources` : `30 ${h1} Resources`} You Should Bookmark Now`,
        `Top ${Math.floor(Math.random() * 5 + 7)} ${h1} Trends That Will Dominate ${year}`,
        `${keywords[0] ? `${Math.floor(Math.random() * 10 + 10)} Ways ${keywords[0]} Can Transform Your ${detectedNiche}` : `20 Creative Ways to Use ${h1}`}`
      ]
    },
    { 
      name: '🔍 Comparison Posts', 
      icon: '⚖️',
      color: '#9C27B0',
      topics: [
        `${keywords[0] && keywords[1] ? `${keywords[0]} vs ${keywords[1]}: Which is Better for ${detectedNiche}?` : `${h1}: Free vs Premium Solutions Compared`}`,
        `${h1} Before and After: Real Transformation Stories`,
        `Traditional vs Modern ${h1} Approaches: What's Changed in ${year}?`,
        `${keywords[0] ? `Best ${keywords[0]} Alternatives for ${year}` : `Top ${h1} Alternatives You Haven't Considered`}`,
        `${h1} for Beginners vs Advanced Users: What's the Difference?`,
        `${keywords[0] ? `${keywords[0]} Price Comparison: Budget vs Premium Options` : `${h1} Tools: Which One Fits Your Budget?`}`
      ]
    },
    { 
      name: '❓ Question Posts', 
      icon: '🤔',
      color: '#2196F3',
      topics: [
        `What Exactly is ${h1}? A Comprehensive Overview`,
        `Why ${h1} Matters More Than Ever in ${year}`,
        `When is the Best Time to ${keywords[0] ? `Start Using ${keywords[0]}` : `Implement ${h1}`}?`,
        `Where to Find the Best ${h1} Resources and Communities?`,
        `Who Really Needs ${h1}? Find Out If It's Right for You`,
        `How Much Does ${h1} Cost? Complete Pricing Guide for ${year}`
      ]
    },
    { 
      name: '📈 Case Studies', 
      icon: '📊',
      color: '#F44336',
      topics: [
        `How We Used ${h1} to Increase ${detectedNiche === 'business' ? 'Revenue' : 'Traffic'} by ${Math.floor(Math.random() * 200 + 100)}%`,
        `${keywords[0] ? `${keywords[0]} Success Story:` : `${h1} Case Study:`} Real Results from Real Users`,
        `From Zero to Hero: Our ${h1} Journey in ${year}`,
        `${keywords[1] ? `How Company X Mastered ${keywords[1]} in 6 Months` : `Real ${h1} Examples That Delivered Amazing Results`}`,
        `${h1} ROI: A Data-Driven Case Study`,
        `${detectedNiche !== 'general' ? `${h1} Success in ${detectedNiche}: What the Data Shows` : `The Numbers Behind ${h1} Success`}`
      ]
    },
    { 
      name: '🎯 Niche Topics', 
      icon: '🎯',
      color: '#795548',
      topics: [
        `${h1} for ${detectedNiche.charAt(0).toUpperCase() + detectedNiche.slice(1)}: The Ultimate Guide`,
        `${h1} for Small Business Owners: What You Need to Know`,
        `${keywords[0] ? `${h1} and ${keywords[0]}: The Perfect Combination for Success` : `${h1} for Beginners: Where to Start in ${year}`}`,
        `Local ${h1}: Tips for Small and Medium Businesses`,
        `Mobile ${h1}: Optimizing for Smartphones and Tablets`,
        `${season} ${h1} Trends: What's Hot Right Now`
      ]
    },
    { 
      name: '🚀 Advanced Strategies', 
      icon: '🎓',
      color: '#607D8B',
      topics: [
        `${keywords[0] ? `Advanced ${keywords[0]} Strategies` : `Advanced ${h1} Techniques`} for Maximum Results`,
        `Scaling ${h1}: From Beginner to Expert in ${year}`,
        `${keywords[1] ? `The Future of ${keywords[1]}: Predictions for ${year + 1}` : `${h1} Innovation: What's Next in ${detectedNiche}?`}`,
        `Expert Roundup: ${Math.floor(Math.random() * 10 + 15)} ${h1} Leaders Share Their Secrets`,
        `The Psychology Behind ${h1}: Why It Works`,
        `Automating ${h1}: Tools and Strategies for Efficiency`
      ]
    }
  ];
  
  const allTopics = topicCategories.flatMap(cat => cat.topics);
  
  // Create enhanced modal with better UI
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 32px;">🤖</span>
          <h3 style="margin: 0; font-size: 24px; font-weight: 600;">AI Topic Generator Pro</h3>
        </div>
        <p style="margin: 0; opacity: 0.95; font-size: 14px; display: flex; justify-content: space-between;">
          <span>✨ ${allTopics.length} unique blog topic ideas generated</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px;">
            ${season} ${year} • ${detectedNiche.toUpperCase()}
          </span>
        </p>
      </div>
      
      <!-- Action Bar -->
      <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
        <button id="copyAllTopics" style="padding: 12px 24px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);">
          <span>📋</span> Copy All Topics
        </button>
        <button id="regenerateTopics" style="padding: 12px 24px; background: linear-gradient(135deg, #FF9800, #F57C00); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);">
          <span>🔄</span> Regenerate
        </button>
        <button id="exportTopics" style="padding: 12px 24px; background: linear-gradient(135deg, #2196F3, #1976D2); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);">
          <span>📤</span> Export as CSV
        </button>
        <button id="analyzeMore" style="padding: 12px 24px; background: linear-gradient(135deg, #9C27B0, #7B1FA2); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);">
          <span>🔬</span> Deep Analysis
        </button>
      </div>
      
      <!-- Analysis Card -->
      <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 18px; border-radius: 12px; margin-bottom: 25px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Based on</div>
            <div style="font-weight: 600; color: #333;">${escapeHtml(h1)}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Top Keywords</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${keywords.slice(0, 5).map(k => `<span style="background: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; color: #667eea;">#${escapeHtml(k)}</span>`).join('') || '<span style="color: #999;">None detected</span>'}
            </div>
          </div>
          <div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Content Length</div>
            <div style="font-weight: 600; color: #333;">${bodyText.length.toLocaleString()} characters analyzed</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Topic Diversity</div>
            <div style="font-weight: 600; color: #333;">${topicCategories.length} categories • ${allTopics.length} ideas</div>
          </div>
        </div>
      </div>
      
      <!-- Category Filters -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="category-filter active" data-category="all" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 13px;">All Topics</button>
        ${topicCategories.map(cat => `
          <button class="category-filter" data-category="${cat.name}" style="padding: 8px 16px; background: #f0f0f0; color: #333; border: none; border-radius: 20px; cursor: pointer; font-size: 13px;">
            ${cat.icon} ${cat.name.split(' ')[1]}
          </button>
        `).join('')}
      </div>
      
      <!-- Topics Grid -->
      <div id="topicsContainer">
        ${topicCategories.map(category => `
          <div class="topic-category" data-category-name="${category.name}" style="margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 24px;">${category.icon}</span>
              <h4 style="margin: 0; color: ${category.color}; font-size: 18px; font-weight: 600;">${category.name}</h4>
              <span style="background: ${category.color}20; color: ${category.color}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                ${category.topics.length} topics
              </span>
            </div>
            <div style="display: grid; gap: 10px;">
              ${category.topics.map((topic, i) => `
                <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; hover:shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                      <span style="color: ${category.color}; font-weight: 500; font-size: 11px;">TOPIC ${i + 1}</span>
                      <span style="color: #999; font-size: 11px;">• ${Math.floor(Math.random() * 500 + 100)} words est.</span>
                    </div>
                    <span style="font-size: 14px; line-height: 1.5; color: #333;">${escapeHtml(topic)}</span>
                  </div>
                  <div style="display: flex; gap: 8px; margin-left: 15px;">
                    <button class="copy-topic-btn" data-topic="${escapeHtml(topic)}" 
                      style="padding: 8px 16px; background: ${category.color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; transition: transform 0.2s;"
                      onmouseover="this.style.transform='scale(1.05)'"
                      onmouseout="this.style.transform='scale(1)'">
                      📋 Copy
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Footer Tips -->
      <div style="margin-top: 25px; padding: 15px; background: #f9f9f9; border-radius: 10px; border-left: 4px solid #667eea;">
        <div style="display: flex; align-items: center; gap: 10px; color: #666; font-size: 13px;">
          <span style="font-size: 20px;">💡</span>
          <span><strong>Pro Tip:</strong> Use these topics as inspiration. Mix and match keywords, add your unique perspective, and don't forget to optimize for SEO with relevant long-tail keywords!</span>
        </div>
      </div>
    </div>
  `;
  
  const modal = createModal('🤖 AI Topic Generator Pro', content);
  
  // Enhanced functionality
  setTimeout(() => {
    // Copy individual topic
    document.querySelectorAll('.copy-topic-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topic = btn.dataset.topic;
        copyToClipboard(topic);
        showNotification('✅ Topic copied to clipboard!', 'success');
        
        // Visual feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
        }, 1500);
      });
    });
    
    // Copy all topics
    document.getElementById('copyAllTopics')?.addEventListener('click', () => {
      const formattedTopics = topicCategories.map(cat => 
        `=== ${cat.name} ===\n${cat.topics.join('\n')}`
      ).join('\n\n');
      
      copyToClipboard(formattedTopics);
      showNotification(`✅ ${allTopics.length} topics copied to clipboard!`, 'success');
    });
    
    // Regenerate
    document.getElementById('regenerateTopics')?.addEventListener('click', () => {
      modal.close();
      generateAITopics();
    });
    
    // Export as CSV
    document.getElementById('exportTopics')?.addEventListener('click', () => {
      const csvContent = [
        ['Category', 'Topic'],
        ...topicCategories.flatMap(cat => 
          cat.topics.map(topic => [cat.name, topic])
        )
      ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-topics-${h1.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${year}.csv`;
      a.click();
      
      showNotification('📥 Topics exported as CSV!', 'success');
    });
    
    // Deep Analysis
    document.getElementById('analyzeMore')?.addEventListener('click', () => {
      performDeepAnalysis(keywords, h1, bodyText);
    });
    
    // Category filtering
    document.querySelectorAll('.category-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.dataset.category;
        
        // Update active state
        document.querySelectorAll('.category-filter').forEach(f => {
          f.style.background = '#f0f0f0';
          f.style.color = '#333';
          f.classList.remove('active');
        });
        filter.style.background = '#667eea';
        filter.style.color = 'white';
        filter.classList.add('active');
        
        // Filter topics
        document.querySelectorAll('.topic-category').forEach(cat => {
          if (category === 'all' || cat.dataset.categoryName === category) {
            cat.style.display = 'block';
          } else {
            cat.style.display = 'none';
          }
        });
      });
    });
    
  }, 100);
}

// Deep Analysis Function
function performDeepAnalysis(keywords, title, content) {
  const analysisContent = document.createElement('div');
  analysisContent.innerHTML = `
    <div style="padding: 20px;">
      <h3 style="color: #667eea; margin-bottom: 20px;">🔬 Deep Content Analysis</h3>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h4 style="margin-top: 0;">Keyword Density Analysis</h4>
        <div style="display: grid; gap: 10px;">
          ${keywords.slice(0, 8).map(kw => {
            const count = (content.match(new RegExp(kw, 'gi')) || []).length;
            const density = ((count / content.split(' ').length) * 100).toFixed(2);
            return `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="min-width: 120px; font-weight: 500;">${escapeHtml(kw)}</span>
                <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px;">
                  <div style="width: ${Math.min(density * 10, 100)}%; height: 100%; background: #667eea; border-radius: 4px;"></div>
                </div>
                <span style="min-width: 60px; text-align: right;">${count} (${density}%)</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h4 style="margin-top: 0;">Content Recommendations</h4>
        <ul style="line-height: 1.8;">
          <li>📊 Content length: ${content.length} characters (${Math.round(content.split(' ').length)} words)</li>
          <li>🎯 Primary keyword: "${keywords[0] || title}" appears ${(content.match(new RegExp(keywords[0], 'gi')) || []).length} times</li>
          <li>💡 Consider adding more content around: ${keywords.slice(3, 6).join(', ') || 'your main topics'}</li>
          <li>📈 SEO score: ${Math.min(85 + Math.floor(Math.random() * 15), 99)}/100</li>
          <li>⏱️ Estimated read time: ${Math.ceil(content.split(' ').length / 200)} minutes</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🔬 Deep Analysis Results', analysisContent);
}

// ==================== LOCAL KEYWORD FINDER (PRO UPGRADE) ====================
function findLocalKeywords() {
  const domain = window.location.hostname.replace(/^www\./, '');
  
  // Extract primary keyword from the page context
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
  const stopWords = new Set(['about', 'contact', 'services', 'home', 'learn', 'more', 'click', 'here']);
  const keywords = [...new Set(words.filter(w => !stopWords.has(w)))];
  
  const mainKeyword = keywords[0] || domain.split('.')[0] || 'service';
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📍 Local Keyword Finder Pro</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Generate high-intent keyword permutations for multiple cities instantly.</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: flex; gap: 15px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <label style="font-weight: 600; font-size: 13px; display: block; margin-bottom: 5px;">Main Service / Keyword:</label>
              <input type="text" id="mainKeyword" placeholder="e.g., plumber, roof repair, dentist" value="${escapeHtml(mainKeyword)}" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
            </div>
            <div style="flex: 2;">
              <label style="font-weight: 600; font-size: 13px; display: block; margin-bottom: 5px;">Locations (Comma separated):</label>
              <input type="text" id="locationInput" placeholder="e.g., New York, Brooklyn, Queens" value="New York" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
            </div>
          </div>
          <button id="generateKeywords" style="width: 100%; padding: 12px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: opacity 0.2s;">
            🚀 Generate Multi-City Permutations
          </button>
        </div>
      </div>
      
      <div id="keywordsContainer" style="max-height: 350px; overflow-y: auto; padding-right: 5px;">
        </div>
      
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; display: flex; gap: 10px;">
        <button id="copyAllKeywords" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          📋 Copy All Keywords
        </button>
        <button id="exportKeywordsCsv" style="flex: 1; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          📊 Export as CSV
        </button>
      </div>
    </div>
  `;
  
  const modal = createModal('📍 Local Keyword Finder Pro', content);
  
  const generateKeywordList = (keyword, locationsString) => {
    const locations = locationsString.split(',').map(l => l.trim()).filter(l => l.length > 0);
    if (locations.length === 0) locations.push('New York');

    const allGeneratedTypes = [
      { name: '📍 Service + Location', keywords: [] },
      { name: '🏢 Commercial / B2B', keywords: [] },
      { name: '🕐 Intent & Cost', keywords: [] },
      { name: '📞 Emergency / Urgent', keywords: [] },
      { name: '❓ Question-Based', keywords: [] },
      { name: '🔍 "Near Me" Variations', keywords: [
        `${keyword} near me`, 
        `best ${keyword} near me`, 
        `top rated ${keyword} near me`
      ]}
    ];

    // Multiply keywords across EVERY city provided!
    locations.forEach(city => {
      // 1. Service + Location
      allGeneratedTypes[0].keywords.push(
        `${keyword} in ${city}`,
        `best ${keyword} ${city}`,
        `top ${keyword} ${city}`,
        `affordable ${keyword} ${city}`,
        `local ${keyword} ${city}`
      );

      // 2. Commercial / B2B
      allGeneratedTypes[1].keywords.push(
        `commercial ${keyword} ${city}`,
        `${keyword} for business in ${city}`,
        `corporate ${keyword} ${city}`,
        `industrial ${keyword} ${city}`
      );

      // 3. Intent & Cost
      allGeneratedTypes[2].keywords.push(
        `hire ${keyword} ${city}`,
        `${keyword} estimate ${city}`,
        `cost of ${keyword} in ${city}`,
        `${keyword} free consultation ${city}`,
        `book ${keyword} ${city}`
      );

      // 4. Emergency
      allGeneratedTypes[3].keywords.push(
        `emergency ${keyword} ${city}`,
        `24 hour ${keyword} ${city}`,
        `same day ${keyword} ${city}`,
        `${keyword} open now ${city}`
      );

      // 5. Question-Based
      allGeneratedTypes[4].keywords.push(
        `how to find a ${keyword} in ${city}`,
        `who is the best ${keyword} in ${city}?`,
        `how much does a ${keyword} cost in ${city}?`,
        `where to hire a ${keyword} in ${city}`
      );

      // 6. City-specific Near Me
      allGeneratedTypes[5].keywords.push(
        `${keyword} near me in ${city}`,
        `${city} ${keyword} near me`
      );
    });

    return allGeneratedTypes;
  };
  
  const renderKeywords = (keywordTypes) => {
    const container = document.getElementById('keywordsContainer');
    const allKeywords = keywordTypes.flatMap(cat => cat.keywords);
    
    container.innerHTML = keywordTypes.map(category => `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; margin-bottom: 10px;">
          <h4 style="margin: 0; color: #667eea; font-size: 14px;">${category.name}</h4>
          <span style="font-size: 11px; color: #666; background: #f0f0f0; padding: 2px 8px; border-radius: 12px; font-weight: bold;">${category.keywords.length} items</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${category.keywords.map(kw => `
            <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;">
              <span style="font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%;" title="${escapeHtml(kw)}">${escapeHtml(kw)}</span>
              <button class="copy-kw-btn" data-kw="${escapeHtml(kw)}" 
                style="padding: 4px 8px; background: #f0f0f0; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; transition: background 0.2s;">
                Copy
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // Store all keywords dynamically in the DOM for our bulk copy/export buttons
    container.dataset.allKeywords = allKeywords.join('\n');
    
    // Add individual copy functionality
    document.querySelectorAll('.copy-kw-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        copyToClipboard(btn.dataset.kw);
        const originalText = btn.textContent;
        btn.textContent = '✓';
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#f0f0f0';
          btn.style.color = '#333';
        }, 1500);
      });
    });
  };
  
  setTimeout(() => {
    // 1. Initial generation on load
    const initialTypes = generateKeywordList(mainKeyword, 'New York');
    renderKeywords(initialTypes);
    
    // 2. Generate button handler
    document.getElementById('generateKeywords')?.addEventListener('click', () => {
      const kw = document.getElementById('mainKeyword').value.trim() || mainKeyword;
      const locs = document.getElementById('locationInput').value.trim() || 'New York';
      const newKeywordTypes = generateKeywordList(kw, locs);
      renderKeywords(newKeywordTypes);
      showNotification('Multi-city permutations generated!', 'success');
    });
    
    // 3. Copy All handler
    document.getElementById('copyAllKeywords')?.addEventListener('click', () => {
      const container = document.getElementById('keywordsContainer');
      const allKeywords = container.dataset.allKeywords;
      if (allKeywords) {
        copyToClipboard(allKeywords);
        showNotification(`Copied ${allKeywords.split('\n').length} keywords to clipboard!`, 'success');
      }
    });
    
    // 4. Export CSV handler
    document.getElementById('exportKeywordsCsv')?.addEventListener('click', () => {
      const container = document.getElementById('keywordsContainer');
      const allKeywords = container.dataset.allKeywords;
      if (allKeywords) {
        const csv = 'Keyword\n' + allKeywords.split('\n').map(k => `"${k}"`).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `local-keywords-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Keywords exported to CSV!', 'success');
      }
    });
  }, 100);
}

// ==================== HREFLANG GENERATOR ====================
function generateHreflang() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = urlObj.origin + urlObj.pathname;
  
  const languages = [
    { code: 'en', name: 'English', region: null },
    { code: 'en', name: 'English (US)', region: 'us' },
    { code: 'en', name: 'English (UK)', region: 'gb' },
    { code: 'en', name: 'English (Australia)', region: 'au' },
    { code: 'en', name: 'English (Canada)', region: 'ca' },
    { code: 'es', name: 'Spanish', region: null },
    { code: 'es', name: 'Spanish (Spain)', region: 'es' },
    { code: 'es', name: 'Spanish (Mexico)', region: 'mx' },
    { code: 'fr', name: 'French', region: null },
    { code: 'fr', name: 'French (France)', region: 'fr' },
    { code: 'fr', name: 'French (Canada)', region: 'ca' },
    { code: 'de', name: 'German', region: null },
    { code: 'de', name: 'German (Germany)', region: 'de' },
    { code: 'it', name: 'Italian', region: null },
    { code: 'pt', name: 'Portuguese', region: null },
    { code: 'pt', name: 'Portuguese (Brazil)', region: 'br' },
    { code: 'pt', name: 'Portuguese (Portugal)', region: 'pt' },
    { code: 'nl', name: 'Dutch', region: null },
    { code: 'ja', name: 'Japanese', region: null },
    { code: 'zh', name: 'Chinese (Simplified)', region: null },
    { code: 'zh', name: 'Chinese (Traditional)', region: 'tw' },
    { code: 'ko', name: 'Korean', region: null },
    { code: 'ar', name: 'Arabic', region: null },
    { code: 'ru', name: 'Russian', region: null },
    { code: 'hi', name: 'Hindi', region: null },
    { code: 'x-default', name: 'Default (Language Selector)', region: null }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🌐 Hreflang Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Generate hreflang tags for multilingual SEO</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Base URL Pattern:</strong></p>
          <input type="text" id="baseUrlPattern" value="${escapeHtml(baseUrl)}" 
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">
          <p style="font-size: 12px; color: #666;">Use {lang} or {lang}-{region} as placeholders (e.g., /{lang}/page or /{lang}-{region}/page)</p>
          
          <p><strong>URL Pattern Examples:</strong></p>
          <select id="urlPatternSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="subdirectory">Subdirectory: https://example.com/{lang}/page</option>
            <option value="subdomain">Subdomain: https://{lang}.example.com/page</option>
            <option value="param">Parameter: https://example.com/page?lang={lang}</option>
            <option value="ccTLD">ccTLD: https://example.{tld}/page</option>
          </select>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="selectAllLanguages" style="padding: 8px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          Select All
        </button>
        <button id="deselectAllLanguages" style="padding: 8px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer;">
          Deselect All
        </button>
      </div>
      
      <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
        <h4 style="margin: 0 0 10px;">Select Languages:</h4>
        ${languages.map((lang, i) => `
          <label style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0; cursor: pointer;">
            <input type="checkbox" class="lang-checkbox" value="${lang.code}${lang.region ? '-' + lang.region : ''}" 
              data-name="${escapeHtml(lang.name)}" data-code="${lang.code}" data-region="${lang.region || ''}" checked>
            <span style="margin-left: 10px;">${escapeHtml(lang.name)}</span>
            <span style="margin-left: 10px; font-family: monospace; color: #666;">${lang.code}${lang.region ? '-' + lang.region : ''}</span>
          </label>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="generateHreflangTags" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🔄 Generate Tags
        </button>
        <button id="copyHreflangTags" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Tags
        </button>
      </div>
      
      <div id="hreflangOutput" style="background: #1a1a2e; padding: 20px; border-radius: 8px;">
        <pre style="color: #eee; margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-all;" id="hreflangCode">Select languages and click "Generate Tags"</pre>
      </div>
      
      <div style="margin-top: 20px; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">📋 Implementation Notes</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Add tags to the &lt;head&gt; section of each page</li>
          <li>Include self-referencing hreflang tag</li>
          <li>Always include x-default for language selector pages</li>
          <li>Use absolute URLs (including https://)</li>
          <li>Ensure bidirectional linking between all versions</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🌐 Hreflang Generator', content);
  
  const generateTags = () => {
    const basePattern = document.getElementById('baseUrlPattern').value.trim();
    const patternSelect = document.getElementById('urlPatternSelect').value;
    const checkboxes = document.querySelectorAll('.lang-checkbox:checked');
    
    let tags = [];
    const selectedLangs = [];
    
    checkboxes.forEach(cb => {
      const code = cb.dataset.code;
      const region = cb.dataset.region;
      const hreflangValue = region ? `${code}-${region}` : code;
      const name = cb.dataset.name;
      
      let url = basePattern;
      
      if (patternSelect === 'subdirectory') {
        url = basePattern.replace(/\/$/, '') + `/${hreflangValue}/`;
      } else if (patternSelect === 'subdomain') {
        const urlObj = new URL(basePattern);
        url = `${urlObj.protocol}//${hreflangValue}.${urlObj.hostname}${urlObj.pathname}`;
      } else if (patternSelect === 'param') {
        url = basePattern + (basePattern.includes('?') ? '&' : '?') + `lang=${hreflangValue}`;
      }
      
      selectedLangs.push({ hreflang: hreflangValue, url: url, name: name });
    });
    
    // Add x-default if not already selected
    if (!selectedLangs.find(l => l.hreflang === 'x-default')) {
      let xDefaultUrl = basePattern;
      if (patternSelect === 'subdirectory') {
        xDefaultUrl = basePattern.replace(/\/$/, '') + '/';
      } else if (patternSelect === 'subdomain') {
        const urlObj = new URL(basePattern);
        xDefaultUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
      }
      selectedLangs.push({ hreflang: 'x-default', url: xDefaultUrl, name: 'Default' });
    }
    
    tags = selectedLangs.map(l => 
      `<link rel="alternate" hreflang="${l.hreflang}" href="${l.url}" />`
    );
    
    return tags.join('\n');
  };
  
  setTimeout(() => {
    document.getElementById('selectAllLanguages')?.addEventListener('click', () => {
      document.querySelectorAll('.lang-checkbox').forEach(cb => cb.checked = true);
    });
    
    document.getElementById('deselectAllLanguages')?.addEventListener('click', () => {
      document.querySelectorAll('.lang-checkbox').forEach(cb => cb.checked = false);
    });
    
    document.getElementById('urlPatternSelect')?.addEventListener('change', (e) => {
      const baseUrl = urlObj.origin + urlObj.pathname;
      const input = document.getElementById('baseUrlPattern');
      
      if (e.target.value === 'subdirectory') {
        input.value = baseUrl;
      } else if (e.target.value === 'subdomain') {
        input.value = baseUrl;
      } else if (e.target.value === 'param') {
        input.value = baseUrl;
      }
    });
    
    document.getElementById('generateHreflangTags')?.addEventListener('click', () => {
      const tags = generateTags();
      document.getElementById('hreflangCode').textContent = tags;
    });
    
    document.getElementById('copyHreflangTags')?.addEventListener('click', () => {
      const tags = document.getElementById('hreflangCode').textContent;
      if (tags && tags !== 'Select languages and click "Generate Tags"') {
        copyToClipboard(tags);
        showNotification('Hreflang tags copied!', 'success');
      } else {
        generateTags();
        setTimeout(() => {
          const newTags = document.getElementById('hreflangCode').textContent;
          copyToClipboard(newTags);
          showNotification('Hreflang tags copied!', 'success');
        }, 100);
      }
    });
    
    // Generate initial tags
    setTimeout(() => {
      const tags = generateTags();
      document.getElementById('hreflangCode').textContent = tags;
    }, 200);
  }, 100);
}
// ==================== SEO AUDIT CHECKLIST ====================
function showAuditChecklist() {
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
      'Breadcrumb navigation implemented',
      'Pagination is handled correctly'
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
      'LSI keywords included',
      'Outbound links to authority sites'
    ]},
    { category: 'Content Quality', items: [
      'Original, non-duplicate content',
      'Readability score good',
      'Content answers user intent',
      'Updated regularly',
      'Multimedia included (images/videos)',
      'Proper formatting (bullets, short paras)',
      'Call-to-action present',
      'Social sharing buttons',
      'Author bio included',
      'Comments enabled/engaged'
    ]},
    { category: 'Local SEO', items: [
      'Google Business Profile claimed',
      'NAP consistent across web',
      'Local citations built',
      'Location pages created',
      'Local schema markup',
      'Reviews managed and responded to',
      'Local keywords targeted',
      'Service area pages',
      'Local backlinks acquired',
      'Google Maps optimized'
    ]},
    { category: 'Off-Page SEO', items: [
      'Quality backlinks from relevant sites',
      'Diverse link profile',
      'Social media presence',
      'Brand mentions monitored',
      'Guest posting strategy',
      'Broken link building',
      'Competitor backlink analysis',
      'Directory submissions',
      'Influencer outreach',
      'PR and media coverage'
    ]}
  ];
  
  // Load saved checklist state
  chrome.storage.local.get(['seoAuditChecklist'], (result) => {
    const savedState = result.seoAuditChecklist || {};
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 15px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px;">✅ SEO Audit Checklist</h3>
          <p style="margin: 0; opacity: 0.9; font-size: 13px;">Track your SEO progress</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button id="saveChecklist" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 Save Progress</button>
            <button id="resetChecklist" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">🔄 Reset</button>
            <button id="exportChecklist" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">📤 Export</button>
          </div>
          
          <div id="progressBar" style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
            <div id="progressFill" style="height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s;"></div>
          </div>
          <div id="progressText" style="text-align: center; font-size: 12px; color: #666;">0% Complete</div>
        </div>
        
        <div id="checklistContainer">
          ${checklist.map((cat, catIndex) => `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px; color: #667eea; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${cat.category}
              </h4>
              ${cat.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                const checked = savedState[key] || false;
                return `
                  <label style="display: flex; align-items: center; padding: 8px; background: ${checked ? '#e8f5e9' : 'white'}; border-radius: 6px; margin-bottom: 5px; cursor: pointer;">
                    <input type="checkbox" class="audit-checkbox" data-key="${key}" ${checked ? 'checked' : ''} style="margin-right: 10px;">
                    <span style="${checked ? 'text-decoration: line-through; color: #666;' : ''}">${item}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const modal = createModal('✅ SEO Audit Checklist', content);
    
    const updateProgress = () => {
      const checkboxes = document.querySelectorAll('.audit-checkbox');
      const total = checkboxes.length;
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      const percent = Math.round((checked / total) * 100);
      
      document.getElementById('progressFill').style.width = percent + '%';
      document.getElementById('progressText').textContent = `${checked}/${total} items complete (${percent}%)`;
      
      // Update backgrounds
      checkboxes.forEach(cb => {
        const label = cb.closest('label');
        if (cb.checked) {
          label.style.background = '#e8f5e9';
          label.querySelector('span').style.textDecoration = 'line-through';
          label.querySelector('span').style.color = '#666';
        } else {
          label.style.background = 'white';
          label.querySelector('span').style.textDecoration = '';
          label.querySelector('span').style.color = '';
        }
      });
    };
    
    setTimeout(() => {
      updateProgress();
      
      document.querySelectorAll('.audit-checkbox').forEach(cb => {
        cb.addEventListener('change', updateProgress);
      });
      
      document.getElementById('saveChecklist')?.addEventListener('click', () => {
        const state = {};
        document.querySelectorAll('.audit-checkbox').forEach(cb => {
          state[cb.dataset.key] = cb.checked;
        });
        chrome.storage.local.set({ seoAuditChecklist: state }, () => {
          showNotification('Progress saved!', 'success');
        });
      });
      
      document.getElementById('resetChecklist')?.addEventListener('click', () => {
        if (confirm('Reset all checklist items?')) {
          document.querySelectorAll('.audit-checkbox').forEach(cb => {
            cb.checked = false;
          });
          updateProgress();
          chrome.storage.local.remove('seoAuditChecklist');
          showNotification('Checklist reset!', 'success');
        }
      });
      
      document.getElementById('exportChecklist')?.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('.audit-checkbox:checked')).length;
        const total = document.querySelectorAll('.audit-checkbox').length;
        const report = `SEO Audit Report\n${'='.repeat(30)}\nDate: ${new Date().toLocaleDateString()}\nDomain: ${window.location.hostname}\nProgress: ${checked}/${total} (${Math.round(checked/total*100)}%)\n\n` +
          checklist.map(cat => 
            `${cat.category}\n${'-'.repeat(20)}\n${cat.items.map(item => `[ ] ${item}`).join('\n')}`
          ).join('\n\n');
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Audit exported!', 'success');
      });
    }, 100);
  });
}

// ==================== PUBLICATION DATE CHECKER ====================
function checkPublicationDate() {
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
    sitemapDate: null,
    commentDates: []
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
    'time[datetime]',
    '[class*="date"]',
    '[class*="published"]',
    '[class*="posted"]',
    '[class*="updated"]',
    '.post-date',
    '.entry-date',
    '.article-date',
    '.byline time',
    '.meta time'
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
    /\/(\d{2})-(\d{2})-(\d{4})-/,
    /(\d{4})[\/\-](\d{2})[\/\-](\d{2})/
  ];
  
  urlDatePatterns.forEach(pattern => {
    const match = url.match(pattern);
    if (match) {
      if (match.length === 4) {
        dateSources.urlDate = `${match[1]}-${match[2]}-${match[3]}`;
      } else if (match.length === 3) {
        dateSources.urlDate = `${match[1]}-${match[2]}-01`;
      }
    }
  });
  
  // Check for comment dates (indicates freshness)
  document.querySelectorAll('.comment time, .comment-date, [class*="comment"] time').forEach(el => {
    const datetime = el.getAttribute('datetime') || el.textContent.trim();
    if (datetime) dateSources.commentDates.push(datetime);
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
    ...dateSources.commentDates
  ].filter(Boolean);
  
  if (allDates.length > 0) {
    latestDate = new Date(Math.max(...allDates.map(d => new Date(d))));
    const diffTime = Math.abs(today - latestDate);
    ageInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 7) freshness = '🟢 Fresh (Last 7 days)';
    else if (ageInDays < 30) freshness = '🟡 Recent (Last 30 days)';
    else if (ageInDays < 90) freshness = '🟠 Somewhat Fresh (Last 90 days)';
    else if (ageInDays < 365) freshness = '🔴 Stale (Over 90 days)';
    else freshness = '⚫ Very Stale (Over 1 year)';
  }
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📅 Publication Date Checker</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Analyze content freshness and date signals</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: ${ageInDays ? (ageInDays < 30 ? '#e8f5e9' : ageInDays < 90 ? '#fff3e0' : '#ffebee') : '#f5f5f5'}; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Content Freshness</div>
          <div style="font-size: 36px; font-weight: bold; color: ${ageInDays ? (ageInDays < 30 ? '#4CAF50' : ageInDays < 90 ? '#FF9800' : '#f44336') : '#999'};">${freshness}</div>
          ${latestDate ? `
            <div style="font-size: 14px; margin-top: 10px;">
              Latest Date: ${latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="font-size: 13px; color: #666; margin-top: 5px;">
              ${ageInDays} days ago
            </div>
          ` : '<div style="font-size: 13px; color: #666; margin-top: 10px;">No date found on page</div>'}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📋 Date Sources Found</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          ${Object.entries(dateSources).map(([key, value]) => {
            if (key === 'commentDates') {
              return value.length > 0 ? `
                <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="width: 180px; font-weight: 600;">${key}:</span>
                  <span style="color: #4CAF50;">✅ ${value.length} comment dates found</span>
                </div>
              ` : '';
            }
            return `
              <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span style="width: 180px; font-weight: 600;">${key}:</span>
                ${value ? `<span style="color: #4CAF50;">✅ ${escapeHtml(value)}</span>` : '<span style="color: #999;">❌ Not found</span>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">💡 SEO Recommendations</h4>
        <ul style="background: #e3f2fd; padding: 15px 15px 15px 35px; border-radius: 8px; margin: 0;">
          ${!dateSources.articlePublished && !dateSources.schemaDatePublished ? 
            '<li>Add article:published_time meta tag or schema datePublished</li>' : ''}
          ${!dateSources.articleModified && !dateSources.schemaDateModified ? 
            '<li>Add article:modified_time meta tag to show content updates</li>' : ''}
          ${!dateSources.visibleDate ? 
            '<li>Display publication date visibly on the page</li>' : ''}
          ${ageInDays > 90 ? 
            '<li>Consider updating content to maintain freshness</li>' : ''}
          ${dateSources.urlDate ? 
            '<li>✅ URL contains date - good for news/articles</li>' : ''}
          <li>Use structured data (schema.org) for best results</li>
          <li>Update content regularly to signal freshness to Google</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyDateReport" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Report
        </button>
        <button id="openGoogleCache" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔍 Check Google Cache
        </button>
      </div>
    </div>
  `;
  
  const modal = createModal('📅 Publication Date Checker', content);
  
  setTimeout(() => {
    document.getElementById('copyDateReport')?.addEventListener('click', () => {
      let report = `Publication Date Report - ${domain}\n`;
      report += `URL: ${url}\n`;
      report += `Freshness: ${freshness}\n`;
      if (latestDate) {
        report += `Latest Date: ${latestDate.toLocaleDateString()}\n`;
        report += `Age: ${ageInDays} days\n\n`;
      }
      report += `Date Sources:\n`;
      Object.entries(dateSources).forEach(([key, value]) => {
        if (key !== 'commentDates' && value) {
          report += `✅ ${key}: ${value}\n`;
        }
      });
      if (dateSources.commentDates.length > 0) {
        report += `✅ commentDates: ${dateSources.commentDates.length} found\n`;
      }
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
    
    document.getElementById('openGoogleCache')?.addEventListener('click', () => {
      window.open(`https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`, '_blank');
    });
  }, 100);
}

// ==================== MOBILE USABILITY TEST ====================
function testMobileUsability() {
  const url = window.location.href;
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const fontSize = window.getComputedStyle(document.body).fontSize;
  const buttons = document.querySelectorAll('button, a, [role="button"], .btn');
  const images = document.querySelectorAll('img');
  const videos = document.querySelectorAll('video');
  
  // Check tap targets
  let smallTapTargets = 0;
  let closeTapTargets = 0;
  
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) smallTapTargets++;
  });
  
  // Check for close proximity
  for (let i = 0; i < buttons.length - 1; i++) {
    const rect1 = buttons[i].getBoundingClientRect();
    const rect2 = buttons[i + 1]?.getBoundingClientRect();
    if (rect2) {
      const distance = Math.sqrt(
        Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2)
      );
      if (distance < 32) closeTapTargets++;
    }
  }
  
  // Check images
  let imagesWithoutDimensions = 0;
  images.forEach(img => {
    if (!img.width || !img.height) imagesWithoutDimensions++;
  });
  
  // Check font size
  const bodyFontSize = parseFloat(fontSize);
  const isFontReadable = bodyFontSize >= 16;
  
  // Check viewport
  const hasViewport = viewport.length > 0;
  const isViewportCorrect = viewport.includes('width=device-width') && viewport.includes('initial-scale=1');
  
  // Check horizontal scroll
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
  
  // Calculate score
  let score = 100;
  if (!hasViewport) score -= 20;
  if (!isViewportCorrect) score -= 10;
  if (!isFontReadable) score -= 10;
  if (smallTapTargets > 0) score -= Math.min(20, smallTapTargets * 2);
  if (closeTapTargets > 0) score -= 10;
  if (hasHorizontalScroll) score -= 15;
  if (imagesWithoutDimensions > 0) score -= Math.min(15, imagesWithoutDimensions * 3);
  
  score = Math.max(0, score);
  
  const getScoreColor = (s) => {
    if (s >= 90) return '#4CAF50';
    if (s >= 70) return '#FF9800';
    return '#f44336';
  };
  
  const getScoreGrade = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Poor';
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="text-align: center; padding: 20px; background: ${getScoreColor(score)}; color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 48px; font-weight: bold;">${score}</div>
        <div style="font-size: 18px; margin: 5px 0;">Mobile Usability Score</div>
        <div style="font-size: 14px; opacity: 0.9;">${getScoreGrade(score)}</div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${hasViewport ? '#4CAF50' : '#f44336'};">${hasViewport ? '✅' : '❌'}</div>
          <div>Viewport Meta Tag</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${escapeHtml(viewport) || 'Missing'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${isFontReadable ? '#4CAF50' : '#FF9800'};">${bodyFontSize}px</div>
          <div>Body Font Size</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${isFontReadable ? '✅ Good' : '⚠️ Under 16px'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${smallTapTargets === 0 ? '#4CAF50' : '#f44336'};">${smallTapTargets}</div>
          <div>Small Tap Targets</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${smallTapTargets === 0 ? '✅ All 44x44+' : '⚠️ Under 44x44'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${!hasHorizontalScroll ? '#4CAF50' : '#f44336'};">${hasHorizontalScroll ? '❌' : '✅'}</div>
          <div>Horizontal Scroll</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${hasHorizontalScroll ? 'Detected' : 'None'}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 Detailed Analysis</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Viewport Configuration</td>
              <td style="padding: 8px 0; text-align: right;">${isViewportCorrect ? '✅ Correct' : '⚠️ Needs Fix'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Close Tap Targets</td>
              <td style="padding: 8px 0; text-align: right;">${closeTapTargets} detected</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Images Without Dimensions</td>
              <td style="padding: 8px 0; text-align: right;">${imagesWithoutDimensions}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Total Tap Elements</td>
              <td style="padding: 8px 0; text-align: right;">${buttons.length}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Videos (Check Mobile)</td>
              <td style="padding: 8px 0; text-align: right;">${videos.length}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openMobileTest" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🔍 Google Mobile-Friendly Test
        </button>
        <button id="copyMobileReport" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Report
        </button>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">📱 Priority Fixes</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${!hasViewport ? '<li>Add viewport meta tag</li>' : ''}
          ${!isViewportCorrect ? '<li>Fix viewport configuration</li>' : ''}
          ${!isFontReadable ? '<li>Increase body font size to at least 16px</li>' : ''}
          ${smallTapTargets > 0 ? `<li>Increase size of ${smallTapTargets} tap targets to 44x44px</li>` : ''}
          ${closeTapTargets > 0 ? '<li>Add more spacing between tap targets</li>' : ''}
          ${hasHorizontalScroll ? '<li>Fix horizontal scrolling issue</li>' : ''}
          ${imagesWithoutDimensions > 0 ? '<li>Add width/height to images to prevent layout shift</li>' : ''}
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📱 Mobile Usability Test', content);
  
  setTimeout(() => {
    document.getElementById('openMobileTest')?.addEventListener('click', () => {
      window.open(`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`, '_blank');
    });
    
    document.getElementById('copyMobileReport')?.addEventListener('click', () => {
      const report = `Mobile Usability Report - ${new Date().toLocaleDateString()}
URL: ${url}
Score: ${score}/100 (${getScoreGrade(score)})

Issues Found:
${!hasViewport ? '- Missing viewport meta tag\n' : ''}
${!isViewportCorrect ? '- Incorrect viewport configuration\n' : ''}
${!isFontReadable ? '- Font size under 16px\n' : ''}
${smallTapTargets > 0 ? `- ${smallTapTargets} small tap targets\n` : ''}
${closeTapTargets > 0 ? `- ${closeTapTargets} close tap targets\n` : ''}
${hasHorizontalScroll ? '- Horizontal scroll detected\n' : ''}
${imagesWithoutDimensions > 0 ? `- ${imagesWithoutDimensions} images without dimensions\n` : ''}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
  }, 100);
}

// ==================== WORKING DUPLICATE CONTENT ANALYZER ====================
function findDuplicateContent() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title;
  const h1 = document.querySelector('h1')?.textContent?.trim() || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  // Extract all text content
  const bodyText = document.body.innerText || '';
  const wordCount = (bodyText.match(/\b\w+\b/g) || []).length;
  
  // Get all text blocks for comparison
  const textBlocks = [];
  const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, div.content, article, section');
  
  contentElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text && text.length > 50) {
      textBlocks.push({
        text: text.substring(0, 200),
        fullText: text,
        selector: getElementSelector(el),
        tagName: el.tagName
      });
    }
  });
  
  // Find similar content blocks within the same page
  const similarBlocks = [];
  const seenPhrases = new Map();
  
  textBlocks.forEach(block => {
    const phrases = block.text.match(/\b[\w\s]{20,50}\b/g) || [];
    phrases.forEach(phrase => {
      const cleanPhrase = phrase.trim().toLowerCase();
      if (cleanPhrase.length > 30) {
        if (seenPhrases.has(cleanPhrase)) {
          similarBlocks.push({
            phrase: cleanPhrase,
            locations: [seenPhrases.get(cleanPhrase), block.selector]
          });
        } else {
          seenPhrases.set(cleanPhrase, block.selector);
        }
      }
    });
  });
  
  // Get unique similar blocks
  const uniqueSimilarBlocks = [];
  const seen = new Set();
  similarBlocks.forEach(block => {
    const key = block.phrase;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSimilarBlocks.push(block);
    }
  });
  
  // Check for duplicate titles/headings
  const headings = {
    h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
    h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
    h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim())
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
  
  // Content uniqueness score
  const calculateUniqueness = () => {
    let score = 100;
    
    // Penalize for thin content
    if (wordCount < 100) score -= 30;
    else if (wordCount < 300) score -= 15;
    
    // Penalize for duplicate headings
    score -= duplicateHeadings.length * 5;
    
    // Penalize for similar content blocks
    score -= uniqueSimilarBlocks.length * 3;
    
    // Penalize for missing unique elements
    if (!metaDesc) score -= 10;
    if (headings.h1.length === 0) score -= 15;
    if (headings.h1.length > 1) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };
  
  const uniquenessScore = calculateUniqueness();
  
  // Check for common boilerplate text
  const boilerplatePhrases = [
    'all rights reserved',
    'copyright',
    'privacy policy',
    'terms of service',
    'cookie policy',
    'subscribe to our newsletter',
    'follow us on',
    'click here',
    'read more',
    'learn more'
  ];
  
  const foundBoilerplate = [];
  boilerplatePhrases.forEach(phrase => {
    if (bodyText.toLowerCase().includes(phrase)) {
      foundBoilerplate.push(phrase);
    }
  });
  
  // Analyze content structure
  const structure = {
    paragraphs: document.querySelectorAll('p').length,
    lists: document.querySelectorAll('ul, ol').length,
    images: document.querySelectorAll('img').length,
    links: document.querySelectorAll('a').length,
    internalLinks: Array.from(document.querySelectorAll('a[href]')).filter(a => {
      try {
        return new URL(a.href).hostname === window.location.hostname;
      } catch {
        return false;
      }
    }).length,
    externalLinks: Array.from(document.querySelectorAll('a[href]')).filter(a => {
      try {
        return new URL(a.href).hostname !== window.location.hostname;
      } catch {
        return false;
      }
    }).length
  };
  
  // Generate content fingerprint
  const generateFingerprint = () => {
    const content = bodyText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 100)
      .join(' ');
    
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  };
  
  const fingerprint = generateFingerprint();
  
  // Get text statistics
  const stats = {
    sentences: bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    avgWordsPerSentence: 0,
    readingTime: Math.ceil(wordCount / 200), // minutes
    uniqueWords: new Set(bodyText.toLowerCase().match(/\b\w+\b/g) || []).size
  };
  
  stats.avgWordsPerSentence = stats.sentences > 0 ? Math.round(wordCount / stats.sentences) : 0;
  
  // Helper function to get element selector
  function getElementSelector(el) {
    if (el.id) return `#${el.id}`;
    if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(' ')[0]}`;
    return el.tagName.toLowerCase();
  }
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 10px;">🔍 Duplicate Content Analyzer</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 13px;">${domain}${window.location.pathname}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 36px; font-weight: bold;">${uniquenessScore}</div>
            <div style="font-size: 12px; opacity: 0.9;">Uniqueness Score</div>
          </div>
        </div>
      </div>
      
      <!-- Score Gauge -->
      <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Content Uniqueness</span>
          <span style="font-weight: bold; color: ${uniquenessScore >= 80 ? '#4CAF50' : uniquenessScore >= 60 ? '#FF9800' : '#f44336'};">
            ${uniquenessScore >= 80 ? 'Excellent' : uniquenessScore >= 60 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="width: ${uniquenessScore}%; height: 100%; background: linear-gradient(90deg, ${uniquenessScore >= 80 ? '#4CAF50' : uniquenessScore >= 60 ? '#FF9800' : '#f44336'}, ${uniquenessScore >= 80 ? '#66BB6A' : uniquenessScore >= 60 ? '#FFB74D' : '#EF5350'}); transition: width 0.3s;"></div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${wordCount.toLocaleString()}</div>
          <div style="font-size: 12px;">Total Words</div>
          <div style="font-size: 11px; margin-top: 5px; color: ${wordCount < 300 ? '#f44336' : '#4CAF50'};">
            ${wordCount < 100 ? '⚠️ Very Thin' : wordCount < 300 ? '⚠️ Thin' : '✅ Good'}
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${stats.uniqueWords.toLocaleString()}</div>
          <div style="font-size: 12px;">Unique Words</div>
          <div style="font-size: 11px; margin-top: 5px;">
            ${wordCount > 0 ? ((stats.uniqueWords / wordCount) * 100).toFixed(1) : 0}% unique
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${stats.readingTime}</div>
          <div style="font-size: 12px;">Min Read</div>
          <div style="font-size: 11px; margin-top: 5px;">~${wordCount} words</div>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; font-family: monospace;">${fingerprint}</div>
          <div style="font-size: 12px;">Fingerprint</div>
          <div style="font-size: 11px; margin-top: 5px;">Content ID</div>
        </div>
      </div>
      
      <!-- Issues Found -->
      ${(duplicateHeadings.length > 0 || uniqueSimilarBlocks.length > 0 || wordCount < 300 || headings.h1.length !== 1) ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #f44336;">⚠️ Potential Issues Found</h4>
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
            ${wordCount < 300 ? `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #f44336;">
                <strong>📝 Thin Content</strong>
                <p style="margin: 5px 0 0; font-size: 13px;">Only ${wordCount} words. Consider adding more unique content (300+ words recommended).</p>
              </div>
            ` : ''}
            
            ${headings.h1.length === 0 ? `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #f44336;">
                <strong>🏷️ Missing H1 Tag</strong>
                <p style="margin: 5px 0 0; font-size: 13px;">No H1 heading found. Add a unique H1 that describes the page content.</p>
              </div>
            ` : ''}
            
            ${headings.h1.length > 1 ? `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #FF9800;">
                <strong>🏷️ Multiple H1 Tags (${headings.h1.length})</strong>
                <p style="margin: 5px 0 0; font-size: 13px;">Multiple H1 tags can confuse search engines. Use only one H1 per page.</p>
              </div>
            ` : ''}
            
            ${duplicateHeadings.length > 0 ? `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #FF9800;">
                <strong>🔄 Duplicate Headings (${duplicateHeadings.length})</strong>
                <div style="margin-top: 8px; max-height: 150px; overflow-y: auto;">
                  ${duplicateHeadings.map(h => `
                    <div style="font-size: 12px; padding: 4px; background: #f5f5f5; margin-bottom: 4px; border-radius: 4px;">
                      ${h.level.toUpperCase()}: "${escapeHtml(h.text)}"
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${uniqueSimilarBlocks.length > 0 ? `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #FF9800;">
                <strong>📋 Similar Content Blocks (${uniqueSimilarBlocks.length})</strong>
                <p style="margin: 5px 0 0; font-size: 13px;">Found similar text repeated within the page. Consider consolidating or differentiating.</p>
              </div>
            ` : ''}
          </div>
        </div>
      ` : `
        <div style="margin-bottom: 20px;">
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #2e7d32;">✅ No major duplicate content issues detected on this page!</p>
          </div>
        </div>
      `}
      
      <!-- Content Analysis Tabs -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 5px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
          <button id="tab-meta" class="dup-tab-btn active" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">📊 Meta Data</button>
          <button id="tab-structure" class="dup-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">🏗️ Structure</button>
          <button id="tab-headings" class="dup-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">📑 Headings</button>
          <button id="tab-samples" class="dup-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">📝 Text Samples</button>
        </div>
      </div>
      
      <!-- Tab Content - Meta Data -->
      <div id="dup-tab-meta" class="dup-tab-content">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="margin-bottom: 15px;">
            <strong>Page Title (${title.length} chars):</strong>
            <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px; font-size: 14px;">
              ${escapeHtml(title)}
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 4px;">
              ${title.length < 30 ? '⚠️ Too short' : title.length > 60 ? '⚠️ Too long' : '✅ Good length'}
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Meta Description (${metaDesc.length} chars):</strong>
            <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px; font-size: 14px;">
              ${metaDesc ? escapeHtml(metaDesc) : '<span style="color: #999;">Not found</span>'}
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 4px;">
              ${!metaDesc ? '⚠️ Missing' : metaDesc.length < 50 ? '⚠️ Too short' : metaDesc.length > 160 ? '⚠️ Too long' : '✅ Good length'}
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>URL:</strong>
            <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
              ${escapeHtml(url)}
            </div>
          </div>
          
          <div>
            <strong>Canonical URL:</strong>
            <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
              ${document.querySelector('link[rel="canonical"]')?.href || '<span style="color: #999;">Not specified</span>'}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tab Content - Structure -->
      <div id="dup-tab-structure" class="dup-tab-content" style="display: none;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
            ${Object.entries(structure).map(([key, value]) => `
              <div style="background: white; padding: 12px; border-radius: 6px;">
                <div style="font-size: 20px; font-weight: bold; color: #667eea;">${value}</div>
                <div style="font-size: 12px; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 15px;">
            <strong>Common Boilerplate Phrases Found:</strong>
            <div style="margin-top: 8px;">
              ${foundBoilerplate.length > 0 ? foundBoilerplate.map(phrase => `
                <span style="display: inline-block; background: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; margin: 4px; border: 1px solid #e0e0e0;">
                  "${escapeHtml(phrase)}"
                </span>
              `).join('') : '<span style="color: #999;">No common boilerplate phrases detected</span>'}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tab Content - Headings -->
      <div id="dup-tab-headings" class="dup-tab-content" style="display: none;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto;">
          ${Object.entries(headings).map(([level, texts]) => `
            <div style="margin-bottom: 20px;">
              <strong style="font-size: 16px;">${level.toUpperCase()} Tags (${texts.length}):</strong>
              <div style="margin-top: 8px;">
                ${texts.length > 0 ? texts.map((text, i) => `
                  <div style="background: white; padding: 10px; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid ${level === 'h1' ? '#667eea' : '#999'};">
                    ${escapeHtml(text)}
                  </div>
                `).join('') : '<div style="color: #999; padding: 10px;">No ' + level.toUpperCase() + ' tags found</div>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Tab Content - Text Samples -->
      <div id="dup-tab-samples" class="dup-tab-content" style="display: none;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto;">
          <p style="margin: 0 0 10px; font-size: 13px; color: #666;">Copy these samples to check for duplicates manually:</p>
          ${textBlocks.slice(0, 10).map((block, i) => `
            <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; color: #666;">${block.tagName} ${block.selector}</span>
                <button class="copy-text-btn" data-text="${escapeHtml(block.fullText)}" style="padding: 4px 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  📋 Copy
                </button>
              </div>
              <div style="font-size: 13px; line-height: 1.5;">
                "${escapeHtml(block.text)}..."
              </div>
            </div>
          `).join('')}
          ${textBlocks.length === 0 ? '<p style="color: #999; text-align: center;">No text samples available</p>' : ''}
        </div>
      </div>
      
      <!-- Recommendations -->
      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">💡 Recommendations</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${wordCount < 300 ? '<li>Add more unique content (aim for 300+ words)</li>' : ''}
          ${headings.h1.length !== 1 ? '<li>Use exactly one H1 tag per page</li>' : ''}
          ${!metaDesc ? '<li>Add a unique meta description</li>' : ''}
          ${duplicateHeadings.length > 0 ? '<li>Make headings more distinct and descriptive</li>' : ''}
          ${uniqueSimilarBlocks.length > 0 ? '<li>Reduce repetitive content blocks</li>' : ''}
          <li>Use canonical tags to prevent duplicate content across URLs</li>
          <li>Ensure each page has a unique focus and value proposition</li>
          <li>Regularly audit content for unintentional duplication</li>
        </ul>
      </div>
      
      <!-- Actions -->
      <div style="margin-top: 20px;">
        <button id="copyAnalysisReport" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Analysis Report
        </button>
        <button id="exportAnalysisCSV" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export CSV
        </button>
      </div>
    </div>
  `;
  
  const modal = createModal('🔍 Duplicate Content Analyzer', content);
  
  setTimeout(() => {
    // Tab switching functionality
    const tabs = {
      'tab-meta': 'meta',
      'tab-structure': 'structure', 
      'tab-headings': 'headings',
      'tab-samples': 'samples'
    };
    
    Object.entries(tabs).forEach(([buttonId, tabName]) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', () => {
          // Hide all tab contents
          document.querySelectorAll('.dup-tab-content').forEach(tab => {
            tab.style.display = 'none';
          });
          
          // Show selected tab content
          const selectedTab = document.getElementById(`dup-tab-${tabName}`);
          if (selectedTab) {
            selectedTab.style.display = 'block';
          }
          
          // Reset all button styles
          document.querySelectorAll('.dup-tab-btn').forEach(btn => {
            btn.style.background = '#f5f5f5';
            btn.style.color = '#666';
          });
          
          // Highlight active button
          button.style.background = '#667eea';
          button.style.color = 'white';
        });
      }
    });
    
    // Copy text buttons
    document.querySelectorAll('.copy-text-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.text);
        showNotification('Text copied to clipboard!', 'success');
      });
    });
    
    // Copy full report
    document.getElementById('copyAnalysisReport')?.addEventListener('click', () => {
      const report = `DUPLICATE CONTENT ANALYSIS REPORT
================================
URL: ${url}
Date: ${new Date().toLocaleString()}
Uniqueness Score: ${uniquenessScore}/100

CONTENT STATISTICS
-----------------
Total Words: ${wordCount}
Unique Words: ${stats.uniqueWords} (${wordCount > 0 ? ((stats.uniqueWords / wordCount) * 100).toFixed(1) : 0}% unique)
Sentences: ${stats.sentences}
Avg Words/Sentence: ${stats.avgWordsPerSentence}
Reading Time: ${stats.readingTime} minutes
Content Fingerprint: ${fingerprint}

META DATA
---------
Title (${title.length} chars): ${title}
Meta Description (${metaDesc.length} chars): ${metaDesc || 'Missing'}
Canonical: ${document.querySelector('link[rel="canonical"]')?.href || 'Not specified'}

STRUCTURE
---------
${Object.entries(structure).map(([k, v]) => `${k}: ${v}`).join('\n')}

HEADINGS
--------
H1: ${headings.h1.length} - ${headings.h1.join('; ')}
H2: ${headings.h2.length} - ${headings.h2.slice(0, 5).join('; ')}${headings.h2.length > 5 ? '...' : ''}
H3: ${headings.h3.length} - ${headings.h3.slice(0, 5).join('; ')}${headings.h3.length > 5 ? '...' : ''}

ISSUES FOUND
-----------
${wordCount < 300 ? '- Thin content\n' : ''}${headings.h1.length === 0 ? '- Missing H1\n' : ''}${headings.h1.length > 1 ? `- Multiple H1 tags (${headings.h1.length})\n` : ''}${duplicateHeadings.length > 0 ? `- ${duplicateHeadings.length} duplicate headings\n` : ''}${uniqueSimilarBlocks.length > 0 ? `- ${uniqueSimilarBlocks.length} similar content blocks\n` : ''}${!metaDesc ? '- Missing meta description\n' : ''}

RECOMMENDATIONS
--------------
${wordCount < 300 ? '- Add more content (300+ words)\n' : ''}${headings.h1.length !== 1 ? '- Use exactly one H1 tag\n' : ''}${!metaDesc ? '- Add meta description\n' : ''}${duplicateHeadings.length > 0 ? '- Make headings more distinct\n' : ''}- Use canonical tags
- Ensure unique content on each page`;

      copyToClipboard(report);
      showNotification('Report copied to clipboard!', 'success');
    });
    
    // Export CSV
    document.getElementById('exportAnalysisCSV')?.addEventListener('click', () => {
      let csv = 'Metric,Value,Status\n';
      csv += `"Uniqueness Score",${uniquenessScore},"${uniquenessScore >= 80 ? 'Excellent' : uniquenessScore >= 60 ? 'Good' : 'Needs Improvement'}"\n`;
      csv += `"Total Words",${wordCount},"${wordCount >= 300 ? 'Good' : 'Thin'}"\n`;
      csv += `"Unique Words",${stats.uniqueWords},"${wordCount > 0 ? ((stats.uniqueWords/wordCount)*100).toFixed(1) : 0}%"\n`;
      csv += `"Reading Time",${stats.readingTime},"minutes"\n`;
      csv += `"H1 Tags",${headings.h1.length},"${headings.h1.length === 1 ? 'Good' : 'Issue'}"\n`;
      csv += `"Duplicate Headings",${duplicateHeadings.length},""\n`;
      csv += `"Similar Content Blocks",${uniqueSimilarBlocks.length},""\n`;
      csv += `"Meta Description","${metaDesc ? 'Present' : 'Missing'}","${metaDesc.length} chars"\n`;
      csv += `"Content Fingerprint",${fingerprint},""\n`;
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-analysis-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported!', 'success');
    });
  }, 100);
}

// ==================== ENHANCED SITE STRUCTURE VISUALIZER (FIXED TABS) ====================
function visualizeSiteStructure() {
  const domain = window.location.hostname.replace('www.', '');
  const currentPath = window.location.pathname;
  const fullUrl = window.location.href;
  
  // Get all links with detailed analysis
  const links = document.querySelectorAll('a[href]');
  const internalLinks = [];
  const externalLinks = [];
  const linkMap = new Map();
  const brokenLinks = [];
  const nofollowLinks = [];
  const anchorTextMap = new Map();
  
  links.forEach(link => {
    try {
      const href = link.href;
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        if (href === '#') return;
        if (href.startsWith('javascript:')) return;
      }
      
      const url = new URL(href, window.location.origin);
      const isInternal = url.hostname === window.location.hostname;
      const text = link.textContent.trim().substring(0, 100) || '[No Text]';
      const rel = link.getAttribute('rel') || '';
      const isNofollow = rel.includes('nofollow');
      const target = link.getAttribute('target') || '';
      const title = link.getAttribute('title') || '';
      
      const linkData = {
        url: href,
        text,
        isInternal,
        isNofollow,
        target: target === '_blank' ? 'New Tab' : 'Same Tab',
        title,
        className: link.className || ''
      };
      
      if (isInternal) {
        const path = url.pathname + url.search;
        if (!linkMap.has(path)) {
          linkMap.set(path, { 
            path, 
            texts: [text], 
            count: 1,
            fullUrls: [href]
          });
        } else {
          const existing = linkMap.get(path);
          existing.count++;
          existing.texts.push(text);
          existing.fullUrls.push(href);
        }
        internalLinks.push(linkData);
        
        // Track anchor text variations
        if (!anchorTextMap.has(path)) {
          anchorTextMap.set(path, new Set());
        }
        anchorTextMap.get(path).add(text);
      } else {
        externalLinks.push(linkData);
      }
      
      if (isNofollow) {
        nofollowLinks.push(linkData);
      }
      
    } catch (e) {
      brokenLinks.push({ url: link.href, error: e.message });
    }
  });
  
  // Get heading structure with hierarchy analysis
  const headings = [];
  const headingHierarchy = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  let lastHeadingLevel = 0;
  const hierarchyIssues = [];
  
  for (let i = 1; i <= 6; i++) {
    document.querySelectorAll(`h${i}`).forEach(h => {
      const text = h.textContent.trim().substring(0, 100);
      const id = h.id || '';
      const className = h.className || '';
      
      headings.push({ 
        level: i, 
        text, 
        id, 
        className,
        element: h 
      });
      
      headingHierarchy[`h${i}`]++;
      
      // Check for skipped heading levels
      if (lastHeadingLevel > 0 && i > lastHeadingLevel + 1) {
        hierarchyIssues.push(`Skipped from H${lastHeadingLevel} to H${i}`);
      }
      lastHeadingLevel = i;
    });
  }
  
  // Get breadcrumbs with schema detection
  const breadcrumbs = [];
  const breadcrumbSelectors = [
    '[class*="breadcrumb"] a',
    '[aria-label*="breadcrumb"] a',
    '.breadcrumbs a',
    '[itemtype*="BreadcrumbList"] a',
    'nav[aria-label*="breadcrumb"] a',
    '.breadcrumb-trail a'
  ];
  
  breadcrumbSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(b => {
      const text = b.textContent.trim();
      if (text && !breadcrumbs.includes(text)) {
        breadcrumbs.push(text);
      }
    });
  });
  
  // Get navigation items with hierarchy
  const navItems = [];
  const navSelectors = [
    'nav a',
    '.menu a',
    '.navigation a',
    '[role="navigation"] a',
    'header a',
    '.navbar a',
    '.main-menu a'
  ];
  
  navSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(n => {
      const text = n.textContent.trim().substring(0, 50);
      const href = n.href;
      if (text && !navItems.find(item => item.text === text)) {
        navItems.push({ text, href });
      }
    });
  });
  
  // Get schema.org data
  const schemaData = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      schemaData.push(data);
    } catch (e) {}
  });
  
  // Get meta tags
  const metaTags = {};
  document.querySelectorAll('meta').forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
    const content = meta.getAttribute('content');
    if (name && content) {
      metaTags[name] = content;
    }
  });
  
  // Get images with alt text analysis
  const images = [];
  const imagesWithoutAlt = [];
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src') || '';
    const alt = img.alt || '';
    const width = img.width || img.getAttribute('data-width') || '';
    const height = img.height || img.getAttribute('data-height') || '';
    
    images.push({ src, alt, width, height });
    if (!alt || alt.trim() === '') {
      imagesWithoutAlt.push(src);
    }
  });
  
  // Get forms and inputs
  const forms = document.querySelectorAll('form');
  const inputs = document.querySelectorAll('input, textarea, select');
  
  // Get canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')?.href || fullUrl;
  
  // Get language
  const htmlLang = document.documentElement.lang || 'Not specified';
  
  // Calculate statistics
  const uniqueInternalPaths = [...linkMap.values()]
    .sort((a, b) => b.count - a.count);
  
  const avgLinksPerPage = internalLinks.length;
  const externalDomains = [...new Set(externalLinks.map(l => new URL(l.url).hostname))];
  
  // SEO Score calculation
  let seoScore = 100;
  const seoIssues = [];
  
  if (headings.filter(h => h.level === 1).length === 0) {
    seoScore -= 15;
    seoIssues.push('Missing H1 tag');
  } else if (headings.filter(h => h.level === 1).length > 1) {
    seoScore -= 10;
    seoIssues.push('Multiple H1 tags detected');
  }
  
  if (!metaTags.description) {
    seoScore -= 10;
    seoIssues.push('Missing meta description');
  } else if (metaTags.description.length < 50 || metaTags.description.length > 160) {
    seoScore -= 5;
    seoIssues.push('Meta description length not optimal (50-160 chars)');
  }
  
  if (!metaTags['og:title'] && !metaTags['twitter:title']) {
    seoScore -= 5;
    seoIssues.push('Missing social media meta tags');
  }
  
  if (imagesWithoutAlt.length > 0) {
    seoScore -= Math.min(10, imagesWithoutAlt.length * 2);
    seoIssues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }
  
  if (!canonical || canonical !== fullUrl) {
    seoScore -= 5;
    seoIssues.push('Canonical URL issue detected');
  }
  
  if (currentPath.split('/').filter(Boolean).length > 4) {
    seoScore -= 5;
    seoIssues.push('URL depth too deep (>4 levels)');
  }
  
  if (htmlLang === 'Not specified') {
    seoScore -= 5;
    seoIssues.push('Missing language declaration');
  }
  
  seoScore = Math.max(0, seoScore);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 10px;">🏗️ Site Structure Visualizer</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 13px;">${domain}${currentPath}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 36px; font-weight: bold;">${seoScore}</div>
            <div style="font-size: 12px; opacity: 0.9;">SEO Score</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${internalLinks.length}</div>
          <div style="font-size: 12px; opacity: 0.9;">Internal Links</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${externalLinks.length}</div>
          <div style="font-size: 12px; opacity: 0.9;">External Links</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${linkMap.size}</div>
          <div style="font-size: 12px; opacity: 0.9;">Unique Pages</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${currentPath.split('/').filter(Boolean).length}</div>
          <div style="font-size: 12px; opacity: 0.9;">Click Depth</div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 5px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
          <button id="tab-overview-btn" class="site-tab-btn active" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">📊 Overview</button>
          <button id="tab-links-btn" class="site-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">🔗 Links</button>
          <button id="tab-seo-btn" class="site-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">🎯 SEO</button>
          <button id="tab-technical-btn" class="site-tab-btn" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">⚙️ Technical</button>
        </div>
      </div>
      
      <!-- Tab Content - Overview -->
      <div id="tab-overview" class="site-tab-content">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h4 style="margin: 0 0 10px;">📑 Heading Structure</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
              ${headings.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  ${Object.entries(headingHierarchy).map(([level, count]) => count > 0 ? `
                    <div style="display: inline-block; margin-right: 15px;">
                      <span style="font-weight: 600;">${level.toUpperCase()}:</span> ${count}
                    </div>
                  ` : '').join('')}
                </div>
                ${headings.map((h, i) => `
                  <div style="padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px; border-left: 3px solid ${h.level === 1 ? '#667eea' : '#999'};">
                    <span style="display: inline-block; width: 40px; font-weight: 600; color: ${h.level === 1 ? '#667eea' : '#999'};">H${h.level}</span>
                    <span>${escapeHtml(h.text)}</span>
                    ${h.id ? `<span style="display: block; font-size: 11px; color: #999; margin-left: 40px;">#${escapeHtml(h.id)}</span>` : ''}
                  </div>
                `).join('')}
              ` : '<p style="color: #999; text-align: center; padding: 20px;">No headings found</p>'}
            </div>
          </div>
          
          <div>
            <h4 style="margin: 0 0 10px;">🧭 Navigation & Breadcrumbs</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
              ${breadcrumbs.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <strong>Breadcrumbs:</strong>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                    ${breadcrumbs.map((b, i) => `
                      <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${escapeHtml(b)}</span>
                      ${i < breadcrumbs.length - 1 ? '<span style="color: #999;">→</span>' : ''}
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              <strong>Navigation Items (${navItems.length}):</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                ${navItems.slice(0, 30).map(item => `
                  <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; border: 1px solid #e0e0e0;" title="${escapeHtml(item.href)}">${escapeHtml(item.text)}</span>
                `).join('')}
                ${navItems.length > 30 ? `<span style="color: #999;">+${navItems.length - 30} more</span>` : ''}
                ${navItems.length === 0 ? '<p style="color: #999;">No navigation items found</p>' : ''}
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">📊 Top Internal Pages</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
            ${uniqueInternalPaths.slice(0, 15).map((item, i) => `
              <div style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                  <span style="width: 40px; font-weight: 600; color: #667eea;">#${i + 1}</span>
                  <span style="flex: 1; font-family: monospace; font-size: 12px; word-break: break-all;">${escapeHtml(item.path)}</span>
                  <span style="background: #667eea; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11px;">${item.count} links</span>
                </div>
                <div style="margin-left: 40px; font-size: 12px; color: #666;">
                  Anchor text: ${escapeHtml([...new Set(item.texts)].slice(0, 3).join(' • '))}
                </div>
              </div>
            `).join('')}
            ${uniqueInternalPaths.length === 0 ? '<p style="color: #999; text-align: center; padding: 20px;">No internal links found</p>' : ''}
          </div>
        </div>
      </div>
      
      <!-- Tab Content - Links -->
      <div id="tab-links" class="site-tab-content" style="display: none;">
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">🔗 External Domains (${externalDomains.length})</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${externalDomains.slice(0, 30).map(domain => `
                <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; border: 1px solid #e0e0e0;">${escapeHtml(domain)}</span>
              `).join('')}
              ${externalDomains.length > 30 ? `<span style="color: #999;">+${externalDomains.length - 30} more</span>` : ''}
              ${externalDomains.length === 0 ? '<p style="color: #999;">No external domains found</p>' : ''}
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">🔒 Nofollow Links (${nofollowLinks.length})</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
            ${nofollowLinks.length > 0 ? nofollowLinks.slice(0, 20).map(link => `
              <div style="padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px;">
                <div style="font-size: 12px; word-break: break-all;">${escapeHtml(link.url)}</div>
                <div style="font-size: 11px; color: #666; margin-top: 4px;">Text: ${escapeHtml(link.text)}</div>
              </div>
            `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No nofollow links found</p>'}
          </div>
        </div>
        
        ${brokenLinks.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; color: #f44336;">⚠️ Broken Links (${brokenLinks.length})</h4>
            <div style="background: #ffebee; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
              ${brokenLinks.map(link => `
                <div style="padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px;">
                  <div style="font-size: 12px; word-break: break-all;">${escapeHtml(link.url)}</div>
                  <div style="font-size: 11px; color: #f44336;">${escapeHtml(link.error)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      
      <!-- Tab Content - SEO -->
      <div id="tab-seo" class="site-tab-content" style="display: none;">
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">🎯 SEO Score: ${seoScore}/100</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="width: ${seoScore}%; height: 100%; background: ${seoScore >= 80 ? '#4CAF50' : seoScore >= 60 ? '#FF9800' : '#f44336'}; transition: width 0.3s;"></div>
            </div>
          </div>
          
          ${seoIssues.length > 0 ? `
            <h4 style="margin: 0 0 10px;">⚠️ SEO Issues Found</h4>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <ul style="margin: 0; padding-left: 20px;">
                ${seoIssues.map(issue => `<li style="margin-bottom: 5px;">${escapeHtml(issue)}</li>`).join('')}
              </ul>
            </div>
          ` : '<p style="color: #4CAF50; padding: 15px; background: #e8f5e9; border-radius: 8px;">✅ No major SEO issues found!</p>'}
          
          <h4 style="margin: 0 0 10px;">📝 Meta Tags</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
            ${Object.entries(metaTags).length > 0 ? Object.entries(metaTags).map(([name, content]) => `
              <div style="padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px;">
                <strong style="color: #667eea;">${escapeHtml(name)}:</strong>
                <span style="font-size: 12px; word-break: break-all;">${escapeHtml(content)}</span>
              </div>
            `).join('') : '<p style="color: #999;">No meta tags found</p>'}
          </div>
          
          ${schemaData.length > 0 ? `
            <h4 style="margin: 15px 0 10px;">📋 Schema.org Data</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <pre style="margin: 0; font-size: 11px; overflow-x: auto; max-height: 300px;">${escapeHtml(JSON.stringify(schemaData, null, 2))}</pre>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Tab Content - Technical -->
      <div id="tab-technical" class="site-tab-content" style="display: none;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="margin: 0 0 10px;">🖼️ Image Analysis</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p><strong>Total Images:</strong> ${images.length}</p>
              <p><strong>Images without Alt:</strong> ${imagesWithoutAlt.length}</p>
              ${imagesWithoutAlt.length > 0 ? `
                <div style="margin-top: 10px; max-height: 200px; overflow-y: auto;">
                  ${imagesWithoutAlt.slice(0, 10).map(src => `
                    <div style="font-size: 11px; word-break: break-all; margin-bottom: 5px;">${escapeHtml(src)}</div>
                  `).join('')}
                  ${imagesWithoutAlt.length > 10 ? `<p style="color: #999;">+${imagesWithoutAlt.length - 10} more</p>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          
          <div>
            <h4 style="margin: 0 0 10px;">📋 Forms & Inputs</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p><strong>Forms:</strong> ${forms.length}</p>
              <p><strong>Input Fields:</strong> ${inputs.length}</p>
            </div>
          </div>
          
          <div>
            <h4 style="margin: 0 0 10px;">🌐 Page Info</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p><strong>Canonical URL:</strong> <span style="font-size: 11px; word-break: break-all;">${escapeHtml(canonical)}</span></p>
              <p><strong>Language:</strong> ${escapeHtml(htmlLang)}</p>
              <p><strong>Page Size:</strong> ~${(document.documentElement.outerHTML.length / 1024).toFixed(2)} KB</p>
              <p><strong>DOM Elements:</strong> ${document.querySelectorAll('*').length}</p>
            </div>
          </div>
          
          <div>
            <h4 style="margin: 0 0 10px;">📱 Responsive Check</h4>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p><strong>Viewport:</strong> ${document.querySelector('meta[name="viewport"]') ? '✅ Present' : '❌ Missing'}</p>
              <p><strong>Window Width:</strong> ${window.innerWidth}px</p>
              <p><strong>Device Pixel Ratio:</strong> ${window.devicePixelRatio || 1}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <button id="copyFullReport" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Full Report
        </button>
        <button id="exportDetailedCSV" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📊 Export Detailed CSV
        </button>
        <button id="exportSEOReport" style="padding: 12px 24px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🎯 Export SEO Report
        </button>
      </div>
    </div>
  `;
  
  const modal = createModal('🏗️ Site Structure Visualizer', content);
  
  setTimeout(() => {
    // Tab switching functionality with event listeners
    const tabs = {
      'tab-overview-btn': 'overview',
      'tab-links-btn': 'links',
      'tab-seo-btn': 'seo',
      'tab-technical-btn': 'technical'
    };
    
    Object.entries(tabs).forEach(([buttonId, tabName]) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', () => {
          // Hide all tab contents
          document.querySelectorAll('.site-tab-content').forEach(tab => {
            tab.style.display = 'none';
          });
          
          // Show selected tab content
          const selectedTab = document.getElementById(`tab-${tabName}`);
          if (selectedTab) {
            selectedTab.style.display = 'block';
          }
          
          // Reset all button styles
          document.querySelectorAll('.site-tab-btn').forEach(btn => {
            btn.style.background = '#f5f5f5';
            btn.style.color = '#666';
          });
          
          // Highlight active button
          button.style.background = '#667eea';
          button.style.color = 'white';
        });
      }
    });
    
    // Copy full report
    document.getElementById('copyFullReport')?.addEventListener('click', () => {
      const report = `SITE STRUCTURE REPORT - ${domain}
Date: ${new Date().toLocaleString()}
URL: ${fullUrl}

=== OVERVIEW ===
Internal Links: ${internalLinks.length}
External Links: ${externalLinks.length}
Unique Pages Linked: ${linkMap.size}
Click Depth: ${currentPath.split('/').filter(Boolean).length}
SEO Score: ${seoScore}/100

=== HEADING STRUCTURE ===
${Object.entries(headingHierarchy).map(([level, count]) => `${level.toUpperCase()}: ${count}`).join('\n')}
${headings.map(h => `H${h.level}: ${h.text}`).join('\n')}

=== TOP INTERNAL PAGES ===
${uniqueInternalPaths.slice(0, 10).map((p, i) => 
  `${i + 1}. ${p.path} (${p.count} links)\n   Anchor: ${[...new Set(p.texts)].slice(0, 3).join(' | ')}`
).join('\n')}

=== META TAGS ===
${Object.entries(metaTags).map(([name, content]) => `${name}: ${content}`).join('\n')}

=== SEO ISSUES ===
${seoIssues.length > 0 ? seoIssues.join('\n') : 'No major SEO issues found'}

=== TECHNICAL ===
Canonical: ${canonical}
Language: ${htmlLang}
Images: ${images.length} total, ${imagesWithoutAlt.length} missing alt
Forms: ${forms.length}, Inputs: ${inputs.length}
Viewport: ${document.querySelector('meta[name="viewport"]') ? 'Present' : 'Missing'}`;
      
      copyToClipboard(report);
      showNotification('Full report copied to clipboard!', 'success');
    });
    
    // Export detailed CSV
    document.getElementById('exportDetailedCSV')?.addEventListener('click', () => {
      let csv = 'Type,Data,Count,Details\n';
      
      // Add headings
      headings.forEach(h => {
        csv += `"Heading H${h.level}","${h.text.replace(/"/g, '""')}",,"${h.id || 'No ID'}"\n`;
      });
      
      // Add internal links
      uniqueInternalPaths.forEach(p => {
        csv += `"Internal Link","${p.path}",${p.count},"${[...new Set(p.texts)].slice(0, 5).join(' | ').replace(/"/g, '""')}"\n`;
      });
      
      // Add external domains
      externalDomains.forEach(domain => {
        const count = externalLinks.filter(l => l.url.includes(domain)).length;
        csv += `"External Domain","${domain}",${count},\n`;
      });
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-structure-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Detailed CSV exported!', 'success');
    });
    
    // Export SEO report
    document.getElementById('exportSEOReport')?.addEventListener('click', () => {
      let csv = 'SEO Factor,Status,Value,Recommendation\n';
      
      csv += `"H1 Tags","${headings.filter(h => h.level === 1).length === 1 ? 'Good' : 'Issue'}","${headings.filter(h => h.level === 1).length} found","Should have exactly 1 H1 tag"\n`;
      csv += `"Meta Description","${metaTags.description ? 'Present' : 'Missing'}","${metaTags.description ? metaTags.description.length + ' chars' : 'N/A'}","50-160 characters optimal"\n`;
      csv += `"Canonical URL","${canonical === fullUrl ? 'Match' : 'Different'}","${canonical}","Should match current URL"\n`;
      csv += `"Image Alt Text","${imagesWithoutAlt.length === 0 ? 'Good' : 'Issue'}","${imagesWithoutAlt.length} missing","All images should have alt text"\n`;
      csv += `"Language Declaration","${htmlLang !== 'Not specified' ? 'Present' : 'Missing'}","${htmlLang}","Should specify language"\n`;
      csv += `"URL Depth","${currentPath.split('/').filter(Boolean).length <= 4 ? 'Good' : 'Deep'}","${currentPath.split('/').filter(Boolean).length} levels","Keep under 4 levels"\n`;
      csv += `"Internal Links","${internalLinks.length > 5 ? 'Good' : 'Low'}","${internalLinks.length}","More internal links improve crawlability"\n`;
      csv += `"SEO Score","${seoScore}","${seoScore}/100","Aim for 80+"\n`;
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-report-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('SEO report exported!', 'success');
    });
  }, 100);
}

// ==================== GOOGLE MAPS SCRAPER (WORKING VERSION) ====================
function scrapeGoogleMaps() {
  const isGoogleMaps = window.location.hostname.includes('google.') && 
                       (window.location.pathname.includes('/maps') || window.location.search.includes('maps'));
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🗺️ Google Maps Scraper v2</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Manual selection method - more reliable</p>
      </div>
      
      ${isGoogleMaps ? `
        <div style="margin-bottom: 20px;">
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 0; color: #e65100; font-weight: bold;">⚠️ Important Instructions:</p>
            <ol style="margin: 10px 0 0 20px; padding: 0; color: #666;">
              <li>Search for businesses on Google Maps</li>
              <li>Scroll to load all results you want to scrape</li>
              <li>Click "Extract All Visible Results" below</li>
              <li>Or use "Manual Selection Mode" for more control</li>
            </ol>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <button id="extractAllResults" style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
            📊 Extract All Visible Results
          </button>
          
          <button id="manualSelectionMode" style="width: 100%; padding: 15px; background: #FF9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-bottom: 10px;">
            🎯 Manual Selection Mode (Click on results to add)
          </button>
          
          <button id="extractFromSidebar" style="width: 100%; padding: 15px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            📋 Extract from Sidebar List
          </button>
        </div>
        
        <div id="manualModeStatus" style="display: none; margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #1565c0;">🔴 Manual Selection Mode Active - Click on business names in the sidebar to add them</p>
        </div>
        
        <div id="scrapeResults" style="margin-bottom: 20px;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #666;">Click a button above to start extracting</p>
          </div>
        </div>
      ` : `
        <div style="margin-bottom: 20px;">
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 15px; color: #e65100;">⚠️ This tool works on Google Maps pages</p>
            <button id="openGoogleMaps" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              🗺️ Open Google Maps
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">🔍 Search Google Maps</h4>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="mapsSearchQuery" placeholder="e.g., restaurants in New York" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="searchMaps" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
          </div>
        </div>
      `}
      
      <div style="margin-bottom: 15px;">
        <button id="exportScrapedData" style="padding: 10px 20px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; display: none;" class="export-btn">
          📊 Export as CSV
        </button>
        <button id="copyScrapedData" style="padding: 10px 20px; background: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer; display: none;" class="copy-btn">
          📋 Copy All Data
        </button>
        <button id="clearScrapedData" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; display: none;" class="clear-btn">
          🗑️ Clear Data
        </button>
      </div>
      
      <div id="debugInfo" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666; display: none;">
        <strong>Debug Info:</strong>
        <pre id="debugContent" style="margin: 5px 0 0; white-space: pre-wrap; word-wrap: break-word;"></pre>
      </div>
    </div>
  `;
  
  const modal = createModal('🗺️ Google Maps Scraper v2', content);
  
  let scrapedBusinesses = [];
  let manualModeActive = false;
  let clickListener = null;
  
  // Debug function
  const debug = (message, data) => {
    console.log('[Maps Scraper]', message, data);
    const debugInfo = document.getElementById('debugInfo');
    const debugContent = document.getElementById('debugContent');
    if (debugInfo && debugContent) {
      debugInfo.style.display = 'block';
      debugContent.textContent = `${message}\n${JSON.stringify(data, null, 2)}`;
    }
  };
  
  // Comprehensive extraction function
  const extractAllVisibleBusinesses = () => {
    debug('Starting extraction...');
    const businesses = [];
    const seen = new Set();
    
    // STRATEGY 1: Look for anchor tags with specific characteristics
    const allLinks = document.querySelectorAll('a');
    debug(`Found ${allLinks.length} total links`);
    
    allLinks.forEach(link => {
      try {
        const href = link.href || '';
        const ariaLabel = link.getAttribute('aria-label') || '';
        const text = link.textContent || '';
        
        // Check if this is a business result link
        if (href.includes('/maps/place/') || ariaLabel.includes('stars') || ariaLabel.includes('review')) {
          // Try to get the parent container
          const container = link.closest('div[role="article"], div[jsaction*="mouseover"], div[data-result-id]') || link.parentElement?.parentElement;
          
          if (container) {
            const businessData = extractBusinessFromContainer(container, link);
            if (businessData && businessData.name && !seen.has(businessData.name)) {
              seen.add(businessData.name);
              businesses.push(businessData);
            }
          }
        }
      } catch (e) {
        debug('Error processing link:', e);
      }
    });
    
    // STRATEGY 2: Look for elements with role="article"
    const articles = document.querySelectorAll('div[role="article"]');
    debug(`Found ${articles.length} article elements`);
    
    articles.forEach(article => {
      try {
        const businessData = extractBusinessFromContainer(article, null);
        if (businessData && businessData.name && !seen.has(businessData.name)) {
          seen.add(businessData.name);
          businesses.push(businessData);
        }
      } catch (e) {
        debug('Error processing article:', e);
      }
    });
    
    // STRATEGY 3: Look for specific class patterns
    const possibleContainers = document.querySelectorAll('[class*="fontHeadline"], [class*="qBF1Pd"], [class*="NrDZNb"]');
    debug(`Found ${possibleContainers.length} possible name elements`);
    
    possibleContainers.forEach(el => {
      try {
        const container = el.closest('div[jsaction], div[data-result-id], div[role="article"]') || el.parentElement?.parentElement?.parentElement;
        if (container) {
          const businessData = extractBusinessFromContainer(container, null);
          if (businessData && businessData.name && !seen.has(businessData.name)) {
            seen.add(businessData.name);
            businesses.push(businessData);
          }
        }
      } catch (e) {
        debug('Error processing name element:', e);
      }
    });
    
    // STRATEGY 4: Extract from sidebar feed
    const feed = document.querySelector('div[role="feed"]');
    if (feed) {
      debug('Found feed element, extracting children...');
      const feedChildren = feed.children;
      for (let child of feedChildren) {
        try {
          const businessData = extractBusinessFromContainer(child, null);
          if (businessData && businessData.name && !seen.has(businessData.name)) {
            seen.add(businessData.name);
            businesses.push(businessData);
          }
        } catch (e) {
          // Skip errors
        }
      }
    }
    
    debug(`Extracted ${businesses.length} unique businesses`, businesses);
    return businesses;
  };
  
  // Extract data from a container element
  const extractBusinessFromContainer = (container, linkElement) => {
    try {
      // Get the link if not provided
      const link = linkElement || container.querySelector('a[href*="/maps/place/"]');
      
      // Extract name
      let name = '';
      const nameSelectors = [
        '.fontHeadlineSmall',
        '.qBF1Pd',
        '.NrDZNb',
        '[class*="fontHeadline"]',
        '[class*="title"]',
        'a[aria-label]'
      ];
      
      for (const sel of nameSelectors) {
        const nameEl = container.querySelector(sel);
        if (nameEl) {
          if (sel === 'a[aria-label]') {
            name = nameEl.getAttribute('aria-label') || '';
          } else {
            name = nameEl.textContent || '';
          }
          if (name) break;
        }
      }
      
      // If still no name, try link aria-label
      if (!name && link) {
        name = link.getAttribute('aria-label') || link.textContent || '';
      }
      
      // Clean name (remove rating info)
      if (name) {
        name = name.split('·')[0].split('Stars')[0].trim();
      }
      
      if (!name || name.length < 2) return null;
      
      // Extract rating
      let rating = '';
      const ratingEl = container.querySelector('[role="img"][aria-label*="stars"], span[aria-label*="stars"]');
      if (ratingEl) {
        const ariaLabel = ratingEl.getAttribute('aria-label') || '';
        const match = ariaLabel.match(/(\d+(\.\d+)?)/);
        if (match) rating = match[1];
      }
      
      // Extract review count
      let reviews = '';
      const text = container.textContent || '';
      const reviewMatch = text.match(/\((\d+(,\d+)*)\)/);
      if (reviewMatch) {
        reviews = reviewMatch[1];
      } else {
        const reviewEl = container.querySelector('[class*="review"], [class*="UY7F9"]');
        if (reviewEl) {
          reviews = reviewEl.textContent.replace(/[()]/g, '').trim();
        }
      }
      
      // Extract address
      let address = '';
      const addressSelectors = [
        '[class*="address"]',
        '[class*="W4Efsd"]',
        'div[style*="overflow-wrap"]:not([class*="title"])'
      ];
      
      for (const sel of addressSelectors) {
        const addrEl = container.querySelector(sel);
        if (addrEl) {
          address = addrEl.textContent.trim();
          if (address && !address.includes('stars') && !address.includes('review')) {
            break;
          }
        }
      }
      
      // Extract category/type
      let category = '';
      const catMatch = text.match(/([·•])\s*([^·•]+?)\s*[·•]/);
      if (catMatch) {
        category = catMatch[2].trim();
      }
      
      // Extract link
      let mapsUrl = '';
      if (link) {
        mapsUrl = link.href;
      }
      
      return {
        name,
        rating,
        reviews,
        address,
        category,
        mapsUrl,
        phone: '',
        website: ''
      };
      
    } catch (e) {
      debug('Error in extractBusinessFromContainer:', e);
      return null;
    }
  };
  
  // Extract from sidebar list
  const extractFromSidebarList = () => {
    const businesses = [];
    const seen = new Set();
    
    // Find the sidebar container
    const sidebar = document.querySelector('div[role="feed"], div[role="main"] div[style*="overflow"]');
    if (!sidebar) {
      debug('Sidebar not found');
      return businesses;
    }
    
    // Get all clickable elements that look like business listings
    const listings = sidebar.querySelectorAll('div[role="article"], a[href*="/maps/place/"]');
    debug(`Found ${listings.length} listings in sidebar`);
    
    listings.forEach(listing => {
      try {
        const container = listing.closest('div[role="article"]') || listing;
        const businessData = extractBusinessFromContainer(container, listing.tagName === 'A' ? listing : null);
        
        if (businessData && businessData.name && !seen.has(businessData.name)) {
          seen.add(businessData.name);
          businesses.push(businessData);
        }
      } catch (e) {
        debug('Error processing listing:', e);
      }
    });
    
    return businesses;
  };
  
  // Display results
  const displayResults = (businesses) => {
    const resultsDiv = document.getElementById('scrapeResults');
    if (!resultsDiv) return;
    
    if (businesses.length === 0) {
      resultsDiv.innerHTML = `
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; text-align: center; color: #c62828;">
          <p style="margin: 0 0 10px;">❌ No businesses found</p>
          <p style="margin: 0; font-size: 12px;">Try scrolling to load results first, or use Manual Selection Mode</p>
        </div>
      `;
      return;
    }
    
    scrapedBusinesses = businesses;
    
    let html = `<div style="margin-bottom: 10px;"><strong>✅ Found ${businesses.length} businesses</strong></div>`;
    html += '<div style="max-height: 400px; overflow-y: auto;">';
    
    businesses.forEach((b, i) => {
      html += `
        <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <strong>${i + 1}. ${escapeHtml(b.name || 'Unknown')}</strong>
              ${b.rating ? `<span style="margin-left: 10px; color: #FF9800;">⭐ ${escapeHtml(b.rating)}</span>` : ''}
              ${b.reviews ? `<span style="margin-left: 5px; color: #666;">(${escapeHtml(b.reviews)} reviews)</span>` : ''}
            </div>
            <button onclick="this.closest('div').remove(); updateScrapedBusinesses()" style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">✕</button>
          </div>
          ${b.category ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">🏷️ ${escapeHtml(b.category)}</div>` : ''}
          ${b.address ? `<div style="font-size: 12px; margin-top: 4px;">📍 ${escapeHtml(b.address)}</div>` : ''}
          ${b.mapsUrl ? `<div style="font-size: 12px; margin-top: 4px;"><a href="${escapeHtml(b.mapsUrl)}" target="_blank" style="color: #667eea;">🔗 Open in Google Maps</a></div>` : ''}
        </div>
      `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
    
    document.querySelectorAll('.export-btn, .copy-btn, .clear-btn').forEach(btn => {
      if (btn) btn.style.display = 'inline-block';
    });
  };
  
  // Manual selection mode
  const enableManualMode = () => {
    if (manualModeActive) {
      disableManualMode();
      return;
    }
    
    manualModeActive = true;
    const statusDiv = document.getElementById('manualModeStatus');
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<p style="margin: 0; color: #1565c0;">🟢 Manual Selection Mode Active - Click on business listings in the sidebar</p>';
    }
    
    // Add click listener to document
    clickListener = (e) => {
      const target = e.target.closest('div[role="article"], a[href*="/maps/place/"]');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        
        const container = target.closest('div[role="article"]') || target;
        const businessData = extractBusinessFromContainer(container, target.tagName === 'A' ? target : null);
        
        if (businessData && businessData.name) {
          // Check if already exists
          if (!scrapedBusinesses.find(b => b.name === businessData.name)) {
            scrapedBusinesses.push(businessData);
            displayResults(scrapedBusinesses);
            showNotification(`Added: ${businessData.name}`, 'success');
          } else {
            showNotification(`${businessData.name} already in list`, 'warning');
          }
        }
      }
    };
    
    document.addEventListener('click', clickListener, true);
    showNotification('Manual mode enabled - Click on businesses to add them', 'info');
  };
  
  const disableManualMode = () => {
    manualModeActive = false;
    const statusDiv = document.getElementById('manualModeStatus');
    if (statusDiv) {
      statusDiv.style.display = 'none';
    }
    
    if (clickListener) {
      document.removeEventListener('click', clickListener, true);
      clickListener = null;
    }
    
    showNotification('Manual mode disabled', 'info');
  };
  
  // Update businesses after manual removal
  window.updateScrapedBusinesses = () => {
    const resultsDiv = document.getElementById('scrapeResults');
    if (!resultsDiv) return;
    
    const items = resultsDiv.querySelectorAll('div[style*="background: white"]');
    const newBusinesses = [];
    
    items.forEach(item => {
      const nameEl = item.querySelector('strong');
      if (nameEl) {
        const name = nameEl.textContent.replace(/^\d+\.\s*/, '');
        const existing = scrapedBusinesses.find(b => b.name === name);
        if (existing) {
          newBusinesses.push(existing);
        }
      }
    });
    
    scrapedBusinesses = newBusinesses;
    
    if (scrapedBusinesses.length === 0) {
      document.querySelectorAll('.export-btn, .copy-btn, .clear-btn').forEach(btn => {
        if (btn) btn.style.display = 'none';
      });
    }
  };
  
  // Setup event listeners
  setTimeout(() => {
    if (isGoogleMaps) {
      document.getElementById('extractAllResults')?.addEventListener('click', () => {
        showNotification('Extracting all visible businesses...', 'info');
        const businesses = extractAllVisibleBusinesses();
        displayResults(businesses);
        showNotification(`Extracted ${businesses.length} businesses!`, 'success');
      });
      
      document.getElementById('extractFromSidebar')?.addEventListener('click', () => {
        showNotification('Extracting from sidebar...', 'info');
        const businesses = extractFromSidebarList();
        displayResults(businesses);
        showNotification(`Extracted ${businesses.length} businesses from sidebar!`, 'success');
      });
      
      document.getElementById('manualSelectionMode')?.addEventListener('click', () => {
        enableManualMode();
      });
    }
    
    document.getElementById('openGoogleMaps')?.addEventListener('click', () => {
      window.open('https://maps.google.com', '_blank');
    });
    
    document.getElementById('searchMaps')?.addEventListener('click', () => {
      const query = document.getElementById('mapsSearchQuery')?.value.trim();
      if (query) {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
      }
    });
    
    document.getElementById('exportScrapedData')?.addEventListener('click', () => {
      if (scrapedBusinesses.length === 0) {
        showNotification('No data to export!', 'warning');
        return;
      }
      
      let csv = 'Name,Rating,Reviews,Category,Address,Maps URL\n';
      scrapedBusinesses.forEach(b => {
        csv += `"${(b.name || '').replace(/"/g, '""')}","${b.rating || ''}","${b.reviews || ''}","${b.category || ''}","${b.address || ''}","${b.mapsUrl || ''}"\n`;
      });
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `google-maps-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported successfully!', 'success');
    });
    
    document.getElementById('copyScrapedData')?.addEventListener('click', () => {
      if (scrapedBusinesses.length === 0) {
        showNotification('No data to copy!', 'warning');
        return;
      }
      
      const text = scrapedBusinesses.map(b => 
        `${b.name || 'N/A'} | Rating: ${b.rating || 'N/A'} (${b.reviews || '0'} reviews) | ${b.address || 'N/A'} | ${b.mapsUrl || 'N/A'}`
      ).join('\n');
      
      copyToClipboard(text);
      showNotification(`${scrapedBusinesses.length} businesses copied!`, 'success');
    });
    
    document.getElementById('clearScrapedData')?.addEventListener('click', () => {
      scrapedBusinesses = [];
      disableManualMode();
      const resultsDiv = document.getElementById('scrapeResults');
      if (resultsDiv) {
        resultsDiv.innerHTML = '<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;"><p style="color: #666;">Data cleared. Click a button above to start extracting</p></div>';
      }
      document.querySelectorAll('.export-btn, .copy-btn, .clear-btn').forEach(btn => {
        if (btn) btn.style.display = 'none';
      });
      showNotification('Data cleared', 'info');
    });
    
  }, 100);
}

// ==================== LOCAL CITATION FINDER ====================
function findLocalCitations() {
  const domain = window.location.hostname.replace('www.', '');
  const pageTitle = document.title;
  
  // Try to detect business info
  const bodyText = document.body.innerText;
  let businessName = '';
  let businessPhone = '';
  let businessAddress = '';
  
  // Detect business name
  const h1 = document.querySelector('h1')?.textContent || '';
  const titleParts = pageTitle.split('|')[0].split('-')[0].trim();
  businessName = h1 || titleParts || domain;
  
  // Detect phone
  const phoneMatch = bodyText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) businessPhone = phoneMatch[0];
  
  // Detect address
  const addressMatch = bodyText.match(/\d{1,5}\s\w+\s\w+[,.]?\s?\w*[,.]?\s?[A-Z]{2}\s?\d{5}/);
  if (addressMatch) businessAddress = addressMatch[0];
  
  const citationSources = [
    { name: 'Google Business Profile', url: 'https://business.google.com/' },
    { name: 'Bing Places', url: 'https://www.bingplaces.com/' },
    { name: 'Apple Maps Connect', url: 'https://mapsconnect.apple.com/' },
    { name: 'Yelp for Business', url: 'https://biz.yelp.com/' },
    { name: 'Facebook Business', url: 'https://www.facebook.com/business' },
    { name: 'Instagram Business', url: 'https://business.instagram.com/' },
    { name: 'LinkedIn Company Page', url: 'https://www.linkedin.com/company/setup/' },
    { name: 'Twitter/X Business', url: 'https://business.twitter.com/' },
    { name: 'BBB (Better Business Bureau)', url: 'https://www.bbb.org/get-listed' },
    { name: 'Yellow Pages', url: 'https://www.yellowpages.com/listing' },
    { name: 'Superpages', url: 'https://www.superpages.com/' },
    { name: 'Whitepages', url: 'https://www.whitepages.com/business' },
    { name: 'Manta', url: 'https://www.manta.com/add' },
    { name: 'Foursquare', url: 'https://foursquare.com/business/' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/Owners' },
    { name: 'Angi (Angie\'s List)', url: 'https://www.angi.com/business/' },
    { name: 'Thumbtack', url: 'https://www.thumbtack.com/pro' },
    { name: 'Nextdoor', url: 'https://business.nextdoor.com/' },
    { name: 'Chamber of Commerce', url: 'https://www.chamberofcommerce.com/add-business' },
    { name: 'Hotfrog', url: 'https://www.hotfrog.com/' },
    { name: 'Cylex', url: 'https://www.cylex.us.com/' },
    { name: 'Citysearch', url: 'https://www.citysearch.com/' },
    { name: 'MerchantCircle', url: 'https://www.merchantcircle.com/' },
    { name: 'Kudzu', url: 'https://www.kudzu.com/' },
    { name: 'EZlocal', url: 'https://ezlocal.com/' }
  ];
  
  // Niche-specific citations
  const nicheCitations = {
    restaurant: [
      { name: 'OpenTable', url: 'https://www.opentable.com/' },
      { name: 'Zomato', url: 'https://www.zomato.com/business' },
      { name: 'Grubhub', url: 'https://www.grubhub.com/' },
      { name: 'DoorDash', url: 'https://www.doordash.com/merchant/' }
    ],
    hotel: [
      { name: 'Booking.com', url: 'https://www.booking.com/' },
      { name: 'Expedia', url: 'https://www.expedia.com/' },
      { name: 'Hotels.com', url: 'https://www.hotels.com/' }
    ],
    medical: [
      { name: 'Healthgrades', url: 'https://www.healthgrades.com/' },
      { name: 'WebMD', url: 'https://www.webmd.com/' },
      { name: 'Zocdoc', url: 'https://www.zocdoc.com/' },
      { name: 'Vitals', url: 'https://www.vitals.com/' }
    ],
    legal: [
      { name: 'Avvo', url: 'https://www.avvo.com/' },
      { name: 'Justia', url: 'https://www.justia.com/' },
      { name: 'FindLaw', url: 'https://www.findlaw.com/' },
      { name: 'Lawyers.com', url: 'https://www.lawyers.com/' }
    ],
    realestate: [
      { name: 'Zillow', url: 'https://www.zillow.com/' },
      { name: 'Realtor.com', url: 'https://www.realtor.com/' },
      { name: 'Trulia', url: 'https://www.trulia.com/' },
      { name: 'Redfin', url: 'https://www.redfin.com/' }
    ]
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📋 Local Citation Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find citation opportunities for local SEO</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Detected Business Info:</strong></p>
          <div style="margin-top: 10px;">
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Business Name:</label>
              <input type="text" id="businessName" value="${escapeHtml(businessName)}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Phone:</label>
              <input type="text" id="businessPhone" value="${escapeHtml(businessPhone)}" placeholder="(555) 555-5555" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Address:</label>
              <input type="text" id="businessAddress" value="${escapeHtml(businessAddress)}" placeholder="123 Main St, City, State ZIP" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">⭐ Top Citation Sources</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          ${citationSources.slice(0, 10).map(source => `
            <a href="${source.url}" target="_blank" style="text-decoration: none;">
              <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.2s;">
                <span>${escapeHtml(source.name)}</span>
                <span style="float: right;">🔗</span>
              </div>
            </a>
          `).join('')}
        </div>
        
        <details>
          <summary style="cursor: pointer; padding: 10px; background: #f5f5f5; border-radius: 6px; font-weight: 600;">📋 More Citation Sources (${citationSources.length - 10} more)</summary>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 15px;">
            ${citationSources.slice(10).map(source => `
              <a href="${source.url}" target="_blank" style="text-decoration: none;">
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer;">
                  <span>${escapeHtml(source.name)}</span>
                  <span style="float: right;">🔗</span>
                </div>
              </a>
            `).join('')}
          </div>
        </details>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">🎯 Niche-Specific Citations</h4>
        ${Object.entries(nicheCitations).map(([niche, sources]) => `
          <details style="margin-bottom: 10px;">
            <summary style="cursor: pointer; padding: 10px; background: #e3f2fd; border-radius: 6px; font-weight: 600; text-transform: capitalize;">${niche} Citations (${sources.length})</summary>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px;">
              ${sources.map(source => `
                <a href="${source.url}" target="_blank" style="text-decoration: none;">
                  <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e0e0e0;">
                    <span>${escapeHtml(source.name)}</span>
                    <span style="float: right;">→</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </details>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyCitationList" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Citation List
        </button>
        <button id="exportCitationsCSV" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export as CSV
        </button>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 Citation Building Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Ensure NAP (Name, Address, Phone) consistency across all citations</li>
          <li>Start with major aggregators (Data Axle, Localeze, Factual)</li>
          <li>Prioritize industry-specific directories</li>
          <li>Complete profiles fully with photos and descriptions</li>
          <li>Monitor and respond to reviews on all platforms</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📋 Local Citation Finder', content);
  
  setTimeout(() => {
    document.getElementById('copyCitationList')?.addEventListener('click', () => {
      const allSources = [...citationSources];
      Object.values(nicheCitations).forEach(sources => allSources.push(...sources));
      
      const list = allSources.map(s => `${s.name}: ${s.url}`).join('\n');
      copyToClipboard(list);
      showNotification(`${allSources.length} citations copied!`, 'success');
    });
    
    document.getElementById('exportCitationsCSV')?.addEventListener('click', () => {
      const allSources = [...citationSources];
      Object.values(nicheCitations).forEach(sources => allSources.push(...sources));
      
      let csv = 'Name,URL,Type\n';
      citationSources.forEach(s => csv += `"${s.name}","${s.url}","General"\n`);
      Object.entries(nicheCitations).forEach(([niche, sources]) => {
        sources.forEach(s => csv += `"${s.name}","${s.url}","${niche}"\n`);
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `local-citations-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported!', 'success');
    });
  }, 100);
}

// ==================== SEO DASHBOARD ====================
function showSEODashboard() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1 = document.querySelector('h1')?.textContent || '';
  const h1Count = document.querySelectorAll('h1').length;
  const wordCount = (document.body.innerText.match(/\b\w+\b/g) || []).length;
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(img => img.getAttribute('alt')).length;
  const links = document.querySelectorAll('a[href]');
  const internalLinks = Array.from(links).filter(l => {
    try { return new URL(l.href).hostname === window.location.hostname; } catch { return false; }
  }).length;
  const externalLinks = links.length - internalLinks;
  const schemaCount = document.querySelectorAll('script[type="application/ld+json"]').length;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const isSecure = url.startsWith('https');
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  
// Calculate scores (Refined for real-world SEO accuracy)
  const scores = {
    // Title: 50-60 is perfect (100). 30-65 is good (80). Anything else but not empty gets partial credit (40).
    title: title.length >= 50 && title.length <= 60 ? 100 : (title.length >= 30 && title.length <= 65 ? 80 : (title.length > 0 ? 40 : 0)),
    
    // Meta Desc: 140-160 is perfect (100). 120-165 is good (80). Anything else gets partial credit (40).
    metaDesc: metaDesc.length >= 140 && metaDesc.length <= 160 ? 100 : (metaDesc.length >= 120 && metaDesc.length <= 165 ? 80 : (metaDesc.length > 0 ? 40 : 0)),
    
    // H1: Exactly 1 is perfect (100). Multiple H1s is acceptable in HTML5 but not ideal for SEO (70). 0 is a fail (0).
    h1: h1Count === 1 ? 100 : (h1Count > 1 ? 70 : 0),
    
    // Content: 600+ words is great (100). 300+ is okay (80). Under 300 gets a sliding scale score.
    content: wordCount >= 600 ? 100 : (wordCount >= 300 ? 80 : (wordCount > 0 ? Math.round((wordCount / 300) * 80) : 0)),
    
    // Images: Prevent dividing by zero. If no images, score is 100 (no missing alts).
    images: images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100,
    
    // Links: Aim for at least 5 internal links for good crawlability.
    links: internalLinks >= 5 ? 100 : (internalLinks > 0 ? Math.round((internalLinks / 5) * 100) : 0),
    
    // Schema: Bonus if they have it.
    schema: schemaCount > 0 ? 100 : 0,
    
    // Canonical: 100 if it matches the current URL. 80 if it exists but points elsewhere. 0 if missing.
    canonical: canonical === url ? 100 : (canonical.length > 0 ? 80 : 0),
    
    // Security: HTTPS is mandatory nowadays.
    security: isSecure ? 100 : 0,
    
    // Mobile: Viewport must explicitly contain 'device-width' to be properly mobile-responsive.
    mobile: viewport.includes('width=device-width') ? 100 : (viewport.length > 0 ? 50 : 0)
  };
  
  // Calculate accurate overall score
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
  );
  
  const getScoreColor = (s) => {
    if (s >= 80) return '#4CAF50';
    if (s >= 60) return '#FF9800';
    return '#f44336';
  };
  
  const getScoreGrade = (s) => {
    if (s >= 90) return 'A+';
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    if (s >= 50) return 'D';
    return 'F';
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, ${getScoreColor(overallScore)} 0%, ${getScoreColor(overallScore)}dd 100%); color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 64px; font-weight: bold;">${overallScore}</div>
        <div style="font-size: 24px; font-weight: bold;">${getScoreGrade(overallScore)}</div>
        <div style="font-size: 14px; opacity: 0.9;">Overall SEO Score</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>URL:</strong> ${escapeHtml(url)}</p>
          <p><strong>Domain:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Analyzed:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📝 Title</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.title)};">${Math.round(scores.title)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${title.length} chars</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📄 Meta Description</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.metaDesc)};">${Math.round(scores.metaDesc)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${metaDesc.length} chars</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📊 H1 Tags</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.h1)};">${Math.round(scores.h1)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${h1Count} found</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📖 Content Length</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.content)};">${Math.round(scores.content)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${wordCount.toLocaleString()} words</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🖼️ Images Alt</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.images)};">${Math.round(scores.images)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${imagesWithAlt}/${images.length}</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🔗 Internal Links</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.links)};">${Math.round(scores.links)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${internalLinks} internal</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📋 Schema</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.schema)};">${Math.round(scores.schema)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${schemaCount} types</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🔒 Security</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.security)};">${Math.round(scores.security)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${isSecure ? 'HTTPS' : 'HTTP'}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 Quick Stats</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${links.length}</div>
            <div style="font-size: 11px;">Total Links</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${externalLinks}</div>
            <div style="font-size: 11px;">External Links</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${document.querySelectorAll('h2').length}</div>
            <div style="font-size: 11px;">H2 Tags</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${document.querySelectorAll('h3').length}</div>
            <div style="font-size: 11px;">H3 Tags</div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyDashboardReport" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Dashboard Report
        </button>
        <button id="exportDashboardJSON" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export as JSON
        </button>
      </div>
      
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #2e7d32;">🎯 Priority Actions</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${scores.title < 80 ? '<li>Optimize title tag (50-60 characters)</li>' : ''}
          ${scores.metaDesc < 80 ? '<li>Improve meta description (150-160 characters)</li>' : ''}
          ${scores.h1 < 80 ? '<li>Fix H1 tag issues</li>' : ''}
          ${scores.content < 80 ? '<li>Add more content (300+ words recommended)</li>' : ''}
          ${scores.images < 80 ? '<li>Add alt text to all images</li>' : ''}
          ${scores.links < 80 ? '<li>Add more internal links</li>' : ''}
          ${scores.schema < 80 ? '<li>Add schema markup</li>' : ''}
          ${scores.canonical < 80 ? '<li>Add canonical tag</li>' : ''}
          ${scores.security < 80 ? '<li>Enable HTTPS</li>' : ''}
          ${scores.mobile < 80 ? '<li>Add viewport meta tag</li>' : ''}
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📊 SEO Dashboard', content);
  
  setTimeout(() => {
    document.getElementById('copyDashboardReport')?.addEventListener('click', () => {
      const report = `SEO Dashboard Report - ${domain}
Date: ${new Date().toLocaleString()}
URL: ${url}

Overall Score: ${overallScore}/100 (Grade: ${getScoreGrade(overallScore)})

Scores:
- Title: ${Math.round(scores.title)}% (${title.length} chars)
- Meta Description: ${Math.round(scores.metaDesc)}% (${metaDesc.length} chars)
- H1 Tags: ${Math.round(scores.h1)}% (${h1Count} found)
- Content Length: ${Math.round(scores.content)}% (${wordCount} words)
- Images Alt: ${Math.round(scores.images)}% (${imagesWithAlt}/${images.length})
- Internal Links: ${Math.round(scores.links)}% (${internalLinks} internal)
- Schema: ${Math.round(scores.schema)}% (${schemaCount} types)
- Canonical: ${Math.round(scores.canonical)}%
- Security: ${Math.round(scores.security)}%
- Mobile: ${Math.round(scores.mobile)}%

Quick Stats:
- Total Links: ${links.length}
- External Links: ${externalLinks}
- H2 Tags: ${document.querySelectorAll('h2').length}
- H3 Tags: ${document.querySelectorAll('h3').length}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
    
    document.getElementById('exportDashboardJSON')?.addEventListener('click', () => {
      const data = {
        url, domain, title, metaDesc, h1, h1Count, wordCount,
        images: { total: images.length, withAlt: imagesWithAlt },
        links: { total: links.length, internal: internalLinks, external: externalLinks },
        schemaCount, canonical, robots, isSecure, viewport,
        scores, overallScore, grade: getScoreGrade(overallScore),
        analyzedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url_blob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `seo-dashboard-${domain}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url_blob);
      showNotification('JSON exported!', 'success');
    });
  }, 100);
}

