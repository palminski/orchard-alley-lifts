import "./Home.css";
import photo from "../img/background.jpeg";

const Home = () => {
  return (
    <>
      <div className="jumbotron">
        <img src={photo} alt="man lifting weights" />
        <h1>Get Jacked!</h1>
        <p>What are you waiting for??</p>
      </div>
      <div className="about-section">
        <h2 className="about-title">About</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          neque earum facere nostrum natus. Nam quis vitae nobis! Molestiae
          aspernatur, sint minima illum temporibus neque repellendus porro rerum
          dolorum itaque!
        </p>
      </div>
    </>
  );
};

export default Home;
