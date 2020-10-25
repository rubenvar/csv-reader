# CSV Reader

🚧 Work in Progress...🚧

## What is this?

This Firefox Extension will transform raw .csv data into a simple html table, and show it online in the same tab.

This way you don't need to download any file and deal with opening it in Numbers, Excel, etc., nor try to go through the data in its raw state.

## Features

- Detects if the current tab is a .csv page.
- Allos user input for the separator, if there is a title line, and lines to skip on top.
- It will transform the raw data into a table, nicely formatted so it's easy to scan.

## Some kind of roadmap...

- [ ] Chrome polyfill.
- [ ] Improve the browser icons.
- [ ] Detect if text _looks like a link_ and add `<a>` tags.
- [ ] Update README and Firefox page with images and examples of usage.
- [ ] If separator is also in text, between `"`, detect and don't use as separator.
- [ ] Try to detect separator.
- [ ] Remove `"` from the strings if they are at begining and end of string.
- [ ] Add css file to the main page to style the table.
- [ ] 'Doesn't work here' message: add 'if you feel this is an error please report it'.
- [ ] While it is processing the content, hide the content but show a loading component.
- [ ] If there is a title line, add option to transform data into JSON and export.
- [ ] Make columns hideable when click on top (small eye icon?).
