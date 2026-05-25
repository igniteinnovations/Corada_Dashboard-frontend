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

        // ✅ STORE USER
        const userData = data.user || {
          name: email.split("@")[0],
          email: email
        };

        localStorage.setItem("user", JSON.stringify(userData));

        alert("Login successful");
        window.location.href = "/";
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ✅ NEW FUNCTION
  const goToRegister = () => {
    window.location.href = "/register";
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

      {/* 🔥 NEW BUTTON */}
      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Don't have an account?
      </p>

      <button
        onClick={goToRegister}
        style={{
          background: "transparent",
          color: "#e60023",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline"
        }}
      >
        Create New Account
      </button>

    </div>
  );
}

export default Login;