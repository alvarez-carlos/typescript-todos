
//autobind decorator....
//avoid having the (this) losing the context or referenciating to the event in the addEventListener....
export function autobind(
    _target: any, 
    _methodName: string, 
    descriptor: PropertyDescriptor
)   {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);//binds (this) to the method's descriptor value... 
            return boundFn;
        }
    }
    return adjDescriptor;
}
