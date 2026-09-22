import React, { useState } from 'react';
import '../styles/global.scss'; // Import SCSS file
import { TextInput } from '../components/inputs';
import { PrimaryButton, TextButton } from '../components/buttons';

const RouteSearch: React.FC = () => {
  const [startPoint, setStartPoint] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');
  const handleStartPoint = (e: any) => {
    e.preventDefault();
    if (e.target.value) {
      setStartPoint(e.target.value);
    }
  };
  const handleEndPoint = (e: any) => {
    e.preventDefault();
    if (e.target.value) {
      setEndPoint(e.target.value);
    }
  };
  const callRouteApi = () => {};
  return (
    <div className="route-search-form">
      <div className="search-form">
        <TextInput
          lable=""
          type="text"
          placeholder="Käytä nykyistä sijaintia"
          val={startPoint}
          eventHandler={handleStartPoint}
          required
        />
        <TextInput
          lable=""
          type="text"
          placeholder="Syötä määränpää"
          val={endPoint}
          eventHandler={handleEndPoint}
          required
        />
        <div className="actions">
          <TextButton onClick={() => null} text={'Cancel'} />
          <PrimaryButton onClick={callRouteApi} text={'Search'} />
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
