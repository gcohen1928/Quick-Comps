const axios = require("axios");
const cheerio = require("cheerio");

let NUMBER_OF_RESULTS = 25 // Can be less than 25
let URL = 'https://www.apartments.com/arlington-tx-76010/'


function link_to_fileName(link){
	let tmp = link.substring(link.indexOf(".com") + 5);
	tmp = tmp.substring(0, tmp.indexOf('/'));
	tmp = tmp.concat('---');

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
	var yyyy = today.getFullYear();

	today = mm + '-' + dd + '-' + yyyy;
	
	tmp = tmp.concat(today);

	return tmp.concat(".csv");
}

function convert_date(date){
	var months = {
		Jan:1,
		Feb:2,
		Mar:3,
		Apr:4,
		May:5,
		Jun:6,
		Jul:7,
		Aug:8,
		Sep:9,
		Oct:10,
		Nov:11,
		Dec:12
	}
	if(!(date === "Now")){
		var day = months[date.substring(0,3)];
		day = day.toString();
		day = day.concat("/");
		day = day.concat(date.slice(-2));
		return day;

	} else{
		return date;
	}
}


const link_to_csv = async (link) => {
	let fileName = link_to_fileName(link);
	fileName = "./apartment_csvs/".concat(fileName);
	////////////////////////////// CSV DECLERATION ///////////////////////////////////

	const createCSVWriter = require("csv-writer").createObjectCsvWriter;

	const csvWriter = createCSVWriter({
		
		path: fileName,
		header: [
			{id: 'name', title: 'Property_Title'},
			{id: 'state', title: 'State'},
			{id: 'city', title: 'City'},
			{id: 'zip', title: 'Zip'},
		 	{id: 'addy', title: 'Address'},
			{id: 'year', title: 'Year'},
			{id: 'phone', title: 'Phone'},
			{id: 'link', title: 'Link'},
			{id: 'bed', title: 'Beds'},
			{id: 'bath', title: 'Baths'},
			{id: 'sf', title: 'SQFT'},
			{id: 'rent', title: 'Rent'},
			{id: 'psf', title: 'PSF'},
			{id: 'num', title: 'APTCOUNT'},
			{id: 'avail', title: 'Availabilty'}
		]
	});
	let records = [];
	////////////////////////////// CSV DECLERATION ///////////////////////////////////

	////////////////////////////// SCRAPE MAIN PAGE //////////////////////////////////
	let links = new Set(); //links for property pages to be scraped

	try {
		//grab link
		const response = await axios.get(link);
		const $ = cheerio.load(response.data);

		const propLinks = $('.property-link');

		propLinks.each((i, p) =>{
			const tmp = $(p).attr('href');
			links.add(tmp);
		})
		console.log(links);
		let PROP_LINKS = [];
		PROP_LINKS = Array.from(links);
	////////////////////////////// SCRAPE MAIN PAGE //////////////////////////////////

	
	////////////////////////////// SCRAPE PROPERTY PAGES /////////////////////////////
		for(let i = 0; i < PROP_LINKS.length; i++){

			//// COMPLETION TRACKER ////
			console.log(i);
			//// COMPLETION TRACKER ////

			try{
				const response = await axios.get(PROP_LINKS[i]);
				const $ = cheerio.load(response.data);
				
				const propName = $("#propertyName").text().trim();
				const propAddy = $("#propertyAddressRow > div > h2 > span:nth-child(1)").text().trim();
				const propCity = $("#propertyAddressRow > div > h2 > span:nth-child(2)").text().trim();
				const propState = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(1)").text().trim();
				const propZip = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(2)").text().trim(); 
				const propYear = parseInt($("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(1) > div > div.column").text().trim().replace(/\D/g,''));
				var propUnitCount = $("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(2) > div > div.column").text().trim();
				propUnitCount = parseInt(propUnitCount.substring(0, propUnitCount.indexOf(' '))); 
				const propPhone = $("#officeHoursSection > div > div > div:nth-child(1) > div.phoneNumber > a").text().trim();
				const propLink = $("#officeHoursSection > div > div > div:nth-child(1) > div.mortar-wrapper > a").attr('href');
				let apartments = [];
				$('li[class ="unitContainer js-unitContainer "]').each(function () {
					var tmp = [];
					var beds = $(this).attr('data-beds');
					var baths = $(this).attr('data-baths');
					var price = $(this).find('div[class = "pricingColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
					var sqft = $(this).find('div[class = "sqftColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
					var avail = $(this).find('div[class = "availableColumn column"] span[class = "dateAvailable"]').text().trim();
					avail = avail.substring(avail.indexOf('\n') + 1).trim();
					var psf = Number(parseInt(price) / parseInt(sqft)).toFixed(2);
					//avail = convert_date(avail);
					if(price > 0){
						tmp.push(parseInt(beds))
						tmp.push(parseInt(baths));
						tmp.push(parseInt(sqft));
						tmp.push(parseInt(price));
						tmp.push(psf);
						tmp.push(avail);
						apartments.push(tmp);
					}
				});
		////////////////////////////// SCRAPE PROPERTY PAGES /////////////////////////////

		////////////////////////////// WRITE TO CSV /////////////////////////////////////
				for(let j = 0; j < apartments.length; j++){
					records.push({
						name: propName,
						state: propState,
						zip: propZip,
						city: propCity,
						addy: propAddy,
						year: propYear,
						count: propUnitCount,
						phone: propPhone,
						link: propLink,
						bed: apartments[j][0],
						bath: apartments[j][1],
						sf: apartments[j][2],
						rent: apartments[j][3],
						psf: apartments[j][4],
						avail: apartments[j][5]
					});
				}
			} catch (error){
				throw error;
			}


		}

	}catch (error){
		throw error;
	}
	// csvWriter.writeRecords(records).then(() => {
	// 	console.log("...Done");
	// });
	console.log(records)
	return records

	////////////////////////////// WRITE TO CSV /////////////////////////////////////
}

//link_to_csv(URL);

module.exports = link_to_csv