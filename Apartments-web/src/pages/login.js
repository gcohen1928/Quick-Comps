import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import React, {useState, useEffect} from 'react'
  import { Notif } from '../components/Notifications/notif';
  import {Auth} from 'aws-amplify'
  import {useNavigate} from 'react-router-dom'
  
  export default function LogIn() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmail = (event) => setEmail(event.target.value)
    const handlePass = (event) => setPassword(event.target.value)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
          await Auth.signIn(email, password);
          Notif("Success!!", "Login Successfully", "success");
          navigate("/", { replace: true });
          window.location.reload(false)
        } catch (error) {
          Notif("Error", error.message, "danger");
        }
        setLoading(false);
      };


    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl isRequired id="email">
                <FormLabel>Email address</FormLabel>
                <Input value={email} onChange={handleEmail} type="email" />
              </FormControl>
              <FormControl isRequired id="password">
                <FormLabel>Password</FormLabel>
                <Input value={password} onChange={handlePass} type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'blue.400'}>Forgot password?</Link>
                </Stack>
                <Button
                  bg={'green.400'}
                  color={'white'}
                  _hover={{
                    bg: 'green.500',
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                  >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }