/**
 * @author cabbibo / http://cabbibo.com
 *
 *  Move your hand like a paddle
 *
 */

var frame;

THREE.PaddleControls = function ( object , domElement ) {

  this.object = object;
  this.domElement = ( domElement !== undefined ) ? domElement : document;

  // API
  
  this.enable = true;

  this.velocity = new THREE.Vector3();

  this.dampening = ( object.dampening !== undefined ) ? object.dampening : .95;

  this.weakDampening = .99;
  this.strongDampening = .9;

  this.dampening = this.strongDampening;
  
  // Tells you how much the matching of direction matters
  this.directionStrength = 2;


  // Tells you how much the power should be augmented
  // keep in mind that a higher power means a higher turnon
  this.power = 3

  this.divisionFactor = 50000000;

  this.handVel = new THREE.Vector3();
  this.handNorm = new THREE.Vector3();

  this.update = function(){

    if( frame ){

      if( frame.hands[0] && frame.pointables.length != 1 ){

        // First off check to see if the hand is moving in 
        // the same direction or opposite direction 
        // as the palm normal.
        var hpv = frame.hands[0].palmVelocity;
        this.handVel.set( hpv[0] , hpv[1] , hpv[2] );
         
        var hpn = frame.hands[0].palmNormal;
        this.handNorm.set( hpn[0] , hpn[1] , hpn[2] );

        // Copying over the hand velocity before we alter it
        preVel = this.handVel.clone();
        
        this.handVel.normalize();
        // No need to normalize handNorm, b/c is direction already

        // Getting the angle between the handVel and handNorm
        this.angle = this.handVel.dot( this.handNorm );
        
        // Scaling by the neccesary Dampening factor
        this.directionFactor = Math.abs( Math.pow( this.angle, this.directionStrength ) );

        preVel.multiplyScalar( this.directionFactor );

        this.velocity.x -= Math.pow( preVel.x , this.power ) / this.divisionFactor;
        this.velocity.y -= Math.pow( preVel.y , this.power ) / this.divisionFactor;
        this.velocity.z -= Math.pow( preVel.z , this.power ) / this.divisionFactor;

      }

      this.object.position.add( this.velocity );
      this.velocity.multiplyScalar( this.dampening );

    }

  }


  
}





