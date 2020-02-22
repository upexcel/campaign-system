# CampaignSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Requirements

Node version: 10 and above.

## Installation

First clone this repository , change branch to develpoment and run `npm install`.

## Build

Run `ng build` to build the project.
Run `ng build --prod` for production build.
The build artifacts will be stored in the `dist/` directory.

## Modifiction

For turning AUTOMATION on/off. Use `app.config.ts` and set `AUTOMATION = true/false`.
For any changes in apibase go to `environment.prod.ts` for production mode.

```typescript
export const environment = {
  production: true,
  mailsystembaseapiurl: 'https://campaignapi.excellencetechnologies.in/',
  apibase: 'http://stagingapi.recruit.excellencetechnologies.in',
};

```


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
