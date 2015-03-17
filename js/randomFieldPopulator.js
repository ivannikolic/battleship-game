/**
 * Created by Ivan on 11.2.2015.
 */
function RandomFieldPopulator(){

    this.populate = function(){
        var matrix = emptyMatrix();
        for (var i = 0; i < SHIP_SIZES.length; i++) {
            placeShip(matrix, SHIP_SIZES[i]);
        }
        return matrix;
    }


    function placeShip(matrix, size) {
        var orientation = randomOrientation();
        var randomRow = randomInteger(orientation == HORIZONTAL ? MATRIX_SIZE : MATRIX_SIZE - size+1);
        var randomColumn = randomInteger(orientation == VERTICAL ? MATRIX_SIZE : MATRIX_SIZE - size+1);

        if (canShipBePlaced(matrix, randomRow, randomColumn, orientation, size)){
            fillInFields(matrix, randomRow, randomColumn, orientation, size);
        } else {
            placeShip(matrix, size); //try again
        }
    }

    function canShipBePlaced(matrix, randomRow, randomColumn, orientation, size){
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