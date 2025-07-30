import React, { useState } from 'react'
import { ArrowLeft, User, Mail, Phone, MessageSquare, GraduationCap, Send, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, type CourseApplication } from '../lib/supabase'
import AuthGuard from './AuthGuard'
import Toast from './Toast'
import { useToast } from '../hooks/useToast'

interface SupabaseCourseDetailPageProps {
  courseId: string
  onBack: () => void
}

const SupabaseCourseDetailPage: React.FC<SupabaseCourseDetailPageProps> = ({ courseId, onBack }) => {
  const { user } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    experienceLevel: '',
    interestMessage: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Course data mapping (same as before)
  const courseData: Record<string, any> = {
    'mean-stack': {
      title: 'MEAN Stack Development',
      duration: '2 months',
      fee: '₹25,000',
      description: 'Complete full-stack development with MongoDB, Express.js, Angular, and Node.js.',
      curriculum: [
        'HTML, CSS, JavaScript Fundamentals',
        'Bootstrap for Responsive Design',
        'React JS Development',
        'Node.js Backend Development',
        'MongoDB Database Management',
        'Express.js Framework',
        'RESTful API Development',
        'Authentication & Authorization',
        'Deployment & DevOps Basics',
        'Real-world Project Development'
      ],
      careerOpportunities: [
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Web Application Developer',
        'JavaScript Developer'
      ],
      expectedSalary: '₹25,000 - ₹45,000/month'
    },
    'uiux-design': {
      title: 'UI/UX Design',
      duration: '2 months',
      fee: '₹25,000',
      description: 'Comprehensive UI/UX design training covering user research, wireframing, prototyping, and visual design.',
      curriculum: [
        'Design Thinking & User Psychology',
        'User Research & Persona Development',
        'Wireframing & Information Architecture',
        'Prototyping with Figma',
        'Adobe XD Mastery',
        'Sketch for UI Design',
        'Visual Design Principles',
        'Color Theory & Typography',
        'Responsive Design Patterns',
        'Usability Testing & Iteration'
      ],
      careerOpportunities: [
        'UI/UX Designer',
        'Product Designer',
        'Visual Designer',
        'Interaction Designer',
        'User Experience Researcher'
      ],
      expectedSalary: '₹20,000 - ₹40,000/month'
    },
    // Add other courses as needed...
  }

  const course = courseData[courseId]

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button
            onClick={onBack}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select your experience level'
    }

    if (!formData.interestMessage.trim()) {
      newErrors.interestMessage = 'Please tell us about your interest'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) {
      return
    }

    setIsSubmitting(true)

    try {
      const courseApplication: Omit<CourseApplication, 'id' | 'created_at'> = {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        course_name: course.title,
        experience_level: formData.experienceLevel,
        interest_message: formData.interestMessage
      }

      const { error } = await supabase
        .from('course_applications')
        .insert([courseApplication])

      if (error) {
        throw error
      }

      setIsSubmitted(true)
      showToast('Application submitted successfully! We will contact you soon.', 'success')
    } catch (error: any) {
      console.error('Error submitting course application:', error)
      showToast(error.message || 'Failed to submit application. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Thank you for your interest in <strong>{course.title}</strong>. 
              Our admissions team will contact you within 24 hours to discuss the next steps.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Our team will review your application</li>
                <li>• You'll receive a call within 24 hours</li>
                <li>• We'll schedule a free demo session</li>
                <li>• Discuss course details and payment options</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Explore More Courses
              </button>
              <a
                href="tel:+918438829844"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-12">
          <div className="container mx-auto px-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-pink-100 hover:text-white font-semibold mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Courses
            </button>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-pink-100 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 text-pink-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Duration:</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Fee:</span>
                  <span>{course.fee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Expected Salary:</span>
                  <span>{course.expectedSalary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Course Information */}
            <div className="space-y-8">
              {/* Curriculum */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <ul className="space-y-3">
                  {course.curriculum.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Career Opportunities */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.careerOpportunities.map((career: string, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-3 border border-pink-200">
                      <span className="text-pink-700 font-medium">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-100 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Course</h2>
              
              <AuthGuard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-400'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-400'
                      }`}
                      placeholder="+91 84388 29844"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                      <GraduationCap size={16} className="inline mr-2" />
                      Experience Level *
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${
                        errors.experienceLevel ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-400'
                      }`}
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Complete Beginner</option>
                      <option value="some-knowledge">Some Basic Knowledge</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {errors.experienceLevel && (
                      <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>
                    )}
                  </div>

                  {/* Interest Message */}
                  <div>
                    <label htmlFor="interestMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare size={16} className="inline mr-2" />
                      Why are you interested in this course? *
                    </label>
                    <textarea
                      id="interestMessage"
                      name="interestMessage"
                      rows={4}
                      value={formData.interestMessage}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300 ${
                        errors.interestMessage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-400'
                      }`}
                      placeholder="Tell us about your career goals and why you want to learn this technology..."
                    />
                    {errors.interestMessage && (
                      <p className="mt-1 text-sm text-red-600">{errors.interestMessage}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 disabled:from-pink-400 disabled:to-pink-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              </AuthGuard>

              {/* Contact Info */}
              <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-pink-600" />
                    <a href="tel:+918438829844" className="hover:text-pink-600 transition-colors">
                      +91 84388 29844
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-pink-600" />
                    <a href="mailto:harsantal@gmail.com" className="hover:text-pink-600 transition-colors break-all">
                      harsantal@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast {...toast} onClose={hideToast} />
    </>
  )
}

export default SupabaseCourseDetailPage