# TDE Webpack MJMM Plugin 

Webpack plugin for converting MJML files to HTML

## Install

```bash
npm install --save-dev tde-webpack-mjml-plugin
```

## Usage

In your `webpack.config.js`

```javascript
var MjmlPlugin = require('tde-webpack-mjml-plugin');

module.exports = {
    // ...
    plugins: [
        new MjmlPlugin(paths.MJML, {
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
        new MjmlPlugin(inputPath, {
            extension: options.extension,
            outputPath: options.outputPath
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
