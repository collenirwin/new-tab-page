const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    entry: './newtab/src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'newtab', 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    devtool: 'cheap-module-source-map'
};