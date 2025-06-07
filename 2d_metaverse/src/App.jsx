import './App.css'
import Home from './components/Home'
import MapCanvas from './components/map'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter(createRoutesFromElements
  (
    <>
      <Route path = '/' element = {<Home/>} />
      <Route path = '/map' element = {<MapCanvas/>} />
    </>
  ))



const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
