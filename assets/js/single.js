let issueContainerEl = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");

function getRepoName() {
    let queryString = document.location.search;
    let repoName = queryString.split("=")[1];
    if(repoName){
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        document.location.replace("./index.html");
    }
} 

function getRepoIssues(repo) {

    let apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
    fetch(apiUrl).then(function (response) {
        //request was successful
        if(response.ok) {
            response.json().then(function(data){
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
    console.log(repo);
}

function displayIssues(issues){
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no issues!";
        return;
    }
   
    for (let i = 0; i < issues.length; i++) {
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue titleEl
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type createElement
        let typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if(issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)"
        }

        //append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
}

function displayWarning(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visist ";

    let linkEl = document.createElement("a");
    linkEl.textContent = "see more issues on GitHub.com";
    linkEl.setAttribute("href", `https://github.com/${repo}/issues`);
    linkEl.setAttribute("target", "_blank");

    limitWarningEl.appendChild(linkEl);
}

getRepoName();