import { EventEmitter } from './utilities/EventEmitter'
import * as THREE from 'three'
import { Engine } from './Engine'

export class DocumentRaycaster extends EventEmitter {
  private raycaster: THREE.Raycaster
  private pointer: THREE.Vector2

  constructor(private engine: Engine) {
    super()
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()

    document.addEventListener('mousemove', (event) => {
      event.preventDefault()
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    } , false)

    document.addEventListener('touchstart', (event) => {
      if (event.touches.length == 1) {
        event.preventDefault()
        this.pointer.x = event.touches[0].pageX - window.innerWidth / 2
        this.pointer.y = event.touches[0].pageY - window.innerHeight / 2
      }
    } , false)

    document.addEventListener('touchmove', (event) => {
      if (event.touches.length == 1) {
        event.preventDefault()
        this.pointer.x = event.touches[0].pageX - window.innerWidth / 2
        this.pointer.y = event.touches[0].pageY - window.innerHeight / 2
      }
    } , false)
    
    document.addEventListener('resize', this.onWindowResize, false);
  }

  private onWindowResize() {
    this.engine.camera.instance.aspect = window.innerWidth / window.innerHeight;
    this.engine.camera.instance.updateProjectionMatrix();
    this.engine.renderEngine.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  public update() {
    this.raycaster.setFromCamera(this.pointer, this.engine.camera.instance)
  }

  public setPointer(x: number, y: number) {
    this.pointer.x = x
    this.pointer.y = y
  }

  public getIntersections() {
    return this.raycaster.intersectObjects(this.engine.scene.children, true)
  }

}
