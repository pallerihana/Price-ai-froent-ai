import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Email and Password are required");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (isSignUp) {
        console.log("Sign Up successful:", formData);
        alert("Sign Up successful! Please log in.");
      } else {
        console.log("Login successful:", formData);
        alert("Login successful! Redirecting...");
        navigate("/"); // Redirect to home page after login
      }
      setLoading(false);
      setFormData({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
    }, 1000); // Simulate 1-second loading
  };

  // Inline styles with embedded keyframes
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f0f8ff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      background: "#00ced1",
      color: "white",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    headerTitle: {
      fontSize: "24px",
      margin: 0,
    },
    nav: {
      display: "flex",
      gap: "10px",
    },
    navBtn: {
      background: "#00b7eb",
      border: "none",
      color: "white",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background 0.3s",
    },
    navBtnHover: {
      background: "#0099cc",
    },
    navBtnActive: {
      background: "#27ae60",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      padding: "20px",
    },
    image: {
      flex: 1,
      display: "none",
      maxWidth: "50%",
    },
    imageImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "10px",
    },
    form: {
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    formTitle: {
      fontSize: "28px",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      color: "#333",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "14px",
    },
    inputFocus: {
      borderColor: "#3498db",
      boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
    },
    errorMessage: {
      color: "#e74c3c",
      fontSize: "14px",
      marginTop: "5px",
      textAlign: "center",
    },
    submitBtn: {
      width: "100%",
      padding: "12px",
      background: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    submitBtnHover: {
      background: "#2980b9",
    },
    submitBtnDisabled: {
      background: "#95a5a6",
      cursor: "not-allowed",
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #fff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto",
      display: "inline-block",
    },
    toggleText: {
      textAlign: "center",
      fontSize: "14px",
      color: "#7f8c8d",
      marginTop: "10px",
    },
    toggleLink: {
      color: "#3498db",
      cursor: "pointer",
      textDecoration: "underline",
    },
    toggleLinkHover: {
      color: "#2980b9",
    },
    "@media": {
      "(min-width: 768px)": {
        content: {
          padding: "40px",
        },
        image: {
          display: "block",
        },
        form: {
          marginLeft: "20px",
        },
      },
    },
  };

  // Fallback render if something fails
  if (!document || !document.createElement) {
    return <div>Error: Component failed to render. Check console for details.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Price AI Vision</h1>
        <div style={styles.nav}>
          <button
            style={styles.navBtn}
            onMouseEnter={(e) => (e.target.style.background = styles.navBtnHover.background)}
            onMouseLeave={(e) => (e.target.style.background = styles.navBtn.background)}
            onClick={() => navigate("/vendor")}
          >
            Become a Vendor
          </button>
          <button
            style={styles.navBtn}
            onMouseEnter={(e) => (e.target.style.background = styles.navBtnHover.background)}
            onMouseLeave={(e) => (e.target.style.background = styles.navBtn.background)}
            onClick={() => navigate("/compare")}
          >
            Compare
          </button>
          <button
            style={styles.navBtn}
            onMouseEnter={(e) => (e.target.style.background = styles.navBtnHover.background)}
            onMouseLeave={(e) => (e.target.style.background = styles.navBtn.background)}
            onClick={() => navigate("/services")}
          >
            Services
          </button>
          <button
            style={{ ...styles.navBtn, ...(isSignUp ? {} : styles.navBtnActive) }}
            onMouseEnter={(e) => (e.target.style.background = styles.navBtnHover.background)}
            onMouseLeave={(e) => (e.target.style.background = isSignUp ? styles.navBtn.background : styles.navBtnActive.background)}
            onClick={() => setIsSignUp(false)}
          >
            Login
          </button>
          <button
            style={{ ...styles.navBtn, ...(isSignUp ? styles.navBtnActive : {}) }}
            onMouseEnter={(e) => (e.target.style.background = styles.navBtnHover.background)}
            onMouseLeave={(e) => (e.target.style.background = isSignUp ? styles.navBtnActive.background : styles.navBtn.background)}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.image}>
          <img
            src="/images/healthcare-bg.jpg"
            alt="Healthcare Background"
            style={styles.imageImg}
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.target.style.display = "none"; // Hide if image fails
            }}
          />
        </div>
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{isSignUp ? "Sign Up" : "Login"}</h2>
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">
                  Name
                </label>
                <input
                  style={styles.input}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">
                Email
              </label>
              <input
                style={styles.input}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Enter your email"
                required
              />
            </div>
            {isSignUp && (
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="phone">
                  Phone
                </label>
                <input
                  style={styles.input}
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <input
                style={styles.input}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Enter your password"
                required
              />
            </div>
            {isSignUp && (
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  style={styles.input}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            {error && <p style={styles.errorMessage}>{error}</p>}
            <button
              type="submit"
              style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.submitBtnHover)}
              onMouseLeave={(e) => !loading && Object.assign(e.target.style, styles.submitBtn)}
              disabled={loading}
            >
              {loading ? <div style={styles.spinner}></div> : isSignUp ? "Sign Up" : "Login"}
            </button>
            <p style={styles.toggleText}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span
                style={styles.toggleLink}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.toggleLinkHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.toggleLink)}
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpLogin;