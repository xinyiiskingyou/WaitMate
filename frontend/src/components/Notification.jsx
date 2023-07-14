import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotification } from './api'; // Import your API function to fetch notifications
import { setNotification } from './actions'; // Import your action to set the notification

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.notification);

  useEffect(() => {
    // Fetch the notification from the endpoint
    fetchNotification()
      .then(response => {
        // Set the notification in the state
        dispatch(setNotification(response.message));
      })
      .catch(error => {
        console.error('Failed to fetch notification:', error);
      });
  }, [dispatch]);

  return (
    <div className={`notification ${notification ? 'show' : ''}`}>
      {notification}
    </div>
  );
};

export default Notification;
