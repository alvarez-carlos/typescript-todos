"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//autobind decorator....
//avoid having the (this) losing the context or referenciating to the event in the addEventListener....
function autobind(_target, _methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this); //binds (this) to the method's descriptor value... 
            return boundFn;
        }
    };
    return adjDescriptor;
}
//State class to handle Project stats. having a superclass for the states makes the project extensible, so for future we can also inherit to handle the state of something else....
class State {
    constructor() {
        // private listenerFunctions: Listener<T>[] = [];
        this.listenerFunctions = [];
    }
    addListener(listenerFn) {
        this.listenerFunctions.push(listenerFn);
    }
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
//Singleton Class
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    //method to get the instance of the projectStat Class. It makes sure only one instance is created
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    //add Project Mehod
    addProject(title, description, people) {
        //create instances of the class Project and pass the values to the constructor. This creates the project.
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        //Refresh the UI...by calling the Listeners whom call the renders whom refreshes the UI
        // console.log(this.projects);
        this.callListeners();
    }
    //move project
    moveProject(prjId, newPrjStatus) {
        const prjItem = this.projects.find(prj => prjId === prj.id);
        if (prjItem && prjItem.status !== newPrjStatus) {
            prjItem.status = newPrjStatus; //update the status of the moved project...
            this.callListeners(); //call listeners to refresh UI.
        }
    }
    callListeners() {
        for (const listenerFn of this.listenerFunctions) {
            // console.log(`Function this...: ${listenerFn}`);
            listenerFn(this.projects);
        }
    }
}
//Class to render the HTML Object from the templates do the app
class Component {
    constructor(src, host, renderBegin, elemId) {
        this.src = document.getElementById(src);
        this.host = document.getElementById(host);
        const srcNode = document.importNode(this.src.content, true);
        this.elem = srcNode.firstElementChild;
        this.renderBegin = renderBegin;
        if (elemId) {
            this.elem.id = elemId;
        }
        //render elem 
        this.renderElem();
    }
    //render elem
    renderElem() {
        this.host.insertAdjacentElement(this.renderBegin ? 'afterbegin' : 'beforeend', this.elem);
    }
}
//Project Item
class ProjectItem extends Component {
    constructor(hostId, prjItem) {
        //calling super to render the li elem in the ul host.
        super('single-project', hostId, false, prjItem.id);
        this.prjItem = prjItem;
        this.configureElemProps();
        this.configureElemListeners();
    }
    dragStartHandler(e) {
        console.log('Drag Start!');
        //store the projectId in the DataTransfer. it will be used in the dragover and drop handlers in the ProjectList Class.
        //set the effect allowse...
        e.dataTransfer.setData('text/plain', this.prjItem.id);
        e.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(e) {
        console.log('Drag End!');
    }
    //methods to be implemented by subclases
    configureElemListeners() {
        //...Super Class Methods implementation...
        //set drag  event listeners
        //elem = li
        this.elem.addEventListener('dragstart', this.dragStartHandler);
        this.elem.addEventListener('dragend', this.dragEndHandler);
    }
    configureElemProps() {
        //...Super Class Methods implementation...
        // console.log(this.prjItem);
        this.elem.querySelector('h2').textContent = this.prjItem.title;
        this.elem.querySelector('h3').textContent = this.prjItem.people.toString();
        this.elem.querySelector('p').textContent = this.prjItem.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandler", null);
//Project List
class projectList extends Component {
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
        prjState.moveProject(prjId, this.listType === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
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
        prjState.addListener((prjArray) => {
            const relevantProjects = prjArray.filter(prj => {
                // alert(this.listType);
                if (this.listType === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
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
            new ProjectItem(hostId, prjItem);
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
    autobind
], projectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], projectList.prototype, "dropHandler", null);
__decorate([
    autobind
], projectList.prototype, "dragLeaveHandler", null);
//validate function
const validate = (userInput) => {
    let isValid = true;
    if (userInput.required) {
        isValid = isValid && userInput.value.toString().trim().length !== 0;
    }
    if (userInput.minStringLenght != null && typeof userInput.value === 'string') {
        isValid = isValid && userInput.value.length >= userInput.minStringLenght;
    }
    if (userInput.maxStringLength != null && typeof userInput.value === 'string') {
        isValid = isValid && userInput.value.length <= userInput.maxStringLength;
    }
    if (userInput.minNumvalue != null && typeof userInput.value === 'number') {
        isValid = isValid && userInput.value >= userInput.minNumvalue;
    }
    if (userInput.maxNumValue != null && typeof userInput.value === 'number') {
        isValid = isValid && userInput.value <= userInput.maxNumValue;
    }
    return isValid;
};
//...
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        //get the form input element: title, description, people
        this.title = this.elem.querySelector('#title');
        this.description = this.elem.querySelector('#description');
        this.people = this.elem.querySelector('#people');
        //set the listener logic to perform on form submit event
        this.configureElemListeners();
    }
    configureElemListeners() {
        //...super class method...
        this.elem.addEventListener('submit', e => {
            e.preventDefault();
            //take the input values.
            const titleValue = this.title.value;
            const descriptionValue = this.description.value;
            const peopleValue = this.people.value;
            //set the objects to be validated. we will make use of the validate function.
            //the object will be of type Validatable (interface Validatable)
            const titleObjct = {
                value: titleValue,
                required: true,
                minStringLenght: 1,
                maxStringLength: 50,
            };
            const descriptionObject = {
                value: descriptionValue,
                required: true,
                minStringLenght: 5,
                maxStringLength: 250,
            };
            const peopleObject = {
                value: +peopleValue,
                required: true,
                minNumvalue: 1,
                maxNumValue: 10,
            };
            //call validate function tovalidate the user input.
            if (!validate(titleObjct) ||
                !validate(descriptionObject) ||
                !validate(peopleObject)) {
                alert('Invalid Input, please try agian!');
            }
            else {
                //user input was approved as valid.
                //next step: to call the addProject method through the ProjectState Instance to add the project to the projects array.
                prjState.addProject(titleValue, descriptionValue, +peopleValue); //End of ProjectInput...
                // console.log(titleValue, descriptionValue, peopleValue);
                //clear the form
                this.title.value = '';
                this.description.value = '';
                this.people.value = '';
            }
        });
    }
    configureElemProps() {
        //...super class method...  
    }
}
const prjInput = new ProjectInput();
const prjState = new ProjectState();
const activeList = new projectList('active');
const finishedList = new projectList('finished');
