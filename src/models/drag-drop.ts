//global configuration for items dragEven handlers

namespace App {
    export interface Draggable{
        dragStartHandler(event: DragEvent): void;
        dragEndHandler(event: DragEvent): void;
    }
    
    //global configuration for handlers on items-template interaction.
    export interface DragTarget{
        dragOverHandler(event: DragEvent):void;
        dropHandler(event: DragEvent):void;
        dragLeaveHandler(event: DragEvent):void;
    }
    
}

