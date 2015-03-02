/**
 * Created by Ivan.Nikolic on 19/02/2015.
 */
function NextFieldStrategy(){

    var ship = null;
    var currentDirectionIndex = 0;
    var directions;

    this.suggestNextField = function(stateMatrix){
        if (ship==null) {
            return getRandomField(stateMatrix);
        }
        return findBestPossibleHit(stateMatrix);

    };

    function findBestPossibleHit(stateMatrix) {
        if (ship.orientation !== undefined){
            return ship.orientation === VERTICAL ? shotVertically(stateMatrix) : shotHorizontally(stateMatrix);
        }
        //deciding for the first time which direction will be hit next
        for (var i = currentDirectionIndex; i<4; i++, currentDirectionIndex++){
            var direction = directions[i];
            var cell;
            if (direction == EAST || direction == WEST){
                cell = {row : ship.row, column: (ship.column + direction.getValue())};
            } else {
                cell = {row : (ship.row + direction.getValue()), column: ship.column};
            }
            if (isCellInMatrixRange(cell.row, cell.column)){
                var cellState = stateMatrix[cell.row][cell.column];
                if (cellState!=CELL_MISSED && cellState!=CELL_SHIP_DESTROYED){
                    return cell;
                }
            }
        }
    }

    function shotVertically(stateMatrix) {
        var direction = (Math.random()<0.5 ? NORTH : SOUTH).getValue();
        var cell = searchVerticallyForEmptyCell(stateMatrix, direction);
        if (cell === undefined || cell === null) {
            //search in the opposite direction
            cell = searchVerticallyForEmptyCell(stateMatrix, -direction);
        }
        return cell;
    }

    function searchVerticallyForEmptyCell(stateMatrix, direction){
        for(var row = ship.row; isCellInMatrixRange(row, ship.column); row+=direction) {
            var cellState = stateMatrix[row][ship.column];
            if (cellState==CELL_EMPTY || cellState==CELL_BLOCKED || cellState==CELL_WITH_SHIP){
                return {row : row, column: ship.column}
            }
            if (cellState==CELL_MISSED) {
                break;
            }
        }
    }

    function shotHorizontally(stateMatrix) {
        var direction = (Math.random()<0.5 ? EAST : WEST).getValue();
        var cell = searchHorizontallyForEmptyCell(stateMatrix, direction);
        if (cell === undefined || cell === null) {
            //search in the opposite direction
            cell = searchHorizontallyForEmptyCell(stateMatrix, -direction);
        }
        return cell;
    }

    function searchHorizontallyForEmptyCell(stateMatrix, direction){
        for(var column = ship.column; isCellInMatrixRange(ship.row, column); column+=direction) {
            var cellState = stateMatrix[ship.row][column];
            if (cellState==CELL_EMPTY || cellState==CELL_BLOCKED || cellState==CELL_WITH_SHIP){
                return {row : ship.row, column: column}
            }
            if (cellState==CELL_MISSED) {
                break;
            }
        }
    }

    this.setShipAsDestroyed = function(){
        ship = null;
    };

    this.trackHit = function(r, c){
        if (!ship){
            //ship is hit for the first time
            ship = {row : r, column : c};
            directions = shuffleArray([EAST, WEST, NORTH, SOUTH]);
            currentDirectionIndex = 0;
        } else if (ship.orientation === undefined) {
            if (r == ship.row){
                ship.orientation = HORIZONTAL;
            }
            if (c == ship.column){
                ship.orientation = VERTICAL;
            }
        }
    };

    function getRandomField(stateMatrix){
        var i = 500;
        while(i>0){
            var randomRow = randomInteger(MATRIX_SIZE);
            var randomColumn = randomInteger(MATRIX_SIZE);
            var cellState = stateMatrix[randomRow][randomColumn];
            if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
                var nextRandomCell = {row : randomRow, column: randomColumn};
                return nextRandomCell;
            }
            i--;
        }
        alert("A problem happened, please reload page and try again")
    }

    //function getRandomField(stateMatrix){
    //    var maxPercentage = 0;
    //    var cellToReturn;
    //    for (var row = 0; row<MATRIX_SIZE; row++){
    //        for (var column = 0; column<MATRIX_SIZE; column++){
    //            var cellState = stateMatrix[row][column];
    //            if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
    //                var freeSurroundingCellsPercentage = getFreeSurroundingCellsPercentage(stateMatrix, row, column);
    //                console.log(freeSurroundingCellsPercentage);
    //                if (freeSurroundingCellsPercentage > maxPercentage){
    //                    maxPercentage = freeSurroundingCellsPercentage;
    //                    cellToReturn = {row : row, column: column};
    //                }
    //            }
    //        }
    //    }
    //    return cellToReturn;
    //}
    //
    //function getFreeSurroundingCellsPercentage(stateMatrix, row, column){
    //    var total = 0, free=0;
    //    for (var r = row-1; r<= row +1; r++) {
    //        for (var c = column - 1; c <= column + 1; c++) {
    //            if ((r==row && c==column) || !isCellInMatrixRange(r,c)){
    //                continue;
    //            }
    //            total++;
    //            var cellState = stateMatrix[r][c];
    //            if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
    //                free++;
    //            }
    //        }
    //    }
    //    return free/total;
    //}

}