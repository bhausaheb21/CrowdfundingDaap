import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Form from '../Components/Form';
import { ToastContainer } from 'react-toastify';

const createcampaign = () => {
  return (
    <div>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      <Form/>
    </div>
  )
}

export default createcampaign;
