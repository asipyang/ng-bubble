# ng-bubble For AngularJS Apps
By ng-bubble, you can easily append a DOM element dynamically as a pop-up window in your AngularJS app. This pop-up window is draggable and resizable like a bubble.  
In the ng-bubble, [interact.js](https://github.com/taye/interact.js) is used for dragging and resizing.

# Features
+ create multiple bubbles
+ give the customized layout to the bubble
+ drag and resize the bubbles
+ remove a bubble independently
+ remove all the bubbles at one time
+ support ng-animate when creating and removing the bubble

# Usage
First add

+ [angular.js](https://angularjs.org/)
+ [interact.js](http://interactjs.io/)
+ ng-bubble.js

to your html file. Make sure that `anglar.js` and `interact.js` are loaded before `ng-bubble.js`.

Second, add the **itman.bubble** as a dependency to your AngularJS module.

There are two ways to use *ng-bubble* as follows.

## Service
**BubbleService** can be injected to the controller or service. The methods of this service are:

### create
It can create a new bubble. An options json object can be passed to configure this new bubble.

|    Field   |  type  |  Default Value | Description |
|:----------:|:------:|:--------------:|:------------|
|    parent  |  jqLite object  |  body object  |  The container element that this bubble is appended to. |
|      x     |   int  |  0  |  The initial position x related to the parent. |
|      y     |   int  |  0  |  The initial position y related to the parent. |
|  template  | string |  '\<div>\</div>'  |  An html template as a string. |
|templateUrl | string |  ''  |  A path to the html template. It overrides the *template* field if provided. |
|    data    | object |  {}  |  An isolated scope is created by the bubble. You can pass all data used in the html template as an json object. |
|dragOptions | object |      |  An ['action options'](http://interactjs.io/docs/#action-options) object of dragging in the interact.js. It overrides the default dragging options if provided. |
|resizeOptions | object |      |  An ['action options'](http://interactjs.io/docs/#action-options) object of resizing in the interact.js. It overrides the default resizing options if provided. |

The create method creates a new bubble with an *isolated scope* and return a **promise** object. This scope also provides a **remove** method for removing this bubble.

An example with basic options:

```js
BubbleService.create({
	parent: angular.element(document.querySelector('#container')),
	x: 20,
	y: 50,
	template: 
   		'<div class="my-bubble">'+
	      '<h2>{{data.title}}</h2>'+
	      '<button ng-click="remove()">close</button>'+
    	'</div>',
	data: {
    	title: "My Bubble"
    }
});
```

The [online demo](http://codepen.io/asip/pen/qZBYzR/) displays the basic options of creating bubbles. You also can watch the message chaged when the creating process has done. And you can use the **remove** method to destory each bubble.


### removeAllBubbles
It can remove all bubbles.

```js
BubbleService.removeAllBubbles();
```

The [online demo](http://codepen.io/asip/pen/PNoBqo/) displays the usage of the templateUrl field and removeAllBubbles method.
