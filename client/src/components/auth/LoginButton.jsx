export default function LoginButton({
  loading,
}) {
  return (
    <button
      type="submit"
      style={{
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        background: "#6366F1",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {loading ? "Signing In..." : "Login"}
    </button>
  );
}