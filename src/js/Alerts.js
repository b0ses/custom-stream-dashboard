import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './helpers/api';
import helper from './helpers/helper';
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
      limit: kGlobalConstants.PAGE_LIMIT,
      includeTags: true,
      includeAlerts: true,
      savedIncludeTags: true,
      savedIncludeAlerts: true,
      infiniteScroll: true,
      initialLoad: false,
      selected: []
    };

    this.generateAlerts = this.generateAlerts.bind(this);
    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.resetAlerts = this.resetAlerts.bind(this);
    this.setAlerts = this.setAlerts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateIncludeTags = this.updateIncludeTags.bind(this);
    this.updateIncludeAlerts = this.updateIncludeAlerts.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.setupObserver = this.setupObserver.bind(this);
    this.handleIntersect = this.handleIntersect.bind(this);
    this.processChange = this.processChange.bind(this);
  }

  componentDidMount() {
    this.resetAlerts();
    this.setupObserver();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.associationsType !== this.props.associationsType) {
      const { includeAlerts, includeTags, savedIncludeAlerts, savedIncludeTags } = this.state;
      if (this.props.associationsType === 'alerts') {
        this.setState({
          includeAlerts: true,
          includeTags: false,
          savedIncludeAlerts: includeAlerts,
          savedIncludeTags: includeTags
        });
        this.resetAlerts();
      }
      else if (this.props.associationsType === 'tags') {
        this.setState({
          includeAlerts: false,
          includeTags: true,
          savedIncludeAlerts: includeAlerts,
          savedIncludeTags: includeTags
        });
        this.resetAlerts();
      }
      else {
        this.setState({
          includeAlerts: savedIncludeAlerts,
          includeTags: savedIncludeTags
        });
      }
    }
  }

  setAlerts(resp) {
    const { data } = resp;
    const { search_results: searchResults, page_metadata: pageMetadata } = data;
    const { total } = pageMetadata;
    const { infiniteScroll, alertData, page } = this.state;

    let newAlertData = searchResults;
    if (page > 1 && infiniteScroll){
      newAlertData = alertData.concat(newAlertData);
    }

    this.setState({
      alertData: newAlertData,
      total,
      initialLoad: true,
    });
  }

  generateAlerts(alertData) {
    const alerts = [];
    const { associations } = this.props;
    for (let i = 0; i < alertData.length; i += 1) {
      const tag = alertData[i].type.toLowerCase() === 'tag';
      const selected = (this.props.associationsType !== null && associations !== null && associations.includes(alertData[i].name) > 0);
      const alert = (
        <Alert
          key={i}
          alertData={alertData[i]}
          resetAlerts={this.resetAlerts}
          editAlert={this.props.editAlert}
          editTag={this.props.editTag}
          toggleAssociation={this.props.toggleAssociation}
          tag={tag}
          selected={selected}
          selectable={this.props.associationsType !== null}
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
    const { search } = this.state;
    if (search !== value){
      this.setState({
        search: value
      }, this.resetAlerts);
    }
  }
  processChange = helper.debounce((event) => this.updateSearch(event))

  updateIncludeTags(event) {
    const {
      target: {
        checked
      }
    } = event;
    this.setState({
      includeTags: checked,
    }, this.resetAlerts);
  }

  updateIncludeAlerts(event) {
    const {
      target: {
        checked
      }
    } = event;
    this.setState({
      includeAlerts: checked,
    }, this.resetAlerts);
  }


  updateSort(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      sort: value,
    }, this.resetAlerts);
  }

  updateLimit(event) {
    const {
      target: {
        value
      }
    } = event;
    this.setState({
      limit: value === '' ? null : value
    }, this.resetAlerts);
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

  resetAlerts() {
    this.setState({
      page: 1,
      initialLoad: false,
      alertData: []
    }, this.refreshAlerts);
  }

  refreshAlerts() {
    const {
      search,
      sort,
      limit,
      page,
      includeTags,
      includeAlerts
    } = this.state;
    const params = {
      search,
      sort,
      page,
      limit,
      "include_tags": includeTags,
      "include_alerts": includeAlerts
    };
    const queryParams = `?${queryString.stringify(params)}`;
    api.request(`alerts/${queryParams}`, null).then(this.setAlerts);
  }

  setupObserver() {
      const options = {
        root: null, // Observe the viewport
        rootMargin: "0px",
        threshold: 0, // Trigger when any part of the element is visible
      };

      this.observer = new IntersectionObserver(this.handleIntersect, options);

      // Observe the element
      const target = document.getElementById('infiniteScroll');
      if (target) {
        this.observer.observe(target);
      }
  }

  handleIntersect(entries) {
    const { initialLoad } = this.state;
    if (initialLoad){
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.nextPage();
        }
      });
    }
  }

  render() {
    const {
      alertData,
      search,
      sort,
      page,
      limit,
      total,
      includeAlerts,
      includeTags
    } = this.state;
    // const prevButtonDisabled = (page === 1);
    // const nextButtonDisabled = (alertData.length < limit);
    const alerts = this.generateAlerts(alertData);
    // const totalPages = limit === null ? 1 : Math.ceil(total / limit);

    let header = '';
    if (includeAlerts && includeTags) {
      header = 'Tags and Sounds'
    }
    else if (includeAlerts) {
      header = 'Sounds'
    }
    else if (includeTags) {
      header = 'Tags'
    }

    let guide = 'Click to play a sound.'
    if (includeTags) {
      guide += ' Tags will play a random sound with that tag.';
    }
    if (this.props.associationsType !== null) {
      const counter = this.props.associationsType === 'alerts' ? 'tag' : 'alert';
      guide = `Click to add/remove ${this.props.associationsType} from ${counter}. Save/Update or Cancel when finished.`
    }

    // Prevent unchecking both boxes
    let disableTags, disableAlerts = false;
    if (!includeTags){
      disableAlerts = true;
    }
    else if (!includeAlerts){
      disableTags = true;
    }

    return (
        <div className="saved-alerts">
          <h3>{header}</h3>
          <p>{guide}</p>
          <div id="legend">
            {includeTags ? (<div><span>Tags</span><span className="dot tags"></span></div>) : null}
            {this.props.associationsType !== null ? (<div><span>Selected</span><span className="dot selected"></span></div>) : null}
          </div>
          <form className="search">
            <div>
              <label htmlFor="custom-alert">Search</label>
              <input id="search-alerts" type="text" onKeyUp={this.processChange}/>
            </div>
            {this.props.associationsType === null ? (
              <div>
                <label htmlFor="custom-alert">Tags</label>
                <input id="include-tags" type="checkbox" checked={includeTags} onChange={this.updateIncludeTags} disabled={disableTags}/>
              </div>
            ) : null}
            {this.props.associationsType === null ? (
              <div>
                <label htmlFor="custom-alert">Sounds</label>
                <input id="include-alerts" type="checkbox" checked={includeAlerts} onChange={this.updateIncludeAlerts} disabled={disableAlerts}/>
              </div>
            ) : null}
            <div>
              <label htmlFor="custom-alert">Sort</label>
              <select id="sort-alerts" value={sort} onChange={this.updateSort}>
                <option value="name">Alphabetical</option>
                <option value="-name">Reverse Alphabetical</option>
                <option value="created_at">Oldest</option>
                <option value="-created_at">Newest</option>
              </select>
            </div>
          </form>
          <div className="grid">
            { alerts }
            <div id="infiniteScroll" className="infinite-scroll"></div>
          </div>
        </div>
    );
  }
}

Alerts.propTypes = {
  associationsType: PropTypes.text,
  associations: PropTypes.array,
  editAlert: PropTypes.func,
  editTag: PropTypes.func,
  toggleAssociation: PropTypes.func,
};

Alerts.defaultProps = {
  associationsType: null,
  associations: [],
  editAlert: null,
  editTag: null,
  toggleAssociation: null,
};

export default Alerts;
