document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['redditSuggestions', 'stackExchangeSuggestions'], (result) => {
    const redditSuggestions = result.redditSuggestions || [];
    const stackExchangeSuggestions = result.stackExchangeSuggestions || [];
    
    const redditSuggestionsDiv = document.getElementById('reddit-suggestions');
    const stackExchangeSuggestionsDiv = document.getElementById('stackexchange-suggestions');

    if (redditSuggestions.length === 0) {
      redditSuggestionsDiv.innerHTML = '<p>No suggestions found for Reddit.</p>';
    } else {
      redditSuggestions.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        const postLink = document.createElement('a');
        postLink.href = post.url;
        postLink.target = '_blank';
        postLink.innerText = post.title;

        postDiv.appendChild(postLink);
        redditSuggestionsDiv.appendChild(postDiv);
      });
    }

    if (stackExchangeSuggestions.length === 0) {
      stackExchangeSuggestionsDiv.innerHTML = '<p>No suggestions found for Stack Exchange.</p>';
    } else {
      stackExchangeSuggestions.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        const postLink = document.createElement('a');
        postLink.href = post.url;
        postLink.target = '_blank';
        postLink.innerText = post.title;

        postDiv.appendChild(postLink);
        stackExchangeSuggestionsDiv.appendChild(postDiv);
      });
    }
  });
});
