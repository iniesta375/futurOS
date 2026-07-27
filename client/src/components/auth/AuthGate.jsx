import App from "../../App";
import Login from "../../pages/Login/Login";
import {useAuth} from "../../contexts/AuthContext";

export default function AuthGate() {
    const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <App />;
}