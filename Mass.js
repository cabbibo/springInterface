
  function Mass( controller , params ){

    this.params = _.defaults( params || {}, {
      image:          "images/default.png",     
    });

    this.controller   = controller;

    this.mass         = 1000;
    
    this.totalForce   = new THREE.Vector3();

    this.position     = new THREE.Vector3();
    this.velocity     = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();

    this.scene        = new THREE.Object3D();
    this.size         = SS / 20;
    this.geometry     = new THREE.CubeGeometry( this.size , this.size , this.size );

    this.texture      = new THREE.ImageUtils.loadTexture( this.params.image );
    this.material     = new THREE.MeshLambertMaterial({ map: this.texture });

    this.mesh         = new THREE.Mesh( this.geometry , this.material );

    this.springs      = [];

    this.scene.add( this.mesh );
    scene.add( this.scene );

  }


  Mass.prototype = {

    randomPosition: function( size ){

      this.position.x = Math.randomRange( size );
      this.position.y = Math.randomRange( size );
      this.position.z = Math.randomRange( size );
      this.updatePosition();

    },


    updatePosition:function(){

      this.scene.position = this.position;

    },

    update: function(){

      this.acceleration = this.totalForce.multiplyScalar( 1 / this.mass );
      this.velocity.add( this.acceleration );
      
      //friction
      this.velocity.multiplyScalar( this.controller.friction );

      this.position.add( this.velocity );

      this.updatePosition();

      

    },


    // Used when we want the objects to move to the same
    // plane as the centerMass
    flatten: function(){

      var d = this.controller.centerMass.position.z - this.position.z ;  
      this.totalForce.z = d;

    },

    destroySprings: function(){

      for( var i = 0; i < this.springs.length; i ++ ){

        this.springs[i].destroy();

      }

    },

    flattenAllSprings: function(){

      for( var i = 0; i < this.springs.length; i ++ ){

        this.springs[i].makeFlat();

      }

    },



    // TODO: Update this so it will always be infront of camera
    placeInFrontOfCamera: function(){

      this.position.x = camera.position.x;
      this.position.y = camera.position.y;
      this.position.z = camera.position.z - SS /2;

      this.updatePosition();

    }


  }


