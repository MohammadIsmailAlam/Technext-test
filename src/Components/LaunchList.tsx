import React, { useState, useEffect, useRef } from 'react';
import Felcon1 from './img/Property 1=6.jpg';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

interface SpaceXLaunch {
  flight_number: number;
  mission_name: string;
  launch_date: string;
  launch_success: boolean;
  rocket: { rocket_name: string };
  image_url: string;
}

function LaunchList() {
  const [data, setData] = useState<SpaceXLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 9;
  const currentPageRef = useRef(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const apiUrl = 'https://api.spacexdata.com/v3/launches';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data: SpaceXLaunch[]) => {
        setData(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filteredData = data;

      if (searchTerm) {
        filteredData = filteredData.filter((launch) =>
          launch.mission_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      currentPageRef.current = 1;

      return filteredData;
    };

    if (!loading) {
      setData(filterData());
    }
  }, [searchTerm]);

  const startIndex = (currentPageRef.current - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPageRef.current < totalPages) {
      currentPageRef.current++;
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      currentPageRef.current = pageNumber;
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-right mb-2">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Mission Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" /> {/* Search icon */}
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {currentPageData.map((launch, index) => (
            <div key={launch.flight_number} className="col-12 col-sm-6 col-md-4 col-lg-4 p-3" style={{ textAlign: 'center' }}>
              <img src={Felcon1} alt={launch.mission_name} style={{ marginBottom: '40px' }} />
              <h3>{launch.mission_name}</h3>
              <p>Launch Date: {launch.launch_date}</p>
              <p>Rocket Name: {launch.rocket.rocket_name}</p>
              <div style={{ marginTop: '32px' }}>
                <p>
                  Launch Status: {launch.launch_success ? (
                    <span style={{ background: '#198754', color: 'white', display: 'block', borderRadius: '6px' }}>Success</span>
                  ) : (
                    <span style={{ background: '#DC3545', color: 'white', display: 'block', borderRadius: '6px' }}>Failure</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item">
              <button className="page-link" onClick={() => goToPage(currentPageRef.current - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={`page-item ${currentPageRef.current === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => goToPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button className="page-link" onClick={nextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default LaunchList;
