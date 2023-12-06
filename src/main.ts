import './style.scss'
import { Engine } from './engine/Engine'
import { Demo } from './demo/Demo'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Demo,
  info: {
    twitter: 'https://twitter.com/erendalcik',
    github: 'https://github.com/ferend',
    description: 'A simple Three.js + Typescript + Vite starter project',
    documentTitle: 'Dark City',
    title: 'Dark City',
  },
})
