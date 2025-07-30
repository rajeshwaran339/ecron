import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface CourseApplication {
  id?: string
  user_id: string
  full_name: string
  email: string
  phone: string
  course_name: string
  experience_level: string
  interest_message: string
  created_at?: string
}

export interface DemoRequest {
  id?: string
  user_id: string
  name: string
  phone: string
  email: string
  course_for_demo: string
  available_time: string
  preferred_date?: string
  created_at?: string
}

export interface NewsletterSubscriber {
  id?: string
  user_id?: string
  email: string
  created_at?: string
}

export interface Message {
  id?: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  course_interest?: string
  message: string
  created_at?: string
}

export interface EventRegistration {
  id?: string
  user_id: string
  name: string
  degree: string
  year: string
  college_name: string
  university_name: string
  contact_number: string
  alternate_number?: string
  email_id: string
  certificate_code: string
  captcha_answer?: string
  created_at?: string
}