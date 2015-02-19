var MATRIX_SIZE = 10;
var VERTICAL = 0, HORIZONTAL = 1;
var CELL_EMPTY = 0, CELL_WITH_SHIP = 1, CELL_BLOCKED = 2, CELL_MISSED = 3, CELL_SHIP_DESTROYED = 4;
var opponent, player;
var DELAY_BETWEEN_MOVES = 1000;

$(function() {
    player = new Matrix($('#player'), 'Player');
    player.populateRandomly();
    player.render();
    player.setClickEnabled(false);
    player.setActive(false);

    opponent = new Matrix($('#opponent'), 'Opponent');
    opponent.setShowShips(false);
    opponent.populateRandomly();
    opponent.render();

    var game = new Game(player, opponent);
    game.start();

});

function Game(player, opponent) {

    this.start = function(){
        $(document).on('nextPlayer', function(e) {
            if (e.target.id === opponent.getContainer().attr("id")){
                opponent.setClickEnabled(false);
                setTimeout(function(){
                    opponent.setActive(false);
                    player.setActive(true);
                }, DELAY_BETWEEN_MOVES);
                setTimeout(function(){
                    player.shotRandomly();
                }, DELAY_BETWEEN_MOVES*2);
            } else if (e.target.id === player.getContainer().attr("id")){
                opponent.setClickEnabled(true);
                opponent.setActive(true);
                player.setActive(false);
            }
        });
        $(document).on('playAgain', function(e) {
            if (e.target.id === player.getContainer().attr("id")) {
                setTimeout(function(){
                    player.shotRandomly();
                }, DELAY_BETWEEN_MOVES);
            }
        });
    };

}




