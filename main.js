import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Tween, Group } from '@tweenjs/tween.js';
import {
    computeBoundsTree, disposeBoundsTree, acceleratedRaycast,
} from 'three-mesh-bvh';

// BUTTONS
const aboutMeButton = document.getElementById('btn-about-me');
const projectsButton = document.getElementById('btn-projects');
const resumeButton = document.getElementById('btn-resume');
const homeButton  = document.getElementById('home-link');

homeButton?.addEventListener('click', () => {
    window.location.href = '/';
});

aboutMeButton?.addEventListener('click', () => {
    window.location.href = '/about-me';
});

projectsButton?.addEventListener('click', () => {
    window.location.href = '/projects';
});

resumeButton?.addEventListener('click', () => {
    window.location.href = '/resume';
});

const isIndexPage = window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '/index';

if (isIndexPage) {
    loadName().catch(console.error);
}

// THREEJS
async function loadName() {
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;

    const particleRadius = 40;
    const group = new Group(); 


    let cameraProgress = 0;
    let cameraSpeed = 0.0018; 

    let scene, camera, renderer, controls, curve, glowingRectangle;
    let pointsMesh0, pointsMesh1;
    let uniforms = {
        particles: {
            action: { value: 0 },
            delayRatio: { value: 0.875 },
        }
    };

    init();

    function init() {
        initScene();
        initCamera();
        initRenderer();
        initControls();
        // defineCameraPath();
        loadModel();
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('load', onWindowResize, false);

        const gathering = new Tween(uniforms.particles.action)
            .to({ value: 1 }, 30000)
            .delay(1000)
            .onComplete(() => {
                console.log('Animation Complete');
            })
            .start(); 

        group.add(gathering); 
    }

    function initScene() {
        scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
    }

    function defineCameraPath() {
        curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(40, 0, 40),
            new THREE.Vector3(-40, 5, 40),
            new THREE.Vector3(-40, 7, -40),
            new THREE.Vector3(40, 7, -40),
            new THREE.Vector3(40, 5, 40),
            new THREE.Vector3(0, 0, 25)
        ],
        false,
        'centripetal',
        .2
        );

        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 8, true);
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        //scene.add(tube);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.01,
            3000
        );
        camera.position.set(0, 0, 25);
        window.mobileCheck = function() {
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            if(check) {
                camera.position.set(0, 0, 75);
            }
          };
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        const rendererContainer = document.querySelector('.renderer-container');
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(1780, 940);
        rendererContainer.appendChild(renderer.domElement);
    }

    function initControls() {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.target.set(0, 0, 0);
        controls.enabled = false;
    }

    function loadModel() {
        const loader = new GLTFLoader();
        loader.load('./ModelofMyName.glb', function (gltf) {
            const model = gltf.scene.children[0];            model.material.side = THREE.DoubleSide;
            model.material.normalMapType = THREE.ObjectSpaceNormalMap;

            let geom = model.geometry;

            geom.rotateX(Math.PI / 2);

            geom.computeVertexNormals();
            geom.center();
            geom.computeBoundsTree();

            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                side: THREE.DoubleSide,
                opacity: 0
            });
            const mesh = new THREE.Mesh(geom, material);
            scene.add(mesh);
            mesh.visible = false;

            createPoints(mesh);
            animate();
        });
    }

    function createPoints(mesh) {
        const { positions, positionsStart, positionsDelay } = fillWithPoints(mesh, 3600);

        const points0 = [];
        const points1 = [];
        const startPoints0 = [];
        const startPoints1 = [];
        const delays0 = [];
        const delays1 = [];

        for (let i = 0; i < positions.length; i += 3) {
            if (Math.random() < 0.5) {
                points0.push(positions[i], positions[i + 1], positions[i + 2]);
                startPoints0.push(positionsStart[i], positionsStart[i + 1], positionsStart[i + 2]);
                delays0.push(positionsDelay[i / 3]);
            } else {
                points1.push(positions[i], positions[i + 1], positions[i + 2]);
                startPoints1.push(positionsStart[i], positionsStart[i + 1], positionsStart[i + 2]);
                delays1.push(positionsDelay[i / 3]);
            }
        }

        const pointsGeometry0 = new THREE.BufferGeometry();
        pointsGeometry0.setAttribute('position', new THREE.Float32BufferAttribute(points0, 3));
        pointsGeometry0.setAttribute('positionStart', new THREE.Float32BufferAttribute(startPoints0, 3));
        pointsGeometry0.setAttribute('positionDelay', new THREE.Float32BufferAttribute(delays0, 1));

        const pointsGeometry1 = new THREE.BufferGeometry();
        pointsGeometry1.setAttribute('position', new THREE.Float32BufferAttribute(points1, 3));
        pointsGeometry1.setAttribute('positionStart', new THREE.Float32BufferAttribute(startPoints1, 3));
        pointsGeometry1.setAttribute('positionDelay', new THREE.Float32BufferAttribute(delays1, 1));

        const pointsMaterial0 = createPointsMaterial(1, '0', 'green');
        const pointsMaterial1 = createPointsMaterial(1, '1', 'green');

        pointsMesh0 = new THREE.Points(pointsGeometry0, pointsMaterial0);
        pointsMesh1 = new THREE.Points(pointsGeometry1, pointsMaterial1);

        pointsMesh0.frustumCulled = false;
        pointsMesh1.frustumCulled = false;

        pointsMesh0.material.needsUpdate = true;
        pointsMesh1.material.needsUpdate = true;

        scene.add(pointsMesh0);
        scene.add(pointsMesh1);
    }

    function createPointsMaterial(size, text, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.font = '48px Arial';
        context.fillText(text, 10, 50);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        return new THREE.PointsMaterial({
            size: size,
            sizeAttenuation: true,
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
            onBeforeCompile: (shader) => {
                shader.uniforms.action = uniforms.particles.action;
                shader.uniforms.delayRatio = uniforms.particles.delayRatio;
                shader.vertexShader = `
                #define s(a, b, c) smoothstep(a, b, c)

                uniform float action;
                uniform float delayRatio;

                attribute vec3 positionStart;
                attribute float positionDelay;

                varying float vTint;
                varying float vRealAction;
                varying float vAmplitude;
                
                float bump(float a, float b, float c, float f){
                return s(a, b, f) - s(b, c, f);
                }

                float mapLinear01(float x, float a1, float a2){
                float f = ( x - a1 ) / ( a2 - a1 );
                f = clamp(f, 0., 1.);
                return f;
                }
                
                // Noise Function
                float N31(vec3 p) {
                vec3 a = fract(vec3(p.xyz) * vec3(213.897, 653.453, 253.098));
                a += dot(a, a.yzx + 79.76);
                return fract((a.x + a.y) * a.z);
                }

                float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

                float noise(vec3 p){
                    vec3 a = floor(p);
                    vec3 d = p - a;
                    d = d * d * (3.0 - 2.0 * d);

                    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
                    vec4 k1 = perm(b.xyxy);
                    vec4 k2 = perm(k1.xyxy + b.zzww);

                    vec4 c = k2 + a.zzzz;
                    vec4 k3 = perm(c);
                    vec4 k4 = perm(c + 1.0);

                    vec4 o1 = fract(k3 * (1.0 / 41.0));
                    vec4 o2 = fract(k4 * (1.0 / 41.0));

                    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
                    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

                    return o4.y * d.y + o4.x * (1.0 - d.y);
                }

                ${shader.vertexShader}
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>

                    vec3 pStart = positionStart;
                    vec3 pEnd = position;

                    float realDelay = positionDelay * delayRatio;
                    float pureAction = 1.0 - delayRatio;
                    float realAction = mapLinear01(action, realDelay, realDelay + pureAction);
                    vRealAction = realAction;

                    transformed = mix(pStart, pEnd, realAction);

                    float slope = sin(realAction * PI);
                    transformed.y += slope * distance(pStart, pEnd) * 0.5 * N31(pStart);

                    vTint = length(transformed.xz) / ${particleRadius}.;
                    `
                );

                shader.fragmentShader = `
                    #define s(a, b, c) smoothstep(a, b, c)
                    varying float vTint;
                    varying float vRealAction;
                    varying float vAmplitude;

                    float bump(float a, float b, float c, float f){
                    return s(a, b, f) - s(b, c, f);
                    }
                    ${shader.fragmentShader}
                `
                    .replace(
                        `#include <clipping_planes_fragment>`,
                        `
                        #include <clipping_planes_fragment>`
                    )
                    .replace(
                        `#include <color_fragment>`,
                        `#include <color_fragment>

                        vec3 darkGreen = vec3(0.0, 0.3, 0.0); // Dark green
                        vec3 lightGreen = vec3(0.0, 0.7, 0.0); // Light green

                        vec3 finalColor = mix(darkGreen, lightGreen, clamp(vTint, 0.0, 1.0));

                        float glowThreshold = .995  ; // Start glowing when vRealAction > 0.95
                        float glowIntensity = smoothstep(glowThreshold, 1.0, vRealAction);

                        finalColor += glowIntensity * vec3(0.05, 0.1, 0.05); 

                        finalColor = clamp(finalColor, 0.0, 1.0);

                        diffuseColor.rgb = finalColor;
                    `
                    );
            }
        });
    }

    function fillWithPoints(mesh, count) {
        const ray = new THREE.Raycaster();
        ray.firstHitOnly = true;

        const meshInvMatrix = new THREE.Matrix4();
        meshInvMatrix.copy(mesh.matrixWorld).invert();
        const localRay = new THREE.Ray();

        mesh.geometry.computeBoundingBox();
        const bbox = mesh.geometry.boundingBox;
        const bsize = new THREE.Vector3();
        bbox.getSize(bsize);

        const points = [];
        const pointsStart = [];
        const pointsDelay = [];

        const dir = new THREE.Vector3(0, 1, 0);
        const v = new THREE.Vector3();
        const vps = new THREE.Vector3();
        let counter = 0;

        const offScreenRadius = Math.max(bsize.x, bsize.y, bsize.z) * 8;

        while (counter < count) {
            v.set(
                THREE.MathUtils.randFloat(bbox.min.x, bbox.max.x),
                THREE.MathUtils.randFloat(bbox.min.y, bbox.max.y),
                THREE.MathUtils.randFloat(bbox.min.z, bbox.max.z)
            );
            if (isInside(v)) {
                vps.setFromSphericalCoords(
                    offScreenRadius, 
                    Math.random() * Math.PI,
                    Math.random() * Math.PI * 2
                );

                pointsStart.push(vps.x, vps.y, vps.z);
                pointsDelay.push((v.y - bbox.min.y) / bsize.y);

                points.push(v.x, v.y, v.z); 
                counter++;
            }
        }

        function isInside(v) {
            ray.set(v, dir);
            const intersects = ray.intersectObject(mesh);

            localRay.copy(ray.ray).applyMatrix4(meshInvMatrix);

            if (intersects.length > 0) {
                if (intersects[0].face.normal.dot(localRay.direction) > 0) return true;
            }
            return false;
        }

        return {
            positions: points,
            positionsStart: pointsStart,
            positionsDelay: pointsDelay
        };
    }

    function onWindowResize() {
        // renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        // camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function animate(time) {
        requestAnimationFrame(animate);
        group.update(time * 6.5); 

        // if (cameraProgress <= 1) {
        //     cameraProgress += cameraSpeed;
        //     if(cameraProgress >= 88) cameraSpeed += -0.004;
        //     if (cameraProgress > 1) cameraProgress = 1;

        //     const newCameraPosition = curve.getPoint(cameraProgress);
        //     camera.position.copy(newCameraPosition);

        //     const nextPoint = curve.getPoint((cameraProgress + 0.001) % 1);
        //     camera.lookAt(nextPoint);

        // } else {
        //     camera.position.set(0, 0, 25);
        //     camera.lookAt(new THREE.Vector3(0, 0, 0));
        // }

        controls.update();
        renderer.render(scene, camera);
    }
}

