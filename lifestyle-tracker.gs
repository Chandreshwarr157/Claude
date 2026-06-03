/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║      LIFESTYLE & FITNESS PLAN — GOOGLE SHEETS BUILDER   ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  HOW TO USE:                                             ║
 * ║  1. Go to https://script.google.com                      ║
 * ║  2. Click "New project"                                  ║
 * ║  3. Delete all existing code in the editor               ║
 * ║  4. Paste this ENTIRE script                             ║
 * ║  5. Click Run → select "createLifestylePlan"             ║
 * ║  6. Click "Review permissions" → Allow                   ║
 * ║  7. Spreadsheet appears in your Google Drive             ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// ===================== CONFIG =====================

var HABITS = [
  "Woke up on time",
  "Water + sunlight (10 min)",
  "Workout / Walk done",
  "Shower + AM skincare",
  "Protein at every meal",
  "2.5L water hit",
  "No sugary drinks",
  "Dinner before 10:30 PM",
  "10-min room tidy",
  "Phone away by 11:30 PM",
  "Night skincare done",
  "In bed on time"
];

// Change this to your actual start date if needed
var START_DATE = new Date(2026, 5, 3); // June 3, 2026

// ===================== MAIN =====================

function createLifestylePlan() {
  var ss = SpreadsheetApp.create("My Lifestyle & Fitness Plan 2026-27");

  var planSheet    = ss.getActiveSheet(); planSheet.setName("My Plan");
  var trackerSheet = ss.insertSheet("Year Tracker");
  var dashSheet    = ss.insertSheet("Dashboard");

  planSheet.setTabColor("#43A047");
  trackerSheet.setTabColor("#1565C0");
  dashSheet.setTabColor("#F57C00");

  buildPlan(planSheet);
  SpreadsheetApp.flush();
  buildTracker(trackerSheet);
  SpreadsheetApp.flush();
  buildDashboard(dashSheet);
  SpreadsheetApp.flush();

  ss.setActiveSheet(planSheet);

  var url = ss.getUrl();
  Logger.log("Created: " + url);
  try { SpreadsheetApp.getUi().alert("Your plan is ready!\n\n" + url); } catch(e) {}
}

// ===================== SHEET 1: PLAN =====================

function buildPlan(s) {
  var W = "#FFFFFF", G = "#F5F5F5";

  // Title
  mr(s,"A1:K1").setValue("MY LIFESTYLE & FITNESS PLAN — DAILY REFERENCE")
    .setBackground("#1a237e").setFontColor("#FFFFFF").setFontSize(16)
    .setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  s.setRowHeight(1, 50);

  // ── TIMETABLE ──
  row(s, 3, "A:K", "⏰  DAILY TIMETABLE", "#1565C0");
  hdr3(s, 4, ["TIME", "ACTIVITY", "NOTES"]);

  var tt = [
    ["10:30 AM", "Wake up — drink water immediately", "Keep a full bottle on your nightstand"],
    ["10:35 AM", "10 min natural sunlight", "Outside or open window — fixes your sleep cycle"],
    ["10:45 AM", "Brush, wash face, make bed, 2-min tidy", "Small wins to start the day"],
    ["11:00 AM", "Workout (30–35 min)", "See workout section below"],
    ["11:35 AM", "Shower + morning skincare (5 min)", "Cleanser → moisturizer → sunscreen"],
    ["12:00 PM", "Breakfast / Brunch — high protein", "Eggs, dal, chicken, oats with peanuts"],
    ["12:30 PM", "Work starts", "—"],
    ["3:30 PM",  "Lunch — stretch 3 min first", "Dal + sabzi + 1-2 rotis or rice"],
    ["6:30 PM",  "Snack if genuinely hungry", "Chana, peanuts, fruit, chaas, boiled egg"],
    ["9:30 PM",  "Work ends", "—"],
    ["9:35 PM",  "10-min room tidy", "Put everything in its place — resets your mind"],
    ["10:00 PM", "Dinner — lighter than lunch", "Soup, eggs+roti, small dal+roti"],
    ["10:30–11:30 PM", "Free time (set a timer)", "Walk, YouTube, decompress — but a limit"],
    ["11:30 PM", "Phone on Night Mode", "Phone charges ACROSS THE ROOM — not next to bed"],
    ["12:00 AM", "Night skincare (3 min)", "Cleanser → moisturizer → cold spoon under eyes"],
    ["12:30 AM", "Sleep (Week 1–2 target)", "Shift 30 min earlier every 5–7 days"]
  ];
  tbl3(s, 5, tt, W, G);

  // Sleep shift
  var r = 5 + tt.length + 2;
  row(s, r, "A:K", "😴  SLEEP SHIFT PLAN (move alarm 30 min earlier every 5–7 days)", "#1565C0");
  hdr4(s, r+1, ["PERIOD", "WAKE UP", "SLEEP BY", "FOCUS"]);
  tbl4(s, r+2, [
    ["Week 1–2",        "10:30 AM", "1:30 AM",  "Just show up"],
    ["Week 3–4",        "10:00 AM", "1:00 AM",  "Build momentum"],
    ["Month 2",         "9:30 AM",  "12:30 AM", "Habits locking in"],
    ["Month 3 (target)","8:30–9 AM","11:30 PM", "Final goal ✓"]
  ], W, G);

  // ── WORKOUT ──
  r = r + 7;
  row(s, r, "A:K", "💪  WEEKLY WORKOUT SCHEDULE", "#1565C0");
  hdr3(s, r+1, ["DAY", "ACTIVITY", "TYPE"]);
  tbl3(s, r+2, [
    ["Monday",    "Workout A",                "Full Body"],
    ["Tuesday",   "15–20 min walk outside",   "Active Rest"],
    ["Wednesday", "Workout B",                "Lower + Core"],
    ["Thursday",  "Rest or 10 min stretching","Recovery"],
    ["Friday",    "Workout A",                "Full Body"],
    ["Saturday",  "20–25 min walk",           "Active Rest"],
    ["Sunday",    "Full rest",                "Recovery"]
  ], W, G);

  r = r + 10;
  row(s, r, "A:K", "🔥  WARM-UP — 5 min before EVERY workout", "#2E7D32");
  var wu = ["March in place — 1 min","Arm circles fwd + back — 30 sec each",
            "Hip circles — 30 sec each direction","Leg swings (hold wall) — 30 sec each leg"];
  wu.forEach(function(w,i){ s.getRange(r+1+i,1,1,11).merge().setValue("  • "+w)
    .setBackground(i%2===0?W:G); });

  r = r + 7;
  row(s, r, "A:K", "WORKOUT A — Full Body  (2 rounds · 60 sec rest between rounds)", "#0D47A1");
  hdr3(s, r+1, ["EXERCISE","REPS / TIME","NOTES"]);
  tbl3(s, r+2, [
    ["Wall push-ups",         "12",        "Hands shoulder-width, ~2 ft from wall. Wrist-safe."],
    ["Partial squats",        "10",        "Halfway down only. Slow. Knee-safe."],
    ["Glute bridges",         "15",        "Lie on back, drive hips up, hold 1 sec at top."],
    ["Standing knee raises",  "20 (10 each)","March with knees to hip height."],
    ["Superman hold",         "8 × 2 sec", "Face-down, lift arms + legs together."],
    ["Forearm plank",         "20–30 sec", "On elbows — no wrist pressure."]
  ], W, G);

  r = r + 9;
  row(s, r, "A:K", "WORKOUT B — Lower Body + Core  (2 rounds · 60 sec rest between rounds)", "#0D47A1");
  hdr3(s, r+1, ["EXERCISE","REPS / TIME","NOTES"]);
  tbl3(s, r+2, [
    ["Calf raises",              "15",       "Hold wall for balance if needed."],
    ["Single-leg glute bridge",  "8 each",   "Skip if knee hurts — use both legs."],
    ["Side-lying leg raises",    "12 each",  "Lie on side, raise top leg to 45°, slow."],
    ["Bird dog",                 "8 each",   "Opposite arm + leg extended, hold 1 sec."],
    ["Dead bug",                 "8 each",   "Lie on back, extend opposite arm + leg slowly."],
    ["Wall sit",                 "20–30 sec","Back flat on wall, go as low as comfortable."]
  ], W, G);

  r = r + 9;
  row(s, r, "A:K", "📈  MONTH 2 PROGRESSION — when exercises feel easy for 2 straight weeks", "#E65100");
  ["Wall push-ups → Incline push-ups (hands on chair)",
   "Partial squats → Full depth squats",
   "Add a 3rd round to each workout",
   "Plank: increase by 5–10 sec each week"].forEach(function(t,i){
    s.getRange(r+1+i,1,1,11).merge().setValue("  → "+t).setBackground(i%2===0?"#FFF9C4":"#FFF3E0");
  });

  // ── EATING ──
  r = r + 7;
  row(s, r, "A:K", "🥗  EATING GUIDELINES", "#1565C0");
  [["RULE 1","Protein at every meal","Keeps you full, protects muscle, speeds fat loss","#E8F5E9"],
   ["RULE 2","Drink water before you eat","Cuts overeating naturally","#E3F2FD"],
   ["RULE 3","Cut liquid calories first","Cold drinks, juice, sweet chai are silent saboteurs","#FFF9C4"]
  ].forEach(function(rule,i){
    s.getRange(r+1+i,1).setValue(rule[0]).setBackground(rule[3]).setFontWeight("bold");
    s.getRange(r+1+i,2,1,4).merge().setValue(rule[1]).setBackground(rule[3]).setFontWeight("bold");
    s.getRange(r+1+i,6,1,6).merge().setValue(rule[2]).setBackground(rule[3]).setFontColor("#555555");
  });

  r = r + 5;
  s.getRange(r,1,1,5).merge().setValue("INSTEAD OF").setBackground("#FFCDD2")
    .setFontWeight("bold").setHorizontalAlignment("center");
  s.getRange(r,6,1,6).merge().setValue("SWAP TO").setBackground("#C8E6C9")
    .setFontWeight("bold").setHorizontalAlignment("center");
  [["Cold drinks / juice",        "Nimbu pani, chaas, plain water"],
   ["Chips & namkeen daily",      "Roasted chana or peanuts (palm-size)"],
   ["Heavy food after 10:30 PM",  "Light snack or nothing"],
   ["Large rice / 3+ rotis",      "Smaller carb + more dal/sabzi/protein"],
   ["Fried food every day",       "Max 2–3 times per week"]
  ].forEach(function(sw,i){
    s.getRange(r+1+i,1,1,5).merge().setValue("✗  "+sw[0])
      .setBackground("#FFEBEE").setFontColor("#C62828");
    s.getRange(r+1+i,6,1,6).merge().setValue("✓  "+sw[1])
      .setBackground("#E8F5E9").setFontColor("#2E7D32");
  });

  r = r + 8;
  [["🌅 BREAKFAST (post-workout)",
    ["3 boiled/scrambled eggs + 1–2 rotis or multigrain bread",
     "Poha with peanuts + 2 boiled eggs on the side",
     "Oats cooked in milk + banana + handful of peanuts",
     "Chicken sandwich — multigrain, leftover chicken, veggies"]],
   ["☀️ LUNCH",
    ["Dal + sabzi + 1–2 rotis",
     "Chicken curry + 1 roti or small bowl rice",
     "Egg bhurji + 2 rotis",
     "Fish curry + small portion rice"]],
   ["🌙 DINNER (lighter than lunch)",
    ["Dal + 1 roti + sabzi",
     "Chicken stir-fry with veggies (10 min)",
     "2 eggs + sabzi + roti",
     "Soup on light nights"]],
   ["🍎 SNACKS",
    ["Roasted chana or peanuts (palm-size)",
     "1 banana or seasonal fruit",
     "Chaas (plain or salted)",
     "1–2 boiled eggs"]]
  ].forEach(function(sec){
    s.getRange(r,1,1,11).merge().setValue(sec[0]).setBackground("#BBDEFB")
      .setFontWeight("bold").setFontColor("#0D47A1");
    r++;
    sec[1].forEach(function(m,i){
      s.getRange(r,1,1,11).merge().setValue("  • "+m).setBackground(i%2===0?W:G); r++;
    });
    r++;
  });

  // ── SKINCARE ──
  row(s, r, "A:K", "✨  SKINCARE ROUTINE  (budget: under ₹1000 every 2–3 months)", "#1565C0");
  hdr4(s, r+1, ["PRODUCT","WHAT TO BUY","COST","NOTES"]);
  tbl4(s, r+2, [
    ["Face Wash",   "Simple Kind to Skin Refreshing Wash  OR  Cetaphil Gentle Cleanser","₹150–250","Lasts 2–3 months"],
    ["Moisturizer", "Cetaphil Moisturizing Lotion (small tube)","₹180–220","Morning + night"],
    ["Sunscreen",   "Minimalist SPF 50 PA++++","₹260–300","Yes, even indoors — non-negotiable"]
  ], W, G);

  r = r + 6;
  [["☀️  MORNING (5 min — after shower)",
    ["Wash face gently","Pat dry — don't rub","Thin layer moisturizer","Sunscreen (even indoors)"]],
   ["🌙  NIGHT (3 min — before sleep)",
    ["Wash face","Thin layer moisturizer","Cold spoon on under-eye area — 60 sec (dark circles)","—"]]
  ].forEach(function(rt){
    s.getRange(r,1,1,11).merge().setValue(rt[0]).setBackground("#FCE4EC").setFontWeight("bold"); r++;
    rt[1].forEach(function(step,i){
      s.getRange(r,1,1,11).merge().setValue("  "+step).setBackground(i%2===0?W:G); r++;
    });
    r++;
  });

  // Column widths
  s.setColumnWidth(1,120); s.setColumnWidth(2,260); s.setColumnWidth(3,220);
  [4,5,6,7,8,9,10,11].forEach(function(c){ s.setColumnWidth(c,100); });
  s.setFrozenRows(1);
}

// ── helpers ──
function mr(s, range) { return s.getRange(range).merge(); }
function row(s, r, cols, title, bg) {
  s.getRange(r+":"+r).getCell(1,1); // no-op to reference row
  s.getRange(r,1,1,11).merge().setValue(title)
    .setBackground(bg).setFontColor("#FFFFFF").setFontSize(12)
    .setFontWeight("bold").setVerticalAlignment("middle");
  s.setRowHeight(r,36);
}
function hdr3(s, r, labels) {
  var cols = [1,2,5];
  var spans = [1,3,6];
  labels.forEach(function(l,i){
    s.getRange(r,cols[i],1,spans[i]).merge().setValue(l)
      .setBackground("#43A047").setFontColor("#FFFFFF").setFontWeight("bold")
      .setHorizontalAlignment("center");
  });
}
function hdr4(s, r, labels) {
  var cols = [1,2,4,8];
  var spans = [1,2,4,4];
  labels.forEach(function(l,i){
    s.getRange(r,cols[i],1,spans[i]).merge().setValue(l)
      .setBackground("#43A047").setFontColor("#FFFFFF").setFontWeight("bold")
      .setHorizontalAlignment("center");
  });
}
function tbl3(s, startRow, data, W, G) {
  data.forEach(function(d,i){
    var bg = i%2===0?W:G;
    s.getRange(startRow+i,1).setValue(d[0]).setBackground(bg).setFontWeight("bold");
    s.getRange(startRow+i,2,1,3).merge().setValue(d[1]).setBackground(bg);
    s.getRange(startRow+i,5,1,7).merge().setValue(d[2]).setBackground(bg)
      .setFontColor("#555555").setFontStyle("italic");
  });
}
function tbl4(s, startRow, data, W, G) {
  data.forEach(function(d,i){
    var bg = i%2===0?W:G;
    s.getRange(startRow+i,1).setValue(d[0]).setBackground(bg).setFontWeight("bold");
    s.getRange(startRow+i,2,1,2).merge().setValue(d[1]).setBackground(bg);
    s.getRange(startRow+i,4,1,4).merge().setValue(d[2]).setBackground(bg)
      .setFontWeight("bold").setHorizontalAlignment("center");
    s.getRange(startRow+i,8,1,4).merge().setValue(d[3]).setBackground(bg)
      .setFontColor("#555555").setFontStyle("italic");
  });
}

// ===================== SHEET 2: YEAR TRACKER =====================

function buildTracker(s) {
  // Title
  var totalCols = 4 + HABITS.length + 4; // A-D, habits, score, %, rating, notes = 20 cols

  s.getRange(1,1,1,totalCols).merge()
    .setValue("YEAR TRACKER  —  June 2026 to June 2027  |  Tick off each habit every day")
    .setBackground("#1a237e").setFontColor("#FFFFFF").setFontSize(14)
    .setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  s.setRowHeight(1,48);

  // Category label row
  var catLabels = [
    [1,4,""], [5,2,"🌅 MORNING"], [7,2,"🏃 ACTIVE"], [9,3,"🥗 EATING"],
    [12,2,"🌆 EVENING"], [14,3,"🌙 NIGHT"], [17,1,"SCORE"], [18,1,"%"],
    [19,1,"RATING"], [20,1,"NOTES"]
  ];
  var catColors = [
    "#1a237e","#1B5E20","#1B5E20","#0D47A1","#0D47A1","#4A148C","#4A148C",
    "#BF360C","#BF360C","#006064","#006064","#006064","#4A148C","#4A148C",
    "#37474F","#37474F"
  ];
  catLabels.forEach(function(cl){
    s.getRange(2, cl[0], 1, cl[1]).merge().setValue(cl[2])
      .setBackground(cl[0]<=4?"#1a237e":
        cl[0]<=6?"#1B5E20":cl[0]<=8?"#0D47A1":
        cl[0]<=11?"#4A148C":cl[0]<=13?"#BF360C":
        cl[0]<=16?"#006064":"#37474F")
      .setFontColor("#FFFFFF").setFontWeight("bold")
      .setHorizontalAlignment("center").setFontSize(9);
  });
  s.setRowHeight(2,24);

  // Header row 3
  var headers = ["DATE","DAY","WK","MONTH"].concat(HABITS).concat(["SCORE","%","RATING","NOTES"]);
  headers.forEach(function(h,i){
    s.getRange(3, i+1).setValue(h)
      .setBackground("#263238").setFontColor("#FFFFFF")
      .setFontWeight("bold").setHorizontalAlignment("center")
      .setFontSize(8).setWrap(true);
  });
  s.setRowHeight(3,52);

  // Data rows
  var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var cur = new Date(START_DATE);
  var habitEndCol = 4 + HABITS.length; // column P (col 16)

  for (var i = 0; i < 365; i++) {
    var r = i + 4;
    var dn = dayNames[cur.getDay()];
    var mn = monthNames[cur.getMonth()];
    var wk = getWeekNum(cur);

    // Date (as actual Date object so MONTH()/YEAR() work in formulas)
    s.getRange(r,1).setValue(new Date(cur)).setNumberFormat("dd-mmm-yy")
      .setFontColor(dn==="Sun"?"#C62828":dn==="Sat"?"#1565C0":"#212121");
    s.getRange(r,2).setValue(dn).setHorizontalAlignment("center")
      .setFontColor(dn==="Sun"?"#C62828":dn==="Sat"?"#1565C0":"#212121")
      .setFontWeight(dn==="Mon"?"bold":"normal");
    s.getRange(r,3).setValue(wk).setHorizontalAlignment("center").setFontColor("#9E9E9E").setFontSize(9);
    s.getRange(r,4).setValue(mn).setHorizontalAlignment("center").setFontColor("#616161");

    // Checkboxes for all 12 habits
    s.getRange(r, 5, 1, 12).insertCheckboxes();

    // Score = count TRUEs
    var habitRange = "E"+r+":P"+r;
    s.getRange(r,17).setFormula("=COUNTIF("+habitRange+",TRUE)")
      .setHorizontalAlignment("center").setFontWeight("bold");

    // % done
    s.getRange(r,18).setFormula("=IFERROR(TEXT(Q"+r+"/12,\"0%\"),\"—\")")
      .setHorizontalAlignment("center");

    // Rating
    s.getRange(r,19).setFormula(
      '=IF(Q'+r+'="","",IF(Q'+r+'>=10,"🌟 Excellent",IF(Q'+r+'>=8,"✅ Great",IF(Q'+r+'>=6,"👍 Good",IF(Q'+r+'>=4,"😐 Okay","❌ Poor")))))'
    ).setHorizontalAlignment("center").setFontSize(9);

    // Row background (alternating, weekends highlighted)
    var rowBg = dn==="Sun"?"#FFF3F3":dn==="Sat"?"#F0F8FF":i%2===0?"#FAFAFA":"#F0F4FF";
    s.getRange(r,1,1,4).setBackground(rowBg);
    s.getRange(r,19,1,2).setBackground(rowBg);

    // Advance date
    cur.setDate(cur.getDate()+1);
  }

  // Conditional formatting on score column Q4:Q368
  var scoreR = s.getRange("Q4:Q368");
  var pctR   = s.getRange("R4:R368");
  var rules = [
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(10)
      .setBackground("#C8E6C9").setFontColor("#1B5E20").setRanges([scoreR]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(8,9)
      .setBackground("#DCEDC8").setFontColor("#33691E").setRanges([scoreR]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(6,7)
      .setBackground("#FFF9C4").setFontColor("#F57F17").setRanges([scoreR]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(4,5)
      .setBackground("#FFE0B2").setFontColor("#E65100").setRanges([scoreR]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(0,3)
      .setBackground("#FFCDD2").setFontColor("#B71C1C").setRanges([scoreR]).build()
  ];
  s.setConditionalFormatRules(rules);

  // Freeze top 3 rows + left 4 columns
  s.setFrozenRows(3);
  s.setFrozenColumns(4);

  // Column widths
  s.setColumnWidth(1,95); s.setColumnWidth(2,38); s.setColumnWidth(3,32); s.setColumnWidth(4,38);
  for (var c=5; c<=16; c++) s.setColumnWidth(c,36);
  s.setColumnWidth(17,50); s.setColumnWidth(18,42); s.setColumnWidth(19,100); s.setColumnWidth(20,180);
  for (var rr=4; rr<=368; rr++) s.setRowHeight(rr,22);

  // Legend footer
  s.getRange(370,1,1,totalCols).merge()
    .setValue("COLOR GUIDE:   🌟 Excellent = 10–12 (dark green)   ✅ Great = 8–9 (light green)   👍 Good = 6–7 (yellow)   😐 Okay = 4–5 (orange)   ❌ Poor = 0–3 (red)")
    .setBackground("#E3F2FD").setFontColor("#1565C0").setFontSize(10)
    .setHorizontalAlignment("center").setFontStyle("italic");
}

function getWeekNum(d) {
  var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  var day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

// ===================== SHEET 3: DASHBOARD =====================

function buildDashboard(s) {
  var T = "'Year Tracker'"; // reference to tracker sheet

  // Title
  s.getRange("A1:N1").merge()
    .setValue("📊  MY PROGRESS DASHBOARD  —  Updates automatically as you tick habits")
    .setBackground("#1a237e").setFontColor("#FFFFFF").setFontSize(15)
    .setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  s.setRowHeight(1,50);

  // ── LIVE STATS (6 cards) ──
  s.getRange("A3:N3").merge().setValue("LIVE STATS")
    .setBackground("#1565C0").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setFontSize(12);

  var stats = [
    ["Days Tracked",       "=COUNTIF("+T+"!Q4:Q368,\">0\")",                "#E8F5E9","#2E7D32"],
    ["Total Habits Done",  "=COUNTIF("+T+"!E4:P368,TRUE)",                   "#E3F2FD","#1565C0"],
    ["Avg Daily %",        "=IFERROR(TEXT(COUNTIF("+T+"!E4:P368,TRUE)/MAX(1,COUNTIF("+T+"!Q4:Q368,\">0\"))/12,\"0%\"),\"—\")", "#F3E5F5","#6A1B9A"],
    ["Excellent Days (10+)","=COUNTIF("+T+"!Q4:Q368,\">=10\")",              "#E0F2F1","#00695C"],
    ["Best Day Score",     "=MAX("+T+"!Q4:Q368)&\"/12\"",                    "#FFF9C4","#E65100"],
    ["Poor Days (≤3)",     "=COUNTIF("+T+"!Q4:Q368,\"<=3\")-COUNTIF("+T+"!Q4:Q368,0)", "#FFEBEE","#C62828"]
  ];

  stats.forEach(function(st, i) {
    var c = i*2 + 1;
    s.getRange(4, c, 1, 2).merge().setValue(st[0])
      .setBackground(st[2]).setFontColor(st[3]).setFontWeight("bold")
      .setFontSize(10).setHorizontalAlignment("center").setVerticalAlignment("middle");
    s.getRange(5, c, 1, 2).merge().setFormula(st[1])
      .setBackground(st[2]).setFontColor(st[3]).setFontSize(22)
      .setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
    s.setRowHeight(4,30); s.setRowHeight(5,55);
  });

  // ── MONTHLY SUMMARY TABLE (rows 8 onwards) ──
  var mRow = 8;
  s.getRange(mRow,1,1,6).merge().setValue("MONTHLY SUMMARY")
    .setBackground("#1565C0").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setFontSize(12);
  mRow++;

  ["MONTH","DAYS TRACKED","HABITS DONE","POSSIBLE","COMPLETION %","RATING"].forEach(function(h,i){
    s.getRange(mRow,i+1).setValue(h)
      .setBackground("#43A047").setFontColor("#FFFFFF")
      .setFontWeight("bold").setHorizontalAlignment("center");
  });
  mRow++;

  // 13 months: Jun 2026 → Jun 2027
  var months = [
    ["June 2026",    6,2026,30], ["July 2026",     7,2026,31],
    ["August 2026",  8,2026,31], ["September 2026",9,2026,30],
    ["October 2026", 10,2026,31],["November 2026", 11,2026,30],
    ["December 2026",12,2026,31],["January 2027",  1,2027,31],
    ["February 2027",2,2027,28], ["March 2027",    3,2027,31],
    ["April 2027",   4,2027,30], ["May 2027",      5,2027,31],
    ["June 2027",    6,2027,2]
  ];

  months.forEach(function(m, i) {
    var r = mRow + i;
    var bg = i%2===0?"#FAFAFA":"#F0F4FF";
    var mn = m[1], yr = m[2], days = m[3];

    s.getRange(r,1).setValue(m[0]).setBackground(bg).setFontWeight("bold");

    // Days tracked = rows where MONTH+YEAR match and score > 0
    s.getRange(r,2).setFormula(
      "=COUNTIFS(MONTH("+T+"!$A$4:$A$368),"+mn+",YEAR("+T+"!$A$4:$A$368),"+yr+","+T+"!$Q$4:$Q$368,\">0\")"
    ).setBackground(bg).setHorizontalAlignment("center");

    // Habits done = SUMPRODUCT of scores for that month
    s.getRange(r,3).setFormula(
      "=SUMPRODUCT((MONTH("+T+"!$A$4:$A$368)="+mn+")*(YEAR("+T+"!$A$4:$A$368)="+yr+")*("+T+"!$Q$4:$Q$368))"
    ).setBackground(bg).setHorizontalAlignment("center");

    // Possible = days tracked × 12
    s.getRange(r,4).setFormula("=B"+r+"*12").setBackground(bg).setHorizontalAlignment("center");

    // Completion %
    s.getRange(r,5).setFormula("=IFERROR(TEXT(C"+r+"/D"+r+",\"0%\"),\"—\")")
      .setBackground(bg).setFontWeight("bold").setHorizontalAlignment("center");

    // Rating
    s.getRange(r,6).setFormula(
      "=IF(D"+r+"=0,\"—\",IF(IFERROR(C"+r+"/D"+r+",0)>=0.85,\"🌟 Excellent\",IF(IFERROR(C"+r+"/D"+r+",0)>=0.70,\"✅ Great\",IF(IFERROR(C"+r+"/D"+r+",0)>=0.55,\"👍 Good\",IF(IFERROR(C"+r+"/D"+r+",0)>=0.40,\"😐 Okay\",\"❌ Keep going\")))))"
    ).setBackground(bg).setHorizontalAlignment("center");
  });

  var afterMonths = mRow + months.length + 2;

  // ── HABIT BREAKDOWN TABLE ──
  s.getRange(afterMonths,1,1,4).merge().setValue("HABIT COMPLETION BREAKDOWN")
    .setBackground("#1565C0").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setFontSize(12);
  afterMonths++;

  ["HABIT","TIMES DONE","DAYS TRACKED","COMPLETION %"].forEach(function(h,i){
    s.getRange(afterMonths,i+1).setValue(h)
      .setBackground("#43A047").setFontColor("#FFFFFF")
      .setFontWeight("bold").setHorizontalAlignment("center");
  });
  afterMonths++;

  var habitCols = ["E","F","G","H","I","J","K","L","M","N","O","P"];
  HABITS.forEach(function(habit, i) {
    var r = afterMonths + i;
    var bg = i%2===0?"#FAFAFA":"#F0F4FF";
    var col = habitCols[i];
    s.getRange(r,1).setValue(habit).setBackground(bg);
    s.getRange(r,2).setFormula("=COUNTIF("+T+"!"+col+"4:"+col+"368,TRUE)")
      .setBackground(bg).setHorizontalAlignment("center").setFontWeight("bold");
    s.getRange(r,3).setFormula("=COUNTIF("+T+"!Q4:Q368,\">0\")")
      .setBackground(bg).setHorizontalAlignment("center");
    s.getRange(r,4).setFormula("=IFERROR(TEXT(B"+r+"/C"+r+",\"0%\"),\"—\")")
      .setBackground(bg).setHorizontalAlignment("center").setFontWeight("bold");
  });

  // Conditional formatting on completion % column D in habit table
  var habitPctRange = s.getRange(afterMonths, 4, HABITS.length, 1);
  var cfRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("8").setBackground("#C8E6C9").setRanges([habitPctRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("9").setBackground("#C8E6C9").setRanges([habitPctRange]).build()
  ];
  // Use number-based CF on the "times done" column instead
  var doneRange = s.getRange(afterMonths, 2, HABITS.length, 1);
  s.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(300)
      .setBackground("#C8E6C9").setFontColor("#1B5E20").setRanges([doneRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(200,299)
      .setBackground("#FFF9C4").setFontColor("#F57F17").setRanges([doneRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(200)
      .setBackground("#FFCDD2").setFontColor("#C62828").setRanges([doneRange]).build()
  ]);

  // ── CHARTS ──
  SpreadsheetApp.flush();
  Utilities.sleep(1500);

  try {
    // Chart 1: Monthly Habits Done (Bar / Column chart) — uses cols A,C from monthly table
    var barDataRange = [
      s.getRange(mRow-1, 1, months.length+1, 1), // Month names
      s.getRange(mRow-1, 3, months.length+1, 1)  // Habits done
    ];
    var barChart = s.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(s.getRange(mRow-1, 1, months.length+1, 1))
      .addRange(s.getRange(mRow-1, 3, months.length+1, 1))
      .setPosition(3, 8, 0, 0)
      .setOption("title", "Monthly Habits Completed")
      .setOption("titleTextStyle", {fontSize:13, bold:true, color:"#1a237e"})
      .setOption("hAxis", {title:"Month", slantedText:true, slantedTextAngle:45, textStyle:{fontSize:9}})
      .setOption("vAxis", {title:"Habits Completed", minValue:0})
      .setOption("colors", ["#43A047"])
      .setOption("legend", {position:"none"})
      .setOption("width", 560)
      .setOption("height", 320)
      .build();
    s.insertChart(barChart);
  } catch(e) { Logger.log("Bar chart: " + e); }

  try {
    // Chart 2: Habit breakdown Donut/Pie chart
    var pieChart = s.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(s.getRange(afterMonths-1, 1, HABITS.length+1, 1))
      .addRange(s.getRange(afterMonths-1, 2, HABITS.length+1, 1))
      .setPosition(mRow + months.length + 4, 8, 0, 0)
      .setOption("title", "Which Habits You Complete Most")
      .setOption("titleTextStyle", {fontSize:13, bold:true, color:"#1a237e"})
      .setOption("pieHole", 0.45)
      .setOption("legend", {position:"right", textStyle:{fontSize:9}})
      .setOption("width", 580)
      .setOption("height", 380)
      .build();
    s.insertChart(pieChart);
  } catch(e) { Logger.log("Pie chart: " + e); }

  // Column widths
  s.setColumnWidth(1,160); s.setColumnWidth(2,110); s.setColumnWidth(3,110);
  s.setColumnWidth(4,110); s.setColumnWidth(5,110); s.setColumnWidth(6,130);
  s.setFrozenRows(1);
}
