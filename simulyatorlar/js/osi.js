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
      desc: "Foydalanuvchi dasturlari va tarmoq xizmatlari o‘rtasidagi to‘g‘ridan-to‘g‘ri interfeys. Brauzer va ilovalar so‘rovlari aynan shu qatlamda shakllanadi."
    },
    6: {
      name: "Presentation (Taqdimot)",
      pdu: "Formatlangan Ma'lumot",
      protocols: "TLS 1.3, SSL, JPEG, ASCII, GZIP",
      devices: "OS Kriptografik Modullari, Proxy",
      desc: "Ma'lumotlarni shifrlash (encryption), siqish (compression) va sintaksisini formatlash vazifasini bajaradi."
    },
    5: {
      name: "Session (Seans)",
      pdu: "Sinxronlash Seansi",
      protocols: "NetBIOS, RPC, PPTP, Sockets",
      devices: "Dasturiy soketlar, Operatsion tizim",
      desc: "Ikkita tugun o‘rtasidagi ulanish seansini o‘rnatadi, boshqaradi va yakunlaydi."
    },
    4: {
      name: "Transport (Transport)",
      pdu: "Segment (TCP) / Datagram (UDP)",
      protocols: "TCP, UDP, QUIC, SCTP",
      devices: "L4 Switch, Stateful Firewall",
      desc: "Portlar orqali ma'lumotlarni ishonchli (TCP) yoki tezkor (UDP) yetkazib berish, oqimni nazorat qilish (Flow Control)."
    },
    3: {
      name: "Network (Tarmoq)",
      pdu: "Paket (Packet)",
      protocols: "IPv4, IPv6, ICMP, OSPF, BGP, ARP",
      devices: "Router (Yo‘riqnoma), L3 Switch",
      desc: "Mantiqiy IP manzillash va paketlarni manbadan manzilga marshrutlash (routing) bo‘yicha global yo‘lni tanlaydi."
    },
    2: {
      name: "Data Link (Kanal)",
      pdu: "Kadr (Frame)",
      protocols: "Ethernet (802.3), Wi-Fi (802.11), PPP, VLAN (802.1Q)",
      devices: "Switch (Kommutator), Bridge, NIC",
      desc: "Jismoniy MAC manzillar orqali bir xil lokal segment ichida kadrlar almashinuvi va xatoliklarni tekshirish (CRC)."
    },
    1: {
      name: "Physical (Jismoniy)",
      pdu: "Bitlar (0 va 1 signallari)",
      protocols: "1000BASE-T, Optik tola (Single/Multi Mode), Radio",
      devices: "Optik payvandlagich, Patch panel, Kabel, Repeater",
      desc: "Elektr, yorug‘lik yoki radio signallarni jismoniy vositalar (mis kabel, optik tola, efir) orqali uzatish."
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
