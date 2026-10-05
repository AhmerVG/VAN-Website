# Builds 'Product exposure — what a farmer never meets.xlsx'.
# Regenerate: node run-enginetest.cjs __exposure > /tmp/exposure.json && node run-enginetest.cjs __templatejson > /tmp/soilmap.json && python3 tools/product-exposure-xlsx.py

import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

D = json.load(open('/tmp/exposure.json'))
CROPS = json.load(open('/tmp/soilmap.json'))
ALLCROPS = sorted({c['name'] for c in CROPS} | {'Wheat', 'Potato'})

NAVY='0E3550'; GOLD='E3A93C'; SAND2='F2EEE4'; YELLOW='FFF2CC'; GREEN='2E7D4F'; RUST='C0392B'
def F(sz=10,b=False,color='000000',italic=False): return Font(name='Arial',size=sz,bold=b,color=color,italic=italic)
thin=Side(style='thin',color='D9D9D9'); BOX=Border(left=thin,right=thin,top=thin,bottom=thin)
wb=Workbook()

# ── Read me
ws=wb.active; ws.title='Read me'; ws.sheet_view.showGridLines=False
ws.column_dimensions['A'].width=3; ws.column_dimensions['B'].width=110
lines=[
 ('h1','Which products a farmer never meets'),
 ('sub','Vital Agri Nutrients · van.com.pk · 9 September 2026'),
 ('sp',''),
 ('p','You asked which products are least shown or picked, so you can tell me placement, stage and crop. This counts it.'),
 ('sp',''),
 ('h2','What was counted, and what it means'),
 ('p','PLANS — how many of the 28 published crop programmes name this product at all. This is the number that decides whether a grower can ever meet it: the crop pages, the plan matrix, the shopping list and the PDFs are all generated from those rows, so a product in no plan appears in no plan tool anywhere on the site.'),
 ('p','ROWS — how many individual stage rows across all 28. A product in many plans but one row each is a product mentioned once a season; a product with several rows per plan is one the grower keeps meeting.'),
 ('p','SOIL-PICKABLE — how many crops can answer a soil-test reading with this product. Zero does not always mean neglected: sulfur and nitrogen are not tested soil parameters in VAN’s own five-band table, so Green Sulfur and Vital Urea can never be a soil responder however central they are. Vital Urea is also the target of the pH substitution, which this column does not count.'),
 ('sp',''),
 ('h2','The finding, in one line'),
 ('flag','TWO PRODUCTS APPEAR IN NO CROP PLAN AT ALL: V-Germinator Pro and SOP. Both are priced farmer brands with their own product pages, and neither can be reached through any crop programme, shopping list or plan PDF. A grower meets them only by browsing the product list.'),
 ('p','Two more appear in exactly one programme each: Fusion Phosphate (sunflower only) and V-Potash Plus (one plan). Your Fusion Phosphate ruling today changes that on its own — offered beside Green Phosphate, it goes from 1 programme to 25.'),
 ('sp',''),
 ('h2','What I am NOT doing with this'),
 ('p','Nothing. No product has been added to a plan, no stage changed, no band moved. Adding a product to a crop programme is agronomy and it is yours. The Gaps tab is where you write it: which crops, which stage, which band, which method. Send it back and I apply it.'),
]
r=1
for kind,text in lines:
    c=ws.cell(row=r,column=2,value=text)
    if kind=='h1': c.font=F(18,True,NAVY); ws.row_dimensions[r].height=26
    elif kind=='sub': c.font=F(10,False,'5B6770')
    elif kind=='h2': c.font=F(12,True,NAVY); ws.row_dimensions[r].height=20
    elif kind=='flag': c.font=F(10,True,RUST); c.fill=PatternFill('solid',fgColor='FBEAE7')
    else: c.font=F(10)
    c.alignment=Alignment(wrap_text=kind not in ('h1','h2','sub'),vertical='top')
    if kind=='sp': ws.row_dimensions[r].height=7
    r+=1

# ── Exposure
es=wb.create_sheet('Exposure'); es.sheet_view.showGridLines=False
H=['Product','Category','Plans (of 28)','Rows','Soil-pickable crops','Bands it sits in','Stages it appears at','Application methods','Which programmes name it']
W=[26,22,13,8,16,28,40,40,80]
for j,(h,w) in enumerate(zip(H,W),start=1):
    c=es.cell(row=1,column=j,value=h); c.font=F(10,True,'FFFFFF'); c.fill=PatternFill('solid',fgColor=NAVY)
    c.alignment=Alignment(vertical='center',wrap_text=True); c.border=BOX
    es.column_dimensions[get_column_letter(j)].width=w
es.row_dimensions[1].height=32; es.freeze_panes='B2'
r=2
for b in D:
    n=len(b['plans'])
    es.cell(row=r,column=1,value=b['name']).font=F(10,True,NAVY)
    es.cell(row=r,column=2,value=b['cat'])
    c=es.cell(row=r,column=3,value=n); c.alignment=Alignment(horizontal='center')
    c.font=F(11,True,RUST if n<=1 else (GOLD if n<=7 else GREEN))
    es.cell(row=r,column=4,value=b['rows']).alignment=Alignment(horizontal='center')
    es.cell(row=r,column=5,value=len(b['soilCrops'])).alignment=Alignment(horizontal='center')
    es.cell(row=r,column=6,value=', '.join(b['bands']) or '—')
    es.cell(row=r,column=7,value=', '.join(b['stages']) or '—')
    es.cell(row=r,column=8,value=', '.join(b['methods']) or '—')
    es.cell(row=r,column=9,value=' · '.join(b['planNames']) or 'none — it is in no crop programme')
    for j in range(1,10):
        cc=es.cell(row=r,column=j); cc.border=BOX
        if j>=6: cc.font=F(9,False,'5B6770')
        if j>=6: cc.alignment=Alignment(wrap_text=True,vertical='top')
        if n<=1: cc.fill=PatternFill('solid',fgColor='FBEAE7')
    es.row_dimensions[r].height=32
    r+=1
es.auto_filter.ref=f'A1:I{r-1}'

# ── Gaps — the fillable one
gs=wb.create_sheet('Gaps — your advice'); gs.sheet_view.showGridLines=False
GH=['Product','Where it stands now','WHICH CROPS','WHICH STAGE','WHICH BAND','METHOD / PLACEMENT','RATE per acre','YOUR NOTE']
GW=[26,46,34,26,22,26,20,44]
for j,(h,w) in enumerate(zip(GH,GW),start=1):
    c=gs.cell(row=1,column=j,value=h)
    c.font=F(10,True,'FFFFFF' if j<3 else NAVY)
    c.fill=PatternFill('solid',fgColor=NAVY if j<3 else GOLD)
    c.alignment=Alignment(vertical='center',wrap_text=True); c.border=BOX
    gs.column_dimensions[get_column_letter(j)].width=w
gs.row_dimensions[1].height=32; gs.freeze_panes='C2'

# Only the ones that are actually thin. Everything at 9 programmes or more is already reachable.
GAPS=[b for b in D if len(b['plans'])<=9]
r=2
for b in GAPS:
    n=len(b['plans'])
    where = ('In NO crop programme at all — a grower can only meet it by browsing the product list.'
             if n==0 else
             f"In {n} programme{'s' if n>1 else ''}: {' · '.join(b['planNames'])}. {b['rows']} row{'s' if b['rows']>1 else ''} in total.")
    if b['slug']=='fusion-phosphate':
        where += ' Your 9 Sep ruling now offers it beside Green Phosphate on 25 programmes, so this one is already answered.'
    gs.cell(row=r,column=1,value=b['name']).font=F(10,True,NAVY)
    w=gs.cell(row=r,column=2,value=where); w.font=F(9,False,'5B6770'); w.alignment=Alignment(wrap_text=True,vertical='top')
    for j in range(3,9):
        c=gs.cell(row=r,column=j); c.fill=PatternFill('solid',fgColor=YELLOW); c.font=F(10)
        c.alignment=Alignment(wrap_text=True,vertical='top')
    for j in range(1,9): gs.cell(row=r,column=j).border=BOX
    if n<=1:
        gs.cell(row=r,column=1).fill=PatternFill('solid',fgColor='FBEAE7')
    gs.row_dimensions[r].height=46
    r+=1
last=r-1

# Drop-downs so a stage or a band is picked, not typed — the plans only recognise these exact strings.
lists=wb.create_sheet('Lists'); lists.sheet_state='hidden'
lists.cell(row=1,column=1,value='Drop-down sources. Generated; do not edit.').font=F(9,italic=True)
STAGES=sorted({s for b in D for s in b['stages']}) or ['Land Preparation']
BANDS=sorted({s for b in D for s in b['bands']})
METHODS=sorted({s for b in D for s in b['methods']})
for col,(hdr,vals) in enumerate([('Stages',STAGES),('Bands',BANDS),('Methods',METHODS),('Crops',ALLCROPS)],start=1):
    lists.cell(row=2,column=col,value=hdr).font=F(9,True)
    for k,v in enumerate(vals,start=3): lists.cell(row=k,column=col,value=v)
for col,target in ((1,'D'),(2,'E'),(3,'F'),(4,'C')):
    L=get_column_letter(col); n=2+len([STAGES,BANDS,METHODS,ALLCROPS][col-1])
    dv=DataValidation(type='list',formula1=f"=Lists!${L}$3:${L}${n}",allow_blank=True,showDropDown=False)
    dv.prompt='Pick one, or type your own if none fits.'; dv.showErrorMessage=False
    gs.add_data_validation(dv); dv.add(f'{target}2:{target}{last}')
gs.auto_filter.ref=f'A1:H{last}'
gs.cell(row=last+2,column=1,value='One line per product. A product can go into several crops — write them all in WHICH CROPS, or add rows.').font=F(9,italic=True,color='5B6770')

for sheet in (ws,es,gs):
    sheet.page_setup.orientation='landscape'; sheet.page_setup.fitToWidth=1; sheet.page_setup.fitToHeight=0
    sheet.sheet_properties.pageSetUpPr.fitToPage=True
es.print_title_rows='1:1'; gs.print_title_rows='1:1'
wb.save('/home/claude/xl/Product exposure — what a farmer never meets.xlsx')
print('saved', len(GAPS), 'gap rows')
