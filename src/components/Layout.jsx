import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const Loading = styled.div`
  font-family: PT Sans;
  font-size: 20px;
  text-align: center;
`;

const Layout = ({ children }) => {
  const [intercom, setIntercom] = useState(false);

  useEffect(() => {
    if (typeof window.Intercom === 'undefined') {
      document.getElementById('intercom').addEventListener('load', () => {
        setTimeout(() => {
          setIntercom(true);
        }, 500);
      });
    } else {
      setTimeout(() => {
        setIntercom(true);
      }, 500);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <script src="../../intercom.js" async id="intercom" />
      </Helmet>
      {intercom === false ? <Loading>Loading...</Loading> : children}
    </div>
  );
};

Layout.defaultProps = {
  children: <></>,
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

export default Layout;
