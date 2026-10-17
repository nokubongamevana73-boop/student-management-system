import { useState } from "react";
import "./App.css";

function StudentForm({ students, selected, onSave, onClose }) {
  const [form, setForm] = useState(
    selected || {
      id: "",
      fullName: "",
      age: "",
      email: "",
      course: "",
      status: "Active",
    }
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!/^9010\d+$/.test(form.id.trim())) {
      setError("Student ID must start with 9010, e.g. 901001.");
      return;
    }
    if (
      students.some(
        (s) => s.id === form.id.trim() && s.id !== selected?.id
      )
    ) {
      setError("This Student ID already exists.");
      return;
    }
    if (
      !form.fullName.trim() ||
      !form.age ||
      !form.email.trim() ||
      !form.course.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }
    if (
      !Number.isInteger(Number(form.age)) ||
      Number(form.age) < 16 ||
      Number(form.age) > 100
    ) {
      setError("Age must be a whole number between 16 and 100.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    onSave({ ...form, id: form.id.trim(), age: Number(form.age) });
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{selected ? "Edit Student" : "Student Registration Form"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID</label>
              <input name="id" placeholder="Enter student ID" value={form.id}
                onChange={update} required />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" placeholder="Enter full name"
                value={form.fullName} onChange={update} required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" min="16" max="100"
                placeholder="Enter age" value={form.age}
                onChange={update} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email"
                placeholder="Enter email" value={form.email}
                onChange={update} required />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input name="course" placeholder="Enter course"
                value={form.course} onChange={update} required />
            </div>
            <div className="form-group">
              <label>Enrollment Status</label>
              <select name="status" value={form.status} onChange={update}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="cancel-button"
              onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">
              {selected ? "Save Changes" : "Register Student"}
            </button>
          </div>
        </form>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function saveStudent(student) {
    if (selected) {
      setStudents(students.map((s) =>
        s.id === selected.id ? student : s
      ));
    } else {
      setStudents([...students, student]);
    }
    setSelected(null);
    setShowForm(false);
  }

  function editStudent(student) {
    setSelected(student);
    setShowForm(true);
  }

  function deleteStudent() {
    setStudents(students.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  }

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.id.includes(search.trim())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p className="header-description">
          Manage student records
        </p>
      </header>

      <main className="dashboard">
        <section className="summary-card">
          <p className="summary-label">Total Students</p>
          <h2>{students.length}</h2>
        </section>

        <section className="student-section">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>
              <p>Register and manage student information.</p>
            </div>
            <button className="add-button" onClick={() => {
              setSelected(null);
              setShowForm(true);
            }}>
              Add Student
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.fullName}</td>
                    <td>{s.age}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>
                      <span className={`status ${
                        s.status === "Active" ? "active" : "inactive"
                      }`}>{s.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-button"
                          onClick={() => editStudent(s)}>Edit</button>
                        <button className="delete-button"
                          onClick={() => setDeleteId(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      {search ? "No students found." :
                        "No students added yet. Select Add Student to begin."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="record-count">
            Showing {filtered.length} of {students.length} students
          </p>
        </section>
      </main>

      <footer>Student Management System</footer>

      {showForm && (
        <StudentForm students={students} selected={selected}
          onSave={saveStudent}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }} />
      )}

      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h2>Delete Student</h2>
            <p>Do you want to delete this student?</p>
            <div className="modal-actions">
              <button className="cancel-button"
                onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="confirm-delete-button"
                onClick={deleteStudent}>Delete Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;