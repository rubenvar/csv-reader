const popup = document.getElementById('csv-reader-popup');
const buttons = popup.querySelectorAll('button');
const titleRow = popup.querySelector('#title-line');
const jsonExport = popup.querySelector('#json-export');

window.browser = (function() {
  return window.msBrowser || window.browser || window.chrome;
})();

function reset(tabs) {
  // ? .removeCSS doesn't work in Chrome: it's still in beta. It works well in Firefox
  // browser.tabs.removeCSS({ file: '/popup/css/insert.css' });
  // ? so for now reseting the tab just reloads it... 🤷‍♂️ meh
  browser.tabs.reload();
  // ? so probably no need to send any command then...
  browser.tabs.sendMessage(tabs[0].id, { command: 'reset' });

  window.close();
}

// send order to create a table
function processCSV(tabs) {
  const separator = document.getElementById('separator').value;
  const titleLine = document.getElementById('title-line').checked;
  const skipLines = document.getElementById('skip-lines').value;
  const hasLinks = document.getElementById('has-links').checked;

  browser.tabs.insertCSS({ file: '/popup/css/insert.css' });
  browser.tabs.sendMessage(tabs[0].id, {
    separator,
    titleLine,
    skipLines,
    hasLinks,
    command: 'table',
  });

  // close the popup
  window.close();
}

// send order to format for coloring
function colorCSV(tabs) {
  const separator = document.getElementById('separator').value;
  const skipLines = document.getElementById('skip-lines').value;

  browser.tabs.insertCSS({ file: '/popup/css/insert-color.css' });
  browser.tabs.sendMessage(tabs[0].id, {
    separator,
    skipLines,
    command: 'color',
  });
  
  window.close();
}

// send order to create json
function exportJSON(tabs) {
  const separator = document.getElementById('separator').value;
  const titleLine = document.getElementById('title-line').checked;
  const skipLines = document.getElementById('skip-lines').value;
  
  browser.tabs.sendMessage(tabs[0].id, {
    separator,
    titleLine,
    skipLines,
    command: 'json',
  });

  window.close();
}

function reportError(error) {
  console.error(`Could not read CSV: ${error}`);
}

function listenForClicks() {
  // enable json-export button only when there is a title row
  titleRow.addEventListener('change', function() {
    if (this.checked) jsonExport.disabled = false;
    else jsonExport.disabled = true;
  });

  buttons.forEach(button => {
    // click in popup buttons only
    button.addEventListener('click', e => {
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
  const ext = (url = url.substr(1 + url.lastIndexOf('/')).split('?')[0])
    .split('#')[0]
    .substr(url.lastIndexOf('.'));
  // if not csv: report error, show error component, and listen for try-anyway calls
  if (ext !== '.csv' && ext !== '.CSV') {
    reportError('Not a .csv page');
    showPopupError();
    document.getElementById('try-anyway').addEventListener('click', e => {
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

// start main script
browser.tabs
  .executeScript({ file: '/content_scripts/csv_reader.js' })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
