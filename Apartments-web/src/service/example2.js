import { Box, Text } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import cheerioReact from "cheerio-react";

let URL = 'https://www.apartments.com/arlington-tx-76010/'
let FILE_NAME = 'apartments.csv' // name of file to be returned

let PROP_LINKS


export const writeCSV = async (link, fileName) => {

	////////////////////////////// CSV DECLERATION ///////////////////////////////////
	// const createCSVWriter = require("csv-writer").createObjectCsvWriter;

	// const csvWriter = createCSVWriter({
		
	// 	path: fileName,
	// 	header: [
	// 		{id: 'name', title: 'Property_Title'},
	// 		{id: 'state', title: 'State'},
	// 		{id: 'city', title: 'City'},
	// 		{id: 'zip', title: 'Zip'},
	// 	 	{id: 'addy', title: 'Address'},
	// 		{id: 'year', title: 'Year'},
	// 		{id: 'phone', title: 'Phone'},
	// 		{id: 'link', title: 'Link'},
	// 		{id: 'bed', title: 'Beds'},
	// 		{id: 'bath', title: 'Baths'},
	// 		{id: 'sf', title: 'SQFT'},
	// 		{id: 'rent', title: 'Rent'},
	// 		{id: 'psf', title: 'PSF'},
	// 		{id: 'num', title: 'APTCOUNT'},
	// 		{id: 'avail', title: 'Availabilty'}
	// 	]
	// });
	const records = [];
	////////////////////////////// CSV DECLERATION ///////////////////////////////////

	////////////////////////////// SCRAPE MAIN PAGE //////////////////////////////////
	let links = new Set(); //links for property pages to be scraped

	try {
		//grab link
		const response = await axios.get(link, {headers: {crossorigin:true, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }});

		const $ = cheerioReact.load(response.data);

		
		const propLinks = $('.property-link');

		propLinks.each((i, p) =>{
			const tmp = $(p).attr('href');
			links.add(tmp);
		})
		PROP_LINKS = Array.from(links);
	////////////////////////////// SCRAPE MAIN PAGE //////////////////////////////////


	////////////////////////////// SCRAPE PROPERTY PAGES /////////////////////////////
		for(let i = 0; i < 25; i++){

			//// COMPLETION TRACKER ////
			let complete = i*5;
			console.log(complete);
			
			//// COMPLETION TRACKER ////

			try{
				const response = await axios.get(PROP_LINKS[i]);
				const $ = cheerioReact.load(response.data);
				
				const propName = $("#propertyName").text().trim();
				const propAddy = $("#propertyAddressRow > div > h2 > span:nth-child(1)").text().trim();
				const propCity = $("#propertyAddressRow > div > h2 > span:nth-child(2)").text().trim();
				const propState = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(1)").text().trim();
				const propZip = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(2)").text().trim(); 
				const propYear = parseInt($("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(1) > div > div.column")
				.text().trim().replace(/\D/g,''));
				var propUnitCount = $("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(2) > div > div.column").text().trim();
				propUnitCount = parseInt(propUnitCount.substring(0, propUnitCount.indexOf(' '))); 
				const propPhone = $("#officeHoursSection > div > div > div:nth-child(1) > div.phoneNumber > a").text().trim();
				const propLink = $("#officeHoursSection > div > div > div:nth-child(1) > div.mortar-wrapper > a").attr('href');

				var apartments = [];
				$('li[class ="unitContainer js-unitContainer "]').each(function () {
					var tmp = [];
					var beds = $(this).attr('data-beds');
					var baths = $(this).attr('data-baths');
					var price = $(this).find('div[class = "pricingColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
					var sqft = $(this).find('div[class = "sqftColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
					var avail = $(this).find('div[class = "availableColumn column"] span[class = "dateAvailable"]').text().trim();
					avail = avail.substring(avail.indexOf('\n') + 1).trim();
					var psf = Number(parseInt(price) / parseInt(sqft)).toFixed(2);
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
                console.log(records)

			} catch (error){
				throw error;
			}

		}

	}catch (error){
		throw error;
	}
	return records

	////////////////////////////// WRITE TO CSV /////////////////////////////////////
}

