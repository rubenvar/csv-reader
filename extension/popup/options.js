const popup = document.querySelector('#csv-reader-popup');
const buttons = popup.querySelectorAll('.button');

function listenForClicks() {
  buttons.forEach(button => {
    // click in popup buttons only
    button.addEventListener('click', e => {
      e.preventDefault();

      function processCSV(tabs) {
        browser.tabs.insertCSS({ file: 'css/insert.css' });

        const separator = document.querySelector('#separator').value;
        const titleLine = document.querySelector('#title-line').checked;
        const skipLines = document.querySelector('#skip-lines').value;

        browser.tabs.sendMessage(tabs[0].id, {
          separator,
          titleLine,
          skipLines,
          command: 'convert',
        });
        // close the popup
        window.close();
      }

      function reset(tabs) {
        browser.tabs.removeCSS({ file: 'css/insert.css' });
        browser.tabs.sendMessage(tabs[0].id, { command: 'reset' });

        window.close();
      }

      function reportError(error) {
        console.error(`Could not read CSV: ${error}`);
      }

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

listenForClicks();
