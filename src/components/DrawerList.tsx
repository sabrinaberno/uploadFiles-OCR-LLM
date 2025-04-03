import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "./Button"; 

import { Chat, ChatHistory } from "@prisma/client";

interface DrawerMenuProps {
  chatList: Record<string, Chat & { ChatHistory: ChatHistory[] }>;
  setChatId: (id: string) => void;
  setOcrResult: (result: string) => void;
  setChatHistory: (history: ChatHistory[]) => void;
  setFile: (file: File | null) => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  chatList,
  setChatId,
  setOcrResult,
  setChatHistory,
  setFile
}) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const startNewChat = () => {
    setChatId("");
    setOcrResult("");
    setChatHistory([]);
    setFile(null);
  };

  const DrawerList = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
      <ListItemButton onClick={startNewChat}>
        <ListItemText primary="Novo Chat" />
      </ListItemButton>
        {Object.entries(chatList).map(([chatId]) => (
          <ListItem key={chatId} disablePadding>
            <ListItemButton onClick={() => setChatId(chatId)}>
              <ListItemText primary={chatId} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Button type="button" unstyled onClick={toggleDrawer(true)}>
        <MenuIcon fontSize="large" />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList/>
      </Drawer>
    </>
  );
};

export default DrawerMenu;
