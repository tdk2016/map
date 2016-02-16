

      var styleFunction = function(feature) {
        return style[feature.getGeometry().getType()];
      };

      var geojsonObject = {
	  
		'type': 'FeatureCollection',
		'crs': {
			'type': 'name'
			},
			'features':[]
  					};
		var features = (new ol.format.GeoJSON()).readFeatures(geojsonObject);
		var vectorSource = new ol.source.Vector({
            features: features,
			format: new ol.format.GeoJSON()
		});


		var vectorLayer = new ol.layer.Vector({
			title: "Vector",
			source: vectorSource,
			style: styleFunction
			
		});

		var osm = new ol.layer.Tile({
			source: new ol.source.OSM({layer: 'sat'})
			});
	
		var map = new ol.Map({
			layers: [osm, vectorLayer],
			target: 'map',
			view: new ol.View({center: [2131312,6027113],zoom: 18})
				});
		var mousePosition = new ol.control.MousePosition({
			target: 'mouse_p'
				});
		
		var scaleLine = new ol.control.ScaleLine({
		target: 'mouse_s'});
		map.addControl(scaleLine);
		map.addControl(mousePosition);
		
		var draw;
		var typeSelect = document.getElementById('type');
		
		
		var select = new ol.interaction.Select();
		var modify = new ol.interaction.Modify({
		features: select.getFeatures()
		});
		
		function addInteraction(){
			var value = typeSelect.value;
			if (value !== 'None') {
				draw = new ol.interaction.Draw({
				source: vectorSource,
				type: (value)		
				});
				map.addInteraction(draw);
				vectorSource.addFeatures(draw);
				}
			else{
				map.addInteraction(select);
				map.addInteraction(modify);
				}
				
			}
		
		
		
		typeSelect.onchange = function() {
			map.removeInteraction(draw);
			map.removeInteraction(select);
			map.removeInteraction(modify);
			addInteraction();
		};
		

		addInteraction();
		
		function getfeatures(){
			var writer = new ol.format.GeoJSON();
			var geojsonStr = writer.writeFeatures(vectorSource.getFeatures());
			document.getElementById("demo").innerHTML = geojsonStr;
		}	