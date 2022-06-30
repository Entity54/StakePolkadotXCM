/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect } from "react";
/// Scroll 
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";


class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {
  }
  render() {
    return (
		<div className="mm-wrapper">
			<ul className="metismenu" ref={(el) => (this.el = el)}>
				{this.props.children}
			</ul>
		</div>
    );
  }
}

const SideBar = () => {

  const {
    iconHover,
  } = useContext(ThemeContext);

  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);
	
  }, []);
  
  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

 
   let charts = [
      "chart-rechart",
      "chart-flot",
      "chart-chartjs",
      "chart-chartist",
      "chart-sparkline",
      "chart-apexchart",
    ];
 
  return (
    <div
      className={`deznav ${iconHover}  `}
    >
      <PerfectScrollbar className="deznav-scroll">
        <MM className="metismenu" id="menu">
          <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/xcm"><i className="flaticon-025-dashboard"></i> <span className="nav-text">XCM</span></Link>
          </li>
        </MM>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
