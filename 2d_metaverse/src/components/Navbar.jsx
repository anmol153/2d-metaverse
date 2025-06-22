import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import {Home, HomeIcon, LogIn, LogOutIcon, MessageCircleDashed, Settings, Settings2, User, User2} from 'lucide-react';
import { useLocation } from "react-router";
import { LogOut } from "lucide-react";
import { useThemeStore } from "../store/useThemestore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const {setSectionTarget} = useThemeStore();


   const handleLeave = () => {
    const confirmed = window.confirm("Are you sure you want to leave the map?");
    if (confirmed) {
      navigate('/'); 
    }
  };
   const handleTop =()=>{
    setSectionTarget('home');
    navigate('/');
   };
   const handleDown = () => {
    setSectionTarget('about');
    navigate('/');
  };
 return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/10 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-5 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <span className="text-xl font-bold bg-gradient-to-r from-[#00ff99] via-[#00bfff] to-[#6a00ff] text-transparent bg-clip-text">
            2D
          </span>
          <span className="text-secondary text-xl font-bold">Metaverse</span>
        </div>

        {/* Navigation */}
        {(location.pathname !== "/map" && location.pathname!=="/map/settings" && location.pathname!=="/map/profile") ? (
          <ul className="absolute flex space-x-6 text-white font-medium right-10">
            <li className="hover:text-purple-300 transition flex flex-row gap-2 btn btn-sm">
              <HomeIcon className="size-5" />
              <button onClick={handleTop}>Home</button>
            </li>

            <button onClick={handleDown} className="btn btn-sm flex flex-row gap-2 hover:text-blue-300">
              <User2 className="size-5" />
              <span>About</span>
            </button>

            <Link to="/settings" className="btn btn-sm flex flex-row gap-2 hover:text-yellow-300">
              <Settings2 className="size-5" />
              <span>Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <button onClick={logout} className="flex gap-2 items-center btn btn-sm">
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/SignUp" className="btn btn-sm flex flex-row gap-2 hover:text-purple-300 items-center">
                <LogIn className="size-5" />
                <span>SignUp</span>
              </Link>
            )}
          </ul>
        ) :  (
          <div className="absolute flex text-white font-medium space-x-6 items-center right-10">
            {/* Left-aligned links for /map route */}
            <label className="flex space-x-6">
              <li className="hover:text-purple-300 transition flex flex-row gap-2 btn btn-sm">
                <User2 className="size-5" />
                {location.pathname=="/map" ? <Link to = "/map/profile">Profile</Link> : <Link to = "/map">Map</Link> }
              </li>

              <bitton  onClick={handleLeave} className="bg-red-500 flex flex-row gap-2 hover:text-yellow-300 px-2 rounded-lg items-center">
                <span>Leave</span>
                <LogOutIcon className="size-5" />
              </bitton>
            </label>
          </div>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
