var MATRIX_SIZE = 10;
var VERTICAL = 0, HORIZONTAL = 1;
var CELL_EMPTY = 0, CELL_WITH_SHIP = 1, CELL_BLOCKED = 2;
var opponent, player;

$(function() {
    player = new Matrix($('#player'), 'Player');
    player.render();

    opponent = new Matrix($('#opponent'), 'Opponent');
    opponent.populateRandomly()
    opponent.render();
    opponent.setClickEnabled(false);
});