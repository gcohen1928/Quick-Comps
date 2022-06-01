const axios = require("axios");
const cheerio = require("cheerio");

//let URL = 'https://www.apartments.com/arlington-tx-76010/'
let URL = 'https://www.apartments.com/?sk=83fcdebd8994b96d97e6a51a03319369&bb=h5th__m10J7tzpoH'


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
			console.log(i);
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
				const propYear = parseInt($("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(1) > div > div.column").text().trim().replace(/\D/g,''));
				var propUnitCount = $("#profileV2FeesWrapper > div.detailsContainer > div:nth-child(2) > div > div > div.component-body > ul > li:nth-child(2) > div > div.column").text().trim();
				propUnitCount = parseInt(propUnitCount.substring(0, propUnitCount.indexOf(' '))); 
				const propPhone = $("#officeHoursSection > div > div > div:nth-child(1) > div.phoneNumber > a").text().trim();
				const propLink = $("#officeHoursSection > div > div > div:nth-child(1) > div.mortar-wrapper > a").attr('href');

				if(propDesc == "houses"){
					var beds = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(1)').text().trim().replace(/\D/g,'');
					var baths = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(2)').text().trim().replace(/\D/g,'');
					var rent = $('#pricingView > div > div > div > div > div.column1 > div > h3 > span.rentLabel').text().trim().replace(/\D/g,'');
					var sqft = $('#priceBedBathAreaInfoWrapper > div > div > ul > li:nth-child(4) > div > p.rentInfoDetail').text().trim().replace(/\D/g,'');
					sqft = parseInt(sqft);
					var avail = $('#pricingView > div > div > div > div > div.column1 > div > h4 > span.detailsTextWrapper.leaseDepositLabel > span.availabilityInfo').text().trim();
					if(sqft == NaN){
						var psf = NaN;
					} else{
						var psf = Number(parseInt(rent) / sqft).toFixed(2);
					}
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
						rent: parseInt(rent),
						psf: parseFloat(psf),
						avail: avail,
						notes: "Single Family Home"
					});
					
				} else{
					let apartments = [];
					$('li[class ="unitContainer js-unitContainer "]').each(function () {
						var tmp = [];
						var beds = $(this).attr('data-beds');
						var baths = $(this).attr('data-baths');
						var rent = $(this).find('div[class = "pricingColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
						var sqft = $(this).find('div[class = "sqftColumn column"] span:nth-child(2)').text().trim().replace(/\D/g,'');
						var avail = $(this).find('div[class = "availableColumn column"] span[class = "dateAvailable"]').text().trim();
						avail = avail.substring(avail.indexOf('\n') + 1).trim();
						var psf = Number(parseInt(rent) / parseInt(sqft)).toFixed(2);
						//avail = convert_date(avail);
						if(rent > 0){
							tmp.push(parseInt(beds))
							tmp.push(parseInt(baths));
							tmp.push(parseInt(sqft));
							tmp.push(parseInt(rent));
							tmp.push(parseInt(psf));
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