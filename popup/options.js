// TODO: Popup/button should only show if it's a csv or xls page
// TODO: Instead of download .csv, open them in the browser window

// CSS to hide anything on the page
const hidePage = `body > :not(.csv-table) {display: none;} tr:nth-child(odd) {background: #eee;}`;

const popup = document.querySelector('#csv-reader-popup');
const buttons = popup.querySelectorAll('.button');

function listenForClicks() {
  buttons.forEach(button => {
    // click in popup buttons only
    button.addEventListener('click', e => {
      e.preventDefault();

      function processCSV(tabs) {
        browser.tabs.insertCSS({ code: hidePage });

        const separator = document.querySelector('#separator').value;
        const titleLine = document.querySelector('#title-line').checked;
        const skipLines = document.querySelector('#skip-lines').value;

        browser.tabs.sendMessage(tabs[0].id, {
          separator,
          titleLine,
          skipLines,
          command: 'convert'
        });
        // close the popup
        window.close();
      }

      function reset(tabs) {
        browser.tabs.removeCSS({ code: hidePage });
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

// Start script on popup load
browser.tabs
  .executeScript({ file: '/content_scripts/csv_reader.js' })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

listenForClicks();
