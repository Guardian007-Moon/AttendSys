
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, User, Lock, CheckCircle, Activity, FileText, Smartphone, Loader2 } from 'lucide-react';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate network delay then navigate
    setTimeout(() => {
      router.push('/courses');
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Teacher Login | QTrack</title>
      </Head>
      <style jsx global>{`
        :root {
          --primary: #2e7dff; /* Education blue */
          --primary-dark: #1b56c4;
          --secondary: #43b581; /* Soft green */
          --accent: #f9a825;    /* Highlight yellow */
          --light: #f8f9fa;
          --dark: #212529;
          --gray: #bdbdbd;
        }
        .login-body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .login-container {
          display: flex;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          width: 900px;
          max-width: 95%;
          min-height: 550px;
        }
        .login-box {
          flex: 1;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          color: #fff;
        }
        .login-logo {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          color: #fff;
          font-weight: 700;
          font-size: 22px;
        }
        .login-logo .icon {
          margin-right: 10px;
          font-size: 26px;
        }
        .login-box h2 {
          margin-bottom: 8px;
          font-weight: 700;
          font-size: 28px;
          color: #fff;
        }
        .login-subtitle {
          color: var(--gray);
          margin-bottom: 35px;
          font-size: 15px;
        }
        .input-group {
          margin-bottom: 20px;
          position: relative;
        }
        .input-group label {
          display: block;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #fff;
        }
        .input-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          outline: none;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        .input-group input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 4px rgba(46, 125, 255, 0.25);
        }
        .input-group .icon {
          position: absolute;
          right: 16px;
          top: 42px;
          color: #bbb;
          font-size: 16px;
        }
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin-bottom: 25px;
          color: #ddd;
        }
        .login-remember {
          display: flex;
          align-items: center;
        }
        .login-remember input {
          margin-right: 8px;
          accent-color: var(--primary);
        }
        .login-options a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-options a:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: var(--primary);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(46, 125, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }
        .login-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .login-divider {
          display: flex;
          align-items: center;
          margin: 25px 0;
          color: #bbb;
          font-size: 14px;
        }
        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #444;
        }
        .login-divider span {
          padding: 0 15px;
        }
        .social-login {
          display: flex;
          justify-content: center;
          gap: 14px;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid #444;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
        }
        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        .info-box {
          flex: 1;
          background: url('https://images.unsplash.com/photo-1522881193457-37ae97c905bf?auto=format&fit=crop&w=900&q=80') no-repeat center;
          background-size: cover;
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          position: relative;
        }
        .info-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
        }
        .info-content {
          z-index: 2;
          position: relative;
        }
        .info-box h3 {
          font-size: 26px;
          margin-bottom: 18px;
          font-weight: 700;
        }
        .info-box p {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 28px;
          opacity: 0.95;
        }
        .features {
          text-align: left;
          margin: 0 auto;
          max-width: 300px;
        }
        .feature {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .feature .icon {
          background: rgba(255, 255, 255, 0.25);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 16px;
        }
        @media (max-width: 768px) {
          .login-container { flex-direction: column; }
          .info-box { display: none; }
          .login-box { padding: 30px 25px; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <main className="login-body">
        <div className="login-container">
          <div className="login-box">
            <div className="login-logo">
              <School className="icon" />
              <span>AttendSys</span>
            </div>
            
            <h2>Welcome Back, Professor!{'\u{1F60A}'}</h2>
            <p className="login-subtitle">Sign in to access your teacher dashboard</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">User Name</label>
                <input type="text" id="username" placeholder="Enter your username" required disabled={isLoading}/>
                <User className="icon" />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required disabled={isLoading}/>
                <Lock className="icon" />
              </div>
              
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" disabled={isLoading}/> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? 'Logging In...' : 'Login'}
              </button>
            </form>
            
          </div>
          <div className="info-box">
            <div className="info-content">
              <h3>Streamline Your Classroom</h3>
              <p>Manage attendance with our intuitive platform designed specifically for educators.</p>
              
              <div className="features">
                <div className="feature"><CheckCircle className="icon" size={16} /><span>Track student attendance</span></div>
                <div className="feature"><Activity className="icon" size={16}/><span>Analyze the student's behavior</span></div>
                <div className="feature"><FileText className="icon" size={16}/><span>Generate reports</span></div>
                <div className="feature"><Smartphone className="icon" size={16}/><span>Mobile access</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

    