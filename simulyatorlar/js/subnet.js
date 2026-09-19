/* ==========================================================================
   IP SUBNET & VLSM CALCULATOR MODULE
   ========================================================================== */
(function(){
  "use strict";

  const ipInput = document.getElementById('calcIp');
  const cidrInput = document.getElementById('calcCidr');
  const presets = document.querySelectorAll('.preset-pill');

  function calculateSubnet() {
    if (!ipInput || !cidrInput) return;
    const ipStr = ipInput.value.trim();
    let cidr = parseInt(cidrInput.value, 10);
    if (isNaN(cidr) || cidr < 1) cidr = 24;
    if (cidr > 32) cidr = 32;

    const parts = ipStr.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      const el = document.getElementById('resNet');
      if (el) el.textContent = "Noto‘g‘ri IP format";
      return;
    }

    const ipInt = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const wildInt = (~maskInt) >>> 0;
    const bcastInt = (netInt | wildInt) >>> 0;

    const intToIp = (num) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');

    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, Math.pow(2, 32 - cidr) - 2);
    const firstHost = cidr >= 31 ? intToIp(netInt) : intToIp(netInt + 1);
    const lastHost = cidr >= 31 ? intToIp(bcastInt) : intToIp(bcastInt - 1);

    const rNet = document.getElementById('resNet');
    const rMask = document.getElementById('resMask');
    const rWild = document.getElementById('resWild');
    const rRange = document.getElementById('resRange');
    const rHosts = document.getElementById('resHosts');
    const rBcast = document.getElementById('resBcast');
    const rBinary = document.getElementById('resBinary');

    if (rNet) rNet.textContent = `${intToIp(netInt)} /${cidr}`;
    if (rMask) rMask.textContent = intToIp(maskInt);
    if (rWild) rWild.textContent = intToIp(wildInt);
    if (rRange) rRange.textContent = `${firstHost} – ${lastHost}`;
    if (rHosts) rHosts.textContent = `${usableHosts.toLocaleString()} ta`;
    if (rBcast) rBcast.textContent = intToIp(bcastInt);

    if (rBinary) {
      const binaryMask = (maskInt >>> 0).toString(2).padStart(32, '0').match(/.{1,8}/g).join('.');
      rBinary.textContent = binaryMask;
    }
  }

  if (ipInput && cidrInput) {
    ipInput.addEventListener('input', calculateSubnet);
    cidrInput.addEventListener('input', calculateSubnet);
  }

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      if (cidrInput) {
        cidrInput.value = btn.dataset.cidr;
        calculateSubnet();
      }
    });
  });

  calculateSubnet();
})();
