"use strict";

var app = angular.module("plasmid-lib", []);

app.controller('MainCtrl',['$timeout','$scope',function($timeout,$scope){

    var isZoomed;

    var timer;
    var markers = [
        {start:50,end:80,color:'rgba(170,0,85,0.6)', colorband:'rgba(255,221,238,0.4)'},
        {start:120,end:190,color:'rgba(85,0,170,0.6)', colorband:'rgba(238,221,255,0.4)'},
        {start:200,end:230,color:'rgba(0,85,170,0.6)', colorband:'rgba(221,238,255,0.4)'},
        {start:260,end:300,color:'rgba(85,170,0,0.6)', colorband:'rgba(238,255,221,0.4)'},
        {start:305,end:315,color:'rgba(170,85,0,0.6)', colorband:'rgba(255,238,221,0.4)'}
    ];

    $scope.markers = markers;

    $scope.enzymes = [34,55,58,61,120,130,133,140,144,150,180,182,188,192,200];

    $scope.start = function(){
        var plength = $scope.l;
        angular.forEach($scope.markers, function(val){
            val.start += 1;
            if (val.start>plength) { val.start -= plength; }

            val.end +=1;
            if (val.end>plength) { val.end -= plength; }

        });

        timer = $timeout($scope.start, 50);
    };

    $scope.stop = function(){
        $timeout.cancel(timer);
    };

    $scope.clicked = function(item, marker, event){
        var plasmid = angular.element(document.getElementById("p1"));
        if (!isZoomed){
          plasmid.css("-webkit-transform","scale(2)");
          isZoomed = true;
        }
        else {
          plasmid.css("-webkit-transform","scale(1)");
          isZoomed = false;
        }
    };

    $scope.save = function(){
        var svg = document.getElementById('p1');
        canvg(document.getElementById('canvas'), svg.outerHTML);
        var canvas = document.getElementById("canvas");
        var img = canvas.toDataURL("image/png");
        var imglink = angular.element(document.getElementById('imglink'));
        imglink.attr("href", img);
        imglink.html("Click to see saved image");
    };
}]);

function myClicked(marker){
    console.log(marker);
}