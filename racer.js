$(document).ready(function(){
  var options = {
                  trackLength: BlockingDataCollection.getTrackLength(),
                  players: BlockingDataCollection.getPlayerNamesAndKeys()
                }
  // options stub:
  // var options = {players: [["Sam", "s"],["Paul", "p"]]}
  Game.start(options);
});

// --- Game model
function Game(options) {
  // invariants
  this.players = this.buildPlayers(options.players);
  this.$container = $(View.CONTAINER_ELEMENT);
  this.trackLength = options.trackLength || 20;

  // gamestate
  this.finished = false;
  this.winner = null;
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
  this.players.forEach(function(player, index) {
    game.$container.append(View.createPlayerTrack(player.name));
    player.$track = $("#" + player.name + "-track");
    var trackPieces = View.createTrackPieces(game.trackLength);
    player.buildTrack(trackPieces);
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
  View.displayWinningPlayerMessage(this.winner);
}

// --- Player model
function Player(options) {
  this.name = options.name;
  this.key = options.key;
  this.position = 0;
  this.$track = null;
};

Player.prototype.move = function() {
  this.$track.children().eq(this.position).removeClass("active")
  this.position += 1;
  this.$track.children().eq(this.position).addClass("active")
};

Player.prototype.buildTrack = function(trackPieces) {
  this.$track.append(trackPieces)
  View.activateFirstTrackPiece(this.$track);
}

// --- View / DOM manipulation
var View = {
  TRACK_PIECE_CLASS: ".track-piece",
  ACTIVE_TRACK_PIECE_CLASS: "active",
  CONTAINER_ELEMENT: ".racer-table"
}

View.activateFirstTrackPiece = function($track) {
  $track.find(this.TRACK_PIECE_CLASS + ':first-child').addClass(this.ACTIVE_TRACK_PIECE_CLASS)
}

View.createPlayerTrack = function(playerName) {
  return"<tr id='" + playerName + "-track'></tr>"
}

View.createTrackPieces = function(num) {
  return range(0,num).map(function(){return "<td class='track-piece'></td>"}).join("");
}

View.displayWinningPlayerMessage = function(winningPlayer) {
  alert("Congratulations, " + winningPlayer.name + "! You win!")
}

// --- Blocking input collection
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
  var count = this.playerCount();
  for (i = 1; i <= count; i++) {
    var player = [];
    player.push(this.nameForPlayer(i));
    player.push(this.keyCodeForPlayer(player[0]));
    players.push(player);
  }
  return players;
}

BlockingDataCollection.playerCount = function() {
  return parseInt(prompt("How many players?"));
}

BlockingDataCollection.getTrackLength = function() {
  return parseInt(prompt("How long a track do you want to race on?"));
}

// ---
function range(start, end) {
  var range = [];
  for (i = start; i < end; i++) {
    range.push(i);
  }
  return range;
}

