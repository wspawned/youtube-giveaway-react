import React, { useState } from "react";
import { TextField, Button, Typography, Switch } from "@mui/material";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Divider } from "@mui/material";
import { Box, Container, Paper } from "@mui/material";
import { fontSize } from "@mui/system";

const API_KEY = "";
const API_URL = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet";

const App = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [videoID, setVideoID] = useState("");
  const [winnerAmount, setWinnerAmount] = useState("");
  const [reserveWinnerAmount, setReserveWinnerAmount] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [winners, setWinners] = useState([]);
  const [reserveWinners, setReserveWinners] = useState([]);
  const [userCondition, setUserCondition] = useState(false);
  const [commentCondition, setCommentCondition] = useState(false);

  const rollDice = (list) => {
    const winnerIndex = Math.floor(Math.random() * list.length);
    const winnerId = list[winnerIndex];
    const remainedList = list.filter((id) => id !== winnerId);

    return { winID: winnerId, currList: remainedList };
  };

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
  };

  const chooseWithUserCondition = (competitors) => {
    const userSet = new Set(competitors.slice().map((info) => info.uid));
    const uniqueUsers = Array.from(userSet);
    return uniqueUsers;
  };

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
    setWinners(winnersInfo);
    setReserveWinners(reservesInfo);
  };

  const chooseCompetitors = (all) => {
    const competitorsAll = keywords.length
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
    comments.forEach((comment) => {
      const userId =
        comment.snippet.topLevelComment.snippet.authorChannelId.value;
      const userName =
        comment.snippet.topLevelComment.snippet.authorDisplayName;
      const userImage =
        comment.snippet.topLevelComment.snippet.authorProfileImageUrl;
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
  }

  return (
    <Box
      sx={{
        display: "flex",
        minWidth: "100vw",
        minHeight: "100vh",
        p: 3,
        bgcolor: "primary.light",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="app">
        <Typography variant="h3" mb={2} textAlign="center" >
          Youtube Comment Raffle
        </Typography>
        <div>
          <Paper
            sx={{
              width: "100%",
              p: 2, 
            }}
            elevation= "24"
          >
            <form
              className="conditions"
              onSubmit={(e) => {
                e.preventDefault();
                apiCall();
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap:3, p:3,
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
                  InputLabelProps={{ shrink: true }}
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
                  sx={{ width: "60%" }}
                />
                <br />

                <Button type="submit" variant="contained" color="primary">
                  Choose the Winners
                </Button>
              
            </form>

            <Paper
              sx={{
                p: 2,
                m: 3,
                bgcolor: "secondary.light",
                textAlign: "left", 
              }}
              
            >
              <Typography>
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
                    <Switch onClick={() => setUserCondition(!userCondition)} />
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
          </Paper>

          <div className="results">
            {winners.length ? (
              <List>
                {" "}
                WINNERS
                {winners.map((winner, order) => {
                  const rank = order + 1;
                  const name = winner.name;
                  const avatar = winner.avatar;
                  const url = winner.url;
                  const text = winner.text;
                  const key = order;

                  return (
                    <ListItem
                      alignItems="flex-start"
                      button
                      component="a"
                      href={url}
                    >
                      <ListItemAvatar>
                        <Avatar alt={name} src={avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={` #${rank} ${name} `}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {name}
                            </Typography>
                            {` — ${text}`}
                          </React.Fragment>
                        }
                      ></ListItemText>
                    </ListItem>
                  );
                })}
                <Divider variant="inset" component="li" />
              </List>
            ) : null}

            {reserveWinners.length ? (
              <List>
                {" "}
                RESERVE WINNERS
                {reserveWinners.map((winner, order) => {
                  const rank = order + 1;
                  const name = winner.name;
                  const avatar = winner.avatar;
                  const url = winner.url;
                  const text = winner.text;
                  const key = order;

                  return (
                    <ListItem
                      alignItems="flex-start"
                      button
                      component="a"
                      href={url}
                    >
                      <ListItemAvatar>
                        <Avatar alt={name} src={avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={` #${rank} ${name} `}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {name}
                            </Typography>
                            {` — ${text}`}
                          </React.Fragment>
                        }
                      ></ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            ) : null}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default App;