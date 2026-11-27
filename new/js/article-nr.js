/* "The cost of low nitrogen use efficiency in Pakistan": the 12 charts of source/src/components/NitrogenCharts.tsx,
   ported on 26 Nov 2026. Every sentence, figure and calculation is copied unchanged; the data below is
   source/src/data/nitrogenReport.ts as published. Only the colours of the frame follow the site palette. */
(function () {
  'use strict';
  if (!window.KCharts) return;
  var K = window.KCharts, esc = K.esc, src = K.src;
  var NR = {"HA_PER_ACRE":0.40468564224,"NR_FERT_HARVEST":{"China (mainland)":{"fert":[2000,22139.2,22422.7,25040.9,25198.3,26232.2,26636.8,27244.5,27982,28390.8,28961.3,29531.8,30131.1,30632.1,30800.7,30981.7,30795.5,30387.9,29545,28141.5,26737.7,25741.9,25099.7,24437.4,24545.1],"harvest":[2000,11423,11509.2,11711.1,11329.7,12330.6,12503.4,12874.8,13093.8,13872.5,13774.2,13995.7,14617.6,14999.8,15130.8,15267.2,15931.3,15844.8,16190,16299.2,16873.9,16839.9,16931.4,17288.3,17424.9]},"Bangladesh":{"fert":[2000,995.8,1058.2,1064.5,1020.2,1063.8,1076.2,1135.5,1167.8,1230.2,1152.6,1202.1,1198.6,1121,1122.3,1275.7,1289.2,1190.5,1245.6,1325.6,1331.9,1378.2,1530.6,1410.9,1489.8],"harvest":[2000,592.2,573,587.3,597,569.1,637.6,635.5,672,726.1,735.5,769.7,787.6,791.6,816.3,837.7,847.2,834.4,896.8,897.4,900.7,917.4,949.4,968.6,997]},"European Union":{"fert":[2000,9015.5,9017.1,8735.7,9061.2,8773.3,8503.2,8467.1,9104.3,8058.9,7859.5,8532.2,8280,8596.7,8858.5,9050.2,9203,9293.7,9374.6,8956.5,8886.7,8707.1,8305.9,7572.6,7618.2],"harvest":[2000,6458.4,6590.5,6603.6,5843.3,7413.4,6666.2,6306.6,6193,7107.8,6983.3,6614.5,6774.4,6544,7127.8,7632.2,7371.2,7117.6,7464.9,6941,7338.1,7104.1,7380.4,6893.8,6892.3]},"India":{"fert":[2000,9823.9,10178.4,9422.3,9969.7,10542.4,11451.2,12390.7,12976.5,13479.3,14013.3,14854,15600.5,15138.8,15084.7,15254.3,15634.7,15061.5,15262.7,15869.7,17084.4,18363.6,17517.2,18185.7,18410.8],"harvest":[2000,7231.3,7346.5,6613.4,7458.4,7265.2,7599.3,8022.8,9061.6,8878.6,8494.1,9520.9,10124.5,10335,10529.9,10508.2,9867.7,10448.5,10889.2,11257.5,11555.8,11685.4,12207.9,12410.2,13009.8]},"Pakistan":{"fert":[2000,2264.6,2288.4,2367.1,2491.5,2677.6,2872.7,2759.3,2819.7,2981.5,3464.1,3206.6,3198,2851.9,3208.2,3226.1,2916.3,3485.8,3440.8,3427.3,3458.1,3621.1,3731.4,3635.2,3792.1],"harvest":[2000,1139.9,1058.5,1054.4,1108.5,1262.7,1249.2,1216.8,1289.9,1304.7,1344.2,1243.9,1397.1,1334.8,1426.6,1465.9,1348.3,1425.7,1522.2,1380.2,1369.3,1427.4,1564.2,1419.6,1656.3]}},"NR_HARVEST_HA_2023":{"Pakistan":53.4,"Bangladesh":113.3,"Egypt":152.5,"China (mainland)":136.6,"India":77.3,"World":67.3,"European Union":62.9,"United States":89},"NR_INPUT_HA_2023":{"Pakistan":183.4,"Bangladesh":281.4,"Egypt":338.2,"China (mainland)":288.6,"India":179.7,"World":121.6,"European Union":117.4,"United States":124.6},"NR_LASSALETTA":{"Pakistan":[1961,50.6,52.92,52.4,48.62,52.08,46.97,45.79,50.17,46.4,49.28,46.12,44.62,46.68,44.39,38.28,35.92,37.84,30.99,34.76,33.59,34.99,32.77,30.05,34.34,33.44,32.64,32.63,31.58,31.34,32.39,36.94,29.7,28.12,27.23,28.84,27.42,25.94,27,28.23,28.66,26.56,25.12,25.27,29.02,27.45,25.46,26.51,24.52,23.71,22.55,24.77,24.76,22.63,26.72],"Bangladesh":[1961,30.1,27.25,29.99,28.59,28.02,25.68,27.47,27.69,27.84,26.09,25.19,23.15,26.46,26.91,26.82,25.11,25.39,24.72,23.61,27.81,28.25,27.1,27.37,26.13,27.29,25.21,24.14,23.17,23.47,23.61,22.57,22.79,22.52,20.07,19.18,19.72,21.15,22.34,23.07,24.79,23.22,23.35,25.29,24.18,25.47,24.54,26.61,25.41,26.97,28.16,27.33,29.5,30.74,27.99]},"NR_NUE":{"Pakistan":[1961,53.98,58.91,59.9,55.78,60.04,56.46,53.72,58.02,56.25,60.51,55.14,51.98,54.67,53.32,46.02,44.5,46.47,38.93,40.23,39.91,42.8,40.29,38.36,41.37,38.81,37.23,39.58,37.31,37.04,38.57,41.88,35.55,34.51,33.75,34.31,32.87,30.16,33.06,34.38,34.44,31.91,30.75,30.49,33.24,30.9,30.5,31.54,30.62,28.17,27.45,30.54,31.47,30.45,31.32,30.7,28.38,30.21,27.4,26.8,26.61,28.29,26,29.14],"Bangladesh":[1961,48.21,44.27,48.75,47.39,47.12,44.01,47.05,46.95,46,43.8,43.17,38.29,42.94,44.58,43.39,39.87,39.64,38.82,36.77,41.81,42.23,40.47,40.58,38.62,40.34,37.24,35.41,33.65,33.47,34.4,32.22,32.52,32.05,28.49,26.74,27.35,28.81,30.08,31.56,33.98,31.81,32.04,33.58,31.25,34.12,33.11,34.18,35.48,36.97,37.45,38.49,40.14,41.3,38.82,38.82,40.03,41.34,39.62,39.73,39.54,37.94,40.47,40.27],"Egypt":[1961,71.52,83.86,75.38,68.53,63.9,71.23,70.36,66.38,64.86,62.03,64.69,59.67,62.84,57.31,50.95,50.72,45.71,46.27,47.09,44.08,41.96,39.33,39.52,40.06,39.47,33.15,33.61,34.07,36.63,42.37,42.52,45.32,43.09,46.38,38.67,39.8,44.52,40.02,43.46,41.37,38.9,40.13,38.92,35.76,38.54,41.22,44.53,45.04,42.73,40.41,43.23,48.74,48.36,47.52,44.36,41.59,40.51,36.22,42.16,39.6,41.85,43.22,45.1],"China (mainland)":[1961,60.64,60.9,62.99,62.63,60.78,57.7,63.6,60.74,56.58,56.7,57.06,51.29,53.06,57.59,52.18,52.89,42.48,40.44,38.63,34.67,37.59,39.51,39.86,40.12,39.53,40.1,35.58,32.63,32.33,34.84,34.29,33.94,37.64,35.72,31.67,31.52,34.31,34.65,33.15,34.32,34.3,32.27,31.05,32.66,32.62,33.14,33.16,34.36,33.48,33.58,34.74,35.18,35.58,35.93,37.73,37.86,39.42,41.1,44.31,44.76,45.78,47.07,47.32],"India":[1961,48.96,49.03,48.63,48.7,45.69,44.45,45.28,45.32,48.38,49.49,47.63,45.14,49.08,45.94,47.24,45.05,45.86,46.2,41.44,41.27,42.61,41.77,43.34,40.64,38.93,36.16,38.04,38.36,40.73,39.43,38.85,40.3,39.19,38.35,38.92,38.82,37.7,37.1,38.34,39.46,39.51,37.28,39.93,37.48,36.87,37.22,39.89,38.33,36.07,38.2,39.23,40.81,40.88,40.92,38.32,40.91,41.32,41.7,41.27,39.6,41.87,41.31,43.02],"World":[1961,54.61,54.8,53.36,54.52,52.23,51.98,50.99,50.61,49,47.96,48.69,45.73,46.99,46.15,43.72,44.85,43.51,44,41.91,40.06,42.13,43.33,40.21,41.84,42.43,41.59,40.28,38.56,40.63,42.9,42.95,44.79,44.56,45.97,43.42,44.24,46.05,45.72,45.47,46.58,47.46,46.11,46.02,48.4,48.17,47.39,48,51.12,49.02,49.18,50.17,49.38,51.39,52.8,52.97,53.53,54.63,54.31,54.98,53.59,55.06,55.39,55.33],"European Union":[1961,37.07,37.33,36.92,36.34,35.15,33.93,35.33,33.59,31.81,29.57,32.17,31.61,30.99,31.97,28.63,28.7,28.52,29.46,27.06,28.92,28.13,29.87,28.29,32.83,30.74,30.63,31.27,31.63,33.11,35.63,39.63,37.71,39.08,38.58,40.44,40.9,43.47,43.78,42.35,42.74,43.89,44.87,39.19,50.74,46.59,44.39,41.93,52.07,51.99,46.63,49.24,46.66,49.83,52.3,49.46,47.43,49.32,48.31,51.59,49.41,54.38,53.9,53.62],"United States":[1961,62.94,59.35,59.09,54.82,56.2,51.72,51.57,52.02,50.21,45.7,51.65,50.6,50.13,45.52,48.4,46.92,52.2,50.57,53.82,46.63,56.42,61.37,43.09,52.94,59.66,55.57,53.37,43.44,50.9,54.29,52.59,59.78,47.91,60.83,51.2,56.53,58.45,58.32,57.31,59.98,58.82,54.79,55.99,64.26,63.44,58.23,63.95,65.4,66,64.14,60.29,59.1,65.1,68.82,68.07,75.01,70.25,70.28,67.05,69.16,72.39,67.21,71.43]},"NR_PDF":"/downloads/The-Real-Price-of-Nitrogen-VAN.pdf","NR_PK":{"Mineral fertilizers":[1961,51.9,40.7,67.8,84.6,69.2,107.8,177.4,203.5,266.6,257.5,344,386.3,341.9,362.9,444.3,510.9,554.6,684.2,791.1,843.2,832.6,954.1,914.5,934.5,1128.1,1332.4,1280.5,1324.7,1467.6,1471.7,1462.7,1636.3,1659.3,1738.2,1991,1985.2,2087.6,2091.9,2218.1,2264.6,2288.4,2367.1,2491.5,2677.6,2872.7,2759.3,2819.7,2981.5,3464.1,3206.6,3198,2851.9,3208.2,3226.1,2916.3,3485.8,3440.8,3427.3,3458.1,3621.1,3731.4,3635.2,3792.1],"Manure applied":[1961,144.9,148.3,152,155.6,159.6,170.3,173,175.7,178.6,181.8,185.2,189.5,195.7,202.2,209.3,216.9,224.6,232.7,241.3,238,246.3,252.6,259.4,266,273.1,300.8,307.7,316,322.5,329.3,349.7,358.8,371.2,392.4,413.6,427.7,442.2,429,439.8,448.7,460.2,478.1,492,503.4,515.8,566.4,587.8,610.7,634.9,648.8,687.7,715.9,734.8,766,799,832.6,874.1,914.3,956.6,1001.8,1050.2,1101.6,1156.8],"Atmospheric deposition":[1961,141,143.3,145.3,149.4,155.5,158.3,160.6,161.1,155.7,158.5,149.1,150.1,157.1,158.1,167.6,172.4,180.5,193.3,203.6,208.1,214.9,236.6,226.4,239,249.6,258.4,268.2,269.1,286.4,249.3,294.2,310.7,326.3,338.5,361.1,371.2,463.6,428.5,374.5,362.9,365.7,372.8,404.6,375.5,398.3,434.7,418.7,413,413.6,446.1,450.7,459,475.3,450.2,440.4,472.3,478.4,479,475.2,486.8,487.8,491,491],"Biological fixation":[1961,133.8,136.6,145.1,139.6,145.4,136.1,151.9,139.5,134.2,131.4,132.1,134.1,138.2,156.4,148.5,162.6,170.8,168.8,170.4,143.5,144.7,152.9,162.2,167.9,166.6,169.4,165.3,146.3,180.2,179.8,175.8,167.7,159.3,163.6,179.9,188.3,182.9,197.9,196,175.7,156.7,155.1,189.4,181.7,196.4,170.5,199.5,189.8,196.6,170,172,150.6,197,168.5,167.8,161.3,169,155.3,167.7,188.3,181.2,166.2,175],"Seed":[1961,20.8,22.9,24.7,23.8,25.3,27.8,27.7,26.9,28.3,30.6,28.9,27.7,28.7,29.6,29,31,36.2,37.2,35.9,37.2,39.3,41.1,40,40.9,40,41.1,44.4,41.8,43.9,44.1,44,45.9,48.6,50.8,54.7,54.2,51.3,57.8,57.2,57.9,46.2,55.5,58.7,60.7,59.9,58.7,64.7,66.2,62.9,60.5,66,64.2,70.2,69.3,69.1,71.4,76,61.7,52.5,66.1,77.7,66.3,69.9],"Input":[1961,492.4,491.8,534.9,553,555,600.3,690.5,706.6,763.5,759.9,839.3,887.7,861.6,909.2,998.7,1093.9,1166.7,1316.2,1442.3,1469.9,1477.8,1637.3,1602.6,1648.3,1857.4,2102.2,2066,2097.8,2300.7,2274.3,2326.5,2519.4,2564.7,2683.4,3000.4,3026.5,3227.6,3205.1,3285.6,3309.7,3317.2,3428.6,3636.2,3798.9,4043.1,3989.5,4090.5,4261.2,4772,4532.1,4574.4,4241.6,4685.5,4680.2,4392.5,5023.4,5038.3,5037.6,5110.1,5364.1,5528.3,5460.3,5684.7],"Crop harvest removal":[1961,265.8,289.7,320.4,308.5,333.2,339,371,410,429.5,459.8,462.8,461.4,471.1,484.8,459.6,486.8,542.2,512.5,580.2,586.6,632.5,659.7,614.7,681.8,720.8,782.7,817.8,782.8,852.2,877.3,974.3,895.8,885,905.7,1029.4,994.9,973.5,1059.7,1129.7,1139.9,1058.5,1054.4,1108.5,1262.7,1249.2,1216.8,1289.9,1304.7,1344.2,1243.9,1397.1,1334.8,1426.6,1465.9,1348.3,1425.7,1522.2,1380.2,1369.3,1427.4,1564.2,1419.6,1656.3],"Crop residue removal":[1961,154.3,158.8,165.7,165.2,173.3,176.2,185.5,213.1,213.7,222.8,224.4,233,244.3,233,238,239.7,253.5,242,267.9,286.7,291.8,308.7,273.8,306.2,321,338.9,339.8,331.2,345.7,349.3,383.6,355.3,350.8,348.8,389.6,374.5,379,398.2,421.3,439,416.4,417,418.1,458.3,458,447.8,460,435,455.5,434.8,509.8,502.5,538.4,553.3,519.2,568.1,610.9,609.3,601.2,638.8,679.3,638.6,724.1],"Volatilisation":[1961,56,56.8,65.9,71.9,68.6,83.4,105.1,113.8,135.4,130,158.7,172.7,161.3,169.5,195.8,218.4,233.6,275.1,305.1,324.5,323.7,362,352.1,360.2,420.4,490,476.8,492.1,537,540.3,543.8,598.5,609.2,639.1,721.4,723.8,758.9,756.3,797.4,814,825.6,858.9,884.4,922.1,1000.4,1030.6,990.5,1061.6,1226,1175.8,1162.5,1070,1192.3,1171.6,1187.8,1222.4,1296.3,1308.4,1338.6,1360.7,1429.5,1430.5,1489.7],"Leaching":[1961,33.1,33.8,37.2,39.5,38.8,44.8,52.3,55.5,63,61.5,71.4,76.5,73.3,76.7,86.2,94.5,100.3,115,125.8,132,132.5,145.9,143.3,146.7,167.4,193.4,189.7,195.6,211.3,213,216.2,235.4,240.2,252.3,281.8,284,297.2,295,309.8,316.2,321.2,334.1,344,357.7,385,400.2,389,414.9,472.2,456.8,456.3,428.3,470.9,467.1,475.8,490.7,519.5,527.6,541.9,553.7,581.5,587,612.2],"Nutrient balance":[1961,226.6,202.1,214.5,244.6,221.8,261.4,319.6,296.6,334,300.1,376.5,426.3,390.5,424.4,539,607.1,624.6,803.7,862,883.3,845.2,977.6,987.8,966.4,1136.6,1319.4,1248.2,1315.1,1448.5,1397,1352.2,1623.7,1679.7,1777.7,1971,2031.6,2254.1,2145.4,2155.8,2169.8,2258.7,2374.2,2527.7,2536.3,2793.9,2772.7,2800.5,2956.5,3427.8,3288.2,3177.2,2906.8,3258.9,3214.3,3044.2,3597.7,3516.1,3657.4,3740.8,3936.7,3964.1,4040.7,4028.3]},"NR_RANK":[["Spain",1.43,26.828],["Pakistan",5.68,29.137],["Uzbekistan",1.23,35.305],["Iran",1.53,37.719],["Viet Nam",2.45,38.998],["Thailand",2.79,39.218],["Bangladesh",2.48,40.269],["Italy",1.03,41.962],["India",30.24,43.021],["Egypt",1.37,45.1],["United Kingdom",1.22,45.348],["China (mainland)",36.82,47.319],["Mexico",2.13,49.094],["Myanmar",1.39,51.37],["Indonesia",4.93,53.655],["Türkiye",2.33,54.773],["Canada",4.03,56.526],["Ethiopia",1.13,59.28],["France",2.62,59.602],["Poland",1.41,60.847],["Argentina",3.94,67.767],["Germany",1.6,68.495],["United States",19.28,71.431],["Brazil",19.78,73.088],["Philippines",1.03,74.851],["Russian Federation",5.33,75.69],["Australia",2.44,80.335],["Nigeria",1.55,93.364],["Ukraine",1.77,102.747]],"NR_RATIO":{"Pakistan":[26.1,1.2,122.9,32.1,1.5],"India":[40.6,9.2,121.5,49.4,11.2],"Bangladesh":[69.1,37,170.3,117.6,63],"China":[38.2,35.9,192.4,73.4,69.1],"Egypt":[18.8,10.7,314.6,59.1,33.8],"World":[37.8,34.1,67.7,25.6,23.1],"United States":[40.2,42,59.1,23.7,24.8]},"NR_SURPLUS_HA":{"Pakistan":[68.5,130],"Bangladesh":[130.8,168.1],"Egypt":[211.8,185.7],"China (mainland)":[168.1,152.1],"India":[65.2,102.4],"World":[49.2,54.3],"European Union":[70.7,54.4],"United States":[38.7,35.6]}};
  var NR_NUE = NR.NR_NUE, NR_PK = NR.NR_PK, NR_RANK = NR.NR_RANK, NR_SURPLUS_HA = NR.NR_SURPLUS_HA, NR_FERT_HARVEST = NR.NR_FERT_HARVEST,
      NR_LASSALETTA = NR.NR_LASSALETTA, NR_RATIO = NR.NR_RATIO, HA_PER_ACRE = NR.HA_PER_ACRE;
  var NAVY = '#1F3A5F', RED = '#B42318', MUTED = '#4B5148', RULE = 'rgba(23,26,22,0.16)', GREEN = '#2D5A3C', GREY = '#9AA39C', INK = '#171A16';
  function at(s, y) { if (!s) return null; var i = y - s[0] + 1; return i >= 1 && i < s.length ? s[i] : null; }
  function f1(v, d) { d = d == null ? 1 : d; return v == null ? 'no data' : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  var RATE = { pk: at(NR_NUE.Pakistan, 2023) };
  function head(h4, cap) { return '<div class="k-row k-row--between"><h4>' + h4 + '</h4>' + (cap ? '<span class="k-cap">' + cap + '</span>' : '') + '</div>'; }
  function svg(W, H, label, body, mt) { return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%"' + (mt === false ? '' : ' style="margin-top:10px"') + ' role="img" aria-label="' + esc(label) + '">' + body + '</svg>'; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' font-size="' + (o.fs || 12) + '"' + (o.fw ? ' font-weight="' + o.fw + '"' : '') + ' fill="' + (o.fill || MUTED) + '">' + s + '</text>'; }
  function tip(html) { return ' data-tip="' + esc(html) + '"'; }
  function yearsTo(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }

  /* 1 · NUE 1961 to 2023 */
  var PEERS = [['Bangladesh', '#C9731F'], ['Egypt', '#7A5AC8'], ['China (mainland)', '#1B98A6'], ['European Union', '#2F6DB5'], ['United States', '#5B6670'], ['World', NAVY]];
  K.mount('NUE, Pakistan and other countries, 1961 to 2023', 760, function (W, narrow, st) {
    if (!st.on) st.on = ['Bangladesh', 'Egypt', 'China (mainland)', 'World'];
    var H = Math.round(W * (narrow ? 0.9 : 0.5)), L = 36, R = narrow ? 46 : 150, T = 14, B = 30;
    var x = function (y) { return L + (y - 1961) / 62 * (W - L - R); }, y = function (v) { return T + (1 - v / 90) * (H - T - B); };
    var path = function (s) { var d = ''; for (var yr = 1961; yr <= 2023; yr++) { var v = at(s, yr); if (v == null) continue; d += (d ? 'L' : 'M') + x(yr).toFixed(1) + ' ' + y(v).toFixed(1); } return d; };
    var series = PEERS.filter(function (p) { return st.on.indexOf(p[0]) > -1; }).concat([['Pakistan', RED]]);
    var ends = series.map(function (s) { var v = at(NR_NUE[s[0]], 2023); return { n: s[0], c: s[1], v: v, ly: y(v) }; }).sort(function (a, b) { return a.ly - b.ly; });
    for (var i = 1; i < ends.length; i++) if (ends[i].ly - ends[i - 1].ly < 15) ends[i].ly = ends[i - 1].ly + 15;
    var b = '';
    [0, 20, 40, 60, 80].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(L - 6, y(g) + 4, g, { a: 'end' }) + '</g>'; });
    (narrow ? [1961, 1990, 2023] : [1961, 1970, 1980, 1990, 2000, 2010, 2023]).forEach(function (tt) { b += t(x(tt), H - 8, tt, { a: 'middle' }); });
    series.forEach(function (s) { b += '<path d="' + path(NR_NUE[s[0]]) + '" fill="none" stroke="' + s[1] + '" stroke-width="' + (s[0] === 'Pakistan' ? 3.5 : 2) + '" stroke-linejoin="round"/>'; });
    ends.forEach(function (e) { b += '<g><circle cx="' + x(2023) + '" cy="' + y(e.v) + '" r="' + (e.n === 'Pakistan' ? 5 : 3.5) + '" fill="' + e.c + '"/>' + t(x(2023) + 8, e.ly + 4, narrow ? (e.n === 'Pakistan' ? e.v.toFixed(1) : Math.round(e.v)) : e.n + ' ' + (e.n === 'Pakistan' ? e.v.toFixed(1) : Math.round(e.v)) + '%', { fs: 12.5, fw: e.n === 'Pakistan' ? 700 : 400, fill: e.c }) + '</g>'; });
    yearsTo(1961, 2023).forEach(function (yr) { b += '<rect x="' + (x(yr) - (W - L - R) / 124) + '" y="' + T + '" width="' + ((W - L - R) / 62) + '" height="' + (H - T - B) + '" fill="transparent"' + tip('<b>' + yr + '</b><br>' + series.map(function (s) { return s[0] + ': ' + f1(at(NR_NUE[s[0]], yr)) + '%'; }).reverse().join('<br>')) + '/>'; });
    return head('Pakistan’s NUE fell from 54% in 1961 to 29.1% in 2023', 'NUE, %') +
      '<div class="k-row k-chips">' + PEERS.map(function (p) { var on = st.on.indexOf(p[0]) > -1; return '<button type="button" class="k-chipbtn" aria-pressed="' + on + '" data-peer="' + esc(p[0]) + '" style="border-color:' + p[1] + ';background:' + (on ? p[1] : 'transparent') + ';color:' + (on ? '#fff' : INK) + '">' + p[0] + '</button>'; }).join('') + '</div>' +
      '<div class="k-chart__draw">' + svg(W, H, 'NUE, Pakistan and other countries, 1961 to 2023', b) + '</div>' +
      '<p class="k-small">Each line shows a country’s NUE in each year from 1961 to 2023. NUE counts the nitrogen added from all 5 sources: fertiliser, manure, rain and dust, legumes and seed. Select a name to show or hide that country. Pakistan is always shown.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release, nitrogen, 1961 to 2023. FAO marks these values as estimates. China is mainland China. Because NUE is a share, its value is the same per acre and per hectare.');
  }, function (fig, st, repaint) {
    fig.querySelectorAll('[data-peer]').forEach(function (btn) { btn.addEventListener('click', function () { var n = btn.getAttribute('data-peer'); st.on = st.on.indexOf(n) > -1 ? st.on.filter(function (z) { return z !== n; }) : st.on.concat([n]); repaint(); var again = fig.querySelector('[data-peer="' + n + '"]'); if (again) again.focus(); }); });
  });

  /* 2 · the 29 big users, 2023 */
  K.mount('NUE in 2023 for the 29 countries', 760, function (W, narrow) {
    var rows = NR_RANK, rowH = 21, T = 26, B = 26, L = narrow ? 108 : 150, R = 44, H = T + rows.length * rowH + B;
    var x = function (v) { return L + Math.min(v, 105) / 105 * (W - L - R); };
    var b = '<rect x="' + x(50) + '" y="' + (T - 4) + '" width="' + (x(90) - x(50)) + '" height="' + (rows.length * rowH + 4) + '" fill="' + GREEN + '" opacity="0.08"/>' +
      t((x(50) + x(90)) / 2, T - 9, narrow ? '50 to 90%' : 'EU Nitrogen Expert Panel range, 50 to 90%', { a: 'middle', fs: 11.5, fill: GREEN });
    [0, 25, 50, 75, 100].forEach(function (g) { b += '<g><line x1="' + x(g) + '" x2="' + x(g) + '" y1="' + (T - 4) + '" y2="' + (T + rows.length * rowH) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(x(g), H - 8, g, { a: 'middle' }) + '</g>'; });
    rows.forEach(function (r, i) {
      var n = r[0], mt = r[1], v = r[2], pk = n === 'Pakistan', yy = T + i * rowH;
      var nm0 = n === 'India' ? 'India (warning)' : n;
      var nm = narrow ? nm0.replace('China (mainland)', 'China').replace('United Kingdom', 'UK').replace('United States', 'USA').replace('Russian Federation', 'Russia') : nm0.replace('Russian Federation', 'Russia');
      b += '<g' + tip('<b>' + n + '</b><br>NUE ' + f1(v) + '%<br>' + f1(mt, 2) + ' million tonnes of nitrogen added') + '><rect x="0" y="' + yy + '" width="' + W + '" height="' + rowH + '" fill="transparent"/>' +
        t(L - 8, yy + 14.5, nm, { a: 'end', fs: 12.5, fw: pk ? 700 : 400, fill: pk ? RED : INK }) +
        '<rect x="' + L + '" y="' + (yy + 4) + '" width="' + (x(v) - L) + '" height="' + (rowH - 8) + '" fill="' + (pk ? RED : v > 90 ? '#C9A27A' : GREY) + '"/>' +
        t(x(v) + 5, yy + 14.5, pk ? v.toFixed(1) : Math.round(v), { fw: pk ? 700 : 400, fill: pk ? RED : MUTED }) + '</g>';
    });
    return head('Pakistan’s NUE of 29.1% was the 2nd lowest of the 29 countries that added 1 million tonnes of nitrogen or more to their cropland in 2023', 'NUE, 2023, %') +
      '<div class="k-chart__draw">' + svg(W, H, 'NUE in 2023 for the 29 countries that added 1 million tonnes of nitrogen or more', b) + '</div>' +
      '<p class="k-small">The countries are listed with the lowest NUE first. Hover over a bar to see how much nitrogen each country added in 2023. Brown bars mark an NUE above 90%, where the soil may be depleted. Above 100%, crops take out more nitrogen than is added.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). Countries listed by FAO name; China is mainland China. Range: EU Nitrogen Expert Panel 2015.');
  });

  /* 3 · where the 5.7 Mt came from and went, 2023 */
  K.mount('Nitrogen added to Pakistan\'s cropland in 2023, by source', 760, function (W) {
    var yr = 2023, v = function (k) { return at(NR_PK[k], yr) / 1000; };
    var added = [['Fertiliser', v('Mineral fertilizers'), RED], ['Manure', v('Manure applied'), '#C9731F'], ['Rain and dust', v('Atmospheric deposition'), '#A89F8C'], ['Legumes', v('Biological fixation'), GREEN], ['Seed', v('Seed'), '#5B6670']];
    var tot = v('Input'), harvest = v('Crop harvest removal'), resid = v('Crop residue removal'), air = v('Volatilisation'), water = v('Leaching');
    var went = [['Taken out in the harvested crop', harvest, NAVY], ['Straw and stalks taken off', resid, '#6E86A6'], ['Lost to the air', air, '#C9845F'], ['Lost to water', water, '#2F6DB5'], ['Not accounted for', tot - harvest - resid - air - water, '#D9D6CC']];
    var bar = function (parts) { var xx = 0, o = ''; parts.forEach(function (p) { var w = p[1] / tot * W; o += '<g><rect x="' + xx + '" y="0" width="' + w + '" height="44" fill="' + p[2] + '" stroke="#fff" stroke-width="1"/>' + (w > 44 ? t(xx + 6, 28, f1(p[1]), { fs: 13, fw: 700, fill: p[0] === 'Not accounted for' ? INK : '#fff' }) : '') + '</g>'; xx += w; }); return o; };
    var legend = function (parts, dp) { return '<div class="k-row k-small k-legend">' + parts.map(function (p) { return '<span class="k-key"><span style="width:10px;height:10px;background:' + p[2] + ';display:inline-block;border:1px solid rgba(0,0,0,.1)"></span>' + p[0] + ' ' + f1(p[1], 2) + ' (' + (p[1] / tot * 100).toFixed(dp || 0) + '%)</span>'; }).join('') + '</div>'; };
    return head('An estimated 2.1 million tonnes of the nitrogen added to Pakistan’s cropland in 2023 were lost to the air and to water', 'million tonnes of nitrogen, Pakistan, 2023') +
      '<div class="k-chart__draw"><p class="k-small"><b>Where the nitrogen came from</b></p>' + svg(W, 44, 'Nitrogen added to Pakistan\'s cropland in 2023, by source', bar(added), false) + legend(added) +
      '<p class="k-small"><b>Where the nitrogen went</b></p>' + svg(W, 44, 'Where the nitrogen added in 2023 went', bar(went), false) + legend(went, 1) + '</div>' +
      '<p class="k-small">The upper bar shows the sources of the nitrogen added in 2023. The lower bar shows where that nitrogen went. FAO estimates 4 of the items in the lower bar: the harvested crop, the air, water, and straw and stalks taken off the field. FAO’s NUE counts only the nitrogen taken out in the harvested crop. Straw and stalks taken off the field as fodder, fuel or bedding are a separate FAO estimate. “Not accounted for” is the nitrogen added minus the 4 other items. VAN calculated it by subtraction. The nitrogen not accounted for includes whatever stays in the soil and whatever is lost by routes that FAO does not list.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023): inputs, crop harvest removal, crop residue removal, volatilisation and leaching. “Not accounted for”: VAN calculation.');
  });

  /* 4 · 62 years of inputs against the harvest */
  K.mount('Nitrogen added to Pakistan\'s cropland by source and nitrogen taken out', 760, function (W, narrow) {
    var H = Math.round(W * (narrow ? 0.9 : 0.5)), L = 36, R = narrow ? 40 : 130, T = 14, B = 30;
    var x = function (yr) { return L + (yr - 1961) / 62 * (W - L - R); }, y = function (v) { return T + (1 - v / 6000) * (H - T - B); };
    var layers = [['Mineral fertilizers', 'Fertiliser', RED], ['Manure applied', 'Manure', '#C9731F'], ['Atmospheric deposition', 'Rain and dust', '#A89F8C'], ['Biological fixation', 'Legumes', GREEN], ['Seed', 'Seed', '#5B6670']];
    var yrs = yearsTo(1961, 2023);
    var cum = yrs.map(function (yr) { var s = 0; return layers.map(function (l) { return (s += at(NR_PK[l[0]], yr) || 0); }); });
    var area = function (j) { return yrs.map(function (yr, i) { return (i ? 'L' : 'M') + x(yr) + ' ' + y(cum[i][j]); }).join(' ') + ' ' + yrs.slice().reverse().map(function (yr, i) { return 'L' + x(yr) + ' ' + y(j ? cum[yrs.length - 1 - i][j - 1] : 0); }).join(' ') + ' Z'; };
    var harv = yrs.map(function (yr, i) { return (i ? 'L' : 'M') + x(yr) + ' ' + y(at(NR_PK['Crop harvest removal'], yr)); }).join(' ');
    var last = cum[cum.length - 1], b = '';
    [0, 2000, 4000, 6000].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(L - 6, y(g) + 4, g / 1000, { a: 'end' }) + '</g>'; });
    (narrow ? [1961, 1990, 2023] : [1961, 1970, 1980, 1990, 2000, 2010, 2023]).forEach(function (tt) { b += t(x(tt), H - 8, tt, { a: 'middle' }); });
    layers.forEach(function (l, j) { b += '<path d="' + area(j) + '" fill="' + l[2] + '" opacity="0.78"/>'; });
    b += '<path d="' + harv + '" fill="none" stroke="' + NAVY + '" stroke-width="3.2"/>';
    if (!narrow) b += t(W - R + 6, y(last[0] / 2) + 4, 'Fertiliser', { fill: RED, fw: 700 }) + t(W - R + 6, y((last[0] + last[1]) / 2) + 4, 'Manure', { fill: '#C9731F' }) + t(W - R + 6, y((last[1] + last[4]) / 2) + 4, 'Other') + t(W - R + 6, y(at(NR_PK['Crop harvest removal'], 2023)) + 16, 'Harvested crop', { fs: 12.5, fw: 700, fill: NAVY });
    yrs.forEach(function (yr, i) { b += '<rect x="' + (x(yr) - (W - L - R) / 124) + '" y="' + T + '" width="' + ((W - L - R) / 62) + '" height="' + (H - T - B) + '" fill="transparent"' + tip('<b>' + yr + '</b><br>Nitrogen added: ' + Math.round(cum[i][4]).toLocaleString('en-US') + ' thousand tonnes<br>of which fertiliser ' + Math.round(at(NR_PK['Mineral fertilizers'], yr)).toLocaleString('en-US') + ' thousand tonnes<br>Taken out in the harvested crop: ' + Math.round(at(NR_PK['Crop harvest removal'], yr)).toLocaleString('en-US') + ' thousand tonnes') + '/>'; });
    return head('From 1961 to 2023, fertiliser nitrogen rose to 73 times its 1961 level, against about 6 times for nitrogen taken out in the harvested crop', 'million tonnes of nitrogen a year, Pakistan') +
      '<div class="k-chart__draw">' + svg(W, H, 'Nitrogen added to Pakistan\'s cropland by source and nitrogen taken out in the harvested crop, 1961 to 2023', b) + '</div>' +
      '<p class="k-small">The coloured layers show the nitrogen added each year, by source. The navy line shows the nitrogen taken out in the harvested crop. The vertical distance between the top of the layers and the navy line is the nitrogen surplus as FAO counts it. FAO’s nitrogen surplus is the nitrogen added minus the nitrogen taken out in the harvested crop.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release, Pakistan, 1961 to 2023 (estimates).');
  });

  /* 5 · the real price */
  K.mount('Urea-price equivalent for each kg of nitrogen taken out', 760, function (W, narrow) {
    var rows = [['Pakistan', RATE.pk], ['Bangladesh', at(NR_NUE.Bangladesh, 2023)], ['Egypt', at(NR_NUE.Egypt, 2023)], ['China (mainland)', at(NR_NUE['China (mainland)'], 2023)], ['World', at(NR_NUE.World, 2023)], ['United States', at(NR_NUE['United States'], 2023)]];
    var rowH = 34, T = 8, L = narrow ? 104 : 150, R = 92, H = T + rows.length * rowH + 6;
    var x = function (v) { return L + v / 700 * (W - L - R); };
    var b = '<line x1="' + x(193) + '" x2="' + x(193) + '" y1="' + (T - 4) + '" y2="' + H + '" stroke="' + MUTED + '" stroke-dasharray="4 3"/>';
    rows.forEach(function (r, i) { var n = r[0], rr = r[1], v = 193 / (rr / 100), yy = T + i * rowH, pk = n === 'Pakistan';
      b += '<g>' + t(L - 8, yy + 20, narrow ? n.replace('China (mainland)', 'China').replace('United States', 'USA') : n + ', ' + (pk ? rr.toFixed(1) : Math.round(rr)) + '%', { a: 'end', fs: 12.5, fw: pk ? 700 : 400, fill: pk ? RED : INK }) +
        '<rect x="' + L + '" y="' + (yy + 6) + '" width="' + (x(v) - L) + '" height="' + (rowH - 12) + '" fill="' + (pk ? RED : GREY) + '"/>' + t(x(v) + 6, yy + 21, 'Rs ' + Math.round(v / 10) * 10, { fs: 13, fw: 700, fill: pk ? RED : INK }) + '</g>'; });
    return head('At the Rabi 2024-25 urea price, the urea-price equivalent would fall from about Rs 660 at Pakistan’s NUE to about Rs 350 at world NUE', 'Rs per kg of nitrogen taken out in the harvested crop, at the Rabi 2024-25 urea price') +
      '<div class="k-chart__draw">' + svg(W, H, 'Urea-price equivalent for each kg of nitrogen taken out in the harvested crop, at the 2023 NUE of each country', b) + '</div>' +
      '<p class="k-small">Each bar shows the urea-price equivalent for each kg of nitrogen taken out in the harvested crop, if Pakistan’s NUE matched that country’s NUE in 2023. Each value is the Rs 193 urea price divided by that country’s 2023 NUE. The dashed line marks the urea price of Rs 193 a kg of nitrogen. Values are rounded to the nearest Rs 10.</p>' +
      src('NFDC Annual Fertilizer Review 2024-25, Table 38 (nitrogen from urea, Rabi 2024-25, Rs 193 a kg); FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation. These equivalents are not prices that anyone pays.');
  });

  /* 6 · the illustrative national value, with a slider. The published chart has no drawing, so it is found by its title. */
  (function () {
    var h = [].slice.call(document.querySelectorAll('.k-chart h4')).filter(function (e) { return e.textContent.indexOf('At Bangladesh’s NUE, Pakistan would need about 936 thousand tonnes less nitrogen') === 0; })[0];
    if (!h) return;
    var fig = h.closest('.k-chart'), SALES = 3387, PRICE = 193, st = { t: at(NR_NUE.Bangladesh, 2023) };
    var marks = [['Bangladesh', at(NR_NUE.Bangladesh, 2023)], ['Egypt', at(NR_NUE.Egypt, 2023)], ['China', at(NR_NUE['China (mainland)'], 2023)], ['World', at(NR_NUE.World, 2023)]];
    /* the frame is built once, so the slider keeps working while it is dragged; only the figures change */
    fig.innerHTML = head('At Bangladesh’s NUE, Pakistan would need about 936 thousand tonnes less nitrogen for the same harvest, at 2024-25 sales') +
      '<label class="k-block k-small" for="nr-slider"><b class="nr-lab"></b></label>' +
      '<input id="nr-slider" type="range" min="29.5" max="60" step="0.1" value="' + st.t + '" style="width:100%;accent-color:' + GREEN + '">' +
      '<div class="k-row k-chips">' + marks.map(function (m) { return '<button type="button" class="k-chipbtn" aria-pressed="false" data-nue="' + m[1] + '">' + m[0] + ' ' + m[1].toFixed(1) + '%</button>'; }).join('') + '</div>' +
      '<div class="k-grid k-grid--3">' +
        '<div class="k-card k-card--soft"><div class="k-cap">Less nitrogen for the same harvest</div><div class="k-fig k-big nr-a"></div></div>' +
        '<div class="k-card k-card--soft"><div class="k-cap">Nitrogen not needed, at 2024-25 sales</div><div class="k-fig k-big nr-b"></div></div>' +
        '<div class="k-card k-card--soft"><div class="k-cap">Urea-price equivalent a year</div><div class="k-fig k-big nr-c"></div></div></div>' +
      '<p class="k-small nr-p"></p>' +
      src('NFDC Annual Fertilizer Review 2024-25, Tables 3 and 38; FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation.');
    var sl = fig.querySelector('#nr-slider'), q = function (c) { return fig.querySelector(c); };
    var paint = function () {
      var tt = st.t, saved = Math.max(0, SALES * (1 - RATE.pk / tt));
      q('.nr-lab').textContent = 'If Pakistan’s NUE rose from ' + RATE.pk.toFixed(1) + '% in 2023 to ' + tt.toFixed(1) + '%';
      fig.querySelectorAll('[data-nue]').forEach(function (b) { b.setAttribute('aria-pressed', String(Math.abs(tt - +b.getAttribute('data-nue')) < 0.05)); });
      q('.nr-a').textContent = Math.round((1 - RATE.pk / tt) * 100) + '%';
      q('.nr-b').textContent = Math.round(saved).toLocaleString('en-US') + ' thousand tonnes';
      q('.nr-c').textContent = 'Rs ' + Math.round(saved * PRICE / 1000) + ' billion';
      q('.nr-p').textContent = 'Move the slider or tap a country to choose an NUE. The nitrogen needed for the same harvest falls in inverse proportion to NUE. At an NUE of ' + tt.toFixed(1) + '%, the same harvest needs about ' + Math.round(RATE.pk / tt * 100) + '% of the nitrogen it needs at Pakistan’s NUE of ' + RATE.pk.toFixed(1) + '%. That share is ' + RATE.pk.toFixed(1) + ' divided by ' + tt.toFixed(1) + '. The calculation applies the reduction to the ' + SALES.toLocaleString('en-US') + ' thousand tonnes of nitrogen sold in 2024-25. It values the nitrogen not needed at Rs ' + PRICE + ' a kg, the Rabi 2024-25 urea price. The calculation assumes that every source of nitrogen falls in the same proportion. It also assumes that the harvest stays the same. The result is a measure of scale. It is not a forecast or a saving that any farmer is promised.';
    };
    sl.addEventListener('input', function () { st.t = +sl.value; paint(); });
    fig.querySelectorAll('[data-nue]').forEach(function (b) { b.addEventListener('click', function () { st.t = +b.getAttribute('data-nue'); sl.value = st.t; paint(); }); });
    paint();
  })();

  /* 7 · balance: P and K per 100 kg N */
  K.mount('Phosphate and potash used per 100 kg of nitrogen', 760, function (W, narrow) {
    var order = ['Pakistan', 'Egypt', 'Bangladesh', 'China', 'United States', 'World'], rowH = 40, T = 6, L = narrow ? 96 : 130, R = 50, H = T + order.length * rowH + 22;
    var x = function (v) { return L + v / 75 * (W - L - R); }, b = '';
    [0, 25, 50, 75].forEach(function (g) { b += '<g><line x1="' + x(g) + '" x2="' + x(g) + '" y1="' + T + '" y2="' + (T + order.length * rowH) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(x(g), H - 6, g, { a: 'middle' }) + '</g>'; });
    order.forEach(function (n, i) { var p = NR_RATIO[n][0], k = NR_RATIO[n][1], yy = T + i * rowH, pk = n === 'Pakistan';
      b += '<g>' + t(L - 8, yy + 22, narrow ? n.replace('United States', 'USA') : n, { a: 'end', fs: 12.5, fw: pk ? 700 : 400, fill: pk ? RED : INK }) +
        '<rect x="' + L + '" y="' + (yy + 6) + '" width="' + (x(p) - L) + '" height="13" fill="#C9731F"/>' + t(x(p) + 5, yy + 17, f1(p), { fs: 11.5 }) +
        '<rect x="' + L + '" y="' + (yy + 21) + '" width="' + Math.max(1.5, x(k) - L) + '" height="13" fill="' + (pk ? RED : '#7A5AC8') + '"/>' + t(Math.max(x(k), L + 2) + 5, yy + 32, f1(k), { fs: 11.5, fw: pk ? 700 : 400, fill: pk ? RED : MUTED }) + '</g>'; });
    return head('For every 100 kg of nitrogen in 2023, Bangladesh used 37 kg of potash and Pakistan used 1.2 kg', 'kg of phosphate (P₂O₅) and potash (K₂O) per 100 kg of nitrogen, 2023') +
      '<div class="k-chart__draw">' + svg(W, H, 'Phosphate and potash used per 100 kg of nitrogen in 2023', b) + '</div>' +
      '<p class="k-small">The <span style="color:#C9731F;font-weight:700">upper bar</span> for each country shows the phosphate (P₂O₅) used for every 100 kg of nitrogen. The <span style="color:#7A5AC8;font-weight:700">lower bar</span> shows the potash (K₂O) used for every 100 kg of nitrogen. Pakistan’s potash bar is red.</p>' +
      src('FAOSTAT, Fertilizers by Nutrient, agricultural use per hectare of cropland, via Our World in Data (2023); China as Our World in Data reports it. Ratios: VAN calculation. NFDC’s 2024-25 sales show the same pattern: 3,387 thousand tonnes of nitrogen, 919 of P₂O₅ and 44.5 of K₂O.');
  });

  /* 8 · China's turn, against Pakistan, indexed to 2015 */
  K.mount('Mainland China: fertiliser nitrogen', 760, function (W, narrow) {
    var panelW = narrow ? W : Math.floor((W - 24) / 2), H = Math.round(panelW * 0.72), L = 34, R = 56, T = 14, B = 28;
    var one = function (name, label) {
      var s = NR_FERT_HARVEST[name];
      var x = function (yr) { return L + (yr - 2010) / 13 * (panelW - L - R); }, y = function (v) { return T + (1 - (v - 60) / 80) * (H - T - B); };
      var base = function (k) { return (at(s[k], 2014) + at(s[k], 2015) + at(s[k], 2016)) / 3; };
      var line = function (k) { return yearsTo(2010, 2023).map(function (yr, i) { return (i ? 'L' : 'M') + x(yr) + ' ' + y(at(s[k], yr) / base(k) * 100); }).join(' '); };
      var end = function (k) { return Math.round((at(s[k], 2021) + at(s[k], 2022) + at(s[k], 2023)) / 3 / base(k) * 100); };
      var b = t(L, 11, label, { fs: 13, fw: 700, fill: name === 'Pakistan' ? RED : INK });
      [60, 80, 100, 120, 140].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (panelW - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="' + (g === 100 ? '0' : '2 3') + '"/>' + t(L - 5, y(g) + 4, g, { a: 'end', fs: 11 }) + '</g>'; });
      [2010, 2015, 2023].forEach(function (tt) { b += t(x(tt), H - 6, tt, { a: 'middle', fs: 11 }); });
      b += '<path d="' + line('fert') + '" fill="none" stroke="' + RED + '" stroke-width="2.6"/><path d="' + line('harvest') + '" fill="none" stroke="' + NAVY + '" stroke-width="2.6"/>' +
        t(x(2023) + 5, y(end('fert')) + 4, end('fert'), { fs: 11.5, fw: 700, fill: RED }) + t(x(2023) + 5, y(end('harvest')) + 4, end('harvest'), { fs: 11.5, fw: 700, fill: NAVY });
      return '<svg viewBox="0 0 ' + panelW + ' ' + H + '" width="100%" role="img" aria-label="' + esc(label + ': fertiliser nitrogen and nitrogen taken out in the harvested crop, average of 2014-16 = 100') + '">' + b + '</svg>';
    };
    return head('In 2021-23, mainland China took out 10% more nitrogen in its harvested crops than in 2014-16 with 20% less fertiliser nitrogen', 'index, average of 2014-16 = 100') +
      '<div class="k-chart__draw" style="display:grid;grid-template-columns:' + (narrow ? '1fr' : '1fr 1fr') + ';gap:24px">' + one('China (mainland)', 'Mainland China') + one('Pakistan', 'Pakistan') + '</div>' +
      '<p class="k-small">The <span style="color:' + RED + ';font-weight:700">red</span> line shows the fertiliser nitrogen applied to cropland. The <span style="color:' + NAVY + ';font-weight:700">navy</span> line shows the nitrogen taken out in the harvested crop. Each line is set to 100 at its 2014-16 average. The label at the end of each line is its 2021-23 average. In 2015, China set a target of zero growth in fertiliser use by 2020.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release (mineral fertilisers and crop harvest removal, nitrogen). The 2015 target: Yu, Li and Doluschitz 2020, Sustainability 12(17):7028. VAN calculation of the index.');
  });

  /* 9 · surplus per acre, 2000 and 2023 */
  K.mount('Nitrogen surplus per acre of cropland, 2000 and 2023', 760, function (W, narrow) {
    var order = ['Egypt', 'Bangladesh', 'China (mainland)', 'Pakistan', 'India', 'World', 'European Union', 'United States'];
    var rowH = 32, T = 22, L = narrow ? 100 : 140, R = 40, H = T + order.length * rowH + 24;
    var ac = function (v) { return v * HA_PER_ACRE; }, x = function (v) { return L + v / 90 * (W - L - R); }, nep = ac(80);
    var b = '<line x1="' + x(nep) + '" x2="' + x(nep) + '" y1="' + (T - 6) + '" y2="' + (T + order.length * rowH) + '" stroke="' + GREEN + '" stroke-dasharray="5 4"/>' + t(x(nep) + 4, T - 8, narrow ? '32' : 'EU panel upper limit, 32', { fs: 11.5, fill: GREEN });
    [0, 30, 60, 90].forEach(function (g) { b += '<g><line x1="' + x(g) + '" x2="' + x(g) + '" y1="' + T + '" y2="' + (T + order.length * rowH) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(x(g), H - 6, g, { a: 'middle' }) + '</g>'; });
    order.forEach(function (n, i) { var a = ac(NR_SURPLUS_HA[n][0]), bb = ac(NR_SURPLUS_HA[n][1]), yy = T + i * rowH + rowH / 2, pk = n === 'Pakistan', ind = n === 'India';
      b += '<g' + tip('<b>' + n + '</b><br>2000: ' + f1(a) + ' kg per acre (' + f1(NR_SURPLUS_HA[n][0]) + ' kg per hectare)<br>2023: ' + f1(bb) + ' kg per acre (' + f1(NR_SURPLUS_HA[n][1]) + ' kg per hectare)') + '><rect x="0" y="' + (yy - rowH / 2) + '" width="' + W + '" height="' + rowH + '" fill="transparent"/>' +
        t(L - 8, yy + 4, (narrow ? n.replace('China (mainland)', 'China').replace('European Union', 'EU').replace('United States', 'USA') : n) + (ind ? ' (warning)' : ''), { a: 'end', fs: 12.5, fw: pk ? 700 : 400, fill: pk ? RED : INK }) +
        '<line x1="' + x(a) + '" x2="' + x(bb) + '" y1="' + yy + '" y2="' + yy + '" stroke="' + (pk ? RED : GREY) + '" stroke-width="3"/>' +
        '<circle cx="' + x(a) + '" cy="' + yy + '" r="5" fill="#fff" stroke="' + (pk ? RED : MUTED) + '" stroke-width="2"/><circle cx="' + x(bb) + '" cy="' + yy + '" r="5.5" fill="' + (pk ? RED : MUTED) + '"/>' +
        t(x(Math.max(a, bb)) + 9, yy + 4, Math.round(bb), { fw: pk ? 700 : 400, fill: pk ? RED : MUTED }) + '</g>'; });
    return head('Pakistan’s nitrogen surplus nearly doubled from 2000 to 2023, from 28 to 53 kg per acre (68.5 to 130.0 kg per hectare)', 'nitrogen surplus, kg of nitrogen per acre of cropland') +
      '<div class="k-chart__draw">' + svg(W, H, 'Nitrogen surplus per acre of cropland, 2000 and 2023', b) + '</div>' +
      '<p class="k-small">The open dot marks 2000. The filled dot marks 2023 and carries the 2023 value. The green dashed line marks the EU Nitrogen Expert Panel’s upper limit for a desirable surplus, 32 kg per acre (80 kg per hectare). India is shown as a warning. Its surplus rose while a national fertiliser subsidy continued.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release, nitrogen balance per hectare of cropland, 2000 and 2023, converted to per acre (1 acre = 0.4047 hectare). EU Nitrogen Expert Panel 2015.');
  });

  /* 10 · wheat to buy 1 kg of N */
  K.mount('Kg of wheat needed to buy 1 kg of nitrogen in urea', 760, function (W, narrow) {
    var rows = [['2023-24', 2.22, at(NR_NUE.Pakistan, 2023)], ['2024-25', 3.48, at(NR_NUE.Pakistan, 2023)]];
    var rowH = 58, T = 6, L = narrow ? 70 : 90, R = 150, H = T + rows.length * rowH + 4, x = function (v) { return L + v / 13 * (W - L - R); }, b = '';
    rows.forEach(function (r, i) { var yy = T + i * rowH, h = r[1] / (r[2] / 100);
      b += '<g>' + t(L - 8, yy + 30, r[0], { a: 'end', fs: 13, fw: 700, fill: INK }) +
        '<rect x="' + L + '" y="' + (yy + 4) + '" width="' + (x(r[1]) - L) + '" height="20" fill="' + GREY + '"/>' + t(x(r[1]) + 6, yy + 19, f1(r[1], 2) + ' kg') +
        '<rect x="' + L + '" y="' + (yy + 28) + '" width="' + (x(h) - L) + '" height="20" fill="' + RED + '"/>' + t(x(h) + 6, yy + 43, f1(h) + ' kg', { fw: 700, fill: RED }) + '</g>'; });
    return head('In 2024-25, the wheat equivalent of the nitrogen added for each kg taken out in the harvested crop was about 12 kg at market prices', 'kg of wheat at the market price') +
      '<div class="k-row k-small k-legend"><span class="k-key"><span style="width:10px;height:10px;background:' + GREY + ';display:inline-block"></span>Grey bar: wheat needed to buy 1 kg of nitrogen in urea</span><span class="k-key"><span style="width:10px;height:10px;background:' + RED + ';display:inline-block"></span>Red bar: wheat equivalent for each kg of nitrogen taken out in the harvested crop</span></div>' +
      '<div class="k-chart__draw">' + svg(W, H, 'Kg of wheat needed to buy 1 kg of nitrogen in urea, and the wheat equivalent for each kg of nitrogen taken out in the harvested crop', b) + '</div>' +
      '<p class="k-small">The grey bar shows the kg of wheat, at the market price after harvest, needed to buy 1 kg of nitrogen in urea (NFDC). The red bar divides the grey figure by 29.1%, Pakistan’s NUE across all crops in 2023. The red bar therefore shows the wheat equivalent of the nitrogen added for each kg taken out in the harvested crop. The wheat equivalent is an illustration, because FAO publishes 1 NUE for all crops together.</p>' +
      src('NFDC Annual Fertilizer Review 2024-25, Tables 38 and 39 (market prices; wheat Rs 84.2 a kg in 2023-24 and Rs 55.4 in 2024-25); FAOSTAT, Cropland Nutrient Balance, December 2025 release (2023). VAN calculation.');
  });

  /* 11 · why the site's earlier figure differs */
  K.mount('FAO’s NUE series and an older published NUE series', 760, function (W, narrow) {
    var H = Math.round(W * (narrow ? 0.8 : 0.42)), L = 34, R = narrow ? 40 : 270, T = 14, B = 28;
    var x = function (yr) { return L + (yr - 1961) / 62 * (W - L - R); }, y = function (v) { return T + (1 - v / 70) * (H - T - B); };
    var p = function (s, y1) { var d = ''; for (var yr = 1961; yr <= y1; yr++) { var v = at(s, yr); if (v == null) continue; d += (d ? 'L' : 'M') + x(yr).toFixed(1) + ' ' + y(v).toFixed(1); } return d; };
    var lines = [['Pakistan, FAO 2025', NR_NUE.Pakistan, 2023, RED, null], ['Pakistan, Lassaletta 2014', NR_LASSALETTA.Pakistan, 2014, RED, '5 4'],
                 ['Bangladesh, FAO 2025', NR_NUE.Bangladesh, 2023, '#C9731F', null], ['Bangladesh, Lassaletta 2014', NR_LASSALETTA.Bangladesh, 2014, '#C9731F', '5 4']], b = '';
    [0, 20, 40, 60].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(L - 6, y(g) + 4, g, { a: 'end' }) + '</g>'; });
    [1961, 1990, 2014, 2023].forEach(function (tt) { b += t(x(tt), H - 8, tt, { a: 'middle' }); });
    lines.forEach(function (l) { b += '<path d="' + p(l[1], l[2]) + '" fill="none" stroke="' + l[3] + '" stroke-width="2.4"' + (l[4] ? ' stroke-dasharray="' + l[4] + '"' : '') + '/>'; });
    if (!narrow) lines.forEach(function (l, i) { b += t(W - R + 8, T + 16 + i * 18, l[0] + ': ' + f1(at(l[1], 2014)) + '% (2014)', { fill: l[3] }); });
    return head('For 2014, FAO’s series gives Pakistan an NUE of 31% and Bangladesh 39%, against 27% and 28% in the older series', 'NUE, %') +
      '<div class="k-chart__draw">' + svg(W, H, 'FAO’s NUE series and an older published NUE series for Pakistan and Bangladesh', b) + '</div>' +
      '<p class="k-small">The solid lines show FAOSTAT’s Cropland Nutrient Balance, December 2025 release, for 1961 to 2023. The dashed lines show an older series that ends in 2014 (Lassaletta, Billen, Grizzetti, Anglade and Garnier 2014). Both series divide the nitrogen taken out in the harvested crop by the nitrogen added. They differ in how they estimate manure, fixation by legumes and the harvest.</p>' +
      src('FAOSTAT, Cropland Nutrient Balance, December 2025 release; Lassaletta et al. 2014, Environmental Research Letters 9:105011, via Our World in Data (CC BY 4.0).');
  });

  /* 12 · what each practice did to ammonia loss, global synthesis */
  K.mount('Change in ammonia loss by practice', 760, function (W, narrow) {
    var rows = [['Controlled-release urea', -68, 'Technology'], ['Urease inhibitor', -54, 'Technology'], ['Deep placement', -55, 'Placement'], ['Irrigation after application', -35, 'Placement'], ['Split application', 0, 'Timing'], ['Nitrification inhibitor', 38, 'Technology']];
    var rowH = narrow ? 44 : 34, T = narrow ? 14 : 8, L = narrow ? 30 : 290, R = 50, H = T + rows.length * rowH + 24;
    var x = function (v) { return L + (v + 80) / 130 * (W - L - R); }, by = function (yy) { return narrow ? yy + 8 : yy; }, b = '';
    [-75, -50, -25, 0, 25].forEach(function (g) { b += '<g><line x1="' + x(g) + '" x2="' + x(g) + '" y1="' + T + '" y2="' + (T + rows.length * rowH) + '" stroke="' + (g === 0 ? MUTED : RULE) + '" stroke-dasharray="' + (g === 0 ? '0' : '2 3') + '"/>' + t(x(g), H - 6, g, { a: 'middle' }) + '</g>'; });
    rows.forEach(function (r, i) { var n = r[0], v = r[1], yy = T + i * rowH;
      b += '<g>' + t(narrow ? 0 : L - 8, narrow ? yy + 4 : yy + 21, n + (narrow ? '' : ' (' + r[2].toLowerCase() + ')'), { a: narrow ? 'start' : 'end', fs: 12.5, fill: INK }) +
        (v !== 0 ? '<rect x="' + Math.min(x(0), x(v)) + '" y="' + (by(yy) + 7) + '" width="' + Math.abs(x(v) - x(0)) + '" height="20" fill="' + (v < 0 ? GREEN : RED) + '"/>' : '<circle cx="' + x(0) + '" cy="' + (by(yy) + 17) + '" r="4" fill="' + MUTED + '"/>') +
        t(v < 0 ? x(v) - 6 : x(v) + 6, by(yy) + 21, v > 0 ? '+' + v : v === 0 ? 'no effect' : v, { a: v < 0 ? 'end' : 'start', fw: 700, fill: v < 0 ? GREEN : v > 0 ? RED : MUTED }) + '</g>'; });
    return head('Across 824 observations worldwide, deep placement cut ammonia loss from nitrogen fertiliser by 55% and urease inhibitors by 54%', '% change in ammonia lost, against the usual practice') +
      '<div class="k-chart__draw">' + svg(W, H, 'Change in ammonia loss by practice, global synthesis', b) + '</div>' +
      '<p class="k-small">Green bars show less ammonia lost than with the usual practice. Red bars show more ammonia lost. Split application did not change ammonia loss. Any benefit of split application comes from the crop taking up more of the nitrogen. The values are averages from many countries, mostly outside Pakistan. They cannot be added together.</p>' +
      src('Pan, Lam, Mosier, Luo and Chen 2016, Agriculture, Ecosystems and Environment 232:283-289 (global synthesis of 824 observations).');
  });
})();
