const embedQR = {
 engine: '', img: null, busy: false, status: (code) => { }, readraw: (uri) => { }, read: (uris) => { }, readwifi: null,
 lang: [ 'Invalid contents.', 'Failed to parse.', 'Failed to load QR-Reader.', 'Scan QR-Code', 'Loading QR-Reader...', 'Parsing...', 'Success!' ],
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
 parse: function(text) {
  let uris = text.split(/\r\n|\r|\n/);
  for (let i=0; i<uris.length; i++) {
   if (typeof this.readwifi === 'function' && uris[i].startsWith('WIFI:')) { try {
    this.readwifi(true, decodeURI(uris[i].match(/S:([^;]+);/)[1]).replace(/%3b|%3B/g, ';'), decodeURI((uris[i].match('T:nopass')) ? '' : uris[i].match(/P:([^;]+);/)[1]).replace(/%3b|%3B/g, ';'));
   } catch (ex) { this.readwifi(false, '', ''); } finally { uris.splice(i, 1); i--; } }
  }
  if (uris.length) { this.read(uris); }
 }
};
export default embedQR;