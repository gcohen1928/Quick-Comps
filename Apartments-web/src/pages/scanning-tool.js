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
    Progress
} from '@chakra-ui/react';
import WithSpeechBubbles from '../components/Testimonials/testimonials';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { API_KEY } from '../keys/key';
import { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { writeCSV } from '../service/example2';
import { CSVLink } from 'react-csv';
import { CSVHEADER, ERRORS } from '../text/text';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'



var suffix = require("street-suffix")
// import { geocodeByAddress } from 'react-google-places-autocomplete';


export default function ScanningTool() {
    const [searchVal, setSearchVal] = useState('')
    const [type, setType] = useState('locality')
    const [formattedVal, setFormattedVal] = useState('')
    const [loadingVal, setLoadingVal] = useState(0)
    const [data, setData] = useState(['Empty!'])

    const formatCity = (str) => {
        var stringArray = str.split(',')
        var city = stringArray[0].toStrig().toLowerCase().replace(" ", "-")
        var state = stringArray[1].toString().toLowerCase()
        return city + "-" + state
    }



    const getLink = async () => {
        setData([])
        try {
            fetch('http://localhost:8000/api/scrape', { headers: { 'link': `https://apartments.com/${formattedVal}` } })
                .then(response => {
                    if (response.status === 200)
                        response.json().then(data => {
                            console.log('Worked!')
                            setData(data)
                        })
                    else if (response.status === 204) {
                        setData(['Error', ERRORS[204]])
                    } else if (response.status === 503) {
                        setData(['Error', ERRORS[503]])
                    }
                }).catch(e => {
                    setData(['Error', ERRORS[1]])
                    console.error(e)
                })
        }
        catch (err) {
            setData(['Error', 'misc'])
            console.log('Didnt work 2!')
            console.error(err)

        }
    }

    useEffect(() => {
        //var new_str = "helloo"
        if (searchVal && type === "locality") {
            var stringArray = searchVal.label.split(",")
            var city = stringArray[0].toString().toLowerCase().replace(" ", "-")
            var state = stringArray[1].toString().toLowerCase().replace(" ", "")
            setFormattedVal(city + "-" + state)
        }
        //TO DO Implement search by zipcode
        else if (searchVal && type === "address") {
            var stringArray = searchVal.label.split(",")
            var addyArray = stringArray[0].toString().toLowerCase().split(" ")
            var address = ""
            var directions = {
                "north":"n",
                "south":"s",
                "east":"e",
                "west":"w"
            }
            for(let i = 0; i < addyArray.length; i++){
                var cur = addyArray[i];
                if(suffix.abbreviate(cur) == undefined && directions[cur] == undefined){
                    address += cur
                } else if(directions[cur] != undefined){
                    address += directions[cur]
                } else{
                    address += suffix.abbreviate(cur).toLowerCase()
                }
                if(i != addyArray.length - 1){
                    address += '-'
                }
            }
            var city = stringArray[1].toString().toLowerCase().replace(" ", "")
            var state = stringArray[2].toString().toLowerCase().replace("", "")
            state = state.trim()
            console.log(address + "_" + city + "-" + state)
            setFormattedVal(address + "_" + city + "-" + state)
        } else if (searchVal && type === "postal_code"){
            var stringArray = searchVal.label.split(",")
            var city = stringArray[0].toString().toLowerCase().replace(" ", "-");
            stringArray[1] = stringArray[1].trim();
            var state = stringArray[1].substring(0, stringArray[1].indexOf(' ')).toLowerCase();
            var zip =  stringArray[1].substring(stringArray[1].indexOf(' ') + 1);
            setFormattedVal(city + '-' + state + '-' + zip);
        }

    }, [searchVal]);


    return (
        <>
            <Flex
                w={'full'}
                h={'60vh'}
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
                                    <Radio value='address'>Address</Radio>
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
                                autocompletionRequest={{ types: [type] }}
                                debounce={2000}
                                minLengthAutocomplete={3}
                            />
                            {(searchVal !== "") &&
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
                                < Stack w='full' justifyContent={'center'} >

                                    <Text alignSelf={'center'} color="white">Your CSV is loading ... This should take up to 1 minute</Text>
                                    <Progress colorScheme="green" isAnimated hasStripe height={'25px'}
                                        value={100} />
                                </Stack>}
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
                                    <CSVLink headers={CSVHEADER} data={data} filename={`quick-comps-${formattedVal}.csv`}>
                                        <Button

                                            _hover={{
                                                background: "green.400",
                                                color: "white",
                                            }} w="full" color={'white'} bg={'green.600'}
                                            mt={5} alignSelf={'center'}>Download CSV</Button>
                                    </CSVLink>
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
                                    height='200px'
                                >
                                    <AlertIcon boxSize='40px' mr={0} />
                                    <AlertTitle mt={4} fontSize='lg'>
                                        Uh Oh!
                                    </AlertTitle>
                                    <AlertTitle mt={2} mb={4} fontSize='md'>
                                        It looks like an error has occcured:
                                    </AlertTitle>
                                    <AlertDescription maxWidth='sm'>
                                        {data[1]}
                                    </AlertDescription>
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