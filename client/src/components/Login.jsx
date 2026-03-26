import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
    const { login, register, user } = useAuth();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white border text-left border-slate-200/60 rounded-2xl p-8 shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-3xl">🚀</span>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">CareerCraft</h1>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isLogin ? 'Login to access your smart intelligence loop' : 'Join to find your priority skill gaps and land jobs'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm font-bold mb-5 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition placeholder-slate-400" placeholder="John Doe" />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition placeholder-slate-400" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition placeholder-slate-400" placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition disabled:opacity-50">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-medium text-slate-500 border-t border-slate-100 pt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
