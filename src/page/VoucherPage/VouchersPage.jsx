import React, { useState, useEffect, useRef } from "react";
import FilterSidebar from "../../components/productComponent/FilterSidebar";
import VoucherList from "../../components/voucherComponent/VoucherList";
import fetchUtils from "../../utils/fetchUtils";
import styled, { keyframes } from "styled-components";

const Section = styled.section`
  position: relative;
  overflow: hidden;
  ${(props) =>
    props.hero &&
    `
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    @media (min-width: 1024px) {
      min-height: 65vh;
    }
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image: url('https://www.betterup.com/hubfs/Happy-businesswoman-working-at-her-office-how-to-be-content-with-life.jpg');
      background-size: cover;
      background-position: center;
      filter: blur(4px) brightness(0.5);
      opacity: 0.85;
    }
  `}
  ${(props) =>
    props.gray &&
    `
    background: #f9fafb;
  `}
  ${(props) =>
    props.cta &&
    `
    background: linear-gradient(to right, #ef4444, #f97316);
  `}
  ${(props) =>
    props.footer &&
    `
    background: #111827;
    color: #ffffff;
  `}
`;
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CTAParagraph = styled.p`
  font-size: 1.25rem;
  color: #fee2e2;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`;

const CTANote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fee2e2;
  font-size: 1rem;
`;

const CTAText = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease-out;
  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

const InnerContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 10;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const Button = styled.button`
  background: ${(props) =>
    props.primary
      ? "linear-gradient(to right, #ef4444, #dc2626)"
      : "transparent"};
  color: ${(props) => (props.primary ? "#ffffff" : "#ef4444")};
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: ${(props) => (props.primary ? "none" : "2px solid #ef4444")};
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
    background: ${(props) =>
      props.primary
        ? "linear-gradient(to right, #f97316, #dc2626)"
        : "#fee2e2"};
  }
`;

const VouchersPage = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  // Sticky FilterSidebar
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [storeRes, cateRes] = await Promise.all([
        fetchUtils.get("/stores", false),
        fetchUtils.get("/categories", false),
      ]);
      setStores(storeRes.stores || storeRes);
      setCategories(cateRes.categories || cateRes);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Section
        hero
        style={{
          textAlign: "center",
          padding: "5.5rem 1rem 4rem 1rem",
          position: "relative",
        }}
      >
        <InnerContainer style={{ position: "relative", zIndex: 2 }}>
          <CTAText
            style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
          >
            Thu Thập Hàng Trăm Voucher
          </CTAText>
          <CTAParagraph
            style={{
              color: "#f3f3f3",
              textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            Nền Tảng Tặng Bạn Voucher Miễn Phí
          </CTAParagraph>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <Button primary onClick={() => navigate("/vouchers")}>
              Khám Phá Ngay
            </Button>
          </div>
          <CTANote
            style={{
              marginTop: "1.5rem",
              color: "#f3f3f3",
              textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            Miễn phí sử dụng • Không phí ẩn • Hỗ trợ 24/7
          </CTANote>
        </InnerContainer>
      </Section>
      <div
        style={{
          display: "flex",
          padding: "72px 32px 32px 32px",
          minHeight: "80vh",
          background: "#f7f7f7",
        }}
      >
        <div
          style={{
            width: 280,
            marginRight: 32,
            alignSelf: "flex-start",
            position: "sticky",
            top: 88,
            zIndex: 10,
            maxHeight: "calc(100vh - 120px)",
          }}
          ref={sidebarRef}
        >
          <FilterSidebar
            selectedStores={selectedStores}
            setSelectedStores={setSelectedStores}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div style={{ flex: 1 }}>
          <VoucherList
            selectedStores={selectedStores}
            selectedCategories={selectedCategories}
          />
        </div>
      </div>
    </div>
  );
};
export default VouchersPage;
