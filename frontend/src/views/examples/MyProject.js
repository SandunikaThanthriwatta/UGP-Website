import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getProjectByStudent } from "../../store/actions/projectAction";
import axios from "axios";
import { serverUrl } from "utils/serveUrl";
import { updateProject } from "store/actions/studentAction";

const Gallery = ({ images }) => {
  const imgs = Array.isArray(images) ? images.filter(Boolean) : images ? [images] : [];

  if (imgs.length === 0) {
    return (
      <div style={{ height: "340px", background: "linear-gradient(135deg, #5e72e4 0%, #344675 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)" }}>
          <i className="ni ni-image" style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }} />
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>No project images yet</div>
          <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>Click Edit Project to upload images</div>
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

const MyProject = () => {
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.user.userData._id);
  const project = useSelector((state) => state.project.project);
  const [textbody, setTextbody] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (studentId) dispatch(getProjectByStudent(studentId));
  }, [studentId]);

  const images = Array.isArray(project?.projectImages)
    ? project.projectImages.filter(Boolean)
    : project?.projectImages ? [project.projectImages] : [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = async (imageUrl) => {
    await axios.put(`${serverUrl}student/remove-image/${project._id}`, { imageUrl });
    dispatch(getProjectByStudent(studentId));
  };

  const onSubmit = async () => {
    setUploading(true);
    try {
      let newUrls = [];
      if (selectedFiles.length > 0) {
        newUrls = await Promise.all(
          selectedFiles.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await axios.post(`${serverUrl}upload`, fd);
            return res.data.url;
          })
        );
      }
      await dispatch(updateProject({
        id: project._id,
        text: textbody || project.projectDescription,
        projectImages: newUrls,
      }));
      setModal(false);
      setSelectedFiles([]);
      setPreviews([]);
      setTextbody("");
    } finally {
      setUploading(false);
    }
  };

  const meta = [
    { label: "Group ID", value: project?.groupId },
    { label: "Supervisor", value: project?.mainSupervisor },
    { label: "Members", value: project?.groupMembers?.map((m) => m.studentId || m.name).join(", ") },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Gallery */}
      <Gallery images={images} />

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {project ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

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

              {/* Meta pills */}
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                {meta.map(({ label, value }) => value && (
                  <div key={label}>
                    <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>
                    <div style={{ fontWeight: 600, color: "#32325d", fontSize: "0.9rem", marginTop: "2px" }}>{value}</div>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#32325d", marginBottom: "0.75rem" }}>About the Project</h2>
              <div
                style={{ color: "#525f7f", lineHeight: 1.8, fontSize: "0.95rem" }}
                dangerouslySetInnerHTML={{ __html: project.projectDescription || "<p style='color:#8898aa'>No description added yet.</p>" }}
              />
            </div>

            {/* Right card */}
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "1.5rem", position: "sticky", top: "90px" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Project ID</div>
                <div style={{ fontWeight: 600, color: "#32325d", fontSize: "0.82rem", marginTop: "3px", wordBreak: "break-all" }}>{project._id}</div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Year</div>
                <div style={{ fontWeight: 600, color: "#32325d", marginTop: "3px" }}>{project.evaluationYear || "—"}</div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#8898aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Images</div>
                <div style={{ fontWeight: 600, color: "#5e72e4", marginTop: "3px" }}>{images.length} uploaded</div>
              </div>

              <button
                onClick={() => setModal(true)}
                style={{ width: "100%", background: "#5e72e4", color: "#fff", border: "none", borderRadius: "10px", padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", letterSpacing: "0.2px" }}
              >
                Edit Project
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8898aa" }}>
            <i className="ni ni-folder-17" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }} />
            Loading project...
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setModal(false)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "620px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#32325d" }}>Edit Project</div>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8898aa" }}>✕</button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "6px" }}>Project Description</label>
              <ReactQuill
                value={textbody || project?.projectDescription || ""}
                onChange={setTextbody}
                placeholder="Describe your project..."
              />
            </div>

            {/* Upload new images */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "6px" }}>
                Add Images <span style={{ color: "#8898aa", fontWeight: 400 }}>— select multiple files</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ width: "100%", fontSize: "0.875rem", marginBottom: previews.length ? "0.75rem" : 0 }}
              />
              {previews.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px", marginTop: "0.75rem" }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "75px", objectFit: "cover", borderRadius: "8px" }} />
                      <div style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "0.65rem", borderRadius: "4px", padding: "1px 5px" }}>New</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing images */}
            {images.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#525f7f", display: "block", marginBottom: "6px" }}>
                  Current Images ({images.length})
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
                  {images.map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "75px", objectFit: "cover", borderRadius: "8px", display: "block" }} />
                      <button
                        onClick={() => removeImage(src)}
                        style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(245,54,92,0.85)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "0.5rem" }}>
              <button onClick={() => setModal(false)} style={{ background: "#f4f6f9", color: "#525f7f", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={onSubmit} disabled={uploading} style={{ background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontWeight: 700, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.75 : 1 }}>
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProject;
