const kGlobalConstants = require('../Settings').default;

export function request(endpoint, data){
    const server = `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}/`;
    const type = data ? 'POST' : 'GET';
    console.log(server + endpoint);
    fetch(server + endpoint, {
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
}