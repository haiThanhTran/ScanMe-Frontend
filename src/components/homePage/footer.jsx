import { Layout, Row, Col, Typography, Divider, Space } from 'antd';
import {
    QuestionCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined
} from '@ant-design/icons';
import '../../static/css/styles.css';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

function Footer() {
    return (
        <AntFooter style={{ background: '#f5f5f5', padding: '40px 50px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Logo Section */}
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img
                        src="https://vi.hotels.com/_dms/header/logo.svg?locale=vi_VN&siteid=3213&2&6f9ec7db"
                        alt="Logo"
                        style={{ height: '32px' }}
                    />
                    <Space>
                        <FacebookOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                        <TwitterOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                        <InstagramOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                    </Space>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* Links Section */}
                <Row gutter={[32, 24]}>
                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                            <QuestionCircleOutlined style={{ marginRight: '8px' }} />
                            Hỗ trợ & Câu hỏi thường gặp
                        </Title>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Đặt chỗ của bạn</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Câu hỏi thường gặp</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Liên hệ với chúng tôi</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Nhận xét nơi lưu trú</Link></li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                            <TeamOutlined style={{ marginRight: '8px' }} />
                            Thông tin đơn vị liên kết
                        </Title>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Liên kết với chúng tôi</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Tin tức & báo chí</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Quảng bá cùng chúng tôi</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Nhân viên du lịch</Link></li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                            <FileTextOutlined style={{ marginRight: '8px' }} />
                            Chính sách
                        </Title>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Điều khoản & Điều kiện</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Bảo mật</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Cookie</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Nguyên tắc về nội dung</Link></li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                            <InfoCircleOutlined style={{ marginRight: '8px' }} />
                            Thông tin khác
                        </Title>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Về chúng tôi</Link></li>
                            <li style={{ marginBottom: '8px' }}><Link href="#">Nghề nghiệp</Link></li>
                        </ul>

                        <div style={{ marginTop: '24px' }}>
                            <Title level={5}>Liên hệ</Title>
                            <Space direction="vertical">
                                <Text><EnvironmentOutlined style={{ marginRight: '8px' }} />Hà Nội, Việt Nam</Text>
                                <Text><PhoneOutlined style={{ marginRight: '8px' }} />+84 123 456 789</Text>
                                <Text><MailOutlined style={{ marginRight: '8px' }} />info@example.com</Text>
                            </Space>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '24px 0' }} />

                {/* Copyright Section */}
                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">© {new Date().getFullYear()} Hotels.com. Tất cả các quyền được bảo lưu.</Text>
                </div>
            </div>
        </AntFooter>
    );
}

export default Footer;