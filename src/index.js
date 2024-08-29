import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import SideNav from './SideNav';
import QuizMenu from './QuizMenu';
import QuestionPage from './QuestionPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>Quiz Page</title>
        <link rel="icon" href="/canvas.ico" />
      </Helmet>

      <Router>
        <div className="main-container">
        {/* side nav made to overarch all */}
          <SideNav />
          <Routes>
            <Route path="/" element={<QuizMenu />} />
            {/* has /:id to use it as a parameter */}
            <Route path="/question/:id" element={<QuestionPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);
