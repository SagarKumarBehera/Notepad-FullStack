import React from "react";
import { json, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesubmit = () => {

    const payload = JSON.stringify({ email, password });

    return fetch("https://notepad-backend-production.up.railway.app/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.msg === "login succcessful") {
          const token = res.userData.token;
          const name = res.userData.name;
          sessionStorage.setItem("Token", token);
          sessionStorage.setItem("Name", name);
          toast({
            position: "top",
            title: res.msg,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/");
        } else {
          toast({
            position: "top",
            title: res.msg || "Login failed",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast({
          position: "top",
          title: "An error occurred during login",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const navigate = useNavigate();
  const toast = useToast();

  const signup = () => {
    navigate("/signup");
  };

  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh" }}
      verticalAlign="middle"
      className="signupmain"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" textAlign="center" className="formheader">
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={handlesubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
            />

            <Button className="button" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <a onClick={signup}>Signup</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
