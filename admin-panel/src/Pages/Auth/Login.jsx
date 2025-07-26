import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import loginIllustration from "../../assets/loginslide.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔐 Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Email login successful:", result.user);
      navigate("/"); // redirect to dashboard
    } catch (err) {
      console.error("❌ Email login failed:", err.message);
      setError("Invalid email or password.");
    }
  };

  // 🔐 Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google Sign-In successful:", result.user);
      navigate("/"); // redirect to dashboard
    } catch (error) {
      console.error("❌ Google Sign-In failed:", error.message);
      setError("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 px-4">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-5xl border border-base-300">
        
        {/* Left Illustration Panel */}
        <div className="hidden lg:flex items-center justify-center bg-base-200 w-1/2 p-8">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-full max-w-sm"
          />
        </div>

        {/* Right Login Form Panel */}
        <div className="w-full lg:w-1/2 p-8 relative">

          {/* Logo */}
          <div className="absolute top-4 right-4">
            <img
              src="/large-logo.png"
              alt="Logo"
              className="h-10 w-auto object-contain drop-shadow"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-primary mb-6 mt-2">
            Login to Admin Panel
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="input input-bordered w-full mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="input input-bordered w-full mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full hover:brightness-110 transition duration-200"
            >
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full flex items-center justify-center gap-2 hover:bg-base-200 transition duration-200"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>

          {/* <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              Register
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
