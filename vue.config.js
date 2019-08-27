/* determines whether the version of the app should point 
 * to production or 'staging' instance of the api
 */
process.env.VUE_APP_API = process.env.DEPLOYMENT === 'production-live' ? process.env.VUE_APP_API_PROD : process.env.VUE_APP_API_STAGING;
 
module.exports = {
  productionSourceMap: false,
  configureWebpack: config => {
    // enables code splitting for higher performance in production
    config.optimization = {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}