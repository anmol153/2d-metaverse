import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import About from './components/About'

function Layout() {
  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  )
}

export default Layout