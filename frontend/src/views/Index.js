import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import Header from "components/Headers/Header.js";
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

const Index = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const user = useSelector((state) => state.user.userData);
  const [searchYear, setSearchYear] = useState("2023");
  const [dispChart, setDispChart] = useState(false);
  const [proposalMarks, setProposalMarks] = useState([]);
  const [progressMarks, setProgressMarks] = useState([]);
  const [finalMarks, setFinalMarks] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [finalized, setFinalized] = useState(false);
  const [stats, setStats] = useState({ studentCount: 0, evaluatorCount: 0, projectCount: 0 });

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
      axios.get(`${serverUrl}admin/dashboard-stats`)
        .then((res) => setStats(res.data))
        .catch(console.error);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (projects.length !== 0 && projects[0].evaluationFinalized) {
      chartData();
      setFinalized(true);
    }
  }, [projects]);

  const statCards = [
    { label: "Total Students", value: stats.studentCount, icon: "ni ni-single-02", color: "#5e72e4" },
    { label: "Total Evaluators", value: stats.evaluatorCount, icon: "ni ni-hat-3", color: "#2dce89" },
    { label: "Total Projects", value: stats.projectCount, icon: "ni ni-collection", color: "#f5365c" },
  ];

  return (
    <div>
      {isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={icon} style={{ color, fontSize: "1.4rem" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#32325d", lineHeight: 1.2 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Header />

      {/* Admin/HOD controls */}
      {(isAdmin || isHod) && (
        <div style={{ ...card, padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Student Performance
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#32325d", marginTop: "2px" }}>
                FYP Projects — {searchYear} Academic Year
              </div>
              <div style={{ color: "#5e72e4", fontWeight: 600, marginTop: "4px" }}>
                {projects.length} Projects Total
              </div>
              {isAdmin && !finalized && (
                <button
                  onClick={finalizeEvaluation}
                  style={{
                    marginTop: "10px",
                    background: "#f5365c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Finalize Evaluation — {searchYear}
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
              }}>
                <span style={{ padding: "0 12px", color: "#8898aa" }}>
                  <i className="fas fa-search" />
                </span>
                <input
                  placeholder="Academic Year"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  style={{ border: "none", outline: "none", padding: "8px 0", fontSize: "0.875rem", width: "140px" }}
                />
              </div>
              <button
                onClick={() => dispatch(getAllProjects(searchYear))}
                style={{
                  background: "#5e72e4",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {(isAdmin || isHod) && dispChart && projects.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <ChartCard title="Proposal Marks" data={{ labels: groupIds, values: proposalMarks }} color={chartColors.proposal} />
          <ChartCard title="Progress Marks" data={{ labels: groupIds, values: progressMarks }} color={chartColors.progress} />
          <ChartCard title="Final Marks" data={{ labels: groupIds, values: finalMarks }} color={chartColors.final} />
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
