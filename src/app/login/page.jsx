
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Mail, Lock, CheckCircle, Activity, FileText, Smartphone } from 'lucide-react';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const pass = event.target.password.value;
    if(email === 'teacher@example.com' && pass === '123456') {
        alert('Login Successful ✅');
        router.push('/courses');
      } else {
        alert('Invalid credentials ❌');
      }
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
        }
        .login-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
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
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required />
                <Mail className="icon" />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required />
                <Lock className="icon" />
              </div>
              
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              
              <button type="submit" className="login-btn">Sign In</button>
            </form>
            
            <div className="login-divider"><span>Or continue with</span></div>
            
            <div className="social-login">
              <div className="social-btn google">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              </div>
              <div className="social-btn facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7.01H7.9v-2.9h2.54V9.84c0-2.5 1.5-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7.01c4.78-.75 8.44-4.9 8.44-9.9C22 6.53 17.5 2.04 12 2.04z" /></svg>
              </div>
              <div className="social-btn github">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.53 1.2.18 2.32.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" /></svg>
              </div>
            </div>
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
