# Builds 'Dealer list — please fill, 9 Sep 2026.xlsx'. Seven rows, plain fields, drop-downs where
# a wrong answer would cost a rebuild. Regenerate: python3 tools/dealer-template-xlsx.py
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

NAVY='0E3550'; GOLD='E3A93C'; SAND='FBF7EE'; SAND2='F2EEE4'; YELLOW='FFF2CC'; GREY='F2F4F5'; RUST='C0392B'
A='Arial'
def F(sz=10,b=False,color='000000',italic=False): return Font(name=A,size=sz,bold=b,color=color,italic=italic)
thin=Side(style='thin',color='D9D9D9'); BOX=Border(left=thin,right=thin,top=thin,bottom=thin)

wb=Workbook()

ws=wb.active; ws.title='Read me'
ws.sheet_view.showGridLines=False
ws.column_dimensions['A'].width=3; ws.column_dimensions['B'].width=104
rows=[
 ('h1','Your seven dealers'),
 ('sub','Vital Agri Nutrients · van.com.pk · 9 September 2026'),
 ('sp',''),
 ('p','I read these off O2S Customer Master myself on 9 September 2026. Nothing in O2S was changed — every record was opened, read and cancelled.'),
 ('p','SEVEN dealers: the six Confirmed, plus Arain Traders in Tando Allahyar. That is the list you sent and it matches what you said at the start — six or seven.'),
 ('p','O2S holds an EIGHTH record, Zaem Trader Multan, and you did not send it. It sits at the bottom of the sheet in pink, held back, not in the list. Say the word if it belongs and I will move it up.'),
 ('p','Your export matched my reading field for field on all six — same codes, names, cities, regions and phone numbers. Nothing to reconcile.'),
 ('p','Grey cells are from O2S. Only the yellow ones are left for you, and there are two: "Publish the phone?" and "Carries".'),
 ('sp',''),
 ('h2','Two things I could not settle, and one of them matters'),
 ('p','ARAIN TRADERS HAS NO PHONE NUMBER. Empty in O2S and empty in what you sent, so it is real rather than a gap in my reading. Their row will route through VAN\u2019s WhatsApp unless you have a number to add.'),
 ('p','COVERAGE, AND THE PAGE SHOULD NOT HIDE IT. Seven dealers: Jhang, Kot Addu, Chiniot, Lahore and Kasur in Punjab, and two in Tando Allahyar in Sindh. A farmer in Faisalabad, Sargodha, Multan, Bahawalpur, Rahim Yar Khan or DG Khan has nobody near him. That is the argument for listing six plainly and offering a real next step, instead of a search box that returns nothing.'),
 ('p','PHONE NUMBERS ARE CLEARED. You confirmed on 9 September that all dealers have already agreed, so the six numbers go on the page as published numbers. Arain Traders has none on record and routes through VAN\u2019s WhatsApp instead.'),
 ('sp',''),
 ('h2','Why a file and not a system'),
 ('p','At seven dealers there is no backend to build. The list becomes a data file inside the website, exactly like the 28 crop plans and the 33 products already are. Changing a dealer means changing a row and rebuilding, which takes minutes and costs nothing to run.'),
 ('p','That holds to roughly a hundred dealers. Past that, or when dealers want to edit their own listing, it becomes a real system — and it should be the same one the lab submissions and the enquiry form need, not a separate one.'),
 ('sp',''),
 ('h2','What the page will look like'),
 ('p','Not a search box and a map. With seven dealers a search box mostly returns nothing, and the nothing tells a farmer the network is thin. Instead: all seven listed plainly, name, district, area covered, phone. He reads seven lines and finds himself or he does not.'),
 ('p','Where he does not, the page says so and offers the useful thing: send us your district and we will tell you who is nearest, or deliver. A gap becomes an enquiry instead of a dead end.'),
 ('sp',''),
 ('h2','The one column that is a business decision, not a detail'),
 ('p','"Publish the phone?" — some dealers will not want their mobile number on a public website. Anyone marked No is still listed, but their row routes through VAN’s own WhatsApp number instead of showing theirs. Ask them before you answer for them.'),
 ('sp',''),
 ('h2','If you only have five minutes'),
 ('p','Fill Business name, City, District and Phone. The rest can follow. Four columns is enough to build the page.'),
]
r=2
for kind,txt in rows:
    c=ws.cell(row=r,column=2,value=txt)
    if kind=='h1': c.font=F(20,True,NAVY)
    elif kind=='sub': c.font=F(10,False,'5B6770')
    elif kind=='h2': c.font=F(12,True,NAVY)
    elif kind=='p': c.font=F(10); c.alignment=Alignment(wrap_text=True,vertical='top'); ws.row_dimensions[r].height=max(15,14*(len(txt)//95+1))
    r+= 1 if kind!='sp' else 1
ws.sheet_properties.tabColor=NAVY

ws=wb.create_sheet('Dealers')
ws.sheet_view.showGridLines=False
HEAD=[('O2S code',18),('Business name',26),('City',16),('Region',12),('Ships to / destination',20),
      ('Contact person',20),('Phone',18),('Publish the phone?',18),('Carries',20),('From O2S',38)]
for i,(h,w) in enumerate(HEAD,start=1):
    c=ws.cell(row=1,column=i,value=h)
    c.font=F(10,True,'FFFFFF'); c.fill=PatternFill('solid',fgColor=NAVY)
    c.alignment=Alignment(wrap_text=True,vertical='center'); c.border=BOX
    ws.column_dimensions[chr(64+i) if i<=26 else 'A'].width=w
ws.row_dimensions[1].height=30
ws.freeze_panes='A2'

yes_no=DataValidation(type='list',formula1='"Yes,No,Ask them"',allow_blank=True)
carries=DataValidation(type='list',formula1='"Full range,Part of the range,Not sure"',allow_blank=True)
ws.add_data_validation(yes_no); ws.add_data_validation(carries)

DATA = [('DLR-PB-JHN-001', 'Kissan Zarai Merkaz', 'Jhang', 'Punjab', 'Jhang', 'Rana Shahab', '0300 3503000', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-PB-KTA-002', 'Ubaid Agro Traders', 'Kot Addu', 'Punjab', '', 'Ch Abdul Zahoor', '0300 7486986', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-SN-TAY-003', 'Ghfar Zari Merkaz', 'Tando Allahyar', 'Sindh', '', 'Saim Sagheer', '0300 3241663', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-PB-CNT-004', 'Chiniot Agri Center', 'Chiniot', 'Punjab', '', 'Nafay Arabi', '0307 6666513', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-PB-LHR-005', 'Bilal & co', 'Lahore', 'Punjab', '', 'Muhammad Bilal', '0322 4604653', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-PB-KSR-006', 'Afaq Zari Merkaz', 'Kasur', 'Punjab', '', 'Saadat Munir', '0322 4991479', 'YES - agreed', '', 'Exclusive · Confirmed'), ('DLR-SN-TAN-008', 'Arain Traders', 'Tando Allahyar', 'Sindh', 'Tando Allah Yar', 'Muhammad Afzal', 'NO PHONE ON RECORD', 'n/a - no number', '', 'Exclusive · Active'), ('DLR-PB-MUL-007', 'Zaem Trader', 'Multan', 'Punjab', 'Khanewal', 'Rao Waqar', '0300 6883688', 'HELD - you did not send it', '', 'Inclusive · Active · NOT in your list')]
for i,rowvals in enumerate(DATA, start=2):
    for col,val in enumerate(rowvals, start=1):
        c=ws.cell(row=i,column=col,value=val or None); c.border=BOX; c.font=F(10)
        # Pulled from O2S = grey and settled. Yours to answer = yellow.
        c.fill=PatternFill('solid',fgColor=(YELLOW if col in (8,9) else GREY))
        c.alignment=Alignment(wrap_text=True,vertical='top')
        if col==7 and val=='NO PHONE IN O2S': c.font=F(10,True,RUST)
        if i>7: c.fill=PatternFill('solid',fgColor='FDE9E7')  # the two you did not send
    yes_no.add(ws.cell(row=i,column=8)); carries.add(ws.cell(row=i,column=9))
    ws.row_dimensions[i].height=30
for row in range(len(DATA)+2, len(DATA)+5):
    for col in range(1,11):
        c=ws.cell(row=row,column=col); c.border=BOX; c.font=F(10)
        c.fill=PatternFill('solid',fgColor=YELLOW); c.alignment=Alignment(wrap_text=True,vertical='top')
    yes_no.add(ws.cell(row=row,column=8)); carries.add(ws.cell(row=row,column=9))
    ws.row_dimensions[row].height=30

note=ws.cell(row=len(DATA)+6,column=1,value='Grey cells came straight out of O2S Customer Master on 9 Sep 2026 — read, not typed, and nothing in O2S was changed. Yellow cells are yours. Three blank rows because lists grow. Nothing goes on the website until you say so.')
note.font=F(9,False,'5B6770',italic=True)
ws.merge_cells(start_row=len(DATA)+6,start_column=1,end_row=len(DATA)+6,end_column=10)
ws.sheet_properties.tabColor=GOLD

wb.save('/mnt/user-data/outputs/Dealer list — please fill, 9 Sep 2026.xlsx')
print('written')
