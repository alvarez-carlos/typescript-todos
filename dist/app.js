import { projectList } from "./component/project-list.js";
import { ProjectInput } from "./component/project-input.js";
const prjInput = new ProjectInput();
const activeList = new projectList('active');
const finishedList = new projectList('finished');
