import React from 'react';
import '../styles/global.scss'; // Import SCSS file
import { TextInput } from '../components/inputs';
import { PrimaryButton, TextButton } from '../components/buttons';

const RouteSearch: React.FC = () => {
  return (
    <div className="route-search-form">
      <div className="search-form">
        <TextInput
          lable=""
          type="text"
          placeholder="Käytä nykyistä sijaintia"
          required
        />
        <TextInput
          lable=""
          type="text"
          placeholder="Syötä määränpää"
          required
        />
        <div className="actions">
          <TextButton onClick={() => null} text={'Cancel'} />
          <PrimaryButton onClick={() => null} text={'Käytä'} />
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="home">
      <RouteSearch />
    </div>
  );
};

export default Home;
