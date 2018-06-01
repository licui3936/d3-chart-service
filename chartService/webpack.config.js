const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * creates a webpack config to be exported when npm run build in run
 * @param {string} projectPath The path to the project
 * @param {string} entryPoint The entry point to the application,
 *  usually a js file
 * @return {Object} A webpack module for the project
 */
function createWebpackConfigForProject(projectPath, entryPoint) {
    const includePathToProject = path.resolve(__dirname, `./src/${projectPath}`);

    return Object.assign({
        entry: entryPoint,
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name]-bundle.js'
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        devtool:'source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },
                {
                    test: /\.ts?$/,
                    loader: 'ts-loader'
                }
            ]
        }
    });
}

/**
 * Modules to be exported
 */
module.exports = [
    createWebpackConfigForProject('src', {
        'service': './src/index.ts'
    })
];
