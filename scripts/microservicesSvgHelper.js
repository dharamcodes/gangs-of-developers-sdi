 

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function detectIcon(node, isFlow) {
  if (node.icon) return node.icon;
  const text = `${node.title || ''} ${node.tag || ''} ${(node.lines || []).join(' ')} ${node.stereotype || ''}`.toLowerCase();
  
  if (text.includes('client') || text.includes('ios') || text.includes('android') || text.includes('mobile') || text.includes('browser') || text.includes('react') || text.includes('native') || text.includes('app')) {
    return (text.includes('mobile') || text.includes('ios') || text.includes('android')) ? 'mobile' : 'laptop';
  }
  if (text.includes('gateway') || text.includes('ingress') || text.includes('load balancer') || text.includes('envoy') || text.includes('kong') || text.includes('router') || text.includes('proxy') || text.includes('ambassador')) {
    return 'gateway';
  }
  if (text.includes('database') || text.includes(' db') || text.includes('postgres') || text.includes('mysql') || text.includes('shard') || text.includes('rdbms') || text.includes('sql') || text.includes('nosql') || text.includes('storage') || text.includes('cdc')) {
    return 'database';
  }
  if (text.includes('cache') || text.includes('redis') || text.includes('memcached')) {
    return 'cache';
  }
  if (text.includes('kafka') || text.includes('queue') || text.includes('stream') || text.includes('topic') || text.includes('broker') || text.includes('event bus') || text.includes('dlq')) {
    return 'queue';
  }
  if (text.includes('lock') || text.includes('redlock') || text.includes('zookeeper')) {
    return 'lock';
  }
  if (text.includes('circuit') || text.includes('breaker') || text.includes('shield') || text.includes('auth') || text.includes('jwt') || text.includes('security') || text.includes('rate limit')) {
    return 'shield';
  }
  if (text.includes('dns') || text.includes('discovery') || text.includes('registry') || text.includes('consul') || text.includes('eureka')) {
    return 'dns';
  }
  return isFlow ? 'step' : 'server';
}

function renderSvgIcon(type, x, y, color) {
  switch (type) {
    case 'mobile':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="0" width="13" height="21" rx="2.5" fill="none" stroke="${color}" stroke-width="1.6"/>
          <line x1="4" y1="3" x2="9" y2="3" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="6.5" cy="17.5" r="1.1" fill="${color}"/>
        </g>`;
    case 'laptop':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="0" width="18" height="12" rx="1.8" fill="none" stroke="${color}" stroke-width="1.6"/>
          <line x1="0" y1="15" x2="20" y2="15" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="3.5" cy="3" r="0.7" fill="${color}"/>
          <circle cx="6" cy="3" r="0.7" fill="${color}"/>
          <circle cx="8.5" cy="3" r="0.7" fill="${color}"/>
        </g>`;
    case 'gateway':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="1" width="18" height="16" rx="2.5" fill="none" stroke="${color}" stroke-width="1.6"/>
          <path d="M 3 9 L 9 5 L 15 9 M 9 5 L 9 13" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="3" cy="9" r="1" fill="${color}"/>
          <circle cx="15" cy="9" r="1" fill="${color}"/>
          <circle cx="9" cy="13" r="1" fill="${color}"/>
        </g>`;
    case 'database':
      return `
        <g transform="translate(${x}, ${y})">
          <ellipse cx="9" cy="3.5" rx="8" ry="2.8" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 1 3.5 v 5.5 a 8 2.8 0 0 0 16 0 v -5.5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 1 9 v 5.5 a 8 2.8 0 0 0 16 0 v -5.5" fill="none" stroke="${color}" stroke-width="1.5"/>
        </g>`;
    case 'cache':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="1" width="18" height="16" rx="2.5" fill="none" stroke="${color}" stroke-width="1.6"/>
          <path d="M 10 3 L 5 9.5 L 9 9.5 L 8 15 L 13 8.5 L 9.5 8.5 Z" fill="${color}"/>
        </g>`;
    case 'queue':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="3" width="20" height="13" rx="2.5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <line x1="5.5" y1="3" x2="5.5" y2="16" stroke="${color}" stroke-width="1.1"/>
          <line x1="10" y1="3" x2="10" y2="16" stroke="${color}" stroke-width="1.1"/>
          <line x1="14.5" y1="3" x2="14.5" y2="16" stroke="${color}" stroke-width="1.1"/>
          <circle cx="2.8" cy="9.5" r="1" fill="${color}"/>
          <circle cx="17.2" cy="9.5" r="1" fill="${color}"/>
        </g>`;
    case 'shield':
      return `
        <g transform="translate(${x}, ${y})">
          <path d="M 9 1 L 16 3.5 v 5 c 0 5 -7 8 -7 8 s -7 -3 -7 -8 v -5 Z" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 6 8.5 L 8 10.5 L 12 6.5" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
        </g>`;
    case 'lock':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="7" width="15" height="11" rx="2" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 4.5 7 V 4 a 4 4 0 0 1 8 0 V 7" fill="none" stroke="${color}" stroke-width="1.5"/>
          <circle cx="8.5" cy="12.5" r="1.3" fill="${color}"/>
        </g>`;
    case 'dns':
      return `
        <g transform="translate(${x}, ${y})">
          <circle cx="9" cy="9" r="8" fill="none" stroke="${color}" stroke-width="1.5"/>
          <ellipse cx="9" cy="9" rx="3.5" ry="8" fill="none" stroke="${color}" stroke-width="1.2"/>
          <line x1="1" y1="9" x2="17" y2="9" stroke="${color}" stroke-width="1.2"/>
        </g>`;
    case 'server':
    default:
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="0" width="19" height="18" rx="2" fill="none" stroke="${color}" stroke-width="1.6"/>
          <line x1="0" y1="9" x2="19" y2="9" stroke="${color}" stroke-width="1.1"/>
          <circle cx="3.5" cy="4.5" r="1.2" fill="#10b981"/>
          <line x1="7" y1="4.5" x2="15.5" y2="4.5" stroke="${color}" stroke-width="1.1" stroke-linecap="round"/>
          <circle cx="3.5" cy="13.5" r="1.2" fill="#10b981"/>
          <line x1="7" y1="13.5" x2="15.5" y2="13.5" stroke="${color}" stroke-width="1.1" stroke-linecap="round"/>
        </g>`;
  }
}

function generateSvgDiagram(width, height, title, subtitle, accentColor, categoryTag, nodes, connections, isFlow = false) {
  // Generate Tier background boundaries if nodes form identifiable architectural zones
  let tiersMarkup = '';
  if (!isFlow && nodes.length >= 3) {
    const minX = Math.min(...nodes.map(n => n.x));
    
    // Check if there is a client tier (nodes with x < 300)
    const clientNodes = nodes.filter(n => n.x < 300 && (n.title.toLowerCase().includes('client') || n.title.toLowerCase().includes('monolith')));
    if (clientNodes.length > 0) {
      const cMaxX = Math.max(...clientNodes.map(n => n.x + n.w));
      const cMinY = Math.min(...clientNodes.map(n => n.y)) - 18;
      const cMaxY = Math.max(...clientNodes.map(n => n.y + n.h)) + 16;
      tiersMarkup += `
        <g class="tier-group">
          <rect x="${minX - 16}" y="${cMinY}" width="${cMaxX - minX + 32}" height="${cMaxY - cMinY}" rx="12" class="tier-bg" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="5,4" />
          <rect x="${minX - 4}" y="${cMinY - 10}" width="96" height="18" rx="9" fill="#0284c7" opacity="0.14" />
          <text x="${minX + 44}" y="${cMinY + 3}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="850" fill="#0284c7" letter-spacing="0.05em">CLIENT TIER</text>
        </g>
      `;
    }

    // Check if there is an edge / gateway tier (nodes between 300 and 650)
    const gatewayNodes = nodes.filter(n => n.x >= 300 && n.x < 650 && (n.title.toLowerCase().includes('gateway') || n.title.toLowerCase().includes('ingress') || n.title.toLowerCase().includes('proxy') || n.title.toLowerCase().includes('distributed')));
    if (gatewayNodes.length > 0) {
      const gMinX = Math.min(...gatewayNodes.map(n => n.x)) - 14;
      const gMaxX = Math.max(...gatewayNodes.map(n => n.x + n.w)) + 14;
      const gMinY = Math.min(...gatewayNodes.map(n => n.y)) - 18;
      const gMaxY = Math.max(...gatewayNodes.map(n => n.y + n.h)) + 16;
      tiersMarkup += `
        <g class="tier-group">
          <rect x="${gMinX}" y="${gMinY}" width="${gMaxX - gMinX}" height="${gMaxY - gMinY}" rx="12" class="tier-bg" stroke="${accentColor}" stroke-width="1.2" stroke-dasharray="5,4" />
          <rect x="${gMinX + 12}" y="${gMinY - 10}" width="112" height="18" rx="9" fill="${accentColor}" opacity="0.14" />
          <text x="${gMinX + 68}" y="${gMinY + 3}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="850" fill="${accentColor}" letter-spacing="0.05em">EDGE &amp; ROUTING</text>
        </g>
      `;
    }

    // Check if there are downstream services (nodes with x >= 650)
    const backendNodes = nodes.filter(n => n.x >= 650);
    if (backendNodes.length > 0) {
      const bMinX = Math.min(...backendNodes.map(n => n.x)) - 14;
      const bMaxX = Math.max(...backendNodes.map(n => n.x + n.w)) + 14;
      const bMinY = Math.min(...backendNodes.map(n => n.y)) - 18;
      const bMaxY = Math.max(...backendNodes.map(n => n.y + n.h)) + 16;
      tiersMarkup += `
        <g class="tier-group">
          <rect x="${bMinX}" y="${bMinY}" width="${bMaxX - bMinX}" height="${bMaxY - bMinY}" rx="12" class="tier-bg" stroke="#10b981" stroke-width="1.2" stroke-dasharray="5,4" />
          <rect x="${bMinX + 12}" y="${bMinY - 10}" width="128" height="18" rx="9" fill="#10b981" opacity="0.14" />
          <text x="${bMinX + 76}" y="${bMinY + 3}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="850" fill="#10b981" letter-spacing="0.05em">SERVICES &amp; DATA TIER</text>
        </g>
      `;
    }
  }

  let nodesMarkup = '';
  nodes.forEach((n, idx) => {
    const strokeCol = n.stroke || accentColor;
    const isStep = isFlow && n.step;
    const iconType = detectIcon(n, isFlow);
    const headerHeight = 34;

    nodesMarkup += `
      <g id="node-${idx}" class="node-card">
        <!-- Main Card Container with Soft Shadow and Rounded Corners -->
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" class="card-bg" stroke="${strokeCol}" stroke-width="1.8" />
        
        <!-- Distinct Header Strip -->
        <path d="M ${n.x + 1} ${n.y + 1} L ${n.x + n.w - 1} ${n.y + 1} A 9 9 0 0 1 ${n.x + n.w} ${n.y + 10} L ${n.x + n.w} ${n.y + headerHeight} L ${n.x} ${n.y + headerHeight} L ${n.x} ${n.y + 10} A 9 9 0 0 1 ${n.x + 1} ${n.y + 1} Z" fill="${strokeCol}" opacity="0.12" />
        <line x1="${n.x}" y1="${n.y + headerHeight}" x2="${n.x + n.w}" y2="${n.y + headerHeight}" stroke="${strokeCol}" stroke-width="1.2" opacity="0.3" />
        
        ${isStep ? `
          <!-- Numbered Step Circle Badge -->
          <circle cx="${n.x + 22}" cy="${n.y + 17}" r="11" fill="${strokeCol}" />
          <text x="${n.x + 22}" y="${n.y + 21}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="900" fill="#ffffff">${esc(n.step)}</text>
          <text x="${n.x + 40}" y="${n.y + 22}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12.5" font-weight="800" fill="${strokeCol}">${esc(n.title)}</text>
        ` : `
          <!-- Component Icon & Title -->
          ${renderSvgIcon(iconType, n.x + 12, n.y + 7.5, strokeCol)}
          <text x="${n.x + 38}" y="${n.y + 22}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="800" fill="${strokeCol}">${esc(n.title)}</text>
        `}

        <!-- Component Tag Badge on Top Right of Card -->
        ${n.tag ? `
          <rect x="${n.x + n.w - 78}" y="${n.y + 8}" width="70" height="18" rx="9" fill="${strokeCol}" opacity="0.18" />
          <text x="${n.x + n.w - 43}" y="${n.y + 20.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="800" fill="${strokeCol}">${esc(n.tag)}</text>
        ` : ''}

        <!-- Technical Description Lines / Subsystems -->
        ${(n.lines || []).map((line, lIdx) => `
          <text x="${n.align === 'left' ? n.x + 14 : n.x + n.w / 2}" y="${n.y + 54 + lIdx * 19}" text-anchor="${n.align === 'left' ? 'start' : 'middle'}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="10.5" class="text-muted">${esc(line)}</text>
        `).join('')}
      </g>
    `;
  });

  let connsMarkup = '';
  connections.forEach((c, idx) => {
    const strokeStyle = c.dashed ? 'arrow-dash' : 'arrow-line';
    const strokeCol = c.stroke || accentColor;

    // Check if label contains a step number like "1.", "2.", "3."
    const stepMatch = (c.label || '').match(/^(\d+)[\.\s:]*(.*)$/);
    const stepNum = stepMatch ? stepMatch[1] : (c.step ? String(c.step) : null);
    const stepText = stepMatch ? stepMatch[2].trim() : (c.label || '');

    const pillWidth = c.lw || (stepNum ? 82 : 56);

    connsMarkup += `
      <g id="conn-${idx}">
        <path d="${c.d}" class="${strokeStyle}" stroke="${strokeCol}" marker-end="url(#arrow)" />
        ${c.label ? `
          ${stepNum ? `
            <!-- Flow Step Pill with Number Badge -->
            <rect x="${c.lx - pillWidth / 2}" y="${c.ly - 11}" width="${pillWidth}" height="22" rx="11" class="pill-bg" stroke="${strokeCol}" stroke-width="1.3" />
            <circle cx="${c.lx - pillWidth / 2 + 11}" cy="${c.ly}" r="8" fill="${strokeCol}" />
            <text x="${c.lx - pillWidth / 2 + 11}" y="${c.ly + 3.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="900" fill="#ffffff">${esc(stepNum)}</text>
            <text x="${c.lx + 6}" y="${c.ly + 3.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="750" fill="${strokeCol}">${esc(stepText || c.label)}</text>
          ` : `
            <!-- Standard Label Pill -->
            <rect x="${c.lx - pillWidth / 2}" y="${c.ly - 10}" width="${pillWidth}" height="20" rx="6" class="pill-bg" stroke="${strokeCol}" stroke-width="1.2" />
            <text x="${c.lx}" y="${c.ly + 3.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="750" fill="${strokeCol}">${esc(c.label)}</text>
          `}
        ` : ''}
      </g>
    `;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .bg { fill: #f8fafc; }
      .grid-dot { fill: #e2e8f0; }
      .header-bg { fill: #0b1120; }
      .header-title { fill: #ffffff; }
      .header-sub { fill: #94a3b8; }
      .card-bg { fill: #ffffff; }
      .text-muted { fill: #475569; }
      .arrow-line { stroke: #64748b; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .arrow-dash { stroke: #94a3b8; stroke-width: 2; stroke-dasharray: 5,4; fill: none; stroke-linecap: round; }
      .arrow-head { fill: #64748b; }
      .pill-bg { fill: #ffffff; }
      .tier-bg { fill: rgba(241, 245, 249, 0.45); }

      @media (prefers-color-scheme: dark) {
        .bg { fill: #070b14; }
        .grid-dot { fill: #1e293b; }
        .header-bg { fill: #030712; }
        .card-bg { fill: #0f172a; }
        .text-muted { fill: #94a3b8; }
        .arrow-line { stroke: #94a3b8; }
        .arrow-dash { stroke: #64748b; }
        .arrow-head { fill: #94a3b8; }
        .pill-bg { fill: #0f172a; }
        .tier-bg { fill: rgba(15, 23, 42, 0.35); }
      }
    </style>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.15" class="grid-dot" />
    </pattern>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" class="arrow-head" />
    </marker>
  </defs>

  <!-- Clean Canvas Background with Dot Matrix Grid -->
  <rect width="${width}" height="${height}" class="bg" />
  <rect width="${width}" height="${height}" fill="url(#grid)" />

  <!-- Architectural Banner Header -->
  <rect x="0" y="0" width="${width}" height="64" class="header-bg" />
  <rect x="0" y="62" width="${width}" height="2.5" fill="url(#headerGrad)" />
  <text x="28" y="28" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14.5" font-weight="900" class="header-title" letter-spacing="0.04em">${esc(title.toUpperCase())}</text>
  <text x="28" y="48" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600" class="header-sub">${esc(subtitle)}</text>
  <rect x="${width - 180}" y="18" width="152" height="26" rx="13" fill="${accentColor}" opacity="0.18" stroke="${accentColor}" stroke-width="1" />
  <text x="${width - 104}" y="35" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="${accentColor}">${esc(categoryTag)}</text>

  <!-- Tier Boundaries -->
  ${tiersMarkup}

  <!-- Connections and Numbered Step Flow Pipes -->
  ${connsMarkup}

  <!-- Node Cards -->
  ${nodesMarkup}
</svg>`;
}

module.exports = {
  esc,
  detectIcon,
  generateSvgDiagram
};
