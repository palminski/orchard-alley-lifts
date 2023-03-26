import Auth from "../utils/auth";
import { useApolloClient } from "@apollo/client";
import gainsIcon from "../images/icons/Will_Design.svg";


const Nav = (props) => {
  const { pageSelected, setPageSelected } = props;
  const client = useApolloClient();
  return (
    <>
      <nav className="nav-container">
        <div className="hrefCon">
            
      <h1>RepMaster</h1>

      <img src= {gainsIcon} className="gains-icon" alt="Master Gains icon" />

          <ul>
            {!Auth.loggedIn() && (
              <a>
                <li href="#Login" onClick={() => setPageSelected("Login")}>
                  Login
                </li>
              </a>
            )}
            {!Auth.loggedIn() && (
              <a>
                <li href="#SignUp" onClick={() => setPageSelected("Signup")}>
                  Sign Up
                </li>
              </a>
            )}
            {Auth.loggedIn() && (
              <>
                <a>
                  <li
                    href="#Workouts"
                    onClick={() => setPageSelected("Workouts")}
                  >
                    Workouts
                  </li>
                </a>
                <a>
                  <li href="#Today" onClick={() => setPageSelected("Today")}>
                    Today
                  </li>
                </a>
                <a>
                  <li
                    href="#Calender"
                    onClick={() => setPageSelected("Calender")}
                  >
                    Calender
                  </li>
                </a>
                <a>
                  <li
                    href="#MyPage"
                    onClick={() => setPageSelected("MyPage")}
                  >
                    My Page
                  </li>
                </a>
                <a>
                  <li
                    href="/"
                    onClick={() => {
                      Auth.logout();
                      client.clearStore();
                      
                      window.location.reload(true);
                    }}
                  >
                    Logout
                  </li>
                </a>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
