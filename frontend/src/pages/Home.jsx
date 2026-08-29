import {Link} from "react-router-dom";
function Home(){
    return(
        <div>
            <h1>
                Welcome to Clickplix
            </h1>
            <p>
                This platform can make your Photo sharing Easy
            </p>
            <Link to="/register">
            <button>Register Person</button>
            </Link>
            <Link to="/recognize">
            <button>Find Person</button>
            </Link>
        </div>
    );
}
export default Home;
