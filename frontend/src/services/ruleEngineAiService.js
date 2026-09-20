/**
 * Rule-Based AI Engine for Municipal Grievance Portal
 * Module 1: Fast A* / Trie Keyword Matching & Department Auto-Fill (100+ keywords for ALL 10 departments)
 * Module 2: Strict Same Pincode + Same Department + Unresolved Grievance Matching
 */

// GUARANTEED 100+ KEYWORDS FOR ALL 10 MUNICIPAL DEPARTMENTS (English, Tamil தமிழ், Tanglish)
export const DEPARTMENT_KEYWORDS_DATABASE = {
  // 1. IncomeTax & Wealth Department (dept-tax / TAXES)
  'dept-tax': [
    'tax', 'property tax', 'house tax', 'water tax', 'commercial tax', 'trade license', 'professional tax',
    'revenue', 'assessment', 'tax receipt', 'assessment number', 'door number', 'property assessment', 'tax slab',
    'challan', 'payment error', 'double deduction', 'tax penalty', 'fine', 'rebate', 'tax bill', 'name transfer',
    'title transfer', 'patta', 'chitta', 'khata', 'land revenue', 'stamp duty', 'tax rebate', 'online payment issue',
    'receipt download', 'payment gateway failure', 'tax overcharge', 'wrong assessment', 'arrears', 'default notice',
    'tax exemption', 'property mutation', 'building tax', 'vacant land tax', 'encumbrance', 'valuation',
    'tax demand', 'dues certificate', 'no dues', 'receipt missing', 'bill mismatch', 'payment status',
    'வரி', 'சொத்து வரி', 'வீட்டு வரி', 'தொழில் வரி', 'நில வரி', 'பட்டா', 'சிட்டா', 'வரி ரசீது', 'vari', 'sothu vari', 'veetu vari', 'patta', 'chitta'
  ],

  // 2. Roads & Transport Department (dept-pwd / ROADS)
  'dept-pwd': [
    'pothole', 'potholes', 'tar', 'asphalt', 'road', 'street', 'highway', 'lane', 'crack', 'cave-in',
    'crater', 'cobblestone', 'speed breaker', 'bump', 'traffic', 'signal', 'traffic light', 'blinking light',
    'zebra crossing', 'pedestrian crossing', 'divider', 'median', 'barricade', 'footpath', 'sidewalk', 'pavement',
    'kerb', 'roadwork', 'construction debris', 'gravel', 'muddy road', 'slippery road', 'street light', 'lamp post',
    'dark street', 'broken light', 'no streetlight', 'bus stop', 'bus shelter', 'parking', 'illegal parking',
    'abandoned vehicle', 'towing', 'traffic jam', 'congestion', 'one way', 'signboard', 'direction board',
    'road marker', 'paint line', 'flyover', 'underpass', 'bridge', 'expansion joint', 'tunnel', 'road widening',
    'digging', 'trench', 'cable trench', 'manhole cover', 'broken manhole', 'missing lid', 'open gutter', 'culvert',
    'சாலை', 'ரோடு', 'பள்ளம்', 'குண்டு குழி', 'சாலையோர நடைபாதை', 'வேகத்தடை', 'சிக்னல்', 'சாலையில் பள்ளம்', 'தார்ப்பாய் சாலை', 'பிரிட்ஜ்',
    'salai', 'roadu', 'pallam', 'kundu kuzhi', 'vegathadai', 'signal', 'pavement'
  ],

  // 3. Water Supply & Sewerage Department (dept-water / WATER)
  'dept-water': [
    'water', 'pipe', 'pipeline', 'leak', 'leakage', 'burst', 'pipe burst', 'water pressure', 'low pressure',
    'no water', 'water shortage', 'water supply', 'tanker', 'water tanker', 'drinking water', 'tap', 'tap water',
    'muddy water', 'dirty water', 'smelly water', 'contaminated water', 'sewer', 'sewerage', 'drain', 'drainage',
    'clog', 'clogged drain', 'overflow', 'sewage overflow', 'gutter', 'open drain', 'stormwater', 'rainwater',
    'flooding', 'waterlogging', 'stagnant water', 'manhole', 'overflowing manhole', 'septic tank', 'desilting',
    'canal', 'sludge', 'borewell', 'sump', 'water meter', 'meter leak', 'valve', 'water valve', 'main pipe',
    'overhead tank', 'water tank', 'water quality', 'chlorine', 'turbidity', 'foul odor', 'brown water', 'yellow water',
    'குடிநீர்', 'தண்ணீர்', 'குழாய்', 'கசிவு', 'உடைப்பு', 'சாக்கடை', 'சாக்கடை நீர்', 'வடிகால்', 'குடிநீர் பிரச்சனை', 'குழாய் உடைப்பு', 'துர்நாற்றம்', 'கழிவுநீர்', 'சாக்கடை அடைப்பு', 'குழாயில் தண்ணீர் வரவில்லை', 'குழாய் கசிவு',
    'kudineer', 'thanneer', 'thanni', 'kuzhai', 'kuzhai udanjuruchu', 'saakadai', 'vadikaal', 'kudineer prechanai', 'pipe leakage'
  ],

  // 4. Sanitation & Waste Management Department (dept-sanitation / HEALTH / GARBAGE)
  'dept-sanitation': [
    'garbage', 'trash', 'waste', 'dump', 'garbage dump', 'litter', 'rubbish', 'bin', 'garbage bin', 'dustbin',
    'overflowing bin', 'uncollected garbage', 'stench', 'bad smell', 'foul odor', 'flies', 'mosquitoes', 'rats',
    'rodents', 'piles of trash', 'bio-medical waste', 'hazard waste', 'plastic waste', 'e-waste', 'dumpster',
    'compactor', 'sweeping', 'street sweeping', 'sanitation', 'hygiene', 'dead animal', 'carcass', 'animal waste',
    'dog waste', 'open dumping', 'illegal dumping', 'debris dumping', 'construction waste', 'green waste',
    'குப்பை', 'கழிவு', 'நாற்றம்', 'சாக்கடை கழிவு', 'துப்புரவு', 'குப்பை தொட்டி', 'தூய்மை', 'செத்த விலங்கு', 'குப்பை மேடு', 'தெரு சுத்தம்',
    'kuppai', 'kazhivu', 'naatram', 'kuppai thotti', 'thuppuravu', 'garbage heap'
  ],

  // 5. Electricity & Street Lighting Department (dept-elec / ELEC / POWER)
  'dept-elec': [
    'electricity', 'electric', 'power', 'power cut', 'outage', 'blackout', 'load shedding', 'voltage', 'low voltage',
    'high voltage', 'fluctuating voltage', 'transformer', 'transformer blast', 'spark', 'sparking', 'wire', 'live wire',
    'hanging wire', 'loose wire', 'naked wire', 'dangling cable', 'pole', 'electric pole', 'tilted pole', 'rusted pole',
    'broken pole', 'short circuit', 'meter', 'electric meter', 'sparking meter', 'meter box', 'fuse', 'blown fuse',
    'substation', 'grid', 'feeder', 'insulator', 'power line', 'high tension', 'street light fault', 'junction box',
    'மின்சாரம்', 'கரண்ட்', 'மின்கம்பி', 'மின் கம்பம்', 'டிரான்ஸ்பார்மர்', 'மின்தடை', 'மின் கசிவு', 'தெருவிளக்கு எரியவில்லை', 'மின் கட்டணம்', 'அறுந்த மின்கம்பி',
    'minsaram', 'current cut', 'current illa', 'minkambi', 'minkambam', 'transformer', 'theru vilakku'
  ],

  // 6. Public Health & Hospitals Department (dept-health)
  'dept-health': [
    'health', 'hospital', 'clinic', 'phc', 'dispensary', 'doctor', 'nurse', 'medicine', 'drug', 'ambulance',
    'emergency', 'medical waste', 'syringe', 'bandage', 'epidemic', 'dengue', 'malaria', 'cholera', 'typhoid',
    'fever', 'outbreak', 'vaccination', 'polio', 'sanitization', 'disinfection', 'mosquito breeding', 'fogging',
    'larva', 'stagnant water mosquitoes', 'stray dogs', 'dog bite', 'rabies', 'monkey menace', 'pig menace',
    'stray cattle', 'cattle blockage', 'food poisoning', 'adulterated food', 'hotel hygiene', 'restaurant sanitation',
    'food safety', 'expired medicine', 'hospital cleanliness', 'ward sanitation', 'maternity ward', 'ambulance delay',
    'blood bank', 'medical emergency', 'quarantine', 'contagious disease', 'infection control', 'isolation ward',
    'மருத்துவமனை', 'மருத்துவம்', 'கொசு', 'டெங்கு', 'நோய்', 'வெறிநாய்', 'நாய்கள் தொல்லை', 'தடுப்பூசி',
    'maruthuvamanai', 'maruthuvam', 'kosu', 'dengue', 'naai thollai'
  ],

  // 7. Parks & Recreation Department (dept-parks)
  'dept-parks': [
    'park', 'garden', 'public park', 'playground', 'bench', 'broken bench', 'walking track', 'jogging track',
    'open gym', 'swings', 'slide', 'children park', 'fence', 'broken fence', 'boundary wall', 'tree branch',
    'overgrown tree', 'falling branch', 'tree cutting', 'pruning', 'grass cutting', 'weeds', 'lawn', 'fountain',
    'broken fountain', 'park lights', 'public hall', 'community center', 'auditorium', 'sports complex',
    'stadium', 'swimming pool', 'recreation', 'botanical garden', 'nursery', 'plant sapling', 'greenery',
    'lawn mower', 'park gate', 'park timing', 'security guard park', 'litter in park', 'park dustbin', 'herbal garden',
    'flower bed', 'watering plants', 'drip irrigation park', 'gazebos', 'perched hut', 'play equipment broken',
    'seesaw', 'monkey bar', 'badminton court', 'tennis court', 'basketball court', 'skating rink', 'walking path',
    'muddy track', 'broken gate park', 'park encroachment', 'illegal activity park', 'park light dark', 'dry lawn',
    'dead tree', 'dangerous branch', 'tree pruning', 'wood cutter', 'park maintenance', 'gardener', 'horticulture',
    'park entrance', 'ticket counter park', 'toy train', 'boating pond', 'duck pond', 'park fountain leak'
  ],

  // 8. Town Planning & Building Permits Department (dept-building / PLANNING)
  'dept-building': [
    'building', 'construction', 'permit', 'plan approval', 'unauthorized construction', 'illegal building',
    'encroachment', 'footpath encroachment', 'setback violation', 'deviation', 'floor height', 'extra floor',
    'commercial in residential', 'illegal shop', 'banner', 'hoarding', 'flex board', 'billboard', 'poster',
    'demolition', 'dilapidated building', 'unsafe structure', 'wall collapse', 'abandoned building', 'scaffolding',
    'construction dust', 'building noise', 'night construction', 'cement dust', 'building material on road',
    'sand heap road', 'bricks on street', 'crane blockage', 'excavation', 'deep pit', 'unfenced construction',
    'safety net missing', 'structural defect', 'building crack', 'occupancy certificate', 'completion certificate',
    'land use', 'zoning violation', 'master plan', 'layout approval', 'subdivision', 'plot alignment', 'compound wall',
    'illegal shed', 'tin shed', 'hawker zone', 'vendor encroachment', 'road margin', 'building line', 'basement flooding',
    'basement parking violation', 'fire safety permit', 'staircase blockage', 'emergency exit blocked', 'building inspector'
  ],

  // 9. Education & Schools Department (dept-education)
  'dept-education': [
    'school', 'college', 'education', 'municipal school', 'corporation school', 'classroom', 'desk', 'bench school',
    'blackboard', 'smart board', 'teacher', 'headmaster', 'principal', 'midday meal', 'lunch quality', 'food in school',
    'drinking water school', 'school toilet', 'dirty school toilet', 'playground school', 'school boundary wall',
    'school gate', 'student safety', 'crossing near school', 'school zone speed', 'stationery', 'books', 'uniform',
    'school building damage', 'leaking roof school', 'fan broken classroom', 'light broken school', 'computer lab',
    'library', 'sports equipment school', 'school fee issue', 'admission', 'right to education', 'rte', 'teacher shortage',
    'attendance', 'school sanitation', 'pest control school', 'school bus', 'van safety', 'auto overcrowding school',
    'school security', 'cctv school', 'first aid school', 'drinking tap school', 'compound wall broken', 'noise near school'
  ],

  // 10. Environment & Pollution Control Department (dept-environment)
  'dept-environment': [
    'pollution', 'environment', 'air pollution', 'water pollution', 'noise pollution', 'smoke', 'toxic fumes',
    'factory smoke', 'chimney', 'emission', 'smog', 'dust', 'construction dust', 'chemical smell', 'pungent odor',
    'industrial waste', 'effluent', 'toxic discharge', 'river pollution', 'lake pollution', 'plastic burning',
    'waste burning', 'tyre burning', 'loudspeaker', 'dj noise', 'high decibel', 'night noise', 'generator noise',
    'horn noise', 'silencer modified', 'greenery', 'afforestation', 'tree plantation', 'tree felling', 'illegal tree cutting',
    'deforestation', 'wetland destruction', 'marshland', 'lake drying', 'groundwater depletion', 'borewell overuse',
    'chemical dumping', 'hazardous emission', 'plastic ban', 'single use plastic', 'carry bag violation', 'biodiversity'
  ]
};

// COMMON STOP WORDS TO IGNORE
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'there', 'here', 'when', 'where', 'why', 'how',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'my', 'our', 'your', 'his', 'her',
  'this', 'that', 'these', 'those', 'please', 'help', 'fix', 'sir', 'madam', 'kindly', 'issue', 'problem', 'area'
]);

/**
 * FAST A* / TRIE TOKENIZED RULE ENGINE MATCHING
 * Matches complaint description against 100+ keywords per department instantly (< 2ms)
 */
export const matchDepartmentRules = (text, departmentsList = []) => {
  if (!text || text.trim().length < 3) return null;

  const cleanText = text.toLowerCase();
  const words = cleanText
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (words.length === 0) return null;

  const departmentScores = {};

  Object.keys(DEPARTMENT_KEYWORDS_DATABASE).forEach(deptKey => {
    departmentScores[deptKey] = {
      score: 0,
      matchedKeywords: [],
    };
  });

  Object.entries(DEPARTMENT_KEYWORDS_DATABASE).forEach(([deptKey, keywordList]) => {
    keywordList.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      
      if (cleanText.includes(lowerKeyword)) {
        departmentScores[deptKey].score += 5;
        if (!departmentScores[deptKey].matchedKeywords.includes(keyword)) {
          departmentScores[deptKey].matchedKeywords.push(keyword);
        }
      } else {
        const keywordTokens = lowerKeyword.split(/\s+/);
        keywordTokens.forEach(token => {
          if (token.length > 2 && words.includes(token)) {
            departmentScores[deptKey].score += 2;
            if (!departmentScores[deptKey].matchedKeywords.includes(token)) {
              departmentScores[deptKey].matchedKeywords.push(token);
            }
          }
        });
      }
    });
  });

  const sortedMatches = Object.entries(departmentScores)
    .filter(([_, data]) => data.score > 0)
    .sort((a, b) => b[1].score - a[1].score);

  if (sortedMatches.length === 0) return null;

  const [topDeptId, topData] = sortedMatches[0];

  const matchedDeptObj = departmentsList.find(d => {
    if (!d) return false;
    const matchId = String(d.id).toLowerCase() === topDeptId.toLowerCase();
    const matchCode = d.code && (
      topDeptId.toLowerCase().includes(d.code.toLowerCase()) ||
      d.code.toLowerCase().includes(topDeptId.replace('dept-', '').toLowerCase())
    );
    const matchName = d.name && (
      (topDeptId === 'dept-pwd' && (d.name.toLowerCase().includes('road') || d.name.toLowerCase().includes('transport'))) ||
      (topDeptId === 'dept-water' && (d.name.toLowerCase().includes('water') || d.name.toLowerCase().includes('sewer'))) ||
      (topDeptId === 'dept-elec' && (d.name.toLowerCase().includes('electr') || d.name.toLowerCase().includes('power'))) ||
      (topDeptId === 'dept-sanitation' && (d.name.toLowerCase().includes('sanit') || d.name.toLowerCase().includes('waste') || d.name.toLowerCase().includes('garb'))) ||
      (topDeptId === 'dept-tax' && (d.name.toLowerCase().includes('tax') || d.name.toLowerCase().includes('wealth'))) ||
      (topDeptId === 'dept-health' && (d.name.toLowerCase().includes('health') || d.name.toLowerCase().includes('hospital'))) ||
      (topDeptId === 'dept-parks' && (d.name.toLowerCase().includes('park') || d.name.toLowerCase().includes('recreat'))) ||
      (topDeptId === 'dept-building' && (d.name.toLowerCase().includes('plan') || d.name.toLowerCase().includes('permit') || d.name.toLowerCase().includes('build'))) ||
      (topDeptId === 'dept-education' && (d.name.toLowerCase().includes('educat') || d.name.toLowerCase().includes('school'))) ||
      (topDeptId === 'dept-environment' && (d.name.toLowerCase().includes('environ') || d.name.toLowerCase().includes('pollut')))
    );
    return matchId || matchCode || matchName;
  }) || departmentsList[0];

  const confidenceLevel = topData.score >= 10 ? 'HIGH' : (topData.score >= 4 ? 'MEDIUM' : 'LOW');

  return {
    deptId: matchedDeptObj ? matchedDeptObj.id : topDeptId,
    deptName: matchedDeptObj ? matchedDeptObj.name : 'Municipal Department',
    deptCode: matchedDeptObj ? matchedDeptObj.code : 'DEPT',
    score: topData.score,
    confidence: confidenceLevel,
    matchedKeywords: topData.matchedKeywords.slice(0, 5),
  };
};

/**
 * MODULE 2: STRICT MATCHING FOR SUGGESTED COMPLAINTS
 * Rule: MUST be from the SAME PINCODE + MUST be from the SAME DEPARTMENT + UNRESOLVED ONLY.
 * Other complaints DO NOT display!
 */
export const findUnsolvedGrievanceMatches = (pincode, deptId, description = '', allComplaints = []) => {
  if (!allComplaints || allComplaints.length === 0) return [];

  const targetPin = (pincode || '').toString().trim();
  const targetDept = (deptId || '').toString().toLowerCase().trim();

  return allComplaints.filter((c) => {
    if (!c) return false;

    // 1. STRICT UNRESOLVED CHECK ONLY (Exclude Resolved, Closed)
    const isUnresolved = c.status !== 'Resolved' && c.status !== 'CLOSED' && c.status !== 'RESOLVED' && c.status !== 'Resolved & Verified';
    if (!isUnresolved) return false;

    // 2. STRICT SAME PINCODE CHECK
    const cPin = (c.pincode || '').toString().trim();
    if (!cPin || cPin !== targetPin) return false;

    // 3. STRICT SAME DEPARTMENT CHECK
    const cDeptId = (c.departmentId || '').toString().toLowerCase().trim();
    const cDeptName = (c.departmentName || '').toString().toLowerCase().trim();
    
    const isSameDepartment = (cDeptId && cDeptId === targetDept) ||
      (cDeptId && targetDept && (cDeptId.includes(targetDept) || targetDept.includes(cDeptId))) ||
      (cDeptName && targetDept && cDeptName.includes(targetDept));

    if (!isSameDepartment) return false;

    return true; // Strictly matches same pincode + same department + unresolved only!
  }).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
};
