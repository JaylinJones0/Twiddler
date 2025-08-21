$(() => {
  const $page = $('#all-contents');

  const $tweetsDiv = $('<div class="tweets"></div>');

  $page.append($tweetsDiv);

  const $tweets = streams.home.map((tweet) => {
    const $tweet = $('<div class="tweet"></div>');
    const text = `@${tweet.user}: ${tweet.message}`;

    $tweet.text(text);

    return $tweet;
  });

  $tweetsDiv.append($tweets);
});
