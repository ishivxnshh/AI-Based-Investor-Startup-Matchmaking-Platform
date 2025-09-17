import { useState, useCallback } from 'react';

const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validators = {
    required: (value) => (value ? null : 'This field is required'),
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Please enter a valid email address';
    },
    minLength: (min) => (value) => 
      value && value.length >= min ? null : `Must be at least ${min} characters`,
    maxLength: (max) => (value) => 
      value && value.length <= max ? null : `Must be no more than ${max} characters`,
    password: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      return null;
    },
    confirmPassword: (password) => (value) => 
      value === password ? null : 'Passwords do not match',
    phone: (value) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return !value || phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Please enter a valid phone number';
    },
    url: (value) => {
      if (!value) return null;
      const urlRegex = /^https?:\/\/.+/;
      return urlRegex.test(value) ? null : 'Please enter a valid URL (starting with http:// or https://)';
    },
    number: (value) => {
      if (!value) return null;
      return !isNaN(value) && !isNaN(parseFloat(value)) ? null : 'Please enter a valid number';
    },
    positiveNumber: (value) => {
      if (!value) return null;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0 ? null : 'Please enter a positive number';
    }
  };

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    for (const rule of rules) {
      let validator, message;
      
      if (typeof rule === 'string') {
        validator = validators[rule];
        message = validator ? validator(value) : null;
      } else if (typeof rule === 'function') {
        message = rule(value);
      } else if (rule.validator) {
        message = rule.validator(value);
      } else if (rule.type && validators[rule.type]) {
        const validatorFn = validators[rule.type];
        message = typeof validatorFn === 'function' 
          ? validatorFn(value) 
          : validatorFn(rule.value)(value);
      }

      if (message) return message;
    }

    return null;
  }, [validationRules]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField]);

  // Set field value programmatically
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Set multiple values
  const setValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && 
    Object.keys(validationRules).every(field => 
      values[field] !== undefined && values[field] !== ''
    );

  // Get field error
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  }, [errors, touched]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    setValues,
    resetForm,
    validateForm,
    validateField,
    getFieldError,
    hasFieldError,
    isFormValid
  };
};

export default useFormValidation;
