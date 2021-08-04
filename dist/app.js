<<<<<<< HEAD
import { projectList } from "./component/project-list.js";
import { ProjectInput } from "./component/project-input.js";
const prjInput = new ProjectInput();
const activeList = new projectList('active');
const finishedList = new projectList('finished');
=======
"use strict";
///<reference path="./component/project-input.ts"/>
///<reference path="./component/project-list.ts"/>
var App;
(function (App) {
    const prjInput = new App.ProjectInput();
    const activeList = new App.projectList('active');
    const finishedList = new App.projectList('finished');
})(App || (App = {}));
>>>>>>> main
