import Winners from "./Winners";
import { rollDice, chooseWithUserCondition, chooseWithCommentCondition } from "./util";
import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getWinners, getReserveWinners, toggleModal } from "./actions";
import { TextField, Button, Typography, Switch, Box, Paper } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';

const API_KEY = "***";
const API_URL = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet";

const App = (props) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [videoID, setVideoID] = useState("");
  const [winnerAmount, setWinnerAmount] = useState("");
  const [reserveWinnerAmount, setReserveWinnerAmount] = useState("");
  const [userCondition, setUserCondition] = useState(false);
  const [commentCondition, setCommentCondition] = useState(false);

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

  async function getComments () {
    try {
      let res = await axios.get(`${API_URL}&videoId=${videoID}&key=${API_KEY}`);
      let comments=[];
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
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <Box
      className="app"
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: "100vw",
        bgcolor: "primary.light",
        justifyContent: "center",
      }}
    >
      
          <Paper
            sx={{
              width: "50%",
              p: 5,
              my: 5,
              justifyContent: "center",
            }}
            elevation="24"
          >
            <Typography variant="h3" mb={3} textAlign="center" color="#204f75">
              Youtube Comment Picker
            </Typography>
            <form
              className="conditions"
              onSubmit={(e) => {
                e.preventDefault();
                getComments();
                toggleModal();
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 3,
                }}
              >
                <TextField
                  type="text"
                  label="Draw Name"
                  placeholder="Spawn Figure Giweavay"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  type="url"
                  label="Content URL"
                  placeholder="https://www.youtube.com/watch?v=FwwldUF6TU8"
                  variant="outlined"
                  value={url}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUrl(value);
                    const id = value.slice(value.indexOf("=") + 1);
                    setVideoID(id);
                  }}
                  required
                />

                <TextField
                  type="number"
                  label="Winners"
                  min="1"
                  step="1"
                  variant="outlined"
                  value={winnerAmount}
                  onChange={(e) => {
                    setWinnerAmount(e.target.value);
                  }}
                  required
                />
                <TextField
                  type="number"
                  label="Reserve Winners"
                  min={winnerAmount}
                  step="1"
                  variant="outlined"
                  value={reserveWinnerAmount}
                  onChange={(e) => {
                    setReserveWinnerAmount(e.target.value);
                  }}
                  required
                />
              </Box>

              <Paper
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "secondary.light",
                  textAlign: "left",
                }}
              >
                <Typography sx={{ fontSize: 15 }}>
                  <p> Rules of contest </p>
                  <ul>
                    <li>
                      Reserve winner amount can't be lower than winner amount.{" "}
                    </li>
                    <li>
                      If keywords entered picks among the comments that contains
                      all keywords.
                    </li>
                    <li>
                      Accept all comments of same user as one
                      <Switch
                        edge="end"
                        onClick={() => setUserCondition(!userCondition)}
                      />
                    </li>
                    <li>
                      Accept repetitive comments of same user as one
                      <Switch
                        onClick={() => setCommentCondition(!commentCondition)}
                      />
                    </li>
                  </ul>
                </Typography>
              </Paper>

              <Box sx={{}}>
                <TextField
                  type="search"
                  label="Keywords"
                  placeholder="McFarlane throne Spawn wings"
                  helperText="use space btw keywords"
                  variant="standard"
                  fullWidth
                  onChange={(e) => {
                    setKeywords(e.target.value);
                  }}
                  sx={{ mt: 2 }}
                />
                <br />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ display: "block", m: "auto" }}
                >
                  Roll the Dice <CasinoIcon sx={{mb:-0.8}} />
                </Button>
              </Box>
            </form>
          </Paper>

            <Winners/>
        
    </Box>
  );
};

const mapStateToProps = state => {
  return {
    test: state.test
  }
}

export default connect(mapStateToProps, {getWinners, getReserveWinners, toggleModal} )(App);