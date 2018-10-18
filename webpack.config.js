const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/commentBox.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'commentBox.min.js',
        library: 'commentBox',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: "typeof self !== 'undefined' ? self : this"
    }
};
