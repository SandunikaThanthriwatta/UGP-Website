import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const Index = (props) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const user = useSelector((state) => state.user.userData);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [searchYear, serSearchYear] = useState("2023");
  const [year, setYear] = useState("");
  const [dispChart, setDispChart] = useState(false);
  const [proposalMarks, setProposalMarks] = useState();
  const [progressMarks, setProgressMarks] = useState();
  const [finalMarks, setFinalMarks] = useState();
  const [groupIds, setGroupIds] = useState();
  const [finalize, setFinalized] = useState(false);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const data = {
    labels: groupIds,
    datasets: [
      {
        label: "proposalMarks",
        data: proposalMarks,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const data_2 = {
    labels: groupIds,
    datasets: [
      {
        label: "progressMarks",
        data: progressMarks,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const data_3 = {
    labels: groupIds,
    datasets: [
      {
        label: "finalMarks",
        data: finalMarks,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const finalizeEvaluation = async () => {
    await toast.promise(
      axios
        .post(`${serverUrl}student/finalize-marks`, {
          searchYear,
        })
        .then((response) => {
          if (response.status === 200) {
            window.location.reload();
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        }),
      {
        pending: "Finalizing Evaluations",
        success: "Finalized Evaluations",
        error: "Evaluation Finalization Failed",
      }
    );
  };

  const chartData = () => {
    setDispChart(true);
    axios
      .get(`${serverUrl}student/chart-marks/${searchYear}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setProgressMarks(response.data.progress_marks);
          setProposalMarks(response.data.proposal_marks);
          setFinalMarks(response.data.final_Mrks);
          setGroupIds(response.data.groupIds);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  const searchYearhandler = () => {
    dispatch(getAllProjects(searchYear));
  };

  useEffect(() => {
    // dispatch();
    if (projects.length !== 0) {
      if (projects[0].evaluationFinalized) {
        chartData();
        setFinalized(true);
      }
    }
  }, [projects]);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                {(user && user.userType === 2) ||
                (user && user.userType === 3) ? (
                  <>
                    {" "}
                    <Row className="align-items-center">
                      <div className="col">
                        <h6 className="text-uppercase text-muted ls-1 mb-1">
                          Student Performance
                        </h6>
                        <h2 className="mb-4">
                          {" "}
                          FYP total projects In {searchYear} Academic Year{" "}
                        </h2>
                        <h3 className="mb-0">
                          {" "}
                          Total No of Projects -{projects.length}
                        </h3>
                        {user && user.userType === 2 && !finalize && (
                          <Button
                            color="primary"
                            size="lg"
                            onClick={finalizeEvaluation}
                          >
                            Finalize Evaluation in Year - {searchYear}
                          </Button>
                        )}
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
                        Submit
                      </Button>
                    </Row>
                  </>
                ) : (
                  <>Welcome To the Final Year Project Evaluation Portal</>
                )}
              </CardHeader>
              <CardBody>
                {( user &&  user.userType === 2 || user && user.userType === 3) &&
                  dispChart && (
                    <>
                      {projects && projects.length !== 0 && (
                        <>
                          <div className="chart">
                            <h3>Proposal Marks</h3>
                            <Bar data={data} options={options} />
                          </div>
                          <div className="chart">
                            <h3>Progress Marks</h3>
                            <Bar data={data_2} options={options} />
                          </div>
                          <div className="chart">
                            <h3>Final Marks</h3>
                            <Bar data={data_3} options={options} />
                          </div>
                        </>
                      )}
                    </>
                  )}
              </CardBody>
            </Card>
          </Col>

          {projects &&
            projects.length !== 0 &&
            projects.map((p, index) => {
              return (
                <Col xl="4">
                  <Link key={index} to={`/all/project/${p._id}`}>
                    <Card className="shadow mt-4">
                      <CardHeader className="bg-transparent">
                        <Row className="align-items-center">
                          <div className="col">
                            <h6 className="text-uppercase text-muted ls-1 mb-1">
                              Group No: {p.groupId}
                            </h6>
                            <h2 className="mb-0">{p.projectName}</h2>
                          </div>
                        </Row>
                      </CardHeader>
                      <CardBody className="align-items-center d-flex justify-center">
                        <img
                          src={p.projectImages}
                          style={{ maxWidth: "200px" }}
                        />
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              );
            })}
        </Row>
        {/* <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Page visits</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Page name</th>
                    <th scope="col">Visitors</th>
                    <th scope="col">Unique users</th>
                    <th scope="col">Bounce rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">/argon/</th>
                    <td>4,569</td>
                    <td>340</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/index.html</th>
                    <td>3,985</td>
                    <td>319</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/charts.html</th>
                    <td>3,513</td>
                    <td>294</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      36,49%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/tables.html</th>
                    <td>2,050</td>
                    <td>147</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/profile.html</th>
                    <td>1,795</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row> */}
      </Container>
    </>
  );
};

export default Index;
