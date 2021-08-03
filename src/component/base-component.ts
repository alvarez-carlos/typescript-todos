namespace App {
    //Class to render the HTML Object from the templates do the app
    export abstract class Component <T extends HTMLElement, U extends HTMLElement>{
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
}