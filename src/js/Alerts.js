import React, { Component } from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

const kGlobalConstants = require('./Settings').default;
const querystring = require('querystring');


class Alerts extends Component {
  constructor() {
    super();

    this.state = {
      alertData: [],
      search: '',
      sort: 'name',
      page: 1,
      limit: kGlobalConstants.PAGE_LIMIT
    };
    this.customAlert = React.createRef();

    this.generateAlerts = this.generateAlerts.bind(this);
    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setEditAlert = this.setEditAlert.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  setAlerts(resp) {
    const { data } = resp;
    const alertData = [];
    for (let i = 0; i < data.length; i += 1) {
      alertData.push(data[i]);
    }
    this.setState({
      alertData
    });
  }

  generateAlerts(alertData) {
    const alerts = [];
    for (let i = 0; i < alertData.length; i += 1) {
      const alert = (<Alert
        key={i}
        alertData={alertData[i]}
        refreshAlerts={this.refreshAlerts}
        setEditAlert={this.setEditAlert}
      />
      );
      alerts.push(alert);
    }
    return alerts;
  }

  setEditAlert(editAlert) {
    this.customAlert.current.prePopulate(editAlert);
  }

  updateSearch(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      search: value,
      page: 1
    }, this.refreshAlerts);;
  }

  updateSort(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      sort: value,
      page: 1
    }, this.refreshAlerts);;
  }

  nextPage() {
    const { page } = this.state;
    this.setState({
      page: page + 1
    }, this.refreshAlerts);;
  }

  previousPage() {
    const { page } = this.state;
    if (page > 1){
      this.setState({
        page: page - 1
      }, this.refreshAlerts);
    }
  }

  refreshAlerts() {
    const { search, sort, limit, page } = this.state;
    let params = {
      search,
      sort,
      page,
      limit
    }
    const queryParams = '?' + querystring.stringify(params);
    api.request('alerts/' + queryParams, null).then(this.setAlerts);
  }

  render() {
    const { alertData, search, sort, page, limit } = this.state;
    const prevButtonDisabled = (page === 1)
    const nextButtonDisabled = (alertData.length < limit)
    const alerts = this.generateAlerts(alertData);
    return (
      <div>
        <ScrollableAnchor id="saved-alerts">
          <h3>Alerts</h3>
        </ScrollableAnchor>
        <div className="saved-alerts">
          <form className="search">
            <label htmlFor="custom-alert">Search</label>
            <input id="search-alerts" type="text" value={search} onChange={this.updateSearch} />
            <label htmlFor="custom-alert">Sort</label>
            <select id="sort-alerts" value={sort} onChange={this.updateSort}>
              <option value="name">Alphabetical</option>
              <option value="-name">Reverse Alphabetical</option>
            </select>
            <button type="button" disabled={ prevButtonDisabled } onClick={this.previousPage}>Previous</button>
            &nbsp;
            <button type="button" disabled={ nextButtonDisabled } onClick={this.nextPage}>Next</button>
          </form>
          <div className="grid">
            { alerts }
          </div>
        </div>
        <ScrollableAnchor id="custom-alert">
          <h3>New Alert</h3>
        </ScrollableAnchor>
        <div className="custom-alert">
          <CustomAlert ref={this.customAlert} refreshAlerts={this.refreshAlerts} />
        </div>
      </div>
    );
  }
}
export default Alerts;
