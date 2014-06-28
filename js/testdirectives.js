app.directive("grandparent", function(){
    return {
        restrict: 'AE',
        template: '<div>grandparent</div>',
        replace : true,
        transclude:true,
        link : function(scope,elem,attr,controller,transcludeFn){
            transcludeFn(scope, function(content){
                elem.append(content);
            });
            console.log('got to grandparent link');
        },
        controller : function(){
            console.log('got to Grandparent controller');
        }
    };
});

app.directive("parent", function(){
    return {
        restrict: 'AE',
        template: '<div>parent</div>',
        replace : true,
        transclude: true,
        require: '^grandparent',
        link : function(scope,elem,attr,controller,transcludeFn){
            transcludeFn(scope, function(content){
                elem.append(content);
            });
            console.log('got to parent link');
        },
        controller : function(){
            console.log('got to parent controller');
        }
    };
});


app.directive("child", function(){
    return {
        restrict: 'AE',
        template: '<div>chld</div>',
        replace : true,
        require: '^parent',
        link : function(scope,elem,attr,controller,transcludeFn){
            console.log('got to child link');
        },
        controller : function(){
            console.log('got to child controller');
        }
    };
});
