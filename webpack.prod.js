const HtmlWebPackPlugin=require('html-webpack-plugin');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin=require('optimize-css-assets-webpack-plugin');
const { ModuleFilenameHelpers } = require('webpack');
const CopyPlugin=require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');


module.exports = {    
    
    mode: 'production',
    optimization:{
        minimize:true,
        minimizer:[new TerserPlugin({
            test: /\.js(\?.*)?$/i,
          }),
          new OptimizeCssAssetsPlugin()],
    },
        output:{
        filename: 'main.[fullhash].js',
        path: path.resolve(__dirname, 'dist')       
        },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },
            {
                test: /\.css$/,
                exclude:  /styles\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /styles\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                             attributes: false,
                             minimize: false,
                             }
                    }
                ]
            },{
                test: /\.(png|svg|jpg|gif)$/,
                use:[ 
                    {
                        loader: 'file-loader',
                        options:{
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
            ignoreOrder: false
        }),
        new CopyPlugin({
            patterns: [
            { from: 'src/assets', to: 'assets/' },
        ],
        }),
        
    ]
    

};