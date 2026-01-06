import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration logic
    console.log("Registering:", { email, password });
    // After success, go to dashboard
    navigate("/");
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-black font-display flex items-center justify-center min-h-screen p-4 sm:p-0">
      {/* Main Container representing the Phone Screen */}
      <div className="relative flex h-full w-full max-w-100 flex-col bg-white dark:bg-[#101622] sm:rounded-2xl sm:shadow-xl sm:h-auto sm:min-h-200 overflow-hidden transition-colors">

        {/* Header / Logo Section */}
        <div className="flex flex-col items-center pt-10 pb-2 px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 overflow-hidden shadow-sm">
            {/* Abstract Logo */}
            <div
              className="w-full h-full bg-center bg-cover"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAF4SYn6rzX1a6fwvuLf6ii5JEa8HQ5Fkv-JRmZud9szGWp-3wj5i-qOocKQRVUx_SBSz9Y2-mbbI83KC4ny6i9y_nmpVdNU1Z3vjP4gdSJKQIY004wAMqd04fw7xHk8v7680_mIpF9XnA9elUPGTb4OuGRWwTMxg1j9H4AinhKSiT7yURvLBe2l39HvLRQoZa5Cu2u1wszUAxvT8t4sgGhIY8io2DeFF9s2eC6c2-Wbf5fvptvlab366MR5v99Zt2AUEVZDRbeQg")'}}
            >
            </div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">
            Welcome to Exam Orbit
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center">
            Unlock your English potential
          </p>
        </div>

        {/* Social Auth Section */}
        <div className="px-6 py-4">
          <button className="relative w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-lg h-12 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group active:scale-[0.98]">
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-[24px]">
              language
            </span>
            <span className="text-base font-semibold">Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-6 py-2">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Or continue with email</p>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Registration Form */}
        <form className="flex flex-col gap-4 px-6 pt-4 pb-6" onSubmit={handleRegister}>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 dark:text-white text-sm font-semibold" htmlFor="email">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                id="email"
                type="email"
                className="w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 dark:text-white text-sm font-semibold" htmlFor="password">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-12 pl-10 pr-10 bg-slate-50 dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            {/* Validation Hint (Dynamic) */}
            <div className={`flex items-center gap-1 mt-1 transition-opacity duration-300 ${password.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
              <span className={`material-symbols-outlined text-[14px] ${password.length >= 8 ? 'text-green-500' : 'text-slate-400'}`}>check_circle</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Must be at least 8 characters</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-primary hover:bg-blue-700 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]"
          >
            <span>Create Account</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer / Toggle */}
        <div className="mt-auto pb-8 px-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-2">Log In</Link>
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
