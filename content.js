chrome.storage.local.get(["selectedText"], async (result) => {
  const selectedText = result.selectedText;
  console.log('Selected text:', selectedText); 

  const redditPosts = await fetchFromReddit(selectedText);
  const stackExchangePosts = await fetchFromStackExchange(selectedText);

  console.log('Fetched Reddit posts:', redditPosts); 
  console.log('Fetched Stack Exchange posts:', stackExchangePosts); 

  //Store posts in local storage
  chrome.storage.local.set({ redditSuggestions: redditPosts, stackExchangeSuggestions: stackExchangePosts }, () => {
    console.log('Suggestions stored in local storage');
  });

  
  chrome.runtime.sendMessage({ action: 'createNotification' }, (response) => {
    console.log('Notification request sent'); // Debug log
  });
});

async function fetchFromReddit(query) {
  try {
    const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data.children.map(post => ({
      title: post.data.title,
      url: `https://www.reddit.com${post.data.permalink}`
    }));
  } catch (error) {
    console.error('Error fetching from Reddit:', error); // Debug log
    return [];
  }
}

async function fetchFromStackExchange(query) {
  try {
    const response = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&site=stackoverflow&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.items.map(post => ({
      title: post.title,
      url: post.link
    }));
  } catch (error) {
    console.error('Error fetching from Stack Exchange:', error); // Debug log
    return [];
  }
}
