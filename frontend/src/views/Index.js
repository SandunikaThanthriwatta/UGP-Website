import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { getAllProjects } from "store/actions/projectAction";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  overflow: "hidden",
};

const chartColors = {
  proposal: "rgba(94,114,228,0.8)",
  progress: "rgba(45,206,137,0.8)",
  final: "rgba(251,99,64,0.8)",
};

const ChartCard = ({ title, data, color }) => (
  <div style={{ ...card, padding: "1.25rem", marginBottom: "1.25rem" }}>
    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#32325d", marginBottom: "1rem" }}>
      {title}
    </div>
    <Bar
      data={{
        labels: data.labels,
        datasets: [{
          label: title,
          data: data.values,
          backgroundColor: color,
          borderRadius: 6,
          borderSkipped: false,
        }],
      }}
      options={{
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
          x: { grid: { display: false } },
        },
      }}
    />
  </div>
);

const ProjectCard = ({ p }) => (
  <Link to={`/all/project/${p._id}`} style={{ textDecoration: "none" }}>
    <div
      style={{ ...card, padding: "1.25rem", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
      }}
    >
      <div style={{ fontSize: "0.72rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
        Group {p.groupId}
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#32325d", marginBottom: "0.75rem", lineHeight: 1.4 }}>
        {p.projectName}
      </div>
      {p.projectImages && (
        <img
          src={p.projectImages}
          alt={p.projectName}
          style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }}
        />
      )}
    </div>
  </Link>
);

const SparkBar = ({ vals, years, max, W, H, gap, barW, rx, color }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ marginTop: "0.85rem" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {vals.map((v, i) => {
          const bh = Math.max((v / max) * H, 6);
          const x = i * (barW + gap);
          const y = H - bh;
          const isHov = hovered === i;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={bh} rx={rx}
                fill={`url(#grad-${color.replace("#","")})`}
                opacity={isHov ? 1 : 0.75}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              {isHov && (
                <g>
                  <rect
                    x={x + barW / 2 - 22} y={y - 28}
                    width={44} height={22} rx={5}
                    fill="#1a2035"
                  />
                  <text
                    x={x + barW / 2} y={y - 13}
                    textAnchor="middle" fill="#fff"
                    fontSize="11" fontWeight="700"
                  >{v}</text>
                </g>
              )}
              <text
                x={x + barW / 2} y={H + 14}
                textAnchor="middle" fill="#8898aa"
                fontSize="9.5" fontWeight="500"
              >{years[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Index = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const user = useSelector((state) => state.user.userData);
  const currentYear = new Date().getFullYear().toString();
  const [searchYear, setSearchYear] = useState(currentYear);
  const [dispChart, setDispChart] = useState(false);
  const [proposalMarks, setProposalMarks] = useState([]);
  const [progressMarks, setProgressMarks] = useState([]);
  const [finalMarks, setFinalMarks] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [finalized, setFinalized] = useState(false);
  const [stats, setStats] = useState({ studentCount: 0, evaluatorCount: 0, projectCount: 0 });
  const [trends, setTrends] = useState([]);

  const isAdmin = user?.userType === 2;
  const isHod = user?.userType === 3;

  const finalizeEvaluation = async () => {
    await toast.promise(
      axios.post(`${serverUrl}student/finalize-marks`, { searchYear })
        .then((res) => { if (res.status === 200) window.location.reload(); })
        .catch((err) => { toast.error(err.response?.data?.message); }),
      { pending: "Finalizing...", success: "Finalized!", error: "Failed" }
    );
  };

  const chartData = () => {
    setDispChart(true);
    axios.get(`${serverUrl}student/chart-marks/${searchYear}`)
      .then((res) => {
        if (res.status === 200) {
          setProgressMarks(res.data.progress_marks);
          setProposalMarks(res.data.proposal_marks);
          setFinalMarks(res.data.final_Mrks);
          setGroupIds(res.data.groupIds);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAllProjects(currentYear));
      axios.get(`${serverUrl}admin/dashboard-stats?year=${currentYear}`)
        .then((res) => setStats(res.data))
        .catch(console.error);
      axios.get(`${serverUrl}admin/yearly-trends`)
        .then((res) => setTrends(res.data.trends))
        .catch(console.error);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (projects.length !== 0 && projects[0].evaluationFinalized) {
      chartData();
      setFinalized(true);
    }
  }, [projects]);

  const last4 = trends.slice(-4);

  const statCards = [
    { label: "Total Students", value: stats.studentCount, icon: "ni ni-single-02", color: "#5e72e4", dataKey: "studentCount" },
    { label: "Total Evaluators", value: stats.evaluatorCount, icon: "ni ni-hat-3", color: "#2dce89", dataKey: "evaluatorCount" },
    { label: "Total Projects", value: stats.projectCount, icon: "ni ni-folder-17", color: "#f5365c", dataKey: "projectCount" },
  ];

  const prevYearStats = trends.length >= 2 ? trends[trends.length - 2] : null;
  const change = (current, dataKey) => {
    if (!prevYearStats || prevYearStats[dataKey] == null) return null;
    const prev = prevYearStats[dataKey];
    const diff = current - prev;
    const pct = prev === 0 ? (diff > 0 ? 100 : 0) : Math.round((diff / prev) * 100);
    return { diff, pct };
  };

  return (
    <div>
      {isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
          {statCards.map(({ label, value, icon, color, dataKey }) => {
            const delta = change(value, dataKey);
            return (
              <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Left: icon + label + count */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={icon} style={{ color, fontSize: "1.1rem" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
                    <div style={{ fontSize: "1.9rem", fontWeight: 700, color: "#32325d", lineHeight: 1.2, marginTop: "2px" }}>{value}</div>
                  </div>
                </div>
                {/* Right: bar chart + delta below */}
                <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  {last4.length > 0 && (() => {
                    const vals = last4.map((t) => t[dataKey] || 0);
                    const max = Math.max(...vals, 1);
                    const W = 200, H = 64, gap = 8, rx = 5;
                    const barW = (W - gap * (vals.length - 1)) / vals.length;
                    return <SparkBar vals={vals} years={last4.map(t => t.year)} max={max} W={W} H={H} gap={gap} barW={barW} rx={rx} color={color} />;
                  })()}
                  {delta && (
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#8898aa", display: "flex", alignItems: "center", gap: "3px" }}>
                      <span style={{ color: delta.diff >= 0 ? "#2dce89" : "#f5365c" }}>{delta.diff >= 0 ? "▲" : "▼"}</span>
                      {Math.abs(delta.pct)}% vs last year
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Performance Section */}
      {(isAdmin || isHod) && (
        <div style={{ ...card, marginBottom: "1.5rem" }}>

          {/* Section header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Overview</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#32325d", marginTop: "2px" }}>Student Performance</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#f8f9fa" }}>
              <span style={{ padding: "0 12px", color: "#8898aa", fontSize: "0.8rem" }}>
                <i className="fas fa-calendar-alt" />
              </span>
              <input
                placeholder="Search academic year"
                value={searchYear}
                onChange={(e) => {
                  const y = e.target.value;
                  setSearchYear(y);
                  dispatch(getAllProjects(y));
                  if (y.length === 4) {
                    axios.get(`${serverUrl}admin/dashboard-stats?year=${y}`)
                      .then((res) => setStats(res.data))
                      .catch(console.error);
                  }
                }}
                style={{ border: "none", outline: "none", background: "transparent", padding: "8px 12px 8px 0", fontSize: "0.875rem", width: "220px", color: "#32325d" }}
              />
            </div>
          </div>

          {/* Summary row */}
          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #f0f0f0" }}>
            {[
              { label: "Academic Year", value: searchYear || "—", icon: "ni ni-calendar-grid-58", color: "#5e72e4" },
              { label: "Total Projects", value: projects.length, icon: "ni ni-folder-17", color: "#f5365c" },
              { label: "Status", value: finalized ? "Finalized" : "In Progress", icon: "ni ni-check-bold", color: finalized ? "#2dce89" : "#fb6340" },
            ].map(({ label, value, icon, color }, i, arr) => (
              <div key={label} style={{ flex: 1, padding: "1.25rem 1.5rem", borderRight: i < arr.length - 1 ? "1px solid #f0f0f0" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={icon} style={{ color, fontSize: "1rem" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Finalize button */}
          {isAdmin && projects.length > 0 && !finalized && (
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "0.85rem", color: "#8898aa" }}>All evaluations must be completed before finalizing.</div>
              <button
                onClick={finalizeEvaluation}
                style={{ background: "#f5365c", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Finalize Evaluation
              </button>
            </div>
          )}

          {/* Charts */}
          {dispChart && projects.length > 0 && (
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                <ChartCard title="Proposal Marks" data={{ labels: groupIds, values: proposalMarks }} color={chartColors.proposal} />
                <ChartCard title="Progress Marks" data={{ labels: groupIds, values: progressMarks }} color={chartColors.progress} />
                <ChartCard title="Final Marks" data={{ labels: groupIds, values: finalMarks }} color={chartColors.final} />
              </div>
            </div>
          )}

          {/* Empty state */}
          {projects.length === 0 && (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "#8898aa" }}>
              <i className="ni ni-folder-17" style={{ fontSize: "2rem", marginBottom: "0.75rem", display: "block", opacity: 0.4 }} />
              <div style={{ fontWeight: 600 }}>No projects found</div>
              <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>Enter an academic year above to load data</div>
            </div>
          )}
        </div>
      )}

      {/* Welcome message for non-admin/hod */}
      {!isAdmin && !isHod && (
        <div style={{ ...card, padding: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#32325d", marginBottom: "0.5rem" }}>
            Welcome to FYP Console
          </div>
          <div style={{ color: "#8898aa" }}>Final Year Project Evaluation Portal</div>
        </div>
      )}

      {/* Project cards grid */}
      {projects.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {projects.map((p, i) => <ProjectCard key={i} p={p} />)}
        </div>
      )}
    </div>
  );
};

export default Index;
