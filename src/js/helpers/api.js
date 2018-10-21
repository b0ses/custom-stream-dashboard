const kGlobalConstants = require('../Settings').default;

function request(endpoint, data, callback) {
  const server = `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}/`;
  const type = data ? 'POST' : 'GET';
  const requestObj = {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if (data) {
    requestObj.body = JSON.stringify(data);
  }
  const responseObj = fetch(server + endpoint, requestObj).then(response => response.json());
  if (callback) {
    responseObj.then(responseData => callback(responseData));
  }
}

export default { request };
