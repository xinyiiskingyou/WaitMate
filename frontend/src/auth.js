export const getToken = () => {
  var cookieArr = document.cookie.split(";");
    
  for(var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if('token' === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  
  return null;
}


export const handleLogin = async (email, password) => {
  var token = '';

  console.log({
    email: email,
    password: password,
  });

  try { 
    const response = await fetch('http://localhost:8000/auth/manager/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    })

    if (!response.ok) {
      throw new Error('Failed to login');
    }
    
    const data = await response.json();
    token = data
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (1*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = 'token=' + (token || "")  + expires + "; path=/";
      
  } catch (error) {
    console.log(error)
    alert('Failed to login. Please try again.');
  }
  return token;
};

export const handleLogoutSubmit = async () => {
  try { 
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    window.location.href = '/';
  }
  catch (error) {
    alert('Failed to logout. Please try again.');
  }
}

