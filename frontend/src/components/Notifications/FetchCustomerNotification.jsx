import React, { useState, useEffect } from "react";
import ErrorHandler from '../ErrorHandler';

const FetchCustomerNotification = ({ cookies }) => {
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [notification, setNotification] = useState([]);

  const fetchNotification = async () => {
    try {
      const response = await fetch('http://localhost:8000/notification/waitstaff/get/customer', {
        method: 'GET',
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
      setNotification(notification_lst);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      handleShowSnackbar('Error fetching notifications:', error)
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/notification/waitstaff/get/customer');
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
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotification();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return (
    <>
      {notification.map((item) => (
        <div key={item.table}>
          <p style={{ color: item.status === 'ASSIST' ? "#FB0F0F" : item.status === 'BILL' ? "#F59B0C" : "inherit" }}>
            <b>Table {item.table}</b> requested {item.status}
          </p>
        </div>
      ))}
      {showError}
    </>
  );
}

export default FetchCustomerNotification;