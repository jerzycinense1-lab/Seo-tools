/**
 * SEO Tools Pro - Content Script Router v4.0 (Complete)
 * Routes all 55+ tool actions to their respective functions.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, settings = {}, templates = {} } = request;
  
  const SEOTools = window.SEOTools;
  
  if (!SEOTools) {
    sendResponse({ success: false, error: 'SEO Tools not loaded' });
    return true;
  }
  
  try {
    switch (action) {
      // Quick Utilities
      case 'copy-url': SEOTools.toolCopyUrl(); sendResponse({ success: true, message: 'URL copied!' }); break;
      case 'copy-domain': SEOTools.toolCopyDomain(); sendResponse({ success: true, message: 'Domain copied!' }); break;
      case 'scroll': SEOTools.toolScrollToBottom(); sendResponse({ success: true, message: 'Scrolled!' }); break;
      case 'nextpage': SEOTools.toolNextPage(); sendResponse({ success: true, message: 'Navigating...' }); break;
      case 'full-page-capture': SEOTools.toolFullPageCapture(); sendResponse({ success: true, message: 'Capturing...' }); break;
      
      // Generators
      case 'urlslug': case 'slug': SEOTools.toolUrlSlugGenerator(); sendResponse({ success: true, message: 'URL Slug opened!' }); break;
      case 'whatsapp-link': SEOTools.toolWhatsappLinkGenerator(); sendResponse({ success: true, message: 'WhatsApp link opened!' }); break;
      
      // Extractors
      case 'email-extract': SEOTools.toolEmailExtractor(); sendResponse({ success: true, message: 'Emails extracted!' }); break;
      case 'social-extract': SEOTools.toolExtractSocial(); sendResponse({ success: true, message: 'Social links found!' }); break;
      case 'linkextract': SEOTools.toolExtractLinks(); sendResponse({ success: true, message: 'Links extracted!' }); break;
      case 'domainextract': SEOTools.toolExtractDomains(); sendResponse({ success: true, message: 'Domains extracted!' }); break;
      case 'googledomain': case 'bulk-google-domains': SEOTools.toolExtractBulkGoogleDomains(); sendResponse({ success: true, message: 'Deep extraction started!' }); break;
      
      // Finders
      case 'blogs': SEOTools.toolFindBlog(); sendResponse({ success: true, message: 'Searching blog...' }); break;
      case 'guestpost': SEOTools.toolFindGuestPost(); sendResponse({ success: true, message: 'Searching guest post...' }); break;
      
      // SEO Analysis
      case 'highlight-dofollow': SEOTools.toolHighlightDoFollow(); sendResponse({ success: true, message: 'Highlighted!' }); break;
      case 'remove-highlights': SEOTools.toolRemoveHighlights(); sendResponse({ success: true, message: 'Removed!' }); break;
      case 'analyze-headings': SEOTools.toolAnalyzeHeadings(); sendResponse({ success: true, message: 'Headings analyzed!' }); break;
      case 'analyze-meta': SEOTools.toolAnalyzeMeta(); sendResponse({ success: true, message: 'Meta analyzed!' }); break;
      case 'analyze-images': SEOTools.toolAnalyzeImages(); sendResponse({ success: true, message: 'Images analyzed!' }); break;
      case 'analyze-content': case 'keyword-density': SEOTools.toolAnalyzeKeywordDensity(); sendResponse({ success: true, message: 'Density analyzed!' }); break;
      case 'serp-preview': SEOTools.toolShowSerpPreview(); sendResponse({ success: true, message: 'SERP preview opened!' }); break;
      case 'broken-links': case 'analyze-links': SEOTools.toolCheckBrokenLinks(); sendResponse({ success: true, message: 'Checking links...' }); break;
      case 'pagespeed': SEOTools.toolCheckPageSpeed(); sendResponse({ success: true, message: 'Opening PageSpeed...' }); break;
      case 'robots-txt': SEOTools.toolCheckRobotsTxt(); sendResponse({ success: true, message: 'Opening robots.txt...' }); break;
      case 'sitemap': SEOTools.toolCheckSitemap(); sendResponse({ success: true, message: 'Checking sitemap...' }); break;
      case 'metrics': SEOTools.toolShowMetrics(); sendResponse({ success: true, message: 'Metrics opened!' }); break;
      
      // Email Templates
      case 'advance-payment': SEOTools.toolPaymentForm('advance', settings); sendResponse({ success: true, message: 'Advance payment form opened!' }); break;
      case 'payment-paypal': SEOTools.toolPaymentForm('paypal', settings); sendResponse({ success: true, message: 'PayPal form opened!' }); break;
      case 'payment-gcash': SEOTools.toolPaymentForm('gcash', settings); sendResponse({ success: true, message: 'GCash form opened!' }); break;
      case 'send-article': SEOTools.toolArticleForm('full', settings); sendResponse({ success: true, message: 'Article form opened!' }); break;
      case 'send-quick-article': SEOTools.toolArticleForm('quick', settings); sendResponse({ success: true, message: 'Quick article form opened!' }); break;
      case 'article-followup': SEOTools.toolFollowupForm(1, settings); sendResponse({ success: true, message: 'Follow-up opened!' }); break;
      case 'second-followup': SEOTools.toolFollowupForm(2, settings); sendResponse({ success: true, message: '2nd follow-up opened!' }); break;
      case 'final-notice': SEOTools.toolFollowupForm('final', settings); sendResponse({ success: true, message: 'Final notice opened!' }); break;
      case 'cancel': SEOTools.toolCancelForm(settings); sendResponse({ success: true, message: 'Cancel form opened!' }); break;
      case 'declined': SEOTools.toolDeclinedResponse(); sendResponse({ success: true, message: 'Declined template copied!' }); break;
      case 'send-invoice': SEOTools.toolInvoiceForm(settings); sendResponse({ success: true, message: 'Invoice form opened!' }); break;
      case 'email-outreach': case 'nego': SEOTools.toolOutreachTemplates(); sendResponse({ success: true, message: 'Templates loaded!' }); break;
      case 'contact-form': SEOTools.toolFillContactForm(settings); sendResponse({ success: true, message: 'Form filler opened!' }); break;
      
      // Search & Discovery
      case 'searchoperators': SEOTools.toolSearchOperators(); sendResponse({ success: true, message: 'Search operators opened!' }); break;
      case 'bulk-url': SEOTools.toolBulkUrlOpener(); sendResponse({ success: true, message: 'Bulk URL opened!' }); break;
      
      // NEW TOOLS (Batch 8)
      case 'currency-copier': SEOTools.toolCurrencyCopier(); sendResponse({ success: true, message: 'Currency copier opened!' }); break;
      case 'url-optimizer': SEOTools.toolOptimizeUrl(); sendResponse({ success: true, message: 'URL optimized!' }); break;
      case 'title-generator': SEOTools.toolGenerateTitles(); sendResponse({ success: true, message: 'Titles generated!' }); break;
      case 'pubdate-checker': SEOTools.toolCheckPublicationDate(); sendResponse({ success: true, message: 'Date checked!' }); break;
      case 'mobile-usability': SEOTools.toolTestMobileUsability(); sendResponse({ success: true, message: 'Mobile test complete!' }); break;
      case 'ai-meta-generator': SEOTools.toolGenerateAIMeta(); sendResponse({ success: true, message: 'AI meta generated!' }); break;
      case 'alt-generator': SEOTools.toolGenerateAltText(); sendResponse({ success: true, message: 'Alt text generated!' }); break;
      case 'ai-topic-generator': SEOTools.toolGenerateAITopics(); sendResponse({ success: true, message: 'AI topics generated!' }); break;
      case 'link-prospects': SEOTools.toolFindLinkProspects(); sendResponse({ success: true, message: 'Prospects found!' }); break;
      case 'resource-pages': SEOTools.toolFindResourcePages(); sendResponse({ success: true, message: 'Resource pages found!' }); break;
      case 'local-keyword-finder': SEOTools.toolFindLocalKeywords(); sendResponse({ success: true, message: 'Local keywords found!' }); break;
      case 'hreflang-generator': SEOTools.toolGenerateHreflang(); sendResponse({ success: true, message: 'Hreflang generated!' }); break;
      case 'duplicate-content': SEOTools.toolFindDuplicateContent(); sendResponse({ success: true, message: 'Duplicate check complete!' }); break;
      case 'content-analyzer': SEOTools.toolContentAnalyzer(); sendResponse({ success: true, message: 'Content analyzed!' }); break;
      case 'seo-audit-checklist': SEOTools.toolSEOAuditChecklist(); sendResponse({ success: true, message: 'Audit complete!' }); break;
      case 'audit-checklist': SEOTools.toolAuditChecklist(); sendResponse({ success: true, message: 'Checklist opened!' }); break;
      case 'seo-dashboard': SEOTools.toolSEODashboard(); sendResponse({ success: true, message: 'Dashboard opened!' }); break;
      case 'citation-finder': SEOTools.toolFindLocalCitations(); sendResponse({ success: true, message: 'Citations found!' }); break;
      
      // Legacy support for original tool names (if original seo-tools.js is also loaded)
      case 'structured-data': SEOTools.toolShowMetrics ? SEOTools.toolShowMetrics() : null; sendResponse({ success: true, message: 'Opened!' }); break;
      case 'export-seo-data': SEOTools.toolSEODashboard ? SEOTools.toolSEODashboard() : null; sendResponse({ success: true, message: 'Dashboard opened!' }); break;
    // ==================== EXTERNAL LINK WIRING ====================
      case 'advsearch':
        chrome.runtime.sendMessage({ action: 'openUrl', url: 'https://www.google.com/advanced_search' });
        sendResponse({ success: true, message: 'Opening Advanced Search...' });
        break;  
       
        // ==================== DESIGN TOOLS WIRING ====================
      case 'extract-fonts': 
        SEOTools.toolExtractTypography(); 
        sendResponse({ success: true, message: 'Typography extracted!' }); 
        break;
          case 'extract-colors': 
        SEOTools.toolExtractColorTheme(); 
        sendResponse({ success: true, message: 'Color theme extracted!' }); 
        break;
      
      // ==================== ADVANCED TOOLS WIRING ====================
      case 'advanced-text-compare':
        SEOTools.advancedSEOCompare();
        sendResponse({ success: true, message: 'Advanced Text Compare opened!' });
        break;
        
      case 'image-toolkit':
        SEOTools.advancedImageToolkit();
        sendResponse({ success: true, message: 'Image Toolkit opened!' });
        break;
        
      case 'maps-scraper':
        SEOTools.scrapeGoogleMaps();
        sendResponse({ success: true, message: 'Google Maps Scraper opened!' });
        break;
        
      case 'keyword-rank-tracker':
        SEOTools.keywordRankTracker();
        sendResponse({ success: true, message: 'Keyword Rank Tracker opened!' });
        break;
        case 'site-structure':
        SEOTools.visualizeSiteStructure();
        sendResponse({ success: true, message: 'Site Structure Visualizer opened!' });
        break;
        case 'social-preview': 
        SEOTools.toolSocialCardPreview(); 
        sendResponse({ success: true, message: 'Social preview generated!' }); 
        break;
      case 'image-downloader': 
        SEOTools.toolImageDownloader(); 
        sendResponse({ success: true, message: 'Image downloader opened!' }); 
        break;
      case 'clear-site-data': 
        SEOTools.toolClearSiteData(); 
        sendResponse({ success: true, message: 'Clearing site data...' }); 
        break;
        case 'multi-device': 
        SEOTools.toolMultiDeviceTester(); 
        sendResponse({ success: true, message: 'Opening device emulators...' }); 
        break;
        case 'generate-topics': 
        SEOTools.toolGenerateAITopics(); 
        sendResponse({ success: true, message: 'Opening AI Topic Generator...' }); 
        break;
      default:
        console.warn('Unknown action:', action);
        sendResponse({ success: false, message: 'Unknown action: ' + action });
    }
  } catch (error) {
    console.error('Tool error:', error);
    sendResponse({ success: false, message: error.message });
  }
  
  return true;
});

console.log('🚀 SEO Tools Pro v4.0 - Content Script Ready');
console.log('📦 Tools loaded:', Object.keys(window.SEOTools || {}).length);