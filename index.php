<!doctype html>
<html>
	<head>
		<link rel="stylesheet" href="css/fonts/stylesheet.css" type="text/css" charset="utf-8" />
		<link href='http://fonts.googleapis.com/css?family=Roboto:400' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<script type="text/javascript" src="dist/angularplasmid.complete.min.js"></script>
		<style>
		<!--
			.plasmid {
				font-size:12px;
				font-family: 'Roboto';
			} 
			.track {
				fill:#f0f0f0;
				stroke:#999;

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
        Size : <input ng-model="size" spinner ng-init="size=600">
        Radius : <input ng-model="radius" spinner ng-init="radius=150">
        Width : <input ng-model="width" spinner ng-init="width=30">
        TickVadjust : <input ng-model="vadjust" spinner ng-init="vadjust=10">
        LabelVAdjust : <input ng-model="labelvadjust" spinner ng-init="labelvadjust=15">
        <br>
		<plasmid class="plasmid" plasmidheight="{{size}}" plasmidwidth="{{size}}" sequencelength="1000">
			<plasmidtrack class="track" radius="{{radius}}" width="{{width}}">

                <trackscale class="scale-minor" interval="10" direction="in"></trackscale>
				<trackscale class="scale-major" interval="50" direction="in" showlabels="1" labelclass="scale-label"></trackscale>
                <trackscale class="scale-major" interval="50" vadjust="{{vadjust}}" labelvadjust="{{labelvadjust}}" labelclass="scale-label" showlabels="1"></trackscale>
                <trackscale class="scale-minor" interval="10"></trackscale>
				<trackmarker class="trackmarker" start="50" end="100" arrowendlength="4"><markerlabel text="AcoII" type="path"></markerlabel></trackmarker>
				<trackmarker class="trackmarker" start="450" end="625" arrowendlength="4" wadjust="6" vadjust="-3"><markerlabel text="NolI" type="path"></markerlabel></trackmarker>
				<trackmarker class="trackmarker" start="650" end="712"><markerlabel text="NolI" halign="end" valign="outer" vadjust="50" showline="1" linevadjust="-20" lineclass="label-line"></markerlabel></trackmarker>
				<trackmarker class="enzyme" start="740"><markerlabel text="ACII" vadjust="50" hadjust="2" valign="outer" showline="1" linevadjust="-20" lineclass="label-line"></markerlabel></trackmarker>
				<trackmarker class="enzyme" start="822"><markerlabel text="BacIII" vadjust="50" hadjust="2" valign="outer" showline="1" linevadjust="-20" lineclass="label-line"></markerlabel></trackmarker>
                <trackmarker class="transsite" start="850" end="100" wadjust="30"><markerlabel text="Transcription Region" type="path" valign="outer" vadjust="10"></markerlabel></trackmarker>

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
