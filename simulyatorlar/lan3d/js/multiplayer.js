/* ==========================================================================
   LAN 3D MULTIPLAYER & COLLABORATIVE ROOM (UMUMIY VIRTUAL XONA)
   Online P2P WebRTC (PeerJS) + Local BroadcastChannel Dual-Layer Architecture
   With Full Real-Time WebRTC Voice Chat (Conference Audio)
   Features:
   - Online multi-device P2P connection (LAN & Internet)
   - Real-time Voice Chat (Global Conference Call)
   - Voice Activity Detection (VAD) & VU meter
   - 3D Soundwave Halo animation on Cyber Drone avatars when speaking
   - [M] Mute/Unmute toggle & [V] Push-to-Talk (Bosib gapirish)
   - Individual participant volume sliders & mute toggles
   - Admin moderation: "Mute All Students" (Barchaning ovozini o'chirish)
   - First user to enter becomes Admin / Host
   - Late-joiner full topology state synchronization (serialize/deserialize)
   - Real-time 3D Cyber Drone avatars with nameplates and lerp movement
   - 3D Spatial Waypoint / Ping system ([G] key) with pulsing beacon
   - Quick Emote Reactions (👍, ⚠️, ❓, 🎯) floating above 3D avatars
   - Device selection lock & visual indicator ("X sozlamoqda")
   - In-room Team Chat ([T] key) with toast notifications
   ========================================================================== */

const Multiplayer = {
  active: false,
  roomId: null,
  userId: 'usr_' + Math.random().toString(36).substring(2, 9),
  userName: 'Talaba_' + Math.floor(100 + Math.random() * 900),
  userColor: ['#00FF87', '#38BDF8', '#FFB454', '#A78BFA', '#FF6B6B', '#34D399', '#F472B6'][Math.floor(Math.random() * 7)],
  isAdmin: false,
  isLocked: false, // if Admin locked editing for students
  
  // Transports
  channel: null,         // BroadcastChannel for instant local multi-tab
  peer: null,            // PeerJS WebRTC instance
  peerConnections: new Map(), // peerId -> DataConnection
  hostConnection: null,  // Connection to host (if client)

  // 🎙️ Real-Time Voice Chat
  voiceActive: false,
  isMuted: false,
  isPttActive: false,
  localAudioStream: null,
  audioContext: null,
  analyser: null,
  micDataArray: null,
  isSpeaking: false,
  audioCalls: new Map(),     // peerId -> MediaConnection
  remoteAudios: new Map(),   // peerId -> HTMLAudioElement
  peerVolumes: new Map(),    // userId -> number (0-100)
  peerMutes: new Map(),      // userId -> boolean

  // 3D Scene Objects
  peers: new Map(),          // userId -> { name, color, x, y, z, yaw, avatarMesh, lastSeen, isAdmin, isSpeaking, isMuted }
  avatarsGroup: null,
  pingsGroup: null,
  selectionLocks: new Map(), // devId -> { userId, userName, userColor, ringMesh, sprite }
  activePings: [],

  init(){
    // Create Three.js groups
    this.avatarsGroup = new THREE.Group();
    this.avatarsGroup.name = 'multiplayerAvatars';
    scene.add(this.avatarsGroup);

    this.pingsGroup = new THREE.Group();
    this.pingsGroup.name = 'multiplayerPings';
    scene.add(this.pingsGroup);

    // Global Key Listeners: [G] (Ping), [T] (Chat), [M] (Mute), [V] (Push-to-Talk)
    window.addEventListener('keydown', (e) => {
      if(e.target.matches('input, textarea, select')) return;
      if(!this.active) return;

      // [G] — 3D Spatial Waypoint Ping
      if(e.key === 'g' || e.key === 'G'){
        e.preventDefault();
        this.triggerSpatialPing();
      }

      // [T] — Toggle In-Room Chat
      if(e.key === 't' || e.key === 'T'){
        e.preventDefault();
        this.toggleChat();
      }

      // [M] — Toggle Microphone Mute
      if(e.key === 'm' || e.key === 'M'){
        e.preventDefault();
        this.toggleMute();
      }

      // [V] — Push-to-Talk (Hold to speak)
      if(e.key === 'v' || e.key === 'V'){
        if(!this.isPttActive && this.isMuted){
          this.isPttActive = true;
          this.setMicrophoneTrack(true);
          toast("🎙️ Push-to-Talk: Gapiring...");
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if(e.target.matches('input, textarea, select')) return;
      if(!this.active) return;

      // [V] released — Re-mute if PTT was active
      if(e.key === 'v' || e.key === 'V'){
        if(this.isPttActive){
          this.isPttActive = false;
          this.setMicrophoneTrack(false);
        }
      }
    });

    // Check URL query for room e.g. ?room=ATT-LAB-01
    const urlParams = new URLSearchParams(window.location.search);
    const qRoom = urlParams.get('room');
    if(qRoom){
      const qName = urlParams.get('name');
      this.joinRoom(qRoom, qName);
    }

    this.setupUIEvents();
  },

  /* --------------------------------------------------------------------------
     ROOM LIFECYCLE (JOIN & LEAVE)
     -------------------------------------------------------------------------- */
  joinRoom(roomId, customName){
    if(!roomId || !roomId.trim()) roomId = 'ATT-LAB-01';
    this.roomId = roomId.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '');
    if(customName && customName.trim()) this.userName = customName.trim();
    this.active = true;
    this.isAdmin = false;
    this.isLocked = false;

    // 1. Initialize BroadcastChannel (for instant local / multi-tab)
    try {
      if(this.channel) this.channel.close();
      this.channel = new BroadcastChannel('lan3d_room_' + this.roomId);
      this.channel.onmessage = (e) => this.handleMessage(e.data);
    } catch(err){
      console.warn('BroadcastChannel error:', err);
    }

    // 2. Initialize PeerJS WebRTC P2P (for cross-device / LAN / Internet)
    this.initPeerJS();

    // 3. Initialize Voice Chat (Conference Audio)
    this.initVoiceChat();

    // 4. Announce Join on BroadcastChannel
    this.broadcast({
      type: 'user_joined',
      userId: this.userId,
      name: this.userName,
      color: this.userColor,
      isMuted: this.isMuted,
      pos: this.getLocalPlayerState()
    });

    // 5. Start Heartbeat Timer (every 100ms)
    if(!this.heartbeatTimer){
      this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), 100);
    }

    // 6. Update UI
    this.updateUI();
    toast(`👥 "${this.roomId}" umumiy virtual xonasiga ulandingiz! Ismingiz: ${this.userName}`);
    this.addChatMessage('Tizim', `Xonaga qo'shildingiz: ${this.roomId}. 💡 [M] — Mikrofon, [V] — Bosib gapirish, [G] — 3D belgi, [T] — Chat`, '#38BDF8');
  },

  initPeerJS(){
    if(typeof Peer === 'undefined'){
      console.warn('PeerJS library not loaded, falling back to BroadcastChannel.');
      setTimeout(() => {
        if(this.peers.size === 0 && !this.isAdmin){
          this.setAdmin(true);
        }
      }, 400);
      return;
    }

    const cleanRoom = this.roomId.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const hostPeerId = 'lan3d_room_' + cleanRoom;

    try {
      // First, attempt to create the Host Peer with the canonical room ID
      const hostPeer = new Peer(hostPeerId, { debug: 1 });

      hostPeer.on('open', (id) => {
        // SUCCESS: We are the Host / Admin!
        this.peer = hostPeer;
        this.setAdmin(true);
        console.log('Multiplayer: Claimed Host ID:', id);

        this.peer.on('connection', (conn) => {
          this.handleIncomingPeerConnection(conn);
        });

        // Listen for incoming audio calls
        this.peer.on('call', (call) => {
          this.answerIncomingAudioCall(call);
        });
      });

      hostPeer.on('error', (err) => {
        // If ID is already taken, someone else is the Host!
        if(err.type === 'unavailable-id'){
          console.log('Multiplayer: Host already exists, connecting as client...');
          hostPeer.destroy();
          this.connectAsPeerClient(hostPeerId);
        } else {
          console.warn('PeerJS host error:', err);
        }
      });
    } catch(err){
      console.warn('PeerJS init failed:', err);
    }
  },

  connectAsPeerClient(hostPeerId){
    const clientPeerId = 'lan3d_peer_' + this.userId;
    try {
      this.peer = new Peer(clientPeerId, { debug: 1 });

      this.peer.on('open', () => {
        this.setAdmin(false);
        const conn = this.peer.connect(hostPeerId, { reliable: true });

        conn.on('open', () => {
          console.log('Multiplayer: Connected to Host WebRTC:', hostPeerId);
          this.hostConnection = conn;
          this.peerConnections.set(hostPeerId, conn);

          // Send announce and request full state
          conn.send({
            type: 'user_joined',
            userId: this.userId,
            name: this.userName,
            color: this.userColor,
            isMuted: this.isMuted,
            pos: this.getLocalPlayerState()
          });

          conn.send({
            type: 'request_state',
            userId: this.userId
          });

          // Call host with audio if local stream is ready
          if(this.localAudioStream){
            this.callPeerAudio(hostPeerId);
          }
        });

        conn.on('data', (data) => {
          this.handleMessage(data);
        });

        conn.on('close', () => {
          console.log('Multiplayer: Host connection closed');
          this.peerConnections.delete(hostPeerId);
        });

        // Listen for incoming calls
        this.peer.on('call', (call) => {
          this.answerIncomingAudioCall(call);
        });
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS client error:', err);
      });
    } catch(err){
      console.warn('connectAsPeerClient error:', err);
    }
  },

  handleIncomingPeerConnection(conn){
    conn.on('open', () => {
      this.peerConnections.set(conn.peer, conn);

      // Call this incoming peer with audio
      if(this.localAudioStream){
        this.callPeerAudio(conn.peer);
      }

      conn.on('data', (data) => {
        this.handleMessage(data);

        // Host relays messages to other connected WebRTC peers (Star mesh)
        this.peerConnections.forEach((c, pid) => {
          if(pid !== conn.peer && c.open){
            c.send(data);
          }
        });
      });
    });

    conn.on('close', () => {
      this.peerConnections.delete(conn.peer);
    });
  },

  leaveRoom(){
    if(!this.active) return;
    this.broadcast({ type: 'user_left', userId: this.userId });

    // Stop voice chat
    this.stopVoiceChat();

    if(this.channel) this.channel.close();
    if(this.peer) this.peer.destroy();
    if(this.heartbeatTimer) clearInterval(this.heartbeatTimer);

    this.peers.forEach(p => {
      if(p.avatarMesh) this.avatarsGroup.remove(p.avatarMesh);
    });
    this.peers.clear();

    this.selectionLocks.forEach(lock => {
      if(lock.ringMesh) scene.remove(lock.ringMesh);
      if(lock.sprite) scene.remove(lock.sprite);
    });
    this.selectionLocks.clear();

    this.active = false;
    this.roomId = null;
    this.isAdmin = false;
    this.isLocked = false;
    this.updateUI();
    toast("Umumiy xonadan chiqildi");
  },

  setAdmin(val){
    this.isAdmin = val;
    this.updateUI();
    if(val){
      toast(`👑 Siz "${this.roomId}" xonasining Admini / Xostisiz!`);
      this.addChatMessage('Tizim', `Siz ushbu xona Adminisiz. Topologiyani qulflash yoki barchani to'plash huquqiga egasiz.`, '#FBBF24');
    }
  },

  /* --------------------------------------------------------------------------
     🎙️ REAL-TIME WEBRTC VOICE CHAT (GLOBAL CONFERENCE)
     -------------------------------------------------------------------------- */
  async initVoiceChat(){
    if(this.voiceActive) return;

    try {
      // 1. Request microphone stream with voice-optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.localAudioStream = stream;
      this.voiceActive = true;
      this.isMuted = false;

      // 2. Set up Web Audio API Analyser for Voice Activity Detection (VAD)
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if(AudioContextClass){
        this.audioContext = new AudioContextClass();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);
        this.micDataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }

      // 3. Call any existing peers
      this.peerConnections.forEach((conn, peerId) => {
        this.callPeerAudio(peerId);
      });

      this.updateVoiceUI();
      toast("🎙️ Ovozli konferensiya ulandi! Mikrofon yoqildi [M]");
    } catch(err){
      console.warn('Microphone access not available or denied:', err);
      toast("⚠️ Mikrofon ulanmadi yoki ruxsat berilmadi. Ovozli gaplashish o'chiq.");
      this.voiceActive = false;
      this.updateVoiceUI();
    }
  },

  callPeerAudio(peerId){
    if(!this.peer || !this.localAudioStream) return;
    try {
      const call = this.peer.call(peerId, this.localAudioStream);
      this.audioCalls.set(peerId, call);

      call.on('stream', (remoteStream) => {
        this.playRemoteAudioStream(peerId, remoteStream);
      });

      call.on('close', () => {
        this.removeRemoteAudioStream(peerId);
      });
    } catch(err){
      console.warn('callPeerAudio error:', err);
    }
  },

  answerIncomingAudioCall(call){
    try {
      this.audioCalls.set(call.peer, call);

      // Answer with local stream if ready
      if(this.localAudioStream){
        call.answer(this.localAudioStream);
      } else {
        // Answer without tracks, but receive
        call.answer();
      }

      call.on('stream', (remoteStream) => {
        this.playRemoteAudioStream(call.peer, remoteStream);
      });

      call.on('close', () => {
        this.removeRemoteAudioStream(call.peer);
      });
    } catch(err){
      console.warn('answerIncomingAudioCall error:', err);
    }
  },

  playRemoteAudioStream(peerId, stream){
    let audioEl = this.remoteAudios.get(peerId);
    if(!audioEl){
      audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      this.remoteAudios.set(peerId, audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.play().catch(e => console.log('Audio autoplay prevented:', e));
  },

  removeRemoteAudioStream(peerId){
    const audioEl = this.remoteAudios.get(peerId);
    if(audioEl){
      audioEl.srcObject = null;
      audioEl.remove();
      this.remoteAudios.delete(peerId);
    }
    this.audioCalls.delete(peerId);
  },

  toggleMute(){
    this.isMuted = !this.isMuted;
    this.setMicrophoneTrack(!this.isMuted);
    toast(this.isMuted ? "🔇 Mikrofon o'chirildi [M]" : "🎙️ Mikrofon yoqildi [M]");
    this.updateVoiceUI();
    this.broadcast({
      type: 'voice_mute_status',
      userId: this.userId,
      isMuted: this.isMuted
    });
  },

  setMicrophoneTrack(enabled){
    if(this.localAudioStream){
      this.localAudioStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
    this.updateVoiceUI();
  },

  muteAllStudents(){
    if(!this.isAdmin) return;
    this.broadcast({ type: 'admin_mute_all' });
    toast("🔇 Barcha talabalarning mikrofoni o'chirildi");
  },

  stopVoiceChat(){
    if(this.localAudioStream){
      this.localAudioStream.getTracks().forEach(t => t.stop());
      this.localAudioStream = null;
    }
    if(this.audioContext){
      this.audioContext.close();
      this.audioContext = null;
    }
    this.remoteAudios.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    this.remoteAudios.clear();
    this.audioCalls.clear();
    this.voiceActive = false;
    this.isSpeaking = false;
    this.updateVoiceUI();
  },

  checkVoiceActivity(){
    if(!this.voiceActive || !this.analyser || this.isMuted || !this.localAudioStream) {
      if(this.isSpeaking){
        this.isSpeaking = false;
        this.broadcast({ type: 'voice_speaking', userId: this.userId, speaking: false });
        this.updateLocalSpeakingUI(false);
      }
      this.updateVuMeter(0);
      return;
    }

    this.analyser.getByteFrequencyData(this.micDataArray);
    let sum = 0;
    for(let i = 0; i < this.micDataArray.length; i++){
      sum += this.micDataArray[i];
    }
    const avg = sum / this.micDataArray.length;

    // Update VU meter (0 - 100%)
    const pct = Math.min(100, Math.round((avg / 60) * 100));
    this.updateVuMeter(pct);

    const speaking = avg > 14;
    if(speaking !== this.isSpeaking){
      this.isSpeaking = speaking;
      this.broadcast({
        type: 'voice_speaking',
        userId: this.userId,
        speaking: speaking
      });
      this.updateLocalSpeakingUI(speaking);
    }
  },

  updateVuMeter(pct){
    const chatVu = document.getElementById('collabChatVuFill');
    if(chatVu) chatVu.style.width = pct + '%';
    const modalVu = document.getElementById('collabModalVuFill');
    if(modalVu) modalVu.style.width = pct + '%';
  },

  updateLocalSpeakingUI(speaking){
    const chatDot = document.getElementById('collabChatVoiceDot');
    if(chatDot){
      chatDot.style.background = speaking ? '#00FF87' : (this.isMuted ? '#EF4444' : '#38BDF8');
    }
  },

  setPeerSpeaking(userId, speaking){
    const p = this.peers.get(userId);
    if(p){
      p.isSpeaking = speaking;
      // Animate 3D Soundwave Halo on drone avatar
      if(p.avatarMesh && p.avatarMesh.userData && p.avatarMesh.userData.speakingHalo){
        p.avatarMesh.userData.speakingHalo.visible = speaking;
      }
      this.updateParticipantsList();
    }
  },

  setPeerVolume(userId, vol){
    this.peerVolumes.set(userId, vol);
    // Find audio element
    this.remoteAudios.forEach((el, peerId) => {
      if(peerId.includes(userId)){
        el.volume = vol / 100;
      }
    });
  },

  togglePeerMute(userId){
    const cur = !this.peerMutes.get(userId);
    this.peerMutes.set(userId, cur);
    this.remoteAudios.forEach((el, peerId) => {
      if(peerId.includes(userId)){
        el.muted = cur;
      }
    });
    this.updateParticipantsList();
  },

  updateVoiceUI(){
    const chatMicBtn = document.getElementById('collabChatMicBtn');
    const modalMicBtn = document.getElementById('collabModalMicBtn');
    const voiceCard = document.getElementById('collabVoiceCard');
    const chatVoiceText = document.getElementById('collabChatVoiceText');
    const chatVoiceDot = document.getElementById('collabChatVoiceDot');

    const micText = this.isMuted ? "🔇 O'CHIRILGAN [M]" : "🎙️ YOQILGAN [M]";
    const micIcon = this.isMuted ? "🔇" : "🎙️";
    const isOk = this.voiceActive && !this.isMuted;

    if(chatMicBtn){
      chatMicBtn.innerHTML = micIcon;
      chatMicBtn.classList.toggle('on', isOk);
      chatMicBtn.style.color = isOk ? '#00FF87' : '#EF4444';
    }

    if(modalMicBtn){
      modalMicBtn.innerHTML = micText;
      modalMicBtn.classList.toggle('on', isOk);
      modalMicBtn.style.color = isOk ? '#00FF87' : '#EF4444';
      modalMicBtn.style.borderColor = isOk ? '#00FF87' : '#EF4444';
    }

    if(chatVoiceText){
      chatVoiceText.textContent = this.isMuted ? "Ovoz: Mute [M]" : "Ovoz: Faol";
      chatVoiceText.style.color = this.isMuted ? "#EF4444" : "#00FF87";
    }

    if(chatVoiceDot){
      chatVoiceDot.style.background = this.isMuted ? "#EF4444" : "#00FF87";
    }

    if(voiceCard){
      voiceCard.style.borderColor = isOk ? 'rgba(0,255,135,0.4)' : 'rgba(239,68,68,0.3)';
    }

    this.updateParticipantsList();
  },

  /* --------------------------------------------------------------------------
     STATE POSITION & HEARTBEAT
     -------------------------------------------------------------------------- */
  getLocalPlayerState(){
    let x = 0, y = 1.7, z = 0, yaw = 0;
    if(typeof isFpsMode !== 'undefined' && isFpsMode){
      x = camera.position.x;
      y = camera.position.y;
      z = camera.position.z;
      yaw = fpsYaw || 0;
    } else {
      x = target.x;
      y = 1.7;
      z = target.z;
      yaw = camTheta || 0;
    }
    return { x, y, z, yaw };
  },

  sendHeartbeat(){
    if(!this.active) return;
    const st = this.getLocalPlayerState();
    this.broadcast({
      type: 'player_move',
      userId: this.userId,
      name: this.userName,
      color: this.userColor,
      isAdmin: this.isAdmin,
      isMuted: this.isMuted,
      x: st.x,
      y: st.y,
      z: st.z,
      yaw: st.yaw
    });

    // Check voice activity
    this.checkVoiceActivity();

    // Cleanup stale peers (inactive > 8s)
    const now = Date.now();
    this.peers.forEach((p, id) => {
      if(now - p.lastSeen > 8000){
        if(p.avatarMesh) this.avatarsGroup.remove(p.avatarMesh);
        this.peers.delete(id);
        this.updateParticipantsList();
      }
    });

    // Update active 3D pings animation
    this.updateActivePings();
  },

  /* --------------------------------------------------------------------------
     MESSAGE BROADCAST & HANDLER
     -------------------------------------------------------------------------- */
  broadcast(msg){
    if(!this.active) return;
    msg._from = this.userId;
    msg._time = Date.now();

    // 1. BroadcastChannel (local tabs)
    if(this.channel){
      try { this.channel.postMessage(msg); } catch(err){}
    }

    // 2. PeerJS WebRTC DataConnections (cross-device)
    if(this.peerConnections && this.peerConnections.size > 0){
      this.peerConnections.forEach((conn) => {
        if(conn && conn.open){
          try { conn.send(msg); } catch(err){}
        }
      });
    }
  },

  handleMessage(msg){
    if(!msg || msg._from === this.userId) return;

    switch(msg.type){
      case 'user_joined':
        this.addPeer(msg.userId, msg.name, msg.color, msg.pos, msg.isAdmin, msg.isMuted);
        toast(`👋 ${msg.name} xonaga qo'shildi`);
        this.addChatMessage('Tizim', `${msg.name} xonaga qo'shildi`, msg.color);

        // Reply announce so the new peer knows about us
        this.broadcast({
          type: 'user_announce',
          userId: this.userId,
          name: this.userName,
          color: this.userColor,
          isAdmin: this.isAdmin,
          isMuted: this.isMuted,
          pos: this.getLocalPlayerState()
        });

        // Call new peer with audio if stream ready
        if(this.localAudioStream && this.peer){
          const peerTargetId = 'lan3d_peer_' + msg.userId;
          this.callPeerAudio(peerTargetId);
        }
        break;

      case 'user_announce':
        this.addPeer(msg.userId, msg.name, msg.color, msg.pos, msg.isAdmin, msg.isMuted);
        break;

      case 'user_left':
        this.removePeer(msg.userId);
        break;

      case 'player_move':
        this.updatePeerPosition(msg.userId, msg.name, msg.color, msg.x, msg.y, msg.z, msg.yaw, msg.isAdmin, msg.isMuted);
        break;

      case 'voice_speaking':
        this.setPeerSpeaking(msg.userId, msg.speaking);
        break;

      case 'voice_mute_status':
        if(this.peers.has(msg.userId)){
          this.peers.get(msg.userId).isMuted = msg.isMuted;
          this.updateParticipantsList();
        }
        break;

      case 'admin_mute_all':
        if(!this.isAdmin){
          this.isMuted = true;
          this.setMicrophoneTrack(false);
          this.updateVoiceUI();
          toast("🔇 O'qituvchi / Admin barcha talabalar mikrofonini o'chirdi");
        }
        break;

      case 'player_emote':
        this.showPeerEmote(msg.userId, msg.name, msg.emote);
        break;

      case 'spatial_ping':
        this.spawn3DPing(msg.x, msg.y, msg.z, msg.name, msg.color, msg.text);
        break;

      case 'chat_message':
        this.addChatMessage(msg.name, msg.text, msg.color);
        break;

      // ── Full State Synchronization (Late Joiner) ──
      case 'request_state':
        if(this.isAdmin && typeof serializeProject === 'function'){
          const fullState = serializeProject('MultiplayerSync');
          this.broadcast({
            type: 'sync_state',
            targetUserId: msg.userId,
            state: fullState
          });
        }
        break;

      case 'sync_state':
        if(msg.targetUserId === this.userId && msg.state && typeof deserializeProject === 'function'){
          deserializeProject(msg.state);
          toast(`🔄 Xostdan to'liq tarmoq topologiyasi qabul qilindi!`);
        }
        break;

      // ── Topology Modifications ──
      case 'topo_add_device':
        if(typeof window.addDeviceFromData === 'function'){
          window.addDeviceFromData(msg.deviceData);
        }
        break;

      case 'topo_move_device':
        if(typeof window.moveDeviceRemote === 'function'){
          window.moveDeviceRemote(msg.deviceId, msg.x, msg.z);
        }
        break;

      case 'topo_connect':
        if(typeof window.connectDevicesRemote === 'function'){
          window.connectDevicesRemote(msg.fromId, msg.toId, {
            portA: msg.portA,
            portB: msg.portB,
            cableType: msg.cableType,
            _remote: true
          });
        }
        break;

      case 'topo_remove_connection':
        if(typeof window.removeConnectionRemote === 'function'){
          window.removeConnectionRemote(msg.connId);
        }
        break;

      case 'topo_remove_device':
        if(typeof window.removeDeviceRemote === 'function'){
          window.removeDeviceRemote(msg.deviceId);
        }
        break;

      case 'topo_packet_sent':
        if(typeof window.spawnPacketVisualRemote === 'function'){
          window.spawnPacketVisualRemote(msg.fromId, msg.toId, msg.color, msg.protocol);
        }
        break;

      case 'device_selected':
        this.showSelectionLock(msg.devId, msg.userId, msg.name, msg.color);
        break;

      case 'device_deselected':
        this.removeSelectionLock(msg.devId);
        break;

      // ── Admin Commands ──
      case 'admin_lock_toggle':
        this.isLocked = msg.isLocked;
        toast(this.isLocked
          ? `🔒 Xona admini topologiyani qulfladi (Faqat kuzatish)`
          : `🔓 Xona admini topologiyani qulfdan chiqardi (Tahrirlash mumkin)`
        );
        break;

      case 'admin_clear_all':
        if(typeof deserializeProject === 'function'){
          deserializeProject({ version: 1, devices: [], connections: [], rooms: [] });
          toast(`🧹 Xona admini barcha qurilmalarni tozaladi`);
        }
        break;

      case 'admin_teleport_all':
        if(msg.pos){
          if(typeof isFpsMode !== 'undefined' && isFpsMode){
            camera.position.set(msg.pos.x, msg.pos.y, msg.pos.z);
          } else {
            target.set(msg.pos.x, 0, msg.pos.z);
            updateCamera();
          }
          toast(`📍 Admin barchani o‘zi turgan joyga to‘pladi`);
        }
        break;
    }
  },

  /* --------------------------------------------------------------------------
     3D PEER AVATARS & MOVEMENT
     -------------------------------------------------------------------------- */
  addPeer(id, name, color, pos, isAdmin, isMuted){
    if(this.peers.has(id)){
      const p = this.peers.get(id);
      p.name = name;
      p.color = color;
      p.isAdmin = !!isAdmin;
      p.isMuted = !!isMuted;
      p.lastSeen = Date.now();
      return;
    }
    const avatar = this.createAvatarMesh(name, color, isAdmin);
    if(pos){
      avatar.position.set(pos.x || 0, pos.y || 1.7, pos.z || 0);
    }
    this.avatarsGroup.add(avatar);
    this.peers.set(id, {
      id,
      name,
      color,
      isAdmin: !!isAdmin,
      isMuted: !!isMuted,
      isSpeaking: false,
      x: pos ? pos.x : 0,
      y: pos ? pos.y : 1.7,
      z: pos ? pos.z : 0,
      yaw: pos ? pos.yaw : 0,
      avatarMesh: avatar,
      lastSeen: Date.now()
    });
    this.updateParticipantsList();
  },

  updatePeerPosition(id, name, color, x, y, z, yaw, isAdmin, isMuted){
    let p = this.peers.get(id);
    if(!p){
      this.addPeer(id, name, color, { x, y, z, yaw }, isAdmin, isMuted);
      p = this.peers.get(id);
    }
    if(!p) return;
    p.lastSeen = Date.now();
    p.name = name;
    p.color = color;
    p.isAdmin = !!isAdmin;
    if(isMuted !== undefined) p.isMuted = isMuted;

    if(p.avatarMesh){
      p.avatarMesh.position.lerp(new THREE.Vector3(x, y, z), 0.35);
      p.avatarMesh.rotation.y = yaw || 0;

      // Pulse speaking halo if active
      if(p.isSpeaking && p.avatarMesh.userData && p.avatarMesh.userData.speakingHalo){
        const scale = 1.0 + Math.sin(Date.now() * 0.015) * 0.25;
        p.avatarMesh.userData.speakingHalo.scale.set(scale, scale, scale);
      }
    }
  },

  removePeer(id){
    const p = this.peers.get(id);
    if(p){
      if(p.avatarMesh) this.avatarsGroup.remove(p.avatarMesh);
      toast(`🏃 ${p.name} xonadan chiqdi`);
      this.addChatMessage('Tizim', `${p.name} xonadan chiqdi`, '#FF6B6B');
      this.peers.delete(id);
      this.updateParticipantsList();
    }
  },

  createAvatarMesh(name, colorHex, isAdmin){
    const g = new THREE.Group();
    const col = new THREE.Color(colorHex || '#38BDF8');

    // Cyber Drone / Bot Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1A2333,
      metalness: 0.85,
      roughness: 0.25
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.6, 16), bodyMat);
    g.add(body);

    // Glowing Visor / Eyes
    const visorMat = new THREE.MeshBasicMaterial({ color: col });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.2), visorMat);
    visor.position.set(0, 0.08, 0.22);
    g.add(visor);

    // Hover Ring around drone
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.15;
    g.add(ring);

    // Thruster glow underneath
    const thrusterMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5 });
    const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 12), thrusterMat);
    thruster.rotation.x = Math.PI;
    thruster.position.y = -0.45;
    g.add(thruster);

    // 3D Speaking Soundwave Halo (Green pulsing ring when user speaks)
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x00FF87,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const speakingHalo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 32), waveMat);
    speakingHalo.rotation.x = -Math.PI / 2;
    speakingHalo.position.y = 0.05;
    speakingHalo.visible = false;
    g.add(speakingHalo);
    g.userData.speakingHalo = speakingHalo;

    // Crown / Badge if Admin
    if(isAdmin){
      const crownMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.25, 5), crownMat);
      crown.position.set(0, 0.45, 0);
      g.add(crown);
    }

    // 2D Canvas Billboard Nameplate above avatar
    const canvas = document.createElement('canvas');
    canvas.width = 280; canvas.height = 70;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(11, 15, 24, 0.88)';
    ctx.roundRect ? ctx.roundRect(8, 8, 264, 54, 12) : ctx.rect(8, 8, 264, 54);
    ctx.fill();
    ctx.strokeStyle = isAdmin ? '#FBBF24' : (colorHex || '#38BDF8');
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = isAdmin ? '#FBBF24' : '#FFFFFF';
    ctx.font = 'bold 20px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((isAdmin ? '👑 ' : '') + name, 140, 35);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, 0.75, 0);
    sprite.scale.set(1.6, 0.4, 1);
    g.add(sprite);

    return g;
  },

  /* --------------------------------------------------------------------------
     3D SPATIAL WAYPOINT / PING SYSTEM ([G] KEY)
     -------------------------------------------------------------------------- */
  triggerSpatialPing(customPos){
    let targetPos = customPos;
    if(!targetPos){
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      targetPos = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, targetPos);
    }

    if(!targetPos) return;

    this.spawn3DPing(targetPos.x, 0.05, targetPos.z, this.userName, this.userColor, 'Bu yerga qarang!');

    this.broadcast({
      type: 'spatial_ping',
      x: targetPos.x,
      y: 0.05,
      z: targetPos.z,
      name: this.userName,
      color: this.userColor,
      text: 'Bu yerga qarang!'
    });
  },

  spawn3DPing(x, y, z, name, colorHex, text){
    const col = new THREE.Color(colorHex || '#00FF87');

    const ringGeo = new THREE.RingGeometry(0.2, 0.45, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: col,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const pingMesh = new THREE.Mesh(ringGeo, ringMat);
    pingMesh.position.set(x, y, z);
    this.pingsGroup.add(pingMesh);

    const colGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 12);
    const colMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 });
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.set(x, y + 1.25, z);
    this.pingsGroup.add(colMesh);

    const canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 70;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(11, 15, 24, 0.9)';
    ctx.roundRect ? ctx.roundRect(6, 6, 288, 58, 12) : ctx.rect(6, 6, 288, 58);
    ctx.fill();
    ctx.strokeStyle = colorHex || '#00FF87';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`📍 ${name}: ${text || 'Belgilash'}`, 150, 35);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, y + 2.8, z);
    sprite.scale.set(1.8, 0.42, 1);
    this.pingsGroup.add(sprite);

    toast(`📍 ${name} 3D maydonda belgi qo'ydi!`);

    this.activePings.push({
      pingMesh,
      colMesh,
      sprite,
      created: Date.now(),
      duration: 5000
    });
  },

  updateActivePings(){
    const now = Date.now();
    for(let i = this.activePings.length - 1; i >= 0; i--){
      const p = this.activePings[i];
      const elapsed = now - p.created;
      if(elapsed > p.duration){
        this.pingsGroup.remove(p.pingMesh);
        this.pingsGroup.remove(p.colMesh);
        this.pingsGroup.remove(p.sprite);
        p.pingMesh.geometry.dispose();
        p.colMesh.geometry.dispose();
        this.activePings.splice(i, 1);
      } else {
        const progress = elapsed / p.duration;
        const pulse = 1.0 + Math.sin(elapsed * 0.008) * 0.35;
        p.pingMesh.scale.set(pulse, pulse, pulse);
        p.pingMesh.material.opacity = (1 - progress) * 0.9;
        p.colMesh.material.opacity = (1 - progress) * 0.6;
        p.sprite.material.opacity = (1 - progress);
      }
    }
  },

  /* --------------------------------------------------------------------------
     EMOTES & REACTION SYSTEM
     -------------------------------------------------------------------------- */
  sendEmote(emote){
    if(!this.active) return;
    this.showPeerEmote(this.userId, this.userName, emote);
    this.broadcast({
      type: 'player_emote',
      userId: this.userId,
      name: this.userName,
      emote: emote
    });
  },

  showPeerEmote(userId, name, emote){
    toast(`${name}: ${emote}`);
    let pos = this.getLocalPlayerState();
    if(userId !== this.userId && this.peers.has(userId)){
      const p = this.peers.get(userId);
      pos = { x: p.x, y: p.y, z: p.z };
    }

    const canvas = document.createElement('canvas');
    canvas.width = 120; canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emote, 60, 60);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(pos.x, pos.y + 1.2, pos.z);
    sprite.scale.set(0.9, 0.9, 1);
    this.avatarsGroup.add(sprite);

    let startTime = Date.now();
    const anim = () => {
      const el = Date.now() - startTime;
      if(el > 2800){
        this.avatarsGroup.remove(sprite);
        sprite.material.dispose();
      } else {
        sprite.position.y += 0.005;
        sprite.material.opacity = 1 - (el / 2800);
        requestAnimationFrame(anim);
      }
    };
    anim();
  },

  /* --------------------------------------------------------------------------
     DEVICE SELECTION LOCK
     -------------------------------------------------------------------------- */
  showSelectionLock(devId, userId, userName, userColor){
    const dev = devices.get(devId);
    if(!dev) return;

    this.removeSelectionLock(devId);

    const col = new THREE.Color(userColor || '#A78BFA');
    const ringGeo = new THREE.RingGeometry(0.5, 0.65, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(dev.group.position);
    ringMesh.position.y = 0.06;
    scene.add(ringMesh);

    const canvas = document.createElement('canvas');
    canvas.width = 240; canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(11, 15, 24, 0.85)';
    ctx.roundRect ? ctx.roundRect(4, 4, 232, 42, 8) : ctx.rect(4, 4, 232, 42);
    ctx.fill();
    ctx.strokeStyle = userColor || '#A78BFA';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`✏️ ${userName} sozlamoqda`, 120, 25);

    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.position.copy(dev.group.position);
    sprite.position.y = 1.3;
    sprite.scale.set(1.4, 0.32, 1);
    scene.add(sprite);

    this.selectionLocks.set(devId, { userId, userName, userColor, ringMesh, sprite });
  },

  removeSelectionLock(devId){
    const lock = this.selectionLocks.get(devId);
    if(lock){
      if(lock.ringMesh) scene.remove(lock.ringMesh);
      if(lock.sprite) scene.remove(lock.sprite);
      this.selectionLocks.delete(devId);
    }
  },

  /* --------------------------------------------------------------------------
     ADMIN CONTROLS & INVITE LINK
     -------------------------------------------------------------------------- */
  toggleLock(){
    if(!this.isAdmin) return;
    this.isLocked = !this.isLocked;
    this.broadcast({
      type: 'admin_lock_toggle',
      isLocked: this.isLocked
    });
    toast(this.isLocked
      ? `🔒 Topologiya tahrirlash barcha talabalar uchun qulflFactoryandi`
      : `🔓 Topologiya qulfdan chiqarildi`
    );
    this.updateUI();
  },

  clearRoomTopology(){
    if(!this.isAdmin) return;
    if(confirm("Xonadagi barcha qurilma va kabellar o'chirilsinmi?")){
      if(typeof deserializeProject === 'function'){
        deserializeProject({ version: 1, devices: [], connections: [], rooms: [] });
      }
      this.broadcast({ type: 'admin_clear_all' });
      toast("Xona topologiyasi tozalandi");
    }
  },

  teleportAllToMe(){
    if(!this.isAdmin) return;
    const pos = this.getLocalPlayerState();
    this.broadcast({
      type: 'admin_teleport_all',
      pos: pos
    });
    toast("Barcha talabalar sizning yoningizga chaqirildi");
  },

  copyInviteLink(){
    const url = window.location.origin + window.location.pathname + '?room=' + (this.roomId || 'ATT-LAB-01');
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(() => {
        toast(`🔗 Havola nusxalandi: ${url}`);
      }).catch(() => {
        prompt("Xonaga taklif qilish havolasi:", url);
      });
    } else {
      prompt("Xonaga taklif qilish havolasi:", url);
    }
  },

  /* --------------------------------------------------------------------------
     TEAM CHAT & UI
     -------------------------------------------------------------------------- */
  toggleChat(){
    const chatOverlay = document.getElementById('collabChatOverlay');
    if(!chatOverlay) return;
    if(chatOverlay.style.display === 'none' || !chatOverlay.style.display){
      chatOverlay.style.display = 'flex';
      const inp = document.getElementById('collabChatInput');
      if(inp) inp.focus();
    } else {
      chatOverlay.style.display = 'none';
    }
  },

  sendChat(text){
    if(!text || !text.trim()) return;
    const trimmed = text.trim();
    this.addChatMessage(this.userName, trimmed, this.userColor);
    this.broadcast({
      type: 'chat_message',
      name: this.userName,
      color: this.userColor,
      text: trimmed
    });
  },

  addChatMessage(from, text, color){
    const chatBox = document.getElementById('collabChatMessages');
    if(!chatBox) return;
    const div = document.createElement('div');
    div.className = 'collab-chat-msg';
    div.innerHTML = `<span style="color:${color || '#38BDF8'}; font-weight:700;">${from}:</span> <span>${this.escapeHtml(text)}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    const chatOverlay = document.getElementById('collabChatOverlay');
    if(chatOverlay && chatOverlay.style.display === 'none' && from !== this.userName){
      toast(`💬 ${from}: ${text}`);
    }
  },

  escapeHtml(str){
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  },

  setupUIEvents(){
    const copyBtn = document.getElementById('collabCopyLinkBtn');
    if(copyBtn) copyBtn.addEventListener('click', () => this.copyInviteLink());

    const lockBtn = document.getElementById('collabLockBtn');
    if(lockBtn) lockBtn.addEventListener('click', () => this.toggleLock());

    const clearBtn = document.getElementById('collabClearRoomBtn');
    if(clearBtn) clearBtn.addEventListener('click', () => this.clearRoomTopology());

    const tpBtn = document.getElementById('collabTeleportBtn');
    if(tpBtn) tpBtn.addEventListener('click', () => this.teleportAllToMe());
  },

  updateUI(){
    const btn = document.getElementById('collabToolbarBtn');
    const badge = document.getElementById('collabStatusBadge');
    const roomCodeEl = document.getElementById('collabRoomCodeDisplay');
    const chatOverlay = document.getElementById('collabChatOverlay');
    const adminSection = document.getElementById('collabAdminSection');
    const roleBadge = document.getElementById('collabRoleBadge');
    const lockBtn = document.getElementById('collabLockBtn');

    if(btn){
      btn.classList.toggle('on', this.active);
      btn.innerHTML = this.active
        ? `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Xona: ${this.roomId} (${this.peers.size + 1})`
        : `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Umumiy Xona`;
    }

    if(roomCodeEl){
      roomCodeEl.textContent = this.active ? this.roomId : 'Ulanmagan';
    }

    if(badge){
      badge.textContent = this.active ? `Faol: ${this.peers.size + 1} kishi` : 'Offlayn';
      badge.style.color = this.active ? '#00FF87' : '#8B97AE';
    }

    if(roleBadge){
      roleBadge.innerHTML = this.isAdmin
        ? `<span class="collab-role-tag admin">👑 Xona Admini / Xost</span>`
        : `<span class="collab-role-tag guest">🎓 Talaba / Qatnashuvchi</span>`;
    }

    if(adminSection){
      adminSection.style.display = (this.active && this.isAdmin) ? 'flex' : 'none';
    }

    if(lockBtn){
      lockBtn.innerHTML = this.isLocked
        ? `🔓 Qulfdan Chiqarish`
        : `🔒 Topologiyani Qulflash`;
      lockBtn.style.color = this.isLocked ? '#00FF87' : '#FBBF24';
    }

    if(chatOverlay){
      chatOverlay.style.display = this.active ? 'flex' : 'none';
    }

    this.updateVoiceUI();
    this.updateParticipantsList();
  },

  updateParticipantsList(){
    const listEl = document.getElementById('collabParticipantsList');
    if(!listEl) return;
    let html = `
      <div class="collab-user-item self" style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="collab-dot" style="background:${this.userColor}"></span>
          <b>${this.userName} (Siz)</b>
          <span class="mono" style="font-size:9.5px; color:${this.isAdmin ? '#FBBF24' : '#00FF87'};">
            ${this.isAdmin ? '👑 Admin' : 'Talaba'}
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:11px;" title="${this.isMuted ? 'Muted' : 'Unmuted'}">${this.isMuted ? '🔇' : (this.isSpeaking ? '🔊' : '🎙️')}</span>
        </div>
      </div>
    `;

    this.peers.forEach((p, id) => {
      const vol = this.peerVolumes.get(id) !== undefined ? this.peerVolumes.get(id) : 100;
      const isMuted = !!this.peerMutes.get(id);
      html += `
        <div class="collab-user-item" style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="collab-dot" style="background:${p.color}"></span>
            <span>${p.name}</span>
            <span class="mono" style="font-size:9.5px; color:${p.isAdmin ? '#FBBF24' : '#8B97AE'};">
              ${p.isAdmin ? '👑 Admin' : 'Onlayn'}
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="${p.isSpeaking ? 'collab-speaking-icon' : ''}" style="font-size:11px;" title="${p.isSpeaking ? 'Gapirmoqda' : (p.isMuted ? 'Muted' : 'Tinglamoqda')}">
              ${p.isMuted ? '🔇' : (p.isSpeaking ? '🔊' : '🎙️')}
            </span>
            <input type="range" min="0" max="100" value="${vol}" class="collab-vol-slider" title="Ovoz balandligi: ${vol}%" oninput="Multiplayer.setPeerVolume('${id}', this.value)">
            <button class="actbtn" onclick="Multiplayer.togglePeerMute('${id}')" style="padding:1px 5px; font-size:10px;" title="${isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}">
              ${isMuted ? '🔇' : '🔈'}
            </button>
          </div>
        </div>
      `;
    });
    listEl.innerHTML = html;
  }
};

window.Multiplayer = Multiplayer;
