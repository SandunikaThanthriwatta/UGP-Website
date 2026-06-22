import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProjectByEvaluator } from "store/actions/projectAction";

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background: "#fff", borderRadius: "16px", padding: "1.35rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "1.1rem", flex: 1, minWidth: "160px" }}>
    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <i className={icon} style={{ color, fontSize: "1.25rem" }} />
    </div>
    <div>
      <div style={{ fontSize: "0.68rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#32325d", lineHeight: 1.1 }}>{value}</div>
    </div>
  </div>
);

const EvaluatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userData);
  const projects = useSelector((state) => state.project.projects);
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    if (userId?._id) {
      dispatch(getProjectByEvaluator(userId._id, ""));
    }
  }, [userId?._id]);

  const allList = Array.isArray(projects)
    ? [...projects].sort((a, b) => (b.evaluationYear || "").localeCompare(a.evaluationYear || ""))
    : [];
  const filtered = yearFilter ? allList.filter((p) => p.evaluationYear === yearFilter) : allList;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const list = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const years = [...new Set(allList.map((p) => p.evaluationYear).filter(Boolean))].sort().reverse();

  const totalStudents = allList.reduce((sum, p) => sum + (p.groupMembers?.length || 0), 0);
  const yearsActive = years.length;
  const pending = allList.filter((p) => !p.evaluationFinalized).length;

  const stats = [
    { label: "Total Groups",   value: allList.length, icon: "ni ni-folder-17",        color: "#5e72e4" },
    { label: "Total Students", value: totalStudents,  icon: "ni ni-single-02",         color: "#11cdef" },
    { label: "Years Active",   value: yearsActive,    icon: "ni ni-calendar-grid-58",  color: "#2dce89" },
    { label: "Pending Eval",   value: pending,        icon: "ni ni-bell-55",           color: "#fb6340" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Stat cards row */}
        <div style={{ display: "flex", gap: "1.1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Year filter toolbar */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1rem 1.5rem", marginBottom: "1.75rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <i className="ni ni-calendar-grid-58" style={{ color: "#8898aa", fontSize: "1rem" }} />
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8898aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Filter by Year
          </div>
          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            style={{ border: "1px solid #e9ecef", borderRadius: "8px", padding: "7px 14px", fontSize: "0.875rem", color: yearFilter ? "#11cdef" : "#8898aa", fontWeight: yearFilter ? 700 : 400, outline: "none", background: "#fff", cursor: "pointer" }}
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <div style={{ marginLeft: "auto", fontSize: "0.82rem", color: "#8898aa", fontWeight: 600 }}>
            Showing <span style={{ color: "#5e72e4", fontWeight: 800 }}>{list.length}</span> group{list.length !== 1 ? "s" : ""}
            {yearFilter && <span> in {yearFilter}</span>}
          </div>
        </div>

        {/* Projects grid */}
        {allList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#8898aa" }}>
            <i className="ni ni-folder-17" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", opacity: 0.35 }} />
            <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>No groups assigned yet</div>
            <div style={{ fontSize: "0.85rem" }}>Contact the coordinator to get groups assigned to you</div>
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8898aa" }}>
            <div style={{ fontWeight: 600 }}>No groups for {yearFilter}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {list.map((p) => {
              const img = Array.isArray(p.projectImages) ? p.projectImages.find(Boolean) : p.projectImages;
              const rawDesc = (p.projectDescription || "").replace(/<[^>]+>/g, "");
              const shortDesc = rawDesc.length > 110 ? rawDesc.slice(0, 110) + "…" : rawDesc;
              const memberCount = p.groupMembers?.length || 0;
              const finalized = p.evaluationFinalized;

              return (
                <div
                  key={p._id}
                  onClick={() => navigate(`/admin/project-view/${p._id}`)}
                  style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(94,114,228,0.18)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
                >
                  {img ? (
                    <img src={img} alt="" style={{ width: "100%", height: "175px", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: "175px", background: "linear-gradient(135deg, #5e72e4 0%, #344675 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="ni ni-folder-17" style={{ fontSize: "2.75rem", color: "rgba(255,255,255,0.35)" }} />
                    </div>
                  )}

                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(94,114,228,0.1)", color: "#5e72e4" }}>
                        Group {p.groupId}
                      </span>
                      {p.evaluationYear && (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(52,70,117,0.1)", color: "#344675" }}>
                          {p.evaluationYear}
                        </span>
                      )}
                      <span style={{ marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", background: finalized ? "rgba(45,206,137,0.12)" : "rgba(251,99,64,0.1)", color: finalized ? "#2dce89" : "#fb6340" }}>
                        {finalized ? "Finalized" : "Pending"}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#32325d", marginBottom: "0.5rem", lineHeight: 1.35 }}>
                      {p.projectName}
                    </div>

                    {shortDesc && (
                      <div style={{ fontSize: "0.8rem", color: "#8898aa", lineHeight: 1.6, marginBottom: "0.9rem" }}>
                        {shortDesc}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: "0.77rem", color: "#8898aa", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span><i className="ni ni-single-02" style={{ marginRight: "4px" }} />{memberCount} student{memberCount !== 1 ? "s" : ""}</span>
                        {img && <span><i className="ni ni-image" style={{ marginRight: "4px" }} />has images</span>}
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#5e72e4" }}>View →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "2rem" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ border: "none", background: page === 1 ? "#f4f6f9" : "#5e72e4", color: page === 1 ? "#adb5bd" : "#fff", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "0.85rem", cursor: page === 1 ? "default" : "pointer" }}
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{ border: "none", background: n === page ? "#5e72e4" : "#fff", color: n === page ? "#fff" : "#525f7f", borderRadius: "8px", padding: "8px 13px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ border: "none", background: page === totalPages ? "#f4f6f9" : "#5e72e4", color: page === totalPages ? "#adb5bd" : "#fff", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "0.85rem", cursor: page === totalPages ? "default" : "pointer" }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
