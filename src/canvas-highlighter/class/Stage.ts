import Konva from 'konva'
import { IRangeConfig } from '../utils/types'

const RECT_PREFIX = 'rect-'
const LINE_PREFIX = 'line-'

export interface IRectPosition {
  x: number
  y: number
  width: number
  height: number
}

export default class Stage {
  private root: HTMLElement
  private container: HTMLDivElement

  private stage: Konva.Stage
  private layer: Konva.Layer

  private groups: Array<{
    id: string
    group: Konva.Group,
    positions: IRectPosition[]
  }> = []

  constructor(root: HTMLElement, pixelRatio?: number) {
    this.root = root

    this.container = this.createContainer()
    root.appendChild(this.container)
    const { width, height } = this.getRootPosition()
    this.stage = new Konva.Stage({
      container: this.container,
      width,
      height
    })
    this.layer = new Konva.Layer()
    if (pixelRatio) this.layer.getCanvas().setPixelRatio(pixelRatio)
    this.stage.add(this.layer)
  }

  private createContainer() {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.right = '0'
    el.style.bottom = '0'
    el.style.pointerEvents = 'none'
    return el
  }

  renderRange(domRects: DOMRect[], id: string, config: IRangeConfig) {
    const { group, rectGroup, lineGroup } = this.createGroup(id, config)

    const { top, left } = this.getRootPosition()
    const positions: IRectPosition[] = []
    domRects.forEach((i, index) => {
      const x = i.left - left
      const y = i.top - top
      const position = {
        x,
        y,
        width: i.width,
        height: i.height
      }
      positions.push(position)

      if (index === domRects.length - 1) {
        rectGroup.add(this.createRect(position, config.rect))
        rectGroup.add(this.createText(position))
      }
      lineGroup.add(this.createLine(position, config.line))
    })
    this.groups.push({ id, group, positions })
    this.layer.add(group)
  }

  private createGroup(id: string, config: IRangeConfig) {
    const group = new Konva.Group({ id, x: 0, y: 0 })
    const rectGroup = new Konva.Group({
      id: RECT_PREFIX + id,
      x: 0,
      y: 0,
      visible: config.rect.visible
    })
    const lineGroup = new Konva.Group({
      id: LINE_PREFIX + id,
      x: 0,
      y: 0,
      visible: config.line.visible
    })
    group.add(rectGroup)
    group.add(lineGroup)
    return { group, rectGroup, lineGroup }
  }

  private createRect(position: IRectPosition, config: IRangeConfig['rect']) {
    const x = position.x + position.width
    const y = position.y + position.height
    
    return new Konva.Rect({
      width: 24,
      height: 16,
      x,
      y,
      fill: config.fill,
      cornerRadius: 10,
      ...config.konvaConfig
    })
  }

  private createText(position: IRectPosition) {
    const x = position.x + position.width
    const y = position.y + position.height
    
    return new Konva.Text({
      width: 24,
      height: 16,
      x,
      y,
      text: '1',
      align: 'center',
      fontSize: 12,
      lineHeight: 1.5,
      fill: '#fff'
    })
  }

  private createLine(position: IRectPosition, config: IRangeConfig['line']) {
    const { x, y, width, height } = position
    return new Konva.Line({
      points: [
        x,
        y + height + 8,
        x + width,
        y + height + 8
      ],
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      ...config.konvaConfig
    })
  }

  geGroupIdByPointer(x: number, y: number) {
    const { top, left } = this.getRootPosition()
    x = x - left
    y = y - top
    const target = this.groups.find(i => {
      return i.positions.some(j => {
        return (
          x >= j.x + j.width &&
          x <= j.x + j.width + 24 &&
          y >= j.y + j.height &&
          y <= j.y + j.height + 16
        )
      })
    })
    if (target) {
      const position = target.positions[target.positions.length - 1]
      return {
        id: target.group.id(),
        position
      }
    } else {
      return null
    }
  }

  private getRootPosition() {
    return this.root.getBoundingClientRect()
  }

  deleteRange(id: string) {
    const index = this.groups.findIndex(i => i.id === id)
    if (index === -1) return false
    this.groups.splice(index, 1)
    const group = this.layer.find('#' + id)[0]
    group && group.destroy()
  }

  clear() {
    this.layer.destroyChildren()
    this.groups = []
  }

  updateStageSize() {
    const { width, height } = this.getRootPosition()
    this.stage.setSize({ width, height })
  }
}
