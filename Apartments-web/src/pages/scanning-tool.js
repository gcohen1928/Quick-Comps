import {
    Stack,
    Flex,
    Button,
    Text,
    VStack,
    useBreakpointValue,
    RadioGroup,
    Radio,
    Link,
    Box,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Progress,
    SimpleGrid,
    Spacer
} from '@chakra-ui/react';
import WithSpeechBubbles from '../components/Testimonials/testimonials';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { API_KEY } from '../keys/key';
import { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { writeCSV } from '../service/example2';
import { CSVLink } from 'react-csv';
import { CSVHEADER, ERRORS } from '../text/text';
import { RotatingSquare, ThreeDots } from 'react-loader-spinner'
import Amplify, { API } from 'aws-amplify'
import { API_CLIENT, API_INIT } from '../configs/aws-configs';



export default function ScanningTool() {
    const [searchVal, setSearchVal] = useState(null)
    const [type, setType] = useState('locality')
    const [formattedVal, setFormattedVal] = useState('')
    const [loadingVal, setLoadingVal] = useState(0)
    const [data, setData] = useState(['Empty!'])

    const resetData = () => {
        setData(['Empty!'])
        setSearchVal(null)
    }

    const getLink = async () => {
        setData([])
        const myInit = { // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            pathParameters: {  // OPTIONAL
                link: 'merrick-ny',
            },
        };
        try {
            API.get(API_CLIENT.api, API_CLIENT.path + formattedVal)
                .then(response => {
                    console.log(response)
                    if (Object.keys(response).length > 0){
                            setData(response)
                        }
                    else if (Object.keys(response).length === 0) {
                        console.log('didnt work 1')
                        setData(['Error', ERRORS[204]])
                    } else if (response.status === 503) {
                        console.log('didnt work 2')
                        setData(['Error', ERRORS[503]])
                    }
                    else {
                        setData(["Error", ERRORS[1]])
                    }
                }).catch(e => {
                    console.log('didn\'t work! 3')
                    setData(['Error', ERRORS[1]])
                    console.error(e)
                })
        }
        catch (err) {
            setData(['Error', 'misc'])
            console.log('Didnt work 4!')
            console.error(err)

        }
    }

    useEffect(() => {
        //var new_str = "helloo"
        if (searchVal && type === "locality") {
            console.log(searchVal)
            var stringArray = searchVal.label.split(",")
            console.log(stringArray)
            var city = stringArray[0].toString().toLowerCase().replace(" ", "-")
            var state = stringArray[1].toString().toLowerCase().replace(" ", "")
            setFormattedVal(city + "-" + state)
        }
        //TO DO Implement search by zipcode
        else if (searchVal && type === "address") {
            var stringArray = searchVal.label.split(",")
            var address = stringArray[0].toString().toLowerCase().replace(" ", "-")
            console.log(address)
            // addressArray[-1] = suffix.abbreviate(addressArray[-1])
            //var newAddress = addressArray
            var city = stringArray[1].toString().toLowerCase().replace(" ", "")
            var state = stringArray[2].toString().toLowerCase().replace("", "")
            setFormattedVal(address + "_" + city + "-" + state)
        } else if (searchVal && type === "postal_code") {
            var stringArray = searchVal.label.split(",")
            var city = stringArray[0].toString().toLowerCase().replace(" ", "-");
            stringArray[1] = stringArray[1].trim();
            var state = stringArray[1].substring(0, stringArray[1].indexOf(' ')).toLowerCase();
            var zip = stringArray[1].substring(stringArray[1].indexOf(' ') + 1);
            setFormattedVal(city + '-' + state + '-' + zip);
        }
        //TO DO Implement search by zipcode
    }, [searchVal]);


    return (
        <>
            <Flex
                w={'full'}
                h={'65vh'}
                backgroundImage={
                    'url(https://i.postimg.cc/bv0FR9kk/image-1.jpg)'

                }
                backgroundSize={'cover'}
                backgroundPosition={'center center'}
            >
                <VStack
                    w={'full'}
                    justify={'center'}
                    px={useBreakpointValue({ base: 4, md: 8 })}
                    bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
                    <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
                        <Text
                            color={'white'}
                            fontWeight={700}
                            lineHeight={1.2}
                            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
                        >
                            Search for any city or town here:
                        </Text>
                        <Stack w="full">
                            <RadioGroup p={2} rounded="md" bg={"green.400"} defaultValue={'locality'} color="white" onChange={setType} value={type}>
                                <Stack direction='row' justifyContent={"space-evenly"}>
                                    <Radio value='locality'>Cities and Towns</Radio>
                                    <Radio value='postal_code'>Postal Code</Radio>
                                </Stack>
                            </RadioGroup>
                            <GooglePlacesAutocomplete
                                apiKey={API_KEY}
                                selectProps={{
                                    searchVal,
                                    onChange: setSearchVal,
                                    isClearable: true,
                                    placeholder: "Search for a place ... ",
                                    noOptionsMessage: () => { return 'Type something in!' }
                                }}
                                autocompletionRequest={{ types: [type],   componentRestrictions: { country: "us" }}}
                                debounce={2000}
                                minLengthAutocomplete={3}
                            />
                            {searchVal && data.length === 1 &&
                                <Button _hover={{
                                    background: "green.400",
                                    color: "white",
                                }} w="full" color={'green.400'} bg={'white'}
                                    onClick={getLink}
                                >
                                    Submit
                                </Button>
                            }
                            {data.length === 0 &&
                                <>
                                    < Stack w='full' justifyContent={'center'} alignItems="center" >
                                        <ThreeDots ariaLabel="rotating-square" visible={true} color="white" />
                                        <Text alignSelf={'center'} fontSize="2xl" color="white">Your CSV is loading ... This should take up to 1 minute</Text>
                                        <Text alignSelf={'center'} color="white">A link to receive your file will show here soon!</Text>
                                    </Stack>
                                    {/* <Progress colorScheme="green" isAnimated hasStripe height={'25px'}
                                        value={100} /> */}
                                </>
                            }
                            {data && data.length > 1 && (data[0] !== 'Error') && (
                                <Alert
                                    status='success'
                                    variant='subtle'
                                    flexDirection='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    textAlign='center'
                                    height='250px'
                                >
                                    <AlertIcon boxSize='40px' mr={0} />
                                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                                        Success! Your CSV File has been generated
                                    </AlertTitle>
                                    <AlertDescription maxWidth='sm'>
                                        Press the button below to download your CSV file
                                    </AlertDescription>
                                    <Flex justifyContent={'space-between'}>
                                        <CSVLink headers={CSVHEADER} data={data} filename={`quickcomps/${formattedVal}.csv`}>
                                            <Button

                                                _hover={{
                                                    background: "green.400",
                                                    color: "white",
                                                }} w="full" color={'white'} bg={'green.600'}
                                                mt={5} mr={5} alignSelf={'center'}>Download CSV</Button>
                                        </CSVLink>
                                        <Button
                                            ml={5}
                                            _hover={{
                                                background: "green.400",
                                                color: "white",
                                            }}
                                            onClick={resetData}
                                            color={'white'} bg={'teal.400'} mt={5} alignSelf={'center'}>
                                            Search Again
                                        </Button>
                                    </Flex>
                                </Alert>

                            )}
                            {data && data.length > 1 && (data[0] === 'Error') &&
                                <Alert
                                    status='error'
                                    variant='subtle'
                                    flexDirection='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    textAlign='center'
                                    height='250px'
                                >
                                    <AlertIcon boxSize='40px' mr={0} />
                                    <AlertTitle mt={4} mb={5} fontSize='lg'>
                                        Uh Oh!
                                    </AlertTitle>
                                    <AlertDescription maxWidth='sm'>
                                        {data[1]}
                                    </AlertDescription>
                                    <Button
                                        _hover={{
                                            background: "white",
                                            color: "red.400",
                                        }}
                                        onClick={resetData}
                                        color={'white'} bg={'red.400'} mt={5} alignSelf={'center'}>
                                        Search Again
                                    </Button>
                                </Alert>
                            }
                        </Stack>
                    </Stack>
                </VStack>
            </Flex>
            <WithSpeechBubbles />
        </>
    );
}