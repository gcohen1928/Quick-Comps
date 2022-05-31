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
    Progress,
    ProgressLabel
} from '@chakra-ui/react';
import WithSpeechBubbles from '../components/Testimonials/testimonials';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { API_KEY } from '../keys/key';
import { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { writeCSV } from '../service/example2';
import { CSVLink } from 'react-csv';

const header = [
    { label: 'Property_Title', key: 'name' },
    { label: 'State', key: 'state' },
    { label: 'City', key: 'city' },
    { label: 'Zip', key: 'zip' },
    { label: 'Address', key: 'addy' },
    { label: 'Year', key: 'year' },
    { label: 'Phone', key: 'phone' },
    { label: 'Link', key: 'link' },
    { label: 'Beds', key: 'bed' },
    { label: 'Baths', key: 'bath' },
    { label: 'SQFT', key: 'sf' },
    { label: 'Rent', key: 'rent' },
    { label: 'PSF', key: 'psf' },
    { label: 'APTCOUNT', key: 'num' },
    { label: 'Availabilty', key: 'avail' }




]

var suffix = require("street-suffix")
// import { geocodeByAddress } from 'react-google-places-autocomplete';





export default function ScanningTool() {
    const [searchVal, setSearchVal] = useState('')
    const [type, setType] = useState('locality')
    const [formattedVal, setFormattedVal] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const formatCity = (str) => {
        var stringArray = str.split(',')
        var city = stringArray[0].toStrig().toLowerCase().replace(" ", "-")
        var state = stringArray[1].toString().toLowerCase()
        return city + "-" + state
    }

    const getLink = async () => {
        setLoading(true)
        try {
            fetch('http://localhost:8000/api/scrape', { headers: { 'link': `https://apartments.com/${formattedVal}` } })
                .then(response => {
                    response.json().then(data => {
                        console.log('Worked!')
                        console.dir(data)
                        console.log(data)
                        setData(data)
                    })
                })
        }
        catch (e) {
            setData([])
            console.log('Didnt work!')
        }
        setLoading(false)
    }

    useEffect(() => {
        //var new_str = "helloo"
        if (searchVal && type === "locality") {
            var stringArray = searchVal.label.split(",")
            var city = stringArray[0].toString().toLowerCase().replace(" ", "-")
            var state = stringArray[1].toString().toLowerCase().replace(" ", "")
            setFormattedVal(city + "-" + state)
        }
        else if (searchVal && type === "address") {
            var stringArray = searchVal.label.split(",")
            var address = stringArray[0].toString().toLowerCase().replace(" ", "-")
            console.log(address)
            // addressArray[-1] = suffix.abbreviate(addressArray[-1])
            //var newAddress = addressArray
            var city = stringArray[1].toString().toLowerCase().replace(" ", "")
            var state = stringArray[2].toString().toLowerCase().replace("", "")
            setFormattedVal(address + "_" + city + "-" + state)
        }
    }, [searchVal]);

    return (
        <>
            <Flex
                w={'full'}
                h={'50vh'}

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
                            {loading !== false && < Stack >
                                <Text alignSelf={'center'} color="white">Your CSV is loading ... {64}%</Text>
                                <Progress isAnimated colorScheme={'green'} hasStripe size='lg' value={64} />
                            </Stack>}
                            {data && data.length > 0 && (
                                <CSVLink headers={header} data={data} filename="bsedata.csv">
                                    <Button>DownLoad CSV</Button>
                                </CSVLink>
                            )}
                        </Stack>
                    </Stack>
                </VStack>
            </Flex>
            <WithSpeechBubbles />
        </>

    );
}