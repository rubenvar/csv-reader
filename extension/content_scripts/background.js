/* eslint-disable no-undef */
window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

// return a BlockingResponse object with the new/modified headers
// only if the current extension is .csv
function responseHandler(details) {
  let { url } = details;
  // eslint-disable-next-line prefer-destructuring
  const ext = (url = url.substr(1 + url.lastIndexOf('/')).split('?')[0])
    .split('#')[0]
    .substr(url.lastIndexOf('.'));
  if (ext === '.csv' || ext === '.CSV') {
    return {
      responseHeaders: [
        { name: 'content-type', value: 'text/plain' },
        { name: 'content-disposition', value: 'inline' },
      ],
    };
  }
}

// remove previous
browser.webRequest.onHeadersReceived.removeListener(responseHandler);

// add listener
browser.webRequest.onHeadersReceived.addListener(
  responseHandler,
  { urls: ['<all_urls>'] },
  ['responseHeaders', 'blocking']
);
