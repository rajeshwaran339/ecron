import React, { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, type NewsletterSubscriber } from '../lib/supabase'
import Toast from './Toast'
import { useToast } from '../hooks/useToast'

const SupabaseNewsletter: React.FC = () => {
  const { user } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const [email, setEmail] = useState(user?.email || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      showToast('Please enter your email address', 'error')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if already subscribed
      const { data: existingSubscription } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (existingSubscription) {
        showToast('This email is already subscribed to our newsletter', 'warning')
        setIsSubmitting(false)
        return
      }

      const newsletterSubscriber: Omit<NewsletterSubscriber, 'id' | 'created_at'> = {
        user_id: user?.id,
        email: email.toLowerCase().trim()
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([newsletterSubscriber])

      if (error) {
        throw error
      }

      showToast('Thank you for subscribing to our newsletter!', 'success')
      setIsSubscribed(true)
      setEmail('')
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error)
      showToast(error.message || 'Failed to subscribe. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 rounded-full p-2">
              <Mail size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-green-800">Successfully Subscribed!</h3>
          </div>
          <p className="text-green-700">
            Thank you for subscribing to our newsletter. You'll receive updates about our latest courses and technology trends.
          </p>
        </div>
        <Toast {...toast} onClose={hideToast} />
      </>
    )
  }

  return (
    <>
      <div>
        <h4 className="font-bold mb-6 text-xl">Stay Updated</h4>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Subscribe to our newsletter for the latest updates on courses and technology trends.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-pink-400 disabled:to-pink-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Send size={16} />
                Subscribe
              </>
            )}
          </button>
        </form>
      </div>
      <Toast {...toast} onClose={hideToast} />
    </>
  )
}

export default SupabaseNewsletter