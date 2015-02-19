/**
 * Created by Ivan.Nikolic on 19/02/2015.
 */
function NextFieldStrategy(){

    var ship = null;
    var currentOrientation;
    var currentDirection;


    this.suggestNextField = function(stateMatrix){
        if (ship==null) {
            return getRandomField(stateMatrix);
        }
        return findBestPossibleHit();

    };

    function shotVertically() {

    }

    function shotHorizontally() {

    }

    /**
     * This methods assumes that "ship" object is not null
     */
    function findBestPossibleHit() {
        if (ship.orientation){
            return ship.orientation == VERTICAL ? shotVertically() : shotHorizontally();
        }
        currentOrientation = Math.random()<0.5 ? VERTICAL : HORIZONTAL;
        if (currentDirection == VERTICAL){

        }
    }

    this.setShipAsDestroyed = function(){
        ship = null;
    };

    this.trackHit = function(r, c){
        if (ship){

        } else {
            ship = {row : r, column : c};
        }
    };

    this.trackMiss = function(r, c){
        if (ship){

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

}