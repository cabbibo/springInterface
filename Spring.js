
 
  /*
  
     CONSTRUCTOR

  */

  function Spring( params ){

    this.params = _.defaults( params || {}, {
   
      k:            1,
      l:            SS/10,
      flatten:      false,
      color:        0xaaaaaa,
      linewidth:    2,
    
    });

    this.controller = this.params.controller;

    this.m1         = this.params.m1;                     // Mass 1
    this.m2         = this.params.m2;                     // Mass 2

    this.k          = this.params.k;                      // Spring Constant
    this.l          = this.params.l;                      // Static Length
    this.flatten    = this.params.flatten;

    this.geometry   = new THREE.Geometry();

    this.geometry.vertices.push( new THREE.Vector3() );
    this.geometry.vertices.push( new THREE.Vector3() );

    this.material   = new THREE.LineBasicMaterial({ 
      color:      this.params.color, 
      linewidth:  this.params.linewidth, 
    });

    this.line       = new THREE.Line( this.geometry , this.material );
   
    scene.add( this.line );

    // Makes sure we know the springs that each mass has
    this.m1.springs.push( this );
    this.m2.springs.push( this );


  }




  /*

     PROTOTYPE
  
  */
  Spring.prototype = {

    update:function(){

      this.geometry.vertices[0] = this.m1.position;
      this.geometry.vertices[1] = this.m2.position;
      
      this.geometry.verticesNeedUpdate = true;
      
      this.applyForce();

      // If Dudes need to be flattened,
      // flatten them!
      if( this.flatten ){

        this.m1.flatten();
        this.m2.flatten();
      
      }

    },


    getDistance: function(){

      var d = new THREE.Vector3();
      d.subVectors( this.m1.position,  this.m2.position );

      return d

    },

    getX: function( d ){

      var x = d.length() - this.l;

      return x;


    },


    getForce: function(){

      var d = this.getDistance(); 

      var x = this.getX( d );


      // Get the with the proper direction
      var F = d.normalize().multiplyScalar( x ).multiplyScalar( this.k );

      // Multiply by Spring Constant
     // F.multiplyScalar( this.k );

      return F;


    },

    // Hooke's law !
    applyForce:function(){

      F = this.getForce();

      this.m1.totalForce.sub( F );
      this.m2.totalForce.add( F );

      
    },


    destroy:function(){

      // Removes the spring from the scene
      scene.remove( this.line );


      /*var F = this.getForce();

      F.multiplyScalar( -500 );

      this.applyForce();
      console.log( this.getForce() );

      this.m1.update();
      this.m2.update();*/




      // Removes the spring from the controller
      for( var  i =0; i < this.controller.springs.length; i++){

        if( this.controller.springs[i] == this )
          this.controller.springs.splice( i , 1 );
        
      }

 
      // Removes the spring from m1
      for( var i = 0;  i < this.m1.springs.length; i ++ ){
 
        if( this.m1.springs[i] == this ){
          console.log('ds');
          this.m1.springs.splice( i , 1 );
  
        }
    
      }

      // Removes the spring from m2
      for( var i = 0;  i < this.m2.springs.length; i ++ ){
  
        if( this.m2.springs[i] == this )
          this.m2.springs.splice( i , 1 );
    
      }



    },


    makeFlat:function(){

      this.flatten = true;

    }

  }





