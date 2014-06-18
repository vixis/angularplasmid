<!doctype html>
<html ng-app='plasmid-lib'>
	<head>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/style.css">
		<script type="text/javascript" src="bower_components/angular/angular.js"></script>
		<script type="text/javascript" src="js/util.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<script type="text/javascript" src="js/services.js"></script>
		<script type="text/javascript" src="js/directives.js"></script>
	</head>
	<body ng-controller='MainCtrl'>
		<input type="textbox" ng-model='rad' ng-init='rad=130' spinner/><br/>
		<input type="textbox" ng-model='t' ng-init='t=20' spinner/><br/>
		<button ng-click="start()">Start Animation</button> <button ng-click="stop()">Stop Animation</button>

		<hr/>

		<div plasmid class="plasmid" length="360" height="400" width="400">
			<div track class="track" radius="rad" thickness="t">
				<div marker ng-repeat="m in markers" class="marker" start="m.start" end="m.end" markerclick="clicked(m)"></div>
				<div scale class="scale-major" interval="30" tickdirection="in"></div>
				<div scalelabel class="scale-label-tiny" interval="30" labeldirection="in"></div>
				<div scale class="scale-minor" interval="5" ></div>
				<div scale class="scale-major" interval="15"></div>
				<div scalelabel class="scale-label" interval="15"></div>
			</div>
		</div>

		<div plasmid class="plasmid" length="2000" height="400" width="400">
			<div track radius="rad" thickness="t-5" style='fill:#999;'>
				<div scale interval="20" tickoffset="10" ticklength="2" style="stroke-width:1px;stroke:#ccc"></div>
				<div scale interval="100" tickoffset="10" ticklength="2" style="stroke-width:2px;stroke:#99f"></div>
				<div scalelabel class="scale-label" interval="100" labeloffset="25"></div>
				<div marker start="300" end="400" offsetradius="-5" offsetthickness="10" arrowend="1" style='fill:#c00;stroke-width:2px;stroke:#666' markerclick="clicked($marker)"></div>
				<div marker start="410" end="411" offsetradius="-5" offsetthickness="10" style='fill:#333;stroke-width:2px;stroke:#666'></div>
				<div marker start="500" end="650" offsetradius="-5" offsetthickness="10" arrowstart="1" style='fill:#0c0;stroke-width:2px;stroke:#666'></div>
				<div marker start="690" end="900" offsetradius="-5" offsetthickness="10" style='fill:#c0c;stroke-width:2px;stroke:#666'></div>
				<div marker start="1100" end="1101" offsetradius="-5" offsetthickness="10" style='fill:#333;stroke-width:2px;stroke:#666'></div>
				<div marker start="1200" end="1700" offsetradius="-5" offsetthickness="10" arrowstart="1" arrowend="1" style='fill:#f0f000;stroke-width:2px;stroke:#666'></div>

			</div>
		</div>

	</body>
</html>
