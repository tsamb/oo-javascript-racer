$(document).ready(function(){
  Game.start(BlockingDataCollection.getPlayerNamesAndKeys())
  // Game.start([[]])
});

function Game(options) {
  // invariants
  this.players = getGameInfo(); // disentangle by modularizing as per driver code above /
  this.container = $(".racer-table");
  this.trackLength = options.trackLength || 20;

  // gamestate
  this.finished = false;
  this.winner = null;

  // this.drawBoard();
  // this.handleKeyUp();
}

Game.start(options) {
  var g = new Game(options)
  g.drawBoard()
  g.handleKeyUp()
}

Game.prototype.drawBoard = function() {
  var game = this;
  // $.each(this.players, function(index, player) {
  this.players.forEach(function(player, index) {
    game.container.append("<tr id='" + player.name + "-track'></tr>"); // disentangle this into createElement namespace
    var remainingTrackPiecesToDraw = this.trackLength;

    var rowsHTML = ''
    while (remainingTrackPiecesToDraw--) rowsHTML += "<td></td>"
    range(0,this.trackLength).reduce

    player.$track = $("#" + player.name + "-track");
    for (i = 0; i < game.trackLength; i++) {
      player.$track.append("<td></td>");
    }
    this.activateFirstCellForPlayer()
    // player.$track.children().first().addClass("active");
    player.$track.find('.cell:first-child').addClass("active"); // game logic shouldn't know/care about the exact structure of the DOM
  });
}

Game.prototype.handleEvents = function() {
  this.focusableElement.on('keyup', extractLetterPressed(movePlayerFromKey))
}

Game.prototype.handleKeyUp = function() {
  game = this;
  $.each(this.players, function(index, player) {
    $(document).keyup(function(event) {
      if (event.keyCode == player.key) {
        player.move();
        game.checkForFinish();
      }
    });
  });
}

Game.prototype.checkForFinish = function() {
  game = this;
  $.each(this.players, function(index, player) {
    if (player.$track.children().last().hasClass("active")) game.finishEvent(player);
  })
}

Game.prototype.finishEvent = function(winningPlayer) {
  $(document).off(); // unbind key listeners
  this.finished = true;
  this.winner = winningPlayer;
  // TODO: send winning player info to view
}

function Player(num, name, key) {
  this.name = name;
  this.num = num;
  this.key = key;
  this.position = 0;
};

Player.prototype.move = function() {
  this.$track.children().eq(this.position).removeClass("active")
  this.position += 1;
  this.$track.children().eq(this.position).addClass("active")
};

function getGameInfo() {
  var numberOfPlayers = prompt("How many players?");
  var players = createPlayers(numberOfPlayers);
  return players;
};

function createPlayers(num) {
  var players = [];
  for ( i=0; i < num; i++ ) {
    var name = BlockingDataCollection.nameForNumericallyIndexedPlayer(i+1);
    var key = prompt( name + ", please choose your key.").charCodeAt(0) - 32;
    players[i] = new Player(i+1, name, key);
  }
  return players;
};

var playerNamesAndKeys = BlockingDataCollection.getPlayerNamesAndKeys()

// playerNamesAndKeys
[[ 'myles', 'm' ], ['sam', 's' ] ]


// ---

var BlockingDataCollection = {}

BlockingDataCollection.nameForNumericallyIndexedPlayer = function(num) {
  return prompt("Player " + num + ", what is your name?");
}

BlockingDataCollection.getPlayerNamesAndKeys = function() {
  var players = [];
  var count = parseInt(this.playerCount());
  for (i = 1; i <= count; i++) {
    players.push(this.nameForNumericallyIndexedPlayer(i));
  }
  return players;
}

BlockingDataCollection.playerCount = function() {
  return prompt("How many players?");
}
// ---


