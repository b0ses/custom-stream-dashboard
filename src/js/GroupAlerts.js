import React, { Component } from 'react';

import api from './helpers/api';
import CustomGroupAlert from './CustomGroupAlert';
import GroupAlert from './GroupAlert';

import queryString from 'query-string';
const kGlobalConstants = require('./Settings').default;

class GroupAlerts extends Component {
  constructor() {
    super();

    this.state = {
      groupAlertData: [],
      allAlerts: [],
      search: '',
      sort: 'name',
      page: 1,
      total: null,
      limit: kGlobalConstants.PAGE_LIMIT
    };
    this.customGroupAlert = React.createRef();

    this.refreshGroupAlerts = this.refreshGroupAlerts.bind(this);
    this.generateGroupAlerts = this.generateGroupAlerts.bind(this);
    this.setEditGroupAlert = this.setEditGroupAlert.bind(this);
    this.setGroupAlerts = this.setGroupAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentDidMount() {
    this.refreshGroupAlerts();
  }

  setAlerts(resp) {
    const { data } = resp;
    const { alerts } = data;
    this.setState({
      allAlerts: alerts.map(alert => alert.name)
    });
  }

  setGroupAlerts(resp) {
    const { data } = resp;
    const { groups, page_metadata: pageMetadata } = data;
    const { total } = pageMetadata;
    const groupAlertData = [];
    for (let i = 0; i < groups.length; i += 1) {
      groupAlertData.push(groups[i]);
    }
    this.setState({
      groupAlertData,
      total
    });
  }

  setEditGroupAlert(editGroupAlert) {
    this.customGroupAlert.current.prePopulate(editGroupAlert);
  }

  generateGroupAlerts(groupAlertData) {
    const groupAlerts = [];
    for (let i = 0; i < groupAlertData.length; i += 1) {
      const groupAlert = (
        <GroupAlert
          key={i}
          groupAlertData={groupAlertData[i]}
          refreshGroupAlerts={this.refreshGroupAlerts}
          setEditGroupAlert={this.setEditGroupAlert}
        />
      );
      groupAlerts.push(groupAlert);
    }
    return groupAlerts;
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
    }, this.refreshGroupAlerts);
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
    }, this.refreshGroupAlerts);
  }

  updateLimit(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      limit: value,
      page: 1
    }, this.refreshGroupAlerts);
  }

  nextPage() {
    const { page } = this.state;
    this.setState({
      page: page + 1
    }, this.refreshGroupAlerts);
  }

  previousPage() {
    const { page } = this.state;
    if (page > 1) {
      this.setState({
        page: page - 1
      }, this.refreshGroupAlerts);
    }
  }

  refreshGroupAlerts() {
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

    api.request('alerts/', null).then(this.setAlerts);
    api.request(`alerts/groups${queryParams}`, null).then(this.setGroupAlerts);
  }

  render() {
    const {
      groupAlertData,
      allAlerts,
      search,
      sort,
      page,
      limit,
      total
    } = this.state;
    const prevButtonDisabled = (page === 1);
    const nextButtonDisabled = (groupAlertData.length < limit);
    const groupAlerts = this.generateGroupAlerts(groupAlertData);
    const totalPages = limit === '' ? 1 : Math.ceil(total / limit);
    return (
      <div>
        <h3>Group Alerts</h3>
        <div className="saved-group-alerts">
          <form className="search">
            <label htmlFor="custom-alert">Search</label>
            <input id="search-alerts" type="text" value={search} onChange={this.updateSearch} />
            <label htmlFor="custom-alert">Sort</label>
            <select id="sort-alerts" value={sort} onChange={this.updateSort}>
              <option value="name">Alphabetical</option>
              <option value="-name">Reverse Alphabetical</option>
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
            { groupAlerts }
          </div>
        </div>
        <h3>New Group Alert</h3>
        <div className="custom-group-alert">
          <CustomGroupAlert
            ref={this.customGroupAlert}
            refreshGroupAlerts={this.refreshGroupAlerts}
            allAlerts={allAlerts}
          />
        </div>
      </div>
    );
  }
}
export default GroupAlerts;
