/* App class */
class App {
  constructor() {
    this._API_URL = 'https://gitlab.com/api/v4';

    this._$content = document.querySelector('#app');

    const $config = document.createElement('div');
    $config.id = 'config';
    this._$content.appendChild($config);


    const $tokenContainer = document.createElement('div');
    $tokenContainer.class = 'token';
    $config.appendChild($tokenContainer);

    const $tokenLabel = document.createElement('label');
    $tokenLabel.for = 'id-token';
    $tokenLabel.innerText = 'Gitlab Access Token';
    $tokenContainer.appendChild($tokenLabel);

    this._$tokenInput = document.createElement('input');
    this._$tokenInput.id = 'id-token';
    this._$tokenInput.type = 'text';

    $tokenContainer.appendChild(this._$tokenInput);

    try {
      this._$tokenInput.innerHTML = this._getToken();
    } catch {
      console.log('no token found in cache');
    }

    const $listProjectsBtn = document.createElement('button');
    $listProjectsBtn.id = 'id-list-projects-btn';
    $listProjectsBtn.innerText = 'List Projects';
    
    $listProjectsBtn.addEventListener('click', this._listProjects.bind(this));
    $config.appendChild($listProjectsBtn);

    // TO DO - Convert to pure JavaScript.
    // const projectsListContainer = $('<div>', {class: 'projects-list'});
    // const projectsListLabel = $('<label>', {'for': 'id-projects-list'}).text('Projects List');
    // this._$projectsList = $('<select>', {id: 'id-projects-list'});
    // projectsListContainer.append(projectsListLabel, this._$projectsList);
    // config.append(projectsListContainer);


    // const listIssuesBtn = $('<button>', {id: 'id-list-projects-btn'})
    // .text('List Issues')
    // .on('click', this._listIssues.bind(this));

    // const issuesListLabel = $('<label>', {'for': 'id-issues-list', class:'issues-list'}).text('Issues List');
    // this._$issuesList = $('<select>', {id: 'id-issues-list', class:'issues-list'});
    // config.append(listIssuesBtn, issuesListLabel, this._$issuesList);


    // // TODO : create branches from, on projects

    // const multiSelectProjectContainer = $('<div>', {class:'multi-projects-list'});
    // this._$multiProjects = $('<select>', {'multiple': true});
    // console.log(this._$multiProjects);
    // multiSelectProjectContainer.append(this._$multiProjects);
    // config.append(multiSelectProjectContainer);

    // const createBranchesBtn = $('<button>', {id: 'create-braches-btn'})
    // .text('Create Branches')
    // .on('click', this._createBranches.bind(this));

    // config.append(createBranchesBtn);

  }

  _listProjects() {
    fetch(`${this._API_URL}/projects?membership=yes`, 
      {headers: this._getHeaders()})
    .then((results) => {
      return results.json();
    }).then((repos) => { 
      console.log(repos);
      this._$projects = repos;
      for(let i in repos) {
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
      for(let i in issues) {
        let opt = $('<option>').val(issues[i].iid).text(issues[i].title);
        this._$issuesList.append(opt);
      }
    })
    .catch((error) => { 
      console.log(error);
    });
  }

  _createBranches() {
    const thiz = this;
    // we need a list of projects, and an issue
    // Projects:
    const selectedProjects = this._$multiProjects.val();
    if (selectedProjects.length === 0) {
      console.error('you need to select at least a project');
      return;
    }

    // TODO 
    // issue:
    const selectedIssue = this._$issuesList.val();


    if (!selectedIssue) {
      console.error('You need to select an issue');
      return;
    }

    console.log(this._$projectsList);
    const fromBranch = 'master';
    const branchName = `PM-${selectedIssue}`;

    for(let i in selectedProjects){

      const projectId = selectedProjects[i];
      fetch(`${this._API_URL}/projects/${projectId}/repository/branches?branch=${branchName}&ref=${fromBranch}`,
        {method: 'POST', headers: this._getHeaders()})
      .then((result) => { console.log(result);})
      .catch((error) => { console.log(error);});;
    }

  }

  _getToken() {
    // check cache: 
    let cached_token = localStorage.getItem('token');

    if (!!cached_token) {
      return cached_token;
    }

    const tk = this._$tokenInput.innerHTML;
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
    const val = this._$projectsList.val();
    if (!val) {
      throw 'No project selected, You need to fetch projects first';
    }

    return val;
  }
}

const myApp = new App();
