import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/forgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    // Validasi email menggunakan regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid. Pastikan format email benar.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    setMessage("Password berhasil diperbarui.");
    setTimeout(() => {
      navigate("/login");
    }, 3000);

    setIsLoading(false);
  };

  return (
    <div className="forget-password-container">
      <form className="forget-password-form" onSubmit={handleSubmit}>
        <h2>Forget Password</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Masukkan email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password Baru:</label>
        <input
          type="password"
          id="password"
          placeholder="Masukkan password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="forget-password-button"
          disabled={isLoading}
        >
          {isLoading ? "Mengirim..." : "Reset Password"}
        </button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="back-to-login">
          Sudah ingat password? <Link to="/login">Kembali ke Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgetPassword;
