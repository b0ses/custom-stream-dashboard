const kGlobalConstants = require('../Settings').default;

function request(endpoint, data, callback) {
  const server = `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}/`;
  const type = data ? 'POST' : 'GET';
  const request = {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (data){
    request['body'] = JSON.stringify(data)
  }
  const response = fetch(server + endpoint, request).then(response => response.json())
  if (callback){
    response.then(data => callback(data));
  }
}

export default { request };
