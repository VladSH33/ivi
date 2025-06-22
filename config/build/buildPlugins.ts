import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import Dotenv from "dotenv-webpack";
import { BuildOptions } from "./types/types";
import path from "path";

export function buildPlugins({
  mode,
  paths,
}: BuildOptions): Configuration["plugins"] {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: paths.html,
      favicon: path.resolve(paths.public, "favicon.ico"),
    }),
    new Dotenv(),
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin());
    
    // Оптимизированные настройки для ForkTsCheckerWebpackPlugin
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: false, // отключаем синтаксические проверки для скорости
          },
          mode: "write-references", // используем более быстрый режим
        },
        devServer: false, // отключаем интеграцию с dev server для ускорения
      })
    );
    
    plugins.push(new ReactRefreshWebpackPlugin({
      overlay: false, // отключаем overlay для ускорения
    }));
  }

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      })
    );
  }

  return plugins;
}
