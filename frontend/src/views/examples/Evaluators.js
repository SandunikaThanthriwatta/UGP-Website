import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { getAllEvaluators, createEvaluator } from "store/actions/evaluatorAction";

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
};

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

const btnStyle = (disabled) => ({
  padding: "4px 10px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  background: disabled ? "#f8f9fa" : "#fff",
  color: disabled ? "#c0c0c0" : "#525f7f",
  cursor: disabled ? "default" : "pointer",
  fontWeight: 700,
  fontSize: "0.9rem",
});

const AllEvaluators = () => {
  const dispatch = useDispatch();
  const evaluators = useSelector((state) => state.evaluator.evaluators);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formData, setFormData] = useState({
    evaluatorId: "",
    evaluatorName: "",
    department: "",
    evaluatorEmail: "",
    evaluatorPassword: "",
  });

  useEffect(() => { dispatch(getAllEvaluators()); }, [dispatch]);
  useEffect(() => { setPage(1); }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    await dispatch(createEvaluator(formData));
    dispatch(getAllEvaluators());
    setModal(false);
    setFormData({ evaluatorId: "", evaluatorName: "", department: "", evaluatorEmail: "", evaluatorPassword: "" });
  };

  const filtered = (evaluators || []).filter((p) => {
    const q = search.toLowerCase();
    return (
      p.evaluatorId?.toLowerCase().includes(q) ||
      p.evaluatorName?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Toolbar card */}
      <div style={{ ...card, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "120px" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d" }}>All Evaluators</div>
          <div style={{ fontSize: "0.78rem", color: "#8898aa", marginTop: "2px" }}>{total} of {evaluators?.length || 0} total</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#f8f9fa", padding: "0 12px", gap: "8px" }}>
          <i className="fas fa-search" style={{ color: "#8898aa", fontSize: "0.8rem" }} />
          <input
            placeholder="Search evaluators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", padding: "8px 0", fontSize: "0.875rem", width: "200px", color: "#32325d" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#8898aa", fontSize: "0.85rem", padding: 0 }}>✕</button>
          )}
        </div>
        <button
          onClick={() => setModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
        >
          <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span> Add Evaluator
        </button>
      </div>

      {/* Table card */}
      <div style={{ ...card }}>
        <div style={{ overflowX: "auto", maxHeight: "480px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                {["Evaluator ID", "Name", "Department", "Email"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 600, color: "#8898aa", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", background: "#f8f9fa" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => (
                <tr key={p._id} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#32325d" }}>{p.evaluatorId}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#32325d" }}>{p.evaluatorName}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <span style={{ background: "rgba(52,70,117,0.1)", color: "#344675", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>{p.department}</span>
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#525f7f" }}>{p.email}</td>
                </tr>
              ))}
              {total === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#8898aa" }}>
                    {search ? `No evaluators match "${search}"` : "No evaluators found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", borderTop: "1px solid #f0f0f0", background: "#fafafa", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "#8898aa" }}>
              Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 8px", fontSize: "0.8rem", color: "#525f7f", outline: "none", background: "#fff" }}
              >
                {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={btnStyle(page === 1)}>‹</button>
              <span style={{ fontSize: "0.8rem", color: "#525f7f", whiteSpace: "nowrap" }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={btnStyle(page >= totalPages)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Evaluator Modal */}
      <Modal isOpen={modal} toggle={() => setModal(false)} centered>
        <ModalHeader toggle={() => setModal(false)} style={{ borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>
          Add Evaluator
        </ModalHeader>
        <ModalBody style={{ padding: "1.5rem" }}>
          <Form>
            {[
              { id: "evaluatorId", label: "Evaluator ID", placeholder: "E004" },
              { id: "evaluatorName", label: "Full Name", placeholder: "Dr. Silva" },
              { id: "evaluatorPassword", label: "Password", placeholder: "••••••••" },
              { id: "evaluatorEmail", label: "Email", placeholder: "silva@ruh.ac.lk" },
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
          <Button style={{ background: "#5e72e4", border: "none", borderRadius: "8px" }} onClick={onSubmit}>
            Add Evaluator
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AllEvaluators;
