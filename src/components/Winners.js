import Modal from "../Modal";
import { Box, Paper, Fab, Typography } from "@mui/material";
import { connect } from "react-redux";
import { toggleModal } from "../actions/index";
import CircularProgress from '@mui/material/CircularProgress';
import SelectedUsersList from "./SelectedUsersList";

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
          { (winners.length) ?
          <>
          <SelectedUsersList 
          winners = {winners}
          title = "WINNERS"
          color = "#ffd600"
          />
          <SelectedUsersList
          winners = {reserveWinners}
          title = "RESERVE WINNERS"
          color = "#b0bec5" 
          />
            </>
            :
            <>
            <CircularProgress color="secondary" />
            <Typography variant="h6" color="primary">Loading ...</Typography>
            </>
          }
            
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


