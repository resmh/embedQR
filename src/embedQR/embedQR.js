const embedQR = {
 engine: '', img: null, busy: false, status: (code) => { }, readraw: (uri) => { }, read: (uris) => { }, readwifi: null,
 lang: [ '', '', '', '', '', '', '' ],
 exec: function(nimg = null) {
  if (this.busy) { return; }
  if (nimg != null) { this.img = nimg; }
  if (typeof this.engine === 'string') {
   this.status(4);
   const _engine = this.engine;
   this.engine = 0;
   import(_engine).then((result) => { this.engine = result.default; this.status(3); this.exec(); }).catch((ex) => { this.engine = _engine; this.status(2); });
  } else if (typeof this.engine === 'function' && this.img != null) {
   this.busy = true;
   this.status(5);
   this.engine(this.img).then((result) => { this.busy = false; this.img = null; this.status(6); this.readraw(result); this.parse(result); }).catch((ex) => { this.busy = false; this.img = null; this.status(1); });
  }
 },
 parse: function(text) { try {
  let uris = text.split(/\r\n|\n/);
  for (let i=0; i<uris.length; i++) {
   if (typeof this.readwifi === 'function' && uris[i].toUpperCase().startsWith('WIFI:')) {
    const wi = {}; let ma = [];
    wi.H = (uris[i].toUpperCase().match(/[:|;]H:TRUE/)) ? true : false;
    ma = uris[i].match(/[:|;]T:([^;]+);/);
    if (ma) { wi.T = ma[1]; uris[i] = uris[i].replace('\\;', '%3B').replace('\\\"', '%22'); }
    ma = uris[i].match(/[:|;]S:([^;]+);/); if (ma) { wi.S = decodeURIComponent(ma[1]); }
    ma = uris[i].match(/[:|;]K:([a-fA-F0-9\+=\/]+);/); if (ma) { wi.K = ma[1]; }
    ma = uris[i].match(/[:|;]R:([a-fA-F0-9]+);/); if (ma) { wi.R = ma[1]; }
    ma = uris[i].match(/[:|;]I:([^;]+);/); if (ma) { wi.I = decodeURIComponent(ma[1]); }
    ma = uris[i].match(/[:|;]P:([^;]+);/); if (ma) { wi.P = decodeURIComponent(ma[1]); }
    uris.splice(i, 1); i--; if (wi.S) { this.readwifi(wi); } else { this.readwifi(null); }
   }
  }
  if (uris.length) { this.read(uris); }
 } catch (ex) { this.status(0); } }
};
export default embedQR;
