/* ==========================================================================
   CISCO IOS CLI & PC COMMAND PROMPT SIMULATION
   ========================================================================== */

function initDeviceCiscoState(dev){
  if(dev.cisco) return;
  const isRouter = dev.type === 'router';
  const isSwitch = dev.type === 'switch';
  const isCisco = isRouter || isSwitch;

  dev.cisco = {
    isCisco,
    mode: isCisco ? 'user' : 'pc',
    hostname: dev.name.replace(/\s+/g, '_'),
    currInt: isRouter ? 'GigabitEthernet0/0' : 'GigabitEthernet0/1',
    interfaces: {
      'GigabitEthernet0/0': { ip: dev.ip, mask: '255.255.255.0', status: 'up' },
      'GigabitEthernet0/1': { ip: 'unassigned', mask: '', status: 'up' },
      'FastEthernet0/1': { ip: 'unassigned', mask: '', status: 'up' },
      'Vlan1': { ip: isSwitch ? dev.ip : 'unassigned', mask: '255.255.255.0', status: 'up' }
    },
    vlans: [
      { id: 1, name: 'default', ports: ['Gi0/1', 'Gi0/2', 'Gi0/3', 'Gi0/4'] },
      { id: 10, name: 'TALABALAR', ports: ['Gi0/5', 'Gi0/6'] },
      { id: 20, name: 'ADMIN', ports: ['Gi0/7', 'Gi0/8'] }
    ],
    history: [],
    historyIdx: -1
  };
}

let activeCliDevId = null;
const termModal = document.getElementById('ciscoTerminalModal');
const termTitle = document.getElementById('termTitle');
const termDeviceSelect = document.getElementById('termDeviceSelect');
const termScreen = document.getElementById('termScreen');
const termForm = document.getElementById('termForm');
const termPrompt = document.getElementById('termPrompt');
const termInput = document.getElementById('termInput');
const termClose = document.getElementById('termClose');

function printTerm(text, className=""){
  if(!termScreen) return;
  const line = document.createElement('div');
  if(className) line.className = className;
  line.textContent = text;
  termScreen.appendChild(line);
  termScreen.scrollTop = termScreen.scrollHeight;
}

function updateTermPrompt(){
  if(!activeCliDevId || !termPrompt) return;
  const dev = devices.get(activeCliDevId);
  if(!dev) return;
  initDeviceCiscoState(dev);

  if(!dev.cisco.isCisco){
    termPrompt.textContent = dev.type === 'server' ? `root@${dev.cisco.hostname}:~#` : `C:\\Users\\Admin>`;
    return;
  }

  const h = dev.cisco.hostname;
  if(dev.cisco.mode === 'user') termPrompt.textContent = `${h}>`;
  else if(dev.cisco.mode === 'priv') termPrompt.textContent = `${h}#`;
  else if(dev.cisco.mode === 'config') termPrompt.textContent = `${h}(config)#`;
  else if(dev.cisco.mode === 'config-if') termPrompt.textContent = `${h}(config-if)#`;
}

function openCiscoTerminal(devId){
  if(devices.size === 0){
    toast("Avval sahnaga kamida bitta qurilma qo‘shing!");
    return;
  }
  activeCliDevId = devId || selectedDeviceId || [...devices.keys()][0];
  const dev = devices.get(activeCliDevId);
  if(!dev) return;
  initDeviceCiscoState(dev);

  // Populate device dropdown
  if(termDeviceSelect){
    termDeviceSelect.innerHTML = '';
    devices.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.name} (${TYPES[d.type].label})`;
      if(d.id === activeCliDevId) opt.selected = true;
      termDeviceSelect.appendChild(opt);
    });
  }

  if(termTitle){
    termTitle.textContent = dev.cisco.isCisco
      ? `Cisco IOS CLI — ${dev.name} [${TYPES[dev.type].label}]`
      : `Command Prompt — ${dev.name}`;
  }

  if(termScreen){
    termScreen.innerHTML = '';
    if(dev.cisco.isCisco){
      printTerm(`Cisco IOS Software, ${dev.type === 'router' ? '2900' : '2960'} Software (${dev.type === 'router' ? 'C2900-UNIVERSALK9-M' : 'C2960-LANBASEK9-M'}), Version 15.1(4)M4`, 'info');
      printTerm('Technical Support: http://www.cisco.com/techsupport', 'dim');
      printTerm('Copyright (c) 1986-2024 by Cisco Systems, Inc.\n', 'dim');
      printTerm(`Press RETURN to get started! Yordam uchun 'help' yoki '?' yozing.\n`, 'dim');
    } else {
      printTerm(`Microsoft Windows [Version 10.0.19045.3803]`, 'dim');
      printTerm(`(c) Microsoft Corporation. All rights reserved.\n`, 'dim');
      printTerm(`Tarmoq buyruqlari: ping, ipconfig, tracert, ftp, arp -a, help\n`, 'dim');
    }
  }

  updateTermPrompt();
  termModal.classList.add('show');
  setTimeout(()=>{ if(termInput) termInput.focus(); }, 100);
}

function closeCiscoTerminal(){
  termModal.classList.remove('show');
}

if(termClose) termClose.addEventListener('click', closeCiscoTerminal);
if(termDeviceSelect){
  termDeviceSelect.addEventListener('change', ()=>{
    openCiscoTerminal(termDeviceSelect.value);
  });
}

// Quick command buttons
document.querySelectorAll('.tq-btn').forEach(btn => {
  btn.addEventListener('click', ()=>{
    const cmd = btn.dataset.cmd;
    if(termInput){
      termInput.value = cmd;
      termForm.dispatchEvent(new Event('submit'));
    }
  });
});

// Execute terminal command
function executeTerminalCommand(rawCmd){
  const cmd = rawCmd.trim();
  printTerm(`${termPrompt.textContent} ${rawCmd}`, 'bold');
  if(!cmd) return;

  const dev = devices.get(activeCliDevId);
  if(!dev) return;
  initDeviceCiscoState(dev);

  dev.cisco.history.push(cmd);
  dev.cisco.historyIdx = dev.cisco.history.length;

  const parts = cmd.split(/\s+/);
  const c0 = parts[0].toLowerCase();
  const c1 = parts[1] ? parts[1].toLowerCase() : '';

  // Common commands across all modes
  if(c0 === 'clear' || c0 === 'cls'){
    termScreen.innerHTML = '';
    return;
  }

  if(c0 === 'help' || c0 === '?'){
    if(dev.cisco.isCisco){
      printTerm(`=== CISCO IOS BUYRUQLARI (${dev.cisco.mode.toUpperCase()} MODE) ===`, 'info');
      printTerm(`  enable               - Imtiyozli rejimga (Privileged EXEC #) o'tish`);
      printTerm(`  disable              - Foydalanuvchi rejimiga (>) qaytish`);
      printTerm(`  configure terminal   - Global konfiguratsiya rejimiga o'tish (conf t)`);
      printTerm(`  hostname <nom>       - Qurilma nomini o'zgartirish`);
      printTerm(`  interface <int>      - Port konfiguratsiyasiga kirish (masalan: int g0/0)`);
      printTerm(`  ip address <ip> <mask >- Portga IP manzil biriktirish`);
      printTerm(`  no shutdown          - Portni faollashtirish (yoqish)`);
      printTerm(`  show ip int brief    - Barcha portlar holati va IP larini ko'rish`);
      printTerm(`  show mac-address-table- Kommutator MAC manzillar jadvali`);
      printTerm(`  show vlan brief      - VLAN lar ro'yxati`);
      printTerm(`  show ip route        - Marshrutlash jadvali`);
      printTerm(`  show running-config  - Joriy konfiguratsiyani chiqarish`);
      printTerm(`  ping <ip_yoki_nom>   - ICMP paket yuborish (3D animatsiya bilan)`);
      printTerm(`  traceroute <ip>      - Marshrut bo'ylab sakrashlarni kuzatish`);
      printTerm(`  transfer <ip> [fayl] - 3D fayl almashishni boshlash`);
      printTerm(`  exit / end           - Oldingi rejimga qaytish`);
    } else {
      printTerm(`=== TERMINAL BUYRUQLARI ===`, 'info');
      printTerm(`  ping <ip_yoki_nom>   - ICMP Echo so'rov yuborish`);
      printTerm(`  ipconfig [/all]      - Tarmoq kartasi IP va MAC manzili`);
      printTerm(`  tracert <ip>         - Marshrut bo'ylab sakrashlarni aniqlash`);
      printTerm(`  ftp <ip>             - Fayl almashish (FTP) simulyatsiyasi`);
      printTerm(`  arp -a               - ARP kesh jadvalini ko'rish`);
      printTerm(`  cls                  - Ekranni tozalash`);
    }
    return;
  }

  // CISCO MODE HANDLERS
  if(dev.cisco.isCisco){
    // 1. User EXEC Mode
    if(dev.cisco.mode === 'user'){
      if(c0 === 'enable' || c0 === 'en'){
        dev.cisco.mode = 'priv';
        updateTermPrompt();
        return;
      }
    }

    // 2. Privileged EXEC Mode
    if(dev.cisco.mode === 'priv'){
      if(c0 === 'disable'){
        dev.cisco.mode = 'user';
        updateTermPrompt();
        return;
      }
      if(c0 === 'configure' || (c0 === 'conf' && c1 === 't') || (c0 === 'configure' && c1 === 'terminal')){
        dev.cisco.mode = 'config';
        printTerm('Enter configuration commands, one per line. End with CNTL/Z or exit.', 'dim');
        updateTermPrompt();
        return;
      }
    }

    // 3. Global Config Mode
    if(dev.cisco.mode === 'config'){
      if(c0 === 'exit' || c0 === 'end'){
        dev.cisco.mode = 'priv';
        updateTermPrompt();
        return;
      }
      if(c0 === 'hostname' && parts[1]){
        const newName = parts[1];
        dev.cisco.hostname = newName;
        dev.name = newName;
        dev.label.querySelector('.nm').textContent = newName;
        if(selectedDeviceId === dev.id){
          const pName = document.getElementById('pName');
          const pNameInput = document.getElementById('pNameInput');
          if(pName) pName.textContent = newName;
          if(pNameInput) pNameInput.value = newName;
        }
        termTitle.textContent = `Cisco IOS CLI — ${dev.name} [${TYPES[dev.type].label}]`;
        updateTermPrompt();
        printTerm(`% Hostname changed to ${newName}`);
        return;
      }
      if((c0 === 'interface' || c0 === 'int') && parts[1]){
        dev.cisco.mode = 'config-if';
        dev.cisco.currInt = parts[1];
        if(!dev.cisco.interfaces[dev.cisco.currInt]){
          dev.cisco.interfaces[dev.cisco.currInt] = { ip: 'unassigned', mask: '', status: 'down' };
        }
        updateTermPrompt();
        return;
      }
      if(c0 === 'vlan' && parts[1]){
        const vlanId = parseInt(parts[1]);
        if(!isNaN(vlanId)){
          printTerm(`VLAN ${vlanId} yaratildi / tahrirlanmoqda`);
        }
        return;
      }
    }

    // 4. Interface Config Mode
    if(dev.cisco.mode === 'config-if'){
      if(c0 === 'exit'){
        dev.cisco.mode = 'config';
        updateTermPrompt();
        return;
      }
      if(c0 === 'end'){
        dev.cisco.mode = 'priv';
        updateTermPrompt();
        return;
      }
      if(c0 === 'ip' && c1 === 'address' && parts[2]){
        const newIp = parts[2];
        const newMask = parts[3] || '255.255.255.0';
        dev.cisco.interfaces[dev.cisco.currInt] = { ip: newIp, mask: newMask, status: 'up' };
        dev.ip = newIp;
        dev.label.querySelector('.ip').textContent = newIp;
        const pIpInput = document.getElementById('pIpInput');
        if(selectedDeviceId === dev.id && pIpInput) pIpInput.value = newIp;
        printTerm(`% Interface ${dev.cisco.currInt} IP: ${newIp} ${newMask}`);
        return;
      }
      if(c0 === 'no' && c1 === 'shutdown'){
        dev.cisco.interfaces[dev.cisco.currInt].status = 'up';
        printTerm(`%LINK-5-CHANGED: Interface ${dev.cisco.currInt}, changed state to up`, 'info');
        printTerm(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${dev.cisco.currInt}, changed state to up`, 'info');
        return;
      }
      if(c0 === 'shutdown'){
        dev.cisco.interfaces[dev.cisco.currInt].status = 'down';
        printTerm(`%LINK-5-CHANGED: Interface ${dev.cisco.currInt}, changed state to administratively down`, 'warn');
        return;
      }
    }

    // Show commands
    if(cmd.startsWith('sh ip int') || cmd === 'show ip interface brief'){
      printTerm('Interface              IP-Address      OK? Method Status                Protocol');
      Object.entries(dev.cisco.interfaces).forEach(([intName, data])=>{
        const ipStr = data.ip.padEnd(16);
        const statusStr = (data.status === 'up' ? 'up' : 'down').padEnd(22);
        printTerm(`${intName.padEnd(23)}${ipStr}YES manual ${statusStr}${data.status}`);
      });
      return;
    }

    if(cmd.startsWith('sh mac') || cmd === 'show mac-address-table'){
      printTerm('          Mac Address Table');
      printTerm('-------------------------------------------');
      printTerm('Vlan    Mac Address       Type        Ports');
      printTerm('----    -----------       --------    -----');
      let count = 0;
      connections.forEach(c => {
        if(c.a === dev.id || c.b === dev.id){
          const other = devices.get(c.a === dev.id ? c.b : c.a);
          if(other){
            count++;
            printTerm(`   1    ${other.mac} DYNAMIC     Gi0/${count}`);
          }
        }
      });
      printTerm(`Total Mac Addresses for this criterion: ${count}\n`);
      return;
    }

    if(cmd.startsWith('sh vlan') || cmd === 'show vlan brief'){
      printTerm('VLAN Name                             Status    Ports');
      printTerm('---- -------------------------------- --------- -------------------------------');
      dev.cisco.vlans.forEach(v => {
        printTerm(`${String(v.id).padEnd(5)}${v.name.padEnd(33)}active    ${v.ports.join(', ')}`);
      });
      return;
    }

    if(cmd.startsWith('sh ip ro') || cmd === 'show ip route'){
      printTerm('Codes: L - local, C - connected, S - static, R - RIP, O - OSPF\n');
      printTerm(`Gateway of last resort is not set\n`);
      printTerm(`C    192.168.1.0/24 is directly connected, GigabitEthernet0/0`);
      printTerm(`L    ${dev.ip}/32 is directly connected, GigabitEthernet0/0`);
      return;
    }

    if(cmd.startsWith('sh run') || cmd === 'show running-config'){
      printTerm('Building configuration...\n\nCurrent configuration : 1842 bytes\n!');
      printTerm(`version 15.1\nservice timestamps log datetime msec\n!`);
      printTerm(`hostname ${dev.cisco.hostname}\n!`);
      printTerm(`ip routing\n!`);
      Object.entries(dev.cisco.interfaces).forEach(([iName, data])=>{
        printTerm(`interface ${iName}`);
        if(data.ip !== 'unassigned') printTerm(` ip address ${data.ip} ${data.mask}`);
        else printTerm(` no ip address`);
        if(data.status === 'down') printTerm(` shutdown`);
        printTerm('!');
      });
      printTerm('end\n');
      return;
    }
  }

  // PC / Non-Cisco Command Handlers
  if(!dev.cisco.isCisco){
    if(c0 === 'ipconfig'){
      printTerm('\nWindows IP Configuration\n');
      printTerm(`Ethernet adapter Ethernet 1:`);
      printTerm(`   Connection-specific DNS Suffix  . : lan`);
      printTerm(`   Link-local IPv6 Address . . . . . : fe80::8d21:4a12:99bf:12a4%12`);
      printTerm(`   IPv4 Address. . . . . . . . . . . : ${dev.ip}`);
      printTerm(`   Subnet Mask . . . . . . . . . . . : 255.255.255.0`);
      printTerm(`   Default Gateway . . . . . . . . . : 192.168.1.1`);
      if(cmd.includes('/all')){
        printTerm(`   Physical Address. . . . . . . . . : ${dev.mac}`);
        printTerm(`   DHCP Enabled. . . . . . . . . . . : Yes`);
        printTerm(`   DNS Servers . . . . . . . . . . . : 192.168.1.1, 8.8.8.8`);
      }
      printTerm('');
      return;
    }

    if(c0 === 'arp' && parts[1] === '-a'){
      printTerm(`\nInterface: ${dev.ip} --- 0x12`);
      printTerm(`  Internet Address      Physical Address      Type`);
      devices.forEach(d => {
        if(d.id !== dev.id){
          printTerm(`  ${d.ip.padEnd(22)}${d.mac}     dynamic`);
        }
      });
      printTerm('');
      return;
    }

    if(c0 === 'netstat'){
      printTerm('\nActive Connections\n');
      printTerm('  Proto  Local Address          Foreign Address        State');
      printTerm(`  TCP    ${dev.ip}:49670        192.168.1.1:80         ESTABLISHED`);
      printTerm(`  TCP    ${dev.ip}:49671        192.168.1.5:21         TIME_WAIT\n`);
      return;
    }
  }

  // PING SIMULATION (Both Cisco & PC)
  if(c0 === 'ping' && parts[1]){
    const targetQuery = parts[1];
    let targetDev = null;
    devices.forEach(d => {
      if(d.ip === targetQuery || d.name.toLowerCase() === targetQuery.toLowerCase()) targetDev = d;
    });

    if(!targetDev){
      printTerm(`Ping so'rovi: ${targetQuery} topilmadi. IP yoki qurilma nomini to'g'ri kiriting.`, 'err');
      return;
    }

    if(dev.cisco.isCisco){
      printTerm(`\nType escape sequence to abort.`);
      printTerm(`Sending 5, 100-byte ICMP Echos to ${targetDev.ip}, timeout is 2 seconds:`);
    } else {
      printTerm(`\nPinging ${targetDev.ip} with 32 bytes of data:`);
    }

    startPacketTransfer({
      srcId: dev.id,
      dstId: targetDev.id,
      type: 'icmp',
      fileName: 'ICMP Echo',
      fileSize: '64 bytes',
      onComplete: (success) => {
        if(success){
          if(dev.cisco.isCisco){
            printTerm('!!!!!', 'bold');
            printTerm('Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms\n', 'info');
          } else {
            for(let p = 1; p <= 4; p++){
              printTerm(`Reply from ${targetDev.ip}: bytes=32 time=2ms TTL=64`);
            }
            printTerm(`\nPing statistics for ${targetDev.ip}:`);
            printTerm(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`);
            printTerm(`Approximate round trip times in milli-seconds:`);
            printTerm(`    Minimum = 1ms, Maximum = 2ms, Average = 1ms\n`);
          }
        } else {
          if(dev.cisco.isCisco){
            printTerm('U.U.U', 'err');
            printTerm('Success rate is 0 percent (0/5) (Destination Host Unreachable)\n', 'err');
          } else {
            for(let p = 1; p <= 4; p++) printTerm(`Destination host unreachable.`, 'err');
            printTerm(`\nPackets: Sent = 4, Received = 0, Lost = 4 (100% loss)\n`, 'err');
          }
        }
      }
    });
    return;
  }

  // TRACEROUTE (Both Cisco & PC)
  if((c0 === 'traceroute' || c0 === 'tracert') && parts[1]){
    const targetQuery = parts[1];
    let targetDev = null;
    devices.forEach(d => {
      if(d.ip === targetQuery || d.name.toLowerCase() === targetQuery.toLowerCase()) targetDev = d;
    });
    if(!targetDev){
      printTerm(`Traceroute: ${targetQuery} topilmadi.`, 'err');
      return;
    }

    const path = findNetworkPath(dev.id, targetDev.id);
    if(!path){
      printTerm(`Tracing route to ${targetDev.ip} [${targetDev.name}]: Aloqa topilmadi.`, 'err');
      return;
    }

    printTerm(`\nTracing the route to ${targetDev.name} (${targetDev.ip}) over a maximum of 30 hops:`);
    for(let i = 1; i < path.length; i++){
      const hopDev = devices.get(path[i]);
      printTerm(`  ${i}   ${i * 2} ms   ${i * 2 - 1} ms   ${i * 2} ms  ${hopDev.ip} [${hopDev.name}]`);
    }
    printTerm('Trace complete.\n', 'info');

    startPacketTransfer({
      srcId: dev.id,
      dstId: targetDev.id,
      type: 'icmp',
      fileName: 'Traceroute Probe',
      fileSize: '48 bytes'
    });
    return;
  }

  // FTP / TRANSFER SIMULATION
  if((c0 === 'ftp' || c0 === 'transfer') && parts[1]){
    const targetQuery = parts[1];
    const fileArg = parts[2] || 'darslik.pdf';
    let targetDev = null;
    devices.forEach(d => {
      if(d.ip === targetQuery || d.name.toLowerCase() === targetQuery.toLowerCase()) targetDev = d;
    });
    if(!targetDev){
      printTerm(`FTP: ${targetQuery} topilmadi.`, 'err');
      return;
    }

    printTerm(`\nConnected to ${targetDev.ip} (${targetDev.name}).`);
    printTerm(`220 Cisco FTP / File Server ready.`);
    printTerm(`200 PORT command successful.`);
    printTerm(`150 Opening BINARY mode data connection for ${fileArg} (4.2 MB)...`, 'dim');

    startPacketTransfer({
      srcId: dev.id,
      dstId: targetDev.id,
      type: 'ftp',
      fileName: fileArg,
      fileSize: '4.2 MB',
      onComplete: (success)=>{
        if(success){
          printTerm(`226 Transfer complete. 4,404,019 bytes transferred in 0.82 secs (5.37 MB/s).\n`, 'info');
        } else {
          printTerm(`425 Can't open data connection: Target unreachable.\n`, 'err');
        }
      }
    });
    return;
  }

  // Unknown command
  printTerm(`% Noma'lum buyruq: "${cmd}". Yordam uchun 'help' yoki '?' yozing.`, 'err');
}

if(termForm){
  termForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!termInput) return;
    const val = termInput.value;
    termInput.value = '';
    executeTerminalCommand(val);
  });
}

// Arrow Up / Down command history
if(termInput){
  termInput.addEventListener('keydown', (e)=>{
    if(!activeCliDevId) return;
    const dev = devices.get(activeCliDevId);
    if(!dev || !dev.cisco || !dev.cisco.history.length) return;

    if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(dev.cisco.historyIdx > 0) dev.cisco.historyIdx--;
      termInput.value = dev.cisco.history[dev.cisco.historyIdx] || '';
    } else if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(dev.cisco.historyIdx < dev.cisco.history.length - 1){
        dev.cisco.historyIdx++;
        termInput.value = dev.cisco.history[dev.cisco.historyIdx] || '';
      } else {
        dev.cisco.historyIdx = dev.cisco.history.length;
        termInput.value = '';
      }
    }
  });
}
