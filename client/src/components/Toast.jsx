import React, { useEffect, useState } from 'react';
import { toast, ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast component
const Toast = ({ type, message, duration = 5000, onClose }) => {
  useEffect(() => {
    const toastId = toast[type](message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: onClose
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, [type, message, duration, onClose]);

  return null;
};

// Enhanced Toast Container with custom styling
export const ToastContainer = () => {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="toast-container"
      toastClassName="toast-item"
      bodyClassName="toast-body"
      progressClassName="toast-progress"
      style={{
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      }}
    />
  );
};

// Toast hook for easy usage
export const useToast = () => {
  const showToast = (type, message, options = {}) => {
    const toastOptions = {
      position: 'top-right',
      autoClose: options.duration || 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    };

    return toast[type](message, toastOptions);
  };

  const success = (message, options = {}) => showToast('success', message, options);
  const error = (message, options = {}) => showToast('error', message, options);
  const warning = (message, options = {}) => showToast('warning', message, options);
  const info = (message, options = {}) => showToast('info', message, options);
  const dismiss = (toastId) => toast.dismiss(toastId);
  const dismissAll = () => toast.dismiss();

  return {
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll
  };
};

// Predefined toast messages
export const ToastMessages = {
  // Success messages
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FORM_SUBMITTED: 'Form submitted successfully!',
  MATCH_FOUND: 'New match found!',
  
  // Error messages
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  REGISTRATION_ERROR: 'Registration failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please fill in all required fields.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Warning messages
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  
  // Info messages
  LOADING: 'Loading...',
  PROCESSING: 'Processing your request...',
  SAVING: 'Saving changes...'
};

export default Toast;
