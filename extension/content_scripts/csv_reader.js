window.browser = (function() {
  return window.msBrowser || window.browser || window.chrome;
})();

// helper
function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

// Where eeeeverything happens
function mainWork() {
  // Avoid injecting script more than once
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // remove previous tables
  function removeResult() {
    const table = document.querySelector('.csv-table');
    if (table) {
      table.remove();
    }
  }

  // parses the content, replaces it with an html table
  function convertCSV(inputSeparator, titleLine, skipLines, hasLinks) {
    const urlRegex = /^(http(s)?:\/\/.)?(www\.)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    removeResult();

    const tableContainer = document.createElement('div');
    tableContainer.className = 'csv-table';

    const html = document.body.innerHTML;
    const htmlNoTags = html.replace(/<\/?[a-z]+>/gi, '');

    const allRows = htmlNoTags.split('\n');

    // string where the whole html will be stored
    let result = '';

    // some data about the table will be here after parsing
    result += '<div id="table-data"></div>';

    if (skipLines > 0) {
      const skippedText = allRows.splice(0, skipLines);
      // skipped text into its own div on top
      result += `<div class="skipped-text">${skippedText.join('<br />')}</div>`;
    }

    // TODO maybe improve this process to be more resilient?
    // build the output table HTML chain manually here:
    result += '<table>';

    // TODO try to guess the separator instead of hard-coding a ','
    const separator = inputSeparator === '' ? ',' : inputSeparator;
    // escape the 'pipe' as it works as a boolean in a regex 😱
    const separatorRegex = new RegExp(separator === '|' ? '\\|' : separator);

    // parse allllll rows
    const arrayOfAllRows = allRows.map((line, i) => {
      // decode html entities safely
      line = htmlDecode(line);

      // empty row
      const row = [];
      // string parsed and to be stored
      let prev = '';
      // flag to keep track if inside of quotes
      let insideQuotes = false;

      // for each line, analyze each character (could be done faster?)
      [...line].forEach((c, j) => {
        // if it's not the separator outside a string, nor a quote store char
        if ((!separatorRegex.test(c) || insideQuotes) && !/"/.test(c))
          prev += c;
        // quote found, change the flag
        if (/"/.test(c)) insideQuotes = !insideQuotes;
        // separator found OUTSIDE quotes, push stored to array and clear it
        if (separatorRegex.test(c) && !insideQuotes) {
          row.push(prev);
          prev = '';
        }
        // end of line, push last value to array
        if (j === line.length - 1) row.push(prev);
      });

      // return array
      return row;
    });

    // TODO: find a better way without mutating the array
    // add the table head
    if (titleLine) {
      const titleRow = arrayOfAllRows.splice(0, 1);
      let row = '<thead><tr>';
      titleRow[0].forEach(item => (row += `<th>${item}</th>`));
      row += '</tr></thead><tbody>';
      result += row;
    }

    // let columnWithLinks;

    // add each row
    arrayOfAllRows.forEach(array => {
      let row = '<tr>';
      array.forEach(
        item =>
          (row += `<td>${
            hasLinks && urlRegex.test(item)
              ? `<a href=${item} target="_blank" rel="noopener noreferrer nofollow">${item}</a>`
              : item
          }</td>`)
      );
      row += '</tr>';
      result += row;
    });

    // close table
    result += '</tbody></table>';

    tableContainer.innerHTML = result;

    document.body.appendChild(tableContainer);

    // add table info
    document.getElementById('table-data').innerHTML = `<p>
      Total rows: <span class="result">${new Intl.NumberFormat('en-US', {
        style: 'decimal',
      }).format(arrayOfAllRows.length)}</span>
      <br />
      Total columns: <span class="result">${arrayOfAllRows[1].length}</span>
      <br />
      Separator: <span class="result">${separator}</span>
      </p>`;

    // add ask for review please 🙏
    document.getElementById('table-data').innerHTML += `
      <br />
      <h3>⭐ Was this Extension useful?</h3>
      <p>🙏 Please consider spending <em>${Math.floor(Math.random() * 31) +
        30} seconds</em> leaving a 5-star review (in <a href="https://chrome.google.com/webstore/detail/csv-reader/dnioinfbhmclclfdbcnlfgbojdpdicde" target="_blank" rel="nofollow noreferrer noopener">Chrome</a>, or <a href="https://addons.mozilla.org/es/firefox/addon/csv-reader/" target="_blank" rel="nofollow noreferrer noopener">Firefox</a>).
      <br />
      🎁 It would mean a lot!</p>`;
  }

  // console.log('CSV Reader Script Started');

  browser.runtime.onMessage.addListener(message => {
    const { command, separator, titleLine, skipLines, hasLinks } = message;

    if (command === 'convert') {
      // TODO pass all options in a single config object
      convertCSV(separator, titleLine, skipLines, hasLinks);
    } else if (command === 'reset') {
      removeResult();
    }
  });
}

mainWork();
