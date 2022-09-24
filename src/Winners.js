import Modal from "./Modal";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Box, Paper, Fab, Typography, Divider, } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "./actions";

const Winners = (props) => {
    const showModal= props.showModal;
    const winners = props.winners;
    const reserveWinners = props.reserveWinners;

    return (
        showModal ? (
            <Modal>
        <Box
        sx={{maxWidth:"100vw", minHeight:"100vh", bgcolor:"#78909c", 
      zIndex:10, position:"absolute", left:0, right:0, top:0, 
      justifyContent:"center", alignContent:"center", display:"flex", py:3, }}
        >
          <Paper
          elevation="24"
          sx={{width:"50%", m:"auto", p:2  }}
          >
          <Fab
          sx={{color:"red",  bgcolor:"white", float:"right", zIndex:"10",
          height:"20px", width:"35px", fontSize:15, textAlign:"center" }}
          onClick={()=> props.toggleModal()}
          >X</Fab>
            <List>
              <Typography
              variant="h4"
              sx={{color:"#ffd600", textAlign:"center", m:"auto", width:"50%" }}
              >WINNERS</Typography>
              <Divider variant="inset" component="li" />
              
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
                    key={key}
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
          

          
            <List>
            <Typography
              variant="h4"
              sx={{color:"#b0bec5", textAlign:"center", }}
              >RESERVE WINNERS
              </Typography>
              <Divider variant="inset" component="li" />
              
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
                    key={key}
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
            </Paper>
        </Box>
        </Modal>  
          ) : null
    )
}

const mapStateToProps = state => {
    return {
      winners: state.winners,
      reserveWinners: state.reserveWinners,
      showModal: state.showModal
    }
}

export default connect(mapStateToProps, {toggleModal} )(Winners);