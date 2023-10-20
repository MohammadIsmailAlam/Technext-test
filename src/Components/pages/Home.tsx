import React from 'react';
import LaunchList from './../LaunchList';
import Header from '../Header';
import Footer from '../Footer';
function Home() {

  return (
    <div className="home">
        <Header/>
        <LaunchList />
        <Footer/>
    </div>
  );
}

export default Home;