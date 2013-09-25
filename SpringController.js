
  /*
   
     CONSTRUCTOR

  */

  function SpringController( params ){

    this.params = _.defaults( params || {}, {
      massController:     massController,
      staticLength:       SS / 4,
      springColor:        0xaaaaaa,
      flatten:            false
    });


    this.springs  = [];
    this.masses   = [];

    // Making the two can communicate to each other
    this.massController = this.params.massController;

    // Lets us know if these springs should flatten the system
    this.flatten        = this.params.flatten;

    // Making some frequently used variables easier to access
    this.masses         = this.massController.masses;
    this.centerMass     = this.massController.centerMass;

  }





  /*
   
     PROTOTYPE

  */


  SpringController.prototype = {
   

    /*

      UDATE:
      updates every spring.  
      Called in the apps main update function

    */

    update:function(){

      for( var i = 0 ; i < this.springs.length; i ++ ){

        this.springs[i].update();

      }

    },


    /*
    
       CREATESPRINGS:
       Creates springs bassed on a certain parameter
       
    */
    createSprings:function ( params ){

      var params = _.defaults( params || {}, {

        type:         "Test App",
        staticLength: this.params.staticLength,
        color:        this.params.springColor,
        flatten:      this.params.flatten

      });

      var type = params.type;

      //First off get an array of all of the masses of this type
      var typeArray = [];

      for( var i = 0; i < this.masses.length; i++ ){
        
        var m = this.masses[i];

        // TODO: Make this usable for not just primary category 
        if( m.params.primaryCategory == type || m.params.secondaryCategory == type ){
          typeArray.push( m );
        }else if( m.params.secondaryCategory == type ){
          typeArray.push( m );
        }

      }

      // Sets our center mass that *should* be the center of the
      // spring system
      this.massController.setCenterMass( type );

      for( var i = 0; i < typeArray.length; i++ ){

        var m1 = typeArray[i];

        // should test to see if it is primary or secondary
        var k = m1.params.primaryCategory == type ? 3 : 2;

        // Makes our length a smaller so they cluster closer to the center
        var l = params.staticLength / 10 ;

        // The First thing we do is attach our spring to the centerMass , 
        // So everything is being pulled towards the center
        var spring = new Spring({
          controller:   this,
          m1:           m1,
          m2:           this.centerMass,
          k:            k,
          l:            params.staticLength/2,
          color:        params.color,
          //flatten:      opts.flatten
        });


        this.springs.push( spring );

        for( var j = i; j < typeArray.length; j++ ){

          var l = params.staticLength;

          var m2 = typeArray[j];

          // Strongest Connection
          if( m1.params.primaryCategory == m2.params.primaryCategory ){

            l = params.staticLength;
            k = 3;
           
          // Weaker Connection
          }else if( 
            m1.params.primaryCategory == m2.params.secondaryCategory ||
            m2.params.primaryCategory == m1.params.secondaryCategory )
          {
         
            l = params.staticLength * 2;
            k = 2;

          // Weakest Connection
          }else if( m1.params.secondaryCategory == m2.params.secondaryCategory ){

            l = params.staticLength * 3;
            k = 1;

          }else{
          
            console.log('OH GOD WHAT HAVE YOU DONE!');

          }

          var spring = new Spring({
            controller:   this,
            m1:           m1,
            m2:           m2,
            k:            k,
            l:            l,
            color:        0xaa0000,
            flatten:      params.flatten,
          });


          this.springs.push( spring );


        }

      }

    },

    flattenSpring: function( i ) {

      this.springs[i].makeFlat();

    },


    flattenAllSprings: function(){

      for( var i = 0; i < this.springs.length; i ++ ){

        this.flattenSpring( i );

      }

    },




    destroyAllSprings:function(){

      // Creates a temporary array of all the springs
      // so we can loop through it instead of our spring array
      // TODO: Figure out if this is the right way to do it
      var tempArray = [];

      for( var i = 0; i < this.springs.length; i++ ){
        tempArray.push( this.springs[i] );
      }

      for( var i = 0; i < tempArray.length; i++ ){
        tempArray[i].destroy();
      }

      //this.springs = [];

    },


    removeSpring: function( i ){

      this.springs[ i ].destroy();

    },


    // Checks for cut springs by seen if they have been crossed
    checkCutSprings: function( pos , oPos ){

      for( var i = 0 ; i < this.springs.length; i ++){

        this.springs[i].checkIfCut( pos , oPos );

      }

    }



}
