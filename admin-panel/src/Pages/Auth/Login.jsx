import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import loginIllustration from "../../assets/loginslide.svg"; // ✅ Adjust path as per your folder structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    // TODO: Add Firebase email/password login
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    // TODO: Add Firebase Google Sign-In
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
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
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">
            Login to Admin Panel
          </h2>

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

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
