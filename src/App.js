import Inputs from "./components/Inputs";
import Winners from "./components/Winners";
import { rollDice, chooseWithUserCondition, chooseWithCommentCondition } from "./util";
import axios from "axios";
import { connect } from "react-redux";
import { getWinners, getReserveWinners, toggleModal } from "./actions";
import { Box } from "@mui/material";

const API_KEY = "AIzaSyD-oBOzU1XmuxjfEAbfVOAkw8b3-JImr4Y";
const API_URL = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet";

const App = (props) => {
  
  const userCondition = props.userCondition;
  const commentCondition = props.commentCondition;
  const videoID = props.videoID;
  const keywords = props.keywords;
  const winnerAmount = props.winnerAmount;
  const reserveWinnerAmount = props.reserveWinnerAmount;

  const toggleModal = props.toggleModal;
  const getWinners = props.getWinners;
  const getReserveWinners = props.getReserveWinners;

  console.log(props.test)

  const chooseWinners = (competitors) => {
    const winners = [];
    const reserves = [];

    let selectionGroup = [];
    if (userCondition === true) {
      selectionGroup = chooseWithUserCondition(competitors);
    } else if (commentCondition === true) {
      selectionGroup = chooseWithCommentCondition(competitors);
    } else {
      selectionGroup = competitors.slice().map((info) => info.uid);
    }

    for (let i = 1; i <= +winnerAmount; i++) {
      const current = rollDice(selectionGroup);
      selectionGroup = current.currList;
      winners.push(current.winID);
    }
    for (let i = 1; i <= +reserveWinnerAmount; i++) {
      const current = rollDice(selectionGroup);
      selectionGroup = current.currList;
      reserves.push(current.winID);
    }
    const winnersInfo = [];
    const reservesInfo = [];
    winners.forEach((id) => {
      winnersInfo.push(competitors.find((item) => item.uid === id));
    });
    reserves.forEach((id) => {
      reservesInfo.push(competitors.find((item) => item.uid === id));
    });
    getWinners(winnersInfo);
    getReserveWinners(reservesInfo);
  };

  const chooseCompetitors = (allComments) => {
    const competitors = keywords.length
      ? allComments.filter((item) => {
          return keywords
            .toLowerCase()
            .split(" ")
            .every((keyword) => {
              return item.text.toLowerCase().includes(keyword);
            });
        })
      : allComments.slice();
    chooseWinners(competitors);
  };

  async function getComments() {
    try {
      let res = await axios.get(`${API_URL}&videoId=${videoID}&key=${API_KEY}`);
      let comments = [];
      comments = comments.concat(res.data.items.slice());
      while (res.data.nextPageToken) {
        res = await axios.get(`${API_URL}&videoId=${videoID}&key=${API_KEY}&pageToken=${res.data.nextPageToken}`);
        comments = comments.concat(res.data.items.slice());
      }
      const allComments = [];
      comments.forEach((comment) => {
        const userId = comment.snippet.topLevelComment.snippet.authorChannelId.value;
        const userName = comment.snippet.topLevelComment.snippet.authorDisplayName;
        const userImage = comment.snippet.topLevelComment.snippet.authorProfileImageUrl;
        const userUrl = comment.snippet.topLevelComment.snippet.authorChannelUrl;
        const text = comment.snippet.topLevelComment.snippet.textDisplay;

        return allComments.push({
          uid: userId,
          name: userName,
          avatar: userImage,
          text: text,
          url: userUrl,
        });
      });

      chooseCompetitors(allComments);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = () => {
    getComments();
    toggleModal();
  }

  return (
    <Box
      className="app"
      sx={{display: "flex", minHeight: "100vh", maxWidth: "100vw", bgcolor: "primary.light", justifyContent: "center" }}
    >
      <Inputs handleSubmit={() => handleSubmit()} />
      <Winners />
    </Box>
  );
};

const mapStateToProps = state => {
  return {
    test: state.test,
    videoID: state.videoID,
    keywords: state.keywords,
    userCondition: state.userCondition,
    commentCondition: state.commentCondition,
    winnerAmount: state.winnerAmount,
    reserveWinnerAmount: state.reserveWinnerAmount,
  }
}

export default connect(mapStateToProps, {getWinners, getReserveWinners, toggleModal} )(App);