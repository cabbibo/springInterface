
var controller, frame , oFrame;

var mainFinger;

controller = new Leap.Controller({ enableGestures: true });


controller.on( 'frame' , function( data ){

  frame = data;

  if( !oFrame )
    oFrame = frame;

  /*
   *  
   *  Single handed operations
   *
   */
  if( frame.hands.length >= 1 && oFrame.hands.length >= 1 ){

    /*
     *
     *  One Hand, one finger
     *
     */

    if( frame.hands[0].fingers.length >= 1 && oFrame.hands[0].fingers.length >= 1){


      /*mainFinger = frame.hands[0].fingers[0];

      if( mainFinger.touchZone != 'hovering' )
        console.log( mainFinger.touchZone );*/

      var finger  =  frame.hands[0].fingers[0];
      var oFinger = oFrame.hands[0].fingers[0];

      var pos = this.leapToScene( frame , finger.tipPosition ); 
      var oPos = this.leapToScene( oFrame , oFinger.tipPosition );

      fingerMarker.position = pos;

      springController.checkCutSprings( pos , oPos );

    }

  }

  

  oFrame = frame;

});


controller.leapToScene = function( frame , position ){

  var x = position[0] - frame.interactionBox.center[0];
  var y = position[1] - frame.interactionBox.center[1];
  var z = position[2] - frame.interactionBox.center[2];
    
  x /= frame.interactionBox.size[0];
  y /= frame.interactionBox.size[1];
  z /= frame.interactionBox.size[2];

  x *= SS;
  y *= SS;
  z *= SS;


  x += camera.position.x;
  y += camera.position.x;
  z += camera.position.z - SS;


  return new THREE.Vector3( x , y , z );
}


