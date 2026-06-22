import Index from "views/Index.js";
import Projects from "views/examples/Projects";
import Project from "views/examples/Project.js";
import Login from "views/examples/Login.js";
import Evaluators from "views/examples/Evaluators";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import AllProjects from "views/examples/AllProjects";
import Students from "views/examples/Students";
import MyProject from "views/examples/MyProject";
import EvaluatorDashboard from "views/examples/EvaluatorDashboard";
import EvaluateProjects from "views/examples/EvaluateProjects";
import ProjectView from "views/examples/ProjectView";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-info",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <EvaluatorDashboard />,
    layout: "/evaluator",
  },
  // {
  //   path: "/projects",
  //   name: "Projects",
  //   icon: "ni ni ni-collection text-primary",
  //   component: <Projects />,
  //   layout: "/evaluator",
  // },
  {
    path: "/evaluate",
    name: "Evaluate Projects",
    icon: "ni ni-check-bold text-primary",
    component: <EvaluateProjects />,
    layout: "/evaluator",
  },
  {
    path: "/students",
    name: "Students",
    icon: "ni ni-single-02 text-info",
    component: <Students />,
    layout: "/admin",
  },
  {
    path: "/all-projects",
    name: "All Projects",
    icon: "ni ni-folder-17 text-info",
    component: <AllProjects />,
    layout: "/admin",
  },

  {
    path: "/all-projects",
    name: "Projects",
    icon: "ni ni-folder-17 text-info",
    component: <AllProjects />,
    layout: "/hod",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  {
    path: "/project/:id",
    name: "Your Project",
    icon: "ni ni-single-copy-04 text-red",
    component: <Project />,
    layout: "/admin",
  },

  {
    path: "/project/:id",
    name: "Your Project",
    icon: "ni ni-single-copy-04 text-red",
    component: <Project />,
    layout: "/all",
  },

  {
    path: "/project-view/:id",
    name: "Project Details",
    icon: "ni ni-single-copy-04 text-primary",
    component: <ProjectView />,
    layout: "/all",
  },

  {
    path: "/my-project",
    name: "My Project",
    icon: "ni ni-single-copy-04 text-green",
    component: <MyProject />,
    layout: "/student",
  },

  {
    path: "/admin/evaluators",
    name: "Evaluators",
    icon: "ni ni-hat-3 text-info",
    component: <Evaluators />,
    layout: "/admin",
  },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: <Tables />,
  //   layout: "/admin",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
];
export default routes;
