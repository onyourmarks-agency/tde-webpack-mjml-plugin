# TDE Webpack MJMM Plugin 

Webpack plugin for converting MJML files to HTML

## Install

```bash
npm install --save-dev tde-webpack-mjml-plugin
```

## Usage

In your `webpack.config.js`

```javascript
var ManifestPlugin = require('tde-webpack-mjml-plugin');

module.exports = {
    // ...
    plugins: [
        new MjmlStore(paths.MJML, {
            extension: '.twig',
            outputPath: 'path/to/mjml'
        }),
    ]
};
```

## API:

```js
// webpack.config.js

module.exports = {
    plugins: [
        new MjmlStore('path/to/mjml', {
            extension: '.twig',
            outputPath: 'path/to/html'
        }),
    ]
}
```

### `inputPath`

Type: `String`

The path where MJML files are located

### `options.extension`

Type: `String`<br>
Default: `".html"`

The default output extension

### `options.outputPath`

Type: `String`<br>
Default: `""`

The path where HTML files should be written to


## License

MIT © [TDE](https://github.com/tdeNL)
