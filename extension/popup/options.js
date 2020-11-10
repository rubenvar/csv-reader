const popup = document.getElementById('csv-reader-popup');
const buttons = popup.querySelectorAll('.button');

window.browser = (function() {
  return window.msBrowser || window.browser || window.chrome;
})();

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
    command: 'convert',
  });
  // close the popup
  window.close();
}

function reset(tabs) {
  // ? .removeCSS doesn't work in Chrome: it's still in beta. It works well in Firefox
  // browser.tabs.removeCSS({ file: '/popup/css/insert.css' });
  // ? so for now reseting the tab just reloads it... 🤷‍♂️ meh
  browser.tabs.reload();
  // ? so probably no need to send any command then...
  browser.tabs.sendMessage(tabs[0].id, { command: 'reset' });

  window.close();
}

function color(tabs) {
  const separator = document.getElementById('separator').value;
  const skipLines = document.getElementById('skip-lines').value;

  browser.tabs.insertCSS({ file: '/popup/css/insert-color.css' });

  // send order to color the csv
  browser.tabs.sendMessage(tabs[0].id, {
    separator,
    skipLines,
    command: 'color',
  });
}

function reportError(error) {
  console.error(`Could not read CSV: ${error}`);
}

function listenForClicks() {
  buttons.forEach(button => {
    // click in popup buttons only
    button.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('convert')) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(processCSV)
          .catch(reportError);
      } else if (e.target.classList.contains('reset')) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(reset)
          .catch(reportError);
      } else if (e.target.classList.contains('color')) {
        console.log('🌈 color! 🦄');
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then(color)
          .catch(reportError);
      }
    });
  });
}

// Error executing the script.
function reportExecuteScriptError(error) {
  document.querySelector('#csv-reader-popup').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
  console.error(`Failed to execute script: ${error.message}`);
}

function checkExtension(tabs) {
  // get current tab
  let { url } = tabs[0];
  // get extension in the end of url
  const ext = (url = url.substr(1 + url.lastIndexOf('/')).split('?')[0])
    .split('#')[0]
    .substr(url.lastIndexOf('.'));
  // if not csv, error and out
  if (ext !== '.csv' && ext !== '.CSV') {
    reportExecuteScriptError({ message: 'Not a .csv page' });
  }
}

// TODO maybe should only do the 'executeScript' if the extension is correct? could concatenate both things??
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

// go
// listenForClicks();
