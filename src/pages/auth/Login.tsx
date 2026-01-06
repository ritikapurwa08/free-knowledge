import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-black font-display flex items-center justify-center min-h-screen p-4 sm:p-0">
      <div className="relative flex h-full w-full max-w-100 flex-col bg-white dark:bg-[#101622] sm:rounded-2xl sm:shadow-xl sm:h-auto sm:min-h-200 overflow-hidden transition-colors">

        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-2 px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 overflow-hidden shadow-sm">
            <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAF4SYn6rzX1a6fwvuLf6ii5JEa8HQ5Fkv-JRmZud9szGWp-3wj5i-qOocKQRVUx_SBSz9Y2-mbbI83KC4ny6i9y_nmpVdNU1Z3vjP4gdSJKQIY004wAMqd04fw7xHk8v7680_mIpF9XnA9elUPGTb4OuGRWwTMxg1j9H4AinhKSiT7yURvLBe2l39HvLRQoZa5Cu2u1wszUAxvT8t4sgGhIY8io2DeFF9s2eC6c2-Wbf5fvptvlab366MR5v99Zt2AUEVZDRbeQg")'}}></div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center">Login to continue learning</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4 px-6 pt-8 pb-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 dark:text-white text-sm font-semibold">Email Address</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">mail</span>
              <input type="email" className="w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white" placeholder="name@example.com" required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 dark:text-white text-sm font-semibold">Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-12 pl-10 pr-10 bg-slate-50 dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                placeholder="Enter password"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
            <div className="text-right mt-1">
                <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot Password?</a>
            </div>
          </div>

          <button className="mt-4 w-full bg-primary hover:bg-blue-700 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <span>Log In</span>
          </button>
        </form>

        <div className="mt-auto pb-8 px-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-2">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
