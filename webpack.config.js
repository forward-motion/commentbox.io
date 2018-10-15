const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/commentBox.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'commentBox.js',
        library: 'commentBox'
    }
};
