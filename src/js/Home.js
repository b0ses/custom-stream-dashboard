import React, { Component } from 'react';

import UserDetails from './UserDetails';
import Overlay from './Overlay';
import CustomAlert from './CustomAlert';
import Alerts from './Alerts';
// import Lights from './Lights';


class Home extends Component {
  constructor() {
    super();

    this.state = {
      editName: null,
      editMode: 'alert',
      associationsType: null,
      associations: []
    };

    this.editAlert = this.editAlert.bind(this);
    this.editTag = this.editTag.bind(this);
    this.changeAlerts = this.changeAlerts.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.resetAlerts = this.resetAlerts.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.setAssociations = this.setAssociations.bind(this);
    this.toggleAssociation = this.toggleAssociation.bind(this);

    this.alertsRef = React.createRef();
  }

  editAlert(alert) {
    this.setState({
      editMode: 'alert',
      editName: alert
    });
    window.scrollTo(0, 0);
  }

  changeTags() {
    this.setState({
      associationsType: 'tags'
    });
  }

  editTag(tag) {
    this.setState({
      editMode: 'tag',
      editName: tag
    });
    window.scrollTo(0, 0);
  }

  changeAlerts() {
    this.setState({
      associationsType: 'alerts'
    });
  }

  setAssociations(assocations){
    this.setState({
      associations: assocations
    });
  }

  toggleAssociation(association) {
    const { associations } = this.state;
    let newAssociations = [...associations];
    if (newAssociations.includes(association)) {
      newAssociations.splice(newAssociations.indexOf(association), 1);
    }
    else {
      newAssociations.push(association);
    }
    this.setState({
      associations: newAssociations
    });
  }

  resetAlerts() {
    this.setState({
      editName: null,
      associations: [],
      associationsType: null
    }, () => {
      this.alertsRef.current.resetAlerts();
    });
  }

  switchMode(mode) {
    this.setState({
      editName: null,
      editMode: mode
    });
  }

  render() {
    const { editMode, editName, associations, associationsType } = this.state;
    
    return (
        <div>
          <UserDetails />
          <div className="header-wrapper">
            <Overlay />
            <CustomAlert
              name={editName}
              editMode={editMode}
              associations={associations}
              setAssociations={this.setAssociations}
              resetAlerts={this.resetAlerts}
              switchMode={this.switchMode}
              changeAlerts={this.changeAlerts}
              changeTags={this.changeTags}
            />
          </div>
          {/* <Lights /> */}
          <Alerts
            ref={this.alertsRef}
            associationsType={associationsType}
            associations={associations}
            editAlert={this.editAlert}
            editTag={this.editTag}
            toggleAssociation={this.toggleAssociation}
          />
        </div>
    )
  }
}

export default Home;
