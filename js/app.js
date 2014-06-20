"use strict";

var app = angular.module("plasmid-lib", []);

app.controller('MainCtrl',['$timeout','$scope',function($timeout,$scope){

    var timer;
    var markers = [
        {start:50,end:80,color:'#a05', colorband:'#fde'},
        {start:120,end:190,color:'#50a', colorband:'#edf'},
        {start:200,end:230,color:'#05a', colorband:'#def'},
        {start:260,end:300,color:'#5a0', colorband:'#efd'},
        {start:305,end:315,color:'#a50', colorband:'#fed'}
    ];

    $scope.markers = markers;

    $scope.start = function(){
        angular.forEach($scope.markers, function(val){
            val.start += 2;
            if (val.start>360) { val.start -= 360; }

            val.end +=2;
            if (val.end>360) { val.end -= 360; }

        });
        timer = $timeout($scope.start, 20);
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