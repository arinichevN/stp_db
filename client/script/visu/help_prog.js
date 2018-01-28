function HelpProg() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.initialized = false;
    this.content = null;
    this.bb = null;
    this.init = function () {
        this.container = cvis();
        this.content = c("img");
        s(this.content, "src", "client/image/help/prog.bmp");
        this.bb = new BackButton();
        a(this.container, [this.content, this.bb]);
        cla(this.bb,["f1", "help_b"]);
        this.initialized = true;
    };
    this.getName = function () {
        return trans.get(401);
    };
    this.updateStr = function () {
        this.bb.updateStr();
    };
    this.show = function () {
        clr(this.container,'hdn');
       document.title =vmenu_main.getName()+ ": "+vedit_prog.getName()+ ": "+this.getName();
    };
    this.hide = function () {
        cla(this.container,'hdn');
    };
}
var vhelp_prog= new HelpProg();
visu.push(vhelp_prog);