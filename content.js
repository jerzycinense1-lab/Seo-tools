/**
 * SEO Tools Pro - Content Script Router v4.0 (Complete)
 * Routes all 55+ tool actions to their respective functions.
 */

(function() {
  'use strict';

  // Wait for dependencies to be ready
  const MAX_WAIT_TIME = 10000; // 10 seconds
  const CHECK_INTERVAL = 100;
  let waitTime = 0;

  function waitForDependencies(callback) {
    const check = () => {
      waitTime += CHECK_INTERVAL;
      
      if (window.SEOTools && Object.keys(window.SEOTools).length > 10) {
        callback();
        return;
      }
      
      if (waitTime >= MAX_WAIT_TIME) {
        console.error('SEO Tools Pro: Dependencies failed to load in time');
        // Try one more time - maybe seo-tools.js is still parsing
        if (typeof window.SEOTools !== 'undefined') {
          callback();
        }
        return;
      }
      
      setTimeout(check, CHECK_INTERVAL);
    };
    
    check();
  }

  function initializeRouter() {
    // Apply saved theme if available
    try {
      chrome.storage.sync.get({ 
        themePrimary: '#2563EB', 
        themeAccent: '#F59E0B', 
        darkMode: false 
      }, (settings) => {
        if (window.GDI && window.GDI.ThemeEngine) {
          if (settings.themePrimary) {
            window.GDI.ThemeEngine.applyCustomColors(settings.themePrimary, settings.themeAccent);
          }
          if (settings.darkMode !== undefined) {
            window.GDI.ThemeEngine.set(settings.darkMode ? 'dark' : 'light', false);
          }
        }
      });
    } catch (e) {
      // Storage API may not be available in all contexts
    }

    const SEOTools = window.SEOTools;
    if (!SEOTools) {
      console.error('SEO Tools Pro: Tools not initialized');
      return;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { action, settings = {}, templates = {}, contextInfo = {} } = request;
      
      // Theme application
      try {
        if (window.GDI && window.GDI.ThemeEngine) {
          if (settings.themePrimary) {
            window.GDI.ThemeEngine.applyCustomColors(settings.themePrimary, settings.themeAccent);
          }
          if (settings.darkMode !== undefined) {
            window.GDI.ThemeEngine.set(settings.darkMode ? 'dark' : 'light', false);
          }
        }
      } catch (e) {}
      
      // Check if advanced tools are needed
      const advancedTools = [
        'advanced-text-compare', 'image-toolkit', 'maps-scraper', 
        'site-structure', 'keyword-rank-tracker', 'image-ocr'
      ];
      
      if (advancedTools.includes(action) && !SEOTools.advancedImageToolkit) {
        sendResponse({ success: false, requireAdvanced: true });
        return true;
      }
      
      try {
        if (action.startsWith('custom-')) {
          if (SEOTools.toolCustomTemplate) {
            SEOTools.toolCustomTemplate(action, settings, templates);
            sendResponse({ success: true, message: 'Custom template opened!' });
          } else {
            sendResponse({ success: false, message: 'Custom template tool not ready. Please refresh the page.' });
          }
          return true;
        }

        // Tool routing map
        const toolMap = {
          // Direct URL Tools (for Context Menu support)
          'wayback': () => { window.open(`https://web.archive.org/web/*/${window.location.href}`, '_blank'); return 'Opening Wayback Machine...'; },
          'whois': () => { window.open(`https://www.whois.com/whois/${window.location.hostname.replace(/^www\./, '')}`, '_blank'); return 'Opening WHOIS...'; },
          'pingdom': () => { window.open(`https://tools.pingdom.com/?url=${encodeURIComponent(window.location.href)}`, '_blank'); return 'Opening Pingdom...'; },
          'schema': () => { window.open(`https://validator.schema.org/#url=${encodeURIComponent(window.location.href)}`, '_blank'); return 'Opening Schema Validator...'; },
          'richresults': () => { window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`, '_blank'); return 'Opening Rich Results...'; },
          'amp': () => { window.open(`https://search.google.com/test/amp?url=${encodeURIComponent(window.location.href)}`, '_blank'); return 'Opening AMP Test...'; },
          'authority': () => { window.open(`https://www.semrush.com/free-tools/website-authority-checker/?url=${encodeURIComponent(window.location.hostname.replace(/^www\./, ''))}`, '_blank'); return 'Opening...'; },
          'spamscore': () => { window.open(`https://websiteseochecker.com/spam-score-checker/?url=${encodeURIComponent(window.location.hostname.replace(/^www\./, ''))}`, '_blank'); return 'Opening...'; },
          'domainrating': () => { window.open(`https://ahrefs.com/website-authority-checker/?input=${encodeURIComponent(window.location.hostname.replace(/^www\./, ''))}`, '_blank'); return 'Opening...'; },
          'traffic': () => { window.open(`https://ahrefs.com/traffic-checker/?input=${encodeURIComponent(window.location.hostname.replace(/^www\./, ''))}&mode=subdomains`, '_blank'); return 'Opening...'; },
          // Quick Utilities
          'copy-url': () => { SEOTools.toolCopyUrl(); return 'URL copied!'; },
          'copy-domain': () => { SEOTools.toolCopyDomain(); return 'Domain copied!'; },
          'scroll': () => { SEOTools.toolScrollToBottom(); return 'Scrolled!'; },
          'nextpage': () => { SEOTools.toolNextPage(); return 'Navigating...'; },
          'full-page-capture': () => { SEOTools.toolFullPageCapture(); return 'Capturing...'; },
          
          // Generators
          'urlslug': () => { SEOTools.toolUrlSlugGenerator(); return 'URL Slug opened!'; },
          'slug': () => { SEOTools.toolUrlSlugGenerator(); return 'URL Slug opened!'; },
          'whatsapp-link': () => { SEOTools.toolWhatsappLinkGenerator(); return 'WhatsApp link opened!'; },
          
          // Extractors
          'email-extract': () => { SEOTools.toolEmailExtractor(); return 'Emails extracted!'; },
          'social-extract': () => { SEOTools.toolExtractSocial(); return 'Social links found!'; },
          'linkextract': () => { SEOTools.toolExtractLinks(); return 'Links extracted!'; },
          'domainextract': () => { SEOTools.toolExtractDomains(); return 'Domains extracted!'; },
          'googledomain': () => { SEOTools.toolExtractBulkGoogleDomains(); return 'Deep extraction started!'; },
          'bulk-google-domains': () => { SEOTools.toolExtractBulkGoogleDomains(); return 'Deep extraction started!'; },
          
          // Finders
          'blogs': () => { SEOTools.toolFindBlog(); return 'Searching blog...'; },
          'guestpost': () => { SEOTools.toolFindGuestPost(); return 'Searching guest post...'; },
          
          // SEO Analysis
          'highlight-dofollow': () => { SEOTools.toolHighlightDoFollow(); return 'Highlighted!'; },
          'remove-highlights': () => { SEOTools.toolRemoveHighlights(); return 'Removed!'; },
          'analyze-headings': () => { SEOTools.toolAnalyzeHeadings(); return 'Headings analyzed!'; },
          'analyze-meta': () => { SEOTools.toolAnalyzeMeta(); return 'Meta analyzed!'; },
          'analyze-images': () => { SEOTools.toolAnalyzeImages(); return 'Images analyzed!'; },
          'analyze-content': () => { SEOTools.toolContentAnalyzer(); return 'Content analyzed!'; },
          'keyword-density': () => { SEOTools.toolAnalyzeKeywordDensity(); return 'Density analyzed!'; },
          'serp-preview': () => { SEOTools.toolShowSerpPreview(); return 'SERP preview opened!'; },
          'broken-links': () => { SEOTools.toolCheckBrokenLinks(); return 'Checking links...'; },
          'analyze-links': () => { SEOTools.toolAnalyzeLinks(); return 'Links analyzed!'; },
          'pagespeed': () => { SEOTools.toolCheckPageSpeed(); return 'Opening PageSpeed...'; },
          'robots-txt': () => { SEOTools.toolCheckRobotsTxt(); return 'Opening robots.txt...'; },
          'sitemap': () => { SEOTools.toolCheckSitemap(); return 'Checking sitemap...'; },
          'metrics': () => { SEOTools.toolShowMetrics(); return 'Metrics opened!'; },
          
          // Email Templates
          'advance-payment': () => { SEOTools.toolPaymentForm('advance', settings); return 'Advance payment form opened!'; },
          'payment-paypal': () => { SEOTools.toolPaymentForm('paypal', settings); return 'PayPal form opened!'; },
          'payment-gcash': () => { SEOTools.toolPaymentForm('gcash', settings); return 'GCash form opened!'; },
          'send-article': () => { SEOTools.toolArticleForm('full', settings); return 'Article form opened!'; },
          'send-quick-article': () => { SEOTools.toolArticleForm('quick', settings); return 'Quick article form opened!'; },
          'article-followup': () => { SEOTools.toolFollowupForm(1, settings); return 'Follow-up opened!'; },
          'second-followup': () => { SEOTools.toolFollowupForm(2, settings); return '2nd follow-up opened!'; },
          'final-notice': () => { SEOTools.toolFollowupForm('final', settings); return 'Final notice opened!'; },
          'cancel': () => { SEOTools.toolCancelForm(settings); return 'Cancel form opened!'; },
          'declined': () => { SEOTools.toolDeclinedResponse(); return 'Declined template copied!'; },
          'send-invoice': () => { SEOTools.toolInvoiceForm(settings); return 'Invoice form opened!'; },
          'email-outreach': () => { SEOTools.toolOutreachTemplates(); return 'Templates loaded!'; },
          'nego': () => { SEOTools.toolOutreachTemplates(); return 'Templates loaded!'; },
          'contact-form': () => { SEOTools.toolFillContactForm(settings); return 'Form filler opened!'; },
          
          // Search & Discovery
          'searchoperators': () => { SEOTools.toolSearchOperators(); return 'Search operators opened!'; },
          'bulk-url': () => { SEOTools.toolBulkUrlOpener(); return 'Bulk URL opened!'; },
          
          // Design Tools
          'extract-fonts': () => { SEOTools.toolExtractTypography(); return 'Typography extracted!'; },
          'extract-colors': () => { SEOTools.toolExtractColorTheme(); return 'Color theme extracted!'; },
          
          // Advanced Tools
          'advanced-text-compare': () => { SEOTools.advancedSEOCompare(contextInfo); return 'Advanced Text Compare opened!'; },
          'bulk-currency': () => { SEOTools.toolBulkCurrencyConverter(); return 'Currency converter opened!'; },
          'image-toolkit': () => { SEOTools.advancedImageToolkit(); return 'Image Toolkit opened!'; },
          'maps-scraper': () => { SEOTools.scrapeGoogleMaps(); return 'Google Maps Scraper opened!'; },
          'keyword-rank-tracker': () => { SEOTools.keywordRankTracker(); return 'Keyword Rank Tracker opened!'; },
          'site-structure': () => { SEOTools.visualizeSiteStructure(); return 'Site Structure Visualizer opened!'; },
          'social-preview': () => { SEOTools.toolSocialCardPreview(); return 'Social preview generated!'; },
          'image-downloader': () => { SEOTools.toolImageDownloader(); return 'Image downloader opened!'; },
          'clear-site-data': () => { SEOTools.toolClearSiteData(); return 'Clearing site data...'; },
          'multi-device': () => { SEOTools.toolMultiDeviceTester(); return 'Opening device emulators...'; },
          'generate-topics': () => { SEOTools.toolGenerateAITopics(); return 'Opening AI Topic Generator...'; },
          'image-ocr': () => { SEOTools.toolImageOCR(contextInfo); return 'OCR Tool opened!'; },
          
          // AI Tools
          'ai-meta-generator': () => { SEOTools.toolGenerateAIMeta(); return 'AI meta generated!'; },
          'alt-generator': () => { SEOTools.toolGenerateAltText(); return 'Alt text generated!'; },
          'ai-topic-generator': () => { SEOTools.toolGenerateAITopics(); return 'AI topics generated!'; },
          'title-generator': () => { SEOTools.toolGenerateTitles(); return 'Titles generated!'; },
          
          // More SEO Tools
          'currency-copier': () => { SEOTools.toolCurrencyCopier(); return 'Currency copier opened!'; },
          'url-optimizer': () => { SEOTools.toolOptimizeUrl(); return 'URL optimized!'; },
          'pubdate-checker': () => { SEOTools.toolCheckPublicationDate(); return 'Date checked!'; },
          'mobile-usability': () => { SEOTools.toolTestMobileUsability(); return 'Mobile test complete!'; },
          'link-prospects': () => { SEOTools.toolFindLinkProspects(); return 'Prospects found!'; },
          'resource-pages': () => { SEOTools.toolFindResourcePages(); return 'Resource pages found!'; },
          'local-keyword-finder': () => { SEOTools.toolFindLocalKeywords(); return 'Local keywords found!'; },
          'hreflang-generator': () => { SEOTools.toolGenerateHreflang(); return 'Hreflang generated!'; },
          'duplicate-content': () => { SEOTools.toolFindDuplicateContent(); return 'Duplicate check complete!'; },
          'content-analyzer': () => { SEOTools.toolContentAnalyzer(); return 'Content analyzed!'; },
          'seo-audit-checklist': () => { SEOTools.toolSEOAuditChecklist(); return 'Audit complete!'; },
          'audit-checklist': () => { SEOTools.toolAuditChecklist(); return 'Checklist opened!'; },
          'seo-dashboard': () => { SEOTools.toolSEODashboard(); return 'Dashboard opened!'; },
          'citation-finder': () => { SEOTools.toolFindLocalCitations(); return 'Citations found!'; },
          
          // Legacy support
          'structured-data': () => { SEOTools.toolShowMetrics ? SEOTools.toolShowMetrics() : null; return 'Opened!'; },
          'export-seo-data': () => { SEOTools.toolSEODashboard ? SEOTools.toolSEODashboard() : null; return 'Dashboard opened!'; },
          'advsearch': () => {
            try { chrome.runtime.sendMessage({ action: 'openUrl', url: 'https://www.google.com/advanced_search' }); } catch(e) {}
            return 'Opening Advanced Search...';
          },
        };

        const toolAction = toolMap[action];
        if (toolAction) {
          const msg = toolAction();
          sendResponse({ success: true, message: msg });
        } else {
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
    console.log('🛠️ Tools loaded:', Object.keys(SEOTools || {}).length);
  }

  // Start initialization
  waitForDependencies(initializeRouter);

})();