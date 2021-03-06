/**
 * Created by Ivan.Nikolic on 24/02/2015.
 */
var shipBeingDragged;
var numberOfNotSettledShips=0;
var ships = {};

function renderNonSettledShips(container){
    numberOfNotSettledShips = SHIP_SIZES.length;
    for (var i = 0; i < SHIP_SIZES.length; i++) {
        var shipId = "ship" + i;
        ships[shipId] = new NotSettledShip (SHIP_SIZES[i], HORIZONTAL, container, shipId);
        ships[shipId].render();
    }
    $(document).on("shipSettled", function (e){
        $('#'+ e.shipId).remove();
        ships[e.shipId] = null;
        if (e.allShipsSettled){
            $('#StartGame').attr("disabled", false);
        }
    });
    registerRotationEventListener(container);
}

function registerRotationEventListener(container){
    $(document).on("shipRotated", function (e){
        $('#'+ e.shipId).remove();
        var oldShip = ships[e.shipId];
        ships[e.shipId] = new NotSettledShip (oldShip.size(), e.orientation, container, e.shipId);

        container.html("");
        for (var i = 0; i < SHIP_SIZES.length; i++) {
            var ship = ships["ship" + i];
            if (ship){
                ship.render();
            }
        }
    });
}



function NotSettledShip(size, orientation, container, shipId){

    this.render = function (){
        var ship = $('<div draggable="true" id="' + shipId + '"/>');
        ship.addClass('ship');
        ship.height(orientation == HORIZONTAL ? CELL_SIZE : CELL_SIZE*size);
        ship.width(orientation == HORIZONTAL ? CELL_SIZE*size : CELL_SIZE);

        if(size>1){
            var rotationImage = $("<img src='img/rotate.png' class='rotation'/>");
            rotationImage.click(function(e){
                $.event.trigger({
                    type: "shipRotated",
                    shipId: shipId,
                    orientation: orientation == HORIZONTAL ? VERTICAL : HORIZONTAL
                });
            });
            ship.append(rotationImage);
        }

        ship.get(0).addEventListener("dragstart", function(e) {
            var cpy = ship.get(0).cloneNode(true);
            cpy.style.backgroundColor = "#ffffff";
            cpy.style.position = "absolute";
            var cu = document.getElementById("coverup");
            cpy.style.left = (cu.offsetLeft) + "px";
            cpy.style.top = (cu.offsetTop) + "px";
            cpy.id = this.id + "-extra";
            cpy.innerHTML = "";
            document.body.appendChild(cpy);
            e.dataTransfer.setDragImage(cpy, CELL_SIZE/2, CELL_SIZE/2);
            e.dataTransfer.setData('shipId', shipId);
            shipBeingDragged = {size : size, orientation: orientation};
        });
        ship.get(0).addEventListener("dragend", function(e) {
            document.body.removeChild(document.getElementById(ship.get(0).id + "-extra"));
        });

        container.append(ship);

        this.size = function(){
            return size;
        };
    };

}

function allowDrop(ev,startingPoint) {
    startingPoint = getPointFromString(startingPoint);
    if (canShipBePlaced(shipBeingDragged,startingPoint)){
        ev.preventDefault();
    }
}

function drop(e,startingPoint) {
    e.preventDefault();
    startingPoint = getPointFromString(startingPoint);
    if (canShipBePlaced(shipBeingDragged,startingPoint)){
        placeShip(shipBeingDragged,startingPoint,e);
        setup.render();
    }
    shipBeingDragged = null;

}

function placeShip(ship,startingPoint,e) {
    var matrix = setup.getStateMatrix();
    if (ship.orientation==HORIZONTAL){
        for (var i=startingPoint.column ; i< startingPoint.column + ship.size; i++){
            matrix[startingPoint.row][i] = CELL_WITH_SHIP;
            markSurroundingCellsAsBlocked(matrix, startingPoint.row, i);
        }
    } else {
        for (var i=startingPoint.row ; i< startingPoint.row + ship.size; i++){
            matrix[i][startingPoint.column] = CELL_WITH_SHIP;
            markSurroundingCellsAsBlocked(matrix, i, startingPoint.column);
        }
    }
    numberOfNotSettledShips--;
    $.event.trigger({
        type: "shipSettled",
        shipId: e.dataTransfer.getData('shipId')
    });
    if (numberOfNotSettledShips == 0){
        $.event.trigger("allShipsSettled");
    }
}

function canShipBePlaced(ship,startingPoint){
    var shipInMatrixRange = (ship.orientation==HORIZONTAL && startingPoint.column + ship.size <= MATRIX_SIZE) ||
        (ship.orientation==VERTICAL && startingPoint.row + ship.size <= MATRIX_SIZE);
    if (!shipInMatrixRange|| !shipBeingDragged){
        return false;
    }
    var matrix = setup.getStateMatrix();
    if (ship.orientation==HORIZONTAL){
        for (var i=startingPoint.column ; i< startingPoint.column + ship.size; i++){
            if (matrix[startingPoint.row][i] != CELL_EMPTY){
                return false;
            }
        }
    } else {
        for (var i=startingPoint.row ; i< startingPoint.row + ship.size; i++){
            if (matrix[i][startingPoint.column] != CELL_EMPTY){
                return false;
            }
        }
    }
    return true;
}

function getPointFromString(textData){
    var array = textData.toString().split('');
    var _row = parseInt(array[0]);
    var _column = parseInt(array[1]);
    return {row : _row, column: _column};
}