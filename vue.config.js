process.env.VUE_APP_API = process.env.NODE_ENV === 'production-live' ? process.env.VUE_APP_API_PROD : process.env.VUE_APP_API_STAGING;
