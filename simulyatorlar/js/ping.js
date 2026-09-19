/* ==========================================================================
   LIVE ICMP PING TERMINAL EMULATOR
   ========================================================================== */
(function(){
  "use strict";

  const pingBtn = document.getElementById('startPingBtn');
  const pingInput = document.getElementById('pingTarget');
  const pingCount = document.getElementById('pingCount');
  const terminal = document.getElementById('pingTerminalScreen');

  if (pingBtn && pingInput && terminal) {
    pingBtn.addEventListener('click', () => {
      const host = pingInput.value.trim() || '192.168.1.1';
      const maxPackets = parseInt(pingCount.value, 10) || 4;

      pingBtn.disabled = true;
      pingBtn.style.opacity = '0.6';

      terminal.innerHTML = `
        <div class="terminal-line system">PING ${host} (${host}) 56(84) bayt ma'lumot jo‘natilmoqda...</div>
      `;

      let seq = 1;
      const times = [];

      const interval = setInterval(() => {
        if (seq > maxPackets) {
          clearInterval(interval);
          const min = Math.min(...times).toFixed(1);
          const max = Math.max(...times).toFixed(1);
          const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);

          terminal.innerHTML += `
            <div class="terminal-line system" style="margin-top:8px;">--- ${host} ping statistikasi ---</div>
            <div class="terminal-line system">${maxPackets} paket yuborildi, ${maxPackets} qabul qilindi, 0.0% paket yo‘qolishi</div>
            <div class="terminal-line success">rtt min/avg/max = ${min}/${avg}/${max} ms</div>
          `;
          terminal.scrollTop = terminal.scrollHeight;
          pingBtn.disabled = false;
          pingBtn.style.opacity = '1';
          return;
        }

        let latency = 2.0;
        if (host.includes('192.168') || host.includes('10.') || host.includes('localhost')) {
          latency = +(0.3 + Math.random() * 0.8).toFixed(2);
        } else {
          latency = +(3.2 + Math.random() * 4.5).toFixed(1);
        }
        times.push(latency);

        const ttl = host.includes('192.168') ? 64 : 56;
        terminal.innerHTML += `<div class="terminal-line success">64 bayt ${host} dan: icmp_seq=${seq} ttl=${ttl} vaqt=${latency} ms</div>`;
        terminal.scrollTop = terminal.scrollHeight;
        seq++;
      }, 450);
    });
  }
})();
