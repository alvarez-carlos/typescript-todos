import { Project, ProjectStatus } from '../models/project.js';


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

//Singleton Class
export class ProjectState extends State<Project>{
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
export const prjState = new ProjectState();
