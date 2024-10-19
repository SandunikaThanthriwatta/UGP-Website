import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getAllProjects } from "store/actions/projectAction";
import { Link } from "react-router-dom";
import { getAllEvaluators } from "store/actions/evaluatorAction";
import { assignEvaluator } from "store/actions/evaluatorAction";

const AllProjects = (props) => {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.project.projects);
  const evaluators = useSelector((state) => state.evaluator.evaluators);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [modal, setModal] = useState({
    type: false,
    id: "",
  });
  const [searchYear, serSearchYear] = useState("");

  const [selectedOption, setSelectedOption] = useState({
    option: "",
    id: "",
  });

  const [evaName, setEvaName] = useState();
  const toggle = (id) => {
    setModal({
      type: !modal.type,
      id: id,
    });
  };

  const searchYearhandler = () => {
    dispatch(getAllProjects(searchYear));
  };

  const onEvaSubmitHandler = () => {
    const data = {
      groupId: selectedOption.option,
      evaluatorId: selectedOption.id,
    };
    dispatch(assignEvaluator(data));
    dispatch(getAllProjects(searchYear));
  };
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    dispatch(getAllEvaluators());
  }, [dispatch, searchYear]);

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
                    <h3 className="mb-0">All Projects</h3>
                  </div>
                  <Form className="navbar-search  form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="search"
                          name="search"
                          placeholder="Search By Academic Year"
                          onChange={(e) => {
                            serSearchYear(e.target.value);
                          }}
                          type="text"
                        />
                      </InputGroup>
                    </FormGroup>
                  </Form>
                  <Button
                    className="bg-red text-white"
                    onClick={searchYearhandler}
                  >
                    Search
                  </Button>
                  <div className="col text-right"></div>
                </Row>
              </CardHeader>
              {projects.length !== 0 && (
                <>
                  {" "}
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Group Id</th>
                        <th scope="col">View Project</th>
                        <th scope="col">Project Name</th>
                        <th scope="col">Supervisor's Name</th>

                        <th scope="col">Evaluator Status</th>
                      </tr>
                    </thead>

                    {projects.map((p) => {
                      return (
                        <>
                          <tbody key={p._id}>
                            <tr>
                              <th scope="row">{p.groupId}</th>
                              <tb>
                                <Link to={`/admin/project/${p._id}`}>
                                  <button className="btn bg-purple text-white ">
                                    {" "}
                                    View Project
                                  </button>
                                </Link>
                              </tb>
                              <td>{p.projectName}</td>
                              <td>{p.mainSupervisor}</td>

                              <td>
                                {p.evaluator.map((r) => {
                                  return (
                                    <>
                                      {" "}
                                      <button className="btn bg-green text-white">
                                        {r.evaluatorName}
                                      </button>
                                    </>
                                  );
                                })}
                                {p.evaluator.length !== 3 && (
                                  <>
                                    {" "}
                                    <button
                                      onClick={() => {
                                        toggle(p._id);
                                      }}
                                      className="btn bg-yellow text"
                                    >
                                      {" "}
                                      Assign Evaluator
                                    </button>
                                  </>
                                )}
                                {modal.type && modal.id === p._id && (
                                  <Form key={p._id}>
                                    <FormGroup>
                                      <UncontrolledDropdown>
                                        <DropdownToggle caret color="dark">
                                          {evaName ? (
                                            <>{evaName}</>
                                          ) : (
                                            <>Select Evaluator</>
                                          )}
                                        </DropdownToggle>
                                        <DropdownMenu dark>
                                          {evaluators &&
                                            evaluators.map((q) => {
                                              return (
                                                <DropdownItem
                                                  onClick={() => {
                                                    setSelectedOption({
                                                      id: q._id,
                                                      option: p.groupId,
                                                    });
                                                    setEvaName(q.evaluatorName);
                                                  }}
                                                >
                                                  {q.evaluatorName}
                                                </DropdownItem>
                                              );
                                            })}
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </FormGroup>
                                    {evaluators && evaluators.length === 0 && (
                                      <>
                                        <div className="text-red">
                                          No Evaluator found! Please Create
                                          Evaluators
                                        </div>
                                      </>
                                    )}
                                    {evaluators && evaluators.length !== 0 && (
                                      <>
                                        {" "}
                                        <Button
                                          onClick={onEvaSubmitHandler}
                                          className="bg-red text-white"
                                        >
                                          Assign Evaluator
                                        </Button>
                                      </>
                                    )}
                                  </Form>
                                )}
                                 {/* <button></button> */}
                                {/* <i className="fas fa-arrow-up text-success mr-3" /> 46,53% */}
                              </td>
                              <td> </td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                    {/* <Modal isOpen={modal} toggle={toggle} fullscreen>
                      <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label className="mr-4">Evaluator's Name</Label>
                            <UncontrolledDropdown>
                              <DropdownToggle caret color="dark">
                                {evaName ? (
                                  <>{evaName}</>
                                ) : (
                                  <>Select Evaluator</>
                                )}
                              </DropdownToggle>
                              <DropdownMenu dark>
                                {evaluators &&
                                  evaluators.map((p) => {
                                    return (
                                      <DropdownItem
                                        onClick={() => {
                                          setSelectedOption(p._id);
                                          setEvaName(p.evaluatorName);
                                        }}
                                      >
                                        {p.evaluatorName}
                                      </DropdownItem>
                                    );
                                  })}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </FormGroup>
                          <Button
                            onClick={onEvaSubmitHandler}
                            className="bg-red text-white"
                          >
                            Assign Evaluator
                          </Button>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggle}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal> */}
                  </Table>
                </>
              )}
              {projects.length === 0 && (
                <>
                  {searchYear ? (
                    <>
                      <div className="text-white text-center p-10 mb-10 bg-green">
                        No records in Academic Year
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="text-white text-center p-10 mb-10 bg-green">
                        Enter Academic Year in search bar
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AllProjects;
