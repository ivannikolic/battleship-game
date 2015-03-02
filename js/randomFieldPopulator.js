/**
 * Created by Ivan on 11.2.2015.
 */
function RandomFieldPopulator(){

    this.populate = function(){
        var matrix = emptyMatrix();
        for (var i = 0; i < shipSizes.length; i++) {
            placeShip(matrix, shipSizes[i]);
        }
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

}