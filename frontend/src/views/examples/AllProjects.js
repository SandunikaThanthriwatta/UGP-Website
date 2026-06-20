import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllProjects } from "store/actions/projectAction";
import { getAllEvaluators, assignEvaluator } from "store/actions/evaluatorAction";
import { serverUrl } from "utils/serveUrl";

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  overflow: "hidden",
};

const AllProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const evaluators = useSelector((state) => state.evaluator.evaluators);

  const [searchYear, setSearchYear] = useState("");
  const [assignModal, setAssignModal] = useState({ open: false, groupId: "", projectName: "" });
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState("");

  const [uploadModal, setUploadModal] = useState(false);
  const [uploadYear, setUploadYear] = useState("");
  const [uploading, setUploading] = useState(false);
  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const handleUpload = async () => {
    if (!uploadYear || !file1Ref.current?.files[0] || !file2Ref.current?.files[0]) {
      toast.error("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("file1", file1Ref.current.files[0]);
    formData.append("file2", file2Ref.current.files[0]);
    setUploading(true);
    try {
      await axios.post(`${serverUrl}admin/user-register`, formData, {
        headers: { acaYear: uploadYear, "Content-Type": "multipart/form-data" },
      });
      toast.success("Students uploaded successfully!");
      setUploadModal(false);
      setUploadYear("");
      file1Ref.current.value = "";
      file2Ref.current.value = "";
      dispatch(getAllProjects(uploadYear));
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const searchYearhandler = () => dispatch(getAllProjects(searchYear));

  const openAssignModal = (groupId, projectName) => {
    setSelectedEvaluatorId("");
    setAssignModal({ open: true, groupId, projectName });
  };

  const onAssignConfirm = async () => {
    if (!selectedEvaluatorId) return;
    await dispatch(assignEvaluator({ groupId: assignModal.groupId, evaluatorId: selectedEvaluatorId }));
    dispatch(getAllProjects(searchYear));
    setAssignModal({ open: false, groupId: "", projectName: "" });
  };

  useEffect(() => {
    dispatch(getAllEvaluators());
  }, [dispatch]);

  return (
    <div>
      {/* Upload Students Modal */}
      {uploadModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setUploadModal(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "440px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#32325d" }}>Upload Students</div>
              <button onClick={() => setUploadModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8898aa" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "4px" }}>Academic Year</label>
                <input
                  placeholder="e.g. 2025"
                  value={uploadYear}
                  onChange={(e) => setUploadYear(e.target.value)}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "0.875rem", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "4px" }}>Students CSV</label>
                <input ref={file1Ref} type="file" accept=".csv" style={{ width: "100%", fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "4px" }}>Evaluation Criteria CSV</label>
                <input ref={file2Ref} type="file" accept=".csv" style={{ width: "100%", fontSize: "0.875rem" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1.5rem" }}>
              <button onClick={() => setUploadModal(false)} style={{ background: "#f4f6f9", color: "#525f7f", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleUpload} disabled={uploading} style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", opacity: uploading ? 0.7 : 1 }}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ ...card }}>
        {/* Header row */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d", flex: 1 }}>All Projects</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setUploadModal(true)}
              style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span> Upload Students
            </button>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
              <span style={{ padding: "0 12px", color: "#8898aa" }}><i className="fas fa-search" /></span>
              <input
                placeholder="Academic Year"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                style={{ border: "none", outline: "none", padding: "8px 0", fontSize: "0.875rem", width: "140px" }}
              />
            </div>
            <button
              onClick={searchYearhandler}
              style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                {["Group ID", "Project Name", "Supervisor", "Evaluators", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 600, color: "#8898aa", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p._id} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#32325d" }}>{p.groupId}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#32325d" }}>{p.projectName}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#525f7f" }}>{p.mainSupervisor}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    {p.evaluator?.length > 0 ? (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {p.evaluator.map((r) => (
                          <span key={r._id} style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
                            {r.evaluatorName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#8898aa", fontSize: "0.78rem", fontStyle: "italic" }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {p.evaluator?.length < 3 && (
                        <button
                          onClick={() => openAssignModal(p.groupId, p.projectName)}
                          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "8px", border: "none", background: "#fff3cd", color: "#856404", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <i className="ni ni-single-02" style={{ fontSize: "0.8rem" }} /> Assign
                        </button>
                      )}
                      <Link to={`/admin/project/${p._id}`}>
                        <button
                          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "8px", border: "none", background: "#e8eaf6", color: "#3949ab", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <i className="ni ni-zoom-split-in" style={{ fontSize: "0.8rem" }} /> View
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#8898aa" }}>
                    {searchYear ? `No projects found for ${searchYear}` : "Enter an academic year and click Search"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Evaluator Modal */}
      {assignModal.open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setAssignModal({ open: false, groupId: "", projectName: "" })} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#32325d" }}>Assign Evaluator</div>
              <button onClick={() => setAssignModal({ open: false, groupId: "", projectName: "" })} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8898aa" }}>✕</button>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Project</div>
              <div style={{ fontWeight: 600, color: "#32325d", marginTop: "2px" }}>{assignModal.projectName}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "6px" }}>Select Evaluator</label>
              <select
                value={selectedEvaluatorId}
                onChange={(e) => setSelectedEvaluatorId(e.target.value)}
                style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "0.875rem", outline: "none", color: "#32325d", background: "#fff" }}
              >
                <option value="">— Choose evaluator —</option>
                {evaluators?.map((e) => (
                  <option key={e._id} value={e._id}>{e.evaluatorName} ({e.department})</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1.5rem" }}>
              <button onClick={() => setAssignModal({ open: false, groupId: "", projectName: "" })} style={{ background: "#f4f6f9", color: "#525f7f", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={onAssignConfirm} disabled={!selectedEvaluatorId} style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", opacity: selectedEvaluatorId ? 1 : 0.5 }}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
