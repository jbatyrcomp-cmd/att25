/* ==========================================================================
   3D ROOMS BUILDER & INTERACTIVE RESIZING ENGINE
   Supports Manual Room Creation, Width/Depth Resizing, 3D Handles & Inspector
   ========================================================================== */

const rooms = new Map();
let selectedRoomId = null;
let roomPartitionsGroup = null;
let roomHandlesGroup = null;
let activeDragHandle = null;
let isDraggingRoomHandle = false;
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycasterPlaneIntersect = new THREE.Vector3();

/* --------------------------------------------------------------------------
   INITIALIZATION
   -------------------------------------------------------------------------- */
function initRoomsEngine(){
  if(typeof scene === 'undefined' || typeof THREE === 'undefined') return;

  if(!roomPartitionsGroup){
    roomPartitionsGroup = new THREE.Group();
    roomPartitionsGroup.name = "roomPartitionsGroup";
    scene.add(roomPartitionsGroup);
  }

  if(!roomHandlesGroup){
    roomHandlesGroup = new THREE.Group();
    roomHandlesGroup.name = "roomHandlesGroup";
    scene.add(roomHandlesGroup);
  }

  setupRoomUIEvents();
  setupRoomMouseEvents();
}

/* --------------------------------------------------------------------------
   ROOM REBUILD & 3D GEOMETRY
   -------------------------------------------------------------------------- */
function rebuildRoom3D(room){
  if(!room || !room.group) return;

  // Clear previous children
  while(room.group.children.length > 0){
    const child = room.group.children[0];
    room.group.remove(child);
    if(child.geometry) child.geometry.dispose();
    if(child.material){
      if(Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    }
  }

  room.group.position.set(room.x, 0, room.z);

  const w = room.width;
  const d = room.depth;
  const col = room.color || '#38BDF8';

  // 1. Semi-transparent floor plate
  const floorGeo = new THREE.PlaneGeometry(w, d);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshBasicMaterial({
    color: col,
    transparent: true,
    opacity: 0.12,
    depthWrite: false
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.y = 0.01;
  floorMesh.userData = { isRoomElement: true, isRoomFloor: true, roomId: room.id };
  room.group.add(floorMesh);
  room.floorMesh = floorMesh;

  // 2. Perimeter border lines
  const edges = new THREE.EdgesGeometry(floorGeo);
  const lineMat = new THREE.LineBasicMaterial({
    color: col,
    transparent: true,
    opacity: 0.75,
    linewidth: 2
  });
  const borderLines = new THREE.LineSegments(edges, lineMat);
  borderLines.position.y = 0.015;
  room.group.add(borderLines);

  // 3. Modern Glass Partition Walls with doorway gap
  const wallHeight = 0.72;
  const wallThick = 0.05;
  const glassMat = new THREE.MeshBasicMaterial({
    color: col,
    transparent: true,
    opacity: 0.20,
    depthWrite: false
  });

  const railMat = new THREE.MeshStandardMaterial({
    color: 0xd0d8e8,
    metalness: 0.85,
    roughness: 0.25
  });

  function addWall(wx, wz, ww, wd){
    const wallGeo = new THREE.BoxGeometry(ww, wallHeight, wd);
    const wallMesh = new THREE.Mesh(wallGeo, glassMat);
    wallMesh.position.set(wx, wallHeight / 2, wz);
    wallMesh.userData = { isRoomElement: true, isRoomWall: true, roomId: room.id };
    room.group.add(wallMesh);

    const railGeo = new THREE.BoxGeometry(ww, 0.025, wd);
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(wx, wallHeight + 0.012, wz);
    room.group.add(railMesh);
  }

  const halfW = w / 2;
  const halfD = d / 2;
  const doorW = 1.4;

  // North wall
  addWall(0, -halfD, w, wallThick);
  // West wall
  addWall(-halfW, 0, wallThick, d);
  // East wall
  addWall(halfW, 0, wallThick, d);
  // South wall with entrance
  const segW = (w - doorW) / 2;
  if(segW > 0.4){
    addWall(-halfW + segW / 2, halfD, segW, wallThick);
    addWall(halfW - segW / 2, halfD, segW, wallThick);
  }

  // 4. Floating 3D Sprite Title Badge
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if(ctx){
    ctx.fillStyle = 'rgba(10, 16, 26, 0.88)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 22);
    ctx.fill();

    ctx.strokeStyle = col;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 22);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Segoe UI", Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(room.name || 'Xona', 256, 46);

    const dimStr = `${w.toFixed(1)}m × ${d.toFixed(1)}m`;
    const vlanStr = room.vlanId ? ` · VLAN ${room.vlanId}` : '';
    ctx.fillStyle = col;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(dimStr + vlanStr, 256, 88);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, 2.3, 0);
    sprite.scale.set(3.2, 0.8, 1);
    room.group.add(sprite);
    room.sprite = sprite;
  }
}

/* --------------------------------------------------------------------------
   CREATE, SELECT, RESIZE & DELETE ROOM
   -------------------------------------------------------------------------- */
function addCustomRoom(options = {}){
  if(!roomPartitionsGroup) initRoomsEngine();

  const id = 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  const room = {
    id,
    name: options.name || `Xona ${rooms.size + 1}`,
    x: options.x !== undefined ? options.x : 0,
    z: options.z !== undefined ? options.z : 0,
    width: options.width || 6.0,
    depth: options.depth || 5.0,
    color: options.color || '#38BDF8',
    vlanId: options.vlanId || null,
    group: new THREE.Group()
  };

  room.group.name = "room_" + id;
  roomPartitionsGroup.add(room.group);
  rooms.set(id, room);

  rebuildRoom3D(room);
  selectRoom(id);

  if(typeof toast === 'function'){
    toast(`🏗️ Yangi xona qurildi: "${room.name}" (${room.width}m × ${room.depth}m)`);
  }
  return room;
}

function createPresetRoom(presetType){
  const presets = {
    small:  { name: 'Kichik Ofis', width: 5.0, depth: 4.0, color: '#38BDF8' },
    medium: { name: 'O‘rtacha Ofis', width: 7.0, depth: 5.0, color: '#F472B6' },
    large:  { name: 'Katta Zal / Lab', width: 9.0, depth: 7.0, color: '#6FE3C4' },
    server: { name: 'Serverxona', width: 6.0, depth: 5.0, color: '#FBBF24', vlanId: 99 },
    custom: { name: 'Maxsus Xona', width: 6.0, depth: 6.0, color: '#A78BFA' }
  };

  const p = presets[presetType] || presets.small;

  // Find a free position on the arena floor (offset if rooms exist)
  let offsetX = 0;
  let offsetZ = 0;
  if(rooms.size > 0){
    const count = rooms.size;
    offsetX = ((count % 3) - 1) * 7.5;
    offsetZ = (Math.floor(count / 3) * 6.5) - 3.0;
  }

  return addCustomRoom({
    name: p.name,
    width: p.width,
    depth: p.depth,
    color: p.color,
    vlanId: p.vlanId,
    x: offsetX,
    z: offsetZ
  });
}

function resizeRoom(roomId, newWidth, newDepth){
  const room = rooms.get(roomId);
  if(!room) return;

  room.width = Math.max(3.0, Math.min(25.0, parseFloat(newWidth) || room.width));
  room.depth = Math.max(3.0, Math.min(25.0, parseFloat(newDepth) || room.depth));

  rebuildRoom3D(room);
  updateRoomHandles(room);
  syncRoomPanelValues(room);
}

function selectRoom(id){
  const room = rooms.get(id);
  if(!room) return;

  selectedRoomId = id;

  // Deselect device panel if open
  if(typeof closePanel === 'function') closePanel();

  openRoomPanel(room);
  updateRoomHandles(room);
}

function deselectRoom(){
  selectedRoomId = null;
  clearRoomHandles();
  closeRoomPanel();
}

function deleteRoom(id){
  const room = rooms.get(id);
  if(!room) return;

  if(room.group && roomPartitionsGroup){
    roomPartitionsGroup.remove(room.group);
  }

  rooms.delete(id);
  if(selectedRoomId === id){
    deselectRoom();
  }

  if(typeof toast === 'function'){
    toast(`🗑️ Xona o'chirildi: "${room.name}"`);
  }
}

function clearAllRooms(){
  deselectRoom();
  rooms.forEach(room => {
    if(room.group && roomPartitionsGroup){
      roomPartitionsGroup.remove(room.group);
    }
  });
  rooms.clear();
}

/* --------------------------------------------------------------------------
   3D RESIZE HANDLES GIZMO
   -------------------------------------------------------------------------- */
function clearRoomHandles(){
  if(!roomHandlesGroup) return;
  while(roomHandlesGroup.children.length > 0){
    const child = roomHandlesGroup.children[0];
    roomHandlesGroup.remove(child);
    if(child.geometry) child.geometry.dispose();
    if(child.material) child.material.dispose();
  }
}

function updateRoomHandles(room){
  clearRoomHandles();
  if(!room || !roomHandlesGroup) return;

  const w = room.width;
  const d = room.depth;
  const hw = w / 2;
  const hd = d / 2;

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xFFB454,
    emissive: 0xFFB454,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });

  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    emissive: 0x38BDF8,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
  });

  // Corners (NW, NE, SE, SW)
  const corners = [
    { dir: 'NW', x: -hw, z: -hd },
    { dir: 'NE', x:  hw, z: -hd },
    { dir: 'SE', x:  hw, z:  hd },
    { dir: 'SW', x: -hw, z:  hd }
  ];

  corners.forEach(c => {
    const geo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const mesh = new THREE.Mesh(geo, handleMat);
    mesh.position.set(room.x + c.x, 0.2, room.z + c.z);
    mesh.userData = { isHandle: true, roomId: room.id, dir: c.dir };
    roomHandlesGroup.add(mesh);
  });

  // Edges (N, S, E, W)
  const edges = [
    { dir: 'N', x: 0,   z: -hd, size: [0.55, 0.25, 0.25] },
    { dir: 'S', x: 0,   z:  hd, size: [0.55, 0.25, 0.25] },
    { dir: 'E', x: hw,  z: 0,   size: [0.25, 0.25, 0.55] },
    { dir: 'W', x: -hw, z: 0,   size: [0.25, 0.25, 0.55] }
  ];

  edges.forEach(e => {
    const geo = new THREE.BoxGeometry(e.size[0], e.size[1], e.size[2]);
    const mesh = new THREE.Mesh(geo, edgeMat);
    mesh.position.set(room.x + e.x, 0.2, room.z + e.z);
    mesh.userData = { isHandle: true, roomId: room.id, dir: e.dir };
    roomHandlesGroup.add(mesh);
  });
}

/* --------------------------------------------------------------------------
   RIGHT INSPECTOR PANEL SYNC
   -------------------------------------------------------------------------- */
function openRoomPanel(room){
  const roomPanel = document.getElementById('roomPanel');
  if(!roomPanel) return;

  roomPanel.classList.add('show');
  syncRoomPanelValues(room);
}

function closeRoomPanel(){
  const roomPanel = document.getElementById('roomPanel');
  if(roomPanel) roomPanel.classList.remove('show');
}

function syncRoomPanelValues(room){
  if(!room) return;

  const roomTitle = document.getElementById('roomTitle');
  if(roomTitle) roomTitle.textContent = room.name || 'Xona';

  const roomNameInput = document.getElementById('roomNameInput');
  if(roomNameInput && document.activeElement !== roomNameInput){
    roomNameInput.value = room.name || '';
  }

  const roomDimensionsBadge = document.getElementById('roomDimensionsBadge');
  if(roomDimensionsBadge){
    roomDimensionsBadge.textContent = `${room.width.toFixed(1)}m × ${room.depth.toFixed(1)}m`;
  }

  const roomWidthVal = document.getElementById('roomWidthVal');
  if(roomWidthVal) roomWidthVal.textContent = `${room.width.toFixed(1)}m`;

  const roomDepthVal = document.getElementById('roomDepthVal');
  if(roomDepthVal) roomDepthVal.textContent = `${room.depth.toFixed(1)}m`;

  const roomWidthRange = document.getElementById('roomWidthRange');
  if(roomWidthRange) roomWidthRange.value = room.width;

  const roomDepthRange = document.getElementById('roomDepthRange');
  if(roomDepthRange) roomDepthRange.value = room.depth;

  // Refresh Color Swatches
  renderColorPalette(room.color);

  // Refresh VLAN Select
  populateRoomVlanSelect(room.vlanId);
}

function renderColorPalette(activeColor){
  const container = document.getElementById('roomColorPalette');
  if(!container) return;
  container.innerHTML = '';

  const colors = [
    { hex: '#38BDF8', name: 'Moviy' },
    { hex: '#F472B6', name: 'Pushti' },
    { hex: '#A78BFA', name: 'Binafsha' },
    { hex: '#FBBF24', name: 'Sariq' },
    { hex: '#6FE3C4', name: 'Zumrad' },
    { hex: '#F87171', name: 'Qizil' },
    { hex: '#94A3B8', name: 'Kulrang' }
  ];

  colors.forEach(c => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'room-color-chip' + (activeColor === c.hex ? ' active' : '');
    chip.style.background = c.hex;
    chip.title = c.name;
    chip.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(!r) return;
      r.color = c.hex;
      rebuildRoom3D(r);
      updateRoomHandles(r);
      renderColorPalette(c.hex);
    });
    container.appendChild(chip);
  });
}

function populateRoomVlanSelect(selectedVlan){
  const select = document.getElementById('roomVlanSelect');
  if(!select) return;
  select.innerHTML = '<option value="">(Biriktirilmagan)</option>';

  const vlans = [
    { id: 10, name: 'VLAN 10 · TALABALAR / RAHBAR' },
    { id: 20, name: 'VLAN 20 · OQITUVCHILAR / MOLIYA' },
    { id: 30, name: 'VLAN 30 · IT_DEV / SERVER' },
    { id: 50, name: 'VLAN 50 · MEHMONLAR (GUEST)' },
    { id: 99, name: 'VLAN 99 · MANAGEMENT / SERVER' },
    { id: 100, name: 'VLAN 100 · VOICE (IP PHONE)' }
  ];

  vlans.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.name;
    if(selectedVlan === v.id) opt.selected = true;
    select.appendChild(opt);
  });
}

/* --------------------------------------------------------------------------
   UI EVENTS (SLIDERS, BUTTONS, INPUTS)
   -------------------------------------------------------------------------- */
function setupRoomUIEvents(){
  const roomCloseBtn = document.getElementById('roomCloseBtn');
  if(roomCloseBtn) roomCloseBtn.addEventListener('click', deselectRoom);

  const roomNameInput = document.getElementById('roomNameInput');
  if(roomNameInput){
    roomNameInput.addEventListener('input', ()=>{
      if(!selectedRoomId) return;
      const room = rooms.get(selectedRoomId);
      if(!room) return;
      room.name = roomNameInput.value || 'Xona';
      rebuildRoom3D(room);
      const roomTitle = document.getElementById('roomTitle');
      if(roomTitle) roomTitle.textContent = room.name;
    });
  }

  // Width Range & Buttons
  const roomWidthRange = document.getElementById('roomWidthRange');
  if(roomWidthRange){
    roomWidthRange.addEventListener('input', ()=>{
      if(!selectedRoomId) return;
      resizeRoom(selectedRoomId, parseFloat(roomWidthRange.value), null);
    });
  }

  const roomWidthMinusBtn = document.getElementById('roomWidthMinusBtn');
  if(roomWidthMinusBtn){
    roomWidthMinusBtn.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(r) resizeRoom(selectedRoomId, r.width - 0.5, null);
    });
  }

  const roomWidthPlusBtn = document.getElementById('roomWidthPlusBtn');
  if(roomWidthPlusBtn){
    roomWidthPlusBtn.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(r) resizeRoom(selectedRoomId, r.width + 0.5, null);
    });
  }

  // Depth Range & Buttons
  const roomDepthRange = document.getElementById('roomDepthRange');
  if(roomDepthRange){
    roomDepthRange.addEventListener('input', ()=>{
      if(!selectedRoomId) return;
      resizeRoom(selectedRoomId, null, parseFloat(roomDepthRange.value));
    });
  }

  const roomDepthMinusBtn = document.getElementById('roomDepthMinusBtn');
  if(roomDepthMinusBtn){
    roomDepthMinusBtn.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(r) resizeRoom(selectedRoomId, null, r.depth - 0.5);
    });
  }

  const roomDepthPlusBtn = document.getElementById('roomDepthPlusBtn');
  if(roomDepthPlusBtn){
    roomDepthPlusBtn.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(r) resizeRoom(selectedRoomId, null, r.depth + 0.5);
    });
  }

  // VLAN Select
  const roomVlanSelect = document.getElementById('roomVlanSelect');
  if(roomVlanSelect){
    roomVlanSelect.addEventListener('change', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(!r) return;
      r.vlanId = roomVlanSelect.value ? parseInt(roomVlanSelect.value) : null;
      rebuildRoom3D(r);
      updateRoomHandles(r);
    });
  }

  // Delete Room Button
  const roomDeleteBtn = document.getElementById('roomDeleteBtn');
  if(roomDeleteBtn){
    roomDeleteBtn.addEventListener('click', ()=>{
      if(!selectedRoomId) return;
      const r = rooms.get(selectedRoomId);
      if(!r) return;
      if(confirm(`"${r.name}" xonasi o'chirilsinmi?`)){
        deleteRoom(selectedRoomId);
      }
    });
  }

  // Toolbar Room Dropdown
  const roomBtn = document.getElementById('roomBtn');
  const roomMenu = document.getElementById('roomMenu');
  if(roomBtn && roomMenu){
    roomBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      roomMenu.classList.toggle('show');
    });
    document.addEventListener('click', ()=>{ roomMenu.classList.remove('show'); });
  }
}

/* --------------------------------------------------------------------------
   MOUSE / RAYCASTER INTERACTION (SELECT & 3D DRAG RESIZE)
   -------------------------------------------------------------------------- */
function setupRoomMouseEvents(){
  if(typeof canvas === 'undefined') return;

  canvas.addEventListener('pointerdown', onRoomPointerDown);
  window.addEventListener('pointermove', onRoomPointerMove);
  window.addEventListener('pointerup', onRoomPointerUp);
}

function onRoomPointerDown(e){
  if(e.button !== 0) return; // Only left click

  // Check raycast for handles first
  const rect = canvas.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // 1. Check Handle Hit
  if(roomHandlesGroup && roomHandlesGroup.children.length > 0){
    const handleHits = raycaster.intersectObjects(roomHandlesGroup.children, false);
    if(handleHits.length > 0){
      const hitHandle = handleHits[0].object;
      if(hitHandle.userData && hitHandle.userData.isHandle){
        isDraggingRoomHandle = true;
        activeDragHandle = hitHandle.userData;
        if(typeof controls !== 'undefined' && controls) controls.enabled = false;
        e.stopPropagation();
        return;
      }
    }
  }

  // 2. Check Device Hit (Devices have priority over rooms)
  if(typeof devices !== 'undefined' && devices.size > 0){
    const devHits = raycaster.intersectObjects(scene.children, true);
    for(const hit of devHits){
      let p = hit.object;
      while(p && p !== scene){
        if(p.userData && p.userData.deviceId){
          // Device clicked, let app.js handle it
          return;
        }
        p = p.parent;
      }
    }
  }

  // 3. Check Room Hit (Floor or Walls)
  if(roomPartitionsGroup && roomPartitionsGroup.children.length > 0){
    const roomHits = raycaster.intersectObjects(roomPartitionsGroup.children, true);
    if(roomHits.length > 0){
      const hitObj = roomHits[0].object;
      if(hitObj.userData && hitObj.userData.roomId){
        selectRoom(hitObj.userData.roomId);
        e.stopPropagation();
        return;
      }
    }
  }

  // 4. Clicked on empty space (and not dragging) -> deselect room
  if(selectedRoomId && !isDraggingRoomHandle){
    // Don't deselect if clicking on UI
    if(!e.target.closest('#roomPanel') && !e.target.closest('#panel') && !e.target.closest('.topbar')){
      deselectRoom();
    }
  }
}

function onRoomPointerMove(e){
  if(!isDraggingRoomHandle || !activeDragHandle) return;

  const room = rooms.get(activeDragHandle.roomId);
  if(!room) return;

  const rect = canvas.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  if(raycaster.ray.intersectPlane(groundPlane, raycasterPlaneIntersect)){
    const px = raycasterPlaneIntersect.x;
    const pz = raycasterPlaneIntersect.z;
    const dir = activeDragHandle.dir;

    let newW = room.width;
    let newD = room.depth;

    if(dir.includes('E')){
      newW = Math.max(3.0, (px - room.x) * 2);
    } else if(dir.includes('W')){
      newW = Math.max(3.0, (room.x - px) * 2);
    }

    if(dir.includes('S')){
      newD = Math.max(3.0, (pz - room.z) * 2);
    } else if(dir.includes('N')){
      newD = Math.max(3.0, (room.z - pz) * 2);
    }

    resizeRoom(room.id, newW, newD);
  }
}

function onRoomPointerUp(){
  if(isDraggingRoomHandle){
    isDraggingRoomHandle = false;
    activeDragHandle = null;
    if(typeof controls !== 'undefined' && controls) controls.enabled = true;
  }
}

// Auto-initialize when window loads
if(typeof window !== 'undefined'){
  window.rooms = rooms;
  window.addCustomRoom = addCustomRoom;
  window.createPresetRoom = createPresetRoom;
  window.resizeRoom = resizeRoom;
  window.selectRoom = selectRoom;
  window.deselectRoom = deselectRoom;
  window.deleteRoom = deleteRoom;
  window.clearAllRooms = clearAllRooms;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initRoomsEngine);
  } else {
    setTimeout(initRoomsEngine, 200);
  }
}
