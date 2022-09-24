import { TextField, Button, Typography, Switch, Box, Paper } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { useState } from "react";
import { connect } from "react-redux";
import { getKeywords, getVideoID, getWinnerAmount, getReserveWinnerAmount } from "../actions/index";
import { toggleUserCondition, toggleCommentCondition } from "../actions/index";

const Inputs = (props) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const winnerAmount = props.winnerAmount;
  const reserveWinnerAmount = props.reserveWinnerAmount;

  const getVideoID = props.getVideoID;
  const getWinnerAmount = props.getWinnerAmount;
  const getReserveWinnerAmount = props.getReserveWinnerAmount;
  const toggleUserCondition = props.toggleUserCondition;
  const toggleCommentCondition = props.toggleCommentCondition;
  const getKeywords = props.getKeywords;

  const handleSubmit = props.handleSubmit;

    return (
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
                handleSubmit();
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
                    getVideoID(id);
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
                    getWinnerAmount(e.target.value);
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
                    getReserveWinnerAmount(e.target.value);
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
                        onClick={() => toggleUserCondition()}
                      />
                    </li>
                    <li>
                      Accept repetitive comments of same user as one
                      <Switch
                        onClick={() => toggleCommentCondition()}
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
                    getKeywords(e.target.value);
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
    )
}

const mapStateToProps = state => {
  return {
    winnerAmount: state.winnerAmount,
    reserveWinnerAmount: state.reserveWinnerAmount,
  }
}

export default connect(mapStateToProps, {
  getKeywords,
  getVideoID,
  getWinnerAmount,
  getReserveWinnerAmount,
  toggleUserCondition,
  toggleCommentCondition,
})(Inputs);