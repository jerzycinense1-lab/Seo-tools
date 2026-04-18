// Enhanced Universal Copy Function with better error handling
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (!text || typeof text !== 'string') {
      reject(new Error('Invalid text to copy'));
      return;
    }
    
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve())
        .catch(() => {
          // Fallback to execCommand
          copyWithExecCommand(text)
            .then(() => resolve())
            .catch(() => reject());
        });
    } else {
      // Use execCommand directly
      copyWithExecCommand(text)
        .then(() => resolve())
        .catch(() => reject());
    }
  });
}
// Enhanced execCommand Fallback with better cleanup
function copyWithExecCommand(text) {
  return new Promise((resolve, reject) => {
    let textarea = null;
    try {
      textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('execCommand copy failed'));
      }
    } catch (err) {
      if (textarea && textarea.parentNode) {
        document.body.removeChild(textarea);
      }
      reject(err);
    }
  });
}

// Enhanced Notification System
function showNotification(message, type) {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.opacity = '1', 10);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Enhanced Modal Creation
function createModal(title, content) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 99998;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  const form = document.createElement('div');
  form.style.cssText = `
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  titleEl.style.cssText = 'margin-bottom: 20px; text-align: center; color: #667eea; font-size: 18px; font-weight: 600;';
  form.appendChild(titleEl);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: #f0f0f0;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    color: #666;
    transition: background 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = '#e0e0e0';
  closeBtn.onmouseout = () => closeBtn.style.background = '#f0f0f0';
  closeBtn.onclick = () => {
    container.style.opacity = '0';
    setTimeout(() => {
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    }, 300);
  };
  form.appendChild(closeBtn);
  
  form.appendChild(content);
  container.appendChild(form);
  document.body.appendChild(container);
  
  setTimeout(() => container.style.opacity = '1', 10);
  
  return { container, form, close: () => closeBtn.click() };
}

// Enhanced Input Field Creation
function createInputField(label, id, placeholder, required, type, defaultValue) {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '12px';
  
  const labelEl = document.createElement('label');
  labelEl.textContent = label + (required ? ' *' : '');
  labelEl.style.cssText = `
    display: block;
    font-weight: ${required ? '600' : '400'};
    margin-bottom: 5px;
    color: #333;
    font-size: 13px;
  `;
  wrapper.appendChild(labelEl);
  
  const input = document.createElement('input');
  input.type = type || 'text';
  input.id = id;
  input.placeholder = placeholder || '';
  input.value = defaultValue || '';
  input.style.cssText = `
    width: 100%;
    padding: 10px 12px;
    border: ${required ? '2px solid #ccc' : '1px solid #ddd'};
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 13px;
    transition: border-color 0.2s;
  `;
  input.onfocus = () => {
    input.style.borderColor = '#667eea';
    input.style.outline = 'none';
  };
  input.onblur = () => {
    input.style.borderColor = required ? '#ccc' : '#ddd';
  };
  wrapper.appendChild(input);
  
  return { wrapper, input };
}
// Enhanced Button Creation
function createButton(text, onClick, color) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = `
    margin-top: 15px;
    padding: 12px 20px;
    background: ${color || '#4CAF50'};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  btn.onmouseover = () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  };
  btn.onmouseout = () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = 'none';
  };
  btn.onclick = onClick;
  return btn;
}
// Helper function (if not already defined)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}