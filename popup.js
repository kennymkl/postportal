document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['selectedText', 'redditSuggestions', 'stackOverflowSuggestions'], (result) => {
    const selectedText = result.selectedText || '';
    const redditSuggestions = result.redditSuggestions || [];
    const stackExchangeSuggestions = result.stackOverflowSuggestions || [];
    
    const selectedTextDiv = document.getElementById('selected-text');
    const redditSuggestionsDiv = document.getElementById('reddit-suggestions');
    const stackExchangeSuggestionsDiv = document.getElementById('stackoverflow-suggestions');

    // Display selected text
    selectedTextDiv.innerText = selectedText;

    // Create dropdown icon
    const createDropdownIcon = (postDiv, stats) => {
      const dropdownIcon = document.createElement('span');
      dropdownIcon.innerHTML = '&#9660;'; // Down arrow icon
      dropdownIcon.className = 'dropdown-icon';
      dropdownIcon.onclick = () => {
        const content = postDiv.querySelector('.dropdown-content');
        content.classList.toggle('show');
      };

      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'dropdown-content';
      dropdownContent.innerHTML = `
        <p>Upvotes: ${stats.upvotes}</p>
        <p>Comments: ${stats.comments}</p>
        <p>Date: ${stats.date}</p>
      `;

      postDiv.appendChild(dropdownIcon);
      postDiv.appendChild(dropdownContent);
    };

    // Function to create post elements
    const createPostElement = (post) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';

      const postLink = document.createElement('a');
      postLink.href = post.url;
      postLink.target = '_blank';
      postLink.innerText = post.title;

      postDiv.appendChild(postLink);
      createDropdownIcon(postDiv, post.stats);

      return postDiv;
    };

    // Display Reddit suggestions
    if (redditSuggestions.length === 0) {
      redditSuggestionsDiv.innerHTML = '<p>No suggestions found for Reddit.</p>';
    } else {
      redditSuggestions.forEach(post => {
        const postDiv = createPostElement(post);
        redditSuggestionsDiv.appendChild(postDiv);
      });
    }

    // Display Stack Overflow suggestions
    if (stackExchangeSuggestions.length === 0) {
      stackExchangeSuggestionsDiv.innerHTML = '<p>No suggestions found for Stack Exchange.</p>';
    } else {
      stackExchangeSuggestions.forEach(post => {
        const postDiv = createPostElement(post);
       
        stackExchangeSuggestionsDiv.appendChild(postDiv);
      });
    }
  });
});
