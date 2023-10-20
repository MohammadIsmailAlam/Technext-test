// // SpaceXDataContext.js

// import React, { createContext, useContext, useEffect, useState } from 'react';

// const SpaceXDataContext = createContext();

// export function SpaceXDataProvider({ children }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const apiUrl = 'https://api.spacexdata.com/v3/launches';
//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         setData(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <SpaceXDataContext.Provider value={{ data, loading }}>
//       {children}
//     </SpaceXDataContext.Provider>
//   );
// }

// export function useSpaceXData() {
//   return useContext(SpaceXDataContext);
// }
export {}