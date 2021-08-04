
import { Draggable } from '../models/drag-drop.js';
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js';
import { Project } from '../models/project.js';


//Project Item
export class ProjectItem extends Component<HTMLTemplateElement, HTMLLIElement> implements Draggable{

    constructor (hostId: string, private prjItem: Project) {
        //calling super to render the li elem in the ul host.
        super(
            'single-project',
            hostId,
            false,
            prjItem.id
        );
        this.configureElemProps();
        this.configureElemListeners();
    }


    @autobind
    dragStartHandler(e: DragEvent){
        console.log('Drag Start!');         
        //store the projectId in the DataTransfer. it will be used in the dragover and drop handlers in the ProjectList Class.
        //set the effect allowse...
        e.dataTransfer!.setData('text/plain', this.prjItem.id);
        e.dataTransfer!.effectAllowed = 'move';
    }

    @autobind
    dragEndHandler (e: DragEvent){
        console.log('Drag End!');
    }

    //methods to be implemented by subclases
    configureElemListeners(){
        //...Super Class Methods implementation...

        //set drag  event listeners
        //elem = li
        this.elem.addEventListener('dragstart', this.dragStartHandler);
        this.elem.addEventListener('dragend', this.dragEndHandler);

    }

    configureElemProps(){
        //...Super Class Methods implementation...
        // console.log(this.prjItem);
        this.elem.querySelector('h2')!.textContent = this.prjItem.title;
        this.elem.querySelector('h3')!.textContent = this.prjItem.people.toString();
        this.elem.querySelector('p')!.textContent = this.prjItem.description;
    }
}