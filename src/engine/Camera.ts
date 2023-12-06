import { Engine } from './Engine'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GameEntity } from './GameEntity'

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  private controls!: OrbitControls

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      1,
      500
    )
    this.instance.position.z = 5
    this.instance.position.y = 2
    this.instance.position.set(0, 2, 14)
    this.engine.scene.add(this.instance)
  }

  private initControls() {
    this.controls = new OrbitControls(this.instance, this.engine.canvas)
    this.controls.enableZoom = false // Zoom
    this.controls.enablePan = false // Right mouse click

    this.controls.update()
  }

  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  update() {
    // Ensure the camera doesn't go below y = 1
    if (this.instance.position.y < 1) {
      this.instance.position.y = 1
    }
    this.controls.update()
  }
}
