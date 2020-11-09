# Changelog

All notable changes to the CSV Reader project will be documented in this file.

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

### Fixed (finally) 🎊

- The extension now recognizes the separator character inside a string and does not treat it as a separator (it does not split the string in that position).

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
