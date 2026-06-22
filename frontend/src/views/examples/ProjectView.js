import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProject } from "store/actions/projectAction";

const Gallery = ({ images }) => {
  const imgs = Array.isArray(images) ? images.filter(Boolean) : images ? [images] : [];

  if (imgs.length === 0) {
    return (
      <div style={{ height: "340px", background: "linear-gradient(135deg, #5e72e4 0%, #344675 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)" }}>
          <i className="ni ni-image" style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }} />
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>No project images yet</div>
        </div>
      </div>
    );
  }

  if (imgs.length === 1) {
    return <img src={imgs[0]} alt="" style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }} />;
  }

  if (imgs.length === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", height: "420px" }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gridTemplateRows: "210px 210px", gap: "3px" }}>
      {imgs[1] && <img src={imgs[1]} alt="" style={{ gridColumn: 1, gridRow: 1, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      <img src={imgs[0]} alt="" style={{ gridColumn: 2, gridRow: "1 / 3", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {imgs[2] && <img src={imgs[2]} alt="" style={{ gridColumn: 3, gridRow: 1, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      {imgs[3] && <img src={imgs[3]} alt="" style={{ gridColumn: 1, gridRow: 2, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      {imgs[4] && <img src={imgs[4]} alt="" style={{ gridColumn: 3, gridRow: 2, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
    </div>
  );
};

const ProjectView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);

  useEffect(() => {
    if (id) dispatch(getProject(id));
  }, [id]);

  const images = Array.isArray(project?.projectImages)
    ? project.projectImages.filter(Boolean)
    : project?.projectImages ? [project.projectImages] : [];

  const members = project?.groupMembers || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Gallery images={images} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {project && project._id ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>

            {/* Left */}
            <div>
              <div style={{ marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.78rem", color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Group {project.groupId}
                </span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#32325d", margin: "0 0 1.25rem", lineHeight: 1.2 }}>
                {project.projectName}
              </h1>

              {project.mainSupervisor && (
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Supervisor</div>
                  <div style={{ fontWeight: 600, color: "#32325d", fontSize: "0.9rem", marginTop: "2px" }}>{project.mainSupervisor}</div>
                </div>
              )}

              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#32325d", marginBottom: "0.75rem" }}>About the Project</h2>
              <div
                style={{ color: "#525f7f", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "2.5rem" }}
                dangerouslySetInnerHTML={{ __html: project.projectDescription || "<p style='color:#8898aa'>No description added yet.</p>" }}
              />

              {/* Group Members */}
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#32325d", marginBottom: "1rem" }}>Group Members</h2>
              {members.length === 0 ? (
                <div style={{ color: "#8898aa", fontSize: "0.88rem" }}>No members found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {members.map((m, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", borderRadius: "12px", padding: "13px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                    >
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(94,114,228,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="ni ni-single-02" style={{ color: "#5e72e4", fontSize: "0.9rem" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#32325d", fontSize: "0.9rem" }}>{m.name || "—"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#8898aa", marginTop: "1px" }}>{m.studentId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right sticky card */}
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "1.5rem", position: "sticky", top: "90px" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Academic Year</div>
                <div style={{ fontWeight: 600, color: "#32325d", marginTop: "3px" }}>{project.evaluationYear || "—"}</div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Group ID</div>
                <div style={{ fontWeight: 600, color: "#32325d", marginTop: "3px" }}>{project.groupId || "—"}</div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Images</div>
                <div style={{ fontWeight: 600, color: "#5e72e4", marginTop: "3px" }}>{images.length} uploaded</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
                  Students ({members.length})
                </div>
                {members.map((m, i) => (
                  <div
                    key={i}
                    style={{ fontSize: "0.82rem", color: "#32325d", padding: "5px 0", borderBottom: i < members.length - 1 ? "1px solid #f4f6f9" : "none" }}
                  >
                    <span style={{ fontWeight: 600 }}>{m.name || m.studentId}</span>
                    {m.name && <span style={{ color: "#8898aa", marginLeft: "6px", fontSize: "0.75rem" }}>{m.studentId}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8898aa" }}>
            <i className="ni ni-folder-17" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }} />
            Loading project...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
