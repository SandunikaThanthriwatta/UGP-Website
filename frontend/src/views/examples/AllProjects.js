import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button, Form, FormGroup, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import { getAllProjects } from "store/actions/projectAction";
import { getAllEvaluators, assignEvaluator } from "store/actions/evaluatorAction";

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
  const [modal, setModal] = useState({ type: false, id: "" });
  const [selectedOption, setSelectedOption] = useState({ option: "", id: "" });
  const [evaName, setEvaName] = useState("");

  const toggle = (id) => setModal({ type: !modal.type, id });

  const searchYearhandler = () => dispatch(getAllProjects(searchYear));

  const onEvaSubmitHandler = () => {
    dispatch(assignEvaluator({ groupId: selectedOption.option, evaluatorId: selectedOption.id }));
    dispatch(getAllProjects(searchYear));
  };

  useEffect(() => {
    dispatch(getAllEvaluators());
  }, [dispatch]);

  return (
    <div>
      <div style={{ ...card }}>
        {/* Header row */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d", flex: 1 }}>All Projects</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                {["Group ID", "Project Name", "Supervisor", "Evaluators", ""].map((h) => (
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
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      {p.evaluator.map((r) => (
                        <span key={r._id} style={{ background: "#d4edda", color: "#155724", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
                          {r.evaluatorName}
                        </span>
                      ))}
                      {p.evaluator.length < 3 && (
                        <button
                          onClick={() => toggle(p._id)}
                          style={{ background: "#fff3cd", color: "#856404", border: "1px solid #ffc107", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          + Assign
                        </button>
                      )}
                    </div>
                    {modal.type && modal.id === p._id && (
                      <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="dark" size="sm">
                            {evaName || "Select Evaluator"}
                          </DropdownToggle>
                          <DropdownMenu>
                            {evaluators?.map((q) => (
                              <DropdownItem key={q._id} onClick={() => { setSelectedOption({ id: q._id, option: p.groupId }); setEvaName(q.evaluatorName); }}>
                                {q.evaluatorName}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <button
                          onClick={onEvaSubmitHandler}
                          style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 12px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <Link to={`/admin/project/${p._id}`}>
                      <button style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 14px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                        View
                      </button>
                    </Link>
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
    </div>
  );
};

export default AllProjects;
