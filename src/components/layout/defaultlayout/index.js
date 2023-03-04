import styles from "./defaultLayout.module.scss";
import Header from "../components/Header";
import Sliderbar from "../components/Sliderbar";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

function DefaultLayout({ children }) {
  const [IsTOP, setIsTOP] = useState(false);
  useEffect(() => {
    function HanderlerScrolltop() {
      const Scolltop = document.documentElement.scrollTop;
      setIsTOP(Scolltop > 200);
    }

    window.addEventListener("scroll", HanderlerScrolltop);

    return () => {
      window.removeEventListener("scroll", HanderlerScrolltop);
    };
  }, []);

  function HandlerClikme () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  const style = { display: IsTOP ? "block" : "none" };
  return (
    <div className={styles.wrapper}>
      <div className={styles.Header}>
        <Header />
        <Sliderbar />
      </div>
      <div  className={styles.content}>
        {children}
      </div>
      <Footer />

      <div onClick={HandlerClikme} style={style} className={styles.Scolltop}>
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
}

export default DefaultLayout;
