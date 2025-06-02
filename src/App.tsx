import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-black">Revisory</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-gray-600 transition-colors">Home</Link>
            <Link to="/pricing" className="text-black hover:text-gray-600 transition-colors">Pricing</Link>
            <Link to="/about" className="text-black hover:text-gray-600 transition-colors">About Us</Link>
            <Link to="/contact" className="text-black hover:text-gray-600 transition-colors">Contact</Link>
            <button
              onClick={() => navigate('/register')}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign In
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white"
        >
          <Link to="/" className="block px-4 py-2 text-black hover:bg-gray-100">Home</Link>
          <Link to="/pricing" className="block px-4 py-2 text-black hover:bg-gray-100">Pricing</Link>
          <Link to="/about" className="block px-4 py-2 text-black hover:bg-gray-100">About</Link>
          <Link to="/contact" className="block px-4 py-2 text-black hover:bg-gray-100">Contact</Link>
          <button
            onClick={() => navigate('/register')}
            className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
          >
            Sign In
          </button>
        </motion.div>
      )}
    </nav>
  );
};

// Add validation utilities
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Include at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Include at least one lowercase letter' };
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Include at least one number' };
  if (!/[!@#$%^&*]/.test(password)) return { isValid: false, message: 'Include at least one special character (!@#$%^&*)' };
  return { isValid: true, message: 'Password is strong' };
};

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolBoard: '',
    grade: '',
    subjects: [] as string[],
    phoneNumber: '',
    birthDate: '',
    preferredName: '',
    parentEmail: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Password strength check
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!passwordStrength.isValid) newErrors.password = passwordStrength.message;
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentStep === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }

    if (currentStep === 3) {
      if (!formData.schoolBoard) newErrors.schoolBoard = 'Please select a school board';
      if (!formData.grade) newErrors.grade = 'Please select your grade';
      if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    }

    if (currentStep === 4) {
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    if (step < 4) {
      setIsLoading(true);
      // Simulate network delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      setStep(step + 1);
    } else {
      // Handle final submission
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setIsLoading(false);
    }
  };

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'French',
    'Art',
    'Music',
    'Physical Education',
    'Computer Science'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center mb-2">Create Your Account</h2>
          <p className="text-gray-600 text-center mb-8">Join Revisory to start your learning journey</p>
          
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: i <= step ? 1 : 0.8,
                    opacity: 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      i < step
                        ? 'bg-black border-black text-white'
                        : i === step
                        ? 'border-black bg-white text-black'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {i < step ? '✓' : i}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${i <= step ? 'text-black' : 'text-gray-400'}`}>
                    {i === 1 ? 'Account' : i === 2 ? 'Personal' : i === 3 ? 'Academic' : 'Finish'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Details */}
            {step === 1 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  />
                  {formData.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 text-sm ${passwordStrength.isValid ? 'text-green-500' : 'text-orange-500'}`}
                    >
                      {passwordStrength.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  />
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-black focus:ring-black transition-colors`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-black focus:ring-black transition-colors`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700">
                    Preferred Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-black focus:ring-black transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.birthDate ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                    Parent/Guardian Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="parentEmail"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-black focus:ring-black transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic Information */}
            {step === 3 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="schoolBoard" className="block text-sm font-medium text-gray-700">School Board</label>
                  <select
                    id="schoolBoard"
                    name="schoolBoard"
                    value={formData.schoolBoard}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.schoolBoard ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  >
                    <option value="">Select a school board</option>
                    <option value="OCDSB">Ottawa-Carleton District School Board (OCDSB)</option>
                    <option value="OCSB">Ottawa Catholic School Board (OCSB)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade Level</label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.grade ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-black focus:ring-black transition-colors`}
                    required
                  >
                    <option value="">Select your grade</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects of Interest (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => (
                      <motion.button
                        key={subject}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubjectToggle(subject)}
                        className={`p-3 rounded-lg text-left text-sm transition-all ${
                          formData.subjects.includes(subject)
                            ? 'bg-black text-white'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {subject}
                      </motion.button>
                    ))}
                  </div>
                  {errors.subjects && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.subjects}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Terms and Review */}
            {step === 4 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-black">{`${formData.firstName} ${formData.lastName}`}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-black">{formData.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">School Board</dt>
                      <dd className="text-black">{formData.schoolBoard}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Grade</dt>
                      <dd className="text-black">{formData.grade}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Subjects</dt>
                      <dd className="text-black">{formData.subjects.join(', ')}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreedToTerms"
                        name="agreedToTerms"
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="agreedToTerms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-black underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-black underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  {errors.agreedToTerms && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.agreedToTerms}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`px-8 py-2 bg-black text-white rounded-lg transition-all ${
                  step === 1 ? 'ml-auto' : ''
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : step === 4 ? (
                  'Complete Registration'
                ) : (
                  'Continue'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Add the SignIn component
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Add your authentication logic here
      console.log('Signing in:', formData);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-black focus:ring-black transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-black focus:ring-black transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-black hover:underline">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface SchoolBoard {
  id: string;
  country: string;
  province: string;
  city: string;
  name: string;
  abbreviation: string;
}

interface CoursesByGrade {
  [key: number]: string[];
}

const SchoolBoards = () => {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<SchoolBoard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const schoolBoards: SchoolBoard[] = [
    {
      id: 'ocdsb',
      country: 'Canada',
      province: 'Ontario',
      city: 'Ottawa',
      name: 'Ottawa-Carleton District School Board',
      abbreviation: 'OCDSB',
    },
    {
      id: 'ocsb',
      country: 'Canada',
      province: 'Ontario',
      city: 'Ottawa',
      name: 'Ottawa Catholic School Board',
      abbreviation: 'OCSB',
    }
  ];

  const grades = [9, 10, 11, 12];

  const courses: CoursesByGrade = {
    9: ['Mathematics', 'Science', 'English', 'French', 'Geography'],
    10: ['Mathematics', 'Science', 'English', 'French', 'History'],
    11: ['Functions', 'Biology', 'Chemistry', 'Physics', 'English', 'French'],
    12: ['Advanced Functions', 'Calculus & Vectors', 'Biology', 'Chemistry', 'Physics', 'English']
  };

  const handleBoardClick = (board: SchoolBoard) => {
    setSelectedBoard(board);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">School Boards</h2>
          <p className="text-xl text-gray-600">Select your school board to get started</p>
        </motion.div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for your school board..."
            className="w-full max-w-2xl mx-auto block px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {schoolBoards
            .filter(board => 
              board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              board.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((board) => (
              <motion.div
                key={board.id}
                layoutId={board.id}
                onClick={() => handleBoardClick(board)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-lg cursor-pointer border border-gray-200 hover:border-black transition-all"
              >
                <h3 className="text-2xl font-bold mb-2">{board.name}</h3>
                <p className="text-gray-600 mb-4">{board.abbreviation}</p>
                <div className="text-sm text-gray-500">
                  {board.city}, {board.province}, {board.country}
                </div>
              </motion.div>
            ))}
        </div>

        <AnimatePresence>
          {selectedBoard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedBoard(null)}
            >
              <motion.div
                layoutId={selectedBoard.id}
                className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-3xl font-bold mb-6">{selectedBoard.name}</h3>
                <div className="grid gap-8">
                  {grades.map(grade => (
                    <div key={grade} className="space-y-4">
                      <h4 className="text-xl font-semibold">Grade {grade}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {courses[grade].map(course => (
                          <motion.button
                            key={course}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 text-left rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-black transition-all"
                          >
                            <span className="font-medium text-black">{course}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-black mb-8">Welcome to Revisory</h1>
          <p className="text-xl text-gray-600 mb-12">Your comprehensive learning platform for Ontario high school courses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/school-boards')}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Pricing = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen pt-16 bg-white"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-bold text-center text-black mb-12">Pricing Plans</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            name: 'Free', 
            price: '0', 
            features: [
              'Access to basic courses',
              'Practice questions',
              'Progress tracking',
              'Limited study materials'
            ]
          },
          { 
            name: 'Premium', 
            price: '19.99', 
            features: [
              'All Free features',
              'Advanced courses',
              'Live tutoring',
              'Study groups',
              'Unlimited study materials'
            ]
          },
          { 
            name: 'Premium+', 
            price: '29.99', 
            features: [
              'All Premium features',
              'One-on-one mentoring',
              'Custom study plans',
              'Priority support',
              'Exam preparation workshops'
            ]
          }
        ].map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-black mb-4">{plan.name}</h3>
            <p className="text-4xl font-bold text-black mb-6">
              {plan.price === '0' ? 'Free' : `$${plan.price}`}
              {plan.price !== '0' && <span className="text-lg">/month</span>}
            </p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
              {plan.price === '0' ? 'Get Started' : 'Choose Plan'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const About = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen pt-16 bg-white"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-black mb-6">About Us</h2>
        <p className="text-xl text-gray-600">Empowering Ontario students with comprehensive learning resources</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
          <p className="text-gray-600">
            At Revisory, we're committed to making high-quality education accessible to all Ontario high school students.
            Our platform combines innovative technology with expert-crafted content to create an engaging learning experience.
          </p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
          <p className="text-gray-600">
            We envision a future where every student has the tools and resources they need to succeed in their academic journey.
            Through personalized learning paths and comprehensive support, we're making this vision a reality.
          </p>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const Contact = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen pt-16 bg-white"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center text-black mb-8">Contact Us</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/school-boards" element={<SchoolBoards />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
