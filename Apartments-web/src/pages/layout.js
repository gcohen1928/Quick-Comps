import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav id="router-dom" >
        <ul>
          <li>
            <Link to="/"></Link>
          </li>
          <li>
              <Link to = '/scanning-tool'></Link>
          </li>
          <li>
              <Link to = '/pricing'></Link>
          </li>
          <li>
              <Link to = '/log-in'></Link>
          </li>
        </ul>
      </nav>
      <Outlet/>
    </>
  )
};

export default Layout;