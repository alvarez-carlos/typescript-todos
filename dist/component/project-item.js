<<<<<<< HEAD
=======
"use strict";
///<reference path="base-component.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../models/project.ts"/>
///<reference path="../models/drag-drop.ts"/>
>>>>>>> main
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
<<<<<<< HEAD
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js';
//Project Item
export class ProjectItem extends Component {
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
=======
var App;
(function (App) {
    //Project Item
    class ProjectItem extends App.Component {
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
        App.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
>>>>>>> main
