

import './Home.css';
import photo from '../img/background.jpeg'

const Home = () => {
    return (
       <div className="jumbotron">
        <img src={photo} alt="man lifting weights"/>
            <h1>Get Jacked!</h1>
            <p>What are you waiting for??</p>
       </div>
    )
}

export default Home;