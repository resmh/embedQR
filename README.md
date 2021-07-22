# embedQR

The library at hand enables to scan and parse QR Codes within Web Applications while demanding minimal server resources.

### Requirements for Integration

- User Agent
  - ECMAScript 2017 or newer
  - File upload
  - Image acquisition
  - (Optional) gzip content encoding
- Web Application
  - Top level module bootstrap by reference to template
  - Acquisition interface by reference to template
- Server
  - Storage for main and engine modules of 2KiB+100KiB (optionally gzip compressed 1KiB+14KiB)
  - Static Endpoints for main and engine modules with according content encoding
  - Storage for bootstrap and interface snippets


### Engine

The interface definition mandates an engine's default export to accept the url of an image (e.g. from a file input element) and to return the depicted QR Code's string contents or to throw an error.

Based upon the [danimoh/jsQR](https://github.com/danimoh/jsQR) library, a compliant fork also comprising of additional tweaks has been created [resmh/jsQR](https://github.com/resmh/jsQR).

### Licensing

The embedQR library is published in terms of the GNU Lesser General Public License 3.0 as provided within LICENSE.md and offers an API realised through configurable variables as well as overridable functions within the main module that are comprehensively detailed on within the bootstrap template snippet.

The engine submodule is subject to the Apache License 2.0 as provided within LICENSE.engine.md.

The term "QR Code" is a registered trademark of DENSO WAVE Incorporated. 

 
