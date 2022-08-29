import { useState } from "react";

const App = () => {
  const [name,setName] = useState("");
  const [url,setUrl] = useState("");
  const [keywords,setKeywords] = useState([]);


  return (
    <div className="app">
      <header className="app-header">
        <p>
          Youtube Raffle
        </p>
      </header>
      <div>

        <form className="conditions">
          <label>Draw Name<input
          type={"text"}
          placeholder= "Teddy Picker"
          value={name}
          onChange= { (e) => setName(e.target.value) }
          required
          ></input></label>
          
          <label>Content URL<input
          type={"url"}
          placeholder= "https://www.youtube.com/watch?v=FwwldUF6TU8"
          value= {url}
          onChange= { (e) => setUrl(e.target.value) }
          required
          ></input></label>

          <div className="numbers">
            <label>Principle Winners<input
            type={"number"}
            required
            ></input></label>

            <label>Reserve Winners<input
            type={"number"}
            required
            ></input></label>
          </div>

          <label>Keywords<input
          className="keywords"
          type={"search"}
          value={keywords}
          placeholder= "use space btw keywords"
          onChange={ (e) => {
            const words = e.target.value.toLowerCase().split(" ");
            setKeywords(words);
          } }
          ></input></label>
          
        </form>
      </div>
    </div>
  );
}

export default App;
