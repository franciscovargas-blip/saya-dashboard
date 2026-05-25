import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Line, PieChart, Pie } from "recharts";

const MO=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const OX={SW0001:"Salaries & Wages",PF0001:"Professional Fees",SM0001:"Sales & Marketing",TA0001:"Travel & Accommodation",IT0001:"IT",OF0001:"Office Expenses",OP0001:"Operations",DP0001:"Depreciation",FE0001:"Financial Expense",FI0001:"Financial Income",OT0001:"Others",TX0001:"Taxes & Permits"};
const PLO=["Net Sales","Gross to Net","COGS","Gross Profit","TOTAL OPERATING  EXPENSES","EBIT","EBITDA"];
const OC=Object.keys(OX);const BL=new Set(["Net Sales","Gross Profit","EBIT","EBITDA"]);
const COLORS=["#1D9E75","#534AB7","#D85A30","#185FA5","#BA7517","#E24B4A","#D4537E","#639922","#888780"];

const D=[["COGS","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1355200.0],["COGS","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",677600.0],["COGS","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["DP0001","Reales",1,"FIXED","NOAP","—","Ajuste Depreciación","NOAP",513127.62],["EBIT","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1410880.0],["EBIT","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["EBIT","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["EBIT","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["EBIT","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["EBIT","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["EBIT","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBIT","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBITDA","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1410880.0],["EBITDA","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["EBITDA","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["EBITDA","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["EBITDA","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["EBITDA","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["EBITDA","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBITDA","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["FE0001","Reales",1,"FIXED","NOAP","—","Ajuste Financial Expense","NOAP",435134.95],["FI0001","Reales",1,"FIXED","NOAP","—","Ajuste Financial Income","NOAP",-514523.15],["Gross Profit","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1355200.0],["Gross Profit","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["Gross Profit","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["Gross Profit","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["Gross Profit","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["Gross Profit","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["Gross Profit","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Gross Profit","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Gross to Net","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["IT0001","Reales",1,"FIXED","NOAP","Licencias de Software","Notion + AWS","VARIOS",45978.63],["IT0001","Reales",2,"FIXED","NOAP","Licencias de Software","Amazon MXN","AMAZON WEB SERVICES",44.16],["IT0001","Reales",4,"FIXED","NOAP","Licencias de Software","AWS","AMAZON WEB SERVICES",39.17],["IT0001","Reales",5,"FIXED","NOAP","Reclutamiento Fees","LinkedIn","PPROMEX*LINKEDIN",4066.36],["IT0001","Reales",7,"FIXED","NOAP","Licencias de Software","Declaración tributaria","EDICOMUNICACIONES MEXICO",199.0],["IT0001","Reales",9,"FIXED","NOAP","Licencias de Software","Asana (4 meses)","ASANA",15200.0],["Net Sales","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["Net Sales","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.19],["Net Sales","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["Net Sales","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",899457.58],["Net Sales","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.98],["Net Sales","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Net Sales","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["OF0001","Reales",3,"FIXED","NOAP","Arrendamiento","Renta oficina","COWORKING CHAPULTEPEC",49700.0],["OF0001","Reales",5,"FIXED","NOAP","Comidas","Comida equipo","LAGUNEROS ORIENTALES",263.79],["OF0001","Reales",6,"FIXED","NOAP","Arrendamiento","Renta oficinas","COWORKING CHAPULTEPEC",155401.28],["OF0001","Reales",9,"FIXED","NOAP","Papelería","Papelería","OFFICE DEPOT INTERNET",5350.43],["OF0001","Reales",10,"FIXED","NOAP","Papelería","Impresiones","OFFICE DEPOT AMERICAS",34.48],["OF0001","Reales",11,"FIXED","NOAP","Papelería","Farmacopea","FARMACOPEA MX",1920.0],["OF0001","Reales",12,"FIXED","NOAP","Equipo","Servicio Sistemas","T9 DIGITAL",850.0],["OP0001","Reales",1,"FIXED","NOAP","—","Ajuste Operaciones","NOAP",17780.67],["OP0001","Reales",4,"ACHI","SAOS","Logística","Almacenaje y transporte","WORLD COURIER DE MEXICO",15147.16],["OT0001","Reales",1,"FIXED","NOAP","—","Ajuste Others","NOAP",30141.05],["PF0001","Reales",1,"FIXED","NOAP","Reclutamiento Fees","Placement + Recruiter","VARIOS",982129.26],["PF0001","Reales",1,"FIXED","NOAP","Consultoría de marketing","RRPP febrero","INCIDENCIA EN COMUNICACION",95000.0],["PF0001","Reales",1,"FIXED","NOAP","Consultoría estratégica","Consultancy Fee Junee","JUNEE PHARMACEUTICAL",35905.6],["PF0001","Reales",1,"FIXED","NOAP","Consultoría contable","Honorarios abril","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",1,"FIXED","NOAP","Traducción","Documentos","DEEPL",195.6],["PF0001","Reales",1,"FIXED","NOAP","—","Ajuste PF","NOAP",-1770.0],["PF0001","Reales",2,"FIXED","NOAP","Consultoría de marketing","RRPP dic-ene","INCIDENCIA EN COMUNICACION",190000.0],["PF0001","Reales",2,"FIXED","NOAP","Consultoría contable","Honorarios marzo","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",3,"FIXED","NOAP","Consultoría regulatoria","Farmacovigilancia","JORGE SANCHEZ BADILLO",15750.0],["PF0001","Reales",3,"FIXED","NOAP","Consultoría contable","Honorarios febrero","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",3,"TERI","SAOS","Consultoría regulatoria","Permiso Euxara","JORGE SANCHEZ BADILLO",5250.0],["PF0001","Reales",5,"FIXED","NOAP","Consultoría contable","Honorarios enero","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",6,"FIXED","NOAP","Consultoría regulatoria","Farmacovigilancia","JORGE SANCHEZ BADILLO",15750.0],["PF0001","Reales",8,"TERI","SAOS","Traducción","Traducción Euxara","PAYCLIP",5420.77],["PF0001","Reales",12,"ACHI","SAOS","Materiales","Material Médico HA","JORGE EDUARDO GARCIA",61269.23],["SM0001","Reales",1,"ACHI","SAOS","Eventos prelanzamiento","AAOS Conference","VARIOS",40457.78],["SM0001","Reales",2,"ACHI","SAOS","Alimentos","Alimentos AAOS","VARIOS",6603.96],["SM0001","Reales",3,"ACHI","SAOS","Alimentos","Alimentos New Orleans","VARIOS",23915.4],["SM0001","Reales",4,"ACHI","SAOS","Eventos prelanzamiento","AAOS + hospedaje","VARIOS",47790.06],["SM0001","Reales",5,"ACHI","SAOS","Marketing","Apoyo visual + alimentos","VARIOS",67052.04],["SM0001","Reales",6,"ACHI","SAOS","Varios","Alimentos y transporte","VARIOS",5907.58],["SM0001","Reales",7,"ACHI","SAOS","Rep ventas","GDL + BIRMEX","VARIOS",9565.98],["SM0001","Reales",7,"TERI","SAOS","Rep ventas","Dr. Loza","REST HARRYS MASARYK",5829.52],["SM0001","Reales",8,"ACHI","SAOS","Rep ventas","GDL doctores","VARIOS",12377.52],["SM0001","Reales",9,"ACHI","SAOS","Eventos prelanzamiento","Congreso Reumatología","COLEGIO MX REUMATOLOGIA",150000.0],["SM0001","Reales",9,"ACHI","SAOS","Rep ventas","GDL/MTY","VARIOS",4631.5],["SM0001","Reales",10,"ACHI","SAOS","Rep ventas","Pixel Lab","ABARROTS CASROL MIDTWN",851.15],["SM0001","Reales",12,"TERI","SAOS","Rep ventas","CDMX","REST DANTE",3611.06],["SW0001","Reales",1,"FIXED","NOAP","Autos","Tesla Model 3","TRACSA",21339.11],["SW0001","Reales",10,"FIXED","NOAP","Autos","Arrendamiento 4 vehículos","TRACSA",111073.21],["SW0001","Reales",11,"FIXED","NOAP","Capacitación","Curso IA Regulación","AMPRESIH",9655.17],["SW0001","Reales",11,"FIXED","NOAP","Autos","Vehículo refacturación","TRACSA",20818.48],["SW0001","Reales",12,"FIXED","NOAP","Autos","Arrendamiento 4 vehículos","TRACSA",111073.21],["TA0001","Reales",1,"FIXED","NOAP","Hospedaje","TY New York","CORPORATE TRAVEL",31751.0],["TA0001","Reales",1,"PELI","ONHE","Varios","Chicago BD trip","VARIOS",9351.33],["TA0001","Reales",1,"DENO","SAOS","Hospedaje","AG viaje","CORPORATE TRAVEL",2851.36],["TA0001","Reales",1,"TERI","SAOS","Hospedaje","AG viaje","CORPORATE TRAVEL",2851.37],["TA0001","Reales",1,"ACHI","SAOS","—","Devolución KL","- - -",-602.0],["TA0001","Reales",1,"FIXED","NOAP","—","Ajustes varios","NOAP",242.0],["TA0001","Reales",2,"FIXED","NOAP","Taxis","Uber varios","VARIOS",638.72],["TA0001","Reales",2,"PELI","ONHE","Taxis","Uber MTY","UBER",525.85],["TA0001","Reales",3,"PELI","ONHE","Vuelos","Vuelo Chicago","AEROVIAS DE MEXICO",10639.0],["TA0001","Reales",4,"ACHI","SAOS","Viaje GDL","Hospedaje + vuelos GDL","VARIOS",26450.1],["TA0001","Reales",4,"FIXED","NOAP","Viaje ejecutivo","Vuelos TY/AG + uber","VARIOS",25827.44],["TA0001","Reales",5,"FIXED","NOAP","Varios","Hospedaje + uber + vuelo","VARIOS",3659.66],["TA0001","Reales",5,"ACHI","SAOS","Vuelos","Fees aéreos","CORPORATE TRAVEL",366.9],["TA0001","Reales",5,"BEVA","ONHE","Alimentos","Alimentos RC","TIMHOR",499.0],["TA0001","Reales",6,"ACHI","SAOS","Varios","Alimentos + taxis GDL","VARIOS",3271.1],["TA0001","Reales",6,"FIXED","NOAP","Varios","Uber + rosca","VARIOS",586.85],["TA0001","Reales",6,"DENO","SAOS","Visa","Visa India","indianvisa",1139.65],["TA0001","Reales",6,"TERI","SAOS","Visa","Visa India","indianvisa",1139.84],["TA0001","Reales",7,"ACHI","SAOS","Taxis","Uber GDL","VARIOS",2668.08],["TA0001","Reales",7,"FIXED","NOAP","Taxis","Uber varios","VARIOS",264.26],["TA0001","Reales",8,"ACHI","SAOS","Varios","Alimentos + uber GDL","VARIOS",598.53],["TA0001","Reales",8,"FIXED","NOAP","Taxis","Uber CDMX","UBER",1219.68],["TA0001","Reales",9,"ACHI","SAOS","Varios","Alimentos + uber GDL","VARIOS",1352.5],["TA0001","Reales",9,"FIXED","NOAP","Varios","Alimentos + uber CDMX","VARIOS",1537.08],["TA0001","Reales",10,"ACHI","SAOS","Varios","Alimentos + uber","VARIOS",1960.46],["TA0001","Reales",10,"FIXED","NOAP","Varios","Hospedaje + uber + vuelo + alimentos","VARIOS",9841.56],["TA0001","Reales",10,"DENO","SAOS","Permiso","Permiso UK","UKVI",246.83],["TA0001","Reales",10,"TERI","SAOS","Permiso","Permiso UK","UKVI",246.83],["TA0001","Reales",11,"ACHI","SAOS","Taxis","Uber CDMX","VARIOS",810.89],["TA0001","Reales",11,"FIXED","NOAP","Varios","Viaje Boston/SF + vuelos","VARIOS",8420.8],["TA0001","Reales",12,"FIXED","NOAP","Varios","Viaje Boston/SF/MTY","VARIOS",10856.4],["TOTAL OPERATING  EXPENSES","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",55680.0],["TX0001","Reales",3,"TERI","SAOS","COFEPRIS","Permiso Euxara","COFEPRIS",7300.0]];

const F=v=>{if(!v||v===0)return"—";const n=v<0,a=Math.abs(v);let s;if(a>=1e6)s=`$${(a/1e6).toFixed(1)}M`;else if(a>=1e3)s=`$${(a/1e3).toFixed(1)}K`;else s=`$${a.toFixed(0)}`;return n?`-${s}`:s};
const P=v=>(!isFinite(v)||isNaN(v))?"—":`${(v*100).toFixed(1)}%`;
const gS=(d,l,o,ms)=>d.filter(r=>r[0]===l&&r[1]===o&&ms.includes(r[2])).reduce((s,r)=>s+r[8],0);
const gOx=(d,ms)=>OC.reduce((s,c)=>s+d.filter(r=>r[0]===c&&r[1]==="Reales"&&ms.includes(r[2])).reduce((a,r)=>a+r[8],0),0);
const mols=[...new Set(D.map(r=>r[3]))].sort();
const areas=[...new Set(D.map(r=>r[4]))].filter(a=>a!=="—").sort();

export default function Dashboard(){
  const [cm,setCm]=useState(4);
  const [mol,setMol]=useState("Todas");
  const [area,setArea]=useState("Todas");
  const [exp,setExp]=useState({});
  const [expP,setExpP]=useState({});

  const fd=useMemo(()=>{let d=D;if(mol!=="Todas")d=d.filter(r=>r[3]===mol);if(area!=="Todas")d=d.filter(r=>r[4]===area);return d},[mol,area]);
  const ytdM=useMemo(()=>Array.from({length:cm},(_,i)=>i+1),[cm]);
  const allM=Array.from({length:12},(_,i)=>i+1);

  // KPIs with reales and variations
  const kpis=useMemo(()=>{
    const nsCM=gS(fd,"Net Sales","Forecast",[cm]),nsYTD=gS(fd,"Net Sales","Forecast",ytdM),nsFY=gS(fd,"Net Sales","Forecast",allM);
    const ebitdaCM=gS(fd,"EBITDA","Forecast",[cm]),ebitdaYTD=gS(fd,"EBITDA","Forecast",ytdM);
    const gpYTD=gS(fd,"Gross Profit","Forecast",ytdM);
    const opexCM=gOx(fd,[cm]),opexYTD=gOx(fd,ytdM);
    const opexPrev=cm>1?gOx(fd,[cm-1]):0;
    const opexVar=opexPrev?((opexCM-opexPrev)/Math.abs(opexPrev)):0;
    const gmYTD=nsYTD?gpYTD/nsYTD:0;
    const burn=opexYTD-(nsYTD>0?nsYTD:0);
    return [
      {l:`SALES ${MO[cm-1]}`,v:F(nsCM),s:`YTD ${F(nsYTD)}`,c:"#1D9E75"},
      {l:"NET SALES FY",v:F(nsFY),s:"Forecast anual",c:"#0B6644"},
      {l:`EBITDA ${MO[cm-1]}`,v:F(ebitdaCM),s:`YTD ${F(ebitdaYTD)}`,c:ebitdaCM<0?"#E24B4A":"#1D9E75",var:ebitdaYTD},
      {l:"GROSS PROFIT YTD",v:F(gpYTD),s:nsYTD?`Margen ${P(gmYTD)}`:"Pre-revenue",c:"#185FA5"},
      {l:`OPEX REAL ${MO[cm-1]}`,v:F(opexCM),s:`YTD ${F(opexYTD)}`,c:"#E24B4A",pct:opexVar,showPct:cm>1},
      {l:"OPEX FY REAL",v:F(gOx(fd,allM)),s:`${OC.filter(c=>fd.some(r=>r[0]===c&&r[1]==="Reales")).length} categorías`,c:"#534AB7"},
      {l:"BURN RATE YTD",v:F(burn),s:"OpEx - Revenue",c:"#8B5CF6"},
      {l:"COGS YTD",v:F(gS(fd,"COGS","Forecast",ytdM)),s:`FY ${F(gS(fd,"COGS","Forecast",allM))}`,c:"#BA7517"},
    ];
  },[fd,cm,ytdM]);

  // P&L Table
  const rows=useMemo(()=>[...PLO,...OC].map(line=>{
    const isO=OC.includes(line);const label=isO?OX[line]:(line==="TOTAL OPERATING  EXPENSES"?"Total OpEx (FC)":line);
    const ld=fd.filter(r=>r[0]===line);const monthly=[];
    for(let m=1;m<=12;m++){const fc=ld.filter(r=>r[2]===m&&r[1]==="Forecast").reduce((s,r)=>s+r[8],0);const re=ld.filter(r=>r[2]===m&&r[1]==="Reales").reduce((s,r)=>s+r[8],0);monthly.push(isO?re:(m<=cm&&re?re:fc))}
    const total=monthly.reduce((s,v)=>s+v,0);
    const dm={};ld.forEach(r=>{const c=r[5]||"—";if(!dm[c])dm[c]={items:{},m:Array(12).fill(0)};dm[c].m[r[2]-1]+=r[8];const co=r[6]||"—";if(!dm[c].items[co])dm[c].items[co]={m:Array(12).fill(0),p:r[7]};dm[c].items[co].m[r[2]-1]+=r[8]});
    return{line,label,monthly,total,isO,isBold:BL.has(line),dd:dm};
  }),[fd,cm]);

  // YTD & CM comparison
  const comp=useMemo(()=>PLO.map(l=>{const rY=gS(fd,l,"Reales",ytdM),fY=gS(fd,l,"Forecast",ytdM),rC=gS(fd,l,"Reales",[cm]),fC=gS(fd,l,"Forecast",[cm]);return{l,rY,fY,vY:rY-fY,pY:fY?((rY-fY)/Math.abs(fY)):0,rC,fC,vC:rC-fC,pC:fC?((rC-fC)/Math.abs(fC)):0}}),[fd,cm,ytdM]);

  // Charts
  const chartData=useMemo(()=>MO.map((m,i)=>({name:m,Sales:Math.round(gS(fd,"Net Sales","Forecast",[i+1])),EBITDA:Math.round(gS(fd,"EBITDA","Forecast",[i+1])),OpEx:Math.round(gOx(fd,[i+1])),cur:i+1<=cm})),[fd,cm]);

  // Waterfall
  const wf=useMemo(()=>{const ns=gS(fd,"Net Sales","Forecast",ytdM),gtn=gS(fd,"Gross to Net","Forecast",ytdM),cogs=gS(fd,"COGS","Forecast",ytdM),opex=gOx(fd,ytdM),gp=ns-gtn-cogs,ebit=gp-opex;let run=0;return[{name:"Net Sales",val:ns},{name:"G-to-N",val:-gtn},{name:"COGS",val:-cogs},{name:"Gross Profit",val:0,total:gp},{name:"OpEx",val:-opex},{name:"EBIT",val:0,total:ebit}].map(it=>{if(it.total!==undefined){run=it.total;return{...it,start:0,end:it.total,isT:true}}const s=run;run+=it.val;return{...it,start:s,end:run}});},[fd,ytdM]);

  // Pie charts: expenses by molecule
  const pieYTD=useMemo(()=>{
    const map={};fd.filter(r=>r[1]==="Reales"&&OC.includes(r[0])&&ytdM.includes(r[2])).forEach(r=>{const m=r[3];if(!map[m])map[m]=0;map[m]+=Math.abs(r[8])});
    return Object.entries(map).map(([name,value])=>({name,value:Math.round(value)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
  },[fd,ytdM]);

  const pieCM=useMemo(()=>{
    const map={};fd.filter(r=>r[1]==="Reales"&&OC.includes(r[0])&&r[2]===cm).forEach(r=>{const m=r[3];if(!map[m])map[m]=0;map[m]+=Math.abs(r[8])});
    return Object.entries(map).map(([name,value])=>({name,value:Math.round(value)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
  },[fd,cm]);

  // Pareto (current month)
  const pareto=useMemo(()=>{const re=fd.filter(r=>r[1]==="Reales"&&r[2]===cm);const map={};re.forEach(r=>{const p=r[7];if(p==="NOAP"||p==="- - -"||p==="VARIOS")return;if(!map[p])map[p]={t:0,items:{}};map[p].t+=r[8];const c=r[6];if(!map[p].items[c])map[p].items[c]=0;map[p].items[c]+=r[8]});const arr=Object.entries(map).map(([k,v])=>({partner:k,total:v.t,items:v.items})).sort((a,b)=>Math.abs(b.total)-Math.abs(a.total));const grand=arr.reduce((s,x)=>s+Math.abs(x.total),0);let cum=0;return arr.map(x=>{cum+=Math.abs(x.total);return{...x,cumPct:grand?cum/grand:0}});},[fd,cm]);

  const toggle=k=>setExp(p=>({...p,[k]:!p[k]}));
  const toggleP=k=>setExpP(p=>({...p,[k]:!p[k]}));
  const maxP=pareto.length?Math.abs(pareto[0].total):1;
  const sel={padding:"5px 10px",borderRadius:6,border:"1px solid #D0D5E8",fontSize:11,fontFamily:"inherit",background:"#fff",cursor:"pointer",color:"#1a1a2e"};
  const th={fontSize:9,color:"#8A90A8",fontWeight:400,padding:"5px 6px",borderBottom:"1px solid #E4E8F2",whiteSpace:"nowrap"};
  const td={fontSize:10,padding:"5px 6px",borderBottom:"1px solid #f0f2fa"};
  const vc=v=>v<0?"#E24B4A":v>0?"#1D9E75":"#ccc";
  const renderLabel=({cx,cy,midAngle,innerRadius,outerRadius,percent,name})=>{if(percent<0.05)return null;const r=innerRadius+(outerRadius-innerRadius)*0.5;const x=cx+r*Math.cos(-midAngle*Math.PI/180);const y=cy+r*Math.sin(-midAngle*Math.PI/180);return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={500}>{`${(percent*100).toFixed(0)}%`}</text>};

  return(
    <div style={{fontFamily:"'DM Mono','Consolas',monospace",minHeight:"100vh"}}>
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #E4E8F2",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1D9E75"/><stop offset="100%" stopColor="#085041"/></linearGradient></defs><rect width="42" height="42" rx="10" fill="url(#lg)"/><text x="21" y="17" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="'Fraunces',serif" dominantBaseline="middle">SAYA</text><text x="21" y="29" textAnchor="middle" fill="#ffffff99" fontSize="7" fontWeight="400" dominantBaseline="middle">BIOLOGICS</text></svg>
          <div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,color:"#1a1a2e",letterSpacing:-0.5}}>Financial Intelligence</div><div style={{fontSize:9,color:"#8A90A8",letterSpacing:2,textTransform:"uppercase"}}>Rolling Forecast 2026 · Corte: {MO[cm-1]}</div></div>
        </div>
        <div className="no-print" style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <select value={cm} onChange={e=>setCm(+e.target.value)} style={sel}>{MO.map((m,i)=><option key={i} value={i+1}>{m} 2026</option>)}</select>
          <select value={mol} onChange={e=>setMol(e.target.value)} style={sel}><option value="Todas">Todas moléculas</option>{mols.map(m=><option key={m} value={m}>{m}</option>)}</select>
          <select value={area} onChange={e=>setArea(e.target.value)} style={sel}><option value="Todas">Todas áreas</option>{areas.map(a=><option key={a} value={a}>{a}</option>)}</select>
          <button onClick={()=>window.print()} style={{padding:"6px 14px",borderRadius:6,border:"none",fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:500,background:"#1a1a2e",color:"#fff"}}>📄 PDF</button>
        </div>
      </div>

      {/* LEGEND */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <span style={{fontSize:8,padding:"3px 8px",borderRadius:4,background:"#D4F0E6",color:"#085041"}}>● Reales ≤ {MO[cm-1]}</span>
        <span style={{fontSize:8,padding:"3px 8px",borderRadius:4,background:"#E6F1FB",color:"#185FA5"}}>● Forecast &gt; {MO[cm-1]}</span>
        <span style={{fontSize:8,padding:"3px 8px",borderRadius:4,background:"#EEEDFE",color:"#534AB7"}}>▶ Clic filas para drill-down</span>
      </div>

      {/* KPI CARDS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:8,marginBottom:16}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:"10px 12px",borderTop:`3px solid ${k.c}`}}>
            <div style={{fontSize:7,color:"#8A90A8",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{k.l}</div>
            <div style={{fontSize:18,fontWeight:500,color:k.v.startsWith("-")?"#E24B4A":"#1a1a2e",fontFamily:"'Fraunces',serif"}}>{k.v}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
              <span style={{fontSize:8,color:"#8A90A8"}}>{k.s}</span>
              {k.showPct&&<span style={{fontSize:8,fontWeight:500,color:k.pct>=0?"#E24B4A":"#1D9E75"}}>{k.pct>=0?"▲":"▼"} {P(Math.abs(k.pct))}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* P&L ANNUAL TABLE */}
      <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12,marginBottom:16,overflowX:"auto"}}>
        <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:8}}>P&L Anual — Rolling Forecast 2026</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
          <th style={{...th,textAlign:"left",position:"sticky",left:0,background:"#fff",minWidth:160}}>Línea P&L</th>
          {MO.map((m,i)=><th key={i} style={{...th,textAlign:"right",minWidth:64,color:i+1<=cm?"#085041":"#185FA5",background:i+1<=cm?"#f0faf6":"#f5f8fc"}}>{m}</th>)}
          <th style={{...th,textAlign:"right",fontWeight:500,color:"#1a1a2e",borderLeft:"2px solid #E4E8F2"}}>Total</th>
        </tr></thead>
        <tbody>{rows.map((row,idx)=>{
          const isFirst=idx===PLO.length;const k=row.line;const isE=exp[k];
          const hasDrill=Object.keys(row.dd).length>1||(Object.keys(row.dd).length===1&&!row.dd["—"]);
          return(<>
            {isFirst&&<tr key="sep"><td colSpan={14} style={{padding:"8px 6px 3px",fontSize:9,color:"#8A90A8",letterSpacing:1,textTransform:"uppercase",borderBottom:"1px solid #E4E8F2",fontWeight:500}}>OpEx — Gastos Reales</td></tr>}
            <tr key={idx} style={{background:row.isBold?"#fafbfe":"transparent",cursor:hasDrill?"pointer":"default"}} onClick={()=>hasDrill&&toggle(k)}>
              <td style={{...td,fontWeight:row.isBold?500:400,color:row.isO?"#534AB7":"#1a1a2e",position:"sticky",left:0,background:row.isBold?"#fafbfe":"#fff",fontSize:row.isO?9:10}}>
                {hasDrill&&<span style={{marginRight:4,fontSize:8}}>{isE?"▼":"▶"}</span>}{row.label}
              </td>
              {row.monthly.map((v,mi)=><td key={mi} style={{...td,textAlign:"right",color:v<0?"#E24B4A":v===0?"#ccc":"#1a1a2e",fontWeight:row.isBold?500:400,fontSize:row.isO?9:10}}>{v===0?"—":F(v)}</td>)}
              <td style={{...td,textAlign:"right",fontWeight:500,color:row.total<0?"#E24B4A":"#1a1a2e",borderLeft:"2px solid #E4E8F2"}}>{F(row.total)}</td>
            </tr>
            {isE&&Object.entries(row.dd).filter(([c])=>c!=="—").map(([cls,data])=>{
              const ck=`${k}|${cls}`;const ce=exp[ck];const ct=data.m.reduce((s,v)=>s+v,0);
              return(<>
                <tr key={ck} style={{background:"#fafcff",cursor:"pointer"}} onClick={e=>{e.stopPropagation();toggle(ck)}}>
                  <td style={{...td,paddingLeft:24,fontSize:9,color:"#185FA5",position:"sticky",left:0,background:"#fafcff"}}><span style={{fontSize:7,marginRight:3}}>{ce?"▼":"▶"}</span>{cls}</td>
                  {data.m.map((v,mi)=><td key={mi} style={{...td,textAlign:"right",fontSize:9,color:v<0?"#E24B4A":v===0?"#ddd":"#666"}}>{v===0?"":F(v)}</td>)}
                  <td style={{...td,textAlign:"right",fontSize:9,fontWeight:500,borderLeft:"2px solid #E4E8F2"}}>{F(ct)}</td>
                </tr>
                {ce&&Object.entries(data.items).map(([co,cd])=>{const cot=cd.m.reduce((s,v)=>s+v,0);return(
                  <tr key={`${ck}|${co}`} style={{background:"#f8f9fe"}}>
                    <td style={{...td,paddingLeft:44,fontSize:8,color:"#8A90A8",position:"sticky",left:0,background:"#f8f9fe"}} title={`Partner: ${cd.p}`}>{co.length>42?co.slice(0,42)+"…":co}</td>
                    {cd.m.map((v,mi)=><td key={mi} style={{...td,textAlign:"right",fontSize:8,color:v<0?"#E24B4A":v===0?"#eee":"#999"}}>{v===0?"":F(v)}</td>)}
                    <td style={{...td,textAlign:"right",fontSize:8,borderLeft:"2px solid #E4E8F2"}}>{F(cot)}</td>
                  </tr>
                )})}
              </>);
            })}
          </>);
        })}</tbody></table>
      </div>

      {/* YTD + CM TABLES */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[{t:`YTD ${MO[0]}–${MO[cm-1]} 2026`,rk:"rY",fk:"fY",vk:"vY",pk:"pY"},{t:`Mes — ${MO[cm-1]} 2026`,rk:"rC",fk:"fC",vk:"vC",pk:"pC"}].map((t,ti)=>(
          <div key={ti} style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12,overflowX:"auto"}}>
            <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:8}}>{t.t}</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Línea","Reales","Forecast","Var $","Var %"].map(h=><th key={h} style={{...th,textAlign:h==="Línea"?"left":"right"}}>{h}</th>)}</tr></thead>
            <tbody>{comp.map((r,i)=><tr key={i} style={{background:BL.has(r.l)?"#fafbfe":"transparent"}}>
              <td style={{...td,fontWeight:BL.has(r.l)?500:400}}>{r.l==="TOTAL OPERATING  EXPENSES"?"Total OpEx":r.l}</td>
              <td style={{...td,textAlign:"right",color:vc(r[t.rk])}}>{F(r[t.rk])}</td>
              <td style={{...td,textAlign:"right",color:r[t.fk]<0?"#E24B4A":"#185FA5"}}>{F(r[t.fk])}</td>
              <td style={{...td,textAlign:"right",color:vc(r[t.vk]),fontWeight:500}}>{F(r[t.vk])}</td>
              <td style={{...td,textAlign:"right"}}><span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:500,background:r[t.pk]<0?"#FCEBEB":r[t.pk]>0?"#D4F0E6":"#f0f2fa",color:vc(r[t.pk])}}>{P(r[t.pk])}</span></td>
            </tr>)}</tbody></table>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1: Revenue + Waterfall */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12}}>
          <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:2}}>Revenue vs OpEx Mensual</div>
          <div style={{fontSize:9,color:"#8A90A8",marginBottom:8}}>Barras: Sales + OpEx · Línea: EBITDA</div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={chartData} margin={{top:5,right:5,bottom:0,left:-15}}>
              <XAxis dataKey="name" tick={{fontSize:8,fill:"#8A90A8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:7,fill:"#8A90A8"}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(0)}K`:"0"}/>
              <Tooltip formatter={v=>`$${(v/1e3).toFixed(1)}K`} contentStyle={{fontSize:9,borderRadius:6}}/>
              <ReferenceLine y={0} stroke="#E4E8F2"/>
              <Bar dataKey="Sales" radius={[3,3,0,0]}>{chartData.map((e,i)=><Cell key={i} fill={e.cur?"#1D9E7566":"#1D9E7533"}/>)}</Bar>
              <Bar dataKey="OpEx" radius={[3,3,0,0]}>{chartData.map((e,i)=><Cell key={i} fill={e.cur?"#E24B4A55":"#E24B4A22"}/>)}</Bar>
              <Line type="monotone" dataKey="EBITDA" stroke="#534AB7" strokeWidth={2} dot={{r:2,fill:"#534AB7"}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12}}>
          <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:2}}>Cascada P&L — YTD</div>
          <div style={{fontSize:9,color:"#8A90A8",marginBottom:8}}>Net Sales → deducciones → EBIT</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={wf} margin={{top:5,right:5,bottom:0,left:-15}}>
              <XAxis dataKey="name" tick={{fontSize:7,fill:"#8A90A8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:7,fill:"#8A90A8"}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v<=-1e6?`-${(Math.abs(v)/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(0)}K`:"0"}/>
              <Tooltip formatter={v=>`$${(v/1e3).toFixed(1)}K`} contentStyle={{fontSize:9,borderRadius:6}}/>
              <ReferenceLine y={0} stroke="#E4E8F2"/>
              <Bar dataKey="start" stackId="a" fill="transparent"/>
              <Bar dataKey="end" stackId="a" radius={[3,3,0,0]}>{wf.map((e,i)=><Cell key={i} fill={e.isT?(e.total>=0?"#1D9E75":"#E24B4A"):(e.val>=0?"#1D9E7577":"#E24B4A77")}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS ROW 2: Pie YTD + Pie CM */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12}}>
          <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:2}}>Gasto Real por Molécula — YTD</div>
          <div style={{fontSize:9,color:"#8A90A8",marginBottom:4}}>{MO[0]}–{MO[cm-1]} 2026</div>
          <div style={{display:"flex",alignItems:"center"}}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart><Pie data={pieYTD} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderLabel} labelLine={false}>
                {pieYTD.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip formatter={v=>F(v)} contentStyle={{fontSize:9,borderRadius:6}}/></PieChart>
            </ResponsiveContainer>
            <div style={{width:"40%",fontSize:9}}>
              {pieYTD.map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
                <div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <span style={{color:"#1a1a2e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span>
                <span style={{marginLeft:"auto",color:"#8A90A8",flexShrink:0}}>{F(e.value)}</span>
              </div>)}
            </div>
          </div>
        </div>
        <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12}}>
          <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:2}}>Gasto Real por Molécula — {MO[cm-1]}</div>
          <div style={{fontSize:9,color:"#8A90A8",marginBottom:4}}>Mes corriente</div>
          {pieCM.length===0?<div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",color:"#8A90A8",fontSize:10}}>Sin gastos en {MO[cm-1]}</div>:
          <div style={{display:"flex",alignItems:"center"}}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart><Pie data={pieCM} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderLabel} labelLine={false}>
                {pieCM.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip formatter={v=>F(v)} contentStyle={{fontSize:9,borderRadius:6}}/></PieChart>
            </ResponsiveContainer>
            <div style={{width:"40%",fontSize:9}}>
              {pieCM.map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
                <div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <span style={{color:"#1a1a2e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span>
                <span style={{marginLeft:"auto",color:"#8A90A8",flexShrink:0}}>{F(e.value)}</span>
              </div>)}
            </div>
          </div>}
        </div>
      </div>

      {/* PARETO */}
      <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12}}>
        <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:2}}>Pareto por Partner — {MO[cm-1]} 2026</div>
        <div style={{fontSize:9,color:"#8A90A8",marginBottom:10}}>Mes corriente · Clic para desglose</div>
        {pareto.length===0&&<div style={{fontSize:10,color:"#8A90A8",padding:16,textAlign:"center"}}>Sin gastos con partner en {MO[cm-1]}</div>}
        {pareto.slice(0,15).map((p,i)=>{const w=maxP?Math.abs(p.total)/maxP*100:0;const isE=expP[p.partner];return(
          <div key={i} style={{marginBottom:isE?8:3}}>
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>toggleP(p.partner)}>
              <div style={{width:150,fontSize:9,color:"#1a1a2e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}} title={p.partner}><span style={{fontSize:7,marginRight:3}}>{isE?"▼":"▶"}</span>{p.partner.length>20?p.partner.slice(0,20)+"…":p.partner}</div>
              <div style={{flex:1,height:16,background:"#f0f2fa",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${w}%`,background:p.total<0?"#FCEBEB":"linear-gradient(90deg,#1D9E7544,#1D9E7522)",borderRadius:3,border:`1px solid ${p.total<0?"#E24B4A44":"#1D9E7544"}`}}/></div>
              <div style={{width:65,textAlign:"right",fontSize:9,fontWeight:500,color:p.total<0?"#E24B4A":"#1a1a2e",flexShrink:0}}>{F(p.total)}</div>
              <div style={{width:36,textAlign:"right",fontSize:8,color:"#8A90A8",flexShrink:0}}>{P(p.cumPct)}</div>
            </div>
            {isE&&<div style={{marginLeft:18,marginTop:3,borderLeft:"2px solid #E4E8F2",paddingLeft:8}}>{Object.entries(p.items).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).map(([co,val],j)=>(
              <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:8,color:"#666"}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"80%"}} title={co}>{co}</span><span style={{fontWeight:500,color:val<0?"#E24B4A":"#1a1a2e",flexShrink:0,marginLeft:8}}>{F(val)}</span></div>
            ))}</div>}
          </div>
        );})}
      </div>

      <div style={{textAlign:"center",fontSize:8,color:"#B0B6CC",padding:"12px 0",marginTop:8}}>Saya Biologics — Financial Intelligence · Rolling Forecast 2026</div>
    </div>
  );
}
