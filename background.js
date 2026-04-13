// GDI SEO Tools Pro - Background Service Worker

chrome.runtime.onInstalled.addListener((details) => {
  console.log('🚀 SEO Tools Pro - Created by SearchWorks.ph');
  console.log('🔗 https://searchworks.ph');
  console.log('📧 Support: jonathn.p.harris@gmail.com');
  
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      userName: 'Jonathan Harris',
      userEmail: 'jonathn.p.harris@gmail.com',
      userPhone: '9928524796',
      userLinkedin: 'https://linkedin.com/in/jonathan-harris',
      defaultCurrency: 'USD',
      defaultAmount: '50',
      darkMode: false,
      favorites: [],
      customTemplates: {}
    });
    
    // Show welcome message with credits
    chrome.tabs.create({
      url: 'https://searchworks.ph',
      active: false
    });
  } else if (details.reason === 'update') {
    console.log('Updated from version', details.previousVersion);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-extension') {
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }
  
  // ADD THIS NEW BLOCK: Listens for screenshot requests from content.js
  if (request.action === 'captureVisibleTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true; // Keep the message channel open for the asynchronous response
  }
  
  return true;
});

// UPGRADE: Use Alarms instead of setInterval for Manifest V3 reliability
try {
  chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
      console.log('🔧 SEO Tools Pro - Service Worker Active');
    }
  });
} catch (e) {
  console.log('Alarms API may not be available in this context');
}