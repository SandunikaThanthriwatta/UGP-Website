import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal, ModalBody } from "reactstrap";
import { getProjectByEvaluator } from "store/actions/projectAction";
import { submitStuentMarks } from "store/actions/evaluatorAction";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const SECTIONS = [
  { key: "proposal", label: "Proposal", color: "#5e72e4", icon: "ni ni-single-copy-04" },
  { key: "progress", label: "Progress", color: "#11cdef", icon: "ni ni-chart-bar-32" },
  { key: "final",    label: "Final",    color: "#2dce89", icon: "ni ni-check-bold"    },
];

const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.85rem", marginTop: "0.25rem" }}>
    <div style={{ flex: 1, height: "1px", background: "#e9ecef" }} />
    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#8898aa", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>
      {children}
    </span>
    <div style={{ flex: 1, height: "1px", background: "#e9ecef" }} />
  </div>
);

const EvaluateProjects = () => {
  const dispatch = useDispatch();
  const userId   = useSelector((s) => s.user.userData);
  const projects = useSelector((s) => s.project.projects);

  const [expanded,        setExpanded]        = useState({ proposal: false, progress: false, final: false });
  const [evalModal,       setEvalModal]        = useState(null);  // { section, projectIdx }
  const [groupMarks,      setGroupMarks]       = useState({});    // { `${section}_${i}`: value }
  const [individualMarks, setIndividualMarks]  = useState({});    // { `${studentId}__${criteria}`: value }
  const [searchYear,      setSearchYear]       = useState("");

  const list = Array.isArray(projects) ? projects : [];

  useEffect(() => {
    if (userId?._id) dispatch(getProjectByEvaluator(userId._id, ""));
  }, [userId?._id]);

  const handleSearch = () => {
    if (searchYear) dispatch(getProjectByEvaluator(userId._id, searchYear));
  };

  const openEvalModal = (section, projectIdx) => {
    setEvalModal({ section, projectIdx });
    setGroupMarks({});
    setIndividualMarks({});
  };

  const handleGroupMarkChange = (e) => {
    const { name, value } = e.target;
    setGroupMarks((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndividualMarkChange = (studentId, criteria, value) => {
    setIndividualMarks((prev) => ({ ...prev, [`${studentId}__${criteria}`]: value }));
  };

  const handleSubmit = async (projectId) => {
    // Dispatch individual marks
    const entries = Object.entries(individualMarks);
    for (const [key, value] of entries) {
      if (value === "" || value === null) continue;
      const [studentId, ...rest] = key.split("__");
      const criteria = rest.join("__");
      dispatch(submitStuentMarks({
        id:           studentId,
        studentMarks: parseFloat(value),
        groupId:      projectId,
        criteria,
      }));
    }

    // Submit group marks
    await toast.promise(
      axios.post(`${serverUrl}student/group-marks`, { id: projectId, marks: groupMarks }).then((r) => {
        if (r.status === 200) dispatch(getProjectByEvaluator(userId._id, searchYear || ""));
      }),
      { success: "Evaluation saved!", error: "Failed to save" }
    );

    setEvalModal(null);
    setGroupMarks({});
    setIndividualMarks({});
  };

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Toolbar */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1rem 1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8898aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Academic Year
          </div>
          <input
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. 2026"
            style={{ border: "1px solid #e9ecef", borderRadius: "8px", padding: "8px 14px", fontSize: "0.875rem", color: "#32325d", outline: "none", width: "140px" }}
          />
          <button onClick={handleSearch} style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 20px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
            Search
          </button>
          <div style={{ marginLeft: "auto", fontSize: "0.82rem", color: "#8898aa", fontWeight: 600 }}>
            <span style={{ color: "#5e72e4", fontWeight: 800 }}>{list.length}</span> group{list.length !== 1 ? "s" : ""} assigned
          </div>
        </div>

        {/* Three accordion sections */}
        {SECTIONS.map(({ key, label, color, icon }) => {
          const open = expanded[key];
          return (
            <div key={key} style={{ background: "#fff", borderRadius: "16px", marginBottom: "1.1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div
                onClick={() => toggle(key)}
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.1rem 1.5rem", cursor: "pointer", userSelect: "none", borderBottom: open ? "1px solid #f4f6f9" : "none" }}
              >
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={icon} style={{ color, fontSize: "1rem" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d" }}>{label} Evaluation</div>
                  <div style={{ fontSize: "0.75rem", color: "#8898aa", marginTop: "1px" }}>
                    {list.length} group{list.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", color: open ? color : "#adb5bd", fontSize: "1.1rem", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
                  <i className="ni ni-bold-down" />
                </div>
              </div>

              {open && (
                <div style={{ overflowX: "auto" }}>
                  {list.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#8898aa" }}>
                      No groups assigned. Search an academic year above.
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa" }}>
                          {["Group ID", "Project Name", "Supervisor", "Status", "Action"].map((h) => (
                            <th key={h} style={{ padding: "10px 16px", fontSize: "0.72rem", fontWeight: 700, color: "#8898aa", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((p, idx) => (
                          <tr key={p._id} style={{ borderTop: "1px solid #f4f6f9" }}>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(94,114,228,0.1)", color: "#5e72e4" }}>
                                {p.groupId}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#32325d", fontSize: "0.875rem" }}>{p.projectName}</td>
                            <td style={{ padding: "12px 16px", color: "#525f7f", fontSize: "0.875rem" }}>{p.mainSupervisor}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: p.evaluationFinalized ? "rgba(45,206,137,0.12)" : "rgba(251,99,64,0.1)", color: p.evaluationFinalized ? "#2dce89" : "#fb6340" }}>
                                {p.evaluationFinalized ? "Finalized" : "Pending"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {p.evaluationFinalized ? (
                                <span style={{ fontSize: "0.82rem", color: "#2dce89", fontWeight: 700 }}>✓ Evaluated</span>
                              ) : (
                                <button
                                  onClick={() => openEvalModal(key, idx)}
                                  style={{ background: "none", border: "none", color, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0" }}
                                >
                                  <i className="fas fa-star" style={{ fontSize: "0.75rem" }} />
                                  Evaluate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Evaluation modal ── */}
      {evalModal && (() => {
        const p       = list[evalModal.projectIdx];
        const section = evalModal.section;
        const sec     = SECTIONS.find((s) => s.key === section);
        const color   = sec?.color || "#5e72e4";
        const allCriteria = p?.projectEvaluationScore?.[section] || [];
        const members     = p?.groupMembers || [];

        const groupCriteria      = allCriteria.filter((c) =>
          !c.criteria?.toLowerCase().includes("individual") &&
          !c.sub_criteria?.toLowerCase().includes("individual")
        );
        const individualCriteria = allCriteria.filter((c) =>
          c.criteria?.toLowerCase().includes("individual") ||
          c.sub_criteria?.toLowerCase().includes("individual")
        );

        return (
          <Modal isOpen toggle={() => setEvalModal(null)} size="xl" style={{ maxWidth: "900px" }}>
            {/* Header */}
            <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid #e9ecef", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={sec?.icon} style={{ color, fontSize: "1.1rem" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#32325d" }}>
                    {sec?.label} Evaluation
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#8898aa", marginTop: "2px" }}>
                    <span style={{ fontWeight: 700, color: "#5e72e4" }}>{p?.groupId}</span>
                    {" · "}{p?.projectName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEvalModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: "1.25rem", lineHeight: 1, padding: "4px" }}
              >
                ×
              </button>
            </div>

            <ModalBody style={{ padding: "1.75rem 2rem", background: "#f8f9fa", maxHeight: "70vh", overflowY: "auto" }}>
              {allCriteria.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#8898aa" }}>
                  <i className="ni ni-alert-circle-exc" style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem", opacity: 0.5 }} />
                  No evaluation criteria defined for this section.
                </div>
              ) : (
                <>
                  {/* ── Group Marks ── */}
                  {groupCriteria.length > 0 && (
                    <div style={{ marginBottom: individualCriteria.length > 0 ? "1.75rem" : 0 }}>
                      <SectionLabel>Group Marks</SectionLabel>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {groupCriteria.map((item) => {
                          const origIdx = allCriteria.indexOf(item);
                          return (
                            <div key={origIdx} style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: "#32325d", fontSize: "0.875rem" }}>{item.criteria}</div>
                                {item.sub_criteria && item.sub_criteria !== "null" && (
                                  <div style={{ color: "#8898aa", fontSize: "0.78rem", marginTop: "3px" }}>{item.sub_criteria}</div>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                <span style={{ fontSize: "0.72rem", color: "#adb5bd", fontWeight: 600 }}>/ 100</span>
                                <input
                                  name={`${section}_${origIdx}`}
                                  defaultValue={item.marks || ""}
                                  onChange={handleGroupMarkChange}
                                  type="number"
                                  min={0}
                                  max={100}
                                  placeholder="0"
                                  style={{ width: "82px", border: "1.5px solid #e9ecef", borderRadius: "8px", padding: "8px 10px", fontSize: "1rem", fontWeight: 700, color: "#32325d", textAlign: "center", outline: "none", background: "#fff" }}
                                  onFocus={(e) => (e.target.style.borderColor = color)}
                                  onBlur={(e)  => (e.target.style.borderColor = "#e9ecef")}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Personal Marks ── */}
                  {individualCriteria.length > 0 && members.length > 0 && (
                    <div>
                      <SectionLabel>Personal Marks</SectionLabel>
                      <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#f4f6f9" }}>
                              <th style={{ padding: "10px 16px", fontSize: "0.72rem", fontWeight: 700, color: "#8898aa", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                                Student
                              </th>
                              {individualCriteria.map((c, ci) => (
                                <th key={ci} style={{ padding: "10px 16px", fontSize: "0.72rem", fontWeight: 700, color: "#8898aa", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", minWidth: "120px" }}>
                                  {c.criteria}
                                  {c.sub_criteria && c.sub_criteria !== "null" && (
                                    <div style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "#adb5bd", fontSize: "0.68rem", marginTop: "2px" }}>{c.sub_criteria}</div>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((m, mi) => (
                              <tr key={mi} style={{ borderTop: "1px solid #f4f6f9" }}>
                                <td style={{ padding: "12px 16px" }}>
                                  <div style={{ fontWeight: 700, color: "#32325d", fontSize: "0.875rem" }}>
                                    {m.name || m.studentId}
                                  </div>
                                  <div style={{ fontSize: "0.75rem", color: "#8898aa", marginTop: "2px" }}>{m.studentId}</div>
                                </td>
                                {individualCriteria.map((c, ci) => {
                                  const criIdx  = m.evaluationAreas?.findIndex((a) => a.criteria === c.criteria) ?? -1;
                                  const existing = criIdx !== -1 ? m.evaluationAreas?.[criIdx]?.studentMarks : "";
                                  return (
                                    <td key={ci} style={{ padding: "10px 16px", textAlign: "center" }}>
                                      <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="0"
                                        defaultValue={existing !== "" ? existing : ""}
                                        onChange={(e) => handleIndividualMarkChange(m.studentId, c.criteria, e.target.value)}
                                        style={{ width: "76px", border: "1.5px solid #e9ecef", borderRadius: "8px", padding: "7px 8px", fontSize: "0.95rem", fontWeight: 700, color: "#32325d", textAlign: "center", outline: "none", background: "#fff" }}
                                        onFocus={(e) => (e.target.style.borderColor = color)}
                                        onBlur={(e)  => (e.target.style.borderColor = "#e9ecef")}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ModalBody>

            {/* Footer */}
            <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #e9ecef", display: "flex", justifyContent: "flex-end", gap: "0.75rem", background: "#fff" }}>
              <button
                onClick={() => setEvalModal(null)}
                style={{ background: "#f4f6f9", color: "#525f7f", border: "none", borderRadius: "10px", padding: "10px 22px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(p._id)}
                style={{ background: color, color: "#fff", border: "none", borderRadius: "10px", padding: "10px 28px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <i className="ni ni-check-bold" style={{ fontSize: "0.85rem" }} />
                Save Evaluation
              </button>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

export default EvaluateProjects;
