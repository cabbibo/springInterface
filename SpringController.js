
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


    this.springs = [];

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

      var opts = _.defaults( params || {}, {

        type:         "Test App",
        staticLength: this.params.staticLength,
        color:        this.params.springColor,
        flatten:      this.params.flatten

      });

      var type = opts.type;

      //First off get an array of all of the masses of this type
      var typeArray = [];

      for( var i = 0; i < this.masses.length; i++ ){
        
        var m = this.masses[i];

        //console.log( type );
        console.log( m );
        //console.log(m.params.primaryCategory);
       
        // TODO: Make this usable for not just 
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

        console.log('a');
        var m1 = typeArray[i];

        // should test to see if it is primary or secondary
        var k = m1.params.primaryCategory == type ? 3 : 2;
        console.log( 'K | ' + k );

        // The First thing we do is attach our spring to the centerMass , 
        // So everything is being pulled towards the center
        var spring = new Spring({
          controller:   this,
          m1:           m1,
          m2:           this.centerMass,
          k:            k,
          l:            opts.staticLength,
          color:        opts.color,
          //flatten:      opts.flatten
        });


        this.springs.push( spring );

       for( var j = i; j < typeArray.length; j++ ){

          var m2 = typeArray[j];

          // Strongest Connection
          if( m1.primaryCategory == m2.primaryCategory ){

            k = 3;

          // Weaker Connection
          }else if( 
            m1.primaryCategory == m2.secondaryCategory ||
            m2.primaryCategory == m1.secondaryCategory )
          {
          
            k = 2;

          // Weakest Connection
          }else if( m1.secondaryCategory == m2.secondaryCategory ){

            k = 1;

          }else{
          
            console.log('OH GOD WHAT HAVE YOU DONE!');

          }

          var spring = new Spring({
            controller:   this,
            m1:           m1,
            m2:           m2,
            k:            k,
            l:            opts.staticLength,
            color:        0xaa0000,
            flatten:      opts.flatten,
            id:
          });


          this.springs.push( spring );


        }

      }

    },


    destroyAllSprings = function(){

      this.springs = [];

    }

}
