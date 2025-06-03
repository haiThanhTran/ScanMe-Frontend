"use client"

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <>
            {/* CSS Styles */}
            <style>{`
        .footer-container {
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fed7d7 100%);
          position: relative;
          overflow: hidden;
          padding: 4rem 1rem 2rem;
        }
        
        .footer-bg-circle-1 {
          position: absolute;
          top: 2rem;
          left: 2rem;
          width: 8rem;
          height: 8rem;
          background: linear-gradient(135deg, rgba(251, 113, 133, 0.3), rgba(244, 114, 182, 0.3));
          border-radius: 50%;
          filter: blur(2rem);
          animation: pulse 2s infinite;
        }
        
        .footer-bg-circle-2 {
          position: absolute;
          top: 8rem;
          right: 5rem;
          width: 6rem;
          height: 6rem;
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.4), rgba(251, 113, 133, 0.4));
          border-radius: 50%;
          filter: blur(1.5rem);
          animation: bounce 1s infinite;
        }
        
        .footer-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-tagline {
          color: #1f2937;
          font-size: 1.125rem;
          margin: 0;
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .footer-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(251, 113, 133, 0.1);
          transition: all 0.3s ease;
        }
        
        .footer-card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .footer-card-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .footer-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        
        .footer-card-title {
          font-weight: bold;
          color: #1f2937;
          font-size: 1.125rem;
          margin: 0;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .contact-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }
        
        .contact-label {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .contact-value {
          color: #374151;
          font-size: 0.875rem;
          margin: 0;
          text-decoration: none;
        }
        
        .contact-value:hover {
          color: #e11d48;
        }
        
        .social-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .social-link {
          padding: 0.75rem;
          border-radius: 0.75rem;
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .social-link:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .social-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .legal-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .legal-link {
          display: block;
          padding: 0.75rem;
          background: linear-gradient(to right, rgba(251, 113, 133, 0.05), rgba(244, 114, 182, 0.05));
          border-radius: 0.75rem;
          color:rgb(0, 0, 0);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .legal-link:hover {
          color: #e11d48;
          background: linear-gradient(to right, rgba(251, 113, 133, 0.1), rgba(244, 114, 182, 0.1));
        }
        
        .scroll-top-btn {
          width: 100%;
          background: linear-gradient(to right, #e11d48, #ec4899);
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .scroll-top-btn:hover {
          background: linear-gradient(to right, #be185d, #db2777);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .footer-bottom {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(251, 113, 133, 0.1);
        }
        
        .footer-copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .footer-copyright span {
          color:rgb(0, 0, 0);
        }
        
        .star-rating {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
        }
        
        .star {
          width: 1rem;
          height: 1rem;
          fill: #fbbf24;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); }
          50% { transform: none; }
        }
        
        @media (max-width: 768px) {
          .footer-container {
            padding: 2rem 1rem 1rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .footer-copyright {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>

            <footer className="footer-container">
                {/* Background Elements */}
                <div className="footer-bg-circle-1"></div>
                <div className="footer-bg-circle-2"></div>

                <div className="footer-content">
                    {/* Main Content */}
                    <div className="footer-grid">
                        {/* Contact Card */}
                        <div className="footer-card">
                            <div className="footer-card-header">
                                <div className="footer-card-icon" style={{ background: "linear-gradient(to right, #e11d48, #ec4899)" }}>
                                    <svg
                                        className="contact-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        style={{ color: "white" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="footer-card-title">Liên hệ ngay</h4>
                            </div>

                            <div>
                                <div className="contact-item" style={{ background: "rgba(251, 113, 133, 0.05)" }}>
                                    <svg
                                        className="contact-icon"
                                        style={{ color: "#e11d48" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="contact-label" style={{ color: "black" }}>Địa chỉ</p>
                                        <p className="contact-value" style={{ color: "black" }}>Thạch Thất, Hà Nội, Việt Nam</p>
                                    </div>
                                </div>

                                <div className="contact-item" style={{ background: "rgba(244, 114, 182, 0.05)" }}>
                                    <svg
                                        className="contact-icon"
                                        style={{ color: "#ec4899" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="contact-label" style={{ color: "black" }}>Hotline</p>
                                        <a href="tel:0999999999" className="contact-value" style={{ color: "black" }}>
                                            0969494570
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-item" style={{ background: "rgba(251, 146, 60, 0.05)" }}>
                                    <svg
                                        className="contact-icon"
                                        style={{ color: "#f97316" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="contact-label" style={{ color: "black" }}>Email</p>
                                        <a href="mailto:scanme.voucher.contact@gmail.com" className="contact-value" style={{ color: "black" }}>
                                            scanme.voucher.contact@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Card */}
                        <div className="footer-card">
                            <div className="footer-card-header">
                                <div className="footer-card-icon" style={{ background: "linear-gradient(to right, #ec4899, #e11d48)" }}>
                                    <svg
                                        className="contact-icon"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        style={{ color: "white" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="footer-card-title">Kết nối với chúng tôi</h4>
                            </div>

                            <div className="social-grid">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61576630656251"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
                                >
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #ec4899, #e11d48)" }}
                                >
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #60a5fa, #3b82f6)" }}
                                >
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #2563eb, #1d4ed8)" }}
                                >
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #ef4444, #dc2626)" }}
                                >
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                                <a
                                    href="mailto:scanme.voucher.contact@gmail.com"
                                    className="social-link"
                                    style={{ background: "linear-gradient(to right, #6b7280, #4b5563)" }}
                                >
                                    <svg className="social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </a>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "0.875rem", color: "black", marginBottom: "0.75rem" }}>
                                    🌟 Theo dõi để nhận ưu đãi đặc biệt
                                </p>
                                <div className="star-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="star" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legal Card */}
                        <div className="footer-card">
                            <div className="footer-card-header">
                                <div className="footer-card-icon" style={{ background: "linear-gradient(to right, #f97316, #e11d48)" }}>
                                    <svg
                                        className="contact-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        style={{ color: "white" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="footer-card-title">Thông tin pháp lý</h4>
                            </div>

                            <div className="legal-links">
                                <a href="#" className="legal-link">
                                    🔒 Chính sách bảo mật
                                </a>
                                <a href="#" className="legal-link">
                                    📋 Điều khoản sử dụng
                                </a>
                                <a href="#" className="legal-link">
                                    🍪 Cookie Policy
                                </a>
                                <a href="#" className="legal-link">
                                    ⚖️ Quyền riêng tư
                                </a>
                                <a href="#" className="legal-link">
                                    🛡️ Bảo mật thông tin
                                </a>
                            </div>

                            <button onClick={scrollToTop} className="scroll-top-btn">
                                <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                Lên đầu trang
                            </button>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            <span>© 2025 ScanMe.</span>
                            <span>Made with</span>
                            <svg
                                style={{ width: "1rem", height: "1rem", color: "#e11d48" }}
                                fill="currentColor"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>in Vietnam.</span>
                            <span>All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
