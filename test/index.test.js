/** @type {import('chai')} */
const chai = window.chai;
const expect = chai.expect;
const assert = chai.assert;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Twiddler', () => {
  before(async () => {
    if (window.__ci) {
      // If running in CI, wait for the page to load and the data generator to finish
      await wait(1000);
    }
  });
  it('should group tweets into a div with the class "tweets"', () => {
    expect($('.tweets').length).to.be.above(0);
  });

  it('should have at least 10 tweets', () => {
    expect($('.tweet').length).to.be.at.least(10);
  });

  it('should ensure that the timestamps of tweets reflect the actual creation time', () => {
    const $tweets = $('.tweet');

    const testTweets = [$tweets.first(), $tweets.last()];

    testTweets.forEach((tweet) => {
      const timestamp = $(tweet).find('.timestamp');

      if (!timestamp.length) {
        assert.fail(
          'Expected to find an element with the class "timestamp" inside the tweet.'
        );
      }

      const $message = $(tweet).find('.message').first();

      if (!$message.length) {
        assert.fail(
          'Expected to find an element with the class "message" inside the tweet.'
        );
      }

      const message = $message.text();

      const tweetObj = streams.home.find((tweet) => tweet.message === message);
      const tweetTime = returnTimestamp(tweetObj.created_at);
      const tweetTimeStrings = tweetTime.toString().split(' ').slice(0, 5);

      const tweetTimeStrFormatted = tweetTimeStrings.join(' ');

      expect(timestamp.text()).to.include(tweetTimeStrFormatted);
    });
  });

  it('should have the human friendly timestamps: "x seconds ag", "x minutes ago"', () => {
    const $tweets = $('.tweet');

    const testTweets = [$tweets.first(), $tweets.last()];

    testTweets.forEach((tweet) => {
      const $message = $(tweet).find('.message');

      if (!$message.length) {
        assert.fail(
          'Expected to find an element with the class "message" inside the tweet.'
        );
      }
      const $humanFriendlyTimestamp = $(tweet).find('.humanFriendlyTimestamp');

      if (!$humanFriendlyTimestamp.length) {
        assert.fail(
          'Expected to find an element with the class "humanFriendlyTimestamp" inside the tweet.'
        );
      }

      const message = $message.text();
      const tweetObj = streams.home.find((tweet) => tweet.message === message);
      const tweetTime = returnTimestamp(tweetObj.created_at, 'humanFriendly');

      expect($humanFriendlyTimestamp.text()).to.include(tweetTime);
    });
  });

  it("should show the user's timeline when the username is clicked", async () => {
    const $tweets = $('.tweet');
    const $randomTweet = $(
      $tweets.get(Math.floor(Math.random() * $tweets.length))
    );
    const $username = $randomTweet.find('.username').first();

    if (!$username.length) {
      assert.fail(
        'Expected to find an element with the class "username" inside the tweet.'
      );
    }

    const usernameText = $username.text();

    // Trigger click event
    $username.trigger('click');

    // Wait for tweets to be cleared and new ones to appear
    await wait(500);

    const $tweetsAfterClick = $('.tweet');

    $tweetsAfterClick.each((_index, tweet) => {
      const tweetUsername = $(tweet).find('.username').text();
      expect(tweetUsername).to.equal(usernameText);
    });
  });

  it('should allow the user to submit new tweets', async () => {
    const $usernameInput = $('#username-input').first();
    const $messageInput = $('#message-input').first();
    const $submit = $('input[type="submit"]').first();

    const message = 'This is a test message';

    $usernameInput.val('halle');

    $messageInput.val(message);

    $submit.trigger('click');

    const $tweets = $('.tweet');

    const tweetMessages = Array.from(
      $tweets.map((_index, tweet) => $(tweet).find('.message').text())
    );

    expect(tweetMessages).to.include(message);
  });

  it('should display new tweets at the top of the page', async () => {
    // 1. Add a new tweet
    // 2. check if a button with an id of 'new-tweet' exists
    // 3. click button to render tweets that have been added since the last check
    // 4. check if the first tweet is different from the first tweet before the click

    const $tweets = $('.tweet');
    const firstTweet = $tweets.first().text();

    const $newTweetsButton = $('#new-tweets-button').first();

    if (!$newTweetsButton.length) {
      assert.fail(
        'No button with id "new-tweets-button" found. Please check the HTML.'
      );
    }

    // Wait for new tweets to be added by `scheduleNextTweet()`
    await wait(1500);

    $newTweetsButton.trigger('click');

    // Get the new first tweet
    const $newTweets = $('.tweet');
    const newFirstTweet = $newTweets.first().text();

    // the tweets should be different
    expect(newFirstTweet).to.not.equal(firstTweet);
  });
});

function returnTimestamp(date, type) {
  return type !== 'humanFriendly'
    ? moment(date).format('MMMM Do YYYY, h:mm:ss a')
    : moment(date).fromNow();
}
