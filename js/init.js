var MATRIX_SIZE = 10;
var VERTICAL = 0, HORIZONTAL = 1;
var WEST = -1, EAST = 1, NORTH = -1, SOUTH = 1;
var CELL_EMPTY = 0, CELL_WITH_SHIP = 1, CELL_BLOCKED = 2, CELL_MISSED = 3, CELL_SHIP_DESTROYED = 4;
var opponent, me;
var DELAY_BETWEEN_MOVES = 700;

$(function() {
    me = new Player($('#me'), 'Player');
    me.populateRandomly();
    me.render();
    me.setClickEnabled(false);
    me.setActive(false);

    opponent = new Player($('#opponent'), 'Opponent');
    opponent.setShowShips(false);
    opponent.populateRandomly();
    opponent.render();

    var game = new Game(me, opponent);
    game.start();

});

function Game(me, opponent) {

    this.start = function(){
        $(document).on('nextPlayer', function(e) {
            if (e.target.id === opponent.getContainer().attr("id")){
                opponent.setClickEnabled(false);
                setTimeout(function(){
                    opponent.setActive(false);
                    me.setActive(true);
                }, DELAY_BETWEEN_MOVES);
                setTimeout(function(){
                    me.shotNextField();
                }, DELAY_BETWEEN_MOVES*2);
            } else if (e.target.id === me.getContainer().attr("id")){
                setTimeout(function(){
                    opponent.setClickEnabled(true);
                    opponent.setActive(true);
                    me.setActive(false);
                }, DELAY_BETWEEN_MOVES);
            }
        });
        $(document).on('playAgain', function(e) {
            if (e.target.id === me.getContainer().attr("id")) {
                setTimeout(function(){
                    me.shotNextField();
                }, DELAY_BETWEEN_MOVES * 1.5);
            }
        });
        $(document).on('gameOver', function(e) {
            opponent.setClickEnabled(false);
            opponent.setActive(false);
            me.setClickEnabled(false);
            me.setActive(false);
            if (e.target.id === me.getContainer().attr("id")) {
                opponent.setShowShips(true);
                opponent.render();
            }

            alert ('game over');
        });
    };

}




