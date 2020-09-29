import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { auth } from "../configs/firebase";

const LayoutDefault = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      setIsAuth(!!user);
    });
    return () => {
      listener();
    };
  }, []);

  return (
    <>
      <Header
        hideSignin={isAuth}
        navPosition="right"
        className="reveal-from-bottom"
      />
      <main className="site-content">{children}</main>
      <Footer />
    </>
  );
};

export default LayoutDefault;
