// import * as THREE from 'three';

export class Stage {
    public renderParam: { width: number; height: number };
    public scene: null | THREE.Scene;
    public camera: null | THREE.PerspectiveCamera;
    public renderer: null | THREE.WebGLRenderer;
    public geometry: null;
    public material: null;
    public mesh: null;
    public isInitialized: boolean;

    constructor() {
        this.renderParam = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;

        this.isInitialized = false;
    }

    init() {
        this._setScene();
        this._setRender();
        this._setCamera();
        this._setFog();

        this.isInitialized = true;
    }

    _setScene() {
        this.scene = new window.THREE.Scene();
    }

    _setRender() {
        const elem: any = document.getElementById('webgl-universe');
        this.renderer = new window.THREE.WebGLRenderer({
            canvas: elem,
            alpha: true,
        });
        this.renderer!.setPixelRatio(window.devicePixelRatio);
        this.renderer!.setSize(this.renderParam.width, this.renderParam.height);
    }

    _setCamera() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (!this.isInitialized) {
            this.camera = new window.THREE.PerspectiveCamera(150, this.renderParam.width / this.renderParam.height);
        }

        this.camera!.aspect = windowWidth / windowHeight;
        this.camera!.updateProjectionMatrix();
        this.renderer!.setPixelRatio(window.devicePixelRatio);
        this.renderer!.setSize(windowWidth, windowHeight);
    }

    _setFog() {
        this.scene!.fog = new window.THREE.Fog(0x000000, 50, 2000);
    }
    _render() {
        let rot = 0;
        rot += 0.1;
        const radian = (rot * Math.PI) / 180;
        this.camera!.position.x = 1000 * Math.sin(radian);
        this.camera!.position.z = 1000 * Math.cos(radian);
        this.camera!.lookAt(new window.THREE.Vector3(0, 0, 0));
        this.renderer!.render(this.scene!, this.camera!);
    }

    onResize() {
        this._setCamera();
    }
    onRaf() {
        this._render();
    }
}

export class Mesh {
    stage: any;
    mesh: null | THREE.Points;
    constructor(stage) {
        this.stage = stage;
        this.mesh = null;
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const geometry = new window.THREE.Geometry();
        for (let i = 0; i < 20000; i++) {
            const star = new window.THREE.Vector3();
            star.x = window.THREE.MathUtils.randFloatSpread(2000);
            star.y = window.THREE.MathUtils.randFloatSpread(2000);
            star.z = window.THREE.MathUtils.randFloatSpread(2000);

            geometry.vertices.push(star);
        }
        const texture = new window.THREE.TextureLoader().load('../images/ico-star.png');
        const material = new window.THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            map: texture,
        });
        material.alphaTest = 0.5;
        this.mesh = new window.THREE.Points(geometry, material);
        this.stage.scene.add(this.mesh);
    }

    _render() {
        this.mesh!.rotation.y += 0.0002;
    }

    onRaf() {
        this._render();
    }
}
