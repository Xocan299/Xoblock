import * as THREE from 'three';
import { createNoobFaceTexture } from '../textures/proceduralTextures';

export interface NoobRig {
  root: THREE.Group;
  head: THREE.Mesh;
  torso: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  updateAnimation: (isMoving: boolean, isJumping: boolean, animTime: number) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setRotation: (yaw: number) => void;
  dispose: () => void;
}

/**
 * Creates the classic 2008 Roblox Noob character (R6 rig).
 * Articulated with pivots at shoulders and hips for classic walking animation.
 */
export function createNoobRig(): NoobRig {
  const root = new THREE.Group();
  root.name = 'NoobCharacter';

  // Materials with classic Roblox matte/plastic look
  const yellowMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5cd2f, // Classic Roblox bright yellow
    roughness: 0.45,
    metalness: 0.05,
  });

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d69ac, // Classic Roblox bright blue
    roughness: 0.45,
    metalness: 0.05,
  });

  const greenMaterial = new THREE.MeshStandardMaterial({
    color: 0x287f46, // Classic Roblox bright green
    roughness: 0.45,
    metalness: 0.05,
  });

  // Torso: 2 wide x 2 high x 1 deep
  const torsoGeom = new THREE.BoxGeometry(2, 2, 1);
  const torso = new THREE.Mesh(torsoGeom, blueMaterial);
  torso.castShadow = true;
  torso.receiveShadow = true;
  torso.position.set(0, 3, 0); // Torso center at Y=3
  root.add(torso);

  // Head: 1.25 x 1.2 x 1.25 with face decal on front
  const headGeom = new THREE.BoxGeometry(1.25, 1.2, 1.25);
  const faceTexture = createNoobFaceTexture();
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.45,
    metalness: 0.05,
  });

  // Face material on front face (index 4 in Three.js BoxGeometry material array: +X, -X, +Y, -Y, +Z, -Z)
  const headMaterials = [
    yellowMaterial, // +x right
    yellowMaterial, // -x left
    yellowMaterial, // +y top
    yellowMaterial, // -y bottom
    faceMaterial,   // +z front face
    yellowMaterial, // -z back
  ];

  const head = new THREE.Mesh(headGeom, headMaterials);
  head.castShadow = true;
  head.position.set(0, 4.6, 0); // Head sits on top of torso
  root.add(head);

  // Left Arm: 1 x 2 x 1, pivot at shoulder (x = -1.5, y = 3.8)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-1.5, 3.8, 0);
  const armGeom = new THREE.BoxGeometry(1, 2, 1);
  const leftArmMesh = new THREE.Mesh(armGeom, yellowMaterial);
  leftArmMesh.castShadow = true;
  leftArmMesh.position.set(0, -0.9, 0); // hanging down from shoulder pivot
  leftArmPivot.add(leftArmMesh);
  root.add(leftArmPivot);

  // Right Arm: 1 x 2 x 1, pivot at shoulder (x = 1.5, y = 3.8)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(1.5, 3.8, 0);
  const rightArmMesh = new THREE.Mesh(armGeom, yellowMaterial);
  rightArmMesh.castShadow = true;
  rightArmMesh.position.set(0, -0.9, 0);
  rightArmPivot.add(rightArmMesh);
  root.add(rightArmPivot);

  // Left Leg: 1 x 2 x 1, pivot at hip (x = -0.5, y = 2.0)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.5, 2.0, 0);
  const legGeom = new THREE.BoxGeometry(1, 2, 1);
  const leftLegMesh = new THREE.Mesh(legGeom, greenMaterial);
  leftLegMesh.castShadow = true;
  leftLegMesh.position.set(0, -0.95, 0); // touches ground at Y=0 when root is at Y=0
  leftLegPivot.add(leftLegMesh);
  root.add(leftLegPivot);

  // Right Leg: 1 x 2 x 1, pivot at hip (x = 0.5, y = 2.0)
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.5, 2.0, 0);
  const rightLegMesh = new THREE.Mesh(legGeom, greenMaterial);
  rightLegMesh.castShadow = true;
  rightLegMesh.position.set(0, -0.95, 0);
  rightLegPivot.add(rightLegMesh);
  root.add(rightLegPivot);

  // Animation kinematic updater
  const updateAnimation = (isMoving: boolean, isJumping: boolean, animTime: number) => {
    if (isJumping) {
      // Classic jump pose: arms raised slightly forward, legs slightly tilted
      leftArmPivot.rotation.x = -1.2;
      rightArmPivot.rotation.x = -1.2;
      leftLegPivot.rotation.x = 0.35;
      rightLegPivot.rotation.x = -0.2;
      head.rotation.x = -0.15;
    } else if (isMoving) {
      // Classic Roblox walk cycle: swing speed ~9 rad/s
      const swingAngle = Math.sin(animTime * 9) * 0.75;
      leftArmPivot.rotation.x = swingAngle;
      rightArmPivot.rotation.x = -swingAngle;
      leftLegPivot.rotation.x = -swingAngle;
      rightLegPivot.rotation.x = swingAngle;
      head.rotation.x = Math.sin(animTime * 18) * 0.04;
      torso.rotation.y = Math.sin(animTime * 9) * 0.08;
    } else {
      // Idle pose: relax limbs
      leftArmPivot.rotation.x = 0;
      rightArmPivot.rotation.x = 0;
      leftLegPivot.rotation.x = 0;
      rightLegPivot.rotation.x = 0;
      head.rotation.x = 0;
      torso.rotation.y = 0;
    }
  };

  const setPosition = (x: number, y: number, z: number) => {
    root.position.set(x, y, z);
  };

  const setRotation = (yaw: number) => {
    root.rotation.y = yaw;
  };

  const dispose = () => {
    torsoGeom.dispose();
    headGeom.dispose();
    armGeom.dispose();
    legGeom.dispose();
    yellowMaterial.dispose();
    blueMaterial.dispose();
    greenMaterial.dispose();
    faceMaterial.dispose();
  };

  return {
    root,
    head,
    torso,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    updateAnimation,
    setPosition,
    setRotation,
    dispose,
  };
}
