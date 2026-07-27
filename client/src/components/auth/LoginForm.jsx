import { useState } from "react";
import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";

export default function LoginForm() {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      loginUser(data);

      alert("Login Successful");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login Failed"
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: 15,
          }}
        >
          {error}
        </p>
      )}

      <LoginInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <LoginInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <LoginButton loading={loading} />

    </form>
  );
}