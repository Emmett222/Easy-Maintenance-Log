import "./Home.css";
import HomeNav from "../components/HomeNav";
import LoggedInNav from "../components/LoggedInNav";
import { primaryColor } from "../util/constants";

function Home() {
  function navGetter() {
    const token = localStorage.getItem('access_token');
    if (token) {
      return <LoggedInNav showPrint={false}/>
    } else {
      return <HomeNav />
    }
  }

  return (
    <section>
      <title>Easy Maintenance Log</title>
      {navGetter()}
      <section id="homeAll" className="pageTransition">
        <section id="titleBorder" style={{borderColor: primaryColor}}>
          <h1 id="title">Easy Maintenance Log</h1>
        </section>
        <section id="about">
          <p>
            Store data about your car's maintenance. Track when to repeat your car's maintenance in an easy way.
          </p>
          <p>
            Information is secure and private, and will be sent to any other
            parties. Website is completely open source, see the code here: <a href="https://github.com/Emmett222/Easy-Maintenance-Log">https://github.com/Emmett222/Easy-Maintenance-Log</a>
          </p>
        </section>
      </section>
    </section>
  );
}

export default Home;
