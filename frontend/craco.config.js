// craco.config.js
// craco = create react app configuration override
// allows to customize configurations (ESLint, Babel, PostCSS)
module.exports = {
    style: {
      postcss: {
        plugins: [
          // postcss plugins
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  }