# Builds 'Soil layer — 26 crops for your ruling.xlsx' from the engine's own derivation.
# Regenerate: node run-enginetest.cjs __templatejson > /tmp/soilmap.json && python3 tools/soil-template-xlsx.py
# The workbook is generated, never hand-edited — the answers must always match what the site does.

import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

D = json.load(open('/tmp/soilmap.json'))

NAVY = '0E3550'; GOLD = 'E3A93C'; SAND = 'FBF7EE'; SAND2 = 'F2EEE4'
YELLOW = 'FFF2CC'; GREY = 'F2F4F5'; GREEN = '2E7D4F'; RUST = 'C0392B'
ARIAL = 'Arial'
def F(sz=10, b=False, color='000000', italic=False): return Font(name=ARIAL, size=sz, bold=b, color=color, italic=italic)
thin = Side(style='thin', color='D9D9D9')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)

wb = Workbook()

# ─────────────────────────────────────────────── Sheet 1: Read me
ws = wb.active; ws.title = 'Read me'
ws.sheet_view.showGridLines = False
ws.column_dimensions['A'].width = 3
ws.column_dimensions['B'].width = 104
rows = [
 ('h1', 'The soil layer, crop by crop — for your ruling'),
 ('sub', 'Vital Agri Nutrients · van.com.pk · 9 September 2026'),
 ('sp',''),
 ('p',  'Twenty-six crops. The answers are ALREADY FILLED IN — you are correcting, not writing from scratch.'),
 ('p',  'Go to the "Rulings" tab. Every yellow cell is yours. Leave a row alone if you agree with it.'),
 ('sp',''),
 ('h2', 'What is already live'),
 ('p',  'The soil layer now runs on all 28 programmes, not two. A farmer on cotton or chilli can enter their soil report — or pick their district and have it fill from the Punjab survey’s own median across 770,160 samples — and the quantities in the shopping list move with what their ground actually shows.'),
 ('p',  'What each crop can ANSWER differs, and it differs for a reason a farmer can check: a reading is offered only where that crop’s own published plan already contains a product that carries that nutrient. Nothing was added to any programme. Adding a product to a crop plan is your decision, not a rule’s.'),
 ('p',  'So this is not asking you to build 26 maps. It is asking you to check 26 that already work.'),
 ('sp',''),
 ('h2', 'How I chose each responder — argue with the method, not the answers'),
 ('p',  'I did not make 26 separate judgements. I stated two rules, applied them to every crop’s own plan, and validated them by reproducing the wheat map you already reviewed — all ten entries, exactly. A rule set that could not reproduce a map you had approved would be the wrong rule set.'),
 ('rule','RULE 1 · Phosphorus and potash → the plan’s PRINCIPAL CARRIER. The product already delivering the most of that nutrient per acre in this crop’s plan. A bulk shortage is a soil-loading problem measured in kilograms, so it is answered by the line already doing the loading — not by a concentrated line applied in grams.'),
 ('rule','RULE 2 · Zinc, boron, iron, copper, manganese, organic matter → the DEDICATED CARRIER. The in-plan product with the highest registered concentration of it.'),
 ('sp',''),
 ('h2', 'Two guards, both added because the first run was arithmetically right and agronomically wrong'),
 ('p',  'GUARD 1 — a phosphorus or potash responder must actually BE a phosphorus or potash product, 10% or more. Without it, mango’s largest potash line by mass was Humi Grow at K 7%, so a potash-deficient reading would have sold more soil conditioner.'),
 ('p',  'GUARD 2 — a micronutrient responder may not be a product where that micronutrient is dwarfed by something that is not a micronutrient. Without it, rice and onion answered boron with Fusion Potash (B 1% beside K 50%), then with V-Mag Essential (B 1% beside Mg 8.5%). The test is relative, not a flat floor, because VL-Micromix answers copper at 1% in your reviewed wheat map and a flat floor would have thrown that away. What separates them: everything in VL-Micromix is a micronutrient; V-Mag Essential is a magnesium product that happens to carry some boron.'),
 ('sp',''),
 ('h2', 'pH and EC are not in this sheet, and that is deliberate'),
 ('p',  'Both carry your 8 September ruling unchanged. pH moves nitrogen from urea to Vital Urea at constant total N, plus a real quantity bump on that crop’s own phosphorus and zinc lines, because alkalinity genuinely locks both. EC returns the advisory — gypsum, leaching, drainage — and no product at all. The "Coverage" tab shows which products each crop’s pH bump lands on.'),
 ('sp',''),
 ('h2', 'What your 9 September ruling changed, and what it exposed'),
 ('p',  'You told me V. Ammonium Phosphate (V-Phosphate) is the MID-LIFE phosphate, and that a crop needing additional phosphorus at mid-life should answer with it. The plan data bears that out: it appears in 27 of the 28 programmes and in every one of them at Early Growth, Grand Growth or Maturity, always fertigated, never at land preparation. Green Phosphate is the basal line.'),
 ('p',  'Rule 1 picks by delivered mass, so it chose the basal line every time and discarded the mid-life one from every crop. That is the same blind spot the flat Nutrition Creator already has on potash — Fusion basal, Vital mid-life, V-Potash Plus fertigation, VL-Potash foliar, all collapsed into one responder. Phosphorus has the same shape and nobody had noticed until you said so.'),
 ('p',  'Your five are already applied and are marked "YOUR RULING" in the Source column: maize, strawberry, chili, tomato, turmeric. Every other crop still shows the derived basal answer, and the "Other carriers in this plan" column now names what else is available on that crop so you can rule on the rest without going back to the plans.'),
 ('sp',''),
 ('h2', 'Three things to look at first'),
 ('p',  '1. Sugarcane’s phosphorus answers V. Ammonium Phosphate, not Green Phosphate — the only crop where it does, because the sugarcane plan loads more phosphorus through the 10 kg line than the 50 kg one.'),
 ('p',  '2. Mango and date palm are thin (5 and 4 readings). Mango because five of its rows are per-tree and are excluded from anything per-acre; date palm because it is read at its mature age band only. Neither is a bug, but both are worth your eye.'),
 ('p',  '3. Where a row reads "not offered", that is a gap in the PROGRAMME, not in the tool. If cotton should be able to answer an iron reading, the fix is a micronutrient line in the cotton plan.'),
 ('sp',''),
 ('h2', 'One thing I found doing this, which is yours to settle'),
 ('p',  'The potato crop plan and the potato calculator do not contain the same products. The published plan carries V-Transform and VL-Micromix; the Fertilizer Calculator workbook carries V-Zinc 10% and VL-NPK instead, and neither of the first two. That is why the potato page says iron, copper and manganese have no responder — true of the calculator, and FALSE of your own published potato programme, which contains VL-Micromix and therefore all three.'),
 ('p',  'I have changed nothing. Potato and wheat still run off the reviewed maps. Which source is authoritative is your call, and the engine test prints this finding on every run so it cannot quietly become normal.'),
]
r = 1
for kind, text in rows:
    c = ws.cell(row=r, column=2, value=text)
    if kind == 'h1': c.font = F(18, True, NAVY)
    elif kind == 'sub': c.font = F(10, False, '5B6770')
    elif kind == 'h2': c.font = F(12, True, NAVY)
    elif kind == 'rule':
        c.font = F(10, True); c.fill = PatternFill('solid', fgColor=SAND2)
    else: c.font = F(10)
    c.alignment = Alignment(wrap_text=kind not in ('h1', 'h2', 'sub'), vertical='top')
    # Row heights on the wrapped paragraphs are deliberately NOT set. An estimate of how many lines
    # a paragraph takes is wrong the moment the reader's column width, font or zoom differs from
    # mine, and a height that is too small silently clips the text — which is exactly what the first
    # build did. Left unset, the row auto-fits to whatever the text actually needs.
    if kind == 'sp': ws.row_dimensions[r].height = 7
    elif kind == 'h1': ws.row_dimensions[r].height = 26
    elif kind == 'h2': ws.row_dimensions[r].height = 20
    r += 1

# legend + example + live counters
r += 1
ws.cell(row=r, column=2, value='How to fill it in').font = F(12, True, NAVY); r += 2
legend = [
    ('Yellow cells are yours.', 'Two per row on the Rulings tab: "Your ruling" and "Your note". Nothing else needs touching.'),
    ('Agree? Leave it blank.', 'A blank ruling means my answer stands. You only write where you want something different.'),
    ('Changing a responder?', 'Pick from the drop-down in the cell — it lists only the products that crop’s own plan already contains, plus "not offered".'),
    ('Want a product that is not in the list?', 'Then the crop plan itself has to change. Write it in "Your note" and say so — I will not add a product to a programme on my own.'),
]
for k, v in legend:
    ws.cell(row=r, column=2, value=f'{k}   {v}').font = F(10)
    ws.cell(row=r, column=2).alignment = Alignment(wrap_text=True, vertical='top')
    r += 1
r += 1
ws.cell(row=r, column=2, value='What a filled row looks like').font = F(11, True, NAVY); r += 1
ex_head = ['Crop', 'Soil reading', 'My answer', 'Your ruling', 'Your note']
ex_row  = ['Cotton', 'Zinc', 'V-Transform', 'V-Transform', 'Agreed — granular zinc at land prep is right for cotton.']
ex_row2 = ['Maize (Corn)', 'Organic matter', 'Humi Grow', 'not offered', 'Take it off maize. Humate is not our organic-matter answer on a cereal.']
start_ex = r
for j, h in enumerate(ex_head, start=3):
    c = ws.cell(row=r, column=j, value=h); c.font = F(9, True, 'FFFFFF'); c.fill = PatternFill('solid', fgColor=NAVY); c.border = BOX
r += 1
for row_vals in (ex_row, ex_row2):
    for j, v in enumerate(row_vals, start=3):
        c = ws.cell(row=r, column=j, value=v); c.font = F(10); c.border = BOX
        c.alignment = Alignment(wrap_text=True, vertical='top')
        if j >= 6: c.fill = PatternFill('solid', fgColor=YELLOW)
    r += 1
ws.cell(row=start_ex - 1, column=2).alignment = Alignment(vertical='bottom')
for col, w in (('C', 22), ('D', 20), ('E', 24), ('F', 24), ('G', 52)):
    ws.column_dimensions[col].width = w
r += 2
prog_row = r
ws.cell(row=r, column=2, value='Progress').font = F(12, True, NAVY); r += 1
ws.cell(row=r, column=2, value='Rows in total'); ws.cell(row=r, column=3, value='=COUNTA(Rulings!A2:A209)'); r += 1
# Counts the RULING column, not the note column — an earlier version counted F and therefore read
# zero however many rulings were written.
ws.cell(row=r, column=2, value='Rulings you have written'); ws.cell(row=r, column=3, value='=COUNTA(Rulings!G2:G209)'); r += 1
ws.cell(row=r, column=2, value='Notes you have left'); ws.cell(row=r, column=3, value='=COUNTA(Rulings!H2:H209)'); r += 1
# COUNTIF against the Status text was tried first and returned 0 against 208 rows that plainly
# read "not filled" — LibreOffice would not match the criterion, and a counter that silently reads
# zero is worse than no counter. Both are now computed from the cells themselves rather than from
# a derived label, which is what they should have counted in the first place.
ws.cell(row=r, column=2, value='Where you changed my answer')
ws.cell(row=r, column=3, value='=SUMPRODUCT((Rulings!G2:G209<>"")*(1-EXACT(Rulings!G2:G209,Rulings!C2:C209)))'); r += 1
ws.cell(row=r, column=2, value='Still to look at')
ws.cell(row=r, column=3, value='=COUNTA(Rulings!A2:A209)-COUNTA(Rulings!G2:G209)')
for rr in range(prog_row + 1, r + 1):
    ws.cell(row=rr, column=2).font = F(10)
    c = ws.cell(row=rr, column=3); c.font = F(11, True, NAVY); c.alignment = Alignment(horizontal='left')

# ─────────────────────────────────────────────── Sheet: Lists (drop-down sources)
lists = wb.create_sheet('Lists')
lists.sheet_state = 'hidden'
lists.cell(row=1, column=1, value='Drop-down sources — one column per crop. Generated; do not edit by hand.').font = F(9, italic=True)
col_for = {}
for i, crop in enumerate(D):
    col = i + 1
    col_for[crop['slug']] = col
    lists.cell(row=2, column=col, value=crop['name']).font = F(9, True)
    vals = ['not offered'] + crop['products']
    for k, v in enumerate(vals, start=3):
        lists.cell(row=k, column=col, value=v)

# ─────────────────────────────────────────────── Sheet: Rulings
rs = wb.create_sheet('Rulings')
rs.sheet_view.showGridLines = False
HEAD = ['Crop', 'Soil reading', 'My answer', 'Source', 'Why I chose it', 'Other carriers in this plan', 'YOUR RULING', 'YOUR NOTE', 'Status']
WIDTH = [26, 20, 26, 16, 66, 30, 26, 40, 14]
for j, (h, w) in enumerate(zip(HEAD, WIDTH), start=1):
    c = rs.cell(row=1, column=j, value=h)
    c.font = F(10, True, 'FFFFFF')
    c.fill = PatternFill('solid', fgColor=NAVY if j < 7 else GOLD)
    if j >= 7: c.font = F(10, True, NAVY)
    c.alignment = Alignment(vertical='center', horizontal='left')
    c.border = BOX
    rs.column_dimensions[get_column_letter(j)].width = w
rs.row_dimensions[1].height = 24
rs.freeze_panes = 'C2'

row = 2
for i, crop in enumerate(D):
    block_start = row
    for p in crop['params']:
        rs.cell(row=row, column=1, value=crop['name']).font = F(10, True, NAVY)
        rs.cell(row=row, column=2, value=p['label']).font = F(10)
        ans = rs.cell(row=row, column=3, value=p['answer'] if p['offered'] else 'not offered')
        ans.font = F(10, True) if p['offered'] else F(10, False, '8A9198', italic=True)
        src = rs.cell(row=row, column=4, value='YOUR RULING' if p['ruled'] else ('rule' if p['offered'] else '—'))
        src.font = F(9, True, GREEN) if p['ruled'] else F(9, False, '8A9198')
        src.alignment = Alignment(horizontal='center')
        why = rs.cell(row=row, column=5, value=p['why'])
        why.font = F(9, False, '5B6770'); why.alignment = Alignment(wrap_text=True, vertical='top')
        oth = rs.cell(row=row, column=6, value=' · '.join(p['others']) if p['others'] else '—')
        oth.font = F(9, False, '5B6770'); oth.alignment = Alignment(wrap_text=True, vertical='top')
        for j in (7, 8):
            c = rs.cell(row=row, column=j)
            c.fill = PatternFill('solid', fgColor=YELLOW); c.font = F(10)
            c.alignment = Alignment(wrap_text=True, vertical='top')
        # A row you have already ruled on is pre-filled with your own answer and shaded green, so it
        # does not sit in the "still to look at" pile you have already been through.
        if p['ruled']:
            rs.cell(row=row, column=7, value=p['answer'])
            rs.cell(row=row, column=7).fill = PatternFill('solid', fgColor='E4F0E8')
            rs.cell(row=row, column=8, value='Your ruling, 9 Sep 2026 — already applied to the site.')
            rs.cell(row=row, column=8).fill = PatternFill('solid', fgColor='E4F0E8')
        st = rs.cell(row=row, column=9,
                     value=f'=IF(G{row}="","not filled",IF(EXACT(G{row},C{row}),"same","CHANGED"))')
        st.font = F(9, True); st.alignment = Alignment(horizontal='center')
        for j in range(1, 10):
            rs.cell(row=row, column=j).border = BOX
        if i % 2 == 1:
            for j in (1, 2, 3, 4, 5, 6, 9):
                if rs.cell(row=row, column=j).fill.fgColor.rgb in (None, '00000000'):
                    rs.cell(row=row, column=j).fill = PatternFill('solid', fgColor=SAND2)
        rs.row_dimensions[row].height = 30
        row += 1
    # one drop-down per crop, listing only that crop's own products
    col = get_column_letter(col_for[crop['slug']])
    n = 3 + len(crop['products'])
    dv = DataValidation(type='list', formula1=f"=Lists!${col}$3:${col}${n}", allow_blank=True, showDropDown=False)
    dv.error = "Pick a product this crop's plan already contains, or 'not offered'. To use something else, the crop plan itself has to change — say so in Your note."
    dv.errorTitle = 'Not in this crop’s plan'
    dv.prompt = 'Blank = you agree with my answer.'
    dv.promptTitle = 'Your ruling'
    rs.add_data_validation(dv)
    dv.add(f'G{block_start}:G{row - 1}')

last = row - 1
rs.auto_filter.ref = f'A1:I{last}'

# ─────────────────────────────────────────────── Sheet: Coverage
cs = wb.create_sheet('Coverage')
cs.sheet_view.showGridLines = False
H2 = ['Crop', 'Readings offered (of 10)', 'pH bump lands on', 'Not offered — no carrier in this plan', 'Products in this programme']
W2 = [26, 20, 34, 40, 84]
for j, (h, w) in enumerate(zip(H2, W2), start=1):
    c = cs.cell(row=1, column=j, value=h)
    c.font = F(10, True, 'FFFFFF'); c.fill = PatternFill('solid', fgColor=NAVY)
    c.alignment = Alignment(vertical='center', wrap_text=True); c.border = BOX
    cs.column_dimensions[get_column_letter(j)].width = w
cs.row_dimensions[1].height = 30
cs.freeze_panes = 'B2'
r2 = 2
for crop in D:
    missing = [p['label'] for p in crop['params'] if not p['offered']]
    cs.cell(row=r2, column=1, value=crop['name']).font = F(10, True, NAVY)
    n = cs.cell(row=r2, column=2, value=crop['offeredCount']); n.font = F(11, True, GREEN if crop['offeredCount'] >= 7 else RUST)
    n.alignment = Alignment(horizontal='center')
    cs.cell(row=r2, column=3, value=' + '.join(crop['ph']) if crop['ph'] else 'substitution only')
    cs.cell(row=r2, column=4, value=', '.join(missing) if missing else '—')
    cs.cell(row=r2, column=5, value=' · '.join(crop['products']))
    for j in range(1, 6):
        c = cs.cell(row=r2, column=j); c.border = BOX
        if j >= 3: c.font = F(9, False, '5B6770')
        c.alignment = Alignment(wrap_text=True, vertical='top')
    cs.row_dimensions[r2].height = 30
    r2 += 1
cs.auto_filter.ref = f'A1:E{r2-1}'
cs.cell(row=r2 + 1, column=1, value='Counts include pH and EC, which every crop carries. That is why a crop showing 5 nutrient answers reads 7 here.').font = F(9, italic=True, color='5B6770')

for sheet in (ws, rs, cs):
    sheet.page_setup.orientation = 'landscape'
    sheet.page_setup.fitToWidth = 1
    sheet.page_setup.fitToHeight = 0
    sheet.sheet_properties.pageSetUpPr.fitToPage = True
rs.print_title_rows = '1:1'
cs.print_title_rows = '1:1'

wb.save('/home/claude/xl/Soil layer — 26 crops for your ruling.xlsx')
print('saved')
