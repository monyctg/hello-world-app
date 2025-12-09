import { updateText } from "../actions";

export default function AdminPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <h1>Admin Panel</h1>

      {/* This form connects directly to the Server Action we just created */}
      <form
        action={updateText}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <label>New Text:</label>
        <input
          name="newText"
          type="text"
          placeholder="Enter new text here..."
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <label>Secret Password:</label>
        <input
          name="password"
          type="password"
          placeholder="Enter admin password"
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Update Site
        </button>
      </form>
    </div>
  );
}
