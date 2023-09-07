import { useEffect, useState } from 'react';

//Screen Stacks
import RootStack from './Navigators/RootStack';

export default function App() {
  
  return (
    <RootStack/>
  );
}

  // const [allArt, setAll] = useState([]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // async function fetchData() {
  //   try {
  //     const response = await fetch("http://192.168.1.187:8080/all");
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok.");
  //     }
  //     const data = await response.json();
  //     setAll(data);
  //   } catch (error) {
  //     console.error("Error fetching data here:", error);
  //   }
  // }  
