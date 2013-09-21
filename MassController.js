 function MassController( params  ){

    this.params = _.defaults( params || {}, {
      apps:           Apps,
      friction:       .95,
      flatten:        false,
    });

    this.apps     = this.params.apps;
    this.friction = this.params.friction;

    this.masses   = [];

    
    // Creates a massively heavy mass,
    // Which is not added to the array of masses
    // because than it would get pulled around
    this.centerMass = new Mass( this );

    //this.masses.push( this.centerMass );

    this.createMasses( this.apps );

  }


  MassController.prototype = {
    
    createMasses:function(){

      for( var i = 0; i < this.apps.length; i ++){

        var mass = new Mass( this , this.apps[i]  );
        mass.randomPosition();
        
        this.masses.push( mass );

      }

    },

    // Sets this mass as a center mass
    // making it so that it has inifinte mass
    // and will connect to all the objects of 
    // current spring type
    setCenterMass :function( type ){
      
      this.centerMass.placeInFrontOfCamera();

    },


    flattenMasses: function(){

      for( var i = 0 ; i < this.masses.length; i ++ ){

        this.masses[i].flattenAllSprings();

      }

    },

    destroyMasses: function(){

      this.masses = [];

    },

    update: function(){

      for( var i = 0 ; i < this.masses.length; i++ ){
        this.masses[i].update();
      }

    }

  }
