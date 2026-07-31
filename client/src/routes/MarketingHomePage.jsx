import React from 'react';
import { Link } from 'react-router-dom';
import './marketing.css';

export default function MarketingHomePage() {
  return (
    <>
      <div className="topbackdrop">
        <img id="backdrop" style={{ width: '100%' }} src="/images/backdrop1.png" alt="" />
        <div className="backdroptitle">
          Maddogg Software <br /> Custom Development
        </div>
        <div className="backdropsubtitle">
          Our aim is to put the power of a software developer into the hands of consumers. Contact
          one of our experts to find out how we can build a solution for your business.
        </div>
        <Link to="/contact">
          <button type="button" className="btnbackdrop btn btn-light">
            Learn More
          </button>
        </Link>
      </div>

      <div id="bg">
        <div className="container">
          <div className="left-pane">
            <div className="top ad">
              <h5>Integrate Web Apps to increase productivity</h5>
              <img
                alt="Web applications for small business owners"
                className="ad-img"
                src="/images/HOME.gif"
              />
            </div>
            <div className="ad">
              <h5>Upgrade your business with a high quality website</h5>
              <img alt="" className="ad-img" src="/images/web.png" />
            </div>
          </div>
          <div className="center">
            <img className="cen ad-img" alt="" src="/images/options.png" />
            <img className="home-img" alt="Maddogg Software" src="/images/MdgLogo.gif" />
            <Link to="/register">
              <button className="cb btn btn-dark">Create Account</button>
            </Link>
          </div>
          <div className="right-pane">
            <div className="top ad">
              <h5>Modernize current websites with the latest technologies</h5>
              <img
                alt="Technology Trends (generative ai, animations)"
                className="ad-img"
                src="/images/tt.gif"
              />
            </div>
            <div className="ad">
              <h5>Update static images with up-to-date animations</h5>
              <img alt="Update animations" className="long ad-img" src="/images/bookanimate.gif" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
