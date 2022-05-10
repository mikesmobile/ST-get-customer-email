# Service Titan Get Customer Email Utility

This utility is for use with Service Titan.

When provided with an input csv that includes Customer ID #'s this utility will create a csv file with each customers email address.


## Installation and Setup

**Ensure that [Node.js](https://nodejs.org/en/) is installed on your device**

To begin installation begin by installing project dependencies:

```sh
npm install
```

After project dependencies are installed provide the project a .env file.
You will need to supply this .env file with the appropriate variables:

```
TENANT=YOUR_ORGANIZATION_ID
ST_ID=YOUR_CLIENT_ID
ST_SECRET=YOUR_CLIENT_SECRET
ST_KEY=YOUR_APP_KEY
ST_CUSTOMERS=https://api.servicetitan.io/crm/v2/tenant/
TOKEN_URL=https://auth.servicetitan.io/connect/token
```

After creating the required environment variables you will need to provide the csv that will be used as the input file.
The input file **must be named input.csv**.

## Usage

When the application is properly set up on a Windows device the user should be able to lauch the program with the **start.bat** file.