const kGlobalConstants = require('../Settings').default;

async function request(endpoint, data) {
  const server = `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}/`;
  const type = data ? 'POST' : 'GET';
  const requestObj = {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };
  if (data) {
    requestObj.body = JSON.stringify(data);
  }
  return fetch(server + endpoint, requestObj)
    .then(response => response.json()
      .then(respData => ({
        data: respData,
        status: response.status
      })))
}

export default { request };
