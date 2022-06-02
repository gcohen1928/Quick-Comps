export const CSVHEADER = [
    { label: 'Property_Title', key: 'name' },
    { label: 'State', key: 'state' },
    { label: 'City', key: 'city' },
    { label: 'Zip', key: 'zip' },
    { label: 'Address', key: 'addy' },
    { label: 'Year', key: 'year' },
    { label: '#_Units', key: 'count' },
    { label: 'Beds', key: 'bed' },
    { label: 'Baths', key: 'bath' },
    { label: 'SQFT', key: 'sf' },
    { label: 'Rent', key: 'rent' },
    { label: 'PSF', key: 'psf' },
    { label: 'Availabilty', key: 'avail' },
    { label: 'Notes', key: 'notes'},
    { label: 'Phone', key: 'phone' },
    { label: 'Link', key: 'link' }
]

export const ERRORS = {
    204 : 'No properties available in this location. Please search another place',
    503 : 'Make sure your searching only in the US.\nIf not, our servers might be down so check in again shortly!',
    1 : 'It looks like your computer failed to reach our servers. Ensure you have a good internet connection and try again.'
}
