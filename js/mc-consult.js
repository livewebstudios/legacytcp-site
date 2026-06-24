/* ============================================================
   Mailchimp consultation form — submit in-place (no page leave)
   Live Web Studios | Vanilla JS, JSONP to Mailchimp post-json
   ============================================================ */
(function () {
  var form = document.getElementById('mc-consult-form');
  if (!form) return;

  var statusEl = document.getElementById('mc-consult-status');
  var btn = form.querySelector('.consult-btn');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'consult-status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = form.querySelector('[name="EMAIL"]');
    if (!email.value || !EMAIL_RE.test(email.value)) {
      setStatus('Please enter a valid email address.', 'error');
      email.focus();
      return;
    }

    setStatus('Sending…', '');
    if (btn) btn.disabled = true;

    // Build JSONP request to Mailchimp's post-json endpoint
    var cb = 'mcCallback_' + (window.__mcSeq = (window.__mcSeq || 0) + 1);
    var params = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      params.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value || ''));
    });
    var url = form.getAttribute('action') + '&' + params.join('&') + '&c=' + cb;

    var script = document.createElement('script');
    var done = false;

    function cleanup() {
      try { delete window[cb]; } catch (err) { window[cb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cb] = function (data) {
      done = true;
      if (btn) btn.disabled = false;
      cleanup();
      if (data && data.result === 'success') {
        form.reset();
        setStatus("Thank you — we've got your details and will reach out shortly.", 'success');
      } else {
        var msg = (data && data.msg) ? String(data.msg).replace(/^\d+\s*-\s*/, '') : 'Something went wrong. Please try again.';
        if (/already subscribed/i.test(msg)) {
          form.reset();
          setStatus("You're already on our list — we'll be in touch.", 'success');
        } else {
          setStatus(msg, 'error');
        }
      }
    };

    script.onerror = function () {
      if (done) return;
      if (btn) btn.disabled = false;
      cleanup();
      setStatus('Network error — please try again.', 'error');
    };

    script.src = url;
    document.body.appendChild(script);
  });
})();
