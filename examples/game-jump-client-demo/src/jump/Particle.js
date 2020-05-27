import * as THREE from 'three'
import { getPropSize, rangeNumberInclusive, destroyMesh } from './utils'

/**
 * 粒子类
 */
class Particle {
  constructor ({
    world,
    quantity = 15, // 数量
    triggerObject // 触发对象
  }) {
    this.world = world
    this.quantity = quantity
    this.triggerObject = triggerObject
    this.particleSystem = null

    const { x, y } = getPropSize(triggerObject)

    this.triggerObjectWidth = x

    // 粒子流，垂直方向的范围，约定从小人的上半身出现，算上粒子最大大小
    const flowSizeRange = this.flowSizeRange = [x / 6, x / 3]
    this.flowRangeY = [y / 2, y - flowSizeRange[1]]
    // 粒子初始的y值应该是粒子大小的最大值
    this.initalY = flowSizeRange[1]
    // 限制粒子水平方向的范围
    this.flowRangeX = [-x * 2, x * 2]

    // 粒子喷泉，垂直方向的范围，约定从小人的下半身出现，算上粒子最大大小
    const fountainSizeRange = this.fountainSizeRange = this.flowSizeRange.map(s => s / 2)
    this.fountainRangeY = [fountainSizeRange[1], y / 3]
    this.fountainRangeDistance = [y / 4, y / 2]
    // 限制粒子水平方向的范围
    this.fountainRangeX = [-x / 3, x / 3]

    this.createParticle()
  }

  // 销毁粒子
  destroy () {
    if (this.particleSystem) {
      this.particleSystem.children.forEach(destroyMesh)
      this.particleSystem.children = null
      destroyMesh(this.particleSystem)
    }

    this.world = null
    this.triggerObject = null
    this.particleSystem = null
  }

  // 生成粒子
  createParticle () {
    const { quantity, triggerObject } = this
    // 一半白色、一半绿色
    const white = new THREE.Color( 0xffffff )
    const green = new THREE.Color( 0x58D68D )
    const colors = Array.from({ length: quantity }).map((_, i) => i % 2 ? white : green)
    const particleSystem = this.particleSystem = new THREE.Group()

    new THREE.TextureLoader().load(require('./dot.png'), dot => {
      const baseGeometry = new THREE.Geometry()
      baseGeometry.vertices.push(new THREE.Vector3())

      const baseMaterial = new THREE.PointsMaterial({
        size: 0,
        map: dot,
        // depthTest: false, // 开启后可以透视...
        transparent: true
      })

      colors.forEach(color => {
        const geometry = baseGeometry.clone()
        const material = baseMaterial.clone()
        material.setValues({ color })
  
        const particle = new THREE.Points(geometry, material)
        particleSystem.add(particle)
      })
  
      this.resetParticle()
  
      triggerObject.add(particleSystem)
    })
  }

  // 将粒子放到小人脚下
  resetParticle () {
    const { particleSystem, initalY } = this
    particleSystem.children.forEach(particle => {
      particle.position.y = initalY
      particle.position.x = 0
      particle.position.z = 0
    })
  }

  // 粒子流粒子泵
  runParticleFlowPump () {
    const { particleSystem, quantity, initalY } = this
    // 粒子泵只关心脚下的粒子（水池）
    const particles = particleSystem.children.filter(child => child.position.y === initalY)

    // 脚下的粒子量不够，抽不上来
    if (particles.length < quantity / 3) {
      return
    }

    const {
      triggerObjectWidth,
      flowRangeX, flowRangeY, flowSizeRange
    } = this
    // 比如随机 x 值为0，这个值在小人的身体范围内，累加一个1/2身体宽度，这样做可能有部分区域随机不到，不过影响不大
    const halfWidth = triggerObjectWidth / 2

    particles.forEach(particle => {
      const { position, material } = particle
      const randomX = rangeNumberInclusive(...flowRangeX)
      const randomZ = rangeNumberInclusive(...flowRangeX)
      // 小人的身体内，不能成为起点，需要根据正反将身体的宽度加上
      const excludeX = randomX < 0 ? -halfWidth : halfWidth
      const excludeZ = randomZ < 0 ? -halfWidth : halfWidth

      position.x = excludeX + randomX
      position.z = excludeZ + randomZ
      position.y = rangeNumberInclusive(...flowRangeY)

      material.setValues({ size: rangeNumberInclusive(...flowSizeRange) })
    })
  }

  // 粒子流
  runParticleFlow () {
    if (this.runingParticleFlow) {
      return
    }
    this.runingParticleFlow = true

    const { world, triggerObjectWidth, particleSystem, initalY } = this
    let prevTime = 0
    // 约定速度，每毫秒走多远
    const speed = triggerObjectWidth * 3 / 1000
    const animate = () => {
      const id = requestAnimationFrame(animate)

      if (this.runingParticleFlow) {
        // 抽粒子
        this.runParticleFlowPump()
        if (prevTime) {
          const actives = particleSystem.children.filter(child => child.position.y !== initalY)
          const diffTime = Date.now() - prevTime
          // 粒子的行程
          const trip = diffTime * speed
  
          actives.forEach(particle => {
            const { position } = particle
            const { x, y, z } = position

            if (y < initalY) {
              // 只要粒子的y值超过安全值，就认为它已经到达终点
              position.y = initalY
              position.x = 0
              position.z = 0
            } else {
              const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2) + Math.pow(y - initalY, 2))
              const ratio = (distance - trip) / distance

              position.x = ratio * x
              position.z = ratio * z
              position.y = ratio * y
            }
          })
          world.stage.render()
        }
        prevTime = Date.now()
      } else {
        cancelAnimationFrame(id)
      }
    }
    animate()
  }

  // 停止粒子流
  stopRunParticleFlow () {
    this.runingParticleFlow = false
    this.resetParticle()
  }

  // 粒子喷泉粒子泵
  runParticleFountainPump (particles, duration) {
    const { fountainRangeDistance, triggerObjectWidth, initalY, world } = this
    // 随机设置粒子的终点
    particles.forEach(particle => {
      const { position: { x, y, z } } = particle

      const userData = particle.userData

      userData.ty = y + rangeNumberInclusive(...fountainRangeDistance)
      // x轴和z轴 向外侧喷出
      const diffX = rangeNumberInclusive(0, triggerObjectWidth / 3)
      userData.tx = (x < 0 ? -diffX : diffX) + x
      const diffZ = rangeNumberInclusive(0, triggerObjectWidth / 3)
      userData.tz = (z < 0 ? -diffZ : diffZ) + z
    })
    
    let prevTime = 0
    const startTime = Date.now()
    const speed = triggerObjectWidth * 3 / 600
    
    const animate = () => {
      const id = requestAnimationFrame(animate)
      // 已经在脚下的粒子不用处理
      const actives = particles.filter(particle => particle.position.y !== initalY)

      if (actives.length && !this.runingParticleFlow && Date.now() - startTime < duration) {
        if (prevTime) {
          const diffTime = Date.now() - prevTime
          // 粒子的行程
          const trip = diffTime * speed

          actives.forEach(particle => {
            const {
              position,
              position: { x, y, z },
              userData: { tx, ty, tz }
            } = particle
            if (y >= ty) {
              // 已经到达终点的粒子，重新放到脚下去
              position.x = 0
              position.y = initalY
              position.z = 0
              // 清空ratio值
            } else {
              const diffX = tx - x
              const diffY = ty - y
              const diffZ = tz - z
              const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) + Math.pow(diffZ, 2))
              const ratio = trip / distance

              position.y += ratio * diffY
              position.x += ratio * diffX
              position.z += ratio * diffZ
            }
          })
          world.stage.render()
        }
        prevTime = Date.now()
      } else {
        this.runingParticleFountain = false
        cancelAnimationFrame(id)
      }
    }
    animate()
  }

  // 粒子喷泉
  runParticleFountain () {
    if (this.runingParticleFountain) {
      return
    }
    this.runingParticleFountain = true

    const { particleSystem, quantity, initalY } = this
    // 粒子泵只关心脚下的粒子（水池）
    const particles = particleSystem.children.filter(child => child.position.y === initalY).slice(0, quantity)

    if (!particles.length) {
      return
    }

    const {
      triggerObjectWidth,
      fountainRangeX, fountainSizeRange, fountainRangeY
    } = this
    const halfWidth = triggerObjectWidth / 2

    particles.forEach(particle => {
      const { position, material } = particle
      const randomX = rangeNumberInclusive(...fountainRangeX)
      const randomZ = rangeNumberInclusive(...fountainRangeX)
      // 小人的身体内，不能成为起点，需要根据正反将身体的宽度加上
      const excludeX = randomX < 0 ? -halfWidth : halfWidth
      const excludeZ = randomZ < 0 ? -halfWidth : halfWidth

      position.x = excludeX + randomX
      position.z = excludeZ + randomZ
      position.y = rangeNumberInclusive(...fountainRangeY)

      material.setValues({ size: rangeNumberInclusive(...fountainSizeRange) })
    })

    // 喷射粒子
    this.runParticleFountainPump(particles, 1000)
  }
}

export default Particle