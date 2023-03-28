import "./Home.css";
import photo from "../img/background.jpeg";
import gainsIcon from "../images/icons/Will_Design.svg";


const Home = () => {
  return (
    <>
      <div className="jumbotron">
        <img className="jumbotron-img" src={photo} alt="man lifting weights" />
        <h1>Track Your Lifts!!</h1>
        <img src= {gainsIcon} className="gains-icon" alt="Master Gains icon" />
      </div>
    </>
  );
};

export default Home;
