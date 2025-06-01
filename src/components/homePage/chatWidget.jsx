"use client"

import { useState } from "react"

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        message: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        message: "",
    })

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            name: "",
            phone: "",
            message: "",
        }

        if (!formData.name.trim()) {
            newErrors.name = "Tên chưa được nhập !"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại chưa được nhập !"
        }

        if (!formData.message.trim()) {
            newErrors.message = "Hãy nhập tin nhắn để chat !"
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some((error) => error !== "")
    }

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Form submitted:", formData)
            alert("Tin nhắn đã được gửi!")
            setIsOpen(false)
            setFormData({
                name: "",
                email: "",
                phone: "",
                birthDate: "",
                message: "",
            })
        }
    }

    const chatWidgetStyles = {
        chatContainer: {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
        },
        chatButton: {
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#e61e43",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            color: "white",
        },
        chatWidget: {
            width: "320px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            animation: "slideInUp 0.3s ease-out",
        },
        header: {
            backgroundColor: "#e61e43",
            color: "white",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        headerTitle: {
            fontSize: "18px",
            fontWeight: "600",
            margin: 0,
        },
        headerSubtitle: {
            fontSize: "14px",
            opacity: 0.9,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        indicator: {
            width: "8px",
            height: "8px",
            backgroundColor: "#00FF00",
            borderRadius: "50%",
        },
        closeButton: {
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "18px",
        },
        content: {
            padding: "16px",
            maxHeight: "400px",
            overflowY: "auto",
        },
        section: {
            marginBottom: "20px",
        },
        sectionTitle: {
            fontSize: "16px",
            fontWeight: "500",
            color: "#111",
            marginBottom: "12px",
        },
        inputGroup: {
            marginBottom: "12px",
        },
        input: {
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box",
        },
        inputError: {
            borderColor: "#ef4444",
        },
        inputFocus: {
            borderColor: "#2563eb",
        },
        textarea: {
            width: "100%",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none",
            minHeight: "80px",
            resize: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
        },
        errorText: {
            color: "#ef4444",
            fontSize: "12px",
            marginTop: "4px",
        },
        submitButton: {
            width: "100%",
            backgroundColor: "#e61e43",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background-color 0.2s ease",
        },
        backdrop: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 9998,
        },
    }

    return (
        <>
            <style>
                {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .chat-button:hover {
            background-color: #e61e43 !important;
            transform: scale(1.1);
          }
          
          .chat-input:focus {
            border-color:rgb(67, 30, 230) !important;
          }
          
          .chat-submit:hover {
            background-color: #e61e43 !important;
          }
          
          .chat-close:hover {
            background-color: rgba(255,255,255,0.1) !important;
          }
        `}
            </style>

            <div style={chatWidgetStyles.chatContainer}>
                {!isOpen && (
                    <button className="chat-button" onClick={() => setIsOpen(true)} style={chatWidgetStyles.chatButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {isOpen && (
                    <div style={chatWidgetStyles.chatWidget}>
                        {/* Header */}
                        <div style={chatWidgetStyles.header}>
                            <div>
                                <h3 style={chatWidgetStyles.headerTitle}>Let's chat</h3>
                                <p style={chatWidgetStyles.headerSubtitle}>
                                    <span style={chatWidgetStyles.indicator}></span>
                                    Sẵn lòng giải đáp mọi thắc mắc
                                </p>
                            </div>
                            <button className="chat-close" onClick={() => setIsOpen(false)} style={chatWidgetStyles.closeButton}>
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div style={chatWidgetStyles.content}>
                            {/* Basic Information */}
                            <div style={chatWidgetStyles.section}>
                                <h4 style={chatWidgetStyles.sectionTitle}>Thông tin cơ bản</h4>

                                <div style={chatWidgetStyles.inputGroup}>
                                    <input
                                        className="chat-input"
                                        type="text"
                                        placeholder="Nhập tên của bạn*"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        style={{
                                            ...chatWidgetStyles.input,
                                            ...(errors.name ? chatWidgetStyles.inputError : {}),
                                        }}
                                    />
                                    {errors.name && <p style={chatWidgetStyles.errorText}>{errors.name}</p>}
                                </div>

                                <div style={chatWidgetStyles.inputGroup}>
                                    <input
                                        className="chat-input"
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        style={chatWidgetStyles.input}
                                    />
                                </div>

                                <div style={chatWidgetStyles.inputGroup}>
                                    <input
                                        className="chat-input"
                                        type="tel"
                                        placeholder="Nhập số điện thoại của bạn *"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        style={{
                                            ...chatWidgetStyles.input,
                                            ...(errors.phone ? chatWidgetStyles.inputError : {}),
                                        }}
                                    />
                                    {errors.phone && <p style={chatWidgetStyles.errorText}>{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div style={chatWidgetStyles.section}>


                                <div style={chatWidgetStyles.inputGroup}>
                                    <textarea
                                        className="chat-input"
                                        placeholder="Tin nhắn"
                                        value={formData.message}
                                        onChange={(e) => handleInputChange("message", e.target.value)}
                                        style={{
                                            ...chatWidgetStyles.textarea,
                                            ...(errors.message ? chatWidgetStyles.inputError : {}),
                                        }}
                                    />
                                    {errors.message && <p style={chatWidgetStyles.errorText}>{errors.message}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="chat-submit" onClick={handleSubmit} style={chatWidgetStyles.submitButton}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                BẮT ĐẦU TRÒ CHUYỆN
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for mobile */}
            {isOpen && window.innerWidth < 768 && <div style={chatWidgetStyles.backdrop} onClick={() => setIsOpen(false)} />}
        </>
    )
}
