window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

// Helpers:
function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}
// remove previous tables
function removePrevious() {
  const table = document.getElementById('csv-table');
  const color = document.getElementById('csv-color');

  if (table) table.remove();
  if (color) color.remove();
}

function parseAllRows(allRows, separator) {
  // escape the 'pipe' as it works as a boolean in a regex 😱
  const separatorRegex = new RegExp(separator === '|' ? '\\|' : separator);

  return allRows.map((row) => {
    // decode html entities safely
    const line = htmlDecode(row);

    // empty result row
    const parsedRow = [];
    // string parsed and to be stored
    let prev = '';
    // flag to keep track if inside of quotes
    let insideQuotes = false;

    // for each line, analyze each character (could be done faster?)
    [...line].forEach((c, j) => {
      // if it's not the separator outside a string nor a quote, store char
      if ((!separatorRegex.test(c) || insideQuotes) && !/"/.test(c)) prev += c;
      // quote found, change the flag
      if (/"/.test(c)) insideQuotes = !insideQuotes;
      // separator found OUTSIDE quotes, push stored to array and clear it
      if (separatorRegex.test(c) && !insideQuotes) {
        parsedRow.push(prev);
        prev = '';
      }
      // end of line, push last value to array
      if (j === line.length - 1) parsedRow.push(prev);
    });

    // return array
    return parsedRow;
  });
}

// where eeeeverything happens
function mainWork() {
  // Avoid injecting script more than once
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // TODO try to guess the separator instead of hard-coding a ','
  // main parsin fn, keep code DRY with only this function and a _mode_
  function parseCSV(mode, inputSeparator, titleLine, skipLines, hasLinks) {
    removePrevious();

    const urlRegex = /^(http(s)?:\/\/.)?(www\.)?[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const separator = inputSeparator === '' ? ',' : inputSeparator;
    const isTable = mode === 'table';
    const isColor = mode === 'color';
    // escape the 'pipe' as it works as a boolean in a regex 😱

    const resultContainer = document.createElement('main');
    resultContainer.id = `csv-${isTable ? 'table' : 'color'}`;
    // get all text
    const html = document.body.innerHTML;
    const htmlNoTags = html.replace(/<\/?[a-z]+>/gi, '');
    // separate in lines
    const allRows = htmlNoTags.split('\n');
    // string where the whole html result will be stored
    let result = '';

    // some data about the table will be here after parsing
    result += '<div id="page-header"></div>';

    if (skipLines > 0) {
      const skippedText = allRows.splice(0, skipLines);
      // skipped text into its own div on top
      result += `<div id="skipped-text">${skippedText.join('<br />')}</div>`;
    }

    // TODO maybe improve this process to be more resilient?
    // build the output table HTML chain manually here:
    if (isTable) result += '<table>';

    // parse allllll rows
    const arrayOfAllRows = parseAllRows(allRows, separator);

    // add the table head
    if (isTable && titleLine) {
      // TODO: find a better way without mutating the array
      const titleRow = arrayOfAllRows.splice(0, 1);
      let row = '<thead><tr>';
      titleRow[0].forEach((item) => (row += `<th>${item}</th>`));
      row += '</tr></thead><tbody>';
      result += row;
    }

    if (isTable) {
      // add each row
      arrayOfAllRows.forEach((array) => {
        let row = '<tr>';
        array.forEach(
          (item) =>
            (row += `<td>${
              hasLinks && urlRegex.test(item)
                ? `<a href=${item} target="_blank" rel="noopener noreferrer nofollow">${item}</a>`
                : item
            }</td>`)
        );
        row += '</tr>';
        result += row;
      });

      // and close table
      result += '</tbody></table>';
    } else if (isColor) {
      // add <span> tags to each block
      arrayOfAllRows.forEach((array) => {
        let row = '';
        array.forEach(
          (item, k) =>
            (row += `<span class="col-${k}">${item}</span>${
              k < array.length - 1
                ? `<span class="sep">${separator}</span>`
                : ''
            }`)
        );
        row += '<br/>';
        // add each row
        result += row;
      });
    }

    resultContainer.innerHTML = result;

    document.body.appendChild(resultContainer);

    // add table info and add ask for review please 🙏
    document.getElementById('page-header').innerHTML = `
      <p>
        Total rows: <span class="result">${new Intl.NumberFormat('en-US', {
          style: 'decimal',
        }).format(arrayOfAllRows.length)}</span>
      </p>
      <p>
        Total columns: <span class="result">${arrayOfAllRows[1].length}</span>
      </p>
      <p>
        Separator: <span class="result">${separator}</span>
      </p>
      <br />
      <p id="review">
        ⭐ Was this Extension useful? Please consider spending <em>${
          Math.floor(Math.random() * 31) + 30
        } seconds</em> leaving a 5-star review (in <a href="https://chrome.google.com/webstore/detail/csv-reader/dnioinfbhmclclfdbcnlfgbojdpdicde" target="_blank" rel="nofollow noreferrer noopener">Chrome</a> or <a href="https://addons.mozilla.org/es/firefox/addon/csv-reader/" target="_blank" rel="nofollow noreferrer noopener">Firefox</a>).
      </p>`;
  }

  function createJson(inputSeparator, titleLine, skipLines) {
    if (!titleLine) return console.log('errorrr!');
    removePrevious();

    // get all text
    const html = document.body.innerHTML;
    const htmlNoTags = html.replace(/<\/?[a-z]+>/gi, '');
    // separate in lines
    const allRows = htmlNoTags.split('\n');

    if (skipLines > 0) allRows.splice(0, skipLines);

    // parse allllll rows
    const separator = inputSeparator === '' ? ',' : inputSeparator;
    const arrayOfAllRows = parseAllRows(allRows, separator);

    // get the title row
    const titleRow = arrayOfAllRows.splice(0, 1)[0];

    // create an array of objects
    const result = arrayOfAllRows.map((row) => {
      const obj = {};
      row.forEach((str, i) => (obj[titleRow[i]] = str));
      return obj;
    });

    // the Trick for exporting the json:
    // create an invisible link element
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    // create a blob, append it to the link, and click the link
    function createFile(data, fileName) {
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    return createFile(result, `exported${Date.now()}.json`);
  }

  // eslint-disable-next-line no-undef
  browser.runtime.onMessage.addListener(
    ({ command, separator, titleLine, skipLines, hasLinks }) => {
      if (command === 'reset') return removePrevious();
      if (command === 'json')
        return createJson(separator, titleLine, skipLines);
      return parseCSV(command, separator, titleLine, skipLines, hasLinks);
    }
  );
}

mainWork();
