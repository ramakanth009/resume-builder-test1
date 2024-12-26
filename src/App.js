// import './App.css';
// import Resumeinput from './Components/Pages/Resumepage/resumeinput';

// function App() {
//   return (
//     <div>
//       <Resumeinput />
//     </div>
//   );
// }

// export default App;
import React from 'react';
// import { scan } from 'react-scan'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/Pages/Resumepage/landingpage.jsx';
import ResumeBuilder from './Components/Pages/Resumepage/resumeinput.jsx';
// import Entrylevel from './Components/Pages/Resumepage/Entrylevel/entrylevel.jsx';


// if (typeof window !== 'undefined') {
//   scan({
//     enabled: true,
//     log: true, 
//     // logs render info to console (default: false)
//   });
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/fresher" element={<Fresher />} />
        <Route path="/entry-level" element={<Entrylevel />} />
        <Route path="/mid-level" element={<Entrylevel />} />
        <Route path="/senior" element={<Entrylevel />} /> */}
        <Route path="/fresher" element={<ResumeBuilder type="fresher" />} />
        <Route path="/entry-level" element={<ResumeBuilder type="entry" />} />
        <Route path="/mid-level" element={<ResumeBuilder type="mid" />} />
        <Route path="/senior" element={<ResumeBuilder type="senior" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;