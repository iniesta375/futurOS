export default function LoginInput({
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #444",
        background: "#111",
        color: "#fff",
        marginBottom: "15px",
      }}
    />
  );
}