'use client';

/**
 * Display a notification message
 * @param message Message to display
 * @param type Success or error notification
 * @param duration Duration in milliseconds
 */
export function showNotification(
  message: string, 
  type: "success" | "error" = "success",
  duration: number = 3000
) {
  if (typeof document === 'undefined') return;
  
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-4 p-3 rounded-md shadow-lg z-50 notification-enter ${
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`;
  notification.innerText = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('notification-enter');
    notification.classList.add('notification-exit');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Display a page change notification
 * @param slug The slug of the current page
 */
export function showPageChangeNotification(slug: string) {
  if (typeof document === 'undefined') return;
  
  const pageNotification = document.createElement('div');
  pageNotification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 notification-enter';
  pageNotification.innerText = `Editing page: ${slug}`;
  document.body.appendChild(pageNotification);
  
  setTimeout(() => {
    pageNotification.classList.remove('notification-enter');
    pageNotification.classList.add('notification-exit');
    setTimeout(() => pageNotification.remove(), 300);
  }, 2000);
} 