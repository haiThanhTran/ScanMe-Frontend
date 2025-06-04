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
      background-image: url('https://scontent-lax3-1.xx.fbcdn.net/v/t1.15752-9/491186471_1252332379617310_2036589493500614325_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeF--7jA8HxfvNGtRpdZTfQ0Fvatbco9K1YW9q1tyj0rVuJL-gpXRGUAne3B1H5fEtRfrf46gnDQ6SRPSE-HhUAZ&_nc_ohc=D2x9Fkp1Ti0Q7kNvwHvfXmY&_nc_oc=Adm_xUBlPtr-W0hz5giFzy6St7xb8Sc5DXUaagAZ_dGzbxZAfWMHsdmbr3-sOBLExCs&_nc_zt=23&_nc_ht=scontent-lax3-1.xx&oh=03_Q7cD2gGo0Fdmp5hQkmDO9MsdYOQe9yTmqc5Mdh2zeQrUcnV-sA&oe=6867B7AE');
      background-size: cover;
      background-position: center;
      filter: blur(1px) brightness(0.7);
      opacity: 0.95;
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
          padding: "5.5rem 1rem 4rem 1rem",
          position: "relative",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* Overlay gradient đen mờ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 80%)",
            pointerEvents: "none",
          }}
        />
        <InnerContainer
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              maxWidth: 600,
              textAlign: "left",
              gap: "1.2rem",
            }}
          >
            <CTAText
              style={{
                color: "white",
                textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                textAlign: "left",
                marginBottom: 0,
                lineHeight: 1.1,
              }}
            >
              Thu Thập Hàng Trăm Voucher
            </CTAText>
            <CTAParagraph
              style={{
                color: "#f3f3f3",
                textShadow: "0 2px 8px rgba(0,0,0,0.18)",
                textAlign: "left",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Nền Tảng Tặng Bạn Voucher Miễn Phí
            </CTAParagraph>
            <div
              style={{ display: "flex", gap: "1rem", margin: "1.2rem 0 0 0" }}
            >
              <Button primary onClick={() => navigate("/vouchers")}>
                Khám Phá Ngay
              </Button>
            </div>
            <CTANote
              style={{
                marginTop: "1.2rem",
                color: "#f3f3f3",
                textShadow: "0 2px 8px rgba(0,0,0,0.18)",
                textAlign: "left",
                marginLeft: 0,
              }}
            >
              Miễn phí sử dụng • Không phí ẩn • Hỗ trợ 24/7
            </CTANote>
          </div>
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
