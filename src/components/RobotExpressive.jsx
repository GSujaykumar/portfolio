import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

const ACCENT = 0x00f0c0
const FIT_MARGIN = 1.12
const FOLLOW_YAW = 0.95

/**
 * RobotExpressive control API (via onReady):
 *   playEmote / travel / dance / sit / setExpression / setSpin
 *   celebrate / flip / combo / boost
 */
export default function RobotExpressive({ className = '', onReady, onClick }) {
  const mountRef = useRef(null)
  const hoverRef = useRef(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady
  const [loaded, setLoaded] = useState(false)
  const [fx, setFx] = useState('idle') // idle | boost | celebrate | combo

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const rect = mount.getBoundingClientRect()
    let width = rect.width || 500
    let height = rect.height || 560

    const scene = new THREE.Scene()
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x163028, 1.2))
    const key = new THREE.DirectionalLight(0xffffff, 2.6)
    key.position.set(4, 8, 6)
    scene.add(key)
    const rim = new THREE.PointLight(ACCENT, 42, 70)
    rim.position.set(-5, 4, -3)
    scene.add(rim)
    const fill = new THREE.PointLight(0xff6b4a, 16, 60)
    fill.position.set(5, 1, 5)
    scene.add(fill)

    let mixer = null
    let model = null
    let face = null
    let emoteTimer = 0
    let raf = 0
    let baseY = 0
    let bobAmount = 0.05
    let bobSpeed = 1.8
    let faceOffset = 0
    let spinOffset = 0
    let flipT = 0
    let flipActive = false
    let scalePunch = 1
    let camShake = 0
    const modelSize = new THREE.Vector3(1, 1, 1)
    const clock = new THREE.Clock()
    const targetRot = { y: 0 }
    const lerp = THREE.MathUtils.lerp
    let morphTarget = []
    let morphCurrent = []

    const fitCamera = () => {
      const fov = (camera.fov * Math.PI) / 180
      const aspect = width / height
      const forHeight = modelSize.y / 2 / Math.tan(fov / 2)
      const forWidth = modelSize.x / 2 / (Math.tan(fov / 2) * aspect)
      const dist = Math.max(forHeight, forWidth) * FIT_MARGIN
      const midY = modelSize.y * 0.55
      camera.position.set(0, midY, dist)
      camera.lookAt(0, midY, 0)
      camera.updateProjectionMatrix()
    }

    const loader = new GLTFLoader()
    loader.load(
      '/models/RobotExpressive.glb',
      (gltf) => {
        model = gltf.scene
        scene.add(model)

        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)
        model.position.x -= center.x
        model.position.z -= center.z
        model.position.y -= box.min.y
        baseY = model.position.y
        modelSize.copy(size)
        fitCamera()

        face = model.getObjectByName('Head_4') || null
        if (face?.morphTargetInfluences) {
          morphTarget = new Array(face.morphTargetInfluences.length).fill(0)
          morphCurrent = new Array(face.morphTargetInfluences.length).fill(0)
        }

        mixer = new THREE.AnimationMixer(model)
        const anims = gltf.animations || []
        const byName = (n) => THREE.AnimationClip.findByName(anims, n)
        const actionFor = (n) => {
          const clip = byName(n)
          return clip ? mixer.clipAction(clip) : null
        }

        let base = actionFor('Idle')
        let baseName = 'Idle'
        let busy = false
        let loopTimer = 0

        if (base) base.play()

        const crossFade = (from, to, duration) => {
          if (!to) return
          to.enabled = true
          to.setEffectiveTimeScale(1)
          to.setEffectiveWeight(1)
          to.time = 0
          to.play()
          if (from && from !== to) from.crossFadeTo(to, duration, true)
        }

        const setBase = (name, duration = 0.35) => {
          if (name === baseName) return
          const next = actionFor(name)
          if (!next) return
          next.setLoop(THREE.LoopRepeat, Infinity)
          next.clampWhenFinished = false
          if (!busy) crossFade(base, next, duration)
          base = next
          baseName = name
          bobAmount = name === 'Running' ? 0.14 : name === 'Walking' ? 0.09 : name === 'Dance' ? 0.12 : 0.05
          bobSpeed = name === 'Dance' ? 3.2 : name === 'Running' ? 2.6 : 1.8
        }

        const playEmote = (name) => {
          if (busy) return
          const action = actionFor(name)
          if (!action) return
          action.setLoop(THREE.LoopOnce, 1)
          action.clampWhenFinished = true
          busy = true
          scalePunch = 1.12
          camShake = 0.08
          crossFade(base, action, 0.22)
        }

        mixer.addEventListener('finished', (e) => {
          busy = false
          if (!base) return
          crossFade(e.action, base, 0.28)
        })

        const loopFor = (name, ms) => {
          window.clearTimeout(loopTimer)
          setBase(name)
          loopTimer = window.setTimeout(() => setBase('Idle'), ms)
        }

        const setExpression = (name) => {
          if (!face?.morphTargetDictionary) return
          morphTarget = morphTarget.map(() => 0)
          const idx = name != null ? face.morphTargetDictionary[name] : undefined
          if (idx !== undefined) morphTarget[idx] = 1
        }

        const flip = () => {
          if (flipActive) return
          flipActive = true
          flipT = 0
          scalePunch = 1.18
          camShake = 0.12
          setFx('boost')
          window.setTimeout(() => setFx('idle'), 900)
        }

        const celebrate = (ms = 4800) => {
          setFx('celebrate')
          setExpression('Surprised')
          playEmote('Jump')
          window.setTimeout(() => loopFor('Dance', ms - 900), 700)
          window.setTimeout(() => {
            setExpression(null)
            setFx('idle')
          }, ms)
        }

        const combo = () => {
          setFx('combo')
          const steps = [
            () => playEmote('Jump'),
            () => playEmote('Punch'),
            () => playEmote('ThumbsUp'),
            () => loopFor('Dance', 2800),
            () => playEmote('Wave'),
          ]
          steps.forEach((fn, i) => window.setTimeout(fn, i * 700))
          window.setTimeout(() => setFx('idle'), 4200)
        }

        const boost = () => {
          setFx('boost')
          bobAmount = 0.16
          bobSpeed = 3.4
          scalePunch = 1.2
          camShake = 0.1
          flip()
          window.setTimeout(() => {
            bobAmount = 0.05
            bobSpeed = 1.8
            setFx('idle')
          }, 1100)
        }

        const api = {
          playEmote,
          travel: (ms = 1200, dir = 0, run = false) => {
            faceOffset = dir * 0.85
            loopFor(run ? 'Running' : 'Walking', ms)
            if (run) {
              setFx('boost')
              window.setTimeout(() => setFx('idle'), Math.min(ms, 1200))
            }
            window.setTimeout(() => {
              faceOffset = 0
            }, ms)
          },
          dance: (ms = 4200) => {
            setFx('celebrate')
            loopFor('Dance', ms)
            window.setTimeout(() => setFx('idle'), ms)
          },
          sit: (ms = 5000) => loopFor('Sitting', ms),
          setExpression,
          setSpin: (v) => {
            spinOffset = v
          },
          flip,
          celebrate,
          combo,
          boost,
          wave: () => {
            playEmote('Wave')
            setExpression('Surprised')
            window.setTimeout(() => setExpression(null), 1500)
          },
        }
        if (readyRef.current) readyRef.current(api)

        if (hoverRef.current) {
          hoverRef.current.addEventListener('mouseenter', () => {
            playEmote('Wave')
            setExpression('Surprised')
            scalePunch = 1.1
            setFx('boost')
            window.setTimeout(() => {
              setExpression(null)
              setFx('idle')
            }, 1600)
          })
        }

        const emotes = ['Wave', 'ThumbsUp', 'Yes', 'No', 'Jump', 'Punch'].filter((n) => byName(n))
        emoteTimer = window.setInterval(() => {
          if (busy || baseName !== 'Idle') return
          const roll = Math.random()
          if (roll < 0.08) {
            api.sit(3800)
          } else if (roll < 0.16) {
            api.flip()
            window.setTimeout(() => playEmote('Jump'), 160)
          } else if (roll < 0.24) {
            api.celebrate(2800)
          } else if (roll < 0.38) {
            playEmote('Wave')
            setExpression('Surprised')
            window.setTimeout(() => setExpression(null), 1400)
          } else if (roll < 0.5) {
            playEmote('ThumbsUp')
          } else if (roll < 0.6) {
            playEmote('Yes')
          } else if (emotes.length) {
            playEmote(emotes[Math.floor(Math.random() * emotes.length)])
          }
        }, 4200)

        setLoaded(true)
      },
      undefined,
      (err) => console.error('RobotExpressive failed to load:', err)
    )

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      targetRot.y = nx * FOLLOW_YAW
    }
    document.addEventListener('mousemove', onMove)

    let live = document.visibilityState !== 'hidden'
    const onVis = () => {
      live = document.visibilityState !== 'hidden'
    }
    document.addEventListener('visibilitychange', onVis)

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!live) return
      const delta = clock.getDelta()
      const t = clock.getElapsedTime()
      if (mixer) mixer.update(delta)

      if (model) {
        if (flipActive) {
          flipT += delta * 4.2
          model.rotation.x = Math.sin(Math.min(flipT, Math.PI)) * Math.PI
          if (flipT >= Math.PI) {
            flipActive = false
            model.rotation.x = 0
          }
        } else {
          model.rotation.x = lerp(model.rotation.x, 0, 0.15)
        }

        scalePunch = lerp(scalePunch, 1, 0.1)
        model.scale.setScalar(scalePunch)
        model.rotation.y = lerp(model.rotation.y, targetRot.y + faceOffset + spinOffset, 0.1)
        model.position.y = baseY + Math.sin(t * bobSpeed) * bobAmount
      }

      if (face?.morphTargetInfluences) {
        for (let i = 0; i < morphCurrent.length; i += 1) {
          morphCurrent[i] = lerp(morphCurrent[i], morphTarget[i], 0.14)
          face.morphTargetInfluences[i] = morphCurrent[i]
        }
      }

      camShake = lerp(camShake, 0, 0.12)
      const midY = modelSize.y * 0.55
      let cx = Math.sin(t * 0.35) * 0.08
      let cy = midY + Math.cos(t * 0.4) * 0.04
      if (camShake > 0.004) {
        cx += (Math.random() - 0.5) * camShake
        cy += (Math.random() - 0.5) * camShake
      }
      camera.position.x = cx
      camera.position.y = cy
      camera.lookAt(0, midY, 0)

      rim.intensity = 38 + Math.sin(t * 2.2) * 8
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      const r = mount.getBoundingClientRect()
      if (!r.width || !r.height) return
      width = r.width
      height = r.height
      renderer.setSize(width, height)
      camera.aspect = width / height
      fitCamera()
    }
    window.addEventListener('resize', onResize)

    let resizeSettle = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeSettle)
      resizeSettle = window.setTimeout(onResize, 120)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(emoteTimer)
      window.clearTimeout(resizeSettle)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.clear()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className={`robot-stage relative ${className}`} data-fx={fx}>
      <div aria-hidden className="robot-aura pointer-events-none absolute inset-[-8%] rounded-full" />
      <div aria-hidden className="robot-ring robot-ring--a pointer-events-none absolute inset-[8%] rounded-full" />
      <div aria-hidden className="robot-ring robot-ring--b pointer-events-none absolute inset-[18%] rounded-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[16%] bottom-[5%] h-[10%] rounded-[50%] bg-[var(--ink)] opacity-[0.16] blur-lg"
      />
      <div
        ref={mountRef}
        className="h-full w-full [&>canvas]:!h-full [&>canvas]:!w-full [&>canvas]:!pointer-events-none"
      />
      <button
        ref={hoverRef}
        type="button"
        onClick={onClick}
        aria-label="Interact with the guide robot"
        className="pointer-events-auto absolute inset-0 mx-auto my-auto h-3/4 w-3/4 cursor-pointer"
      />
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--signal)]" />
        </div>
      )}
    </div>
  )
}
