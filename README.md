<p align="center">
   <img width="630" height="405" src="/docs/promo.png" alt="CSV Reader">
</p>

## What is this?

A browser extension with 3.5k+ users.

It transforms raw `csv` data into a simple `html` table, and shows it online in the same tab.

Available free for [Chrome](https://chrome.google.com/webstore/detail/csv-reader/dnioinfbhmclclfdbcnlfgbojdpdicde) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/csv-reader/).

### What problem does this solve?

When quickly looking through csv data files online, you either have to:

- Open them with Excel, Numbers, etc.
- Try to skim through the data in its raw state.

CSV Reader allows you to look at the data formatted as a table, so you can make decisions faster.

## Features

CSV Reader detects if the current tab is a `.csv` page (correctly most of the time).

The user can select some settings in a popup to modify the output.

**NEW**: The extension now stores user settings per url for the next time you browse the same file.

**NEW**: The extension now stops `csv` files from downloading (it modifies the response headers) so you can parse them in-browser. If you want to download the file just `ctrl+s` (`cmd+s`), even in the parsed `csv` screen.

### Output

It offers different options (see images and examples below):

- Transform the raw `csv` data into a table, nicely formatted so it's easy to scan.
- Keep the raw `csv` data but rainbow-color it to make it easier to read (inspired by the [Rainbow CSV VS Code extension](https://github.com/mechatroner/vscode_rainbow_csv)).
- Download the data formatted as JSON (when there is a data header – title row).

### Input

It allows the user to input some settings:

| Feature         | Default | Type    | Result                                             |
| --------------- | ------- | ------- | -------------------------------------------------- |
| Separator       | `,`     | String  | New column when this value is found                |
| Title row       | `false` | Boolean | Use the first line as the table header             |
| Skip at the top | `0`     | Number  | Number of text lines to leave untouched at the top |
| Links in text   | `false` | Boolean | Look for links in data and make them clickable     |

## How to use

1. Install the extension (in [Chrome](https://chrome.google.com/webstore/detail/csv-reader/dnioinfbhmclclfdbcnlfgbojdpdicde) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/csv-reader/)).
2. Head to any `.csv` data page.
3. Click on the extension icon, fill the form:
   1. Choose the **separator**.
   2. Check if there is a **title row** for the data. This will format a header row in the table.
   3. Input the number of **lines to skip** at the top. Some csv pages have a few lines with info, we don't want to format those.
   4. Check if there are **links** in the data. They will be formatted as clickable links.
4. Click the appropriate button.
5. Done, enjoy the result!

### Example

Visit a `.csv` data file online. You can try [this csv sample dataset](https://rubenvara.s3-eu-west-1.amazonaws.com/csv/dataNov-2-2020.csv).

Click on the **CSV Reader** extension icon.

In the popup, input the config options: separator, title row, etc. (In the example dataset, `|` (pipe) as the separator, and check the title line option).

![Start](/docs/init.png)

Click "Convert":

![Converted](/docs/table.png)

To go back to the raw data, click the "Reset" button on the extension popup:

![Reset](/docs/reset.png)

## Help this project

If this extension was useful to you in any way, please consider leaving a ⭐ 5-star review.

It will take you less than a minute, and will greatly help reach new audiences.

- [Leave a review in Chrome](https://chrome.google.com/webstore/detail/csv-reader/dnioinfbhmclclfdbcnlfgbojdpdicde).
- [Leave a review in Firefox](https://addons.mozilla.org/en-US/firefox/addon/csv-reader/).

Thank you very much!

### Contribute

Suggestions and PRs are welcome, of course. This is (_roughly_) the dev process:

`extension/content_scripts/csv_reader.js` contains all the parse and output logic. The `browser.tabs` queries use Promises, supported in Firefox but not in Chrome, so the extension loads a polyfill for this.

`extension/popup/popup.js` manages the user input logic, messaging to the main content script, and custom CSS inserts.

To load the unpacked, test extension:

- In Chrome, load the whole unpacked `extension/` folder. Make sure the polyfill is in `extension/polyfills/`.
- In Firefox, I use Mozilla's [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool.

To build and pack the extension, I use `web-ext` too. It builds the `extension` folder and creates a `.zip` file inside `extension/web-ext-artifacts`.

That's it, there is no further compiling or building process, for now at least.

## Some kind of roadmap

Some features I'd like to work on (help appreciated):

- [ ] Show **progress**: while the content is being processed, hide the raw csv and show a loading component.
- [ ] Add a **reset** button directly in the page header.
- [x] Stop `.csv` files from **downloading**, and instead open them in browser so thay can be converted.
- [x] Store user config (per url) so they don't have to input the same fields every time.
- [ ] Add a link to download .csv file in the page header.
- [ ] Try to **auto-detect** separator.
- [ ] Make columns **hideable**.
- [ ] Make table sortable by column.
- [ ] Detect if text _looks like a link_ instead of having a popup checkbox.

## Acknowledgments

CSV Reader uses `svg` icons from [Tabler Icons](https://github.com/tabler/tabler-icons), thanks!
