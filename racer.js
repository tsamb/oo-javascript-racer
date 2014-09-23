$(document).ready(function(){
  new Game
});

function getGameInfo() {
  var numberOfPlayers = prompt("How many players?");
  var players = setPlayerDetails(numberOfPlayers);
  return players
};

function setPlayerDetails(num) {
  var players = [];
  for ( i=0; i < num; i++ ) {
    var name = prompt("Player " + (i+1) + ", what is your name?");
    var key = prompt( name + ", please choose your key.").charCodeAt(0) - 32;
    players[i] = new Player(i+1, name, key);
  }
  return players;
};

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

function listenForKeys(players) {
  $.each(players, function(index, player) {
    $(document).keyup(function(event) {
      if (event.keyCode == player.key) {
        player.move();
      }
    });
  });
}

function Game(players) {
  this.players = getGameInfo();
  this.container = $(".racer-table");
  this.trackLength = 20;
  this.finished = false;
  this.winner = null;
  this.drawBoard();
  this.handleKeyUp()
}

Game.prototype.drawBoard = function() {
  var game = this;
  $.each(this.players, function(index, player) {
    game.container.append("<tr id='" + player.name + "-track'></tr>");
    player.$track = $("#" + player.name + "-track");
    for (i = 0; i < game.trackLength; i++) {
      player.$track.append("<td></td>");
    }
    player.$track.children().first().addClass("active")
  });
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
}
