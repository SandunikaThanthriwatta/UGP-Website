import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  getProject,
  getProjectByStudent,
} from "../../store/actions/projectAction";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import storage from "../../firebase/config";

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
import { updateProject } from "store/actions/studentAction";

const MyProject = () => {
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.user.userData._id);
  const project = useSelector((state) => state.project.project);
  const [textbody, setTextbody] = useState(``);
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imgdetect, setImgDetect] = useState(true);
  const [imagePreview, setImagePreview] = useState("");

  const toggle = () => setModal(!modal);

  const handleSpeciTextChange = (content) => {
    setTextbody(content);
  };

  const onSubmitBody = (e) => {
    const data = {
      id: project._id,
      text: textbody || project.projectDescription,
      projectImages: imageUrl || project.projectImages,
    };
    dispatch(updateProject(data));
  };

  const onSubmitForm = (event) => {
    if (selectedFile) {
      console.log(storage);
      const imageRef = ref(storage, `images/${selectedFile.name}`);
      uploadBytes(imageRef, selectedFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrl((prev) => [...prev, url]);
          setImgDetect(false);
        });
      });
    } else {
      onSubmitBody();
    }

    console.log(imageUrl);
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(event.target.files[0]);
    setImgDetect(false);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  useEffect(() => {
    if (imageUrl) {
      onSubmitBody(imageUrl);
    }
    dispatch(getProjectByStudent(studentId));
  }, [imageUrl]);

  return (
    <>
      <UserHeader />
      {/* Page content */}
      {project !== null && (
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
                      <Col className="text-right" xs="4">
                        <Button
                          color="primary"
                          href="#pablo"
                          onClick={toggle}
                          size="sm"
                        >
                          Edit Project
                        </Button>
                      </Col>
                      <Modal isOpen={modal} toggle={toggle} fullscreen>
                        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                        <ModalBody>
                          <Form>
                            <FormGroup>
                              <Label for="projectId">Project Id</Label>
                              <Input
                                id="projectId"
                                name=""
                                value={project._id}
                                placeholder="FYP Project Id"
                                type="text"
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleprojectname">
                                project Name
                              </Label>
                              <Input
                                id="exampleprojectname"
                                name="projectname"
                                value={project.projectName}
                                placeholder="project Name "
                                type="projectname"
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleText">
                                Project Description
                              </Label>
                              {/* <Input
                                id="exampleText"
                                name="text"
                                type="textarea"
                              /> */}
                              <ReactQuill
                                placeholder="Project Details"
                                className="h-[100px] mt-[8px] "
                                value={textbody}
                                onChange={handleSpeciTextChange}
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleFile">File</Label>
                              <Input
                                id="exampleFile"
                                name="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                type="file"
                              />
                              {selectedFile && (
                                <>
                                  <img
                                    src={imagePreview}
                                    alt=""
                                    style={{ maxWidth: "200px" }}
                                  />
                                </>
                              )}
                            </FormGroup>
                            <Button onClick={onSubmitForm}>Submit</Button>
                          </Form>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="secondary" onClick={toggle}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
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
                            project.groupMembers.map((p) => {
                              return (
                                <>
                                  <h4> {p.studentId}</h4>
                                </>
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
                          {/* <Input
                            dangerouslySetInnerHTML={}
                            className="form-control-alternative"
                            placeholder="A few words about you ..."
                            rows="4"
                            defaultValue="Your Project Details"
                            type="textarea"
                          /> */}
                        </FormGroup>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default MyProject;
