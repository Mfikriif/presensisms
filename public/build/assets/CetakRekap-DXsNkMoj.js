import{j as a}from"./app-DeBNW46r.js";function w({rekapPresensi:o,rekapKeterlambatan:i,bulan:x,tahun:p}){const m=o.reduce((s,t)=>{const{kode_pegawai:e,nama_lengkap:r,tanggal_presensi:l,jam_in:n,jam_out:j,total_izin:g,total_sakit:N}=t;s[e]||(s[e]={kode_pegawai:e,nama_lengkap:r,total_izin:g,total_sakit:N,presensi:Array(31).fill({jam_in:"-",jam_out:"-"})});const y=new Date(l).getDate()-1;return s[e].presensi[y]={jam_in:n||"-",jam_out:j||"-"},s},{}),d=Object.values(m).map(s=>{const t=i[s.kode_pegawai];return{...s,total_presensi:t?t.total_presensi:0,jumlah_keterlambatan:t?t.jumlah_keterlambatan:0}}),c=[];for(let s=0;s<d.length;s+=5)c.push(d.slice(s,s+5));const h=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],b=s=>h[s-1];return a.jsxs("div",{className:"flex flex-col items-center bg-gray-100 py-10",children:[c.map((s,t)=>a.jsxs("div",{className:"bg-white shadow-lg p-4 page",style:{width:"297mm",height:"210mm",overflow:"hidden",pageBreakAfter:"always"},children:[a.jsxs("div",{className:"flex mb-4",children:[a.jsx("div",{className:"w-24 h-24 mr-2",children:a.jsx("img",{src:"/assets/img/login/sms.jpg",alt:"Logo",className:"w-full h-full object-contain"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h1",{className:"font-bold text-base",children:"REKAP PRESENSI PEGAWAI"}),a.jsxs("h1",{className:"font-bold text-base",children:["PERIODE ",b(x).toUpperCase()," ",p]}),a.jsx("h1",{className:"font-bold text-base",children:"PT. SIDOREJO MAKMUR SEJAHTERA"}),a.jsx("h1",{className:"text-xs text-slate-600 italic",children:"Jl. Raya Semarang - Demak Km. 13, Bandungrejo, Kec. Mranggen, Kabupaten Demak, Jawa Tengah 59567"})]})]}),a.jsxs("div",{children:[a.jsxs("table",{className:"table-auto border-collapse w-full text-xs mb-8",style:{pageBreakInside:"avoid"},children:[a.jsxs("thead",{children:[a.jsxs("tr",{className:"bg-gray-200 text-center",children:[a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"No"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"Nama Karyawan"}),a.jsx("th",{className:"border px-1 py-1",colSpan:15,children:"Tanggal"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TH"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TT"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TS"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TI"})]}),a.jsx("tr",{className:"bg-gray-200 text-center",children:Array.from({length:15},(e,r)=>a.jsx("th",{className:"border px-1 py-1",children:r+1},r+1))})]}),a.jsx("tbody",{children:s.map((e,r)=>a.jsxs("tr",{className:"text-center",children:[a.jsx("td",{className:"border px-1 py-1",children:r+1}),a.jsx("td",{className:"border px-1 py-1 text-left",children:e.nama_lengkap}),e.presensi.slice(0,15).map((l,n)=>a.jsxs("td",{className:"border px-1 py-1",children:[l.jam_in,a.jsx("br",{}),a.jsx("span",{className:"text-gray-600 text-xxs",children:l.jam_out})]},`in-${n}`)),a.jsx("td",{className:"border px-1 py-1",children:e.total_presensi}),a.jsx("td",{className:"border px-1 py-1",children:e.jumlah_keterlambatan}),a.jsx("td",{className:"border px-1 py-1",children:e.total_sakit==="1"?e.total_sakit:"-"}),a.jsx("td",{className:"border px-1 py-1",children:e.total_izin==="1"?e.total_izin:"-"})]},r))})]}),a.jsxs("table",{className:"table-auto border-collapse w-full text-xs",style:{pageBreakInside:"avoid"},children:[a.jsxs("thead",{children:[a.jsxs("tr",{className:"bg-gray-200 text-center",children:[a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"No"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"Nama Karyawan"}),a.jsx("th",{className:"border px-1 py-1",colSpan:16,children:"Tanggal"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TH"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TT"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TS"}),a.jsx("th",{className:"border px-1 py-1",rowSpan:"2",children:"TI"})]}),a.jsx("tr",{className:"bg-gray-200 text-center",children:Array.from({length:16},(e,r)=>a.jsx("th",{className:"border px-1 py-1",children:r+16},r+16))})]}),a.jsx("tbody",{children:s.map((e,r)=>a.jsxs("tr",{className:"text-center",children:[a.jsx("td",{className:"border px-1 py-1",children:r+1}),a.jsx("td",{className:"border px-1 py-1 text-left",children:e.nama_lengkap}),e.presensi.slice(15).map((l,n)=>a.jsxs("td",{className:"border px-1 py-1",children:[l.jam_in,a.jsx("br",{}),a.jsx("span",{className:"text-gray-600 text-xxs",children:l.jam_out})]},`out-${n+15}`)),a.jsx("td",{className:"border px-1 py-1",children:e.total_presensi}),a.jsx("td",{className:"border px-1 py-1",children:e.jumlah_keterlambatan}),a.jsx("td",{className:"border px-1 py-1",children:e.total_sakit==="1"?e.total_sakit:"-"}),a.jsx("td",{className:"border px-1 py-1",children:e.total_izin==="1"?e.total_izin:"-"})]},r))})]})]})]},t)),a.jsx("style",{children:`
                @media print {
                    .page {
                        
                        page-break-before: auto;
                        
                    }
                    .page:last-child {
                        page-break-after: auto;
                    }

                    .page-empty {
                        display: none;
                    }


                    table {
                        width: 100%;
                        max-width: 290mm;
                    }

                    th, td {
                        border: 1px solid #000;
                        page-break-inside: avoid;
                        page-break-before: auto;
                        padding: 2px;
                        border: 1px solid #000;
                        page-break-inside: avoid;

                    }

                    .content {
                        margin: 0;
                        padding: 0;
                        border: 0;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 5mm;
                    }
                }


                `})]})}export{w as default};
