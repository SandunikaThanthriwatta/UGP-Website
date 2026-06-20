import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

const card = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  overflow: "hidden",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadYear, setUploadYear] = useState("");
  const [uploading, setUploading] = useState(false);
  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const fetchStudents = () => {
    axios.get(`${serverUrl}admin/all-students`)
      .then((res) => setStudents(res.data.students || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const years = [...new Set(students.map((s) => s.evaluationYear).filter(Boolean))].sort().reverse();

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.studentId?.toLowerCase().includes(q) ||
      s.studentName?.toLowerCase().includes(q) ||
      s.groupId?.toLowerCase().includes(q) ||
      s.projectName?.toLowerCase().includes(q);
    const matchesYear = !yearFilter || s.evaluationYear === yearFilter;
    return matchesSearch && matchesYear;
  });

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
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Upload Modal */}
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
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#32325d" }}>All Students</div>
            <div style={{ fontSize: "0.78rem", color: "#8898aa", marginTop: "2px" }}>{filtered.length} of {students.length} students</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#f8f9fa", padding: "0 12px", gap: "8px" }}>
            <i className="fas fa-search" style={{ color: "#8898aa", fontSize: "0.8rem" }} />
            <input
              placeholder="Search by name, ID, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", padding: "8px 0", fontSize: "0.875rem", width: "240px", color: "#32325d" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#8898aa", fontSize: "0.85rem", padding: 0 }}>✕</button>
            )}
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ minWidth: "150px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "0.875rem", color: yearFilter ? "#5e72e4" : "#8898aa", outline: "none", background: "#f8f9fa", fontWeight: yearFilter ? 600 : 400, cursor: "pointer" }}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => setUploadModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#5e72e4", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span> Upload Students
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                {["Student ID", "Name", "Group", "Project", "Year"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 600, color: "#8898aa", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#32325d" }}>{s.studentId}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#32325d" }}>{s.studentName}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>{s.groupId}</span>
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", color: "#525f7f", maxWidth: "260px" }}>{s.projectName}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <span style={{ background: "#f0f4ff", color: "#5e72e4", borderRadius: "6px", padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600 }}>{s.evaluationYear}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "#8898aa" }}>
                    <i className="ni ni-single-02" style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem", opacity: 0.4 }} />
                    {search ? `No students match "${search}"` : "No students found. Upload a CSV to get started."}
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

export default Students;
