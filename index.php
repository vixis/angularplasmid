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
		Plasmid Length : <input type='textbox' ng-model='plasmidlength' ng-init="plasmidlength='2000'" spinner/></br>
		SVG Size : <input type='textbox' ng-model='size' ng-init="size='500'" spinner/></br>
		Track Size : <input type="textbox" ng-model='rad' ng-init='rad=150' spinner/><br/>
		Track Width: <input type="textbox" ng-model='t' ng-init='t=30' spinner/><br/>
		<button ng-click="start()">Start Animation</button> <button ng-click="stop()">Stop Animation</button>

		<hr/>

		<div style='position:relative'>
			<div plasmid id="p1" class="plasmid" length="360" height="size" width="size">
				<div track class="track" radius="rad" thickness="t">
					<div marker ng-repeat="m in markers" start="m.start" end="m.end" offsetthickness="20" style="fill:{{m.colorband}}"></div>
					<div marker ng-repeat="m in markers" class="marker" start="m.start" end="m.end" arrowstartlength="-2" arrowendlength="3" markerclick="clicked(m)" style="fill:{{m.color}}">
						<div markerlabel class="marker-label" offsetradius="t+20" style="fill:{{m.color}}" offsetangle="-(m.end-m.start)/2">{{m.start}}</div>
						<div markerlabel class="marker-label" offsetradius="t+20" style="fill:{{m.color}}" offsetangle="(m.end-m.start)/2">{{m.end}}</div>
					</div>
					<div marker ng-repeat="m in markers" start="m.start" offsetthickness="20" style="stroke-width:2px;stroke:{{m.color}};stroke-dasharray:1 5"></div>
					<div marker ng-repeat="m in markers" start="m.end" offsetthickness="20" style="stroke-width:2px;stroke:{{m.color}};stroke-dasharray:1 5"></div>
					<div scalelabel class="scale-label" interval="20" direction="in"></div>
					<div scale class="scale-minor" interval="5" direction="in"></div>
					<div scale class="scale-major" interval="20" direction="in"></div>
				</div>
			</div>
			<div style='position:absolute;width:100px;height:50px;left:{{plasmids[0].tracks[0].markers[5].getDimensions().position(75).x - 50}}px;top:{{plasmids[0].tracks[0].markers[5].getDimensions().position(75).y}}px'><img style="-webkit-transform:rotate({{plasmids[0].tracks[0].markers[5].getDimensions().angle.start+20}}deg);" src="http://www.vixis.com/health/img/vixis_small.gif"/></div>
			<div class='track-label text-center' style='margin:0;padding:0;position:absolute;width:200px;height:200px;left:{{plasmids[0].tracks[0].getDimensions().center.x-100}}px;top:{{plasmids[0].tracks[0].getDimensions().center.y-75}}px;'>Demo Plasmid</div>
		</div>

		<span plasmid id="p2" class="plasmid" length="plasmidlength" height="size" width="size">
			<div track radius="rad" thickness="t-5" style='fill:#999;'>
				<div scale interval="20" tickoffset="10" ticklength="3" style="stroke-width:1px;stroke:#ccc"></div>
				<div scale interval="100" tickoffset="10" ticklength="5" style="stroke-width:2px;stroke:#f99"></div>
				<div scalelabel class="scale-label" interval="100" labeloffset="30"></div>
				<div marker start="300" end="400" offsetradius="-5" offsetthickness="10" style='fill:#00d;stroke-width:2px;stroke:#666;' markerclick="clicked($marker)"></div>
				<div marker start="410" offsetradius="-20" offsetthickness="40" style='stroke-width:1px;stroke:#f00;stroke-dasharray:3 5'></div>
				<div marker start="500" end="650" offsetradius="-5" offsetthickness="10" style='fill:#0c0;stroke-width:2px;stroke:#666' arrowendlength="7" arrowendwidth="5"></div>
				<div marker start="690" end="900" offsetradius="-5" offsetthickness="10" style='fill:#c00;stroke-width:2px;stroke:#666' arrowendlength="7" arrowendwidth="5"></div>
				<div marker start="1200" end="1700" offsetradius="-5" offsetthickness="10" style='fill:#f0f000;stroke-width:2px;stroke:#666;stroke-dasharray:2 2' arrowendlength="7" arrowendwidth="5">
					<div markerlabel class="marker-label" offsetradius="-40">{{plasmidlength}}</div>
				</div>
				<div marker start="1800" end="100" offsetradius="-5" offsetthickness="10" style='fill:#f0f000;stroke-width:2px;stroke:#666;stroke-dasharray:2 2' arrowstartlength="7" arrowstartwidth="5">
					<div markerlabel class="marker-label" offsetradius="-40">Hind III</div>
				</div>
			</div>
		</span>

	</body>
</html>
