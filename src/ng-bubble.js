angular.module("itman.interact", []).directive('ngInteract', function() {
    'use strict';

	var $interact = interact;

    return {
    	restrict: 'A',
    	link: function($scope, element, attrs) {
    		var dragOptions = $scope.$eval(attrs.draggable);
    		var resizeOptions = $scope.$eval(attrs.resizable);

    		$interact(element[0])
    			.draggable(dragOptions)
    			.resizable(resizeOptions);
    	}
    };
});


angular.module("itman.bubble", ['itman.interact']);
angular.module("itman.bubble").directive('ngBubble', function() {
    'use strict';

    return {
    	restrict: 'E',
    	scope: {
    		dragOptions: '=',
    		resizeOptions: '='
    	},
    	transclude: true,
    	replace: true,
    	template: '<div class="ng-bubble" ng-interact draggable="dragOptions" resizable="resizeOptions" ng-transclude></div>',

    	// link: function($scope, element, attrs) {
    	// 	console.log(attrs);
    	// }
    };
});

angular.module("itman.bubble").factory('BubbleService', function($compile, $rootScope, $templateCache, $http, $q, $animate) {
	'use strict';

	var bbRootScope = $rootScope.$new();
	var bbScopes = [];

	var __create = function(_options){
		var scope, bubble;
		_options = __mergeOptions(_options);
		_options.parent.css("position", "relative");

		scope = bbRootScope.$new(true);
		scope.data = _options.data;
		scope.dragOptions = _options.dragOptions;
		scope.resizeOptions = _options.resizeOptions;

		return __getTemplate(_options).then(function(_tmpl){
			bubble = $compile(_tmpl)(scope);

			__setBubbleStyle(bubble, _options);
			scope.remove = __getRemoveHandler(bubble, scope);
			bbScopes.push(scope);

			return $animate.enter(bubble, _options.parent);
		});
	};

	var __dragMoveListener = function(event) {
	    var target = event.target,
	        // keep the dragged position in the data-x/data-y attributes
	        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
	        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	    // translate the element
	    target.style.webkitTransform =
	    target.style.transform =
	      'translate(' + x + 'px, ' + y + 'px)';

	    // update the posiion attributes
	    target.setAttribute('data-x', x);
	    target.setAttribute('data-y', y);
	};

	var __removeAllBubbles = function(){
		var i;
		for(i=0; i < bbScopes.length; i++){
			bbScopes[i].remove();
			i--;
		}
	};

	var __resizeMoveListner = function (event) {
    	var target = event.target,
	        x = (parseFloat(target.getAttribute('data-x')) || 0),
	        y = (parseFloat(target.getAttribute('data-y')) || 0);

	    // update the element's style
	    target.style.width  = event.rect.width + 'px';
	    target.style.height = event.rect.height + 'px';

	    // translate when resizing from top or left edges
	    x += event.deltaRect.left;
	    y += event.deltaRect.top;

    	target.style.webkitTransform =
    	target.style.transform =
        	'translate(' + x + 'px,' + y + 'px)';

	    target.setAttribute('data-x', x);
	    target.setAttribute('data-y', y);
  	};

	var __getDefaultOptions = function(){
		return {
			x: 0,
			y: 0,
			templateUrl: '',
			template: '<div></div>',
			parent: angular.element(document.querySelector('body')),
			data: {},
			dragOptions: {
			    // enable inertial throwing
			    inertia: true,
			    // keep the element within the area of it's parent
			    restrict: {
			    	restriction: "parent",
			    	endOnly: true,
			    	elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			    },
			    // enable autoScroll
			    autoScroll: true,

			    // call this function on every dragmove event
			    onmove: __dragMoveListener
			},
			resizeOptions: {
				preserveAspectRatio: false,
    			edges: { left: true, right: true, bottom: true, top: true },
    			invert: "none",
    			onmove: __resizeMoveListner
			}
		};
	};

	var __getRemoveHandler = function(_bubble, _scope){
		return function(){
			bbScopes.splice(bbScopes.indexOf(_scope), 1);
			$animate.leave(_bubble);
		};
	};

	var __getTemplate = function(_options){
		var getTemplateJob = $q.defer();
		var templateUrl = _options.templateUrl.trim();
		var promise;

		if(templateUrl !== ""){
			promise = $http.get(templateUrl, {cache: $templateCache}).then(function(_response){
				return _response.data;
			});
		} else {
			promise = getTemplateJob.promise;
			getTemplateJob.resolve(_options.template);

		}

		return promise.then(function(_tmpl){
			return '<ng-bubble drag-options="dragOptions" resize-options="resizeOptions">'+
						_tmpl +
					'</ng-bubble>';
		});
	};

	var __mergeOptions = function(_options){
		var DEFAULT_OPTIONS = __getDefaultOptions();
		var keys = Object.keys(DEFAULT_OPTIONS);
		var i, key;
		_options = _options || {};

		for(i=0; i < keys.length; i++){
			key = keys[i];
			_options[key] = _options[key] || DEFAULT_OPTIONS[key];
		}

		return _options;
	};

	var __setBubbleStyle = function(_bubble, _options){
		// set init position
		var style = 'translate(' + _options.x + 'px, ' + _options.y + 'px)';
		_bubble.css("transform", style);
		_bubble.attr('data-x', _options.x);
	    _bubble.attr('data-y', _options.y);

		// set the style of the bubble
		_bubble.css("position", "absolute");
	};

	return {
		create: __create,
		removeAllBubbles: __removeAllBubbles
	};
});