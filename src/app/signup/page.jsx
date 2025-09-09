

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransitionLink from '@/components/PageTransitionLink';
import { School, User, Lock, Mail, CheckCircle, Activity, FileText, Smartphone, Loader2 } from 'lucide-react';
import Head from 'next/head';
import { usePageTransition } from '@/context/PageTransitionContext';

export default function SignupPage() {
  const router = useRouter();
  const { setIsTransitioning } = usePageTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsTransitioning(true); // Start transition before navigation

    if (typeof window !== 'undefined') {
        localStorage.setItem('loggedInUsername', username);
    }

    // Simulate network delay then navigate
    setTimeout(() => {
      // In a real app, you would handle the signup logic here.
      // For this prototype, we'll just redirect to the courses page.
      router.push('/courses');
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Create Account | AttendSys</title>
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
        .signup-body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .signup-container {
          display: flex;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          width: 900px;
          max-width: 95%;
          min-height: 550px;
        }
        .signup-box {
          flex: 1;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          color: #fff;
        }
        .signup-logo {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          color: #fff;
          font-weight: 700;
          font-size: 22px;
        }
        .signup-logo .icon {
          margin-right: 10px;
          font-size: 26px;
        }
        .signup-box h2 {
          margin-bottom: 8px;
          font-weight: 700;
          font-size: 28px;
          color: #fff;
        }
        .signup-subtitle {
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
        .signup-btn {
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
          margin-top: 10px;
        }
        .signup-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }
        .signup-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .login-link {
            margin-top: 25px;
            text-align: center;
            font-size: 14px;
            color: #ddd;
        }
        .login-link a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .login-link a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
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
          .signup-container { flex-direction: column; }
          .info-box { display: none; }
          .signup-box { padding: 30px 25px; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <main className="signup-body">
        <div className="signup-container">
          <div className="signup-box">
            <div className="signup-logo">
              <School className="icon" />
              <span>AttendSys</span>
            </div>
            
            <h2>Create Your Account {'\u{1F4DD}'}</h2>
            <p className="signup-subtitle">Join us and streamline your classroom management.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="fullname">Full Name</label>
                <input 
                    type="text" 
                    id="fullname" 
                    placeholder="e.g., Professor Smith" 
                    required 
                    disabled={isLoading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <User className="icon" />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required disabled={isLoading}/>
                <Mail className="icon" />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a strong password" required disabled={isLoading}/>
                <Lock className="icon" />
              </div>
              
              <button type="submit" className="signup-btn" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="login-link">
              Already have an account? <PageTransitionLink href="/login">Sign In</PageTransitionLink>
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
