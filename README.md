# CSV Reader

🚧 Work in Progress...🚧

## What is this?

A Firefox extension.

It will transform raw `csv` data into a simple `html` table, and show it online in the same tab.

### What problem does this solve?

When quickly looking through csv data files online, you either have to:

- Open them with Excel, Numbers, etc.
- Try to skim through the data in its raw state.

_CSV Reader_ allows you to look at the data formatted as a table, so you can make decisions faster.

## Features

- Detects if the current tab is a .csv page.
- Allos user input for the separator, if there is a title line, and lines to skip on top.
- It will transform the raw data into a table, nicely formatted so it's easy to scan.

## How to use

1. In Firefox, head to [the extension page](https://addons.mozilla.org/addon/csv-reader/) and install it. (Sorry, Chrome extension coming soon).
2. Head to any `.csv` data page.
3. Click on the extension icon, fill the form:
   1. Choose the _separator_.
   2. Check if there is a title row for the data. This will format a header row in the table.
   3. Input the number of lines to skip on top. csv pages have a few lines with info at the top, we don't want to format those.
4. Done, enjoy the table!

### Example

Visit [this csv sample dataset](https://rubenvara.s3-eu-west-1.amazonaws.com/csv/dataNov-2-2020.csv).

Click on the CSV Reader extension icon.

In the popup, input `|` (pipe) as the separator, and check the title line option:

![Start](/docs/init.png)

Click "Convert":

![Converted](/docs/table.png)

To go back to the raw data, click the "Reset" button on the extension popup:

![Reset](/docs/reset.png)

## Some kind of roadmap...

Some features I'd like to work on (help appreciated):

- [x] Chrome version.
- [x] Improve the browser icons.
- [x] Style the table row on hover.
- [ ] Show progress: while the content is being processed, hide it and show a loading component.
- [ ] If separator is also in text, between `"`, detect and don't use as separator.
- [ ] Detect if text _looks like a link_ and add `<a>` tags.
- [x] Update README and Firefox page with images and examples of usage.
- [ ] Try to auto-detect separator.
- [ ] Add some useful data in the result page (number of rows and columns, etc.).
- [ ] Ask users in the result page to leave a 5⭐ review please.
- [ ] Remove `"` from the strings if they are at begining and end of string.
- [ ] Add css file to the main page to style the table.
- [ ] 'Doesn't work here' message: add 'if you feel this is an error please report it'.
- [ ] Make columns hideable.
- [ ] If there is a title line, add option to transform data into JSON and export.
