import React from 'react';
import Routing from './Routing';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <Routing />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default App;