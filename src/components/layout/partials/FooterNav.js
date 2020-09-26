import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

const FooterNav = ({ className, ...props }) => {
  const classes = classNames("footer-nav", className);

  return (
    <nav {...props} className={classes}>
      <ul className="list-reset">
        <li>
          <a target="blank" href="https://www.lafipe.ufscar.br/pt-br/lafipe-1">
            LAFIPE
          </a>
        </li>
        <li>
          <a target="blank" href="https://fapesp.br/">
            FAPESP
          </a>
        </li>
        <li>
          <a target="blank" href="https://www2.ufscar.br/">
            UFSCAR
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default FooterNav;
