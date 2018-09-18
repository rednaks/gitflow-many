/* App class */
class App {
  constructor() {
    this._API_URL = 'https://gitlab.com/api/v4';

    this._$content = $('#app');

    const config = $('<div>', {id: 'config'});
    this._$content.append(config);

    const tokenLabel = $('<label>', {'for': 'id-token', class: 'token'}).text('Access Token');

    this._$tokenInput = $('<input>', {id: 'id-token', 'type': 'text', class:'token'});
    config.append(tokenLabel, this._$tokenInput);

    const listProjectsBtn = $('<button>', {id: 'id-list-projects-btn'})
      .text('List Projects')
      .on('click', this._listProjects.bind(this));
    config.append(listProjectsBtn);


    const projectsListLabel = $('<label>', {'for': 'id-projects-list', class:'projects-list'}).text('Projects List');
    this._$projectsList = $('<select>', {id: 'id-projects-list', class:'projects-list'});
    config.append(projectsListLabel, this._$projectsList);


    const issuesListLabel = $('<label>', {'for': 'id-issues-list', class:'issues-list'}).text('Issues List');
    this._$issuesList = $('<select>', {id: 'id-issues-list', class:'issues-list'});
    config.append(issuesListLabel, this._$issuesList);

  }

  _listProjects() {
    // TODO
    const headers = new Headers();
    if (this.token === undefined) {
      tok
    }
    // TODO
    headers.append('', '');

    // TODO 
    fetch(`${this._API_URL}/projects?membership=yes`);
  }

}

const myApp = new App();
