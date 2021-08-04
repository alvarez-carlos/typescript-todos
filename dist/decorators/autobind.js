//autobind decorator....
//avoid having the (this) losing the context or referenciating to the event in the addEventListener....
export function autobind(_target, _methodName, descriptor) {
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
