document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('newsletterPopupOverlay');
  if (!overlay) return;

  const titleEl = document.getElementById('newsletterPopupTitle');
  const descEl = document.getElementById('newsletterPopupDescription');
  const form = document.getElementById('newsletterPopupForm');
  const submitButton = document.getElementById('newsletterSubmit');
  const linkWrap = document.getElementById('newsletterPopupLinkWrap');
  const linkEl = document.getElementById('newsletterPopupLink');
  const privacyEl = document.getElementById('newsletterPopupPrivacy');
  const hiddenFields = document.getElementById('newsletterHiddenFields');
  const closeButton = document.getElementById('newsletterPopupClose');

  function hidePopup() {
    overlay.hidden = true;
    document.body.classList.remove('newsletter-popup-open');
  }

  function showPopup() {
    overlay.hidden = false;
    document.body.classList.add('newsletter-popup-open');
  }

  closeButton.addEventListener('click', hidePopup);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      hidePopup();
    }
  });

  fetch('/newsletter-popup.json?v=' + Date.now())
    .then(function (response) {
      if (!response.ok) throw new Error('Newsletter popup config missing');
      return response.json();
    })
    .then(function (config) {
      console.log('newsletter-popup: config loaded', config);
      // Allow forcing the popup for testing via ?popup=1
      const urlParams = new URLSearchParams(window.location.search);
      const forceShow = urlParams.get('popup') === '1';

      if (!config.enabled) return;

      titleEl.textContent = config.headline || 'Sign up for our newsletter';
      descEl.textContent = config.message || 'Join our mailing list for trusted insights and exclusive updates.';
      submitButton.querySelector('.button-text').textContent = config.button_text || 'Sign up';
      privacyEl.textContent = config.privacy_note || '';

      if (config.link_text && config.link_url) {
        linkEl.textContent = config.link_text;
        linkEl.href = config.link_url;
        linkWrap.style.display = 'block';
      } else {
        linkWrap.style.display = 'none';
      }

      hiddenFields.innerHTML = config.hidden_fields_html || '';
      if (config.thank_you_url) {
        const nextInput = document.createElement('input');
        nextInput.type = 'hidden';
        nextInput.name = '_next';
        nextInput.value = config.thank_you_url;
        hiddenFields.appendChild(nextInput);
      }
      if (config.form_action) {
        form.action = config.form_action;
        submitButton.disabled = false;
        submitButton.removeAttribute('title');
      } else {
        form.action = '';
        submitButton.disabled = true;
        submitButton.title = 'Enter your Mailchimp form action URL in Decap to enable submissions';
      }

      if (config.mcjs_src) {
        const script = document.createElement('script');
        script.src = config.mcjs_src;
        script.id = 'mcjs';
        script.async = true;
        script.onload = function () { console.log('newsletter-popup: mcjs loaded'); };
        script.onerror = function () { console.warn('newsletter-popup: mcjs failed to load'); };
        document.head.appendChild(script);
      }

      // Always show the popup when forced for testing, otherwise show if enabled
      if (forceShow) {
        console.log('newsletter-popup: forceShow enabled via URL param');
        showPopup();
      } else {
        showPopup();
      }
    })
    .catch(function () {
      console.warn('Newsletter popup configuration file not available.');
      // If the dev wants to force the popup during debugging, support ?popup=1
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('popup') === '1') {
        const overlay = document.getElementById('newsletterPopupOverlay');
        if (overlay) { overlay.hidden = false; document.body.classList.add('newsletter-popup-open'); }
      }
    });
});
