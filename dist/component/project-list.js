"use strict";
///<reference path="base-component.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../state/project-state.ts"/>
///<reference path="../models/project.ts"/>
///<reference path="../models/drag-drop.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    //Project List
    class projectList extends App.Component {
        constructor(listType) {
            super('project-list', 'app', false, `${listType}-projects`);
            this.listType = listType;
            this.assignedProjects = [];
            this.configureElemProps();
            this.configureElemListeners();
        }
        dragOverHandler(e) {
            //Add the droppable class to set the backgrounds in the droppable box.
            if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
                e.preventDefault();
                console.log('Drag Over!');
                const ulList = this.elem.querySelector('ul');
                ulList.classList.add('droppable');
            }
        }
        dropHandler(e) {
            //remove the droppable class and set the logic to call the moveMethod and to the listeners to refresh the UI.
            console.log('Drop!');
            //get the project moved by it's id.
            const prjId = e.dataTransfer.getData('text/plain');
            //call moveProject from the class ProjectSate and pass the prjId and the newProjStatus. moveProject will check if the status is a new one to then updated it and call the listeners.
            App.prjState.moveProject(prjId, this.listType === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
            const ulList = this.elem.querySelector('ul');
            ulList.classList.remove('droppable');
        }
        dragLeaveHandler() {
            //remove the droppable class
            console.log('Drag Leave');
            const ulList = this.elem.querySelector('ul');
            ulList.classList.remove('droppable');
        }
        //methods to be implemented by subclases
        configureElemListeners() {
            //...Super Class Methods implementation...
            //drag event handlers
            //elem = section
            this.elem.addEventListener('dragover', this.dragOverHandler); //dragOver handler...
            this.elem.addEventListener('drop', this.dropHandler); //drop handler...
            this.elem.addEventListener('dragleave', this.dragLeaveHandler); //dragLeave handler...
            //Add listeners to the listenerFunctions Array
            App.prjState.addListener((prjArray) => {
                const relevantProjects = prjArray.filter(prj => {
                    // alert(this.listType);
                    if (this.listType === 'active') {
                        return prj.status === App.ProjectStatus.Active;
                    }
                    return prj.status === App.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.triggerProjectItemRendering();
            });
        }
        //render projects in the UI.
        triggerProjectItemRendering() {
            //Clear the UI before rendering to avoid duplicating the items in the UI.
            const ulList = document.getElementById(`${this.listType}-projects-list`);
            ulList.innerHTML = '';
            //gather the host ul list Id so tht in the loop below we cen pass it as argument along with each single project to the constructor.
            const hostId = this.elem.querySelector('ul').id;
            for (const prjItem of this.assignedProjects) {
                //Instance of the ProjectItem Class. Each project will be an instance of the Project Item Class.
                //Since we have a couple of templates. we need to pass the host id to the ProjectItem Constructor do that 
                //the rendering is performed to the proper ul list.
                new App.ProjectItem(hostId, prjItem);
            }
        }
        configureElemProps() {
            //...Super Class Methods implementation...
            const listId = `${this.listType}-projects-list`;
            this.elem.querySelector('h2').textContent = this.listType.toUpperCase() + ' PROJECTS';
            this.elem.querySelector('ul').id = listId;
        }
    }
    __decorate([
        App.autobind
    ], projectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autobind
    ], projectList.prototype, "dropHandler", null);
    __decorate([
        App.autobind
    ], projectList.prototype, "dragLeaveHandler", null);
    App.projectList = projectList;
})(App || (App = {}));
