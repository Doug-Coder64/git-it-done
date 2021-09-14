const userFormEl = document.querySelector("#user-form");
const nameInputEl = document.querySelector("#username");
const repoContainerEl = document.querySelector("#repo-container");
const repoSearchTerm = document.querySelector("#repo-search-term");

userFormEl.addEventListener("submit", formSubmitHandler);

function getUserRepos(user){
    let apiUrl = `https://api.github.com/users/${user}/repos`;
    
    //requsts to apiUrl
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayRepos(data,user);
            });
        } else {
            alert("Error: GitHub user not found");
        }
    }).catch(function(error){
        alert("Unable to connect to GitHub");
    });
}

function formSubmitHandler(event) {
    let username = nameInputEl.value.trim();

    event.preventDefault();
    if (username){
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        window.alert("Please enter a GitHub username");
    }

    console.log(event);
}

function displayRepos(repos, searchTerm) {
    repoContainerEl.textContent= "";
    repoSearchTerm.textContent = searchTerm;
    
    if (repos.length === 0) {
        repoContainerEl.textContent = "no repositories found.";
        return;
    }
    for (let i = 0; i < repos.length; i++) {
        //formatting repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", `./single-repo.html?repo=${repoName}`);

        //create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issue or not
        if (repos[i].open_issues_count > 0){
            statusEl.innerHTML = 
             "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}