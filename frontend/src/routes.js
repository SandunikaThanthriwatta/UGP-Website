import Index from "views/Index.js";
import Projects from "views/examples/Projects";
import Project from "views/examples/Project.js";
import Login from "views/examples/Login.js";
import Evaluators from "views/examples/Evaluators";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import AllProjects from "views/examples/AllProjects";
import MyProject from "views/examples/MyProject";
import Final from "views/examples/Final";
import Progress from "views/examples/Progress";
import Proposal from "views/examples/Proposal";
import Progress_1 from "views/examples/Progress";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  // {
  //   path: "/projects",
  //   name: "Projects",
  //   icon: "ni ni ni-collection text-primary",
  //   component: <Projects />,
  //   layout: "/evaluator",
  // },
  {
    path: "/proposal",
    name: "Proposals",
    icon: "ni ni ni-collection text-primary",
    component: <Proposal />,
    layout: "/evaluator",
  },
    {
    path: "/progress",
    name: "Progress",
    icon: "ni ni ni-collection text-primary",
    component: <Progress_1 />,
    layout: "/evaluator",
  },  {
    path: "/final",
    name: "Final",
    icon: "ni ni ni-collection text-primary",
    component: <Final />,
    layout: "/evaluator",
  },
  {
    path: "/all-projects",
    name: "allProjects",
    icon: "ni ni ni-folder-17 text-primary",
    component: <AllProjects />,
    layout: "/admin",
  },

  {
    path: "/all-projects",
    name: "allProjects",
    icon: "ni ni ni-folder-17 text-primary",
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
