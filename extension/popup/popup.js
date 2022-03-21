/* eslint-disable no-undef */
const popup = document.getElementById('csv-reader-popup');
const buttons = popup.querySelectorAll('button');
const titleRow = popup.querySelector('#title-line');
const jsonExport = popup.querySelector('#json-export');

window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

// get input values as config for processing functions
// (will be auto filled from localStorage if the was any)
function getConfig(tabs) {
  return {
    url: tabs[0].url, // url to store in localStorage
    separator: document.getElementById('separator').value,
    titleLine: document.getElementById('title-line').checked,
    skipLines: document.getElementById('skip-lines').value,
    hasLinks: document.getElementById('has-links').checked,
  };
}

// send order to create a table
function processCSV(tabs) {
  const config = getConfig(tabs);

  browser.tabs.insertCSS({ file: '/popup/css/insert.css' });
  browser.tabs.sendMessage(tabs[0].id, {
    ...config,
    command: 'table',
  });

  // close the popup
  window.close();
}

// send order to format for coloring
function colorCSV(tabs) {
  const config = getConfig(tabs);

  browser.tabs.insertCSS({ file: '/popup/css/insert-color.css' });
  browser.tabs.sendMessage(tabs[0].id, {
    ...config,
    command: 'color',
  });

  window.close();
}

// send order to create json
function exportJSON(tabs) {
  const config = getConfig(tabs);

  browser.tabs.sendMessage(tabs[0].id, {
    ...config,
    command: 'json',
  });

  window.close();
}

function reset(tabs) {
  // get and pass the config (even from maybe empty inputs)
  // so that localStorage is not full of undefineds
  const config = getConfig(tabs);

  // ? .removeCSS doesn't work in Chrome: it's still in beta. It works well in Firefox
  // browser.tabs.removeCSS({ file: '/popup/css/insert.css' });
  // ? so for now reseting the tab just reloads it... 🤷‍♂️ meh
  browser.tabs.reload();

  browser.tabs.sendMessage(tabs[0].id, { ...config, command: 'reset' });

  window.close();
}

function reportError(error) {
  console.error(`Could not read CSV: ${error}`);
}

function listenForClicks() {
  // enable json-export button only when there is a title row
  titleRow.addEventListener('change', function () {
    if (this.checked) jsonExport.disabled = false;
    else jsonExport.disabled = true;
  });

  buttons.forEach((button) => {
    // click in popup buttons only
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.id === 'convert') {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(processCSV)
          .catch(reportError);
      } else if (e.target.id === 'color-code') {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(colorCSV)
          .catch(reportError);
      } else if (e.target.id === 'json-export') {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(exportJSON)
          .catch(reportError);
      } else if (e.target.id === 'reset') {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(reset)
          .catch(reportError);
      }
    });
  });
}

function showPopupError() {
  document.querySelector('#csv-reader-popup').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
}

// error executing the script
function reportExecuteScriptError(error) {
  showPopupError();
  console.error(`Failed to execute script: ${error.message}`);
}

function checkExtension(tabs) {
  // get current tab
  let { url } = tabs[0];
  // get extension at the end of url
  // eslint-disable-next-line prefer-destructuring
  const ext = (url = url.substr(1 + url.lastIndexOf('/')).split('?')[0])
    .split('#')[0]
    .substr(url.lastIndexOf('.'));
  // if not csv: report error, show error component, and listen for try-anyway calls
  if (ext !== '.csv' && ext !== '.CSV') {
    reportError('Not a .csv page');
    showPopupError();
    document.getElementById('try-anyway').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#csv-reader-popup').classList.remove('hidden');
      document.querySelector('#error-content').classList.add('hidden');
    });
  }
}

// TODO maybe should only do the 'executeScript' if the extension is correct? could concatenate both things?
// start checking for the filetype
browser.tabs
  .query({ active: true, currentWindow: true })
  .then(checkExtension)
  .catch(reportExecuteScriptError);

// load the polyfill here so I can use promises in the csv_reader scripts
browser.tabs.executeScript({ file: '/polyfills/browser-polyfill.min.js' });
// pollyfill is also loaded in popup.html first so this file (popup.js) can use promises

// get stored config:
// 1. get current tab url
browser.tabs.query({ active: true, currentWindow: true }).then(
  (tabs) => {
    const { url } = tabs[0];
    // 2. try to get stored config for that url
    browser.storage.local.get(url).then((content) => {
      if (Object.keys(content).length) {
        // 3. if something found, get the config obj
        const storedConfig = content[url];
        // 4. and set it into the popup inputs by default
        document.getElementById('separator').value = storedConfig.separator;
        document.getElementById('title-line').checked = storedConfig.titleLine;
        document.getElementById('skip-lines').value = storedConfig.skipLines;
        document.getElementById('has-links').checked = storedConfig.hasLinks;
      }
    });
  },
  (err) => console.error({ err })
);

// start main script
browser.tabs
  .executeScript({ file: '/content_scripts/csv_reader.js' })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
