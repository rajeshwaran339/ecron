import { apiRequest } from './queryClient';

// Newsletter subscription interface
export interface NewsletterSubscription {
  email: string;
  createdAt?: string;
}

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const response = await apiRequest('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    // Handle duplicate email error from API
    if (error.message?.includes('already subscribed')) {
      return { success: false, error: 'This email is already subscribed to our newsletter' };
    }
    
    return { success: false, error: error.message || 'Failed to subscribe. Please try again.' };
  }
};

// Get all newsletter subscriptions (admin only)
export const getNewsletterSubscriptions = async (): Promise<NewsletterSubscription[]> => {
  try {
    const response = await apiRequest('/api/newsletter/subscriptions');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    return [];
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest('/api/newsletter/unsubscribe', {
      method: 'DELETE',
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return { success: false, error: error.message || 'Failed to unsubscribe. Please try again.' };
  }
};