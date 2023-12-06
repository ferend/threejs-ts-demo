import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Box } from './Box'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { TweenMax } from 'gsap'

export class Demo implements Experience {
  resources: Resource[] = []
  private setTintNum: Boolean
  private city: THREE.Object3D
  private smoke = new THREE.Object3D()

  constructor(private engine: Engine) {
    this.setTintNum = true
    this.city = this.createCity()
    var gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000)

    this.city.add(gridHelper)
  }

  init() {
    this.createPlane()
    this.createLight()
    this.generateLines()

    this.engine.scene.add(this.city)
    this.createMat()

    if (window.innerWidth > 800) {
      this.engine.renderEngine.renderer.shadowMap.enabled = true
      this.engine.renderEngine.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.engine.renderEngine.renderer.shadowMap.needsUpdate = true
    }

    var setcolor = 0xf02050

    this.engine.scene.background = new THREE.Color(setcolor)
    this.engine.scene.fog = new THREE.Fog(setcolor, 10, 16)
  }

  private createCity(): THREE.Object3D {
    var town = new THREE.Object3D()
    var segments = 2
    for (var i = 1; i < 100; i++) {
      var geometry = new THREE.BoxGeometry(
        1,
        0,
        0,
        segments,
        segments,
        segments
      )

      var material = new THREE.MeshStandardMaterial({
        color: this.setTintColor(),
        wireframe: false,
        side: THREE.DoubleSide,
      })
      var wmaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
      })

      var cube = new Box()
      cube.material = material
      var floor = new THREE.Mesh(geometry, material)
      var wfloor = new THREE.Mesh(geometry, wmaterial)

      cube.add(wfloor)
      cube.castShadow = true
      cube.receiveShadow = true

      floor.scale.y = 0.05 //+mathRandom(0.5);
      cube.scale.y = 0.1 + Math.abs(this.mathRandom(8))

      var cubeWidth = 0.9
      cube.scale.x = cube.scale.z = cubeWidth + this.mathRandom(1 - cubeWidth)
      cube.position.x = Math.round(this.mathRandom())
      cube.position.z = Math.round(this.mathRandom())

      floor.position.set(
        cube.position.x,
        0 /*floor.scale.y / 2*/,
        cube.position.z
      )

      town.add(floor)
      town.add(cube)
      town.add(this.smoke)
    }
    return town
  }

  private createMat() {
    var gmaterial = new THREE.MeshToonMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    })
    var gparticular = new THREE.CircleGeometry(0.01, 3)
    var aparticular = 5

    for (var h = 1; h < 300; h++) {
      var particular = new THREE.Mesh(gparticular, gmaterial)
      particular.position.set(
        this.mathRandom(aparticular),
        this.mathRandom(aparticular),
        this.mathRandom(aparticular)
      )
      particular.rotation.set(
        this.mathRandom(),
        this.mathRandom(),
        this.mathRandom()
      )
      this.smoke.add(particular)
    }

    var pmaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 0.9,
      transparent: true,
    })
    var pgeometry = new THREE.PlaneGeometry(60, 60)
    var pelement = new THREE.Mesh(pgeometry, pmaterial)
    pelement.rotation.x = (-90 * Math.PI) / 180
    pelement.position.y = -0.001
    pelement.receiveShadow = true

    this.city.add(pelement)
  }

  private mathRandom(num = 8) {
    var numValue = -Math.random() * num + Math.random() * num
    return numValue
  }

  private setTintColor() {
    if (this.setTintNum) {
      this.setTintNum = false
      var setColor = 0x000000
    } else {
      this.setTintNum = true
      var setColor = 0x000000
    }
    //setColor = 0x222222;
    return setColor
  }

  private createLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 4)
    var lightFront = new THREE.SpotLight(0xffffff, 20, 10)
    var lightBack = new THREE.PointLight(0xffffff, 0.5)

    lightFront.rotation.x = (45 * Math.PI) / 180
    lightFront.rotation.z = (-45 * Math.PI) / 180
    lightFront.position.set(5, 5, 5)
    lightFront.castShadow = true
    lightFront.shadow.mapSize.width = 6000
    lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width
    lightFront.penumbra = 0.1
    lightBack.position.set(0, 6, 0)

    this.smoke.position.y = 2

    this.engine.scene.add(ambientLight)
    this.city.add(lightFront)
    this.engine.scene.add(lightBack)
  }

  private createCars(
    cScale = 2,
    cPos = 20,
    cColor = 0xffff00,
    createCarPos = true
  ) {
    var cMat = new THREE.MeshToonMaterial({
      color: cColor,
      side: THREE.DoubleSide,
    })
    var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40)
    var cElem = new THREE.Mesh(cGeo, cMat)
    var cAmp = 3

    if (createCarPos) {
      createCarPos = false
      cElem.position.x = -cPos
      cElem.position.z = this.mathRandom(cAmp)

      TweenMax.to(cElem.position, 3, {
        x: cPos,
        repeat: -1,
        yoyo: true,
        delay: this.mathRandom(3),
      })
    } else {
      createCarPos = true
      cElem.position.x = this.mathRandom(cAmp)
      cElem.position.z = -cPos
      cElem.rotation.y = (90 * Math.PI) / 180

      TweenMax.to(cElem.position, 5, {
        z: cPos,
        repeat: -1,
        yoyo: true,
        delay: this.mathRandom(3),
      })
    }
    cElem.receiveShadow = true
    cElem.castShadow = true
    cElem.position.y = Math.abs(this.mathRandom(5))
    this.city.add(cElem)
  }

  private generateLines() {
    for (var i = 0; i < 60; i++) {
      this.createCars(0.1, 20)
    }
  }

  private createPlane() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    )

    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true

    this.engine.scene.add(plane)
  }

  resize() {}

  update() {}
}
