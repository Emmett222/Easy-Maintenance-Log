import "./Home.css";
import HomeNav from "../components/HomeNav";

function Home() {
  return (
    <section>
      <HomeNav />
      <section id="homeAll">
        <section id="titleBorder">
          <h1 id="title">Easy Maintenance Log</h1>
        </section>
        <section id="about">
          <h2>What is Easy Maintenance Log?</h2>
          <p>
            This website is a place to store data about your car's maintenance.
            Store details about your servicing and get emails when it's time to
            do said service again. Time the emails with milage or time.
          </p>
          <p>
            Data is secure and private. No data will be sent to any other
            parties. Website is completely open source, see the code here: <a href="https://github.com/Emmett222/Easy-Maintenance-Log">https://github.com/Emmett222/Easy-Maintenance-Log</a>
          </p>
        </section>
      </section>
    </section>
  );
}

export default Home;
