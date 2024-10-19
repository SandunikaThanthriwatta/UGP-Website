import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  CardTitle,
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
import { createEvaluator } from "store/actions/evaluatorAction";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [formData, setFormData] = useState({
    evaluatorId: "",
    evaluatorName: "",
    department: "",
    evaluatorEmail: "",
    evaluatorPassword: "",
  });

  const [acYear, setAcYear] = useState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile_1, setSelectedFile_1] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileChange_1 = (event) => {
    setSelectedFile_1(event.target.files[0]);
  };

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [modal_1, setModal_1] = useState(false);
  const toggle_1 = () => setModal_1(!modal_1);

  const onSubmitBody = (e) => {
    dispatch(createEvaluator(formData));
  };

  const onSubmitFileBody = async (e) => {
    if (selectedFile && selectedFile_1) {
      if (acYear) {
        const formData_1 = new FormData();

        formData_1.append("file1", selectedFile);
        formData_1.append("file2", selectedFile_1);

        toast.promise(
          axios
            .post(`${serverUrl}admin/user-register`, formData_1, {
              headers: {
                acaYear: acYear,
              },
            })
            .then((response) => {
              console.log(response.data.message);
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
            }),
          {
            pending: "Creating Evaluation Year",
            success: "Evaluation Year Complete",
            error: "Evaluation Creation failed",
          }
        );
      } else {
        toast.error("Acadamic Year is required");
      }
    } else {
      toast.error("CSV Files are required");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            {user && user.userType === 2 && (
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <>
                        {" "}
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              Add Evaluator
                            </CardTitle>
                            <Button onClick={toggle} className="bg-red">
                              {" "}
                              <span className="h2 font-weight-bold mb-0 text-white">
                                Add Evaluator
                              </span>
                            </Button>
                          </div>
                        </Row>
                      </>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Add New Students
                          </CardTitle>
                          <Button className="bg-green" onClick={toggle_1}>
                            {" "}
                            <span className="h2 font-weight-bold mb-0 text-white">
                              Add Students
                            </span>
                          </Button>
                        </div>
                      </Row>
                    </CardBody>
                    <Modal isOpen={modal} toggle={toggle} fullscreen>
                      <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label for="projectId">Evaluator Id</Label>
                            <Input
                              id="evaluatorId"
                              name="evaluatorId"
                              onChange={handleChange}
                              placeholder="Evaluator Id"
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleprojectname">
                              Evaluator Name
                            </Label>
                            <Input
                              id="evaluatorName"
                              name="evaluatorName"
                              onChange={handleChange}
                              // value={project.projectName}
                              placeholder="Evaluator Name "
                              type="projectname"
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label for="exampleprojectname">
                              Evaluator Password
                            </Label>
                            <Input
                              id="evaluatorPassword"
                              name="evaluatorPassword"
                              onChange={handleChange}
                              // value={project.projectName}
                              placeholder="Evaluator Password "
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleprojectname">
                              Evaluator Email
                            </Label>
                            <Input
                              id="evaluatorEmail"
                              name="evaluatorEmail"
                              onChange={handleChange}
                              // value={project.projectName}
                              placeholder="Evaluator Email "
                              type="projectname"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleprojectname">
                              Evaluator Department
                            </Label>
                            <Input
                              id="department"
                              name="department"
                              onChange={handleChange}
                              // value={project.projectName}
                              placeholder="Evaluator's Separtrment "
                              type="text"
                            />
                          </FormGroup>
                          {/* <FormGroup>
                          <Label for="exampleFile">File</Label>
                          <Input id="exampleFile" name="file" type="file" />
                          <FormText>
                            This is some placeholder block-level help text for
                            the above input. It‘s a bit lighter and easily wraps
                            to a new line.
                          </FormText>
                        </FormGroup> */}
                          <Button
                            className="bg-red text-white"
                            onClick={onSubmitBody}
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
                    <Modal isOpen={modal_1} toggle={toggle_1} fullscreen>
                      <ModalHeader toggle={toggle_1}>Modal title</ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label for="projectId">Academic Year </Label>
                            <Input
                              id="year"
                              name="year"
                              onChange={(e) => {
                                setAcYear(e.target.value);
                              }}
                              placeholder="20**"
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleFile">
                              Insert Student CSV file
                            </Label>
                            <Input
                              id="exampleFile"
                              name="file"
                              onChange={handleFileChange}
                              type="file"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleFile">
                              Insert Evaluation Criteria CSV file
                            </Label>
                            <Input
                              id="exampleFile"
                              name="file"
                              onChange={handleFileChange_1}
                              type="file"
                            />
                          </FormGroup>
                          <Button
                            className="bg-red text-white"
                            onClick={onSubmitFileBody}
                          >
                            Submit
                          </Button>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggle_1}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Card>
                </Col>
                {/* <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Sales
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">924</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Performance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col> */}
              </Row>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
