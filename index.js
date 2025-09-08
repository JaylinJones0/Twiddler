// Returns a timestamp in formatted or human-readable form
function returnTimestamp(date, format) {
  if (format === 'humanFriendly') {
    return moment(date).fromNow();
  } else {
    return moment(date).format('ddd MMM DD YYYY HH:mm:ss');
  }
}

$(() => {
  const $page = $('#all-contents');

  // Dynamically create tweet submission form
  const $form = $(`
    <form id="tweet-form">
      <input type="text" id="username-input" placeholder="Username" required />
      <input type="text" id="message-input" placeholder="Message" required />
      <input type="submit" value="Submit" />
    </form>
  `);
  $page.append($form);

  // Create button to show new tweets
  const $newTweetsButton = $('<button id="new-tweets-button">Show New Tweets</button>');
  $page.append($newTweetsButton);

  // Container for tweets
  const $tweetsDiv = $('<div class="tweets"></div>');
  $page.append($tweetsDiv);

  // Keeps track of how many tweets have been shown
  let lastRenderedIndex = 0;

  // Render tweet array to page
  function renderTweetElement(tweet) {
    const $tweet = $('<div class="tweet"></div>');

    const $username = $('<span class="username"></span>').text(`@${tweet.user}`);
    const $header = $('<div class="header"></div>').append($username).append(`: ${tweet.message}`);
    $tweet.append($header);

    const $timestamp = $('<div class="timestamp"></div>').text(returnTimestamp(tweet.created_at));
    $tweet.append($timestamp);

    const $humanFriendlyTimestamp = $('<div class="humanFriendlyTimestamp"></div>').text(
      returnTimestamp(tweet.created_at, 'humanFriendly')
    );
    $tweet.append($humanFriendlyTimestamp);

    return $tweet;
  }

  // Initial render
  streams.home.forEach((tweet) => {
    const $tweetElem = renderTweetElement(tweet);
    $tweetsDiv.prepend($tweetElem);
  });
  lastRenderedIndex = streams.home.length;

  // Filter by username
  $(document).on('click', '.username', function () {
    const username = $(this).text().replace('@', '');
    const userTweets = streams.users[username] || [];

    $tweetsDiv.empty();
    userTweets.slice().reverse().forEach((tweet) => {
      const $tweetElem = renderTweetElement(tweet);
      $tweetsDiv.append($tweetElem);
    });
  });

  // Submit tweet
  $('form').on('submit', function (event) {
    event.preventDefault();

    const username = $('#username-input').val().trim();
    const message = $('#message-input').val().trim();

    if (!username || !message) {
      alert('Please enter both username and message!');
      return;
    }

    const newTweet = {
      user: username,
      message: message,
      created_at: new Date()
    };

    // Push new tweet to data
    streams.home.push(newTweet);
    if (!streams.users[username]) {
      streams.users[username] = [];
    }
    streams.users[username].push(newTweet);

    // Render new tweet immediately at the top
    const $tweetElem = renderTweetElement(newTweet);
    $tweetsDiv.prepend($tweetElem);

    // Update the index to avoid showing it again from "new tweets" button
    lastRenderedIndex = streams.home.length;

    // Clear input fields
    $('#username-input').val('');
    $('#message-input').val('');
  });

  // Show new tweets when button clicked
  $('#new-tweets-button').on('click', function () {
    const newTweets = streams.home.slice(lastRenderedIndex);
    if (newTweets.length > 0) {
      newTweets.reverse().forEach((tweet) => {
        const $tweetElem = renderTweetElement(tweet);
        $tweetsDiv.prepend($tweetElem);
      });
      lastRenderedIndex = streams.home.length;
    }
  });
});
