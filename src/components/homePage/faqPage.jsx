"use client"

import { useState } from "react"
import { Layout, Input, Button, Card, Collapse, Breadcrumb } from "antd"
import { SearchOutlined, RightOutlined } from "@ant-design/icons"
import Header from "./header"

const { Content } = Layout
const { Panel } = Collapse

const FAQPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null)

    // Breadcrumb items
    const breadcrumbItems = [
        {
            title: (
                <span
                    style={{
                        backgroundColor: "#e61e43",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                    }}
                >
                    Trang chủ
                </span>
            ),
            href: "/"
        },
        {
            title: (
                <span
                    style={{
                        backgroundColor: "#e61e43",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                    }}
                >
                    Trung tâm hỗ trợ
                </span>
            ),
            href: "/faq"
        },
    ]

    // FAQ categories
    const faqCategories = [
        { title: "Tài khoản ScanMe", icon: "👤" },
        { title: "Đặt hàng ScanMe", icon: "🛒" },
        { title: "Thanh toán ScanMe", icon: "💳" },
        { title: "Liên hệ ScanMe", icon: "📞" },
    ]

    // FAQ questions with completed answers
    const faqQuestions = [
        {
            key: "1",
            question: "ScanMe là gì?",
            answer: "ScanMe là nền tảng giúp người dùng tìm và sử dụng các voucher từ cửa hàng một cách dễ dàng, nhanh chóng.",
            category: "Tài khoản ScanMe",
            link: "Xem thêm"
        },
        {
            key: "2",
            question: "Làm thế nào để tạo tài khoản ScanMe?",
            answer: "Bạn có thể đăng ký bằng email, số điện thoại hoặc đăng nhập nhanh qua Google/Facebook trên trang chính.",
            category: "Tài khoản ScanMe",
            link: "Xem thêm"
        },
        {
            key: "3",
            question: "Tôi quên mật khẩu ScanMe thì làm sao?",
            answer: "Bạn chọn 'Quên mật khẩu' và làm theo hướng dẫn để đặt lại mật khẩu qua email hoặc số điện thoại.",
            category: "Tài khoản ScanMe",
            link: "Xem thêm"
        },
        {
            key: "4",
            question: "ScanMe có mất phí sử dụng không?",
            answer: "Người dùng cá nhân được sử dụng miễn phí. Đối tác có thể chọn gói nâng cấp để quảng bá hiệu quả hơn.",
            category: "Tài khoản ScanMe",
            link: "Xem thêm"
        },
        {
            key: "5",
            question: "Làm sao để tìm voucher theo vị trí?",
            answer: "ScanMe sử dụng định vị để hiển thị các ưu đãi gần bạn. Hãy bật GPS để trải nghiệm tính năng này.",
            category: "Đặt hàng ScanMe",
            link: "Xem thêm"
        },
        {
            key: "6",
            question: "Cách sử dụng voucher khi đặt hàng?",
            answer: "Chọn sản phẩm bạn muốn, thêm vào giỏ hàng và áp dụng mã voucher trong bước thanh toán.",
            category: "Đặt hàng ScanMe",
            link: "Xem thêm"
        },
        {
            key: "7",
            question: "Tôi có thể đặt hàng nhiều voucher cùng lúc không?",
            answer: "Tùy theo cửa hàng, bạn có thể áp dụng nhiều voucher nếu đáp ứng điều kiện khuyến mãi.",
            category: "Đặt hàng ScanMe",
            link: "Xem thêm"
        },
        {
            key: "8",
            question: "ScanMe có giao hàng không?",
            answer: "ScanMe không trực tiếp giao hàng. Đơn hàng sẽ được chuyển cho cửa hàng để xử lý và vận chuyển.",
            category: "Đặt hàng ScanMe",
            link: "Xem thêm"
        },
        {
            key: "9",
            question: "Tôi có thể thanh toán bằng hình thức nào?",
            answer: "Bạn có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản theo thông tin cửa hàng cung cấp.",
            category: "Thanh toán ScanMe",
            link: "Xem thêm"
        },
        {
            key: "10",
            question: "ScanMe có hỗ trợ thanh toán online không?",
            answer: "Hiện tại ScanMe không hỗ trợ thanh toán trực tiếp. Bạn thanh toán theo hướng dẫn từ cửa hàng.",
            category: "Thanh toán ScanMe",
            link: "Xem thêm"
        },
        {
            key: "11",
            question: "Tôi có thể yêu cầu hoàn tiền qua ScanMe không?",
            answer: "Bạn cần liên hệ trực tiếp với cửa hàng để xử lý hoàn tiền nếu có phát sinh.",
            category: "Thanh toán ScanMe",
            link: "Xem thêm"
        },
        {
            key: "12",
            question: "Tôi bị trừ tiền nhưng chưa nhận hàng thì xử lý thế nào?",
            answer: "Vui lòng liên hệ cửa hàng đã bán hàng cho bạn. ScanMe không giữ tiền nên không thể hoàn tiền trực tiếp.",
            category: "Thanh toán ScanMe",
            link: "Xem thêm"
        },
        {
            key: "13",
            question: "Tôi muốn liên hệ hỗ trợ từ ScanMe thì làm sao?",
            answer: "Bạn có thể dùng chức năng chat hỗ trợ trong app hoặc gọi hotline được hiển thị ở trang chủ.",
            category: "Liên hệ ScanMe",
            link: "Xem thêm"
        },
        {
            key: "14",
            question: "Làm sao để phản hồi đánh giá cửa hàng?",
            answer: "Sau khi hoàn tất đơn hàng, bạn có thể để lại đánh giá trên hệ thống để chia sẻ trải nghiệm.",
            category: "Liên hệ ScanMe",
            link: "Xem thêm"
        },
        {
            key: "15",
            question: "Tôi có thể xem lịch sử đơn hàng ở đâu?",
            answer: "Truy cập mục 'Lịch sử đơn hàng' trong hồ sơ cá nhân để theo dõi các đơn đã đặt.",
            category: "Đặt hàng ScanMe",
            link: "Xem thêm"
        },
        {
            key: "16",
            question: "Tôi muốn liên hệ trực tiếp cửa hàng?",
            answer: "Trong chi tiết voucher hoặc đơn hàng sẽ có số điện thoại và địa chỉ cửa hàng để bạn liên hệ trực tiếp.",
            category: "Liên hệ ScanMe",
            link: "Xem thêm"
        },
    ]

    // Filter FAQs based on search value and selected category
    const filteredFAQs = faqQuestions.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchValue.toLowerCase())
        const matchesCategory = selectedCategory ? faq.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    // Split filtered FAQs into two columns
    const leftColumnFAQs = filteredFAQs.filter((_, index) => index % 2 === 0)
    const rightColumnFAQs = filteredFAQs.filter((_, index) => index % 2 === 1)

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <Header />

            <Content style={{ marginTop: 64, padding: "20px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <div style={{ marginBottom: 20 }}>
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    {/* Search Section */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 30,
                            gap: 10,
                        }}
                    >
                        <Input
                            placeholder="Tìm kiếm câu hỏi"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{
                                maxWidth: 600,
                                height: 45,
                                borderRadius: "8px 0 0 8px",
                                border: "1px solid #d9d9d9",
                            }}
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            style={{
                                height: 45,
                                backgroundColor: "#e61e43",
                                borderColor: "#00AA55",
                                borderRadius: "0 8px 8px 0",
                                paddingLeft: 20,
                                paddingRight: 20,
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    {/* FAQ Categories */}
                    <div style={{ marginBottom: 40 }}>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 20,
                                color: "#333",
                            }}
                        >
                            Danh mục câu hỏi
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: 15,
                            }}
                        >
                            {faqCategories.map((category, index) => (
                                <Card
                                    key={index}
                                    hoverable
                                    style={{
                                        borderRadius: 8,
                                        border: "1px solid #f0f0f0",
                                        cursor: "pointer",
                                        backgroundColor: selectedCategory === category.title ? "#e61e43" : "white",
                                    }}
                                    bodyStyle={{
                                        padding: "16px 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                    onClick={() => setSelectedCategory(category.title === selectedCategory ? null : category.title)}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{ fontSize: 18 }}>{category.icon}</span>
                                        <span style={{
                                            fontSize: 14,
                                            color: selectedCategory === category.title ? "white" : "#333"
                                        }}>
                                            {category.title}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Questions */}
                    <div>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 20,
                                color: "#333",
                            }}
                        >
                            Câu hỏi thường gặp
                        </h2>

                        {filteredFAQs.length === 0 ? (
                            <p style={{ color: "#666", textAlign: "center" }}>
                                Không tìm thấy câu hỏi phù hợp
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                                    gap: 20,
                                }}
                            >
                                {/* Left Column */}
                                <div>
                                    {leftColumnFAQs.map((faq) => (
                                        <Card
                                            key={faq.key}
                                            style={{
                                                marginBottom: 15,
                                                borderRadius: 8,
                                                border: "1px solid #f0f0f0",
                                            }}
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            <Collapse ghost expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}>
                                                <Panel
                                                    header={
                                                        <span
                                                            style={{
                                                                fontSize: 14,
                                                                color: "#333",
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {faq.question}
                                                        </span>
                                                    }
                                                    key={faq.key}
                                                    style={{
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "0 24px 16px 24px",
                                                            color: "#666",
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        <p>{faq.answer}</p>
                                                        {faq.link && (
                                                            <a
                                                                href="#"
                                                                style={{
                                                                    color: "#1890ff",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                {faq.link}
                                                            </a>
                                                        )}
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        </Card>
                                    ))}
                                </div>

                                {/* Right Column */}
                                <div>
                                    {rightColumnFAQs.map((faq) => (
                                        <Card
                                            key={faq.key}
                                            style={{
                                                marginBottom: 15,
                                                borderRadius: 8,
                                                border: "1px solid #f0f0f0",
                                            }}
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            <Collapse ghost expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}>
                                                <Panel
                                                    header={
                                                        <span
                                                            style={{
                                                                fontSize: 14,
                                                                color: "#333",
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {faq.question}
                                                        </span>
                                                    }
                                                    key={faq.key}
                                                    style={{
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "0 24px 16px 24px",
                                                            color: "#666",
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        <p>{faq.answer}</p>
                                                        {faq.link && (
                                                            <a
                                                                href="#"
                                                                style={{
                                                                    color: "#1890ff",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                {faq.link}
                                                            </a>
                                                        )}
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    )
}
export default FAQPage