# Brewhops App [![CircleCI](https://circleci.com/gh/brewhops/app.svg?style=svg)](https://circleci.com/gh/brewhops/app) [![codecov](https://codecov.io/gh/brewhops/app/branch/master/graph/badge.svg)](https://codecov.io/gh/brewhops/app)

The app is written in VueJs and bootstrapped by the vue cli. If you need to add any additional webpack configuration you can extend the exported object in `vue.config.js`. If contributing, please write unit tests for any feature that you add, we're doing ourselves a favor!

## Commands
- `npm ci`: preferred because it will install dependencies based on package-lock.json, enforcing consistent package versions
- `npm run dev`: starts the dev server and hot-reloads on file changes
- `npm run build`: builds and minifies the project for production
- `npm run test`: runs unit tests and displays code coverage
- `npm run lint`: runs the linter on the project to enforce consistent code styling

## Deployment Commands 
- `npm run deploy` - __Please don't run this!__ it will deploy to production
- `npm run deploy-staging` - use this if you want to deploy your current changes to a `now` staging environment so you can test them
