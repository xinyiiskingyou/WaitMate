
// import { useState, useEffect } from 'react';
// import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { getToken } from './auth.js';


// export async function isAuth (staff) {
//   const body = {
//     'stafftype': staff
//   }


//   fetch('http://localhost:8000/auth/user', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getToken()}`
//     },
//     body: JSON.stringify(body),
//   }).then(response => {
//     if (response.ok) {
//       return true;
//     } else {
//       return false;
//     }
//   })

// }


// const ManagerRoute = () => {
//   // const location = useLocation();
//   // const [auth, setAuth] = useState(isAuth());

//   // var authLogin = isAuth(['manager']);

//   // useEffect(() => {
//   //   fetchCategories();
//   // }, []);

//   // if (authLogin === undefined) {
//   //   return null; // or loading indicator/spinner/etc
//   // }

//   // console.log(auth)

//   // return auth 
//   //   ? <Outlet />
//   //   : <Navigate to="/ManagerLogin" replace state={{ from: location }} />;
//     const navigate = useNavigate();
//     const [auth, setAuth] = useState(isAuth(['manager']));

//     useEffect(() => {
//       isAuth(['manager'])
//         .then(accounts => {
//           setAuth(accounts);
//           navigate("/", { replace: true });
//         });
//     }, [auth]);


//     // const auth = isAuth(['manager']); // determine if authorized, from context or however you're doing it

//     // If authorized, return an outlet that will render child elements
//     // If not, return element that will navigate to login page
//   console.log(auth)
//   return auth ? <Outlet /> : <Navigate to="/" />;
// }
  
// export default ManagerRoute;