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
      
      default:
        sendResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ success: false, message: error.message });
  }
  
  return true;
});


