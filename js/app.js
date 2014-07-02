"use strict";

var app = angular.module("plasmid-lib", []);

app.controller('MainCtrl',['$timeout','$scope',function($timeout,$scope){

    var timer;
    var markers = [
        {start:50,end:80,color:'#f80', colorband:'rgba(255,205,195,0.4)'},
        {start:120,end:190,color:'#08f', colorband:'rgba(195,205,255,0.4)'},
        {start:200,end:230,color:'#80f', colorband:'rgba(205,195,255,0.4)'},
        {start:260,end:300,color:'#0f8', colorband:'rgba(195,255,205,0.4)'},
        {start:305,end:315,color:'#f08', colorband:'rgba(255,195,205,0.4)'}
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

    $scope.clicked = function(item){
        console.log(item);
    };
}]);

function myClicked(marker){
    console.log(marker);
}