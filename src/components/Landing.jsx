import React from "react";
import { Link } from "react-router-dom";
import { FaLightbulb, FaChartLine, FaBullhorn, FaCogs } from "react-icons/fa";

const Landing = () => {
  const features = [
    {
      icon: <FaLightbulb className="icon-blue" />,
      title: "Simple & Intuitive",
      desc: "Track your daily habits with ease and clarity.",
    },
    {
      icon: <FaChartLine className="icon-green" />,
      title: "Progress Tracking",
      desc: "See your consistency and growth with monthly reports.",
    },
    {
      icon: <FaBullhorn className="icon-purple" />,
      title: "Motivating Insights",
      desc: "Stay motivated with visual progress and reminders.",
    },
    {
      icon: <FaCogs className="icon-orange" />,
      title: "Customizable",
      desc: "Add habits that matter the most to your lifestyle.",
    },
  ];

  const styles = {
    landingContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)',
    },
    heroSection: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    floatingShapes: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    floatingShape1: {
      position: 'absolute',
      top: '5rem',
      left: '2.5rem',
      width: '18rem',
      height: '18rem',
      backgroundColor: '#c3dafe',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: '0.3',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    floatingShape2: {
      position: 'absolute',
      top: '10rem',
      right: '2.5rem',
      width: '18rem',
      height: '18rem',
      backgroundColor: '#e9d5ff',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: '0.3',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      animationDelay: '1s',
    },
    floatingShape3: {
      position: 'absolute',
      bottom: '-2rem',
      left: '5rem',
      width: '18rem',
      height: '18rem',
      backgroundColor: '#fce7f3',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: '0.3',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      animationDelay: '2s',
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem',
      textAlign: 'center',
      position: 'relative',
      zIndex: '10',
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#111827',
      lineHeight: '1.1',
      marginBottom: '1.5rem',
    },
    heroTitleAccent: {
      display: 'block',
      color: '#2563eb',
    },
    heroDescription: {
      fontSize: '1.25rem',
      color: '#4b5563',
      maxWidth: '48rem',
      margin: '0 auto 2rem auto',
      lineHeight: '1.6',
    },
    heroButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      justifyContent: 'center',
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      border: '1px solid transparent',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1.5rem 2rem',
      textDecoration: 'none',
    },
    btnOutline: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      border: '2px solid #d1d5db',
      backgroundColor: 'transparent',
      color: '#374151',
      padding: '1.5rem 2rem',
      textDecoration: 'none',
    },
    btnWhite: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      border: '1px solid transparent',
      backgroundColor: 'white',
      color: '#2563eb',
      padding: '1.5rem 2rem',
      textDecoration: 'none',
    },
    featuresSection: {
      padding: '5rem 0',
      backgroundColor: 'white',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    featuresTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      color: '#111827',
      marginBottom: '4rem',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    featureCard: {
      textAlign: 'center',
      padding: '2rem',
      borderRadius: '1rem',
      backgroundColor: '#f9fafb',
      transition: 'all 0.3s ease',
    },
    featureIcon: {
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1rem',
    },
    featureDescription: {
      color: '#4b5563',
      lineHeight: '1.6',
    },
    howItWorksSection: {
      padding: '5rem 0',
      background: 'linear-gradient(90deg, #eff6ff 0%, #f3e8ff 100%)',
    },
    howItWorksGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3rem',
      alignItems: 'center',
    },
    howItWorksImage: {
      order: '2',
    },
    howItWorksText: {
      order: '1',
    },
    mockupContainer: {
      position: 'relative',
    },
    mockupCard: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      transform: 'rotate(3deg)',
      transition: 'transform 0.5s ease',
    },
    mockupContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    mockupBar: {
      height: '1rem',
      borderRadius: '0.25rem',
    },
    mockupBar1: { backgroundColor: '#bfdbfe', width: '75%' },
    mockupBar2: { backgroundColor: '#bbf7d0', width: '50%' },
    mockupBar3: { backgroundColor: '#e9d5ff', width: '66%' },
    mockupBar4: { backgroundColor: '#fed7aa', width: '33%' },
    mockupBar5: { backgroundColor: '#fce7f3', width: '50%' },
    mockupDecoration1: {
      position: 'absolute',
      bottom: '-1rem',
      right: '-1rem',
      width: '5rem',
      height: '5rem',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      opacity: '0.2',
    },
    mockupDecoration2: {
      position: 'absolute',
      top: '-1rem',
      left: '-1rem',
      width: '4rem',
      height: '4rem',
      backgroundColor: '#8b5cf6',
      borderRadius: '50%',
      opacity: '0.2',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '1.5rem',
    },
    sectionDescription: {
      fontSize: '1.25rem',
      color: '#4b5563',
      marginBottom: '2rem',
      lineHeight: '1.6',
    },
    stepsTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1.5rem',
    },
    stepsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '2rem',
    },
    stepItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    stepNumber: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '0.875rem',
      color: 'white',
      flexShrink: '0',
    },
    stepNumber1: { backgroundColor: '#3b82f6' },
    stepNumber2: { backgroundColor: '#10b981' },
    stepNumber3: { backgroundColor: '#8b5cf6' },
    stepText: {
      color: '#374151',
      fontSize: '1.125rem',
    },
    ctaSection: {
      padding: '5rem 0',
      background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
    },
    ctaContent: {
      textAlign: 'center',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: 'white',
      marginBottom: '2rem',
    },
    iconBlue: { color: '#3b82f6', width: '2rem', height: '2rem' },
    iconGreen: { color: '#10b981', width: '2rem', height: '2rem' },
    iconPurple: { color: '#8b5cf6', width: '2rem', height: '2rem' },
    iconOrange: { color: '#f59e0b', width: '2rem', height: '2rem' },
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
          
          .btn-primary:hover {
            background-color: #1d4ed8;
          }
          
          .btn-outline:hover {
            border-color: #9ca3af;
          }
          
          .btn-white:hover {
            background-color: #f9fafb;
          }
          
          .feature-card:hover {
            background-color: #f3f4f6;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transform: translateY(-0.25rem);
          }
          
          .mockup-card:hover {
            transform: rotate(0deg);
          }
          
          @media (min-width: 640px) {
            .hero-buttons {
              flex-direction: row;
            }
          }
          
          @media (min-width: 768px) {
            .hero-title {
              font-size: 4.5rem;
            }
            .hero-description {
              font-size: 1.5rem;
            }
            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .features-title,
            .section-title,
            .cta-title {
              font-size: 3rem;
            }
          }
          
          @media (min-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(4, 1fr);
            }
            .how-it-works-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .how-it-works-image {
              order: 1;
            }
            .how-it-works-text {
              order: 2;
            }
          }
        `}
      </style>
      
      <div style={styles.landingContainer}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          {/* Floating shapes */}
          <div style={styles.floatingShapes}>
            <div style={styles.floatingShape1}></div>
            <div style={styles.floatingShape2}></div>
            <div style={styles.floatingShape3}></div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle} className="hero-title">
              Build Better Habits
              <span style={styles.heroTitleAccent}>Every Day</span>
            </h1>
            <p style={styles.heroDescription}>
              Stay consistent, track your growth, and improve your lifestyle with
              our simple, intuitive habit tracker.
            </p>
            <div style={styles.heroButtons} className="hero-buttons">
              <Link to="/dashboard" style={styles.btnPrimary} className="btn-primary">
                Get Started
              </Link>
              <a href="#features" style={styles.btnOutline} className="btn-outline">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={styles.featuresSection}>
          <div style={styles.container}>
            <h2 style={styles.featuresTitle} className="features-title">
              Why Use Our App?
            </h2>
            <div style={styles.featuresGrid} className="features-grid">
              {features.map((f, i) => (
                <div key={i} style={styles.featureCard} className="feature-card">
                  <div style={styles.featureIcon}>
                    <span style={f.title === "Simple & Intuitive" ? styles.iconBlue : 
                                 f.title === "Progress Tracking" ? styles.iconGreen :
                                 f.title === "Motivating Insights" ? styles.iconPurple : 
                                 styles.iconOrange}>
                      {f.icon}
                    </span>
                  </div>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDescription}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={styles.howItWorksSection}>
          <div style={styles.container}>
            <div style={styles.howItWorksGrid} className="how-it-works-grid">
              {/* Image */}
              <div style={styles.howItWorksImage} className="how-it-works-image">
                <div style={styles.mockupContainer}>
                  <div style={styles.mockupCard} className="mockup-card">
                    <div style={styles.mockupContent}>
                      <div style={{...styles.mockupBar, ...styles.mockupBar1}}></div>
                      <div style={{...styles.mockupBar, ...styles.mockupBar2}}></div>
                      <div style={{...styles.mockupBar, ...styles.mockupBar3}}></div>
                      <div style={{...styles.mockupBar, ...styles.mockupBar4}}></div>
                      <div style={{...styles.mockupBar, ...styles.mockupBar5}}></div>
                    </div>
                  </div>
                  <div style={styles.mockupDecoration1}></div>
                  <div style={styles.mockupDecoration2}></div>
                </div>
              </div>
              {/* Text */}
              <div style={styles.howItWorksText} className="how-it-works-text">
                <h2 style={styles.sectionTitle} className="section-title">
                  How It Works
                </h2>
                <p style={styles.sectionDescription}>
                  Easily track, build, and improve your daily habits with our simple
                  and intuitive tracker.
                </p>
                <h3 style={styles.stepsTitle}>
                  Steps to Start:
                </h3>
                <div style={styles.stepsList}>
                  <div style={styles.stepItem}>
                    <div style={{...styles.stepNumber, ...styles.stepNumber1}}>1</div>
                    <p style={styles.stepText}>Choose your habits to track daily.</p>
                  </div>
                  <div style={styles.stepItem}>
                    <div style={{...styles.stepNumber, ...styles.stepNumber2}}>2</div>
                    <p style={styles.stepText}>Mark progress in a simple checklist.</p>
                  </div>
                  <div style={styles.stepItem}>
                    <div style={{...styles.stepNumber, ...styles.stepNumber3}}>3</div>
                    <p style={styles.stepText}>View streaks, charts, and stay motivated.</p>
                  </div>
                </div>
                <Link to="/dashboard" style={styles.btnPrimary} className="btn-primary">
                  Start Tracking Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaContent}>
              <h2 style={styles.ctaTitle} className="cta-title">
                Ready to build better habits?
              </h2>
              <Link to="/dashboard" style={styles.btnWhite} className="btn-white">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
