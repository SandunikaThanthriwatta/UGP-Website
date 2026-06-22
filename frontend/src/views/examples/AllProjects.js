import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProjects } from "store/actions/projectAction";
import { getAllEvaluators, assignEvaluator } from "store/actions/evaluatorAction";
import projectSlice from "store/slices/projectSlice";

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
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

const AllProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const evaluators = useSelector((state) => state.evaluator.evaluators);

  const [searchYear, setSearchYear] = useState("");
  const [assignModal, setAssignModal] = useState({ open: false, groupId: "", projectName: "" });
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => { dispatch(getAllEvaluators()); }, [dispatch]);
  useEffect(() => { setPage(1); }, [projects]);

  const searchYearhandler = () => {
    setPage(1);
    dispatch(getAllProjects(searchYear));
  };

  const openAssignModal = (mongoId, projectName) => {
    setSelectedEvaluatorId("");
    setAssignModal({ open: true, groupId: mongoId, projectName });
  };

  const onAssignConfirm = async () => {
    if (!selectedEvaluatorId) return;
    await dispatch(assignEvaluator({ groupId: assignModal.groupId, evaluatorId: selectedEvaluatorId }));
    const selectedEvaluator = evaluators?.find((e) => e._id === selectedEvaluatorId);
    if (selectedEvaluator) {
      dispatch(projectSlice.actions.addEvaluatorToProject({ projectId: assignModal.groupId, evaluator: selectedEvaluator }));
    }
    setAssignModal({ open: false, groupId: "", projectName: "" });
  };

  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = projects.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Toolbar card */}
      <div style={{ ...card, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d" }}>All Projects</div>
          <div style={{ fontSize: "0.78rem", color: "#8898aa", marginTop: "2px" }}>{total} projects</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
            <span style={{ padding: "0 12px", color: "#8898aa" }}><i className="fas fa-search" /></span>
            <input
              placeholder="Academic Year"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchYearhandler()}
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

      {/* Table card */}
      <div style={{ ...card }}>
        <div style={{ overflowX: "auto", maxHeight: "480px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                {["Group ID", "Project Name", "Supervisor", "Evaluators", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 600, color: "#8898aa", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", background: "#f8f9fa" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => (
                <tr key={p._id} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#32325d" }}>{p.groupId}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#32325d" }}>{p.projectName}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#525f7f" }}>{p.mainSupervisor}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    {p.evaluator?.length > 0 ? (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {p.evaluator.map((r) => (
                          <span key={r._id} style={{ background: "rgba(52,70,117,0.1)", color: "#344675", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
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
                          onClick={() => openAssignModal(p._id, p.projectName)}
                          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "8px", border: "none", background: "transparent", color: "#f5365c", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <i className="ni ni-single-02" style={{ fontSize: "0.8rem" }} /> Assign
                        </button>
                      )}
                      <Link to={`/admin/project/${p._id}`}>
                        <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "8px", border: "none", background: "transparent", color: "#5e72e4", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                          <i className="fas fa-eye" style={{ fontSize: "0.8rem" }} /> View
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {total === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#8898aa" }}>
                    {searchYear ? `No projects found for ${searchYear}` : "Enter an academic year and click Search"}
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
