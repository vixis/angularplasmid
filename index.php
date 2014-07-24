<!doctype html>
<html ng-app='app'>
	<head>
		<link rel="stylesheet" href="css/fonts/stylesheet.css" type="text/css" charset="utf-8" />
		<link href='http://fonts.googleapis.com/css?family=Roboto:400' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<script type="text/javascript" src="bower_components/angular/angular.js"></script>
        <script type="text/javascript" src="js/services.js"></script>
		<script type="text/javascript" src="js/directives.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<style>
		<!--
			.plasmid {
				font-size:12px;
				font-family: 'Roboto';
			} 
			.track {
				fill:#f0f0f0;
				stroke:#999;
				filter:url(#dropshadow);
			}
			.outertrack {
				fill:none;
			}
			.scale-minor {
				stroke:#999;
			}
			.scale-major {
				stroke:#f00;
				sroke-width:2px;
			}
			.scale-label {
				font-family: 'latolight';
			    font-size:9px;
			    fill:#999;
			    filter:url(#dropshadow);
			}
			.trackmarker {
				fill:#fc0;
				stroke:#999;
			}
			.label-line {
				stroke:#666;
			}
			.enzyme {
				stroke:#c00;
				stroke-width:2px;
			}
			.transsite {
				stroke:none;
				fill:rgba(64,128,255,.1);
				filter:url(#dropshadow);
			}

		-->
		</style>
	</head>
	<body>
		<plasmid class="plasmid" plasmidheight="600" plasmidwidth="600" sequencelength="1000">
			<plasmidtrack class="track" radius="150" thickness="30">
				<trackscale class="scale-minor" interval="10" direction="in"></trackscale>
				<trackscale class="scale-major" interval="50" direction="in" showlabels="1" labelclass="scale-label"></trackscale>
				<trackscale class="scale-minor" interval="10"></trackscale>
				<trackscale class="scale-major" interval="50" labelclass="scale-label"></trackscale>
				<trackmarker class="trackmarker" start="350" end="400" arrowendlength="4" offsetthickness="6" offsetradius="-3"><markerlabel text="AcoII" type="path"></markerlabel></trackmarker>
				<trackmarker class="trackmarker" start="450" end="625" arrowendlength="4" offsetthickness="6" offsetradius="-3"><markerlabel text="NolI" type="path"></markerlabel></trackmarker>
				<trackmarker class="enzyme" start="712"><markerlabel text="NolI" vadjust="50" hadjust="2" showline="1" lineoffset="-20" lineclass="label-line"></markerlabel></trackmarker>
				<trackmarker class="enzyme" start="740"><markerlabel text="ACII" vadjust="50" hadjust="2" showline="1" lineoffset="-20" lineclass="label-line"></markerlabel></trackmarker>
				<trackmarker class="enzyme" start="822"><markerlabel text="BacIII" vadjust="50" hadjust="2" showline="1" lineoffset="-20" lineclass="label-line"></markerlabel></trackmarker>
				<trackmarker class="transsite" start="850" end="100" offsetthickness="30"><markerlabel text="Transcription Region" type="path" valign="outer" vadjust="10"></markerlabel></trackmarker>
			</plasmidtrack>
			<plasmidtrack class="outertrack" radius="190" thickness="10">
				<trackmarker style='fill:#0c0' start="65" end="200" arrowendlength="4" arrowendwidth="4">
					<markerlabel text="Forward" vadjust="40" halign="left"></markerlabel>
					<markerlabel text="Primer" vadjust="40" hadjust="3"></markerlabel>
				</trackmarker>
				<trackmarker style='fill:#c00' start="201" end="300" arrowstartlength="4" arrowstartwidth="4" >
					<markerlabel text="Reverse" vadjust="40" halign="left"></markerlabel>
					<markerlabel text="Primer" vadjust="40" hadjust="3"></markerlabel>
				</trackmarker>
			</plasmidtrack>
		</plasmid>

		<svg width="0" height="0">
			<defs>
				<filter id="dropshadow" height="120%">
					<feGaussianBlur in="SourceAlpha" stdDeviation="5"/> <!-- stdDeviation is how much to blur -->
					<feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
					<feComponentTransfer>
						<feFuncA type="linear" slope="0.25"/>
					</feComponentTransfer>
					<feMerge> 
						<feMergeNode/> <!-- this contains the offset blurred image -->
						<feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
					</feMerge>
				</filter>
			</defs>	
		</svg>
	</body>
</html>
