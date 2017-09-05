var searchIdx;

(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  function initIdx() {
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
    
      for (var key in window.store) { // Add the data to lunr
        this.add({
          'id': key,
          'title': window.store[key].title,
          'author': window.store[key].author,
          'category': window.store[key].category,
          'content': window.store[key].content
        });
      }
    });

    return idx;
  }

  function doSearch(searchTerm)
  {
    //var results = idx.search(searchTerm); // Get lunr to perform a search
    var results = searchIdx.query(function (q) {
      q.term("*" + searchTerm + "*")
    });
    displaySearchResults(results, window.store); // We'll write this in the next section
  }

  document.getElementById('search-button').onclick = function()
  {
    searchTerm = document.getElementById('search-box').value;
    doSearch(searchTerm);

    return false;
  }

  var searchTerm = getQueryVariable('query');
  searchIdx = initIdx();
  
  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);
    doSearch(searchTerm);
  }
})();
