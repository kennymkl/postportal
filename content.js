chrome.storage.local.get(["selectedText"], async (result) => {
  const selectedText = result.selectedText;
  console.log('Selected text:', selectedText); // Debug log

  const redditPosts = await fetchFromReddit(selectedText);
  const stackOverflowPosts = await fetchFromStackOverflow(selectedText);

  console.log('Fetched Reddit posts:', redditPosts); // Debug log
  console.log('Fetched Stack Overflow posts:', stackOverflowPosts); // Debug log

  chrome.storage.local.set({
    selectedText: selectedText,
    redditSuggestions: redditPosts,
    stackOverflowSuggestions: stackOverflowPosts
  }, () => {
    console.log('Suggestions and selected text stored in local storage');
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
      url: `https://www.reddit.com${post.data.permalink}`,
      stats: {
        upvotes: post.data.ups,
        comments: post.data.num_comments,
        date: new Date(post.data.created_utc * 1000).toLocaleDateString(),
        tags: "r/"+post.data.subreddit,
        credibility: post.data.total_awards_received
      }
    }));
  } catch (error) {
    console.error('Error fetching from Reddit:', error); // Debug log
    return [];
  }
}

async function fetchFromStackOverflow(query) {
  try {
    const response = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&site=stackoverflow&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.items.map(post => ({
      title: post.title,
      url: post.link,
      stats: {
        upvotes: post.score,
        comments: post.answer_count,
        date: new Date(post.creation_date * 1000).toLocaleDateString(),
        tags: post.tags,
        credibility: post.owner.reputation
      }
    }));
  } catch (error) {
    console.error('Error fetching from Stack Overflow:', error); // Debug log
    return [];
  }
}
