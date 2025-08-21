// These DOM elements must be loaded before `src/index.js` is run
mocha.setup('bdd');

$(document.head).append('<title>Twiddler</title>');

$(document.body).append(`<div id="all-contents"></div>`);

$('#all-contents').load('twiddler.html', () => mocha.run());
