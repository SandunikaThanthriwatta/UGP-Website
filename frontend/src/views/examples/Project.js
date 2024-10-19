import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getProject } from "../../store/actions/projectAction";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Label,
  Modal,
  FormText,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { submitStuentMarks } from "store/actions/evaluatorAction";
import { serverUrl } from "utils/serveUrl";

const Project = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const user = useSelector((state) => state.user.userData);
  const [modal, setModal] = useState(false);

  const [modals, setModals] = useState(
    Array(project.groupMembers && project.groupMembers.length).fill(false)
  );

  const [marks, setmarks] = useState({});

  const toggle = () => setModal(!modal);

  const [formData, setFormData] = useState({
    studentId: "",
    marks: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setmarks((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(marks);
  };

  const onChangeGroupMarks = (id) => {
    const data = {
      id: id,
      marks: marks,
    };

    axios
      .post(`${serverUrl}student/group-marks`, data)
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

  const studentMarksSubmit = (groupId) => {
    const data = {
      id: formData.studentId,
      studentMarks: parseFloat(formData.marks),
      groupId: groupId,
    };

    dispatch(submitStuentMarks(data));
  };

  const toggleModal = (index) => {
    const updatedModals = [...modals];
    updatedModals[index] = !updatedModals[index];
    setModals(updatedModals);
  };

  useEffect(() => {
    dispatch(getProject(id));
  }, []);

  return (
    <>
      <UserHeader />
      {/* Page content */}
      {project && (
        <>
          {" "}
          <Container className="mt--7" fluid>
            <Row>
              <Col className="order-xl-1" xl="12">
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">My Project</h3>
                      </Col>
                      {user && user.userType !== 0 && (
                        <Col className="text-right" xs="4">
                          <div className="d-flex">
                            {project && (
                              <>
                                {project.finalMarks &&
                                  project.finalMarks.proposal !== "0" && (
                                    <>
                                      {" "}
                                      <Button
                                        className="bg-red text-white"
                                        size="lg"
                                      >
                                        Final Marks{" "}
                                        {parseFloat(
                                          project.finalMarks.proposal
                                        ) +
                                          parseFloat(
                                            project.finalMarks.progress
                                          ) +
                                          parseFloat(project.finalMarks.final)}
                                      </Button>
                                    </>
                                  )}

                                {!project.finalMarks && (
                                  <>
                                    {" "}
                                    <Button
                                      color="primary"
                                      onClick={toggle}
                                      size="lg"
                                    >
                                      Evaluate Group {project.groupId}
                                    </Button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <div className="pl-lg-4 ">
                        Project Name: <br />
                        <h3 className="mb-2"> {project.projectName}</h3>
                        <p>
                          group ID: <br />
                          <h3 className="mb-2"> {project.groupId}</h3>
                        </p>
                        <p>
                          Group Members: <br />
                          {project.groupMembers &&
                            project.groupMembers.map((p, index) => {
                              return (
                                <div key={index}>
                                  {/* ... */}
                                  <Modal
                                    isOpen={modals[index]}
                                    toggle={() => toggleModal(index)}
                                    fullscreen
                                  >
                                    <ModalHeader
                                      toggle={() => toggleModal(index)}
                                    >
                                      Student Evaluation Form
                                    </ModalHeader>
                                    <ModalBody>
                                      <Form>
                                        <div>
                                          {" "}
                                          <Label
                                            className="text-red"
                                            for="projectId"
                                          >
                                            Student No: {index + 1}
                                          </Label>
                                          <FormGroup>
                                            <Label for="student1">
                                              Student Id
                                            </Label>
                                            <Input
                                              id="student1"
                                              name={`student${index}`}
                                              value={p.studentId}
                                              placeholder="FYP Project Id"
                                              type="text"
                                            />
                                          </FormGroup>
                                          <FormGroup>
                                            <Label for="marks">
                                              Individual Marks
                                            </Label>
                                            <Input
                                              id="marks"
                                              name={`marks${index}`}
                                              onChange={(e) => {
                                                setFormData({
                                                  studentId: p.studentId,
                                                  marks: e.target.value,
                                                });
                                              }}
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
                                          onClick={() => {
                                            studentMarksSubmit(project.groupId);
                                          }}
                                        >
                                          Submit
                                        </Button>
                                      </Form>
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
                                  {project.evaluationFinalized ? (
                                    <>
                                      {user.userId === p.studentId && (
                                        <>
                                          <Button
                                            color="primary"
                                            href="#pablo"
                                            size="lg"
                                          >
                                            your Marks {p.studentFinalMarks}
                                          </Button>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        color="primary"
                                        href="#pablo"
                                        onClick={() => toggleModal(index)}
                                        size="lg"
                                      >
                                        Evaluate Student {p.studentId}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                        </p>
                        <p>
                          Main Supervisor: <br />
                          <h3 className="mb-4"> {project.mainSupervisor}</h3>
                        </p>
                      </div>
                      {/* Description */}
                      <h6 className="heading-small text-muted mb-4">
                        About Project
                      </h6>
                      <img
                        src={project.projectImages}
                        style={{ maxWidth: "200px" }}
                      />
                      <div className="pl-lg-4">
                        <FormGroup>
                          {/* <label>About Me</label> */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: project.projectDescription,
                            }}
                          ></div>
                        </FormGroup>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Modal isOpen={modal} toggle={toggle} fullscreen>
              <ModalHeader toggle={toggle}>Group Evaluation Form</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="projectId">Group Id</Label>
                    <Input
                      id="projectId"
                      name=""
                      value={project.groupId}
                      placeholder="FYP Project Id"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleprojectname">project Name</Label>
                    <Input
                      id="exampleprojectname"
                      name="projectname"
                      value={project.projectName}
                      placeholder="project Name "
                      type="text"
                    />
                  </FormGroup>
                  <Label for="exampleprojectname">Proposal</Label>
                  <div>
                    {" "}
                    {project.projectEvaluationScore &&
                      project.projectEvaluationScore.proposal.length !== 0 &&
                      project.projectEvaluationScore.proposal.map(
                        (proposal, index) => {
                          return (
                            <FormGroup key={index}>
                              <Label for="exampleprojectname">
                                <p className="text-red mb-0">
                                  {" "}
                                  {proposal.criteria}
                                </p>

                                <p>
                                  {proposal.sub_criteria !== "null" &&
                                    proposal.sub_criteria}
                                </p>
                              </Label>
                              <Input
                                id="Proposal"
                                name={`proposal_${index}`}
                                className="mb-2"
                                onChange={handleChange}
                                defaultValue={proposal.marks}
                                placeholder={`marks`}
                                type="number"
                                max={100}
                              />
                            </FormGroup>
                          );
                        }
                      )}
                    <hr />
                  </div>

                  <Label for="exampleprojectname">Progress</Label>
                  <div>
                    {" "}
                    {project.projectEvaluationScore &&
                      project.projectEvaluationScore.progress.length !== 0 &&
                      project.projectEvaluationScore.progress.map(
                        (progress, index) => {
                          return (
                            <FormGroup key={index}>
                              <Label for="exampleprojectname">
                                <p className="text-red mb-0">
                                  {" "}
                                  {progress.criteria}
                                </p>

                                <p>
                                  {progress.sub_criteria !== "null" &&
                                    progress.sub_criteria}
                                </p>
                              </Label>
                              <Input
                                id="Proposal"
                                name={`progress_${index}`}
                                className="mb-2"
                                onChange={handleChange}
                                defaultValue={progress.marks}
                                placeholder={`marks`}
                                type="number"
                                max={100}
                              />
                            </FormGroup>
                          );
                        }
                      )}
                    <hr />
                  </div>

                  <Label for="exampleprojectname">Final</Label>
                  <div>
                    {" "}
                    {project.projectEvaluationScore &&
                      project.projectEvaluationScore.final.length !== 0 &&
                      project.projectEvaluationScore.final.map(
                        (final, index) => {
                          return (
                            <FormGroup key={index}>
                              <Label for="exampleprojectname">
                                <p className="text-red mb-0">
                                  {" "}
                                  {final.criteria}
                                </p>

                                <p>
                                  {final.sub_criteria !== "null" &&
                                    final.sub_criteria}
                                </p>
                              </Label>
                              <Input
                                id="Proposal"
                                name={`final_${index}`}
                                className="mb-2"
                                onChange={handleChange}
                                defaultValue={final.marks}
                                placeholder={`marks`}
                                type="number"
                                max={100}
                              />
                            </FormGroup>
                          );
                        }
                      )}
                    <hr />
                  </div>

                  <Button
                    className="bg-red text-white"
                    onClick={() => {
                      onChangeGroupMarks(project._id);
                    }}
                  >
                    Submit
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Container>
        </>
      )}
    </>
  );
};

export default Project;
