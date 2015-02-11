/**
 * Created by Ivan on 11.2.2015.
 */

function Matrix(t, title){
    var container = t;
    var state = emptyMatrix();
    var clickEnabled = true;

    container.addClass('active-matrix');

    this.render = function (){
        if (title){
            var titleContainer = $('<div/>').addClass('player-name');
            titleContainer.append(title);
            container.append(titleContainer);
        }

        var table = $('<table/>').addClass('matrix');

        var row = $('<tr/>');
        row.append($('<td/>').addClass('header-cell'));
        for(var i=0; i<MATRIX_SIZE; i++){
            var headerTop = $('<td/>').addClass('header-cell');
            headerTop.append(String.fromCharCode(65+i));
            row.append(headerTop);
        }
        table.append(row);

        for(var i=0; i<MATRIX_SIZE; i++){
            var row = $('<tr/>');
            var headerLeft = $('<td/>').addClass('header-cell');
            headerLeft.append(i+1);
            row.append(headerLeft);
            for(var j=0; j<MATRIX_SIZE; j++){
                var cell = $('<td id="cell' + i + j + '"/>');
                cell.addClass(getClassByCellState(state[i][j]));
                cell.click({cell : cell, row: i, column : j}, invertSelection);
                row.append(cell);
            }
            table.append(row);
        }
        container.append(table);
    }

    function invertSelection(event){
        if (clickEnabled){
            var row = event.data.row, column = event.data.column;
            event.data.cell.toggleClass('cell-with-ship').toggleClass('cell-empty');
            state[row][column] = state[row][column] == CELL_EMPTY ? CELL_WITH_SHIP : CELL_EMPTY;
        }
    }

    function getClassByCellState(cellState){
        switch (cellState){
            case CELL_EMPTY:
                return 'cell-empty';
            case CELL_WITH_SHIP:
                return 'cell-with-ship';
            case CELL_BLOCKED:
                return 'cell-blocked';
            default:
                return 'cell-empty';
        }
    }

    this.setClickEnabled = function(enabled){
        clickEnabled = enabled;
        container.toggleClass('active-matrix', '');
    }

    this.populateRandomly = function(){
        state = new RandomFieldPopulator().populate();
    }

}

function emptyMatrix(){
    var matrix = {};
    for(var i=0; i<MATRIX_SIZE; i++){
        matrix[i] = {};
        for(var j=0; j<MATRIX_SIZE; j++){
            matrix[i][j] = CELL_EMPTY;
        }
    }
    return matrix;
}

function randomOrientation (){
    return Math.random() > 0.5 ? VERTICAL : HORIZONTAL;
}

function randomInteger(maxNumber){
    return Math.floor((Math.random() * maxNumber));
}


