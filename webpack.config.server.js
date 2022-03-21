module.exports = {
    entry: {
        server: __dirname + '/server/app.js'
    },
    mode: 'production',
    stats: {warnings:false},
    target: 'node',
    output: {
        path: __dirname+'/app',
        filename: '[name].bundle.js'
    },
    watch: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            }
        ]
    }
}