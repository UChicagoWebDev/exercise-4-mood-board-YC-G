const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  var searchTerm = document.getElementById('searchBar').value.trim();
  var bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
  let url = bing_api_endpoint + "?q=" + encodeURIComponent(searchTerm);

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("Ocp-Apim-Subscription-Key", BING_API_KEY);
  request.responseType = 'json';
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to add event listeners to them after you add them to the DOM
  //

  request.addEventListener('load', function(event) {
    if (request.status >= 200 && request.status < 300) {
      var resultsContainer = document.getElementById('resultsImageContainer');
      resultsContainer.innerHTML = ''; 
      var images = event.target.response.value; 

      images.forEach(function(image) {
        var imgElement = document.createElement('img');
        imgElement.src = image.thumbnailUrl;
        imgElement.alt = image.name;
        imgElement.style.margin = '10px';
        imgElement.addEventListener('click', function() {
          addToMoodBoard(image.thumbnailUrl, image.name);
        });
        resultsContainer.appendChild(imgElement);
      });

      var conceptsContainer = document.getElementById('relatedConceptsContainer');
      conceptsContainer.innerHTML = ''; 
      var concepts = event.target.response.relatedSearches; 
      console.log(concepts);

      concepts.forEach(function(concept) {
        var conceptElement = document.createElement('div');
        conceptElement.textContent = concept.text; 
        conceptElement.style.margin = '10px';
        conceptElement.addEventListener('click', function() {
          document.getElementById('searchBar').value = concept.text;
          runSearch();
        });
        conceptsContainer.appendChild(conceptElement);
      });
    } else {
      console.error('Request failed. Returned status of ' + request.status);
    }
  });

  request.addEventListener('error', function(event) {
    console.error('Network error occurred.');
  });

  

  
  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function addToMoodBoard(imageUrl, imageName) {
  var moodBoardContainer = document.getElementById('board');
  var imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  imgElement.alt = imageName;
  imgElement.style.margin = '10px';
  moodBoardContainer.appendChild(imgElement);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
