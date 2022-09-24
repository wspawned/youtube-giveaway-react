import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Typography } from "@mui/material";

const SelectedUsersList = (props) =>  {
    const winners = props.winners;
    const title = props.title;
    const color = props.color;

    return <List>
      <Typography
        variant="h4"
        sx={{ color: {color}, textAlign: "center", m: "auto", width: "50%" }}
      >{title}</Typography>
      <Divider variant="inset" component="li" />
  
      {winners.map((winner, order) => {
        const rank = order + 1;
        const name = winner.name;
        const avatar = winner.avatar;
        const url = winner.url;
        const text = winner.text;
        const key = order;
  
        return (
          <>
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
                secondary={<>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {name}
                  </Typography>
                  {` — ${text}`}
                </>}
              ></ListItemText>
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        );
      })}+
  
    </List>;
  }

  export default SelectedUsersList;