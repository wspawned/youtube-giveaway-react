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
  const [winners, setWinners] = useState([]);
  const [reserveWinners, setReserveWinners] = useState([]);
  const [userCondition, setUserCondition] = useState(false);
  const [commentCondition, setCommentCondition] = useState(false);

  const rollDice = (list) => {
    const winnerIndex = Math.floor(Math.random()* list.length);
    const winnerId = list[winnerIndex];
    const remainedList = list.filter(id => id!== winnerId );

    return { winID:winnerId, currList:remainedList};
  }

  const chooseWithCommentCondition = (competitors) => {
    const userMap = new Map();

    competitors.forEach((x) => {
      if (userMap.has(x.uid)) {
        userMap.get(x.uid).add(x.text);
      } else {
        let newSet = new Set();
        newSet.add(x.text);
        userMap.set(x.uid, newSet);
      }
    });
    let userArr = [];
    userMap.forEach((value, key) => {
      userArr = [...userArr, ...Array(value.size).fill(key)];
    });

    return userArr;
  }

  const chooseWithUserCondition = (competitors) => {
    const userSet = new Set(
      competitors.slice().map(info => info.uid)
    );
    const uniqueUsers = Array.from(userSet);
    return uniqueUsers;
  }

  const chooseWinners = (competitors) => {
    
    const winners = [];
    const reserves = [];
    // let usersNoCondition = competitors.slice().map( info => info.uid );
    let selectionGroup = [];
    if(userCondition===true) {
      selectionGroup = chooseWithUserCondition(competitors);
    } else if (commentCondition===true) {
      selectionGroup = chooseWithCommentCondition(competitors);
    }
    else {
      selectionGroup = competitors.slice().map( info => info.uid );
    }

    for(let i=1; i<=(+winnerAmount); i++) {
      const current = rollDice(selectionGroup);
      selectionGroup = current.currList;
      winners.push(current.winID);
      
    };
    for(let i=1; i<=(+reserveWinnerAmount); i++) {
      const current = rollDice(selectionGroup);
      selectionGroup = current.currList;
      reserves.push(current.winID);
    };
    const winnersInfo = [];
    const reservesInfo = [];
    winners.forEach(id => {  winnersInfo.push(competitors.find(item => item.uid === id)) } );
    reserves.forEach(id => {  reservesInfo.push(competitors.find(item => item.uid === id)) } );
    setWinners(winnersInfo);
    setReserveWinners(reservesInfo);
  }

  const chooseCompetitors = (all) => {
    const competitorsAll = (keywords.length)
      ? all.filter((item) => {
          return keywords
            .toLowerCase()
            .split(" ")
            .every((keyword) => {
              return item.text.toLowerCase().includes(keyword);
            });
        })
      : all.slice();
      setCompetitors(competitorsAll);
      chooseWinners(competitorsAll);
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
      const userUrl = comment.snippet.topLevelComment.snippet.authorChannelUrl
      const text = comment.snippet.topLevelComment.snippet.textDisplay;

      return(
        allComments.push( {uid:userId, name:userName, avatar:userImage, text:text, url:userUrl } )
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
              <input type={"number"} min={winnerAmount} step="1"
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
          <ul>
            <li>reserve winner amount can't be lower than winner amount</li>
            <li>something to do later</li>
          </ul>

          <div className="buttons">
            <button
            onClick={()=> setCommentCondition(!commentCondition)}
            > accept repetitive comments as one </button>
            <button
            onClick={()=> setUserCondition(!userCondition)}
            > accept comments of same user as one  </button>
          </div>
        </div>

        <div className="results">
          { winners.map( (winner, order) => {
            const rank = order+1;
            const name = winner.name;
            const avatar = winner.avatar;
            const url = winner.url;
            const key = order;

            return (
              <div key={key} className="winners">
                <h2>WINNER #{rank} </h2>
                <img
                src={avatar} alt="user-avatar"></img>
                <a href={url} > {` ${name} `} </a>
              </div>
            )
          })}
          { reserveWinners.map( (winner, order) => {
            const rank = order+1;
            const name = winner.name;
            const avatar = winner.avatar;
            const url = winner.url;
            const key = order;

            return (
              <div key={key} className="reserve-winners">
                <h2>RESERVE WINNER #{rank} </h2>
                <img
                src={avatar} alt="user-avatar"></img>
                <a href={url} > {` ${name} `} </a>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
////
export default App;


