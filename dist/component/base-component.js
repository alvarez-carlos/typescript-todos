"use strict";
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
