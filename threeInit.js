function threeInit( SceneSize ){
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight , SS / 1000 , SS * 5 );
  camera.position.z = SceneSize;

  controls = new THREE.OrbitControls( camera );

  scene = new THREE.Scene();

  container = document.getElementById( 'container' );
  renderer = new THREE.WebGLRenderer( { antialias: true, clearColor:0x000000 } );
  stats = new Stats();
  
  renderer.setSize( window.innerWidth, window.innerHeight );
 
  container.position                = 'absolute';
  container.style.top               = '0px';
  container.style.left              = '0px';

  stats.domElement.style.position   = 'absolute';
  stats.domElement.style.bottom     = '0px';
  stats.domElement.style.right      = '0px';

  container.appendChild( renderer.domElement );
  container.appendChild( stats.domElement );
  
  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}



function start(){    
  animationLoop();
}

function stop() {
  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  }
}

function animate(){

  theta += clock.getDelta();

  update();
  controls.update();
  stats.update();
  renderer.render( scene , camera )

}   

function animationLoop() {
  animate();
  requestId = window.requestAnimationFrame(animationLoop);
}

    
    

