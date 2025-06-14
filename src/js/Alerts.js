import React, { Component } from 'react';

import api from './helpers/api';
import CustomAlert from './CustomAlert';
import Alert from './Alert';

import queryString from 'query-string';
const kGlobalConstants = require('./Settings').default;


class Alerts extends Component {
  constructor() {
    super();

    this.state = {
      alertData: [],
      search: '',
      sort: '-created_at',
      page: 1,
      total: null,
      limit: kGlobalConstants.PAGE_LIMIT
    };
    this.customAlert = React.createRef();

    this.generateAlerts = this.generateAlerts.bind(this);
    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.setEditAlert = this.setEditAlert.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentDidMount() {
    this.refreshAlerts();
  }

  setAlerts(resp) {
    const { data } = resp;
    const { alerts, page_metadata: pageMetadata } = data;
    const { total } = pageMetadata;
    this.setState({
      alertData: alerts,
      total
    });
  }

  setEditAlert(editAlert) {
    this.customAlert.current.prePopulate(editAlert);
  }

  generateAlerts(alertData) {
    const alerts = [];
    for (let i = 0; i < alertData.length; i += 1) {
      const alert = (
        <Alert
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

  updateSearch(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      search: value,
      page: 1
    }, this.refreshAlerts);
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
    }, this.refreshAlerts);
  }

  updateLimit(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      limit: value === '' ? null : value,
      page: 1
    }, this.refreshAlerts);
  }

  nextPage() {
    const { page } = this.state;
    this.setState({
      page: page + 1
    }, this.refreshAlerts);
  }

  previousPage() {
    const { page } = this.state;
    if (page > 1) {
      this.setState({
        page: page - 1
      }, this.refreshAlerts);
    }
  }

  refreshAlerts() {
    const {
      search,
      sort,
      limit,
      page
    } = this.state;
    const params = {
      search,
      sort,
      page,
      limit
    };
    const queryParams = `?${queryString.stringify(params)}`;
    api.request(`alerts/${queryParams}`, null).then(this.setAlerts);
  }

  render() {
    const {
      alertData,
      search,
      sort,
      page,
      limit,
      total
    } = this.state;
    const prevButtonDisabled = (page === 1);
    const nextButtonDisabled = (alertData.length < limit);
    const alerts = this.generateAlerts(alertData);
    const totalPages = limit === null ? 1 : Math.ceil(total / limit);
    return (
      <div>
        <h3>Alerts</h3>
        <div className="saved-alerts">
          <form className="search">
            <label htmlFor="custom-alert">Search</label>
            <input id="search-alerts" type="text" value={search} onChange={this.updateSearch} />
            <label htmlFor="custom-alert">Sort</label>
            <select id="sort-alerts" value={sort} onChange={this.updateSort}>
              <option value="name">Alphabetical</option>
              <option value="-name">Reverse Alphabetical</option>
              <option value="created_at">Oldest</option>
              <option value="-created_at">Newest</option>
            </select>
            <label htmlFor="custom-alert">Limit</label>
            <select id="limit-alerts" value={limit} onChange={this.updateLimit}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="">All</option>
            </select>
            <button type="button" disabled={prevButtonDisabled} onClick={this.previousPage}>Previous</button>
            &nbsp;
            <button type="button" disabled={nextButtonDisabled} onClick={this.nextPage}>Next</button>
            &nbsp;
            Page:
            {page}
            /
            {totalPages}
          </form>
          <div className="grid">
            { alerts }
          </div>
        </div>
        <h3>New Alert</h3>
        <div className="custom-alert">
          <CustomAlert ref={this.customAlert} refreshAlerts={this.refreshAlerts} />
        </div>
      </div>
    );
  }
}
export default Alerts;
