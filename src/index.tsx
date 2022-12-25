import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import View from "./View/View";
import Babysitting from "./Babysitting/Babysitting";


const router = createBrowserRouter([
    {
        path: "/",
        element: <View/>,
    },
    {
        path: "/babysitting",
        element: <Babysitting/>
    }
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RecoilRoot>
          <React.Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </React.Suspense>
      </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
