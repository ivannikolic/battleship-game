/**
 * Created by Ivan on 11.2.2015.
 */

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

function areAllShipsDestroyed(matrix){
    for(var i=0; i<MATRIX_SIZE; i++){
        for(var j=0; j<MATRIX_SIZE; j++){
            if (matrix[i][j]==CELL_WITH_SHIP){
                return false;
            }
        }
    }
    return true;
}

function randomOrientation (){
    return Math.random() > 0.5 ? VERTICAL : HORIZONTAL;
}

function randomInteger(maxNumber){
    return Math.floor((Math.random() * maxNumber));
}

function getClassByCellState(cellState, showShips){
    switch (cellState){
        case CELL_EMPTY:
            return 'cell-empty';
        case CELL_WITH_SHIP:
            return showShips ? 'cell-with-ship' : 'cell-empty';
        case CELL_BLOCKED:
            return showShips ? 'cell-blocked' : 'cell-empty';
        case CELL_MISSED:
            return 'cell-missed';
        case CELL_SHIP_DESTROYED:
            return 'cell-ship-hit';
        default:
            return 'cell-empty';
    }
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function isCellInMatrixRange(row, column){
    return (row >= 0 && row < MATRIX_SIZE) && (column >= 0 && column < MATRIX_SIZE);
}

function logField(row, column, message){
    console.log((message!=null ? message : "") + "(" + String.fromCharCode(65+column) + (row+1) + ")");
}

function storePlayerInLocalStorage(playerName,stateMatrix){
    if(typeof(Storage) !== "undefined") {
        var matrixAsString = "";
        for (var i = 0; i<MATRIX_SIZE; i++){
            for (var j = 0; j<MATRIX_SIZE; j++){
                matrixAsString += stateMatrix[i][j];
            }
        }
        localStorage['matrix-'+playerName] = matrixAsString;
    }
}

function setGameInProgress() {
    localStorage['gameInProgress'] = 'true';
}

function isGameInProgress(){
    return typeof(Storage) !== "undefined" && localStorage['gameInProgress'] !== undefined;
}


function retrievePlayerFromLocalStorage(playerName){
    if(typeof(Storage) !== "undefined") {
        if (localStorage['matrix-'+playerName]){
            var states = localStorage['matrix-'+playerName].split('');
            var matrix = {};
            for(var i=0; i<MATRIX_SIZE; i++){
                matrix[i] = {};
                for(var j=0; j<MATRIX_SIZE; j++){
                    matrix[i][j] = parseInt(states[i*10+j]);
                }
            }
            return matrix;
        }
    }
    return null;
}

function removeFromLocalStorage(playerName){
    if(typeof(Storage) !== "undefined") {
        localStorage.removeItem('matrix-'+playerName);
        localStorage.removeItem('gameInProgress');
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
