/**
 * Created by Ivan.Nikolic on 24/02/2015.
 */




function Ship(size, orientation){

    this.render = function(container){
        var ship = $('<div draggable="true"/>');
        ship.addClass('ship');
        ship.height(orientation == HORIZONTAL ? CELL_SIZE : CELL_SIZE*size);
        ship.width(orientation == HORIZONTAL ? CELL_SIZE*size : CELL_SIZE);
        container.append(ship);
        ship.on('dragstart', function(e) {
            var crt = this.cloneNode(true);
            crt.style.backgroundColor = "red";
            crt.style.position = "absolute"; crt.style.top = "0px"; crt.style.right = "0px";
            document.body.appendChild(crt);
            e.originalEvent.dataTransfer.setDragImage(crt, 0, 0);
            //var dataTransfer = e.originalEvent.dataTransfer;
            //dataTransfer.effectAllowed = 'copy';
            //dataTransfer.setData('Text', this.id);
        //    //var crt = this.cloneNode(true);
        //    //crt.style.backgroundColor = "red";
        //    //crt.style.position = "absolute"; crt.style.top = "0px"; crt.style.right = "0px";
        //    //document.body.appendChild(crt);
        //    //evt.dataTransfer.setDragImage(crt, 0, 0);
        //    //var crt = this.cloneNode(true);
        //    //crt.style.backgroundColor = "red";
        //    //crt.style.display = "none"; /* or visibility: hidden, or any of the above */
        //    //document.body.appendChild(crt);
        //    //e.dataTransfer.setDragImage(crt, 0, 0);
        });
    };
}

function allowDrop(ev) {
    ev.preventDefault();
}

//function drag(e, draggableObject) {
//    //e.dataTransfer.setData("text", e.target.id);
//    var crt = draggableObject.cloneNode(true);
//    crt.style.backgroundColor = "red";
//    crt.style.display = "none"; /* or visibility: hidden, or any of the above */
//    document.body.appendChild(crt);
//    e.dataTransfer.setDragImage(crt, CELL_SIZE/2, CELL_SIZE/2);
//}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}