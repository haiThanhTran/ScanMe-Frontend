import "../../static/css/styles.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./header";
import Footer from "./footer";
import { ChatWidget } from "./chatWidget"

import { Outlet } from "react-router-dom";
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  return (
    <div className="">
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default HomePage;
