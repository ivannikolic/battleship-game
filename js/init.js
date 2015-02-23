var MATRIX_SIZE = 10;
var VERTICAL = 0, HORIZONTAL = 1;
var WEST = new Direction(-1), EAST = new Direction(1), NORTH = new Direction(-1), SOUTH = new Direction(1);
var CELL_EMPTY = 0, CELL_WITH_SHIP = 1, CELL_BLOCKED = 2, CELL_MISSED = 3, CELL_SHIP_DESTROYED = 4;
var opponent, me;
var DELAY_BETWEEN_MOVES = 500;

$(function() {

    startGame();

    $("#NewGame").click(function() {
        removeFromLocalStorage(me.getContainerId());
        removeFromLocalStorage(opponent.getContainerId());
        startGame();
    });

});

function startGame(){
    me = new Player($('#Player'), 'Player');
    me.populateRandomly();
    me.render();
    me.setClickEnabled(false);
    me.setActive(false);

    opponent = new Player($('#Computer'), 'Computer');
    opponent.setShowShips(false);
    opponent.populateRandomly();
    opponent.render();

    var game = new Game(me, opponent);
    game.start();
}

function Game(me, opponent) {

    this.start = function(){
        $(document).on('nextPlayer', function(e) {
            if (e.target.id === opponent.getContainerId()){
                opponent.setClickEnabled(false);
                setTimeout(function(){
                    opponent.setActive(false);
                    me.setActive(true);
                }, DELAY_BETWEEN_MOVES);
                setTimeout(function(){
                    me.autoShotNextField();
                }, DELAY_BETWEEN_MOVES*2);
            } else if (e.target.id === me.getContainerId()){
                setTimeout(function(){
                    opponent.setClickEnabled(true);
                    opponent.setActive(true);
                    me.setActive(false);
                }, DELAY_BETWEEN_MOVES);
            }
        });
        $(document).on('playAgain', function(e) {
            if (e.target.id === me.getContainerId()) {
                setTimeout(function(){
                    me.autoShotNextField();
                }, DELAY_BETWEEN_MOVES * 1.5);
            }
        });
        $(document).on('gameOver', function(e) {
            opponent.setClickEnabled(false);
            opponent.setActive(false);
            me.setClickEnabled(false);
            me.setActive(false);
            if (e.target.id === me.getContainerId()) {
                opponent.setShowShips(true);
                opponent.render();
            }

            alert ("" + e.target.id + " lost! Game over!");
        });
    };

}

function Direction(value){
    var _value = value;

    this.getValue = function(){
        return _value;
    };
}




