mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbHZoZXN0ZXIiLCJhIjoiY2poNnhtdW1yMDIxajMwbm8xaGpqdjVwMCJ9.qwq6wgBnOEsl211_5F6SOw';

var centerCoord = [-97.3828125, 38.54816542304656];
//var centerCoord = [-157, 21];

var usBounds = [
    [-127.13, 24.05], // Southwest coordinates
    [-63.9, 52]  // Northeast coordinates
];

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9?optimize=true',
    center: centerCoord,
    zoom: 3.8,
	interactive:false,
});

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

if (isMobile) {
	d3.select("#loading").style("display", "none");
	d3.select("#scroll").style("display", "none");
	d3.select("#outro").style("display", "none");
	d3.select('#mobile')
		.style("display", "block");
}

map.on('style.load', () => {

	var marker = new mapboxgl.Marker()
		.setLngLat([40, 74])
		.addTo(map);

		var allCityData;
		var currentQuarter = 3;
		var currentIndex = 0;
		var honoluluIndex;
		var loaded = false;
		var outlinesCreated = false;
		var quarterRank = ['rank_Q22017', 'rank_Q32017', 'rank_Q42017', 'rank_Q12018'];
		var quarterRankChange = ['rank_change_Q22017', 'rank_change_Q32017', 'rank_change_Q42017', 'rank_change_Q12018' ];
		var quarterNetChange = ['net_change_Q22017', 'net_change_Q32017', 'net_change_Q42017', 'net_change_Q12018'];
		var topFiveCities = ['Austin', 'Miami', 'Atlanta', 'Phoenix', 'Charlotte'];
		var topFiveHoods = {
			Austin: ['East Austin', 'South Austin', 'Downtown'],
			Miami: ['Downtown', 'Brickell', 'Coconut Grove'],
			Atlanta: ['Midtown', 'Buckhead', 'Downtown'],
			Phoenix: [],
			Charlotte: ['Ballantyne', 'University City', 'Uptown']
		};
		var topFiveCategoryData;
		var categoryKey = {
			1: 'Home Services', 
			2: 'Health',
			3: 'Food', 
			4: 'Active', 
			5: 'Event Services',
			6: 'Nightlife',
			7: 'Auto',
			8: 'Beauty Services',
			9: 'Restaurants', 
			10: 'Shopping' 
		};

		//Number formatting for population values
		var formatAsThousands = d3.format(',');  //e.g. converts 123456 to '123,456'
		var roundTwoDecimals = d3.format(".2f");
		var roundOneDecimal = d3.format(".1f");
		function aggregate(value, multiplier) {
			return Math.round(value/multiplier)*multiplier;
		}

		// using d3 for convenience
		var container = d3.select('#scroll');
		var graphic = container.select('.scroll__graphic');
		var text = container.select('.scroll__text');
		var step = text.selectAll('.step');
		var header = d3.select('.header-container');
		var card = d3.select('#city-info-card');
		var tooltip = d3.select('#tooltip');
		var popup;

		// initialize the scrollama
		var scroller = scrollama();

		var largeScreen = false,
			mediumScreen = false,
			smallScreen = false;

		var outlinesCreated = false;
	
	setup();
	map.on('click', 'cities', function (e) {
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'cities', function (e) {
       // map.getCanvas().style.cursor = 'pointer';
		var coordinates = e.features[0].geometry.coordinates.slice();
        var index = parseInt(e.features[0].properties.index);
		currentIndex = index;
		var thisCityData = allCityData[index];

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
		
		//tooltip.style('display', 'block')
		var left = e.point.x;
		var top = e.point.y;
		
		//updateToolTipLocation(left, top);
		card.style('opacity', '1')
			.style('pointer-events', 'all');
		updateCardContent(thisCityData);
    });
	
	d3.select('#honolulu-container').on('mouseover', function() {
		currentIndex = honoluluIndex;
		var thisCityData = allCityData[currentIndex];
		card.style('opacity', '1')
			.style('pointer-events', 'all');
		updateCardContent(thisCityData);
	});

    // Change it back to a poinWeeter when it leaves.
    map.on('mouseleave', 'cities', function (e) {
        map.getCanvas().style.cursor = '';
    });
	
	// generic window resize listener event
	function handleResize() {
		largeScreen = false,
		mediumScreen = false,
		smallScreen = false;
		
		if (Math.floor(window.innerWidth) >= 1000) {
			largeScreen = true;
		} else if (Math.floor(window.innerWidth) >= 764) {
			mediumScreen = true;
		} else {
			smallScreen = true;
		}

		
		/* 1. update height of step elements
		step.each(function(d) {
			if (d3.select(this).attr('data-step') != 6) {
				var stepContents = d3.select(this).select('.contents').node().getBoundingClientRect();
				var contentsHeight = stepContents.height;
				var stepMargin = Math.floor(window.innerHeight * 0.6);
				var stepHeight = contentsHeight + stepMargin;

				d3.select(this).style('height', stepHeight + 'px');
			}
		});
		*/
		
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicHeight = Math.floor(window.innerHeight);
		graphic
			.style('width', bodyWidth + 'px')
			.style('height', graphicHeight + 'px');

		step.each(function(d) {

				d3.select(this).style('height', graphicHeight + 'px');
		});
		
		d3.select('#loading').style('height', d3.select('#scroll').style('height'));
		d3.select('.loader-parent').style('height', d3.select('#scroll').style('height'));
		
		// 3. update location and sizing of final step header and card
		var headerHeight = header.node().offsetHeight,
			headerWidth = header.select('.header-text').node().offsetWidth,
			headerYVal = parseInt(header.style('top'), 10);
		
		if (largeScreen || mediumScreen) {
			if (largeScreen) {
				card.style('top', 40 + 'px')
					.style('max-height', window.innerHeight - 40 + 'px');
			} else {
				card.style('top', 40 + 'px')
					.style('max-height', window.innerHeight - 40 - 70 + 'px');
			}
			card.style('width', (window.innerWidth - headerWidth) / 2 + 'px')
				
		} else {
			card.style('top', headerYVal + 'px')
				.style('width', (window.innerWidth * 0.9) + 'px')
				.style('max-height', window.innerHeight * 0.9 + 'px');
		}
		
		if (loaded) {
			createStepBumpCharts();
			updateCardDotPlot(allCityData[currentIndex]);
			updateCardBumpChart(allCityData[currentIndex]);
		}
		// response = { element, direction, index }
		// add color to current step only

		var zoom,
			center,
			offset;
		
		toggleCityOutlines('hide');
		toggleCityLabels('show');
		
		var cardWidth = card.node().offsetWidth;
		center = centerCoord;
		if (smallScreen) {
			offset = [0, 0];
			zoom = 2;
		} else if (mediumScreen) {
			zoom = 2.3;
			offset = [-cardWidth / 2, 0];
		} else {
			zoom = 3.4;
			offset = [-cardWidth / 2, 0];
		}

		map.fitBounds(
			usBounds,
			{
				offset: offset,
				speed: 5, // make the flying slow
				curve: 1
			}
		);

		
		if (popup) {
			popup.remove();
		}
		// update graphic based on step
		
		// 4. tell scrollama to update new element dimensions
		scroller.resize();
	}
	// scrollama event handlers
	function handleStepEnter(response) {
		
	}
	
	function handleContainerEnter(response) {
	}

	function handleContainerExit(response) {
		if (response.direction == 'down') {
			var zoom,
			center,
			offset;

			d3.select('.mapboxgl-popup').remove();
			
			var cardWidth = card.node().offsetWidth;
			center = centerCoord;
			if (smallScreen) {
				offset = [0, 0];
				zoom = 2;
			} else if (mediumScreen) {
				zoom = 2.3;
				offset = [-cardWidth / 2, 0];
			} else {
				zoom = 3.4;
				offset = [-cardWidth / 2, 0];
			}

			map.fitBounds(
				usBounds,
				{
					offset: offset,
					speed: 5, // make the flying slow
		  			curve: 1,
				}
			);
		}
	}
	
	function setupStickyfill() {
		d3.selectAll('.sticky').each(function () {
			Stickyfill.add(this);
		});
	}
	
	function init() {
		setupStickyfill();
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll',
			graphic: '.scroll__graphic',
			text: '.scroll__text',
			step: '.scroll__text .step',
			debug: false,
			offset: 0.33,
		})
			.onStepEnter(handleStepEnter)
			.onContainerEnter(handleContainerEnter)
			.onContainerExit(handleContainerExit);
		// setup resize event
		window.addEventListener('resize', handleResize);
	}
	// kick things off
	init();

	function setup() {
		d3.queue()
			.defer(d3.csv, 'wp-content/uploads/2018/05/leo_data_Q1_2018.csv')
			.defer(d3.csv, 'wp-content/uploads/2018/05/category_ranks_by_metro.csv')
			.await(function(error, dataOne, dataTwo) {
				if (error) { throw error; }
				allCityData = dataOne;
				allCityData.sort(function(x, y){
					return d3.ascending(parseInt(x[quarterRank[currentQuarter]]), parseInt(y[quarterRank[currentQuarter]]));
				 });
				allCategoryData = dataTwo;
				cleanCityData(allCityData);
				cleanCategoryData(allCategoryData);
				topFiveCategoryData = allCategoryData.filter(function(d){
					if (topFiveCities.indexOf(d.city) > -1) {
						return true;
					}
				});
		
				createStepBumpCharts();
				makeCityOutlines();
				makeCityLabels();
				toggleCityOutlines('hide');
				toggleCityLabels('show');
	
				if (smallScreen) {
					card.style('opacity', '0')
						.style('pointer-events', 'none');
				}
				updateCardContent(allCityData[currentIndex]);
				loaded = true;
		});
	}
	
	function toggleZoom(setting) {
		if (setting == 'on') {
			map.doubleClickZoom.enable();
			map.dragPan.enable();
		} else {
			map.doubleClickZoom.disable();
			map.dragPan.disable();
		}
	}
	
	function makeCityOutlines() {
		map.addLayer({
			"id": "miami-shape",
			"type": "fill",
			"source": {
				type: 'vector',
				url: 'mapbox://michaelvhester.5bkx11du'
			},
			"source-layer": "MiamiMetro-dldjr6",
			"layout": {
			},
			"paint": { 
				"fill-color": "rgba(211, 35, 35, .2)",
				"fill-outline-color": "rgba(211, 35, 35, 1)"
			}
		});
	
		map.addLayer({
			"id": "cbsa-shape",
			"type": "fill",
			"source": {
				type: 'vector',
				url: 'mapbox://michaelvhester.60lqmilv'
			},
			"source-layer": "Other4CBSA-69igyr",
			"layout": {
			},
			"paint": { 
				"fill-color": "rgba(211, 35, 35, .2)",
				"fill-outline-color": "rgba(211, 35, 35, 1)"
			}
		});
		outlinesCreated = true;
		
	}
	
	function toggleCityOutlines(v) {
		if (outlinesCreated) {
			if (v == 'show') {
				map.setLayoutProperty('miami-shape', 'visibility', 'visible');
				map.setLayoutProperty('cbsa-shape', 'visibility', 'visible');
			} else {
				map.setLayoutProperty('miami-shape', 'visibility', 'none');
				map.setLayoutProperty('cbsa-shape', 'visibility', 'none');
			}
		}
	}
	
	function makeCityLabels() {
		var radius;
		if (smallScreen) {
			radius = 2;
		} else if (mediumScreen) {
			radius = 3;
		} else {
			radius = 4;
		}
		
		var geojson = {
			"type":"FeatureCollection",
			"features":[]
		};
	
		for (var i = 0; i < allCityData.length; i++) {
			if (allCityData[i].metro_city == 'Honolulu') {
				honoluluIndex = i;
			}
			
			geojson.features.push({
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [allCityData[i].lon, allCityData[i].lat]
				},
				"properties": {
					"title": allCityData[i].metro_city,
					"icon": "marker",
					"index": i
				}
			});
		}
	
		// add markers to map
		geojson.features.forEach(function(marker) {
			// create a HTML element for each feature
			var el = document.createElement('div');
	
			if (marker.properties.index < 5) {
				el.innerHTML = marker.properties.index + 1;
				el.className = 'marker top-five-marker';
	
				if (marker.properties.title == 'Honolulu') {
					d3.select('.honolulu-rank')
						.append('div')
						.attr('class', 'marker top-five-marker')
						.text(marker.properties.index + 1);
				}
			} else {
				el.className = 'marker normal-marker';
			}
	
			d3.select(el).attr('data-index', marker.properties.index)
				.attr('data-coordinates', marker.geometry.coordinates)
				.on('mouseover', function() {	
					var index = parseInt(d3.select(this).attr('data-index'));
					currentIndex = index;
	
					var thisCityData = allCityData[index];
					updateCardContent(thisCityData);
					
					card.style('opacity', '1')
						.style('pointer-events', 'all');
				});
		
			// make a marker for each feature and add to the map
			new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);
		});
	}
	
	function toggleCityLabels(v) {
		if (v == 'show') {
			d3.selectAll('.marker').style('opacity', 1);
		} else {
			d3.selectAll('.marker').style('opacity', 0);
		}
	}
	
	d3.selectAll('.timeperiod')
	   .on('click', function() {
			d3.selectAll('.timeperiod').classed('selected-timeperiod', false);
			d3.select(this).classed('selected-timeperiod', true);
	
			var id = d3.select(this).attr('data-quarter');
	
			if (id == 'q2') {
				currentQuarter = 0;
			} else if (id == 'q3') {
				currentQuarter = 1;
			} else if (id == 'q4') {
				currentQuarter = 2;
			} else {
				currentQuarter = 3;
			}
	
			allCityData.sort(function(x, y){
			   return d3.ascending(x[quarterRank[currentQuarter]], y[quarterRank[currentQuarter]]);
			});
			
			d3.selectAll('.marker').remove();
			makeCityLabels();
			currentIndex = 0;
			
			var cityData = allCityData[currentIndex];
			updateCardContent(cityData);
		});
	
	//search bar functionality
	d3.select(".search-bar")
	.on("keyup", function() {
		var results_container = d3.select(".search-bar-results");
		var entry = d3.select(this).node().value.toLowerCase();
		d3.selectAll(".search-bar-results-result").remove();
	
		if (entry === '') {
			results_container.classed("search-bar-results-shown", false);
			
		} else {
			matches = [];
	
			for (var i in allCityData) {
				name = allCityData[i].metro_city + ', ' + allCityData[i].metro_state;
				nameLowerCase = name.toLowerCase();
				if (nameLowerCase.startsWith(entry)) {
					matches.push(name);
				}
			}
	
			if (matches.length > 0) {
				results_container.classed("search-bar-results-shown", true);
				results_container.selectAll("p")
					.data(matches)
					.enter()
					.append("p")
					.attr("class", "search-bar-results-result")
					.text(function(d) {
						return d;
					})
					.on("click", function(d) {
						var cityData;
						for (i in allCityData) {
							var cityArray = d.split(',');
							var cityName = cityArray[0];
							var cityState = cityArray[1].substr(1);
							if (allCityData[i].metro_city == cityName && allCityData[i].metro_state == cityState) {
								cityData = allCityData[i];
								break;
							}
						}
					
					currentIndex = i;
					d3.select('#interactive-map-info').style('display', 'block');
					
					card.style('opacity', '1')
						.style('pointer-events', 'all');
	
					updateCardContent(cityData);
					results_container.classed("search-bar-results-shown", false);
					d3.select('.search-bar').node().value = '';
				});
			}
		}
	});
	
	graphic.on('click', function() {
		d3.select(".search-bar-results").classed("search-bar-results-shown", false);
	});
	
	d3.selectAll('.move-city-button')
		.on('click', function() {
			var direction = d3.select(this).attr('data-direction');
			if (direction == 'prev') {
				--currentIndex; 
			} else {
				++currentIndex;
			}
		
			var cityData = allCityData[currentIndex];
			updateCardContent(cityData);
		});
	
	function hideMoveCityButton() {
		if (currentIndex == 0) {
			d3.select('.prev-city').classed('hide-move-city', true);
			d3.select('.next-city').classed('hide-move-city', false);
		} else if (currentIndex == 49) {
			d3.select('.prev-city').classed('hide-move-city', false);
			d3.select('.next-city').classed('hide-move-city', true);
		} else {
			d3.select('.prev-city').classed('hide-move-city', false);
			d3.select('.next-city').classed('hide-move-city', false);
		}
	}
	
	d3.select('.hide-card-button').on('click', function() {
		card.style('opacity', '0')
			.style('pointer-events', 'none');
	});
	
	function updateTooltip(left, top, index) {
		if (popup) {
			popup.remove();
		}
	
		var thisCity = topFiveCities[index];
		tooltip.select('.city-name').text(thisCity);
		tooltip.select('.city-neighborhood-text-container').html(function() {
			if (thisCity == 'Phoenix') {
				return null;
			} else {
				return "<p class='city-neighborhood-text'><span class='city-neighborhood-number'>1.</span> " + topFiveHoods[thisCity][0] + "</p><p class='city-neighborhood-text'><span class='city-neighborhood-number'>2.</span> " + topFiveHoods[thisCity][1] + "</p><p class='city-neighborhood-text'><span class='city-neighborhood-number'>3.</span> " + topFiveHoods[thisCity][2] + "</p>";
			}
		});
	
		popup = new mapboxgl.Popup({closeButton:'', closeOnClick: false})
			.setLngLat([left, top])
			.setHTML($('#tooltip').html())
			.addTo(map);
	}
	
	function updateCardContent(data) {
		hideMoveCityButton();
		updateCardText(data); 
		updateCardImage(data);
		updateCardDotPlot(data);
		updateCardBumpChart(data);
	}
	
	function updateCardText(cityData) {
		card.select('.city-name').text(cityData.metro_city + ', ' + cityData.metro_state);
		card.select('.city-population').text(formatAsThousands(aggregate(cityData.population, 10000)) + ' live in this metro area');
	
		var thisRank = cityData[quarterRank[currentQuarter]],
			rankChange = cityData[quarterRankChange[currentQuarter]],
			prevRank = thisRank + rankChange;
	
		card.select('.city-rank-number')
			.text(function() {
				if (rankChange > 0) {
					card.select('.city-rank-direction').text('up from no. ' + prevRank);
					return '\u2191 No. ' + thisRank;
				} else if (rankChange < 0) {
					card.select('.city-rank-direction').text('down from no. ' + prevRank);
					return '\u2193 No. ' + thisRank;
				} else {
					card.select('.city-rank-direction').text('unchanged from last quarter');
					return '\u2014 No. ' + thisRank;
				}
			})
			.style('background-color', function() {
				if (rankChange > 0) {
					return "#3bba76";
				} else if (rankChange < 0) {
					return "#e62f51";
				} else {
					return "#dab502";
				}
			});
	}
	
	function updateCardImage(data) {
		card.select('.city-image').attr('src', function() {
			return data.img;
		});
	}
	
	function updateCardDotPlot(data) {
		card.select('.dot-plot-intro').text(data.metro_city + "'s growth compared to other cities:");
		createCardDotPlot(allCityData);
	}
	
	function createCardDotPlot(data) {
		var dotContainer = d3.select('.dot-plot');
		dotContainer.select('.dot-plot-svg').remove();
		
		var dotContainerWidth = dotContainer.node().getBoundingClientRect().width;
		var dotContainerHeight = dotContainer.node().getBoundingClientRect().height;
		
		var dotPadding = {
			right: 15,
			left: 15,
			top: 15,
			bottom: 15
		};
		
		var width = dotContainerWidth - dotPadding.left - dotPadding.right,
			height = dotContainerHeight - dotPadding.top - dotPadding.bottom;
	
		//Create scale functions
		var dotScale = d3.scaleLinear()
							.domain(d3.extent(data, function(d) {
								return d[quarterNetChange[currentQuarter]];
							}))
							.range([0, width]);
	
		//Define X axis
		var dotAxis = d3.axisBottom()
						.scale(dotScale)
						.tickValues(dotScale.domain())
						.tickFormat(function(d) {
							if (d == dotScale.domain()[0]) {
								return 'Lowest';
							} else if (d == dotScale.domain()[1]) {
								return 'Highest';
							}
						});
	
		//Create SVG element
		var dotSvg = dotContainer.append("svg")
						.attr("width", dotContainerWidth)
						.attr("height", dotContainerHeight)
						.attr('class', 'dot-plot-svg');
	
		var cell = dotSvg.append("g")
						  .attr("width", width)
						  .attr("height", height)
						  .attr('transform', "translate(" + dotPadding.left + "," + dotPadding.top + ")")
						  .attr("class", "cells")
						  .selectAll("g")
						  .data(d3.voronoi()
							  .extent([[0, 0], [width, height]])
							  .x(function(d) { 
								return dotScale(d[quarterNetChange[currentQuarter]]); })
							  .y(function(d) { return height / 2; })
							  .polygons(data))
						  .enter()
						  .append("g");
	
		cell.append("path")
			.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
			.attr('class', 'dot-plot-voronoi-path')
			.attr('fill', 'white');
		
		//Create X axis
		cell.append("g")
			.attr("class", "dot-plot-x-axis")
			.attr("transform", "translate(0," + (height - 20) + ")")
			.call(dotAxis)
			.selectAll('text')
				.style("text-anchor", function(d) {
					if (d == dotScale.domain()[0]) {
						return 'start';
					} else if (d == dotScale.domain()[1]){
						return 'end';
					} 
				});
		
		highlightLEODot(allCityData[currentIndex]);
		
		cell.on('mouseover', function(d, i) {
				highlightLEODot(d.data);
			})
			.on('mouseout', function() {
				highlightLEODot(allCityData[currentIndex]);
			});
	
		//Create circles
		var dotPlotDots = cell.append("circle")
								.attr("class", "dot-plot-dot")
								.attr("cx", function(d) {
									return dotScale(d.data[quarterNetChange[currentQuarter]]);
								})
								.attr("cy", height / 2)
								.attr("r", 4);
		
		
		function highlightLEODot(cityData) {
			d3.selectAll('.highlight-circle-outline').remove();
			d3.selectAll('.highlight-circle').remove();
			d3.selectAll('.highlight-circle-label').remove();
	
			cell.append('circle')
				 .attr('class', 'highlight-circle-outline')
				 .attr('cx', function() {
					return dotScale(cityData[quarterNetChange[currentQuarter]]);
				 })
				 .attr("cy", height / 2)
				 .attr("r", 10)
				 .style('pointer-events', 'none');
	
			cell.append('circle')
				 .attr('class', 'highlight-circle')
				 .attr('cx', function() {
					return dotScale(cityData[quarterNetChange[currentQuarter]]);
				 })
				 .attr("cy", height / 2)
				 .attr("r", 2)
				 .style('pointer-events', 'none');
			
			dotContainer.append('p')
				 .attr('class', 'highlight-circle-label')
				 .style('left', function() {
					return dotScale(cityData[quarterNetChange[currentQuarter]]) + dotPadding.left + 'px';
				 })
				 .style("top", dotContainerHeight / 2 - 25  + 'px')
				 .style('pointer-events', 'none')
				 .style('transform', function() {
					var labelScale = d3.scaleLinear().domain(dotScale.domain()).range([-20, -80]),
						xOffset = labelScale(cityData[quarterNetChange[currentQuarter]]);
					return "translate(" + xOffset + "%, -50%)";
				 })
				 .text(cityData.metro_city);
		
		var xPoint = dotContainerWidth / 2 + 30,
			yPoint = dotContainerHeight / 2 + 7,
			dxPoint = -20,
			dyPoint = 30,
			firstBreakPoint = [-10, 23],
			label = 'Hover over a dot!';
	
		makeAnnotation(dotSvg, label, xPoint, yPoint, dxPoint, dyPoint, firstBreakPoint);
		}
	}
	
	function updateCardBumpChart(data) {
		card.select('.bump-chart-intro').text(data.metro_city + "'s business categories, ranked by net business growth in each quarter:");
		createCardBumpChart(data.metro_city, data.metro_state);
	}
	
	function createCardBumpChart(city, state) {
		var bumpContainer = d3.select('#city-info-card').select('.bump-chart');
		bumpContainer.select('.bump-chart-svg').remove();
		
		var bumpContainerWidth = bumpContainer.node().getBoundingClientRect().width;
		var bumpContainerHeight = bumpContainer.node().getBoundingClientRect().height;
	
		var bumpPadding = {
			left: 30,
			right:50,
			top: 30,
			bottom: 40
		};
	
		var width = bumpContainerWidth - bumpPadding.left - bumpPadding.right,
			height = bumpContainerHeight - bumpPadding.top - bumpPadding.bottom;
	
		var bumpSvg = bumpContainer.append('svg')
			.attr('class', 'bump-chart-svg')
			.attr('width', bumpContainerWidth)
			.attr('height', bumpContainerHeight);
	
		var bumpG = bumpSvg.append('g')
			.attr('transform', 'translate(' + bumpPadding.left + ', ' + bumpPadding.top + ')');
	
		var xScale = d3.scaleBand().rangeRound([0, width]).domain(['Q12017', 'Q22017', 'Q32017', 'Q42017', 'Q12018']);
			yScale = d3.scaleLinear().range([0, height]).domain([1, 10]);
	
		var line = d3.line()
			.x(function(d) { return xScale(d.quarter); })
			.y(function(d) { return yScale(d.openCloseRank); });
	
		var cityRanks = allCategoryData.filter(function(d) {
			if (d.city == city && d.state == state) {
				return true;
			} else {
				return false;
			}
		});
	
		var nested = d3.nest()
			.key(function(d) { return d.category; })
			.entries(cityRanks);
	
		var xAxis = bumpG.append("g")
			.attr("class", "axis x-axis")
			.attr("transform", "translate(" + (-xScale.bandwidth() / 2) + ',' + - 10 + ")")
			.call(
				d3.axisTop(xScale)
					.tickSize(-height - 20)
					.tickFormat(function(d) {
						if (d == 'Q12017') {
							return "Q1 '17";
						} else if (d == 'Q22017') {
							return "Q2 '17";
						} else if (d == 'Q32017') {
							return "Q3 '17";
						} else if (d == 'Q42017') {
							return "Q4 '17";
						} else if (d == 'Q12018') {
							return "Q1 '18";
						}
					})
			);
	
		xAxis.select('path')
			.style('display', 'none');
	
		xAxis.selectAll('line')
			.style('stroke-width', 2)
			.style('stroke', '#ededed');
		
		var businessCategory = bumpG.selectAll(".businessCategory")
			.data(nested)
			.enter()
			.append("g")
			.attr("class", "businessCategory");
		
		businessCategory.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", '#D3D3D3')
			.style('stroke-width', '4');
	
		businessCategory.append('text')
			.attr('x', xScale('Q12017'))
			.attr('dx', -5)
			.attr('y', function(d) {
				return yScale(d.values[0].openCloseRank);
			})
			.attr('dy', 4)
			.text(function(d) {
				return d.values[0].openCloseRank;
			})
			.attr('text-anchor', 'end')
			.attr('class', 'bump-rank-text bump-text');
	
		businessCategory.append('text')
			.attr('x', xScale('Q12018'))
			.attr('dx', 5)
			.attr('y', function(d) {
				return yScale(d.values[d.values.length - 1].openCloseRank);
			})
			.attr('dy', 4)
			.text(function(d) {
				return categoryKey[d.key];
			})
			.attr('text-anchor', 'start')
			.attr('class', 'bump-category-text bump-text')
			.style('fill', 'grey')
			.filter(function(d) {
				if (d.key == 1) {
					return true;
				}
			})
			.style('fill', 'black');
		
		
		bumpContainer.selectAll('.bump-category-text')
			.on('mouseover', function(d) {
				var thisCategoryData = nested.filter(function(data) {
					return data.key == d.key;
				});
				drawRedLine(thisCategoryData);
				bumpContainer.selectAll('.bump-category-text').style('fill', 'grey');
				d3.select(this).style('fill', 'black');
			})
			.on('mouseout', function() {
				var homeData = nested.filter(function(d) {
					return d.key == 1;
				});
				drawRedLine(homeData);
				bumpContainer.selectAll('.bump-category-text')
					.style('fill', 'grey')
					.filter(function(d) {
						if (d.key == 1) {
							return true;
						}
					})
					.style('fill', 'black');
			});
	
		bumpSvg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", bumpPadding.left)
			.attr("x",0 - (height / 2))
			.attr("dy", "-20")
			.style("text-anchor", "end")
			.attr('class', 'bump-y-label')
			.text('Rank'); 
	
		var homeData = nested.filter(function(d) {
			return d.key == 1;
		});
	
		drawRedLine(homeData);
	
		function drawRedLine(categoryData) {
			bumpContainer.selectAll(".highlightedCategory").remove();
	
			var highlightedBusinessCategory = bumpG.selectAll(".highlightedCategory")
				.data(categoryData)
				.enter()
				.append("g")
				.attr("class", "highlightedCategory");
			
			highlightedBusinessCategory.append("path")
				.attr("class", "line")
				.attr("d", function(d) { return line(d.values); })
				.style("stroke", '#d32323')
				.style('stroke-width', '5');
		}
	
		var xPoint = width,
			yPoint = bumpContainerHeight - 33,
			dxPoint = -20,
			dyPoint = 25,
			firstBreakPoint = [-10, 18],
			label = 'Hover over a category!';
	
		makeAnnotation(bumpSvg, label, xPoint, yPoint, dxPoint, dyPoint, firstBreakPoint);	
	}
	
	function createStepBumpCharts() {
		d3.selectAll('.top-five-step')
			.each(function() {
				var thisStep = d3.select(this);
				var thisCity = thisStep.attr('data-city');
				var cityRanks = allCategoryData.filter(function(d) {
					if (d.city == thisCity) {
						return true;
					} else {
						return false;
					}
				});
	
				var nested = d3.nest()
					.key(function(d) { return d.category; })
					.entries(cityRanks);
	
				var bumpContainer = thisStep.select('.bump-chart');
				bumpContainer.select('.bump-chart-svg').remove();
				
				var bumpContainerWidth = bumpContainer.node().getBoundingClientRect().width;
				var bumpContainerHeight = bumpContainer.node().getBoundingClientRect().height;
				
				var annotationBumpPadding = 20,
					annotationBumpExtraHeight = 0;
				if (thisCity == 'Austin') {
					annotationBumpPadding = 20;
					annotationBumpExtraHeight = 40;
				} 
	
				var bumpPadding = {
					left: 30,
					right:50,
					top: 30,
					bottom: annotationBumpPadding
				};
	
				var width = bumpContainerWidth - bumpPadding.left - bumpPadding.right,
					height = bumpContainerHeight - bumpPadding.top - bumpPadding.bottom;
	
				var bumpSvg = bumpContainer.append('svg')
					.attr('class', 'bump-chart-svg')
					.attr('width', bumpContainerWidth)
					.attr('height', bumpContainerHeight + annotationBumpExtraHeight);
	
				var bumpG = bumpSvg.append('g')
					.attr('transform', 'translate(' + bumpPadding.left + ', ' + bumpPadding.top + ')');
	
				var xScale = d3.scaleBand().rangeRound([0, width]).domain(['Q12017', 'Q22017', 'Q32017', 'Q42017', 'Q12018']);
					yScale = d3.scaleLinear().range([0, height]).domain([1, 10]);
	
				var line = d3.line()
					//.curve(d3.curveBasis)
					.x(function(d) { return xScale(d.quarter); })
					.y(function(d) { return yScale(d.openCloseRank); });
	
				var xAxis = bumpG.append("g")
					.attr("class", "axis x-axis")
					.attr("transform", "translate(" + (-xScale.bandwidth() / 2) + ',' + - 10 + ")")
					.call(
						d3.axisTop(xScale)
							.tickSize(-height - 20)
							.tickFormat(function(d) {
								if (d == 'Q12017') {
									return "Q1 '17";
								} else if (d == 'Q22017') {
									return "Q2 '17";
								} else if (d == 'Q32017') {
									return "Q3 '17";
								} else if (d == 'Q42017') {
									return "Q4 '17";
								} else if (d == 'Q12018') {
									return "Q1 '18";
								}
							})	
					);
	
				xAxis.select('path')
					.style('display', 'none');
	
				xAxis.selectAll('line')
					.style('stroke-width', 2)
					.style('stroke', '#ededed');
				
				var businessCategory = bumpG.selectAll(".businessCategory")
					.data(nested)
					.enter()
					.append("g")
					.attr("class", "businessCategory");
				
				businessCategory.append("path")
					.attr("class", "line")
					.attr("d", function(d) { return line(d.values); })
					.style("stroke", '#D3D3D3')
					.style('stroke-width', '4');
	
				businessCategory.append('text')
					.attr('x', xScale('Q12017'))
					.attr('dx', -5)
					.attr('y', function(d) {
						return yScale(d.values[0].openCloseRank);
					})
					.attr('dy', 4)
					.text(function(d) {
						return d.values[0].openCloseRank;
					})
					.attr('text-anchor', 'end')
					.attr('class', 'bump-rank-text bump-text');
	
				businessCategory.append('text')
					.attr('x', xScale('Q12018'))
					.attr('dx', 5)
					.attr('y', function(d) {
						return yScale(d.values[d.values.length - 1].openCloseRank);
					})
					.attr('dy', 4)
					.text(function(d) {
						return categoryKey[d.key];
					})
					.attr('text-anchor', 'start')
					.attr('class', 'bump-category-text bump-text')
					.style('fill', 'grey')
					.filter(function(d) {
						if (d.key == 1) {
							return true;
						}
					})
					.style('fill', 'black');
				
				thisStep.selectAll('.bump-category-text')
					.on('mouseover', function(d) {
						var thisCategoryData = nested.filter(function(data) {
							return data.key == d.key;
						});
						drawRedLine(thisCategoryData);
						thisStep.selectAll('.bump-category-text').style('fill', 'grey');
						d3.select(this).style('fill', 'black');
					})
					.on('mouseout', function() {
						var homeData = nested.filter(function(d) {
							return d.key == 1;
						});
						drawRedLine(homeData);
						thisStep.selectAll('.bump-category-text')
							.style('fill', 'grey')
							.filter(function(d) {
								if (d.key == 1) {
									return true;
								}
							})
							.style('fill', 'black');
					});
	
				bumpSvg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", bumpPadding.left)
					.attr("x",0 - (height / 2))
					.attr("dy", "-20")
					.style("text-anchor", "end")
					.attr('class', 'bump-y-label')
					.text('Rank'); 
	
				var homeData = nested.filter(function(d) {
					return d.key == 1;
				});
	
				drawRedLine(homeData);
	
				function drawRedLine(categoryData) {
					thisStep.selectAll(".highlightedCategory").remove();
	
					var highlightedBusinessCategory = bumpG.selectAll(".highlightedCategory")
						.data(categoryData)
						.enter()
						.append("g")
						.attr("class", "highlightedCategory");
					
					highlightedBusinessCategory.append("path")
						.attr("class", "line")
						.attr("d", function(d) { return line(d.values); })
						.style("stroke", '#d32323')
						.style('stroke-width', '5');
				}
	
				if (thisCity == 'Austin') {
					thisStepContentHeight = thisStep.select('.contents').node().offsetHeight;
					thisStep.select('.contents').style('height', thisStepContentHeight + 15 + 'px');

					var xPoint = width,
						yPoint = bumpContainerHeight - 10,
						dxPoint = -20,
						dyPoint = 25,
						firstBreakPoint = [-10, 18],
						label = 'Hover over a category!';
	
					makeAnnotation(bumpSvg, label, xPoint, yPoint, dxPoint, dyPoint, firstBreakPoint);
				}
		});
	}
	
	function makeAnnotation(svg, label, xPoint, yPoint, dxPoint, dyPoint, firstBreakPoint, secondBreakPoint) {
		svg.select('.dot-annotation').remove();
		const annotations = [
			{
			  note: {
				label: label,
				wrap: 150,
				orientation:"leftRight"
			  },
			  connector: {
				type: "curve",
				points: [firstBreakPoint]
			  },
			  x: xPoint,
			  y: yPoint,
			  dx: dxPoint,
			  dy: dyPoint
			}
		];
	
		const makeAnnotations = d3.annotation()
			.type(d3.annotationLabel)
			.annotations(annotations);
		
		svg.append("g")
			.attr("class", "annotation-group")
			.attr('class', 'dot-annotation')
			.call(makeAnnotations);
	}
	
	function cleanCityData(data) {
		data.forEach(function(d) {
			d.rank_Q22017 = +d.rank_Q22017,
			d.rank_Q32017 = +d.rank_Q32017,
			d.rank_Q42017 = +d.rank_Q42017,
			d.rank_Q12018 = +d.rank_Q12018,
			d.rank_change_Q22017 = +d.rank_change_Q22017,
			d.rank_change_Q32017 = +d.rank_change_Q32017,
			d.rank_change_Q42017 = +d.rank_change_Q42017,
			d.rank_change_Q12018 = +d.rank_change_Q12018,
			d.net_change_Q22017 = +d.net_change_Q22017,
			d.net_change_Q32017 = +d.net_change_Q32017,
			d.net_change_Q42017 = +d.net_change_Q42017,
			d.net_change_Q12018 = +d.net_change_Q12018,
			d.population= +d.population,
			d.lat = +d.lat,
			d.lon = +d.lon
		});
	}
	
	function cleanCategoryData(data) {
		data.forEach(function(d) {
			d.netChangeRank = +d.net_change_rank,
			d.openCloseRank = +d.open_close_rank
		});
	}
});

var checkIfLoaded = setInterval(function () {
	if (map.loaded()) {
		d3.select("#loading").style("display", "none");
		d3.select("#scroll").style("visibility", "visible");
		clearInterval(checkIfLoaded);
	}
}, 1000);