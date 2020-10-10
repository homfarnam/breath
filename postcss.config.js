const tailwindcss = require("tailwindcss")
module.exports = {
  plugins: [tailwindcss("./tailwind.config.js"), require("autoprefixer")],
}

module.exports = {
  plugins: [
    "tailwindcss",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
  ],
}
