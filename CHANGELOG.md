# Changelog

All notable changes to the [CSV Reader project](https://github.com/rubenvar/csv-reader) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (more or less).

## [Unreleased]

### Removed

- Removed a `console.log`.

## [1.1.1] - 2022-03-22

### Fixed

- Fixed response headers being modified for all websites if extension is active, now it only changes them for `.csv` urls.

## [1.1.0] - 2022-03-21

### Added

- **Stop** files from downloading, so they can be parsed in-browser: Modify response headers in a `background.js` file
- **Store** user config in local storage:
  - Store a config value per page url.
  - Get it on popup open, and load it into the popup inputs by default.
  - Set it on parse demand.

## [1.0.1] - 2021-09-04

### Changed

- Tweaks in readme. Removed a link to a sample CSV file as it was not there anymore.
- Updated browser-polyfill (0.7.0 -> 0.8.0).

## [1.0.0] - 2021-03-26

### Added

- Added option to try the csv parser anyway even if `.csv` extension is not detected in the url, thanks @chrishalbert (#7).
- Added option to download csv data as JSON (when there is a title row).
- Added option to _rainbow-code_ csv (highlight columns with different colors, like the [rainbow-csv plugin](https://github.com/mechatroner/vscode_rainbow_csv)) instead of making a table.

### Changed

- Removed the `🚧 Work in Progress` tag.
- Updated `README.md` with new options and a contributing/dev section.
- Added a placeholder in the skip-lines input.
- Tidy up the popup html:
  - Removed unused classes in buttons.
  - Removed emojis.
  - Added svg icons in buttons.
- Re-styled the popup (new colors and layout).
- Updated polyfill from v0.6.0 to to v0.7.0.
- Commit polyfill so the dev process will be easier for anyone.

## [0.5.0] - 2020-11-15

### Added

- Create new images for docs and extension pages in browsers.

### Changed

- Make table header **sticky**, so it stays at the top while scrolling.

### Fixed

- Improved the URL detection regex: now it accepts urls with lower and upper case.
- Removed _skip lines on top_ input placeholder to avoid confussion (it showed `3`, but the default is `0`...).
- Fix the size/proportion of the popup in Chrome.

## [0.4.0] - 2020-11-09

🎊 Now available in Chrome too!

### Added

- Remove quotes from the strings after parsing them.
- Added a link in the 'Doesn't work here' message to report if it's an error.
- Added `<a>` tags to links (regex) if config option is checked in the popup.
- Some useful data is now shown at the top of the table (number of rows, etc.).
- Added a prompt to ask the user for a 5-star review at the top of the table.

### Changed

- Improved the styling of the table: changed the font-family, it has a header background color, border color, box-shadow, etc.
- A row in the table changes background color on hover.

### Fixed (finally) 🎊

- The extension now recognizes the separator character inside a string (surrounded by `"`) and does not treat it as a separator (it does not split the string in that position).

## [0.3.0] - 2020-11-02

CSV Reader is now available for Chrome too (when the Extension is approved...)! 🎊

### Added

- Added [a polyfill](https://github.com/mozilla/webextension-polyfill) for Promises in chrome, for the `browser.tabs` object.
- Added [a function](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/) to replace `window.browser` with the correct option for each browser (`browser`, `chrome` or `msBrowser`).

### Changed

- Change extension permissions: only `activeTab` now, the rest were not needed.
- Tweak styling in the formatted table (`border-color`, etc). More coming soon.

### Removed

- Remove the `browser-specific-settings` key in `manifest.json`. It throws a warning in Chrome, and it's not really needed in Firefox.

## [0.2.0] - 2020-10-26

### Added

- Renewed icons, and icons for light and dark themes.

### Fixed

- Changed the plugin url to the correct username in github.

## [0.1.2] - 2018-12-28

### Fixed

- Fix page extension check: allow extension in caps too (for real this time).

## [0.1.1] - 2018-12-28

### Fixed

- Fix page extension check: allow extension in caps too.

## [0.1.0] - 2018-12-27

🎊 Initial release, with basic features.

### Added

- Detects if the page is a .csv page.
- User can input a separator.
- User can check if there is a title line
- User can input the number of lines to skip on top (useful if there is text above the csv).
- Transforms the raw data to a table.
- Formats the table nicely so it's easy to read!
