import React, { useState, useEffect } from "react";
import ErrorHandler from '../ErrorHandler';

const FetchKitchenNotification = ({ cookies }) => {
  const [notificationKitchen, setNotificationKitchen] = useState([]);
  const { handleShowSnackbar, showError } = ErrorHandler();

  const fetchNotificationKitchen = async () => {
    try {
      const response = await fetch('http://localhost:8000/notification/waitstaff/get/kitchen', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
      })
      const data = await response.json();
      let notification_lst = []
      for (var i of data) {
        notification_lst.push({ table: i[0], status: i[1]})
      }
      console.log('noti', notification_lst);
      setNotificationKitchen(notification_lst);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      handleShowSnackbar('Error fetching notifications:', error)
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/notification/waitstaff/get/kitchen');
    function getRealtimeData(data) {
      console.log(data);
    }
    eventSource.onmessage = e => getRealtimeData(JSON.parse(e.data));
    // Event listeners for incoming notifications
    eventSource.addEventListener('notification', (event) => {
      const notification = JSON.parse(event.data);
      // Handle the received notification
      console.log(notification);
    });

    return () => {
      // Clean up the EventSource connection on unmounting the component
      eventSource.close();
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificationKitchen();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      {notificationKitchen.map((order) => (
        <div key={order.table}>
          <p style={{color: '#3f50b5'}}><b>Table {order.table}</b> {order.status} is ready to be served</p>
        </div>
      ))}
      {showError}
    </>
  )
}

export default FetchKitchenNotification;