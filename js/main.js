/* App class */
class App {
  constructor() {
    this._API_URL = 'https://gitlab.com/api/v4';

    this._$content = $('#app');

    const config = $('<div>', {id: 'config'});
    this._$content.append(config);

    const tokenContainer = $('<div>', {class: 'token'});
    const tokenLabel = $('<label>', {'for': 'id-token'}).text('Gitlab Access Token');

    this._$tokenInput = $('<input>', 
      {id: 'id-token', 'type': 'text'});
    try{
      this._$tokenInput.val(this._getToken());
    } catch {
      console.log('no token found in cache');
    }

    tokenContainer.append(tokenLabel, this._$tokenInput);
    config.append(tokenContainer);

    const listProjectsBtn = $('<button>', {id: 'id-list-projects-btn'})
      .text('List Projects')
      .on('click', this._listProjects.bind(this));
    config.append(listProjectsBtn);


    const projectsListContainer = $('<div>', {class: 'projects-list'});
    const projectsListLabel = $('<label>', {'for': 'id-projects-list'}).text('Projects List');
    this._$projectsList = $('<select>', {id: 'id-projects-list'});
    projectsListContainer.append(projectsListLabel, this._$projectsList);
    config.append(projectsListContainer);


    const listIssuesBtn = $('<button>', {id: 'id-list-projects-btn'})
    .text('List Issues')
    .on('click', this._listIssues.bind(this));

    const issuesListLabel = $('<label>', {'for': 'id-issues-list', class:'issues-list'}).text('Issues List');
    this._$issuesList = $('<select>', {id: 'id-issues-list', class:'issues-list'});
    config.append(listIssuesBtn, issuesListLabel, this._$issuesList);


    // TODO : create branches from, on projects

    const multiSelectProjectContainer = $('<div>', {class:'multi-projects-list'});
    this._$multiProjects = $('<select>', {'multiple': true});
    console.log(this._$multiProjects);
    multiSelectProjectContainer.append(this._$multiProjects);
    config.append(multiSelectProjectContainer);

  }

  _listProjects() {

    fetch(`${this._API_URL}/projects?membership=yes`, 
      {headers: this._getHeaders()})
    .then((results) => {
      return results.json();
    }).then((repos) => { 
      console.log(repos);
      this._$projects = repos;
      for(var i in repos) {
        let opt = $('<option>').val(repos[i].id).text(repos[i].name);
        this._$projectsList.append(opt);
        let opt2 = $('<option>').val(repos[i].id).text(repos[i].name);
        this._$multiProjects.append(opt2);
      }
    }).catch((error) => { console.log(error)});
  }

  _listIssues() {
    // our reference project.
    const projectId = this._getSelectedProjectId();
    fetch(`${this._API_URL}/projects/${projectId}/issues?state=opened`, {headers: this._getHeaders()})
    .then((result) => {
      return result.json();
    })
    .then((issues) => {
      console.log(issues);
      for(var i in issues) {
        let opt = $('<option>').val(issues[i].id).text(issues[i].title);
        this._$issuesList.append(opt);
      }
    })
    .catch((error) => { 
      console.log(error);
    });
  }

  _getToken() {
    // check cache: 
    let cached_token = localStorage.getItem('token');

    if (!!cached_token) {
      return cached_token;
    }

    const tk = this._$tokenInput.val();
    if (!tk) {
      throw 'Missing token';
    } else {
      localStorage.setItem('token', tk);
      return tk;
    }
  }

  _getHeaders() {
    const headers = new Headers();
    headers.append('Private-Token', this._getToken());

    return headers;
   }

  _getSelectedProjectId() {

    const val =  this._$projectsList.val();
    if (!val) {
      throw 'No project selected, You need to fetch projects first';
    }

    return val;
  }
}

const myApp = new App();
