import {
    Box,
    Button,
    Divider,
    Heading,
    List,
    ListIcon,
    ListItem,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FaCheckCircle } from 'react-icons/fa';
  
  const STARTER = [
    { id: 1, desc: '5 comp sets per month' },
    { id: 2, desc: 'Access to our support team' },
    { id: 3, desc: 'Monthly Updates' },
  ];
  const PLUS = [
    { id: 1, desc: '50 comp sets per month' },
    { id: 2, desc: 'Access to our support team' },
    { id: 3, desc: 'Monthly Updates' },
  ];
  const PRO = [
    { id: 1, desc: '1,000 Unlimited comp sets per month' },
    { id: 2, desc: 'Access to our support team' },
    { id: 3, desc: 'Monthly Updates' },
  ];
  const PackageTier = ({
    title,
    options,
    typePlan,
    checked = false,
  }) => {
    const colorTextLight = checked ? 'white' : 'green.400';
    const bgColorLight = checked ? 'green.400' : 'gray.300';
  
    const colorTextDark = checked ? 'white' : 'green.400';
    const bgColorDark = checked ? 'green.400' : 'gray.300';
  
    return (
      <Stack
        p={3}
        py={3}
        justifyContent={{
          base: 'flex-start',
          md: 'space-around',
        }}
        direction={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{ md: 'center' }}>
        <Heading size={'md'}>{title}</Heading>
        <List spacing={3} textAlign="start">
          {options.map((desc, id) => (
            <ListItem key={desc.id}>
              <ListIcon as={FaCheckCircle} color="green.500" />
              {desc.desc}
            </ListItem>
          ))}
        </List>
        <Heading size={'xl'}>{typePlan}</Heading>
        <Stack>
          <Button
            size="md"
            color={useColorModeValue(colorTextLight, colorTextDark)}
            bgColor={useColorModeValue(bgColorLight, bgColorDark)}>
            Get Started
          </Button>
        </Stack>
      </Stack>
    );
  };
  const Pricing = () => {
    return (
      <Box py={6} px={5} min={'100vh'}>
        <Stack spacing={4} width={'100%'} direction={'column'}>
          <Stack
            p={5}
            alignItems={'center'}
            justifyContent={{
              base: 'flex-start',
              md: 'space-around',
            }}
            direction={{
              base: 'column',
              md: 'row',
            }}>
            <Stack
              width={{
                base: '100%',
                md: '40%',
              }}
              textAlign={'center'}>
              <Heading size={'lg'}>
                The Right Plan for <Text color="green.400">Your Business</Text>
              </Heading>
            </Stack>
            <Stack
              width={{
                base: '100%',
                md: '60%',
              }}>
              <Text textAlign={'center'}>
                Enjoy 5 free comp sets on us. If you're serioues about using our platform to expand your real estate business, choose from our paid options to get the full 
                Quick Comps experience
              </Text>
            </Stack>
          </Stack>
          <Divider />
          <PackageTier title={'Starter'} typePlan="Free" options={STARTER} />
          <Divider />
          <PackageTier
            title={'Lorem Plus'}
            checked={true}
            typePlan="$20.00"
            options={PLUS}
          />
          <Divider />
          <PackageTier title={'Lorem Pro'} typePlan="$50.00" options={PRO} />
        </Stack>
      </Box>
    );
  };
  
  export default Pricing;