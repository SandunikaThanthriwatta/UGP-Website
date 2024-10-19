import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  FormText,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getProjectByEvaluator } from "store/actions/projectAction";
import { Link } from "react-router-dom";

const Projects = (props) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userData);
  const projects = useSelector((state) => state.project.projects);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  // useEffect(() => {
  //   if (userId) {
  //     dispatch(getProjectByEvaluator(userId._id));
  //   }
  // }, []);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Assinged Projects</h3>
                  </div>
                  <div className="col text-right">
                    {/* <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button> */}
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Group Id</th>
                    <th scope="col">Project Name</th>
                    <th scope="col">Supervisor's Name</th>
                    {/* <th scope="col">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {projects.length !== 0 &&
                    projects.map((p) => {
                      return (
                        <>
                          {" "}
                          <tr>
                            <th scope="row">{p.groupId}</th>
                            <td>{p.projectName}</td>
                            <td>{p.mainSupervisor}</td>
                            <td>
                              {/* <Link to={`/admin/project/${p._id} `}>
                              <Button
                                size="md"
                                className="btn bg-yellow text"
                                onClick={toggle}
                              >
                                {" "}
                                Evaluate
                              </Button>
                              </Link> */}


                              {/* <button></button> */}
                              {/* <i className="fas fa-arrow-up text-success mr-3" /> 46,53% */}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </Table>
   
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Projects;
