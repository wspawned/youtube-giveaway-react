import { useState } from "react";

const API_KEY = "***";
const API_URL = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet";

const App = () => {
  const [name,setName] = useState("");
  const [url,setUrl] = useState("");
  const [keywords,setKeywords] = useState([]);
  const [videoID,setVideoID] = useState("");
  const [winnerAmount,setWinnerAmount] = useState("");
  const [reserveWinnerAmount,setReserveWinnerAmount] =useState("");
  const [competitors,setCompetitors] = useState([]);
  
  const chooseCompetitors = (all) => {
    const competitors = (keywords.length)
      ? all.filter((item) => {
          return keywords
            .toLowerCase()
            .split(" ")
            .every((keyword) => {
              return item.text.toLowerCase().includes(keyword);
            });
        })
      : all.slice();
      setCompetitors(competitors);
    };
  
  async function apiCall() {
    const res = await fetch(`${API_URL}&videoId=${videoID}&key=${API_KEY}`);
    const json = await res.json();
    const comments = json.items.slice();
    const allComments = [];
    comments.forEach( (comment) => {
      const userId = comment.snippet.topLevelComment.snippet.authorChannelId.value;
      const userName = comment.snippet.topLevelComment.snippet.authorDisplayName;
      const userImage = comment.snippet.topLevelComment.snippet.authorProfileImageUrl;
      const text = comment.snippet.topLevelComment.snippet.textDisplay;

      return(
        allComments.push( {uid:userId, name:userName, avatar:userImage, text:text } )
      )
    });

    chooseCompetitors(allComments);
  };

  return (
    <div className="app">
      <header className="app-header">
        <p>Youtube Comment Raffle</p>
      </header>
      <div>
        <form className="conditions"
        onSubmit={ (e) => {
          e.preventDefault();
          apiCall();
        }}
        >
          <div className="name-url">
            <label>
            Draw Name
              <input
              type={"text"}
              placeholder="Teddy Picker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              ></input>
            </label>

            <label
            className="url">
            Content URL
              <input
              type={"url"}
              placeholder="https://www.youtube.com/watch?v=FwwldUF6TU8"
              value={url}
              onChange={(e) => {
                const value = e.target.value;
                setUrl(value);
                const id = value.slice(value.indexOf("=")+1);
                setVideoID(id);
              }}
              required
              ></input>
            </label>
          </div>
          
          <div className="numbers">
            <label>
              Winners
              <input type={"number"} min="1" step="1"
              value={winnerAmount}
              onChange= {(e) => {
                setWinnerAmount(e.target.value);
              }}
              required></input>
            </label>

            <label>
              Reserve Winners
              <input type={"number"} min="1" step="1"
              value={reserveWinnerAmount}
              onChange= { (e) => {
                setReserveWinnerAmount(e.target.value);
              }}
              required></input>
            </label>
          </div>

          <label>
            Keywords
            <input
              className="keywords"
              type={"search"}
              value={keywords}
              placeholder="use space btw keywords"
              onChange={
                (e) => {
                setKeywords(e.target.value);
              }
            }
            ></input>
          </label>

          <button 
          className="submit"
          type="submit"> Choose the Winners </button>

        </form>

        <div className="rules">
          <p> Rules of contest </p>

          <div className="buttons">
            <button> accept repetitive comments as one </button>
            <button> accept comments of same user as one  </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;