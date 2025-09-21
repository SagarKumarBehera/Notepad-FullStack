import {useToast} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Grid, Header,Message, Segment,Dropdown } from 'semantic-ui-react'

const Signup = () => {


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [country,setCountry] = useState("");
  const [password,setPassword] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handlesubmit = () => {
    // console.log(name)
    // console.log(email)
    // console.log(country)
    // console.log(password)
    const payload = JSON.stringify({ name,country,email, password });
    fetch("https://notepad-backend-production.up.railway.app/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.msg === 'User Created!!') {
          toast({
            position: "top",
            title: res.msg,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/login");
        } else {
          toast({
            position: "top",
            title: res.msg || "Signup failed",
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
          title: "An error occurred during Signup ",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      });
  }
    const countryOptions = [
       { key: '', value: '', text: 'Select Country'},
        { key: 'in', value: 'in', text: 'India' },
        { key: 'pk', value: 'pk', text: 'Pakistan' },
        { key: 'ch', value: 'ch', text: 'China' },
        { key: 'af', value: 'af', text: 'Afghanistan' },
        { key: 'ax', value: 'ax', text: 'Aland Islands' },
        { key: 'al', value: 'al', text: 'Albania' },
        { key: 'dz', value: 'dz', text: 'Algeria' },
        { key: 'as', value: 'as', text: 'American Samoa' },
        { key: 'ad', value: 'ad', text: 'Andorra' },
        { key: 'ao', value: 'ao', text: 'Angola' },
        { key: 'ai', value: 'ai', text: 'Anguilla' },
        { key: 'ag', value: 'ag', text: 'Antigua' },
        { key: 'ar', value: 'ar', text: 'Argentina' },
        { key: 'am', value: 'am', text: 'Armenia' },
        { key: 'aw', value: 'aw', text: 'Aruba' },
        { key: 'au', value: 'au', text: 'Australia' },
        { key: 'at', value: 'at', text: 'Austria' },
        { key: 'az', value: 'az', text: 'Azerbaijan' },
        { key: 'bs', value: 'bs', text: 'Bahamas' },
        { key: 'bh', value: 'bh', text: 'Bahrain' },
        { key: 'bd', value: 'bd', text: 'Bangladesh' },
        { key: 'bb', value: 'bb', text: 'Barbados' },
        { key: 'by', value: 'by', text: 'Belarus' },
        { key: 'be', value: 'be', text: 'Belgium' },
        { key: 'bz', value: 'bz', text: 'Belize' },
      ]

      

      const login = () => {
        navigate('/login')
      }

    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' className='signupmain'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' className='formheader'>
          Create your account
        </Header>
        <Form size='large' onSubmit={handlesubmit}>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='Enter your name..' value={name} onChange={(e) => { setName(e.target.value) }} />
            <Form.Input fluid icon='at' iconPosition='left' placeholder='E-mail address' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <Form.Field fluid>
              <Dropdown
                placeholder='Select Country'
                fluid
                selection
                options={countryOptions}
                value={country}
                onChange={(e, { value }) => { setCountry(value) }} 
              />
            </Form.Field>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <Button fluid size='large' className='button' type='submit'>
              Signup
            </Button>
          </Segment>
        </Form>
        <Message>
          Already have an account? <a onClick={login}>Login</a>
        </Message>
      </Grid.Column>
    </Grid>
    )
}

export default Signup