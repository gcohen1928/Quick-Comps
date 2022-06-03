const axios = require("axios");
const cheerio = require("cheerio");

//let URL = 'https://www.apartments.com/arlington-tx-76010/'
let URL = 'https://www.apartments.com/?sk=83fcdebd8994b96d97e6a51a03319369&bb=h5th__m10J7tzpoH'



const link_to_csv = async (link) => {
	let records = [];

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
			console.log((i + 1).toString() + "st page being scraped");
			//// COMPLETION TRACKER ////

			try{

				const response = await axios.get(PROP_LINKS[i]);
				const $ = cheerio.load(response.data);
				
				const propDesc = $("#breadcrumbs-container > span:nth-child(1) > a").attr('data-type');
				const propName = $("#propertyName").text().trim();
				const propAddy = $("#propertyAddressRow > div > h2 > span:nth-child(1)").text().trim();
				const propCity = $("#propertyAddressRow > div > h2 > span:nth-child(2)").text().trim();
				const propState = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(1)").text().trim();
				const propZip = $("#propertyAddressRow > div > h2 > span.stateZipContainer > span:nth-child(2)").text().trim(); 
				const propPhone = $("#officeHoursSection > div > div > div:nth-child(1) > div.phoneNumber > a").text().trim();
				const propLink = $("#officeHoursSection > div > div > div:nth-child(1) > div.mortar-wrapper > a").attr('href');

				var propYear = 0000;
				var propUnitCount = 0000;
				$('#profileV2FeesWrapper > div.detailsContainer > div').each(function (){
					var tmp = $(this).find('h4[class="header-column"]').text().trim().toLowerCase();
					if(tmp == "property information"){
						propYear = $(this).find('li:nth-child(1)').text().trim().replace(/\D/g,'');
						propYear = propYear.length > 2 ? propYear : "NaN";
						propUnitCount = $(this).find('li:nth-child(2)').text().trim();
						propUnitCount = parseInt(propUnitCount.substring(0, propUnitCount.indexOf(' '))); 
					}
				})
				
				
				////////////////////////////// SINGLE FAMILY HOMES //////////////////////////////////
				if(propDesc == "houses"){
					var beds = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(1)').text().trim().replace(/\D/g,'');
					var baths = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(2)').text().trim().replace(/\D/g,'');
					var rent = $('#pricingView > div > div > div > div > div.column1 > div > h3 > span.rentLabel').text().trim().replace(/\D/g,'');
					var sqft = $('#priceBedBathAreaInfoWrapper > div > div > ul > li:nth-child(4) > div > p.rentInfoDetail').text().trim().replace(/\D/g,'');
					sqft = parseInt(sqft);
					if(sqft != NaN){
						if(sqft.length > 5){
							sqft = sqft.substring(0, sqft.indexOf(' '))
							sqft = sqft.replace(/\D/g,'');
						}
						var psf = Number(parseInt(rent) / sqft).toFixed(2);
					} else{
						var psf = NaN
					}

					var avail = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span.detailsTextWrapper.leaseDepositLabel > span.availabilityInfo').text().trim();
					if(avail == "Available Now"){
						avail = "Now";
					}
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
						bed: parseInt(beds),
						bath: parseInt(baths),
						sf: parseInt(sqft),
						rent: '$'.concat(parseInt(rent)),
						psf: '$'.concat(parseFloat(psf)),
						avail: avail,
						notes: "Single Family Home"
					});
					
				} 
				////////////////////////////// SINGLE FAMILY HOMES //////////////////////////////////
				
				else{
					let apartments = [];

					////////////////////////////// APARTMENTS WITH NO SPECIFIED UNITS //////////////////////////////////
					if($('li[class ="unitContainer js-unitContainer "]').length == 0){
						$('#pricingView > div.tab-section.active > div').each(function () {
							var tmp = []
							var beds = $(this).find('span[class= "detailsTextWrapper"] span:nth-child(1)').text().trim().replace(/\D/g,'');
							var baths = $(this).find('span[class= "detailsTextWrapper"] span:nth-child(2)').text().trim().replace(/\D/g,'');
							var sqft = $(this).find('span[class= "detailsTextWrapper"] span:nth-child(3)').text().trim().replace(/\D/g,'');
							if(sqft.length > 5){
								sqft = sqft.substring(0, sqft.indexOf(' '))
								sqft = sqft.replace(/\D/g,'');
							}
							var rent = $(this).find('span[class="rentLabel"]').text().trim().substring(1); //fix
							var avail = $(this).find('span[class="availabilityInfo"]').text().trim(); //fix
							if(rent.length > 7){
								rent = rent.substring(0, rent.indexOf(' '))
							}
							rent = parseInt(rent.replace(/\D/g,''));
							var psf = Number(parseInt(rent) / parseInt(sqft)).toFixed(2);
							if(rent > 0 && beds != NaN){
								tmp.push(parseInt(beds))
								tmp.push(parseInt(baths));
								tmp.push(parseInt(sqft));
								tmp.push('$'.concat(rent));
								tmp.push('$'.concat(parseFloat(psf)));
								tmp.push(avail);
								apartments.push(tmp);
							}						
						})
					}
					////////////////////////////// APARTMENTS WITH NO SPECIFIED UNITS //////////////////////////////////

					else{
						$('li[class ="unitContainer js-unitContainer "]').each(function () {
							var tmp = [];
							var beds = $(this).attr('data-beds');
							var baths = $(this).attr('data-baths');
							var rent = $(this).find('div[class = "pricingColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
							var sqft = $(this).find('div[class = "sqftColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
							if(sqft.length > 5){
								sqft = sqft.substring(0, sqft.indexOf(' '))
								sqft = sqft.replace(/\D/g,'');
							}
							var avail = $(this).find('div[class = "availableColumn column"] span[class = "dateAvailable"]').text().trim();
							avail = avail.substring(avail.indexOf('\n') + 1).trim();
							var psf = Number(parseInt(rent) / parseInt(sqft)).toFixed(2);
							if(rent > 0 && beds != NaN){
								tmp.push(parseInt(beds))
								tmp.push(parseInt(baths));
								tmp.push(parseInt(sqft));
								tmp.push('$'.concat(parseInt(rent)));
								tmp.push('$'.concat(parseFloat(psf)));
								tmp.push(avail);
								apartments.push(tmp);
							}
						});
					}

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
							avail: apartments[j][5],
							notes: "MF-APT"
						});
					}
				}
				
				} catch (error){
				throw error;
			}
		}	

	}catch (error){
		throw error;
	}

	console.log(records)
	return records

	////////////////////////////// WRITE TO CSV /////////////////////////////////////
}



module.exports = link_to_csv