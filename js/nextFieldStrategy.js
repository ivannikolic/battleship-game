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
        var maxPercentage = -1;
        var bestCellsToShot = [];
        for (var row = 0; row<MATRIX_SIZE; row++){
            for (var column = 0; column<MATRIX_SIZE; column++){
                var cellState = stateMatrix[row][column];
                if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
                    var freeSurroundingCellsPercentage = getFreeSurroundingCellsPercentage(stateMatrix, row, column);
                    var cell = {row : row, column: column};
                    if (freeSurroundingCellsPercentage == maxPercentage){
                        bestCellsToShot.push(cell);
                    } else if (freeSurroundingCellsPercentage > maxPercentage){
                        maxPercentage = freeSurroundingCellsPercentage;
                        bestCellsToShot = [cell];
                    }
                }
            }
        }
        return shuffleArray(bestCellsToShot)[0];
    }

    function getFreeSurroundingCellsPercentage(stateMatrix, row, column){
        var percentage = {total : 0, free : 0};
        inspectSurroundingCell(stateMatrix, row-1, column, percentage);
        inspectSurroundingCell(stateMatrix, row+1, column, percentage);
        inspectSurroundingCell(stateMatrix, row, column-1, percentage);
        inspectSurroundingCell(stateMatrix, row, column+1, percentage);

        return (percentage.free/percentage.total).toFixed(2);
    }

    function inspectSurroundingCell(stateMatrix, row, column, percentage){
        if (isCellInMatrixRange(row,column)){
            percentage.total++;
            var cellState = stateMatrix[row][column];
            if (cellState != CELL_MISSED && cellState != CELL_SHIP_DESTROYED){
                percentage.free++;
            }
        }
    }

}