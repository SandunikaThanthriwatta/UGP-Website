import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { createEvaluator } from "store/actions/evaluatorAction";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const StatCard = ({ icon, label, color, onClick, buttonLabel }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "1.25rem 1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      flex: "1 1 200px",
      minWidth: "200px",
    }}
  >
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        background: color + "18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <i className={icon} style={{ color, fontSize: "1.2rem" }} />
    </div>
    <div>
      <div style={{ fontSize: "0.78rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <button
        onClick={onClick}
        style={{
          marginTop: "4px",
          background: color,
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "4px 14px",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);

const inputStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  width: "100%",
  outline: "none",
  marginTop: "4px",
};

const labelStyle = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#4a5568",
  marginBottom: "2px",
};

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
  const [acYear, setAcYear] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile_1, setSelectedFile_1] = useState(null);
  const [modal, setModal] = useState(false);
  const [modal_1, setModal_1] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitBody = () => dispatch(createEvaluator(formData));

  const onSubmitFileBody = async () => {
    if (!selectedFile || !selectedFile_1) return toast.error("CSV files are required");
    if (!acYear) return toast.error("Academic Year is required");

    const fd = new FormData();
    fd.append("file1", selectedFile);
    fd.append("file2", selectedFile_1);

    toast.promise(
      axios.post(`${serverUrl}admin/user-register`, fd, { headers: { acaYear: acYear } })
        .then(() => window.location.reload()),
      {  success: "Done!", error: "Failed" }
    );
  };

  if (!user || user.userType !== 2) return null;

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <StatCard
          icon="ni ni-hat-3"
          label="Evaluators"
          color="#5e72e4"
          onClick={() => setModal(true)}
          buttonLabel="Add Evaluator"
        />
        <StatCard
          icon="ni ni-single-02"
          label="Students"
          color="#2dce89"
          onClick={() => setModal_1(true)}
          buttonLabel="Add Students"
        />
      </div>

      {/* Add Evaluator Modal */}
      <Modal isOpen={modal} toggle={() => setModal(false)} centered>
        <ModalHeader toggle={() => setModal(false)} style={{ borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>
          Add Evaluator
        </ModalHeader>
        <ModalBody style={{ padding: "1.5rem" }}>
          <Form>
            {[
              { id: "evaluatorId", label: "Evaluator ID", placeholder: "E001" },
              { id: "evaluatorName", label: "Full Name", placeholder: "Dr. Smith" },
              { id: "evaluatorPassword", label: "Password", placeholder: "••••••••" },
              { id: "evaluatorEmail", label: "Email", placeholder: "smith@ruh.ac.lk" },
              { id: "department", label: "Department", placeholder: "Computer Science" },
            ].map(({ id, label, placeholder }) => (
              <FormGroup key={id} style={{ marginBottom: "1rem" }}>
                <Label style={labelStyle}>{label}</Label>
                <Input id={id} name={id} placeholder={placeholder} onChange={handleChange} style={inputStyle} />
              </FormGroup>
            ))}
          </Form>
        </ModalBody>
        <ModalFooter style={{ borderTop: "1px solid #e2e8f0", gap: "8px" }}>
          <Button color="secondary" outline onClick={() => setModal(false)}>Cancel</Button>
          <Button style={{ background: "#5e72e4", border: "none", borderRadius: "8px" }} onClick={onSubmitBody}>
            Add Evaluator
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Students Modal */}
      <Modal isOpen={modal_1} toggle={() => setModal_1(false)} centered>
        <ModalHeader toggle={() => setModal_1(false)} style={{ borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>
          Upload Student Data
        </ModalHeader>
        <ModalBody style={{ padding: "1.5rem" }}>
          <Form>
            <FormGroup style={{ marginBottom: "1rem" }}>
              <Label style={labelStyle}>Academic Year</Label>
              <Input placeholder="e.g. 2024" onChange={(e) => setAcYear(e.target.value)} style={inputStyle} />
            </FormGroup>
            <FormGroup style={{ marginBottom: "1rem" }}>
              <Label style={labelStyle}>Student CSV File</Label>
              <Input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={inputStyle} />
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Evaluation Criteria CSV File</Label>
              <Input type="file" onChange={(e) => setSelectedFile_1(e.target.files[0])} style={inputStyle} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter style={{ borderTop: "1px solid #e2e8f0", gap: "8px" }}>
          <Button color="secondary" outline onClick={() => setModal_1(false)}>Cancel</Button>
          <Button style={{ background: "#2dce89", border: "none", borderRadius: "8px" }} onClick={onSubmitFileBody}>
            Upload & Create
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Header;
