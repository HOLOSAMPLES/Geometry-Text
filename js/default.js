var color;
 var camera, cameraTarget, scene, renderer;
 var group, textMesh1, textMesh2, textGeo, material;
 var firstLetter = true;
 var winWidth = window.innerWidth,winHeight = window.innerHeight;
 var text = "Leia",
 	height = 60,
 	size = 90,
 	hover = 0,
 	curveSegments = 4,
 	bevelThickness = 2,
 	bevelSize = 1.5,
 	bevelSegments = 3,
 	bevelEnabled = true,
 	font = "optimer", 
 	weight = "bold", 
 	style = "normal"; 
 
 var mirror = false;
 
 init();
 animate();
 
 function init() {
 	// CAMERA
 	camera = new LeiaCamera(30, winWidth / winHeight, 1, 1500);
 	camera.position.set( 0, 0, 400 );
 	cameraTarget = new THREE.Vector3( 0, 0, 0 );
 
 	// SCENE
 	scene = new THREE.Scene();
 	scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
 
 	// LIGHTS
 	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
 	dirLight.position.set( 0, 0, 1 ).normalize();
 	scene.add( dirLight );
 
 	var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
 	pointLight.position.set( 0, 100, 90 );
 	scene.add( pointLight );
 
 	pointLight.color.setHSL( Math.random(), 1, 0.5 );
 
 	material = new THREE.MeshFaceMaterial( [ 
 	  new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
 	  new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
 	] );
 
 	group = new THREE.Object3D();
 	//group.position.y = 100;
 	scene.add( group );
 	createText();
 
 	// RENDERER
 	renderer = new LeiaWebGLRenderer({
 		antialias: true,
 		renderMode: _renderMode,
 		camPanelVisible: _camPanelVisible,
 		gyroPanelVisible: _gyroPanelVisible,
 		camFov: _camFov, 
 		devicePixelRatio: 1
 	});
 	renderer.Leia_setSize(winWidth, winHeight);
 	renderer.setClearColor( scene.fog.color, 1 );
 	document.body.appendChild( renderer.domElement );
 }
 //
 
 function createText() {
 
 	textGeo = new THREE.TextGeometry( text, {
 		size: size,
 		height: height,
 		curveSegments: curveSegments,
 		font: font,
 		weight: weight,
 		style: style,
 		bevelThickness: bevelThickness,
 		bevelSize: bevelSize,
 		bevelEnabled: bevelEnabled,
 		material: 0,
 		extrudeMaterial: 1
 	});
 
 	textGeo.computeBoundingBox();
 	textGeo.computeVertexNormals();
 
 	// "fix" side normals by removing z-component of normals for side faces
 	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
 	if ( ! bevelEnabled ) {
 		var triangleAreaHeuristics = 0.1 * ( height * size );
 		for ( var i = 0; i < textGeo.faces.length; i ++ ) {
 
 			var face = textGeo.faces[ i ];
 			if ( face.materialIndex == 1 ) {
 				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
 					face.vertexNormals[ j ].z = 0;
 					face.vertexNormals[ j ].normalize();
 				}
 
 				var va = textGeo.vertices[ face.a ];
 				var vb = textGeo.vertices[ face.b ];
 				var vc = textGeo.vertices[ face.c ];
 				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
 
 				if ( s > triangleAreaHeuristics ) {
 					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
 						face.vertexNormals[ j ].copy( face.normal );
 					}
 				}
 			}
 		}
 	}
 
 	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
 	textMesh1 = new THREE.Mesh( textGeo, material );
 	textMesh1.position.x = centerOffset;
 	textMesh1.position.y = hover;
 	textMesh1.position.z = 0;
 	textMesh1.rotation.x = 0;
 	textMesh1.rotation.y = Math.PI * 2;
 	group.add( textMesh1 );
 
 	if ( mirror ) {
 		textMesh2 = new THREE.Mesh( textGeo, material );
 		textMesh2.position.x = centerOffset;
 		textMesh2.position.y = -hover;
 		textMesh2.position.z = height;
 		textMesh2.rotation.x = Math.PI;
 		textMesh2.rotation.y = Math.PI * 2;
 		group.add( textMesh2 );
 	}
 }
 
 //
 function animate() {
 	requestAnimationFrame( animate );
 	render();
 }
 
 function render() {
 	camera.lookAt( cameraTarget );
 	renderer.clear();
  renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0)); 
	renderer.Leia_render(scene, camera);
 }