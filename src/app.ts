///<reference path="./component/project-input.ts"/>
///<reference path="./component/project-list.ts"/>

namespace App {  
    const prjInput = new ProjectInput();
    const activeList = new projectList('active');
    const finishedList = new projectList('finished');
}