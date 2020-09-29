import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Logo from "./partials/Logo";
import { auth } from "../../configs/firebase";

import { useLocation } from "react-router-dom";

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool,
};

const defaultProps = {
  navPosition: "",
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false,
};

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {
  const [isActive, setIsactive] = useState(false);

  const nav = useRef(null);
  const hamburger = useRef(null);

  const location = useLocation();

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("keydown", keyPress);
      document.addEventListener("click", clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add("off-nav-is-active");
    nav.current.style.maxHeight = nav.current.scrollHeight + "px";
    setIsactive(true);
  };

  const closeMenu = () => {
    document.body.classList.remove("off-nav-is-active");
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  };

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  };

  const clickOutside = (e) => {
    if (!nav.current) return;
    if (
      !isActive ||
      nav.current.contains(e.target) ||
      e.target === hamburger.current
    )
      return;
    closeMenu();
  };

  const classes = classNames(
    "site-header",
    bottomOuterDivider && "has-bottom-divider",
    className
  );

  const logout = () => {
    auth.signOut();
    closeMenu();
  };

  return (
    <header {...props} className={classes}>
      <div className="container">
        <div
          className={classNames(
            "site-header-inner",
            bottomDivider && "has-bottom-divider"
          )}
        >
          <Logo />
          {!hideNav && (
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={classNames("header-nav", isActive && "is-active")}
              >
                <div className="header-nav-inner">
                  <ul
                    className={classNames(
                      "list-reset text-xs",
                      navPosition && `header-nav-${navPosition}`
                    )}
                  >
                    <li>
                      <Link to="#0" onClick={closeMenu}>
                        BLOG
                      </Link>
                    </li>
                    <Link to="#0" onClick={closeMenu}>
                      SOBRE
                    </Link>
                    <li></li>
                  </ul>
                  {!hideSignin ? (
                    <ul className="list-reset header-nav-right">
                      <li className="text-xs">
                        <Link to="/entrar" onClick={closeMenu}>
                          ENTRAR
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cadastro"
                          className="button button-primary button-wide-mobile button-sm"
                          onClick={closeMenu}
                        >
                          CADASTRAR-SE
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <ul className="list-reset header-nav-right">
                      <li className="text-xs">
                        <Link to="#" onClick={logout}>
                          SAIR
                        </Link>
                      </li>
                      {location.pathname !== "/user" ? (
                        <li>
                          <Link
                            to="/user"
                            className="button button-primary button-wide-mobile button-sm"
                            onClick={closeMenu}
                          >
                            Acessar o sistema
                          </Link>
                        </li>
                      ) : (
                        <li>
                          <Link
                            to="/questionario"
                            className="button button-primary button-wide-mobile button-sm"
                            onClick={closeMenu}
                          >
                            Refazer questionário
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
