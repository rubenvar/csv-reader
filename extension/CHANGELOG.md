# Changelog
All notable changes to the CSV Reader project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres (or tries to) to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Search for '<pre>' tags and only process the content inside.

### Added
- Icons for the browser button in dark and light colors.
- Chrome polyfill.
- If there is a title line, option to transform data into JSON and export.
- If an item looks like link, add '<a>' tags.
- If page tries to download .csv, open them in the browser window anyway.

## [0.1.1] - 2018-12-28
### Fixed
- Fix page extension check: allow extension in caps too.

## [0.1.0] - 2018-12-27
- Initial release, with basic features.