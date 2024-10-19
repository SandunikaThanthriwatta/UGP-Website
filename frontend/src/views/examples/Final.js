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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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
import axios from "axios";
import { submitStuentMarks } from "store/actions/evaluatorAction";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const Final = (props) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userData);
  const projects = useSelector((state) => state.project.projects);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [searchYear, serSearchYear] = useState("");
  const [modal, setModal] = useState(false);
  const [marks, setmarks] = useState({});
  const toggle = () => setModal(!modal);
  const [modals, setModals] = useState(
    Array(projects && projects.length).fill(false)
  );

  const [modals_1, setModals_1] = useState(
    Array(projects && projects.length).fill(false)
  );

  const [formData, setFormData] = useState({
    studentId: "",
    marks: "",
  });

  // if (window.Chart) {
  //   parseOptions(Chart, chartOptions());
  // }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const toggleModal = (index) => {
    const updatedModals = [...modals];
    updatedModals[index] = !updatedModals[index];
    setModals(updatedModals);
  };

  const toggleModal_1 = (index) => {
    const updatedModals = [...modals_1];
    updatedModals[index] = !updatedModals[index];
    setModals_1(updatedModals);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setmarks((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(marks);
  };

  const studentMarksSubmit = (groupId) => {
    const data = {
      id: formData.studentId,
      studentMarks: parseFloat(formData.marks),
      groupId: groupId,
    };

    dispatch(submitStuentMarks(data));
  };

  const onChangeGroupMarks = async (id) => {
    const data = {
      id: id,
      marks: marks,
    };
    await toast.promise(
      axios
        .post(`${serverUrl}student/group-marks`, data)
        .then((response) => {
          if (response.status === 200) {
            searchYearhandler();
          }
          // Perform further actions after successful upload
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        }),
      {
        pending: "Submiting Marks",
        success: "submited",
        error: "Submition Failed",
      }
    );
  };

  const searchYearhandler = () => {
    if (searchYear) {
      dispatch(getProjectByEvaluator(userId._id, searchYear));
    }
  };

  const finalizeEvaluation = (id) => {
    axios
      .post(`${serverUrl}student/finalize-marks`)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        }
        // Perform further actions after successful upload
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

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
                    <h3 className="mb-0">
                      Assinged Projects - Final Evaluations
                    </h3>
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
              </CardHeader>
              {projects.length !== 0 ? (
                <>
                  {" "}
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Group Id</th>
                        <th scope="col">Project Name</th>
                        <th scope="col">Main Supervisor's Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length !== 0 &&
                        projects.map((p, index) => {
                          return (
                            <>
                              {" "}
                              <tr>
                                <th scope="row">{p.groupId}</th>
                                <td>{p.projectName}</td>
                                <td>{p.mainSupervisor}</td>
                                <td>
                                  {p.evaluationFinalized ? (
                                    <>
                                      {" "}
                                      <Button
                                        className="bg-red text-white"
                                        href="#pablo"
                                        size="lg"
                                      >
                                        {" "}
                                        Evaluated
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <Button
                                        color="primary"
                                        href="#pablo"
                                        onClick={() => toggleModal(index)}
                                        size="lg"
                                      >
                                        {" "}
                                        Evaluate
                                      </Button>
                                    </>
                                  )}

                                  {/* <button></button> */}
                                  {/* <i className="fas fa-arrow-up text-success mr-3" /> 46,53% */}
                                </td>
                              </tr>
                              <Modal
                                isOpen={modals[index]}
                                toggle={() => toggleModal(index)}
                                fullscreen
                              >
                                <ModalHeader toggle={() => toggleModal(index)}>
                                  Final Evaluation Form
                                </ModalHeader>
                                <ModalBody>
                                  {/* <Form>
                                <div>
                                  {" "}
                                  <Label className="text-red" for="projectId">
                                    Student No: {index + 1}
                                  </Label>
                                  <FormGroup>
                                    <Label for="student1">Student Id</Label>
                                    <Input
                                      id="student1"
                                      name={`student${index}`}
                                      value={p.studentId}
                                      placeholder="FYP Project Id"
                                      type="text"
                                    />
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="marks">Individual Marks</Label>
                                    <Input
                                      id="marks"
                                      name={`marks${index}`}
                                      // onChange={(e) => {
                                      //   setFormData({
                                      //     studentId: p.studentId,
                                      //     marks: e.target.value,
                                      //   });
                                      // }}
                                      className="mb-2"
                                      placeholder={`criteria 1`}
                                      type="number"
                                      max={100}
                                    />
                                  </FormGroup>
                                  <hr className="bg-green" />
                                </div>

                                <Button
                                  className="bg-red text-white"
                                  // onClick={() => {
                                  //   studentMarksSubmit(p.groupId);
                                  // }}
                                >
                                  Submit
                                </Button>
                              </Form> */}
                                  <div>
                                    {" "}
                                    {p.projectEvaluationScore &&
                                      p.projectEvaluationScore.final.length !==
                                        0 &&
                                      p.projectEvaluationScore.final.map(
                                        (final, index) => {
                                          const containsIndividual =
                                            final.criteria
                                              .toLowerCase()
                                              .includes("individual") ||
                                            (final.sub_criteria &&
                                              final.sub_criteria
                                                .toLowerCase()
                                                .includes("individual"));
                                          return (
                                            <FormGroup key={index}>
                                              <Label for="exampleprojectname">
                                                <p className="text-red mb-0">
                                                  {" "}
                                                  {final.criteria}
                                                </p>
                                                {console.log(
                                                  containsIndividual
                                                )}
                                                {containsIndividual && (
                                                  <>
                                                    {" "}
                                                    {p.groupMembers &&
                                                      p.groupMembers.map(
                                                        (p, index) => {
                                                          return (
                                                            <div key={index}>
                                                              {/* ... */}
                                                              <Modal
                                                                isOpen={
                                                                  modals_1[
                                                                    index
                                                                  ]
                                                                }
                                                                toggle={() =>
                                                                  toggleModal_1(
                                                                    index
                                                                  )
                                                                }
                                                                fullscreen
                                                              >
                                                                <ModalHeader
                                                                  toggle={() =>
                                                                    toggleModal_1(
                                                                      index
                                                                    )
                                                                  }
                                                                >
                                                                  Student
                                                                  Evaluation
                                                                  Form
                                                                </ModalHeader>
                                                                <ModalBody>
                                                                  <Form>
                                                                    <div>
                                                                      {" "}
                                                                      <Label
                                                                        className="text-red"
                                                                        for="projectId"
                                                                      >
                                                                        Student
                                                                        No:{" "}
                                                                        {index +
                                                                          1}
                                                                      </Label>
                                                                      <FormGroup>
                                                                        <Label for="student1">
                                                                          Student
                                                                          Id
                                                                        </Label>
                                                                        <Input
                                                                          id="student1"
                                                                          name={`student${index}`}
                                                                          value={
                                                                            p.studentId
                                                                          }
                                                                          placeholder="FYP Project Id"
                                                                          type="text"
                                                                        />
                                                                      </FormGroup>
                                                                      <FormGroup>
                                                                        <Label for="marks">
                                                                          Individual
                                                                          Marks
                                                                        </Label>
                                                                        <Input
                                                                          id="marks"
                                                                          name={`marks${index}`}
                                                                          onChange={(
                                                                            e
                                                                          ) => {
                                                                            setFormData(
                                                                              {
                                                                                studentId:
                                                                                  p.studentId,
                                                                                marks:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              }
                                                                            );
                                                                          }}
                                                                          className="mb-2"
                                                                          placeholder={`criteria 1`}
                                                                          type="number"
                                                                          max={
                                                                            100
                                                                          }
                                                                        />
                                                                      </FormGroup>
                                                                      <hr className="bg-green" />
                                                                    </div>

                                                                    <Button
                                                                      className="bg-red text-white"
                                                                      onClick={() => {
                                                                        studentMarksSubmit(
                                                                          p.groupId
                                                                        );
                                                                      }}
                                                                    >
                                                                      Submit
                                                                    </Button>
                                                                  </Form>
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                  <Button
                                                                    color="primary"
                                                                    onClick={() =>
                                                                      toggleModal_1(
                                                                        index
                                                                      )
                                                                    }
                                                                  >
                                                                    Cancel
                                                                  </Button>
                                                                </ModalFooter>
                                                              </Modal>
                                                              <Button
                                                                color="primary"
                                                                href="#pablo"
                                                                onClick={() =>
                                                                  toggleModal_1(
                                                                    index
                                                                  )
                                                                }
                                                                size="lg"
                                                              >
                                                                Evaluate Student{" "}
                                                                {p.studentId}
                                                              </Button>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                  </>
                                                )}
                                              </Label>
                                              {!containsIndividual && (
                                                <Input
                                                  id="final"
                                                  name={`final_${index}`}
                                                  className="mb-2"
                                                  onChange={handleChange}
                                                  defaultValue={final.marks}
                                                  placeholder={`marks`}
                                                  type="number"
                                                  max={100}
                                                />
                                              )}
                                            </FormGroup>
                                          );
                                        }
                                      )}
                                    <hr />
                                    <Button
                                      className="bg-red text-white"
                                      onClick={() => {
                                        onChangeGroupMarks(p._id);
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </ModalBody>
                                <ModalFooter>
                                  <Button
                                    color="primary"
                                    onClick={() => toggleModal(index)}
                                  >
                                    Cancel
                                  </Button>
                                </ModalFooter>
                              </Modal>
                            </>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              ) : (
                <>
                  {" "}
                  <Button color="primary">
                    No Group Assigned In this Academic Year
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Final;
