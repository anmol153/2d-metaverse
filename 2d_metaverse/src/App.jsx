import './App.css';
import Home from './components/Home';
import MapCanvas from './components/map';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemestore';
import HomeLay from './components/HomeLay';
import SignUp from './components/Sign_up';
import Sign_in from './components/Sign_in';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { Toaster } from 'react-hot-toast';
import About from './components/About';
import VideoChat from './components/VideoChat';
import Room from './components/Room';
import RoomList from './components/RoomList';
import RoomView from './components/RoomView';

const App = () => {
  const { authUser, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<div data-theme={theme}><Toaster position="top-center" reverseOrder={false} /><Layout /></div>}>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Sign_in /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/Signup" />} />
        <Route path="/about" element={<About/>} />
        <Route path="/map" element={authUser ? <MapCanvas /> : <Navigate to="/Signup" />} >
            <Route path="homelay" element={<HomeLay />} />
            <Route path = "profile" element = {<Profile/>} />
            <Route path=  "homelay" element={<HomeLay />} />
        <Route path = "video" element={authUser ? <VideoChat /> : <Navigate to="/Signup" />} >
                <Route path = "room/:roomId" element={<Room/>} />
        </Route>
        </Route>
        <Route path="/room2" element={<RoomList />} />
        <Route path="/room2/:name" element={<RoomView />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
