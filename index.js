require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const { existsSync, createReadStream, writeFileSync, rmSync } = require('fs');
const { parse } = require('fast-csv');
const axios = require('axios');
const { stringify } = require('querystring');
const { abort } = require('process');

const { TOKEN_URL, TENANT, ST_ID, ST_SECRET, ST_KEY, ST_CUSTOMERS } = process.env;

const fetchEmails = (async () => {
    let rows= [];

    // read from input csv
    if (!existsSync('./input.csv')) {
        throw 'Input file does not exist! Please provide one!';
    } else {
        // if output already exists
        if (existsSync('./output.csv')) {
            // delete output file
            rmSync(path.resolve(__dirname, 'output.csv'));
        }
        
        exec('touch output.csv');

        // iterate over input file
        createReadStream(path.resolve(__dirname, 'input.csv'))
        .pipe(parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            // console.log(row);
            rows.push(row);
        })
        .on('end', async () => {
            const tokenOptions = {
                method: 'post',
                url: TOKEN_URL,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: stringify({
                    grant_type: 'client_credentials',
                    client_id: ST_ID,
                    client_secret: ST_SECRET
                }),
            };
    
            const tokenResponse = await axios(tokenOptions);

            const { access_token } = tokenResponse.data;

            writeFileSync(path.resolve(__dirname, 'output.csv'), 'Email\n', {flag: 'a+'});
            
            // create customer axios requests with customer ids from input csv
            for (let customer of rows) {
                const { CustomerId } = customer;
    
                let contactsOptions = {
                    method: 'get',
                    url: `${ST_CUSTOMERS}${TENANT}/customers/${CustomerId}/contacts`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': access_token,
                        'ST-App-Key': ST_KEY,
                    },
                };
    
                axios(contactsOptions)
                    .then((response) => {
                        const { data } = response.data;
                        // iterate through the response for the email object
                        data.forEach((contact) => {
                            if (contact.type === 'Email') {
                                // write the email to a result csv file
                                writeFileSync(path.resolve(__dirname, 'output.csv'), `${contact.value}\n`, {flag: 'a+'});
                            }
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                        abort();
                    });
            }    
        })
    }
})();
