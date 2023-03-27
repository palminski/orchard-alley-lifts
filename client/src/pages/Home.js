import "./Home.css";
import photo from "../img/background.jpeg";


const Home = () => {
  return (
    <>
      <div className="jumbotron">
        <img src={photo} alt="man lifting weights" />
        <h1>Ready to start working out?</h1>
        <p>Start tracking today!!</p>
      </div>
    </>
  );
};

export default Home;
