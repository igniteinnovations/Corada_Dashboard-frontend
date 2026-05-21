import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("https://api.korada.news/api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        // ✅ STORE TOKEN
        localStorage.setItem("token", data.token);

        // ✅ STORE USER (NEW 🔥)
        // If backend sends user → use it
        // else fallback using email
        const userData = data.user || {
          name: email.split("@")[0],
          email: email
        };

        localStorage.setItem("user", JSON.stringify(userData));

        alert("Login successful");
        window.location.href = "/"; // redirect
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;