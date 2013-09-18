
  function Mass( params , controller){

    this.params = _.defaults( params || {}, {
      image: "images/default.png",
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

    this.scene.add( this.mesh );
    scene.add( this.scene );

  }


  Mass.prototype = {

    randomPosition: function(){

      this.position.x = Math.randomRange( SS/2 );
      this.position.y = Math.randomRange( SS/2 );
      this.position.z = Math.randomRange( SS/2 );
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


    // TODO: Update this so it will always be infront of camera
    placeInFrontOfCamera: function(){

      this.position.x = 0;
      this.position.y = 0;
      this.position.z = 0;

    }


  }


  function MassController( params  ){

    this.params = _.defaults( params || {}, {
      apps:           Apps,
      friction:       .95,
      flatten:        false,
    });

    this.apps     = this.params.apps;
    this.friction = this.params.friction;

    this.masses   = [];

    
    // Creates a massively heavy mass
    this.centerMass = new Mass();
    //this.centerMass.mass = 1000000000;
    this.centerMass.mass = 1;

    this.createMasses( this.apps );

  }


  MassController.prototype.createMasses = function(){


    for( var i = 0; i < this.apps.length; i ++){

      var mass = new Mass( this.apps[i] , this );
      mass.randomPosition();
      
      this.masses.push( mass );

    }

  }

  // Sets this mass as a center mass
  // making it so that it has inifinte mass
  // and will connect to all the objects of 
  // current spring type
  MassController.prototype.setCenterMass = function( type ){
    
    this.centerMass.placeInFrontOfCamera();

  }
  MassController.prototype.destroyMasses = function(){

    this.masses = [];

  }

  MassController.prototype.update = function(){

    for( var i = 0 ; i < this.masses.length; i++ ){
      this.masses[i].update();
    }

  }
