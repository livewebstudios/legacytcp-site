/* LegacyTCP nav.js — v0129 — sub-sub menus active */
/* LegacyTCP — Shared Navigation Injector
   Injects header and footer into every page.
   Mobile toggle wired automatically.
*/
(function() {
  // Detect depth from root
  // Calculate depth accounting for /newhtml/ or / testing prefix
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const testPrefixes = ['newhtml', 'newsite'];
  const startIdx = testPrefixes.includes(pathParts[0]) ? 1 : 0;
  const depth = pathParts.length - startIdx;
  const root  = depth === 0 ? '' : '../'.repeat(depth);

  const headerHTML = `
  <div class="top-bar">
    <div class="container">
      <a href="tel:2012772100"><span class="phone-icon">📞</span> 201.277.2100</a>
    </div>
  </div>
  <header class="site-header">
    <div class="container">
      <div class="header-inner">
        <a href="/newhtml/" class="logo-wrap" aria-label="Legacy Trust & Capital Partners — Home">
          <img src="/newhtml/images/logoRGB.png" alt="Legacy Trust & Capital Partners" class="site-logo" style="height:80px;width:auto;max-width:280px;">
        </a>
        <nav class="main-nav" id="mainNav" aria-label="Main navigation">
          <div class="nav-item"><a href="/newhtml/" class="nav-link" id="nav-home">Home</a></div>
          <div class="nav-item">
            <span class="nav-link" id="nav-about">About <span class="caret">▾</span></span>
            <div class="dropdown">
              <a href="/newhtml/about-us/">About Us</a>
              <a href="/newhtml/about-us/#mission">Our Mission</a>
              <a href="/newhtml/about-us/#approach">Our Approach</a>
              <a href="/newhtml/about-us/#team">Our Team Members</a>
            </div>
          </div>
          <div class="nav-item">
            <span class="nav-link" id="nav-services">Services <span class="caret">▾</span></span>
            <div class="mega-dropdown">
              <div class="mega-col">
                <span class="mega-col-title">Financial Planning</span>
                <a href="/newhtml/services/financial-planning/">Financial Planning</a>
                <a href="/newhtml/services/financial-planning/retirement-planning/">Retirement Planning</a>
                <a href="/newhtml/services/financial-planning/portfolio-management/">Portfolio Management</a>
                <a href="/newhtml/services/financial-planning/corporate-retirement-plans/">Corporate Retirement Plans</a>
              </div>
              <div class="mega-col">
                <span class="mega-col-title">Insurance Solutions</span>
                <a href="/newhtml/services/insurance-solutions/">Insurance Solutions</a>
                <a href="/newhtml/services/insurance-solutions/personal-insurance/">Personal Insurance</a>
                <a href="/newhtml/services/insurance-solutions/personal-insurance/life-insurance/">Life Insurance</a>
                <a href="/newhtml/services/insurance-solutions/personal-insurance/long-term-care-insurance/">Long-Term Care Insurance</a>
                <a href="/newhtml/services/insurance-solutions/personal-insurance/disability-insurance/">Disability Insurance</a>
                <a href="/newhtml/services/insurance-solutions/commercial-insurance/">Commercial Insurance</a>
                <a href="/newhtml/services/insurance-solutions/employee-benefit-plans/">Employee Benefit Plans</a>
                <a href="/newhtml/services/insurance-solutions/needs-analysis/">Needs Analysis</a>
                <a href="/newhtml/services/insurance-solutions/property-and-casualty-insurance/">Property &amp; Casualty</a>
              </div>
              <div class="mega-col">
                <span class="mega-col-title">Accounting Services</span>
                <a href="/newhtml/services/accounting-services/">Accounting Services</a>
                <a href="/newhtml/services/accounting-services/tax-preparation-and-efficiency-planning/">Tax Prep &amp; Efficiency Planning</a>
                <a href="/newhtml/services/accounting-services/corporate-compliance-and-bookkeeping/">Corporate Compliance &amp; Bookkeeping</a>
              </div>
              <div class="mega-col">
                <span class="mega-col-title">Legal Services</span>
                <a href="/newhtml/services/legal-services/">Legal Services</a>
                <div class="mega-sub-group">
                  <a href="/newhtml/services/legal-services/estate-planning/" class="mega-sub-parent">Estate Planning ›</a>
                  <div class="mega-sub-dropdown">
                    <a href="/newhtml/services/legal-services/estate-planning/wills/">Wills</a>
                    <a href="/newhtml/services/legal-services/estate-planning/trusts/">Trusts</a>
                  </div>
                </div>
                <div class="mega-sub-group">
                  <a href="/newhtml/services/legal-services/long-term-care-planning/" class="mega-sub-parent">Long-Term Care Planning ›</a>
                  <div class="mega-sub-dropdown">
                    <a href="/newhtml/services/legal-services/long-term-care-planning/asset-protection/">Asset Protection</a>
                    <a href="/newhtml/services/legal-services/long-term-care-planning/medicaid/">Medicaid</a>
                  </div>
                </div>
                <a href="/newhtml/services/legal-services/business-formation/">Business Formation</a>
                <a href="/newhtml/services/legal-services/business-succession-planning/">Business Succession Planning</a>
                <a href="/newhtml/services/legal-services/probate-and-estate-administration/">Probate &amp; Estate Admin</a>
              </div>
            </div>
          </div>
          <div class="nav-item">
            <span class="nav-link" id="nav-resources">Client Resources <span class="caret">▾</span></span>
            <div class="dropdown">
              <a href="/newhtml/client-resources/disclosures/">Disclosures</a>
              <a href="/newhtml/client-resources/forms/">Forms</a>
              <a href="/newhtml/client-resources/privacy-policy/">Privacy Policy</a>
              <a href="/newhtml/client-resources/terms-and-conditions/">Terms &amp; Conditions</a>
            </div>
          </div>
          <div class="nav-item"><a href="/newhtml/contact/" class="nav-link" id="nav-contact">Contact</a></div>
          <button class="nav-search-btn" aria-label="Search">🔍</button>
        </nav>
        <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu">☰</button>
      </div>
    </div>
  </header>`;

  const footerHTML = `
  <div class="footer-wave">
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="height:80px;width:100%;display:block;" fill="#1B2D5E">
      <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z"/>
    </svg>
  </div>
  <footer class="site-footer">
    <div class="footer-photo" style="background-image: url('/newhtml/images/contact.jpg');"></div>
    <div class="container">
      <div class="footer-inner">
        <div class="footer-col">
          <span class="footer-col-title">About Us</span>
          <p>Legacy Trust &amp; Capital Partners offers integrated financial services, including planning, asset management, estate planning, insurance, tax preparation, and business law. Our expert team delivers personalized solutions to secure and grow your legacy.</p>
          <div class="footer-logo" style="margin-top:16px;">
            <img src="/newhtml/images/icontcp.jpg" alt="Legacy Trust &amp; Capital Partners" style="width:60px;height:60px;display:block;">
          </div>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Navigation</span>
          <nav class="footer-nav" aria-label="Footer navigation">
            <a href="/newhtml/">Home</a>
            <a href="/newhtml/about-us/">About</a>
            <a href="/newhtml/services/">Services</a>
            <a href="/newhtml/contact/">Contact</a>
          </nav>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Contact</span>
          <span class="footer-contact-label">Address</span>
          <div class="footer-contact-val">80 W Century Road<br>Suite 303<br>Paramus, NJ 07652</div>
          <span class="footer-contact-label">Email</span>
          <div class="footer-contact-val"><a href="mailto:info@legacytcp.com" style="color:inherit;">info@legacytcp.com</a></div>
          <span class="footer-contact-label">Phone</span>
          <div class="footer-contact-val"><a href="tel:2012772100" style="color:inherit;">201.277.2100</a></div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-legal-links">
          <a href="/newhtml/client-resources/privacy-policy/">Privacy Policy</a>
          <span>|</span>
          <a href="/newhtml/client-resources/terms-and-conditions/">Terms And Conditions</a>
          <span>|</span>
          <a href="/newhtml/client-resources/disclosures/">Disclosures</a>
        </div>
        <div class="footer-copy">
          &copy;2026 <a href="https://livewebstudios.com" target="_blank" rel="noopener">LiveWebStudios.com</a> – Powered by <a href="https://livewebstudios.com" target="_blank" rel="noopener">Live Web Studios</a>
        </div>
        <a href="https://livewebstudios.com" target="_blank" rel="noopener">
          <img src="/newhtml/images/verifiedsecured.png" alt="Verified &amp; Secured by Live Web Studios" style="height:44px;width:auto;">
        </a>
      </div>
    </div>
  </footer>`;

  // Inject header before body content
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Active nav state
  const path = window.location.pathname;
  if (path === '/' || path === '') document.getElementById('nav-home').classList.add('active');
  else if (path.includes('/about-us')) document.getElementById('nav-about').classList.add('active');
  else if (path.includes('/services')) document.getElementById('nav-services').classList.add('active');
  else if (path.includes('/client-resources')) document.getElementById('nav-resources').classList.add('active');
  else if (path.includes('/contact')) document.getElementById('nav-contact').classList.add('active');

  // Mobile toggle
  document.addEventListener('click', function(e) {
    if (e.target.id === 'mobileToggle' || e.target.closest('#mobileToggle')) {
      const nav = document.getElementById('mainNav');
      const btn = document.getElementById('mobileToggle');
      nav.classList.toggle('open');
      btn.textContent = nav.classList.contains('open') ? '✕' : '☰';
    }
  });

  // Sub-sub menu JS hover (more reliable than pure CSS)
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.mega-sub-group').forEach(function(group) {
      var dropdown = group.querySelector('.mega-sub-dropdown');
      if (!dropdown) return;
      var timer;
      group.addEventListener('mouseenter', function() {
        clearTimeout(timer);
        dropdown.style.display = 'block';
      });
      group.addEventListener('mouseleave', function() {
        timer = setTimeout(function() { dropdown.style.display = 'none'; }, 100);
      });
      dropdown.addEventListener('mouseenter', function() { clearTimeout(timer); });
      dropdown.addEventListener('mouseleave', function() {
        timer = setTimeout(function() { dropdown.style.display = 'none'; }, 100);
      });
    });
  });
})();
