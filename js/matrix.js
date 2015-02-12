/**
 * Created by Ivan.Nikolic on 12/02/2015.
 */

function Matrix(t, title){
    var container = t;
    var stateMatrix = emptyMatrix(CELL_EMPTY);
    var clickEnabled = true;
    var active = true;
    var showShips = true;

    container.addClass('active-matrix');
    container.addClass('clickable-matrix');

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
                var cellState = stateMatrix[i][j];
                cell.addClass(getClassByCellState(cellState, showShips));
                cell.click({cell : cell, row: i, column : j}, fieldClick);
                row.append(cell);
            }
            table.append(row);
        }
        container.append(table);
    }

    function fieldClick(event){
        if (clickEnabled && active){
            shot(event.data.row, event.data.column, event.data.cell);
        }
    }

    this. shotRandomly = function(){
        while(true){
            var randomRow = randomInteger(MATRIX_SIZE);
            var randomColumn = randomInteger(MATRIX_SIZE);
            var cellState = stateMatrix[randomRow][randomColumn];
            if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
                shot(randomRow, randomColumn);
                break;
            }
        }
    }

    function shot(row,column,cell){
        if (!cell){
            cell = container.find('#cell'+row+column);
        }
        if (stateMatrix[row][column]==CELL_MISSED || stateMatrix[row][column]==CELL_SHIP_DESTROYED){
            return;
        }
        cell.removeClass('cell-empty');
        if (stateMatrix[row][column]==CELL_WITH_SHIP){
            stateMatrix[row][column] = CELL_SHIP_DESTROYED;
            cell.addClass('cell-ship-hit');
            if (checkIfShipIsDestroyed(row, column)){
                blockSurroundingShipFields(row, column);
                if (areAllShipsDestroyed(stateMatrix)){
                    alert ('game over');
                }
            }
            container.trigger('playAgain');
        } else {
            markCellAsMissed(row,column,cell);
            setTimeout(function() {
                container.trigger('nextPlayer');
            }, 200);

        }
    };

    this.setClickEnabled = function(enabled){
        clickEnabled = enabled;
        if (enabled) {
            container.addClass('clickable-matrix');
        } else {
            container.removeClass('clickable-matrix');
        }
    };

    this.setActive = function(activeMatrix){
        active = activeMatrix;
        if (activeMatrix) {
            container.addClass('active-matrix');
        } else {
            container.removeClass('active-matrix');
        }
    };

    this.setShowShips = function(show){
        showShips = show;
    };

    this.populateRandomly = function(){
        stateMatrix = new RandomFieldPopulator().populate();
    };

    this.getContainer = function () {
        return container;
    }

    function checkIfShipIsDestroyed (row, column) {
        return areAllFieldsDestroyed(row, column, HORIZONTAL, 1) //east
            && areAllFieldsDestroyed(row, column, HORIZONTAL, -1)//west
            && areAllFieldsDestroyed(row, column, VERTICAL, -1) //north
            && areAllFieldsDestroyed(row, column, VERTICAL, 1); //south
    }

    function areAllFieldsDestroyed(row, column, orientation, direction){
        if (orientation==HORIZONTAL){
            var c = column + direction;
            while (isCellInMatrixRange(row,c)){
                if (stateMatrix[row][c]==CELL_WITH_SHIP){
                    return false;
                } else if (stateMatrix[row][c]!=CELL_SHIP_DESTROYED) {
                    return true;
                }
                c += direction;
            }
        } else {
            var r = row + direction;
            while (isCellInMatrixRange(r,column)){
                if (stateMatrix[r][column]==CELL_WITH_SHIP){
                    return false;
                } else if (stateMatrix[r][column]!=CELL_SHIP_DESTROYED) {
                    return true;
                }
                r += direction;
            }
        }
        return true;
    }

    function blockSurroundingShipFields(row, column){
        blockAllSurroundingFields(row, column, HORIZONTAL, -1);

        blockCellsInDirection(row, column, HORIZONTAL, -1); //west
        blockCellsInDirection(row, column, HORIZONTAL, 1); //east
        blockCellsInDirection(row, column, VERTICAL, -1); //north
        blockCellsInDirection(row, column, VERTICAL, 1); //south
    }

    function blockCellsInDirection(row, column, orientation, direction){
        row = orientation == HORIZONTAL ? row + direction : row;
        column = orientation == VERTICAL ? column + direction : column;
        while(isCellInMatrixRange(row,column)){
            if (stateMatrix[row][column]==CELL_SHIP_DESTROYED){
                blockAllSurroundingFields(row,column);
            } else {
                break;
            }
            if (orientation == HORIZONTAL){
                row += direction;
            } else {
                column += direction;
            }
        }
    }


    function blockAllSurroundingFields(row, column) {
        for (var r = row -1; r<=row+1; r++){
            for (var c = column -1; c<=column+1; c++){
                if ((r==row && c==column) || !isCellInMatrixRange(r,c)){
                    continue;
                }
                if (stateMatrix[r][c]==CELL_BLOCKED) {
                    markCellAsMissed(r,c);
                }
            }
        }
    }

    function markCellAsMissed(row, column, cell){
        stateMatrix[row][column]=CELL_MISSED;
        if (!cell){
            cell = container.find('#cell'+row+column);
        }
        cell.removeClass('cell-empty');
        cell.addClass('cell-missed');
        cell.html('x');
    }



}


