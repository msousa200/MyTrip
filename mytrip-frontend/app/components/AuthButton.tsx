"use client";

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function AuthButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setAuthLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotification("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setNotification("Invalid login credentials");
      setLoading(false);
      return;
    }
    setLoading(false);
    setShowModal(false);
    // Atualiza usuário
    const { data } = await supabase.auth.getUser();
    setUser(data?.user ?? null);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
    // Usuário será atualizado pelo listener
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotification("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setNotification("Após criar a conta, receberás um email de confirmação. Clica no link para ativar!");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <>
      {authLoading ? (
        <div className="flex items-center justify-center h-10 w-24">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : user ? (
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-300 mr-2" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-2">
              {user.user_metadata?.full_name
                ? user.user_metadata.full_name[0]
                : user.email[0]}
            </div>
          )}
          <div className="flex flex-col mr-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Bem-vindo</span>
            <span className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
              {user.user_metadata?.full_name
                ? (() => {
                    const names = user.user_metadata.full_name.split(' ');
                    return `${names[0]} ${names[names.length - 1]}`;
                  })()
                : user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow"
            disabled={loading}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setShowModal(true); setShowRegister(false); setNotification(""); setError(""); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          Login
        </button>
      )}
      {showModal && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            {notification && (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center text-sm font-semibold">
                {notification}
              </div>
            )}
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
              {showRegister ? 'Criar Conta' : 'Entrar na sua conta'}
            </h2>
            {!showRegister ? (
              <>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    required
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500">Não tens conta? <button className="text-indigo-600 hover:underline font-semibold" onClick={() => { setShowRegister(true); setError(""); setNotification(""); }}>Cria aqui</button></span>
                </div>
                <div className="mt-6 text-center">
                  <span className="block mb-2 text-gray-500">ou</span>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 shadow-sm"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                      <g>
                        <path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.64 0 6.27 5.48 2.13 13.44l8.06 6.27C12.7 13.13 17.89 9.5 24 9.5z"/>
                        <path fill="#34A853" d="M46.14 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.59C43.73 37.36 46.14 31.44 46.14 24.5z"/>
                        <path fill="#FBBC05" d="M10.19 28.71c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.36 16.36 0 20.09 0 24c0 3.91.36 7.64 2.13 11.09l8.06-6.27z"/>
                        <path fill="#EA4335" d="M24 48c6.55 0 12.36-2.17 16.98-5.93l-7.18-5.59c-2.01 1.35-4.59 2.16-7.8 2.16-6.11 0-11.3-3.63-13.81-8.91l-8.06 6.27C6.27 42.52 14.64 48 24 48z"/>
                        <path fill="none" d="M0 0h48v48H0z"/>
                      </g>
                    </svg>
                    {loading ? 'Entrando...' : 'Entrar com Google'}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                  required
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </button>
                <div className="mt-2 text-center">
                  <button className="text-gray-500 hover:underline text-sm" type="button" onClick={() => { setShowRegister(false); setError(""); setNotification(""); }}>Já tens conta? Entrar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
