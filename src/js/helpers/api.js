const kGlobalConstants = require('../Settings').default;

export default function request(endpoint, data) {
  const server = `${kGlobalConstants.API_HOST}:${kGlobalConstants.API_PORT}/`;
  const type = data ? 'POST' : 'GET';
  fetch(server + endpoint, {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
