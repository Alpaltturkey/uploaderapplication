module.exports = {
    entry: {
        app:__dirname+'/src/index.tsx'
    },
    mode: 'production',
    stats: {warnings:false},
    output: {
        path: __dirname+'/app',
        filename: '[name].bundle.js'
    },
    externals: ['tls', 'net', 'fs'],
    watch: false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
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
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      }
}