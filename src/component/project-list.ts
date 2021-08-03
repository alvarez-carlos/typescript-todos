///<reference path="base-component.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../state/project-state.ts"/>
///<reference path="../models/project.ts"/>
///<reference path="../models/drag-drop.ts"/>


namespace App {

    //Project List
    export class projectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
        private assignedProjects: Project[] = [];
        constructor(public listType: 'active' | 'finished'){
            super(
                'project-list',
                'app',
                false,
                `${listType}-projects`
            )
            this.configureElemProps();
            this.configureElemListeners();
        }

        @autobind
        dragOverHandler(e: DragEvent){
            //Add the droppable class to set the backgrounds in the droppable box.
            if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain'){
                e.preventDefault();
                console.log('Drag Over!');
                const ulList = this.elem.querySelector('ul')! as HTMLUListElement;
                ulList.classList.add('droppable');
            }
        }

        @autobind
        dropHandler(e: DragEvent){
            //remove the droppable class and set the logic to call the moveMethod and to the listeners to refresh the UI.
            console.log('Drop!');

            //get the project moved by it's id.
            const prjId = e.dataTransfer!.getData('text/plain');
            //call moveProject from the class ProjectSate and pass the prjId and the newProjStatus. moveProject will check if the status is a new one to then updated it and call the listeners.
            prjState.moveProject(
                prjId,
                this.listType === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
            );

            const ulList = this.elem.querySelector('ul')! as HTMLUListElement;
            ulList.classList.remove('droppable');
        }

        @autobind
        dragLeaveHandler(){
            //remove the droppable class
            console.log('Drag Leave');
            const ulList = this.elem.querySelector('ul')! as HTMLUListElement;
            ulList.classList.remove('droppable');
        }

        //methods to be implemented by subclases
        configureElemListeners(){
            //...Super Class Methods implementation...


            //drag event handlers
            //elem = section
            this.elem.addEventListener('dragover', this.dragOverHandler); //dragOver handler...

            this.elem.addEventListener('drop', this.dropHandler); //drop handler...

            this.elem.addEventListener('dragleave', this.dragLeaveHandler); //dragLeave handler...


            //Add listeners to the listenerFunctions Array
            prjState.addListener( (prjArray: Project[]) => {
                const relevantProjects = prjArray.filter( prj => {
                    // alert(this.listType);
                    if (this.listType === 'active'){
                        return prj.status === ProjectStatus.Active;
                    }
                    return prj.status === ProjectStatus.Finished;
                })
                this.assignedProjects =  relevantProjects;
                this.triggerProjectItemRendering();
            });
    
        }

        //render projects in the UI.
        triggerProjectItemRendering(){
            
            //Clear the UI before rendering to avoid duplicating the items in the UI.
            const ulList = document.getElementById(`${this.listType}-projects-list`)! as HTMLUListElement;
            ulList.innerHTML = '';

            //gather the host ul list Id so tht in the loop below we cen pass it as argument along with each single project to the constructor.
            const hostId = this.elem.querySelector('ul')!.id;

            for (const prjItem of this.assignedProjects){
                //Instance of the ProjectItem Class. Each project will be an instance of the Project Item Class.
                //Since we have a couple of templates. we need to pass the host id to the ProjectItem Constructor do that 
                //the rendering is performed to the proper ul list.
                new ProjectItem(hostId, prjItem);
            }
        }

        configureElemProps(){
            //...Super Class Methods implementation...
            const listId = `${this.listType}-projects-list`;
            this.elem.querySelector('h2')!.textContent = this.listType.toUpperCase() + ' PROJECTS';
            this.elem.querySelector('ul')!.id = listId;
        }
    }
}