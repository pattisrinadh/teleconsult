import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // fake login — in real app call API
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl w-80 h-80 bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60')`}} />
          <h2 className="mt-6 text-2xl font-bold text-slate-700">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 text-center">Manage appointments, consult patients and keep records securely.</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-4">Instagram</h1>
            <p className="text-center text-sm text-slate-500 mb-6">Login to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="username" placeholder="Phone number, username or email" className="w-full p-3 rounded bg-slate-50 border border-slate-200 outline-none" />
              <input type="password" name="password" placeholder="Password" className="w-full p-3 rounded bg-slate-50 border border-slate-200 outline-none" />
              <button type="submit" className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">Log In</button>
            </form>

            <div className="my-4 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <div className="text-xs text-slate-400">OR</div>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <button className="w-full py-2 rounded border border-slate-200 text-sm text-blue-600 font-medium">Continue with Facebook</button>

            <div className="mt-6 text-center text-xs text-slate-500">
              <Link to="#" className="text-blue-600">Forgot password?</Link>
            </div>
          </div>

          <div className="mt-4 w-full max-w-sm bg-white p-4 rounded-2xl text-center border border-slate-100">
            <p className="text-sm">Don't have an account? <Link to="#" className="text-blue-600 font-medium">Sign up</Link></p>
          </div>

          <p className="mt-4 text-xs text-slate-400">Get the app.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
