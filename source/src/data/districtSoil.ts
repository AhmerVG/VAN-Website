import type { SoilParameter } from './soilThresholds'

/**
 * DISTRICT SOIL PROFILES - recomputed 8 Sep 2026 straight from the 36 Punjab soil testing programme
 * workbooks (E:\\NP\\DAP Alternative Project\\03_Soil_Data), 770,160 valid samples, sampled c. 2016-2018.
 *
 * Why this file exists rather than reusing soil.ts: soil.ts carries district MEANS only, and for a
 * farmer asking "what does land like mine read", the mean is the wrong statistic. These
 * distributions are strongly right-skewed - a handful of very high samples drag the average up. In
 * Lahore the mean zinc is 1.16 ppm (which classifies Healthy) while the median is 0.53 ppm (which
 * classifies Critical). Across the 36 districts and 10 parameters, 55 of 360 band assignments change
 * between mean and median, almost all of them reading worse on the median. The median is the typical
 * field; the mean is not. So the district fill uses median, and mean is kept alongside it only for
 * context and for cross-checking against soil.ts.
 *
 * VALIDATION: every one of these 36 mean figures was reproduced independently from the raw workbooks
 * and matched the values already bundled in soil.ts exactly, to 0.02, including sample counts. That
 * includes SHEIKHUPURA, whose workbook carries a duplicated 'Latitude' header column that shifts
 * every header name one place right of its data - reading it by header name silently returns the
 * wrong analyte for every column. This file is built by fixed column POSITION, not by header name,
 * so it cannot make that mistake.
 *
 * Jhelum returns no valid zinc anywhere in the survey; its zn is simply absent, not substituted.
 * Sulfur is not determined in any workbook, and is not one of VAN's ten tested parameters either.
 *
 * Units: EC in dS/m (numerically the same as the mS/cm on VAN's table), OM in %, everything else in
 * ppm. P and K are ELEMENTAL, matching VAN's own cutoffs - see SOIL_P_K_BASIS in soilThresholds.ts.
 */
export type DistrictAnalyte = 'ec' | 'ph' | 'om' | 'p' | 'k' | 'zn' | 'cu' | 'fe' | 'mn' | 'b'

export type DistrictProfile = {
  key: string
  name: string
  /** Valid samples (rows with a usable pH) behind this district. */
  n: number
  /** Median - the typical field. This is what the district fill uses. */
  median: Partial<Record<DistrictAnalyte, number>>
  /** Mean - context only; matches soil.ts exactly. */
  mean: Partial<Record<DistrictAnalyte, number>>
}

/** VAN's soil-test parameter -> the survey's own analyte. */
export const PARAMETER_ANALYTE: Record<SoilParameter, DistrictAnalyte> = {
  EC: 'ec', pH: 'ph', OM: 'om', P2O: 'p', K2O: 'k', Zn: 'zn', B: 'b', Fe: 'fe', Cu: 'cu', Mn: 'mn',
}

export const DISTRICT_PROFILES: DistrictProfile[] = [
  { key: "ATTOCK", name: "Attock", n: 12002, median: {"ec":0.67,"ph":8.0,"om":0.55,"p":3.5,"k":100.0,"zn":0.65,"cu":0.42,"fe":3.67,"mn":0.39,"b":0.34}, mean: {"ec":0.734,"ph":7.962,"om":0.566,"p":3.892,"k":110.808,"zn":0.675,"cu":0.422,"fe":3.712,"mn":0.517,"b":0.363} },
  { key: "BHAWALNAGAR", name: "Bahawalnagar", n: 28233, median: {"ec":3.2,"ph":8.3,"om":0.57,"p":6.3,"k":110.0,"zn":1.49,"cu":0.78,"fe":2.74,"mn":2.75,"b":0.48}, mean: {"ec":2.947,"ph":8.248,"om":0.569,"p":6.275,"k":109.704,"zn":1.965,"cu":1.326,"fe":3.211,"mn":4.099,"b":0.505} },
  { key: "BHAWALPUR", name: "Bahawalpur", n: 33871, median: {"ec":3.41,"ph":7.99,"om":0.67,"p":4.7,"k":154.0,"zn":1.7,"cu":1.1,"fe":3.48,"mn":4.11,"b":0.54}, mean: {"ec":4.331,"ph":8.007,"om":0.679,"p":4.566,"k":148.832,"zn":2.176,"cu":2.772,"fe":3.874,"mn":4.96,"b":0.56} },
  { key: "BHAKKAR", name: "Bhakkar", n: 23220, median: {"ec":0.12,"ph":7.9,"om":0.45,"p":7.0,"k":90.0,"zn":0.49,"cu":0.5,"fe":1.64,"mn":1.5,"b":0.33}, mean: {"ec":0.171,"ph":7.898,"om":0.463,"p":7.015,"k":94.323,"zn":0.573,"cu":0.655,"fe":2.446,"mn":2.043,"b":0.37} },
  { key: "CHAKWAL", name: "Chakwal", n: 10752, median: {"ec":0.92,"ph":7.9,"om":0.81,"p":6.9,"k":120.0,"zn":0.61,"cu":0.46,"fe":3.92,"mn":0.37,"b":0.34}, mean: {"ec":0.925,"ph":7.887,"om":0.826,"p":7.503,"k":129.525,"zn":0.646,"cu":0.448,"fe":4.007,"mn":0.418,"b":0.364} },
  { key: "CHINNIOT", name: "Chiniot", n: 17935, median: {"ec":2.63,"ph":8.23,"om":0.63,"p":6.89,"k":120.0,"zn":0.688,"cu":0.233,"fe":0.824,"mn":0.458,"b":0.313}, mean: {"ec":2.638,"ph":8.221,"om":0.646,"p":6.963,"k":118.987,"zn":0.708,"cu":0.287,"fe":0.971,"mn":0.47,"b":0.382} },
  { key: "D.G.KHAN", name: "Dera Ghazi Khan", n: 12032, median: {"ec":0.96,"ph":8.0,"om":0.4,"p":5.2,"k":120.0,"zn":1.18,"cu":0.76,"fe":4.2,"mn":1.67,"b":0.721}, mean: {"ec":2.713,"ph":7.999,"om":0.486,"p":6.046,"k":130.651,"zn":1.252,"cu":0.836,"fe":4.145,"mn":1.835,"b":0.87} },
  { key: "FAISALABAD", name: "Faisalabad", n: 51556, median: {"ec":1.39,"ph":8.16,"om":0.72,"p":6.53,"k":120.0,"zn":0.697,"cu":0.211,"fe":0.77,"mn":0.402,"b":0.285}, mean: {"ec":1.881,"ph":8.174,"om":0.699,"p":6.507,"k":129.907,"zn":0.702,"cu":0.23,"fe":0.809,"mn":0.428,"b":0.34} },
  { key: "GUJRANWALA", name: "Gujranwala", n: 21511, median: {"ec":0.84,"ph":8.1,"om":0.62,"p":5.0,"k":121.0,"zn":2.66,"cu":0.48,"fe":4.76,"mn":2.46,"b":0.42}, mean: {"ec":0.979,"ph":8.097,"om":0.605,"p":5.257,"k":114.089,"zn":2.529,"cu":0.519,"fe":4.749,"mn":2.45,"b":0.429} },
  { key: "GUJRAT", name: "Gujrat", n: 25197, median: {"ec":0.95,"ph":7.5,"om":0.63,"p":6.3,"k":124.0,"zn":2.21,"cu":0.39,"fe":4.36,"mn":1.91,"b":0.4}, mean: {"ec":1.087,"ph":7.541,"om":0.593,"p":6.338,"k":123.855,"zn":2.11,"cu":0.459,"fe":4.063,"mn":1.629,"b":0.4} },
  { key: "HAFIZABAD", name: "Hafizabad", n: 9396, median: {"ec":0.72,"ph":8.4,"om":0.58,"p":7.0,"k":138.0,"zn":2.61,"cu":0.45,"fe":4.65,"mn":2.41,"b":0.4}, mean: {"ec":0.975,"ph":8.395,"om":0.599,"p":6.685,"k":137.483,"zn":2.362,"cu":0.48,"fe":4.44,"mn":2.33,"b":0.404} },
  { key: "JHANG", name: "Jhang", n: 27501, median: {"ec":1.9,"ph":8.3,"om":0.62,"p":7.3,"k":120.0,"zn":0.645,"cu":0.221,"fe":0.59,"mn":0.443,"b":0.24}, mean: {"ec":1.971,"ph":8.352,"om":0.607,"p":7.271,"k":119.524,"zn":0.648,"cu":0.238,"fe":0.668,"mn":0.464,"b":0.284} },
  { key: "JHELUM", name: "Jhelum", n: 8536, median: {"ec":1.71,"ph":7.9,"om":0.59,"p":4.4,"k":144.0,"cu":0.58,"fe":0.46,"mn":3.48,"b":0.36}, mean: {"ec":2.977,"ph":7.899,"om":0.606,"p":4.144,"k":142.849,"cu":0.617,"fe":0.448,"mn":3.499,"b":0.408} },
  { key: "KASUR", name: "Kasur", n: 28703, median: {"ec":1.9,"ph":8.7,"om":0.55,"p":14.3,"k":114.0,"zn":0.6,"cu":0.46,"fe":2.12,"mn":0.8,"b":0.57}, mean: {"ec":2.538,"ph":8.668,"om":0.574,"p":14.781,"k":115.509,"zn":1.118,"cu":1.371,"fe":2.996,"mn":1.705,"b":0.625} },
  { key: "KHANEWAL", name: "Khanewal", n: 31103, median: {"ec":2.39,"ph":8.5,"om":0.65,"p":5.8,"k":129.0,"zn":0.8,"cu":0.9,"fe":4.5,"mn":1.13,"b":0.9}, mean: {"ec":2.654,"ph":8.468,"om":0.659,"p":6.195,"k":129.575,"zn":0.851,"cu":0.915,"fe":4.748,"mn":1.289,"b":0.954} },
  { key: "KHUSHAB", name: "Khushab", n: 20887, median: {"ec":0.8,"ph":8.2,"om":0.69,"p":7.6,"k":138.0,"zn":0.5,"cu":0.51,"fe":3.6,"mn":3.0,"b":0.42}, mean: {"ec":0.883,"ph":8.285,"om":0.724,"p":7.687,"k":138.982,"zn":0.62,"cu":0.642,"fe":3.689,"mn":3.034,"b":0.449} },
  { key: "LAHORE", name: "Lahore", n: 13330, median: {"ec":2.1,"ph":8.6,"om":0.55,"p":5.8,"k":120.0,"zn":0.53,"cu":0.4,"fe":1.58,"mn":0.56,"b":0.5}, mean: {"ec":2.17,"ph":8.492,"om":0.561,"p":6.891,"k":121.165,"zn":1.161,"cu":1.893,"fe":2.189,"mn":2.011,"b":0.56} },
  { key: "LAYYAH", name: "Layyah", n: 14757, median: {"ec":1.3,"ph":8.4,"om":0.56,"p":6.0,"k":84.0,"zn":1.16,"cu":0.52,"fe":3.77,"mn":1.36,"b":0.55}, mean: {"ec":1.799,"ph":8.402,"om":0.59,"p":5.848,"k":94.7,"zn":1.209,"cu":0.546,"fe":3.835,"mn":1.522,"b":0.612} },
  { key: "LODHRAN", name: "Lodhran", n: 13231, median: {"ec":3.2,"ph":8.3,"om":0.45,"p":6.4,"k":130.0,"zn":0.92,"cu":0.99,"fe":4.95,"mn":1.21,"b":0.98}, mean: {"ec":3.896,"ph":8.31,"om":0.48,"p":6.25,"k":129.77,"zn":1.136,"cu":1.026,"fe":5.077,"mn":1.491,"b":1.034} },
  { key: "MANDI BAHAUDDIN", name: "Mandi Bahauddin", n: 20392, median: {"ec":1.46,"ph":7.9,"om":0.72,"p":5.0,"k":92.0,"zn":2.14,"cu":0.46,"fe":4.59,"mn":2.18,"b":0.42}, mean: {"ec":1.51,"ph":7.929,"om":0.705,"p":4.54,"k":93.455,"zn":1.984,"cu":0.553,"fe":4.65,"mn":1.891,"b":0.483} },
  { key: "MIANWALI", name: "Mianwali", n: 14037, median: {"ec":1.9,"ph":8.1,"om":0.58,"p":5.5,"k":81.0,"zn":0.44,"cu":0.46,"fe":2.77,"mn":1.66,"b":0.42}, mean: {"ec":1.99,"ph":8.058,"om":0.582,"p":5.565,"k":93.291,"zn":0.529,"cu":0.64,"fe":3.33,"mn":2.043,"b":0.481} },
  { key: "MULTAN", name: "Multan", n: 12869, median: {"ec":0.82,"ph":8.3,"om":0.64,"p":7.8,"k":160.0,"zn":0.74,"cu":1.07,"fe":5.9,"mn":1.28,"b":0.76}, mean: {"ec":1.395,"ph":8.295,"om":0.624,"p":8.588,"k":167.977,"zn":0.806,"cu":1.112,"fe":5.931,"mn":1.403,"b":0.784} },
  { key: "MUZAFFAR", name: "Muzaffargarh", n: 19972, median: {"ec":2.8,"ph":8.4,"om":0.79,"p":5.8,"k":117.0,"zn":1.08,"cu":0.48,"fe":4.07,"mn":1.34,"b":0.57}, mean: {"ec":4.219,"ph":8.461,"om":0.744,"p":5.835,"k":128.481,"zn":1.126,"cu":0.537,"fe":4.213,"mn":1.582,"b":0.677} },
  { key: "NANKANA", name: "Nankana Sahib", n: 16700, median: {"ec":2.3,"ph":8.6,"om":0.46,"p":3.3,"k":110.0,"zn":0.74,"cu":1.52,"fe":1.88,"mn":1.47,"b":1.0}, mean: {"ec":2.252,"ph":8.51,"om":0.515,"p":3.813,"k":114.83,"zn":1.227,"cu":2.128,"fe":2.571,"mn":2.129,"b":1.436} },
  { key: "NAROWAL", name: "Narowal", n: 25557, median: {"ec":0.59,"ph":8.31,"om":0.42,"p":4.0,"k":140.0,"zn":2.59,"cu":0.45,"fe":4.58,"mn":2.41,"b":0.4}, mean: {"ec":0.788,"ph":8.29,"om":0.45,"p":4.591,"k":144.277,"zn":2.37,"cu":0.487,"fe":4.458,"mn":2.34,"b":0.396} },
  { key: "OKARA", name: "Okara", n: 27063, median: {"ec":1.9,"ph":8.1,"om":0.55,"p":6.8,"k":130.0,"zn":0.5,"cu":0.4,"fe":1.44,"mn":0.5,"b":0.53}, mean: {"ec":2.26,"ph":8.136,"om":0.558,"p":6.841,"k":132.933,"zn":0.692,"cu":0.712,"fe":2.012,"mn":0.797,"b":0.579} },
  { key: "PAKPATTAN", name: "Pakpattan", n: 14757, median: {"ec":0.78,"ph":8.2,"om":0.51,"p":8.8,"k":140.0,"zn":0.95,"cu":0.99,"fe":4.78,"mn":1.26,"b":0.94}, mean: {"ec":0.979,"ph":8.165,"om":0.508,"p":8.82,"k":138.299,"zn":0.983,"cu":1.015,"fe":4.896,"mn":1.471,"b":0.989} },
  { key: "RYK", name: "Rahim Yar Khan", n: 42094, median: {"ec":0.76,"ph":8.2,"om":0.57,"p":7.0,"k":145.0,"zn":1.5,"cu":1.26,"fe":3.6,"mn":2.54,"b":0.53}, mean: {"ec":1.486,"ph":8.249,"om":0.552,"p":6.851,"k":169.857,"zn":2.469,"cu":2.112,"fe":3.978,"mn":3.156,"b":0.636} },
  { key: "RAJANPUR", name: "Rajanpur", n: 11092, median: {"ec":0.76,"ph":8.01,"om":0.38,"p":5.32,"k":170.0,"zn":1.15,"cu":0.67,"fe":3.84,"mn":1.46,"b":0.705}, mean: {"ec":1.133,"ph":8.015,"om":0.386,"p":5.821,"k":158.984,"zn":1.233,"cu":0.739,"fe":4.011,"mn":1.541,"b":0.865} },
  { key: "RAWALPINDI", name: "Rawalpindi", n: 11963, median: {"ec":1.04,"ph":7.53,"om":0.59,"p":4.8,"k":120.0,"zn":0.61,"cu":0.48,"fe":3.52,"mn":0.42,"b":0.32}, mean: {"ec":1.145,"ph":7.591,"om":0.608,"p":5.085,"k":128.031,"zn":0.647,"cu":0.882,"fe":3.294,"mn":0.521,"b":0.339} },
  { key: "SAHIWAL", name: "Sahiwal", n: 25164, median: {"ec":2.1,"ph":8.2,"om":0.57,"p":7.1,"k":184.0,"zn":0.97,"cu":0.68,"fe":4.76,"mn":1.19,"b":0.8}, mean: {"ec":2.878,"ph":8.238,"om":0.572,"p":7.671,"k":200.602,"zn":1.036,"cu":0.728,"fe":4.935,"mn":1.346,"b":0.859} },
  { key: "SARGODHA", name: "Sargodha", n: 23642, median: {"ec":1.4,"ph":8.2,"om":0.62,"p":7.0,"k":140.0,"zn":0.7,"cu":0.8,"fe":5.8,"mn":4.6,"b":0.5}, mean: {"ec":1.517,"ph":8.173,"om":0.667,"p":6.953,"k":148.448,"zn":0.763,"cu":0.858,"fe":5.683,"mn":5.21,"b":0.512} },
  { key: "SHEIKHUPURA", name: "Sheikhupura", n: 26676, median: {"ec":1.5,"ph":8.7,"om":0.56,"p":5.21,"k":122.0,"zn":0.64,"cu":0.8,"fe":1.8,"mn":0.86,"b":0.6}, mean: {"ec":1.747,"ph":8.729,"om":0.595,"p":5.416,"k":117.714,"zn":1.109,"cu":1.776,"fe":2.359,"mn":1.66,"b":0.721} },
  { key: "SIALKOT", name: "Sialkot", n: 18131, median: {"ec":0.21,"ph":8.12,"om":0.65,"p":4.03,"k":112.0,"zn":0.88,"cu":0.44,"fe":4.07,"mn":0.57,"b":0.39}, mean: {"ec":0.282,"ph":8.084,"om":0.651,"p":4.137,"k":113.964,"zn":1.191,"cu":0.701,"fe":3.949,"mn":1.107,"b":0.394} },
  { key: "TOBA TEK SINGH", name: "Toba Tek Singh", n: 24614, median: {"ec":3.3,"ph":8.3,"om":0.83,"p":9.0,"k":160.0,"zn":0.697,"cu":0.243,"fe":0.682,"mn":0.445,"b":0.35}, mean: {"ec":4.558,"ph":8.269,"om":0.803,"p":9.032,"k":163.811,"zn":0.68,"cu":0.34,"fe":0.766,"mn":0.468,"b":0.377} },
  { key: "VEHARI", name: "Vehari", n: 31684, median: {"ec":1.84,"ph":8.5,"om":0.7,"p":7.17,"k":144.0,"zn":0.9,"cu":1.036,"fe":5.23,"mn":1.3,"b":0.89}, mean: {"ec":2.863,"ph":8.507,"om":0.69,"p":7.118,"k":146.508,"zn":1.004,"cu":1.076,"fe":5.522,"mn":1.458,"b":0.963} },
]
