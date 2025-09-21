import React, { useState } from "react";
import { MenuItem, Menu, Popup, Button } from "semantic-ui-react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import notebook from "../Assests/notebook.png";
import avatar from "../Assests/avatar.png";
import { useToast } from "@chakra-ui/react";
import { Modal } from "semantic-ui-react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Navbar = () => {
  const gohome = () => {
    navigate("/");
  };

  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  const token = sessionStorage.getItem("Token");
  const name = sessionStorage.getItem("Name");

  const logout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Name");
    setOpen(false);
    toast({
      position: "top",
      title: "Logout successfull 🙁",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    navigate("/login");
  };
  return (
    <div className="navbar">
      <Menu borderless className="navbar">
        <MenuItem className="logoDiv" onClick={gohome}>
          <img
            className="logo"
            src={notebook}
            alt="logo"
            style={{ width: 80, cursor: "pointer" }}
          />
          <h1>
            N<span>otes</span>
          </h1>
        </MenuItem>
        {token ? (
          <>
            <MenuItem className="menuitem" position="right">
              <Popup
                content={`Welcome! ${name}`}
                trigger={
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    className="menuitem"
                  >
                    <Avatar alt="user" src={avatar} />
                  </StyledBadge>
                }
              />
            </MenuItem>

            <>
              <MenuItem name="logout" className="menuitem">
                <Button onClick={openModal}>Logout</Button>
              </MenuItem>

              <Modal size="tiny" open={open} onClose={closeModal}>
                <Modal.Header>Logout from account 😬</Modal.Header>
                <Modal.Content>
                  <p>Are you sure? you cant access the notes if you logout</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button basic color="green" onClick={closeModal}>
                    No
                  </Button>
                  <Button positive onClick={logout}>
                    Yes
                  </Button>
                </Modal.Actions>
              </Modal>
            </>
          </>
        ) : (
          <>
            <MenuItem name="login" className="menuitem" position="right">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Navbar;
