import { Box, Avatar, Paper, Typography } from "@mui/material";

export  const Message = ({ message }: { message: any }) => {
    const isOther = message.sender === "other";
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isOther ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isOther ? "row" : "row-reverse",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: isOther ? "primary.main" : "secondary.main" }}>
            {isOther ? "O" : "U"}
          </Avatar>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              ml: isOther ? 1 : 0,
              mr: isOther ? 0 : 1,
              backgroundColor: isOther ? "primary.light" : "secondary.light",
              borderRadius: isOther ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Paper>
        </Box>
      </Box>
    );
  };