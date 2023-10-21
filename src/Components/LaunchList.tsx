import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SpaceXLaunch {
  flight_number: number;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean;
  rocket: { rocket_name: string };
  links: {
    mission_patch: string;
  };
}

function LaunchList() {
  const [data, setData] = useState<SpaceXLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [launchDateFilter, setLaunchDateFilter] = useState<string>('');
  const [launchStatusFilter, setLaunchStatusFilter] = useState<string>('');
  const itemsPerPage = 9;
  const currentPageRef = useRef(1);
  const [totalPages, setTotalPages] = useState(1);

  const originalData = useRef<SpaceXLaunch[]>([]);

  useEffect(() => {
    const apiUrl = 'https://api.spacexdata.com/v3/launches';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data: SpaceXLaunch[]) => {
        originalData.current = data;
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
    if (!searching) {
      // If not searching, reset the data to the full dataset
      setData(data);
    }
  }, [searching, data]);

  useEffect(() => {
    // Filter the data based on launch date and launch status whenever the filters change
    let filteredData = data;

    if (launchDateFilter === 'Last Week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      filteredData = filteredData.filter((launch) => {
        const launchDate = new Date(launch.launch_date_utc);
        return launchDate >= lastWeek;
      });
    } else if (launchDateFilter === 'Last Month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filteredData = filteredData.filter((launch) => {
        const launchDate = new Date(launch.launch_date_utc);
        return launchDate >= lastMonth;
      });
    } else if (launchDateFilter === 'Last Year') {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);

      filteredData = filteredData.filter((launch) => {
        const launchDate = new Date(launch.launch_date_utc);
        return launchDate >= lastYear;
      });
    }

    if (launchStatusFilter === 'Failure') {
      filteredData = originalData.current.filter((launch) => !launch.launch_success);
    } else if (launchStatusFilter === 'Success') {
      filteredData = originalData.current.filter((launch) => launch.launch_success);
    }
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    currentPageRef.current = 1;
    setData(filteredData); // Update the data with the filtered results
  }, [launchDateFilter, launchStatusFilter, data]);

  const formatDate = (dateString: string) => {
    if (isNaN(Date.parse(dateString))) {
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const startIndex = (currentPageRef.current - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPageRef.current < totalPages) {
      const nextPageNumber = currentPageRef.current + 1;
      goToPage(nextPageNumber);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      currentPageRef.current = pageNumber;
      window.scrollTo(0, 0); // Scroll to the top of the page when changing pages
    }
  };

  const handleSearch = () => {
    setSearching(true);

    // Filter the original data based on the search term
    const filteredData = originalData.current.filter((launch) =>
      launch.mission_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    currentPageRef.current = 1;
    setData(filteredData);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-2 d-flex flex-column flex-md-row">
        <div className="search-bar col-12 col-md-4 sm-12 d-flex align-items-center" style={{ textAlign: 'left' }}>
          <input
            type="text"
            placeholder="Search.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ background: '#0D6EFD' }} onClick={handleSearch}>
            <FaSearch className="search-icon" />
          </button>
        </div>

        <div className="search-filters col-12 col-md-8 col-sm-12 d-flex flex-column flex-md-row justify-content-md-end">
          <div className="filter-select" style={{ marginRight: '16px' }}>
            <label>By Launch Date:</label>
            <select
              value={launchDateFilter}
              onChange={(e) => setLaunchDateFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Last Week">Last Week</option>
              <option value="Last Month">Last Month</option>
              <option value="Last Year">Last Year</option>
            </select>
          </div>
          <div className="filter-select">
            <label>By Launch Status:</label>
            <select
              value={launchStatusFilter}
              onChange={(e) => setLaunchStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Failure">Failure</option>
              <option value="Success">Success</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {currentPageData.map((launch, index) => (
            <div key={launch.flight_number} className="col-12 col-sm-6 col-md-4 col-lg-4 p-3" style={{ textAlign: 'center' }}>
              <h3>{launch.mission_name}</h3>
              <p>Launch Date: {formatDate(launch.launch_date_utc)}</p>
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
                {"<"}
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
                {">"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default LaunchList;