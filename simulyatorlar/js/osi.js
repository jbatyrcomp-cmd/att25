/* ==========================================================================
   OSI 7-LAYER INTERACTIVE MODEL MODULE
   ========================================================================== */
(function(){
  "use strict";

  const OSI_DATA = {
    7: {
      name: "Application (Amaliy)",
      pdu: "Ma'lumotlar (Data)",
      protocols: "HTTP/3, HTTPS, DNS, DHCP, SSH, FTP, SMTP",
      devices: "Gateway, Next-Gen Firewall, Web Server",
      desc: "Foydalanuvçi dasturlari va tarmoq xizmatlari örtasidagi töğridan-töğri interfeys. Brauzer va ilovalar sörovlari aynan şu qatlamda şakllanadi."
    },
    6: {
      name: "Presentation (Taqdimot)",
      pdu: "Formatlangan Ma'lumot",
      protocols: "TLS 1.3, SSL, JPEG, ASCII, GZIP",
      devices: "OS Kriptografik Modullari, Proxy",
      desc: "Ma'lumotlarni şifrlaş (encryption), siqiş (compression) va sintaksisini formatlaş vazifasini bajaradi."
    },
    5: {
      name: "Session (Seans)",
      pdu: "Sinxronlaş Seansi",
      protocols: "NetBIOS, RPC, PPTP, Sockets",
      devices: "Dasturiy soketlar, Operatsion tizim",
      desc: "Ikkita tugun örtasidagi ulaniş seansini örnatadi, boşqaradi va yakunlaydi."
    },
    4: {
      name: "Transport (Transport)",
      pdu: "Segment (TCP) / Datagram (UDP)",
      protocols: "TCP, UDP, QUIC, SCTP",
      devices: "L4 Switch, Stateful Firewall",
      desc: "Portlar orqali ma'lumotlarni işonçli (TCP) yoki tezkor (UDP) yetkazib beriş, oqimni nazorat qiliş (Flow Control)."
    },
    3: {
      name: "Network (Tarmoq)",
      pdu: "Paket (Packet)",
      protocols: "IPv4, IPv6, ICMP, OSPF, BGP, ARP",
      devices: "Router (Yöriqnoma), L3 Switch",
      desc: "Mantiqiy IP manzillaş va paketlarni manbadan manzilga marşrutlaş (routing) böyiça global yölni tanlaydi."
    },
    2: {
      name: "Data Link (Kanal)",
      pdu: "Kadr (Frame)",
      protocols: "Ethernet (802.3), Wi-Fi (802.11), PPP, VLAN (802.1Q)",
      devices: "Switch (Kommutator), Bridge, NIC",
      desc: "Jismoniy MAC manzillar orqali bir xil lokal segment içida kadrlar almaşinuvi va xatoliklarni tekşiriş (CRC)."
    },
    1: {
      name: "Physical (Jismoniy)",
      pdu: "Bitlar (0 va 1 signallari)",
      protocols: "1000BASE-T, Optik tola (Single/Multi Mode), Radio",
      devices: "Optik payvandlagiç, Patch panel, Kabel, Repeater",
      desc: "Elektr, yoruğlik yoki radio signallarni jismoniy vositalar (mis kabel, optik tola, efir) orqali uzatiş."
    }
  };

  const osiRows = document.querySelectorAll('.osi-layer-row');
  const osiBox = document.getElementById('osiInfoBox');

  osiRows.forEach(row => {
    row.addEventListener('click', () => {
      osiRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const l = row.dataset.layer;
      const d = OSI_DATA[l];
      if (d && osiBox) {
        osiBox.innerHTML = `
          <div style="font-size:16px; font-weight:800; color:#FFF; font-family:var(--font-editorial);">Qatlam ${l}: ${d.name}</div>
          <div style="margin-top:8px;"><b>PDU Birligi:</b> ${d.pdu}</div>
          <div><b>Protokollar:</b> ${d.protocols}</div>
          <div><b>Qurilmalar:</b> ${d.devices}</div>
          <div style="margin-top:10px; color:var(--text-light); line-height:1.6;">${d.desc}</div>
        `;
      }
    });
  });
})();
