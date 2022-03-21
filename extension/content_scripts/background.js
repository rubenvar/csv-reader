/* eslint-disable no-undef */
window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

// return a BlockingResponse object with the new/modified headers
function responseHandler() {
  return {
    responseHeaders: [
      { name: 'content-type', value: 'text/plain' },
      { name: 'content-disposition', value: 'inline' },
    ],
  };
}

// remove previous
browser.webRequest.onHeadersReceived.removeListener(responseHandler);

// add listener
browser.webRequest.onHeadersReceived.addListener(
  responseHandler,
  { urls: ['<all_urls>'] },
  ['responseHeaders', 'blocking']
);
