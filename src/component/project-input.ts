///<reference path="base-component.ts"/>
///<reference path="../util/validation.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../state/project-state.ts"/>

namespace App {
    //...
    export class ProjectInput extends Component <HTMLDivElement, HTMLFormElement>{
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
}