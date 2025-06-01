"use client"

import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { useNavigate } from "react-router-dom"

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  font-family: Arial, sans-serif;
`

const FoodSticker = styled.div`
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: ${bounce} ${props => 3 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${props => Math.random() * 5}s;
  pointer-events: none;
  z-index: 0;
`

const Section = styled.section`
  position: relative;
  padding: 5rem 1rem;
  overflow: hidden;
  ${props => props.hero && `
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #fef2f2, #ffffff, #fff7ed);
  `}
  ${props => props.gray && `
    background: #f9fafb;
  `}
  ${props => props.cta && `
    background: linear-gradient(to right, #ef4444, #f97316);
  `}
  ${props => props.footer && `
    background: #111827;
    color: #ffffff;
  `}
`

const InnerContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 10;
`

const HeroGrid = styled.div`
  display: grid;
  gap: 3rem;
  align-items: center;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`

const HeroText = styled.div`
  text-align: center;
  @media (min-width: 1024px) {
    text-align: left;
  }
`



const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #dc2626, #f97316);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`

const Paragraph = styled.p`
  font-size: 1.25rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.75;
  animation: ${fadeInUp} 1s ease-out 0.4s both;
  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
  span {
    color: #ef4444;
    font-weight: 600;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const Button = styled.button`
  background: ${props => props.primary ? 'linear-gradient(to right, #ef4444, #dc2626)' : 'transparent'};
  color: ${props => props.primary ? '#ffffff' : '#ef4444'};
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: ${props => props.primary ? 'none' : '2px solid #ef4444'};
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background: ${props => props.primary ? 'linear-gradient(to right, #f97316, #dc2626)' : '#fee2e2'};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  animation: ${fadeInUp} 1s ease-out 0.8s both;
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StatItem = styled.div`
  text-align: center;
`

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  color: #ef4444;
  margin-bottom: 0.5rem;
`

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`

const HeroImageContainer = styled.div`
  position: relative;
`

const HeroImage = styled.img`
  max-width: 20rem;
  width: 100%;
  margin: 0 auto;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (min-width: 1024px) {
    max-width: 28rem;
  }
`

const FloatingCircle = styled.div`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.color};
  border-radius: 50%;
  opacity: 0.2;
  animation: ${pulse} 2s ease-in-out infinite;
`

const Subtitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease-out;
  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
  span {
    color: #ef4444;
  }
`

const FeatureGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const FeatureCard = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`

const FeatureIcon = styled.div`
  color: #ef4444;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  ${FeatureCard}:hover & {
    transform: scale(1.1);
  }
`

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
`

const HowItWorksGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const HowItWorksCard = styled.div`
  text-align: center;
`

const HowItWorksImageContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`

const HowItWorksImage = styled.img`
  width: 100%;
  max-width: 18rem;
  margin: 0 auto;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  ${HowItWorksCard}:hover & {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`

const StepBadge = styled.div`
  position: absolute;
  top: -1rem;
  left: -1rem;
  width: 3rem;
  height: 3rem;
  background: #ef4444;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
`

const HowItWorksTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
`

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`

const PartnerCard = styled.div`
  background: #ffffff;
  height: 120px; /* cố định chiều cao khung */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`


const PartnerLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* hoặc 'cover' nếu muốn ảnh lấp đầy */
  display: block;
`

const LinkButton = styled.button`
  color: #ef4444;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 3rem auto 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #dc2626;
  }
`

const TestimonialGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const TestimonialCard = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const TestimonialQuote = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
  font-style: italic;
`

const TestimonialProfile = styled.div`
  display: flex;
  align-items: center;
`

const TestimonialAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
`

const TestimonialName = styled.div`
  font-weight: 600;
  color: #111827;
`

const TestimonialRole = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`

const CTAText = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease-out;
  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`

const CTAParagraph = styled.p`
  font-size: 1.25rem;
  color: #fee2e2;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`

const CTANote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fee2e2;
  font-size: 1rem;
`

const MainContent = () => {
  const [buyButtonHovered, setBuyButtonHovered] = useState(false)
  const [contactButtonHovered, setContactButtonHovered] = useState(false)

  const features = [
    { icon: "🎁", title: "Ưu đãi độc quyền", description: "Nhận voucher giảm giá lên đến 50% từ hàng trăm thương hiệu uy tín." },
    { icon: "⚡", title: "Đặt hàng siêu tốc", description: "Đặt đồ ăn uống chỉ trong 3 giây. Không cần đi mua trực tiếp." },
    { icon: "👥", title: "Cộng đồng 1K+", description: "Tham gia cộng đồng chi tiêu thông minh, chia sẻ deal hot mỗi ngày." },
    { icon: "❤️", title: "Tích điểm thưởng", description: "Mỗi lần mua sắm đều được tích điểm, đổi quà hấp dẫn." },
  ]

  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Sinh viên FPT",
      content: "ScanMe giúp mình tiết kiệm được rất nhiều tiền ăn uống. Voucher luôn có sẵn!",
      avatar: "/nu1.png?height=60&width=60",
      rating: 5,
    },
    {
      name: "Trần Văn Nam",
      role: "Sinh viên FPT",
      content: "Website rất tiện lợi, đặt hàng nhanh chóng. Không phải lo đi tìm quán ăn nữa.",
      avatar: "/nam.png?height=60&width=60",
      rating: 5,
    },
    {
      name: "Lê Thị Hoa",
      role: "Sinh viên VNU",
      content: "Ưu đãi thực sự hấp dẫn, đặc biệt là combo sinh viên. Recommend cho bạn bè!",
      avatar: "/nu2.png?height=60&width=60",
      rating: 5,
    },
  ]

  const partners = [
    { name: "Lotte Mart", logo: "/b.jpg?height=60&width=120" },
    { name: "Grab Food", logo: "/g.jpg?height=60&width=120" },
    { name: "Guardian", logo: "/gu.jpg?height=60&width=120" },
    { name: "Circle K", logo: "/k.jpg?height=60&width=120" },
    { name: "Highlands Coffee", logo: "/lot.jpg?height=60&width=120" },
    { name: "KFC", logo: "/m.jpg?height=60&width=120" },
  ]

  const stats = [
    { number: "1,000+", label: "Người tin dùng", icon: "👥" },
    { number: "100+", label: "Voucher mỗi tháng", icon: "🎁" },
    { number: "4.9/5", label: "Đánh giá từ người dùng", icon: "⭐" },
  ]

  const navigate = useNavigate();

  return (
    <Container>
      {/* Floating Food Stickers */}
      {[...Array(30)].map((_, i) => (
        <FoodSticker
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {["🍕", "🍔", "🍟", "☕", "🧃", "🍰", "🥪", "🌮", "🍜", "🍱"][Math.floor(Math.random() * 10)]}
        </FoodSticker>
      ))}

      {/* Hero Section */}
      <Section hero>
        <InnerContainer>
          <HeroGrid>
            <HeroText>

              <Title>ScanMe</Title>
              <Paragraph>
                Giải pháp thông minh dành cho mọi người.
                <div></div>
                <span> Nhận - Mua - Tiết kiệm</span> chỉ trong 3 giây!
              </Paragraph>
              <ButtonGroup>
                <Button
                  primary
                  onMouseEnter={() => setBuyButtonHovered(true)}
                  onMouseLeave={() => setBuyButtonHovered(false)}
                  onClick={() => navigate("/products")}
                >
                  Mua hàng ngay
                </Button>
                <Button
                  onMouseEnter={() => setContactButtonHovered(true)}
                  onMouseLeave={() => setContactButtonHovered(false)}
                  onClick={() => navigate("/faq")}
                >
                  Tìm hiểu thêm
                </Button>
              </ButtonGroup>
              <StatsGrid>
                {stats.map((stat, index) => (
                  <StatItem key={index}>
                    <StatIcon>{stat.icon}</StatIcon>
                    <StatNumber>{stat.number}</StatNumber>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </StatsGrid>
            </HeroText>
            <HeroImageContainer>
              <HeroImage src="/logoreal.svg?height=600&width=400" alt="ScanMe App Interface" />
              <FloatingCircle size="5rem" color="linear-gradient(to right, #f87171, #f472b6)" style={{ top: '-2.5rem', left: '-2.5rem' }} />
              <FloatingCircle size="8rem" color="linear-gradient(to right, #fb923c, #f87171)" style={{ bottom: '-2.5rem', right: '-2.5rem' }} />
            </HeroImageContainer>
          </HeroGrid>
        </InnerContainer>
      </Section>

      {/* Features Section */}
      <Section gray>
        <InnerContainer>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Subtitle>
              Tại sao chọn <span>ScanMe</span>?
            </Subtitle>
            <Paragraph style={{ maxWidth: '48rem', margin: '0 auto' }}>
              Chúng tôi hiểu nhu cầu của sinh viên và tạo ra giải pháp hoàn hảo
            </Paragraph>
          </div>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </InnerContainer>
      </Section>

      {/* How It Works */}
      <Section>
        <InnerContainer>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Subtitle>Cách thức hoạt động <span>ScanMe</span></Subtitle>
          </div>
          <HowItWorksGrid>
            {[
              {
                step: "01",
                title: "Chọn đồ ăn",
                description: "Vào website ScanMe. Đăng ký tài khoản miễn phí.",
                image: "/chonmon.png?height=300&width=300",
              },
              {
                step: "02",
                title: "Áp Voucher",
                description: "Tại website, chỉ cần áp mã trực tiếp vào món hàng bạn muốn mua.",
                image: "/av.png?height=300&width=300",
              },
              {
                step: "03",
                title: "Hoàn tất đặt hàng",
                description: "Sau khi hoàn tất đặt hàng, bạn chỉ cần đợi đồ ăn còn lại có ScanMe lo.",
                image: "/cl.png?height=300&width=300",
              },
            ].map((item, index) => (
              <HowItWorksCard key={index}>
                <HowItWorksImageContainer>
                  <HowItWorksImage src={item.image} alt={item.title} />
                  <StepBadge>{item.step}</StepBadge>
                </HowItWorksImageContainer>
                <HowItWorksTitle>{item.title}</HowItWorksTitle>
                <Paragraph>{item.description}</Paragraph>
              </HowItWorksCard>
            ))}
          </HowItWorksGrid>
        </InnerContainer>
      </Section>

      {/* Partners Section */}
      <Section gray>
        <InnerContainer>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Subtitle>Đối tác của <span>ScanMe</span></Subtitle>
            <Paragraph>
              Các thương hiệu hàng đầu đã tin tưởng và hợp tác cùng ScanMe
            </Paragraph>          </div>
          <PartnersGrid>
            {partners.map((partner, index) => (
              <PartnerCard key={index}>
                <PartnerLogo src={partner.logo} alt={partner.name} />
              </PartnerCard>
            ))}
          </PartnersGrid>
        </InnerContainer>
      </Section>

      {/* Testimonials */}
      <Section>
        <InnerContainer>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Subtitle>Mọi người nói gì về <span>ScanMe</span>?</Subtitle>
            <Paragraph>Nhiều sinh viên đã trải nghiệm và yêu thích ScanMe</Paragraph>
          </div>
          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <StarContainer>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#facc15', fontSize: '1.25rem' }}>⭐</span>
                  ))}
                </StarContainer>
                <TestimonialQuote>"{testimonial.content}"</TestimonialQuote>
                <TestimonialProfile>
                  <TestimonialAvatar src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <TestimonialName>{testimonial.name}</TestimonialName>
                    <TestimonialRole>{testimonial.role}</TestimonialRole>
                  </div>
                </TestimonialProfile>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </InnerContainer>
      </Section>

      {/* CTA Section */}
      <Section gray style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <InnerContainer>
          <CTAText style={{ color: 'black' }}>Sẵn sàng tiết kiệm hàng triệu đồng?</CTAText>
          <CTAParagraph style={{ color: 'black' }}>
            Nhận voucher 50K miễn phí cho người mới!
          </CTAParagraph>
          <div style={{ display: "flex", justifyContent: 'center', gap: '1rem' }}>
            <Button
              primary
              onMouseEnter={() => setBuyButtonHovered(true)}
              onMouseLeave={() => setBuyButtonHovered(false)}
              onClick={() => navigate("/products")}
            >
              Mua hàng ngay
            </Button>
          </div>
          <CTANote style={{ marginTop: '1.5rem', color: "black" }}>
            Miễn phí sử dụng • Không phí ẩn • Hỗ trợ 24/7
          </CTANote>
        </InnerContainer>
      </Section>
    </Container>
  )
}

export default MainContent