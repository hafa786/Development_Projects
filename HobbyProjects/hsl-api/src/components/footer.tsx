import React from 'react';
import '../styles/global.scss'; // Import SCSS file

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} MyApp. All rights reserved with MIT.
      </p>
      <div>
        <a href="/">Privacy Policy</a> | <a href="/">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
