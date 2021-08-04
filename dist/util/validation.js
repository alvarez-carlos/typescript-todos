//validate function
export const validate = (userInput) => {
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
