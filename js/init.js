var MATRIX_SIZE = 10;
var VERTICAL = 0, HORIZONTAL = 1;
var shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var WEST = new Direction(-1), EAST = new Direction(1), NORTH = new Direction(-1), SOUTH = new Direction(1);
var CELL_EMPTY = 0, CELL_WITH_SHIP = 1, CELL_BLOCKED = 2, CELL_MISSED = 3, CELL_SHIP_DESTROYED = 4;
var CELL_SIZE = 33;
var opponent, you, setup;
var DELAY_BETWEEN_MOVES = 500;
var game;

$(function() {
    if (isGameInProgress()){
        startGame();
    } else {
        settlement();
    }
});

function settlement(){
    $("#game").hide();
    $("#settlement").show();

    setup = new Player($('#SettlePlayer'), "Settle player's ships", true);
    setup.render();
    setup.setClickEnabled(false);
    setup.setActive(false);

    $("#StartGame").click(function() {
        startGame();
    });

    $("#ResetSettlement").click(function() {
        location.reload();
    });

    renderNonSettledShips($("#AvailableShips"));

    $('#StartGame').attr("disabled", true);

    $(document).on("allShipsSettled", function (e){
        $('#StartGame').attr("disabled", false);
    });

}

function startGame(){

    $("#game").show();
    $("#settlement").hide();
    $("#coverup").hide();

    you = new Player($('#You'), 'Player');

    if (setup) {
        you.setStateMatrix(setup.getStateMatrix());
    } else {
        you.populateRandomly();
    }
    you.render();
    you.setClickEnabled(false);
    you.setActive(false);
    opponent = new Player($('#Computer'), 'Computer');

    opponent.setShowShips(false);
    opponent.populateRandomly();
    opponent.render();

    setGameInProgress();

    game = new Game(you, opponent);
    game.start();

    $("#NewGame").click(function() {
        if (!isGameInProgress() || confirm("Are you sure you want to quit current game?")) {
            removeFromLocalStorage(you.getContainerId());
            removeFromLocalStorage(opponent.getContainerId());
            location.reload();
        }
    });
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
            removeFromLocalStorage(me.getContainerId());
            removeFromLocalStorage(opponent.getContainerId());
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




