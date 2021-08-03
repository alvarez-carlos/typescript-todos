namespace App {

    //interface that states the properties of the object to be validated by the validate function.
    //The objects will be of type Validatable.
    export interface Validatable{
        value: string| number,
        required: boolean,
        //props velow are optionl depending on the type of value to validate: string, number, etc...
        minStringLenght?: number,
        maxStringLength?: number,
        minNumvalue?: number,
        maxNumValue?: number,
    }

    //validate function
    export const validate = (userInput: Validatable) => {
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
}