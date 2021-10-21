import * as React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from './navbar';
const Layout = ({ children, leftSide = null, rightSide = null }) => {
  return (
    <>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@200&display=swap" rel="stylesheet" />
        <style type="text/css">{`
          html,body {
            font-family: 'Kanit', sans-serif;
          }
          `}</style>
      </Helmet>

      <div className="container">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;