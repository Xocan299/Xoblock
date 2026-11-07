import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PartData, StudioTool, GameMode } from '../types/studio';
import { createStudTexture, createRobloxSkyTexture } from '../textures/proceduralTextures';
import { createNoobRig, NoobRig } from './NoobCharacter';
import { playFootstep, playJump, playOof, playPlaceBrick } from '../audio/robloxSounds';

interface Viewport3DProps {
  parts: PartData[];
  selectedPartId: string | null;
  mode: GameMode;
  activeTool: StudioTool;
  currentColor: string;
  onSelectPart: (id: string | null) => void;
  onUpdatePart: (id: string, updates: Partial<PartData>) => void;
  onResetNoob: () => void;
  onSetCameraStats?: (stats: { x: number; y: number; z: number; fps: number }) => void;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  parts,
  selectedPartId,
  mode,
  activeTool,
  currentColor,
  onSelectPart,
  onUpdatePart,
  onResetNoob,
  onSetCameraStats,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const partsMeshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);
  const noobRigRef = useRef<NoobRig | null>(null);

  // Player physics state
  const playerState = useRef({
    pos: new THREE.Vector3(0, 0, 18), // Starting near front of walkway
    velocity: new THREE.Vector3(0, 0, 0),
    yaw: Math.PI, // Facing camera/forward
    isGrounded: true,
    isJumping: false,
    animTime: 0,
    lastFootstepTime: 0,
    keys: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    },
  });

  // Studio Free Camera state
  const studioCamState = useRef({
    radius: 46,
    theta: 0.65, // horizontal angle
    phi: 1.15,   // vertical pitch (approx matching reference image)
    target: new THREE.Vector3(0, 7, 5),
    isDragging: false,
    dragButton: -1,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  // Keep latest props in refs for event listeners
  const propsRef = useRef({
    parts,
    selectedPartId,
    mode,
    activeTool,
    currentColor,
    onSelectPart,
    onUpdatePart,
  });
  useEffect(() => {
    propsRef.current = {
      parts,
      selectedPartId,
      mode,
      activeTool,
      currentColor,
      onSelectPart,
      onUpdatePart,
    };
  }, [parts, selectedPartId, mode, activeTool, currentColor, onSelectPart, onUpdatePart]);

  // Handle Mode Switch
  useEffect(() => {
    if (mode === 'play') {
      // In play mode, focus controls on Noob
      playerState.current.isJumping = false;
      playerState.current.velocity.set(0, 0, 0);
    }
  }, [mode]);

  // Setup Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Sky texture
    const skyTexture = createRobloxSkyTexture();
    scene.background = skyTexture;
    scene.fog = new THREE.Fog(0x8ec2f2, 120, 450);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Studio Lighting
    // Directional Sun Light (Warm key light)
    const sunLight = new THREE.DirectionalLight(0xfffae8, 1.8);
    sunLight.position.set(45, 80, 50);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    // Hemisphere light: Warm sun bounce from above, cool green/earth bounce from ground
    const hemiLight = new THREE.HemisphereLight(0xbde0fe, 0x47a247, 0.85);
    scene.add(hemiLight);

    // Soft Ambient fill
    const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambLight);

    // Selection bounding box helper
    const dummyGeom = new THREE.BoxGeometry(1, 1, 1);
    const dummyMat = new THREE.MeshBasicMaterial({ visible: false });
    const dummyMesh = new THREE.Mesh(dummyGeom, dummyMat);
    scene.add(dummyMesh);

    const selectionBox = new THREE.BoxHelper(dummyMesh, 0x00d4ff);
    selectionBox.visible = false;
    (selectionBox.material as THREE.LineBasicMaterial).linewidth = 2;
    scene.add(selectionBox);
    selectionBoxRef.current = selectionBox;

    // Add Noob Character
    const noobRig = createNoobRig();
    scene.add(noobRig.root);
    noobRigRef.current = noobRig;

    // Position Noob initially on the walkway facing front
    noobRig.setPosition(playerState.current.pos.x, playerState.current.pos.y, playerState.current.pos.z);
    noobRig.setRotation(playerState.current.yaw);

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Mouse / Pointer Controls
    const onMouseDown = (e: MouseEvent) => {
      studioCamState.current.isDragging = true;
      studioCamState.current.dragButton = e.button;
      studioCamState.current.lastMouseX = e.clientX;
      studioCamState.current.lastMouseY = e.clientY;

      // In Edit Mode, left click performs raycasting for selection / color tool
      if (propsRef.current.mode === 'edit' && e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const meshes: THREE.Mesh[] = [];
        partsMeshMapRef.current.forEach((mesh) => {
          meshes.push(mesh);
        });

        const intersects = raycaster.intersectObjects(meshes, false);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          const partId = hitMesh.userData.partId;

          if (propsRef.current.activeTool === 'color') {
            // Apply current color to part
            propsRef.current.onUpdatePart(partId, { brickColor: propsRef.current.currentColor });
            playPlaceBrick();
          } else {
            propsRef.current.onSelectPart(partId);
          }
        } else {
          propsRef.current.onSelectPart(null);
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!studioCamState.current.isDragging) return;

      const dx = e.clientX - studioCamState.current.lastMouseX;
      const dy = e.clientY - studioCamState.current.lastMouseY;
      studioCamState.current.lastMouseX = e.clientX;
      studioCamState.current.lastMouseY = e.clientY;

      if (propsRef.current.mode === 'play') {
        // In Play Mode: Right click or left click drag rotates camera around Noob
        studioCamState.current.theta -= dx * 0.008;
        studioCamState.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, studioCamState.current.phi - dy * 0.008));
      } else {
        // In Edit Mode
        if (studioCamState.current.dragButton === 1 || (e.shiftKey && studioCamState.current.dragButton === 0)) {
          // Pan target
          const panSpeed = 0.04 * (studioCamState.current.radius / 30);
          const forward = new THREE.Vector3();
          camera.getWorldDirection(forward);
          forward.y = 0;
          forward.normalize();
          const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

          studioCamState.current.target.addScaledVector(right, -dx * panSpeed);
          studioCamState.current.target.y += dy * panSpeed;
        } else if (studioCamState.current.dragButton === 2 || studioCamState.current.dragButton === 0) {
          // Orbit camera
          studioCamState.current.theta -= dx * 0.006;
          studioCamState.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.02, studioCamState.current.phi - dy * 0.006));
        }
      }
    };

    const onMouseUp = () => {
      studioCamState.current.isDragging = false;
      studioCamState.current.dragButton = -1;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
      studioCamState.current.radius = Math.max(6, Math.min(180, studioCamState.current.radius * zoomFactor));
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);

    // Keyboard controls for Play Mode & Edit Mode
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') playerState.current.keys.forward = true;
      if (key === 's' || key === 'arrowdown') playerState.current.keys.backward = true;
      if (key === 'a' || key === 'arrowleft') playerState.current.keys.left = true;
      if (key === 'd' || key === 'arrowright') playerState.current.keys.right = true;
      if (key === ' ' || key === 'space') {
        playerState.current.keys.jump = true;
      }

      // Classic Roblox Reset shortcut (R key + Enter or Esc + R)
      if (key === 'r' && e.ctrlKey) {
        onResetNoob();
      }

      // Delete part in Edit mode
      if ((key === 'delete' || key === 'backspace') && propsRef.current.mode === 'edit' && propsRef.current.selectedPartId) {
        // Can be deleted or handled by parent
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') playerState.current.keys.forward = false;
      if (key === 's' || key === 'arrowdown') playerState.current.keys.backward = false;
      if (key === 'a' || key === 'arrowleft') playerState.current.keys.left = false;
      if (key === 'd' || key === 'arrowright') playerState.current.keys.right = false;
      if (key === ' ' || key === 'space') {
        playerState.current.keys.jump = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation / Game Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTime = performance.now();

    const tick = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      frameCounter++;
      if (currentTime - fpsTime > 500) {
        const fps = Math.round((frameCounter * 1000) / (currentTime - fpsTime));
        frameCounter = 0;
        fpsTime = currentTime;
        if (onSetCameraStats) {
          onSetCameraStats({
            x: Math.round(playerState.current.pos.x * 10) / 10,
            y: Math.round(playerState.current.pos.y * 10) / 10,
            z: Math.round(playerState.current.pos.z * 10) / 10,
            fps,
          });
        }
      }

      const pState = playerState.current;
      const isPlay = propsRef.current.mode === 'play';

      // Update Noob Physics in Play mode
      if (isPlay) {
        const moveSpeed = 16.0; // Classic Roblox walk speed ~16 studs/sec
        const jumpSpeed = 24.0; // Classic Roblox jump power
        const gravity = -65.0;  // Classic Roblox gravity

        // Calculate movement relative to camera yaw
        const camYaw = studioCamState.current.theta;
        const forwardVector = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
        const rightVector = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

        const moveDir = new THREE.Vector3(0, 0, 0);
        if (pState.keys.forward) moveDir.add(forwardVector);
        if (pState.keys.backward) moveDir.sub(forwardVector);
        if (pState.keys.right) moveDir.add(rightVector);
        if (pState.keys.left) moveDir.sub(rightVector);

        const isMoving = moveDir.lengthSq() > 0.01;
        if (isMoving) {
          moveDir.normalize();
          pState.velocity.x = moveDir.x * moveSpeed;
          pState.velocity.z = moveDir.z * moveSpeed;

          // Rotate character towards moving direction
          const targetYaw = Math.atan2(moveDir.x, moveDir.z);
          // Smooth rotation
          let diff = targetYaw - pState.yaw;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          pState.yaw += diff * Math.min(1.0, delta * 15);

          pState.animTime += delta;

          // Footstep audio on studs
          if (pState.isGrounded && currentTime - pState.lastFootstepTime > 340) {
            playFootstep();
            pState.lastFootstepTime = currentTime;
          }
        } else {
          pState.velocity.x *= 0.7;
          pState.velocity.z *= 0.7;
        }

        // Jump physics
        if (pState.keys.jump && pState.isGrounded) {
          pState.velocity.y = jumpSpeed;
          pState.isGrounded = false;
          pState.isJumping = true;
          playJump();
        }

        // Gravity
        pState.velocity.y += gravity * delta;

        // Apply velocity to position
        pState.pos.x += pState.velocity.x * delta;
        pState.pos.y += pState.velocity.y * delta;
        pState.pos.z += pState.velocity.z * delta;

        // Simple ground collision (Ground is Y=0, or house walkway Y=0.4, or roof)
        // Check if player is on the walkway
        const onWalkway = Math.abs(pState.pos.x) < 2.6 && pState.pos.z >= 10 && pState.pos.z <= 32;
        const groundHeight = onWalkway ? 0.4 : 0;

        // Check if inside house bounds or on roof steps
        let effectiveGround = groundHeight;
        if (Math.abs(pState.pos.x) < 11.5 && Math.abs(pState.pos.z) < 10) {
          // Inside house floor
          effectiveGround = 0;
        }

        if (pState.pos.y <= effectiveGround) {
          pState.pos.y = effectiveGround;
          pState.velocity.y = 0;
          pState.isGrounded = true;
          pState.isJumping = false;
        } else {
          pState.isGrounded = false;
        }

        // If player falls off the baseplate edge into the void
        if (pState.pos.y < -30) {
          playOof();
          // Respawn at walkway
          pState.pos.set(0, 0, 18);
          pState.velocity.set(0, 0, 0);
          pState.isGrounded = true;
        }

        // Update Noob Rig
        if (noobRigRef.current) {
          noobRigRef.current.setPosition(pState.pos.x, pState.pos.y, pState.pos.z);
          noobRigRef.current.setRotation(pState.yaw);
          noobRigRef.current.updateAnimation(isMoving, !pState.isGrounded, pState.animTime);
        }

        // Update Camera in Play Mode: Follows Noob
        const camTarget = new THREE.Vector3(pState.pos.x, pState.pos.y + 3.2, pState.pos.z);
        studioCamState.current.target.lerp(camTarget, 0.15);
      } else {
        // In Edit Mode, Noob sits still
        if (noobRigRef.current) {
          noobRigRef.current.setPosition(pState.pos.x, pState.pos.y, pState.pos.z);
          noobRigRef.current.setRotation(pState.yaw);
          noobRigRef.current.updateAnimation(false, false, 0);
        }
      }

      // Compute Camera Position from spherical coordinates
      const { radius, theta, phi, target } = studioCamState.current;
      const cx = target.x + radius * Math.sin(phi) * Math.sin(theta);
      const cy = target.y + radius * Math.cos(phi);
      const cz = target.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(target);

      // Render
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.dispose();
      noobRig.dispose();
    };
  }, []);

  // Update 3D Meshes whenever parts list changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentMap = partsMeshMapRef.current;
    const incomingIds = new Set(parts.map((p) => p.id));

    // Remove deleted meshes
    currentMap.forEach((mesh, id) => {
      if (!incomingIds.has(id)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
        currentMap.delete(id);
      }
    });

    // Create or update meshes
    parts.forEach((part) => {
      let mesh = currentMap.get(part.id);

      if (!mesh) {
        // Create new Mesh
        const geom = new THREE.BoxGeometry(part.size[0], part.size[1], part.size[2]);

        // Materials setup
        let mat: THREE.Material;

        if (part.id === 'part_baseplate') {
          // Green stud texture
          const studTex = createStudTexture('#4ca44c', 'rgba(255,255,255,0.3)', 'rgba(0,0,0,0.25)', 60, 60);
          mat = new THREE.MeshStandardMaterial({
            map: studTex,
            roughness: 0.6,
            metalness: 0.05,
          });
        } else if (part.id === 'part_walkway') {
          // Grey walkway stud texture
          const studTex = createStudTexture('#5a5e66', 'rgba(255,255,255,0.25)', 'rgba(0,0,0,0.35)', 2.6, 11);
          mat = new THREE.MeshStandardMaterial({
            map: studTex,
            roughness: 0.7,
            metalness: 0.1,
          });
        } else if (part.id.startsWith('part_roof')) {
          // Red roof step studs
          const studTex = createStudTexture('#cc292b', 'rgba(255,255,255,0.3)', 'rgba(0,0,0,0.3)', 1.5, 11.5);
          mat = new THREE.MeshStandardMaterial({
            map: studTex,
            roughness: 0.45,
            metalness: 0.1,
          });
        } else {
          // Standard brick / wall material
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(part.brickColor),
            roughness: part.material === 'Wood' ? 0.65 : 0.45,
            metalness: 0.05,
            transparent: part.transparency > 0,
            opacity: 1 - part.transparency,
          });
        }

        mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { partId: part.id };

        scene.add(mesh);
        currentMap.set(part.id, mesh);
      } else {
        // Update existing mesh properties
        mesh.position.set(part.position[0], part.position[1], part.position[2]);
        mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);

        // Update geometry size if changed
        const currentSize = (mesh.geometry as THREE.BoxGeometry).parameters;
        if (
          currentSize.width !== part.size[0] ||
          currentSize.height !== part.size[1] ||
          currentSize.depth !== part.size[2]
        ) {
          mesh.geometry.dispose();
          mesh.geometry = new THREE.BoxGeometry(part.size[0], part.size[1], part.size[2]);
        }

        // Update color if not baseplate/walkway with special texture
        if (
          part.id !== 'part_baseplate' &&
          part.id !== 'part_walkway' &&
          !part.id.startsWith('part_roof') &&
          mesh.material instanceof THREE.MeshStandardMaterial
        ) {
          mesh.material.color.set(part.brickColor);
          mesh.material.roughness = part.material === 'Wood' ? 0.65 : 0.45;
          mesh.material.transparent = part.transparency > 0;
          mesh.material.opacity = 1 - part.transparency;
        }
      }

      mesh.position.set(part.position[0], part.position[1], part.position[2]);
      mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
    });
  }, [parts]);

  // Update selection box outline
  useEffect(() => {
    if (!selectionBoxRef.current) return;
    if (selectedPartId && partsMeshMapRef.current.has(selectedPartId)) {
      const targetMesh = partsMeshMapRef.current.get(selectedPartId)!;
      selectionBoxRef.current.setFromObject(targetMesh);
      selectionBoxRef.current.visible = true;
    } else {
      selectionBoxRef.current.visible = false;
    }
  }, [selectedPartId, parts]);

  // Classic bottom-right Camera Navigation buttons
  const handleCameraZoomIn = () => {
    studioCamState.current.radius = Math.max(8, studioCamState.current.radius * 0.85);
  };

  const handleCameraZoomOut = () => {
    studioCamState.current.radius = Math.min(180, studioCamState.current.radius * 1.15);
  };

  const handleCameraCenter = () => {
    if (propsRef.current.mode === 'play') {
      studioCamState.current.target.set(
        playerState.current.pos.x,
        playerState.current.pos.y + 3.2,
        playerState.current.pos.z
      );
    } else {
      studioCamState.current.target.set(0, 7, 5);
      studioCamState.current.radius = 46;
      studioCamState.current.theta = 0.65;
      studioCamState.current.phi = 1.15;
    }
  };

  const handleCameraOrbit = (dir: number) => {
    studioCamState.current.theta += dir * 0.2;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-[#4e95df]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Mode Badge & Help Toast */}
      <div className="absolute top-2 left-2 z-10 flex items-center space-x-2 pointer-events-none">
        <span
          className={`px-2.5 py-0.5 text-xs font-bold rounded shadow border ${
            mode === 'play'
              ? 'bg-green-600 text-white border-green-700 animate-pulse'
              : mode === 'run'
              ? 'bg-amber-600 text-white border-amber-700'
              : 'bg-white/90 text-gray-800 border-gray-400'
          }`}
        >
          {mode === 'play' ? '▶ PLAY SOLO (NOOB)' : mode === 'run' ? '⚡ RUN SIMULATION' : '✎ EDIT MODE'}
        </span>
      </div>

      {/* Play Mode Keyboard Instructions */}
      {mode === 'play' && (
        <div className="absolute top-2 right-2 z-10 bg-black/75 text-white text-xs px-3 py-1.5 rounded border border-gray-600 shadow flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[11px] font-mono">WASD</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[11px] font-mono">Arrows</kbd> to Walk
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[11px] font-mono">Space</kbd> to Jump
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[11px] font-mono">RMB + Drag</kbd> to Orbit
          </span>
        </div>
      )}

      {/* Classic 2008 Viewport Camera Widget in Bottom-Right (Exactly as in screenshot) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-1 bg-white/70 backdrop-blur-xs p-1 rounded-full border border-gray-300 shadow-md">
        <button
          onClick={() => handleCameraOrbit(-1)}
          title="Orbit Left"
          className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 text-xs shadow-xs border border-gray-300 transition-colors"
        >
          ↺
        </button>
        <button
          onClick={handleCameraZoomIn}
          title="Zoom In"
          className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs shadow-xs border border-gray-300 transition-colors"
        >
          +
        </button>
        <button
          onClick={handleCameraCenter}
          title="Reset Camera Target"
          className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shadow-xs border border-blue-300 transition-colors"
        >
          ◉
        </button>
        <button
          onClick={handleCameraZoomOut}
          title="Zoom Out"
          className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs shadow-xs border border-gray-300 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => handleCameraOrbit(1)}
          title="Orbit Right"
          className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 text-xs shadow-xs border border-gray-300 transition-colors"
        >
          ↻
        </button>
      </div>
    </div>
  );
};
