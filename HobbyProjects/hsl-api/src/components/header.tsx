import header from '../styles/header.module.scss';
import logo from '../assets/hsl_logo.png';

const Header: React.FC = () => {
  return (
    <div className={header.header}>
      <div className={header.topbar}>
        <div className={header.leftTopBar}>
          <div className={`${header.topBarItem} ${header.active}`}>
            Henkilöasiakkaalle
          </div>
          <div className={header.topBarItem}> Yrityksille</div>
        </div>
        <div className={header.rightTopBar}>
          <div className={`${header.topBarItem} ${header.active}`}>English</div>
          <div className={header.topBarItem}>På svenska</div>
          <div className={header.topBarItem}>Suomeksi</div>
        </div>
      </div>
      <div className={header.menu}>
        <img className={header.logo} src={logo} alt="logo" />
        <div className={header.mainMenu}>
          <div className={header.menuItem}>Liput ja hinnat</div>
          <div className={header.menuItem}>Matkustaminen</div>
          <div className={header.menuItem}>Asiakaspalvelu</div>
          <div className={header.menuItem}>HSL</div>
        </div>
        <div className={header.additionalMenu}>
          <div className={header.menuItem}>Kirjaudu</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
