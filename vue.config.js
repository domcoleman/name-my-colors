const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/scss/global/colors.scss'),
        path.resolve(__dirname, 'src/assets/scss/global/variables.scss'),
        path.resolve(__dirname, 'src/assets/scss/global/mixins.scss')
      ]
    }
  },
  devServer: {
    port: 3000
  }
};
