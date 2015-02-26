/**
 * Created by Ivan.Nikolic on 24/02/2015.
 */




function Ship(size, orientation){

    this.render = function(container){
        var ship = $('<div draggable="true"/>');
        ship.addClass('ship');
        ship.height(orientation == HORIZONTAL ? CELL_SIZE : CELL_SIZE*size);
        ship.width(orientation == HORIZONTAL ? CELL_SIZE*size : CELL_SIZE);

        ship.get(0).addEventListener("dragstart", function(e) {
            var cpy = ship.get(0).cloneNode(true);
            cpy.style.backgroundColor = "red";
            cpy.style.position = "absolute";
            var cu = document.getElementById("coverup");
            cpy.style.left = (cu.offsetLeft) + "px";
            cpy.style.top = (cu.offsetTop) + "px";
            cpy.id = this.id + "-extra";
            document.body.appendChild(cpy);
            e.dataTransfer.setDragImage(cpy, CELL_SIZE/2, CELL_SIZE/2);
            e.dataTransfer.setData('Text', '' + size + ',' + orientation);
        });
        ship.get(0).addEventListener("dragend", function(e) {
            document.body.removeChild(document.getElementById(ship.get(0).id + "-extra"));
        });

        container.append(ship);
    };
}

function allowDrop(ev,startingPoint) {
    startingPoint = getPointFromString(startingPoint);
    var ship = getShipInfo(ev);
    if ((ship.orientation==HORIZONTAL && startingPoint.column + ship.size <= MATRIX_SIZE) ||
        (ship.orientation==VERTICAL && startingPoint.row + ship.size <= MATRIX_SIZE)){
        ev.preventDefault();
    }
}

function drop(e) {
    e.preventDefault();
}

function getShipInfo(e){
    var textData = e.dataTransfer.getData('Text');
    var array = textData.split(',');
    var _size = parseInt(array[0]);
    var _orientation = parseInt(array[1]);
    return {size : _size, orientation: _orientation};
}

function getPointFromString(textData){
    var array = textData.toString().split('');
    var _row = parseInt(array[0]);
    var _column = parseInt(array[1]);
    return {row : _row, column: _column};
}