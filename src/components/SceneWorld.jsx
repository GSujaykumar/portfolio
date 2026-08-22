import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

const readDark = () => document.documentElement.getAttribute('data-theme') === 'dark'

function palette(dark) {
  return dark
    ? { signal: 0x00f0c0, hot: 0xff6b4a, star: 0xc8ffe8, fog: 0x050908 }
    : { signal: 0x00b894, hot: 0xff5a36, star: 0x1a3d34, fog: 0xeef3f1 }
}

const flowVert = `
uniform float uTime;
uniform vec3 uBox;
attribute vec3 aVel;
attribute float aSeed;
varying float vAlpha;
varying float vNear;
void main() {
  vec3 p = position + aVel * uTime;
  p = mod(p + uBox * 0.5, uBox) - uBox * 0.5;
  float swirl = aSeed * 6.28318;
  p.x += sin(p.z * 0.09 + uTime * 0.05 + swirl) * 0.45;
  p.y += cos(p.x * 0.07 + uTime * 0.033 + swirl) * 0.28;
  vNear = clamp((p.z + uBox.z * 0.5) / uBox.z, 0.0, 1.0);
  vAlpha = mix(0.12, 0.7, aSeed) * mix(0.35, 1.0, vNear);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = mix(1.1, 4.8, aSeed) * (78.0 / max(1.4, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`

const flowFrag = `
uniform vec3 uColor;
varying float vAlpha;
varying float vNear;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float glow = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(uColor, vAlpha * glow * mix(0.45, 1.0, vNear));
}
`

const starVert = `
uniform float uTime;
attribute float aSeed;
varying float vAlpha;
void main() {
  float pulse = 0.62 + 0.38 * sin(uTime * mix(0.11, 0.37, aSeed) + aSeed * 17.0);
  vAlpha = mix(0.18, 0.55, aSeed) * pulse;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = mix(0.7, 2.2, aSeed) * (70.0 / max(1.6, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`

const starFrag = `
uniform vec3 uColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float core = pow(smoothstep(0.5, 0.0, d), 2.2);
  gl_FragColor = vec4(uColor, vAlpha * core);
}
`

/**
 * Quiet cinematic backdrop — drifting dust, distant stars, one slow core.
 * Motion never ping-pongs; particle wrap is staggered so no loop is visible.
 */
export default function SceneWorld() {
  const reduce = useReducedMotion()
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (reduce || !mount) return undefined

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const dustCount = mobile ? 180 : 360
    const starCount = mobile ? 90 : 160
    const crystalCount = mobile ? 4 : 6
    const maxDpr = mobile ? 1 : 1.5
    const trash = []
    const keep = (item) => {
      trash.push(item)
      return item
    }

    let width = mount.clientWidth || window.innerWidth
    let height = mount.clientHeight || window.innerHeight
    let running = true
    let raf = 0
    let dark = readDark()
    let colors = palette(dark)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(colors.fog, dark ? 0.038 : 0.055)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: mobile ? 'low-power' : 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80)
    camera.position.set(0, 0.2, 11.4)

    const root = new THREE.Group()
    scene.add(root)

    const glowBlend = dark ? THREE.AdditiveBlending : THREE.NormalBlending

    const core = new THREE.Mesh(
      keep(new THREE.IcosahedronGeometry(1.15, 0)),
      keep(
        new THREE.MeshBasicMaterial({
          color: colors.signal,
          wireframe: true,
          transparent: true,
          opacity: dark ? 0.22 : 0.16,
        })
      )
    )
    root.add(core)

    const coreFill = new THREE.Mesh(
      keep(new THREE.IcosahedronGeometry(0.72, 0)),
      keep(
        new THREE.MeshBasicMaterial({
          color: colors.signal,
          transparent: true,
          opacity: dark ? 0.08 : 0.06,
          blending: glowBlend,
          depthWrite: false,
        })
      )
    )
    root.add(coreFill)

    const makeRing = (radius, color, opacity, tilt) => {
      const mesh = new THREE.Mesh(
        keep(new THREE.TorusGeometry(radius, 0.012, 6, mobile ? 72 : 140)),
        keep(
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            blending: glowBlend,
            depthWrite: false,
          })
        )
      )
      mesh.rotation.set(tilt[0], tilt[1], tilt[2])
      root.add(mesh)
      return mesh
    }
    const ringA = makeRing(3.55, colors.signal, dark ? 0.2 : 0.12, [1.22, 0.18, 0])
    const ringB = makeRing(4.85, colors.hot, dark ? 0.1 : 0.07, [0.72, 0.9, 0.15])

    const nebulaMat = (hex, opacity) =>
      keep(
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity,
          blending: glowBlend,
          depthWrite: false,
        })
      )
    const nebulaA = new THREE.Mesh(keep(new THREE.SphereGeometry(3.4, 24, 16)), nebulaMat(colors.signal, dark ? 0.045 : 0.035))
    nebulaA.position.set(-4.2, 1.4, -3.5)
    const nebulaB = new THREE.Mesh(keep(new THREE.SphereGeometry(2.6, 20, 14)), nebulaMat(colors.hot, dark ? 0.03 : 0.025))
    nebulaB.position.set(5.1, -1.8, -2.8)
    root.add(nebulaA, nebulaB)

    const crystalGeo = keep(new THREE.OctahedronGeometry(0.14))
    const crystalMat = keep(
      new THREE.MeshBasicMaterial({
        color: colors.signal,
        wireframe: true,
        transparent: true,
        opacity: dark ? 0.5 : 0.34,
      })
    )
    const crystals = new THREE.InstancedMesh(crystalGeo, crystalMat, crystalCount)
    const crystalOrbit = []
    const dummy = new THREE.Object3D()
    for (let i = 0; i < crystalCount; i += 1) {
      crystalOrbit.push({
        rx: 3.4 + (i * 1.618) % 2.1,
        rz: 3.1 + (i * 0.73) % 1.8,
        speed: 0.055 + i * 0.0217,
        phase: i * 2.399,
        yAmp: 0.55 + (i % 3) * 0.28,
        scale: 0.7 + (i % 4) * 0.16,
      })
    }
    root.add(crystals)

    const box = new THREE.Vector3(28, 16, 18)
    const dustGeo = keep(new THREE.BufferGeometry())
    const dustPos = new Float32Array(dustCount * 3)
    const dustVel = new Float32Array(dustCount * 3)
    const dustSeed = new Float32Array(dustCount)
    for (let i = 0; i < dustCount; i += 1) {
      dustPos[i * 3] = (Math.random() - 0.5) * box.x
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * box.y
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * box.z
      const drift = 0.018 + Math.random() * 0.055
      const yaw = Math.random() * Math.PI * 2
      dustVel[i * 3] = Math.cos(yaw) * drift
      dustVel[i * 3 + 1] = (Math.random() - 0.42) * 0.012
      dustVel[i * 3 + 2] = Math.sin(yaw) * drift * 0.45
      dustSeed[i] = Math.random()
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    dustGeo.setAttribute('aVel', new THREE.BufferAttribute(dustVel, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1))
    const dustMat = keep(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(colors.signal) },
          uBox: { value: box.clone() },
        },
        vertexShader: flowVert,
        fragmentShader: flowFrag,
        transparent: true,
        depthWrite: false,
        blending: glowBlend,
      })
    )
    root.add(new THREE.Points(dustGeo, dustMat))

    const starGeo = keep(new THREE.BufferGeometry())
    const starPos = new Float32Array(starCount * 3)
    const starSeed = new Float32Array(starCount)
    for (let i = 0; i < starCount; i += 1) {
      starPos[i * 3] = (Math.random() - 0.5) * 36
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 22
      starPos[i * 3 + 2] = -6 - Math.random() * 14
      starSeed[i] = Math.random()
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(starSeed, 1))
    const starMat = keep(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(colors.star) },
        },
        vertexShader: starVert,
        fragmentShader: starFrag,
        transparent: true,
        depthWrite: false,
        blending: glowBlend,
      })
    )
    scene.add(new THREE.Points(starGeo, starMat))

    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const applyTheme = () => {
      dark = readDark()
      colors = palette(dark)
      const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending
      scene.fog.color.setHex(colors.fog)
      scene.fog.density = dark ? 0.038 : 0.055
      core.material.color.setHex(colors.signal)
      core.material.opacity = dark ? 0.22 : 0.16
      coreFill.material.color.setHex(colors.signal)
      coreFill.material.blending = blend
      ringA.material.color.setHex(colors.signal)
      ringA.material.blending = blend
      ringB.material.color.setHex(colors.hot)
      ringB.material.blending = blend
      nebulaA.material.color.setHex(colors.signal)
      nebulaA.material.blending = blend
      nebulaB.material.color.setHex(colors.hot)
      nebulaB.material.blending = blend
      crystalMat.color.setHex(colors.signal)
      dustMat.uniforms.uColor.value.setHex(colors.signal)
      dustMat.blending = blend
      starMat.uniforms.uColor.value.setHex(colors.star)
      starMat.blending = blend
    }

    const themeObs = new MutationObserver(applyTheme)
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const onResize = () => {
      width = mount.clientWidth || window.innerWidth
      height = mount.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    const onVis = () => {
      running = document.visibilityState !== 'hidden'
      if (running) tick()
    }
    document.addEventListener('visibilitychange', onVis)

    const clock = new THREE.Clock()
    let lastFrame = 0
    mount.style.transition = 'opacity 0.45s ease'
    mount.style.opacity = '1'

    const tick = (now) => {
      if (!running) return
      raf = requestAnimationFrame(tick)
      if (now - lastFrame < 26) return
      lastFrame = now

      const scroll = window.scrollY || 0
      const offHero = scroll > height * 0.95
      mount.style.opacity = offHero ? '0' : '1'
      if (offHero) return

      const t = clock.getElapsedTime()

      mouse.x += (target.x - mouse.x) * 0.04
      mouse.y += (target.y - mouse.y) * 0.04

      root.rotation.y = t * 0.028 + mouse.x * 0.22
      root.rotation.x = mouse.y * 0.12
      root.position.y = Math.sin(t * 0.11) * 0.08

      core.rotation.y = t * 0.09
      core.rotation.x = t * 0.045
      coreFill.rotation.y = -t * 0.07

      ringA.rotation.z = t * 0.08
      ringB.rotation.z = -t * 0.051

      nebulaA.position.x = -4.2 + Math.sin(t * 0.07) * 0.55
      nebulaA.position.y = 1.4 + Math.cos(t * 0.053) * 0.4
      nebulaB.position.x = 5.1 + Math.cos(t * 0.061) * 0.45
      nebulaB.position.y = -1.8 + Math.sin(t * 0.044) * 0.35

      crystalOrbit.forEach((o, i) => {
        const a = t * o.speed + o.phase
        dummy.position.set(Math.cos(a) * o.rx, Math.sin(a * 0.71 + o.phase) * o.yAmp, Math.sin(a) * o.rz)
        dummy.rotation.set(t * 0.35 + i, t * 0.22, 0)
        dummy.scale.setScalar(o.scale)
        dummy.updateMatrix()
        crystals.setMatrixAt(i, dummy.matrix)
      })
      crystals.instanceMatrix.needsUpdate = true

      dustMat.uniforms.uTime.value = t
      starMat.uniforms.uTime.value = t

      camera.position.x = mouse.x * 0.7
      camera.position.y = 0.2 + mouse.y * 0.35
      camera.position.z = 11.4 - Math.min(scroll * 0.0009, 1.6)
      camera.lookAt(mouse.x * 0.18, mouse.y * 0.1, 0)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      themeObs.disconnect()
      trash.forEach((item) => item.dispose?.())
      crystals.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [reduce])

  if (reduce) return null

  return <div ref={mountRef} className="scene-world" aria-hidden="true" />
}
