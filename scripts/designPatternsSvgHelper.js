 

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function detectUmlIcon(node, isFlow) {
  if (node.icon) return node.icon;
  const text = `${node.title || ''} ${node.tag || ''} ${(node.lines || []).join(' ')} ${node.stereotype || ''}`.toLowerCase();

  if (text.includes('client') || text.includes('caller') || text.includes('app') || text.includes('main')) {
    return 'client';
  }
  if (text.includes('interface')) {
    return 'interface';
  }
  if (text.includes('abstract') || text.includes('creator') || text.includes('handler')) {
    return 'abstract';
  }
  if (text.includes('singleton')) {
    return 'lock';
  }
  if (text.includes('factory') || text.includes('builder')) {
    return 'factory';
  }
  if (text.includes('strategy') || text.includes('command') || text.includes('state')) {
    return 'strategy';
  }
  if (text.includes('observer') || text.includes('listener') || text.includes('subscriber') || text.includes('subject')) {
    return 'broadcast';
  }
  if (text.includes('adapter') || text.includes('bridge') || text.includes('facade') || text.includes('proxy')) {
    return 'plug';
  }
  if (text.includes('database') || text.includes('repository') || text.includes('memento')) {
    return 'database';
  }
  return isFlow ? 'step' : 'class';
}

function renderUmlIcon(type, x, y, color) {
  switch (type) {
    case 'client':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="0" width="18" height="12" rx="1.8" fill="none" stroke="${color}" stroke-width="1.6"/>
          <line x1="0" y1="15" x2="20" y2="15" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="3.5" cy="3" r="0.7" fill="${color}"/>
          <circle cx="6" cy="3" r="0.7" fill="${color}"/>
          <circle cx="8.5" cy="3" r="0.7" fill="${color}"/>
        </g>`;
    case 'interface':
      return `
        <g transform="translate(${x}, ${y})">
          <circle cx="9" cy="9" r="6.5" fill="none" stroke="${color}" stroke-width="1.6"/>
          <circle cx="9" cy="9" r="2.5" fill="${color}"/>
        </g>`;
    case 'abstract':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="1" width="16" height="16" rx="2" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="5" y1="5" x2="13" y2="13" stroke="${color}" stroke-width="1.3"/>
          <line x1="13" y1="5" x2="5" y2="13" stroke="${color}" stroke-width="1.3"/>
        </g>`;
    case 'lock':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="7" width="15" height="11" rx="2" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 4.5 7 V 4 a 4 4 0 0 1 8 0 V 7" fill="none" stroke="${color}" stroke-width="1.5"/>
          <circle cx="8.5" cy="12.5" r="1.3" fill="${color}"/>
        </g>`;
    case 'factory':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="1" y="1" width="16" height="16" rx="2.5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <circle cx="9" cy="9" r="3.5" fill="none" stroke="${color}" stroke-width="1.3"/>
          <line x1="9" y1="2" x2="9" y2="5" stroke="${color}" stroke-width="1.3"/>
          <line x1="9" y1="13" x2="9" y2="16" stroke="${color}" stroke-width="1.3"/>
          <line x1="2" y1="9" x2="5" y2="9" stroke="${color}" stroke-width="1.3"/>
          <line x1="13" y1="9" x2="16" y2="9" stroke="${color}" stroke-width="1.3"/>
        </g>`;
    case 'strategy':
      return `
        <g transform="translate(${x}, ${y})">
          <circle cx="9" cy="9" r="7" fill="none" stroke="${color}" stroke-width="1.5"/>
          <circle cx="9" cy="9" r="3" fill="none" stroke="${color}" stroke-width="1.3"/>
          <circle cx="9" cy="9" r="1.2" fill="${color}"/>
        </g>`;
    case 'broadcast':
      return `
        <g transform="translate(${x}, ${y})">
          <circle cx="9" cy="13" r="2" fill="${color}"/>
          <path d="M 5 9 a 5.5 5.5 0 0 1 8 0" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 2 5 a 9.5 9.5 0 0 1 14 0" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
        </g>`;
    case 'plug':
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="3" y="5" width="12" height="10" rx="2" fill="none" stroke="${color}" stroke-width="1.5"/>
          <line x1="6" y1="1" x2="6" y2="5" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="12" y1="1" x2="12" y2="5" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
        </g>`;
    case 'database':
      return `
        <g transform="translate(${x}, ${y})">
          <ellipse cx="9" cy="3.5" rx="8" ry="2.8" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 1 3.5 v 5.5 a 8 2.8 0 0 0 16 0 v -5.5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <path d="M 1 9 v 5.5 a 8 2.8 0 0 0 16 0 v -5.5" fill="none" stroke="${color}" stroke-width="1.5"/>
        </g>`;
    case 'class':
    default:
      return `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="0" width="18" height="18" rx="2" fill="none" stroke="${color}" stroke-width="1.6"/>
          <line x1="0" y1="6" x2="18" y2="6" stroke="${color}" stroke-width="1.2"/>
          <line x1="0" y1="12" x2="18" y2="12" stroke="${color}" stroke-width="1.2"/>
        </g>`;
  }
}

/**
 * Generates a valid XML SVG for UML Class Architecture or Sequence Flow diagrams.
 * Automatically adapts to light and dark theme mode.
 */
function generateUmlDiagram(width, height, title, subtitle, accentColor, categoryTag, nodes, connections, isFlow = false) {
  let nodesMarkup = '';
  nodes.forEach((n, idx) => {
    const strokeCol = n.stroke || accentColor;
    const isStep = isFlow && n.step;
    const iconType = detectUmlIcon(n, isFlow);
    const headerHeight = n.stereotype ? 40 : 34;

    nodesMarkup += `
      <g id="node-${idx}" class="node-card">
        <!-- Main UML Class Card Container with Rounded Corners -->
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" class="card-bg" stroke="${strokeCol}" stroke-width="1.8" />
        
        <!-- Header Compartment -->
        <path d="M ${n.x + 1} ${n.y + 1} L ${n.x + n.w - 1} ${n.y + 1} A 9 9 0 0 1 ${n.x + n.w} ${n.y + 10} L ${n.x + n.w} ${n.y + headerHeight} L ${n.x} ${n.y + headerHeight} L ${n.x} ${n.y + 10} A 9 9 0 0 1 ${n.x + 1} ${n.y + 1} Z" fill="${strokeCol}" opacity="0.12" />
        <line x1="${n.x}" y1="${n.y + headerHeight}" x2="${n.x + n.w}" y2="${n.y + headerHeight}" stroke="${strokeCol}" stroke-width="1.2" opacity="0.3" />
        
        ${isStep ? `
          <!-- Numbered Sequence Step Badge -->
          <circle cx="${n.x + 22}" cy="${n.y + 17}" r="11" fill="${strokeCol}" />
          <text x="${n.x + 22}" y="${n.y + 21}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="900" fill="#ffffff">${esc(n.step)}</text>
          <text x="${n.x + 42}" y="${n.y + 22}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12.5" font-weight="800" fill="${strokeCol}">${esc(n.title)}</text>
        ` : `
          <!-- UML Stereotype and Class Title with Component Icon -->
          ${renderUmlIcon(iconType, n.x + 12, n.y + (n.stereotype ? 11 : 7.5), strokeCol)}
          
          ${n.stereotype ? `
            <text x="${n.x + 36}" y="${n.y + 16}" font-family="ui-monospace, monospace" font-size="9" font-weight="700" fill="${strokeCol}" letter-spacing="0.04em">&lt;&lt;${esc(n.stereotype)}&gt;&gt;</text>
            <text x="${n.x + 36}" y="${n.y + 31}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="800" fill="${strokeCol}">${esc(n.title)}</text>
          ` : `
            <text x="${n.x + 36}" y="${n.y + 22}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12.5" font-weight="800" fill="${strokeCol}">${esc(n.title)}</text>
          `}
        `}

        <!-- Component Tag Badge on Top Right of Card -->
        ${n.tag ? `
          <rect x="${n.x + n.w - 82}" y="${n.y + 8}" width="74" height="18" rx="9" fill="${strokeCol}" opacity="0.18" />
          <text x="${n.x + n.w - 45}" y="${n.y + 20.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="800" fill="${strokeCol}">${esc(n.tag)}</text>
        ` : ''}

        <!-- UML Methods & Attributes Section -->
        ${(n.lines || []).map((line, lIdx) => `
          <text x="${n.align === 'left' ? n.x + 14 : n.x + n.w / 2}" y="${n.y + headerHeight + 20 + lIdx * 19}" text-anchor="${n.align === 'left' ? 'start' : 'middle'}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="10.5" class="text-muted">${esc(line)}</text>
        `).join('')}
      </g>
    `;
  });

  let connsMarkup = '';
  connections.forEach((c, idx) => {
    const strokeStyle = c.dashed ? 'arrow-dash' : 'arrow-line';
    const strokeCol = c.stroke || accentColor;

    // Detect UML arrow markers: realization vs generalization vs association
    const isRealization = c.dashed && (c.type === 'realize' || c.label?.includes('implements'));
    const isInherit = !c.dashed && (c.type === 'inherit' || c.label?.includes('extends'));
    const marker = isRealization ? 'url(#uml-realize)' : (isInherit ? 'url(#uml-inherit)' : 'url(#arrow)');

    // Parse step number if label begins with a number (e.g., "1. create()", "2. execute()")
    const stepMatch = (c.label || '').match(/^(\d+)[\.\s:]*(.*)$/);
    const stepNum = stepMatch ? stepMatch[1] : (c.step ? String(c.step) : null);
    const stepText = stepMatch ? stepMatch[2].trim() : (c.label || '');

    const pillWidth = c.lw || (stepNum ? 86 : 60);

    connsMarkup += `
      <g id="conn-${idx}">
        <path d="${c.d}" class="${strokeStyle}" stroke="${strokeCol}" marker-end="${marker}" />
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
      }
    </style>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.15" class="grid-dot" />
    </pattern>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" class="arrow-head" />
    </marker>
    <!-- Hollow White Triangle Marker for UML Realization / Implementation -->
    <marker id="uml-realize" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <polygon points="1,1 11,6 1,11" fill="#ffffff" stroke="${accentColor}" stroke-width="1.8" />
    </marker>
    <!-- Hollow White Triangle Marker for UML Generalization / Inheritance -->
    <marker id="uml-inherit" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <polygon points="1,1 11,6 1,11" fill="#ffffff" stroke="${accentColor}" stroke-width="1.8" />
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
  <rect x="${width - 190}" y="18" width="162" height="26" rx="13" fill="${accentColor}" opacity="0.18" stroke="${accentColor}" stroke-width="1" />
  <text x="${width - 109}" y="35" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="${accentColor}">${esc(categoryTag)}</text>

  <!-- Connections and Numbered Method Invocations -->
  ${connsMarkup}

  <!-- UML Class Nodes -->
  ${nodesMarkup}
</svg>`;
}

module.exports = {
  esc,
  detectUmlIcon,
  generateUmlDiagram
};
