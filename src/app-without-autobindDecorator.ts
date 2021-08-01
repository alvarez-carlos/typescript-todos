/*
//Global configuracion for the listeners functions
type Listener<T> = (items: T[]) => void;

//State class to handle Project stats. having a superclass for the states makes the project extensible, so for future we can also inherit to handle the state of something else....
class State <T> {
    // private listenerFunctions: Listener<T>[] = [];
    protected listenerFunctions: Listener<T>[] = [];
    addListener (listenerFn: Listener<T>) {
        this.listenerFunctions.push(listenerFn);
    }
}

enum ProjectStatus{
    Active,
    Finished
}

class Project{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ){}
}

//Singleton Class
class ProjectState extends State<Project>{
    // private projects: Project[];
    protected projects: Project[];
    private static instance: ProjectState;

    constructor(){
        super();
        this.projects = [];
    }

    //method to get the instance of the projectStat Class. It makes sure only one instance is created
    static getInstance(){
        if (this.instance){
            return this.instance;
        }
        else{
            this.instance = new ProjectState();
            return this.instance;
        }
    }

    //add Project Mehod
    addProject(title: string, description: string, people: number){
        //create instances of the class Project and pass the values to the constructor. This creates the project.
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        );
        this.projects.push(newProject);

        //Refresh the UI...by calling the Listeners whom call the renders whom refreshes the UI
        // console.log(this.projects);

        this.callListeners();
    }

    //move project
    moveProject (prjId: string, newPrjStatus: ProjectStatus) {
        const prjItem = this.projects.find(prj => prjId === prj.id);
        if (prjItem && prjItem.status !== newPrjStatus) {
            prjItem.status = newPrjStatus; //update the status of the moved project...
            this.callListeners(); //call listeners to refresh UI.
        }
    }

    callListeners(){
        for (const listenerFn of this.listenerFunctions) {
            // console.log(`Function this...: ${listenerFn}`);
            listenerFn(this.projects);
        }
    }

}



//Class to render the HTML Object from the templates do the app
abstract class Component <T extends HTMLElement, U extends HTMLElement>{
    src: HTMLTemplateElement;
    host: T;
    elem: U;
    renderBegin: boolean;

    constructor(
        src: string,
        host: string,
        renderBegin: boolean,
        elemId?: string
    ){
        this.src = document.getElementById(src)! as HTMLTemplateElement;
        this.host = document.getElementById(host)! as T;
        const srcNode = document.importNode(this.src.content, true);
        this.elem = srcNode.firstElementChild as U;
        this.renderBegin = renderBegin;

        if(elemId){
            this.elem.id = elemId;
        }

        //render elem 
        this.renderElem();
    }

    //render elem
    renderElem(){
       this.host.insertAdjacentElement(this.renderBegin ? 'afterbegin' : 'beforeend', this.elem);
    }

    //methods to be implemented by subclases
    abstract configureElemListeners(): void;
    abstract configureElemProps(): void;
}

//Project Item
class ProjectItem extends Component<HTMLTemplateElement, HTMLLIElement>{

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

    //methods to be implemented by subclases
    configureElemListeners(){
        //...Super Class Methods implementation...

        //set drag  event listeners
        //elem = li
        this.elem.addEventListener('dragstart', e => {  
            console.log('Drag Start!');         
            //store the projectId in the DataTransfer. it will be used in the dragover and drop handlers in the ProjectList Class.
            //set the effect allowse...
            e.dataTransfer!.setData('text/plain', this.prjItem.id);
            e.dataTransfer!.effectAllowed = 'move';

        })
        this.elem.addEventListener('dragend', e => {
            console.log('Drag End!');
        })

    }

    configureElemProps(){
        //...Super Class Methods implementation...
        // console.log(this.prjItem);
        this.elem.querySelector('h2')!.textContent = this.prjItem.title;
        this.elem.querySelector('h3')!.textContent = this.prjItem.people.toString();
        this.elem.querySelector('p')!.textContent = this.prjItem.description;
    }
}


//Project List
class projectList extends Component<HTMLDivElement, HTMLElement>{
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

    //methods to be implemented by subclases
    configureElemListeners(){
        //...Super Class Methods implementation...

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

        //drag event handlers
        //elem = section
        this.elem.addEventListener('dragover', e => {
            //Add the droppable class to set the backgrounds in the droppable box.
            if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain'){
                e.preventDefault();
                console.log('Drag Over!');
                const ulList = this.elem.querySelector('ul')! as HTMLUListElement;
                ulList.classList.add('droppable');
            }
        });
        this.elem.addEventListener('drop', e => {
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
        });
        this.elem.addEventListener('dragleave', e => {
            //remove the droppable class
            console.log('Drag Leave');
            const ulList = this.elem.querySelector('ul')! as HTMLUListElement;
            ulList.classList.remove('droppable');
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





//interface that states the properties of the object to be validated by the validate function.
//The objects will be of type Validatable.
interface Validatable{
    value: string| number,
    required: boolean,
    //props velow are optionl depending on the type of value to validate: string, number, etc...
    minStringLenght?: number,
    maxStringLength?: number,
    minNumvalue?: number,
    maxNumValue?: number,
}

//validate function
const validate = (userInput: Validatable) => {
    let isValid = true;

    if (userInput.required){
        isValid = isValid && userInput.value.toString().trim().length !== 0;
    }
    if (userInput.minStringLenght != null && typeof userInput.value === 'string'){
        isValid = isValid && userInput.value.length >= userInput.minStringLenght;
    }
    if (userInput.maxStringLength != null && typeof userInput.value === 'string'){
        isValid = isValid && userInput.value.length <= userInput.maxStringLength;
    }
    if (userInput.minNumvalue != null && typeof userInput.value === 'number'){
        isValid = isValid && userInput.value >= userInput.minNumvalue;
    }
    if (userInput.maxNumValue != null && typeof userInput.value === 'number'){
        isValid = isValid && userInput.value <= userInput.maxNumValue;
    }

    return isValid;
}

//...
class ProjectInput extends Component <HTMLDivElement, HTMLFormElement>{
    title: HTMLInputElement;
    description: HTMLInputElement;
    people: HTMLInputElement;

    constructor () {

        super(
            'project-input',
            'app',
            true,
            'user-input'
        );

        //get the form input element: title, description, people
        this.title = this.elem.querySelector('#title')! as HTMLInputElement;
        this.description = this.elem.querySelector('#description')! as HTMLInputElement;
        this.people = this.elem.querySelector('#people')! as HTMLInputElement;

        //set the listener logic to perform on form submit event
        this.configureElemListeners();
    }

    configureElemListeners(){
        //...super class method...
        this.elem.addEventListener('submit', e => {
            e.preventDefault();

            //take the input values.
            const titleValue = this.title.value;
            const descriptionValue = this.description.value;
            const peopleValue = this.people.value;

            //set the objects to be validated. we will make use of the validate function.
            //the object will be of type Validatable (interface Validatable)
            const titleObjct: Validatable = {
                value: titleValue,
                required: true,
                minStringLenght: 1,
                maxStringLength: 50,
            }
            const descriptionObject: Validatable = {
                value: descriptionValue,
                required: true,
                minStringLenght: 5,
                maxStringLength: 250,
            }
            const peopleObject: Validatable = {
                value: +peopleValue,
                required: true,
                minNumvalue: 1,
                maxNumValue: 10,
            }

            //call validate function tovalidate the user input.
            if (
                !validate(titleObjct) ||
                !validate(descriptionObject) ||
                !validate(peopleObject)
            ) {
                alert ('Invalid Input, please try agian!'); 
            }
            else{
                //user input was approved as valid.
                //next step: to call the addProject method through the ProjectState Instance to add the project to the projects array.
                
                
                prjState.addProject(titleValue, descriptionValue, +peopleValue); //End of ProjectInput...
                // console.log(titleValue, descriptionValue, peopleValue);
                
                //clear the form
                this.title.value = '';
                this.description.value = '';
                this.people.value ='';
            }
        })
    }
    configureElemProps(){
        //...super class method...  
    }

}

const prjInput = new ProjectInput();
const prjState = new ProjectState();
const activeList = new projectList('active');
const finishedList = new projectList('finished');
*/