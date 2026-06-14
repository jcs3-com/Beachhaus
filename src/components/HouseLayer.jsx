// =============================================================
// HouseLayer — the cartoon facade of 769, second layer of the
// diorama. Sits directly in front of SkyBackdrop; reads ONLY
// { timeOfDay, weather.condition } from WorldState.
//
// Matte / SimCity styling: subtle wall + roof shading gradients,
// muted palette, a soft ground shadow, eave shadows for depth.
//
// Responsive by geometry, not media queries: the SVG contain-fits
// the viewport and paints bleed (sand, dunes, driveway, paver path)
// outside its viewBox, so portrait phones get extended ground and
// sky while desktop gets fit-to-screen.
//
// Reactivity v1: window/lamp glow at dusk+night, scene dimming by
// timeOfDay and weather condition. Stable IDs on every element.
// =============================================================

const GLASS = { day: "#D6EAF6", glow: "#FFDF94" };

const TIME_FILTER = {
  dawn: "brightness(0.9) saturate(0.95)",
  morning: "none",
  midday: "none",
  afternoon: "none",
  dusk: "brightness(0.78) saturate(0.9)",
  night: "brightness(0.5) saturate(0.65)",
};

const CONDITION_FILTER = {
  clear: "",
  clouds: "brightness(0.95)",
  fog: "brightness(0.95) saturate(0.8)",
  rain: "brightness(0.85)",
  snow: "",
  thunderstorm: "brightness(0.7)",
};

export function HouseLayer({ worldState }) {
  const t = worldState?.timeOfDay ?? "midday";
  const c = worldState?.weather?.condition ?? "clear";
  const lightsOn = t === "dusk" || t === "night";
  const filter = `${TIME_FILTER[t] ?? "none"} ${CONDITION_FILTER[c] ?? ""}`.trim();

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ filter, transition: "filter 3000ms ease" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        style={{
          overflow: "visible",
          "--glass": lightsOn ? GLASS.glow : GLASS.day,
          "--lamp-glow": lightsOn ? 1 : 0,
        }}
      >
<defs>
    <linearGradient id="wallGrad" gradientUnits="userSpaceOnUse" x1="0" y1="170" x2="0" y2="640">
      <stop offset="0" stopColor="#A7BBDD"/>
      <stop offset="1" stopColor="#8AA0C6"/>
    </linearGradient>
    <linearGradient id="gableGrad" gradientUnits="userSpaceOnUse" x1="0" y1="170" x2="0" y2="400">
      <stop offset="0" stopColor="#B0C2E2"/>
      <stop offset="1" stopColor="#97ADD2"/>
    </linearGradient>
    <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C3B49B"/>
      <stop offset="1" stopColor="#A1907A"/>
    </linearGradient>
    <linearGradient id="sandGrad" gradientUnits="userSpaceOnUse" x1="0" y1="650" x2="0" y2="1100">
      <stop offset="0" stopColor="#E9DABA"/>
      <stop offset="1" stopColor="#DFCDA4"/>
    </linearGradient>
    <radialGradient id="lampGlow">
      <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.85"/>
      <stop offset="1" stopColor="#FFE9A8" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="groundShadow">
      <stop offset="0" stopColor="#7A6A4F" stopOpacity="0.28"/>
      <stop offset="0.7" stopColor="#7A6A4F" stopOpacity="0.12"/>
      <stop offset="1" stopColor="#7A6A4F" stopOpacity="0"/>
    </radialGradient>
    <pattern id="scallop" width="22" height="14" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="1" r="9.5" fill="#F6F2E9"/>
    </pattern>
    <pattern id="lattice" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="18" height="18" fill="#AFC2E6"/>
      <path d="M-4,22 L22,-4 M-4,4 L4,-4 M14,22 L22,14" stroke="#FFFFFF" strokeWidth="3.5"/>
      <path d="M-4,-4 L22,22 M14,-4 L22,4 M-4,14 L4,22" stroke="#FFFFFF" strokeWidth="3.5"/>
    </pattern>
    {/* reusable shuttered window */}
    <g id="winShuttered">
      <rect x="-14" y="-6" width="28" height="92" rx="6" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3"/>
      <path d="M-9,14 h18 M-9,32 h18 M-9,50 h18 M-9,68 h18" stroke="#C7D2EA" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <g id="fanwin">
      <rect x="0" y="0" width="38" height="24" rx="5" fill="var(--glass)" stroke="#C2CBDC" strokeWidth="2"/>
      <path d="M8,20 A11,11 0 0 1 30,20" fill="none" stroke="#FFFFFF" strokeWidth="2.5"/>
      <path d="M19,20 L19,6 M19,20 L10,10 M19,20 L28,10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
  </defs>


  {/* ============ BACKDROP TREES ============ */}
  <g id="trees-back" stroke="#6E8A62" strokeWidth="4">
    <ellipse cx="120" cy="360" rx="120" ry="150" fill="#9BB58E"/>
    <ellipse cx="55" cy="250" rx="80" ry="110" fill="#8AA77C"/>
    <ellipse cx="1140" cy="380" rx="105" ry="135" fill="#9BB58E"/>
  </g>

  {/* ============ HOUSE ============ */}
  <g id="house" strokeLinejoin="round">

    {/* chimney (behind center gable) */}
    <g id="chimney">
      <rect x="552" y="152" width="38" height="110" fill="#A7B9DA" stroke="#697B9C" strokeWidth="4"/>
      <rect x="545" y="138" width="52" height="18" rx="5" fill="#F6F2E9" stroke="#697B9C" strokeWidth="4"/>
    </g>

    {/* ===== LEFT WING (two-story, porch) ===== */}
    <g id="wing-left">
      <polygon points="170,366 295,232 420,366" fill="url(#gableGrad)" stroke="#697B9C" strokeWidth="4"/>
      <rect x="170" y="362" width="250" height="278" fill="url(#wallGrad)" stroke="#697B9C" strokeWidth="4"/>
      <g id="siding-left" stroke="#7F95BE" strokeWidth="2.5">
        <path d="M176,420 h238 M176,450 h238 M176,480 h238 M176,540 h238"/>
      </g>
      <rect id="scallop-band-left" x="176" y="372" width="238" height="8" fill="#F6F2E9"/>
      <rect x="176" y="380" width="238" height="13" fill="url(#scallop)"/>
      <g id="vent-left">
        <polygon points="295,272 308,277 313,290 308,303 295,308 282,303 277,290 282,277" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3"/>
        <path d="M285,286 h20 M285,294 h20" stroke="#A8B6D4" strokeWidth="2.5"/>
      </g>
      <g id="window-left-upper">
        <use href="#winShuttered" x="241" y="412"/>
        <use href="#winShuttered" x="349" y="412"/>
        <rect x="258" y="408" width="74" height="96" rx="7" fill="var(--glass)" stroke="#FFFFFF" strokeWidth="7"/>
        <rect x="258" y="408" width="74" height="96" rx="7" fill="none" stroke="#697B9C" strokeWidth="3"/>
        <path d="M295,408 v96 M258,456 h74" stroke="#FFFFFF" strokeWidth="5"/>
      </g>
      <g id="porch-rail" stroke="#697B9C" strokeWidth="3">
        <path d="M186,590 v44 M212,590 v44 M238,590 v44 M264,590 v44 M290,590 v44 M316,590 v44 M342,590 v44 M368,590 v44 M394,590 v44" stroke="#FFFFFF" strokeWidth="8"/>
        <rect x="176" y="580" width="240" height="11" rx="5" fill="#F6F2E9"/>
        <rect x="176" y="628" width="240" height="10" rx="5" fill="#F6F2E9"/>
      </g>
    </g>

    {/* ===== CENTER ENTRY GABLE ===== */}
    <g id="gable-center">
      <polygon points="425,350 522,184 620,350" fill="url(#gableGrad)" stroke="#697B9C" strokeWidth="4"/>
      <rect x="425" y="346" width="195" height="294" fill="url(#wallGrad)" stroke="#697B9C" strokeWidth="4"/>
      <g id="siding-center" stroke="#7F95BE" strokeWidth="2.5">
        <path d="M431,400 h183 M431,430 h183 M431,490 h183 M431,520 h183"/>
      </g>
      <rect id="scallop-band-center" x="431" y="356" width="183" height="8" fill="#F6F2E9"/>
      <rect x="431" y="364" width="183" height="13" fill="url(#scallop)"/>
      <g id="vent-center">
        <polygon points="522,228 534,233 539,245 534,257 522,262 510,257 505,245 510,233" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3"/>
        <path d="M513,242 h18 M513,249 h18" stroke="#A8B6D4" strokeWidth="2.5"/>
      </g>
      <g id="window-center-upper">
        <use href="#winShuttered" x="476" y="392"/>
        <use href="#winShuttered" x="568" y="392"/>
        <rect x="490" y="388" width="64" height="92" rx="7" fill="var(--glass)" stroke="#FFFFFF" strokeWidth="7"/>
        <rect x="490" y="388" width="64" height="92" rx="7" fill="none" stroke="#697B9C" strokeWidth="3"/>
        <path d="M522,388 v92 M490,434 h64" stroke="#FFFFFF" strokeWidth="5"/>
      </g>
      <g id="door">
        <rect x="452" y="534" width="12" height="104" fill="var(--glass)" stroke="#FFFFFF" strokeWidth="4"/>
        <rect x="470" y="528" width="62" height="110" rx="7" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3.5"/>
        <ellipse cx="501" cy="568" rx="17" ry="27" fill="var(--glass)" stroke="#A8B6D4" strokeWidth="3"/>
        <path d="M501,548 q-8,10 0,20 q8,10 0,20" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="525" cy="588" r="3.5" fill="#E8B84A"/>
      </g>
      <g id="house-number">
        <rect x="540" y="540" width="40" height="22" rx="5" fill="#F6F2E9" stroke="#697B9C" strokeWidth="2.5"/>
        <text x="560" y="557" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#697B9C">769</text>
      </g>
      <g id="window-porthole">
        <polygon points="585,576 597,581 602,593 597,605 585,610 573,605 568,593 573,581" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3"/>
        <circle cx="585" cy="593" r="10" fill="var(--glass)"/>
      </g>
    </g>

    {/* ===== RIGHT WING (garage) ===== */}
    <g id="wing-right">
      <polygon points="620,382 840,216 1060,382" fill="url(#gableGrad)" stroke="#697B9C" strokeWidth="4"/>
      <rect x="620" y="378" width="440" height="262" fill="url(#wallGrad)" stroke="#697B9C" strokeWidth="4"/>
      <g id="siding-right" stroke="#7F95BE" strokeWidth="2.5">
        <path d="M626,418 h428 M626,448 h428 M626,478 h428 M626,508 h428"/>
      </g>
      <rect id="scallop-band-right" x="626" y="390" width="428" height="8" fill="#F6F2E9"/>
      <rect x="626" y="398" width="428" height="13" fill="url(#scallop)"/>
      <g id="vent-right">
        <polygon points="840,262 855,268 861,283 855,298 840,304 825,298 819,283 825,268" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3"/>
        <path d="M829,279 h22 M829,288 h22" stroke="#A8B6D4" strokeWidth="2.5"/>
      </g>
      <g id="window-right-upper">
        <use href="#winShuttered" x="765" y="424"/>
        <use href="#winShuttered" x="915" y="424"/>
        <rect x="782" y="420" width="116" height="100" rx="8" fill="var(--glass)" stroke="#FFFFFF" strokeWidth="8"/>
        <rect x="782" y="420" width="116" height="100" rx="8" fill="none" stroke="#697B9C" strokeWidth="3"/>
        <path d="M840,420 v100 M782,470 h116" stroke="#FFFFFF" strokeWidth="5"/>
      </g>
      <rect id="foundation" x="622" y="626" width="436" height="14" fill="#C5CBD8"/>
      <g id="garage-door">
        <rect x="665" y="546" width="350" height="92" rx="10" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3.5"/>
        <use href="#fanwin" x="678" y="554"/>
        <use href="#fanwin" x="734" y="554"/>
        <use href="#fanwin" x="790" y="554"/>
        <use href="#fanwin" x="846" y="554"/>
        <use href="#fanwin" x="902" y="554"/>
        <use href="#fanwin" x="958" y="554"/>
        <g stroke="#E1E6F0" strokeWidth="3">
          <path d="M672,590 h336 M672,614 h336"/>
          <path d="M722,586 v48 M778,586 v48 M834,586 v48 M890,586 v48 M946,586 v48"/>
        </g>
      </g>
      <g id="lamp-glow" style={{ opacity: 'var(--lamp-glow, 0)', transition: 'opacity 3s' }}>
        <circle cx="644" cy="564" r="34" fill="url(#lampGlow)"/>
        <circle cx="1038" cy="564" r="34" fill="url(#lampGlow)"/>
      </g>
      <g id="lamps">
        <g transform="translate(644,552)">
          <rect x="-8" y="0" width="16" height="22" rx="3" fill="#FFE9A8" stroke="#5A6580" strokeWidth="3"/>
          <path d="M-9,0 L0,-9 L9,0 Z" fill="#5A6580"/>
        </g>
        <g transform="translate(1038,552)">
          <rect x="-8" y="0" width="16" height="22" rx="3" fill="#FFE9A8" stroke="#5A6580" strokeWidth="3"/>
          <path d="M-9,0 L0,-9 L9,0 Z" fill="#5A6580"/>
        </g>
      </g>
    </g>

    <g id="eave-shadows" fill="#3D4763" opacity="0.10">
      <rect x="176" y="393" width="238" height="9"/>
      <rect x="431" y="377" width="183" height="9"/>
      <rect x="626" y="411" width="428" height="9"/>
    </g>
    {/* ===== ROOF BARS (drawn over wall joints) ===== */}
    <g id="roofs" fill="none" strokeLinecap="round">
      <path id="roof-left" d="M150,380 L295,228 L440,380" stroke="url(#roofGrad)" strokeWidth="28"/>
      <path d="M150,380 L295,228 L440,380" stroke="#C9BBA4" strokeWidth="12"/>
      <path id="roof-center" d="M406,362 L522,180 L638,362" stroke="url(#roofGrad)" strokeWidth="26"/>
      <path d="M406,362 L522,180 L638,362" stroke="#C9BBA4" strokeWidth="11"/>
      <path id="roof-right" d="M598,394 L840,212 L1082,394" stroke="url(#roofGrad)" strokeWidth="30"/>
      <path d="M598,394 L840,212 L1082,394" stroke="#C9BBA4" strokeWidth="13"/>
    </g>

    {/* ===== PORCH DECK + STEPS ===== */}
    <g id="porch-steps" stroke="#A9854F" strokeWidth="3">
      <rect id="deck" x="168" y="636" width="470" height="16" rx="6" fill="#C9A570"/>
      <rect x="178" y="652" width="240" height="34" fill="url(#lattice)" stroke="#697B9C" strokeWidth="3"/>
      <rect x="448" y="652" width="120" height="15" rx="6" fill="#C9A570"/>
      <rect x="436" y="667" width="144" height="15" rx="6" fill="#C9A570"/>
      <rect x="424" y="682" width="168" height="15" rx="6" fill="#C9A570"/>
    </g>
  </g>

  {/* ============ FOLIAGE (foreground) ============ */}
  <g id="crape-myrtle" strokeWidth="3">
    <path d="M250,640 q-6,-60 -28,-92 M250,640 q4,-66 30,-100 M250,640 q-2,-50 -52,-72" fill="none" stroke="#7A5A3E" strokeWidth="7" strokeLinecap="round"/>
    <g fill="#8AA77C" stroke="#6E8A62">
      <circle cx="190" cy="560" r="34"/><circle cx="310" cy="545" r="36"/><circle cx="250" cy="585" r="40"/>
    </g>
    <g fill="#D38AA4" stroke="#B26C84">
      <circle cx="222" cy="500" r="36"/><circle cx="285" cy="478" r="40"/><circle cx="180" cy="525" r="28"/>
      <circle cx="330" cy="512" r="30"/><circle cx="255" cy="535" r="34"/>
    </g>
    <g fill="#E6B9C8">
      <circle cx="240" cy="490" r="9"/><circle cx="300" cy="465" r="9"/><circle cx="195" cy="515" r="7"/>
      <circle cx="270" cy="525" r="8"/><circle cx="330" cy="500" r="7"/>
    </g>
  </g>
  <g id="bush-right">
    <circle cx="1085" cy="600" r="44" fill="#9BB58E" stroke="#6E8A62" strokeWidth="3"/>
    <circle cx="1135" cy="618" r="36" fill="#8AA77C" stroke="#6E8A62" strokeWidth="3"/>
    <circle cx="1072" cy="582" r="6" fill="#F6F2E9"/><circle cx="1100" cy="600" r="6" fill="#F6F2E9"/>
    <circle cx="1130" cy="606" r="6" fill="#E6B9C8"/><circle cx="1090" cy="622" r="6" fill="#F6F2E9"/>
  </g>

  {/* ============ SAND ============ */}
  <g id="sand">
    <path d="M-2200,662 Q-2000,644 -1800,658 T-1400,656 T-1000,658 T-600,656 T-200,658 T200,656 T600,660 T1000,658 T1400,660 T1800,656 T2200,658 T2600,656 L3400,656 L3400,2200 L-2200,2200 Z" fill="url(#sandGrad)"/>
    <path d="M-2200,718 Q-1950,698 -1700,712 T-1200,710 T-700,712 T-200,710 T300,714 T800,710 T1300,712 T1800,710 T2300,712 L3400,710 L3400,2200 L-2200,2200 Z" fill="#DFCDA4"/>
    <ellipse id="ground-shadow" cx="600" cy="660" rx="520" ry="46" fill="url(#groundShadow)"/>
    <g id="driveway">
      <path d="M662,636 L1018,636 L1110,1060 Q890,1085 560,1060 Z" fill="#CFD6E2"/>
      <g fill="#B7C0D2">
        <circle cx="730" cy="690" r="4"/><circle cx="850" cy="668" r="4"/><circle cx="960" cy="700" r="4"/>
        <circle cx="790" cy="760" r="4"/><circle cx="920" cy="790" r="4"/><circle cx="700" cy="830" r="4"/>
        <circle cx="860" cy="880" r="4"/><circle cx="990" cy="860" r="4"/><circle cx="760" cy="950" r="4"/>
        <circle cx="900" cy="990" r="4"/><circle cx="1020" cy="960" r="4"/><circle cx="660" cy="1010" r="4"/>
      </g>
    </g>
    <g id="paver-path" fill="#E3CFA6" stroke="#CBB183" strokeWidth="3">
      <rect x="452" y="712" width="116" height="36" rx="10"/>
      <rect x="440" y="758" width="116" height="36" rx="10"/>
      <rect x="456" y="804" width="116" height="36" rx="10"/>
      <rect x="444" y="850" width="116" height="36" rx="10"/>
      <rect x="458" y="896" width="116" height="36" rx="10"/>
      <rect x="446" y="942" width="116" height="36" rx="10"/>
      <rect x="458" y="988" width="116" height="36" rx="10"/>
    </g>    <g id="sand-speckles" fill="#CFBD8E">
      <circle cx="140" cy="710" r="3.5"/><circle cx="330" cy="736" r="3"/><circle cx="488" cy="716" r="3.5"/>
      <circle cx="640" cy="752" r="3"/><circle cx="760" cy="708" r="3.5"/><circle cx="905" cy="740" r="3"/>
      <circle cx="1050" cy="770" r="3.5"/><circle cx="220" cy="770" r="3"/><circle cx="580" cy="780" r="3"/>
      <circle cx="990" cy="700" r="3"/>
      <circle cx="-220" cy="730" r="3.5"/><circle cx="-90" cy="690" r="3"/><circle cx="1320" cy="720" r="3.5"/><circle cx="1430" cy="760" r="3"/>
      <circle cx="160" cy="880" r="3.5"/><circle cx="340" cy="960" r="3"/><circle cx="620" cy="900" r="3"/><circle cx="240" cy="1060" r="3.5"/>
      <circle cx="760" cy="1080" r="3"/><circle cx="1060" cy="1120" r="3.5"/><circle cx="420" cy="1140" r="3"/><circle cx="90" cy="990" r="3"/>
      <circle cx="1240" cy="980" r="3"/><circle cx="-140" cy="900" r="3"/>
    </g>
    <g id="beach-grass" fill="none" stroke="#AEBE86" strokeWidth="5" strokeLinecap="round">
      <path d="M70,716 q-6,-34 -20,-48 M70,716 q2,-38 14,-52 M70,716 q-14,-22 -34,-28"/>
      <path d="M1168,700 q-4,-32 -18,-44 M1168,700 q4,-34 16,-46"/>
    </g>
    <g id="starfish" transform="translate(955,728) rotate(-14)" fill="#F59E6B" stroke="#D97B43" strokeWidth="3" strokeLinejoin="round">
      <path d="M0,-24 L7,-7 L25,-6 L11,5 L16,23 L0,13 L-16,23 L-11,5 L-25,-6 L-7,-7 Z"/>
      <circle cx="0" cy="0" r="3" fill="#D97B43" stroke="none"/>
    </g>
    <g id="pail" transform="translate(386,712)">
      <path d="M-20,-26 L20,-26 L14,14 L-14,14 Z" fill="#D38AA4" stroke="#B26C84" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M-17,-26 a17,12 0 0 1 34,0" fill="none" stroke="#B26C84" strokeWidth="3.5"/>
      <path d="M22,8 q16,-26 4,-44" fill="none" stroke="#5FC3D8" strokeWidth="6" strokeLinecap="round"/>
      <path d="M20,-38 l14,-6 l2,12 l-13,3 Z" fill="#5FC3D8" stroke="#3D9DB3" strokeWidth="3"/>
    </g>
    <g id="beach-ball" transform="translate(1108,742)">
      <circle r="24" fill="#F6F2E9" stroke="#697B9C" strokeWidth="3.5"/>
      <path d="M0,-24 Q-17,0 0,24 Z" fill="#D38AA4"/>
      <path d="M0,-24 Q17,0 0,24 Q8,0 0,-24" fill="#5FC3D8"/>
      <circle r="24" fill="none" stroke="#697B9C" strokeWidth="3.5"/>
    </g>
  </g>
      </svg>
    </div>
  );
}
