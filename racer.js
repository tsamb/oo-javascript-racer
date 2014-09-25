$(document).ready(function(){
  // var options = {players: BlockingDataCollection.getPlayerNamesAndKeys()}
  // options stub:
  var options = {players: [["Sam", 83],["Paul", 80]]}
  Game.start(options);
});

function Game(options) {
  // invariants
  // this.players = getGameInfo(); // disentangle by modularizing as per driver code above /
  this.players = this.buildPlayers(options.players) // player construction method here somewhere... how do we add a default here?
  this.container = $(".racer-table");
  this.trackLength = options.trackLength || 20;

  // gamestate
  this.finished = false;
  this.winner = null;

  // this.drawBoard();
  // this.handleKeyUp();
}

Game.start = function(options) {
  var g = new Game(options);
  g.drawBoard();
  g.handleKeyUp();
}

Game.prototype.buildPlayers = function(rawPlayers) {
  players = [];
  rawPlayers.forEach(function(playerData) {
    players.push(new Player({ name: playerData[0], key: playerData[1] }));
  });
  console.log(players);
  return players;
}

Game.prototype.drawBoard = function() {
  var game = this;
  // $.each(this.players, function(index, player) {
  this.players.forEach(function(player, index) {
    game.container.append(CreateElement.playerTrack(player.name)); // disentangle this into createElement namespace

    // var remainingTrackPiecesToDraw = this.trackLength;

    // var rowsHTML = ''
    // while (remainingTrackPiecesToDraw--) rowsHTML += "<td></td>"

    var trackPieces = CreateElement.trackPieces(this.trackLength)

    player.$track = $("#" + player.name + "-track");
    player.$track.append(trackPieces);
    // for (i = 0; i < game.trackLength; i++) {
    //   player.$track.append("<td></td>");
    // }
    player.activateFirstTrackPiece();
    // player.$track.children().first().addClass("active");
    // player.$track.find('.cell:first-child').addClass("active"); // game logic shouldn't know/care about the exact structure of the DOM
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

function Player(options) {
  this.name = options.name;
  this.key = options.key;
  this.position = 0;
};

Player.prototype.move = function() {
  this.$track.children().eq(this.position).removeClass("active")
  this.position += 1;
  this.$track.children().eq(this.position).addClass("active")
};

Player.prototype.activateFirstTrackPiece = function() {
  View.activateFirstTrackPiece(player.$track);
}

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

// var playerNamesAndKeys = BlockingDataCollection.getPlayerNamesAndKeys()

// playerNamesAndKeys
// [[ 'myles', 'm' ], ['sam', 's' ] ]


// ---

var View = {
  TRACK_PIECE_CLASS = ".track-piece"
}

View.activateFirstTrackPiece = function($track) {
  $track.find('.track-piece:first-child').addClass("active")
}

var CreateElement = {}

CreateElement.playerTrack = function(playerName) {
  return"<tr id='" + playerName + "-track'></tr>"
}

CreateElement.trackPieces = function(num) {
  return range(0,num).map(function(){return "<td class='track-piece'></td>"}).join("");
}

// ---

var BlockingDataCollection = {}

BlockingDataCollection.nameForPlayer = function(num) {
  return prompt("Player " + num + ", what is your name?");
}

BlockingDataCollection.keyToKeyCode = function(key) {
  return key.charCodeAt(0) - 32
}

BlockingDataCollection.keyForPlayer = function(name) {
  return prompt(name + ", what key do you want to use?");
}

BlockingDataCollection.keyCodeForPlayer = function(name) {
  var playerKey = this.keyForPlayer(name);
  return this.keyToKeyCode(playerKey);
}

BlockingDataCollection.getPlayerNamesAndKeys = function() {
  var players = [];
  var count = parseInt(this.playerCount());
  for (i = 1; i <= count; i++) {
    var player = [];
    player.push(this.nameForPlayer(i));
    player.push(this.keyCodeForPlayer(player[0]));
    players.push(player);
  }
  // console.log(players);
  return players;
}

BlockingDataCollection.playerCount = function() {
  return prompt("How many players?");
}
// ---

function range(start, end) {
  var range = [];
  for (i = start; i < end; i++) {
    range.push(i);
  }
  return range;
}

