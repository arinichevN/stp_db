function MenuMain() {
    this.type = VISU_TYPE.MAIN;
    this.container = null;
    this.initialized = false;
    this.updated = false;
    this.b1 = null;
    this.b2 = null;
    this.b3 = null;
    this.b4 = null;
    this.bb = null;
    this.init = function () {
        try {
            this.container = cvis();
            this.b1 = new NavigationButton(vedit_prog);
            this.b2 = new NavigationButton(vedit_repeat);
            this.b3 = new NavigationButton(vedit_step);
            this.b4 = new NavigationButton(vhelp_main, "f_js/image/help.png");
            this.bb = new BackButton();
            cla([this.b1, this.b2, this.b3, this.b4, this.bb], ["h15m", "ug1", "f2"]);
            a(this.container, [this.b1, this.b2, this.b3, this.b4, this.bb]);
            this.initialized = true;
        } catch (e) {
            alert("menu_main: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(400);
        } catch (e) {
            alert("menu_main: getName: " + e.message);
        }
    };
    this.updateStr = function () {
        try {
            this.b1.updateStr();
            this.b2.updateStr();
            this.b3.updateStr();
            this.b4.updateStr();
            this.bb.updateStr();
        } catch (e) {
            alert("menu_main: updateStr: " + e.message);
        }
    };
    this.show = function () {
        try {
            if (!this.updated) {
                this.updated = true;
            }
            clr(this.container, 'hdn');
            document.title = trans.get(400);
        } catch (e) {
            alert("menu_main: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
        } catch (e) {
            alert("menu_main: hide: " + e.message);
        }
    };
}
var vmenu_main = new MenuMain();
visu.push(vmenu_main);
