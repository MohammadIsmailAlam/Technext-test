import React from 'react';
import LaunchList from './../LaunchList';
import Header from '../Header';
function Home() {

  return (
    <div className="home">
        <Header/>
        <LaunchList />
    </div>
  );
}

export default Home;