(function() {
  const BASE_URL = 'https://your-domain.com/api';
  const VISIT_ID = new URLSearchParams(window.location.search).get('visit_id') || sessionStorage.getItem('visit_id');

  function sendView(visitId) {
    navigator.sendBeacon(`${BASE_URL}/view`, JSON.stringify({
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      visitId
    }));
  }

  // If we have a visit ID, just track the view
  if (VISIT_ID) {
    sessionStorage.setItem('visit_id', VISIT_ID);
    sendView(VISIT_ID);
  } else {
    // Create visit and track view in parallel
    navigator.sendBeacon(`${BASE_URL}/visit`, JSON.stringify({
      url: window.location.href,
      referrer: document.referrer
    }));
  }

  // Track SPA page changes
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      sendView(VISIT_ID || sessionStorage.getItem('visit_id'));
    }
  }).observe(document, { subtree: true, childList: true });
})(); 