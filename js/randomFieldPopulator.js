/**
 * Created by Ivan on 11.2.2015.
 */
function RandomFieldPopulator(){

    this.populate = function(){
        var matrix = emptyMatrix();

        placeShip(matrix, 4);

        placeShip(matrix, 3);
        placeShip(matrix, 3);

        placeShip(matrix, 2);
        placeShip(matrix, 2);
        placeShip(matrix, 2);

        placeShip(matrix, 1);
        placeShip(matrix, 1);
        placeShip(matrix, 1);
        placeShip(matrix, 1);

        return matrix;
    }


    function placeShip(matrix, size) {
        var orientation = randomOrientation();
        var randomRow = randomInteger(orientation == HORIZONTAL ? MATRIX_SIZE : MATRIX_SIZE - size+1);
        var randomColumn = randomInteger(orientation == VERTICAL ? MATRIX_SIZE : MATRIX_SIZE - size+1);

        if (canSheepBePlaced(matrix, randomRow, randomColumn, orientation, size)){
            //console.log("ship of size " + size + "can be placed (" + randomRow + "," + randomColumn + ")");
            fillInFields(matrix, randomRow, randomColumn, orientation, size);
        } else {
            //console.log("ship of size " + size + "cannot be placed (" + randomRow + "," + randomColumn + ")");
            placeShip(matrix, size); //try again
        }
    }

    function canSheepBePlaced(matrix, randomRow, randomColumn, orientation, size){
        for (var i = 0; i < size; i++) {
            var row = orientation == HORIZONTAL ? randomRow : randomRow + i;
            var column = orientation == VERTICAL ? randomColumn : randomColumn + i;
            if (matrix[row][column] != CELL_EMPTY){
                return false;
            }
        }
        return true;
    }

    function fillInFields(matrix, randomRow, randomColumn, orientation, size){
        for (var i = 0; i < size; i++) {
            var row = orientation == HORIZONTAL ? randomRow : randomRow + i;
            var column = orientation == VERTICAL ? randomColumn : randomColumn + i;
            matrix[row][column] = CELL_WITH_SHIP;
            markSurroundingCellsAsBlocked(matrix, row, column);
        }
    }

    function markSurroundingCellsAsBlocked(matrix, row, column){
        for (var r = row -1; r<=row+1; r++){
            for (var c = column -1; c<=column+1; c++){
                markCellBlockedIfItsEmpty(matrix, r, c);
            }
        }
    }

    function markCellBlockedIfItsEmpty(matrix, row, column){
        if (!isCellInMatrixRange(row,column)){
            return;
        }
        if (matrix[row][column]==CELL_EMPTY){
            matrix[row][column] = CELL_BLOCKED;
        }
    }

}